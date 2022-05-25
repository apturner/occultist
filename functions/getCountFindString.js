const _ = require("lodash");
const {
    stringFormat,
    alignmentFormat,
    characterFormat,
    characterTypeFormat,
    nameFormat,
    scriptFormat,
    scriptTypeFormat,
} = require("../functions/format");

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
    let countFindString = count
        ? "Number of games"
        : "Game numbers of all games";

    countFindString += optionString(
        options.startDate,
        (opt) => ` after date ${opt};`
    );
    countFindString += optionString(
        options.endDate,
        (opt) => ` before date ${opt};`
    );
    countFindString += optionString(
        options.scripts,
        (opt) =>
            ` with script${pluralize(opt, " one of")} ${_.map(
                opt,
                scriptFormat
            ).join(", ")};`
    );
    countFindString += optionString(
        options.scriptTypes,
        (opt) =>
            ` with script type${pluralize(opt, " one of")} ${_.map(
                opt,
                scriptTypeFormat
            ).join(", ")};`
    );
    countFindString += optionString(
        options.winningTeam,
        (opt) => ` with winning team ${opt[0].toUpperCase() + opt.slice(1)};`
    );
    countFindString += optionString(
        options.storytellers,
        (opt) =>
            ` with storyteller${pluralize(opt, " among")} ${_.map(opt, (st) =>
                nameFormat(st)
            ).join(", ")};`
    );
    countFindString += optionString(
        options.bluffs,
        (opt) =>
            ` with bluff${pluralize(opt)} ${_.map(opt, (bluff) =>
                characterFormat(bluff)
            ).join(", ")};`
    );
    countFindString += optionString(
        options.players,
        (opt) =>
            ` with player${pluralize(opt)} ${_.map(opt, nameFormat).join(
                ", "
            )};`
    );
    countFindString += optionString(
        options.winners,
        (opt) =>
            ` with player${pluralize(opt)} ${_.map(opt, nameFormat).join(
                ", "
            )} on the winning team;`
    );
    countFindString += optionString(
        options.losers,
        (opt) =>
            ` with player${pluralize(opt)} ${_.map(opt, nameFormat).join(
                ", "
            )} on the losing team;`
    );
    countFindString += optionString(
        options.characters,
        (opt) =>
            ` with character${pluralize(opt)} ${_.map(
                opt,
                characterFormat
            ).join(", ")};`
    );
    countFindString += optionString(
        options.startingCharacters,
        (opt) =>
            ` with starting character${pluralize(opt)} ${_.map(
                opt,
                characterFormat
            ).join(", ")};`
    );
    countFindString += optionString(
        options.endingCharacters,
        (opt) =>
            ` with ending character${pluralize(opt)} ${_.map(
                opt,
                characterFormat
            ).join(", ")};`
    );
    countFindString += optionString(
        options.initialCharacters,
        (opt) =>
            ` with player/initial character pair${pluralize(opt)} ${_.map(
                opt,
                ([player, char]) =>
                    `${nameFormat(player)}/${characterFormat(char)}`
            ).join(", ")};`
    );
    countFindString += optionString(
        options.finalCharacters,
        (opt) =>
            ` with player/final character pair${pluralize(opt)} ${_.map(
                opt,
                ([player, char]) =>
                    `${nameFormat(player)}/${characterFormat(char)}`
            ).join(", ")};`
    );
    countFindString += optionString(
        options.initialTypes,
        (opt) =>
            ` with player/initial character type pair${pluralize(opt)} ${_.map(
                opt,
                ([player, charType]) =>
                    `${nameFormat(player)}/${characterTypeFormat(charType)}`
            ).join(", ")};`
    );
    countFindString += optionString(
        options.finalTypes,
        (opt) =>
            ` with player/final character type pair${pluralize(opt)} ${_.map(
                opt,
                ([player, charType]) =>
                    `${nameFormat(player)}/${characterTypeFormat(charType)}`
            ).join(", ")};`
    );
    countFindString += optionString(
        options.initialAlignments,
        (opt) =>
            ` with player/initial alignment pair${pluralize(opt)} ${_.map(
                opt,
                ([player, alignment]) =>
                    `${nameFormat(player)}/${alignmentFormat(alignment)}`
            ).join(", ")};`
    );
    countFindString += optionString(
        options.finalAlignments,
        (opt) =>
            ` with player/final alignment pair${pluralize(opt)} ${_.map(
                opt,
                ([player, alignment]) =>
                    `${nameFormat(player)}/${alignmentFormat(alignment)}`
            ).join(", ")};`
    );
    countFindString += optionString(
        options.versus,
        ([p1, p2]) =>
            ` in which ${nameFormat(p1)} and ${nameFormat(
                p2
            )} won together, lost together, won/lost, and lost/won, respectively`
    );

    if (countFindString.slice(-1) === ";") {
        countFindString = countFindString.slice(0, -1);
    }
    countFindString += ": ";

    return countFindString;
}

module.exports = getCountFindString;
