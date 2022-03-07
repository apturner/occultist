const _ = require("lodash");
const getAllRoles = require("../functions/getAllRoles");
const getFinalRole = require("../functions/getFinalRole");
const stringFormat = require("../functions/stringFormat");
const characterTypeMap = require("../data/characterType");
const nameFormat = require("../data/nameFormat");
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
            scripts.some(
                (script) => stringFormat(game.Script) === stringFormat(script)
            )
        );
    }

    if (scriptTypes !== undefined) {
        // Game script type equal to given script type
        conditions.push((game) =>
            scriptTypes.some(
                (scriptType) =>
                    stringFormat(scriptTypeMap[game.Script]) ===
                    stringFormat(scriptType)
            )
        );
    }

    if (win !== undefined) {
        // Winning team equal to given team
        conditions.push((game) => stringFormat(game.Win) === stringFormat(win));
    }

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

    if (players !== undefined) {
        // Game contains all of the given players
        conditions.push((game) =>
            players.every((player) =>
                _.has(game, ["Players", nameFormat[stringFormat(player)]])
            )
        );
    }

    if (winningPlayers !== undefined) {
        // Game contains all of the given players on the winning team
        conditions.push((game) =>
            winningPlayers.every(
                (winningPlayer) =>
                    stringFormat(
                        getFinalRole(
                            game.Players[
                                nameFormat[stringFormat(winningPlayer)]
                            ]
                        )?.Alignment
                    ) === stringFormat(game.Win)
            )
        );
    }

    if (losingPlayers !== undefined) {
        // Game contains all of the given players on the losing team
        conditions.push((game) =>
            losingPlayers.every(
                (losingPlayer) =>
                    stringFormat(
                        getFinalRole(
                            game.Players[nameFormat[stringFormat(losingPlayer)]]
                        )?.Alignment
                    ) === (stringFormat(game.Win) === "good" ? "evil" : "good")
            )
        );
    }

    if (characters !== undefined) {
        // Game contains all of the given characters
        conditions.push((game) =>
            characters.every((character) =>
                _.values(game.Players).some((player) =>
                    _.map(getAllRoles(player), (role) =>
                        stringFormat(role.Character)
                    ).includes(stringFormat(character))
                )
            )
        );
    }

    if (initialCharacters !== undefined) {
        // Game contains all of the given characters
        conditions.push((game) =>
            initialCharacters.every((character) =>
                _.values(game.Players).some(
                    (player) =>
                        stringFormat(player.Character) ===
                        stringFormat(character)
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
                        stringFormat(getFinalRole(player).Character) ===
                        stringFormat(character)
                )
            )
        );
    }

    if (playerInitialCharacters !== undefined) {
        // Game contains all of the given players starting as their given characters
        conditions.push((game) =>
            playerInitialCharacters.every(
                (playerCharacter) =>
                    stringFormat(
                        game.Players[
                            nameFormat[stringFormat(playerCharacter[0])]
                        ]?.Character
                    ) === stringFormat(playerCharacter[1])
            )
        );
    }

    if (playerFinalCharacters !== undefined) {
        // Game contains all of the given players ending as their given characters
        conditions.push((game) =>
            playerFinalCharacters.every(
                (playerCharacter) =>
                    stringFormat(
                        getFinalRole(
                            game.Players[
                                nameFormat[stringFormat(playerCharacter[0])]
                            ]
                        )?.Character
                    ) === stringFormat(playerCharacter[1])
            )
        );
    }

    if (playerInitialCharacterTypes !== undefined) {
        // Game contains all of the given players starting as their given character types
        conditions.push((game) =>
            playerInitialCharacterTypes.every(
                (playerCharacterType) =>
                    stringFormat(
                        characterTypeMap[
                            game.Players[
                                nameFormat[stringFormat(playerCharacterType[0])]
                            ]?.Character
                        ]
                    ) === stringFormat(playerCharacterType[1])
            )
        );
    }

    if (playerFinalCharacterTypes !== undefined) {
        // Game contains all of the given players ending as their given character types
        conditions.push((game) =>
            playerFinalCharacterTypes.every(
                (playerCharacterType) =>
                    stringFormat(
                        characterTypeMap[
                            getFinalRole(
                                game.Players[
                                    nameFormat[
                                        stringFormat(playerCharacterType[0])
                                    ]
                                ]
                            )?.Character
                        ]
                    ) === stringFormat(playerCharacterType[1])
            )
        );
    }

    if (playerInitialAlignments !== undefined) {
        // Game contains all of the given players starting as their given alignments
        conditions.push((game) =>
            playerInitialAlignments.every(
                (playerAlignment) =>
                    stringFormat(
                        game.Players[
                            nameFormat[stringFormat(playerAlignment[0])]
                        ]?.Alignment
                    ) === stringFormat(playerAlignment[1])
            )
        );
    }

    if (playerFinalAlignments !== undefined) {
        // Game contains all of the given players ending as their given alignments
        conditions.push((game) =>
            playerFinalAlignments.every(
                (playerAlignment) =>
                    stringFormat(
                        getFinalRole(
                            game.Players[
                                nameFormat[stringFormat(playerAlignment[0])]
                            ]
                        )?.Alignment
                    ) === stringFormat(playerAlignment[1])
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
