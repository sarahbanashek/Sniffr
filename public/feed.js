const handleUplick = (event) => {
    const uplickButton = event.target;
    const uplickCount = uplickButton.parentNode.getElementsByClassName('uplickCount')[0];
    const uplickUrl = uplickButton.parentNode.getElementsByClassName('uplickUrl')[0].innerText;
    const uplickers = uplickButton.parentNode.getElementsByClassName('uplickers')[0];

    fetch(uplickUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            uplickCount.innerText = data.uplickCount;
            uplickers.innerText = data.uplick.map(x => x.username).join(', ')
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
    const downpoopers = downpoopButton.parentNode.getElementsByClassName('downpoopers')[0];

    fetch(downpoopUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            downpoopCount.innerText = data.downpoopCount;
            downpoopers.innerText = data.downpoop.map(x => x.username).join(', ');
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