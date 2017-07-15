$(document).ready(function(){
    let deleteDate, length;
    let fileDeleteId=[];
    let indexDeleteFile=[];
    let IDarrForDeleting=[];
    let entityID=[];
    let foldersID=[];      
    let styles={visibility:"visible",position:"absolute",top:"25px",left:"600px"};
    let foldersFound = new Event("click");
    let entetyesFound = new Event("dblclick");
    var t=0; // счетчик для хранилищ данных
    let l=0; // счетчик для папок
    
    
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
                        $('#entetyes-id').html('Найдено '+entityID.length+' хранилищ данных');
                        $('#folders-id').html('Идет поиск папок');
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
                                console.log("!!!!ID of FAILED entety is:  "+entityID[t]);                                
                                elem.dispatchEvent(entetyesFound);                                                        
                         } else{
                            if(result.data().length==0){
                                setTimeout(function(){
                                    console.log("ID of checked entety is: "+entityID[t]);
                                    t++;
                                    elem.dispatchEvent(entetyesFound);
                                }, 250);                                
                            }
                            result.data().forEach(function(folder, i){ 
                                foldersID.push(folder.ID);                                
                                length=result.data().length-1;                                
                                if (i==length){
                                    setTimeout(function(){
                                        console.log("ID of checked entety is: "+entityID[t]);
                                        t++;
                                        elem.dispatchEvent(entetyesFound);
                                    }, 250);                                    
                                }
                            });                            
                            if(result.more()){
                                result.next();
                            }                               
                        }
		              });
             console.log(entityID[t]+" checking...");
        } else{
            $('#folders-id').html('Найдено '+foldersID.length+' папок');
            elem.dispatchEvent(foldersFound);           
        }        
    });
       
    /*Поиск всех файлов на диске соответствующих фильтру и сохрание их ID в список*/
    
    $('#elem').click(function(){
        if (foldersID[l]!=undefined){
            BX24.callMethod("disk.folder.getchildren",{id: foldersID[l],filter: {"<UPDATE_TIME": deleteDate}},function (result){
			             if (result.error()){
                             console.error(result.error());
                             setTimeout(function(){
                                 elem.dispatchEvent(foldersFound);
                             },1000);
                         } else{
                            var files=[];
                                result.data().forEach(function(file, i){ 
                                    files.push(file.ID);
                                    fileDeleteId.push(file.ID);
                                });
                                if(result.more()){
                                    result.next();
                                } else {
                                    console.log("Files in folder: "+foldersID[l]+"\n"+files);
                                    l++;
                                    elem.dispatchEvent(foldersFound);
                                }
                        }
		              });
        } else {
                $('#delete-arr-length').html('Вы можете удалить '+fileDeleteId.length+" файлов."+" Удаление файлов займет около: "+Math.floor(fileDeleteId.length/120)+" минут");
                $('#loading-pic').css({visibility:"hidden"});
                $('#delete-ready-info').html('');
                clearInterval(searchingFiles);
        }
    });    
    
    
    
    $('#delete-button').click(function(){
        $('#loading-pic').css(styles);        
        let i=0; 
        let filesDeleted=0;
        let iID=setInterval(function (){
            IDarrForDeleting=indexDeleteFile[i];
            IDarrForDeleting.forEach(function(id){            
                    BX24.callMethod(
		              "disk.file.delete",
		                  {
			                 id: id
		                  },
		              function (result){
			                 if (result.error()){
                                console.error(result.error());                    
                                $('#loading-pic').css({visibility:"hidden"});
                                $('#delete-arr-length').html('Перезапустите программу');
                                return false;
                            }				    
			                 else{
                                console.dir(result.data());
                                filesDeleted++;
                                $('#delete-ready-info').html('Файлов удалено: '+filesDeleted);
                            }				   
		              }
                    );            
                });
            if (i==index){
                clearInterval(iID);
                $('#loading-pic').css({visibility:"hidden"});                
            }
            return i++;
        }, 25000);
    });
}); 