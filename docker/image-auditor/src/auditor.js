const dgram = require('dgram');
const protocol = require('./protocol');
const server = dgram.createSocket('udp4');
const net = require('net');
const { v4: uuidv4 } = require('uuid');

let activeMusicians = {};


//Update activeMusicians when receiving UDP payload from musicians
server.on('message', (message, remote) => {
  console.log(`Receive UDP message : ${message}`);
  const msg = JSON.parse(message);
  const { uuid, instrument } = msg;
  activeMusicians[uuid] = { instrument, activeSince: new Date() };  
});

// UDP server parameter set
server.bind(protocol.PROTOCOL_UDP_PORT, () => {
  console.log(`UDP SRV listenning on port ${server.address().port}`);
  server.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// Create a TCP server to handle client connections and send activeMusicians
const tcpServer = net.createServer((socket) => {
  socket.on('data', (data) => {
    const activeMusiciansList = Object.keys(activeMusicians)
      .map((uuid) => {
        return {
          uuid,
          instrument: activeMusicians[uuid].instrument,
          activeSince: activeMusicians[uuid].activeSince.toISOString(),
        };
      });
    socket.write(JSON.stringify(activeMusiciansList));
    socket.end();
  });
});

tcpServer.listen(protocol.PROTOCOL_TCP_PORT, () => {
  console.log(`TCP server listening on port ${protocol.PROTOCOL_TCP_PORT}`);
});

// Periodically check for inactive musicians and remove them from the list
setInterval(() => {
  Object.keys(activeMusicians).forEach((uuid) => {
    const activeSince = activeMusicians[uuid].activeSince;
    const now = new Date();
    if (now - activeSince > 5000) {
      delete activeMusicians[uuid];
    }
  });
}, 5000);
