let params = new URLSearchParams(window.location.search);
let year = params.get('year');
let categoryId = params.get('categoryId');
let categoryType = params.get('categoryType');
const table = document.getElementById('category-expenses-table')
const table_body = document.getElementById('table-body');

window.electron.getCategoryDetailsByYear(year, categoryId).then(async expenses => {
    table_body.innerHTML = '';
    for (const expense of expenses) {
        expense.category = categoryType;
        expense.date = expense.date.split('-').reverse().join('-');
        let row = document.createElement('tr');
        Object.keys(expense).forEach(key => {
            const cell = document.createElement('td');
            cell.innerText = expense[key];
            row.style.textAlign = 'right';
            row.appendChild(cell);
        })
        table_body.appendChild(row);
    }
})