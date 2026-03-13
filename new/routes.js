
// pages
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
// users tap 
function openUserTab(tabId, btnElement) {

    const parent = document.getElementById('sec-users');
    parent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));


    parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));

    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active-tab');
    renderUsers();
}

// trip tabs
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

// students tabs
function openStudentTab(tabId, btnElement) {

    const parent = document.getElementById('sec-students');

    parent.querySelectorAll('.tab-content')
        .forEach(content => content.classList.remove('active'));

    parent.querySelectorAll('.tab-btn')
        .forEach(btn => btn.classList.remove('active-tab'));

    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active-tab');

    renderStudents();
}
