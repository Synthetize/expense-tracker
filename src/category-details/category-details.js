let params = new URLSearchParams(window.location.search);
let year = params.get('year');
let category = params.get('category');
const table = document.getElementById('category-expenses-table')
const table_body = document.getElementById('table-body');

window.electron.getCategoryDetailsByYear(year, category).then(expenses => {
    expenses.forEach(expense => {
        let row = document.createElement('tr');
        Object.keys(expense).forEach(key => {
            const cell = document.createElement('td');
            cell.innerText = expense[key];
            row.appendChild(cell);
        })
        table_body.appendChild(row);
    })
})