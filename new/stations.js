

// ====== جلب وعرض المحطات ======
async function fetchStations() {
    try {
        const res = await fetch(`${API}/stations`);
        if (!res.ok) throw new Error("فشل جلب البيانات");
        stationsData = await res.json();
        renderStations();
    } catch (error) {
        console.error("حدث خطأ أثناء جلب المحطات:", error);
        alert("خطأ في جلب المحطات من الخادم");
    }
}

// ====== عرض المحطات في الجدول ======
function renderStations() {
    const body = document.getElementById("stations-table");
    if (!body) return;
    body.innerHTML = "";

    stationsData.forEach(s => {
        body.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.description}</td>
            <td>${s.x}</td>
            <td>${s.y}</td>
            <td>
                <button onclick="viewStation(${s.id})">عرض</button>
                <button onclick="editStation(${s.id})">تعديل</button>
                <button onclick="deleteStation(${s.id})">حذف</button>
            </td>
        </tr>`;
    });
}

// ====== عرض مودال وسط الشاشة ======
function viewStation(id) {
    const s = stationsData.find(x => x.id == id);
    if (!s) return;

    const modal = document.getElementById("stationModal");
    const content = document.getElementById("stationModalContent");

    content.innerHTML = `
        <h3>${s.name}</h3>
        <p><strong>الوصف:</strong> ${s.description}</p>
        <p><strong>X:</strong> ${s.x}</p>
        <p><strong>Y:</strong> ${s.y}</p>
        <button onclick="closeStationModal()">إغلاق</button>
    `;

    modal.classList.add("active");
}

// ====== فتح مودال إضافة / تعديل ======
function openStationForm(station = null) {
    const modal = document.getElementById("stationModal");
    const content = document.getElementById("stationModalContent");

    content.innerHTML = `
        <h3>${station ? "تعديل محطة" : "إضافة محطة"}</h3>
        <input id="stName" placeholder="اسم المحطة" value="${station?.name || ""}"><br><br>
        <input id="stDesc" placeholder="الوصف" value="${station?.description || ""}"><br><br>
        <input id="stX" placeholder="X" type="number" value="${station?.x || ""}"><br><br>
        <input id="stY" placeholder="Y" type="number" value="${station?.y || ""}"><br><br>
        <button onclick="saveStation(${station?.id || null})">حفظ</button>
        <button onclick="closeStationModal()">إلغاء</button>
    `;

    modal.classList.add("active");
}

// ====== حفظ محطة ======
async function saveStation(id) {
    const name = document.getElementById("stName").value.trim();
    const description = document.getElementById("stDesc").value.trim();
    const x = parseFloat(document.getElementById("stX").value);
    const y = parseFloat(document.getElementById("stY").value);

    if (!name || !description || isNaN(x) || isNaN(y)) {
        alert("أدخل جميع البيانات بشكل صحيح");
        return;
    }

    try {
        if (id) {
            await fetch(`${API}/stations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, x, y })
            });
        } else {
            await fetch(`${API}/stations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, x, y })
            });
        }

        closeStationModal();
        fetchStations();
    } catch (error) {
        console.error("خطأ في حفظ المحطة:", error);
        alert("حدث خطأ أثناء حفظ المحطة");
    }
}

// ====== تعديل محطة ======
function editStation(id) {
    const s = stationsData.find(x => x.id == id);
    openStationForm(s);
}

// ====== حذف محطة ======
async function deleteStation(id) {
    if (!confirm("هل تريد حذف المحطة؟")) return;

    try {
        await fetch(`${API}/stations/${id}`, { method: "DELETE" });
        fetchStations();
    } catch (error) {
        console.error("خطأ في حذف المحطة:", error);
        alert("حدث خطأ أثناء حذف المحطة");
    }
}

// ====== إغلاق المودال ======
function closeStationModal() {
    document.getElementById("stationModal").classList.remove("active");
}

// إغلاق عند الضغط على الخلفية
document.getElementById("stationModal").addEventListener("click", function (e) {
    if (e.target.id === "stationModal") closeStationModal();
});

// ====== زر إضافة محطة ======
function showStationForm() {
    openStationForm();
}

// ====== بدء التحميل بعد تحميل DOM ======
document.addEventListener("DOMContentLoaded", () => {
    fetchStations();
});