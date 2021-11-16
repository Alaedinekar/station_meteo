console.log("connection");
var esp = {id:"48:A3:21:5A:BE:17", userid:"60b2aa582ea85f3b509d5435", lumiere:600, pression:1017, alt:200, hum:50, temp:22};
var esp2 = {id:"28:30:D1:83:E8:CB", userid:"60b2aa582ea85f3b509d5435", lumiere:750, pression:1117, alt:199, hum:60, temp:20};
var esp3 = {id:"04:15:24:81:E2:51", userid:"60b2aa582ea85f3b509d5435", lumiere:200, pression:1057, alt:220, hum:70, temp:21};
var esp4 = {id:"7F:F2:21:BD:01:78", userid:"60abb8d105b5ec078018b3b4", lumiere:650, pression:2057, alt:500, hum:20, temp:15};
var esps = [esp,esp2,esp3,esp4];
var mqtt = require('mqtt');
console.log("connection");
var client  = mqtt.connect('mqtt://152.228.216.110:8883',{clientId:"scriptounet",
    username:"iot",
    password:"salutcestleprojetiot"})

client.on("connect",function(){
    console.log("connection");
    onConnect();
})


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function onConnect() {
  console.log("onConnect");
  while (true)
  {
   //temps entre chaque envoie en l'occurrence 10min 
   await sleep(600000);
let i = 0;
   for (var esp in esps) {
       console.log("envoie");
       console.log(esps[i]);
client.publish("sensors/IOTMIAGE/datas",getDataRandomData(esps[i]),1);
i++
}
}
}

function getDataRandomData(esp){
  return"{\"id\": \"" + getID(esp) + "\", \"userId\": \"" + userID(esp) + "\", \"lumiere\": \"" + get_light(esp) + "\", \"pression\": \"" + get_pressure(esp) + "\", \"altitude\": \"" + get_alt(esp) + "\", \"humidite\": \"" + get_humidity(esp) + "\", \"temperature\": \"" + get_temperature(esp) +"\"" + "}";
}
function getID(esp){
  return (esp.id);
}

function userID(esp){
    return (esp.userid);
}

function get_light(esp){
    let res = Math.random() * (esp.lumiere+6+0.8- esp.lumiere-6) + esp.lumiere-6;

 if(res <0)
 res=0;
 return res.toFixed(2)
}

function get_pressure(esp){
    let res = Math.random() * (esp.pression+2+0.8- esp.pression-2) + esp.pression-2;
    if(res <0)
    res=0;
    return res.toFixed(2)
}

function get_alt(esp){
    let res = Math.random() * (esp.alt+0.2+0.8- esp.alt-0.2) + esp.alt-0.2;

        if(res <0)
        res=0;
        if(res >1000)
        res=1000;
        return res.toFixed(2)
}

function get_humidity(esp){
             let res = Math.random() * (esp.hum+6+0.8- esp.hum-6) + esp.hum-6;
            if(res <0)
            res=0;
            if(res >100)
            res=100;
            return res.toFixed(2)

}

function get_temperature(esp){
          let res = Math.random() * (esp.temp+1+0.8- esp.temp-1) + esp.temp-1;
          if(res <0)
          res=0;
          if(res >35)
          res=35;
          return res.toFixed(2)
}
