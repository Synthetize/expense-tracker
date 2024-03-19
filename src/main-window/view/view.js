let data = null
const select = document.getElementById('year-options');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const applyButton = document.getElementById('apply-filter');
const radioForm = document.getElementById('radio-form');
const amountField = document.getElementById('total-amount');
const dropdown = document.getElementById('dropdown-menu');

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
    applyFilter()
});

window.electron.getCategories().then(categories => {
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.innerHTML = `<a class="dropdown-item" href="#">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="${category.type}"/>
                                        <label class="form-check-label" for="${category.type}">${category.type}</label>
                                    </div>
                                </a>`;
        dropdown.appendChild(li);
    })
})

function removeSelectedCheckboxes() {
    const checkboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    applyFilter()
}

function goBack() {
    window.history.back();
}


const elements = [select, toDate, fromDate, radioForm, dropdown];
elements.forEach(element => {
    element.addEventListener('change', applyFilter);
});

;

function applyFilter() {
    window.electron.getExpensesByYear(select.value).then(expenses => {
        const selectedCategories = [];
        const checkboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            selectedCategories.push(checkbox.id);
        });
        console.log(selectedCategories);
        if (fromDate.value !== '') {
            expenses = expenses.filter(expense => new Date(expense.date) >= new Date(fromDate.value));
        }
        if (toDate.value !== '') {
            expenses = expenses.filter(expense => new Date(expense.date) <= new Date(toDate.value));
        }
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
                expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'date-des':
                expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'type':
                expenses.sort((a, b) => a.type.localeCompare(b.type));
                break;
        }
        updateTable(expenses, selectedCategories);
    })
}

function updateTable(expenses, selectedCategories) {
    const table = document.getElementById('expenses-table');
    document.getElementById('table-body').innerHTML = '';

    // Se selectedCategories non è vuoto, filtra le spese
    if (selectedCategories.length > 0) {
        expenses = expenses.filter(expense => selectedCategories.includes(expense.type));
    }

    // Calcola la somma totale delle spese
    const totalAmount = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);

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
            cell.innerText = expense[key];
            row.appendChild(cell);
        })
        document.getElementById('table-body').appendChild(row);
    });
}
