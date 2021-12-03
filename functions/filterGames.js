const _ = require("lodash");
const getFinalRole = require("../functions/getFinalRole");
const characterType = require("../data/characterType");
const scriptType = require("../data/scriptType");

function filterGames(
    games,
    {
        numbers,
        dateRange,
        script,
        scriptType,
        win,
        storytellers,
        players,
        characters,
        playerInitialCharacters,
        playerFinalCharacters,
        playerInitialCharacterTypes,
        playerFinalCharacterTypes,
        playerInitialAlignments,
        playerFinalAlignments,
        winningPlayers,
        losingPlayers,
        count = false,
    }
) {
    // Create list of conditions and push all possible conditions into it
    var conditions = [];

    if (numbers !== undefined) {
        // Game number in given list of numbers
        conditions.push((game) => numbers.some((num) => num === game.Number));
    }

    if (dateRange !== undefined) {
        // Game date in given date range (in 1000 * Unix time )
        conditions.push((game) =>
            ((date) => dateRange[0] <= date && date <= dateRange[1])(
                Date.parse(game.Date)
            )
        );
    }

    if (script !== undefined) {
        // Game script equal to given script
        conditions.push(
            (game) => game.Script.toLowerCase() === script.toLowerCase()
        );
    }

    if (scriptType !== undefined) {
        // Game script type equal to given script type
        conditions.push(
            (game) =>
                scriptType[game.Script].toLowerCase() ===
                scriptType.toLowerCase()
        );
    }

    if (win !== undefined) {
        // Winning team equal to given team
        conditions.push((game) => game.Win.toLowerCase() === win.toLowerCase());
    }

    if (storytellers !== undefined) {
        // Game contains any of the given storytellers
        conditions.push((game) =>
            storytellers.some((storyteller) =>
                _.map(game.Storytellers, (st) => st.toLowerCase()).includes(
                    storyteller.toLowerCase()
                )
            )
        );
    }

    if (players !== undefined) {
        // Game contains all of the given players
        conditions.push((game) =>
            players.every((player) =>
                _.has(game, ["Players", player.toLowerCase()])
            )
        );
    }

    if (characters !== undefined) {
        // Game contains all of the given characters
        conditions.push((game) =>
            characters.every((character) =>
                game.Players.values().some(
                    (player) => player.Character === character
                )
            )
        );
    }

    if (playerInitialCharacters !== undefined) {
        // Game contains all of the given players starting as their given characters
        conditions.push((game) =>
            playerInitialCharacters.every(
                (playerCharacter) =>
                    game.Players[playerCharacter[0]]?.Character ===
                    playerCharacter[1]
            )
        );
    }

    if (playerFinalCharacters !== undefined) {
        // Game contains all of the given players ending as their given characters
        conditions.push((game) =>
            playerFinalCharacters.every(
                (playerCharacter) =>
                    getFinalRole(game.Players[playerCharacter[0]])
                        ?.Character === playerCharacter[1]
            )
        );
    }

    if (playerInitialCharacterTypes !== undefined) {
        // Game contains all of the given players starting as their given character types
        conditions.push((game) =>
            playerInitialCharacterTypes.every(
                (playerCharacterType) =>
                    characterType[
                        game.Players[playerCharacterType[0]]?.Character
                    ] === playerCharacterType[1]
            )
        );
    }

    if (playerFinalCharacterTypes !== undefined) {
        // Game contains all of the given players ending as their given character types
        conditions.push((game) =>
            playerFinalCharacterTypes.every(
                (playerCharacterType) =>
                    characterType[
                        getFinalRole(game.Players[playerCharacterType[0]])
                            ?.Character
                    ] === playerCharacterType[1]
            )
        );
    }

    if (playerInitialAlignments !== undefined) {
        // Game contains all of the given players starting as their given alignments
        conditions.push((game) =>
            playerInitialAlignments.every(
                (playerAlignment) =>
                    game.Players[playerAlignment[0]]?.Alignment ===
                    playerAlignment[1]
            )
        );
    }

    if (playerFinalAlignments !== undefined) {
        // Game contains all of the given players ending as their given alignments
        conditions.push((game) =>
            playerFinalAlignments.every(
                (playerAlignment) =>
                    getFinalRole(game.Players[playerAlignment[0]])
                        ?.Alignment === playerAlignment[1]
            )
        );
    }

    if (winningPlayers !== undefined) {
        // Game contains all of the given players ending as their given alignments
        conditions.push((game) =>
            winningPlayers.every(
                (winningPlayer) =>
                    getFinalRole(game.Players[winningPlayer]).Alignment ===
                    game.Win
            )
        );
    }

    if (losingPlayers !== undefined) {
        // Game contains all of the given players ending as their given alignments
        conditions.push((game) =>
            losingPlayers.every(
                (losingPlayer) =>
                    getFinalRole(game.Players[losingPlayer]).Alignment !==
                    game.Win
            )
        );
    }

    if (count === true) {
        return _.sumBy(games, (game) =>
            Number(conditions.every((cond) => cond(game)))
        );
    } else {
        return _.filter(games, (game) =>
            conditions.every((cond) => cond(game))
        );
    }
}

module.exports = filterGames;
