let params = new URLSearchParams(window.location.search);
let year = params.get('year');
let category = params.get('category');
const table = document.getElementById('category-expenses-table')

window.electron.getCategoryDetailsByYear(year, category).then(expenses => {
    expenses.forEach(expense => {
        let row = document.createElement('tr');
        for (let [key, value] of Object.entries(expense)) {
            let cell = document.createElement('td');
            cell.textContent = value.toString();
            row.appendChild(cell);
        }
        table.appendChild(row);
    })
})