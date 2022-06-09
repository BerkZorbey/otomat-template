const { app, BrowserWindow,ipcMain, Menu} = require('electron');
const {createPage, renamePagesAfterDeleteProcess, deletePage, getPrompt,wrongPage,changeImage,saveFile,openSavedFile,newFile,saveAsFile} = require('./functions');
const path = require('path');

var labelname;



function createWindow (MainTemplate) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
      enableRemoteModule: true,
      preload:path.join(__dirname,'public','scripts','upload.js'),
    }
    
  })
  win.setMenu(null);
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
    win.loadURL(path.join(__dirname,'./public/pages/index.html'));
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
  Menu.setApplicationMenu(Menu.buildFromTemplate(MainTemplate));
}  
const MainTemplate = [ 
{ 
    label: 'Dosya',
      submenu:[
        {
          label: 'Yeni',
          click(){  
            newFile();    
          }
           
        },
        {
          label: 'Aç',
          click(){
            openSavedFile();      
          }
           
        },
        {
            label: 'Kaydet',
            click(){
            saveFile();       
            }
              
          },
          {
            label: 'Farklı Kaydet',
            click(){
            saveAsFile();       
            }
              
          },  
      ],    
  },
  
   {
        label: 'Sablon Olustur',
        submenu:[
            {
                label: 'Sablon - 1',
                icon: path.join(__dirname,'./icon/sablon1@5x.png'),
                click(){
                    labelname="1";
                    createPage(labelname);
                      
                }
                 
                },
            {
              label: 'sablon - 2',
              icon: path.join(__dirname,'./icon/sablon2@5x.png'),
                click(){
                     labelname="2";
                     createPage(labelname);      
                }
            },
            {
              label: 'sablon - 3',
              icon: path.join(__dirname,'./icon/sablon3@5x.png'),
                click(){
                    labelname="3";
                    createPage(labelname);      
               }
            },
            {
              label: 'sablon - 4',
              icon: path.join(__dirname,'./icon/sablon4@5x.png'),
                click(){
                    labelname="4";
                    createPage(labelname);      
               }
            },
            {
              label: 'sablon - 5',
              icon: path.join(__dirname,'./icon/sablon5@5x.png'),
                click(){
                    labelname="5";
                    createPage(labelname);      
               }
            },
            
        ],
    }, 
    { 
      label: 'Degistir',
        submenu:[
              {
                label:'Paragraf özelliklerini degistir.',
                click(){
                  global.createChild(global.pathOfFile);       
                }
              },
              {
                label:'Arka plan resmini degistir',
                click(){
                  changeImage('bg-image'); 
                      
                }
                 
              },
        ],    
    },
     {
        label: 'Sil',
        submenu:[
            {
              label: 'Anasayfayı degistir',
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
                label: 'Sayfayı tamamen sil',
                click(){
                  if(global.pathOfFile !== 'index'){
                    deletePage();
                    renamePagesAfterDeleteProcess();
                    global.openOldPage();   
                  }
                  else{
                    wrongPage();
                  }
                }
              },
              {
                label: 'Sayfayı sil ve yerine başka bir sablon koy',
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
      label: 'Secenekler',
      submenu:[
        
        {
          label: 'Sayfayı Yenile',
          role: "reload"
        },
        {
          label: 'Ekranı buyut',
          role: "togglefullscreen"
        }
      ]
    }     
] 


app.whenReady().then(() => {
  createWindow(MainTemplate);
  
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();

  
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
