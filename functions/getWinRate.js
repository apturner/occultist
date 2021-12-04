const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const characterFormat = require("../data/characterFormat");
const nameFormat = require("../data/nameFormat");

function getWinRate(
    games,
    player,
    initialCharacter,
    finalCharacter,
    initialType,
    finalType,
    initialAlignment,
    finalAlignment
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
        result: `${((100 * playerWinsCount) / playerGamesCount).toFixed(2)}%`,
        wins: playerWinsCount,
        plays: playerGamesCount,
        playerFound: _.has(nameFormat, player.toLowerCase()),
        initialCharacterFound:
            initialCharacter === undefined ||
            _.has(characterFormat, initialCharacter.toLowerCase()),
        finalCharacterFound:
            finalCharacter === undefined ||
            _.has(characterFormat, finalCharacter.toLowerCase()),
    };
}

module.exports = getWinRate;
