const awsIot = require('aws-iot-device-sdk');

const prefix = 'termo',
    region = 'us-west-2',
    subdom = 'a255p899ddazuk',
    thingName = 'thermoKitchen';

const thing = awsIot.thingShadow({
   keyPath: './certs/'+prefix+'.private.key',
  certPath: './certs/'+prefix+'.cert.pem',
    caPath: './certs/root-CA.crt',
  clientId: 'iotsing2',
//  debug: true,
    region: region,
      port: 8883,
      host: subdom+'.iot.'+region+'.amazonaws.com'
});

var state = {"state":{"reported":{"connected":"yes"}}};

 //thing.subscribe('sensors/temperature');
 //thing.subscribe('sensors/fanSpeed');
 //thing.subscribe('ui/bgColor');

// Temperature changes each 3 seconds
const temperatureChangeTimeout = 3000;

thing.register(thingName, {
      ignoreDeltas: true
   },
   function(err, failedTopics) {
         console.log('Device thing registered.');
        /// runSensors();
   });

thing.register('TemperatureControl', {
   persistentSubscribe: true
});
thing.register('TemperatureStatus', {
   persistentSubscribe: true
});

function getSensorTemperature() {
   var rgbValues = {
      red: 0,
      green: 0,
      blue: 0
   };

   rgbValues.red = Math.floor(Math.random() * 255);
   rgbValues.green = Math.floor(Math.random() * 255);
   rgbValues.blue = Math.floor(Math.random() * 255);

   return {
      state: {
         desired: rgbValues
      }
   };
}

function runSensors( ){
  var operation = 'update';

  setInterval(function(){
    var clientToken = thing[operation](thingName, getSensorTemperature());
    console.log('runSensors-> clientToken:',clientToken);
  },100000);
}

function runSensors2( ){

   setInterval(function(){
     //
     // Update the thing shadow only if the interior temperature has changed.
     //
     opClientToken = thing.update('TemperatureStatus', getSensorTemperature());
     console.log('runSensors-> clientToken:',opClientToken);


     opClientToken = thing.update('TemperatureControl', getSensorTemperature());
     console.log('runSensors-> clientToken:',opClientToken);



   },3000);

}
runSensors2();

 //
 // publish/subscribe
 //
thing
   .on('connect', function() {
     console.log('connected to AWS IoT...');

     //
     // After connecting, wait for a few seconds and then ask for the
     // current state of the thing shadow.
     //
     setTimeout(function() {
        opClientToken = thing.get('TemperatureControl');
        if (opClientToken === null) {
           console.log('operation in progress');
        }
     }, 6000);
   });
thing
   .on('close', function() {
      console.log('close');
      thing.unregister(thingName);
   });
thing
   .on('reconnect', function() {
      console.log('reconnect');


         console.log('reconnect/re-register');
         //
         // Upon reconnection, re-register our thing shadows.
         //
         thing.register('TemperatureControl', {
            persistentSubscribe: true
         });
         thing.register('TemperatureStatus', {
            persistentSubscribe: true
         });

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
      thing.on('status', function(thingName, statusType, clientToken, stateObject) {
         console.log('status ->',thingName, statusType, clientToken, stateObject);
            //handleStatus(thingName, stat, clientToken, stateObject);

        if (statusType === 'accepted') {
            if (thingName === 'TemperatureControl') {
               deviceControlState = stateObject.state.desired;
              console.log("================updaintg status!",deviceControlState);
            }
         }

      });

      thing.on('delta', function(thingName, stateObject) {
        console.log('we are wainting delta changes from iot thing');
        console.log('delta',thingName, stateObject) ;
       //  handleDelta(thingName, stateObject);
      });

      thing.on('timeout', function(thingName, clientToken) {
         console.log('timeout',thingName, clientToken);
         //   handleTimeout(thingName, clientToken);
      });
