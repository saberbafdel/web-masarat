const API = "http://localhost:3000";
let usersData = [];
let stationsData = [];

async function login() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorMsg = document.getElementById('login-error');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorMsg.style.display = "none";

    if (!username || !password) {
        showLoginError("الرجاء إدخال البيانات كاملة");
        return;
    }

    try {
        const response = await fetch(`${API}/users`);
        const users = await response.json();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            showLoginError("اسم المستخدم أو كلمة المرور غير صحيحة");
            return;
        }

        if (user.role_id !== 1) {
            showLoginError("ليس لديك صلاحية وصول (User role denied)");
            return;
        }

        if (user.status !== 'approved') {
            showLoginError("الحساب غير مفعل أو محظور");
            return;
        }


        console.log("Login Success:", user);
        document.getElementById('login-page').style.display = "none";
        document.getElementById('main-wrapper').style.display = "block";
        showPage('sec-home');

        await fetchAll();
        showPage('sec-home');

    } catch (err) {
        console.error(err);
        showLoginError("خطأ في الاتصال بالسيرفر");
    }
}

function showLoginError(msg) {
    const el = document.getElementById('login-error');
    el.textContent = msg;
    el.style.display = "block";
}

function logout() {
    location.reload();
}


