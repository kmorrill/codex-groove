(
SynthDef.new("SamplePlayer", {
    |buf = 0, rate = 1, amp = 1|
    var sig = PlayBuf.ar(2, buf, rate * BufRateScale.kr(buf), doneAction: 2);
    Out.ar(0, sig * amp);
}).add;
)
