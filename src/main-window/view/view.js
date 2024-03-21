let data = null
const select = document.getElementById('year-options');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const applyButton = document.getElementById('apply-filter');
const radioForm = document.getElementById('radio-form');
const amountField = document.getElementById('total-amount');
const dropdown = document.getElementById('dropdown-menu');
let expensesList = []

document.addEventListener('DOMContentLoaded', () => {
    const firstRadioButton = document.querySelector('#radio-form input[type="radio"]:first-child');
    firstRadioButton.checked = true;
    radioForm.value = firstRadioButton.value;

})

window.electron.getYears().then(years => {
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        select.appendChild(option);
    });
    select.selectedIndex = select.options.length - 1;
    select.value = select.options[select.selectedIndex].value;
    getYearExpenses(select.value).then(r => {
        applyFilter()
    })
});

async function getYearExpenses(year) {
    expensesList = await window.electron.getExpensesByYear(year)
    for (let i = 0; i < expensesList.length; i++) {
        expensesList[i].category = await window.electron.getCategoryById(expensesList[i].category)
    }
}


window.electron.getCategories().then(categories => {
    categories.sort((a, b) => a.type.localeCompare(b.type));
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.innerHTML = `<a class="dropdown-item" href="#">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="${category.type}"/>
                                        <label class="form-check-label" for="${category.type}">${category.type}</label>
                                    </div>
                                </a>`;
        li.addEventListener('click', event => {
            //prevents the dropdown from closing after clicking on a checkbox label
            event.stopPropagation();
            //if clicked on a checkbox label, toggle the checkbox
            const checkbox = document.getElementById(category.type);
            checkbox.checked = !checkbox.checked;
        })
        dropdown.appendChild(li);
    })
})

function resetSelectedCheckBoxes() {
    const checkboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    applyFilter()
}

function goBack() {
    window.history.back();
}


select.addEventListener('change', async () => {
    getYearExpenses(select.value).then(r => {
        applyFilter()
    })
});


const elements = [toDate, fromDate, radioForm, dropdown];
elements.forEach(element => {
    element.addEventListener('change', applyFilter);
});


function applyFilter() {
    let filteredExpenses = [...expensesList];
    const selectedCategories = getSelectedCategories()
    filteredExpenses = filterBySelectedCategories(filteredExpenses, selectedCategories);
    filteredExpenses = filterByDate(filteredExpenses);
    sortBy(filteredExpenses);
    updateTable(filteredExpenses);
}


function getSelectedCategories() {
    let tempSelectedCategories = [];
    const checkboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        tempSelectedCategories.push(checkbox.id);
    })
    return tempSelectedCategories;
}

function filterBySelectedCategories(expenses, selectedCategories) {
    if (selectedCategories.length > 0) {
        expenses = expenses.filter(expense => selectedCategories.includes(expense.category));
    }
    return expenses;
}

function filterByDate(expenses) {
    if (fromDate.value !== '') {
        expenses = expenses.filter(expense => {
            let expenseDate = expense.date.split('-').reverse().join('-');
            return new Date(expenseDate) >= new Date(fromDate.value);
        });
    }
    if (toDate.value !== '') {
        expenses = expenses.filter(expense => {
            let expenseDate = expense.date.split('-').reverse().join('-');
            return new Date(expenseDate) <= new Date(toDate.value)
        });
    }
    return expenses;
}

function sortBy(expenses) {
    let selectedValue = document.querySelector('#radio-form input[type="radio"]:checked').value;
    switch (selectedValue) {
        case 'id':
            expenses.sort((a, b) => a.id - b.id);
            break;
        case 'amount-asc':
            expenses.sort((a, b) => a.amount - b.amount);
            break;
        case 'amount-des':
            expenses.sort((a, b) => b.amount - a.amount);
            break;
        case 'date-asc':
            expenses.sort((a, b) => {
                let dateA = a.date.split('-').reverse().join('-');
                let dateB = b.date.split('-').reverse().join('-');
                return new Date(dateA) - new Date(dateB);
            });
            break;
        case 'date-des':
            expenses.sort((a, b) => {
                let dateA = a.date.split('-').reverse().join('-');
                let dateB = b.date.split('-').reverse().join('-');
                return new Date(dateB) - new Date(dateA);
            });
            break;
        case 'category':
            expenses.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
}


function updateTable(expenses) {
    document.getElementById('table-body').innerHTML = '';

    // Calcola la somma totale delle spese
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);

    // Crea una nuova riga per la somma totale
    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    totalCell.innerText = `Totale: ${totalAmount} €`;
    totalCell.colSpan = 6; // Assumendo che la tua tabella abbia 6 colonne
    totalRow.appendChild(totalCell);

    // Aggiungi la riga della somma totale in cima alla tabella
    document.getElementById('table-body').appendChild(totalRow);

    //aggiungi le spese nella tabella
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        Object.keys(expense).forEach(key => {
            const cell = document.createElement('td');
            cell.addEventListener('click', () => {
                window.electron.openExpenseEditWindow(expense, select.value);
            })
            cell.innerText = expense[key];
            row.appendChild(cell);
        })
        document.getElementById('table-body').appendChild(row);
    });
}
