async function fetchAll() {
    await Promise.all([
        fetchUsers(),
        fetchStations(),
        fetchRoutes(),
        fetchAssign(),
        fetchStudents()
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
    const res = await fetch(`${API}/stations`);
    stationsData = await res.json();
    renderStations();
}

