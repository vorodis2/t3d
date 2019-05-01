

var dContSah=0;
export class DCont {
  	
  	constructor(divORCont) {
  		//super();
  		this.type="DCont";
  		var self=this;

    	this.div= document.createElement('div');
		this.div.style.position = 'fixed';
		this.div.style.top = '0px';
		this.div.style.left = '0px';

		this.children=[];
		this._parent=undefined;
		this._scale=1;
		this._scaleBool=false;
		this._activMouse = true; 
   		this.uuid=dContSah+"_"+Math.random()
		dContSah++;
		this.htmlBody=undefined;


		this.p = new PositionD(this.dragBigXZ, 0, 0, 1);

		this.dragBigXZ=function(){
			var _mat = 'scaleX('+self._scale+') scaleY('+self._scale+')';
			self.div.style["transform"] = _mat;
			
			self.parameter.worldPosition._x=self.position._x;
			self.parameter.worldPosition._y=self.position._y;
			self.parameter.worldPosition._scale=self.position._scale;
			/*if(self._parent!=undefined){
				self.parameter.worldPosition.x=self._parent.parameter.worldPosition._x+self.position._x;
				self.parameter.worldPosition.y=self._parent.parameter.worldPosition._y+self.position._y;
			}*/
			/*if(self._scaleBool)	{
				
			}	*/	
			


			self.div.style.left = self.parameter.worldPosition.x+'px';
			self.div.style.top = self.parameter.worldPosition.y+'px';
		

			for (var i = 0; i < self.children.length; i++) {
				self.children[i].dragBigXZ()
			}
		}

    	this.parameter=new Parameter();
    	this.position = new PositionD(this.dragBigXZ, 0, 0, 1);

    	
    	this.poisk= function(obj, tip, param){

    		if(obj[tip]==param)return obj;
    		if(obj.parent!=undefined){
    			let rr=this.poisk(obj.parent, tip, param)
    			if(rr!=null)return rr;
    		}
    		return null;
    	}
		var r,r2;
    	this.testVisi= function(b){    		
    		r=this.parameter.visible;
		    if(r==true){
		    	r2=this.poisk(this,"visible",false);		    	
		    	if(r2!=null){
		    		r=false;
		    	}
		    }
		    this.div.style.visibility = r ? 'visible ' : 'hidden';
		    if(b){
		    	for (var i = 0; i < this.children.length; i++) {
		    		this.children[i].testVisi(b)
		    	}
		    }		   
    	}
    	
		if(divORCont!=undefined){//приатачиваем
			if(divORCont.parameter!=undefined){				
				divORCont.add(this);
				this.activMouse=divORCont.activMouse;										
			}else{
				divORCont.appendChild(this.div);
				this.htmlBody=divORCont;
			}			
			
		}
  	}


  	add(c){
		if(c==undefined) return null;		
		for (var i = 0; i < this.children.length; i++) {
			if(this.children[i].uuid==c){
				remove(this.children[i]);
				i=0;
			}
		}
		this.children.push(c);
		this.div.appendChild(c.div);
		c.parent=this;	
		c.testVisi();	
	}


	remove(c){		
		if(c==undefined) return null;
		
		var rez;
		for (var i = 0; i < this.children.length; i++) {
			if(this.children[i].uuid==c.uuid){
				rez = this.children.splice(i,1);
				rez[0].parent.div.removeChild(rez[0].div);
				rez[0].parent=undefined;
				return rez[0]
			}
		}
		return null;
	}





	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set scale(value) {
		if(this._scale!=value){
			this._scaleBool=true;
			this._scale=value;
			this.dragBigXZ();
		}
		
	}	get scale() {
		return  this._scale;
	}
	
	set parent(value) {		
		this._parent = value;
		this.dragBigXZ()

	}
  	get parent() { return  this._parent;}



  	
  	set alpha(value) {
		if(this.parameter.alpha!=value){
		    this.parameter.alpha = value;
		    this.div.style.opacity = this.parameter.alpha;
		}
	}
  	get alpha() { return  this.parameter.alpha;}

  	set visible(value) {
		if(this.parameter.visible!=value){
		    this.parameter.visible = value;

		    //this.div.style.visibility = value ? 'visible ' : 'hidden';
		    this.testVisi(true);

		}
	}
  	get visible() { return  this.parameter.visible;}


  	set activMouse(value) {	
  		
		if(this._activMouse!=value){
		    this._activMouse = value;
		    
		    for (var i = 0; i < this.children.length; i++) {
				this.children[i].activMouse=value;
			}		    
		}
		
	}
  	get activMouse() { return  this._activMouse;}

}

class Parameter {  	
  	constructor() {
  		
		this.worldPosition = new PositionD(this.dragBigXZ, 0, 0, 1);
		this.localPosition = new PositionD(this.dragBigXZ, 0, 0, 1);
		this.alpha=1;
		this.visible=true;   	
  	}	
}



class PositionD {  	
  	constructor(fun,_x,_y,_scale) {
  		this.fun=fun;
  		this._x=_x||0;
		this._y=_y||0;		
		this._scale=_scale||1;  	
	}

	set x(value) {
		if(this._x!=value){
		    this._x = value;
		   	if(this.fun)this.fun();
		}
	}
  	get x() { return  this._x;}


	set y(value) {
		if(this._y!=value){
		    this._y = value;
		   	if(this.fun)this.fun();
		}
	}
  	get y() { return  this._y;}


  	set scale(value) {
		if(this._scale!=value){
		    this._scale = value;
		   	if(this.fun)this.fun();
		}
	}
  	get scale() { return  this._scale;}


}


