class Person {
  constructor(name, address, email, phone_number, birthdate) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone_number = phone_number;
    this.birthdate = birthdate;
  }

  calculateAge() {
    const birthYear = new Date(this.birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  }
}

class User extends Person {
  constructor(name, address, email, phone_number, birthdate, job, company) {
    super(name, address, email, phone_number, birthdate);
    this.job = job;
    this.company = company;
  }

  isRetired() {
    return this.calculateAge() > 65;
  }
}

let users = [];
let currentPage = 1;
const usersPerPage = 10;

const API_URL = "http://localhost:3000/users";

function createUserFromObject(obj) {
  return new User(
    obj.name,
    obj.address,
    obj.email,
    obj.phone_number,
    obj.birthdate,
    obj.job,
    obj.company
  );
}

async function fetchUsers() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    users = data.map(createUserFromObject); 
    displayUsers(users, currentPage);
    updatePaginationInfo();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function addUser(user) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const newUser = await response.json();
    users.push(createUserFromObject(newUser)); 
    displayUsers(users, currentPage);
    updatePaginationInfo();
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

async function updateUser(index, user) {
  try {
    await fetch(`${API_URL}/${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    users[index] = createUserFromObject(user);
    displayUsers(users, currentPage);
    updatePaginationInfo();
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

async function deleteUser(index) {
  try {
    await fetch(`${API_URL}/${index}`, {
      method: "DELETE",
    });
    users.splice(index, 1);
    displayUsers(users, currentPage);
    updatePaginationInfo();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

const modal = document.getElementById("user-modal");
const closeModal = document.getElementsByClassName("close")[0];
const addButton = document.getElementById("add-button");
const userForm = document.getElementById("user-form");
let editingIndex = -1;

addButton.onclick = function () {
  modal.style.display = "block";
  document.getElementById("modal-title").textContent = "Add User";
  userForm.reset();
};

closeModal.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

userForm.onsubmit = async function (event) {
  event.preventDefault();
  const newUser = new User(
    userForm.name.value,
    userForm.address.value,
    userForm.email.value,
    userForm.phone_number.value,
    userForm.birthdate.value,
    userForm.job.value,
    userForm.company.value
  );

  if (editingIndex === -1) {
    await addUser(newUser);
  } else {
    await updateUser(editingIndex, newUser);
    editingIndex = -1;
  }

  modal.style.display = "none";
  displayUsers(users, currentPage);
  updatePaginationInfo();
};

function editUser(index) {
  const user = users[index];
  document.getElementById("modal-title").textContent = "Edit User";
  userForm.name.value = user.name;
  userForm.address.value = user.address;
  userForm.email.value = user.email;
  userForm.phone_number.value = user.phone_number;
  userForm.birthdate.value = user.birthdate;
  userForm.job.value = user.job;
  userForm.company.value = user.company;
  editingIndex = index;
  modal.style.display = "block";
}

function displayUsers(users, page) {
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);
  populateTable(paginatedUsers);
}

function updatePaginationInfo(totalUsers = users.length) {
  const paginationInfo = document.getElementById("pagination-info");
  paginationInfo.textContent = `Page ${currentPage} of ${Math.ceil(
    totalUsers / usersPerPage
  )}`;
}

function populateTable(users) {
  const tableBody = document.getElementById("user-table-body");
  tableBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.address}</td>
      <td>${user.email}</td>
      <td>${user.phone_number}</td>
      <td>${user.job}</td>
      <td>${user.company}</td>
      <td>${user.calculateAge()}</td>
      <td>${user.isRetired() ? "Yes" : "No"}</td>
      <td>
        <button class="editBtn" onclick="editUser(${index})">Edit</button>
        <button class="deleteBtn" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase().trim();
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
  );
  displayUsers(filteredUsers, 1);
  updatePaginationInfo(filteredUsers.length);
});

document.getElementById("previous-button").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayUsers(users, currentPage);
    updatePaginationInfo();
  }
});

document.getElementById("next-button").addEventListener("click", () => {
  if (currentPage < Math.ceil(users.length / usersPerPage)) {
    currentPage++;
    displayUsers(users, currentPage);
    updatePaginationInfo();
  }
});

fetchUsers();
