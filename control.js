import { model } from './model.js';

let currentUser = null;

const navigateTo = (viewId, data = null) => {
    document.querySelectorAll('div[id$="-view"], div[id$="-page"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    
    if (viewId === 'student-profile-view') {
        const studentToView = data || currentUser;
        if (studentToView) {
            view.renderStudentProfileView(studentToView);
        }
    } else if (viewId === 'admin-view') {
        view.renderAdminView();
    } else if (viewId === 'registration-page') {
        if (currentUser.id === model.getAdmin().id) {
            view.showModal('ข้อผิดพลาด', 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            navigateTo('admin-view');
            return;
        }
        view.renderRegistrationPage(currentUser);
    } else if (viewId === 'grade-entry-view' && currentUser && currentUser.id === model.getAdmin().id) {
        view.renderGradeEntryView();
    }
};

const handleLogin = (e) => {
    e.preventDefault();
    const studentId = document.getElementById('student-id').value;
    const errorElement = document.getElementById('login-error');

    if (studentId === model.getAdmin().id) {
        currentUser = model.getAdmin();
        navigateTo('admin-view');
    } else {
        const student = model.getStudentById(studentId);
        if (student) {
            const birthDate = new Date(student.dob);
            const ageDiffMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDiffMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
            
            if (age >= 15) {
                currentUser = student;
                navigateTo('student-profile-view');
            } else {
                view.showModal('เข้าสู่ระบบไม่สำเร็จ', 'นักเรียนต้องมีอายุอย่างน้อย 15 ปี');
                errorElement.textContent = 'นักเรียนต้องมีอายุอย่างน้อย 15 ปี';
                errorElement.classList.remove('hidden');
            }
        } else {
            view.showModal('เข้าสู่ระบบไม่สำเร็จ', 'ไม่พบรหัสนักเรียน');
            errorElement.textContent = 'ไม่พบรหัสนักเรียน';
            errorElement.classList.remove('hidden');
        }
    }
};

const handleRegistration = (subjectId) => {
    const studentId = currentUser.id;
    const subject = model.getSubjectById(subjectId);
    if (subject.prerequisite) {
        const prereqGrade = model.getRegisteredSubjects(studentId).find(s => s.subjectId === subject.prerequisite)?.grade;
        if (!prereqGrade || ['D+', 'D', 'F'].includes(prereqGrade)) {
            view.showModal('ลงทะเบียนไม่สำเร็จ', 'ต้องมีเกรดผ่านในวิชาบังคับก่อนจึงจะลงทะเบียนได้');
            return;
        }
    }
    
    if (model.registerSubject(studentId, subjectId)) {
        view.showModal('ลงทะเบียนสำเร็จ', 'วิชาถูกเพิ่มในรายการของคุณแล้ว');
        navigateTo('student-profile-view');
    } else {
        view.showModal('ลงทะเบียนไม่สำเร็จ', 'คุณได้ลงทะเบียนวิชานี้ไปแล้ว');
    }
};

const handleGradeEntry = (e) => {
    e.preventDefault();
    const form = e.target;
    const subjectSelect = document.getElementById('subject-select');
    const subjectId = subjectSelect.value;
    const students = model.getUngradedStudentsForSubject(subjectId);

    let allGradesEntered = true;

    students.forEach(student => {
        const gradeInput = form.querySelector(`select[name="grade-${student.id}"]`);
        if (gradeInput) {
            const grade = gradeInput.value;
            if (grade) {
                model.updateGrade(student.id, subjectId, grade);
            } else {
                allGradesEntered = false;
            }
        }
    });

    if (allGradesEntered && students.length > 0) {
        view.showModal('บันทึกเกรดสำเร็จ', 'เกรดทั้งหมดได้ถูกบันทึกเรียบร้อยแล้ว');
        view.renderGradeEntryView(subjectId);
    } else {
        view.showModal('บันทึกเกรดไม่สำเร็จ', 'กรุณากรอกเกรดให้ครบถ้วน');
    }
};

const logout = () => {
    currentUser = null;
    navigateTo('login-view');
};

const view = {
    showModal: (title, message) => {
        const modal = document.getElementById('modal-backdrop');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        modal.classList.remove('hidden');

        document.getElementById('modal-ok-btn').onclick = () => {
            modal.classList.add('hidden');
        };
    },
    renderAdminView: () => {
        const students = model.getStudents();
        const studentListBody = document.getElementById('student-list-body');
        const schoolFilter = document.getElementById('school-filter');
        const searchInput = document.getElementById('search-input');
        const sortBy = document.getElementById('sort-by');
        
        const allSchools = [...new Set(students.map(s => s.school))];
        schoolFilter.innerHTML = '<option value="">กรองตามโรงเรียน</option>' + allSchools.map(s => `<option value="${s}">${s}</option>`).join('');

        const renderStudents = () => {
            let filteredStudents = students;
            const searchTerm = searchInput.value.toLowerCase();
            const filterSchool = schoolFilter.value;
            const sortOption = sortBy.value;

            if (searchTerm) {
                filteredStudents = filteredStudents.filter(s => s.name.toLowerCase().includes(searchTerm) || s.surname.toLowerCase().includes(searchTerm));
            }
            if (filterSchool) {
                filteredStudents = filteredStudents.filter(s => s.school === filterSchool);
            }

            if (sortOption === 'name') {
                filteredStudents.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname));
            } else if (sortOption === 'age') {
                filteredStudents.sort((a, b) => {
                    const ageA = new Date().getFullYear() - new Date(a.dob).getFullYear();
                    const ageB = new Date().getFullYear() - new Date(b.dob).getFullYear();
                    return ageA - ageB;
                });
            }

            studentListBody.innerHTML = filteredStudents.map(student => `
                <tr class="hover:bg-gray-50 cursor-pointer" onclick="app.view.renderStudentDetailForAdmin('${student.id}')">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.prefix} ${student.name} ${student.surname}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.school}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date().getFullYear() - new Date(student.dob).getFullYear()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900">ดูโปรไฟล์</a>
                    </td>
                </tr>
            `).join('');
        };

        searchInput.addEventListener('input', renderStudents);
        schoolFilter.addEventListener('change', renderStudents);
        sortBy.addEventListener('change', renderStudents);
        
        renderStudents();
    },
    renderStudentDetailForAdmin: (studentId) => {
        const studentToView = model.getStudentById(studentId);
        navigateTo('student-profile-view', studentToView);
    },
    renderStudentProfileView: (student) => {
        const studentDetails = document.getElementById('student-details');
        const registeredSubjectsList = document.getElementById('registered-subjects-list');
        const profileActions = document.getElementById('profile-actions');
        const registeredSubjects = model.getRegisteredSubjects(student.id);
        
        const isAdmin = currentUser && currentUser.id === model.getAdmin().id;
        
        const curriculumData = model.getCurriculumById(student.curriculumId);
        const curriculumName = curriculumData.length > 0 ? curriculumData[0].curriculumName : 'ไม่พบข้อมูล';

        studentDetails.innerHTML = `
            <p><strong>รหัสนักเรียน:</strong> ${student.id}</p>
            <p><strong>ชื่อ-นามสกุล:</strong> ${student.prefix} ${student.name} ${student.surname}</p>
            <p><strong>วันเกิด:</strong> ${student.dob}</p>
            <p><strong>โรงเรียน:</strong> ${student.school}</p>
            <p><strong>อีเมล:</strong> ${student.email}</p>
            <p><strong>หลักสูตรที่ลงทะเบียน:</strong> ${curriculumName}</p>
        `;

        registeredSubjectsList.innerHTML = registeredSubjects.map(regSub => {
            const subject = model.getSubjectById(regSub.subjectId);
            return `
                <li>
                    <span class="font-medium">${subject.name} (${subject.id})</span>: 
                    <span class="font-bold text-gray-700">${regSub.grade ? `เกรด ${regSub.grade}` : 'รอเกรด'}</span>
                </li>
            `;
        }).join('') || '<li class="text-gray-500">ยังไม่มีรายวิชาที่ลงทะเบียน</li>';

        if (!isAdmin) {
            profileActions.innerHTML = `
                <button onclick="app.navigateTo('registration-page')" class="btn-primary py-2 px-4 rounded-md">ลงทะเบียนเรียน</button>
                <button onclick="app.logout()" class="btn-secondary py-2 px-4 rounded-md">ออกจากระบบ</button>
            `;
        } else {
            profileActions.innerHTML = `
                <button onclick="app.navigateTo('admin-view')" class="btn-secondary py-2 px-4 rounded-md">ย้อนกลับ</button>
                <button onclick="app.logout()" class="btn-secondary py-2 px-4 rounded-md">ออกจากระบบ</button>
            `;
        }
    },
    renderRegistrationPage: (student) => {
        const registrationForm = document.getElementById('registration-form');
        const curriculumSubjects = model.getCurriculumById(student.curriculumId);
        const registeredSubjects = model.getRegisteredSubjects(student.id).map(s => s.subjectId);
        
        const availableSubjects = curriculumSubjects
            .map(ss => model.getSubjectById(ss.subjectId))
            .filter(sub => !registeredSubjects.includes(sub.id));

        if (availableSubjects.length === 0) {
            registrationForm.innerHTML = '<p class="text-gray-500">ไม่มีรายวิชาให้ลงทะเบียนเพิ่มเติมในขณะนี้</p>';
            return;
        }

        registrationForm.innerHTML = availableSubjects.map(subject => `
            <div class="p-4 border border-gray-200 rounded-md">
                <p class="text-lg font-medium">${subject.name} (${subject.id})</p>
                <p class="text-sm text-gray-500">หน่วยกิต: ${subject.credits}, อาจารย์: ${subject.teacher}</p>
                ${subject.prerequisite ? `<p class="text-sm text-red-500 font-semibold">วิชาบังคับก่อน: ${model.getSubjectById(subject.prerequisite).name}</p>` : ''}
                <button onclick="app.handleRegistration('${subject.id}')" class="mt-2 btn-primary py-1 px-3 rounded-md text-sm">ลงทะเบียน</button>
            </div>
        `).join('');
    },
    renderGradeEntryView: (selectedSubjectId = '') => {
        const subjectSelect = document.getElementById('subject-select');
        const studentsListContainer = document.getElementById('grade-entry-students');
        const selectedSubjectName = document.getElementById('selected-subject-name');
        const registeredCount = document.getElementById('registered-count');
        const gradeEntryForm = document.getElementById('grade-entry-form');

        subjectSelect.innerHTML = '<option value="">-- เลือกรายวิชา --</option>';
        const allSubjects = model.getSubjects();
        allSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
        
        if (selectedSubjectId) {
            subjectSelect.value = selectedSubjectId;
        }

        subjectSelect.onchange = () => {
            const subjectId = subjectSelect.value;
            const registeredStudents = subjectId ? model.getRegisteredStudentsForSubject(subjectId) : [];
            const ungradedStudents = subjectId ? model.getUngradedStudentsForSubject(subjectId) : [];
            const subject = subjectId ? model.getSubjectById(subjectId) : null;
            
            selectedSubjectName.textContent = subject ? `รายชื่อนักเรียนสำหรับวิชา: ${subject.name}` : '';
            registeredCount.textContent = subject ? `นักเรียนที่ลงทะเบียน: ${registeredStudents.length} คน | นักเรียนที่รอเกรด: ${ungradedStudents.length} คน` : '';

            studentsListContainer.innerHTML = ungradedStudents.map(student => `
                <div class="flex items-center space-x-4 p-2 border-b">
                    <p class="flex-grow">${student.prefix} ${student.name} ${student.surname} (${student.id})</p>
                    <select name="grade-${student.id}" class="px-2 py-1 border rounded-md">
                        <option value="">เลือกเกรด</option>
                        ${model.getGradeOptions().map(grade => `<option value="${grade}">${grade}</option>`).join('')}
                    </select>
                </div>
            `).join('') || '<p class="text-gray-500">ไม่มีนักเรียนที่รอเกรดในวิชานี้</p>';
            
            gradeEntryForm.querySelector('button[type="submit"]').classList.toggle('hidden', ungradedStudents.length === 0);
        };

        if (selectedSubjectId) {
            subjectSelect.onchange();
        }

        gradeEntryForm.onsubmit = handleGradeEntry;
    },
};

window.app = {
    navigateTo,
    handleLogin,
    handleRegistration,
    handleGradeEntry,
    logout,
    view
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', app.handleLogin);
    document.getElementById('grade-entry-form').addEventListener('submit', app.handleGradeEntry);
    navigateTo('login-view');
});
