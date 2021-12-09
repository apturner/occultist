const stringFormat = require("../functions/stringFormat");

test("formats Cyberholmes", () => {
    expect(stringFormat("Cyberholmes")).toBe("cyberholmes");
});
test("formats CYBERHOLMES", () => {
    expect(stringFormat("CYBERHOLMES")).toBe("cyberholmes");
});
test("formats CyBeRhOlMeS", () => {
    expect(stringFormat("CyBeRhOlMeS")).toBe("cyberholmes");
});

test("formats Pit-Hag", () => {
    expect(stringFormat("Pit-Hag")).toBe("pithag");
});
test("formats PIT-hag", () => {
    expect(stringFormat("PIT-hag")).toBe("pithag");
});
test("formats P-i-T-h--A---g", () => {
    expect(stringFormat("P-i-T-h--A---g")).toBe("pithag");
});
