// Add select for subjects
const select_subject = document.getElementById('expense-subject');
const installment_checkbox = document.getElementById('enable-installment');
const installment_form = document.getElementById('installment-form');
const installment_number = document.getElementById('installment-number');
const select_categories = document.getElementById('expense-category');
const submitButton = document.getElementById('submit');
const confirmAlert = document.getElementById('confirm-alert');
const errorAlert = document.getElementById('error-alert');
const expense_amount = document.getElementById('expense-amount');
const expense_description = document.getElementById('expense-description');

errorAlert.style.display = 'none';
confirmAlert.style.display = 'none';
installment_number.disabled = true;

installment_checkbox.addEventListener('change', () => {
    installment_number.disabled = !installment_checkbox.checked;
});

window.electron.getSubjects().then(subjects => {
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.name;
        option.innerText = subject.name;
        select_subject.appendChild(option);
    });
});

window.electron.getCategories().then(categories => {
    categories.sort((a, b) => a.type.localeCompare(b.type));
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.type;
        option.innerText = category.type;
        select_categories.appendChild(option);
    });
})

submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const year = new Date(document.getElementById('expense-date').value).getFullYear();
    try {
        if (installment_checkbox.checked) {
            await createInstallment(year);
        } else {
            await createExpense(year);
        }
    } catch (error) {
        console.error(error);
        errorAlert.style.display = 'block';
        errorAlert.innerText = error.message;
    } finally {
        expense_amount.value = '';
        expense_description.value = '';
        installment_number.value = '';
        setTimeout(() => {
            errorAlert.style.display = 'none';
            confirmAlert.style.display = 'none';
        }, 3000);
    }
})

function goBack() {
    window.history.back();
}

function formatDate(date) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function validateExpense(expense) {
    if (expense.subject === '' || expense.date === '' || expense.type === '' || expense.amount === '') {
        throw new Error('Campi obbligatori non compilati');
    } else if (isNaN(expense.amount)) {
        throw new Error('L\'importo deve essere un numero');
    }

    if (!installment_number.disabled) {
        if (installment_number.value === '' || isNaN(installment_number.value) || installment_number.value < 2) {
            throw new Error('Numero di rate non valido');
        }
    }
}

async function findCategoryId(type) {
    let category = document.getElementById('expense-category').value;
    return await window.electron.getCategoryIdByType(category)
}

async function createExpense(year) {
    const expense = {
        id: await window.electron.getNextAvailableIdByYear(year),
        subject: document.getElementById('expense-subject').value,
        date: formatDate(new Date(document.getElementById('expense-date').value)),
        category: await findCategoryId(document.getElementById('expense-category').value),
        amount: parseFloat(document.getElementById('expense-amount').value),
        description: document.getElementById('expense-description').value
    }
    validateExpense(expense);
    await window.electron.newExpense(expense, year);
    confirmAlert.style.display = 'block';
}


async function createInstallment() {
    let date = new Date(document.getElementById('expense-date').value);
    for (let i = 0; i < installment_number.value; i++) {
        const installment = {
            id: await window.electron.getNextAvailableIdByYear(date.getFullYear()),
            subject: document.getElementById('expense-subject').value,
            date: formatDate(date),
            category: await findCategoryId(document.getElementById('expense-category').value),
            amount: parseInt(document.getElementById('expense-amount').value),
            description: document.getElementById('expense-description').value +
                ` - Rata ${i + 1} di ${installment_number.value}`
        }
        console.log(installment);
        validateExpense(installment)
        await window.electron.newExpense(installment, date.getFullYear());
        date.setMonth(date.getMonth() + 1);
    }
    confirmAlert.style.display = 'block';
}

