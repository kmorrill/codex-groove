(
SynthDef.new("Kick808", {
    var env = EnvGen.kr(Env.perc(0.001, 0.3, 1, -4), doneAction: 2);
    var pitchEnv = EnvGen.kr(Env.perc(0.001, 0.2, 60, -8));
    var sig = SinOsc.ar(50 + pitchEnv) * env;
    sig = LPF.ar(sig, 800);
    Out.ar(0, sig.dup);
}).add;
)
