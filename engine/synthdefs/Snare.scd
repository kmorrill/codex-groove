(
SynthDef.new("Snare", {
    var env = EnvGen.kr(Env.perc(0.001, 0.25), doneAction: 2);
    var noise = WhiteNoise.ar * env;
    var tone = SinOsc.ar(200, 0, env * 0.3);
    var sig = HPF.ar(noise, 2000) * 0.8 + tone;
    Out.ar(0, sig.dup);
}).add;
)
