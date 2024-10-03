let params = new URLSearchParams(window.location.search);
let year = params.get('year');
let categoryId = params.get('categoryId');
let categoryType = params.get('categoryType');
const fromDate = params.get('fromDate') || '';
const toDate = params.get('toDate') || '';
const table = document.getElementById('category-expenses-table')
const table_body = document.getElementById('table-body');

function filterByDate(expenses) {
    console.log(fromDate, toDate)
    if (fromDate === '' && toDate === '') {
        return expenses;
    }
    if(fromDate === '') {
        return expenses.filter(expense => new Date(expense.date) <= new Date(toDate))
    }

    if(toDate === '') {
        return expenses.filter(expense => new Date(expense.date) >= new Date(fromDate))
    }

    return expenses.filter(expense => {
        return new Date(expense.date) >= new Date(fromDate) && new Date(expense.date) <= new Date(toDate)
    })
}


window.electron.getCategoryDetailsByYear(year, categoryId).then(async expenses => {
    console.log(expenses)
    table_body.innerHTML = '';
    expenses = filterByDate(expenses);
    console.log(expenses)
    for (const expense of expenses) {
        expense.category = categoryType;
        expense.date = expense.date.split('-').reverse().join('-');
        expense.amount = expense.amount.toFixed(2);
        let row = document.createElement('tr');
        Object.keys(expense).forEach(key => {
            const cell = document.createElement('td');
            cell.addEventListener('click', () => {
                window.electron.openExpenseEditWindow(expense, year);
            })
            cell.innerText = expense[key];
            if (key === 'description') {
                cell.style.textAlign = 'left';
            }
            row.style.textAlign = 'right';
            row.appendChild(cell);
        })
        table_body.appendChild(row);
    }
})