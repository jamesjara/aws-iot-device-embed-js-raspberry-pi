var awsIot = require('aws-iot-device-sdk');

const prefix = 'f2c9563e29',
    region = 'us-west-2',
    subdom = 'a255p899ddazuk';

const thingName = 'thermo';

var thing = awsIot.device({
   keyPath: './certs/'+prefix+'-private.pem.key',
  certPath: './certs/'+prefix+'-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'iotsing2',
  debug: true,
    region: region,
      port: 8883,
      host: subdom+'.iot.'+region+'.amazonaws.com'
});


thing
   .on('connect', function() {
      console.log('connect');
   });
thing
   .on('close', function() {
      console.log('close');
   });
thing
   .on('reconnect', function() {
      console.log('reconnect');
   });
thing
   .on('offline', function() {
      console.log('offline');
   });
thing
   .on('error', function(error) {
      console.log('error', error);
   });
thing
   .on('message', function(topic, payload) {
      console.log('message', topic, payload.toString());
   });
