// shared.js
const API_BASE = "https://portal.t4coutreach.co.za";

function saveAuth(token, role, username) {
    localStorage.setItem("jwt_token", token);
    localStorage.setItem("user_role", role);
    localStorage.setItem("username", username);
}

function getToken() {
    return localStorage.getItem("jwt_token");
}

function getRole() {
    return localStorage.getItem("user_role");
}

function getUsername() {
    return localStorage.getItem("username");
}

function logout() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

function authHeaders() {
    const token = getToken();
    return {
        "Authorization": `Bearer ${token}`
    };
}

async function login(username, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        throw new Error("Invalid username or password");
    }

    const data = await res.json();
    // Expect token + role + username in response, or decode role from token if you prefer.
    // For now, assume API returns: { token, role, username }
    saveAuth(data.token, data.role, data.username);
    return data;
}

async function fetchMyFiles() {
    const res = await fetch(`${API_BASE}/api/files/my`, {
        headers: authHeaders()
    });
    if (!res.ok) throw new Error("Failed to load files");
    return await res.json();
}

async function fetchAllFiles() {
    const res = await fetch(`${API_BASE}/api/files/all`, {
        headers: authHeaders()
    });
    if (!res.ok) throw new Error("Failed to load files");
    return await res.json();
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
}

async function deleteFile(id) {
    const res = await fetch(`${API_BASE}/api/files/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    if (!res.ok) throw new Error("Delete failed");
    return await res.text();
}

function requireAuth(expectedRoles) {
    const token = getToken();
    const role = getRole();
    if (!token || !role || (expectedRoles && !expectedRoles.includes(role))) {
        window.location.href = "login.html";
    }
}
