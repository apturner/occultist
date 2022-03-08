const _ = require("lodash");
const stringFormat = require("../functions/stringFormat");
const alignmentFormat = require("../data/alignmentFormat");
const characterFormat = require("../data/characterFormat");
const characterTypeFormat = require("../data/characterTypeFormat");
const nameFormat = require("../data/nameFormat");
const scriptFormat = require("../data/scriptFormat");
const scriptTypeFormat = require("../data/scriptTypeFormat");

function getCountFindString(options, count) {
    let startString = "";
    if (count) {
        startString = "Number of games";
    } else {
        startString = "Game numbers of all games";
    }

    let restString = `${
        options.startDate !== undefined
            ? ` after date ${options.startDate};`
            : ""
    }${
        options.endDate !== undefined ? ` before date ${options.endDate};` : ""
    }${
        options.scripts !== undefined
            ? ` with script${
                  options.scripts.length > 1 ? " one of" : ""
              } ${_.map(
                  options.scripts,
                  (script) => scriptFormat[stringFormat(script)]
              ).join(", ")};`
            : ""
    }${
        options.scriptTypes !== undefined
            ? ` with script type${
                  options.scriptTypes.length > 1 ? " one of" : ""
              } ${_.map(
                  options.scriptTypes,
                  (scriptType) => scriptTypeFormat[stringFormat(scriptType)]
              ).join(", ")};`
            : ""
    }${
        options.winningTeam !== undefined
            ? ` with winning team ${options.winningTeam};`
            : ""
    }${
        options.storytellers !== undefined
            ? ` with storyteller${
                  options.storytellers.length > 1 ? " among" : ""
              } ${_.map(
                  options.storytellers,
                  (st) => nameFormat[stringFormat(st)]
              ).join(", ")};`
            : ""
    }${
        options.players !== undefined
            ? ` with player${options.players.length > 1 ? "s" : ""} ${_.map(
                  options.players,
                  (player) => nameFormat[stringFormat(player)]
              ).join(", ")};`
            : ""
    }${
        options.winners !== undefined
            ? ` with player${options.winners.length > 1 ? "s" : ""} ${_.map(
                  options.winners,
                  (player) => nameFormat[stringFormat(player)]
              ).join(", ")} on the winning team;`
            : ""
    }${
        options.losers !== undefined
            ? ` with player${options.losers.length > 1 ? "s" : ""} ${_.map(
                  options.losers,
                  (player) => nameFormat[stringFormat(player)]
              ).join(", ")} on the losing team;`
            : ""
    }${
        options.characters !== undefined
            ? ` with character${
                  options.characters.length > 1 ? "s" : ""
              } ${_.map(
                  options.characters,
                  (character) => characterFormat[stringFormat(character)]
              ).join(", ")};`
            : ""
    }${
        options.startingCharacters !== undefined
            ? ` with starting character${
                  options.startingCharacters.length > 1 ? "s" : ""
              } ${_.map(
                  options.startingCharacters,
                  (character) => characterFormat[stringFormat(character)]
              ).join(", ")};`
            : ""
    }${
        options.endingCharacters !== undefined
            ? ` with ending character${
                  options.endingCharacters.length > 1 ? "s" : ""
              } ${_.map(
                  options.endingCharacters,
                  (character) => characterFormat[stringFormat(character)]
              ).join(", ")};`
            : ""
    }${
        options.initialCharacters !== undefined
            ? ` with player/initial character pair${
                  options.initialCharacters.length > 1 ? "s" : ""
              } ${_.map(
                  options.initialCharacters,
                  (playerCharacter) =>
                      `${nameFormat[stringFormat(playerCharacter[0])]}/${
                          characterFormat[stringFormat(playerCharacter[1])]
                      }`
              ).join(", ")};`
            : ""
    }${
        options.finalCharacters !== undefined
            ? ` with player/final character pair${
                  options.finalCharacters.length > 1 ? "s" : ""
              } ${_.map(
                  options.finalCharacters,
                  (playerCharacter) =>
                      `${nameFormat[stringFormat(playerCharacter[0])]}/${
                          characterFormat[stringFormat(playerCharacter[1])]
                      }`
              ).join(", ")};`
            : ""
    }${
        options.initialTypes !== undefined
            ? ` with player/initial character type pair${
                  options.initialTypes.length > 1 ? "s" : ""
              } ${_.map(
                  options.initialTypes,
                  (playerCharacterType) =>
                      `${nameFormat[stringFormat(playerCharacterType[0])]}/${
                          characterTypeFormat[
                              stringFormat(playerCharacterType[1])
                          ]
                      }`
              ).join(", ")};`
            : ""
    }${
        options.finalTypes !== undefined
            ? ` with player/final character type pair${
                  options.finalTypes.length > 1 ? "s" : ""
              } ${_.map(
                  options.finalTypes,
                  (playerCharacterType) =>
                      `${nameFormat[stringFormat(playerCharacterType[0])]}/${
                          characterTypeFormat[
                              stringFormat(playerCharacterType[1])
                          ]
                      }`
              ).join(", ")};`
            : ""
    }${
        options.initialAlignments !== undefined
            ? ` with player/initial alignment pair${
                  options.initialAlignments.length > 1 ? "s" : ""
              } ${_.map(
                  options.initialAlignments,
                  (playerAlignment) =>
                      `${nameFormat[stringFormat(playerAlignment[0])]}/${
                          alignmentFormat[stringFormat(playerAlignment[1])]
                      }`
              ).join(", ")};`
            : ""
    }${
        options.finalAlignments !== undefined
            ? ` with player/final alignment pair${
                  options.finalAlignments.length > 1 ? "s" : ""
              } ${_.map(
                  options.finalAlignments,
                  (playerAlignment) =>
                      `${nameFormat[stringFormat(playerAlignment[0])]}/${
                          alignmentFormat[stringFormat(playerAlignment[1])]
                      }`
              ).join(", ")};`
            : ""
    }${
        options.versus !== undefined
            ? ` in which ${nameFormat[stringFormat(options.versus[0])]} and ${
                  nameFormat[stringFormat(options.versus[1])]
              } [won together, lost together, won/lost, lost/won], respectively`
            : ""
    }`;

    if (restString.slice(-1) === ";") {
        restString = restString.slice(0, -1);
    }
    restString += ": ";

    return startString + restString;
}

module.exports = getCountFindString;
