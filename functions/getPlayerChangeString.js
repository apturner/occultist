const _ = require("lodash");

function getPlayerChangeString(playerRole) {
    return _.reduce(
        playerRole,
        (str, role) =>
            `${str}${str !== "" ? " turned " : ""}${role.Alignment} ${
                role.Character
            }`,
        ""
    );
}

module.exports = getPlayerChangeString;
