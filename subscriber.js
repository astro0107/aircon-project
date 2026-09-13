// subscriber.js
// Listens for room readings published by simulator.js

const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://test.mosquitto.org:1883');

client.on('connect', () => {
  console.log('Subscriber connected to MQTT broker');
  client.subscribe('aircon-project/#', (err) => {
    if (err) {
      console.error('Subscribe error:', err);
    } else {
      console.log('Subscribed to aircon-project/#');
    }
  });
});

client.on('message', (topic, message) => {
  console.log('Received on', topic, ':', message.toString());
});