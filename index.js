const { app, BrowserWindow,Menu,ipcMain} = require('electron')
const {createPage, renamePagesAfterDeleteProcess, deletePage, getPrompt,wrongPage,changeImage,saveFile,openSavedFile,newFile} = require('./functions')
const path = require('path')

var labelname;



function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    autoHideMenuBar:true,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
      enableRemoteModule: true,
      preload:path.join(__dirname,'public','scripts','upload.js'),
    }
  })
 global.createChild = function createChild(data){
    const child = new BrowserWindow({ 
    width: 600,
    height: 350,
    parent: win,
    modal:true,
    resizable:false,
    frame:false,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
      enableRemoteModule: true,
      
    }
    })
    child.loadFile('./public/pages/_ayarlar.html');
    child.webContents.on('did-finish-load',()=>{
      child.webContents.send('child:path',data);
    });
    child.on('closed',()=>{
     setTimeout(()=>{
       global.refresh()
     },1000) });
  }
  
  win.loadFile('./public/pages/index.html');
  
 
  //Sayfayı yeniler.
  global.refresh = function refresh(){
    win.reload();
  }
  //Bir önceki sayfayı yükler.
  global.openOldPage= function openOldPage(){
    if(Number(global.pathOfFile)===1){
      win.loadFile(`${__dirname}\\public\\pages\\index.html`,(
        (err)=>{   
        if(err) console.log(err);}
        ));
      }
      else if(global.pathOfFile==='index'){
        win.loadFile(`${__dirname}\\public\\pages\\index.html`,(
          (err)=>{   
          if(err) console.log(err);}
          ));
        }
     
      else{
      win.loadFile(`${__dirname}\\public\\pages\\${Number(global.pathOfFile)-1}.html`,(
        (err)=>{   
        if(err) console.log(err);}
        ));
    } 
  }
  global.openMainWindow = function openMainWindow(){
    win.loadFile('./public/pages/index.html');
  }

  
  //Front-end tarafından bilgi alır.
  ipcMain.on("way",(err,data)=>{
   global.pathOfFile = path.basename(data,'.html');
   
  });
  ipcMain.on('setting',(err,data)=>{
    global.createChild(data); 
    
  });
  ipcMain.on('open:changeImage',((err,data)=>{
    changeImage(data);
  }))
 
  const mainmenu = Menu.buildFromTemplate(Mainmenutemplate);
  Menu.setApplicationMenu(mainmenu);
  
}

const Mainmenutemplate = [
    
  { 
    label:"Dosya",
      submenu:[
        {
          label:"Yeni",
          click(){  
            newFile();    
          },
           
        },
        {
          label:"Aç",
          click(){
            openSavedFile();      
          },
           
        },
        {
            label:"Kaydet",
            click(){
            saveFile();       
            },
              
          },
            
      ],    
  },
  
  {
        label:"Şablon oluştur",
        submenu:[
            {
                label:"Şablon - 1",
                icon:'./icon/sablon1@5x.png',
                click(){
                    labelname="1";
                    createPage(labelname);
                      
                },
                 
                },
            {
              label:"Şablon - 2",
              icon:'./icon/sablon2@5x.png',
                click(){
                     labelname="2";
                     createPage(labelname);      
                }
            },
            {
              label:"Şablon - 3",
              icon:'./icon/sablon3@5x.png',
                click(){
                    labelname="3";
                    createPage(labelname);      
               }
            },
            {
              label:"Şablon - 4",
              icon:'./icon/sablon4@5x.png',
                click(){
                    labelname="4";
                    createPage(labelname);      
               }
            },
            {
              label:"Şablon - 5",
              icon:'./icon/sablon5@5x.png',
                click(){
                    labelname="5";
                    createPage(labelname);      
               }
            },
            
        ],
    },
    { 
      label:"Değiştir",
        submenu:[
              {
                label:"Paragraf özelliklerini değiştir.",
                click(){
                  global.createChild(global.pathOfFile);       
                },
              },
              {
                label:"Arka plan resmini değiştir",
                click(){
                  changeImage('bg-image'); 
                      
                },
                 
              },
        ],    
    },
    {
        label:"Sil",
        submenu:[
            {
              label:"Anasayfayı değiştir",
              click(){
              if(global.pathOfFile === 'index') {
                deletePage();
                getPrompt();
              } 
              else{
                  wrongPage();
              }
                
            }
          },
            {
                label:"Sayfayı tamamen sil",
                click(){
                  if(global.pathOfFile !== 'index'){
                    deletePage();
                    renamePagesAfterDeleteProcess();
                    global.openOldPage();   
                  }
                  else{
                    wrongPage();
                  }
                },
              },
              {
                label:"Sayfayı sil ve yerine başka bir şablon koy",
                click(){
                if(global.pathOfFile !== 'index'){
                  deletePage();
                  getPrompt();
                }  
                else{
                  wrongPage();
                }
                   
              }
            },
            
        ]
    },
    {
      label:'Seçenekler',
      submenu:[
        {
          label:"Sayfayı Yenile",
          role:"reload"
        },
        {
          label:"Ekranı büyüt",
          role:"togglefullscreen"
        }
      ]
    }   
]

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
