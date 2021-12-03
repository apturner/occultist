const _ = require("lodash");

function getFinalRole(playerOrChange) {
    if (!_.has(playerOrChange, "Change")) {
        return {
            Character: playerOrChange?.Character,
            Alignment: playerOrChange?.Alignment,
        };
    } else {
        return getFinalRole(playerOrChange.Change);
    }
}

module.exports = getFinalRole;
