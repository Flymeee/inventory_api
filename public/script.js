const API_URL = 'http://localhost:3000/api/v1/inventories';
let inventoryData = [];
let sortDirection = { name: 1, quantity: 1, price: 1 }; 

// Fetch and store inventory
function loadInventory() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      inventoryData = data;
      displayInventory(data);
    })
    .catch(err => console.error('Error loading inventory:', err));
}

// Display inventory in table
function displayInventory(data) {
  const tableBody = document.querySelector('#inventory-table tbody');
  tableBody.innerHTML = '';

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
      <td>
        <button onclick="startEdit(${item.id}, '${item.name}', ${item.quantity}, ${item.price})">Edit</button>
        <button onclick="deleteItem(${item.id})" style="background:red;color:white;">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add item
document.querySelector('#add-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const quantity = parseInt(document.querySelector('#quantity').value);
  const price = parseFloat(document.querySelector('#price').value);

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inventory: { name, quantity, price } })
  })
    .then(res => res.json())
    .then(() => {
      document.querySelector('#add-form').reset();
      loadInventory();
    })
    .catch(err => console.error('Error adding item:', err));
});

// Start inline editing
function startEdit(id, name, quantity, price) {
  const row = event.target.closest('tr');
  row.innerHTML = `
    <td><input type="text" id="edit-name-${id}" value="${name}"></td>
    <td><input type="number" id="edit-quantity-${id}" value="${quantity}"></td>
    <td><input type="number" step="0.01" id="edit-price-${id}" value="${price}"></td>
    <td>
      <button onclick="saveEdit(${id})" style="background:green;color:white;">Save</button>
      <button onclick="loadInventory()">Cancel</button>
    </td>
  `;
}

// Save edit
function saveEdit(id) {
  const name = document.querySelector(`#edit-name-${id}`).value;
  const quantity = parseInt(document.querySelector(`#edit-quantity-${id}`).value);
  const price = parseFloat(document.querySelector(`#edit-price-${id}`).value);

  fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inventory: { name, quantity, price } })
  })
    .then(res => res.json())
    .then(() => loadInventory())
    .catch(err => console.error('Error updating item:', err));
}

// Delete item
function deleteItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => loadInventory())
      .catch(err => console.error('Error deleting item:', err));
  }
}

// Search inventory
document.querySelector('#search').addEventListener('input', e => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = inventoryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm)
  );
  displayInventory(filtered);
});

// Sort inventory
function sortInventory(field) {
  sortDirection[field] *= -1; // toggle direction
  const sorted = [...inventoryData].sort((a, b) => {
    if (a[field] < b[field]) return -1 * sortDirection[field];
    if (a[field] > b[field]) return 1 * sortDirection[field];
    return 0;
  });
  displayInventory(sorted);
}

// Initial load
document.addEventListener('DOMContentLoaded', loadInventory);
