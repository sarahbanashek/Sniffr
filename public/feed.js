const handleUplick = (event) => {
    const uplickButton = event.target;
    const uplickCountNode = uplickButton.parentNode.children[2];
    const uplickUrl = uplickButton.parentNode.getElementsByClassName('uplickUrl')[0].innerText;
    const downpoopNode = uplickButton.parentNode.nextElementSibling;
    const downpoopButton = downpoopNode.children[1];
    const downpoopCountNode = downpoopNode.getElementsByClassName('downpoop-count')
    const downpoopCountText = downpoopCountNode[0];
    // const uplickers = uplickButton.parentNode.getElementsByClassName('uplickers')[0];

    fetch(uplickUrl, {method: 'POST'})
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            uplickCountNode.innerText = data.uplickCount;
            downpoopCountText.innerText = data.downpoopCount;
            uplickCountNode.classList.toggle('uplick-count-success');
            if (uplickButton.classList.contains('uplick-button-success')) {
                uplickButton.classList.replace('uplick-button-success', 'uplick-button');
                uplickButton.title = 'uplick';
            } else {
                uplickButton.classList.replace('uplick-button', 'uplick-button-success');
                uplickButton.title = 'you uplicked this smell';
            }
            if (downpoopButton.classList.contains('downpoop-button-success')) {
                downpoopButton.classList.replace('downpoop-button-success', 'downpoop-button');
                downpoopButton.title = 'downpoop';
                downpoopCountNode[0].classList.remove('downpoop-count-success');
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
    const downpoopCountNode = downpoopButton.parentNode.children[2];
    // const downpoopCount = downpoopButton.parentNode.getElementsByClassName('downpoop-count')[0];
    const downpoopUrl = downpoopButton.parentNode.getElementsByClassName('downpoopUrl')[0].innerText;
    const uplickNode = downpoopButton.parentNode.previousElementSibling;
    const uplickButton = uplickNode.children[1];
    const uplickCountNode = uplickNode.getElementsByClassName('uplick-count');
    const uplickCount = uplickCountNode[0];
    // const downpoopers = downpoopButton.parentNode.getElementsByClassName('downpoopers')[0];

    fetch(downpoopUrl, {method: 'POST'})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            downpoopCountNode.innerText = data.downpoopCount;
            uplickCount.innerText = data.uplickCount;
            downpoopCountNode.classList.toggle('downpoop-count-success');
            if (downpoopButton.classList.contains('downpoop-button-success')) {
                downpoopButton.classList.replace('downpoop-button-success', 'downpoop-button');
                downpoopButton.title = 'downpoop';
            } else {
                downpoopButton.classList.replace('downpoop-button', 'downpoop-button-success');
                downpoopButton.title = 'you downpooped this smell';
            }
            if (uplickButton.classList.contains('uplick-button-success')) {
                uplickButton.classList.replace('uplick-button-success', 'uplick-button');
                uplickButton.title = 'uplick';
                uplickCountNode[0].classList.remove('uplick-count-success');
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
        .then(() => {
            const thisSmell = deleteButton.closest('.oneSmell');
            thisSmell.parentNode.removeChild(thisSmell);
        });
}

const deleteButtons = document.getElementsByClassName('deleteButton');
for(let button of deleteButtons) {
    button.onclick = handleDeleteSmell;
}