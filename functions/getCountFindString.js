const dayDeath = require("../data/causeOfDeathDay");
const nightDeath = require("../data/causeOfDeathNight");
const fabledDeath = require("../data/causeOfDeathFabled");

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
              } ${options.scripts.join(", ")};`
            : ""
    }${
        options.scriptTypes !== undefined
            ? ` with script type${
                  options.scriptTypes.length > 1 ? " one of" : ""
              } ${options.scriptTypes.join(", ")};`
            : ""
    }${
        options.winningTeam !== undefined
            ? ` with winning team ${options.winningTeam};`
            : ""
    }${
        options.storytellers !== undefined
            ? ` with storyteller${
                  options.storytellers.length > 1 ? " among" : ""
              } ${options.storytellers.join(", ")};`
            : ""
    }${
        options.players !== undefined
            ? ` with player${
                  options.players.length > 1 ? "s" : ""
              } ${options.players.join(", ")};`
            : ""
    }${
        options.winners !== undefined
            ? ` with player${
                  options.winners.length > 1 ? "s" : ""
              } ${options.winners.join(", ")} on the winning team;`
            : ""
    }${
        options.losers !== undefined
            ? ` with player${
                  options.losers.length > 1 ? "s" : ""
              } ${options.losers.join(", ")} on the losing team;`
            : ""
    }${
        options.characters !== undefined
            ? ` with character${
                  options.characters.length > 1 ? "s" : ""
              } ${options.characters.join(", ")};`
            : ""
    }${
        options.startingCharacters !== undefined
            ? ` with starting character${
                  options.startingCharacters.length > 1 ? "s" : ""
              } ${options.startingCharacters.join(", ")};`
            : ""
    }${
        options.endingCharacters !== undefined
            ? ` with ending character${
                  options.endingCharacters.length > 1 ? "s" : ""
              } ${options.endingCharacters.join(", ")};`
            : ""
    }${
        options.initialCharacters !== undefined
            ? ` with player/initial character pair${
                  options.initialCharacters.length > 1 ? "s" : ""
              } ${_.map(
                  options.initialCharacters,
                  (playerCharacter) =>
                      `${playerCharacter[0]}/${playerCharacter[1]}`
              ).join(", ")};`
            : ""
    }${
        options.finalCharacters !== undefined
            ? ` with player/final character pair${
                  options.finalCharacters.length > 1 ? "s" : ""
              } ${_.map(
                  options.finalCharacters,
                  (playerCharacter) =>
                      `${playerCharacter[0]}/${playerCharacter[1]}`
              ).join(", ")};`
            : ""
    }${
        options.initialTypes !== undefined
            ? ` with player/initial character type pair${
                  options.initialTypes.length > 1 ? "s" : ""
              } ${_.map(
                  options.initialTypes,
                  (playerCharacterType) =>
                      `${playerCharacterType[0]}/${playerCharacterType[1]}`
              ).join(", ")};`
            : ""
    }${
        options.finalTypes !== undefined
            ? ` with player/final character type pair${
                  options.finalTypes.length > 1 ? "s" : ""
              } ${_.map(
                  options.finalTypes,
                  (playerCharacterType) =>
                      `${playerCharacterType[0]}/${playerCharacterType[1]}`
              ).join(", ")};`
            : ""
    }${
        options.initialAlignments !== undefined
            ? ` with player/initial alignment pair${
                  options.initialAlignments.length > 1 ? "s" : ""
              } ${_.map(
                  options.initialAlignments,
                  (playerAlignment) =>
                      `${playerAlignment[0]}/${playerAlignment[1]}`
              ).join(", ")};`
            : ""
    }${
        options.finalAlignments !== undefined
            ? ` with player/final alignment pair${
                  options.finalAlignments.length > 1 ? "s" : ""
              } ${_.map(
                  options.finalAlignments,
                  (playerAlignment) =>
                      `${playerAlignment[0]}/${playerAlignment[1]}`
              ).join(", ")};`
            : ""
    }${
        options.versus !== undefined
            ? ` in which ${options.versus[0]} and ${options.versus[1]} [won together, lost together, won/lost, lost/won], respectively`
            : ""
    }`;

    console.log(restString);
    console.log(restString.slice(-1));

    if (restString.slice(-1) === ";") {
        restString = restString.slice(0, -1);
    }
    restString += ": ";

    return startString + restString;
}

module.exports = getCountFindString;
