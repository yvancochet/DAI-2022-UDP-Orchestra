const protocol = require('./protocol');
const dgram = require('dgram');
const { v4: uuidv4 } = require('uuid');

const instrument = process.argv[2];

const sounds = {
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum'
};

const socket = dgram.createSocket('udp4');
const uuid = uuidv4();

//Connect to multicast grp
socket.connect(protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes){
   console.log(`Musician udp set to multicast adr ${socket.address().address} and port ${socket.address().port}`);
});

//Send multicast payload
setInterval(() => {
  const sound = sounds[instrument];
  const message = JSON.stringify({ uuid, instrument, sound });

  socket.send(message, function(err, bytes){
      console.log(`Send payload: ${message} via prt ${socket.address().port} `);
      if (err != null)
            console.log("[ERROR] " + err)
  });
}, 1000);
