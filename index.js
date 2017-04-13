var golos = require("./golos");
var global = require("./global");
var log = require("./logger").getLogger(__filename);

var keccak = require("keccak");
var BigInt = require("big-integer");

const WARN_DURATION = 1000 * 60 * 20; //post warning for 10 minutes to end of round

let prevSig = null;

let numbers = {};
let blockCount = 0;
async function run() {
    
    while(true) {
        try {
            let act = await golos.getCurrentServerTimeAndBlock();
            let sig = await golos.getBlockSignature(act.block);
            blockCount++;
            
            if(prevSig) {
                let hasher = new keccak("keccak256");
                hasher.update(prevSig + sig);
                let sha3 = hasher.digest().toString("hex");
                log.info("hash " + sha3);
                let number = BigInt(sha3, 16).mod(12).value;
                log.info("счастливое число " + number);
                if(numbers[number]) {
                    numbers[number] ++;
                } else {
                    numbers[number] = 1;
                } 
            }
            prevSig = sig;
            let kn = Object.keys(numbers);
            kn.sort((a,b) => {
                a - b;
            });
            log.info(`Прочитанно блоков ${blockCount}`); 
            for(let i = 0; i < kn.length; i++) {
                log.info(`Число ${kn[i]} выпало ${numbers[kn[i]]} раз`);
            }
        } catch(e) {
            log.error("Error catched in main loop! " + e);
        }  
        await sleep(1000*6); //sleep 1 minutes   
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run();
