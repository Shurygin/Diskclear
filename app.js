$(document).ready(function(){
    let deleteDate, length;
    let fileDeleteId=[];
    let fileIDMatrix=[];
    let fileDelRow=[];
    let fileRowLength=0;
    let entityID=[];
    let foldersID=[]; 
    const matrixLength=80;
    let styles={visibility:"visible",position:"absolute",top:"25px",left:"600px"};
    let foldersFound = new Event("click");
    let entetyesFound = new Event("dblclick");
    let filesFound = new Event("click");
    var t=0; // счетчик для хранилищ данных
    let l=0; // счетчик для папок
    let f=0; // счетчик для файлов
    
    
    $('#find-button').click(function(){
        deleteDate=$('#date').val();
        deleteDate+="T00:00:00+03:00"
        folderID=$('#folder').val();        
        $('#loading-pic').css(styles);
        
        /*Поиск всех хранилищ на диске и сохранение их ID в список*/
        
        BX24.callMethod("disk.storage.getlist",{},		
            function (result){
                if (result.error()){                    
                    console.error(result.error()); 
                } else{                
                    result.data().forEach(function(entity, i){                          
                        entityID.push(entity.ID);
                    }); 
                    if(result.more()){
                        result.next();
                    } else{
                        $('#entetyes-id').html('Хранилищ данных найдено '+entityID.length);
                        $('#folders-id').html('Идет поиск папок...');
                        elem.dispatchEvent(entetyesFound);
                    }
                }
            }); 
    });
    
     /*Поиск всех папок на диске и сохрание их ID в список*/
    
    $('#elem').dblclick(function(){       
        if(entityID[t]!=undefined){
                BX24.callMethod("disk.storage.getchildren",{id: entityID[t], filter: {"<CREATE_TIME": deleteDate}},function (result){                                    
			             if (result.error()){ 
                            t++;
                            console.log("!!!!ID of FAILED entety is:  "+entityID[t]);
                             setTimeout(function(){
                                $('#folders-id').html('Идет поиск папок... найдено: '+foldersID.length+" хранилищ проверено: "+(t+1));                                
                                elem.dispatchEvent(entetyesFound);                                    
                            },100); 
                                elem.dispatchEvent(entetyesFound);                                                        
                         } else{
                            if(result.more()){
                                result.data().forEach(function(folder, i){
                                    foldersID.push(folder.ID);
                                });
                                setTimeout(function(){                                    
                                    result.next();
                                    $('#folders-id').html('Идет поиск папок... найдено: '+foldersID.length+" хранилищ проверено: "+(t+1));
                                },1000); 
                            }    
                            if(result.data().length==0){
                                setTimeout(function(){
                                    $('#folders-id').html('Идет поиск папок... найдено: '+foldersID.length+" хранилищ проверено: "+(t+1));
                                    t++;
                                    elem.dispatchEvent(entetyesFound);
                                }, 250);                                
                            } else {
                                result.data().forEach(function(folder, i){ 
                                    foldersID.push(folder.ID);                                
                                    length=result.data().length-1;                                
                                    if (i==length){
                                        setTimeout(function(){
                                            $('#folders-id').html('Идет поиск папок... найдено: '+foldersID.length+" хранилищ проверено: "+(t+1));
                                            t++;
                                            elem.dispatchEvent(entetyesFound);
                                        },250);                                    
                                    }
                                }); 
                            }                         
                        }
		              });             
        } else{
            $('#folders-id').html('Папок найдено: '+foldersID.length);
            elem.dispatchEvent(foldersFound);           
        }        
    });
       
    /*Поиск всех файлов на диске соответствующих фильтру и сохрание их ID в список*/
  
    $('#elem').click(function(){
        if (foldersID[l]!=undefined){
            BX24.callMethod("disk.folder.getchildren",{id: foldersID[l],filter: {"<UPDATE_TIME": deleteDate}},function (result){
			             if (result.error()){                             
                             l++;
                             setTimeout(function(){
                                $('#delete-arr-length').html('Идет поиск файлов... найдено: '+fileDeleteId.length+" папок проверено: "+(l+1));                                
                                elem.dispatchEvent(foldersFound);                                    
                             },100); 
                         } else{
                            if(result.more()){
                                result.data().forEach(function(file, i){ 
                                    fileDeleteId.push(file.ID);
                                });
                                setTimeout(function(){
                                    $('#delete-arr-length').html('Идет поиск файлов... найдено: '+fileDeleteId.length+" папок проверено: "+(l+1));
                                    result.next();                                    
                                },1000);                                
                            } else if(result.data().length==0){
                                setTimeout(function(){
                                    $('#delete-arr-length').html('Идет поиск файлов... найдено: '+fileDeleteId.length+" папок проверено: "+(l+1));
                                    l++;
                                    elem.dispatchEvent(foldersFound);
                                }, 250);                                
                            } else {
                                result.data().forEach(function(file, i){ 
                                    fileDeleteId.push(file.ID);                                
                                    length=result.data().length-1;                                
                                    if (i==length){
                                        setTimeout(function(){
                                            $('#delete-arr-length').html('Идет поиск файлов... найдено: '+fileDeleteId.length+" папок проверено: "+(l+1));                                            
                                            l++;
                                            elem.dispatchEvent(foldersFound);
                                        }, 1000);                                    
                                    }
                                });
                            }
                             
                        }
		              });
        } else {                
            $('#delete-arr-length').html('Вы можете удалить '+fileDeleteId.length+" файлов."+" Удаление файлов займет около: "+Math.floor(fileDeleteId.length/120)+" минут");
            fileIDMatrix=MakeItMatrix(fileDeleteId,matrixLength);
            $('#loading-pic').css({visibility:"hidden"});
            $('#delete-ready-info').html('');
            del.dispatchEvent(filesFound);
        }
    });
    $('#del').click(function(){
        $('#loading-pic').css(styles);
        fileDelRow=fileIDMatrix[f];        
        if (fileDelRow!=undefined){
            fileRowLength=fileDelRow.length;
            fileDelRow.forEach(function(file,i){
                BX24.callMethod("disk.file.delete",{id: file},function (result){
			             if (result.error()&&i!=(fileRowLength-1)){                             
                             console.log(file);
                             $('#delete-ready-info').html('Файлов удалено: '+(f*matrixLength));
                            }else if(result.error()){
                                console.log(file);
                                $('#delete-ready-info').html('Файлов удалено: '+(f*matrixLength));
                                setTimeout(function(){
                                        f++;
                                        del.dispatchEvent(filesFound);
                                },25000);
                            } else{                                 
                                $('#delete-ready-info').html('Файлов удалено: '+(f*matrixLength));
                                if (i==(fileRowLength-1)){
                                    setTimeout(function(){
                                        f++;
                                        del.dispatchEvent(filesFound);
                                    },25000);
                                }
                            }				   
		              });
            });
            
        } else {             
            $('#delete-ready-info').html('Удаление файлов завершено успешно.\nФайлов удалено: '+((f-1)*matrixLength+fileIDMatrix[(f-1)].length));          
            $('#loading-pic').css({visibility:"hidden"});  
        }
    });
});

function MakeItMatrix(array, length){    
     let matrix=[];
     let index = Math.floor(array.length/length);     
         for (var i=0; i<=index; i++){
             matrix[i]=[];            
             if (i==index){
                 for(var j=0; j<length; j++){
                     if(array[0]!=undefined){
                         matrix[i][j]=array.pop();
                     }                    
                 }
             } else {
                 for(var j=0; j<length; j++){                
                     matrix[i][j]=array.pop();                    
                 } 
             }
     }
     return matrix;
 }