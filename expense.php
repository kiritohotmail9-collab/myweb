<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>EXPENSE</title>
<link rel="stylesheet" href="style.css">
</head>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<body>

<div class="header">
    <h1>EXPENSE</h1>
</div>

<div class="navbar">
    <a href="index.php">HOME</a>
    <a href="year.php">YEAR</a>
    <a href="month.php">MONTH</a>
    <a href="expense.php">EXPENSE</a>   
    <a href="diary.php">DIARY</a>
    <a href="profile.php">PROFILE</a>
</div>

<div class="expense-container">

    <h2 id="todayDate"></h2>    

<div class="expense-form">

<input type="date" id="date">

<select id="type">
    <option value="income">Inc.</option>
    <option value="expense">Exp.</option> 
</select>

<select id="category"></select>
<button onclick="openPopup()"> + </button>

<select id="method">
    <option value="cash">Cash</option>
    <option value="app">App</option>
</select>


<input type="text" id="detail" placeholder="Detail">

<input type="number" id="amount" placeholder="Amount">

<button onclick="addExpense()">Add</button>

</div>

<div class="summary">

<!-- แถว 1 -->
<div class="summary-row">

<div class="income-box">
Inc. <span id="incomeTotal">0</span> Bath
</div>

<div class="expense-box">
Exp. <span id="expenseTotal">0</span> Bath
</div>

<div class="balance-box">
Balance <span id="balanceTotal">0</span> Bath
</div>

</div>


<!-- แถว 2 -->
<div class="summary-row">

<div class="cash-box">
💵 Cash <span id="cashBalance">0</span> Bath
</div>

<div class="app-box">
📱 Bank <span id="appBalance">0</span> Bath
</div>

</div>


<!-- แถว 3 -->
<div class="summary-row">

<div class="month-box">
Month Inc. <span id="monthInc">0</span> Bath
</div>

<div class="month-box">
Month Exp. <span id="monthExp">0</span> Bath
</div>

</div>


<!-- แถว 4 -->
<div class="summary-row">

<div class="year-box">
Year Inc. <span id="yearInc">0</span> Bath
</div>

<div class="year-box">
Year Exp. <span id="yearExp">0</span> Bath
</div>

</div>


<!-- Budget -->
<div class="budget-box">

<div class="budget-input">
Budget Limit 
<input type="number" id="budgetLimit" placeholder="Monthly budget">
<button onclick="saveBudget()">Save</button>
</div>

<div class="budget-bar">

<div class="budget-progress" id="budgetProgress"></div>

</div>

<div class="budget-text">
<span id="budgetUsed">0</span> / <span id="budgetMax">0</span>
</div>

<div id="budgetAlert"></div>

</div>

</div>



<div id="categoryPopup" class="popup">
  <div class="popup-content">

    <h3>New Category</h3>

    <input type="text" id="newCategory" placeholder="ชื่อหมวด">

    <div class="popup-buttons">
      <button onclick="saveCategory()">Add</button>
      <button onclick="closePopup()">Cancel</button>
    </div>

  </div>
</div>


<div class="chart-filter">

    <select id="viewMode" onchange="renderChart()">
        <option value="day">Day</option>
        <option value="month">Mounth</option>
        <option value="year">Year</option>
    </select>

</div>

<canvas id="categoryChart"></canvas>

<h3>Income vs Expense</h3>
<canvas id="monthChart"></canvas>


<table class="expense-table">

<thead>
<tr>
    <th>Date</th>
    <th>Category</th>
    <th>Details</th>
    <th>Amount</th>
    <th>Del</th>
</tr>
</thead>

<tbody id="expenseTable"></tbody>

</table>

</div>


<script>

    let categories = JSON.parse(localStorage.getItem("categories")) || [
    "Food",
    "Travel",
    "Item"
];


const today = new Date().toISOString().slice(0,10);
const key = "expenses";

document.getElementById("todayDate").textContent = today;

function addExpense(){

const type = document.getElementById("type").value;
const category = document.getElementById("category").value;
const detail = document.getElementById("detail").value;
const amount = parseFloat(document.getElementById("amount").value);
const method = document.getElementById("method").value;

if(!detail || !amount) return;

let data = JSON.parse(localStorage.getItem(key)) || [];

data.push({
date:today,
type:type,
category:category,
method:method,
detail:detail,
amount:amount
});

localStorage.setItem(key,JSON.stringify(data));

location.reload();   // ⭐ รีเฟรชหน้าเว็บ

}


function renderTable(){

const table = document.getElementById("expenseTable");
table.innerHTML="";

let data = JSON.parse(localStorage.getItem(key)) || [];

let income = 0;
let expense = 0;
let cash = 0;
let app = 0;

data.forEach((item,index)=>{

if(item.type==="income"){
income += item.amount;
}else{
expense += item.amount;
}

if(item.method==="cash"){

if(item.type==="income"){
cash += item.amount;
}else{
cash -= item.amount;
}

}

if(item.method==="app"){

if(item.type==="income"){
app += item.amount;
}else{
app -= item.amount;
}

}

const tr = document.createElement("tr");
tr.className = item.type;

tr.innerHTML = `
<td>${item.date}</td>
<td>${item.category}</td>
<td>${item.detail}</td>
<td>${item.amount}</td>
<td><button onclick="deleteItem(${index})">✕</button></td>
`;

table.appendChild(tr);

});

document.getElementById("incomeTotal").textContent = income;
document.getElementById("expenseTotal").textContent = expense;
document.getElementById("balanceTotal").textContent = income-expense;
document.getElementById("cashBalance").textContent = cash;
document.getElementById("appBalance").textContent = app;

}

function deleteItem(index){

let data = JSON.parse(localStorage.getItem(key)) || [];

data.splice(index,1);

localStorage.setItem(key,JSON.stringify(data));

renderTable();
}

renderTable();
updateBoxColor();


let chart;

function renderChart(){

let data = JSON.parse(localStorage.getItem(key)) || [];

let income = {};
let expense = {};

data.forEach(item=>{

if(item.type==="income"){

if(!income[item.category]){
income[item.category]=0;
}

income[item.category]+=item.amount;

}

if(item.type==="expense"){

if(!expense[item.category]){
expense[item.category]=0;
}

expense[item.category]+=item.amount;

}

});

let labels = [...new Set([
...Object.keys(income),
...Object.keys(expense)
])];

let incomeData = labels.map(l => income[l] || 0);
let expenseData = labels.map(l => expense[l] || 0);

if(chart){
chart.destroy();
}

chart = new Chart(document.getElementById("expenseChart"),{

type:"pie",

data:{
labels:labels,
datasets:[
{
label:"Inc.",
data:incomeData,
backgroundColor:"#4CAF50"
},
{
label:"Exp.",
data:expenseData,
backgroundColor:"#ff6b6b"
}
]
}

});

}

renderChart();

let categoryChart;
function renderCategoryChart(){

let data = JSON.parse(localStorage.getItem(key)) || [];

let summary = {};

data.forEach(item=>{

let label = item.category + " (" + item.type + ")";

if(!summary[label]){
summary[label] = 0;
}

summary[label] += item.amount;

});

let labels = Object.keys(summary);
let values = Object.values(summary);

if(categoryChart){
categoryChart.destroy();
}

categoryChart = new Chart(document.getElementById("categoryChart"),{

type:"pie",

data:{
labels:labels,
datasets:[{
data:values,
backgroundColor:[
"#4CAF50",
"#ff7675",
"#74b9ff",
"#ffeaa7",
"#a29bfe",
"#55efc4"
]
}]
}

});

}


let monthChart;

function renderMonthChart(){

let data = JSON.parse(localStorage.getItem(key)) || [];

let income = new Array(12).fill(0);
let expense = new Array(12).fill(0);

data.forEach(item=>{

let date = new Date(item.date);
let m = date.getMonth();

if(item.type==="income"){
income[m]+=item.amount;
}

if(item.type==="expense"){
expense[m]+=item.amount;
}

});

if(monthChart){
monthChart.destroy();
}

monthChart = new Chart(document.getElementById("monthChart"),{

type:"bar",

data:{
labels:[
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
],

datasets:[
{
label:"Inc.",
data:income,
backgroundColor:"#4CAF50"
},

{
label:"Exp.",
data:expense,
backgroundColor:"#ff6b6b"
}

]
}

});

}

function renderList(){

const table = document.getElementById("expenseTable");
table.innerHTML="";

let data = JSON.parse(localStorage.getItem(key)) || [];

data.sort((a,b)=> new Date(a.date) - new Date(b.date));

let income = 0;
let expense = 0;

data.forEach((item,index)=>{

if(item.type==="income"){
income += item.amount;
}else{
expense += item.amount;
}

const tr = document.createElement("tr");

tr.className = item.type;

tr.innerHTML = `
<td>${item.date}</td>
<td>${item.category}</td>
<td>${item.detail}</td>
<td>${item.amount}</td>
<td><button onclick="deleteItem(${index})">✕</button></td>
`;

table.appendChild(tr);

});

document.getElementById("incomeTotal").textContent = income;
document.getElementById("expenseTotal").textContent = expense;
document.getElementById("balanceTotal").textContent = income-expense;

}

renderCategoryChart();
renderMonthChart();

function renderCategories(){

const select = document.getElementById("category");

select.innerHTML="";

categories.forEach(cat=>{

let option = document.createElement("option");

option.value = cat;
option.textContent = cat;

select.appendChild(option);

});

}

function addCategory(){

let name = prompt("New Category");

if(!name) return;

categories.push(name);

localStorage.setItem("categories",JSON.stringify(categories));

renderCategories();

}

renderCategories();

function openPopup(){
document.getElementById("categoryPopup").style.display="flex";
}

function closePopup(){
document.getElementById("categoryPopup").style.display="none";
}

function saveCategory(){

let name = document.getElementById("newCategory").value;

if(!name) return;

categories.push(name);

localStorage.setItem("categories",JSON.stringify(categories));

renderCategories();

document.getElementById("newCategory").value="";

closePopup();

}

function updateBoxColor(){

let income = parseFloat(document.getElementById("incomeTotal").textContent);
let expense = parseFloat(document.getElementById("expenseTotal").textContent);
let balance = parseFloat(document.getElementById("balanceTotal").textContent);

setColor("incomeTotal",income);
setColor("expenseTotal",expense);
setColor("balanceTotal",balance);

}

function setColor(id,value){

let el = document.getElementById(id).parentElement;

el.classList.remove("positive","negative","zero");

if(value > 0){
el.classList.add("positive");
}

else if(value < 0){
el.classList.add("negative");
}

else{
el.classList.add("zero");
}

document.getElementById(id).classList.add("number-animate");

setTimeout(()=>{
document.getElementById(id).classList.remove("number-animate");
},400);

}

function getMonthlySummary(){

let data = JSON.parse(localStorage.getItem(key)) || [];

let monthIncome = 0;
let monthExpense = 0;

let now = new Date();
let m = now.getMonth();
let y = now.getFullYear();

data.forEach(item=>{

let d = new Date(item.date);

if(d.getMonth()===m && d.getFullYear()===y){

if(item.type==="income"){
monthIncome += item.amount;
}else{
monthExpense += item.amount;
}

}

});

return {
income:monthIncome,
expense:monthExpense
};

}

function getYearSummary(){

let data = JSON.parse(localStorage.getItem(key)) || [];

let yearIncome = 0;
let yearExpense = 0;

let now = new Date();
let y = now.getFullYear();

data.forEach(item=>{

let d = new Date(item.date);

if(d.getFullYear()===y){

if(item.type==="income"){
yearIncome += item.amount;
}else{
yearExpense += item.amount;
}

}

});

return {
income:yearIncome,
expense:yearExpense
};

}

let m = getMonthlySummary();
let y = getYearSummary();

document.getElementById("monthInc").textContent = m.income;
document.getElementById("monthExp").textContent = m.expense;

document.getElementById("yearInc").textContent = y.income;
document.getElementById("yearExp").textContent = y.expense;


function saveBudget(){

let value = document.getElementById("budgetLimit").value;

localStorage.setItem("monthlyBudget",value);

document.getElementById("budgetMax").textContent = value;

checkBudget();

}


function checkBudget(){

let budget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;

let used = parseFloat(document.getElementById("monthExp").textContent);

document.getElementById("budgetUsed").textContent = used;
document.getElementById("budgetMax").textContent = budget;

let percent = 0;

if(budget>0){
percent = (used/budget)*100;
}

document.getElementById("budgetProgress").style.width = percent + "%";

let bar = document.getElementById("budgetProgress");

let alert = document.getElementById("budgetAlert");

if(percent > 100){

bar.style.background="#e74c3c";

alert.textContent="⚠ Budget exceeded";

}

else if(percent > 80){

bar.style.background="#f39c12";

alert.textContent="⚠ Near budget limit";

}

else{

bar.style.background="#2ecc71";

alert.textContent="";

}

}

checkBudget();


</script>

</body>
</html>
