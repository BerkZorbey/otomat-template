const path=require('path');

const {uploadcontent}=require(path.join(__dirname,'..','scripts','p_crud'));
const {uploadSettings}=require(path.join(__dirname,'..','scripts','p_Settings'));
const {uploadImage}=require(path.join(__dirname,'..','scripts','img_crud'));
var pageName = `${path.basename(window.location.href,'.html')}`;

uploadcontent();
uploadImage(); 
uploadSettings(pageName);  



  
