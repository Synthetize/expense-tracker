// Add select for subjects
const select_subject = document.getElementById('expense-subject');
const installment_checkbox = document.getElementById('enable-installment');
const installment_form = document.getElementById('installment-form');
const installment_number = document.getElementById('installment-number');
const select_categories = document.getElementById('expense-category');
const submitButton = document.getElementById('submit');

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

// Add event listener for submit button, when clicked, it will create a new expense object and
// send it to the main process

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
    const expense = {
        id: await window.electron.getNextAvailableIdByYear(year),
        subject: document.getElementById('expense-subject').value,
        date: document.getElementById('expense-date').value,
        type: document.getElementById('expense-category').value,
        amount: document.getElementById('expense-amount').value,
        description: document.getElementById('expense-description').value
    }
    window.electron.newExpense(expense, year).then(() => {
        window.location.href = 'expense.html';
    });
}

async function createInstallment() {
    let date = new Date(document.getElementById('expense-date').value);
    for(let i = 0; i < installment_number.value; i++) {
        const installment = {
            id: await window.electron.getNextAvailableIdByYear(date.getFullYear()),
            subject: document.getElementById('expense-subject').value,
            date: date.toISOString().split('T')[0],
            type: document.getElementById('expense-category').value,
            amount: document.getElementById('expense-amount').value,
            description: document.getElementById('expense-description').value +
                ` - Rata ${i + 1} di ${installment_number.value}`
        }
        await window.electron.newExpense(installment, date.getFullYear());
        date.setMonth(date.getMonth() + 1);
    }
}


installment_number.disabled = true;

installment_checkbox.addEventListener('change', (event) => {
    installment_number.disabled = !installment_checkbox.checked;
});
