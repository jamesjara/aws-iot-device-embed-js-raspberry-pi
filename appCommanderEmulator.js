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
  debug: true,
    region: region,
      port: 8883,
      host: subdom+'.iot.'+region+'.amazonaws.com'
});


// Temperature changes each 3 seconds
const temperatureChangeTimeout = 3000;

thing.register(thingName, {
      ignoreDeltas: false
   },
   function(err, failedTopics) {
         console.log('Mobile thing registered.');
});


   function handleStatus(thingName, stat, clientToken, stateObject) {

             console.log('got \'' + stat + '\' status on: ' + thingName + ' clientoken:' + clientToken);
             console.log('stateObject',stateObject);


   }

   function handleDelta(thingName, stateObject) {
         console.log('delta on: ' + thingName + JSON.stringify(stateObject));
   }

 

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
