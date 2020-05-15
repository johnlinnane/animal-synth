// John Linnane 118227214

// boot the server
s.boot;


//************************* BRING IN WRIST DISTANCE OSC VALUES ******************************************

(
OSCdef.new(
	\dist,
	{
		arg msg;

		g.set(\rate, msg[10].linlin(50,400,5,500));

		msg[10].postln;

	},
	'/hello/from/oscjs',
);
)


//************************* GRANULAR SYNTHDEF ****************************************************
//SynthDef adapted from SuperCollider documentation
//http://doc.sccode.org/Classes/Warp1.html

(
// load audio to the buffer
b = Buffer.read(s, thisProcess.nowExecutingPath.dirname +/+ "Introitus.flac");

// define a synth
g = SynthDef.new(\granular,
	        // declare arguments and variables
	        { arg out = 0, rate = 50, bufnum;
		      var playhead, sig;

		      // set where in the song the buffer reads from
		      // using linear ramp between start and end values
		      playhead = Phasor.ar(0, SampleDur.ir / BufDur.ir(b) * rate);
		      // warp the buffer with a time pointer
	          sig = Warp1.ar(1, b, playhead, 1, 0.3, -1, 16, Line.kr(0, 1, 40), 4);
		      // pans the signal as a function of the playhead position
			  sig = Pan2.ar(sig, playhead * 2 - 1, 0.25);
              // write the signal to bus 0
		      Out.ar( out, sig )
}).add;

// create synth under variable g
g = Synth(\granular);

g.set(\rate, 1);
)


// *******************************************************************************

// free the instrument
g.free;
// reboot the server
s.reboot;
// quit the server
s.quit;
