(
SynthDef.new("Pad", {
    |freq = 220, amp = 0.4, attack = 0.4, release = 1.5|
    var env = EnvGen.kr(Env.linen(attack, 1.0, release, amp), doneAction: 2);
    var sig = Mix.fill(4, { |i| Pulse.ar(freq * (1 + (i * 0.005)), 0.3) });
    sig = sig * env;
    sig = LPF.ar(sig, 2000);
    Out.ar(0, sig.dup);
}).add;
)
