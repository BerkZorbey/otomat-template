const electron = require('electron');
const { ipcRenderer} = electron;
const path = require('path');
const fs = require('fs');

const paragraph_setting = require('../database/p_settings');
const pagesContent = require('../database/pagesContent');
const imagePath = require('../database/imagePath');
const savedLocation = require('../database/savedLocation');
const {addPagesContent}=require('../scripts/p_crud');


const filePath=path.basename(window.location.href,'.html');



window.addEventListener('load',(event) => {
  ipcRenderer.send("way",window.location.href);
  databaseSync();
  buttonDisplay(); 
  
});

async function databaseSync(){
  await pagesContent.sync();
  await paragraph_setting.sync();
  await imagePath.sync();
  await savedLocation.sync();
}



function geri(){
   
  if(Number(filePath) ===1){
      window.open('./index.html','_self');
      
  }
  else{
      window.open(`./${Number(filePath)-1}.html`,'_self');
  }
} 
function ileri(){
  if(filePath==='index'){
      window.open(`./1.html`,'_self');
  }
  else{
      window.open(`./${Number(filePath)+1}.html`,'_self');
  }
 } 
//Paragrafı editlenebilir yapar.
function openEditor(){
  document.querySelector(".sablon2-p").contentEditable = true;
  document.querySelector(".save").style.visibility = "visible";
  document.querySelector(".setting").style.visibility = "visible";
}
function openSetting(){
  ipcRenderer.send('setting',filePath); 
  
}

function openChangeImage(value){
  
  let imgClassName = value;
  ipcRenderer.send('open:changeImage',imgClassName);
}



function buttonDisplay(){
  //Seçilen sayfa ana sayfa ise geri tuşunu gösterme 
  if(filePath==='index'){
    document.querySelector(".gerı").style.display = "none";
    if(!isFileinDirectory(1)){
        document.querySelector(".ılerı").disabled = true;
    } 
  }
  //Seçilen sayfa son sayfa ise ileri tuşunu gösterme
  if(!isFileinDirectory(Number(filePath)+1)  && filePath!=='index'){
    document.querySelector(".ılerı").disabled = true; 
  }
}
//Sayfanın sayfalar klasöründe var olup olmadığını bak Boolean döndürür.
function isFileinDirectory(id){
  try{  
      return fs.lstatSync(path.join(__dirname,`${id}.html`)).isFile();  
  }  
  catch (err){  
      return false;  
  } 
}





function kaydet(){
  addPagesContent();
  document.querySelector(".save").style.visibility = "hidden"; 
  document.querySelector(".setting").style.visibility = "hidden";
}


    



module.exports={
  kaydet,
  ileri,
  geri,
  openEditor,
  openSetting,
  openChangeImage
}

   

    
