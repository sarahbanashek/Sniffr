const handleUplick = (event) => {
    const uplickButton = event.target;
    const uplickCount = uplickButton.parentNode.getElementsByClassName('uplickCount')[0];
    const uplickUrl = uplickButton.parentNode.getElementsByClassName('uplickUrl')[0].innerText;
    const downpoopNode = uplickButton.parentNode.nextElementSibling;
    const downpoopButton = downpoopNode.children[0];
    const downpoopCount = downpoopNode.getElementsByClassName('downpoopCount')[0];
    // const uplickers = uplickButton.parentNode.getElementsByClassName('uplickers')[0];

    fetch(uplickUrl, {method: 'POST'})
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            uplickCount.innerText = data.uplickCount;
            downpoopCount.innerText = data.downpoopCount;
            if (uplickButton.classList.contains('btn-success')) {
                uplickButton.classList.replace('btn-success', 'btn-primary');
            } else {
                uplickButton.classList.replace('btn-primary', 'btn-success');
            }
            if (downpoopButton.classList.contains('btn-success')) {
                downpoopButton.classList.replace('btn-success', 'btn-primary');
            }
            // uplickers.innerText = data.uplick.map(x => x.username).join(', ')
        });
}
const uplickButtons = document.getElementsByClassName('uplickButton');
for(let button of uplickButtons) {
    button.onclick = handleUplick;
}

const handleDownpoop = (event) => {
    const downpoopButton = event.target;
    const downpoopCount = downpoopButton.parentNode.getElementsByClassName('downpoopCount')[0];
    const downpoopUrl = downpoopButton.parentNode.getElementsByClassName('downpoopUrl')[0].innerText;
    const uplickNode = downpoopButton.parentNode.previousElementSibling;
    const uplickButton = uplickNode.children[0];
    const uplickCount = uplickNode.getElementsByClassName('uplickCount')[0];
    // const downpoopers = downpoopButton.parentNode.getElementsByClassName('downpoopers')[0];

    fetch(downpoopUrl, {method: 'POST'})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            downpoopCount.innerText = data.downpoopCount;
            uplickCount.innerText = data.uplickCount;
            if (downpoopButton.classList.contains('btn-success')) {
                downpoopButton.classList.replace('btn-success', 'btn-primary');
            } else {
                downpoopButton.classList.replace('btn-primary', 'btn-success');
            }
            if (uplickButton.classList.contains('btn-success')) {
                uplickButton.classList.replace('btn-success', 'btn-primary');
            }
            // downpoopers.innerText = data.downpoop.map(x => x.username).join(', ');
        });
}
const downpoopButtons = document.getElementsByClassName('downpoopButton');
for(let button of downpoopButtons) {
    button.onclick = handleDownpoop;
}

const handleDeleteSmell = (event) => {
    const deleteButton = event.target;
    const deleteUrl = deleteButton.parentNode.getElementsByClassName('deleteUrl')[0].innerText;

    fetch(deleteUrl, {method: 'DELETE'})
        .then(res => {
            const thisSmell = deleteButton.closest('.oneSmell');
            thisSmell.parentNode.removeChild(thisSmell);
        });
}

const deleteButtons = document.getElementsByClassName('deleteButton');
for(let button of deleteButtons) {
    button.onclick = handleDeleteSmell;
}