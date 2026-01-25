// Load transactions from localStorage or initialize
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editingIndex = null;

// Chart colors
const CHART_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0',
  '#00BCD4', '#FFEB3B', '#795548', '#607D8B', '#FFC107'
];

// DOM Elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionListEl = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const pieCanvas = document.getElementById('categoryChart');
const pieCtx = pieCanvas ? pieCanvas.getContext('2d') : null;
const chartLegendEl = document.getElementById('chartLegend');
const searchBox = document.getElementById('searchBox');
const filterCategory = document.getElementById('filterCategory');
const filterType = document.getElementById('filterType');
const chartPeriod = document.getElementById('chartPeriod');
const exportBtn = document.getElementById('exportBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const cancelEditBtn = document.getElementById('cancelEdit');
const submitBtnText = document.getElementById('submitBtnText');
const noTransactionsEl = document.getElementById('noTransactions');
const noDataMessageEl = document.getElementById('noDataMessage');
const toastEl = document.getElementById('toast');

// Helper: Format amount as Ksh with commas
function formatKsh(amount) {
  return 'Ksh. ' + Math.abs(amount).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Helper: Show toast notification
function showToast(message, type = 'success') {
  toastEl.textContent = message;
  toastEl.className = `toast ${type}`;
  toastEl.hidden = false;
  
  setTimeout(() => {
    toastEl.hidden = true;
  }, 3000);
}

// Helper: Validate form
function validateForm() {
  let isValid = true;
  const descError = document.getElementById('descError');
  const amountError = document.getElementById('amountError');
  const categoryError = document.getElementById('categoryError');

  // Reset errors
  descError.textContent = '';
  amountError.textContent = '';
  categoryError.textContent = '';
  descriptionInput.classList.remove('error');
  amountInput.classList.remove('error');
  categoryInput.classList.remove('error');

  // Validate description
  if (!descriptionInput.value.trim()) {
    descError.textContent = 'Please enter a description';
    descriptionInput.classList.add('error');
    isValid = false;
  }

  // Validate amount
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    amountError.textContent = 'Please enter a valid amount greater than 0';
    amountInput.classList.add('error');
    isValid = false;
  }

  // Validate category
  if (!categoryInput.value) {
    categoryError.textContent = 'Please select a category';
    categoryInput.classList.add('error');
    isValid = false;
  }

  return isValid;
}

// Update UI: balances, transactions, chart
function updateUI() {
  const searchTerm = searchBox?.value.toLowerCase() || '';
  const categoryFilter = filterCategory?.value || '';
  const typeFilter = filterType?.value || '';

  // Filter transactions
  let filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm);
    const matchesCategory = !categoryFilter || tx.category === categoryFilter;
    const matchesType = !typeFilter || 
      (typeFilter === 'income' && tx.amount > 0) ||
      (typeFilter === 'expense' && tx.amount < 0);
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Clear transaction list
  transactionListEl.innerHTML = '';
  
  let income = 0, expenses = 0;
  const categories = {};

  // Calculate totals from ALL transactions (not filtered)
  transactions.forEach(tx => {
    if (tx.amount > 0) income += tx.amount;
    else expenses += Math.abs(tx.amount);

    if (!categories[tx.category]) categories[tx.category] = 0;
    if (tx.amount < 0) {
      categories[tx.category] += Math.abs(tx.amount);
    }
  });

  // Render filtered transactions
  if (filteredTransactions.length === 0) {
    noTransactionsEl.hidden = false;
  } else {
    noTransactionsEl.hidden = true;
    
    filteredTransactions.forEach((tx, displayIndex) => {
      const actualIndex = transactions.indexOf(tx);
      const li = document.createElement('li');
      li.classList.add(tx.amount > 0 ? 'income' : 'expense');
      
      li.innerHTML = `
        <div class="transaction-info">
          <span class="transaction-description">${escapeHtml(tx.description)}</span>
          <span class="transaction-category">${getCategoryIcon(tx.category)} ${tx.category}</span>
        </div>
        <span class="transaction-amount">${tx.amount > 0 ? '+' : '-'}${formatKsh(tx.amount)}</span>
        <div class="transaction-actions">
          <button class="edit-btn" onclick="editTransaction(${actualIndex})" aria-label="Edit transaction" title="Edit">✏️</button>
          <button class="delete-btn" onclick="deleteTransaction(${actualIndex})" aria-label="Delete transaction" title="Delete">🗑️</button>
        </div>
      `;
      
      transactionListEl.appendChild(li);
      
      // Stagger animation
      setTimeout(() => {
        li.style.animationDelay = `${displayIndex * 0.05}s`;
      }, 10);
    });
  }

  // Update summary cards
  const balance = income - expenses;
  balanceEl.textContent = formatKsh(balance);
  incomeEl.textContent = formatKsh(income);
  expensesEl.textContent = formatKsh(expenses);

  // Animate balance card
  balanceEl.parentElement.classList.add('animate');
  setTimeout(() => balanceEl.parentElement.classList.remove('animate'), 300);

  // Save to localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions));

  // Draw category chart
  const period = chartPeriod?.value || 'current';
  drawCategoryChart(categories, period);
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Helper: Get category icon
function getCategoryIcon(category) {
  const icons = {
    'Food': '🍔',
    'Rent': '🏠',
    'Utilities': '💡',
    'Transportation': '🚗',
    'Entertainment': '🎬',
    'Healthcare': '⚕️',
    'Shopping': '🛍️',
    'Education': '📚',
    'Salary': '💼',
    'Investment': '📈',
    'Others': '📦'
  };
  return icons[category] || '📦';
}

// Add or update transaction
function addTransaction(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    showToast('Please fix the errors in the form', 'error');
    return;
  }

  const description = descriptionInput.value.trim();
  let amount = parseFloat(amountInput.value.trim());
  const category = categoryInput.value;
  const type = document.querySelector('input[name="type"]:checked').value;

  // Set amount sign based on type
  amount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

  if (editingIndex !== null) {
    // Update existing transaction
    transactions[editingIndex] = { description, amount, category, date: transactions[editingIndex].date };
    showToast('Transaction updated successfully!', 'success');
    cancelEdit();
  } else {
    // Add new transaction
    transactions.unshift({ description, amount, category, date: new Date().toISOString() });
    showToast('Transaction added successfully!', 'success');
  }

  // Clear form
  form.reset();
  document.getElementById('type-income').checked = true;

  updateUI();
}

// Edit transaction
function editTransaction(index) {
  editingIndex = index;
  const tx = transactions[index];

  descriptionInput.value = tx.description;
  amountInput.value = Math.abs(tx.amount);
  categoryInput.value = tx.category;

  // Set transaction type
  if (tx.amount > 0) {
    document.getElementById('type-income').checked = true;
  } else {
    document.getElementById('type-expense').checked = true;
  }

  // Update button text
  submitBtnText.textContent = 'Update Transaction';
  cancelEditBtn.hidden = false;

  // Scroll to form
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  descriptionInput.focus();
}

// Cancel edit
function cancelEdit() {
  editingIndex = null;
  form.reset();
  submitBtnText.textContent = 'Add Transaction';
  cancelEditBtn.hidden = true;
  document.getElementById('type-income').checked = true;
  
  // Clear errors
  document.getElementById('descError').textContent = '';
  document.getElementById('amountError').textContent = '';
  document.getElementById('categoryError').textContent = '';
  descriptionInput.classList.remove('error');
  amountInput.classList.remove('error');
  categoryInput.classList.remove('error');
}

// Delete transaction
function deleteTransaction(index) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactions.splice(index, 1);
    showToast('Transaction deleted', 'success');
    
    // If we were editing this transaction, cancel edit
    if (editingIndex === index) {
      cancelEdit();
    } else if (editingIndex > index) {
      editingIndex--;
    }
    
    updateUI();
  }
}

// Clear all transactions
function clearAll() {
  if (confirm('Are you sure you want to delete ALL transactions? This cannot be undone!')) {
    transactions = [];
    cancelEdit();
    showToast('All transactions cleared', 'success');
    updateUI();
  }
}

// Export transactions to CSV
function exportToCSV() {
  if (transactions.length === 0) {
    showToast('No transactions to export', 'error');
    return;
  }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(tx => [
    new Date(tx.date || Date.now()).toLocaleDateString(),
    tx.description,
    tx.category,
    tx.amount > 0 ? 'Income' : 'Expense',
    Math.abs(tx.amount).toFixed(2)
  ]);

  let csvContent = headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `budget-buddy-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Transactions exported successfully!', 'success');
}

// Draw category pie chart with legend
function drawCategoryChart(categories, period = 'current') {
  if (!pieCtx) return;

  const total = Object.values(categories).reduce((a, b) => a + b, 0);
  
  pieCtx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);
  chartLegendEl.innerHTML = '';

  if (total === 0) {
    noDataMessageEl.hidden = false;
    pieCanvas.style.display = 'none';
    return;
  }

  noDataMessageEl.hidden = true;
  pieCanvas.style.display = 'block';

  let startAngle = 0;
  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  entries.forEach(([cat, value], i) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const color = CHART_COLORS[i % CHART_COLORS.length];

    // Draw pie slice
    pieCtx.beginPath();
    pieCtx.moveTo(pieCanvas.width / 2, pieCanvas.height / 2);
    pieCtx.arc(pieCanvas.width / 2, pieCanvas.height / 2, 120, startAngle, startAngle + sliceAngle);
    pieCtx.fillStyle = color;
    pieCtx.fill();
    pieCtx.strokeStyle = '#fff';
    pieCtx.lineWidth = 2;
    pieCtx.stroke();

    // Add to legend
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <div class="legend-color" style="background-color: ${color}"></div>
      <span class="legend-label">${getCategoryIcon(cat)} ${cat}</span>
      <span class="legend-value">${formatKsh(value)}</span>
    `;
    chartLegendEl.appendChild(legendItem);

    startAngle += sliceAngle;
  });
}

// Event Listeners
if (form) form.addEventListener('submit', addTransaction);
if (searchBox) searchBox.addEventListener('input', updateUI);
if (filterCategory) filterCategory.addEventListener('change', updateUI);
if (filterType) filterType.addEventListener('change', updateUI);
if (chartPeriod) chartPeriod.addEventListener('change', updateUI);
if (exportBtn) exportBtn.addEventListener('click', exportToCSV);
if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll);
if (cancelEditBtn) cancelEditBtn.addEventListener('click', cancelEdit);

// Initialize UI
updateUI();

// Register Service Worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button or banner if desired
  console.log('PWA install available');
});

// Check for updates periodically
if ('serviceWorker' in navigator) {
  setInterval(() => {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) reg.update();
    });
  }, 60000); // Check every minute
}
