var https = require('https');

exports.handler = (event, context, callback) => {

    var appkey = 'y4tXxe';
    var privatekey = 'u0HyEGOUWbY0';
    var channel = 'myChannel';
    var message = JSON.stringify(event);
    var postBody = "AK=" + appkey + "&PK=" + privatekey + "&C=" + channel + "&M=" + message;

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postBody.length
    };

    var options = {
      hostname: 'ortc-developers2-useast1-s0001.realtime.co',
      port: 443,
      path: '/send',
      method: 'POST',
      headers: headers
    };

    var req = https.request(options, function(res) {
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            if(res.statusCode==201) {
                console.log('Message sent successfully to Realtime');
            } else {
                console.log('Error sending message to Realtime. Description: ',
                body);
            }
            context.succeed(body);
        });
    });

    req.on('error', context.fail);
    req.write(postBody);
    req.end();

    callback(null, 'Hello from Lambda');
};
