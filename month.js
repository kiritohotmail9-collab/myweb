const months = [
"January","February","March","April",
"May","June","July","August",
"September","October","November","December"
];

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayDay = today.getDate();

let selectedDay = todayDay;
let currentYear = todayYear;
let currentMonth = todayMonth;


/* โหลดเดือนที่คลิกมาจาก year page */
const savedMonth = localStorage.getItem("openMonth")
const savedDay = localStorage.getItem("openDay")

if(savedMonth !== null){

currentMonth = parseInt(savedMonth)
selectedDay = parseInt(savedDay)

localStorage.removeItem("openMonth")
localStorage.removeItem("openDay")

}

const monthTitle = document.getElementById("monthTitle");
const yearText = document.getElementById("yearText");
const calendarContainer = document.getElementById("calendar");
const monthlyTodo = document.getElementById("todoList");

function getDaysInMonth(year, monthIndex) {
return new Date(year, monthIndex + 1, 0).getDate();
}

function createMonth(){

calendarContainer.innerHTML="";

monthTitle.textContent=months[currentMonth];
yearText.textContent=currentYear;

const grid=document.createElement("div");
grid.classList.add("calendar-grid");

const daysHeader=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

daysHeader.forEach(day=>{
const header=document.createElement("div");
header.classList.add("day-header");
header.textContent=day;
grid.appendChild(header);
});

const firstDay=new Date(currentYear,currentMonth,1).getDay();
const totalDays=getDaysInMonth(currentYear,currentMonth);

for(let i=0;i<firstDay;i++){
const empty=document.createElement("div");
grid.appendChild(empty);
}

for(let day=1;day<=totalDays;day++){

const dateKey=`${currentYear}-${currentMonth}-${day}`;

const cell=document.createElement("div");
cell.classList.add("day-box");

if(
day===todayDay &&
currentMonth===todayMonth &&
currentYear===todayYear
){
cell.classList.add("today");
}

if(day===selectedDay){
cell.classList.add("selected-day");
}


cell.onclick=()=>{
selectedDay=day;
createMonth();   // รีเฟรช highlight
showTodo();
};


const tasks=JSON.parse(localStorage.getItem(dateKey))||[];

cell.innerHTML=`
<div class="date-number">${day}</div>
${tasks.length>0?`<div class="task-badge">${tasks.length}</div>`:""}
`;

grid.appendChild(cell);

}

calendarContainer.appendChild(grid);

}

function prevMonth(){

currentMonth--;

if(currentMonth<0){
currentMonth=11;
currentYear--;
}

calendarContainer.classList.add("fade");

setTimeout(()=>{
createMonth();
calendarContainer.classList.remove("fade");
},150);

}

function nextMonth(){

currentMonth++;

if(currentMonth>11){
currentMonth=0;
currentYear++;
}

calendarContainer.classList.add("fade");

setTimeout(()=>{
createMonth();
calendarContainer.classList.remove("fade");
},150);

}


function showTodo(){

const dateKey=`${currentYear}-${currentMonth}-${selectedDay}`;

document.getElementById("todoDateTitle").innerText =
selectedDay+" "+months[currentMonth]+" "+currentYear;

monthlyTodo.innerHTML="";

const tasks=JSON.parse(localStorage.getItem(dateKey))||[];

tasks.forEach((task,index)=>{

const item=document.createElement("div");
item.classList.add("todo-item");

if(task.done) item.classList.add("todo-done");

item.innerHTML=`

<input type="checkbox"
${task.done?"checked":""}
onclick="toggleDone('${dateKey}',${index})">

<span>${task.time ? task.time+" - " : ""}${task.text}</span>

<button class="todo-delete"
onclick="deleteTodo('${dateKey}',${index})">
🗑
</button>

`;

monthlyTodo.appendChild(item);

});

}


function toggleDone(key,index){

const tasks=JSON.parse(localStorage.getItem(key))||[];

tasks[index].done=!tasks[index].done;

localStorage.setItem(key,JSON.stringify(tasks));

showTodo();
createMonth();

}

function deleteTodo(key,index){

const tasks=JSON.parse(localStorage.getItem(key))||[];

tasks.splice(index,1);

localStorage.setItem(key,JSON.stringify(tasks));

showTodo();
createMonth();

}

/* ======================
   TODO POPUP
====================== */

function openTodoModal(){
document.getElementById("todoModal").classList.add("show");
}

function closeTodoModal(){
document.getElementById("todoModal").classList.remove("show");
}

function saveTodo(){

const text=document.getElementById("todoText").value;
const time=document.getElementById("todoTime").value;

if(!text) return;

const dateKey=`${currentYear}-${currentMonth}-${selectedDay}`;

const tasks=JSON.parse(localStorage.getItem(dateKey))||[];

tasks.push({
text:text,
time:time,
done:false
});

localStorage.setItem(dateKey,JSON.stringify(tasks));

document.getElementById("todoText").value="";
document.getElementById("todoTime").value="";

closeTodoModal();

createMonth();
showTodo();

}


/* ======================
   MONTH POPUP
====================== */

monthTitle.onclick=()=>{
document.getElementById("monthModal").classList.add("show");
};

function changeMonth(){

currentMonth=parseInt(document.getElementById("monthInput").value);

document.getElementById("monthModal").classList.remove("show");

createMonth();

}

/* ======================
   YEAR POPUP
====================== */

yearText.onclick=()=>{
document.getElementById("yearModal").classList.add("show");
};

function changeYear(){

currentYear=parseInt(document.getElementById("yearInput").value);

document.getElementById("yearModal").classList.remove("show");

createMonth();

}

createMonth();
showTodo();

// ขอ permission แจ้งเตือน
if(Notification.permission !== "granted"){
Notification.requestPermission();
}

function checkNotifications(){

const now=new Date();
const hour=now.getHours();
const minute=now.getMinutes();

for(let key in localStorage){

if(!key.includes("-")) continue;

const tasks=JSON.parse(localStorage.getItem(key));

tasks.forEach(task=>{

if(!task.time || task.done) return;

const [h,m]=task.time.split(":");

if(parseInt(h)==hour && parseInt(m)==minute){

new Notification("⏰ เตือนงาน",{
body:task.text
});

}

});

}

}

setInterval(checkNotifications,60000);

