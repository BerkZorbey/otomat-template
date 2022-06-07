
const imagePath = require('../database/imagePath');
const path = require('path');

async function uploadImage(){
    var pageName = `${path.basename(window.location.href,'.html')}`;
    
    
    await imagePath.findAll({where:{pageName:pageName} })
    .then(result=>{
         if(result !== null){
            result.map((res)=>{
              if(res.dataValues.tag !=="bg-image" && res.dataValues.tag !=="video"){
              return document.querySelector(`.${res.dataValues.tag}`).src= `../img/${res.dataValues.image}`;}
               else if(res.dataValues.tag ==="bg-image"){
                  document.querySelector(`body`).style.backgroundImage= `url(../img/${res.dataValues.image})`;
                  document.querySelector(`body`).style.backgroundRepeat = 'no-repeat';
                  document.querySelector(`body`).style.backgroundSize= "100% 100%";
                  document.querySelector(`body`).style.backgroundPosition = "center";
              } 
              else{
                var x = `../video/${res.dataValues.image}`;
                if(x.includes('mp4')||x.includes('mp3')||x.includes('ogg')){
                  return document.querySelector(`video`).setAttribute('src',x);
                }
                } 
                
              })
              }})
    .catch(err=>console.log(err));
  
  }

  function addPagesImage(pageName,imgTag,imgPath){  
    if(imgPath !== ""){
    const oldcontent = imagePath.findOne({ where: {pageName:pageName,tag:imgTag} }); 
    oldcontent.then(result=>
    {
      if(result === null){
        addImage(pageName,imgTag,imgPath);
      }
      else{
        updateImage(pageName,imgTag,imgPath);
      }
    }).catch(err=>{throw err;});
  
  }
  }

  async function addImage(pageName,imgTag,imgPath){
    await imagePath.create({
      pageName:pageName,
      tag:imgTag,
      image:imgPath
   })
  }
  async function updateImage(pageName,imgTag,imgPath){
    await imagePath.update({image:imgPath},{ where: {pageName:pageName,tag:imgTag} });
   }
   async function deleteImage(pageName){
       await imagePath.destroy({where:{pageName:pageName}});
   }

   module.exports={
    addPagesImage,
    uploadImage,
    deleteImage
}