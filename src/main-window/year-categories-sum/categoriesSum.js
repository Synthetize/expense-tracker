const year_select = document.getElementById('year-select');
const table = document.getElementById('table');
const thead = document.getElementById('table-head');
const tbody = document.getElementById('table-body');
let expensesList = []


function goBack() {
    window.history.back();
}

window.electron.getYears().then(years => {
    years = years.sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        year_select.appendChild(option);
    });
    years.value = year_select.options[year_select.selectedIndex].value;
    getYearExpenses(years.value);

})

function getYearExpenses(year) {
    window.electron.getExpensesByYear(year_select.options[year_select.selectedIndex].value).then(expenses => {
        expensesList = expenses;
        updateTable();
    })
}

year_select.addEventListener('change', (event) => {
    getYearExpenses(event.target.value);
    updateTable();
})

async function updateTable() {
    applyFilters().then(() => {
        addTableHeader()
        addTotalRow()
        //create a table with groub by category and sum of expenses
        const categories = expensesList.map(expense => expense.category);
        const uniqueCategories = [...new Set(categories)];

        uniqueCategories.forEach(async category => {
            const tr = document.createElement('tr');
            const tdCategory = document.createElement('td');
            tdCategory.innerText = await window.electron.getCategoryById(category)
            tr.appendChild(tdCategory);
            const tdSum = document.createElement('td');
            tdSum.innerText = expensesList.filter(expense => expense.category === category).reduce((acc, expense) => acc + expense.amount, 0).toFixed(2);
            tr.appendChild(tdSum);
            tr.addEventListener('click', () => {
                window.electron.openCategoryExpenseDetailsWindow(year_select.value, category)
            })
            tbody.appendChild(tr);
        })
    })

}

function addTableHeader() {
    const tr = document.createElement('tr');
    const thCategory = document.createElement('th');
    thCategory.innerText = 'Categoria';
    tr.appendChild(thCategory);
    const thSum = document.createElement('th');
    thSum.innerText = 'Somma';
    tr.appendChild(thSum);
    thead.appendChild(tr);
}

function addTotalRow() {
    const totalAmount = expensesList.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    const totalValue = document.createElement('td');
    totalCell.innerText = `Totale:`;
    totalValue.innerText = `${totalAmount}`;
    totalRow.appendChild(totalCell);
    totalRow.appendChild(totalValue);
    tbody.appendChild(totalRow);
}

async function applyFilters(categories) {
}
