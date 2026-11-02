// Exercise 3 - Expense Tracker
// Write all your code in this file. Read README.md for the full instructions.
// Run the tests with: npm test

// One expense in the array looks like this:
// { id: 1, desc: "Pizza", amount: 42.5, category: "food" }

// Step 1: add an expense on submit (unique id, no reload, validation messages, clear desc + amount, focus desc)

// Step 2: render() - rebuild the table rows from the array

// Step 3: delete (one listener on #rows - event delegation, by data-id)

// Step 4: total of the expenses that are shown

// Step 5: filter by category

// Step 6: sort by amount (toSorted - the original array keeps its order)

// Step 7: rows with an amount above 100 get the class "big"
const expenseForm = document.querySelector("#expense-form");
const descInput = document.querySelector("#desc");
const amountInput = document.querySelector("#amount");
const categorySelect = document.querySelector("#category");
const formError = document.querySelector("#form-error");

const rowsContainer = document.querySelector("#rows");
const noRowsMsg = document.querySelector("#no-rows");
const totalEl = document.querySelector("#total");
const filterSelect = document.querySelector("#filter");
const sortBtn = document.querySelector("#sort-btn");

let expenses = []; 
let nextId = 1; 
let isSorted = false;

function render() {
    const selectedCategory = filterSelect.value;

    let visibleExpenses = expenses.filter(expense => {
        if (selectedCategory === "all") return true;
        return expense.category === selectedCategory;
    });

    if (isSorted) {
        visibleExpenses = visibleExpenses.toSorted((a, b) => b.amount - a.amount);
    }

    if (visibleExpenses.length === 0) {
        noRowsMsg.removeAttribute("hidden");
    } else {
        noRowsMsg.setAttribute("hidden", "");
    }

    rowsContainer.innerHTML = "";
    visibleExpenses.forEach(expense => {
        const tr = document.createElement("tr");

        if (expense.amount > 100) {
            tr.classList.add("big");
        }

        tr.innerHTML = `
            <td>${expense.desc}</td>
            <td><span class="badge">${expense.category}</span></td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>
                <button type="button" class="delete" data-id="${expense.id}">Delete</button>
            </td>
        `;
        rowsContainer.appendChild(tr);
    });

    const total = visibleExpenses.reduce((sum, item) => sum + item.amount, 0);
    totalEl.textContent = total.toFixed(2);
}

expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (desc === "") {
        formError.textContent = "Please add a description";
        formError.removeAttribute("hidden");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        formError.textContent = "The amount must be larger than 0";
        formError.removeAttribute("hidden");
        return;
    }

    formError.setAttribute("hidden", "");

    const newExpense = {
        id: nextId++,
        desc: desc,
        amount: amount,
        category: category
    };

    expenses.push(newExpense);

    descInput.value = "";
    amountInput.value = "";
    descInput.focus();

    render();
});

rowsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete")) {
        const idToDelete = Number(event.target.dataset.id);
        expenses = expenses.filter(expense => expense.id !== idToDelete);
        render();
    }
});

filterSelect.addEventListener("change", function() {
    render();
});

sortBtn.addEventListener("click", function() {
    isSorted = !isSorted;
    sortBtn.textContent = `Sort by amount: ${isSorted ? "on" : "off"}`;
    render();
});