import fs from 'fs'

function cleanPath(path) {
  try {
    if(!fs.existsSync(path)){ 
      return; 
    }
  
    if (fs.lstatSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(function(file, _index){
        var curPath = path + "/" + file;
  
        if (fs.lstatSync(curPath).isDirectory()) { 
          cleanPath(curPath);
        } else { 
          fs.unlinkSync(curPath);
        }
      });
  
      fs.rmdirSync(path);
    }
  } catch {}
};

cleanPath('./.build');