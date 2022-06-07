const {dialog} = require('electron');
const fs = require('fs');
const path = require("path");

const prompt = require('electron-prompt');
const Alert = require("electron-alert");
const del = require('del');

const paragraph_setting = require('./public/database/p_settings');
const pagesContent = require('./public/database/pagesContent');
const imagePath = require('./public/database/imagePath');
const savedLocation = require('./public/database/savedLocation');
const {deleteContent}=require('./public/scripts/p_crud');

const {addPagesImage,deleteImage}=require('./public/scripts/img_crud');


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
let saveProcess = {
    position: "center",
    title: "Kayıt işlemi yapılıyor...",
    icon: "warning",
    showConfirmButton: true,
    timer: 1900
};
let successProcess = {
    position: "center",
    title: "Kayıt işlemi yapıldı",
    icon: "success",
    showConfirmButton: true,
    timer: 3000
};
let confirm = {
    position: "center",
    title: "Kayıt edilmeyen sayfalar silinecek.",
    icon: "warning",
    showCancelButton: true,
    
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
        deleteImage(global.pathOfFile);
        
        fs.unlink(`${__dirname}\\public\\pages\\index.html`,(
            (err)=>{   
            if(err) console.log(err);}
            ));
            
    }
    else{
        deleteContent(Number(global.pathOfFile));
        deleteImage(Number(global.pathOfFile));
        
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
//Resmi arayüzden değiştirmek için
function changeImage(data){
    dialog.showOpenDialog({
        properties:['openFile'],    
    }).then((result)=>{
     if(data !== 'video'){
         var encodeFile = `${result.filePaths}`  ;
         var decodeFile = path.join(__dirname,`./public/img/${path.basename(result.filePaths[0]).toString()}`); 
         var base64str = base64_encode(encodeFile);
         base64_decode(base64str, decodeFile);
         addPagesImage(global.pathOfFile,data,path.basename(result.filePaths[0]).toString()); 
    global.refresh();
     } 
     else{
         if(result.filePaths[0].includes('mp4')||result.filePaths[0].includes('ogg')||result.filePaths[0].includes('mp3')){
            encodeFile = `${result.filePaths}`  ;
            decodeFile = path.join(__dirname,`./public/img/${path.basename(result.filePaths[0]).toString()}`); 
            base64str = base64_encode(encodeFile);
            base64_decode(base64str, decodeFile);
            addPagesImage(global.pathOfFile,data,path.basename(result.filePaths[0]).toString()); 
            global.refresh();
            }
    else{
        console.log("It doesn't have video format");
    }
     }  
  
    
    })
    
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

function newFile(){
    let promise = Alert.fireToast(confirm);
    promise.then((result) => {
        if (result.value) {
            //pages
            fs.readdir(path.join(__dirname,`./public/pages`), (err, files) => {
                if (err) {
                    console.log(err);
                    return;
                }  
                
                files.forEach(file => {   
                    if(file !== '_ayarlar.html' && file !== 'index.html'){
                        fs.unlink(`${__dirname}\\public\\pages\\${file}`,(
                            (err)=>{   
                            if(err) console.log(err);}
                            ));
                    }
                    else if(file === 'index.html'){
                        readStream = fs.createReadStream(__dirname+`/şablon/sablon1.html`,'utf-8');
                        writeStream =fs.createWriteStream(__dirname+`/public/pages/index.html`);
                        readStream.pipe(writeStream);
                    }
                
                });
                  
        })
            //img
            fs.readdir(path.join(__dirname,`./public/img`), (err, files) => {
                if (err) {
                  console.log(err);
                  return;
                } 
                files.forEach(file => {
                    fs.unlink(`${__dirname}\\public\\img\\${file}`,(
                    (err)=>{   
                        if(err) console.log(err);}
                    ));
                
                    
                
              }); 
            
        })       
            //database
            forceDatabaseSync(); 
            global.openMainWindow();
            setTimeout(()=>{global.refresh()},1000); 
        } else if (result.dismiss === Alert.DismissReason.cancel) {
            // canceled
        }
    })
            
            
}
async function forceDatabaseSync(){
    
    await pagesContent.sync({force:true});
    await paragraph_setting.sync({force:true});
    await imagePath.sync({force:true});
    await savedLocation.sync({force:true});
      
}
function startValue(){
    //pages
    fs.readdir(path.join(__dirname,`./public/pages`), (err, files) => {
        if (err) {
            console.log(err);
            return;
        }  
        
        files.forEach(file => {   
            if(file !== '_ayarlar.html' && file !== 'index.html'){
                fs.unlink(`${__dirname}\\public\\pages\\${file}`,(
                    (err)=>{   
                    if(err) console.log(err);}
                    ));
            }
            else if(file === 'index.html'){
                readStream = fs.createReadStream(__dirname+`/şablon/sablon1.html`,'utf-8');
                writeStream =fs.createWriteStream(__dirname+`/public/pages/index.html`);
                readStream.pipe(writeStream);
            }
        
        });
        
        

          
})
    //img
    fs.readdir(path.join(__dirname,`./public/img`), (err, files) => {
        if (err) {
          console.log(err);
          return;
        } 
        files.forEach(file => {
            fs.unlink(`${__dirname}\\public\\img\\${file}`,(
            (err)=>{   
                if(err) console.log(err);}
            ));
        
            
        
      }); 
    
})

    //database
    forceDatabaseSync();
   
global.openMainWindow();
setTimeout(()=>{global.refresh()},1000); 
}
function openSavedFile(){
    let promise = Alert.fireToast(confirm);
promise.then((result) => {
	if (result.value) {
        startValue();
        dialog.showOpenDialog({
            properties:['openDirectory'],
            defaultPath:`${path.join(__dirname,'..','..','electron_otomat')}`,
            
        }).then((result)=>{
            global.saveFilePath=result.filePaths;
                //pages
               
                fs.readdir(path.join(`${result.filePaths}`,"pages"), (err, files) => {
                    if (err) {
                        console.log(err);
                        return;
                    }  
                    files.forEach(file => {   
                        readStream = fs.createReadStream(`${result.filePaths}/pages/${file}`,'utf-8');
                        writeStream =fs.createWriteStream(path.join(__dirname,"public","pages",`${file}`));
                        readStream.pipe(writeStream);
                    
                    }); 
                
            })
                //img
                fs.readdir(path.join(`${result.filePaths}/img`), (err, files) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    files.forEach(file => {
                        var encodeFile = `${result.filePaths}/img/${file}`;
                        var decodeFile = path.join(__dirname,"public","img",`${file}`);   
                        var base64str = base64_encode(encodeFile);
                        
                        base64_decode(base64str, decodeFile);
                        
                    
                    }); 
                
            })
                //database
               /*  fs.writeFileSync(`${result.filePath}/database/storage.db`); */
               setTimeout(()=>{global.refresh()},1000); 
        }).catch(err=>console.log(err));
	} else if (result.dismiss === Alert.DismissReason.cancel) {
		// canceled
	}
})
           
       

}

//Eğer sayfa kaydedilmemişse addFile'ı çağır kaydedilmişse updateFile'ı çağır
function saveFile(){  
    
    const oldfile = savedLocation.findOne(); 
    oldfile.then(result=>
    {
      if(result === null){
        addFile();
      }
      else{
        updateFile();
      }
    }).catch(err=>{throw err;});
  
}
//electron_otomotat dosyasının içine belirtilen isimle dosyaları kaydet
function addFile(){ 
    fs.mkdir('../../electron_otomat',{ recursive: true }, (err) => {
        console.log(err);
    });
    dialog.showSaveDialog({
        defaultPath:`${path.join(__dirname,'..','..','electron_otomat')}`,
        
    }
    ).then((result)=>{
        global.saveFilePath=result.filePath;
        console.log(result);   
         savedLocation.create({
            savedPath:result.filePath
        }) 
        
         fs.mkdir(`${result.filePath}`,{ recursive: true }, (err) => {
            console.log(err);
        }); 
        //pages
        fs.readdir(path.join(__dirname,`./public/pages`), (err, files) => {
            if (err) {
              console.log(err);
              return;
            }
            fs.mkdir(`${result.filePath}/pages`,{ recursive: true }, (err) => {
                console.log(err);
            }); 
            files.forEach(file => {
                if(file !== '_ayarlar.html' && file !== '_sablonSetting.html'){
                readStream = fs.createReadStream(path.join(__dirname,`./public/pages/${file}`),'utf-8');
                writeStream =fs.createWriteStream(`${result.filePath}/pages/${file}`);
                readStream.pipe(writeStream);
            }
          }); 
        
    })
        //img
        fs.readdir(path.join(__dirname,`./public/img`), (err, files) => {
            if (err) {
              console.log(err);
              return;
            }
            fs.mkdir(`${result.filePath}/img`,{ recursive: true }, (err) => {
                console.log(err);
            }); 
            files.forEach(file => {
                var encodeFile = path.join(__dirname,`./public/img/${file}`);
                var decodeFile = `${result.filePath}/img/${file}`   
                var base64str = base64_encode(encodeFile);
                base64_decode(base64str, decodeFile);
                
            
          }); 
        
    })
       //database
        fs.mkdir(`${result.filePath}/database`,{ recursive: true }, (err) => {
            console.log(err);
        });

        /* fs.writeFileSync(`${result.filePath}/database/storage.db`); */

        
        
})
   
}
async function deleteFile(){
    try{
        await del(`${global.saveFilePath}\\pages`,{force:true});
        await del(`${global.saveFilePath}\\img`,{force:true});
        await del(`${global.saveFilePath}\\database`,{force:true});
    }
    catch(err){console.log(err);}
}
//Dosyaları sil ve yine kaydet
function updateFile(){
    
    deleteFile();
    const data = savedLocation.findOne();
    data.then(result=>
        {       
            global.saveFilePath=result.savedPath;
        }).catch(err=>{throw err;});
    Alert.fireToast(saveProcess);
    setTimeout(()=>{
        fs.mkdir(`${global.saveFilePath}\\pages`,{ recursive: true }, (err) => {
        console.log(err);
    }); 
    //pages
    fs.readdir(path.join(__dirname,`./public/pages`), (err, files) => {
        if (err) {
        console.log(err);
        return;
        }
        files.forEach(file => {
            if(file !== '_ayarlar.html' && file !== '_sablonSetting.html'){
            readStream = fs.createReadStream(path.join(__dirname,`./public/pages/${file}`),'utf-8');
            writeStream =fs.createWriteStream(`${global.saveFilePath}\\pages\\${file}`);
            readStream.pipe(writeStream);
        }
    });
  //img
  fs.readdir(path.join(__dirname,`./public/img`), (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    fs.mkdir(`${global.saveFilePath}/img`,{ recursive: true }, (err) => {
        console.log(err);
    }); 
        files.forEach(file => {
            var encodeFile = path.join(__dirname,`./public/img/${file}`);
            var decodeFile = `${global.saveFilePath}/img/${file}`   
            var base64str = base64_encode(encodeFile);
            base64_decode(base64str, decodeFile);
        
    
  }); 

})
//database
        fs.mkdir(`${global.saveFilePath}/database`,{ recursive: true }, (err) => {
            console.log(err);
        });
        readStream = fs.createReadStream(path.join(__dirname,`./public/database/storage.db`),'utf-8');
        writeStream =fs.createWriteStream(`${global.saveFilePath}/database/storage.db`);
        readStream.pipe(writeStream);
        });
        Alert.fireToast(successProcess);  
        },2000);



}

//Image'i gönderebilmek için encode et
function base64_encode(file) {   
    var bitmap = fs.readFileSync(file);

    return Buffer.from(bitmap).toString('base64');
}
function base64_decode(base64str, file) { 
    var bitmap = Buffer.from(base64str, 'base64');

    fs.writeFileSync(file, bitmap);
}


module.exports = {
    createPage,
    isFileinDirectory,
    renamePagesAfterDeleteProcess,
    deletePage,
    getPrompt,
    wrongPage,
    changeImage,
    saveFile,
    openSavedFile,
    newFile
}