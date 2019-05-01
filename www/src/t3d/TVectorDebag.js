


export class TVectorDebag {
	constructor(tv) {
		var self=this;
		this.tv=tv;
		
		
		this.otstup=1;

		var rendererPIXI
		var content2d
		
		this.content=new PIXI.Container();			
		
		this.dCont= new DCont(document.body);	



		this.graphics = new PIXI.Graphics();
		this.content.addChild(this.graphics);	

		this.geometriXZ=new GeometriXZ();
		var mat=new THREE.MeshPhongMaterial({color:0xffffff})					
		this.mesh=new THREE.Mesh(this.geometriXZ,mat);
		var o3d=new THREE.Object3D()
		o3d.add(this.mesh)
		o3d.rotation.x=Math.PI;


		scene.add(o3d)


		
		for (var i = 0; i < 6; i++) {
			var b=new DButton(this.dCont,204+34*i,2," ",function(){				
				self.setLink("resources/pic/"+this.idArr+".png");
			},"resources/pic/"+i+".png");
			b.idArr=i;
			b.width=b.height;
		}

		var b=new DButton(this.dCont,2,2,"Load PNG/alpha ",function(b){
			self.setLink(b)
		})		
		b.width=200
		b.startFile('.png');


		var label=new DLabel(this.dCont,450,10)
		label.width=222
		var pObject=new DParamObject(this.dCont,2,130,function(){});	
		pObject.addObject(tv);

		this.setLink=function(link){
			tv.setLink(link,function(){
				//self.upDateTV()
				//self.draw()
				self.drawWH(tv.bitmapData.width*self.otstup,tv.bitmapData.height*self.otstup)
			})
		}
		tv.funUp=function(){
			self.draw();
		}



		this.panel=new DPanel(this.dCont,204,36);

		this.dC=new DCont(this.dCont)
		this.dC.x=204
		this.dC.y=36
		this.dC.div.appendChild(tv._canvas);



		this.dB=function(b){
			self.chak.value=b;
			if(b==true){
				self.otstup=3
			}else{
				self.otstup=1
			}

			self.draw();
			self.drawWH(tv.bitmapData.width*self.otstup,tv.bitmapData.height*self.otstup)
		}

		this.chak=new DCheckBox(this.dCont,2,40,"bigDebag",function(){
			self.dB(this.value)
		});
		this.chak.value=false;


		var boolDebag=true
		this.chak1=new DCheckBox(this.dCont,2,70,"debag",function(){
			boolDebag=this.value
			self.draw();
		});
		this.chak1.value=boolDebag;


		this.chak2=new DCheckBox(this.dCont,2,100,"mouseWipeOff",function(){
			
		});	

		this.textArea=new DTextArea(this.dCont,2,352,"mouseWipeOff",function(){
			
		});	
		this.textArea.width=200;
		this.textArea.height=600;
		this.textArea.fontSize=10;

		this.lll=new DLabel(this.dCont,2,332,"arrayTriangle");	
		this.lll.width=200;


		var ot2=2;
		var otstup
		this.draw=function(){

			label.text="timeLogic: "+Math.round(tv.time*1000)/1000+" s.";

			this.graphics.clear();

			if(boolDebag==false){
				rendererPIXI.render(content2d);	
				return
			}
				
			var a=tv.bloks.array;
			
			otstup=this.otstup;
			ot2=0//otstup*2
			var x,y;
			this.panel.width=tv.bitmapData.width;
			this.panel.height=tv.bitmapData.height;
			
			//this.dC.scale=otstup;

			this.graphics.lineStyle(0.2, 0, 0.2);			
			var px
			if(self.otstup==3)
			for (var i = 0; i < a.length; i++) {				
				x=a[i].i*otstup;
				y=a[i].j*otstup;
				if(a[i].i!=0){				
					x=(a[i].i)*otstup+ot2 *	Math.round(a[i].i/tv.wh)
				}
				if(a[i].j!=0)y=(a[i].j)*otstup+ot2*Math.round(a[i].j/tv.wh)
				this.graphics.lineStyle(0.2, 0, 0.2);		
				
				if(a[i].status==0)this.graphics.beginFill(0xff0000, 0.2);
				if(a[i].status==1)this.graphics.beginFill(0x00ff00, 0.2);				
				if(a[i].status==2)this.graphics.beginFill(0x0000ff, 0.2);

				this.graphics.drawRect(x, y, a[i].w*otstup, a[i].h*otstup);
				
				//if(a[i].status==1){					
					for (var ii= 0; ii < a[i].array.length; ii++) {
						for (var jj= 0; jj < a[i].array[ii].length; jj++) {
							this.drawMin(a[i].i,a[i].j, a[i].array[ii][jj], otstup)
							
						}						
					}
				this.drawLine(a[i].i,a[i].j, a[i], otstup);
				//}
			}
			for (var i = 0; i < tv.points.array.length; i++) {	
				this.drawPoint(tv.points.array[i],otstup)
			}
			clearTimeout(timerId)
			sssss=0;
			for (var i = 0; i < tv.points.arrayTriangle.length; i++) {	
				//this.drawTriangle(tv.points.arrayTriangle[i],0)
				this.drawTriangleCC(tv.points.arrayTriangle[i])
			}
			this.geometriXZ.start(tv.points.arrayTriangle)
			this.mesh.position.y=-tv.bitmapData.height/2;
			this.mesh.position.x=-tv.bitmapData.width/2;
			//this.mesh.material=new THREE.MeshPhongMaterial({color:0xff0000,wireframe:true})	
			rendererPIXI.render(content2d);

			this.textArea.text=	JSON.stringify(tv.points.arrayTriangle)	
			this.lll.text="arrayTriangle : "+sssss				
		}
		var sssss
		var timerId
		this.drawTriangle=function(a,ii){
			if(ii>=a.length)return;
			trace(ii)
			self.graphics.clear()
			self.graphics.lineStyle(0.5, 0x000000, 0);			
			for (var i = 0; i < ii+6; i+=6) {
				self.graphics.beginFill(0xffffff*Math.random(), 0.6);
				self.graphics.moveTo(a[i+0]*otstup		,a[i+1]*otstup)	
				self.graphics.lineTo(a[i+2]*otstup		,a[i+3]*otstup)
				self.graphics.lineTo(a[i+4]*otstup		,a[i+5]*otstup)
				self.graphics.lineTo(a[i+0]*otstup		,a[i+1]*otstup)
			}

			rendererPIXI.render(content2d);	
			timerId=setTimeout(function() {self.drawTriangle(a, ii+6)}, 300);
		}

		this.drawTriangleCC=function(a){			
			self.graphics.lineStyle(0.5, 0x000000, 0);			
			for (var i = 0; i < a.length; i+=6) {
				self.graphics.beginFill(0xffffff*Math.random(), 0.6);
				self.graphics.moveTo(a[i+0]*otstup		,a[i+1]*otstup)	
				self.graphics.lineTo(a[i+2]*otstup		,a[i+3]*otstup)
				self.graphics.lineTo(a[i+4]*otstup		,a[i+5]*otstup)
				self.graphics.lineTo(a[i+0]*otstup		,a[i+1]*otstup)
				sssss++;
			}
			
		}


		this.drawPoint=function(a,otstup){	
			this.graphics.lineStyle(2, 0xff0000, 0.7);	
			this.graphics.beginFill(0x000000, 0);
			this.xxx=0//120
			this.graphics.moveTo(a[0].x*otstup+this.xxx		,a[0].y*otstup+this.xxx)
			for (var i = 1; i < a.length; i++) {
				this.graphics.lineTo(a[i].x*otstup+this.xxx		,a[i].y*otstup+this.xxx)
			}

		}


		this.drawLine=function(i, j, m, otstup){		
			var ox=0
			if(i!=0){
				ox=(i)*otstup+ot2 *	Math.round(i/tv.wh)
			}
			var oy=0
			if(j!=0){
				oy=(j)*otstup+ot2*Math.round(j/tv.wh)
			}
			this.graphics.lineStyle(1, 0, 0.5);	
			this.graphics.beginFill(0x000000, 0);
			
			for (var i = 0; i < m.attIJBig.length; i++) {				
				for (var j = 0; j < m.attIJBig[i].length-2; j+=2) {
					this.graphics.moveTo(m.attIJBig[i][j]*otstup+ox		,m.attIJBig[i][j+1]*otstup+oy)
					this.graphics.lineTo(m.attIJBig[i][j+2]*otstup+ox		,m.attIJBig[i][j+3]*otstup+oy)
				}
			}	

		}



		this.drawMin=function(i, j, m, otstup){			
			
			var ox=0
			if(i!=0){
				ox=ot2*Math.round(i/tv.wh)
			}
			var oy=0
			if(j!=0){
				oy=ot2*Math.round(j/tv.wh)
			}

			if(m.suma!=0){
				this.graphics.beginFill(0x000000, 0.02);
				this.graphics.drawRect(m.i*otstup+ox, m.j*otstup+oy, otstup, otstup);
				if(m.opor==true){
					this.graphics.beginFill(0xff0000, 0.1);
					this.graphics.drawRect(m.i*otstup+ox, m.j*otstup+oy, otstup, otstup);
				}
				if(m.proshli!=-1){
					this.graphics.beginFill(0x00ff00,0.7);
					if(m.proshli==5)this.graphics.beginFill(0xff0000,0.7);
					if(m.proshli==2)this.graphics.beginFill(0x0000ff,0.2);
					if(m.proshli==1)this.graphics.beginFill(0x0000ff,0.1);
					this.graphics.drawRect(m.i*otstup+ox, m.j*otstup+oy, otstup, otstup);

					
				}

			}
		}

		self.setLink("resources/pic/0.png");


		this.drawWH=function(w,h){
			
			var precresol = rendererPIXI.resolution;// запоминаем предыдущее разрешение пикселей рендера
			rendererPIXI.view.style.width = w + 'px';
			rendererPIXI.view.style.height = h + 'px';

			rendererPIXI.resolution = 1;// перед изменение размера в дефолт
			rendererPIXI.resize(w, h);
			rendererPIXI.resolution = precresol;// ставим обратно разрешение
			rendererPIXI.render(content2d);	
		}		

		

		function initPIXI () {
			rendererPIXI = new PIXI.autoDetectRenderer(300, 300, {antialias: true, transparent: true, preserveDrawingBuffer: true });
			rendererPIXI.view.style.position = 'fixed';
			rendererPIXI.view.style.left ='204px';
			rendererPIXI.view.style.top ='36px';
			self.dCont.div.appendChild(rendererPIXI.view);
			content2d = new PIXI.Container();
			content2d.addChild(self.content)
		}
		initPIXI()

		this.drav=function(_i,_j){
			var ss=10;
			var xx,yy;

			var rgba=[0,0,0,255]
			if(self.chak2.value==true) rgba=[0,0,0,0]
			for (var i = 0; i < ss; i++) {
				xx=Math.round(i-ss/2+_i)
				if(xx>=0 && xx<tv.bitmapData.width)
				for (var j = 0; j < ss; j++) {
					yy=Math.round(j-ss/2+_j);
					if(yy>=0 && yy<tv.bitmapData.height){
					
						tv.bitmapData.setPixel(xx,yy,rgba)
					}
				}					
			}
			tv.bitmapData.upDate(); 

		}

		this.move=function(e){
			self.drav(e.offsetX,e.offsetY);
		}
		this.up=function(e){
			rendererPIXI.view.removeEventListener("mousemove",self.move)
			document.removeEventListener("mouseup",self.up)	
			tv.upDate()
		}	

		rendererPIXI.view.addEventListener("mousedown", function(e){
			self.drav(e.offsetX,e.offsetY);
			rendererPIXI.view.addEventListener("mousemove",self.move)
			document.addEventListener("mouseup",self.up)	
		})
	}
}



function GeometriXZ() {
    THREE.BufferGeometry.call(this);
    this.type = 'GeometriXZ';
    var self = this;
    this.arrPosition=[]
    var arrPositionAttribut
    this.start = function (ar) {


    	this.arrPosition=[];
    	for (var i = 0; i < ar.length; i++) {
    		for (var j = 0; j < ar[i].length; j+=6) {
    			/*this.arrPosition.push(ar[i][j],ar[i][j+1],0)
    			this.arrPosition.push(ar[i][j+2],ar[i][j+1+2],0)
    			this.arrPosition.push(ar[i][j+4],ar[i][j+1+4],0)



    			
    			
    			this.arrPosition.push(ar[i][j+4],ar[i][j+1+4],0)
				this.arrPosition.push(ar[i][j+2],ar[i][j+1+2],0)
				this.arrPosition.push(ar[i][j],ar[i][j+1],0)*/

				this.srerrrr(ar[i][j+4],ar[i][j+1+4],ar[i][j+2],ar[i][j+1+2])
				this.srerrrr(ar[i][j+2],ar[i][j+1+2],ar[i][j],ar[i][j+1])
				this.srerrrr(ar[i][j],ar[i][j+1],ar[i][j+4],ar[i][j+1+4])
    		}
    		
    	}


    	this.update()
    }

    this.srerrrr=function(x,y,x1,y1){
    	var s=0.5

    	/*this.arrPosition.push(x+s,y+s,0)
    	this.arrPosition.push(x+s,y+s,0)
    	this.arrPosition.push(x1,y1,0)

    	this.arrPosition.push(x,y,0)
    	this.arrPosition.push(x1+s,y1+s,0)
    	this.arrPosition.push(x1,y1,0)*/
		var kk=50
    	for (var i = 0; i < kk; i++) {
    		this.arrPosition.push(x+Math.random()*s-s/2,y+Math.random()*s-s/2,0)
    		this.arrPosition.push(x+Math.random()*s-s/2,y+Math.random()*s-s/2,0)
    		this.arrPosition.push(x1+Math.random()*s-s/2,y1+Math.random()*s-s/2,0)
    	}
    	for (var i = 0; i < kk; i++) {
    		this.arrPosition.push(x+Math.random()*s-s/2,y+Math.random()*s-s/2,0)
    		this.arrPosition.push(x1+Math.random()*s-s/2,y1+Math.random()*s-s/2,0)
    		this.arrPosition.push(x1+Math.random()*s-s/2,y1+Math.random()*s-s/2,0)
    	}/**/
    } 



    this.update = function () {
     	
       // if (!arrPositionAttribut || arrPositionAttribut.length < arrPosition.length * 3) {
            arrPositionAttribut = new Float32Array(this.arrPosition.length * 3);


            this.addAttribute('position', new THREE.BufferAttribute(arrPositionAttribut, 3));
           
            for (var i = 0; i < this.arrPosition.length; i++) {
	            arrPositionAttribut[i] = this.arrPosition[i];// = arrPosition[i];
	        }
	        

          /*  arrUvAttribut = new Float32Array(arrPosition.length * 2);
            this.addAttribute('uv', new THREE.BufferAttribute(arrUvAttribut, 2));

            // arrIndex = new Uint16Array(arrPosition.length);
            //  this.addAttribute( 'indexs', new THREE.BufferAttribute( arrIndex, 1 ) );

            arrNormal = new Float32Array(arrPosition.length * 3);
            this.addAttribute('normal', new THREE.BufferAttribute(arrNormal, 3));*/

       // }
       /* for (var i = 0; i < arrPositionAttribut.length; i++) {
            arrPositionAttribut[i] = 0;
        }*/
        /*for (var i = 0; i < arrPosition.length; i++) {
            arrPositionAttribut[i] = arrPosition[i]||0;// = arrPosition[i];
        }*/
       /* for (var i = 0; i < arrUv.length; i++) {
            arrUvAttribut[i] = arrUv[i];
        }*/

        this.attributes.position.needsUpdate = true;
      /*  this.attributes.uv.needsUpdate = true;
        this.computeVertexNormals();
        this.attributes.normal.needsUpdate = true;
        this.computeBoundingBox();
        this.computeBoundingSphere();*/
    };

    this.update();

}
GeometriXZ.prototype = Object.create(THREE.BufferGeometry.prototype);
GeometriXZ.prototype.constructor = GeometriXZ;

