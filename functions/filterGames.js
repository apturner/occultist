const _ = require("lodash");
const getAllRoles = require("../functions/getAllRoles");
const getFinalRole = require("../functions/getFinalRole");
const {
    stringFormat,
    alignmentFormat,
    characterFormat,
    characterTypeFormat,
    nameFormat,
    scriptFormat,
    scriptTypeFormat,
} = require("../functions/format");
const characterTypeMap = require("../data/characterType");
const scriptTypeMap = require("../data/scriptType");

function filterGames(
    games,
    {
        numbers,
        startDate,
        endDate,
        scripts,
        scriptTypes,
        win,
        storytellers,
        bluffs,
        players,
        winningPlayers,
        losingPlayers,
        characters,
        initialCharacters,
        finalCharacters,
        playerInitialCharacters,
        playerFinalCharacters,
        playerInitialCharacterTypes,
        playerFinalCharacterTypes,
        playerInitialAlignments,
        playerFinalAlignments,
        count = false,
    }
) {
    // console.log("numbers: ", numbers);
    // console.log("startDate: ", startDate);
    // console.log("endDate: ", endDate);
    // console.log("scripts: ", scripts);
    // console.log("scriptTypes: ", scriptTypes);
    // console.log("win: ", win);
    // console.log("storytellers: ", storytellers);
    // console.log("bluffs: ", bluffs);
    // console.log("players: ", players);
    // console.log("winningPlayers: ", winningPlayers);
    // console.log("losingPlayers: ", losingPlayers);
    // console.log("characters: ", characters);
    // console.log("initialCharacters: ", initialCharacters);
    // console.log("finalCharacters: ", finalCharacters);
    // console.log("playerInitialCharacters: ", playerInitialCharacters);
    // console.log("playerFinalCharacters: ", playerFinalCharacters);
    // console.log("playerInitialCharacterTypes: ", playerInitialCharacterTypes);
    // console.log("playerFinalCharacterTypes: ", playerFinalCharacterTypes);
    // console.log("playerInitialAlignments: ", playerInitialAlignments);
    // console.log("playerFinalAlignments: ", playerFinalAlignments);

    // Create list of conditions and push all possible conditions into it
    var conditions = [];

    if (numbers !== undefined) {
        // Game number in given list of numbers
        conditions.push((game) =>
            numbers.some((num) => num === game.Number.toString())
        );
    }

    if (startDate !== undefined) {
        // Game date after given date (in Unix time)
        conditions.push((game) => parseInt(startDate, 10) <= game.Date);
    }

    if (endDate !== undefined) {
        // Game date before given date (in Unix time)
        conditions.push((game) => game.Date <= parseInt(endDate, 10));
    }

    if (scripts !== undefined) {
        // Game script equal to given script
        conditions.push((game) =>
            scripts.some((script) => game.Script === scriptFormat(script))
        );
    }

    if (scriptTypes !== undefined) {
        // Game script type equal to given script type
        conditions.push((game) =>
            scriptTypes.some(
                (scriptType) =>
                    scriptTypeMap[game.Script] === scriptTypeFormat(scriptType)
            )
        );
    }

    if (win !== undefined) {
        // Winning team equal to given team
        conditions.push((game) => stringFormat(game.Win) === stringFormat(win));
    }

    // Need soft name search here
    if (storytellers !== undefined) {
        // Game contains any of the given storytellers
        conditions.push((game) =>
            storytellers.some((storyteller) =>
                _.map(game.Storytellers, (st) => stringFormat(st)).includes(
                    stringFormat(storyteller)
                )
            )
        );
    }

    if (bluffs !== undefined) {
        // Game contains all of the given bluffs
        conditions.push((game) =>
            bluffs.every((bluff) =>
                game.Bluffs?.includes(characterFormat(bluff))
            )
        );
    }

    // Need soft name search here
    if (players !== undefined) {
        // Game contains all of the given players
        conditions.push((game) =>
            players.every((player) =>
                _.has(game, ["Players", nameFormat(player)])
            )
        );
    }

    // Need soft name search here
    if (winningPlayers !== undefined) {
        // Game contains all of the given players on the winning team
        conditions.push((game) =>
            winningPlayers.every(
                (winningPlayer) =>
                    stringFormat(
                        getFinalRole(game.Players[nameFormat(winningPlayer)])
                            ?.Alignment
                    ) === stringFormat(game.Win)
            )
        );
    }

    // Need soft name search here
    if (losingPlayers !== undefined) {
        // Game contains all of the given players on the losing team
        conditions.push((game) =>
            losingPlayers.every(
                (losingPlayer) =>
                    stringFormat(
                        getFinalRole(game.Players[nameFormat(losingPlayer)])
                            ?.Alignment
                    ) === (game.Win === "Good" ? "evil" : "good")
            )
        );
    }

    if (characters !== undefined) {
        // Game contains all of the given characters
        conditions.push((game) =>
            characters.every((character) =>
                _.values(game.Players).some((player) =>
                    _.map(
                        getAllRoles(player),
                        (role) => role.Character
                    ).includes(characterFormat(character))
                )
            )
        );
    }

    if (initialCharacters !== undefined) {
        // Game contains all of the given characters
        conditions.push((game) =>
            initialCharacters.every((character) =>
                _.values(game.Players).some(
                    (player) => player.Character === characterFormat(character)
                )
            )
        );
    }

    if (finalCharacters !== undefined) {
        // Game contains all of the given characters
        conditions.push((game) =>
            finalCharacters.every((character) =>
                _.values(game.Players).some(
                    (player) =>
                        getFinalRole(player).Character ===
                        characterFormat(character)
                )
            )
        );
    }

    // Need soft name search here
    if (playerInitialCharacters !== undefined) {
        // Game contains all of the given players starting as their given characters
        conditions.push((game) =>
            playerInitialCharacters.every(
                ([player, char]) =>
                    game.Players[nameFormat(player)]?.Character ===
                    characterFormat(char)
            )
        );
    }

    // Need soft name search here
    if (playerFinalCharacters !== undefined) {
        // Game contains all of the given players ending as their given characters
        conditions.push((game) =>
            playerFinalCharacters.every(
                ([player, char]) =>
                    getFinalRole(game.Players[nameFormat(player)])
                        ?.Character === characterFormat(char)
            )
        );
    }

    // Need soft name search here
    if (playerInitialCharacterTypes !== undefined) {
        // Game contains all of the given players starting as their given character types
        conditions.push((game) =>
            playerInitialCharacterTypes.every(
                ([player, charType]) =>
                    characterTypeMap[
                        game.Players[nameFormat(player)]?.Character
                    ] === characterTypeFormat(charType)
            )
        );
    }

    // Need soft name search here
    if (playerFinalCharacterTypes !== undefined) {
        // Game contains all of the given players ending as their given character types
        conditions.push((game) =>
            playerFinalCharacterTypes.every(
                ([player, charType]) =>
                    characterTypeMap[
                        getFinalRole(game.Players[nameFormat(player)])
                            ?.Character
                    ] === characterTypeFormat(charType)
            )
        );
    }

    // Need soft name search here
    if (playerInitialAlignments !== undefined) {
        // Game contains all of the given players starting as their given alignments
        conditions.push((game) =>
            playerInitialAlignments.every(
                ([player, alignment]) =>
                    game.Players[nameFormat(player)]?.Alignment ===
                    alignmentFormat(alignment)
            )
        );
    }

    // Need soft name search here
    if (playerFinalAlignments !== undefined) {
        // Game contains all of the given players ending as their given alignments
        conditions.push((game) =>
            playerFinalAlignments.every(
                ([player, alignment]) =>
                    getFinalRole(game.Players[nameFormat(player)])
                        ?.Alignment === alignmentFormat(alignment)
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
