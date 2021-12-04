const _ = require("lodash");

function getAllRoles(playerOrChange, result = []) {
    result.push({
        Character: playerOrChange?.Character,
        Alignment: playerOrChange?.Alignment,
    });
    if (!_.has(playerOrChange, "Change")) {
        return result;
    } else {
        return getAllRoles(playerOrChange.Change, result);
    }
}

module.exports = getAllRoles;
