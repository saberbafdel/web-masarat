

        // const API = "http://192.168.8.196:8000/api";
        // const API = "http://192.168.1.164:8000/api";
        // const API = "http://192.168.154.204:8000/api";
        // const API = "http://localhost:3000";
        const API = "https://msaraty.ddns.net/api";

        let usersData = [];
        let stationsData = [];
        let routesData = [];
        let assignData = [];
        let studentsData = [];
        let universitiesData = [];
        let collegesData = [];
        let departmentsData = [];
        let levelsData = [];


        async function login() {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const error = document.getElementById('login-error');
            error.style.display = "none";
            if (!username || !password) {
                error.textContent = "أدخل اسم المستخدم وكلمة المرور";
                error.style.display = "block";
                return;
            }
            try {

                const response = await fetch(`${API}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',

                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });


                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('login-page').style.display = "none";
                    document.getElementById('main-wrapper').style.display = "block";


                    await fetchUsers();
                    showPage('sec-home');

                    console.log("تم تسجيل الدخول بنجاح");
                } else {

                    const errorData = await response.json();
                    error.textContent = errorData.message || "بيانات الدخول غير صحيحة";
                    error.style.display = "block";
                }

            } catch (err) {

                console.error("Login Error:", err);
                error.textContent = "تعذر الاتصال بالسيرفر، تأكد من تشغيل الـ Backend";
                error.style.display = "block";
            }
        }

        function logout() {
            location.reload();
        }


        function showPage(pageId) {

            document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));


            const target = document.getElementById(pageId);
            if (target) target.classList.add('active');


            document.querySelectorAll('.sidebar-item').forEach(btn => {
                btn.classList.remove('active-nav');


                const onClickAttr = btn.getAttribute('onclick');
                if (onClickAttr && onClickAttr.includes(pageId)) {
                    btn.classList.add('active-nav');
                }
            });
        }


        function openTripTab(tabId, btnElement) {

            const parent = document.getElementById('sec-trips');
            parent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));


            parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));


            document.getElementById(tabId).classList.add('active');
            btnElement.classList.add('active-tab');
        }


        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function showStationForm() {

            document.getElementById('st-name').value = '';
            document.getElementById('st-desc').value = '';
            document.getElementById('st-x').value = '';
            document.getElementById('st-y').value = '';
            document.getElementById('modal-station').style.display = 'flex';
        }

        function showRouteForm() {
            document.getElementById('rt-name').value = '';
            document.getElementById('modal-route').style.display = 'flex';
        }

        function showAssignForm() {

            const routeSelect = document.getElementById('assign-route-select');
            routeSelect.innerHTML = routesData.map(r => `<option value="${r.id}">${r.route_name}</option>`).join('');


            const container = document.getElementById('assign-stations-container');
            container.innerHTML = "";
            addStationSelectRow();

            document.getElementById('modal-assign').style.display = 'flex';
        }


        async function fetchAll() {
            await Promise.all([
                fetchUsers(),
                fetchStations(),
                fetchRoutes(),
                fetchAssign(),
                fetchStudents(),
                fetchUniversities(),
                fetchColleges(),
                fetchDepartments(),
                fetchLevels(),
                fetchDriversAndBuses(),
                // renderAcademicStructure(),
            ]);
        }

        async function fetchUsers() {
            const res = await fetch(`${API}/users`);
            usersData = await res.json();
            renderUsers();
            renderRequests();
            renderBlacklist();

        }

        async function fetchStations() {
            const res = await fetch(`${API}/stations`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            stationsData = await res.json();

            renderStations();
        }


        async function fetchRoutes() {
            const res = await fetch(`${API}/routes`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });
            routesData = await res.json();
            renderRoutes();
        }


        async function fetchAssign() {
            const res = await fetch(`${API}/assign`);
            assignData = await res.json();
            renderAssign();
        }
        async function fetchStudents() {
            const res = await fetch(`${API}/students`);
            studentsData = await res.json();
            renderStudents();
        }

        async function fetchUniversities() {
            const res = await fetch(`${API}/universities`);
            universitiesData = await res.json();
        }
        async function fetchColleges() {
            const res = await fetch(`${API}/colleges`);
            collegesData = await res.json();
        }
        async function fetchDepartments() {
            const res = await fetch(`${API}/departments`);
            departmentsData = await res.json();
        }
        async function fetchLevels() {
            const res = await fetch(`${API}/levels`);
            levelsData = await res.json();
        }


        function openUserTab(tabId, btnElement) {

            const parent = document.getElementById('sec-users');
            parent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));


            parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));

            document.getElementById(tabId).classList.add('active');
            btnElement.classList.add('active-tab');


            renderUsers();
        }
        function openStudentTab(tabId, btnElement) {

            const parent = document.getElementById('sec-students');

            parent.querySelectorAll('.tab-content')
                .forEach(content => content.classList.remove('active'));

            parent.querySelectorAll('.tab-btn')
                .forEach(btn => btn.classList.remove('active-tab'));

            document.getElementById(tabId).classList.add('active');
            btnElement.classList.add('active-tab');

            if (tabId === 'tab-students-data') {
                // refresh lookup data for select options
                fetchUniversities();
                fetchColleges();
                fetchDepartments();
                fetchLevels();
            }

            renderStudents();
            renderAcademicStructure();

        }
        function renderStudents() {
            const body = document.getElementById("students-table-body");
            if (!body) return;

            body.innerHTML = "";

            const searchQuery = document.getElementById("student-search-input").value.toLowerCase();
            const statusFilter = document.getElementById("student-status-filter").value;
            const genderFilter = document.getElementById("student-gender-filter").value;

            const filtered = studentsData.filter(student => {

                const associatedUser = usersData.find(u => u.id === student.user_id);


                if (associatedUser && (associatedUser.status === "pending" || associatedUser.status === "rejected" || associatedUser.status === "blocked")) {
                    return false;
                }


                const university = universitiesData.find(u => u.id === student.university_id)?.university_name || "";
                const college = collegesData.find(c => c.id === student.college_id)?.college_name || "";
                const department = departmentsData.find(d => d.id === student.department_id)?.department_name || "";
                const level = levelsData.find(l => l.id === student.level_id)?.level_name || "";

                const name = (student.name || "").toLowerCase();
                const universityNumber = (student.university_number || "").toLowerCase();
                const phone = (student.phone || "").toLowerCase();
                const city = (student.city || "").toLowerCase();

                const searchUniversity = university.toLowerCase();
                const searchCollege = college.toLowerCase();
                const searchDepartment = department.toLowerCase();
                const searchLevel = level.toLowerCase();

                const statusText = (student.state || "").toLowerCase();

                const matchesSearch =
                    name.includes(searchQuery) ||
                    universityNumber.includes(searchQuery) ||
                    phone.includes(searchQuery) ||
                    city.includes(searchQuery) ||
                    searchUniversity.includes(searchQuery) ||
                    searchCollege.includes(searchQuery) ||
                    searchDepartment.includes(searchQuery) ||
                    searchLevel.includes(searchQuery);

                const matchesStatus =
                    statusFilter === "all" ||
                    statusText === statusFilter;

                const matchesGender =
                    genderFilter === "all" ||
                    (genderFilter === "male" && student.gender === "ذكر") ||
                    (genderFilter === "female" && student.gender === "أنثى");

                return matchesSearch && matchesStatus && matchesGender;
            });

            filtered.forEach(student => {
                const university = universitiesData.find(u => u.id === student.university_id)?.university_name || "غير معروف";
                const pickupStation = stationsData.find(s => s.id === student.pickup_station_id)?.station_name || "غير معروف";
                const dropoffStation = stationsData.find(s => s.id === student.dropoff_station_id)?.station_name || "غير معروف";

                body.innerHTML += `
        <tr>
            <td>${student.id}</td>
            <td><strong>${student.name || ''}</strong></td>
            <td>${student.phone || ''}</td>
            <td>${student.city || ''}</td>
            
            <td>
                ${student.gender === 'ذكر'
                        ? '<span class="badge bg-primary">ذكر</span>'
                        : '<span class="badge bg-female">أنثى</span>'}
            </td>
                
            <td>
                ${student.state && student.state.toLowerCase() === 'active'
                        ? '<span class="badge bg-success">نشط</span>'
                        : '<span class="badge bg-danger">متوقف</span>'}
            </td>
                
            <td>${university}</td>
            <td>${pickupStation}</td>
            <td>${dropoffStation}</td>

            <td>
                <button class="btn-action view" onclick="viewStudentDetails(${student.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action edit" onclick="editStudent(${student.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action delete" onclick="deleteStudent(${student.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
            });
        }

        function viewStudentDetails(id) {

            console.log("عرض تفاصيل الطالب:", id);

            const student = studentsData.find(s => s.id == id);
            if (!student) return;

            const user = usersData.find(u => u.id == student.user_id);

            const university =
                universitiesData.find(u => u.id == student.university_id)?.university_name || "غير معروف";

            const college =
                collegesData.find(c => c.id == student.college_id)?.college_name || "غير معروف";

            const department =
                departmentsData.find(d => d.id == student.department_id)?.department_name || "غير معروف";

            const level =
                levelsData.find(l => l.id == student.level_id)?.level_name || "غير معروف";

            const pickupStation =
                stationsData.find(s => s.id == student.pickup_station_id)?.station_name || "غير معروف";

            const dropoffStation =
                stationsData.find(s => s.id == student.dropoff_station_id)?.station_name || "غير معروف";


            const daysMap = {
                1: "السبت",
                2: "الأحد",
                3: "الإثنين",
                4: "الثلاثاء",
                5: "الأربعاء",
                6: "الخميس"
            };

            const days = (student.days || [])
                .map(d => daysMap[d])
                .join(" - ") || "لا توجد أيام";


            const modal = document.createElement("div");
            modal.className = "student-details-overlay";

            modal.innerHTML = `
        <div class="student-details-card">

            <div class="details-header">
                <h3>${student.name}</h3>
                <button onclick="this.closest('.student-details-overlay').remove()">
                    ✖
                </button>
            </div>

            <div class="details-grid">

                <div><strong>ID</strong><p>${student.id}</p></div>

                <div><strong>الرقم الجامعي</strong><p>${student.university_number}</p></div>

                <div><strong>رقم الهاتف</strong><p>${student.phone}</p></div>

                <div><strong>المدينة</strong><p>${student.city}</p></div>

                <div><strong>الجنس</strong><p>${student.gender}</p></div>

                <div><strong>الحالة</strong>
                <p>${student.state === "active" ? "نشط" : "متوقف"}</p></div>

                <div><strong>اسم المستخدم</strong><p>${user?.username || "غير مرتبط"}</p></div>

                <div><strong>الجامعة</strong><p>${university}</p></div>

                <div><strong>الكلية</strong><p>${college}</p></div>

                <div><strong>القسم</strong><p>${department}</p></div>

                <div><strong>المستوى</strong><p>${level}</p></div>

                <div><strong>محطة الركوب</strong><p>${pickupStation}</p></div>

                <div><strong>محطة النزول</strong><p>${dropoffStation}</p></div>

                <div class="full">
                    <strong>أيام الدوام</strong>
                    <p>${days}</p>
                </div>

            </div>

        </div>
    `;

            document.body.appendChild(modal);
        }

        function closeStudentDetails() {
            const container = document.getElementById("studentDetailsContainer");
            if (container) {
                container.innerHTML = "";
                container.style.display = "none";
            }
        }




        function renderUsers() {
            const body = document.getElementById("users-table-body");
            const searchQuery = document.getElementById("search-input").value.toLowerCase();
            const roleFilter = document.getElementById("filter-role").value;

            if (!body) return;
            body.innerHTML = "";

            const filteredUsers = usersData.filter(u => {
                const matchesSearch = u.username.toLowerCase().includes(searchQuery);
                const matchesRole = (roleFilter === 'all') || (u.role_id.toString() === roleFilter);
                const isActiveOnly = u.status === 'approved';
                return matchesSearch && matchesRole && isActiveOnly;
            });

            filteredUsers.forEach(u => {
                body.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td><strong>${u.username}</strong></td>
            <td>${getRoleName(u.role_id)}</td>
            <td>${getStatusBadge(u.status)}</td>
            <td>
                <button class="btn-action view" onclick="viewUserDetails(${u.id})" title="عرض"><i class="bi bi-eye"></i></button>
                ${u.status !== 'rejected' ? `<button class="btn-action block" onclick="updateUserStatus(${u.id}, 'rejected')" title="حظر"><i class="bi bi-slash-circle"></i></button>` : ''}
                <button class="btn-action delete" onclick="deleteUser(${u.id})" title="حذف"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
            });

            updateRequestCount();
        }


        function renderRequests() {
            const body = document.getElementById("requests-table-body");
            if (!body) return;
            body.innerHTML = "";

            const requests = usersData.filter(u => u.status === 'pending');

            requests.forEach(u => {
                body.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.username}</td>
            <td>${getRoleName(u.role_id)}</td>
            <td>${u.created_at || 'غير محدد'}</td>
            <td><span class="badge bg-warning text-dark btn-warring">قيد الانتظار</span></td>
            <td>
                <button class="btn-action view" onclick="viewUserDetails(${u.id})" title="عرض"><i class="bi bi-eye"></i></button>
                <button class="btn-action approve" onclick="updateUserStatus(${u.id}, 'approved')" title="قبول"><i class="bi bi-check-circle-fill"></i></button>
                <button class="btn-action delete" onclick="deleteUser(${u.id})" title="رفض"><i class="bi bi-x-circle-fill"></i></button>
            </td>
        </tr>`;
            });
        }


        function renderBlacklist() {
            const body = document.getElementById("blacklist-table-body");
            if (!body) return;
            body.innerHTML = "";

            const blocked = usersData.filter(u => u.status === 'rejected');

            blocked.forEach(u => {
                body.innerHTML += `
        <tr ">
            <td>${u.id}</td>
            <td>${u.username}</td>
            <td>${getRoleName(u.role_id)}</td>
            <td><span class="badge bg-danger">محظور</span></td>
            <td>
                <button class="btn-action view" onclick="viewUserDetails(${u.id})" title="عرض"><i class="bi bi-eye"></i></button>
                <button class="btn-action approve" onclick="updateUserStatus(${u.id}, 'approved')" title="فك الحظر"><i class="bi bi-arrow-counterclockwise"></i></button>
                <button class="btn-action delete" onclick="deleteUser(${u.id})" title="حذف نهائي"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
            });
        }


        async function addAdmin() {
            const username = document.getElementById('new-admin').value.trim();
            const password = document.getElementById('new-password').value.trim();

            if (!username || !password) return alert("الرجاء إكمال البيانات");

            const newAdmin = {
                username,
                password,
                role_id: 3,
                status: "pending",
                created_at: new Date().toLocaleDateString()
            };

            try {
                await fetch(`${API}/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(newAdmin)
                });
                alert("تم إضافة المشرف بنجاح");
                document.getElementById('new-admin').value = "";
                document.getElementById('new-password').value = "";
                await fetchUsers();
                openUserTab('tab-users-list', document.querySelector('[onclick*="tab-users-list"]'));
            } catch (e) { alert("خطأ في السيرفر"); }
        }




        function getRoleName(id) {
            switch (id.toString()) {
                case '3': return '<i class="bi bi-shield-lock text-primary"></i> مشرف';
                case '2': return '<i class="bi bi-truck text-success"></i> سائق';
                case '1': return '<i class="bi bi-mortarboard text-secondary"></i> طالب';
                default: return 'مستخدم';
            }
        }

        function getStatusBadge(status) {
            switch (status) {
                case 'approved': return '<span class="badge bg-success">نشط</span>';
                case 'pending': return '<span class="badge bg-warning text-dark">قيد الانتظار</span>';
                case 'rejected': return '<span class="badge bg-danger">محظور</span>';
                default: return status;
            }
        }


        function updateRequestCount() {
            const count = usersData.filter(u => u.status === 'pending').length;
            const btn = document.getElementById('users-requests-conut');
            if (count > 0) {
                btn.innerHTML = `الطلبات <span class="badge bg-danger ms-1 mypt">${count}</span>`;
            } else {
                btn.innerHTML = `الطلبات`;
            }
        }


        async function updateUserStatus(id, newStatus) {
            if (!confirm("هل أنت متأكد من هذا الإجراء؟")) return;
            try {
                await fetch(`${API}/users/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus })
                });
                await fetchUsers();
                renderRequests();
                renderBlacklist();
                renderUsers();
                renderStudents();
                renderDriversAndBuses();
            } catch (e) { alert("خطأ في التحديث"); }
        }





        function viewUserDetails(id) {

            console.log("عرض تفاصيل المستخدم:", id);

            const user = usersData.find(u => u.id == id);
            if (!user) return;

            const student = studentsData.find(s => s.user_id == user.id);
            const driver = driversData.find(d => d.user_id == user.id);
            const bus = driver ? busesData.find(b => b.driver_id == driver.id) : null;

            const roleName = getRoleName(user.role_id);

            let extraDetails = "";

            if (student) {

                const university =
                    universitiesData.find(u => u.id == student.university_id)?.university_name || "غير معروف";

                const college =
                    collegesData.find(c => c.id == student.college_id)?.college_name || "غير معروف";

                const department =
                    departmentsData.find(d => d.id == student.department_id)?.department_name || "غير معروف";

                const level =
                    levelsData.find(l => l.id == student.level_id)?.level_name || "غير معروف";

                const pickupStation =
                    stationsData.find(s => s.id == student.pickup_station_id)?.station_name || "غير معروف";

                const dropoffStation =
                    stationsData.find(s => s.id == student.dropoff_station_id)?.station_name || "غير معروف";

                const daysMap = {
                    1: "السبت",
                    2: "الأحد",
                    3: "الإثنين",
                    4: "الثلاثاء",
                    5: "الأربعاء",
                    6: "الخميس"
                };

                const days = (student.days || [])
                    .map(d => daysMap[d])
                    .join(" - ") || "لا توجد أيام";


                extraDetails = `
        <div class="details-section-title">بيانات الطالب</div>

        <div class="details-grid">
            <div><strong>اسم المستخدم</strong><p>${user.username}</p></div>

            <div><strong>الاسم</strong><p>${student.name}</p></div>

            <div><strong>الرقم الجامعي</strong><p>${student.university_number}</p></div>

            <div><strong>رقم الهاتف</strong><p>${student.phone}</p></div>

            <div><strong>المدينة</strong><p>${student.city}</p></div>

            <div><strong>الجنس</strong><p>${student.gender}</p></div>

            <div><strong>الجامعة</strong><p>${university}</p></div>

            <div><strong>الكلية</strong><p>${college}</p></div>

            <div><strong>القسم</strong><p>${department}</p></div>

            <div><strong>المستوى</strong><p>${level}</p></div>

            <div><strong>محطة الركوب</strong><p>${pickupStation}</p></div>

            <div><strong>محطة النزول</strong><p>${dropoffStation}</p></div>

            <div class="full">
                <strong>أيام الدوام</strong>
                <p>${days}</p>
            </div>

        </div>
    `;
            }



            if (driver) {

                extraDetails = `
        <div class="details-section-title">بيانات السائق</div>

        <div class="details-grid">

            <div><strong>اسم السائق</strong><p>${driver.name_driver}</p></div>
            <div><strong>رقم الهاتف</strong><p>${driver.phone}</p></div>
            <div><strong>الحالة</strong><p>${driver.state === "active" ? "نشط" : "متوقف"}</p></div>

            <div><strong>عدد الركاب</strong><p>${bus?.number_passengers || "-"}</p></div>
            <div><strong>نوع الوقود</strong><p>${bus?.type_fuel || "-"}</p></div>

        </div>
        `;
            }



            const modal = document.createElement("div");
            modal.className = "student-details-overlay";

            modal.innerHTML = `
        <div class="student-details-card">

            <div class="details-header">
                <h3>${user.username}</h3>
                <button onclick="this.closest('.student-details-overlay').remove()">✖</button>
            </div>

            <div class="details-section-title">بيانات الحساب</div>

            <div class="details-grid">

                <div><strong>الدور</strong><p>${roleName}</p></div>
                <div><strong>حالة الحساب</strong>
                <p>${user.status === 'approved' ? 'نشط' : user.status}</p></div>

                

            </div>

            ${extraDetails}
        </div>
    `;
            //<div><strong>Role ID</strong><p>${user.role_id}</p></div>
            //<div><strong>ID المستخدم</strong><p>${user.id}</p></div>
            // <div><strong>ID السائق</strong><p>${driver.id}</p></div>
            // <div><strong>ID الباص</strong><p>${bus?.id || "-"}</p></div>
            //<div><strong>الدور</strong><p>${roleName}</p></div>
            // <div><strong>اسم المستخدم</strong><p>${user.username}</p></div>
            //<div class="full">
            // <strong>تاريخ الإنشاء</strong>
            // <p>${user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</p>
            // </div>

            document.body.appendChild(modal);
        }

        function closeUserDetails() {
            const container = document.getElementById('userDetailsContainer');
            container.innerHTML = "";
            container.style.display = 'none';
        }


        async function deleteUser(userId) {

            const user = usersData.find(u => u.id == userId);
            if (!user) return alert("المستخدم غير موجود!");


            const isStudent = (user.role_id == 3);
            const confirmMsg = isStudent
                ? "⚠️ هذا الحساب يعود لطالب، حذفه سيؤدي لحذف بياناته الأكاديمية تماماً. هل أنت متأكد؟"
                : "هل أنت متأكد من حذف هذا المستخدم؟";

            if (!confirm(confirmMsg)) return;

            try {

                const userResponse = await fetch(`${API}/users/${userId}`, { method: 'DELETE' });

                if (userResponse.ok) {


                    if (isStudent) {
                        const student = studentsData.find(s => s.user_id == userId);
                        if (student) {
                            await fetch(`${API}/students/${student.id}`, { method: 'DELETE' });
                            console.log(`تم حذف بيانات الطالب الأكاديمية (ID: ${student.id})`);
                        }
                    }

                    alert("تم حذف المستخدم وكافة بياناته المرتبطة بنجاح.");


                    await refreshAllData();
                    renderUsersTable();
                } else {
                    alert("فشل حذف المستخدم من السيرفر.");
                }
            } catch (error) {
                console.error("Error during deletion:", error);
                alert("حدث خطأ في الاتصال بالسيرفر أثناء عملية الحذف.");
            }
        }




        async function refreshAllData() {
            const [uRes, sRes] = await Promise.all([
                fetch(`${API}/users`),
                fetch(`${API}/students`)
            ]);
            usersData = await uRes.json();
            studentsData = await sRes.json();
            renderUsers();
            renderRequests();
            renderBlacklist();


        }
        fetchAll();

        function renderStations() {
            const body = document.getElementById("stations-table");
            if (!body) return;

            let html = "";

            stationsData.forEach(s => {
                // حساب عدد الطلاب في هذه المحطة
                // نتحقق مما إذا كانت المحطة هي محطة ركوب (pickup) أو محطة نزول (dropoff) للطالب
                const studentCount = studentsData.filter(student =>
                    student.pickup_station_id === s.id || student.dropoff_station_id === s.id
                ).length;

                html += `
        <tr>
            <td>${s.id}</td>
            <td><strong>${s.station_name}</strong></td>
            <td>${s.description || 'لا يوجد وصف'}</td>
            <td>${s.location_x}</td>
            <td>${s.location_y}</td>
            <td>
                <span class="badge bg-info text-dark">
                    <i class="bi bi-people-fill"></i> ${studentCount} طالب
                </span>
            </td>
            <td>
                <button class="btn-action edit" onclick="editStation(${s.id})" title="تعديل">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn-action delete" onclick="deleteStation(${s.id})" title="حذف">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
            });

            body.innerHTML = html;
        }



        function renderRoutes() {
            const body = document.getElementById("routes-table");
            if (!body) return;
            body.innerHTML = "";

            routesData.forEach(r => {
                body.innerHTML += `
        <tr>
            <td>${r.id}</td>
            <td>${r.route_name}</td>
            <td>
                <button class="btn-action edit" onclick="editRoute(${r.id})" title="تعديل"><i class="bi bi-pencil-square"></i></button>
                <button class="btn-action delete" onclick="deleteRoute(${r.id})" title="حذف"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
            });
        }


        function renderAssign() {
            const body = document.getElementById("assign-table");
            if (!body) return;
            body.innerHTML = "";


            const validAssigns = assignData.filter(a => a.stations && a.stations.length > 0);


            if (validAssigns.length === 0) {
                body.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #6c757d;">لا توجد مسارات مرتبطة بمحطات حتى الآن.</td></tr>`;
                return;
            }


            validAssigns.forEach(a => {
                const route = routesData.find(r => r.id == a.route_id);
                const routeName = route ? (route.route_name || route.name || "غير معروف") : "غير معروف";

                const stationNames = a.stations.map(sid => {
                    const s = stationsData.find(st => st.id == sid);
                    return s ? s.station_name : `(محطة ${sid} غير موجودة)`;
                }).join(' <i class="bi bi-arrow-left text-muted mx-1"></i> ');

                body.innerHTML += `
        <tr>
            <td class="fw-bold text-primary">${routeName}</td>
            <td>${stationNames}</td>
            <td>
                <button class="btn-action view" onclick="viewAssignDetails(${a.id})" title="عرض التفاصيل"><i class="bi bi-eye"></i></button>
                <button class="btn-action edit" onclick="editAssign(${a.id})" title="تعديل"><i class="bi bi-pencil-square"></i></button>
                <button class="btn-action delete" onclick="deleteAssign(${a.id})" title="حذف"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
            });
        }

        function viewAssignDetails(id) {
            const assign = assignData.find(a => a.id == id);
            if (!assign) return;

            const route = routesData.find(r => r.id == assign.route_id);


            document.getElementById('view-route-name').innerText = route ? route.route_name : "غير معروف";
            document.getElementById('view-route-id').innerText = `${assign.id}`;

            const timelineContainer = document.getElementById('timeline-container');
            timelineContainer.innerHTML = "";

            assign.stations.forEach((sid, index) => {
                const station = stationsData.find(st => st.id == sid);
                const isLast = index === assign.stations.length - 1;

                const item = document.createElement('div');
                item.className = "timeline-item";
                item.innerHTML = `
            <div class="timeline-dot-wrapper">
                <div class="timeline-dot ${index === 0 ? 'start' : (isLast ? 'end' : '')}"></div>
                ${!isLast ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content">
                <div class="station-card-mini">
                    <span class="station-order">${index + 1}</span>
                    <div class="station-text">
                        <strong>${station ? station.station_name : `محطة غير موجودة (${sid})`}</strong>
                        <p class="mb-0 small text-muted">${station ? station.description : 'لا يوجد وصف متاح'}</p>
                    </div>
                    <i class="bi bi-geo-alt text-success ms-auto"></i>
                </div>
            </div>
        `;
                timelineContainer.appendChild(item);
            });
            document.getElementById('modal-view-details').style.display = 'flex';

        }
        async function editAssign(id) {
            console.log(stationsData)
            const assign = assignData.find(a => a.id == id);
            if (!assign) return alert("التعيين غير موجود");

            const container = document.getElementById('assign-stations-container');
            container.innerHTML = "";


            const routeSelect = document.getElementById('assign-route-select');
            routeSelect.innerHTML = routesData.map(r =>
                `<option value="${r.id}" ${r.id == assign.route_id ? 'selected' : ''}>${r.route_name}</option>`
            ).join('');

            assign.stations.forEach(stationId => {
                addStationSelectRow();
                const allSelects = container.querySelectorAll('.station-id-select');
                const lastSelect = allSelects[allSelects.length - 1];
                lastSelect.value = stationId;
            });

            const modalFooter = document.querySelector('#modal-assign .modal-actions');
            modalFooter.innerHTML = `
        <button onclick="updateAssign(${id})" class="btn-save" style="background-color: #ffc107; color: #000;">
            <i class="bi bi-pencil-square"></i> تأكيد التعديل
        </button>
        <button onclick="closeAssignModal()" class="btn-cancel">إلغاء</button>
    `;

            document.getElementById('modal-assign').style.display = 'flex';
        }
        async function updateAssign(id) {
            const routeId = document.getElementById('assign-route-select').value;
            const selects = document.querySelectorAll('.station-id-select');


            const stationIds = Array.from(selects)
                .map(s => parseInt(s.value))
                .filter(val => !isNaN(val));

            if (stationIds.length === 0) return alert("يجب اختيار محطة واحدة على الأقل بصيغة صحيحة");

            const updatedData = {
                route_id: parseInt(routeId),
                stations: stationIds
            };
            try {
                const response = await fetch(`${API}/assign/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    alert("تم تحديث التعيين بنجاح!");
                    closeAssignModal();
                    if (typeof fetchAssign === "function") fetchAssign();
                } else {
                    const errorData = await response.json();
                    alert("فشل التحديث: " + (errorData.message || "خطأ غير معروف"));
                }
            } catch (error) {
                console.error("Error updating:", error);
                alert("حدث خطأ في الاتصال بالسيرفر");
            }
        }
        function closeAssignModal() {
            const modal = document.getElementById('modal-assign');
            if (!modal) return;
            modal.style.display = 'none';
            const routeSelect = document.getElementById('assign-route-select');
            if (routeSelect) routeSelect.selectedIndex = 0;
            const container = document.getElementById('assign-stations-container');
            if (container) container.innerHTML = "";
            const modalFooter = modal.querySelector('.modal-actions');
            if (modalFooter) {
                modalFooter.innerHTML = `
            <button onclick="saveAssign()" class="btn-save">
                <i class="bi bi-hdd-fill"></i> حفظ التعيين
            </button>
            <button onclick="closeAssignModal()" class="btn-cancel">إلغاء</button>
        `;
            }
        }

        async function saveStation() {
            const name = document.getElementById('st-name').value;
            const desc = document.getElementById('st-desc').value;
            const x = document.getElementById('st-x').value;
            const y = document.getElementById('st-y').value;

            if (!name || !desc || !x || !y) return alert("يرجى ملء جميع الحقول");

            const newStation = {
                station_name: name,
                description: desc,
                location_x: parseFloat(x),
                location_y: parseFloat(y)
            };

            await fetch(`${API}/stations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newStation)
            });

            closeModal('modal-station');
            fetchStations();
        }

        async function deleteStation(id) {
            if (!confirm("حذف هذه المحطة؟")) return;
            await fetch(`${API}/stations/${id}`, { method: "DELETE" });
            fetchStations();
        }
        fetchAll();

        async function editStation(id) {

            const s = stationsData.find(x => x.id == id);
            if (!s) return;

            document.getElementById('st-name').value = s.station_name;
            document.getElementById('st-desc').value = s.description;
            document.getElementById('st-x').value = s.location_x;
            document.getElementById('st-y').value = s.location_y;

            const modalTitle = document.querySelector('#modal-station h3');
            modalTitle.innerHTML = `<i class="bi bi-pencil-square text-warning"></i> تعديل بيانات المحطة`;

            const modalActions = document.querySelector('#modal-station .modal-actions');

            modalActions.innerHTML = `
        <button onclick="updateStation(${id})" class="btn-save" style="background-color: #ffc107; color: #212529;">
            <i class="bi bi-arrow-repeat"></i> حفظ التغييرات
        </button>
        <button onclick="closeStationModal()" class="btn-cancel">إلغاء</button>
    `;

            document.getElementById('modal-station').style.display = 'flex';
        }
        async function updateStation(id) {
            const name = document.getElementById('st-name').value.trim();
            const desc = document.getElementById('st-desc').value.trim();
            const x = document.getElementById('st-x').value;
            const y = document.getElementById('st-y').value;

            if (!name || !x || !y) return alert("يرجى ملء الحقول الأساسية");

            const updatedStation = {
                station_name: name,
                description: desc,
                location_x: parseFloat(x),
                location_y: parseFloat(y)
            };

            try {
                const res = await fetch(`${API}/stations/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedStation)
                });

                if (res.ok) {
                    alert("تم تحديث بيانات المحطة بنجاح! ");
                    closeStationModal();
                    fetchStations();
                }
            } catch (err) {
                console.error("خطأ في التعديل:", err);
                alert("حدث خطأ أثناء الاتصال بالسيرفر");
            }
        }
        function closeStationModal() {
            closeModal('modal-station');

            const modalTitle = document.querySelector('#modal-station h3');
            modalTitle.innerHTML = `<i class="bi bi-geo-alt-fill"></i> إضافة محطة جديدة`;


            const modalActions = document.querySelector('#modal-station .modal-actions');
            modalActions.innerHTML = `
        <button onclick="saveStation()" class="btn-save">
            <i class="bi bi-check-circle"></i> حفظ المحطة
        </button>
        <button onclick="closeModal('modal-station')" class="btn-cancel">إلغاء</button>
    `;
        }

        async function saveRoute() {
            const route_name = document.getElementById('rt-name').value;
            if (!route_name) return alert("الاسم مطلوب");

            await fetch(`${API}/routes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    , "Accept": "application/json"
                },
                body: JSON.stringify({ route_name })
            });
            closeModal('modal-route');
            fetchRoutes();
        }
        async function deleteRoute(id) {
            if (!confirm("حذف المسار؟")) return;
            await fetch(`${API}/routes/${id}`, { method: "DELETE" });
            fetchRoutes();
        }
        async function editRoute(id) {
            // console.log("hi from editroute func");
            const r = routesData.find(x => x.id == id);
            if (!r) return;
            document.getElementById('rt-name').value = r.route_name;
            const modalTitle = document.querySelector('#modal-route h3');
            modalTitle.innerHTML = `<i class="bi bi-pencil-square text-warning"></i> تعديل اسم المسار`;
            const modalActions = document.querySelector('#modal-route .modal-actions');
            modalActions.innerHTML = `
        <button onclick="updateRoute(${id})" class="btn-save" style="background-color: #ffc107; color: #212529;">
            <i class="bi bi-arrow-repeat"></i> تحديث الاسم
        </button>
        <button onclick="closeRouteModal()" class="btn-cancel">إلغاء</button>
    `;

            document.getElementById('modal-route').style.display = 'flex';
        }
        async function updateRoute(id) {
            // console.log("hi from updateroute func");
            const newName = document.getElementById('rt-name').value.trim();

            if (!newName) return alert("يرجى إدخال اسم المسار");

            try {
                const res = await fetch(`${API}/routes/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                        , "Accept": "application/json"
                    },
                    body: JSON.stringify({ route_name: newName })
                });

                if (res.ok) {
                    alert("تم تحديث اسم المسار بنجاح! ");
                    closeRouteModal();
                    fetchRoutes();
                }
            } catch (err) {
                console.error("خطأ أثناء تحديث المسار:", err);
                alert("فشل الاتصال بالسيرفر");
            }
        }
        function closeRouteModal() {
            closeModal('modal-route');
            const modalTitle = document.querySelector('#modal-route h3');
            modalTitle.innerHTML = `<i class="bi bi-signpost-split-fill"></i> إضافة مسار جديد`;
            const modalActions = document.querySelector('#modal-route .modal-actions');
            modalActions.innerHTML = `
        <button onclick="saveRoute()" class="btn-save">
            <i class="bi bi-check-circle"></i> حفظ المسار
        </button>
        <button onclick="closeModal('modal-route')" class="btn-cancel">إلغاء</button>
    `;
        }

        function addStationSelectRow() {
            const container = document.getElementById('assign-stations-container');
            const currentRows = container.querySelectorAll('.station-row');
            if (currentRows.length >= 5) {
                alert("لا يمكن اختيار أكثر من خمس محطات");
                return;
            }
            if (currentRows.length > 0) {
                const lastSelect = currentRows[currentRows.length - 1]
                    .querySelector('.station-id-select');
                if (!lastSelect.value) {
                    alert("يجب اختيار محطة قبل إضافة محطة جديدة");
                    lastSelect.focus();
                    return;
                }
            }

            const div = document.createElement('div');
            div.className = "station-row d-flex gap-2 mb-2 align-items-center";
            let options = '<option value="" disabled selected>-- اختر محطة --</option>';
            options += stationsData.map(s =>
                `<option value="${s.id}">${s.station_name}</option>`
            ).join('');

            div.innerHTML = `
        <select class="form-input station-id-select" style="flex:1; padding: 8px; border:1px solid #ccc; border-radius:4px;">
            ${options}
        </select>
        <button type="button" class="btn-action delete" onclick="this.parentElement.remove()" style="color:red; border:none; background:none;">
            <i class="bi bi-x-circle-fill" style="font-size:1.2rem;"></i>
        </button>
    `;

            div.querySelector('.station-id-select').addEventListener('change', function () {
                const selectedValue = this.value;

                const allSelects = container.querySelectorAll('.station-id-select');
                let count = 0;

                allSelects.forEach(sel => {
                    if (sel.value === selectedValue) count++;
                });

                if (count > 1) {
                    alert("هذه المحطة تم اختيارها مسبقًا، اختر محطة أخرى");
                    this.value = "";
                    this.focus();
                }
            });

            container.appendChild(div);
        }


        async function saveAssign() {
            const routeId = document.getElementById('assign-route-select').value;
            const selectElements = document.querySelectorAll('.station-id-select');
            const stationIds = [];

            selectElements.forEach(sel => {
                if (sel.value) stationIds.push(parseInt(sel.value));
            });

            if (!routeId) return alert("يرجى اختيار الخط");
            if (stationIds.length === 0) return alert("يرجى إضافة محطة واحدة على الأقل");


            const payload = {
                route_id: parseInt(routeId),
                stations: stationIds
            };

            try {
                await fetch(`${API}/assign`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                        , "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                closeModal('modal-assign');
                fetchAssign();
                alert("تم ربط المحطات بالمسار بنجاح!");
            } catch (e) {
                console.error(e);
                alert("حدث خطأ أثناء الحفظ");
            }
        }

        async function deleteAssign(id) {
            if (!confirm("هل تريد حذف هذا الربط؟")) return;
            await fetch(`${API}/assign/${id}`, { method: "DELETE" });
            fetchAssign();
        }


        function showStationForm() {

            document.getElementById('st-name').value = '';
            document.getElementById('st-desc').value = '';
            document.getElementById('st-x').value = '';
            document.getElementById('st-y').value = '';


            const modal = document.getElementById('modal-station');
            modal.style.display = 'flex';
        }

        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================
        // ================= فتح الموديل =================

        function showUnifiedAcademicForm() {

            document.getElementById('modal-unified-structure').style.display = 'flex';

            resetUnifiedForm();
            fillUniversities();
        }

        function resetUnifiedForm() {

            ["new-uni-name", "new-college-name", "new-dept-name", "new-level-name"]
                .forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.value = "";
                        el.style.display = "none";
                    }
                });

            document.getElementById("unified-college-select").innerHTML = '<option value="">-- اختر الكلية --</option>';
            document.getElementById("unified-dept-select").innerHTML = '<option value="">-- اختر القسم --</option>';
            document.getElementById("unified-level-select").innerHTML = '<option value="">-- اختر المستوى --</option>';

            document.getElementById("unified-college-select").disabled = true;
            document.getElementById("unified-dept-select").disabled = true;
            document.getElementById("unified-level-select").disabled = true;
        }


        // =======================================
        // تعبئة الجامعات
        // =======================================
        function fillUniversities() {

            const sel = document.getElementById("unified-uni-select");

            sel.innerHTML =
                `<option value="">-- اختر جامعة --</option>
     <option value="NEW">+ إضافة جامعة جديدة</option>`+
                universitiesData.map(u =>
                    `<option value="${Number(u.id)}">${u.university_name}</option>`
                ).join('');
        }


        // =======================================
        // التعامل مع التغييرات
        // =======================================
        function handleAcademicChange(type) {

            // ========= جامعة =========
            if (type === "uni") {
                const uniId = document.getElementById("unified-uni-select").value;
                document.getElementById("new-uni-name").style.display = (uniId === "NEW") ? "block" : "none";

                const collegeSel = document.getElementById("unified-college-select");
                collegeSel.disabled = false;
                collegeSel.innerHTML = `<option value="">-- اختر الكلية --</option><option value="NEW">+ إضافة كلية جديدة</option>`;

                document.getElementById("unified-dept-select").disabled = true;
                document.getElementById("unified-level-select").disabled = true;

                if (!uniId || uniId === "NEW") return;

                const filtered = collegesData.filter(c => Number(c.university_id) === Number(uniId));
                collegeSel.innerHTML += filtered.map(c => `<option value="${Number(c.id)}">${c.college_name}</option>`).join('');
            }

            // ========= كلية =========
            if (type === "college") {
                const colId = document.getElementById("unified-college-select").value;
                document.getElementById("new-college-name").style.display = (colId === "NEW") ? "block" : "none";

                const deptSel = document.getElementById("unified-dept-select");
                deptSel.disabled = false;
                deptSel.innerHTML = `<option value="">-- اختر القسم --</option><option value="NEW">+ إضافة قسم جديد</option>`;

                document.getElementById("unified-level-select").disabled = true;

                if (!colId || colId === "NEW") return;

                const filtered = departmentsData.filter(d => Number(d.college_id) === Number(colId));
                deptSel.innerHTML += filtered.map(d => `<option value="${Number(d.id)}">${d.department_name}</option>`).join('');
            }


            if (type === "dept") {
                const deptId = document.getElementById("unified-dept-select").value;
                document.getElementById("new-dept-name").style.display = (deptId === "NEW") ? "block" : "none";

                const levelSel = document.getElementById("unified-level-select");
                levelSel.disabled = false;
                levelSel.innerHTML = `<option value="">-- اختر المستوى --</option><option value="NEW">+ إضافة مستوى جديد</option>`;

                if (!deptId || deptId === "NEW") return;

                const filtered = levelsData.filter(l => Number(l.department_id) === Number(deptId));
                levelSel.innerHTML += filtered.map(l => `<option value="${Number(l.id)}">${l.level_name}</option>`).join('');
            }
            if (type === "level") {
                const levelId = document.getElementById("unified-level-select").value;

                const newLevelInput = document.getElementById("new-level-name");
                if (newLevelInput) {
                    newLevelInput.style.display = (levelId === "NEW") ? "block" : "none";
                }
            }
            fetchUniversities();
            fetchColleges();
            fetchDepartments();
            fetchLevels();
            renderAcademicStructure();
            fetchAll();
        }


        // =======================================
        // الحفظ
        // =======================================
        async function saveUnifiedStructure() {

            try {

                let uniId = document.getElementById("unified-uni-select").value;
                let colId = document.getElementById("unified-college-select").value;
                let deptId = document.getElementById("unified-dept-select").value;
                let levelId = document.getElementById("unified-level-select").value;

                const newUni = document.getElementById("new-uni-name").value.trim();
                const newCol = document.getElementById("new-college-name").value.trim();
                const newDept = document.getElementById("new-dept-name").value.trim();
                const newLevel = document.getElementById("new-level-name").value.trim();



                if (uniId === "NEW") {
                    const r = await fetch(`${API}/universities`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ university_name: newUni })
                    });
                    const d = await r.json();
                    uniId = Number(d.id);
                }



                if (colId === "NEW") {
                    const r = await fetch(`${API}/colleges`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            college_name: newCol,
                            university_id: Number(uniId)
                        })
                    });
                    const d = await r.json();
                    colId = Number(d.id);
                }



                if (deptId === "NEW") {
                    const r = await fetch(`${API}/departments`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            department_name: newDept,
                            college_id: Number(colId)
                        })
                    });
                    const d = await r.json();
                    deptId = Number(d.id);
                }



                if (levelId === "NEW" || newLevel) {
                    await fetch(`${API}/levels`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            level_name: newLevel,
                            department_id: Number(deptId)
                        })
                    });
                }



                await Promise.all([
                    fetchUniversities(),
                    fetchColleges(),
                    fetchDepartments(),
                    fetchLevels(),
                    renderAcademicStructure(),

                ]);

                alert("تم حفظ الهيكلية بنجاح");
                closeModal('modal-unified-structure');

            } catch (e) {
                alert("خطأ: " + e.message);
            }

        }

        //
        //      map
        //
        // 

        async function fetchUniversities() {
            universitiesData = await (await fetch(`${API}/universities`)).json();
        }
        async function fetchColleges() {
            collegesData = await (await fetch(`${API}/colleges`)).json();
        }
        async function fetchDepartments() {
            departmentsData = await (await fetch(`${API}/departments`)).json();
        }
        async function fetchLevels() {
            levelsData = await (await fetch(`${API}/levels`)).json();
        }
        console.log("Updated Universities:wwww", universitiesData);




        function openStudentModal() {
            document.getElementById('studentAddModal').style.display = 'flex';
            initForm();
        }

        function closeStudentModal() {
            document.getElementById('studentAddModal').style.display = 'none';
            clearForm();
        }


        function initForm() {
            const uniSelect = document.getElementById('add-student-university');
            const boardSelect = document.getElementById('add-student-boarding-station');
            const alightSelect = document.getElementById('add-student-alighting-station');


            uniSelect.innerHTML = '<option value="">اختر الجامعة</option>';
            if (typeof universitiesData !== 'undefined' && Array.isArray(universitiesData)) {
                universitiesData.forEach(u => {
                    uniSelect.innerHTML += `<option value="${u.id}">${u.university_name}</option>`;
                });
            }


            let stationsOptions = '<option value="">اختر المحطة</option>';
            if (typeof stationsData !== 'undefined' && Array.isArray(stationsData)) {
                stationsData.forEach(s => {
                    stationsOptions += `<option value="${s.id}">${s.station_name}</option>`;
                });
            }
            boardSelect.innerHTML = stationsOptions;
            alightSelect.innerHTML = stationsOptions;
        }



        function onUniversityChange(val) {
            const universityId = Number(val);
            const collegeSelect = document.getElementById('add-student-college');


            collegeSelect.innerHTML = '<option value="">اختر الكلية</option>';
            document.getElementById('add-student-department').innerHTML = '<option value="">اختر القسم</option>';
            document.getElementById('add-student-level').innerHTML = '<option value="">اختر المستوى</option>';

            if (!universityId || typeof collegesData === 'undefined') return;

            const filteredColleges = collegesData.filter(c => Number(c.university_id) === universityId);
            filteredColleges.forEach(c => {
                collegeSelect.innerHTML += `<option value="${c.id}">${c.college_name}</option>`;
            });
        }

        function onCollegeChange(val) {
            const collegeId = Number(val);
            const deptSelect = document.getElementById('add-student-department');

            deptSelect.innerHTML = '<option value="">اختر القسم</option>';
            document.getElementById('add-student-level').innerHTML = '<option value="">اختر المستوى أولاً</option>';

            if (!collegeId || typeof departmentsData === 'undefined') return;

            const filteredDepartments = departmentsData.filter(d => Number(d.college_id) === collegeId);
            filteredDepartments.forEach(d => {
                deptSelect.innerHTML += `<option value="${d.id}">${d.department_name}</option>`;
            });
        }

        function onDepartmentChange(val) {
            const departmentId = Number(val);
            const levelSelect = document.getElementById('add-student-level');

            levelSelect.innerHTML = '<option value="">اختر المستوى</option>';

            if (!departmentId || typeof levelsData === 'undefined') return;

            const filteredLevels = levelsData.filter(l => Number(l.department_id) === departmentId);
            filteredLevels.forEach(l => {
                levelSelect.innerHTML += `<option value="${l.id}">${l.level_name}</option>`;
            });
        }


        async function saveStudent() {

            const username = document.getElementById('add-student-username').value;
            const password = document.getElementById('add-student-password').value;
            const studentStateElement = document.getElementById('add-student-state');
            const studentStateValue = studentStateElement ? studentStateElement.value : "Active";


            const userPayload = {
                username: username,
                password: password,
                role_id: 1,
                status: "pending",
                created_at: new Date().toISOString().split('T')[0]
            };

            try {

                const userResponse = await fetch(`${API}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userPayload)
                });

                if (!userResponse.ok) throw new Error("فشل إنشاء حساب المستخدم");
                const selectedDays = Array.from(document.querySelectorAll('.days-grid input:checked'))
                    .map(cb => Number(cb.value));

                const createdUser = await userResponse.json();
                const newUserId = createdUser.id;


                const studentPayload = {
                    user_id: newUserId,
                    username: username,
                    password: password,
                    name: document.getElementById('add-student-name').value,
                    phone: document.getElementById('add-student-phone').value,
                    university_number: document.getElementById('add-student-university-number').value,
                    city: document.getElementById('add-student-city').value,
                    gender: document.getElementById('add-student-gender').value,
                    university_id: Number(document.getElementById('add-student-university').value),
                    college_id: Number(document.getElementById('add-student-college').value),
                    department_id: Number(document.getElementById('add-student-department').value),
                    level_id: Number(document.getElementById('add-student-level').value),
                    pickup_station_id: Number(document.getElementById('add-student-boarding-station').value),
                    dropoff_station_id: Number(document.getElementById('add-student-alighting-station').value),
                    role_id: 1,
                    status: "approved",
                    state: studentStateValue,
                    days: selectedDays
                };

                const studentResponse = await fetch(`${API}/students`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentPayload)
                });

                if (studentResponse.ok) {
                    alert(`تم الحفظ بنجاح! تم ربط الطالب بالمستخدم رقم: ${newUserId}`);
                    closeStudentModal();


                    if (typeof fetchStudents === 'function') fetchStudents();
                    if (typeof fetchUsers === 'function') fetchUsers();
                } else {
                    alert("حدث خطأ أثناء إنشاء بيانات الطالب.");
                }

            } catch (error) {
                console.error("Error:", error.message);
                alert("فشل في إكمال العملية: " + error.message);
            }
        }

        function clearForm() {

            document.querySelectorAll('.form-input').forEach(input => {

                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                } else {
                    input.value = '';
                }
            });

            document.getElementById('add-student-college').innerHTML = '<option value="">اختر الكلية</option>';
            document.getElementById('add-student-department').innerHTML = '<option value="">اختر القسم</option>';
            document.getElementById('add-student-level').innerHTML = '<option value="">اختر المستوى</option>';
            fetchAll();
        }

        async function editStudent(id) {
            const student = studentsData.find(s => s.id === id);
            if (!student) return alert("تعذر العثور على بيانات الطالب");

            openStudentModal();


            initForm();


            document.querySelector('#studentAddModal h3').innerText = "تعديل بيانات الطالب";

            const saveBtn = document.querySelector('.student-modal-actions .btn-save-green');
            saveBtn.innerText = "تحديث البيانات";
            saveBtn.setAttribute('onclick', `updateStudent(${id})`);


            const usernameInput = document.getElementById('add-student-username');
            usernameInput.value = student.username || "";
            usernameInput.disabled = true;


            const passwordInput = document.getElementById('add-student-password');
            passwordInput.value = "";
            passwordInput.disabled = true;



            document.getElementById('add-student-name').value = student.name || "";
            document.getElementById('add-student-phone').value = student.phone || "";
            document.getElementById('add-student-university-number').value = student.university_number || "";
            document.getElementById('add-student-city').value = student.city || "";
            document.getElementById('add-student-gender').value = student.gender || "";
            document.getElementById('add-student-state').value = student.state || "";


            document.getElementById('add-student-university').value = student.university_id;
            onUniversityChange(student.university_id);


            setTimeout(() => {
                document.getElementById('add-student-college').value = student.college_id;
                onCollegeChange(student.college_id);

                setTimeout(() => {
                    document.getElementById('add-student-department').value = student.department_id;
                    onDepartmentChange(student.department_id);

                    setTimeout(() => {
                        document.getElementById('add-student-level').value = student.level_id;
                    }, 100);

                }, 100);

            }, 100);


            document.getElementById('add-student-boarding-station').value = student.pickup_station_id;
            document.getElementById('add-student-alighting-station').value = student.dropoff_station_id;


            if (Array.isArray(student.days)) {
                const daysInputs = document.querySelectorAll('#add-student-days input[type="checkbox"]');
                daysInputs.forEach(chk => {
                    chk.checked = student.days.includes(chk.value);
                });
            }
        }


        async function updateStudent(id) {
            try {

                const selectedDays = Array.from(document.querySelectorAll('.days-grid input:checked'))
                    .map(cb => Number(cb.value));


                const studentStateElement = document.getElementById('add-student-state');
                const studentStateValue = studentStateElement ? studentStateElement.value : "Active";


                const updatedPayload = {

                    name: document.getElementById('add-student-name').value,
                    phone: document.getElementById('add-student-phone').value,
                    university_number: document.getElementById('add-student-university-number').value,
                    city: document.getElementById('add-student-city').value,
                    gender: document.getElementById('add-student-gender').value,
                    state: studentStateValue,
                    university_id: Number(document.getElementById('add-student-university').value),
                    college_id: Number(document.getElementById('add-student-college').value),
                    department_id: Number(document.getElementById('add-student-department').value),
                    level_id: Number(document.getElementById('add-student-level').value),
                    pickup_station_id: Number(document.getElementById('add-student-boarding-station').value),
                    dropoff_station_id: Number(document.getElementById('add-student-alighting-station').value),
                    days: selectedDays
                };


                const response = await fetch(`${API}/students/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPayload)
                });

                if (response.ok) {
                    alert("تم تحديث بيانات الطالب بنجاح");
                    closeStudentModal();


                    if (typeof fetchStudents === 'function') fetchStudents();
                } else {
                    const error = await response.json();
                    console.error("Server Error:", error);
                    alert("فشل تحديث بيانات الطالب");
                }

            } catch (err) {
                console.error("Update Error:", err);
                alert("حدث خطأ في الاتصال بالسيرفر");
            }
        }

        async function deleteStudent(id) {

            if (!confirm("هل أنت متأكد من استبعاد هذا الطالب؟ لن يتم حذف البيانات ولكن سيتم رفض حسابه ومنعه من الظهور.")) return;


            const student = studentsData.find(s => s.id === id);

            if (!student || !student.user_id) {
                alert("خطأ: لم يتم العثور على حساب مستخدم مرتبط بهذا الطالب.");
                return;
            }

            try {

                const response = await fetch(`${API}/users/${student.user_id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: "rejected"
                    })
                });

                if (response.ok) {
                    alert("تم استبعاد الطالب بنجاح.");


                    if (typeof fetchUsers === 'function') await fetchUsers();
                    if (typeof fetchStudents === 'function') await fetchStudents();

                    renderStudents();
                } else {
                    alert("فشل تحديث حالة المستخدم على السيرفر.");
                }
            } catch (error) {
                console.error("Error during soft delete:", error);
                alert("حدث خطأ في الاتصال بالسيرفر.");
            }
        }

        function showAddStudentModal() {
            openStudentModal();
            initForm(); // إعادة تهيئة الحقول

            // عنوان المودال
            document.querySelector('#studentAddModal h3').innerText = "إضافة طالب جديد";

            // ضبط زر الحفظ
            const saveBtn = document.querySelector('.student-modal-actions .btn-save-green');
            saveBtn.innerText = "حفظ";
            saveBtn.setAttribute('onclick', `saveStudent()`);

            // تفعيل username و password
            const usernameInput = document.getElementById('add-student-username');
            usernameInput.value = "";
            usernameInput.disabled = false;

            const passwordInput = document.getElementById('add-student-password');
            passwordInput.value = "";
            passwordInput.disabled = false;

            // إعادة تعيين الحقول الأخرى
            document.getElementById('add-student-name').value = "";
            document.getElementById('add-student-phone').value = "";
            document.getElementById('add-student-university-number').value = "";
            document.getElementById('add-student-city').value = "";
            document.getElementById('add-student-gender').value = "";
            document.getElementById('add-student-state').value = "";

            document.getElementById('add-student-university').value = "";
            document.getElementById('add-student-college').value = "";
            document.getElementById('add-student-department').value = "";
            document.getElementById('add-student-level').value = "";

            document.getElementById('add-student-boarding-station').value = "";
            document.getElementById('add-student-alighting-station').value = "";

            // إعادة تعيين أيام الأسبوع
            const daysInputs = document.querySelectorAll('#add-student-days input[type="checkbox"]');
            daysInputs.forEach(chk => chk.checked = false);
        }



        function renderAcademicStructure() {
            const tbody = document.getElementById('academic-structure-body');
            if (!tbody) return;
            tbody.innerHTML = '';

            universitiesData.forEach(uni => {

                const uniColleges = collegesData.filter(c => Number(c.university_id) === Number(uni.id));


                let totalUniRows = 0;
                uniColleges.forEach(col => {
                    const depts = departmentsData.filter(d => Number(d.college_id) === Number(col.id));
                    totalUniRows += (depts.length || 1);
                });
                if (totalUniRows === 0) totalUniRows = 1;

                let isFirstUniRow = true;

                if (uniColleges.length === 0) {

                    addAcademicRow(tbody, uni.university_name, "-", "-", 0, uni.id, 'university', 1, 1, true, true);
                } else {
                    uniColleges.forEach(col => {
                        const colDepartments = departmentsData.filter(d => Number(d.college_id) === Number(col.id));
                        const totalColRows = colDepartments.length || 1;
                        let isFirstColRow = true;

                        if (colDepartments.length === 0) {

                            addAcademicRow(tbody, uni.university_name, col.college_name, "-", 0, col.id, 'college', totalUniRows, 1, isFirstUniRow, true);
                            isFirstUniRow = false;
                        } else {
                            colDepartments.forEach(dept => {
                                const deptLevels = levelsData.filter(l => Number(l.department_id) === Number(dept.id));
                                addAcademicRow(tbody, uni.university_name, col.college_name, dept.department_name, deptLevels.length, dept.id, 'department', totalUniRows, totalColRows, isFirstUniRow, isFirstColRow);
                                isFirstUniRow = false;
                                isFirstColRow = false;
                            });
                        }
                    });
                }
            });
        }


        function addAcademicRow(tbody, uniName, colName, deptName, levelsCount, id, type, uniSpan, colSpan, showUni, showCol) {
            const tr = document.createElement('tr');

            tr.innerHTML = `
        ${showUni ? `<td rowspan="${uniSpan}" class="merged-cell uni-cell">${uniName}</td>` : ''}
        ${showCol ? `<td rowspan="${colSpan}" class="merged-cell col-cell">${colName}</td>` : ''}
        <td>${deptName}</td>
        <td><span class="badge-levels">${levelsCount} مستوى</span></td>
        <td>
            <div class="action-group">
                <button class="btn-action view" onclick="viewAcademicDetail(${id}, '${type}')"><i class="bi bi-eye"></i></button>
                <button class="btn-action delete" onclick="deleteAcademicItem(${id}, '${type}')"><i class="bi bi-trash"></i></button>
            </div>
        </td>
    `;
            tbody.appendChild(tr);
        }


        function viewAcademicDetail(id, type) {
            let targetUniId;

            // تحديد الجامعة المستهدفة بناءً على مكان الضغط
            if (type === 'university') {
                targetUniId = id;
            } else if (type === 'college') {
                const col = collegesData.find(c => c.id == id);
                targetUniId = col ? col.university_id : null;
            } else if (type === 'department') {
                const dept = departmentsData.find(d => d.id == id);
                const col = collegesData.find(c => c.id == (dept ? dept.college_id : null));
                targetUniId = col ? col.university_id : null;
            }

            const uni = universitiesData.find(u => u.id == targetUniId);
            if (!uni) return alert("تعذر العثور على بيانات الجامعة");

            // تحديث واجهة الموديل
            document.getElementById('details-uni-title').innerHTML = `<i class="bi bi-info-circle"></i> إحصائيات ${uni.university_name}`;
            const tbody = document.getElementById('details-table-body');
            tbody.innerHTML = '';

            let totalUniStudents = 0;

            // فلترة الكليات التابعة لهذه الجامعة
            const uniColleges = collegesData.filter(c => c.university_id == uni.id);

            uniColleges.forEach(col => {
                const colDepts = departmentsData.filter(d => d.college_id == col.id);
                let colStudentsTotal = 0;

                // حساب إجمالي الصفوف للكلية لعمل rowspan
                let colTotalRows = 0;
                colDepts.forEach(d => {
                    const levels = levelsData.filter(l => l.department_id == d.id);
                    colTotalRows += (levels.length || 1);
                });
                if (colTotalRows === 0) colTotalRows = 1;

                let isFirstColRow = true;

                colDepts.forEach(dept => {
                    const deptLevels = levelsData.filter(l => l.department_id == dept.id);
                    let deptStudentsTotal = 0;
                    const deptRowsCount = deptLevels.length || 1;
                    let isFirstDeptRow = true;

                    if (deptLevels.length === 0) {
                        // حالة كلية بها قسم بدون مستويات
                        renderDetailRow(tbody, col.college_name, colTotalRows, isFirstColRow, dept.department_name, 1, true, "-", 0, 0);
                        isFirstColRow = false;
                    } else {
                        deptLevels.forEach(level => {
                            // حساب عدد الطلاب في هذا المستوى من مصفوفة studentsData
                            const levelStudents = studentsData.filter(s => s.level_id == level.id).length;
                            deptStudentsTotal += levelStudents;

                            renderDetailRow(tbody, col.college_name, colTotalRows, isFirstColRow, dept.department_name, deptRowsCount, isFirstDeptRow, level.level_name, levelStudents, dept.id);

                            isFirstColRow = false;
                            isFirstDeptRow = false;
                        });
                    }
                    colStudentsTotal += deptStudentsTotal;

                    // تحديث عداد الطلاب بجانب اسم القسم (عبر DOM)
                    const deptCountLabel = document.getElementById(`count-dept-${dept.id}`);
                    if (deptCountLabel) deptCountLabel.innerText = `(${deptStudentsTotal} طالب)`;
                });

                totalUniStudents += colStudentsTotal;
                // تحديث عداد الكلية (عبر DOM)
                const colCountLabel = document.getElementById(`count-col-${col.id}`);
                if (colCountLabel) colCountLabel.innerText = `(${colStudentsTotal} طالب)`;
            });

            document.getElementById('total-uni-students').innerText = totalUniStudents;
            document.getElementById('modal-academic-details').style.display = 'flex';
        }

        // دالة مساعدة لرسم أسطر التفاصيل
        function renderDetailRow(tbody, colName, colSpan, showCol, deptName, deptSpan, showDept, levelName, levelCount, deptId) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        ${showCol ? `<td rowspan="${colSpan}" class="merged-cell"><strong>${colName}</strong><br><small class="text-muted" id="count-col-current">...</small></td>` : ''}
        ${showDept ? `<td rowspan="${deptSpan}" class="merged-cell">${deptName} <br> <small id="count-dept-${deptId}" class="text-primary">(0 طالب)</small></td>` : ''}
        <td>${levelName}</td>
        <td><span class="badge bg-light text-dark border">${levelCount} طالب</span></td>
    `;
            tbody.appendChild(tr);
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }


        async function deleteAcademicItem(id, type) {

            let message = "";
            let endpoint = "";

            switch (type) {
                case 'university':
                    message = " هل أنت متأكد؟ حذف الجامعة سيؤدي لحذف جميع الكليات والأقسام والمستويات التابعة لها!";
                    endpoint = "universities";
                    break;
                case 'college':
                    message = "هل أنت متأكد؟ حذف الكلية سيؤدي لحذف جميع الأقسام والمستويات التابعة لها فقط.";
                    endpoint = "colleges";
                    break;
                case 'department':
                    message = "هل أنت متأكد؟ حذف القسم سيؤدي لحذف جميع المستويات التابعة له فقط.";
                    endpoint = "departments";
                    break;
                case 'level':
                    message = "هل أنت متأكد من حذف هذا المستوى؟";
                    endpoint = "levels";
                    break;
            }


            if (!confirm(message)) return;

            try {

                const response = await fetch(`${API}/${endpoint}/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert("تم الحذف بنجاح.");


                    await refreshAcademicData();


                    renderAcademicStructure();
                } else {
                    alert("حدث خطأ أثناء محاولة الحذف من السيرفر.");
                }
            } catch (error) {
                console.error("Delete Error:", error);
                alert("فشل الاتصال بالسيرفر.");
            }
        }


        async function refreshAcademicData() {
            const [uniRes, colRes, depRes, levRes] = await Promise.all([
                fetch(`${API}/universities`),
                fetch(`${API}/colleges`),
                fetch(`${API}/departments`),
                fetch(`${API}/levels`)
            ]);

            universitiesData = await uniRes.json();
            collegesData = await colRes.json();
            departmentsData = await depRes.json();
            levelsData = await levRes.json();
        }


        let driversData = [];
        let busesData = [];


        async function fetchDriversAndBuses() {
            try {
                const driversResponse = await fetch(`${API}/drivers`);
                driversData = await driversResponse.json();
                const busesResponse = await fetch(`${API}/buses`);
                busesData = await busesResponse.json();
                renderDriversAndBuses();
            } catch (error) {
                console.error("حدث خطأ أثناء جلب بيانات السائقين والباصات:", error);
            }
        }


        function renderDriversAndBuses() {
            const searchText = document.getElementById('driver-search-input').value.toLowerCase();
            const statusFilter = document.getElementById('driver-status-filter').value;
            const fuelFilter = document.getElementById('driver-fuel-filter').value;

            const tableBody = document.getElementById('drivers-buses-table-body');
            tableBody.innerHTML = '';


            const approvedDrivers = driversData.filter(d => {
                const user = usersData.find(u => u.id === d.user_id);
                return user && user.status === 'approved';
            });



            const mergedData = busesData.map(bus => {
                const driver = driversData.find(d => d.id === bus.driver_id) || {};
                return {
                    driver_id: driver.id || '',
                    driver_name: driver.name_driver || '',
                    driver_phone: driver.phone || '',
                    driver_state: driver.state || '',
                    bus_number: bus.id || '',
                    bus_passengers: bus.number_passengers || '',
                    bus_fuel: bus.type_fuel || ''
                };
            });


            const filteredData = mergedData.filter(item => {
                const matchesSearch =
                    item.driver_name.toLowerCase().includes(searchText) ||
                    item.driver_phone.toLowerCase().includes(searchText) ||
                    item.bus_number.toString().includes(searchText) ||
                    item.bus_passengers.toString().includes(searchText) ||
                    item.bus_fuel.toLowerCase().includes(searchText);

                const matchesStatus = (statusFilter === 'all') || (item.driver_state === statusFilter);
                const matchesFuel = (fuelFilter === 'all') || (item.bus_fuel === fuelFilter);

                return matchesSearch && matchesStatus && matchesFuel;
            });


            filteredData.forEach(item => {
                const row = document.createElement('tr');


                let stateText = '';
                let stateClass = '';
                if (item.driver_state.toLowerCase() === 'active') {
                    stateText = 'نشط';
                    stateClass = 'driver-state-active';
                } else if (item.driver_state.toLowerCase() === 'inactive') {
                    stateText = 'متوقف';
                    stateClass = 'driver-state-inactive';
                }

                row.innerHTML = `
            <td>${item.driver_id}</td>
            <td>${item.driver_name}</td>
            <td>${item.driver_phone}</td>
            <td class="${stateClass}">${stateText}</td>
            <td>${item.bus_passengers}</td>
            <td>${item.bus_fuel}</td>
            <td>
                <button type="button" class="btn-action view" onclick="showDriverBusDetails(${item.bus_number})">
                    <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn-action edit" onclick="editDriverBus(${item.bus_number})">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button type="button" class="btn-action delete" onclick="deleteDriverBus(${item.bus_number})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

                tableBody.appendChild(row);
            });
        }


        fetchDriversAndBuses();

        function openDriverBusModal() {
            document.getElementById('driverBusAddModal').style.display = 'flex';


            document.getElementById('add-driver-name').value = '';
            document.getElementById('add-driver-phone').value = '';
            document.getElementById('add-driver-state').value = 'Active';
            // document.getElementById('add-bus-number').value = '';
            document.getElementById('add-bus-passengers').value = '';
            document.getElementById('add-bus-fuel-type').value = '';
        }


        function closeDriverBusModal() {
            document.getElementById('driverBusAddModal').style.display = 'none';
        }

        async function saveDriverBus() {
            const username = document.getElementById('add-driver-username').value.trim();
            const password = document.getElementById('add-driver-password').value.trim();
            const driverName = document.getElementById('add-driver-name').value.trim();
            const driverPhone = document.getElementById('add-driver-phone').value.trim();
            const driverState = document.getElementById('add-driver-state').value;

            // const busNumber = document.getElementById('add-bus-number').value.trim();
            const busPassengers = document.getElementById('add-bus-passengers').value.trim();
            const busFuel = document.getElementById('add-bus-fuel-type').value;

            if (!username || !password || !driverName || !driverPhone || !busPassengers || !busFuel) {
                return alert("يرجى ملء جميع الحقول الأساسية للسائق والباص");
            }

            try {

                const userPayload = {
                    username: username,
                    password: password,
                    role_id: 2,
                    status: "pending",
                    created_at: new Date().toISOString()
                };

                const userRes = await fetch(`${API}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userPayload)
                });

                if (!userRes.ok) throw new Error("فشل إنشاء حساب المستخدم");

                const createdUser = await userRes.json();
                const newUserId = createdUser.id;


                const driverPayload = {
                    user_id: newUserId,
                    name_driver: driverName,
                    phone: driverPhone,
                    state: driverState
                };

                const driverRes = await fetch(`${API}/drivers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(driverPayload)
                });

                if (!driverRes.ok) throw new Error("فشل إنشاء بيانات السائق");

                const createdDriver = await driverRes.json();
                const newDriverId = createdDriver.id;


                const busPayload = {
                    driver_id: newDriverId,
                    number_passengers: parseInt(busPassengers),
                    type_fuel: busFuel
                };

                const busRes = await fetch(`${API}/buses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(busPayload)
                });

                if (!busRes.ok) throw new Error("فشل إنشاء بيانات الباص");

                alert(`تم الحفظ بنجاح! تم ربط السائق باليوزر رقم: ${newUserId} وبالباص`);

                closeDriverBusModal();

                if (typeof fetchDrivers === 'function') fetchDrivers();
                if (typeof fetchBuses === 'function') fetchBuses();
                if (typeof fetchUsers === 'function') fetchUsers();

            } catch (error) {
                console.error("Error:", error);
                alert("فشل في إكمال العملية: " + error.message);
            }
        }


        function showDriverBusDetails(busId) {

            console.log("عرض تفاصيل السائق والباص:", busId);

            const bus = busesData.find(b => b.id == busId);
            if (!bus) return;

            const driver = driversData.find(d => d.id == bus.driver_id);
            const user = usersData.find(u => u.id == driver?.user_id);


            const modal = document.createElement("div");
            modal.className = "student-details-overlay";


            modal.innerHTML = `
        <div class="student-details-card">

            <div class="details-header">
                <h3>${driver?.name_driver || "غير معروف"}</h3>
                <button onclick="this.closest('.student-details-overlay').remove()">✖</button>
            </div>

            <div class="details-grid">

                <div>
                    <strong>ID السائق</strong>
                    <p>${driver?.id || "-"}</p>
                </div>

                <div>
                    <strong>رقم الهاتف</strong>
                    <p>${driver?.phone || "-"}</p>
                </div>

                <div>
                    <strong>الحالة</strong>
                    <p>${driver?.state === "active" ? "نشط" : "متوقف"}</p>
                </div>

                <div>
                    <strong>اسم المستخدم</strong>
                    <p>${user?.username || "غير مرتبط"}</p>
                </div>

                <div>
                    <strong>حالة الحساب</strong>
                    <p>${user?.status || "-"}</p>
                </div>

                <div>
                    <strong>ID المستخدم</strong>
                    <p>${user?.id || "-"}</p>
                </div>

                <div>
                    <strong>تاريخ إنشاء الحساب</strong>
                    <p>${user?.created_at ? new Date(user.created_at).toLocaleString() : "-"}</p>
                </div>

                <div>
                    <strong>ID الباص</strong>
                    <p>${bus.id}</p>
                </div>

                <div>
                    <strong>عدد الركاب</strong>
                    <p>${bus.number_passengers}</p>
                </div>

                <div>
                    <strong>نوع الوقود</strong>
                    <p>${bus.type_fuel}</p>
                </div>

            </div>

        </div>
    `;

            document.body.appendChild(modal);
        }


        async function editDriverBus(id) {
            const driverBus = driversData.find(d => d.id === id);
            if (!driverBus) return alert("تعذر العثور على بيانات السائق أو الباص");


            openDriverBusModal();


            document.querySelector('#driverBusModal h3').innerText = "تعديل بيانات السائق والباص";
            const saveBtn = document.querySelector('.driver-modal-actions .btn-save-green');
            saveBtn.innerText = "تحديث البيانات";
            saveBtn.setAttribute('onclick', `updateDriverBus(${id})`);


            document.getElementById('add-driver-name').value = driverBus.name_driver || '';
            document.getElementById('add-driver-phone').value = driverBus.phone || '';
            document.getElementById('add-bus-passengers').value = driverBus.number_passengers || '';
            document.getElementById('add-bus-fuel').value = driverBus.type_fuel || '';
        }
        async function updateDriverBus(id) {
            const updatedPayload = {
                name_driver: document.getElementById('add-driver-name').value,
                phone: document.getElementById('add-driver-phone').value,
                number_passengers: Number(document.getElementById('add-bus-passengers').value),
                type_fuel: document.getElementById('add-bus-fuel').value
            };

            try {
                const response = await fetch(`${API}/drivers/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPayload)
                });

                if (response.ok) {
                    alert("تم تحديث بيانات السائق والباص بنجاح!");
                    closeDriverBusModal();
                    fetchDriversAndBuses();
                } else {
                    alert("حدث خطأ أثناء التحديث.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("فشل التحديث: " + error.message);
            }
        }

        async function deleteDriverBus(busId) {
            if (!confirm("هل تريد حذف هذا الباص؟")) return;
            try {
                await fetch(`${API}/buses/${busId}`, { method: "DELETE" });
                fetchDriversAndBuses();
            } catch (error) {
                console.error("حدث خطأ أثناء حذف الباص:", error);
            }
        }

        fetchAll();

    </script>