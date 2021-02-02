# AnimalSynth

Manipulation of musical parameters using the PoseNet pose estimation library, p5.js, SuperCollider and mobile phone accelerometer data. 

Thesis for the MSc in Interactive Media, University College Cork 2019.


## Description

A musical instrument in which the user controls audio parameters through body gestures. Integrating the PoseNet pose estimation library with the SuperCollider audio synthesis environment. OSC, Node.js and WebSockets are used as networking tools. Basic functionality requires only a webcam and some free software. 


## Technologies Used


![PoseNet](https://github.com/panisterfatheroy/pose-music/blob/master/pose.png)

PoseNet, p5.js, Node, SuperCollider, WebSockets, OSC, OSCHook, Mobile Phone Accelerometer


## Primary Languages

JavaScript, SuperCollider


## Getting Started


### Prerequisites

● A webcam.

● An unrestricted wi-fi network capable of udp connection.

● Node (version 10.16.0 was used in the project).

● SuperCollider (version 3.10 was used in this project).

● OSCHook (free Android app for OSC control from mobile phone).


### Node.js

●  Navigate to project folder in terminal.

●  If ``node_modules`` folder is absent or empty, type: ``npm install``. Allow dependencies to install.

●  Type ``node audio-pose``.

●  Open web browser.

●  Navigate to 127.0.0.1:8080 (or localhost:8080)

   
   
### SuperCollider
Navigate to sc folder in project folder. 

Open one of five sketches:

**1-nose-synth:**
A synth controlled by nose position. X axis controls pitch.
Y axis controls volume.

**2-theremin:**
Left hand controls pitch along the X axis. Right hand controls volume along Y axis.

**3-gran:**
A granular synthesiser.
Distance between hands affects parameters of granularised audio.

**4-playbuff-distance:**
Closeness of the face to the webcam affects playback speed of audio.

**5-playbuff-phone:**
Tilt of mobile phone affects playback speed of audio. Start with phone flat and tilt forward and back. Requires installation of free OSCHook app.
Node server must be quit


For each SuperCollider sketch:

● Lower your computer system volume.

● Evaluate s.boot; using C​ md-Return/Ctrl-Enter.

● Evaluate all OSCDef blocks (within parenthesis). Evaluate synth block (within parenthesis).

● When finished, free all processes using Cmd-./Ctrl-. Evaluate s.quit; after every file to clear the server nodes.

