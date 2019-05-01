

/*(function (global, factory) {
	typeof exports === 'object'/* && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.DCM = {})));  303890
}(this, (function (exports) { 'use strict';*/


import { TCont } from './TCont.js';



var tStyle
export function TStyle (div, linkFont, fun) {	
	this.type="TStyle";	
	var self=this;
	tStyle=this;
	this.div=div;
	this.fun=fun;
	this.font=undefined;

	var loader = new THREE.FontLoader();
	loader.load( linkFont, function ( response ) {
		self.font = response;
		self.fun()
	} );

	this.gBox =  new THREE.BoxBufferGeometry( 1, 1, 1 );	
	this.gCylinder =  new THREE.CylinderBufferGeometry( 1, 1, 1, 16, 1);
	this.gStrelka =  new THREE.CylinderBufferGeometry( 1, 0, 1, 16, 1);	



	this.wh=32;
	this._gage=0.5;
	this._color="#008CBA";
	this._color1="#666666";
	this._colorText="#666666";
	this._colorText1="#999999";
	this._fontSize = 16;
	this._fontFamily = "Arial, Helvetica, sans-serif";
	this._otstup = 2;

	this.c1Material=new THREE.MeshPhongMaterial({color:this._color1})
	this.cTMaterial=new THREE.MeshPhongMaterial({color:this._colorText})

	this.mobile=false;

	this.array=[]
	this.add=function(comp){
		this.array.push(comp);
	}
}

Object.defineProperties(TStyle.prototype, {
    

})




export class TLabel extends TCont {
	constructor(tCont, _x, _y, _text) {
		super(tCont); 
		this.x=_x;
		this.y=_y;

		this._size=18;
		this._width=100;
		this._gage=tStyle._gage;
		this._colorText=tStyle._colorText;			
		this.cTMaterial=tStyle.cTMaterial;
		
		this.mesh=undefined
		var geometry=undefined
		this._text=_text||"";

		this.drag=function(){

			if(geometry!=undefined){
				geometry.dispose();
			}
			geometry = new THREE.TextGeometry( this._text, {
				font: tStyle.font,
				size: this._size,
				height: 1,
				curveSegments: 4,
				bevelEnabled: true,
				bevelThickness: this._gage,
				bevelSize: 1,
				bevelOffset: 0,
				bevelSegments: 5
			} );
			geometry.computeBoundingBox();
			this._width=geometry.boundingBox.max.x-geometry.boundingBox.min.x;

			if(this.mesh==undefined){
				this.mesh=new THREE.Mesh(geometry,this.cTMaterial)
				this.object3d.add(this.mesh);
			}else{
				
				this.mesh.geometry=geometry;
			}

			
		}
		this.drag();


		this.dragMat=function(){
			if(this.boolMat==false){
				this.boolMat=true;
				this.cTMaterial=new THREE.MeshPhongMaterial({color:this._color1})
				this.mesh=this.cTMaterial;
				
			}
			var c=new THREE.Color(this._colorText)					
			this.cTMaterial.color=c;
		}
	}

	set width(value) {
		if(this._width!=value){
			this._width = value;
			
		}		
	}	
	get width() { return  this._width;}

	set gage(value) {
		if(this._gage!=value){
			this._gage = value;
			this.drag();
		}		
	}	
	get gage() { return  this._gage;}
	
	set size(value) {
		if(this._size!=value){
			this._size = value;
			this.drag();
		}		
	}	
	get size() { return  this._size;}

	

	set text(value) {
		if(this._text!=value){
			this._text = value;
			this.drag();
		}		
	}	
	get text() { return  this._text;}	

	set colorText(value) {
		if(this._colorText!=value){
			this._colorText = value;
			this.dragMat();
		}		
	}	
	get colorText() { return  this._colorText;}
}










export class TArrow extends TCont {
	constructor(tCont, _x, _y) {
		super(tCont); 
		this.x=_x;
		this.y=_y;

		this._height=10;
		this._width=100;

		this._gage=tStyle._gage;
		this._color1=tStyle._color1;		
		this._otstup=tStyle._otstup;

		this.boolMat=false;
		this.c1Material=tStyle.c1Material;
		
		this.a=[];
		this.a[0]=new THREE.Mesh(tStyle.gCylinder, this.c1Material);//центр
		this.a[1]=new THREE.Mesh(tStyle.gCylinder, this.c1Material);//право
		this.a[2]=new THREE.Mesh(tStyle.gCylinder, this.c1Material);//лево	
		this.a[3]=new THREE.Mesh(tStyle.gStrelka, this.c1Material);//право
		this.a[4]=new THREE.Mesh(tStyle.gStrelka, this.c1Material);//лево

		for (var i = 0; i < this.a.length; i++) {
			this.object3d.add(this.a[i]);
		}

		this.a[0].rotation.z=Math.PI/2;
		this.a[3].rotation.z=-Math.PI/2;
		this.a[4].rotation.z=Math.PI/2;

		
		this.label = new TLabel(this,0,0,this._width+"");
		//this.label.size=20


		this.drag=function(){
			this.a[0].scale.set(this._gage, this._width-this._gage*6,this._gage);
			this.a[0].position.set(this._width/2, this._height,0);

			this.a[1].scale.set(this._gage, this._height+this._gage,	this._gage);
			this.a[1].position.set(0, (this._height+this._gage)/2,0);

			this.a[2].scale.set(this._gage, this._height+this._gage,	this._gage);
			this.a[2].position.set(this._width, (this._height+this._gage)/2,0);

			this.a[3].scale.set(this._gage*4, this._gage*4,	this._gage);
			this.a[3].position.set(this._gage*2, this._height,0);	

			this.a[4].scale.set(this._gage*4, this._gage*4,	this._gage);
			this.a[4].position.set(this._width-this._gage*2, this._height,0);

			this.label.text=Math.round(this._width*10)/10+"";
			this.label.y=this._height+5
			this.label.x=(this._width-this.label.width)/2;
		}
		this.drag();


		this.dragMat=function(){
			if(this.boolMat==false){
				this.boolMat=true;
				this.c1Material=new THREE.MeshPhongMaterial({color:this._color1})
				for (var i = 0; i < this.a.length; i++) {
					this.a[i].material=this.c1Material;
				}
			}
			var c=new THREE.Color(this._color1)
						
			this.c1Material.color=new THREE.Color(this._color1);
			this.label.colorText=this._color1;
		}


	}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			this.drag()
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
			this.drag()
		}		
	}	
	get height() { return  this._height;}

	set gage(value) {
		if(this._gage!=value){
			this._gage = value;
			this.drag();
		}		
	}	
	get gage() { return  this._gage;}

	set color1(value) {
		if(this._color1!=value){
			this._color1 = value;
			this.dragMat()
		}		
	}	
	get color1() { return  this._color1;}
}






/*
export class DWindow extends DCont {
  	constructor(dCont, _x, _y, _text, _fun) {
  		super(); 
  		this.type="DWindow";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		
  		var self=this;
  		this.fun=_fun;	
  		this.x=_x||0;	
  		this.y=_y||0;
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=100;
  		this._color=dcmParam._color;
  		this._color1=dcmParam._color1;
  		this._wh=dcmParam.wh;



 		this._minimize = false; // спрятать низ или открыть по ум открыто	
	    this._hasMinimizeButton = false; // кнопочка для спрятать
	    this._dragBool = true;	
	    this._activMouse = true; 		

  		this._text="nullMMy";
  		this.textPlus="";

  		

  		this.button=new DButton(this,0,0," ");
  		this.button.fun_mousedown=function(){
  			if( self._dragBool != false){
  				self.startDrag()
  			}
  		}

  		this.buttonMin=new DButton(this,0,0," ",function(){
  			self.minimize=!self.minimize;
  			if(self.fun)self.fun()
  		});	
  		

  		this.panel=new DPanel(this,0,this._wh);

  		this.content=new DCont(this);
  		this.content.y=this._wh;

		this.buttonMin.width=this._wh;
		this.buttonMin.visible=this._hasMinimizeButton;
		this.buttonMin.alpha=0
		var c=dcmParam.compToHexArray(dcmParam.hexDec(this._color), -50);  		
  		this.button.color= c; 
  		this.button.object.style.textAlign = 'left';

  		var sp=undefined;	

  		this.mouseup = function(e){
  			sp=undefined;
  			if(dcmParam.mobile==false){
  				document.removeEventListener("mousemove", self.mousemove);
  				document.removeEventListener("mouseup", self.mouseup);
  			}else{
  				
  				document.removeEventListener("touchend", self.mouseup);
  				document.removeEventListener("touchmove", self.mousemove);
  			}
  			
  		}

  		this.mousemove = function(e){  			
  			if(dcmParam.mobile==false){
	  			if(sp==undefined){
	  				sp={
	  					x:e.clientX,
	  					y:e.clientY,
	  					x1:self.x,
	  					y1:self.y
	  				};
	  			}
	  			var ss=sp.x1+(e.clientX-sp.x)  			
	  			self.x=ss
	  			var ss=sp.y1+(e.clientY-sp.y)  			
	  			self.y=ss
	  		}else{
	  			if(sp==undefined){
	  				sp={
	  					x:e.targetTouches[0].clientX,
	  					y:e.targetTouches[0].clientY,
	  					x1:self.x,
	  					y1:self.y
	  				};
	  			}
	  			var ss=sp.x1+(e.targetTouches[0].clientX-sp.x)  			
	  			self.x=ss
	  			var ss=sp.y1+(e.targetTouches[0].clientY-sp.y)  			
	  			self.y=ss	  			
	  		}


  		}

  		this.startDrag = function(){  
  			
  			if(dcmParam.mobile==false){
  				document.addEventListener("mousemove", self.mousemove);
  				document.addEventListener("mouseup", self.mouseup);
  			}else{
  				
  				document.addEventListener("touchend", self.mouseup);
  				document.addEventListener("touchmove", self.mousemove);
  			}
  			
  		}


  		this._width--;
  		this._height--;

  		dcmParam.add(this);
  		this.width=this._width+1;
  		this.height=this._height+1;
  		this.text=_text||"null";
  		this.hasMinimizeButton=true
  	}




  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			this.panel.width = value;
			this.button.width = value;
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
			this.panel.height = this._height-this._wh;
		}		
	}	
	get height() { return  this._height;}

	set color(value) {
		if(this._color!=value){
			this._color = value;
			var c=dcmParam.compToHexArray(dcmParam.hexDec(this._color), -50);  		
  			this.button.color= c; 	
		}
	}	
	get color() { 		
		return  this._color;
	}

	set text(value) {		
		this._text = value;	
		this.button.text=this.textPlus+" "+value;		
	}	
	get text() { 		
		return  this._text;
	}

	set minimize(value) {
		if(this._minimize!=value){
			this._minimize = value;
			if(this._hasMinimizeButton==true){
				if(this._minimize==true){
					this.textPlus="►  ";
				}else{
					this.textPlus="▼  ";
				}
				this.text=this._text;
			}			
			this.content.visible=!this._minimize;
			this.panel.visible=!this._minimize;			
		}
	}	
	get minimize() { 		
		return  this._minimize;
	}
	set hasMinimizeButton(value) {
		if(this._hasMinimizeButton!=value){
			this._hasMinimizeButton = value;			
			this.buttonMin.visible=this._hasMinimizeButton;
			if(value==true){
				if(this._minimize==true){
					this.textPlus="►  ";
				}else{
					this.textPlus="▼  ";
				}
				
			}else{
				this.textPlus="";
			}
			this.text=this._text;
		}
	}	
	get hasMinimizeButton() { 		
		return  this._hasMinimizeButton;
	}
	set dragBool(value) {
		if(this._dragBool!=value){
			this._dragBool = value;
			if(value){
				this.button.object.style.cursor="pointer";
			}else{
				this.button.object.style.cursor="auto";
			}		
			
		}
	}	
	get dragBool() { 		
		return  this._dragBool;
	}

	set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;
		    this.button.activMouse = value;			  		        
		}		
	}
  	get activMouse() { return  this._activMouse;}
	


}





export class DColor extends DCont {
constructor(dCont,_x,_y, _color, _fun) {
  		super(); 
  		this.type="DColor";		
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		
  		var self=this;
  		this.x=_x||0;	
  		this.y=_y||0;
  		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);
   		this._color=_color||"#ffffff";
   		this.fun=_fun;

   		this._text=undefined;

   		this.fun_mousemove=undefined;

  		this._width=100;

  		this._otstup=dcmParam._otstup;
  		this._height=dcmParam.wh;
  		this._openBool=false;
		var boolOp=true


  		this.panel=new DPanel(this);
  		this.button=new DButton(this,this._otstup,this._otstup," ",function(){
  			if(boolOp==false)return;
  			if(self.openBool==false)self.openBool=true;
  			
  		});
  		this.input=new DInput(this,this._otstup,this._otstup,this._color,function(){
  			self.color=this.value;
  			if(self.fun)self.fun();
  		});

  		this.image=new DImage(this,this._otstup,this._height, dcmParam.getPolit(),function(){
  			
  			 
  		})	

  		this.label=undefined;


  		this.image.visible=false;
  		this.panel.width=this._width;
  		this.panel.height=this._height;
  		this.button.width=this.button.height=this._height-this._otstup*2;
  		this.input.width=this.input.height=this._height-this._otstup*2;
  		this.button.color=this._color;


  		this.getBigPar=function(o, p){
  			if(o.parent==undefined)return o;

  			p.x+=o.x;
  			p.y+=o.y;
  			return this.getBigPar(o.parent, p)
  		}


  		var oldParent, nP;
  		var oo={x:0,y:0}
  		var oo1={x:0,y:0}
  		this.dragMenu=function(){
  			this.image.visible=this._openBool;
  			if(this._openBool==true){
  				oo.x=this.x;
  				oo.y=this.y;
  				oo1.x=this.x;
  				oo1.y=this.y;
  				cOld=self._color;
  				this.panel.height=this._height+100+this._otstup;
  				oldParent=this.parent;
  				nP=this.getBigPar(this, oo1);

  				
  				nP.add(this);
  				this.x=oo1.x;
  				this.y=oo1.y;

  				//if(this.parent)this.parent.add(this);
  				document.addEventListener("mousedown", this.upBody)
  			}else{
  				this.panel.height=this._height;
  				oldParent.add(this);
  				this.x=oo.x;
  				this.y=oo.y;
  			}
  		}

  		this.upBody=function(e){
  			document.removeEventListener("mousedown", self.upBody)
  			self.openBool=false;
  			boolOp=false
  			setTimeout(function() {
  				boolOp=true
  			}, 100);
  		}

  		this.image.image.addEventListener("mouseout", function(){
  			self.color=cOld;  			
  		})

  		var _x,_xx, a, c, cOld
		this.image.image.addEventListener("mousemove", function(e){			
			_x=Math.round((e.layerX/self.image.width)*dcmParam.bmp.width)
			if(_x>dcmParam.bmp.width)_x=dcmParam.bmp.width;
			_y=Math.round((e.layerY/self.image.height)*dcmParam.bmp.height)
			if(_y>dcmParam.bmp.height)_y=dcmParam.bmp.height;
			a= dcmParam.bmp.getPixel(_x, _y);
			c= dcmParam.compToHexArray(a);			
			self.color=c;
			if(self.fun_mousemove){
				self.fun_mousemove()
			}
		})
		this.image.image.addEventListener("mousedown", function(e){	
			cOld=c;
			self.color=c;
			self.openBool=false;
			if(self.fun)self.fun();
		})

  		this._width--;
  		this.width=this._width+1;  		
  	}



  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;			
			this.button.x=this._width-this._otstup-this.button._width;
			this.panel.width=this._width;			
			this.image.width=this._width-this._otstup*2;
			var ww=this.button.x-this._otstup*2;
			if(this.label==undefined){
				this.input.width=this.button.x-this._otstup*2;
				this.input.x=this._otstup
			}else{
				this.input.width=(ww)/2
				this.input.x=this._otstup+(ww)/2;
			}
			
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height= value;				
		}		
	}	
	get height() { return  this._height;}
	get height() { return  this._height;}


	set color(value) {
		if(this._color!=value){
			this._color = value;
			this._value = value;
			this.input.text=this._color;
			this.button.color=this._color;
		}
	}	
	get color() { 		
		return  this._color;
	}
	set value(v) {
		if(this._color!=v){			
			this.color=v;
		}
	}	
	get value() { 		
		return  this._color;
	}

	
	set text(value) {		
		if(this._text != value){			
			this._text = value;
			if(this.label==undefined){
				this.label= new DLabel(this,this._otstup,13,this._text)
			}
			this.label.text=this._text;
			this._width--;
			this.width=this._width+1;			
		}
		
	}	
	get text() { return  this._text;}


	set openBool(value) {
		if(this._openBool != value){
			this._openBool = value;
			this.dragMenu()
		}
		
	}	
	get openBool() { return  this._openBool;}	
}











export class DButton extends DCont {
  	constructor(dCont, _x, _y, _text, _fun, _link) {
  		super(); 
  		this.type="DButton";
  		this.dcmParam=dcmParam; 
  		this.dcmParam.add(this)
  		var self=this
  		this.x=_x||0;	
  		this.y=_y||0;
   		this._text=_text||"null";
   		this.fun=_fun;

   		this.fun_mouseover=undefined;
   		this.fun_mouseout=undefined;
   		this.fun_mousedown=undefined;
   		this.funDownFile=undefined;

  		this._width=100;
  		this._height=dcmParam.wh;
  		this._color=dcmParam._color;
  		this._colorText=dcmParam._colorText;
  		this._fontSize=dcmParam._fontSize;
  		this._borderRadius=0;




   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);
   		this.object=document.createElement('input');   	
		this.object.style.position = 'fixed';
		this.object.style.top = '0px';
		this.object.style.left = '0px';
		this.object.style.background=this._color;
		this.object.style.color=this._colorText;
		this.object.style.cursor="pointer";
		this.object.style.fontSize= this._fontSize+'px';
		this.object.style.border= '1px solid ' + dcmParam.compToHexArray(dcmParam.hexDec(self._color), -20);//"none";
		this.object.style.display="inline-block";
		this.object.style.fontFamily= dcmParam._fontFamily;


		this.object.style.borderRadius=this._borderRadius+"px";
	
		this.object.type = 'button';
		this.object.value = this._text;

		this.div.appendChild(this.object);
		this.object.style.width=this._width+"px";
		this.object.style.height=this._height+"px";

		
		this.object.onclick=function(){			
			if(self.fun)self.fun();
		}
		
	  	this.object.addEventListener("mouseover", function(){
			self.object.style.background = dcmParam.compToHexArray(dcmParam.hexDec(self._color), -10);			
			if(self.fun_mouseover)self.fun_mouseover();
			
		})

		this.object.addEventListener("mouseout", function(){
			self.object.style.background = self._color;			
			if(self.fun_mouseout)self.fun_mouseout();
		})


		self.mousedown=function(){
			if (self.file != undefined) {
				self.file.value = null;
	            self.file.click();
	            if (self.funDownFile)self.funDownFile();
	            return;
	        }
			if(self.fun_mousedown)self.fun_mousedown();
		}
		


		if(dcmParam.mobile==false){
			this.object.addEventListener("mousedown", self.mousedown)
		}else{
			this.object.addEventListener("touchstart", self.mousedown)
		}



		this.image=undefined;
		this.reDrag=function(){
			this.object.style.width=this._width+"px";
			this.object.style.height=this._height+"px";
			if(this.image!=undefined){
				var s=this._height/this.image.picHeight;
				this.image.height=this.image.picHeight*s;
				this.image.width=this.image.picWidth*s;				
			}
		}



		this.file;
	    this.startFile = function (accept) {
	        if (this.file == undefined) {
	            this.file = document.createElement('input');
	            this.file.type = 'file';
	            this.file.multiple=true;
	            if (accept) this.file.accept = accept;// "image/*";
	            this.file.style.display = 'none';
	            this.file.onchange = this.onchange;
	        }
	    };
	    this.result;
	    this.files;// files
	    this.onchange = function (e) {
	        if (e.target.files.length == 0) return;// нечего не выбрали
	        self.files = e.target.files;
	       	
	        var reader = new FileReader();
	        reader.readAsDataURL(e.target.files[0]);
	        reader.onload = function (_e) {	        	
	            self.result = _e.target.result;
	            if (self.fun) self.fun(self.result);
	                      
	            	            
	        };
	    };
		

		this._link="null";
  		this.loadImeg=function(s){
  			this._link=s;
  			if(this.image==undefined){
  				this.image=new DImage(this, 0,0,null,function(){
  					self.reDrag();
  				})
  				this.image.div.style.pointerEvents="none";
  			}
  			this.image.link=this._link;
  		}	

  		if(_link!=undefined)this.loadImeg(_link)
		
		
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

	set height(value) {
		if(this._height!=value){
			this._height = value;
			this.reDrag()
			//this.object.style.height=this._height+"px";
		}		
	}	
	get height() { return  this._height;}

	set fontSize(value) {
		if(this._fontSize!=value){
			this._fontSize = value;
			this.object.style.fontSize = value+"px";
		}
	}	
	get fontSize() { 		
		return  this._fontSize;
	}

	set color(value) {
		if(this._color!=value){
			this._color = value;			
			this.object.style.background = this._color;	
			this.object.style.border= '1px solid ' + dcmParam.compToHexArray(dcmParam.hexDec(this._color), -20);
		}
	}	
	get color() { 		
		return  this._color;
	}

	set text(value) {
		if(this._text!=value){
			this._text = value;
			this.object.value = this._text;
		}
	}	
	get text() { 		
		return  this._text;
	}

	set colorText(value) {
		if(this._colorText!=value){				
			this._colorText = value;
			this.object.style.color=this._colorText;
		}
	}	
	get colorText() { 		
		return  this._colorText;
	}

	set borderRadius(value) {
		if(this._borderRadius!=value){				
			this._borderRadius = value;
			this.object.style.borderRadius=this._borderRadius+"px";
			this.object.style.webkitBorderRadius =this._borderRadius+"px";
    		this.object.style.mozBorderRadius =this._borderRadius+"px";
		}
	}	
	get borderRadius() { 		
		return  this._borderRadius;
	}

	set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;		    
		    if(value==true){
				this.alpha=1;
				this.object.style.pointerEvents=null;	
		    }else{
		    	this.alpha=0.7;		    	
		    	this.object.style.pointerEvents="none";	
		    }		        
		}		
	}
  	get activMouse() { return  this._activMouse;}


}

export class DCheckBox extends DCont {
  	constructor(dCont, _x, _y, _text, _fun) {
  		super(); 
  		this.type="DCheckBox";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		this.x=_x||0;	
  		this.y=_y||0;
  		var self=this
   		this._text=_text||"null";
   		this.fun=_fun;

   		this.fun_mouseover=undefined;
   		this.fun_mouseout=undefined;
   		this.fun_mousedown=undefined;

  		this._width=100;
  		this._height=Math.round(dcmParam.wh*2/3+4);
  		this._color=dcmParam._color;
  		this._colorText=dcmParam._colorText;
  		this._fontSize=dcmParam._fontSize;

  		this._value=false;


   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);
   		this.object = document.createElement("INPUT");
		this.object.setAttribute("type", "checkbox");	
		this.object.style.position = 'fixed';
		this.object.style.top = '-4px';
		this.object.style.left = '-4px';
		
		this.object.className="flipswitch";		

		this.div.appendChild(this.object);

		this.label=new DLabel(this, 0,0,this._text);
		this.label.x=this._height*2+4;
		this.label.y=9;
		this.label.width=this.label.x+this._text.length*10;
		
		this.label.div.style.cursor="pointer";
		this.object.style.cursor="pointer";


		this.label.div.onclick=function(){			
			self.value=!self._value;
			if(self.fun)self.fun()	
		}

		this.object.onclick=function(){				
			self.value=self.object.checked
			if(self.fun)self.fun()
		}	
  	}



  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			//this.object.style.width=this._width+"px";
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
			//this.object.style.height=this._height+"px";
		}		
	}	
	get height() { return  this._height;}

	set fontSize(value) {
		if(this._fontSize!=value){
			this._fontSize = value;
			
		}
	}	
	get fontSize() { 		
		return  this._fontSize;
	}

	set value(v) {
		if(this._value!=v){
			this._value = v;			
			this.object.checked = this._value;
		}
	}	
	get value() { 		
		return  this._value;
	}

	set text(v) {
		if(this._text!=v){
			this._text = v;			
			this.label.text = this._text;
			this.label.width=this._text.length*10;
		}
	}	
	get text() { 		
		return  this._text;
	}

	set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;		    
		    if(value==true){
				this.alpha=1;
				this.object.style.pointerEvents=null;	
		    }else{
		    	this.alpha=0.7;		    	
		    	this.object.style.pointerEvents="none";	
		    }		        
		}		
	}
  	get activMouse() { return  this._activMouse;}
}





export class DPanel extends DCont {
  	constructor(dCont, _x, _y) {
  		super(); 
  		this.type="DPanel";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		this.x=_x||0;	
  		this.y=_y||0;  		
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=100;
  		this._color1=dcmParam._color1;
  		this.div.style.background=this._color1;
  		var c=dcmParam.compToHexArray(dcmParam.hexDec(this._color1), -20);  		
  		this.div.style.border= '1px solid '+c;

  		this.div.style.width=(this._width-2)+"px";
  		this.div.style.height=(this._height-2)+"px";

  		this.content=new DCont(this);
  		this.content.y=this._wh
  	}

  	


  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			this.div.style.width=(this._width-2)+"px";
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
			this.div.style.height=(this._height-2)+"px";
		}		
	}	
	get height() { return  this._height;}

	set color1(value) {
		if(this._color1!=value){
			
			this._color1 = value;
			this.div.style.background = this._color1;
			var c=dcmParam.compToHexArray(dcmParam.hexDec(this._color1), -20);  		
  			this.div.style.border= '1px solid '+c;	
		}
	}	
	get color1() { 		
		return  this._color1;
	}

	set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;		    
		    if(value==true){
				//this.alpha=1;
				this.div.style.pointerEvents=null;	
		    }else{
		    	//this.alpha=0.7;		    	
		    	this.div.style.pointerEvents="none";	
		    }	
		    for (var i = 0; i < this.children.length; i++) {
				this.children[i].activMouse=value;
			}	        
		}

	}
  	get activMouse() { return  this._activMouse;}
}


export class DImage extends DCont {
  	constructor(dCont, _x, _y, _link, _fun) {
  		super();
  		this.type="DImage";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		var self=this;
  		this.x=_x||0;	
  		this.y=_y||0;
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=100;
  		this.picWidth = 100; // реальные размеры картинки
		this.picHeight = 100; // реальные размеры картинки
		this.funError = null;
		this._link = null;
		this.fun=_fun;

		this._s=1;

		this.div2= document.createElement('div');
		this.div2.style.position = 'fixed';
		this.div2.style.top = '0px';
		this.div2.style.left = '0px';
		this.div.appendChild(this.div2)

		this.image = new Image();
		this.div2.appendChild(this.image);

		this.image.ondragstart = function() { return false; };
  		this.loadError=function() {        
	       if (self.funError) self.funError();
	    }
  		this.loadComplit = function (e) {  			

  			self.picWidth = this.naturalWidth;
       	 	self.picHeight = this.naturalHeight;      	 	
       	 	
       	 	
       	 	self._width++;
       	 	self._height++;       	 	
       	 	self.width=self._width-1;
        	self.height=self._height-1;
        	

        	if (self.fun) self.fun();
  		}

  		this.load = function () {
  			self.image.onerror = self.loadError; 
        	self.image.crossOrigin = "";
  			this.image.onload = self.loadComplit;    
        	self.image.src = self._link;
        	self.image.crossOrigin = "";
  		}

  		

  		if(_link)this.link=_link;
  	}

  	
  	

  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			this.image.width=this._width//(100/this.picWidth);
			//this.drag()

			//this.div.style.width=this._width+"px";
			
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
			//this.drag()
			this.image.height=this._height;	
			//this.div.style.height=this._height+"px";
		}		
	}	
	get height() { return  this._height;}

	set link(value) {
		if(this._link!=value){
			this._link = value;
			this.load();
		}
	}	
	get link() { 		
		return  this._link;
	}


}



export class DLabel extends DCont {
  	constructor(dCont, _x, _y, _text) {
  		super();
  		this.type="DLabel";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		var self=this;
  		this.x=_x||0;	
  		this.y=_y||0;
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=dcmParam._fontSize;
  		this._fontSize=dcmParam._fontSize;
  		this._colorText1=dcmParam._colorText1;
  		this._bold=false;
  		this._text=_text||"";

  		this.div.textContent = this._text;
		//this.div.appendChild(this.image);
		this.div.style.width=this._width+"px";
		this.div.style.fontSize=this._fontSize+"px";
		this.div.style.color = this._colorText1;
		
		this.div.style.fontFamily= dcmParam._fontFamily;
		

  	} 

  	set bold(value) {
  		this._bold = value;
  		if(this._bold==true){
  			this.div.style.fontWeight= "bold";
  		}else{
  			this.div.style.fontWeight= "normal";
  		}
  	}	get bold() { return  this._bold;}

  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			this.div.style.width=this._width+"px";
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
					
		}		
	}	
	get height() { return  this._height;}

	set fontSize(value) {
		if(this._fontSize!=value){
			this._fontSize = value;
			this.div.style.fontSize=this._fontSize+"px";
		}
	}	
	get fontSize() { 		
		return  this._fontSize;
	}

	set colorText1(value) {
		if(this._colorText1!=value){				
			this._colorText1 = value;
			this.div.style.color=this._colorText1;
		}
	}	
	get colorText1() { 		
		return  this._colorText1;
	}

	set text(value) {
		if(this._text!=value){			
			this._text = value;
			this.div.textContent = this._text;
		}
	}	
	get text() { 		
		return  this._text;
	}

}





export class DSlider extends DCont {
  	constructor(dCont, _x, _y, fun) {
  		super();
  		this.type="DSlider";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		var self=this;
  		this.x=_x||0;	
  		this.y=_y||0;
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=dcmParam.wh/2+4;
  		this.fun=fun
  		this.funChange=undefined;

  		this._min=0;
  		this._max=100;

  		this._value = 0; // округление value
  		this._okrug = 100; // округление value
	

		this.mm=10000000000000000000000;
			
		
		this.object = document.createElement("INPUT");
		this.object.setAttribute("type", "range");	
		this.object.style.position = 'fixed';
		this.object.style.top = '-5px';
		this.object.style.left = '0px';		
		this.div.appendChild(this.object);
		this.object.max=this.mm;

		this.object.addEventListener("input",function(e){
			var vv=(e.target.value/self.mm)*(self._max-self._min)+self._min;
			vv=Math.round(vv*self._okrug)/self._okrug;
			self._value=vv;
			self.value = vv;
			if(self.fun)self.fun();			
		});
  		this.object.addEventListener("change",function(e){  			
  			var vv=(e.target.value/self.mm)*(self._max-self._min)+self._min;
			vv=Math.round(vv*self._okrug)/self._okrug;
			self._value=vv;
			self.value = vv;
  			if(self.funChange)self.funChange();
  		});

		this._width++;
  		this.width=this._width-1;  		
  	} 

  	set x(v) {this.position.x = v;}	get x() { return  this.position.x;}
	set y(v) {this.position.y = v;}	get y() { return  this.position.y;}
	set width(v) {
		if(this._width!=v){
			this._width = v;
			this.object.style.width=this._width+"px";

		}		
	}	
	get width() { return  this._width;}
		
	get height() { return  this._height;}

	
	set value(v) {		
		this._value = v;

		this.object.value=(this._value-this._min)/(this._max-this._min)*this.mm
		
				
	}	
	get value() { return  this._value;}	

	set okrug(v) {		
		this._okrug = v;				
	}	
	get okrug() { return  this._okrug;}	
	


	
	set min(v) {
		if(this._min!=v){
			this._min = v;			
			this.object.value=(this._value-this._min)/(this._max-this._min)*this.mm
		}		
	}	
	get min() { return  this._min;}	

	
	set max(v) {
		if(this._max!=v){
			this._max = v;			
			this.object.value=(this._value-this._min)/(this._max-this._min)*this.mm

		}		
	}	
	get max() { return  this._max;}	

	set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;		    
		    if(value==true){
				this.alpha=1;
				this.object.style.pointerEvents=null;	
		    }else{
		    	this.alpha=0.7;		    	
		    	this.object.style.pointerEvents="none";	
		    }		        
		}		
	}
  	get activMouse() { return  this._activMouse;}	

}



export class DSliderBig extends DCont {
  	constructor(dCont, _x, _y, fun, _text, _min, _max) {
  		super();
  		this.type="DSliderBig";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		var self=this;
  		this.x=_x||0;	
  		this.y=_y||0;
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=dcmParam.wh+12;
  		this.fun=fun
  		this.funChange=undefined;

  		this._min=-2357845745434785894;
  		this._max=3567567856787967889;
  		this._value = 0; // округление value
  		this._okrug = 100; // округление value
  		this._text=_text||"null";

  		
	
  		this.input=new DInput(this,0,0,"0", function(){  			
  			var vv= this.text-1+1;  			
  			self.value =vv;
  			if(self.fun)self.fun();
  			if(self.funChange)self.funChange();	
  		})

  		this.slider=new DSlider(this,0,0, function(){  			
  			self.value=this.value;
  			if(self.fun)self.fun();	
  		})

  		this.slider.funChange=function(){
  			if(self.funChange)self.funChange();	
  		}

  		this.slider.y=dcmParam.wh/2-2;
  		this.label=new DLabel(this,0,0, this._text);
  		this.label.fontSize=this.label.fontSize*2/3;	

  		

  		this.label1=new DLabel(this,0,0, this._min+"");
  		this.label1.fontSize=this.label.fontSize*2/3;
  		this.label1.y=37

  		this.label2=new DLabel(this,0,0, this._max+"");
  		this.label2.fontSize=this.label.fontSize*2/3;
  		this.label2.y=37


		this._width++;
  		this.width=this._width-1;  

  		this.min=_min||0;
  		this.max=_max||100;
  	} 

  	set x(v) {this.position.x = v;}	get x() { return  this.position.x;}
	set y(v) {this.position.y = v;}	get y() { return  this.position.y;}
	set width(v) {
		if(this._width!=v){
			this._width = v;				
			this.slider.width=(this._width-dcmParam._otstup)*0.7
			this.input.width=(this._width-dcmParam._otstup)*0.3
			this.input.x=this.slider.width+dcmParam._otstup;

			this.label2.x=this.input.x-4*this.label2.text.length;
		}		
	}	
	get width() { return  this._width;}
		
	get height() { return  this._height;}

	
	set value(v) {		
		this._value = v;		
		if(this._value>this._max)this._value=this._max;
		if(this._value<this._min)this._value=this._min;	
		this.input.text=""+this._value	
		this.slider.value=	this._value;
	}	
	get value() { return  this._value;}	

	set okrug(v) {		
		this._okrug = v;
		this.slider.okrug=	this._okrug;

	}	
	get okrug() { return  this._okrug;}	
	
	set min(v) {
		if(this._min!=v){
			this._min = v;	
			this.label1.text=	this._min+"";
			this.slider.min=this._min	
		}		
	}	
	get min() { return  this._min;}	

	
	set max(v) {
		if(this._max!=v){
			this._max = v;			
			this.label2.text=	this._max+"";	
			this.slider.max=this._max;
			this.label2.x=this.input.x-4*this.label2.text.length;	
		}		
	}	
	get max() { return  this._max;}	

	set text(v) {
		if(this._text!=v){
			this._text = v;			
			this.label.text=this._text
		}		
	}	
	get text() { return  this._text;}		

}





export class DInput extends DCont {
  	constructor(dCont, _x, _y, _text, _fun) {
  		super();
  		this.type="DInput";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		var self=this;

   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=dcmParam.wh;
  		this.fun=_fun;
  		this._text=_text||"null";
  		this._value = this._text;

  		var timeoutID = null;
 	
  		this._activMouse=true
  		this._okrug = 0;
  		this._color1=dcmParam._color1;
  		this._colorText1=dcmParam._colorText1;
  		this._fontFamily=dcmParam._fontFamily;
  		this._fontSize=dcmParam._fontSize;


	
  		this.object = document.createElement('input')
  		this.object.type = 'text';
  		this.object.value = this._text;
  		this.object.style.backgroundColor=this._color1
		this.object.style.color = this._colorText1;
  		this.object.style.border = '1px solid '+dcmParam.compToHexArray(dcmParam.hexDec(this._color1), -50);		
		this.object.style.fontFamily = this._fontFamily;
		this.object.style.textAlign = 'center';
		this.object.style.fontSize = this._fontSize + 'px';


		this.object.oninput = function () {			
			clearTimeout(timeoutID);
			timeoutID = setTimeout(self.funTimeOut, 1000);
		}

		this.funTimeOut = function () {
			self.dragInput(self.object.value);
		}

		this.dragInput = function (s) {
			var str=s;

			if(self._okrug!=0){
				str=str*1;
			
				if(typeof str  != "number")str=0;
				if(isNaN(str)==true)str=0;
				str=Math.round(str*(1/self._okrug))/(1/self._okrug);
			}
			self._text=str;
			self._value =str;
			self.object.value = self._text;
			if(self.fun)self.fun()
		}



		var sp;

		this.mouseup = function(e){
  			sp=undefined;
  			if(dcmParam.mobile==false){
  				document.removeEventListener("mousemove", self.mousemove);
  				document.removeEventListener("mouseup", self.mouseup);
  			}else{
  				
  				document.removeEventListener("touchend", self.mouseup);
  				document.removeEventListener("touchmove", self.mousemove);
  			}
  			
  		}
		var ss,sss
  		this.mousemove = function(e){  			
  			
  			if(dcmParam.mobile==false){
	  			if(sp==undefined){
	  				sp={
	  					x:e.clientX,
	  					y:e.clientY,
	  					value:self.value,
	  					b:false
	  				};
	  			}	  			
	  			var ss=(e.clientY-sp.y);		
	  		}else{
	  			if(sp==undefined){
	  				sp={
	  					x:e.targetTouches[0].clientX,
	  					y:e.targetTouches[0].clientY,
	  					value:self.value
	  				};
	  			}
	  			
	  			ss=(e.targetTouches[0].clientY-sp.y)   			  			
	  		}
	  		if(Math.abs(ss)>20){
	  			if(typeof sp.value  != "number")sp.value=0;
				if(isNaN(sp.value)==true)sp.value=0;
	  			sp.b=true;

	  		}
	  		
	  		if(sp.b==true){
	  			sss=sp.value+ss* self.okrug;
	  			self.dragInput(sss);
	  		}
  		}


		this.mousedown = function (e) {
			
			if(dcmParam.mobile==false){				
  				document.addEventListener("mousemove", self.mousemove);
  				document.addEventListener("mouseup", self.mouseup);
  			}else{  				
  				document.addEventListener("touchend", self.mouseup);
  				document.addEventListener("touchmove", self.mousemove);
  			}
		}


		this.setNum = function (okrug) {
			this.okrug=okrug;

			if(dcmParam.mobile==false){
				this.object.addEventListener("mousedown", self.mousedown);
  				//document.addEventListener("mousemove", self.mousemove);
  				//document.addEventListener("mouseup", self.mouseup);
  			}else{
  				this.object.addEventListener("touchstart", self.mousedown);
  				//document.addEventListener("touchend", self.mouseup);
  				//document.addEventListener("touchmove", self.mousemove);
  			}
		}


		this.object.style.width=(this._width-2)+"px";
		this.object.style.height=(this._height-4)+"px";

  		this.div.appendChild(this.object);	

  		this.x=_x||0;	
  		this.y=_y||0;	

  	} 

  	set x(v) {this.position.x = v;}	get x() { return  this.position.x;}
	set y(v) {this.position.y = v;}	get y() { return  this.position.y;}
	set width(v) {
		if(this._width!=v){
			this._width = v;
			this.object.style.width=(this._width-2)+"px";

		}		
	}	
	get width() { return  this._width;}
	
	set height(v) {
		if(this._height!=v){
			this._height = v;
			this.object.style.height=(this._height-4)+"px";

		}		
	}		
	get height() { return  this._height;}

	
	set value(v) {		
		this._value = v;
		this._text = v;	
			
		this.object.value = this._text;
				
	}	
	get value() { return  this._value;}	

	set text(v) {		
		this._text = v;		
		this._value = v;
		this.object.value = this._text;
	}	
	get text() { return  this._text;}


	set color1(v) {	
		if(this._color1 == v)return	
		this._color1 = v;		
		this.object.style.backgroundColor=this._color1
		this.object.style.border = '1px solid '+dcmParam.compToHexArray(dcmParam.hexDec(this._color1), -50);	
		
	}	
	get color1() { return  this._text;}

	set colorText1(v) {	
		if(this._colorText1 == v)return		
		this._colorText1 = v;		
		this.object.style.color = this._colorText1;
	}	
	get colorText1() { return  this._colorText1;}


	set fontFamily(v) {	
		if(this._fontFamily == v)return		
		this._fontFamily = v;		
		this.object.style.fontFamily = this._fontFamily;
		
	}	
	get fontFamily() { return  this._fontFamily;}


	set fontSize(v) {
		if(this._fontSize == v)return			
		this._fontSize = v;		
		this.object.style.fontSize = this._fontSize + 'px';
		
	}	
	get fontSize() { return  this._fontSize;}

	set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;		    
		    if(value==true){
				this.alpha=1;
				this.object.style.pointerEvents=null;	
		    }else{
		    	this.alpha=0.7;		    	
		    	this.object.style.pointerEvents="none";	
		    }		        
		}		
	}
  	get activMouse() { return  this._activMouse;}

}






export class DTextArea extends DCont {
  	constructor(dCont, _x, _y, _text, _fun) {
  		super();
  		this.type="DTextArea";
  		if(dcmParam==undefined)dcmParam=new DCM();
  		dcmParam.add(this);
  		var self=this;

  		var timeoutID=null

   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);	
  		this._width=100;
  		this._height=100;
  		this.fun=_fun;
  		this._text=_text||"null";
  		this._value = this._text;





  		this._color1=dcmParam._color1;
  		this._colorText1=dcmParam._colorText1;
  		this._fontFamily=dcmParam._fontFamily;
  		this._fontSize=dcmParam._fontSize;


	
  		this.object = document.createElement('textarea')
  		//this.object.type = 'textArea';
  		this.object.value = this._text;
  		this.object.style.backgroundColor=this._color1
		this.object.style.color = this._colorText1;
  		this.object.style.border = '1px solid '+dcmParam.compToHexArray(dcmParam.hexDec(this._color1), -50);		
		this.object.style.fontFamily = this._fontFamily;
		this.object.style.textAlign = 'center';
		this.object.style.fontSize = this._fontSize + 'px';

		this.object.style.width=(this._width-6)+"px";
		this.object.style.height=(this._height-6)+"px";
		//this.object.style.htmlElement.isOnFocus = false;


		



		this.object.oninput = function () {			
			clearTimeout(timeoutID);
			timeoutID = setTimeout(self.funTimeOut, 1000);
		}

		this.funTimeOut = function () {
			self.dragInput(self.object.value);
		}

		this.dragInput = function (s) {
			var str=s;			
			self._text=str;
			self._value =str;
			self.object.value = self._text;
			if(self.fun)self.fun()
		}




  		this.div.appendChild(this.object);

  		this.x=_x||0;	
  		this.y=_y||0;		
  	} 

  	set x(v) {this.position.x = v;}	get x() { return  this.position.x;}
	set y(v) {this.position.y = v;}	get y() { return  this.position.y;}
	
	set width(v) {
		if(this._width!=v){
			this._width = v;
			this.object.style.width=(this._width-6)+"px";

		}		
	}	
	get width() { return  this._width;}


	set height(v) {
		if(this._height!=v){
			this._height = v;
			this.object.style.height=(this._height-6)+"px";

		}		
	}	
	get height() { return  this._height;}

	
	set value(v) {		
		this._value = v;
		this._text = v;		
		this.object.value = this._text;
				
	}	
	get value() { return  this._value;}	

	set text(v) {		
		this._text = v;		
		this._value = v;
		this.object.value = this._text;
	}	
	get text() { return  this._text;}	


	set color1(v) {	
		if(this._color1 == v)return	
		this._color1 = v;		
		this.object.style.backgroundColor=this._color1
		this.object.style.border = '1px solid '+dcmParam.compToHexArray(dcmParam.hexDec(this._color1), -50);	
		
	}	
	get color1() { return  this._text;}

	set colorText1(v) {	
		if(this._colorText1 == v)return		
		this._colorText1 = v;		
		this.object.style.color = this._colorText1;
	}	
	get colorText1() { return  this._colorText1;}


	set fontFamily(v) {	
		if(this._fontFamily == v)return		
		this._fontFamily = v;		
		this.object.style.fontFamily = this._fontFamily;
		
	}	
	get fontFamily() { return  this._fontFamily;}


	set fontSize(v) {
		if(this._fontSize == v)return			
		this._fontSize = v;		
		this.object.style.fontSize = this._fontSize + 'px';
		
	}	
	get fontSize() { return  this._fontSize;}

	set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;		    
		    if(value==true){
				this.alpha=1;
				this.object.style.pointerEvents=null;	
		    }else{
		    	this.alpha=0.7;		    	
		    	this.object.style.pointerEvents="none";	
		    }		        
		}		
	}
  	get activMouse() { return  this._activMouse;}

}









function DBitmapData (w, h, rgba, fun) {
    var self = this;
    this.type = 'PLBitmapData';
   // pl102.addElement(this);

    this.fun = fun;
    this._width = w != undefined ? w : 100;
    this._height = h != undefined ? h : 100;
    this._color = rgba != undefined ? rgba : [0, 0, 0, 0];
    this._widthVisi = 100;
    this._heightVisi = 100;

    this.canvas = document.createElement('canvas'); // канвас для картинки
    this.ctx = this.canvas.getContext('2d'); // контекст картинки

    // загружаем картинку . путь к картинке или data:base64
    this.load = function (data, isClear) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            if (isClear) {
                self.clear();
            }
            self.width = img.width;
            self.height = img.height;
            self.ctx.drawImage(img, 0, 0);
            self.imgData = self.ctx.getImageData(0, 0, self.width, self.height);
            if (self.fun) self.fun();
        };
        img.src = data;
    };

    this.setCanvas = function (canvas, context2d) {
        self.canvas = canvas;
        self.ctx = context2d;
        self.imgData = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
        self.upDate();
    };

    this.setImage = function (img) {
        this._width = img.width;
        this._height = img.height;
        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.ctx.clearRect(0, 0, this._width, this._width);
        this.ctx.drawImage(img, 0, 0);
        this.imgData = this.ctx.getImageData(0, 0, img.width, img.height);
    };

    // возвращает data:image/png;base64


    this.setImage2 = function (img, s) {
        this._width = img.width;
        this._height = img.height;
        this.canvas.width = this._width*s;
        this.canvas.height = this._height*s;
        this.ctx.clearRect(0, 0, this._width, this._width);
        this.ctx.drawImage(img, 0, 0, this._width,this._height,0,0,this._width*s,this._height*s);
        this.imgData = this.ctx.getImageData(0, 0, img.width, img.height);
    };







    this.getData = function () {        
        return this.canvas.toDataURL();
    };

    this.arrRgba = [0, 0, 0, 0];
    // получить пиксель. x, y - позиция пикселя
    // возвращает масив [r,g,b,a]. при выходе за контекст [0, 0, 0, 0]
    this.getPixel = function (x, y) {
        this.arrRgba[0] = this.imgData.data[(y * this.imgData.width + x) * 4 + 0];
        this.arrRgba[1] = this.imgData.data[(y * this.imgData.width + x) * 4 + 1];
        this.arrRgba[2] = this.imgData.data[(y * this.imgData.width + x) * 4 + 2];
        this.arrRgba[3] = this.imgData.data[(y * this.imgData.width + x) * 4 + 3];

        this.arrRgba[0] = this.arrRgba[0] ? this.arrRgba[0] : 0;
        this.arrRgba[1] = this.arrRgba[1] ? this.arrRgba[1] : 0;
        this.arrRgba[2] = this.arrRgba[2] ? this.arrRgba[2] : 0;
        this.arrRgba[3] = this.arrRgba[3] ? this.arrRgba[3] : 0;
        return this.arrRgba;
    };

    this.getAlphaPixel = function (x, y) {
        return this.getPixel(x, y)[3];
    };

    // установить канал пикселя .x, y - позиция
    // rgba - масив [r,g,b,a]
    this.setPixelDin = function (i, j, rgba) {
        var imgData = this.ctx.createImageData(1, 1);
        imgData.data[0] = rgba[0];
        imgData.data[1] = rgba[1];
        imgData.data[2] = rgba[2];
        imgData.data[3] = rgba[3];
        this.ctx.putImageData(imgData, i, j);
    };

    this.setPixel = function (i, j, rgba) { // установить пиксель по координатам
        this.imgData.data[(j * this.imgData.width + i) * 4 + 0] = rgba[0];
        this.imgData.data[(j * this.imgData.width + i) * 4 + 1] = rgba[1];
        this.imgData.data[(j * this.imgData.width + i) * 4 + 2] = rgba[2];
        this.imgData.data[(j * this.imgData.width + i) * 4 + 3] = rgba[3];
    };

    this.addPixel = function (i, j, rgba) { // добавить пиксель
        this.setPixel(i, j, this.blendColors(this.getPixel(i, j), rgba));
    };

    //
    this.addImgData = function (imgData, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) { // image, sx, sy, sWidth, sHeight, dx, dy
        var context = {
            imgData: imgData,
            arrRgba: []
        };
        var countx = 0;
        var county = 0;
        for (var i = sx; i < sWidth; i++) {
            for (var j = sy; j < sHeight; j++) {
                var pixelOther = this.getPixel.call(context, i, j);

                this.addPixel(dx + countx, dy + county, pixelOther);

                county++;
            }
            county = 0;
            countx++;
        }
    };

    this.addBitmapData = function (bmp, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) { // todo dWidth
        if (arguments.length == 1) {
            sx = sy = 0;
            sWidth = bmp.imgData.width;
            sHeight = bmp.imgData.height;
            dx = dy = 0;
        } else if (arguments.length == 3) {
            dx = sx;
            dy = sy;
            sx = sy = 0;
            sWidth = bmp.imgData.width;
            sHeight = bmp.imgData.height;
        } else if (arguments.length == 9) {
            // нечего
            console.warn('todo dWidth, dHeight');
        } else {
            console.error('не правильные аргументы', arguments.length);
        }
        this.addImgData(bmp.imgData, sx, sy, sWidth, sHeight, dx, dy);
    };

    this.upDate = function () {
        this.ctx.putImageData(this.imgData, 0, 0);
    };

    this.changeWH = function (width, height) {
        var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = width != undefined ? width : this._width;
        this.canvas.height = height != undefined ? height : this._height;
        this.clear();
        this.ctx.putImageData(imgData, 0, 0);
        this.imgData = this.ctx.getImageData(0, 0, this._width, this._height);
        this.widthVisi = this._widthVisi;
        this.heightVisi = this._heightVisi;
    };

    this.setColor = function (rgba) {
        if (!rgba) rgba = this._color;
        this.ctx.fillStyle = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] / 255 + ')';
    };

    this.setPixelTempData = function (i, j, rgba) {
        this.tempData.data[(j * this.tempWidth + i) * 4 + 0] = rgba[0];
        this.tempData.data[(j * this.tempWidth + i) * 4 + 1] = rgba[1];
        this.tempData.data[(j * this.tempWidth + i) * 4 + 2] = rgba[2];
        this.tempData.data[(j * this.tempWidth + i) * 4 + 3] = rgba[3];
    };

    this.tempData = [];
    this.tempWidth = 100;
    var sw = 1,
        sh = 1,
        pw = 0,
        ph = 0;
    var vw, vh;
    this.compress = function (w, h, funCompress) {
        w = Math.round(w);
        h = Math.round(h);
        if (w > this._width) {
            w = this._width;
        }
        if (h > this._height) {
            h = this._height;
        }
        sw = this._width / w;
        sh = this._height / h;

        pw = sw % 1;
        ph = sh % 1;
        sw -= pw;
        sh -= ph;

        this.tempWidth = w;
        this.tempData = this.ctx.createImageData(w, h);

        vw = (this._width + 2) / w;
        vh = (this._height + 2) / h;
        for (var i = 0, ii = 0; i < w; i++) {
            for (var j = 0, jj = 0; j < h; j++) {
                this.setPixelTempData(i, j, this.getPixelMerge(Math.round(i * vw), Math.round(j * vh)));
            }
        }

        this.width = w;
        this.height = h;
        this.imgData = this.tempData;
        this.upDate();
        if (funCompress) funCompress(this);
    };

    this.getPixelMerge = function (i, j) {
        var basePixel = this.getPixel(i, j);
        this.tempPixel[0] = basePixel[0];
        this.tempPixel[1] = basePixel[1];
        this.tempPixel[2] = basePixel[2];
        this.tempPixel[3] = basePixel[3];
        var countPix = 1; // количество взятых пикселей
        var pix;
        var ss = 1;
        for (var ii = 0; ii < sw; ii++) {
            if (i + (ii + 1) < this._width) { // не вышли за пределы , в право берем пиксель для мержа
                pix = this.getPixel(i + (ii + 1), j);
                this.tempPixel[0] += (pix[0] * ss);
                this.tempPixel[1] += (pix[1] * ss);
                this.tempPixel[2] += (pix[2] * ss);
                this.tempPixel[3] += (pix[3] * ss);
                countPix++;
            } else { // иначе добавляем базовый пиксель
                this.tempPixel[0] += basePixel[0] * ss;
                this.tempPixel[1] += basePixel[1] * ss;
                this.tempPixel[2] += basePixel[2] * ss;
                this.tempPixel[3] += basePixel[3] * ss;
                countPix++;
            }
            if (i - (ii + 1) > 0) { // не вышли за пределы , в лево берем пиксель для мержа
                pix = this.getPixel(i - (ii + 1), j);
                this.tempPixel[0] += pix[0] * ss;
                this.tempPixel[1] += pix[1] * ss;
                this.tempPixel[2] += pix[2] * ss;
                this.tempPixel[3] += pix[3] * ss;
                countPix++;
            } else { // иначе добавляем базовый пиксель
                this.tempPixel[0] += basePixel[0] * ss;
                this.tempPixel[1] += basePixel[1] * ss;
                this.tempPixel[2] += basePixel[2] * ss;
                this.tempPixel[3] += basePixel[3] * ss;
                countPix++;
            }
        }
        ss = 1;
        for (var jj = 0; jj < sh; jj++) {
            if (j + (jj + 1) < this._height) { // не вышли за пределы , в низ берем пиксель для мержа
                pix = this.getPixel(i, j + (jj + 1));
                this.tempPixel[0] += pix[0] * ss;
                this.tempPixel[1] += pix[1] * ss;
                this.tempPixel[2] += pix[2] * ss;
                this.tempPixel[3] += pix[3] * ss;
                countPix++;
            } else { // иначе добавляем базовый пиксель
                this.tempPixel[0] += basePixel[0] * ss;
                this.tempPixel[1] += basePixel[1] * ss;
                this.tempPixel[2] += basePixel[2] * ss;
                this.tempPixel[3] += basePixel[3] * ss;
                countPix++;
            }
            if (j - (jj + 1) > 0) { // не вышли за пределы , в вверх берем пиксель для мержа
                pix = this.getPixel(i, j - (jj + 1));
                this.tempPixel[0] += pix[0] * ss;
                this.tempPixel[1] += pix[1] * ss;
                this.tempPixel[2] += pix[2] * ss;
                this.tempPixel[3] += pix[3] * ss;
                countPix++;
            } else { // иначе добавляем базовый пиксель
                this.tempPixel[0] += basePixel[0] * ss;
                this.tempPixel[1] += basePixel[1] * ss;
                this.tempPixel[2] += basePixel[2] * ss;
                this.tempPixel[3] += basePixel[3] * ss;
                countPix++;
            }
        }
        this.tempPixel[0] = this.tempPixel[0] / (countPix);
        this.tempPixel[1] = this.tempPixel[1] / (countPix);
        this.tempPixel[2] = this.tempPixel[2] / (countPix);
        this.tempPixel[3] = this.tempPixel[3] / (countPix);
        return this.tempPixel;
    };

    this.tempPixel = [];

    this.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.imgData = this.ctx.getImageData(0, 0, 1, 1);
    };

    this.width = this._width;
    this.height = this._height;
    this.setColor();
    this.ctx.fillRect(0, 0, this._width, this._height);
    this.imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    this.changeWH();

    function blendColors () { // миксование rgba цветов blendColors([69,109,160,255],[61,47,82,204])//return[63,59,98,255]
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        var base = [0, 0, 0, 0];
        var mix;
        var added;
        var alpha;
        var alphaBase;
        while (added = args.shift()) {
            if (typeof added[3] === 'undefined') {
                added[3] = 255;
            }

            alpha = added[3] / 255;
            alphaBase = base[3] / 255;

            if (alphaBase && alpha) {
                mix = [0, 0, 0, 0];
                mix[3] = 1 - (1 - alpha) * (1 - alphaBase); // alpha
                mix[0] = Math.round((added[0] * alpha / mix[3]) + (base[0] * alphaBase * (1 - alpha) / mix[3])); // red
                mix[1] = Math.round((added[1] * alpha / mix[3]) + (base[1] * alphaBase * (1 - alpha) / mix[3])); // green
                mix[2] = Math.round((added[2] * alpha / mix[3]) + (base[2] * alphaBase * (1 - alpha) / mix[3])); // blue
            } else if (alpha) {
                mix = added;
            } else {
                mix = base;
            }
            base = mix;
        }
        mix[3] = mix[3] * 255;// возвращяем обратно
        return mix;
    }
    this.blendColors = blendColors;
}
Object.defineProperties(DBitmapData.prototype, {
    width: {
        set: function (value) {
            var old = this._width;
            // if (this._width == value) return;
            this._width = value;
            this.changeWH();
            if (old < this._width) {
                this.setColor();
                this.ctx.fillRect(old, 0, this._width, this._height);
            }
            this.widthVisi = this._widthVisi;

        },
        get: function () {
            return this._width;
        }
    },
    height: {
        set: function (value) {
            var old = this._height;
            // if (this._height == value) return;
            this._height = value;
            this.changeWH();
            if (old < this._height) {
                this.setColor();
                this.ctx.fillRect(0, old, this._width, this._height);
            }
            this.heightVisi = this._heightVisi;

        },
        get: function () {
            return this._height;
        }
    },
    widthVisi: {
        set: function (value) {
            this._widthVisi = value;
        },
        get: function () {

            return this._widthVisi;
        }
    },
    heightVisi: {
        set: function (value) {
            this._heightVisi = value;

        },
        get: function () {
            return this._heightVisi;
        }
    }
});



export class DScrollBarH extends DCont {
  	constructor(dCont, _x, _y, _fun) {
  	super(); 
  		this.type="DScrollBarH";
  		this.dcmParam=dcmParam; 
  		this.dcmParam.add(this)
  		var self=this
  		this.x=_x||0;	
  		this.y=_y||0;
   		this._text="null";
   		this.fun=_fun;

   		this.fun_mouseover=undefined;
   		this.fun_mouseout=undefined;
   		this.fun_mousedown=undefined;

  		this._width=100;
  		this._height=dcmParam.wh;
  		this._color=dcmParam._color;
  		this._colorText=dcmParam._colorText;
  		this._fontSize=dcmParam._fontSize;

  		this._widthContent = 200; // высота контента
    	this._offsetHit = 0;
    	this._value=0;
    	this._otstup=0;
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);




   		this.panel = new DPanel(this, 0, 0);
   		this.panelA = new DPanel(this, this._offsetHit, this._offsetHit);
   		this.panelA.alpha=0;
   		this.but = new DButton(this, 0, 0," ");
   		this.but.fun_mousedown=function(){  			
  			self.onDragStart()
  		}   		

   		var sp=undefined;
   		var pv, pv2, sss;
   		this.mouseup = function(e){
  			sp=undefined;

  			if(dcmParam.mobile==false){
  				document.removeEventListener("mousemove", self.mousemove);
  				document.removeEventListener("mouseup", self.mouseup);
  			}else{
  				
  				document.removeEventListener("touchend", self.mouseup);
  				document.removeEventListener("touchmove", self.mousemove);
  			}
  		}

  		this.mousemove = function(e){  			
  			var ss=0;
  			var sss=0;
  			var xz=0;
  			if(e.clientX==undefined){
  				xz=e.targetTouches[0].clientX
  			}else{
  				xz=e.clientX
  			}

  			
  			if(sp==undefined){
  				sp={
  					x:xz,
  					x1:self.x,
  					y1:self.y
  				};
  			}
  			ss=(xz-sp.x)  					
  			sss=ss+pv2;
	  		

	  	
  		


  			if(self.but.width+sss>self._width)sss=self._width-self.but.width;
  			if(sss<0)sss=0;
  			self.value=sss/(self._width-self.but.width)*100;
  			if(self.fun)self.fun()
  			
  		}



   		this.onDragStart = function () {
        	//self.downLocal = self.toLocal(pl102.global);
        	pv = self.value;
        	pv2 = this.but.x;
        	if(dcmParam.mobile==false){
  				document.addEventListener("mousemove", self.mousemove);
  				document.addEventListener("mouseup", self.mouseup);
  			}else{  				
  				document.addEventListener("touchend", self.mouseup);
  				document.addEventListener("touchmove", self.mousemove);
  			}
        	//document.addEventListener("mousemove", self.mousemove);
  			//document.addEventListener("mouseup", self.mouseup);
        }

        this.panelA.div.addEventListener("mousedown", function(e){			
			sss=e.offsetX-self.but.width/2
			if(self.but.width+sss>self._width)sss=self._width-self.but.width;
  			if(sss<0)sss=0;
  			self.value=sss/(self._width-self.but.width)*100;
  			self.onDragStart()
  			if(self.fun)self.fun()
		})



   		this._width--;
   		this.width=this._width+1;
   		this._height--;
   		this.height=this._height+1;
  	}




  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			if (this._width + this._otstup * 2 >= this._widthContent) this.but.width = this._width - this._otstup * 2;
            else this.but.width = this._width * this._width / this._widthContent;
            if (this.but.width < this._wh) this.but.width = this._wh;

            this.panel.width = this._width;
            this.panelA.width = this._width;

            var pv = this.value;
            this._value = -1;
            this.value = pv;


					
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
			this.panel.height = value;
			this.but.height = value;
			this.panelA.height =this._height+this._offsetHit*2;
         
		}		
	}	
	get height() { return  this._height;}


	set widthContent(value) {
		if(this._widthContent!=value){
			
            this._widthContent = value;
            var vv = this._width - this._otstup * 2;
            if (vv >= this._widthContent) {
                this.but.width = vv;// -this._otstup*2;
            } else {
                var s = vv * vv / this._widthContent;
                if (s < this._wh) s = this._wh; // ставим чтоб меньше кнопка не была кнопка
                var d = s - this.but.width;
                // кнопка только по панели
                if (this.but.x + this.but.width + d > vv ) this.but.x -= d;
                else if (this.but.x < 0) this.but.x = 0;
                this.but.width = s;
            }

            var pv = this.value;
            this._value = -1;
            this.value = pv;
		}		
	}	
	get widthContent() { return  this._widthContent;}

	set value(v) {
		if(this._value!=v){
			this._value = v;
           
            if (isNaN(parseFloat(this._value))) this._value = 0;
            if (this._value < 0) this._value = 0;
            if (this._value > 100) this._value = 100;
            this.but.x = this._otstup + ((this._width - this._otstup * 2) - this.but.width) * (this._value / 100);
            this._scrolValue = (this._widthContent - this._width) * this._value / 100;
            if (this._scrolValue < 0) this._scrolValue = 0;		
		}
	}	
	get value() { 		
		return  this._value;
	}

	set offsetHit(v) {
		if(this._offsetHit!=v){
			this._offsetHit = v;
			this.panelA.height =this._height+this._offsetHit*2;
          	this.panelA.y=-this._offsetHit;	
		}
	}	
	get offsetHit() { 		
		return  this._offsetHit;
	}
}




export class DScrollBarV extends DCont {
  	constructor(dCont, _x, _y, _fun) {
  		super(); 
  		this.type="DScrollBarV";
  		this.dcmParam=dcmParam; 
  		this.dcmParam.add(this)
  		var self=this
  		this.x=_x||0;	
  		this.y=_y||0;
   		this._text="null";
   		this.fun=_fun;

   		this.fun_mouseover=undefined;
   		this.fun_mouseout=undefined;
   		this.fun_mousedown=undefined;

  		this._width=dcmParam.wh;
  		this._height=100;
  		this._color=dcmParam._color;
  		this._colorText=dcmParam._colorText;
  		this._fontSize=dcmParam._fontSize;

  		this._heightContent = 200; // высота контента
    	this._offsetHit = 0;
    	this._value=0;
    	this._otstup=0;
   		if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);




   		this.panel = new DPanel(this, 0, 0);
   		this.panelA = new DPanel(this, this._offsetHit, this._offsetHit);
   		this.panelA.alpha=0;
   		this.but = new DButton(this, 0, 0," ");

   		this.but.object.style.transform       = 'rotate('+90+'deg)'; 

   		this.but.fun_mousedown=function(){  			
  			self.onDragStart()
  		}   		

   		var sp=undefined;
   		var pv, pv2, sss;
   		this.mouseup = function(e){
  			sp=undefined;
  			if(dcmParam.mobile==false){
  				document.removeEventListener("mousemove", self.mousemove);
  				document.removeEventListener("mouseup", self.mouseup);
  			}else{  				
  				document.removeEventListener("touchend", self.mouseup);
  				document.removeEventListener("touchmove", self.mousemove);
  			}
  		}

  		this.mousemove = function(e){  			
  			var ss=0;
  			var sss=0;
  			var xz=0;
  			if(e.clientY==undefined){
  				xz=e.targetTouches[0].clientY
  			}else{
  				xz=e.clientY
  			}



  			if(sp==undefined){
  				sp={
  					x:e.clientX,
  					y:xz,
  					x1:self.x,
  					y1:self.y
  				};
  			}  					
  			var ss=(xz-sp.y)   			
  			sss=ss+pv2;
  			if(self.but.width+sss>self._height)sss=self._height-self.but.width;
  			if(sss<0)sss=0;

  			self.value=sss/(self._height-self.but.width)*100;
  			

  			if(self.fun)self.fun()
  			
  		}



   		this.onDragStart = function () {
        	//self.downLocal = self.toLocal(pl102.global);
        	pv = self.value;
        	pv2 = this.but.y;
        	if(dcmParam.mobile==false){
  				document.addEventListener("mousemove", self.mousemove);
  				document.addEventListener("mouseup", self.mouseup);
  			}else{  				
  				document.addEventListener("touchend", self.mouseup);
  				document.addEventListener("touchmove", self.mousemove);
  			}
        }

        this.panelA.div.addEventListener("mousedown", function(e){			
			sss=e.offsetY-self.but.width/2
			if(self.but.width+sss>self._height)sss=self._height-self.but.width;
  			if(sss<0)sss=0;
  			self.value=sss/(self._height-self.but.width)*100;
  			self.onDragStart()
  			if(self.fun)self.fun()
		})



   		this._width--;
   		this.width=this._width+1;
   		this._height--;
   		this.height=this._height+1;
  	}




  	set x(value) {this.position.x = value;}	get x() { return  this.position.x;}
	set y(value) {this.position.y = value;}	get y() { return  this.position.y;}
	set width(value) {
		if(this._width!=value){
			this._width = value;
			this.panel.width = value;
			this.but.height = value;
			this.panelA.width =this._width+this._offsetHit*2;	
			this.but.object.style.left=-(this.but.width/2-this._width/2)+"px"
			this.but.object.style.top=(this.but.width/2-this._width/2)+"px"	
		}		
	}	
	get width() { return  this._width;}

	set height(value) {
		if(this._height!=value){
			this._height = value;
            if (this._height + this._otstup * 2 >= this._heightContent) this.but.width = this._height - this._otstup * 2;
            else this.but.width = this._height * this._height / this._heightContent;
            if (this.but.width < this._wh) this.but.width = this._wh;
            // this.button.height = this._height;
            this.panel.height = this._height;
            this.panelA.height = this._height;
            var pv = this._value;
            this.value = -1;
            this.value = pv;




            this.but.object.style.left=-(this.but.width/2-this._width/2)+"px"
            this.but.object.style.top=(this.but.width/2-this._width/2)+"px"	
		}		
	}	
	get height() { return  this._height;}


	set heightContent(value) {
		if(this._heightContent!=value){
			this._heightContent = value;
            var vv = this._height - this._otstup * 2;
            if (vv >= this._heightContent) {
                this.but.width = vv;// -this._otstup*2;
            } else {
                var s = vv * vv / this._heightContent;
                if (s < this._wh) s = this._wh; // ставим чтоб меньше кнопка не была кнопка
                var d = s - this.but.width;
                // кнопка только по панели
                if (this.but.y + this.but.width + d > vv) this.but.y -= d;
                else if (this.but.y < 0) this.but.y = 0;
                this.but.width = s;
            }
            // this.value = this._value;
            var pv = this._value;
            this.value = -1;
            this.value = pv;
            this.but.object.style.left=-(this.but.width/2-this._width/2)+"px"
            this.but.object.style.top=(this.but.width/2-this._width/2)+"px"	
		}		
	}	
	get heightContent() { return  this._heightContent;}

	set value(v) {
		if(this._value!=v){
			this._value = v;
            if (isNaN(parseFloat(this._value))) this._value = 0;
            if (this._value < 0) this._value = 0;
            if (this._value > 100) this._value = 100;
            this.but.y = this._otstup + ((this._height - this._otstup * 2) - this.but.width) * (this._value / 100);
            this._scrolValue = (this._heightContent - this._height) * this._value / 100;
            if (this._scrolValue < 0) this._scrolValue = 0;			
		}
	}	
	get value() { 		
		return  this._value;
	}

	set offsetHit(v) {
		if(this._offsetHit!=v){
			this._offsetHit = v;
			this.panelA.width =this._width+this._offsetHit*2;
          	this.panelA.x=-this._offsetHit;	
		}
	}	
	get offsetHit() { 		
		return  this._offsetHit;
	}


}

*/

