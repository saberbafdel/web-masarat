

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

let driversData = [];
let busesData = [];

let currentUserId = null;


let notificationsData = [];



async function login() {
    const usernameInput = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const error = document.getElementById('login-error');
    error.style.display = "none";

    if (!usernameInput || !password) {
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
                username: usernameInput,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.clear();
            console.log(data);

            currentUserId = data.user.id;

            const accountSpan = document.getElementById('currentAcount');
            if (accountSpan && data.username) {
                accountSpan.textContent = data.username || usernameInput;
            }
            if (data.user.role_id === 3) {
                document.getElementById('login-page').style.display = "none";
                document.getElementById('main-wrapper').style.display = "block";
                showPage('sec-home');

            } else {
                error.textContent = "ليس لديك الصلاحيات الزامة للذخول";
                error.style.display = "block";
            }


        }
        else {
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

    const parent = document.getElementById('sec-stations');
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

function formatDate(dateString) {

    let d = new Date(dateString);

    return d.getFullYear() + "-" +
        (d.getMonth() + 1) + "-" +
        d.getDate() + " " +
        d.getHours() + ":" +
        d.getMinutes();

}
async function fetchUsers() {
    const res = await fetch(`${API}/users`);
    usersData = await res.json();
    renderAll();
}

async function fetchStations() {
    const res = await fetch(`${API}/stations`);
    stationsData = await res.json();
    renderStations();
    renderAll();
}

async function fetchRoutes() {
    const res = await fetch(`${API}/routes`);
    routesData = await res.json();
    renderAll();
}

async function fetchAssign() {
    const res = await fetch(`${API}/assign`);
    assignData = await res.json();
    renderAll();
}

async function fetchStudents() {
    const res = await fetch(`${API}/students`);
    studentsData = await res.json();
    renderAll();
}

async function fetchUniversities() {
    const res = await fetch(`${API}/universities`);
    universitiesData = await res.json();
    renderAll();
}

async function fetchColleges() {
    const res = await fetch(`${API}/colleges`);
    collegesData = await res.json();
    renderAll();
}

async function fetchDepartments() {
    const res = await fetch(`${API}/departments`);
    departmentsData = await res.json();
    renderAll();
}

async function fetchLevels() {
    const res = await fetch(`${API}/levels`);
    levelsData = await res.json();
    renderAll();
}

async function fetchNotifications() {
    try {
        const res = await fetch(`${API}/notifications`);
        notificationsData = await res.json();
        console.table(notificationsData);
        renderNotificationsCarts();
        renderSystemNotifications();

        renderNotifications();
    } catch (error) {
        console.error("فشل في جلب الإشعارات:", error);
    }
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
        fetchNotifications(),
        fetchDriversAndBuses(),
        fetchAbsenceRequests(),

    ]);

    renderAll();
}

function renderAll() {

    renderUsers();
    renderRequests();
    renderBlacklist();

    renderRoutes();
    renderStations();
    renderStationsCards();

    renderStudents();
    renderStudentsCards();

    renderAssign();

    renderAcademicStructure();




    renderReports();

    renderNotifications();
    renderSystemNotifications();


    renderTripsPage();

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
                ? '<span class="student-gender-male">ذكر</span>'
                : '<span class="student-gender-female">أنثى</span>'
            }
</td>
                
           <td>
${student.state && student.state.toLowerCase() === 'active'
                ? '<span class="student-state-active">نشط</span>'
                : '<span class="student-state-inactive">متوقف</span>'}
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
                <div><strong>تاريخ التسجيل</strong><p>${student?.created_at ? formatDate(student.created_at) : "-"}</p></div>

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
        <td>${u.created_at ? formatDate(u.created_at) : 'غير محدد'}</td>
        <td>
            <span class="student-state-pending">قيد الانتظار</span>
        </td>
        <td>
            <button class="btn-action view" onclick="viewUserDetails(${u.id})" title="عرض">
                <i class="bi bi-eye"></i>
            </button>

            <button class="btn-action approve" onclick="updateUserStatus(${u.id}, 'approved')" title="قبول">
                <i class="bi bi-check-circle-fill"></i>
            </button>

            <button class="btn-action delete" onclick="deleteUser(${u.id})" title="رفض">
                <i class="bi bi-x-circle-fill"></i>
            </button>
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
            <td>
<span class="student-state-inactive">محظور</span></td>
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

    try {

        // const usersResponse = await fetch(`${API}/users`, {
        //     headers: {
        //         "Accept": "application/json"
        //     }
        // });

        // if (!usersResponse.ok) throw new Error("فشل في جلب المستخدمين");

        // const users = await usersResponse.json();


        const isExists = usersData.some(user =>
            user.username &&
            user.username.trim().toLowerCase() === username.toLowerCase()
        );

        if (isExists) {
            alert("اسم المستخدم موجود مسبقًا، اختر اسمًا آخر");
            return;
        }


        const newAdmin = {
            username,
            password,
            role_id: 3,
            status: "pending",
            created_at: new Date().toISOString()
        };

        const addResponse = await fetch(`${API}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newAdmin)
        });

        if (!addResponse.ok) throw new Error("فشل في إضافة المستخدم");

        alert("تم إضافة المشرف بنجاح");

        document.getElementById('new-admin').value = "";
        document.getElementById('new-password').value = "";

        await fetchUsers();
        renderAll();
        openUserTab('tab-users-list', document.querySelector('[onclick*="tab-users-list"]'));

    } catch (e) {
        alert("خطأ في السيرفر");
        console.error(e);
    }
}



function getRoleName(id) {
    switch (id.toString()) {
        case '3':
            return '<span class="role-badge role-admin"><i class="bi bi-shield-lock"></i> مشرف</span>';
        case '2':
            return '<span class="role-badge role-driver"><i class="bi bi-truck"></i> سائق</span>';
        case '1':
            return '<span class="role-badge role-student"><i class="bi bi-mortarboard"></i> طالب</span>';
        default:
            return '<span class="role-badge role-unknown"><i class="bi bi-question-circle"></i> غير معروف</span>';
    }
}

function getStatusBadge(status) {
    switch (status) {
        case 'approved':
            return '<span class="student-state-active">نشط</span>';
        case 'pending':
            return '<span class="student-state-pending">قيد الانتظار</span>';
        case 'rejected':
            return '<span class="student-state-inactive">محظور</span>';
        default:
            return status;
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

    } catch (e) { alert("خطأ في التحديث"); }
}





function viewUserDetails(id) {


    const user = usersData.find(u => u.id == id);
    if (!user) return;

    const student = studentsData.find(s => s.user_id == user.id || s.id == user.id);
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
            <div><strong>الحالة</strong><p>${driver.state === "Active" ? "يعمل" : "لايعمل"}</p></div>

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
    // إيجاد المستخدم
    const user = usersData.find(u => u.id == userId);
    if (!user) return alert("المستخدم غير موجود!");

    const isStudent = (user.role_id == 3);
    const isDriver = (user.role_id == 2);
    const isAdmin = (user.role_id == 1);

    // رسالة تأكيد
    let confirmMsg = "";
    if (isStudent) {
        confirmMsg = "⚠️ هذا الحساب يعود لطالب، حذفه سيؤدي لحذف بياناته الأكاديمية تماماً. هل أنت متأكد؟";
    } else if (isDriver) {
        confirmMsg = "⚠️ هذا الحساب يعود لسائق، حذفه سيؤدي لحذف الحساب فقط. الباصات المرتبطة سيتم حذفها فقط إذا لم يكن مرتبط بسائق آخر. هل أنت متأكد؟";
    } else if (isAdmin) {
        confirmMsg = "⚠️ هذا الحساب يعود لمشرف، حذفه سيؤدي لحذف المشرف نهائياً. هل أنت متأكد؟";
    } else {
        confirmMsg = "هل أنت متأكد من حذف هذا المستخدم نهائياً؟";
    }

    if (!confirm(confirmMsg)) return;

    try {

        if (isStudent) {
            const student = studentsData.find(s => s.user_id == userId);
            if (student) {
                const studentResp = await fetch(`${API}/students/${student.id}`, { method: 'DELETE' });
                if (!studentResp.ok) console.warn(`فشل حذف بيانات الطالب ID: ${student.id}`);
            }
        }


        if (isDriver) {

            const drivers = driversData.filter(d => d.user_id == userId);

            for (const driver of drivers) {

                const driverBuses = busesData.filter(b => b.driver_id == driver.id);

                for (const bus of driverBuses) {

                    const otherDrivers = driversData.filter(d => d.id != driver.id && d.user_id != driver.user_id && d.id == bus.driver_id);
                    if (otherDrivers.length === 0) {

                        const busResp = await fetch(`${API}/buses/${bus.id}`, { method: 'DELETE' });
                        if (!busResp.ok) console.warn(`فشل حذف الباص ID: ${bus.id}`);
                    } else {
                        console.log(`الباص ID: ${bus.id} مرتبط بسائق آخر، سيتم إبقاء الباص`);
                    }
                }
            }
        }

        // -------------------
        // حذف المستخدم نفسه
        // -------------------

        const userResp = await fetch(`${API}/users/${userId}`, { method: 'DELETE' });
        if (userResp.ok) {
            alert("تم حذف المستخدم وكافة بياناته المرتبطة بنجاح.");
            await refreshAllData();

        } else {
            alert("فشل حذف المستخدم من السيرفر.");
        }

    } catch (error) {
        console.error("حدث خطأ أثناء عملية الحذف:", error);
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
                    ${studentCount} طالب
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

    if (!assignData || !routesData || !stationsData) {
        console.warn("البيانات لم تكتمل بعد");
        return;
    }

    const body = document.getElementById("assign-table");
    if (!body) return;

    body.innerHTML = "";

    const validAssigns = assignData.filter(a => a.stations && a.stations.length > 0);

    if (validAssigns.length === 0) {
        body.innerHTML = `
        <tr>
            <td colspan="3" style="text-align: center; color: #6c757d;">
            لا توجد مسارات مرتبطة بمحطات حتى الآن.
            </td>
        </tr>`;
        return;
    }

    validAssigns.forEach(a => {

        const route = routesData.find(r => r.id == a.route_id);

        const routeName = route
            ? (route.route_name || route.name || "غير معروف")
            : "غير معروف";

        const stationNames = a.stations.map(sid => {

            const s = stationsData.find(st => st.id == sid);

            return s
                ? s.station_name
                : `(محطة ${sid} غير موجودة)`;

        }).join(' <i class="bi bi-arrow-left text-muted mx-1"></i> ');

        body.innerHTML += `
        <tr>
            <td class="fw-bold text-primary">${routeName}</td>
            <td>${stationNames}</td>
            <td>
                <button class="btn-action view" onclick="viewAssignDetails(${a.id})">
                    <i class="bi bi-eye"></i>
                </button>

                <button class="btn-action edit" onclick="editAssign(${a.id})">
                    <i class="bi bi-pencil-square"></i>
                </button>

                <button class="btn-action delete" onclick="deleteAssign(${a.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
    });

}

function viewAssignDetails(id) {
    const assign = assignData.find(a => a.id == id);
    if (!assign) return;

    const route = routesData.find(r => r.id == assign.route_id);


    document.getElementById('view-route-name').innerText = route ? route.route_name : "غير معروف";
    // document.getElementById('view-route-id').innerText = `${assign.id}`;

    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = "";

    assign.stations.forEach((sid, index) => {
        const station = stationsData.find(st => st.id == sid);
        const isLast = index === assign.stations.length - 1;

        const item = document.createElement('div');
        item.className = "timeline-item";
        item.innerHTML = `
            
            <div class="timeline-content">
                <div class="station-card-mini">
                    <span class="station-order">${index + 1}</span>
                    <div class="station-text">
                        <strong>${station ? station.station_name : `محطة غير موجودة (${sid})`}</strong>
                        <p class="mb-0 small text-muted">${station ? station.description : 'لا يوجد وصف متاح'}</p>
                    </div>
                    
                </div>
            </div>
        `;
        timelineContainer.appendChild(item);
    });
    document.getElementById('modal-view-details').style.display = 'flex';

}
async function editAssign(id) {

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
        <button onclick="updateAssign(${id})" class="btn-save btn-success-color" >
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
            await fetchStations();
            await fetchRoutes();
            await fetchAssign();
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
            <button onclick="saveAssign()" class="btn-save btn-success-color">
                <i class="bi bi-hdd-fill"></i> حفظ التعيين
            </button>
            <button onclick="closeAssignModal()" class="btn-cancel">إلغاء</button>
        `;
    }
}

async function saveStation() {
    const name = document.getElementById('st-name').value.trim();
    const desc = document.getElementById('st-desc').value.trim();
    const x = document.getElementById('st-x').value.trim();
    const y = document.getElementById('st-y').value.trim();

    if (!name || !desc || !x || !y) {
        return alert("يرجى ملء جميع الحقول");
    }

    const newStation = {
        station_name: name,
        description: desc,
        location_x: parseFloat(x),
        location_y: parseFloat(y)
    };


    try {
        const stationResponse = await fetch(`${API}/stations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newStation)
        });

        if (!stationResponse.ok) {
            throw new Error("حدث خطأ أثناء إضافة المحطة");
        }


        const newNotification = {
            sender_id: Number(currentUserId),
            title: "إضافة محطة جديدة",
            message: `تمت إضافة المحطة "${name}" بنجاح. الوصف: "${desc}". الإحداثيات: X = ${x}, Y = ${y}.`,
            created_at: new Date().toISOString(),
            target_group: 3,
            type: "system_notification"
        };

        const notifResponse = await fetch(`${API}/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newNotification)
        });

        if (!notifResponse.ok) {
            console.warn("تعذر إرسال الإشعار تلقائيًا");
        }

        await fetchStations();
        await fetchNotifications();

        document.getElementById('st-name').value = "";
        document.getElementById('st-desc').value = "";
        document.getElementById('st-x').value = "";
        document.getElementById('st-y').value = "";

        alert("تمت إضافة المحطة وإرسال الإشعار بنجاح");
    } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء إضافة المحطة أو إرسال الإشعار");
    }
}

async function deleteStation(id) {
    if (!confirm("حذف هذه المحطة؟")) return;
    await fetch(`${API}/stations/${id}`, { method: "DELETE" });
    fetchStations();
}


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
        <button onclick="updateStation(${id})" class="btn-save btn-success-color">
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
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedStation)
        });

        if (res.ok) {

            alert("تم تحديث بيانات المحطة بنجاح!");

            closeStationModal();


            await fetchStations();
            await fetchAssign();

            renderStations();
            renderStationsCards();
            renderAssign();
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
        <button onclick="saveStation()" class="btn-save btn-success-color">
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

    const r = routesData.find(x => x.id == id);
    if (!r) return;
    document.getElementById('rt-name').value = r.route_name;
    const modalTitle = document.querySelector('#modal-route h3');
    modalTitle.innerHTML = `<i class="bi bi-pencil-square text-warning"></i> تعديل اسم المسار`;
    const modalActions = document.querySelector('#modal-route .modal-actions');
    modalActions.innerHTML = `
        <button onclick="updateRoute(${id})" class="btn-save btn-success-color">
            <i class="bi bi-arrow-repeat"></i> تحديث الاسم
        </button>
        <button onclick="closeRouteModal()" class="btn-cancel">إلغاء</button>
    `;

    document.getElementById('modal-route').style.display = 'flex';
}
async function updateRoute(id) {

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
        <button onclick="saveRoute()" class="btn-save btn-success-color">
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

        await fetchAssign();
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



function fillUniversities() {

    const sel = document.getElementById("unified-uni-select");

    sel.innerHTML =
        `<option value="">-- اختر جامعة --</option>
     <option value="NEW">+ إضافة جامعة جديدة</option>`+
        universitiesData.map(u =>
            `<option value="${Number(u.id)}">${u.university_name}</option>`
        ).join('');
}



function handleAcademicChange(type) {


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

}



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
    const username = document.getElementById('add-student-username').value.trim();
    const password = document.getElementById('add-student-password').value.trim();
    const studentStateElement = document.getElementById('add-student-state');
    const studentStateValue = studentStateElement ? studentStateElement.value : "Active";

    const name = document.getElementById('add-student-name').value.trim();
    const phone = document.getElementById('add-student-phone').value.trim();
    const universityNumber = document.getElementById('add-student-university-number').value.trim();
    const city = document.getElementById('add-student-city').value.trim();
    const gender = document.getElementById('add-student-gender').value;
    const universityId = Number(document.getElementById('add-student-university').value);
    const collegeId = Number(document.getElementById('add-student-college').value);
    const departmentId = Number(document.getElementById('add-student-department').value);
    const levelId = Number(document.getElementById('add-student-level').value);
    const pickupStationId = Number(document.getElementById('add-student-boarding-station').value);
    const dropoffStationId = Number(document.getElementById('add-student-alighting-station').value);

    const selectedDays = Array.from(document.querySelectorAll('.days-grid input:checked'))
        .map(cb => Number(cb.value));

    if (!username || !password || !name || !phone || !universityNumber || !city) {
        return alert("الرجاء تعبئة جميع الحقول المطلوبة");
    }

    if (!gender || !universityId || !collegeId || !departmentId || !levelId || !pickupStationId || !dropoffStationId) {
        return alert("الرجاء اختيار جميع البيانات المطلوبة");
    }

    if (selectedDays.length === 0) {
        return alert("الرجاء اختيار أيام الدوام");
    }

    let newUserId = null;

    try {
        
        const checkUsersResponse = await fetch(`${API}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const checkUsersText = await checkUsersResponse.text();
        let usersList = [];

        try {
            usersList = checkUsersText ? JSON.parse(checkUsersText) : [];
        } catch {
            usersList = [];
        }

        if (!checkUsersResponse.ok) {
            throw new Error("تعذر التحقق من أسماء المستخدمين");
        }

        const usernameExists = Array.isArray(usersList) && usersList.some(u =>
            String(u.username || "").trim().toLowerCase() === username.toLowerCase()
        );

        if (usernameExists) {
            throw new Error("اسم المستخدم موجود بالفعل، اختر اسمًا آخر");
        }

        
        const userPayload = {
            username: username,
            password: password,
            role_id: 1,
            status: "pending",
            created_at: new Date().toISOString()
        };

        const userResponse = await fetch(`${API}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userPayload)
        });

        const userRawText = await userResponse.text();
        console.log("users response status:", userResponse.status);
        console.log("users response body:", userRawText);

        let createdUser = null;
        try {
            createdUser = userRawText ? JSON.parse(userRawText) : null;
        } catch {
            createdUser = null;
        }

        if (!userResponse.ok) {
            throw new Error(
                createdUser?.message ||
                userRawText ||
                "فشل إنشاء حساب المستخدم"
            );
        }

        newUserId = createdUser?.id;

        if (!newUserId) {
            throw new Error("لم يتم إرجاع user_id من السيرفر");
        }

        
        const studentPayload = {
            user_id: newUserId,
            username: username,
            password: password,
            name: name,
            phone: phone,
            university_number: universityNumber,
            city: city,
            gender: gender,
            university_id: universityId,
            college_id: collegeId,
            department_id: departmentId,
            level_id: levelId,
            pickup_station_id: pickupStationId,
            dropoff_station_id: dropoffStationId,
            role_id: 1,
            status: "approved",
            state: studentStateValue,
            days: selectedDays
        };

        const studentResponse = await fetch(`${API}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(studentPayload)
        });

        const studentRawText = await studentResponse.text();
        console.log("students response status:", studentResponse.status);
        console.log("students response body:", studentRawText);

        let createdStudent = null;
        try {
            createdStudent = studentRawText ? JSON.parse(studentRawText) : null;
        } catch {
            createdStudent = null;
        }

        if (!studentResponse.ok) {
            // rollback حذف المستخدم إذا فشل إنشاء الطالب
            try {
                await fetch(`${API}/users/${newUserId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                });
                console.warn("تم حذف المستخدم لأن إنشاء الطالب فشل");
            } catch (deleteErr) {
                console.warn("فشل حذف المستخدم بعد فشل إنشاء الطالب", deleteErr);
            }

            throw new Error(
                createdStudent?.message ||
                studentRawText ||
                "حدث خطأ أثناء إنشاء بيانات الطالب."
            );
        }

        // 4) إنشاء الإشعار
        const newNotification = {
            sender_id: currentUserId,
            title: "تم إضافة طالب جديد",
            message: `تمت إضافة الطالب "${studentPayload.name}" بنجاح بالمستخدم رقم ${newUserId}. رقم الجامعة: ${studentPayload.university_number}, المدينة: ${studentPayload.city}.`,
            created_at: new Date().toISOString(),
            target_group: 3,
            type: "system_notification"
        };

        const notifResponse = await fetch(`${API}/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newNotification)
        });

        if (!notifResponse.ok) {
            console.warn("تعذر إرسال الإشعار تلقائيًا");
        }

        alert(`تم الحفظ بنجاح! تم ربط الطالب بالمستخدم رقم: ${newUserId}`);
        closeStudentModal();

        await fetchStudents();
        await fetchUsers();
        await fetchNotifications();

        renderStudents();
        renderUsers();

    } catch (error) {
        console.error("Error:", error);
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

}

async function editStudent(id) {
    const student = studentsData.find(s => s.id === id);
    if (!student) return alert("تعذر العثور على بيانات الطالب");

    openStudentModal();


    initForm();


    document.querySelector('#studentAddModal h3').innerText = "تعديل بيانات الطالب";

    const saveBtn = document.querySelector('.student-modal-actions .btn-success-color');
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
    const stateSelect = document.getElementById('add-student-state');

    if (student.state) {
        stateSelect.value =
            student.state.toLowerCase() === "inactive"
                ? "Inactive"
                : "Active";
    } else {
        stateSelect.value = "Active";
    }


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


    // document.getElementById('add-student-state').value = student.state;
    document.getElementById('add-student-boarding-station').value = student.pickup_station_id;
    document.getElementById('add-student-alighting-station').value = student.dropoff_station_id;


    if (Array.isArray(student.days)) {
        const daysInputs = document.querySelectorAll('#add-student-days input[type="checkbox"]');
        daysInputs.forEach(chk => {
            chk.checked = student.days.includes(Number(chk.value));
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
            await fetchStudents();


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


            await fetchUsers();
            await fetchStudents();

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
    initForm();


    document.querySelector('#studentAddModal h3').innerText = "إضافة طالب جديد";


    const saveBtn = document.querySelector('.student-modal-actions .btn-success-color');
    saveBtn.innerText = "حفظ";
    saveBtn.setAttribute('onclick', `saveStudent()`);


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


    document.getElementById('details-uni-title').innerHTML = `<i class="bi bi-info-circle"></i> إحصائيات ${uni.university_name}`;
    const tbody = document.getElementById('details-table-body');
    tbody.innerHTML = '';

    let totalUniStudents = 0;


    const uniColleges = collegesData.filter(c => c.university_id == uni.id);

    uniColleges.forEach(col => {
        const colDepts = departmentsData.filter(d => d.college_id == col.id);
        let colStudentsTotal = 0;


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

                renderDetailRow(tbody, col.college_name, colTotalRows, isFirstColRow, dept.department_name, 1, true, "-", 0, 0);
                isFirstColRow = false;
            } else {
                deptLevels.forEach(level => {

                    const levelStudents = studentsData.filter(s => s.level_id == level.id).length;
                    deptStudentsTotal += levelStudents;

                    renderDetailRow(tbody, col.college_name, colTotalRows, isFirstColRow, dept.department_name, deptRowsCount, isFirstDeptRow, level.level_name, levelStudents, dept.id);

                    isFirstColRow = false;
                    isFirstDeptRow = false;
                });
            }
            colStudentsTotal += deptStudentsTotal;


            const deptCountLabel = document.getElementById(`count-dept-${dept.id}`);
            if (deptCountLabel) deptCountLabel.innerText = `(${deptStudentsTotal} طالب)`;
        });

        totalUniStudents += colStudentsTotal;

        const colCountLabel = document.getElementById(`count-col-${col.id}`);
        if (colCountLabel) colCountLabel.innerText = `(${colStudentsTotal} طالب)`;
    });

    document.getElementById('total-uni-students').innerText = totalUniStudents;
    document.getElementById('modal-academic-details').style.display = 'flex';
}


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




async function fetchDriversAndBuses() {
    try {
        const driversResponse = await fetch(`${API}/drivers`);
        driversData = await driversResponse.json();
        const busesResponse = await fetch(`${API}/buses`);
        busesData = await busesResponse.json();
        renderDriversCards();
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

    const mergedData = busesData
        .map(bus => {

            const driver = driversData.find(d => d.id === bus.driver_id);
            if (!driver) return null;

            const user = usersData.find(u => u.id === driver.user_id);


            if (!user || user.status !== "approved") {
                return null;
            }

            return {
                driver_id: driver.id || '',
                driver_name: driver.name_driver || '',
                driver_phone: driver.phone || '',
                driver_state: driver.state || '',
                bus_number: bus.id || '',
                bus_passengers: bus.number_passengers || '',
                bus_fuel: bus.type_fuel || ''
            };

        })
        .filter(item => item !== null);


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
            stateText = 'يعمل';
            stateClass = 'driver-state-active';
        } else if (item.driver_state.toLowerCase() === 'inactive') {
            stateText = 'لا يعمل';
            stateClass = 'driver-state-inactive';
        }

        row.innerHTML = `
            <td>${item.driver_id}</td>
            <td>${item.driver_name}</td>
            <td>${item.driver_phone}</td>
            <td><span class="${stateClass}">${stateText}</span></td>
            <td>${item.bus_passengers}</td>
            <td>${item.bus_fuel}</td>
            <td>
                <button type="button" class="btn-action view" onclick="showDriverBusDetails(${item.bus_number})">
                    <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn-action edit" onclick="editDriverBus(${item.driver_id})">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button type="button" class="btn-action delete" onclick="deleteDriver(${item.driver_id})">
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

    document.getElementById('modal-title').innerText = "إضافة سائق جديد";

    const saveBtn = document.querySelector("#driverBusAddModal .btn-success-color");

    saveBtn.innerText = "حفظ البيانات";

    saveBtn.setAttribute("onclick", "saveDriverBus()");

    const usernameInput = document.getElementById('add-driver-username');
    usernameInput.value = "";
    usernameInput.disabled = false;

    const passwordInput = document.getElementById('add-driver-password');
    passwordInput.value = "";
    passwordInput.disabled = false;
    passwordInput.style.display = "block";

    document.getElementById('add-driver-name').value = "";
    document.getElementById('add-driver-phone').value = "";
    document.getElementById('add-driver-state').value = "Active";

    document.getElementById('add-bus-passengers').value = "";
    document.getElementById('add-bus-fuel-type').value = "";
}

function closeDriverBusModal() {

    document.getElementById('driverBusAddModal').style.display = 'none';

    const usernameInput = document.getElementById('add-driver-username');
    usernameInput.disabled = false;

    const passwordInput = document.getElementById('add-driver-password');
    passwordInput.disabled = false;
    passwordInput.style.display = "block";

    const saveBtn = document.querySelector("#driverBusAddModal .btn-success-color");
    saveBtn.innerText = "حفظ البيانات";
    saveBtn.setAttribute("onclick", "saveDriverBus()");
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
        return alert("يرجى ملء جميع الحقول الأساسaaية للسائق والباص");
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

        fetchDriversAndBuses();
        await fetchUsers();
        renderAll();

    } catch (error) {
        console.error("Error:", error);
        alert("فشل في إكمال العملية: " + error.message);
    }
}


function showDriverBusDetails(busId) {



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
                    <p>${driver?.state === "Active" ? "يعمل" : "لايعمل"}</p>
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
                   <p>${user?.created_at ? formatDate(user.created_at) : "-"}</p>
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

let editingDriverId = null;
let editingBusId = null;

function editDriverBus(driverId) {

    const driver = driversData.find(d => d.id === driverId);
    if (!driver) return alert("تعذر العثور على بيانات السائق");

    const bus = busesData.find(b => b.driver_id === driverId);
    const user = usersData.find(u => u.id === driver.user_id);

    openDriverBusModal();

    document.getElementById('modal-title').innerText = "تعديل بيانات السائق";

    const saveBtn = document.querySelector("#driverBusAddModal .btn-success-color");

    saveBtn.innerText = "تحديث البيانات";

    saveBtn.setAttribute("onclick", `updateDriverBus(${driverId}, ${bus?.id})`);

    const usernameInput = document.getElementById('add-driver-username');
    usernameInput.value = user?.username || "";
    usernameInput.disabled = true;

    const passwordInput = document.getElementById('add-driver-password');
    passwordInput.value = "";
    passwordInput.disabled = true;
    passwordInput.style.display = "none";

    document.getElementById('add-driver-name').value = driver.name_driver || "";
    document.getElementById('add-driver-phone').value = driver.phone || "";
    document.getElementById('add-driver-state').value = driver.state || "Active";

    document.getElementById('add-bus-passengers').value = bus?.number_passengers || "";
    document.getElementById('add-bus-fuel-type').value = bus?.type_fuel || "";
}
async function updateDriverBus(driverId, busId) {

    try {

        const driverPayload = {
            name_driver: document.getElementById('add-driver-name').value,
            phone: document.getElementById('add-driver-phone').value,
            state: document.getElementById('add-driver-state').value
        };

        const driverRes = await fetch(`${API}/drivers/${driverId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(driverPayload)
        });

        if (!driverRes.ok) throw new Error("فشل تحديث بيانات السائق");


        const busPayload = {
            number_passengers: Number(document.getElementById('add-bus-passengers').value),
            type_fuel: document.getElementById('add-bus-fuel-type').value
        };

        const busRes = await fetch(`${API}/buses/${busId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(busPayload)
        });

        if (!busRes.ok) throw new Error("فشل تحديث بيانات الباص");

        alert("تم تحديث البيانات بنجاح");

        closeDriverBusModal();

        await fetchUsers();
        await fetchDriversAndBuses();
        renderAll();


    } catch (err) {

        console.error(err);
        alert("حدث خطأ أثناء التحديث");

    }

}

async function deleteDriver(id) {

    if (!confirm("هل أنت متأكد من استبعاد هذا السائق؟ لن يتم حذف البيانات ولكن سيتم رفض حسابه ومنعه من الظهور.")) return;

    const driver = driversData.find(d => d.id === id);

    if (!driver || !driver.user_id) {
        alert("خطأ: لم يتم العثور على حساب مستخدم مرتبط بهذا السائق.");
        return;
    }

    try {

        const response = await fetch(`${API}/users/${driver.user_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: "rejected"
            })
        });

        if (response.ok) {
            alert("تم استبعاد السائق بنجاح.");

            await fetchUsers();
            await fetchDriversAndBuses();

        } else {
            alert("فشل تحديث حالة المستخدم على السيرفر.");
        }

    } catch (error) {
        console.error("Error during soft delete:", error);
        alert("حدث خطأ في الاتصال بالسيرفر.");
    }
}


// jump 
// document.getElementById('login-page').style.display = "none";
// document.getElementById('main-wrapper').style.display = "block";


// await fetchUsers();
// showPage('sec-home');


const modal = document.getElementById("notifyModal");

function openNotifyModal() {
    modal.style.display = "flex";
}

function closeNotifyModal() {
    modal.style.display = "none";
}

window.onclick = function (e) {
    if (e.target == modal) {
        modal.style.display = "none";
    }
}



function renderStationsCards() {
    const containercc = document.getElementById("stations-cards44");
    if (!containercc) return;

    let html = "";

    stationsData.forEach(s => {
        const studentCount = studentsData.filter(student =>
            student.pickup_station_id === s.id ||
            student.dropoff_station_id === s.id
        ).length;


        html += `
        <div class="station-card44" 
             onclick="loadMap(${s.location_x}, ${s.location_y})" 
             style="cursor: pointer; transition: transform 0.2s;">
            
            <div class="station-header44">
                <h4 class="station-title44">${s.station_name}</h4>
                <span class="station-id44">#${s.id}</span>
            </div>

            <div class="station-body44">
                <p class="station-desc44">${s.description || 'لا يوجد وصف لهذه المحطة'}</p>

                <div class="station-location44">
                    <span><i class="bi bi-geo-alt"></i> X: ${s.location_x}</span>
                    <span><i class="bi bi-geo-alt"></i> Y: ${s.location_y}</span>
                </div>

                <div class="station-students44">
                    <i class="bi bi-people-fill"></i> ${studentCount} طالب مسجل
                </div>
            </div>
        </div>
        `;
    });

    containercc.innerHTML = html;
}


function renderDriversCards() {
    const container = document.getElementById('drivers-cards-container44');
    if (!container) return;


    const searchText = document.getElementById('driver-search-input')?.value.toLowerCase() || "";


    const filteredData = busesData
        .map(bus => {
            const driver = driversData.find(d => d.id === bus.driver_id);
            if (!driver) return null;

            const user = usersData.find(u => u.id === driver.user_id);



            if (!user || user.status !== "approved" || driver.state.toLowerCase() !== "active") {
                return null;
            }

            return {
                driver_id: driver.id,
                driver_name: driver.name_driver,
                driver_phone: driver.phone,
                driver_state: driver.state,
                bus_number: bus.id,
                bus_passengers: bus.number_passengers,
                bus_fuel: bus.type_fuel
            };
        })
        .filter(item => {

            if (item === null) return false;
            return item.driver_name.toLowerCase().includes(searchText) ||
                item.driver_phone.includes(searchText);
        });


    let html = "";
    filteredData.forEach(item => {
        html += `
        <div class="station-card44">
            <div class="station-header44">
                <h4 class="station-title44">${item.driver_name}</h4>
                <span class="station-id44">#${item.driver_id}</span>
            </div>

            <div class="station-body44">
                <div class="driver-info-row">
                    <span class="bus-meta"><i class="bi bi-bus-front"></i> حافلة: ${item.bus_number}</span>
                    <span class="bus-meta"><i class="bi bi-fuel-pump"></i> ${item.bus_fuel}</span>
                </div>

                <div class="station-location44" style="margin-bottom: 10px;">
                    <span><i class="bi bi-people"></i> السعة: ${item.bus_passengers} راكب</span>
                    <span style="color: #198754;">
                        <i class="bi bi-circle-fill" style="font-size: 8px;"></i> يعمل حالياً
                    </span>
                </div>

                <div class="contact-actions44">
                    <a href="tel:${item.driver_phone}" class="contact-link call">
                        <i class="bi bi-telephone-fill"></i> اتصال
                    </a>
                    <a href="sms:${item.driver_phone}" class="contact-link sms">
                        <i class="bi bi-chat-left-text-fill"></i> رسالة
                    </a>
                </div>
            </div>
        </div>
        `;
    });


    container.innerHTML = html || '<p style="text-align:center; color:#888; padding:20px;">لا يوجد سائقين متاحين حالياً</p>';
}

function renderStudentsCards() {
    const container = document.getElementById('students-cards-container44');
    if (!container) return;

    let html = "";


    const activeStudents = studentsData.filter(s => s.state === 'active');

    console.table(activeStudents);

    activeStudents.forEach(s => {

        const pickupStation = stationsData.find(st => st.id === s.pickup_station_id)?.station_name || 'غير محدد';
        const dropoffStation = stationsData.find(st => st.id === s.dropoff_station_id)?.station_name || 'غير محدد';

        let statusColor = '#198754';
        let statusText = 'نشط';

        html += `
        <div class="station-card44">
            <div class="station-header44">
                <h4 class="station-title44">${s.name}</h4>
                <span class="station-id44">ID: ${s.id}</span>
            </div>

            <div class="station-body44">
                <div class="student-info-grid">
                    <span class="info-tag"><i class="bi bi-geo-alt"></i> ${s.city}</span>
                </div>

                <div class="student-info-grid">
                    <span class="info-tag"><i class="bi bi-gender-ambiguous"></i> ${s.gender}</span>
                    <span style="color: ${statusColor}; font-weight: bold; font-size: 12px;">
                        <i class="bi bi-circle-fill" style="font-size: 8px;"></i> ${statusText}
                    </span>
                </div>

                <div class="route-box">
                    <div class="route-item">
                        <i class="bi bi-arrow-up-circle text-primary"></i>
                        <span>صعود: <strong>${pickupStation}</strong></span>
                    </div>
                    <div class="route-item">
                        <i class="bi bi-arrow-down-circle text-danger"></i>
                        <span>نزول: <strong>${dropoffStation}</strong></span>
                    </div>
                </div>

                <div class="contact-actions44">
                    <a href="tel:${s.phone}" class="contact-link call">
                        <i class="bi bi-telephone-fill"></i> اتصال
                    </a>
                    <a href="sms:${s.phone}" class="contact-link sms">
                        <i class="bi bi-chat-dots-fill"></i> رسالة
                    </a>
                </div>
            </div>
        </div>
        `;
    });

    container.innerHTML = html || '<p style="text-align:center; padding:20px;">لا يوجد طلاب نشطين</p>';
}




function renderReports() {
    const container = document.getElementById('reports-container');
    if (!container) return;
    container.innerHTML = "";


    const totalStudents = studentsData.length;
    const totalMaleStudents = studentsData.filter(s => s.gender === 'ذكر').length;
    const totalFemaleStudents = studentsData.filter(s => s.gender === 'أنثى').length;
    const activeStudents = studentsData.filter(s => s.state.toLowerCase() === 'active').length;

    const totalSupervisors = usersData.filter(u => u.role_id === 3).length;
    const totalStations = stationsData.length;
    const totalRoutes = routesData.length;


    const approvedDrivers = driversData.filter(driver => {
        const user = usersData.find(u => u.id === driver.user_id);
        return user && user.status === "approved";
    });

    const totalDrivers = approvedDrivers.length;
    const activeDrivers = approvedDrivers.filter(d => d.state.toLowerCase() === 'active').length;


    const approvedBuses = busesData.filter(bus => approvedDrivers.some(d => d.id === bus.driver_id));
    const petrolCars = approvedBuses.filter(b => b.type_fuel === 'بترول').length;
    const dieselCars = approvedBuses.filter(b => b.type_fuel === 'ديزل').length;
    const gasCars = approvedBuses.filter(b => b.type_fuel === 'غاز').length;

    const cardsHTML = `
<div class="reports-cards-grid">
    <div class="report-card"><h4>الطلاب الكلي</h4><p>${totalStudents}</p></div>
    <div class="report-card"><h4>الطلاب الذكور</h4><p>${totalMaleStudents}</p></div>
    <div class="report-card"><h4>الطلاب الإناث</h4><p>${totalFemaleStudents}</p></div>
    <div class="report-card"><h4>الطلاب النشطين</h4><p>${activeStudents}</p></div>
    
    
    <div class="report-card"><h4>المشرفين</h4><p>${totalSupervisors}</p></div>
    <div class="report-card"><h4>المحطات</h4><p>${totalStations}</p></div>
    <div class="report-card"><h4>المسارات</h4><p>${totalRoutes}</p></div>
   
    <div class="report-card"><h4>السائقين الكلي</h4><p>${totalDrivers}</p></div>
    <div class="report-card"><h4>السائقين العاملين</h4><p>${activeDrivers}</p></div>
    <div class="report-card"><h4>باصات بترول</h4><p>${petrolCars}</p></div>
    <div class="report-card"><h4>باصات الديزل</h4><p>${dieselCars}</p></div>
    <div class="report-card"><h4>باصات الغاز</h4><p>${gasCars}</p></div>
</div>
`;

    container.innerHTML += cardsHTML;


    // ---------- 2. عدد الطلاب في كل محطة ----------

    let stationsTableHTML = `
<h3>عدد الطلاب في كل محطة</h3>

<table class="reports-table">

<thead>
<tr>
<th>المحطة</th>
<th>طلاب الصعود</th>
<th>طلاب النزول</th>
</tr>
</thead>

<tbody>
`;

    stationsData.forEach(s => {

        // عدد طلاب الصعود من المحطة
        const pickupCount = studentsData.filter(
            student => student.pickup_station_id === s.id
        ).length;

        // عدد طلاب النزول في المحطة
        const dropoffCount = studentsData.filter(
            student => student.dropoff_station_id === s.id
        ).length;

        stationsTableHTML += `
    <tr>
        <td>${s.station_name}</td>
        <td>${pickupCount}</td>
        <td>${dropoffCount}</td>
    </tr>
    `;
    });

    stationsTableHTML += "</tbody></table>";

    container.innerHTML += stationsTableHTML;



    // ---------- 6. أسماء الطلاب حسب محطات النزول ----------

    let dropoffStationsStudentsHTML = `
<h3>أسماء الطلاب حسب محطات النزول</h3>
<div class="students-days-cards-wrap44">
`;

    const dropoffStationsWithStudents = stationsData.filter(station =>
        studentsData.some(student => student.dropoff_station_id === station.id)
    );

    dropoffStationsWithStudents.forEach(station => {

        const dropoffStudents = studentsData.filter(student =>
            student.dropoff_station_id === station.id
        );

        const namesHTML = dropoffStudents.map(student => `
        <div class="day-student-name44">
            <i class="bi bi-person-fill"></i>
            <span>${student.name}</span>
        </div>
    `).join("");

        dropoffStationsStudentsHTML += `
        <div class="students-day-card44">
            <div class="students-day-header44">
                <h4>${station.station_name}</h4>
                <span class="students-day-count44">${dropoffStudents.length} طالب</span>
            </div>

            <div class="students-day-list44">
                ${namesHTML}
            </div>
        </div>
    `;
    });

    dropoffStationsStudentsHTML += `</div>`;

    container.innerHTML += dropoffStationsStudentsHTML;

    // ---------- 5. أسماء الطلاب حسب محطات الصعود ----------

    let pickupStationsStudentsHTML = `
<h3>أسماء الطلاب حسب محطات الصعود</h3>
<div class="students-days-cards-wrap44">
`;

    const pickupStationsWithStudents = stationsData.filter(station =>
        studentsData.some(student => student.pickup_station_id === station.id)
    );

    pickupStationsWithStudents.forEach(station => {

        const pickupStudents = studentsData.filter(student =>
            student.pickup_station_id === station.id
        );

        const namesHTML = pickupStudents.map(student => `
        <div class="day-student-name44">
            <i class="bi bi-person-fill"></i>
            <span>${student.name}</span>
        </div>
    `).join("");

        pickupStationsStudentsHTML += `
        <div class="students-day-card44">
            <div class="students-day-header44">
                <h4>${station.station_name}</h4>
                <span class="students-day-count44">${pickupStudents.length} طالب</span>
            </div>

            <div class="students-day-list44">
                ${namesHTML}
            </div>
        </div>
    `;
    });

    pickupStationsStudentsHTML += `</div>`;

    container.innerHTML += pickupStationsStudentsHTML;

    // ---------- 5. أسماء الطلاب حسب محطات الصعود ----------
    // ---------- 5. أسماء الطلاب حسب محطات الصعود ----------

    // ---------- 3. عدد الطلاب لكل يوم ----------

    // ---------- 3. عدد الطلاب لكل يوم (بدون الجمعة) ----------

    // لاحظ أن السبت يبدأ من index = 1 في النظام
    const daysOfWeek = [
        { name: "السبت", index: 1 },
        { name: "الأحد", index: 2 },
        { name: "الإثنين", index: 3 },
        { name: "الثلاثاء", index: 4 },
        { name: "الأربعاء", index: 5 },
        { name: "الخميس", index: 6 }
    ];

    // حساب عدد الطلاب لكل يوم
    const daysCount = daysOfWeek.map(day => {
        return studentsData.filter(s =>
            Array.isArray(s.days) && s.days.includes(day.index)
        ).length;
    });

    const maxValue = Math.max(...daysCount, 1);
    const minValue = Math.min(...daysCount);

    let chartHTML = `
<h3>عدد الطلاب لكل يوم</h3>

<div class="days-chart-container">
`;

    daysOfWeek.forEach((day, i) => {

        const value = daysCount[i];

        const heightPercent = (value / maxValue) * 100;

        // تحديد اللون حسب العدد
        let color = "#28a745"; // أخضر (الأقل)

        if (value === maxValue) {
            color = "#dc3545"; // أحمر (الأكثر)
        }
        else if (value > (maxValue / 2)) {
            color = "#ffc107"; // أصفر (متوسط)
        }

        chartHTML += `
        <div class="day-column-wrapper">

            <div class="day-count">${value}</div>

            <div class="day-bar"
                 style="height:${heightPercent}%; background:${color}">
            </div>

            <div class="day-label">${day.name}</div>

        </div>
    `;
    });

    chartHTML += `</div>`;

    container.innerHTML += chartHTML;

    // ---------- 4. أسماء الطلاب لكل يوم ----------

    let studentsPerDayHTML = `
    <h3>أسماء الطلاب حسب الأيام</h3>
    <div class="students-days-cards-wrap44">
    `;

    daysOfWeek.forEach(day => {

        const dayStudents = studentsData.filter(s =>
            Array.isArray(s.days) && s.days.includes(day.index)
        );

        let namesHTML = "";

        if (dayStudents.length === 0) {
            namesHTML = `<div class="day-student-empty44">لا يوجد طلاب في هذا اليوم</div>`;
        } else {
            namesHTML = dayStudents.map(student => `
                <div class="day-student-name44">
                    <i class="bi bi-person-fill"></i>
                    <span>${student.name}</span>
                </div>
            `).join("");
        }

        studentsPerDayHTML += `
            <div class="students-day-card44">
                <div class="students-day-header44">
                    <h4>${day.name}</h4>
                    <span class="students-day-count44">${dayStudents.length} طالب</span>
                </div>

                <div class="students-day-list44">
                    ${namesHTML}
                </div>
            </div>
        `;
    });

    studentsPerDayHTML += `</div>`;

    container.innerHTML += studentsPerDayHTML;
    // ---------- 4. مقارنة الطلاب النشطين: ذكور / إناث ----------

    const activeStudentsOnly = studentsData.filter(s =>
        String(s.state).toLowerCase() === "active"
    );

    const genderStats = [
        {
            name: "الذكور",
            count: activeStudentsOnly.filter(s => s.gender === "ذكر").length
        },
        {
            name: "الإناث",
            count: activeStudentsOnly.filter(s => s.gender === "أنثى").length
        }
    ];

    const maxGenderValue = Math.max(...genderStats.map(g => g.count), 1);

    let genderChartHTML = `
    <h3>مقارنة عدد الطلاب : الذكور والإناث</h3>

    <div class="days-chart-container gender-chart-container44">
    `;

    genderStats.forEach(item => {

        const heightPercent = (item.count / maxGenderValue) * 100;

        let color = item.name === "الذكور" ? "#0d6efd" : "#e83e8c";

        genderChartHTML += `
            <div class="day-column-wrapper gender-column-wrapper44">

                <div class="day-count">${item.count}</div>

                <div class="day-bar gender-bar44"
                     style="height:${heightPercent}%; background:${color}">
                </div>

                <div class="day-label">${item.name}</div>

            </div>
        `;
    });

    genderChartHTML += `</div>`;

    container.innerHTML += genderChartHTML;

    // ---------- 5. مقارنة السيارات العاملة حسب نوع الوقود ----------

    // السائقون المقبولون والعاملون فقط
    const approvedActiveDrivers = driversData.filter(driver => {
        const user = usersData.find(u => u.id === driver.user_id);
        return user &&
            user.status === "approved" &&
            String(driver.state).toLowerCase() === "active";
    });

    // الحافلات المرتبطة بهؤلاء السائقين فقط
    const activeApprovedBuses = busesData.filter(bus =>
        approvedActiveDrivers.some(driver => driver.id === bus.driver_id)
    );

    const fuelStats = [
        {
            name: "بترول",
            count: activeApprovedBuses.filter(bus => bus.type_fuel === "بترول").length,
            color: "#dc3545"
        },
        {
            name: "ديزل",
            count: activeApprovedBuses.filter(bus => bus.type_fuel === "ديزل").length,
            color: "#ffc107"
        },
        {
            name: "غاز",
            count: activeApprovedBuses.filter(bus => bus.type_fuel === "غاز").length,
            color: "#198754"
        }
    ];

    const maxFuelValue = Math.max(...fuelStats.map(f => f.count), 1);

    let fuelChartHTML = `
<h3>مقارنة الباصات حسب نوع الوقود</h3>

<div class="days-chart-container gender-chart-container44">
`;

    fuelStats.forEach(item => {

        const heightPercent = (item.count / maxFuelValue) * 100;

        fuelChartHTML += `
        <div class="day-column-wrapper gender-column-wrapper44">

            <div class="day-count">${item.count}</div>

            <div class="day-bar gender-bar44"
                 style="height:${heightPercent}%; background:${item.color}">
            </div>

            <div class="day-label">${item.name}</div>

        </div>
    `;
    });

    fuelChartHTML += `</div>`;

    container.innerHTML += fuelChartHTML;

    // ---------- 4. الإحصائيات حسب الهيكل الأكاديمي ----------
    let academicHTML = `<h3>بيانات الجامعات </h3>
<table class="reports-table">
    <thead>
        <tr>
            <th>الجامعة</th>
            <th>الكلية</th>
            <th>القسم</th>
            <th>المستوى</th>
            <th>عدد الطلاب</th>
        </tr>
    </thead>
    <tbody>
`;

    universitiesData.forEach(uni => {
        // طلاب الجامعة
        const uniStudents = studentsData.filter(s => s.university_id === uni.id);
        if (uniStudents.length === 0) return; // تخطي الجامعات بدون طلاب

        // الكليات بالجامعة التي تحتوي على طلاب
        const uniColleges = collegesData
            .filter(c => c.university_id === uni.id)
            .filter(c => studentsData.some(s => s.college_id === c.id));

        let uniRowSpan = 0;
        uniColleges.forEach(col => {
            const colDepartments = departmentsData
                .filter(d => d.college_id === col.id)
                .filter(d => studentsData.some(s => s.department_id === d.id));

            if (colDepartments.length === 0) {
                uniRowSpan++;
            } else {
                colDepartments.forEach(dept => {
                    const deptLevels = levelsData
                        .filter(l => l.department_id === dept.id)
                        .filter(l => studentsData.some(s => s.level_id === l.id));
                    uniRowSpan += deptLevels.length || 1;
                });
            }
        });
        if (uniRowSpan === 0) uniRowSpan = 1;

        let uniPrinted = false;

        uniColleges.forEach(col => {
            const colStudents = uniStudents.filter(s => s.college_id === col.id);

            const colDepartments = departmentsData
                .filter(d => d.college_id === col.id)
                .filter(d => colStudents.some(s => s.department_id === d.id));

            let colRowSpan = 0;
            colDepartments.forEach(dept => {
                const deptLevels = levelsData
                    .filter(l => l.department_id === dept.id)
                    .filter(l => colStudents.some(s => s.level_id === l.id));
                colRowSpan += deptLevels.length || 1;
            });
            if (colRowSpan === 0) colRowSpan = 1;

            let colPrinted = false;

            colDepartments.forEach(dept => {
                const deptStudents = colStudents.filter(s => s.department_id === dept.id);

                const deptLevels = levelsData
                    .filter(l => l.department_id === dept.id)
                    .filter(l => deptStudents.some(s => s.level_id === l.id));

                let deptRowSpan = deptLevels.length || 1;
                let deptPrinted = false;

                deptLevels.forEach(level => {
                    const levelStudents = deptStudents.filter(s => s.level_id === level.id);
                    academicHTML += `<tr>`;
                    if (!uniPrinted) {
                        academicHTML += `<td rowspan="${uniRowSpan}">${uni.university_name} (${uniStudents.length})</td>`;
                        uniPrinted = true;
                    }
                    if (!colPrinted) {
                        academicHTML += `<td rowspan="${colRowSpan}">${col.college_name} (${colStudents.length})</td>`;
                        colPrinted = true;
                    }
                    if (!deptPrinted) {
                        academicHTML += `<td rowspan="${deptRowSpan}">${dept.department_name} (${deptStudents.length})</td>`;
                        deptPrinted = true;
                    }
                    academicHTML += `<td>${level.level_name} (${levelStudents.length})</td>
                                <td>${levelStudents.length}</td>
                            </tr>`;
                });
            });
        });
    });

    academicHTML += `</tbody></table>`;

    container.innerHTML += academicHTML;



    // ---------- 7. أسماء الطلاب حسب الجامعات ----------

    let universitiesStudentsHTML = `
<h3>أسماء الطلاب حسب الجامعات</h3>
<div class="students-days-cards-wrap44">
`;

    const universitiesWithStudents = universitiesData.filter(university =>
        studentsData.some(student => student.university_id === university.id)
    );

    universitiesWithStudents.forEach(university => {

        const universityStudents = studentsData.filter(student =>
            student.university_id === university.id
        );

        const namesHTML = universityStudents.map(student => `
        <div class="day-student-name44">
            <i class="bi bi-person-fill"></i>
            <span>${student.name}</span>
        </div>
    `).join("");

        universitiesStudentsHTML += `
        <div class="students-day-card44">
            <div class="students-day-header44">
                <h4>${university.university_name}</h4>
                <span class="students-day-count44">${universityStudents.length} طالب</span>
            </div>

            <div class="students-day-list44">
                ${namesHTML}
            </div>
        </div>
    `;
    });

    universitiesStudentsHTML += `</div>`;

    container.innerHTML += universitiesStudentsHTML;


    // ---------- 8. أسماء الطلاب حسب الأقسام ----------

    let departmentsStudentsHTML = `
<h3>أسماء الطلاب حسب الأقسام</h3>
<div class="students-days-cards-wrap44">
`;

    const departmentsWithStudents = departmentsData.filter(dept =>
        studentsData.some(student => student.department_id === dept.id)
    );

    departmentsWithStudents.forEach(dept => {

        const deptStudents = studentsData.filter(student =>
            student.department_id === dept.id
        );

        const namesHTML = deptStudents.map(student => `
        <div class="day-student-name44">
            <i class="bi bi-person-fill"></i>
            <span>${student.name}</span>
        </div>
    `).join("");

        departmentsStudentsHTML += `
        <div class="students-day-card44">
            <div class="students-day-header44">
                <h4>${dept.department_name}</h4>
                <span class="students-day-count44">${deptStudents.length} طالب</span>
            </div>

            <div class="students-day-list44">
                ${namesHTML}
            </div>
        </div>
    `;
    });

    departmentsStudentsHTML += `</div>`;

    container.innerHTML += departmentsStudentsHTML;

}

function openReportTab(tabId, btn) {

    const section = document.getElementById('sec-reports');
    if (!section) return;

    // إخفاء جميع التبويبات
    section.querySelectorAll('.tab-content')
        .forEach(tab => tab.classList.remove('active'));

    // إظهار التبويب المطلوب
    const targetTab = section.querySelector(`#${tabId}`);
    if (targetTab) targetTab.classList.add('active');

    // إزالة التفعيل من الأزرار
    section.querySelectorAll('.tab-btn')
        .forEach(b => b.classList.remove('active-tab'));

    // تفعيل الزر الحالي
    btn.classList.add('active-tab');

    // إعادة رسم المخططات بعد ظهور القسم
    setTimeout(() => {
        if (typeof renderReports === "function") {
            renderReports();
        }
    }, 50);

}

function renderDaysChart(data, labels) {

    const canvas = document.getElementById("daysChartCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 300;

    const padding = 40;

    const maxValue = Math.max(...data, 1);

    const barWidth = (width - padding * 2) / data.length * 0.6;
    const gap = (width - padding * 2) / data.length;

    ctx.clearRect(0, 0, width, height);

    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    data.forEach((value, i) => {

        const x = padding + i * gap + gap / 2;

        const barHeight = (value / maxValue) * (height - 100);

        const y = height - padding - barHeight;

        // رسم العمود
        ctx.fillStyle = "#0d6efd";
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);

        // العدد فوق العمود
        ctx.fillStyle = "#333";
        ctx.fillText(value, x, y - 5);

        // اسم اليوم
        ctx.fillStyle = "#555";
        ctx.fillText(labels[i], x, height - 15);

    });

}

/////////////nafigations
/////////////nafigations
/////////////nafigations
/////////////nafigations
/////////////nafigations



function truncateTitle(text, maxLength = 20) { if (!text) return ""; if (text.length <= maxLength) return text; return text.substring(0, maxLength) + "..."; }
function truncateMessage(text, maxLength = 60) { if (!text) return ""; if (text.length <= maxLength) return text; return text.substring(0, maxLength) + "..."; }

let lat = 14.775823;
let lng = 49.372572;

function loadMap(newLat = lat, newLng = lng) {

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const mapUrl = `https://maps.google.com/maps?q=${newLat},${newLng}&z=17&output=embed`;

    let iframe = mapContainer.querySelector("iframe");

    if (!iframe) {

        iframe = document.createElement("iframe");

        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        iframe.style.borderRadius = "8px";

        iframe.loading = "lazy";

        mapContainer.appendChild(iframe);
    }

    iframe.src = mapUrl;
}


document.addEventListener("DOMContentLoaded", function () {
    loadMap(lat, lng);
});
function openNotificationTab(tabId, btn) {

    const parent = document.getElementById("sec-notifications");

    parent.querySelectorAll(".tab-content")
        .forEach(t => t.classList.remove("active"));

    parent.querySelectorAll(".tab-btn")
        .forEach(b => b.classList.remove("active-tab"));

    document.getElementById(tabId).classList.add("active");
    btn.classList.add("active-tab");

    if (tabId === "tab-notifications-all") {
        renderNotifications();
    }

    if (tabId === "tab-notifications-system") {
        renderSystemNotifications();
    }
}


function renderNotifications() {

    const container = document.getElementById("notifications-container");
    if (!container) return;

    container.innerHTML = "";

    const targetFilter = document.getElementById("filter-target").value;
    const typeFilter = document.getElementById("filter-type").value;
    const timeFilter = document.getElementById("filter-time").value;

    const targetMap = {
        students: 1,
        drivers: 2,
        supervisors: 3
    };

    let filteredNotifications = notificationsData.filter(n => {

        let targetMatch = true;
        let typeMatch = true;

        if (targetFilter !== "all") {
            targetMatch = n.target_group === targetMap[targetFilter];
        }

        if (typeFilter !== "all") {
            typeMatch = n.type === typeFilter;
        }

        return targetMatch && typeMatch;
    });


    // ترتيب حسب الوقت
    if (timeFilter === "desc") {
        filteredNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (timeFilter === "asc") {
        filteredNotifications.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }


    filteredNotifications.forEach(n => {

        let typeColor = "#0d6efd";
        let typeLabel = "إشعار";
        let icon = "bi-bell-fill";

        switch (n.type) {
            case 'urgent_notification':
                typeColor = "#dc3545";
                typeLabel = "عاجل";
                icon = "bi-lightning-fill";
                break;

            case 'absence_alert':
                typeColor = "#fd7e14";
                typeLabel = "غياب";
                icon = "bi-person-x-fill";
                break;

            case 'warning':
                typeColor = "#ffc107";
                typeLabel = "تحذير";
                icon = "bi-exclamation-triangle-fill";
                break;

            case 'system_notification':
                typeColor = "#6f42c1";
                typeLabel = "نظام";
                icon = "bi-gear-fill";
                break;

            case 'alert':
                typeColor = "#17a2b8";
                typeLabel = "تنبيه";
                icon = "bi-info-circle-fill";
                break;
        }

        const targetLabels = {
            1: "الطلاب",
            2: "السائقين",
            3: "المشرفين"
        };

        let targetText = targetLabels[n.target_group] || "الكل";

        container.innerHTML += `
        <div class="station-card44"
     onclick="openNotificationDetails(${n.id})"
     style="border-top: 5px solid ${typeColor};border-radius: 6px; cursor:pointer;">
            <div class="station-header44">
                <h4 class="station-title44" style="color: ${typeColor};">
                    <i class="bi ${icon}"></i> ${truncateTitle(n.title)}
                </h4>
                <span class="station-id44">Sender: #${n.sender_id}</span>
            </div>

            <div class="station-body44">
                <p class="station-desc44" style="font-size: 14px; color: #333; font-weight: 500;">
                ${truncateMessage(n.message)}</p>

                <div class="station-location44" style="margin-top: 8px; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; color: #777;">
                        <i class="bi bi-clock"></i>
                        ${formatDate(n.created_at)}
                    </span>
                </div>
            </div>

            <div style="display: flex; justify-content:space-between; margin-top: 5px;">
                <span style="background: ${typeColor}15; color: ${typeColor}; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: bold; border: 1px solid ${typeColor}44;">
                    ${typeLabel}
                </span>

                <span class="target-badge44 target-${n.target_group}">
                ${targetText}
                </span>
            </div>
        </div>
        `;
    });

}

function renderNotificationsCarts() {

    const container = document.getElementById("notifications-cards-container");
    if (!container) return;

    let html = "";

    notificationsData.forEach(n => {

        let typeColor = "#0d6efd";
        let typeLabel = "إشعار";
        let icon = "bi-bell-fill";

        switch (n.type) {

            case "urgent_notification":
                typeColor = "#dc3545";
                typeLabel = "عاجل";
                icon = "bi-lightning-fill";
                break;

            case "absence_alert":
                typeColor = "#fd7e14";
                typeLabel = "غياب";
                icon = "bi-person-x-fill";
                break;

            case "warning":
                typeColor = "#ffc107";
                typeLabel = "تحذير";
                icon = "bi-exclamation-triangle-fill";
                break;

            case "system_notification":
                typeColor = "#6f42c1";
                typeLabel = "نظام";
                icon = "bi-gear-fill";
                break;

            case "alert":
                typeColor = "#17a2b8";
                typeLabel = "تنبيه";
                icon = "bi-info-circle-fill";
                break;
        }

        const targetLabels = {
            1: "الطلاب",
            2: "السائقين",
            3: "المشرفين"
        };

        let targetText = targetLabels[n.target_group] || "الكل";

        html += `
        <div class="station-card44" style="border-top:4px solid ${typeColor}">

            <div class="station-header44">

                <h4 class="station-title44" style="color:${typeColor}">
                    <i class="bi ${icon}"></i>
                    ${n.title}
                </h4>

                <span class="station-id44">
                    Sender #${n.sender_id}
                </span>

            </div>

            <div class="station-body44">

                <p class="station-desc44"
                style="font-size:13px;color:#333;font-weight:500">

                    ${n.message}

                </p>

                <div class="station-location44"
                style="margin-top:6px;display:flex;justify-content:space-between">

                    <span style="font-size:11px;color:#777">

                        <i class="bi bi-clock"></i>
                        ${formatDate(n.created_at)}

                    </span>

                    <span style="font-size:11px;font-weight:bold;color:#555">

                        خاص بـ: ${targetText}

                    </span>

                </div>

            </div>

            <div style="display:flex;justify-content:flex-end;margin-top:5px">

                <span style="
                    background:${typeColor}15;
                    color:${typeColor};
                    padding:2px 10px;
                    border-radius:20px;
                    font-size:10px;
                    font-weight:bold;
                    border:1px solid ${typeColor}55;
                ">
                    ${typeLabel}
                </span>

            </div>

        </div>
        `;
    });

    container.innerHTML = html;
}


async function sendNotification() {

    const title = document.getElementById("notify-title").value.trim();
    const message = document.getElementById("notify-message").value.trim();
    const target = document.getElementById("notify-target").value;
    const typeValue = document.getElementById("notify-type").value;


    if (!title || !message) {
        return alert("الرجاء إكمال البيانات");
    }


    let target_group = 1;
    if (target === "students") target_group = 1;
    else if (target === "drivers") target_group = 2;
    else if (target === "supervisors") target_group = 3;

    const newNotification = {
        sender_id: currentUserId,
        title: title,
        message: message,
        created_at: new Date().toISOString(),
        target_group: target_group,
        type: typeValue
    };
    try {

        await fetch(`${API}/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newNotification)
        });

        alert("تم إرسال الإشعار بنجاح");


        document.getElementById("notify-title").value = "";
        document.getElementById("notify-message").value = "";


        if (typeof closeNotifyModal === "function") {
            closeNotifyModal();
        }


        await fetchNotifications();
        renderAll();



    } catch (e) {
        console.error("Error sending notification:", e);
        alert("خطأ في الاتصال بالسيرفر");
    }
}





function updateLiveTime() {
    const timeElement = document.getElementById('live-time');
    if (!timeElement) return;

    const now = new Date();

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    timeElement.textContent = now.toLocaleTimeString('ar-YE', options);
}


updateLiveTime();
setInterval(updateLiveTime, 10 * 60000);


function openNotificationDetails(id) {
    // افترض وجود مصفوفة notificationsData والدالة formatDate
    const n = notificationsData.find(notif => notif.id === id);
    if (!n) return;

    const targetLabels = {
        1: "الطلاب",
        2: "السائقين",
        3: "المشرفين"
    };

    const typeLabels = {
        urgent_notification: "عاجل",
        absence_alert: "غياب",
        warning: "تحذير",
        system_notification: "نظام",
        alert: "تنبيه",
        notification: "إشعار"
    };

    let typeColor = "#0d6efd"; // اللون الافتراضي (أزرق)
    let typeIcon = "<span class=\"bi bi-bell-fill\"></span>"; // أيقونة افتراضية

    switch (n.type) {
        case "urgent_notification":
            typeColor = "#ef4444"; // أحمر حديث
            typeIcon = "<span class=\"bi bi-lightning-fill\"></span>";
            break;
        case "absence_alert":
            typeColor = "#f97316"; // برتقالي
            typeIcon = "<span class=\"bi bi-lightning-fill\"></span>";
            break;
        case "warning":
            typeColor = "#eab308"; // أصفر
            typeIcon = "<span class=\"bi bi-exclamation-triangle-fill\"></span>";
            break;
        case "system_notification":
            typeColor = "#8b5cf6"; // بنفسجي
            typeIcon = "<span class=\"bi-gear-fill\"></span>";
            break;
        case "alert":
            typeColor = "#06b6d4"; // سماوي
            typeIcon = "<span class=\"bi bi-bell-fill\"></span>";
            break;
    }

    const targetText = targetLabels[n.target_group] || "الكل";
    const typeText = typeLabels[n.type] || "إشعار";

    const modal = document.getElementById("notification-details-modal");

    modal.innerHTML = `
    <div class="enterprise-modal-overlay" onclick="closeNotificationDetails()">
        <div class="enterprise-modal-card" onclick="event.stopPropagation()" dir="rtl">
            
            <div class="modal-header">
                <div class="modal-title">
                    <span class="icon-circle" style="background-color: ${typeColor}15; color: ${typeColor};">
                        ${typeIcon}
                    </span>
                    <h3>تفاصيل الإشعار</h3>
                </div>
                <button class="close-icon-btn" onclick="closeNotificationDetails()">&times;</button>
            </div>

            <div class="modal-body">
                <div class="info-grid">
                    <div class="info-item full-width">
                        <span class="info-label">العنوان</span>
                        <strong class="info-value text-lg">${n.title}</strong>
                    </div>

                    <div class="info-item">
                        <span class="info-label">النوع</span>
                        <span class="badge" style="background-color: ${typeColor}15; color: ${typeColor}; border: 1px solid ${typeColor}30;">
                            ${typeText}
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">الجهة المستهدفة</span>
                        <span class="info-value">${targetText}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">التاريخ</span>
                        <span class="info-value text-muted">${formatDate(n.created_at)}</span>
                    </div>
                </div>

                <div class="message-container">
                    <span class="info-label">نص الرسالة</span>
                    <div class="message-box">
                        ${n.message}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <div class="sender-info">
                    <span class="bi bi-person-circle"></span>
                    <span>المرسل: #${n.sender_id}</span>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="closeNotificationDetails()">إغلاق</button>
                    <button class="btn btn-success btn-success-color" onclick="deleteNotification(${n.id})">
                        <span style="margin-left: 5px;"></span> حذف الإشعار
                    </button>
                </div>
            </div>

        </div>
    </div>
    `;

    modal.style.display = "block";
}
function closeNotificationDetails() {
    const modal = document.getElementById("notification-details-modal");
    modal.style.display = "none";
}
function deleteNotification(id) {

    if (!confirm("هل أنت متأكد من حذف هذا الإشعار؟")) return;

    fetch(`${API}/notifications/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {

            notificationsData =
                notificationsData.filter(n => n.id !== id);

            renderNotifications();

            closeNotificationDetails();

            alert("تم حذف الإشعار بنجاح");

        })
        .catch(err => {
            console.error(err);
            alert("فشل حذف الإشعار");
        });

}
function renderSystemNotifications() {

    const container = document.getElementById("system-container");
    if (!container) return;

    container.innerHTML = "";

    // 🔴 فلترة مباشرة: فقط إشعارات النظام
    let filteredNotifications = notificationsData.filter(n => n.type === "system_notification");

    // 🔴 ترتيب من الأحدث للأقدم
    filteredNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (filteredNotifications.length === 0) {
        container.innerHTML = `
        <div class="station-card44">
            <div class="station-body44">
                <p class="station-desc44" style="font-size: 14px; color: #777; font-weight: 500; text-align:center;">
                    لا توجد إشعارات نظام حالياً
                </p>
            </div>
        </div>`;
        return;
    }

    const targetLabels = {
        1: "الطلاب",
        2: "السائقين",
        3: "المشرفين"
    };

    filteredNotifications.forEach(n => {

        // نفس ستايل النظام الموجود عندك
        let typeColor = "#6f42c1";
        let typeLabel = "نظام";
        let icon = "bi-gear-fill";

        let targetText = targetLabels[n.target_group] || "الكل";

        container.innerHTML += `
        <div class="station-card44"
            onclick="openNotificationDetails(${n.id})"
            style="border-top: 5px solid ${typeColor}; border-radius: 6px; cursor:pointer;">

            <div class="station-header44">
                <h4 class="station-title44" style="color: ${typeColor};">
                    <i class="bi ${icon}"></i> ${truncateTitle(n.title)}
                </h4>
                <span class="station-id44">Sender: #${n.sender_id}</span>
            </div>

            <div class="station-body44">
                <p class="station-desc44" style="font-size: 14px; color: #333; font-weight: 500;">
                    ${truncateMessage(n.message)}
                </p>

                <div class="station-location44" style="margin-top: 8px; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; color: #777;">
                        <i class="bi bi-clock"></i>
                        ${formatDate(n.created_at)}
                    </span>
                </div>
            </div>

            <div style="display: flex; justify-content:space-between; margin-top: 5px;">
                <span style="background: ${typeColor}15; color: ${typeColor}; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: bold; border: 1px solid ${typeColor}44;">
                    ${typeLabel}
                </span>

                <span class="target-badge44 target-${n.target_group}">
                    ${targetText}
                </span>
            </div>
        </div>
        `;
    });
}
renderSystemNotifications();

fetchAll();