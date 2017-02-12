const config = require('./config'),
    moment = require('moment'),
    exec = require('child_process').exec,
    thing = require('aws-iot-device-sdk').device(config);

// constant parameters
const DEVICE_NAME = 'thermo_garage';
const DEVICE_SERIAL = 'USERID-SERIAL-ETC';

const TOPIC_SYSTEM_TEMP = "system/temp";
const TOPIC_SYSTEM_BATTERY = "system/battery";
const TOPIC_SYSTEM_TIME = "system/time";

// get CPU Temp
function getCPUTemp(callback) {
    exec('cat /sys/class/thermal/thermal_zone0/temp', function(error, stdout, stderr) {
        if (stdout) {
            var value = Number(stdout) / 1000.;
            console.log('stdout: ' + value);
            callback(value);
        }
    });
}

// get CPU Battery
function getCPUBattery(callback) {
    exec('cat /sys/class/power_supply/BAT0/capacity', function(error, stdout, stderr) {
        if (stdout) {
            var value = Number(stdout);
            console.log('stdout: ' + value);
            callback(value);
        }
    });
}

// get CPU time
function getCPUTime(callback) {
    exec('date', function(error, stdout, stderr) {
        if (stdout) {
            var value = (stdout);
            console.log('stdout: ' + value);
            callback(value);
        }
    });
}

// loop for publish
setInterval(function() {
    getCPUTemp(function(value) {
        var message = {
            "device": DEVICE_NAME,
            "serial": DEVICE_SERIAL,
            "sensor": 'thermo',
            "time": moment().format(),
            "payload":{
              "temp": value
            }
        };
        message = JSON.stringify(message);
        console.log("Publishing: " + message);
        thing.publish(TOPIC_SYSTEM_TEMP, message);
    });
    getCPUBattery(function(value){
      var message = {
          "device": DEVICE_NAME,
          "serial": DEVICE_SERIAL,
          "sensor": 'thermo',
          "time": moment().format(),
          "payload":{
            "battery": value
          }
      }
      message = JSON.stringify(message);
      console.log("Publishing: " + message);
      thing.publish(TOPIC_SYSTEM_BATTERY, message);
    });
    getCPUTime(function(value){
      var message = {
          "device": DEVICE_NAME,
          "serial": DEVICE_SERIAL,
          "sensor": 'thermo',
          "time": moment().format(),
          "payload":{
            "time": value
          }
      }
      message = JSON.stringify(message);
      console.log("Publishing: " + message);
      thing.publish(TOPIC_SYSTEM_TIME, message);
    });
}, 5000);

// event for device "connect"
thing.on('connect', function() {
    console.log('Connected to AWS Message Broker.');
});
