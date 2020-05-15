// John Linnane 118227214

// boot the server
s.boot;


//************************* BRING IN WRIST OSC VALUES ****************************

(
OSCdef.new(
	\lWristX,
	{
		arg msg;
		x.set(\freqX, msg[5].linlin(0,600,0,1000));
		// msg[5].postln;
	},
	'/hello/from/oscjs',
);
)


(
OSCdef.new(
	\lWristY,
	{
		arg msg;
		x.set(\mul, msg[8].linlin(-100,475,0.5,0));
		// msg[6].postln;
	},
	'/hello/from/oscjs',
);
)


//************************* THEREMIN SYNTHDEF ***********************************

(
// define a synth
SynthDef(\simpleSynth, {
   	// declare arguments and variables
	arg out, freq, mul=0.2, freqX=440;
	var sig;

	sig = SinOsc.ar(freq: Vibrato.kr(freq: Lag.kr(freqX)),
			        phase: 0.0,
			        mul: mul,
			        add: 0.0);

	Out.ar(out, sig);

}).add;

// create synth under variable x
x = Synth(\simpleSynth);

x.set(\freqX, 600);
x.set(\mul, 0.3);
)


// *******************************************************************************

// free the instrument
x.free;
// reboot the server
s.reboot;
// quit the server
s.quit;