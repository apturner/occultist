const alignmentFormatObj = require("../data/alignmentFormat");
const characterFormatObj = require("../data/characterFormat");
const characterTypeFormatObj = require("../data/characterTypeFormat");
const nameFormatObj = require("../data/nameFormat");
const scriptFormatObj = require("../data/scriptFormat");
const scriptTypeFormatObj = require("../data/scriptTypeFormat");

function stringFormat(str) {
    if (str === undefined) return undefined;

    return str.replace(/[ -]/g, "").toLowerCase();
}

function alignmentFormat(str) {
    alignmentFormatObj[stringFormat(str)];
}

function characterFormat(str) {
    characterFormatObj[stringFormat(str)];
}

function characterTypeFormat(str) {
    characterTypeFormatObj[stringFormat(str)];
}

function nameFormat(str) {
    nameFormatObj[stringFormat(str)];
}

function scriptFormat(str) {
    scriptFormatObj[stringFormat(str)];
}

function scriptTypeFormat(str) {
    scriptTypeFormatObj[stringFormat(str)];
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
