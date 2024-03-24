const year_select = document.getElementById('year-select');
const table = document.getElementById('table');
const thead = document.getElementById('table-head');
const tbody = document.getElementById('table-body');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const order_select = document.getElementById('order-select');

let expensesList = []
let categoriesList = []


function goBack() {
    window.history.back();
}

window.electron.getYears().then(years => {
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        year_select.appendChild(option);
    });
    years.value = year_select.options[year_select.selectedIndex].value;
    getYearExpenses(years.value);

})

window.electron.getCategories().then(categories => {
    categoriesList = categories;
})

function getYearExpenses(year) {
    window.electron.getExpensesByYear(year).then(expenses => {
        expensesList = expenses;
        updateTable();
    })
}

order_select.addEventListener('change', () => {
    updateTable();
})

year_select.addEventListener('change', (event) => {
    toDate.value = '';
    fromDate.value = '';
    getYearExpenses(event.target.value)
})

const elements = [fromDate, toDate];
elements.forEach(element => {
    element.addEventListener('change', () => {
        updateTable();
    })
})

function orderBy(uniqueCategories) {
    console.log(order_select.value)
    if(order_select.value === 'alphabetical') {
        return uniqueCategories.sort((a, b) => a.type.localeCompare(b.type));
    }
    return uniqueCategories.sort((a, b) => a.id - b.id);

}

function updateTable() {
    tbody.innerHTML = '';
    thead.innerHTML = '';
    applyFilters(expensesList).then(async filteredList => {
        addTableHeader()
        addTotalRow(filteredList)
        let uniqueCategories = findUniqueCategoriesAndRelatedIds(filteredList);
        uniqueCategories = orderBy(uniqueCategories);
        for (const category of uniqueCategories) {
            const tr = document.createElement('tr');
            const tdCategory = document.createElement('td');
            tdCategory.innerText = category.type;

            tr.appendChild(tdCategory);
            const tdSum = document.createElement('td');
            tdSum.innerText = filteredList.filter(expense => expense.category === category.id).reduce((acc, expense) => acc + expense.amount, 0).toFixed(2);
            tdSum.style.textAlign = 'right';
            tr.appendChild(tdSum);
            tr.addEventListener('click', async () => {
                window.electron.openCategoryExpenseDetailsWindow(year_select.value, category.id, category.type)
            })
            tbody.appendChild(tr);
        }
    })

}

function findUniqueCategoriesAndRelatedIds(expenses) {
    const categories = expenses.map(expense => expense.category);
    let uniqueCategories = [...new Set(categories)];
    uniqueCategories = uniqueCategories.map(categoryId => {
        return categoriesList.find(cat => {
            if(cat.id === categoryId) {
                return {
                    id: cat.id,
                    type: cat.type
                }
            }
        })
    })
    return uniqueCategories;

}

function addTableHeader() {
    const tr = document.createElement('tr');
    const thCategory = document.createElement('th');
    thCategory.innerText = 'Categoria';
    tr.appendChild(thCategory);
    const thSum = document.createElement('th');
    thSum.innerText = 'Totale';
    tr.appendChild(thSum);
    thead.appendChild(tr);
}

function addTotalRow(list) {
    const totalAmount = list.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    const totalValue = document.createElement('td');
    totalCell.innerText = `Totale:`;
    totalValue.innerText = `${totalAmount}`;
    totalValue.style.textAlign = 'right';
    totalRow.style.fontWeight = 'bold';
    totalRow.appendChild(totalCell);
    totalRow.appendChild(totalValue);
    tbody.appendChild(totalRow);
}

async function applyFilters(list) {
    let filteredList = list;
    if (fromDate.value !== '') {
        filteredList = filteredList.filter(expense => new Date(expense.date) >= new Date(fromDate.value));
    }
    if (toDate.value !== '') {
        filteredList = filteredList.filter(expense => new Date(expense.date) <= new Date(toDate.value));
    }
    return filteredList;
}
