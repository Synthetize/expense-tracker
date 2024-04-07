let data = null
const yearSelect = document.getElementById('year-options');
const categorySelect = document.getElementById('categories-select');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const radioForm = document.getElementById('radio-form');
const tbody = document.getElementById('table-body');

let expensesList = []
let categoriesList = []
let yearsList = []


function goBack() {
    window.history.back();
}

window.electron.refreshOnExpenseEdit()
window.electron.refreshOnExpenseDelete()


async function fetchData() {
    yearsList = await window.electron.getYears()
    categoriesList = await window.electron.getCategories()
    expensesList = await window.electron.getExpensesByYear(yearsList[0])
}

fetchData().then(() => {
    categoriesList = categoriesList.sort((a, b) => a.type.localeCompare(b.type));
    populateYearsSelect(yearsList);
    const uniqueCategories = findUniqueCategoriesAndRelatedIds(expensesList)
    populateCategoriesSelect(uniqueCategories);
    applyFilter();
})


function populateYearsSelect(years) {
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        yearSelect.appendChild(option);
    });
    yearSelect.selectedIndex = yearSelect.options[0].index;
    yearSelect.value = yearSelect.options[yearSelect.selectedIndex].value;
}

function findUniqueCategoriesAndRelatedIds(expenses) {
    const categories = expenses.map(expense => expense.category);
    let uniqueCategories = [...new Set(categories)];
    uniqueCategories = uniqueCategories.map(categoryId => {
        return categoriesList.find(cat => {
            if (cat.id === categoryId) {
                return {
                    id: parseInt(cat.id),
                    type: cat.type
                }
            }
        })
    })
    return uniqueCategories.sort((a, b) => a.type.localeCompare(b.type));
}

function populateCategoriesSelect(categories) {
    const option = document.createElement('option');
    option.value = 'all';
    option.innerText = 'Tutte';
    categorySelect.appendChild(option);
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.type;
        categorySelect.appendChild(option);
    });
}

// const firstRadioButton = document.querySelector('#radio-form input[type="radio"]:first-child');
// firstRadioButton.checked = true;
// radioForm.value = firstRadioButton.value;

yearSelect.addEventListener('change', async () => {
    expensesList = await window.electron.getExpensesByYear(yearSelect.value);
    categorySelect.innerHTML = '';
    toDate.value = '';
    fromDate.value = '';
    populateCategoriesSelect(findUniqueCategoriesAndRelatedIds(expensesList));
    applyFilter();
});

const elements = [toDate, fromDate, radioForm, categorySelect];
elements.forEach(element => {
    element.addEventListener('change', applyFilter);
});

function applyFilter() {
    let filteredExpenses = [...expensesList];
    filteredExpenses = filterByCategory(filteredExpenses);
    filteredExpenses = filterByDate(filteredExpenses);
    sortBy(filteredExpenses);
    updateTable(filteredExpenses);
}

function filterByCategory(expenses) {
    const selectedCategory = categorySelect.value;
    if (selectedCategory !== 'all') {
        expenses = expenses.filter(expense => {
            return expense.category === parseInt(selectedCategory);
        });
    }
    return expenses;

}

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
        const categoryB = categories.find(category => category.id === b.category);

        // Confronta i nomi delle categorie
        return categoryA.type.localeCompare(categoryB.type);
    });
}


function updateTable(expenses) {
    document.getElementById('table-body').innerHTML = '';

    expenses = changeFormat(expenses);
    createTotalRow(expenses)


    function breakStringIntoChunks(str, chunkSize) {
        let chunks = [];
        for (let i = 0; i < str.length; i += chunkSize) {
            chunks.push(str.slice(i, i + chunkSize));
        }
        return chunks.join('\n');
    }

    //aggiungi le spese nella tabella
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        Object.keys(expense).forEach(key => {
            const cell = document.createElement('td');
            cell.addEventListener('click', () => {
                window.electron.openExpenseEditWindow(expense, yearSelect.value);
            })

            if (key === 'amount') {
                cell.innerText = expense[key] + ' €';
                cell.style.textAlign = 'right';
            } else if (key === 'description') {
                cell.innerText = breakStringIntoChunks(expense[key], 70);
                cell.style.textAlign = 'left';
            } else {
                cell.style.textAlign = 'left';
                cell.innerText = expense[key];
            }
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
    totalRow.style.fontWeight = 'bold';
    totalRow.appendChild(totalCell);
    tbody.appendChild(totalRow);
}
