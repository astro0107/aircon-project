// simulator.js
// Fake sensors: publishes room readings to AWS IoT Core over MQTT with TLS certs

const mqtt = require('mqtt');
const fs = require('fs');

const AWS_ENDPOINT = 'a17rdskbrdezz5-ats.iot.us-east-1.amazonaws.com';

const client = mqtt.connect({
  host: AWS_ENDPOINT,
  port: 8883,
  protocol: 'mqtts',
  key: fs.readFileSync('./certs/private.pem.key'),
  cert: fs.readFileSync('./certs/certificate.pem.crt'),
  ca: fs.readFileSync('./certs/AmazonRootCA1.pem'),
  clientId: 'aircon-floor-gateway-sim'
});

const rooms = [
  { room_id: "room-101", floor: 1 },
  { room_id: "room-102", floor: 1 },
  { room_id: "room-201", floor: 2 },
  { room_id: "room-202", floor: 2 },
  { room_id: "room-301", floor: 3 }
];

client.on('connect', () => {
  console.log('Connected to AWS IoT Core');

  setInterval(() => {
    rooms.forEach((room) => {
      const temp = (20 + Math.random() * 8).toFixed(1);
      const occupied = Math.random() > 0.5;
      const reading = {
        room_id: room.room_id,
        floor: room.floor,
        temp: parseFloat(temp),
        occupied: occupied,
        timestamp: new Date().toISOString()
      };
      const topic = `aircon-project/floor${room.floor}/${room.room_id}`;
      client.publish(topic, JSON.stringify(reading));
      console.log('Published to', topic, ':', JSON.stringify(reading));
    });
  }, 3000);
});

client.on('error', (err) => {
  console.error('AWS IoT connection error:', err);
});