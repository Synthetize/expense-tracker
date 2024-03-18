// Add select for subjects
const select_subject = document.getElementById('expense-subject');
const installment_checkbox = document.getElementById('enable-installment');
const installment_form = document.getElementById('installment-form');
const installment_number = document.getElementById('installment-number');
const select_categories = document.getElementById('expense-category');
const submitButton = document.getElementById('submit');
const confirmAlert = document.getElementById('confirm-alert');
const errorAlert = document.getElementById('error-alert');

errorAlert.style.display = 'none';
confirmAlert.style.display = 'none';
installment_number.disabled = true;

installment_checkbox.addEventListener('change', (event) => {
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
    if (installment_checkbox.checked) {
        await createInstallment(year);
    } else {
        await createExpense(year);
    }
})

async function createExpense(year) {
    confirmAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    try {
        const expense = {
            id: await window.electron.getNextAvailableIdByYear(year),
            subject: document.getElementById('expense-subject').value,
            date: document.getElementById('expense-date').value,
            type: document.getElementById('expense-category').value,
            amount: parseInt(document.getElementById('expense-amount').value),
            description: document.getElementById('expense-description').value
        }
        validateExpense(expense);
        //await window.electron.newExpense(expense, year);
        confirmAlert.style.display = 'block';
    } catch (error) {
        console.error(error);
        errorAlert.style.display = 'block';
        errorAlert.innerText = error.message;
    } finally {
        setTimeout(() => {
            errorAlert.style.display = 'none';
            confirmAlert.style.display = 'none';
        }, 3000);
    }
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


async function createInstallment() {
    try {
        let date = new Date(document.getElementById('expense-date').value);
        for (let i = 0; i < installment_number.value; i++) {
            const installment = {
                id: await window.electron.getNextAvailableIdByYear(date.getFullYear()),
                subject: document.getElementById('expense-subject').value,
                date: date.toISOString().split('T')[0],
                type: document.getElementById('expense-category').value,
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
    } catch (error) {
        console.error(error);
        errorAlert.style.display = 'block';
        errorAlert.innerText = error.message;
    } finally {
        setTimeout(() => {
            errorAlert.style.display = 'none';
            confirmAlert.style.display = 'none';
        }, 3000);
    }
}

