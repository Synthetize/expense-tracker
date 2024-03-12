const yearsPromise = window.electron.getYears()
yearsPromise.then(years => {
    const select = document.getElementById('year-options')
    years.forEach(year => {
        const option = document.createElement('option')
        option.value = year
        option.innerText = year
        select.appendChild(option)
    })
})
