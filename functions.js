const fs = require('fs')
const path = require("path")
const prompt = require('electron-prompt');
const Alert = require("electron-alert");
const {deleteContent}=require('./public/scripts/p_crud');
//alert ayarları
let wrong = {
    position: "center",
    title: "Yanlış Sayfa",
    icon: "warning",
    showConfirmButton: true,
    timer: 3000
};
let cantDelete = {
    position: "center",
    title: "Bu sayfa tamamen silinemez",
    icon: "warning",
    showConfirmButton: true,
    timer: 3000
};

var readStream;
var writeStream;
var id=1;

//Sayfanın sayfalar klasöründe var olup olmadığını bak Boolean döndürür.
function isFileinDirectory(id){
    try{  
        return fs.lstatSync(path.join(module.path,'public','pages',`${id}.html`)).isFile();  
    }  
    catch (err){  
        return false;  
    } 
}

/* Sayfanın sayfalar klasöründe var olup olmadığını bakar varsa bir sonraki sayfaya geçer.Sayfa yoksa seçilen şablona göre sayfa yaratır.   
*/ 
function createPage(name){
    var bool = true;    
    var Search;
    while(bool){
        Search = isFileinDirectory(id);
        if(Search){
            id++;
        }
        else{
            
            readStream = fs.createReadStream(__dirname+`/şablon/sablon${name}.html`,'utf-8');
            writeStream =fs.createWriteStream(__dirname+`/public/pages/${id}.html`);
            readStream.pipe(writeStream);
            bool = false;
            id=1; 
            setTimeout(()=>global.refresh(),1000);
            
        }                  
    } 
}

// Anasayfayı seçilen şablon ile değiştirir.   
function createMainPage(name){
    readStream = fs.createReadStream(__dirname+`/şablon/sablon${name}.html`,'utf-8');
    writeStream =fs.createWriteStream(__dirname+`/public/pages/index.html`);
    readStream.pipe(writeStream);
    setTimeout(()=>global.refresh(),1000);
}

// Silme işlemi sonrası silinen sayfadan sonraki ilk sayfalanın isimini değiştirir.
function renamePagesAfterDeleteProcess(){
    var id=Number(global.pathOfFile);
    var boolIsThereFıle =isFileinDirectory(id+1);
              
    while(boolIsThereFıle){
    
    fs.renameSync(`${__dirname}\\public\\pages\\${id+1}.html`,`${__dirname}\\public\\pages\\${id}.html`,((err)=>{
        console.log(err);
        
    }))
    boolIsThereFıle=isFileinDirectory(id+1);
    }
    continuingRenameProcess(id);
}

// İlk sayfanın ismi değiştikten sonraki sayfaların ismini değiştirir.
function continuingRenameProcess(id){
    var renameafter =isFileinDirectory(id+2);
    while(renameafter){
    
        fs.renameSync(`${__dirname}\\public\\pages\\${id+2}.html`,`${__dirname}\\public\\pages\\${id+1}.html`,((err)=>{
        console.log(err);
        
        }))
        renameafter=isFileinDirectory(id+2);
        }
}

//Sayfaları siler.
function deletePage(){
    
    if(global.pathOfFile === 'index'){
        deleteContent(global.pathOfFile);
        fs.unlink(`${__dirname}\\public\\pages\\index.html`,(
            (err)=>{   
            if(err) console.log(err);}
            ));
            
    }
    else{
        deleteContent(Number(global.pathOfFile));
        fs.unlink(`${__dirname}\\public\\pages\\${global.pathOfFile}.html`,(
            (err)=>{   
            if(err) console.log(err);}
            ));
        
    }
    
}

//Şablon seçilmesi için prompt açar.
function getPrompt(){
    prompt({
        title: 'Eklenecek Şablonu seçiniz',
        label: 'Şablon --> (1-5): ',
        type: 'input',
        required: true,
    })
    .then((r) => {
    var name = r;
    if(name==='1'||name==='2'||name==='3'||name==='4'||name==='5'){
        if(global.pathOfFile==='index'){
        createMainPage(name);
        }
        else{
         createPage(name);   
        }
}
})
.catch(console.error);
}

//Yanlış sayfanın silinmeye çalıştığını alert ile belirtir.
function wrongPage(){
if(global.pathOfFile!=='index'){
   Alert.fireToast(wrong);
}
else{
    Alert.fireToast(cantDelete);
}
}



module.exports = {
    createPage,
    isFileinDirectory,
    renamePagesAfterDeleteProcess,
    deletePage,
    getPrompt,
    wrongPage,
    
}