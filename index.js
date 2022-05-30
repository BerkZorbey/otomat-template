const { app, BrowserWindow,Menu,ipcMain} = require('electron')
const {createPage, renamePagesAfterDeleteProcess, deletePage, getPrompt,wrongPage} = require('./functions')

const path = require('path')

var labelname;


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
      enableRemoteModule: true,
      preload:path.join(__dirname,'public','scripts','upload.js'),
    }
  })
  function createChild(){
    const child = new BrowserWindow({ 
    width: 400,
    height: 300,
    parent: win,
    modal:true,
    resizable:false,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
      enableRemoteModule: true,
      
    }
    })
    child.loadFile('./public/pages/_ayarlar.html');
    
  }

  
  win.loadFile('./public/pages/1.html');
  
 
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

  
  //Front-end tarafından bilgi alır.
  ipcMain.on("way",(err,data)=>{
   global.pathOfFile = path.basename(data,'.html');
   
  });
  ipcMain.on('setting',(err,data)=>{
    createChild(); 
    win.webContents.send('child:path',data);
  });
  
 
  const mainmenu = Menu.buildFromTemplate(Mainmenutemplate);
  Menu.setApplicationMenu(mainmenu);
  
}

const Mainmenutemplate = [
    {
        label:"Şablon",
        submenu:[
            {
                label:"sablon1",
                click(){
                    labelname="1";
                    createPage(labelname);
                      
                },
                 
                },
            {
                label:"sablon2",
                click(){
                     labelname="2";
                     createPage(labelname);      
                }
            },
            {
                label:"sablon3",
                click(){
                    labelname="3";
                    createPage(labelname);      
               }
            },
            {
                label:"sablon4",
                click(){
                    labelname="4";
                    createPage(labelname);      
               }
            },
            {
                label:"sablon5",
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
          label:"DevTool",
          role:"toggleDevTools"
        },
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
