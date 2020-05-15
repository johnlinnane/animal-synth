// declare variables
let video;
let poseNet;

let keypointArray = [];
let avgArray = [];
let points = [];
let fr = 60;
let vStart;
let vEnd;
let dst;
let bodyDst;

let noseXL   = 0;
let noseYL   = 0;
let lEyeXL   = 0;
let lEyeYL   = 0;
let lWristXL = 0;
let lWristYL = 0;
let rWristXL = 0;
let rWristYL = 0;

let noseX, noseY,
  lEyeX, lEyeY, rEyeX, rEyeY,
  lEarX, lEarY, rEarX, rEarY,
  lShouldX, lShouldY, rShouldX, rShouldY,
  lElbowX, lElbowY, rElbowX, rElbowY,
  lWristX, lWristY, rWristX, rWristY,
  lHipX, lHipY, rHipX, rHipY,
  lKneeX, lKneeY, rKneeX, rKneeY,
  lAnkleX, lAnkleY, rAnkleX, rAnkleY;

// open WebSocket on port 8080
const socket = io.connect('http://localhost:8080');


function setup() {
  createCanvas(640, 475);
  video = createCapture(VIDEO);
  // hide original unfiltered camera feed
  video.hide();
  // create an instance of poseNet object
  // with default Output Stride and Image Scale values
  poseNet = ml5.poseNet(video, { flipHorizontal: false, outputStride: 16, imageScaleFactor: 0.5}, modelReady);
  // execute gotPoses whenever new keypoint data is available
  poseNet.on('pose', gotPoses);

}

// find the average of 100 console logs
// starting at 50 to avoid skewed values during startup
function average(start, end, name) {
  var time = end - start;
  var avgArraySecHalf = avgArray.slice(49, 101);
  avgArray.push(time);
  // log points 25 and 50 to track progress
  if (avgArray.length == 25) {
    console.log("Array index 25");
  } else if (avgArray.length == 50) {
    console.log("Array index 50");
  } else if (avgArray.length == 100) {
    let sum = avgArraySecHalf.reduce((previous, current) => current += previous);
    let avg = sum / avgArraySecHalf.length;
    console.log("The average " + name + " value is " + avg + " ms.");
  }
}

// function executed when new pose data becomes available
function gotPoses(poses) {
  // start time for performance testing
  var kpStart = window.performance.now();

  // assign keypoint coordinates to variables
  if (poses.length > 0) {
    noseX    = poses[0].pose.keypoints[0].position.x;
    noseY    = poses[0].pose.keypoints[0].position.y;
    lEyeX    = poses[0].pose.keypoints[1].position.x;
    lEyeY    = poses[0].pose.keypoints[1].position.y;
    rEyeX    = poses[0].pose.keypoints[2].position.x;
    rEyeY    = poses[0].pose.keypoints[2].position.y;
    lEarX    = poses[0].pose.keypoints[3].position.x;
    lEarY    = poses[0].pose.keypoints[3].position.y;
    rEarX    = poses[0].pose.keypoints[4].position.x;
    rEarY    = poses[0].pose.keypoints[4].position.y;
    lShouldX = poses[0].pose.keypoints[5].position.x;
    lShouldY = poses[0].pose.keypoints[5].position.y;
    rShouldX = poses[0].pose.keypoints[6].position.x;
    rShouldY = poses[0].pose.keypoints[6].position.y;
    lElbowX  = poses[0].pose.keypoints[7].position.x;
    lElbowY  = poses[0].pose.keypoints[7].position.y;
    rElbowX  = poses[0].pose.keypoints[8].position.x;
    rElbowY  = poses[0].pose.keypoints[8].position.y;
    lWristX  = poses[0].pose.keypoints[9].position.x;
    lWristY  = poses[0].pose.keypoints[9].position.y;
    rWristX  = poses[0].pose.keypoints[10].position.x;
    rWristY  = poses[0].pose.keypoints[10].position.y;
    lHipX    = poses[0].pose.keypoints[11].position.x;
    lHipY    = poses[0].pose.keypoints[11].position.y;
    rHipX    = poses[0].pose.keypoints[12].position.x;
    rHipY    = poses[0].pose.keypoints[12].position.y;
    lKneeX   = poses[0].pose.keypoints[13].position.x;
    lKneeY   = poses[0].pose.keypoints[13].position.y;
    rKneeX   = poses[0].pose.keypoints[14].position.x;
    rKneeY   = poses[0].pose.keypoints[14].position.y;
    lAnkleX  = poses[0].pose.keypoints[15].position.x;
    lAnkleY  = poses[0].pose.keypoints[15].position.y;
    rAnkleX  = poses[0].pose.keypoints[16].position.x;
    rAnkleY  = poses[0].pose.keypoints[16].position.y;

    // linear interpolation to smooth transitions
    noseXL   = lerp(noseXL, noseX, 0.5);
    noseYL   = lerp(noseYL, noseY, 0.5);
    lEyeXL   = lerp(lEyeXL, lEyeX, 0.5);
    lEyeYL   = lerp(lEyeYL, lEyeY, 0.5);
    lWristXL = lerp(lWristXL, lWristX, 0.5);
    lWristYL = lerp(lWristYL, lWristY, 0.5);
    rWristXL = lerp(rWristXL, rWristX, 0.5);
    rWristYL = lerp(rWristYL, rWristY, 0.5);

    // distance from right to left wrist
    bodyDst = dist(rWristX, rWristY, lWristX, lWristY);

    // create keypoint variable for animation
    keypointArray = poses[0].pose.keypoints;

    // create new local array to send
    points = [noseXL, noseYL,
                  lEyeXL, lEyeYL,
                  lWristXL, lWristYL,
                  rWristXL, rWristYL,
                  dst, bodyDst];

    // send the array under the identifier pointSender
    socket.emit('pointSender', points);
  }
  // end time for performance testing
  var kpEnd = window.performance.now();
  // find average performace time
  average(kpStart, kpEnd, "keypoint");
}

// executed when poseNet object is instantiated
function modelReady() {
  console.log('model ready');
}



function myDraw() {
  setInterval(function() {
    // start time for performace testing
    vStart = window.performance.now();

    // draw video
    image(video, 0, 0);
    // apply artistic filter
    filter(POSTERIZE, 2);

    // distance between nose and eye for 3D approximation
    dst = dist(noseXL, noseYL, lEyeXL, lEyeYL);
    // draw nose keypoint
    fill(100, 150, 255);
    strokeWeight(2);
    stroke(0, 0, 0);
    ellipse(noseXL, noseYL, dst);

    // draw wrist keypoints
    fill(255, 0, 0);
    ellipse(lWristXL, lWristYL, dst);
    ellipse(rWristXL, rWristYL, dst);
    drawSkeleton();

    // draw skeleton keypoints
    fill(0, 255, 0);
    drawKeypoints();

    // end time for performance testing
    vEnd = window.performance.now();
    average(vStart, vEnd, "video latency");
  }, 1000/fr);
}

myDraw();

// draw lines between keypoints for skeleton
function myLine(x1, y1, x2, y2) {
  if (x1 && x2) {
    line(x1, y1, x2, y2);
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  stroke(250, 105, 180);
  strokeWeight(4);
  myLine(rWristX, rWristY, rElbowX, rElbowY);
  myLine(rElbowX, rElbowY, rShouldX, rShouldY);
  myLine(rShouldX, rShouldY, lShouldX, lShouldY);
  myLine(lShouldX, lShouldY, lElbowX, lElbowY);
  myLine(lElbowX, lElbowY, lWristX, lWristY);
  myLine(rShouldX, rShouldY, rHipX, rHipY);
  myLine(lShouldX, lShouldY, lHipX, lHipY);
  myLine(rHipX, rHipY, lHipX, lHipY);
  myLine(rHipX, rHipY, rKneeX, rKneeY);
  myLine(lHipX, lHipY, lKneeX, lKneeY);
  myLine(rKneeX, rKneeY, rAnkleX, rAnkleY);
  myLine(lKneeX, lKneeY, lAnkleX, lAnkleY);
}

// loop through array and draw all body keypoints
function drawKeypoints() {
  for (i = 5; i < keypointArray.length; i++) {
    if (keypointArray[i].position.x && keypointArray[i].position.y) {
      ellipse(keypointArray[i].position.x, keypointArray[i].position.y, dst/2);
    }
  }
}
