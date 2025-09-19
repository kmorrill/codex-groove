(
SynthDef.new("Sawbass", {
    |freq = 55, sustain = 0.5, amp = 0.5|
    var env = EnvGen.kr(Env.adsr(0.01, 0.2, 0.4, 0.3, amp), gate: 1, doneAction: 2);
    var sig = Saw.ar(freq) * env;
    sig = LPF.ar(sig, 800) + (sig * 0.25);
    Out.ar(0, sig.dup);
}).add;
)
