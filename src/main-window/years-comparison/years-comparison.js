const table = document.getElementById('comparison-table');
const table_head = document.getElementById('table-head');
const table_body = document.getElementById('table-body');
let categories = []
let years = []

Promise.all([
    window.electron.getCategories(),
    window.electron.getYears()])
    .then(values => {
        categories = values[0]
        years = values[1]
        years.reverse()
        createTable()
    })
    .catch(error => {
        console.error(error);
    })

function goBack() {
    window.history.back();
}

async function createTable() {

    //add total row
    let totalRow = document.createElement('tr');
    let cell = document.createElement('td');
    cell.textContent = 'Totale';
    totalRow.appendChild(cell);


    let th = document.createElement('th');
    th.textContent = 'Categorie';
    table_head.appendChild(th);
    for (let year of years) {
        let th = document.createElement('th');
        th.textContent = year;
        table_head.appendChild(th);

        //add total row cell for each year
        let yearTotalCell = document.createElement('td');
        let yearSum = await sumExpensesByYear(year);
        yearTotalCell.textContent = yearSum;
        totalRow.appendChild(yearTotalCell);
    }
    table_body.insertBefore(totalRow, table_body.firstChild);

    for (let category of categories) {

        let row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = category.type;
        row.appendChild(td);

        let yearSum = 0;
        for (let year of years) {
            let td = document.createElement(`td`)
            // Aggiungi un gestore di eventi click alla cella
            td.addEventListener('click', function () {
                // Apri una nuova finestra o fai qualcos'altro qui
                window.electron.openCategoryExpenseDetailsWindow(year, category.type);
            });
            let sum = await sumCategoryExpensesByYear(category.type, year);
            td.textContent = sum;
            row.appendChild(td);
        }
        table_body.appendChild(row);
    }


}

async function sumExpensesByYear(year) {
    let expenses = await window.electron.getExpensesByYear(year);
    let sum = 0;
    for (let expense of expenses) {
        sum += expense.amount;
    }
    return sum.toFixed(2);
}

async function sumCategoryExpensesByYear(category, year) {
    let expenses = await window.electron.getExpensesByYear(year);
    let sum = 0;
    for (let expense of expenses) {
        if (expense.type === category) {
            sum += expense.amount;
        }
    }
    return sum.toFixed(2);
}
