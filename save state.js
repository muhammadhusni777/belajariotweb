// Function to load the saved LED state from localStorage
function loadLEDState() {
    document.querySelectorAll('.led-item').forEach(item => {
        const ledNumber = item.querySelector('.led-submit').getAttribute('data-led');
        const savedState = localStorage.getItem(`led-${ledNumber}`);
        const button = item.querySelector('.led-submit');
        const image = item.querySelector('.led-image');

        if (savedState === 'on') {
            button.textContent = `LED ${ledNumber} On`;
            button.classList.add('led-on');
            image.src = 'assets/led-on.png';
            image.setAttribute('data-state', 'on');
        } else {
            button.textContent = `LED ${ledNumber} Off`;
            button.classList.add('led-off');
            image.src = 'assets/led-off.png';
            image.setAttribute('data-state', 'off');
        }
    });
}

// Function to toggle LED state and save it to localStorage
function toggleLED(button, image, ledNumber) {
    const isOn = image.getAttribute('data-state') === 'on';

    if (isOn) {
        button.textContent = `LED ${ledNumber} Off`;
        button.classList.remove('led-on');
        button.classList.add('led-off');
        image.src = 'assets/led-off.png';
        image.setAttribute('data-state', 'off');
        localStorage.setItem(`led-${ledNumber}`, 'off');
        console.log(`LED ${ledNumber} turned off`);
    } else {
        button.textContent = `LED ${ledNumber} On`;
        button.classList.remove('led-off');
        button.classList.add('led-on');
        image.src = 'assets/led-on.png';
        image.setAttribute('data-state', 'on');
        localStorage.setItem(`led-${ledNumber}`, 'on');
        console.log(`LED ${ledNumber} turned on`);
    }
}

// Load the saved state when the page loads
loadLEDState();

// Attach event listeners to buttons
document.querySelectorAll('.led-item').forEach(item => {
    const button = item.querySelector('.led-submit');
    const image = item.querySelector('.led-image');
    const ledNumber = button.getAttribute('data-led');

    button.addEventListener('click', () => toggleLED(button, image, ledNumber));
});
