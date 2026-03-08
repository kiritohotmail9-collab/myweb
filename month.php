<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>MONTH PLANNER</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Header -->
    <div class="header">
        <h1>MONTH PLANNER</h1>
    </div>

    <!-- Navbar -->
    <div class="navbar">
        <a href="index.php">HOME</a>
        <a href="year.php">YEAR</a>
        <a href="month.php">MONTH</a>
        <a href="expense.php">EXPENSE</a>
        <a href="diary.php">DIARY</a>
        <a href="profile.php">PROFILE</a>
    </div>

<div class="modern-header">

    <div class="month-control">
        <button onclick="prevMonth()">◀</button>

        <h1 id="monthTitle" class="clickable"></h1>
        <h2 id="yearText" class="clickable small-year"></h2>

        <button onclick="nextMonth()">▶</button>
    </div>

    <div class="filter-bar">
        <select id="filterType" onchange="createMonth()">
            <option value="all">All</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="personal">Personal</option>
        </select>
    </div>

</div>


<!-- Month Modal -->
<div class="modal" id="monthModal">
    <div class="modal-content small">
        <h3>MONTH</h3>
        <select id="monthInput"></select>
        <div class="modal-buttons">
            <button class="btn" onclick="closeMonthModal()">ยกเลิก</button>
            <button class="btn primary" onclick="changeMonth()">ตกลง</button>
        </div>
    </div>
</div>

<!-- Year Modal -->
<div class="modal" id="yearModal">
    <div class="modal-content small">
        <h3>YEAR</h3>
        <input type="number" id="yearInput" min="1900" max="2100">
        <div class="modal-buttons">
            <button class="btn" onclick="closeYearModal()">ยกเลิก</button>
            <button class="btn primary" onclick="changeYear()">ตกลง</button>
        </div>
    </div>
</div>

<!-- Todo Popup -->

<div class="modal" id="todoModal">

<div class="modal-content">

<h3>Add</h3>

<input type="time" id="todoTime">

<textarea id="todoText" placeholder="พิมพ์งาน..."></textarea>

<div class="modal-buttons">

<button onclick="closeTodoModal()" class="btn">
cancel
</button>

<button onclick="saveTodo()" class="btn primary">
save
</button>

</div>

</div>

</div>

<div class="month-layout">

    <!-- ปฏิทิน -->
    <div class="calendar-side">
        <div id="calendar"></div>
    </div>

    <!-- Todo -->
    <div class="todo-side">

        <h3 id="todoDateTitle">เลือกวัน</h3>

        <button class="add-btn" onclick="openTodoModal()">
            + Add
        </button>

        <div id="todoList"></div>

    </div>

</div>



<script src="month.js"></script>
</body>
</html>
