var dateFormat = require('dateformat');

module.exports.runtime = {
    dl : 0
}


var fs = require("fs");

const HOME = require('os').homedir();
const CONFIG_FILE = HOME + "/.randomblockchain.js";


module.exports.settings = {
    api : "https://golos.io",
    dbdir : "/tmp",
    startNewRound : false,
    broadcast : false
};

function init() {
    //Load setting Object
    try {
        let sets = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
        module.exports.settings = sets;  
        console.log("loaded settings:\n" + JSON.stringify(module.exports.settings, null, 4));     
    } catch(e) {
        console.warn("unable to read config (" + CONFIG_FILE + ")");
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(module.exports.settings, null, 4), "utf8");
        } catch(e) {
            console.error("unable to create dummy config (" + CONFIG_FILE + ")");
        }
    }
}


module.exports.formatDateTime = function(ms) {
    var options = {

      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    
    return dateFormat(new Date(ms), "dd.mm.yyyy h:MM:ss");
}


init();
