const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const { stringFormat } = require("../functions/stringFormat");
const alignmentFormatMap = require("../data/alignmentFormat");
const characterFormatMap = require("../data/characterFormat");
const characterTypeFormatMap = require("../data/characterTypeFormat");
const nameFormatMap = require("../data/nameFormat");
const scriptFormatMap = require("../data/scriptFormat");
const scriptTypeFormatMap = require("../data/scriptTypeFormat");

function getWinRate(
    games,
    player,
    {
        script,
        scriptType,
        initialCharacter,
        finalCharacter,
        initialType,
        finalType,
        initialAlignment,
        finalAlignment,
    }
) {
    const playerGamesCount = filterGames(games, {
        players: [player],
        scripts: script ? [script] : undefined,
        scriptTypes: scriptType ? [scriptType] : undefined,
        playerInitialCharacters: initialCharacter
            ? [[player, initialCharacter]]
            : undefined,
        playerFinalCharacters: finalCharacter
            ? [[player, finalCharacter]]
            : undefined,
        playerInitialCharacterTypes: initialType
            ? [[player, initialType]]
            : undefined,
        playerFinalCharacterTypes: finalType
            ? [[player, finalType]]
            : undefined,
        playerInitialAlignments: initialAlignment
            ? [[player, initialAlignment]]
            : undefined,
        playerFinalAlignments: finalAlignment
            ? [[player, finalAlignment]]
            : undefined,
        count: true,
    });

    const playerWinsCount = filterGames(games, {
        winningPlayers: [player],
        scripts: script ? [script] : undefined,
        scriptTypes: scriptType ? [scriptType] : undefined,
        playerInitialCharacters: initialCharacter
            ? [[player, initialCharacter]]
            : undefined,
        playerFinalCharacters: finalCharacter
            ? [[player, finalCharacter]]
            : undefined,
        playerInitialCharacterTypes: initialType
            ? [[player, initialType]]
            : undefined,
        playerFinalCharacterTypes: finalType
            ? [[player, finalType]]
            : undefined,
        playerInitialAlignments: initialAlignment
            ? [[player, initialAlignment]]
            : undefined,
        playerFinalAlignments: finalAlignment
            ? [[player, finalAlignment]]
            : undefined,
        count: true,
    });

    return {
        result:
            playerGamesCount > 0
                ? `${((100 * playerWinsCount) / playerGamesCount).toFixed(2)}%`
                : "No games",
        wins: playerWinsCount,
        plays: playerGamesCount,
        playerFound: _.has(nameFormatMap, stringFormat(player)),
        scriptFound:
            script === undefined ||
            _.has(scriptFormatMap, stringFormat(script)),
        scriptTypeFound:
            scriptType === undefined ||
            _.has(scriptTypeFormatMap, stringFormat(scriptType)),
        initialCharacterFound:
            initialCharacter === undefined ||
            _.has(characterFormatMap, stringFormat(initialCharacter)),
        finalCharacterFound:
            finalCharacter === undefined ||
            _.has(characterFormatMap, stringFormat(finalCharacter)),
        initialTypeFound:
            initialType === undefined ||
            _.has(characterTypeFormatMap, stringFormat(initialType)),
        finalTypeFound:
            finalType === undefined ||
            _.has(characterTypeFormatMap, stringFormat(finalType)),
        initialAlignmentFound:
            initialAlignment === undefined ||
            _.has(alignmentFormatMap, stringFormat(initialAlignment)),
        finalAlignmentFound:
            finalAlignment === undefined ||
            _.has(alignmentFormatMap, stringFormat(finalAlignment)),
    };
}

module.exports = getWinRate;
