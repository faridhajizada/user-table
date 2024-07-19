fetch("https://mocki.io/v1/f0b8306c-781b-45f1-9f88-0dc0a039f46f")
  .then((response) => response.json())
  .then((data) => {
    users = data.map(
      (item) =>
        new User(
          item.name,
          item.address,
          item.email,
          item.phone_number,
          item.birthdate,
          item.job,
          item.company
        )
    );
    displayUsers(users, currentPage);
    updatePaginationInfo();
  })
  .catch((error) => console.error("Error fetching data:", error));


  let currentPage = 1;
  const usersPerPage = 10;

  
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
  
    users.forEach((user) => {
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
      `;
      tableBody.appendChild(row);
    });
  }
  

class Person {
  constructor(name, address, email, phone_number, birthdate) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone_number = phone_number;
    this.birthdate = birthdate;
  }

  calculateAge() {
    const currentYear = new Date().getFullYear();
    const birthYear = this.birthdate.slice(0,4);
    let age = currentYear - birthYear;
    return age;
  }
}

class User extends Person {
  constructor(name, address, email, phone_number, birthdate, job, company) {
    super(name, address, email, phone_number, birthdate);
  }

  isRetired() {
    return this.calculateAge() > 65;
  }
}

let users = [];

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

