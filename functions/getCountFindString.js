const _ = require("lodash");
const stringFormat = require("../functions/stringFormat");
const alignmentFormat = require("../data/alignmentFormat");
const characterFormat = require("../data/characterFormat");
const characterTypeFormat = require("../data/characterTypeFormat");
const nameFormat = require("../data/nameFormat");
const scriptFormat = require("../data/scriptFormat");
const scriptTypeFormat = require("../data/scriptTypeFormat");

function pluralize(list, ending = "s") {
    return list.length > 1 ? ending : "";
}

function optionString(option, func) {
    if (option !== undefined) {
        return func(option);
    } else {
        return "";
    }
}

function getCountFindString(options, count) {
    const startString = count ? "Number of games" : "Game numbers of all games";

    let restString = "";
    restString += optionString(
        options.startDate,
        (opt) => ` after date ${opt};`
    );
    restString += optionString(
        options.endDate,
        (opt) => ` before date ${opt};`
    );
    restString += optionString(
        options.scripts,
        (opt) =>
            ` with script${pluralize(opt, " one of")} ${_.map(
                opt,
                (script) => scriptFormat[stringFormat(script)]
            ).join(", ")};`
    );
    restString += optionString(
        options.scriptTypes,
        (opt) =>
            ` with script type${pluralize(opt, " one of")} ${_.map(
                opt,
                (scriptType) => scriptTypeFormat[stringFormat(scriptType)]
            ).join(", ")};`
    );
    restString += optionString(
        options.winningTeam,
        (opt) => ` with winning team ${opt};`
    );
    restString += optionString(
        options.storytellers,
        (opt) =>
            ` with storyteller${pluralize(opt, " among")} ${_.map(
                opt,
                (st) => nameFormat[stringFormat(st)]
            ).join(", ")};`
    );
    restString += optionString(
        options.players,
        (opt) =>
            ` with player${pluralize(opt)} ${_.map(
                opt,
                (player) => nameFormat[stringFormat(player)]
            ).join(", ")};`
    );
    restString += optionString(
        options.winners,
        (opt) =>
            ` with player${pluralize(opt)} ${_.map(
                opt,
                (player) => nameFormat[stringFormat(player)]
            ).join(", ")} on the winning team;`
    );
    restString += optionString(
        options.losers,
        (opt) =>
            ` with player${pluralize(opt)} ${_.map(
                opt,
                (player) => nameFormat[stringFormat(player)]
            ).join(", ")} on the losing team;`
    );
    restString += optionString(
        options.characters,
        (opt) =>
            ` with character${pluralize(opt)} ${_.map(
                opt,
                (character) => characterFormat[stringFormat(character)]
            ).join(", ")};`
    );
    restString += optionString(
        options.startingCharacters,
        (opt) =>
            ` with starting character${pluralize(opt)} ${_.map(
                opt,
                (character) => characterFormat[stringFormat(character)]
            ).join(", ")};`
    );
    restString += optionString(
        options.endingCharacters,
        (opt) =>
            ` with ending character${pluralize(opt)} ${_.map(
                opt,
                (character) => characterFormat[stringFormat(character)]
            ).join(", ")};`
    );
    restString += optionString(
        options.initialCharacters,
        (opt) =>
            ` with player/initial character pair${pluralize(opt)} ${_.map(
                opt,
                ([player, char]) =>
                    `${nameFormat[stringFormat(player)]}/${
                        characterFormat[stringFormat(char)]
                    }`
            ).join(", ")};`
    );
    restString += optionString(
        options.finalCharacters,
        (opt) =>
            ` with player/final character pair${pluralize(opt)} ${_.map(
                opt,
                ([player, char]) =>
                    `${nameFormat[stringFormat(player)]}/${
                        characterFormat[stringFormat(char)]
                    }`
            ).join(", ")};`
    );
    restString += optionString(
        options.initialTypes,
        (opt) =>
            ` with player/initial character type pair${pluralize(opt)} ${_.map(
                opt,
                ([player, type]) =>
                    `${nameFormat[stringFormat(player)]}/${
                        characterTypeFormat[stringFormat(type)]
                    }`
            ).join(", ")};`
    );
    restString += optionString(
        options.finalTypes,
        (opt) =>
            ` with player/final character type pair${pluralize(opt)} ${_.map(
                opt,
                ([player, type]) =>
                    `${nameFormat[stringFormat(player)]}/${
                        characterTypeFormat[stringFormat(type)]
                    }`
            ).join(", ")};`
    );
    restString += optionString(
        options.initialAlignments,
        (opt) =>
            ` with player/initial alignment pair${pluralize(opt)} ${_.map(
                opt,
                ([player, alignment]) =>
                    `${nameFormat[stringFormat(player)]}/${
                        alignmentFormat[stringFormat(alignment)]
                    }`
            ).join(", ")};`
    );
    restString += optionString(
        options.finalAlignments,
        (opt) =>
            ` with player/final alignment pair${pluralize(opt)} ${_.map(
                opt,
                ([player, alignment]) =>
                    `${nameFormat[stringFormat(player)]}/${
                        alignmentFormat[stringFormat(alignment)]
                    }`
            ).join(", ")};`
    );
    restString += optionString(
        options.versus,
        (opt) =>
            ` in which ${nameFormat[stringFormat(opt[0])]} and ${
                nameFormat[stringFormat(opt[1])]
            } won together, lost together, won/lost, and lost/won, respectively`
    );

    if (restString.slice(-1) === ";") {
        restString = restString.slice(0, -1);
    }
    restString += ": ";

    return startString + restString;
}

module.exports = getCountFindString;
