let CONFIG = {
  vrmEndPoint: 'https://vrmapi.victronenergy.com/v2/installations',
  vrmAPIKEY: '[VRM_ACCESS_TOKEN_HERE]', //VRM API Long lived Access Token. Replace [VRM_ACCESS_TOKEN_HERE] with your token
  installID: '[VRM_ID_HERE]', //VRM Installation ID. Replace [VRM_ID_HERE] with your VRM installation ID
  vrmCheckInterval: 900000, //Check the VRM SoC at this interval (milliseconds):Default = 900000 (15 minutes)
  SOConVal: 85, //Turn ON the relay if the VRM Soc is ABOVE this level
  SOCoffVal: 70, //Turn OFF the relay if the VRM Soc is BELOW this level
  UnixTime: Math.floor(Date.now() / 1000)-60, //Current Unix time less 5 mins
  scriptStart: '0 0 9 * * SUN,MON,TUE,WED,THU,FRI,SAT', //Created script schedule start times - 9AM SUN-SAT
  scriptStop: '0 0 17 * * SUN,MON,TUE,WED,THU,FRI,SAT', //Created script schedule stop times - 5PM SUN-SAT
  installSchedules: true //Install schedules - boolean
}

function installSchedules(){
  let scriptid = Shelly.getCurrentScriptId();

  function installstart(){
    Shelly.call(
      'Schedule.Create',
      {enable: true, timespec: CONFIG.scriptStart, calls:[{method:"Script.Start", params:{id:scriptid}},]}
    );
  }
  
  function installstop(){
    Shelly.call(
      'Schedule.Create',
      {enable: true, timespec: CONFIG.scriptStop, calls:[{method:"Script.Stop", params:{id:scriptid}},{"method":"switch.set","params":{"id":0,"on":false}}]}
    );
  }

  Shelly.call(
    "Schedule.List",
    {jobs:0},
    function(result){
      i = 0;
      countstart = 0;
      countstop = 0;
      for (let key in result.jobs) {
          if ( result.jobs[i].calls[0].params.id === Shelly.getCurrentScriptId() && result.jobs[i].calls[0].method === "Script.Start" )
          {
            countstart++;
          }
          if ( result.jobs[i].calls[0].params.id === Shelly.getCurrentScriptId() && result.jobs[i].calls[0].method === "Script.Stop" )
          {
            countstop++;
          }
          i=i+1;
        }
      if (countstart === 0) { installstart(); }
      if (countstop === 0) { installstop(); }
    }
  );
  return;
}

if (CONFIG.installSchedules){try{installSchedules();}catch(err){console.log(err);}finally{};}

function getVRMBattState(){
  Shelly.call(
      "http.request",{
        method: "GET",                                
        url: CONFIG.vrmEndPoint + '/' + CONFIG.installID + '/stats?start='+ CONFIG.UnixTime +'&attributeCodes=bs',
        headers: {"x-authorization":"Token " + CONFIG.vrmAPIKEY }
      },function(result){
      try {
        json = result.body;
        obj = JSON.parse(json);
        bsVRM = obj.records.bs[0][2];
        switchon(bsVRM);
      }
      catch(err) {
        switchoff(err);
        console.log(err);
      }
      finally {
      }
     }
  );
}

function getswitchstate(){
  return Shelly.getComponentStatus("switch", 0).output;
}

function switchon(bsVRM){
  let switchstate = getswitchstate();

  if (typeof bsVRM !== 'undefined') {
    if (bsVRM >= CONFIG.SOConVal && switchstate == false) {
      Shelly.call(
        "Switch.Set",
        {id:0,on:true},
        function(){
          logger({"1":{"SoC": bsVRM,"Switch": getswitchstate()}}); 
        }
      );
    }
    else if (bsVRM >= CONFIG.SOConVal && switchstate == true ){
      logger({"2":{"SoC": bsVRM,"Switch": getswitchstate()}});  
    }
    else if (bsVRM <= CONFIG.SOCoffVal && switchstate == true){
      switchoff('3', bsVRM);
    }
    else {
      switchoff('4', bsVRM);
    }
  }  
}

function switchoff(calledby, bsVRM){
  Shelly.call(
    "Switch.Set",
    {id:0,on:false},
    function(){
      logger({calledby:{"SoC": bsVRM,"Switch": getswitchstate()}}); 
    }
  );
}

function startTimer(){
  vrmCheckStartTimer = Timer.set(CONFIG.vrmCheckInterval, true, getVRMBattState);
}

function logger(logdata){
  console.log(logdata); 
}

startTimer();
getVRMBattState();
