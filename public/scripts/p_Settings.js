const { ipcRenderer} = require("electron");
const paragraph_setting = require('../database/p_settings'); 



window.addEventListener('load',()=>{
  document.querySelector('.view div').className += ' d-none';
  ipcRenderer.on('child:path',(err,data)=>{
   global.filePath=data;
  })
 
  
})

async function uploadSettings(pageName){ 
  
  if(pageName !== '_ayarlar'){
    await paragraph_setting.findOne({where:{pageId:pageName} })
    .then(result=>{
      document.querySelector(".sablon2-p").style.fontSize=`${result.dataValues.fontSize}vh`;
      document.querySelector(".sablon2-p").style.fontFamily=`${result.dataValues.fontFamily}`;
      document.querySelector(".sablon2-p").style.color=`${result.dataValues.fontColor}`;
      
    })
    .catch(err=>console.log(err));

  }
}


async function addParagrafSettings(){
    var pageId = global.filePath;      
    var mode =document.querySelector("#flexSwitchCheckDefault").checked;    
    var fontSize = document.querySelector("#fontSize").value;
    var fontFamily = mode ? document.querySelector('#textModeValue').value : document.querySelector('#selectedValue').value ;
    var fontColor=document.querySelector("#exampleColorInput").value;

    const oldsettings = paragraph_setting.findOne({ where: {pageId:pageId} }); 
    oldsettings.then(result=>
    {    
      if(result === null){
          addProcess(pageId,
      fontSize,
      fontFamily,
      fontColor);
      }
      else{
      fontSize = document.querySelector("#fontSize").value !=='' ? document.querySelector("#fontSize").value: result.fontSize;
      fontFamily = mode ? (document.querySelector('#textModeValue').value !== '' ? document.querySelector('#textModeValue').value : result.fontFamily ):(document.querySelector('#selectedValue').value!== ''?document.querySelector('#selectedValue').value:result.fontFamily) ;
      fontColor=document.querySelector("#exampleColorInput").value!=='#000000'?document.querySelector("#exampleColorInput").value:result.fontColor;
      
        updateProcess(pageId,
          fontSize,
          fontFamily,
          fontColor);
      }
    })
    .catch((err)=>{console.log(err)});
    
 
    } 
    async function addProcess(pageId,fontSize,fontFamily,fontColor){
      await paragraph_setting.create({pageId,fontSize,fontFamily,fontColor
     });
      
    }
    async function updateProcess(pageId,fontSize,
      fontFamily,
      fontColor){
      await paragraph_setting.update({fontSize,
        fontFamily,
        fontColor},{where:{pageId:pageId}});
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
 
async function SettingsSave(){
  await addParagrafSettings(); 
    window.setTimeout(()=>{window.close()},1000);  
}
function preview(){
  document.querySelector('.view div').classList.remove('d-none');
  var mode =document.querySelector("#flexSwitchCheckDefault").checked;
  document.querySelector(".view div").style.fontSize=`${document.querySelector("#fontSize").value}vw`;
  document.querySelector(".view div").style.fontFamily= mode ? (document.querySelector('#textModeValue').value):(document.querySelector('#selectedValue').value);
  document.querySelector(".view div").style.color=document.querySelector("#exampleColorInput").value!=='#ffffff'?document.querySelector("#exampleColorInput").value:'#000000';
};
module.exports={
    switchMode,
    SettingsSave,
    uploadSettings,
    preview,
    
}