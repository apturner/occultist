const { spawnSync } = require("child_process");

function jqQuery(queryString, dataFilePath) {
    const jq = spawnSync("jq", [queryString, dataFilePath]);

    let result;
    if (jq.status === 0) {
        result = JSON.parse(`${jq.stdout}`);
    } else {
        console.log(`Query error:\n${jq.stderr}`);
    }

    return result;
}

module.exports = jqQuery;
