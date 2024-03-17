async function createTable() {
    // Leggi il file categories.json
    let categories = await window.electron.getCategories();
    console.log(categories);
    let years = await window.electron.getYears();

    let table = document.createElement('table');

    let headerRow = document.createElement('tr');
    let th = document.createElement('th');
    th.textContent = 'Category';
    headerRow.appendChild(th);
    for (let year of years) {
        let th = document.createElement('th');
        th.textContent = year;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let category of categories) {

        let row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = category.type;
        row.appendChild(td);


        for (let year of years) {
            let td = document.createElement(`td`)
            // Aggiungi un gestore di eventi click alla cella
            td.addEventListener('click', function() {
                // Apri una nuova finestra o fai qualcos'altro qui
                window.electron.openCategoryExpenseDetailsWindow(year, category.type);
            });
            let sum = await sumCategoryExpensesByYear(category.type, year);
            td.textContent = sum;
            row.appendChild(td);
        }
        table.appendChild(row);
    }

    document.body.appendChild(table);
}


async function sumCategoryExpensesByYear(category, year) {
    let expenses = await window.electron.getExpensesByYear(year);
    let sum = 0;
    for (let expense of expenses) {
        if (expense.type === category) {
            sum += expense.amount;
        }
    }
    return sum;
}

createTable();