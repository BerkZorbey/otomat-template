const { ipcRenderer } = require("electron");

window.addEventListener('load',()=>{
  ipcRenderer.on('child:path',(err,data)=>{
   global.filePath = data;
  })
})

/* const paragraphSetting = require('../database/paragraphSetting'); */

async function addParagrafSettings(){
  console.log(global.filePath);
    var fontSize = document.querySelector("#fontSize").value;
    var mode =document.querySelector("#flexSwitchCheckDefault").checked;
    var fontFamily = mode ? document.querySelector('#textModeValue').value:document.querySelector('#selectedValue').value ;
    var fontColor=document.querySelector("#exampleColorInput").value;
   /*  const oldsettings = await paragraphSetting.findOne({ where: {} }); 
    oldsettings.then(result=>
    {
      if(result === null){
          addProcess();
      }
      else{
        updateProcess();
      }
    });
 
    } )
   */
}

function switchMode(){
    var mode = document.querySelector("#flexSwitchCheckDefault").checked; 
    if(mode===true){
      document.querySelector('#selectMode').className += ' d-none';
      document.querySelector('#textMode').classList.remove('d-none');
    }
    else{
      document.querySelector('#textMode').className += ' d-none';
      document.querySelector('#selectMode').classList.remove('d-none');
    } 
  }
 
function paragraphSettingsSave(){
   addParagrafSettings();  
}

module.exports={
    switchMode,
    paragraphSettingsSave
}