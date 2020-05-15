// John Linnane 118227214

// boot the server
s.boot;


// ************************ BRING IN PHONE OSC VALUES ****************************

// OSC value from r2 rotation vector from OSCHook app, Rotation Vector section
(
OSCdef.new(
	\r2,
	{
		arg msg;
		z.set(\rate, msg[1].linlin(inMin: 0, inMax: 1, outMin: 1, outMax: -1));
		msg[1].postln;
	},
	'/rotation_vector/r2',
);
)


// ************************ SAMPLE BUFFER SYNTHDEF ********************************

(
// load audio to the buffer
b = Buffer.read(s, thisProcess.nowExecutingPath.dirname +/+ "dq.wav");

// define a buffer synth definition
z = SynthDef(\bufferSlow,
	        // declare arguments and variables
	        { arg out = 0, bufnum, rate=1;
		      var sig;

		      sig = PlayBuf.ar(
			        2,						// number of channels
			        bufnum,					// number of buffer to play
			        rate,                   // rate, to be set by osc value
			        loop: 1                 // loop buffer continuously
		            ) * 0.15;               // reduce volume
	          Out.ar( out, sig)
              }).play(s,[\bufnum, b.bufnum ]);

// assign OSCDef value to rate
z.set(\rate, 1);
)


// *******************************************************************************

// free the instrument
z.free;
// reboot the server
s.reboot;
// quit the server
s.quit;
