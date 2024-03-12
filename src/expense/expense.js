// Add select for subjects
const select_subject = document.getElementById('expense-subject');
const installment_checkbox = document.getElementById('enable-installment');
const installment_form = document.getElementById('installment-form');
const installment_number = document.getElementById('installment-number');

window.electron.getSubjects().then(subjects => {
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.name;
        option.innerText = subject.name;
        select_subject.appendChild(option);
    });
});


// Add select for categories
let select_categories = document.getElementById('expense-category')
window.electron.getCategories().then(categories => {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.type;
        option.innerText = category.type;
        select_categories.appendChild(option);
    });
})


$(document).ready(function () {
    $('#expense-category').select2();
});

// Add event listener for submit button, when clicked, it will create a new expense object and
// send it to the main process
const submitButton = document.getElementById('submit');
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
        id: await window.electron.getNextIdByYear(year),
        subject: document.getElementById('expense-subject').value,
        date: document.getElementById('expense-date').value,
        type: document.getElementById('expense-category').value,
        amount: document.getElementById('expense-amount').value,
        description: document.getElementById('expense-description').value
    }
    window.electron.newExpense(expense, year);
}

// If the expense is an installment, create multiple expenses based on the number of installments
//and add the number of the installment to the description
async function createInstallment() {
    //const installments = []
    let date = new Date(document.getElementById('expense-date').value);
    let indexIncrement = 0;
    for (let i = 0; i < installment_number.value; i++) {
        const installment = {
            id: await window.electron.getNextIdByYear(date.getFullYear()) + indexIncrement,
            subject: document.getElementById('expense-subject').value,
            date: date.toISOString().split('T')[0],
            type: document.getElementById('expense-category').value,
            amount: document.getElementById('expense-amount').value,
            description: document.getElementById('expense-description').value + ' - ' +
                'Installment ' + (i + 1) + ' of ' + installment_number.value
        }
        window.electron.newExpense(installment, date.getFullYear());
        //installments.push(installment);
        date.setMonth(date.getMonth() + 1);
        // If the next month is January, reset the indexIncrement to 0, otherwise increment it by 1
        if(date.getMonth() === 0) {
            indexIncrement = 0;
        } else {
            indexIncrement++;
        }
    }
    //console.log(JSON.stringify(installments));
    //window.electron.newInstallment(installments, date.getFullYear());
}


// Disable installment form at the beginning
for (let i = 0; i < installment_form.elements.length; i++) {
    installment_form.elements[i].disabled = true;
}

installment_checkbox.addEventListener('change', (event) => {
    // Enable or disable installment form based on the checkbox value
    for (let i = 0; i < installment_form.elements.length; i++) {
        installment_form.elements[i].disabled = !event.target.checked;
    }
});
