const _ = require("lodash");

function getAllRoles(playerOrChange, result = []) {
    result.push({
        Character: playerOrChange.Character,
        Alignment: playerOrChange.Alignment,
        BelievedTheyWere: playerOrChange["Believed They Were"],
        Cause: playerOrChange.Cause,
    });
    if (!_.has(playerOrChange, "Change")) {
        return result;
    } else {
        return getAllRoles(playerOrChange.Change, result);
    }
}

module.exports = getAllRoles;
