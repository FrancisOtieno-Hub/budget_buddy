let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentMonth = new Date().getMonth();

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionListEl = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const pieCanvas = document.getElementById('categoryChart');
const pieCtx = pieCanvas.getContext('2d');

function updateUI() {
  // Monthly reset
  const now = new Date();
  if(now.getMonth() !== currentMonth){
    transactions = [];
    currentMonth = now.getMonth();
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  transactionListEl.innerHTML = '';
  let income = 0, expenses = 0;
  const categories = {};

  transactions.forEach((tx, index) => {
    const li = document.createElement('li');
    li.classList.add(tx.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
      <span>${tx.description} <span class="category">[${tx.category}]</span></span>
      <span>Ksh.${tx.amount.toFixed(2)}</span>
      <button onclick="deleteTransaction(${index})">x</button>
    `;
    transactionListEl.appendChild(li);

    if(tx.amount > 0) income += tx.amount;
    else expenses += Math.abs(tx.amount);

    // Category totals
    if(!categories[tx.category]) categories[tx.category] = 0;
    categories[tx.category] += Math.abs(tx.amount);
  });

  const balance = income - expenses;
  balanceEl.textContent = `Ksh.${balance.toFixed(2)}`;
  incomeEl.textContent = `Ksh.${income.toFixed(2)}`;
  expensesEl.textContent = `Ksh.${expenses.toFixed(2)}`;

  // Animate balance card
  balanceEl.parentElement.classList.add('animate');
  setTimeout(()=> balanceEl.parentElement.classList.remove('animate'), 300);

  localStorage.setItem('transactions', JSON.stringify(transactions));
  drawCategoryChart(categories);
}

function addTransaction(e){
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const category = categoryInput.value;
  if(description===''||isNaN(amount)||category==='') return;
  transactions.push({description, amount, category});
  descriptionInput.value=''; amountInput.value=''; categoryInput.value='';
  updateUI();
}

function deleteTransaction(index){
  transactions.splice(index,1);
  updateUI();
}

// Draw category pie chart
function drawCategoryChart(categories){
  const total = Object.values(categories).reduce((a,b)=>a+b,0);
  pieCtx.clearRect(0,0,pieCanvas.width,pieCanvas.height);
  if(total===0) return;

  let startAngle=0;
  const colors = ['#4CAF50','#FF9800','#F44336','#2196F3','#9C27B0'];

  Object.keys(categories).forEach((cat,i)=>{
    const sliceAngle = (categories[cat]/total)*2*Math.PI;
    pieCtx.beginPath();
    pieCtx.moveTo(pieCanvas.width/2,pieCanvas.height/2);
    pieCtx.arc(pieCanvas.width/2,pieCanvas.height/2,100,startAngle,startAngle+sliceAngle);
    pieCtx.fillStyle = colors[i%colors.length];
    pieCtx.fill();
    startAngle += sliceAngle;
  });
}

form.addEventListener('submit', addTransaction);
updateUI();

// Service Worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js')
  .then(()=>console.log('Service Worker Registered'))
  .catch(err=>console.log('Service Worker registration failed',err));
}
