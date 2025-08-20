 // --- Mock Data ---
        const mockUsers = {
            'admin': { password: 'admin', role: 'admin' },
            'teacher': { password: 'teacher', role: 'teacher' }
        };

        const mockClasses = {
            'CS101': {
                name: 'Introduction to Computer Science',
                students: [
                    { id: 1, name: 'Alice Johnson' },
                    { id: 2, name: 'Bob Williams' },
                    { id: 3, name: 'Charlie Brown' },
                    { id: 4, name: 'Diana Miller' }
                ]
            },
            'ENG202': {
                name: 'English Literature',
                students: [
                    { id: 5, name: 'Eva Davis' },
                    { id: 6, name: 'Frank White' },
                    { id: 7, name: 'Grace Wilson' }
                ]
            }
        };

        // --- DOM Elements ---
        const loginView = document.getElementById('login-view');
        const teacherView = document.getElementById('teacher-view');
        const adminView = document.getElementById('admin-view');
        const loginForm = document.getElementById('login-form');
        const logoutButtonTeacher = document.getElementById('logout-button-teacher');
        const logoutButtonAdmin = document.getElementById('logout-button-admin');
        const classSelect = document.getElementById('class-select');
        const attendanceForm = document.getElementById('attendance-form');
        const studentList = document.getElementById('student-list');
        const addStudentForm = document.getElementById('add-student-form');
        const messageModal = document.getElementById('message-modal');
        const modalText = document.getElementById('modal-text');
        const modalCloseButton = document.getElementById('modal-close-button');

        // --- Functions ---

        /**
         * Displays a modal message to the user.
         * @param {string} message The text to display in the modal.
         */
        function showMessage(message) {
            modalText.textContent = message;
            messageModal.classList.remove('hidden');
        }

        /**
         * Hides all dashboard views and shows the login form.
         */
        function showLoginView() {
            loginView.classList.remove('hidden');
            teacherView.classList.add('hidden');
            adminView.classList.add('hidden');
        }

        /**
         * Hides the login form and shows the appropriate dashboard based on role.
         * @param {string} role The user's role ('admin' or 'teacher').
         */
        function showDashboard(role) {
            loginView.classList.add('hidden');
            if (role === 'teacher') {
                teacherView.classList.remove('hidden');
                adminView.classList.add('hidden');
                populateClassSelection();
            } else if (role === 'admin') {
                adminView.classList.remove('hidden');
                teacherView.classList.add('hidden');
            }
        }

        /**
         * Populates the class dropdown with mock class data.
         */
        function populateClassSelection() {
            // Clear existing options
            classSelect.innerHTML = '<option value="" disabled selected>Choose a class...</option>';
            // Add new options from mock data
            for (const classId in mockClasses) {
                const option = document.createElement('option');
                option.value = classId;
                option.textContent = mockClasses[classId].name;
                classSelect.appendChild(option);
            }
        }

        /**
         * Renders the student list for the selected class.
         * @param {string} classId The ID of the class to display students for.
         */
        function renderStudentList(classId) {
            studentList.innerHTML = ''; // Clear existing students
            const students = mockClasses[classId].students;

            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        <input type="checkbox" name="present" data-student-id="${student.id}" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    </td>
                `;
                studentList.appendChild(row);
            });
            attendanceForm.classList.remove('hidden');
        }

        // --- Event Listeners ---

        // Handle login form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            const loginMessage = document.getElementById('login-message');

            if (mockUsers[username] && mockUsers[username].password === password) {
                showDashboard(mockUsers[username].role);
                loginMessage.classList.add('hidden');
            } else {
                loginMessage.textContent = 'Invalid username or password.';
                loginMessage.classList.add('bg-red-100', 'text-red-700');
                loginMessage.classList.remove('hidden');
            }
        });

        // Handle logout buttons
        logoutButtonTeacher.addEventListener('click', showLoginView);
        logoutButtonAdmin.addEventListener('click', showLoginView);

        // Handle class selection change
        classSelect.addEventListener('change', (e) => {
            const selectedClassId = e.target.value;
            if (selectedClassId) {
                renderStudentList(selectedClassId);
            }
        });

        // Handle attendance form submission
        attendanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedClassId = classSelect.value;
            const students = mockClasses[selectedClassId].students;
            let attendanceRecords = [];

            students.forEach(student => {
                const checkbox = document.querySelector(`input[data-student-id="${student.id}"]`);
                attendanceRecords.push({
                    studentId: student.id,
                    status: checkbox.checked ? 'Present' : 'Absent',
                    date: new Date().toISOString().split('T')[0]
                });
            });

            // Here you would send 'attendanceRecords' to a backend API
            console.log('Submitted Attendance:', attendanceRecords);
            showMessage('Attendance submitted successfully!');
            attendanceForm.classList.add('hidden');
            classSelect.value = ''; // Reset the dropdown
        });

        // Handle add student form submission
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const studentName = e.target['student-name'].value;
            const studentClass = e.target['student-class'].value;

            // Here you would send this data to your backend
            console.log(`Adding new student: ${studentName} to class ${studentClass}`);
            showMessage(`New student "${studentName}" added successfully to class "${studentClass}".`);
            addStudentForm.reset();
        });

        // Handle modal close button
        modalCloseButton.addEventListener('click', () => {
            messageModal.classList.add('hidden');
        });