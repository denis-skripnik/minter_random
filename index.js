var axios = require("./axios");
var global = require("./global");
var log = require("./logger").getLogger(__filename);

var BigInt = require("big-integer");

const WARN_DURATION = 1000 * 60 * 20; //post warning for 10 minutes to end of round

let prevHash = null;

let numbers = {};
let blockCount = 0;
async function run() {
    
    while(true) {
        try {
            let response = await axios.get('/block?height=' + blockCount);
            let hash = response.data.result.hash;
            blockCount++;
            
            if(prevHash) {
let hash_sum = prevHash+hash;
                let sha3 = hash_sum.digest().toString("hex");
                log.info("hash " + sha3);
                let number = BigInt(sha3, 16).mod(12);
                log.info("счастливое число " + number);
                if(numbers[number]) {
                    numbers[number] ++;
                } else {
                    numbers[number] = 1;
                } 
            }
            prevHash = hash;
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
