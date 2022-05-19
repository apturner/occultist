const alignmentFormatMap = require("../data/alignmentFormat");
const characterFormatMap = require("../data/characterFormat");
const characterTypeFormatMap = require("../data/characterTypeFormat");
const nameFormatMap = require("../data/nameFormat");
const scriptFormatMap = require("../data/scriptFormat");
const scriptTypeFormatMap = require("../data/scriptTypeFormat");

function stringFormat(str) {
    if (str === undefined) return undefined;

    return str.replace(/[ -]/g, "").toLowerCase();
}

function alignmentFormat(str) {
    return alignmentFormatMap[stringFormat(str)];
}

function characterFormat(str) {
    return characterFormatMap[stringFormat(str)];
}

function characterTypeFormat(str) {
    return characterTypeFormatMap[stringFormat(str)];
}

function nameFormat(str) {
    return nameFormatMap[stringFormat(str)];
}

function scriptFormat(str) {
    return scriptFormatMap[stringFormat(str)];
}

function scriptTypeFormat(str) {
    return scriptTypeFormatMap[stringFormat(str)];
}

module.exports = {
    stringFormat: stringFormat,
    alignmentFormat: alignmentFormat,
    characterFormat: characterFormat,
    characterTypeFormat: characterTypeFormat,
    nameFormat: nameFormat,
    scriptFormat: scriptFormat,
    scriptTypeFormat: scriptTypeFormat,
};
