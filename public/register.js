const ALERT_SUCCESS = 'alert-success';
const ALERT_DANGER = 'alert-danger';
const ALERT_WARNING = 'alert-warning';
const ALERT_CLASSES = [ALERT_SUCCESS, ALERT_DANGER, ALERT_WARNING];

const handleAvailability = () => {
    const username = document.getElementById('username').value;
    const checkUrl = '/checkUsername/' + username;
    const displayAvailability = document.getElementById('display-availability');

    if (!!username) {
        fetch(checkUrl)
            .then((response) => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                console.log(displayAvailability);
                if (data.available) {
                    console.log('available');
                    displayAvailability.classList.remove(...ALERT_CLASSES);
                    displayAvailability.classList.add(ALERT_SUCCESS);
                    displayAvailability.innerText = 'This username is available'
                    displayAvailability.hidden = false;
                } else {
                    console.log('not available');
                    displayAvailability.classList.remove(...ALERT_CLASSES);
                    displayAvailability.classList.add(ALERT_DANGER);
                    displayAvailability.innerText = 'This username is already in use';
                    displayAvailability.hidden = false;
                }
            })
            .catch(err => {
                console.log(err);
                displayAvailability.classList.remove(...ALERT_CLASSES);
                displayAvailability.classList.add(ALERT_WARNING);
                displayAvailability.innerText = 'There was a problem checking the availability of that username. Try again.';
                displayAvailability.hidden = false;
            });
    }
}
document.getElementById('check-available').onclick = handleAvailability;