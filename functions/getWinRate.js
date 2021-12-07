const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const stringFormat = require("../functions/stringFormat");
const alignmentFormat = require("../data/alignmentFormat");
const characterFormat = require("../data/characterFormat");
const characterTypeFormat = require("../data/characterTypeFormat");
const nameFormat = require("../data/nameFormat");

function getWinRate(
    games,
    player,
    {
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
        playerFound: _.has(nameFormat, stringFormat(player)),
        initialCharacterFound:
            initialCharacter === undefined ||
            _.has(characterFormat, stringFormat(initialCharacter)),
        finalCharacterFound:
            finalCharacter === undefined ||
            _.has(characterFormat, stringFormat(finalCharacter)),
        initialTypeFound:
            initialType === undefined ||
            _.has(characterTypeFormat, stringFormat(initialType)),
        finalTypeFound:
            finalType === undefined ||
            _.has(characterTypeFormat, stringFormat(finalType)),
        initialAlignmentFound:
            initialAlignment === undefined ||
            _.has(alignmentFormat, stringFormat(initialAlignment)),
        finalAlignmentFound:
            finalAlignment === undefined ||
            _.has(alignmentFormat, stringFormat(finalAlignment)),
    };
}

module.exports = getWinRate;
