// John Linnane 118227214

// boot the server
s.boot;


// ************************ BRING IN NOSE OSC VALUES *****************************

(
OSCdef.new(
	\noseX,
	{
		arg msg;
		//rescale nose x value to frequency scale 0-1000)
		y.set(\freq, msg[1].linlin(0,670,1000,0));
		// print OSC input to post window
		msg[1].postln;
	},
	'/hello/from/oscjs',
);
)

(
OSCdef.new(
	\noseY,
	{
		arg msg;
		//rescale nose y value to amplitude scale 0-2)
		y.set(\amp, msg[2].linlin(0,475,2,0));
		msg[2].postln;
	},
	'/hello/from/oscjs',
);
)


// ************************ NOSE SYNTHDEF ****************************************
// SynthDef adapted from Eli Fieldsteel Video Tutorial 11: TouchOSC
// https://youtu.be/ZVTbRNu2BI0

(
// define a synth
SynthDef(\scary, {
	// declare arguments
	arg freq=40, prtls=12, detune=0.2, gate=1, pan=0, amp=1, out=0;
	// declare variables
	var sig, env;
	// attack-decay-sustain-release envelope controls amplitude of sound
	// gate closed by default
	env = EnvGen.kr(Env.adsr(0.05,0.1,0.5,3), gate);
	// source of the sound. generates harmonic partials

	sig = Blip.ar(
		// multipy freq by slow moving LFNoise1 to detune
		Lag.kr(freq, 2) * LFNoise1.kr(0.2!16).bipolar(detune).midiratio,
		// number of harmonic partials to generate
		prtls
	);
	// adjust amplitude by another slow LFNoise1
	// split into 16 different LFNoise channels, each with different frequency
	sig = sig * LFNoise1.kr(0.5!16).exprange(0.1,1);
	// mix the 16 audio channels down to stereo
	sig = Splay.ar(sig);
	// pan independently
	sig = Balance2.ar(sig[0], sig[1], pan); // L, R, pan
	// apply envelope and master amplitude argument
	sig = sig * env * amp;
	sig = FreeVerb.ar(sig, mix: 0.5);

	// output the signal
	Out.ar(out, sig);
}).add;

// create synth under variable y
y = Synth(\scary);

y.set(\freq);
y.set(\amp);
y.set(\rate);
y.set(\depth);
)


// *****************************************************************************

// free the instrument
y.free;
// reboot the server
s.reboot;
// quit the server
s.quit;