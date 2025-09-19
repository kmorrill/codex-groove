s.waitForBoot({
    ~dirt = SuperDirt(2, s);
    ~dirt.loadSoundFiles;
    ~dirt.loadSynthDefs("../scsyndefs");
    ~dirt.start(57120, [0, 1]);
});
