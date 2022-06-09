const path = require('path');
const pagesContent = require(path.join(__dirname,'..','database','pagesContent'));

async function uploadcontent(){
    var pageName = `${path.basename(window.location.href,'.html')}`;
    var ptag = 'p';
    
    await pagesContent.findOne({where:{pageName:pageName,tag:ptag} })
    .then(result=>{
      document.querySelector(".sablon2-p").innerHTML=result.dataValues.content;
    })
    .catch(err=>console.log(err));
  
  }
  //Paragrafın içeriğini database atar.
 function addPagesContent(){
    var pageName = `${path.basename(window.location.href,'.html')}`;
    var ptag = 'p';
    var content = `${document.querySelector(".sablon2-p").innerHTML}`;
    if(content !== "<br>"){
    const oldcontent = pagesContent.findOne({ where: {pageName:pageName,tag:ptag} }); 
    oldcontent.then(result=>
    {
      if(result === null){
          addProcess(pageName,ptag,content);
      }
      else{
        updateProcess(pageName,ptag,content);
      }
    }).catch(err=>{throw err;});
  }
  
  }
  async function addProcess(pageName,ptag,content){
    await pagesContent.create({
      pageName:pageName,
      tag:ptag,
      content:content
   })
  }
  async function updateProcess(pageName,ptag,content){
   await pagesContent.update({content:content},{ where: {pageName:pageName,tag:ptag} });
  }
  async function deleteContent(pagepath){
      await pagesContent.destroy({where:{pageName:pagepath}});
  }
  module.exports={
      addPagesContent,
      uploadcontent,
      deleteContent
  }