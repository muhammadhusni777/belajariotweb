if (typeof mqtt !== 'undefined') {
    console.log('MQTT.js loaded successfully');
} else {
    console.error('MQTT.js not loaded');
}

// Generate a random client ID
function generateClientId() {
    return `client_${Math.random().toString(36).substr(2, 9)}`;
}

 // MQTT broker URL and topic
 const brokerUrl = 'ws://broker.emqx.io:8083/mqtt';
 const sensorTopic = '/h8s81h2191/smartdevice/kelembaban';//'sensor/12918212291/data';

 // MQTT client options
 const mqttOptions = {
     clean: true,
     connectTimeout: 4000,
     clientId: generateClientId(),
     username: 'public',
     password: 'public'
 };

     // Create an MQTT client instance
     const client = mqtt.connect(brokerUrl, mqttOptions);

     // Set up event handlers
     client.on('connect', () => {
         
         console.log(`Connected to broker: ${brokerUrl}`);

         // Subscribe to the topic
         client.subscribe(sensorTopic, (err) => {
             if (err) {
                 console.error('Subscription error:', err);
             } else {
                 console.log(`Subscribed to topic: ${sensorTopic}`);
             }
         });
     });
 
     client.on('message', (topic, message) => {
         // Display the latest message
         const messageText = `Message: ${message.toString()}`;
         console.log(`pesan diterima: ${message.toString()}`)
         document.getElementById('message').textContent = messageText;

     });
 
     client.on('error', (error) => {
         console.error('Connection error:', error);
     });





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

        if (ledNumber == 1){
            console.log("publishing")
            client.publish("/h8s81h2191/smartdevice/lampu", "off", (err) => {
                if (err) {
                    console.error('Publish error:', err);
                } else {
                    console.log('publish berhasil');
                }
            });
        }

        
    } else {
        button.textContent = `LED ${ledNumber} On`;
        button.classList.remove('led-off');
        button.classList.add('led-on');
        image.src = 'assets/led-on.png';
        image.setAttribute('data-state', 'on');
        localStorage.setItem(`led-${ledNumber}`, 'on');
        console.log(`LED ${ledNumber} turned on`);

        console.log(ledNumber)
            if (ledNumber == 1){
                console.log("publishing")
                client.publish("/h8s81h2191/smartdevice/lampu", "on", (err) => {
                    if (err) {
                        console.error('Publish error:', err);
                    } else {
                        console.log('publish berhasil');
                    }
                });
            }

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
