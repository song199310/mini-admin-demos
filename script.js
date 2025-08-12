const userData = [];
for (let i = 1; i <= 100; i++) {
    userData.push({ id: i, name: `用户${i}`, email: `user${i}@example.com` });   
}
let currentPage = 1;
let rowsPerPage = 10;
let filteredData = [...userData];

function displayTable(data, page) {
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = "";
    document.getElementById("totalCount").innerText = `共 ${data.length} 条数据`;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    for (let user of pageData) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><button class="deleteBtn" data-id="${user.id}">删除</button></td>
        `;
        tableBody.appendChild(row);
    }

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = parseInt(this.dataset.id);
            const index = userData.findIndex(u => u.id === id);
            if (index !== -1) userData.splice(index, 1);
            const filteredIndex = filteredData.findIndex(u => u.id === id);
            if (filteredIndex !== -1) filteredData.splice(filteredIndex, 1);
            const totalPages = Math.ceil(filteredData.length / rowsPerPage);
            if (currentPage > totalPages) currentPage = totalPages || 1;
            displayTable(filteredData, currentPage);
            setupPagination(filteredData);
        });
    });
}
function setupPagination(data) {
    let pagination = document.getElementById("pagination");
    if (!pagination) {
        pagination = document.createElement("div");
        pagination.id = "pagination";
        document.body.appendChild(pagination);
    }
    pagination.innerHTML = "";

    const pageCount = Math.ceil(data.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.style.fontWeight = "bold";
        btn.addEventListener("click", () => {
            currentPage = i;
            displayTable(filteredData, currentPage);
            setupPagination(filteredData)
        });
        pagination.appendChild(btn);
    }
}
document.getElementById("searchInput").addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();
    filteredData = userData.filter(user =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    displayTable(filteredData, currentPage);
    setupPagination(filteredData);
});

document.getElementById("addUserBtn").addEventListener("click", function () {
    const name = document.getElementById("newName").value.trim();
    const email = document.getElementById("newEmail").value.trim();

    if (!name || !email) {
        alert("请填写完整的姓名和邮箱");
        return;
    }

    const newUser = {
        id: userData.length ? userData[userData.length - 1].id + 1 : 1,
        name,
        email
    };

    userData.push(newUser);
    filteredData = [...userData];
    currentPage = Math.ceil(filteredData.length / rowsPerPage);

    displayTable(filteredData, currentPage);
    setupPagination(filteredData);

    document.getElementById("newName").value = "";
    document.getElementById("newEmail").value = "";
});
displayTable(filteredData, currentPage);
setupPagination(filteredData);