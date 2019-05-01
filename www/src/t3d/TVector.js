

/*(function (global, factory) {
	typeof exports === 'object'/* && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.DCM = {})));  303890
}(this, (function (exports) { 'use strict';*/


import { TCont } from './TCont.js';



export class TVector {
	constructor() {
		var self=this;
		this.type="TVector"
		this.time=0
		this._wh=50;
		
		this._sah=2;
		this._zdvig=2

		this._canvas
		this.funUp=undefined;
		this._boolMat=true;
		this.dinFun=undefined

		this.bitmapData=new TBitmapData(20,20,0,function(){			
			self.upDate()	
			if(self.dinFun)self.dinFun()
		});
		this._canvas=this.bitmapData.canvas;

		this.bloks=new TBloks(this);
		this.points=new TPoints(this);



		this.setLink=function(link, fun){
			self.dinFun=fun;			
			this.bitmapData.load(link, true);
			
		}

		this.upDate=function(){
			var now = new Date().getMilliseconds();
			this.bloks.upDate();
			this.points.upDate();

			this.time = new Date().getMilliseconds()-now
			if(this.funUp!=undefined)this.funUp()
		}
	}



	set canvas(value) {		
		this._canvas = value;			
				
	}	
	get canvas() { return  this._canvas;}

	set wh(value) {

		if(this._wh!=Math.round(value)){
			this._wh= Math.round(value);
			this.upDate()
			
		}		
	}	
	get wh() { return  this._wh;}
	
	

	set sah(value) {
		if(this._sah!=value){
			this._sah= value;
			this.upDate()
		}		
	}	
	get sah() { return  this._sah;}	

	set zdvig(value) {
		if(this._zdvig!=value){
			this._zdvig= value;
			this.upDate()
		}		
	}	
	get zdvig() { return  this._zdvig;}	
	
	
	set boolMat(value) {
		if(this._boolMat!=value){
			this._boolMat= value;
			this.points._boolMat= value;
			this.upDate()
		}		
	}	
	get boolMat() { return  this._boolMat;}	

	

}


export class TPoints {
	constructor(par) {
		this.par=par;
		this.array=[];
		this.arrayTriangle=[];
		var arrPoint=[];
		var sah=0
		this._boolMat=true;

		this.ts=new TriangulateShape()
		this.getP=function(){
			if(sah==arrPoint.length){
				arrPoint.push({x:0,y:0});
			}
			sah++;
			return arrPoint[sah-1];
		}

		this.clear=function(){
			this.array=[]
			this.arrayTriangle=[]
			this.ts.segment.width=this.par.wh*2;
			this.ts.segment.height=this.par.wh*2;
			sah=0;
		}

		this.upDate=function(){
			this.clear()

			for (var j = 0; j< this.par.bloks.array.length; j++) {

				for (var i = 0; i < this.par.bloks.array[j].attIJBig.length; i++) {
					this.startGron(this.par.bloks.array[j].attIJBig[i], this.par.bloks.array[j].i, this.par.bloks.array[j].j )
				}
				
			}
			//trace(this.array)			
		}

		this.startGron=function(point, _plisI, _plisJ ){
			
			if(point.length<5)return;
			
			var a=[]
			var o
			for (var i = 0; i < point.length; i+=2) {
				o=this.getP()
				o.x=point[i];
				o.y=point[i+1];
				a.push(o);
			}



			if(this._boolMat==true)this.sGMat(a)

			for (var i = 0; i < a.length; i++) {
				a[i].x+=_plisI;
				a[i].y+=_plisJ;
			}
			this.ts.arrPosition=[]
			this.ts.start(a)

			//trace(this.ts.arrPosition)
			var at=[]
			for (var i = 0; i < this.ts.arrPosition.length; i+=9) {
				at.push(this.ts.arrPosition[i],this.ts.arrPosition[i+1])
				at.push(this.ts.arrPosition[i+3],this.ts.arrPosition[i+1+3])
				at.push(this.ts.arrPosition[i+6],this.ts.arrPosition[i+1+6])
			}





			this.arrayTriangle.push(at)
			this.array.push(a)


		}

		//оптимизация мат
		this.sGMat=function(a){
			
			/*var n;
			var o={x:0,y:0}
			var o1={x:100,y:200}
			var o2={x:50,y:3}
			n=Math.abs(this.getDistancePointToLine(o, o1, o2))*/

			
			for (var i = 0; i < a.length-2; i++) {
				this.sGMat2(a, i)			
			}
		}




		var zdvig=5
		var aD,d,n, ff;
		this.sGMat2=function(a,ii){
			d=this.getDistance(a[ii],a[ii+1])
			
			if(d>10){//Вылетаем из поределения и так длинная хрень
				return ;
			}
			n=Math.abs(this.getDistancePointToLine(a[ii],a[ii+2],a[ii+1]))
			if(n>1){//Вылетаем между двух большой
				//trace(n+">>>>>>>"+zdvig)
				return;
			}else{
				//trace("<<<<<<<<<")
			}



			aD=[];
			for (var j = 0; j < 100; j++) {
				ff=ii+j+2;
				if(ff>=a.length-3){
					break;
				}else{
					aD.push((ff-1));

					if(this.sGMat3(a,a[ii],aD,a[ff])==true){
						//trace(">>",aD)
						for (var i = aD.length-2; i >=0; i--) {
							a.splice(aD[i],1)
						}

						j=999999
						break;
					}else{
						//trace("<<",aD)
					}
				}				
			}

		}

		this.sGMat3=function(a, p, aa, p1){
			var r=false;
			//trace(p, aa, p1)
			for (var i = 0; i < aa.length; i++) {
				
				n=Math.abs(this.getDistancePointToLine(p,a[aa[i]],p1))
				//trace(i, "  ",n,"   ",p,a[aa[i]],p1)
				if(n>this.par._zdvig){
					r=true;
					break;
				}
				
			}

			return r;
		}	



		/**
	     * Получение дистанции между точками
	     * @param {Point} p1 - Первая точка.
	     * @param {Point} p2 - Вторая точка.
	     * @return {number} дистанция(растояние) между точками.
	     */
		this.getDistance = function (p1, p2) {
			if (p1 == undefined) {
				return 0;
			}
			if (p2 == undefined) {
				p2 = rezNull;
			}
			p2 = p2 || rezNull;
			return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
		};

		this.getDistancePointToLine = function (p, p1, pTest) {
			var res = ((p1.y - p.y) * pTest.x - (p1.x - p.x) * pTest.y + p1.x * p.y - p1.y * p.x) / this.getDistance(p, p1);

			return -(Number.isFinite(res) ? res : 0);
		};

	}
}






export class TBloks {
	constructor(par) {
		this.par=par;
		this.array=[];
		this.arrGron=[];
		this.arrGronMin=[];
		var bD=par.bitmapData;
		var sag=0;
		var sagMin=0;
		var www,hhh,ii,jj;
		var gron;

		this.clear=function(){
			this.array=[];
			for (var i = 0; i < this.arrGron.length; i++) {
				this.arrGron[i].clear();
			}
		}

		this.getGron=function(i,j,w,h){
			if(sag==this.arrGron.length){
				this.arrGron.push(new TGron(this));
				this.arrGron[sag].idArr=sag			
			}
			this.arrGron[sag].start(i,j,w,h);
			this.array.push(this.arrGron[sag])
			sag++;			
			return this.arrGron[sag-1];	
		}

		this.getGMin=function(){
			if(sagMin==this.arrGronMin.length){
				this.arrGronMin.push(new TGronMin(this));
				this.arrGronMin[sagMin].idArr=sagMin	
			}			
			sagMin++;
			return this.arrGronMin[sagMin-1];	
		}	

		this.upDate=function(){
			this.clear();
			sag=0;
			sagMin=0;
			www= bD.width;
			hhh= bD.height;	
			gron=null
			var _w,_h		
			for (var i = 0; i < www-par._wh; i+=par._wh) {
				_w=par._wh+1;
				if(i+_w>=www-par._wh+1)_w=www-i;
				for (var j = 0; j < hhh-par._wh; j+=par._wh) {
					_h=par._wh+1;
					if(j+_h>=hhh-par._wh+1)_h=hhh-j;
					gron=this.getGron(i,j,_w,_h);
				}				
			}
			if(gron==null)	{
				gron=this.getGron(0,0,www,hhh);
			}		
		}
	}
}


export class TGron {
	constructor(par) {
		this.par=par;
		this.idArr=-1;
		this.array=[];
		this.status=0;
		this.i
		this.j
		this.w
		this.h

		var bD=par.par.bitmapData;
		
		var gMin

		this.clear=function(){
			if(this.array.length!=0)this.array=[];
		}

		this.start=function(_i,_j,_w,_h){
			this.i=_i;
			this.j=_j;
			this.w=_w;
			this.h=_h;			
			for (var i = 0; i < _w; i++) {
				this.array[i]=[];
				for (var j = 0; j < _h; j++) {									
					gMin=par.getGMin();
					gMin.start(i+_i, j+_j, bD.getPixel(i+_i,j+_j))
					this.array[i][j]=gMin;
				}
			}
			this.testSt();
			if(this.status==1)this.poisk();
		}
		this.testSt=function(){
			this.status=0;
			this.attIJBig=[];
			for (var i = 0; i < this.w; i++) {
				for (var j = 0; j < this.h; j++) {
					if(this.array[i][j].suma!=0){
						this.status=1;						
						i=999
						j=999
						break;
					}
				}
			}

			if(this.status==0)return;//пустой блок
			this.status=2;
			for (i = 0; i < this.w; i++) {
				for (j = 0; j < this.h; j++) {
					if(this.array[i][j].suma==0){
						this.status=1;						
						i=999
						j=999
						break;
					}
				}
			}
			if(this.status==1)return;

			this.attIJBig=[[0,0, this.w-1,0, this.w-1,this.h-1, 0,this.h-1, 0,0]];


		}

		var sahLine=0;
		this.attIJ=[];
		this.attIJ2=[];
		this.attIJBig=[];
		this.poisk=function(){
			this.poiskOpok()//ищем опорные
			this.attIJ=[];
			this.attIJBig=[];
			sahLine=-1;	
			//if(this.idArr==11){
			//if(this.idArr==0){
				this.poiskLine()//ищем опорные				
			//}
			
			if(this.attIJBig.length>=2){
	
				this.slivanie();//если массивы вписаные во внутрь
				for (var i = this.attIJBig.length-1; i >=0 ; i--) {					
					if(this.attIJBig[i].length==0){
						//this.attIJBig.splice(i,1);
					}
				}			
			}
		}


		this.slivanie=function(){	

			for (var i = 0; i < this.attIJBig.length; i++) {
				this.slivanieMa(this.attIJBig[i], i)
			}
		}
		this.slivanieMa=function(m,ii){
		
			if(m[1]-1>0){//возможно в нутри
				if(this.array[m[0]][m[1]-1].suma!=0){//он точно в нутри
					
					for (var i = 1; i < this.h; i++) {
						if(m[1]-i>=0){
							if(this.array[m[0]][m[1]-i].opor==true){								
								var k=this.array[m[0]][m[1]-i].konur;
								if(k!=-1){
								
									for (var j = 0; j < m.length; j++) {										
										this.attIJBig[k].push(m[j])
									}
									
									this.attIJBig[ii]=[];									

									this.rjynehNa(ii,k)
									return
								}								
							}
						}
					}

				}
			}
		}



		this.rjynehNa=function(old,neW){
			var i,j
			for (i = 0; i < this.w; i++) {
				for (j = 0; j < this.h; j++) {
					if(this.array[i][j].konur==old){
						this.array[i][j].konur=neW
					}
				}
			}
		}

		


		
		var oIJ=o={
			i:0,//елемент
			y:0,
			x:0,//номер следущего
			y:0,
			error:0//количество смещения
		};

		var o={
			i:0,//елемент
			y:0,
			x:0,//номер следущего
			y:0,
			error:0//количество смещения
		};
		var error=0;
		var sahhh
		this.poiskLine=function(){
			if(sahLine!=-1){
				this.attIJBig.push(this.attIJ);
			}	
			sahLine++;	
			
			for (var i = 0; i < this.w; i++) {
				for (var j = 0; j < this.h; j++) {
					if(this.array[i][j].suma!=0)
					if(this.array[i][j].opor==true){
						if(this.array[i][j].proshli==-1){							
							error=0;
							sahhh=0;							
							this.poiskOFkonur2(i,j,sahLine);
							
							
							this.array[i][j].proshli = 5;
							this.attIJ=[];

							this.getPoisk(i,j);
							

							if(o.i==-999){
								this.poiskLine();
								return false;
							}	
							
							this.attIJ.push(i,j);
						
							this.array[i][j].konur=sahLine;	
							this.attIJ2=[];
							this.attIJ2.push(i,j);
							

							oIJ.i=o.i*1;
							oIJ.j=o.j*1;

							oIJ.x=o.x*1;							
							oIJ.y=o.y*1;
							oIJ.error=0;

												
							this.poiskOF(o.i, o.j);
							return true;
						}
					}					
				}	
			}
			return false;
		}


		this.poiskOFkonur2=function(_i, _j,_sahLine){
			
			if(this.array[_i][_j].proshli2!=-1)return
			this.array[_i][_j].proshli2 = 1;
			this.getPoisk(_i,_j,"proshli2");
			
			if(o.x != -999){
				
				this.array[o.i][o.j].konur2=_sahLine;
				//this.array[o.i][o.j].proshli2 = 1;
				this.poiskOFkonur2(o.i,o.j,_sahLine)
				
			}

			this.getPoisk(_i,_j,"proshli2");
			
			if(o.x != -999){
				
				this.array[o.i][o.j].konur2=_sahLine;
				//this.array[o.i][o.j].proshli2 = 1;
				this.poiskOFkonur2(o.i,o.j,_sahLine)
				
			}
			sahhh++			
		}

		

		this.poiskOF=function(_i, _j){
			

			if(_i == -999)return
			this.attIJ2.push(_i,_j);
			this.array[_i][_j].konur=sahLine	
			this.array[_i][_j].proshli = 1;			
			
			this.getPoisk(_i,_j);
			
		

			if(o.x == -999){
							
				this.testOdinokih()				
				return;
			}

			var b=false;
			if(o.x==oIJ.x){
				if(o.y==oIJ.y){					
					b=true;

					//oIJ.error--;
					//if(oIJ.error<0)oIJ.error=0
					
					
				}
			}

			if(this.array[_i][_j].oporNum>=3){
				oIJ.error=999999999;
				/*oIJ.i=o.i*1;
				oIJ.j=o.j*1;
				oIJ.x=o.x*1;							
				oIJ.y=o.y*1;
				oIJ.error=0;
				this.attIJ.push(o.i, o.j);
				this.array[o.i][o.j].konur=sahLine								
				this.poiskOF(o.i, o.j);	
				this.array[_i][_j].proshli = 4;			
				return;*/
			}

			if(b==false){
				oIJ.error++;
						
			}	

			if(this.array[o.i][o.j].oporSuper==true)oIJ.error=999999999;

			if(oIJ.error<this.par.par._sah){
				this.poiskOF(o.i,o.j)
			}else{	
				
				this.array[o.i][o.j].proshli = 4;			
				oIJ.i=o.i*1;
				oIJ.j=o.j*1;
				oIJ.x=o.x*1;							
				oIJ.y=o.y*1;
				oIJ.error=0;
				this.attIJ.push(_i, _j);	
				this.array[o.i][o.j].konur=sahLine								
				this.poiskOF(o.i, o.j);				
				this.array[_i][_j].proshli = 4;
			}
		}

		var arrxz=[
		{x:-1, y:-1},{x:0, y:-1},{x:1, y:-1},
		{x:1, y:0},
		{x:1, y:1},{x:0, y:1},{x:-1, y:1},
		{x:-1, y:0}];


		var iiii,jjjj
		var _inum,_jnum,_xnum,_ynum,_nMax
		var sss
		this.getPoisk=function(_i, _j,_proshli){
			o.x=-999;


			var t=_proshli||"proshli"

			

			sss=0;
			_nMax=-999;
			_jnum=-999;
			_inum=-999;
			_ynum=-999;
			_xnum=-999;
			
			for (var i = -1; i < 2; i++) {
				iiii=_i+i
				if(iiii!=-1 && iiii<=this.w-1){					
					for (var j = -1; j < 2; j++) {
						jjjj=_j+j
						if(i==0 && j==0){}else{
							if(jjjj!=-1 && jjjj<=this.h-1){
								
								if(this.array[iiii][jjjj].suma!=0)
								if(this.array[iiii][jjjj].opor==true)	
								if(this.array[iiii][jjjj][t] == -1){
									sss++
									if(this.array[iiii][jjjj].oporNum>_nMax){
										_nMax=this.array[iiii][jjjj].oporNum;
										_inum=iiii;
										_jnum=jjjj;
										_xnum=i;
										_ynum=j;
									}								
								}
							}
						}
					}				
				}
			}
			o.i=_inum;
			o.j=_jnum;
			o.x=_xnum;
			o.y=_ynum;

			if(this.array[_i][_j].krai==true){
				
				//низ
				if(_i<this.w-1)
				if(this.array[_i+1][_j]!=undefined)if(this.array[_i+1][_j].suma!=0)if(this.array[_i+1][_j].opor == true)if(this.array[_i+1][_j][t] == -1){
					
					if(this.array[_i+1][_j].oporNum>=_nMax){
						o.i=_i+1;
						o.j=_j;
						o.x=1;
						o.y=0;
						
						return;

					}
					
				}

				if(_i>0)
				if(this.array[_i-1][_j]!=undefined)if(this.array[_i-1][_j].suma!=0)if(this.array[_i-1][_j].opor == true)if(this.array[_i-1][_j][t] == -1){
					if(this.array[_i-1][_j].oporNum>=_nMax){
						o.i=_i-1;
						o.j=_j;
						o.x=-1;
						o.y=0;
						
						return;
					}
				}

				

				//низ
				if(this.array[_i][_j+1]!=undefined)if(this.array[_i][_j+1].suma!=0)if(this.array[_i][_j+1].opor == true)if(this.array[_i][_j+1][t] == -1){
					if(this.array[_i][_j+1].oporNum>=_nMax){
						o.i=_i;
						o.j=_j+1;
						o.x=0;
						o.y=1;
						return;
					}
				}
				
				//верх
				if(this.array[_i][_j-1]!=undefined)if(this.array[_i][_j-1].suma!=0)if(this.array[_i][_j-1].opor == true)if(this.array[_i][_j-1][t] == -1){
					if(this.array[_i][_j-1].oporNum>=_nMax){
						o.i=_i;
						o.j=_j-1;
						o.x=0;
						o.y=-1;
						return;
					}
				}		

			}



		}


		this.testAll=function(){
			var d=-1;
			var sah1=0;
			var sah2=0;
			var mx=9999;
			var rI=-1;
			var rJ=-1;
			var d

			var dd=Math.sqrt(Math.pow((this.attIJ[0]*1 - oIJ.i), 2) + Math.pow((this.attIJ[1]*1 - oIJ.j), 2));
			
			for (var i = 0; i < this.w; i++) {
				for (var j = 0; j < this.h; j++) {
					
					if(this.array[i][j].konur2==sahLine){
						sah2++;							
						if(this.array[i][j].proshli == -1){
							d=Math.sqrt(Math.pow((oIJ.i - i), 2) + Math.pow((oIJ.j - j), 2));
							
							if(d<dd){

								if(mx>d){
									mx=d;
									rI=i;
									rJ=j;
								}
								sah1++;
							}
							
						}
					}
				}
			}

			if(sah1!=0){				
				oIJ.i=rI;
				oIJ.j=rJ;
				oIJ.x=0;							
				oIJ.y=0;
				oIJ.error=0;
				this.attIJ.push(rI, rJ);	
				this.array[rI][rJ].konur=sahLine
				this.array[rI][rJ].proshli = 4;								
				this.poiskOF(rI, rJ);
				return true
			}
			

			return false
		}



		this.testOdinokih=function(){
			if(this.testAll()==true){
				//this.attIJ.push(this.attIJ[0]*1,this.attIJ[1]*1);
				return;
			}

			var ww=0
			var hh=0
			var b=true;
			
			if(this.attIJ2.length>=5){
				b=false;
				for (var i = 2; i < this.attIJ2.length; i+=2) {
					if(this.attIJ2[i]!=this.attIJ2[0])ww=1
					if(this.attIJ2[i+1]!=this.attIJ2[1])hh=1	
				}
				if(ww==0)b=true;
				if(hh==0)b=true;
			}
			
			if(b==true){
				for (var i = 0; i < this.attIJ2.length; i+=2) {					
					this.array[this.attIJ2[i]][this.attIJ2[i+1]].opor=false
					this.array[this.attIJ2[i]][this.attIJ2[i+1]].proshli = -1;
				}				
			}else{
				
				this.attIJ.push(this.attIJ[0]*1,this.attIJ[1]*1);
			}


			this.poiskLine();
		}

		this.poiskOpok=function(){		
			var sah=-1;


			//for (var j = 0; j < this.h; j++) {
				//if(this.array[0][j].suma!=sah){
					//sah=this.array[0][j].suma;
					//this.array[0][j].oporSuper=true;
				//}
			//}



			for (var i = 0; i < this.w; i++) {
				sah=-1
				for (var j = 0; j < this.h; j++) {
					if(this.array[i][j].suma!=sah){
						this.array[i][j].opor=true;
						//if(j==0)this.array[i][j].oporSuper=true;
						//if(j==this.h-1)this.array[i][j].oporSuper=true;

						this.array[i][j].oporNum++
						sah=this.array[i][j].suma;						
					}
				}
				sah=-1
				for (var j = this.h-1; j >=0 ; j--) {
					
					if(this.array[i][j].suma!=sah){
						this.array[i][j].opor=true;
						this.array[i][j].oporNum++
						sah=this.array[i][j].suma;						
					}
				}
			}
			for (var j = 0; j < this.h; j++) {
				sah=-1
				for (var i = 0; i < this.w; i++) {
					if(this.array[i][j].suma!=sah){
						
						//if(i==0)this.array[i][j].oporSuper=true;
						//if(i==this.w-1)this.array[i][j].oporSuper=true;

						this.array[i][j].opor=true;
						this.array[i][j].oporNum++
						sah=this.array[i][j].suma;						
					}
				}
			}

			for (var j = 0; j < this.h; j++) {
				sah=-1
				for (var i = this.w-1; i >= 0; i--) {
					if(this.array[i][j].suma!=sah){
						this.array[i][j].opor=true;
						this.array[i][j].oporNum++
						sah=this.array[i][j].suma;						
					}
				}
			}

			for (var j = 0; j < this.h; j++) {				
				for (var i = 0; i < this.w; i++) {
					if(this.array[i][j].suma!=0)
					if(this.array[i][j].opor==true){
						this.killOO(i,j);
					}
				}
			}

			for (var j = 0; j < this.h; j++) {
				sah=-1
				if(this.array[0][j].suma!=sah){
					this.array[0][j].krai=true
					this.array[0][j].oporNum++
				}
				if(this.array[this.w-1][j].suma!=sah){
					this.array[this.w-1][j].krai=true
					this.array[this.w-1][j].oporNum++
				}
			}

			for (var i = 0; i < this.w; i++) {
				sah=-1
				if(this.array[i][0].suma!=sah){
					this.array[i][0].krai=true
					this.array[i][0].oporNum++;
				}
				if(this.array[i][this.h-1].suma!=sah){
					this.array[i][this.h-1].krai=true
					this.array[i][this.h-1].oporNum++;
				}
			}	

			if(this.array[0][0].suma!=0)this.array[0][0].oporNum+=10;
			if(this.array[this.w-1][0].suma!=0)this.array[this.w-1][0].oporNum+=10;
			if(this.array[this.w-1][this.h-1].suma!=0)this.array[this.w-1][this.h-1].oporNum+=10;
			if(this.array[0][this.h-1].suma!=0)this.array[0][this.h-1].oporNum+=10;

			this.array[0][7].oporNum+=10;
			sah=11
			for (var j = 0; j < this.h; j++) {
				//this.array[0][j].oporSuper=true;
				
				if(this.array[0][j].suma!=sah){
					//sah=this.array[0][j].suma;
					//this.array[0][j].oporSuper=true;
				}
			}

			this.poiskOpokwwww();
		}
		this.poiskOpokwwww= function(){
		/*	for (var i = 0; i < this.w; i++) {
				if(this.array[i][this.h-1].opor==true){
					if(this.array[i][this.h-2].opor==true){
						//if(this.array[i][this.h-3].opor==false){

							this.array[i][this.h-1].opor=false;
							this.array[i][this.h-2].opor=false;
						//}
					}
				}
			}*/
		}


		this.killOO= function(i,j){
			var s=0;
			this.getPoisk(i,j)
			if(sss==1){
				this.array[i][j].suma=0;
				this.array[i][j].opor=false;
			}
		}

	}
}










export class TGronMin {
	constructor(par) {
		this.par=par;
		this.idArr=-1;
		
		this.startColor
		this.a

		this.i
		this.j
		this.suma=0;
		this.opor=false;
		this.oporSuper=false;
		this.proshli=-1;
		this.oporNum=0
		this.krai=false;
		this.konur=-1

		this.konur2=-1
		this.proshli2=-1
		this.start=function(i,j,a){			
			this.suma=0
			this.opor=false
			this.oporSuper=false;
			this.proshli=-1;
			this.krai=false;
			this.konur2=-1
			this.proshli2=-1
			this.i=i;
			this.j=j;
			this.oporNum=0
			if(a[3]>200)this.suma=1;
			
		}
	}
}







export function TBitmapData (w, h, rgba, fun) {
	var self = this;
	this.type = 'TBitmapData';
	

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
			self.width = img.width;
			self.height = img.height;
			if (isClear) {
				self.clear();
			}
			
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
Object.defineProperties(TBitmapData.prototype, {
	width: {
		set: function (value) {
			var old = this._width;
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





/** @module unility */
/**
* Для сегментирования (триангуляции) фигуры 2d
* на start кидаем контур фигуры, после считываем arrPosition до lengthPosition, и arrUV до lengthUV
* @class
*/
function TriangulateShape () {
	var self = this;
	/**
	* сегмент рект для сегментации
	* width, height - размер сегмента
	* x, y -  -1...1 сдвиг сегмента
	* @member {Rectangle}
	*/
	this.segment = {x: 0.5, y: 0.5, width: 100, height: 100, rotation: 0};

	this.arrPoint = []; // текущий масив точек(контур обход фигуры)
	this.arrTriangle = []; // маленькие триугольники
	this.arrTriangleBig = []; // большые триугольники от шейпа
	this.arrPosition = []; // позиции
	this.arrUV = []; // ув
	// this.arrIndices = [];       // индекс
	this.lengthUV = 0; // до этого значения нужно считывать увешки
	this.lengthPosition = 0; // до этого значения нужно считывать позишыны
	this.lengthTriangle = 0;

	this.centerShape = new PointT(); // центр масы фигуры
	this.areaShape = 0; // площадь фигуры

	// для расчетов мин макса и сентра(меняется)
	this._bound = {min: new PointT(), max: new PointT(), center: new PointT()};

	// для сегментации триугольников
	var p = new PointT();
	var p1 = new PointT();
	var intersect;
	var recta = [0, 0, this.segment.width, this.segment.height];
	var arrPointBuff = [new PointT(), new PointT(), new PointT(), new PointT(), new PointT(), new PointT(), new PointT(), new PointT(), new PointT()];
	var countPointInTriangleSegment = 0;
	var arrTri, bound, startX, startY, finishX, finishY;
	// ---
	var pointUv = new PointT();// для генерации ув

	/**
	* Триангулировать и сегментировать контур после считываем arrPosition до lengthPosition, и arrUV до lengthUV
	* @param {Array<Position>} contour - масив точек, обход
	*/
	this.start = function (contour) {
		self.lengthUV = 0;
		self.lengthTriangle = 0;
		self.lengthPosition = 0;

		var arrPointContour = [];
		for (var i = 0; i < contour.length; i++) {
			arrPointContour.push(new PointT(contour[i].x, contour[i].y));
		}

		if (this.segment.rotation !== 0) {
			for (var i = 0; i < arrPointContour.length; i++) {
				self.rotationPoint(arrPointContour[i], -this.segment.rotation);
			}
		}

		self.arrPoint = arrPointContour;
		self.areaShape = self.area(self.arrPoint);
		if (!self.areaShape) return;
		self.getCenterShape();

		for (var i = 0; i < self.arrTriangleBig.length; i++) {
			self.segmentationTriangle(self.arrTriangleBig[i]);
		}

		if (this.segment.rotation !== 0) {
			var pt = new PointT();
			for (var i = 0; i < self.arrPosition.length; i += 3) {
				pt.set(self.arrPosition[i], self.arrPosition[i + 1]);
				self.rotationPoint(pt, this.segment.rotation);
				self.arrPosition[i] = pt.x;
				self.arrPosition[i + 1] = pt.y;
			}
		}
		// for (i = 0; i < self.arrPosition.length / 2; i++) {
		//     self.arrIndices[i] = i;
		// }
		// self.arrIndices.length = Math.floor(self.arrPosition.length / 2);

	};

	this.getCenterShape = function (arrPoint) {
		self.arrPoint = arrPoint || self.arrPoint;
		self.arrTriangleBig.length = 0;
		self.arrTriangleBig = self.triangulate(self.arrPoint);
		self.updateCenterShape();
	};

	this.updateCenterShape = function () {
		var maxArea = 0;
		var ar = 0;
		self.centerShape.set(0, 0);
		var tipShape = self.convex(self.arrPoint);
		if (tipShape === 0 || tipShape === -1) {
			for (var i = 0; i < self.arrTriangleBig.length; i++) {
				ar = self.area(self.arrTriangleBig[i]);
				if (maxArea < ar) {
					maxArea = ar;
					self.centerShape.x = (self.arrTriangleBig[i][0].x + self.arrTriangleBig[i][1].x + self.arrTriangleBig[i][2].x) / 3;
					self.centerShape.y = (self.arrTriangleBig[i][0].y + self.arrTriangleBig[i][1].y + self.arrTriangleBig[i][2].y) / 3;
				}
			}
		} else {
			for (var i = 0; i < self.arrPoint.length; i++) {
				self.centerShape.x += self.arrPoint[i].x;
				self.centerShape.y += self.arrPoint[i].y;
			}
			self.centerShape.x /= self.arrPoint.length;
			self.centerShape.y /= self.arrPoint.length;
		}

	};

	// сегментация триугольника
	this.segmentationTriangle = function (triangle) {
		bound = this.getBound(this.arrPoint);
		startX = ((bound.min.x - (bound.min.x % this.segment.width) - this.segment.width * 2) || 0) + this.segment.x * this.segment.width;
		startY = ((bound.min.y - (bound.min.y % this.segment.height) - this.segment.height * 2) || 0) + this.segment.y * this.segment.height;
		finishX = ((bound.max.x - (bound.max.x % this.segment.width) + this.segment.width * 2) || 500) + this.segment.x * this.segment.width;
		finishY = ((bound.max.y - (bound.max.y % this.segment.height) + this.segment.height * 2) || 500) + this.segment.y * this.segment.height;
		recta[2] = this.segment.width;
		recta[3] = this.segment.height;
		for (var ii = startX; ii < finishX; ii += this.segment.width) {
			for (var jj = startY; jj < finishY; jj += this.segment.height) {
				recta[0] = ii;
				recta[1] = jj;
				arrTri = self.triangulate(self.getArrPointTriangleSegment(triangle, recta), false);

				for (var j = 0; j < arrTri.length; j++) { // проходим по маленьким триугольникам
					self.arrTriangle[self.lengthTriangle++] = (arrTri[j]); // кидаем в масив триугольников

					for (var k = 0; k < arrTri[j].length; k++) { // проходим по верщинам триугольника
						self.generatePointUV(arrTri[j][k], recta); // кидаем ув
						self.arrPosition[self.lengthPosition++] = (arrTri[j][k].x); // кидаем позиции
						self.arrPosition[self.lengthPosition++] = (arrTri[j][k].y); // кидаем позиции
						self.arrPosition[self.lengthPosition++] = (0); // кидаем позиции
					}
				}
			}
		}
	};

	// получаем точки сегмента триугольника
	this.getArrPointTriangleSegment = function (triangle, rect) {
		var res = arrPointBuff;
		for (var i = 0; i < res.length; i++) {
			res[i].x = res[i].y = Infinity;
		}
		countPointInTriangleSegment = 0;
		for (var i = 0; i < 3; ++i) { // сегментируем триугольник(ребра) с сегментом rect методом пересечений
			p.x = rect[0];
			p.y = rect[1];
			p1.x = rect[0] + rect[2];
			p1.y = rect[1];
			intersect = self.getPointOfIntersection(p, p1, triangle[i], triangle[(i + 1) % 3]);
			if (intersect) {
				if (!self.inArr(res, intersect)) res[countPointInTriangleSegment++].setPoint(intersect);
			}
			p.x = rect[0] + rect[2];
			p.y = rect[1];
			p1.x = rect[0] + rect[2];
			p1.y = rect[1] + rect[3];
			intersect = self.getPointOfIntersection(p, p1, triangle[i], triangle[(i + 1) % 3]);
			if (intersect) {
				if (!self.inArr(res, intersect)) res[countPointInTriangleSegment++].setPoint(intersect);
			}
			p.x = rect[0] + rect[2];
			p.y = rect[1] + rect[3];
			p1.x = rect[0];
			p1.y = rect[1] + rect[3];
			intersect = self.getPointOfIntersection(p, p1, triangle[i], triangle[(i + 1) % 3]);
			if (intersect) {
				if (!self.inArr(res, intersect)) res[countPointInTriangleSegment++].setPoint(intersect);
			}
			p.x = rect[0];
			p.y = rect[1];
			p1.x = rect[0];
			p1.y = rect[1] + rect[3];
			intersect = self.getPointOfIntersection(p, p1, triangle[i], triangle[(i + 1) % 3]);
			if (intersect) {
				if (!self.inArr(res, intersect)) res[countPointInTriangleSegment++].setPoint(intersect);
			}

			// если нужно добавляем вершыны(точки) треугольника если они в нутри сегмента
			p.x = rect[0];
			p.y = rect[1];
			p1.x = rect[0] + rect[2];
			p1.y = rect[1] + rect[3];
			if (self.pointInSegment(triangle[i], p, p1)) {
				if (!self.inArr(res, triangle[i])) res[countPointInTriangleSegment++].setPoint(triangle[i]);
			}
		}

		// проверяем сегмент если он в нутри триугольника
		p.x = rect[0];
		p.y = rect[1];
		if (self.isInTriangle(triangle[0], triangle[1], triangle[2], p)) {
			if (!self.inArr(res, p)) res[countPointInTriangleSegment++].setPoint(p);
		}
		p.x = rect[0] + rect[2];
		p.y = rect[1];
		if (self.isInTriangle(triangle[0], triangle[1], triangle[2], p)) {
			if (!self.inArr(res, p)) res[countPointInTriangleSegment++].setPoint(p);
		}
		p.x = rect[0] + rect[2];
		p.y = rect[1] + rect[3];
		if (self.isInTriangle(triangle[0], triangle[1], triangle[2], p)) {
			if (!self.inArr(res, p)) res[countPointInTriangleSegment++].setPoint(p);
		}
		p.x = rect[0];
		p.y = rect[1] + rect[3];
		if (self.isInTriangle(triangle[0], triangle[1], triangle[2], p)) {
			if (!self.inArr(res, p)) res[countPointInTriangleSegment++].setPoint(p);
		}

		res = res.slice(0, countPointInTriangleSegment);
		self.getBound(res);
		res.sort(sortFromAngleContur);
		return res;
	};

	// есть ли точка p уже в масивве arr ?
	this.inArr = function (arr, p) {
		for (var i = 0; i < arr.length; ++i) {
			if (arr[i].x === p.x && arr[i].y === p.y) return true;
		}
		return false;
	};

	// круговая сортировка
	function sortFromAngleContur (a, b) {
		return self.getAngle(self._bound.center, a) - self.getAngle(self._bound.center, b);
	}

	// считам минимальные максимальный размеры и центр точек arrPoint
	this.getBound = function (arrPoint) {
		this._bound.min.set(999999, 999999);
		this._bound.max.set(-999999, -999999);
		for (var i = 0; i < arrPoint.length; i++) {
			// if (arrPoint[i].x === Infinity || arrPoint[i].y === Infinity) continue;
			this._bound.min.x = Math.min(this._bound.min.x, arrPoint[i].x);
			this._bound.max.x = Math.max(this._bound.max.x, arrPoint[i].x);
			this._bound.min.y = Math.min(this._bound.min.y, arrPoint[i].y);
			this._bound.max.y = Math.max(this._bound.max.y, arrPoint[i].y);
		}
		this._bound.center.set((this._bound.max.x / 2 + this._bound.min.x / 2), (this._bound.max.y / 2 + this._bound.min.y / 2));
		return this._bound;
	};

	// находится ли точка в диапазоне
	this.pointInSegment = function (point, p, p1) {
		return p.x <= point.x && point.x <= p1.x && p.y <= point.y && point.y <= p1.y;
	};

	// генерация ув
	this.generatePointUV = function (point, rect) {
		if (point.x === rect[0]) pointUv.x = 0;
		else if (point.x === rect[0] + rect[2]) pointUv.x = 1;
		else pointUv.x = (((point.x - rect[0]) % self.segment.width) / self.segment.width);

		if (point.y === rect[1]) pointUv.y = 0;
		else if (point.y === rect[1] + rect[3]) pointUv.y = 1;
		else pointUv.y = (((point.y - rect[1]) % self.segment.height) / self.segment.height);

		self.arrUV[self.lengthUV++] = (pointUv.x);
		self.arrUV[self.lengthUV++] = (pointUv.y);
	};


	/**
	* Является ли полигон в 2D вогнутой или выпуклой
	* @param {Array<Position>} arrPoint - масив точек, обход
	* @return {number} 0 для невычислимое например: коллинеарные точки 1 выпуклые -1 вогнутый
	*/
	this.convex = function (arrPoint) {
		var i, j, k, z, n = arrPoint.length;
		var flag = 0;
		if (n < 3) return 0;
		// Для выпуклого многоугольника все векторные произведения смежных сторон будут одинакового знака,
		// а если это не так, то будет присутствовать и произведение противоположного знака.
		for (i = 0; i < n; i++) {
			j = (i + 1) % n;
			k = (i + 2) % n;
			z = (arrPoint[j].x - arrPoint[i].x) * (arrPoint[k].y - arrPoint[j].y);
			z -= (arrPoint[j].y - arrPoint[i].y) * (arrPoint[k].x - arrPoint[j].x);
			if (z < 0) flag |= 1;
			else if (z > 0) flag |= 2;
			if (flag === 3) return -1;
		}
		if (flag != 0) return 1;
		else return 0;
	};


	/**
	* Площа полигона
	* @param {Array<Position>} contour - масив точек, обход
	* @return {number} Площа
	*/
	this.area = function (contour) {
		var n = contour.length;
		var a = 0.0;
		for (var p = n - 1, q = 0; q < n; p = q++) {
			a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
		}
		return a * 0.5;
	};

	// вырез
	this.snip = function (contour, u, v, w, n, vertices) {
		var p;
		var ax, ay, bx, by;
		var cx, cy, px, py;
		ax = contour[vertices[u]].x;
		ay = contour[vertices[u]].y;
		bx = contour[vertices[v]].x;
		by = contour[vertices[v]].y;
		cx = contour[vertices[w]].x;
		cy = contour[vertices[w]].y;
		if (Number.EPSILON > (((bx - ax) * (cy - ay)) - ((by - ay) * (cx - ax)))) return false;
		var aX, aY, bX, bY, cX, cY;
		var apx, apy, bpx, bpy, cpx, cpy;
		var cCROSSap, bCROSScp, aCROSSbp;
		aX = cx - bx;
		aY = cy - by;
		bX = ax - cx;
		bY = ay - cy;
		cX = bx - ax;
		cY = by - ay;
		for (p = 0; p < n; p++) {
			px = contour[vertices[p]].x;
			py = contour[vertices[p]].y;
			if (((px === ax) && (py === ay)) ||
				((px === bx) && (py === by)) ||
				((px === cx) && (py === cy))) continue;
			apx = px - ax;
			apy = py - ay;
			bpx = px - bx;
			bpy = py - by;
			cpx = px - cx;
			cpy = py - cy;
			// see if p is inside triangle abc
			aCROSSbp = aX * bpy - aY * bpx;
			cCROSSap = cX * apy - cY * apx;
			bCROSScp = bX * cpy - bY * cpx;
			if ((aCROSSbp >= -Number.EPSILON) && (bCROSScp >= -Number.EPSILON) && (cCROSSap >= -Number.EPSILON)) return false;
		}
		return true;
	};

	// триангуляция контура
	this.triangulate = function (contour, indices) {
		var n = contour.length;
		if (n < 3) return [];
		var result = [],
			vertices = [],
			verticesIndices = [];
		/* we want a counter-clockwise polygon in verts */
		var u, v, w;
		if (self.area(contour) > 0.0) {
			for (v = 0; v < n; v++) vertices[v] = v;
		} else {
			for (v = 0; v < n; v++) vertices[v] = (n - 1) - v;
		}
		var nv = n;
		/*  remove nv - 2 vertices, creating 1 triangle every time */
		var count = 2 * nv;
		/* error detection */
		for (v = nv - 1; nv > 2;) {
			/* if we loop, it is probably a non-simple polygon */
			if ((count--) <= 0) {
				//* * Triangulate: ERROR - probable bad polygon!
				// console.warn('  Unable to triangulate polygon! in triangulate()');
				if (indices) return verticesIndices;
				return result;
			}
			/*  consecutive vertices in current polygon, <u,v,w> */
			u = v;
			if (nv <= u) u = 0;
			/* previous */
			v = u + 1;
			if (nv <= v) v = 0;
			/* new v    */
			w = v + 1;
			if (nv <= w) w = 0;
			/* next     */
			if (self.snip(contour, u, v, w, nv, vertices)) {
				var a, b, c, s, t;
				/* true names of the vertices */
				a = vertices[u];
				b = vertices[v];
				c = vertices[w];
				/* output Triangle */
				result.push([contour[a], contour[b], contour[c]]);
				verticesIndices.push([vertices[u], vertices[v], vertices[w]]);
				/* remove v from the remaining polygon */
				for (s = v, t = v + 1; t < nv; s++, t++) {
					vertices[s] = vertices[t];
				}
				nv--;
				/* reset error detection counter */
				count = 2 * nv;
			}
		}
		if (indices) return verticesIndices;
		return result;
	};
	this.getAngle = function (a, b) {
		b = b || rezNull;
		a = a || rezNull;
		return Math.atan2(b.y - a.y, b.x - a.x);
	};

	// поворот точки на угол.   point - точка которую вращаем, centerPoint - если есть вращаем вокруг нее или вокруг 0,0(центра координат)
	this.rotationPoint = function (point, angel, centerPoint) {
		var X = 0;
		var Y = 0;
		if (centerPoint) {
			X = centerPoint.x + (point.x - centerPoint.x) * Math.cos(angel) - (point.y - centerPoint.y) * Math.sin(angel);
			Y = centerPoint.y + (point.y - centerPoint.y) * Math.cos(angel) + (point.x - centerPoint.x) * Math.sin(angel);
		} else {
			X = point.x * Math.cos(angel) - point.y * Math.sin(angel);
			Y = point.y * Math.cos(angel) + point.x * Math.sin(angel);
		}
		point.x = X;
		point.y = Y;
	};

	//
	/**
     * Находиться ли точка в треугольнике
     * @param {Point} p1 - точки треугольника
     * @param {Point} p2 - точки треугольника
     * @param {Point} p3 - точки треугольника
     * @param {Point} pTest - проверяемая точка
     * @return {boolean} Находиться ли точка в треугольнике ?
     */
	this.isInTriangle = function (p1, p2, p3, pTest) {
		var a = (p1.x - pTest.x) * (p2.y - p1.y) - (p2.x - p1.x) * (p1.y - pTest.y);
		var b = (p2.x - pTest.x) * (p3.y - p2.y) - (p3.x - p2.x) * (p2.y - pTest.y);
		var c = (p3.x - pTest.x) * (p1.y - p3.y) - (p1.x - p3.x) * (p3.y - pTest.y);
		if ((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0)) return true;
		return false;
	};

	// проверяем пересечений
	var d, da, db, ta, tb, dx, dy, distans, angel;
	var rez = new THREE.Vector2(0, 0);
	this.getPointOfIntersection = function (p1, p2, p3, p4) {
		d = (p1.x - p2.x) * (p4.y - p3.y) - (p1.y - p2.y) * (p4.x - p3.x);
		da = (p1.x - p3.x) * (p4.y - p3.y) - (p1.y - p3.y) * (p4.x - p3.x);
		db = (p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x);

		ta = da / d;
		tb = db / d;
		if (ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1) {
			dx = p1.x + ta * (p2.x - p1.x);
			dy = p1.y + ta * (p2.y - p1.y);
			rez.x = dx;
			rez.y = dy;
			return rez; // точка пересечения
		}
		return null;
	};


}

function PointT (x, y) {
	this.x = x;
	this.y = y;
}
PointT.prototype.set = function (x, y) {
	this.x = x;
	this.y = y;
};
PointT.prototype.setPoint = function (p) {
	this.x = p.x;
	this.y = p.y;
};


