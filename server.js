//************************ REQUIRE MODULES ************************

//import http module
const http = require("http");
// file system module
const fs = require("fs");
//path module, helps with file paths
const path = require("path");

// web application framework
const app = require('express')();
// serve the http page
const server = require('http').Server(app);
// WebSocket module
const io = require('socket.io')(server);
// OSC module
const osc = require("osc");
// performance time module
const hrtime = require("process.hrtime");



// port number for file server
let fsPort = 3000;
// array for performace test average
var avgArray = [];


// *******************PERFORMANCE AVERAGE FUNCTION ***********

// find average of 100 performance time values
// starting at 50 to avoid skewed values during startup
function averageN(start, end, name) {
  var time = end - start;
  var avgArraySecHalf = avgArray.slice(49, 151);
  avgArray.push(end);
  // log points 25 and 50 to track progress
  if (avgArray.length == 25) {
    console.log("25");
  } else if (avgArray.length == 50) {
    console.log("50");

  } else if (avgArray.length == 100) {
    let sum = avgArraySecHalf.reduce((previous, current) => current += previous);
    console.log(avgArraySecHalf.length);
    let avg = sum / avgArraySecHalf.length;
    console.log("The average " + name + " value is " + avg + " ms.");
  }
}


// ******************** FILE SERVER SETUP *********************

//function executed when a page is requested (request, response)
http.createServer(function(req, res) {
  // log the details of incoming request
  console.log(`${req.method} request for ${req.url}`);
  // make index.html the default web page
  if (req.url === "/") {
    // serve the html file details and execute function (error, file)
    fs.readFile("./index.html", "UTF-8", function(err, html) {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      //response: serve html file
      res.end(html);
    });
    // if requested url is .css
  } else if (req.url.match(/.css$/)) {
    //create a path to the file
    var cssPath = path.join(__dirname, req.url);
    //create a UTF-8 text readstream from the css file
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    //response header
    res.writeHead(200, {
      "Content-Type": "text/css"
    });
    //pipe read-stream to writable stream
    fileStream.pipe(res);

    // if requested url is .js
  } else if (req.url.match(/.js$/)) {
    //create a path to the file
    var jsPath = path.join(__dirname, req.url);
    //create a UTF-8 text readstream from the js file
    var fileStream = fs.createReadStream(jsPath, "UTF-8");
    //response header
    res.writeHead(200, {
      "Content-Type": "text/javascript"
    });
    //pipe read-stream to writable stream
    fileStream.pipe(res);

    // same as above, but with jpg
  } else if (req.url.match(/.ico$/)) {
    var imgPath = path.join(__dirname, 'images', req.url);
    var imgStream = fs.createReadStream(imgPath);
    res.writeHead(200, {
      "Content-Type": "image/ico"
    });
    imgStream.pipe(res);

  } else {
    // throw 404
    res.writeHead(404, {
      "Content-Type": "text/plain"
    });
    res.end("404 File Not Found");
  }
//listen on file server port
}).listen(fsPort);


console.log("Node HTTP file server listening on port " + fsPort);


//************************ WEBSOCKETS ***************

// set up WebSocket port to default of 8080
const wsPort = 8080;

server.listen(wsPort, () => {
    console.log("Server listening for WebSocket connections on port " + wsPort);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// upon WebSocket connection...
io.on('connection', (socket) => {

  // log connection with WebSocket ID
  console.log('WebSocket connected. Socket ID: ', socket.id);

  // log disconnection with WebSocket ID
  socket.on('disconnect', () => {
    console.log('WebSocket disconnected. Socket ID:', socket.id);
  });

  // receive pointSender array as 'data'
  socket.on('pointSender', (data) => {

    // performance start time
    var hrStart = hrtime(hrtime(), 'ms');

    // bring in the osc data
    var msg = {
        address: "/hello/from/oscjs",
        args: [
            {
                type: "f",
                value: data[0]
            },
            {
                type: "f",
                value: data[1]
            },
            {
                type: "f",
                value: data[2]
            },
            {
                type: "f",
                value: data[3]
            },
            {
                type: "f",
                value: data[4]
            },
            {
                type: "f",
                value: data[5]
            },
            {
                type: "f",
                value: data[6]
            },
            {
                type: "f",
                value: data[7]
            },
            {
                type: "f",
                value: data[8]
            },
            {
                type: "f",
                value: data[9]
            }
        ]

    };

    // send the osc data
    udpPort.send(msg);
    // log performace end time
    var hrEnd = hrtime(hrtime(), 'ms');
    // find average of performance times
    averageN(hrStart, hrEnd, "osc send");

  });

});


//************************ OSC SENDER *****************

// set remote IP address
var rmtAddr = "127.0.0.1";
// set remote port number
var rmtPrt = 57120;

// create new UDP port to send OSC data
var udpPort = new osc.UDPPort({
    // This is where SuperCollider is listening for OSC messages.
    remoteAddress: rmtAddr,
    remotePort: rmtPrt,
    metadata: true
});

// open the socket
udpPort.open();
console.log("Remote address (SuperCollider) listening on: " + rmtAddr + ":" + rmtPrt);
