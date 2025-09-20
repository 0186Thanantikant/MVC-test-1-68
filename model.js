const mockDatabase = {
    students: [
        { id: '69000001', prefix: 'นาย', name: 'มานะ', surname: 'รักเรียน', dob: '2008-01-15', school: 'โรงเรียนก้าวหน้า', email: 'mana@example.com', curriculumId: '10101010' },
        { id: '69000002', prefix: 'นางสาว', name: 'มานี', surname: 'รักดี', dob: '2007-03-20', school: 'โรงเรียนก้าวหน้า', email: 'manee@example.com', curriculumId: '10101011' },
        { id: '69000003', prefix: 'นาย', name: 'ชูใจ', surname: 'ใฝ่ฝัน', dob: '2008-05-10', school: 'โรงเรียนอนาคต', email: 'choojai@example.com', curriculumId: '10101010' },
        { id: '69000004', prefix: 'นางสาว', name: 'เพชร', surname: 'สดใส', dob: '2007-08-01', school: 'โรงเรียนอนาคต', email: 'petch@example.com', curriculumId: '10101011' },
        { id: '69000005', prefix: 'นาย', name: 'กล้า', surname: 'หาญ', dob: '2008-09-25', school: 'โรงเรียนวิทยา', email: 'kla@example.com', curriculumId: '10101010' },
        { id: '69000006', prefix: 'นางสาว', name: 'แก้ว', surname: 'ใจดี', dob: '2007-06-12', school: 'โรงเรียนวิทยา', email: 'kaew@example.com', curriculumId: '10101011' },
        { id: '69000007', prefix: 'นาย', name: 'เอก', surname: 'เก่งกาจ', dob: '2008-02-28', school: 'โรงเรียนก้าวหน้า', email: 'aek@example.com', curriculumId: '10101010' },
        { id: '69000008', prefix: 'นางสาว', name: 'รุ่ง', surname: 'อรุณ', dob: '2007-11-17', school: 'โรงเรียนอนาคต', email: 'rung@example.com', curriculumId: '10101011' },
        { id: '69000009', prefix: 'นาย', name: 'ธนา', surname: 'มั่งคั่ง', dob: '2008-04-03', school: 'โรงเรียนวิทยา', email: 'thana@example.com', curriculumId: '10101010' },
        { id: '69000010', prefix: 'นางสาว', name: 'ฟ้า', surname: 'ใส', dob: '2007-09-09', school: 'โรงเรียนก้าวหน้า', email: 'fah@example.com', curriculumId: '10101011' },
    ],
    admin: { id: 'admin123', name: 'แอดมิน' },
    subjects: [
        { id: '05500001', name: 'การเขียนโปรแกรมเบื้องต้น', credits: 3, teacher: 'ผศ.ดร.สมชาย ใจดี', prerequisite: null },
        { id: '05500002', name: 'โครงสร้างข้อมูล', credits: 3, teacher: 'อ.พรเพ็ญ สุขใจ', prerequisite: '05500001' },
        { id: '05500003', name: 'คณิตศาสตร์พื้นฐาน', credits: 3, teacher: 'รศ.ดร.วิชัย รุ่งเรือง', prerequisite: null },
        { id: '05500004', name: 'ฟิสิกส์สำหรับวิทยาการคอมพิวเตอร์', credits: 3, teacher: 'ผศ.ดร.วรวุฒิ คงทน', prerequisite: null },
        { id: '05500005', name: 'ระบบฐานข้อมูล', credits: 3, teacher: 'ผศ.ดร.พงษ์ศักดิ์ บุญมาก', prerequisite: '05500002' },
        { id: '05500006', name: 'เครือข่ายคอมพิวเตอร์', credits: 3, teacher: 'อ.ดวงพร งามดี', prerequisite: '05500001' },
        { id: '90690001', name: 'ภาษาอังกฤษเพื่อการสื่อสาร', credits: 3, teacher: 'รศ.นภา ฤทธิ์เดช', prerequisite: null },
        { id: '90690002', name: 'สังคมกับการพัฒนา', credits: 3, teacher: 'ผศ.สมศรี ศรีสุข', prerequisite: null },
        { id: '90690003', name: 'ศิลปะกับชีวิต', credits: 3, teacher: 'อ.พิชิตชัย ชัยชนะ', prerequisite: null },
        { id: '90690004', name: 'จริยธรรมในสังคมดิจิทัล', credits: 3, teacher: 'อ.อารีรัตน์ รุ่งโรจน์', prerequisite: null },
    ],
    subjectStructures: [
        { curriculumId: '10101010', curriculumName: 'หลักสูตรวิทยาศาสตร์', subjectId: '05500001' },
        { curriculumId: '10101010', curriculumName: 'หลักสูตรวิทยาศาสตร์', subjectId: '05500002' },
        { curriculumId: '10101010', curriculumName: 'หลักสูตรวิทยาศาสตร์', subjectId: '05500004' },
        { curriculumId: '10101010', curriculumName: 'หลักสูตรวิทยาศาสตร์', subjectId: '05500005' },
        { curriculumId: '10101010', curriculumName: 'หลักสูตรวิทยาศาสตร์', subjectId: '05500006' },
        { curriculumId: '10101011', curriculumName: 'หลักสูตรศิลป์คำนวณ', subjectId: '05500003' },
        { curriculumId: '10101011', curriculumName: 'หลักสูตรศิลป์คำนวณ', subjectId: '90690001' },
        { curriculumId: '10101011', curriculumName: 'หลักสูตรศิลป์คำนวณ', subjectId: '90690002' },
        { curriculumId: '10101011', curriculumName: 'หลักสูตรศิลป์คำนวณ', subjectId: '90690003' },
        { curriculumId: '10101011', curriculumName: 'หลักสูตรศิลป์คำนวณ', subjectId: '90690004' },
    ],
    registeredSubjects: [
        { studentId: '69000001', subjectId: '05500001', grade: 'A' },
        { studentId: '69000001', subjectId: '05500003', grade: 'B+' },
        { studentId: '69000003', subjectId: '90690001', grade: null },
        { studentId: '69000004', subjectId: '90690001', grade: null },
        { studentId: '69000005', subjectId: '05500001', grade: null },
        { studentId: '69000007', subjectId: '05500001', grade: null },
    ],
    gradeOptions: ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F']
};

export const model = {
    getStudents: () => mockDatabase.students,
    getAdmin: () => mockDatabase.admin,
    getStudentById: (id) => mockDatabase.students.find(s => s.id === id),
    getSubjects: () => mockDatabase.subjects,
    getSubjectById: (id) => mockDatabase.subjects.find(s => s.id === id),
    getCurriculumById: (id) => mockDatabase.subjectStructures.filter(s => s.curriculumId === id),
    getRegisteredSubjects: (studentId) => mockDatabase.registeredSubjects.filter(rs => rs.studentId === studentId),
    registerSubject: (studentId, subjectId) => {
        const isRegistered = mockDatabase.registeredSubjects.some(rs => rs.studentId === studentId && rs.subjectId === subjectId);
        if (!isRegistered) {
            mockDatabase.registeredSubjects.push({ studentId, subjectId, grade: null });
            return true;
        }
        return false;
    },
    updateGrade: (studentId, subjectId, grade) => {
        const regSubject = mockDatabase.registeredSubjects.find(rs => rs.studentId === studentId && rs.subjectId === subjectId);
        if (regSubject) {
            regSubject.grade = grade;
            return true;
        }
        return false;
    },
    getGradeOptions: () => mockDatabase.gradeOptions,
    getRegisteredStudentsForSubject: (subjectId) => {
        const studentIds = new Set(mockDatabase.registeredSubjects.filter(rs => rs.subjectId === subjectId).map(rs => rs.studentId));
        return mockDatabase.students.filter(s => studentIds.has(s.id));
    },
    getUngradedStudentsForSubject: (subjectId) => {
        const studentIds = new Set(mockDatabase.registeredSubjects.filter(rs => rs.subjectId === subjectId && rs.grade === null).map(rs => rs.studentId));
        return mockDatabase.students.filter(s => studentIds.has(s.id));
    }
};
