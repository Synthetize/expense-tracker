let data = null
const yearSelect = document.getElementById('year-options');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const radioForm = document.getElementById('radio-form');
const tbody = document.getElementById('table-body');


const dropdown = document.getElementById('dropdown-menu');
let expensesList = []
let categoriesList = []


function goBack() {
    window.history.back();
}

window.electron.getYears().then(async years => {
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        yearSelect.appendChild(option);
    });
    yearSelect.selectedIndex = yearSelect.options[0].index;
    yearSelect.value = yearSelect.options[yearSelect.selectedIndex].value;
    expensesList = await window.electron.getExpensesByYear(yearSelect.value);
    applyFilter();

});

window.electron.getCategories().then(categories => {
    categoriesList = categories.sort((a, b) => a.type.localeCompare(b.type));
})



const firstRadioButton = document.querySelector('#radio-form input[type="radio"]:first-child');
firstRadioButton.checked = true;
radioForm.value = firstRadioButton.value;

yearSelect.addEventListener('change', async () => {
    expensesList = await window.electron.getExpensesByYear(yearSelect.value);
    applyFilter();
});

const elements = [toDate, fromDate, radioForm, dropdown];
elements.forEach(element => {
    element.addEventListener('change', applyFilter);
});


// window.electron.getCategories().then(categories => {
//     categories.sort((a, b) => a.type.localeCompare(b.type));
//     categories.forEach(category => {
//         const li = document.createElement('li');
//         li.className = 'dropdown-item';
//         li.innerHTML = `<a class="dropdown-item" href="#">
//                                     <div class="form-check">
//                                         <input class="form-check-input" type="checkbox" value="" id="${category.type}"/>
//                                         <label class="form-check-label" for="${category.type}">${category.type}</label>
//                                     </div>
//                                 </a>`;
//         li.addEventListener('click', event => {
//             //prevents the dropdown from closing after clicking on a checkbox label
//             event.stopPropagation();
//             //if clicked on a checkbox label, toggle the checkbox
//             const checkbox = document.getElementById(category.type);
//             checkbox.checked = !checkbox.checked;
//         })
//         dropdown.appendChild(li);
//     })
// })

// function resetSelectedCheckBoxes() {
//     const checkboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]');
//     checkboxes.forEach(checkbox => {
//         checkbox.checked = false;
//     });
//     applyFilter()
// }


function applyFilter() {
    let filteredExpenses = [...expensesList];
    //const selectedCategories = getSelectedCategories()
    //filteredExpenses = filterBySelectedCategories(filteredExpenses, selectedCategories);
    filteredExpenses = filterByDate(filteredExpenses);
    sortBy(filteredExpenses);
    updateTable(filteredExpenses);
}


// function getSelectedCategories() {
//     let tempSelectedCategories = [];
//     const checkboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]:checked');
//     checkboxes.forEach(checkbox => {
//         tempSelectedCategories.push(checkbox.id);
//     })
//     return tempSelectedCategories;
// }
//
// function filterBySelectedCategories(expenses, selectedCategories) {
//     if (selectedCategories.length > 0) {
//         expenses = expenses.filter(expense => selectedCategories.includes(expense.category));
//     }
//     return expenses;
// }

function filterByDate(expenses) {
    if (fromDate.value !== '') {
        expenses = expenses.filter(expense => {
            return new Date(expense.date) >= new Date(fromDate.value);
        });
    }
    if (toDate.value !== '') {
        expenses = expenses.filter(expense => {
            return new Date(expense.date) <= new Date(toDate.value)
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
                return new Date(a.date) - new Date(b.date);
            });
            break;
        case 'date-des':
            expenses.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            break;
        case 'category':
            sortByCategory(expenses, categoriesList);
            break;
    }
}

function sortByCategory(expenses, categories) {
    expenses.sort((a, b) => {
        // Trova le categorie corrispondenti per ogni spesa
        const categoryA = categories.find(category => category.id === a.category);
        console.log(categoryA)
        const categoryB = categories.find(category => category.id === b.category);
        console.log(categoryB)

        // Confronta i nomi delle categorie
        return categoryA.type.localeCompare(categoryB.type);
    });
}


function updateTable(expenses) {
    document.getElementById('table-body').innerHTML = '';

    expenses = changeFormat(expenses);
    createTotalRow(expenses)

    //aggiungi le spese nella tabella
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        Object.keys(expense).forEach(key => {
            const cell = document.createElement('td');
            cell.addEventListener('click', () => {
                window.electron.openExpenseEditWindow(expense, yearSelect.value);
            })
            cell.innerText = expense[key];
            row.appendChild(cell);
        })
        document.getElementById('table-body').appendChild(row);
    });
}

function changeFormat(expenses) {
    return expenses.map(expense => {
        const category = categoriesList.find(category => parseInt(category.id) === parseInt(expense.category))
        return {
            id: expense.id,
            subject: expense.subject,
            date: expense.date.split('-').reverse().join('-'),
            category: category.type,
            amount: expense.amount,
            description: expense.description,
        }
    })
}

function createTotalRow(expenses) {
    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    let totalSum = expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
    totalCell.innerText = `Totale: ${totalSum} €`;
    totalCell.colSpan = 6;
    totalRow.appendChild(totalCell);
    tbody.appendChild(totalRow);
}
