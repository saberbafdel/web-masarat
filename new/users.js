// new user
async function addAdmin() {
    const username = document.getElementById('new-admin').value.trim();
    const password = document.getElementById('new-password').value.trim();

    if (!username || !password) return alert("الرجاء إكمال البيانات");

    const newAdmin = {
        username,
        password,
        role_id: 1,
        status: "pending",
        create_at: new Date().toLocaleDateString()
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


// user get


function renderUsers() {
    const body = document.getElementById("users-table-body");
    const searchQuery = document.getElementById("search-input").value.toLowerCase();
    const roleFilter = document.getElementById("filter-role").value;

    if (!body) return;
    body.innerHTML = "";


    const filteredUsers = usersData.filter(u => {
        const matchesStatus = u.status === 'approved';
        const matchesSearch = u.username.toLowerCase().includes(searchQuery);
        const matchesRole = (roleFilter === 'all') || (u.role_id.toString() === roleFilter);
        return matchesStatus && matchesSearch && matchesRole;
    });

    filteredUsers.forEach(u => {
        body.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td><strong>${u.username}</strong></td>
            <td>${getRoleName(u.role_id)}</td>
            <td><span class="badge bg-success">نشط</span></td>
            <td>
                <button class="btn-action view" onclick="viewUserDetails(${u.id})" title="عرض"><i class="bi bi-eye"></i></button>
                <button class="btn-action block" onclick="updateUserStatus(${u.id}, 'rejected')" title="حظر"><i class="bi bi-slash-circle"></i></button>
                <button class="btn-action delete" onclick="deleteUser(${u.id})" title="حذف"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
    });


    updateRequestCount();
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
function getRoleName(id) {
    switch (id.toString()) {
        case '1': return '<i class="bi bi-shield-lock text-primary"></i> مشرف';
        case '2': return '<i class="bi bi-truck text-success"></i> سائق';
        case '3': return '<i class="bi bi-mortarboard text-secondary"></i> طالب';
        default: return 'مستخدم';
    }
}
// Requests
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

// محظور
function renderBlacklist() {
    const body = document.getElementById("blacklist-table-body");
    if (!body) return;
    body.innerHTML = "";
    const blockedUsers = usersData.filter(u => u.status === 'rejected');
    blockedUsers.forEach(u => {
        body.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.username}</td>
            <td>${getRoleName(u.role_id)}</td>
            <td><span class="badge bg-danger">محظور</span></td>
            <td>
                <button class="btn-action
                view" onclick="viewUserDetails(${u.id})" title="عرض"><i class="bi bi-eye"></i></button>
                <button class="btn-action approve" onclick="updateUserStatus(${u.id}, 'approved')" title="رفع الحظر"><i class="bi bi-check-circle-fill"></i></button>
                <button class="btn-action delete" onclick="deleteUser(${u.id})" title="حذف"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
    });
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
    } catch (e) { alert("خطأ في التحديث"); }
}
function viewUserDetails(id) {

    const user = usersData.find(u => u.id == id);
    if (!user) return;

    const modal = document.getElementById("userDetailsModal");
    const content = document.getElementById("userDetailsContent");

    content.innerHTML = `
        <div class="user-header">
            <div style="display:flex; align-items:center; gap:15px;">
                <div class="user-avatar">
                    <i class="bi bi-person"></i>
                </div>
                <div>
                    <h3 style="margin:0;">${user.username}</h3>
                    <small>${getRoleName(user.role_id)}</small>
                </div>
            </div>
            <button class="close-btn" onclick="closeUserDetails()">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>

        <div class="user-info">
            <div class="info-box">
                <label>ID</label>
                ${user.id}
            </div>

            <div class="info-box">
                <label>الحالة</label>
                <span class="status-${user.status}">
                    ${user.status === 'approved' ? 'نشط' : 'غير نشط'}
                </span>
            </div>

            <div class="info-box">
                <label>تاريخ الانضمام</label>
                ${user.create_at || '15/02/2026'}
            </div>

            <div class="info-box">
                <label>مستوى الوصول</label>
                ${user.role_id == 1 ? 'كامل الصلاحيات' : 'صلاحيات محدودة'}
            </div>
        </div>
    `;

    modal.classList.add("active");
}
// close
function closeUserDetails() {
    document.getElementById("userDetailsModal").classList.remove("active");
}
document.getElementById("userDetailsModal").addEventListener("click", function (e) {
    if (e.target.id === "userDetailsModal") {
        closeUserDetails();
    }
});



// delete user
async function deleteUser(id) {
    if (!confirm("سيتم حذف المستخدم نهائياً، هل أنت متأكد؟")) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    await fetchUsers();
    renderUsers();
    renderRequests();
    renderBlacklist();
}
fetchAll();
