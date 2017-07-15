$(document).ready(function(){
    let deleteDate, folderID, searchingFolders;
    let fileDeleteId=[];
    let indexDeleteFile=[];
    let IDarrForDeleting=[];
    let entityID=[];
    let foldersID=[];
    let entetysIDMatrix=[];
    let currentStringEntetysIDMatrix=[];
    let styles={visibility:"visible",position:"absolute",top:"25px",left:"600px"};
    
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
                    result.data().forEach(function(file, i){                          
                        entityID.push(file.ID);
                    }); 
                    if(result.more()){
                        result.next();
                    } else{
                        
                        /*Поиск всех папок на диске и сохрание их ID в список*/
                        
                        entetysIDMatrix=MakeItMatrix(entityID, 50);
                        let k=0;
                        searchingFolders=setInterval(function (){
                            currentStringEntetysIDMatrix=entetysIDMatrix[k];
                            if (currentStringEntetysIDMatrix!=undefined){
                                currentStringEntetysIDMatrix.forEach(function(entity,i){
                                    BX24.callMethod("disk.storage.getchildren",
		                          {id: entity},
		                          function (result){
                                    console.log(i);
			                         if (result.error()){
                                         console.error(result.error());
                                    } else{                                    
                                        result.data().forEach(function(folder, i){ 
                                        foldersID.push(folder.ID); 
                                        });
                                        entityID.shift();
                                        if(result.more()){
                                        result.next();
                                        } 
                                    }
		                          });
                                });
                            } else {
                              console.log(foldersID);
                              clearInterval(searchingFolders);  
                            }
                          return k++;
                        }, 15000);
                        
                    }
                }
            });
        /*Поиск всех файлов на диске соответствующих фильтру и сохрание их ID в список*/
        /*
        BX24.callMethod(
		"disk.folder.getchildren",
		{
			id: folderID,
			filter: {
				"<UPDATE_TIME": deleteDate
			}
		},
		function (result){
			if (result.error()){
                console.error(result.error());
            }
			else{
                result.data().forEach(function(file, i){                    
                    fileDeleteId.push(file.ID);
                });
                
                if(result.more()){
                    result.next();
                } else {
                    $('#delete-arr-length').html('Вы можете удалить '+fileDeleteId.length+" файлов."+" Удаление файлов займет около: "+Math.floor(fileDeleteId.length/120)+" минут");
                    $('#loading-pic').css({visibility:"hidden"});
                    $('#delete-ready-info').html('');
                }
            }
		});
        */ 
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
    
    $('#calc-button').click(function(){
        $('#loading-pic').css(styles);
        IDarrForDeleting=MakeItMatrix(fileDeleteId, 50);        
        $('#loading-pic').css({visibility:"hidden"});
        $('#delete-ready-info').html('Файлы готовы к удалению');
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


    
