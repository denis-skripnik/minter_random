var log = require("./logger").getLogger(__filename, 12);
var steem = require("steem");
var global = require("./global");


const golos_ws = "wss://ws.golos.io";
steem.config.set('websocket',golos_ws);
steem.config.set('address_prefix',"GLS");
steem.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');

var props = {};

/** holt properties */
async function retrieveDynGlobProps() {
    props = await steem.api.getDynamicGlobalPropertiesAsync();
}

/** time in milliseconds */
module.exports.getCurrentServerTimeAndBlock = async function() {
    await retrieveDynGlobProps();
    if(props.time) { 
        return {
            time : Date.parse(props.time), 
            block : props.head_block_number 
        };
    }
    throw "Current time could not be retrieved";
}

module.exports.getBlockSignature = async function (block) {

    log.debug("retrive block " + block);
    var b = await steem.api.getBlockAsync(block);
    if(b && b.witness_signature) {
        log.debug("block's signature " + b.witness_signature );
        return b.witness_signature;
    } 
    throw "unable to retrieve signature for block " + block;
}


