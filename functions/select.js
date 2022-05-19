const _ = require("lodash");
const { stringFormat } = require("../functions/format");
const alignmentFormatMap = require("../data/alignmentFormat");
const characterFormatMap = require("../data/characterFormat");
const characterTypeFormatMap = require("../data/characterTypeFormat");
const nameFormatMap = require("../data/nameFormat");
const scriptFormatMap = require("../data/scriptFormat");
const scriptTypeFormatMap = require("../data/scriptTypeFormat");

function select(str, map, soft = false) {
    if (soft) {
        return Object.keys(map).find((key) => key.includes(stringFormat(str)));
    } else {
        return map[stringFormat(str)];
    }
}

function selectPlayer(str) {
    return select(str, nameFormatMap);
}

function selectAlignment(str) {
    return select(str, alignmentFormatMap);
}

function selectCharacter(str) {
    return select(str, characterFormatMap);
}

function selectCharacterType(str) {
    return select(str, characterTypeFormatMap);
}

function selectScript(str) {
    return select(str, scriptFormatMap);
}

function selectScriptType(str) {
    return select(str, scriptTypeFormatMap);
}

module.exports = {
    select: select,
    selectPlayer: selectPlayer,
    selectAlignment: selectAlignment,
    selectCharacter: selectCharacter,
    selectCharacterType: selectCharacterType,
    selectScript: selectScript,
    selectScriptType: selectScriptType,
};
