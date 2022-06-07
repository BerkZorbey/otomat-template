const {uploadcontent}=require('../scripts/p_crud');
const {uploadSettings}=require('../scripts/p_Settings');
const {uploadImage}=require('../scripts/img_crud');
const path=require('path');
var pageName = `${path.basename(window.location.href,'.html')}`;

uploadcontent();
uploadImage(); 
uploadSettings(pageName);    

  
