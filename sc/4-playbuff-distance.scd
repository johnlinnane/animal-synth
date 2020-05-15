// John Linnane 118227214

// boot the server
s.boot;


// ************************ BRING IN DISTANCE OSC VALUES **************************

// OSC value from distance value between hands
(
OSCdef.new(
	\dist,
	{
		arg msg;
		// map hand distance value to rate value
		z.set(\rate, msg[7].linlin(50,400,1,0));
		msg[9].postln;
	},
	'/hello/from/oscjs',
);
)


//************************* SAMPLE BUFFER SYNTHDEF ********************************

(
// load audio to the buffer
b = Buffer.read(s, thisProcess.nowExecutingPath.dirname +/+ "dq.flac");

// define a buffer synth definition
z = SynthDef(\bufferSlow,
              // declare arguments and variables
	        { arg out = 0, bufnum, rate=1;
		      var sig;
              // assign buffer to signal
		      sig = PlayBuf.ar(
			        2,		                // number of channels
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
