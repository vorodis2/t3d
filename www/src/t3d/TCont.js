

var dContSah=0;
export class TCont {
  	
  	constructor(obj3d) {
  		//super();
  		this.type="TCont";
  		var self=this;
  		this.tCont="xz"
  		this.object3d=new THREE.Object3D();
    	this.object3d.tCont=this;

		this.children=[];
		this._parent=undefined;
		this._scale=1;
		this._x=0;
		this._y=0;
   		this.uuid=dContSah+"_"+Math.random()
		dContSah++;

		this.dragBigXZ=function(){			
			
		}

		if(obj3d!=undefined){
			if(obj3d.tCont==undefined){
				obj3d.add(this.object3d);

			}else{
				trace("obj3d")
				trace(obj3d)
				trace(this)
				obj3d.object3d.add(this.object3d)
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
		this.object3d.add(c.object3d);
		c.parent=this;	
		c.testVisi();	
	}


	remove(c){		
		if(c==undefined) return null;		
		var rez;
		for (var i = 0; i < this.children.length; i++) {
			if(this.children[i].uuid==c.uuid){
				rez = this.children.splice(i,1);
				rez[0].parent.object3d.remove(rez[0].object3d);
				rez[0].parent=undefined;
				return rez[0]
			}
		}
		return null;
	}





	set x(value) {this.object3d.position.x = value;}	get x() { return  this.object3d.position.x;}
	set y(value) {this.object3d.position.y = value;}	get y() { return  this.object3d.position.y;}
	set scale(value) {
		if(this._scale!=value){			
			this._scale=value;
			this.object3d.scale(this._scale, 1, this._scale);			
		}		
	}	get scale() {
		return  this._scale;
	}
	
	set parent(value) {		
		this._parent = value;
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
		if(this._visible!=value){
		    this._visible = value;
		    this.object3d.visible=this._visible;

		}
	}
  	get visible() { return  this.parameter.visible;}
}
