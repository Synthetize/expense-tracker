const table = document.getElementById('comparison-table');
const table_head = document.getElementById('table-head');
const table_body = document.getElementById('table-body');
const spinner = document.getElementById('spinner');
let categoriesList = []
let yearsList = []
let yearsExpenses = []


Promise.all([
    window.electron.getCategories(),
    window.electron.getYears()
]).then(async ([categories, years]) => {
    categoriesList = categories.sort((a, b) => a.type.localeCompare(b.type));
    yearsList = years.slice(0, 7);
    await getExpenses()
    createTable()
})

function goBack() {
    window.history.back();
}

async function getExpenses() {
    for (const year of yearsList) {
        await window.electron.getExpensesByYear(year).then(expenses => {
            const yearExpense = {
                year: parseInt(year),
                expenses: expenses
            }
            yearsExpenses.push(yearExpense)
        })
    }
}


async function createTable() {
    table_head.innerHTML = '';
    table_body.innerHTML = '';

    createTableHeader();

    for (let year of yearsList) {
        createTotalRow(year);
        createCategoryRows(year);
    }
}

function createTableHeader() {
    let headerRow = document.createElement('tr');
    let th = document.createElement('th');
    th.textContent = 'Categoria';
    headerRow.appendChild(th);

    for (let year of yearsList) {
        // Aggiungi l'anno all'intestazione
        th = document.createElement('th');
        th.textContent = year;
        headerRow.appendChild(th);
    }
    table_head.appendChild(headerRow);
}

function createTotalRow(year) {
    // Aggiungi la somma delle spese per l'anno
    const totalRow = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = 'Totale';
    totalRow.appendChild(td);
    for (let year of yearsList) {
        let td = document.createElement('td');
        td.textContent = sumExpensesByYear(year);
        totalRow.appendChild(td);
    }
    table_body.appendChild(totalRow);
}

function createCategoryRows(year) {
    for (let category of categoriesList) {
        let row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = category.type;
        row.appendChild(td);

        let categoryRowContainsAllZero = true;
        for (let year of yearsList) {
            td = document.createElement('td');
            let categorySum = sumCategoryExpensesByYear(category.id, year);
            td.textContent = categorySum;
            if (categorySum !== '0.00') {
                categoryRowContainsAllZero = false;
            }
            td.addEventListener('click', () => {
                window.electron.openCategoryExpenseDetailsWindow(year, category.id, category.type);
            })
            row.appendChild(td);
        }
        if (!categoryRowContainsAllZero) {
            table_body.appendChild(row);
        }
    }
}

function sumExpensesByYear(year) {
    let yearExpenses = yearsExpenses.find(yearExpense => yearExpense.year === parseInt(year));
    return yearExpenses.expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
}

function sumCategoryExpensesByYear(categoryId, year) {
    let yearExpenses = yearsExpenses.find(yearExpense => yearExpense.year === parseInt(year));
    let categoryExpenses = yearExpenses.expenses.filter(expense => expense.category === categoryId);
    return categoryExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
}