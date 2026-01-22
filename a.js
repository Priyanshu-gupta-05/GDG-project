// 🔹 Load data from localStorage (or start fresh)
let members = JSON.parse(localStorage.getItem("members")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// 🔹 Save data to localStorage
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function addMember() {
    const nameInput = document.getElementById("memberName");
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Please enter a member name");
        return;
    }

    members.push(name);
    nameInput.value = "";

    saveData();
    renderMembers();
}

function renderMembers() {
    const memberList = document.getElementById("memberList");
    const paidBySelect = document.getElementById("paidBy");
    const involvedDiv = document.getElementById("peopleInvolved");

    memberList.innerHTML = "";
    paidBySelect.innerHTML = "";
    involvedDiv.innerHTML = "";

    members.forEach(member => {
        // Member list
        const li = document.createElement("li");
        li.textContent = "👤 " + member;
        memberList.appendChild(li);

        // Paid by dropdown
        const option = document.createElement("option");
        option.value = member;
        option.textContent = member;
        paidBySelect.appendChild(option);

        // People involved checkboxes
        const checkboxDiv = document.createElement("div");
        checkboxDiv.className = "checkbox-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = member;
        checkbox.checked = true;

        const label = document.createElement("label");
        label.textContent = member;

        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        involvedDiv.appendChild(checkboxDiv);
    });

    calculateSummary();
}
function addExpense() {
    const expenseName = document.getElementById("expenseName").value.trim();
    const expenseAmount = Number(document.getElementById("expenseAmount").value);
    const paidBy = document.getElementById("paidBy").value;

    const checkedBoxes = document.querySelectorAll("#peopleInvolved input:checked");
    let involvedPeople = [];

    checkedBoxes.forEach(cb => {
        involvedPeople.push(cb.value);
    });

    if (expenseName === "" || expenseAmount <= 0 || involvedPeople.length === 0) {
        alert("Please fill all expense details");
        return;
    }

    expenses.push({
        name: expenseName,
        amount: expenseAmount,
        paidBy: paidBy,
        involved: involvedPeople
    });

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";

    saveData();
    calculateSummary();
}
function calculateSummary() {
    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = "";

    let balance = {};
    members.forEach(member => {
        balance[member] = 0;
    });
    expenses.forEach(expense => {
        const splitAmount = expense.amount / expense.involved.length;

        expense.involved.forEach(person => {
            balance[person] -= splitAmount;
        });

        balance[expense.paidBy] += expense.amount;
    });

    // Display balances
    members.forEach(member => {
        const amount = balance[member].toFixed(2);
        const div = document.createElement("div");
        div.className = "balance";

        if (amount > 0) {
            div.textContent = `${member} gets ₹${amount}`;
        } else if (amount < 0) {
            div.textContent = `${member} owes ₹${Math.abs(amount)}`;
        } else {
            div.textContent = `${member} is settled`;
        }

        summaryDiv.appendChild(div);
    });
}

// 🔹 Load data when page refreshes
window.onload = function () {
    renderMembers();
};
