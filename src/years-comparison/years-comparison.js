async function sumExpensesByCategory(year) {
    let expenses = await window.electron.getExpensesByYear(year);
    let summedExpenses = expenses.reduce((acc, curr) => {
        if (!acc[curr.type]) {
            acc[curr.type] = 0;
        }
        acc[curr.type] += curr.amount;
        return acc;
    }, {});
    return summedExpenses;
}