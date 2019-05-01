


import { DCont } from './DCont.js';
import { DButton } from './DCM.js';


/*
export class DAroundButton extends DCont {
  	constructor(dCont, _x, _y, _fun) {
  		super(); 
  		this.type="DAroundButton";
  		var self=this
  		this.x=_x||0;	
  		this.y=_y||0;
   		this.fun=_fun;

		
  	}



  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			//this.reDrag();
			
		}		
	}	
	get width() { return  this._width;}


}*/




export class DAroundButton extends DCont {
    constructor(dCont, _x, _y, _fun) {
        super(dCont); 
        this.type="DAroundButton";
        var self=this
        this.x=_x||0;   
        this.y=_y||0;
        this.fun=_fun;

        this._dist=60;
        this._angel=30; 
        this._angelSdvih=-Math.PI/2; 
        this.array=[]

        var bAround;
        this.dCont = new DCont();

       

        this.creat=function(name, link, link1,state){
            bAround=new BAround(this, name, link, link1,state,this.array.length)  

            this.array.push(bAround)
        }



        this.setParam=function(name, p){
            for (var i = 0; i < this.array.length; i++) {
                if(this.array[i].name==name){
                    
                                    
                    this.array[i].setValue(p);
                }
            }
        }



        var arr=[];
        this.start=function(content, x, y, a) {
            this.stop()
            arr=[]
            for (var i = 0; i < a.length; i++) {               
                for (var j = 0; j < this.array.length; j++) {                    
                    if(a[i]==this.array[j].name){
                        arr.push(this.array[j])
                    }
                }                                
            }
            
            for (var i = 0; i < arr.length; i++) {               
                this.dCont.add(arr[i].dCont);
            }

            

            this.reposit()



            this.dCont.x=x;
            this.dCont.y=y;
            content.add(this.dCont)
        }  

        this.stop=function() {
            for (var i = 0; i < this.array.length; i++) {
                if(this.array[i].dCont.parent!=undefined)this.array[i].dCont.parent.remove(this.array[i].dCont)
            }
            if(this.dCont.parent!=undefined)this.dCont.parent.remove(this.dCont)
        }        


        this.getVector = function (length, angle, point) {
           
            if (length < 0) angle += Math.PI;
            point.x = Math.abs(length) * Math.cos(angle);
            point.y = Math.abs(length) * Math.sin(angle);
            return point;
        };

        var p={x:0,y:0};
        this.reposit=function(){
            var sA=-(this._angel*Math.PI/180*(arr.length-1))/2;
            for (var i = 0; i < arr.length; i++) {
                this.getVector(this._dist,sA+(this._angel*Math.PI/180)*i+this._angelSdvih,p);
                arr[i].dCont.x=p.x;
                arr[i].dCont.y=p.y;
            }
        }

        this.mousedown=function(e){            
            var b=true;
            if(e.target){
                if(e.target.bAround){
                    b=false;
                }
            }
            if(b==true)self.stop()
        }
        document.addEventListener("mousedown", self.mousedown);

    }
    set dist(value) {
        if(this._dist!=value){
            this._dist = value;          
            this.reposit()
        }       
    }   
    get dist() { return  this._dist;}

   set angel(value) {
        if(this._angel!=value){
            this._angel = value;          
            this.reposit()
        }       
    }   
    get angel() { return  this._angel;}
   
    set angelSdvih(value) {
        if(this._angelSdvih!=value){
            this._angelSdvih = value;          
            this.reposit()
        }       
    }   
    get angelSdvih() { return  this._angelSdvih;}

}

export class BAround {
    constructor(par, name, link, link1, state, idArr) {       
        this.type="BAround";
        var self=this
        this.par=par;
        this.name=name;   
        this.link=link; 
        this.link=link1; 
        this.state=state; 
        this.idArr=idArr;
        this.dCont= new DCont();
        this.dCont2= new DCont();
        this.dCont.add(this.dCont2)
        this.dCont2.x=-dcmParam.wh/2
        this.dCont2.y=-dcmParam.wh/2
        var r;
        this.button=new DButtonDrag(this.dCont2, 0, 0, link, link1,function(){
            par.fun(self.name, this.value);
        })
        this.button.state=state;
        this.button.object.bAround=this;

        this.setValue=function(v){
            
            this.button.value=v
        }
    }
}









export class DButtonDrag extends DButton {
    constructor(dCont, _x, _y, _link, _link1,  _fun) {
        super(dCont, _x, _y, " ",  _fun); 
        
        this.type="DButtonDrag";
       
        var self=this;
        this.link=_link;   
        this.link1=_link1;

        this.x=_x||0;   
        this.y=_y||0;
       
        this.fun=_fun;

        this._state=0;  //0  чек драг  //1просто довн //2 драгX//3 драгУ
        this._value=true;

        this.borderRadius=100; 

        self.width = this.height;

        this.image=new DImage(this, 0,0,_link,function(){
            
        })
        this.image.div.style.pointerEvents="none";


        this.image1=new DImage(this, 0,0,_link1,function(){
            
        })
        this.image1.div.style.pointerEvents="none";
        this.image.width=this.image.height=self.width;
        this.image1.width=this.image1.height=self.width;
        this.image1.visible=false
        
        self.point={x:0,y:0};
        var nP,oldParent
        var oo1={x:0,y:0}
        this.fun_mousedown=function(){
            if(self._state==0){
                self.value=!self._value;
                             
            }
            if(self._state==1){
                
            }
            if(self._state==2||self._state==3||self._state==4){
                self.pointStast.x=self.x;
                self.pointStast.y=self.y;

                self.point.x=0
                self.point.y=0
                oo1.x=self.x;
                oo1.y=self.y;
                oldParent=this.parent;
                nP=this.getBigPar(this, oo1);
                nP.add(this);
                this.x=oo1.x;
                this.y=oo1.y;


                if(dcmParam.mobile==false){
                    
                    document.addEventListener("mousemove", self.mousemove2);
                    document.addEventListener("mouseup", self.mouseup2);
                }else{                    
                    document.addEventListener("touchend", self.mouseup2);
                    document.addEventListener("touchmove", self.mousemove2);
                }
            }
        }

        this.getBigPar=function(o, p){
            if(o.parent==undefined)return o;

            p.x+=o.x;
            p.y+=o.y;
            return this.getBigPar(o.parent, p)
        }

        self.pointStast={x:0,y:0};
        var sp=undefined;
        var pv, pv2, sss;
        self.mouseup2 = function(e){
            self.x=self.pointStast.x;
            self.y=self.pointStast.y;
            oldParent.add(self);
            sp=undefined;
            if(dcmParam.mobile==false){
                document.removeEventListener("mousemove", self.mousemove2);
                document.removeEventListener("mouseup", self.mouseup2);
            }else{
                
                document.removeEventListener("touchend", self.mouseup2);
                document.removeEventListener("touchmove", self.mousemove2);
            }
        }

        self.mousemove2 = function(e){   
                    
            var ss=0;
            var sss=0;
            var x=0;
            var y=0;
            if(e.clientX==undefined){
                x=e.targetTouches[0].clientX
                y=e.targetTouches[0].clientY
            }else{
                x=e.clientX
                y=e.clientY
            }

            
            if(sp==undefined){
                sp={
                    x:x,
                    y:y,
                    x1:self.x,
                    y1:self.y
                };

            }
            

            self.point.x=x-sp.x;
            self.point.y=y-sp.y;
            if(self._state==3||self._state==4) self.x=sp.x1+self.point.x;
            if(self._state==2||self._state==4) self.y=sp.y1+self.point.y;

            self.fun();


        }


        


        
    }


    set state(value) {
        if(this._state!=value){
            this._state = value;
            this.loadImeg(this.link);

            if(this._state==0){
                this.value=true;
            }
            if(this._state==1||this._state==2||this._state==3||this._state==4){
                this._value=this.point;
            }
            
        }       
    }   
    get state() { return  this._state;}

    set value(v) {
        
        this._value = v;        
        if(this._state==0){             
            this.image.visible=  v;
            this.image1.visible=  !v;                           
        }
              
    }   
    get value() { return  this._value;}

}


/*

export class DButtonDrag extends DButton {
  	constructor(dCont, _x, _y, _link, _link1, _fun) {
  		super(); 
  		this.type="DButton";
  		this.dcmParam=dcmParam; 
  		this.dcmParam.add(this)
  		var self=this
  		this.x=_x||0;	
  		this.y=_y||0;
   		this._text=_text||"null";
   		this.fun=_fun;

   
  	}



  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			this.reDrag()
			//this.object.style.width=this._width+"px";
		}		
	}	
	get width() { return  this._width;}




}
*/