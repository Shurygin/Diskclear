function application(){}
application.prototype.displayCurrentUser = function(selector){
    BX24.callMethod('user.current', {}, function(result){        
         $(selector).html('Привет, '+result.data().NAME+' '+result.data().LAST_NAME+'!' );                
    });
}
     
let app = new application();

application.prototype.resizeFrame = function () {

	var currentSize = BX24.getScrollSize();
	minHeight = currentSize.scrollHeight;
	
	if (minHeight < 800) minHeight = 800;
	BX24.resizeWindow(this.FrameWidth, minHeight);

}

application.prototype.saveFrameWidth = function () {
	this.FrameWidth = document.getElementById("app").offsetWidth;
}
	
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
}); 
    


$(document).ready(function(){
    let l,k,i,count=0;
    let employes=[];      
    var local = new Date();    
    $('#filterEndTime').append(`<input id="endDate" value="${local.toDateInputValue()}T00:00" type="datetime-local">`);
    
    
   
    
   
     BX24.callMethod('user.get', {}, function(result){
         for (i =0;i<50;i++){            
                if (result.answer.result[i].LAST_NAME!=""&&result.answer.result[i].LAST_NAME!=null&&result.answer.result[i].ACTIVE==true){
                    employes.push(result.data()[i].LAST_NAME);
                    employes.sort();                
                }
         } 
         if (result.more()){               
             result.next();
         } else {
             for (i =0;i<50;i++){            
             if (result.answer.result[i].LAST_NAME!=""&&result.answer.result[i].LAST_NAME!=null&&result.answer.result[i].ACTIVE==true){
                    employes.push(result.data()[i].LAST_NAME);
                    employes.sort();
                
                }
            } 
             
         }
                
         
     });
     
        $('#filterUsersList').one('click',function(){
                        
            l = employes.length;
            for (k=0;k<l;k++){
                $('#filterUsersList').append(`<option value = "${employes[k]}">${employes[k]}</option>`);        
            }
            
        }); 
     
       
     
     
}); 
    
