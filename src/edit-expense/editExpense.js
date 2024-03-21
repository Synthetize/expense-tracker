let params = new URLSearchParams(window.location.search);
let expense = JSON.parse(params.get('expense'));
let year = params.get('year')

const expense_date = document.getElementById('expense-date')
const expense_amount = document.getElementById('expense-amount')
const categorySelect = document.getElementById('expense-category')
const subjectsSelect = document.getElementById('expense-subject')
const expense_description = document.getElementById('expense-description')
const expense_id = document.getElementById('expense-id')
const saveButton = document.getElementById('submit')
const errorAlert = document.getElementById('error-alert')


Promise.all([
    window.electron.getCategories(),
    window.electron.getSubjects()
]).then(([categories, subjects]) => {
    categories = categories.sort((a, b) => a.type.localeCompare(b.type))

    for (let category of categories) {
        let option = document.createElement('option')
        option.value = category.id
        option.text = category.type
        categorySelect.add(option)
        if (option.text === expense.category) {
            option.selected = true;
        }
    }
    for (let subject of subjects) {
        let option = document.createElement('option')
        option.value = subject.id
        option.text = subject.name
        subjectsSelect.add(option)
        if (option.text === expense.subject) {
            option.selected = true;
        }
    }
})

errorAlert.style.display = 'none'
expense_id.disabled = true
expense_id.value = expense.id
expense_date.value = expense.date.split('-').reverse().join('-')
expense_amount.value = expense.amount
expense_description.value = expense.description

function validateInput() {
    if (expense_date.value === '' || expense_amount.value === '') {
        throw new Error('La data e l\'importo sono campi obbligatori.')
    } else {
        let date = parseInt(new Date(expense_date.value).getFullYear())
        if (date !== parseInt(year))
            throw new Error('La data deve essere compresa nell\'anno' + year)
    }
}

saveButton.addEventListener('click', async () => {
    let newExpense = {
        id: expense.id,
        subject: subjectsSelect.options[subjectsSelect.selectedIndex].text,
        date: expense_date.value.split('-').reverse().join('-'),
        category: await findCategoryId(),
        amount: parseFloat(expense_amount.value),
        description: expense_description.value
    }
    try {
        validateInput()
        await window.electron.updateExpense(newExpense, year)
        window.close()
    } catch (error) {
        errorAlert.style.display = 'block'
        errorAlert.textContent = error.message
        setTimeout(() => {
            errorAlert.style.display = 'none'
        }, 3000)
    } finally {
        setTimeout(() => {
            errorAlert.style.display = 'none'
        }, 3000)
    }
})

async function findCategoryId() {
    let category = categorySelect.options[categorySelect.selectedIndex].text
    return await window.electron.getCategoryIdByType(category)
}