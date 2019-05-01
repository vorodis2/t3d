

import { DCont } from './DCont.js';

export function DGallery (dCont, _x, _y, _fun) {
	DCont.call(this);
	this.type = 'DGallery';
	var self = this;
	this.dcmParam=dcmParam; 
  	this.dcmParam.add(this)
	if(dCont!=undefined)if(dCont.add!=undefined)dCont.add(this);

	this.x = _x || 0;
	this.y = _y || 0;
	this.fun = _fun;
	this._panelBool=false;

	this._widthPic = 64; // elements width
	this._heightPic = 64; // elements height
	this._width = 200;
	this._height = 200;
	this._otstup = 2;
	this._kolII = 2;
	this._index = -1;
	this._otstup1 = 5;
	this.clearIndex = true;


	this._color = dcmParam._color;
	this._color1 = dcmParam._color1;
	this._lineSize = 2;
	this._boolPositScrol = true;// выворот положений
	this._boolPositOtctup = true;// внутурь/наружу
	this._boolWheel = true;

	this.sahDelta = 20;

	this.funLoad;
	this.funOver;
	this.funOut;


	this.arrayKesh = [];
	this.arrayObj = [];
	this.array = [];

	this.ww = 1;
	this.wM = 1;
	this.hh = 1;
	this.hM = 1;

	/*this.graphicsMask = new PIXI.Graphics();
	this.addChild(this.graphicsMask);*/
	
	this.contPanel = new DCont();
	this.add(this.contPanel);

	this.content1 = new DCont();
	this.add(this.content1);

	

	this.content = new DCont();
	this.content1.add(this.content);

	//var b=new DButton(this,0,-50,"DButton")
	
	this.content1.div.style.clip = "rect(1px "+this._width+"px "+this._height+"px 0px)";
	/*this.graphics = new PIXI.Graphics();
	this.content.addChild(this.graphics);*/


	//this.content.mask = this.graphicsMask;

	// Вертикальный и горизонтальный скролл
	this.scrollBarH = new DScrollBarH(this, 0, this._height - this.otstup1, function () {
		self.scrolPos(false);
		// self.content.x = -this.scrolValue;
	});
	this.scrollBarH.offsetHit=20;
	
	this.scrollBarV = new DScrollBarV(this, this._width - this.otstup1, 0, function () {
		// self.content.y = -this.scrolValue;
		self.scrolPos(false);
	});
	this.scrollBarV.offsetHit=20;


	this.createZamen;// Замена типа кнопки
	this.complitLoad;// Окончание загрузки
	this.postDraw;// По окончанию отрисовки


	this.funOver;
	this.funOut;
	this.fOver = function (e) { if (self.funOver)self.funOver(e); };
	this.fOut = function (e) { if (self.funOver)self.funOver(e); };
	// Отрисовка элементов
	this.createDrawBox = function (_obj) {
		for (var i = 0; i < this.arrayKesh.length; i++) {
			if (this.arrayKesh[i].visible == false) {
				if (this.arrayKesh[i].isObj(_obj) == true) {
					return this.arrayKesh[i];
				}
			}
		}

		for (var i = 0; i < this.arrayKesh.length; i++) {
			if (this.arrayKesh[i].visible == false) {
				return this.arrayKesh[i];
			}
		}
		if (this.createZamen != undefined) {
			this.arrayKesh.push(this.createZamen());
		} else {
			this.arrayKesh.push(new DBox(this.content, 0, 0, this.downBtn));
		}
		if (this.funOver) this.arrayKesh[this.arrayKesh.length - 1].funOver = this.fOver;
		if (this.funOut) this.arrayKesh[this.arrayKesh.length - 1].funOut = this.fOut;
		this.arrayKesh[this.arrayKesh.length - 1].width = this._widthPic;
		this.arrayKesh[this.arrayKesh.length - 1].height = this._heightPic;
		this.arrayKesh[this.arrayKesh.length - 1].color = this._color;
		this.arrayKesh[this.arrayKesh.length - 1].color1 = this._color1;
		this.arrayKesh[this.arrayKesh.length - 1].idArrKesh = this.arrayKesh.length - 1;
		this.arrayKesh[this.arrayKesh.length - 1].funLoad = this.funLoad;
		this.arrayKesh[this.arrayKesh.length - 1].funOver = this.funOver;
		this.arrayKesh[this.arrayKesh.length - 1].funOut = this.funOut;

		return this.arrayKesh[this.arrayKesh.length - 1];
	};


	var ii, jj, ww, hh, bat, sahLoad, wM, hM, sliderOtstup;
	this.scrolPos = function (_bool) {
		if (_bool == true) {
			self.scrollBarV.value = this.content.y / (this._height - self.scrollBarV.heightContent) * 100;
			self.scrollBarH.value = this.content.x / (this._width - self.scrollBarH.widthContent) * 100;
		} else {
			self.content.y = (self.scrollBarV.value / 100) * (this._height - self.scrollBarV.heightContent);
			self.content.x = (self.scrollBarH.value / 100) * (this._width - self.scrollBarH.widthContent);
		}
	};


	this.korektPoIndex = function (_ind) {
		if (_ind == undefined)_ind = this._index;
		if (this.array[_ind] == undefined) return;

		if (this.array[_ind].x + this.content.x + this.array[_ind].width - this.otstup > this._width) this.content.x = -(this.array[_ind].x + this.array[_ind].width - this._width + this.otstup);
		if (this.array[_ind].x + this.content.x - this.otstup < 0) this.content.x = -this.array[_ind].x + this.otstup;


		if (this.array[_ind].y + this.content.y + this.array[_ind].height - this.otstup > this._height) this.content.y = -(this.array[_ind].y + this.array[_ind].height - this._height + this.otstup);
		if (this.array[_ind].y + this.content.y - this.otstup < 0) this.content.y = -this.array[_ind].y + this.otstup;

		this.scrolPos(true);

	};

	// Функция клика по иконке
	this.downBtn = function () {

		self.index = this.idArr;
		self.obj = self.array[this.idArr].object;


		if (self.fun) self.fun();
	};

	this.sahLoad = 0;
	this.sahRendom = 0;
	// Пошаговая загрузка
	this.funLoad = function () {
		self.sahLoad++;
		if (self.sahLoad > self.array.length) {
			if (this.complitLoad != undefined) this.complitLoad();
			self.draw();
		} else {
			if (this.sahRendom == self.sahRendom) {
				self.sahRendom = Math.round(Math.random() * 10000);
				self.array[self.sahLoad - 1].sahRendom = self.sahRendom;
				self.array[self.sahLoad - 1].startLoad(self.array[self.sahLoad - 1].object11);
			}
		}
	};


	// новый массив обьектов
	this.start = function (_array) {
		this.clear();
		this.arrayObj = _array;
		for (var i = 0; i < this.arrayObj.length; i++) {
			bat = this.createDrawBox(this.arrayObj[i]);
			bat.visible = true;
			bat.object11 = this.arrayObj[i];
			bat.idArr = this.array.length;
			this.array.push(bat);
		}
		this.draw();
		if (this.array.length != 0) {
			self.sahLoad = 0;
			this.sahRendom = Math.round(Math.random() * 10000);
			self.array[self.sahLoad].sahRendom = this.sahRendom * 1;
			this.funLoad();
		}

	};

	// перерисовка галереи
	this.draw = function () {
		if (this.preDraw) this.preDraw();

		ii = 0;
		jj = 0;
		sliderOtstup = this.otstup1 + this.otstup * 2;
		ww = 1;
		if (this._kolII > this.array.length)ww = this.array.length * (this._widthPic + this._otstup) + this._otstup;
		hh = this._heightPic + this._otstup * 2;
		for (var i = 0; i < this.array.length; i++) {
			this.array[i].x = ii * (this._widthPic + this._otstup) + this._otstup;
			this.array[i].y = jj * (this._heightPic + this._otstup) + this._otstup;
			if (this.array[i].x + this._widthPic + this._otstup > ww)ww = this.array[i].x + this._widthPic + this._otstup;
			hh = (jj + 1) * (this._heightPic + this._otstup) + this._otstup;
			ii++;
			if (ii >= this._kolII) {
				ii = 0;
				jj++;
			}
		}


		if (ww > this._width) this.scrollBarH.visible = true;
		else this.scrollBarH.visible = false;

		if (hh > this._height) this.scrollBarV.visible = true;
		else this.scrollBarV.visible = false;


		this.scrollBarH.widthContent = ww;
		this.scrollBarV.heightContent = hh;


		if (ww > this._width) {
			wM = this._width;
		} else {
			wM = ww;
		}
		if (hh > this._height) {
			hM = this._height;
		} else {
			hM = hh;
		}

		this.ww = ww;
		this.wM = wM;
		this.hh = hh;
		this.hM = hM;
		// this.scrollBarH     внизу
		// this.scrollBarV     сбоку

		//  this._boolPositScrol = true;//выворот положений
		// this._boolPositOtctup= true;//внутурь/наружу

		if (this._boolPositScrol) {
			if (this._boolPositOtctup) {
				this.scrollBarH.y = hM - this.otstup - this._otstup1;
				this.scrollBarV.x = wM - this.otstup - this._otstup1;
			} else {
				this.scrollBarH.y = hM + this.otstup;
				this.scrollBarV.x = wM + this.otstup;
			}


		} else {
			if (this._boolPositOtctup) {
				this.scrollBarH.y = this.otstup;
				this.scrollBarV.x = this.otstup;
			} else {
				this.scrollBarH.y = -this.otstup - this._otstup1;
				this.scrollBarV.x = -this.otstup - this._otstup1;
			}
		}

		if(this.panel!=undefined){			
			this.panel.width=this._width;
			this.panel.height=this._height;
		}

		// this.graphicsMask.clear();
		// this.graphicsMask.beginFill(0xff0000, 0);
		// this.graphicsMask.drawRect(0, 0, wM, hM);
		// this.graphicsMask.endFill();


		// if (this._boolWheel) {
		// 	this.graphics.clear();
		// 	this.graphics.beginFill(0xff0000, 0);
		// 	this.graphics.drawRect(0, 0, ww, hh);
		// 	this.graphics.endFill();

		// }
		if (this.postDraw) this.postDraw();
	};

	// положение слидеров
	this.drawScrol = function () {
		this.scrollBarH.height = this._otstup1;
		// this.scrollBarH.y=this._height-this.otstup1;
		this.scrollBarH.width = this._width;

		this.scrollBarV.width = this._otstup1;
		// this.scrollBarV.x=this._width-this.otstup1;
		this.scrollBarV.height = this._height;

		// this.scrollBarH.offsetHit = this._otstup1*2;
		// this.scrollBarV.offsetHit = this._otstup1*2;
	};

	this.drawScrol();


	// очистка
	this.clear = function () {
		this.clearPosit();

		for (var i = 0; i < this.arrayKesh.length; i++) {
			this.arrayKesh[i].clear();
		}
		this.array.length = 0;
	};
	this.clearIndex = true;
	this.clearPosit = function () {
		this.content.x = 0;
		this.content.y = 0;
		this.scrollBarH.scrolValue = 0;
		this.scrollBarV.scrolValue = 0;
		if (this.clearIndex) {
			this.index = -1;
		}
	};

	// прокрутка колесом мышки
	var hhh, www;
	this.mousewheel = function (e) {
		trace(e)
		if (self.kolII <= self.array.length) {
			hhh = (self.heightPic + self.otstup) * (Math.ceil(self.array.length / self.kolII)) - self._height;
			www = (self.widthPic + self.otstup) * self.kolII - self._width;
		} else {
			hhh = self.heightPic + self.otstup - self._height;
			www = (self.widthPic + self.otstup) * self.array.length - self._width;
		}

		if (self.scrollBarV.visible) {
			if (e.deltaY > 0) {
				if (self.content.y >= 0) {
					self.content.y = 0;
					self.scrollBarV.value = 0;
				} else {
					self.scrollBarV.value -= self.sahDelta;
					self.content.y += self.sahDelta;
				}
			} else {
				if (self.content.y <= -(hhh + self.otstup)) {
					self.content.y = -(hhh + self.otstup);
					self.scrollBarV.value = hhh;
				} else {
					self.scrollBarV.value += self.sahDelta;
					self.content.y -= self.sahDelta;
				}

			}

			//
		} else if (self.scrollBarH.visible) {
			if (e.deltaY > 0) {
				if (self.content.x >= 0) {
					self.content.x = 0;
					self.scrollBarH.value = 0;
				} else {
					self.scrollBarH.value -= self.sahDelta;
					self.content.x += self.sahDelta;
				}
			} else {
				if (self.content.x <= -(www + self.otstup)) {
					self.content.x = -(www + self.otstup);
					self.scrollBarH.value = www;
				} else {
					self.scrollBarH.value += self.sahDelta;
					self.content.x -= self.sahDelta;
				}
			}
		}
	};

	

	var bb = this._boolWheel;
	this._boolWheel = null;
	this.boolWheel = bb;

}
DGallery.prototype = Object.create(DCont.prototype);
DGallery.prototype.constructor = DGallery;
Object.defineProperties(DGallery.prototype, {
	
	
	panelBool: { // вынести\внести отступ за элемент
		set: function (value) {
			if (this._panelBool == value) return;
			this._panelBool = value;
			if(this.panel==undefined){
				this.panel=new DPanel(this.contPanel,0,0);
				this.panel.width=this._width;
				this.panel.height=this._height;
			}
			this.panel.visible=value;
		},
		get: function () {
			return this._panelBool;
		}
	},


	boolWheel: { // включить\выключить прокрутку колесом
		set: function (value) {
			if (this._boolWheel == value) return;
			this._boolWheel = value;
			this.interactive = this._boolWheel;

			if (this._boolWheel == true) {				
				this.div.addEventListener('mousewheel', this.mousewheel)
			} else {				
				this.div.removeEventListener('mousewheel', this.mousewheel)
			}
		},
		get: function () {
			return this._boolWheel;
		}
	},
	boolPositScrol: { // вынести\внести отступ за элемент
		set: function (value) {
			if (this._boolPositScrol == value) return;
			this._boolPositScrol = value;
			this.draw();
		},
		get: function () {
			return this._boolPositScrol;
		}
	},

	boolPositOtctup: { // зеркальное отображение слайдеров
		set: function (value) {
			if (this._boolPositOtctup == value) return;
			this._boolPositOtctup = value;
			this.draw();
		},
		get: function () {
			return this._boolPositOtctup;
		}
	},


	color: { // цвет актива
		set: function (value) {
			if (this._color == value) return;
			this._color = value;
			for (var i = 0; i < this.arrayKesh.length; i++) {
				this.arrayKesh[i].color = this.color;
			}
		},
		get: function () {
			return this._color;
		}
	},
	color1: { // цвет актива
		set: function (value) {
			if (this._color1 == value) return;
			this._color1 = value;
			for (var i = 0; i < this.arrayKesh.length; i++) {
				this.arrayKesh[i].color1 = this.color1;
			}
		},
		get: function () {
			return this._color1;
		}
	},


	lineSize: { // ширина контура
		set: function (value) {
			if (this._lineSize == value) return;
			this._lineSize = value;
			for (var i = 0; i < this.arrayKesh.length; i++) {
				this.arrayKesh[i].lineSize = this.lineSize;
			}
		},
		get: function () {
			return this._lineSize;
		}
	},

	heightPic: {// верх кнопка
		set: function (value) {
			if (this._heightPic == value) return;
			this._heightPic = value;
			for (var i = 0; i < this.arrayKesh.length; i++) {
				this.arrayKesh[i].height = this._heightPic;
			}
			this.draw();
		},
		get: function () {
			return this._heightPic;
		}
	},

	widthPic: {// верх кнопки
		set: function (value) {
			if (this._widthPic == value) return;
			this._widthPic = value;
			for (var i = 0; i < this.arrayKesh.length; i++) {
				this.arrayKesh[i].width = this._widthPic;
			}
			this.draw();
		},
		get: function () {
			return this._widthPic;
		}
	},

	width: {// верх холеоеи
		set: function (value) {
			if (this._width == value) return;
			this._width = value;
			this.content1.div.style.clip = "rect(1px "+this._width+"px "+this._height+"px 0px)";
			this.content1.x=0
			this.drawScrol();
			this.draw();
		},
		get: function () {
			return this._width;
		}
	},
	height: {// верх холеоеи
		set: function (value) {
			if (this._height == value) return;
			this._height = value;
			this.content1.div.style.clip = "rect(1px "+this._width+"px "+this._height+"px 0px)";
			this.content1.x=0
			this.drawScrol();

			this.draw();
		},
		get: function () {
			return this._height;
		}
	},

	otstup: {// Отступ
		set: function (value) {
			if (this._otstup == value) return;
			this._otstup = value;
			for (var i = 0; i < this.arrayKesh.length; i++) {
				this.arrayKesh[i].otstup = this._otstup;
			}
			this.draw();
		},
		get: function () {
			return this._otstup;
		}
	},
	otstup1: {// Отступ
		set: function (value) {
			if (this._otstup1 == value) return;
			this._otstup1 = value;
			this.drawScrol();
			this.draw();
		},
		get: function () {
			return this._otstup1;
		}
	},
	kolII: {// Количество в ряду
		set: function (value) {
			if (this._kolII == value) return;
			this._kolII = value;
			var ii = this.index;
			this.clearPosit();
			this.index = ii;
			this.drawScrol();
			this.draw();

		},
		get: function () {
			return this._kolII;
		}
	},
	index: {// Активный элемент
		set: function (value) {

			if (this.array[value] != undefined) {
				this.korektPoIndex(value);
			}
			if (this._index == value) return;
			this._index = value;

			for (var i = 0; i < this.array.length; i++) {
				if (this._index == i) this.array[i].activ = true;
				else this.array[i].activ = false;
			}

		},
		get: function () {
			return this._index;
		}
	},
	x: {// Активный элемент
		set: function (value) {			
			if (this._x == value) return;
			this._x = value;
			this.position.x = value;
		},
		get: function () {
			return this._x;
		}
	},
	y: {// Активный элемент
		set: function (value) {			
			if (this._y == value) return;
			this._y = value;
			this.position.y = value;
		},
		get: function () {
			return this._y;
		}
	},
	activMouse: {// Активный элемент
		set: function (value) {			
			if (this._y == value) return;
			this._activMouse = value;
			 if(value==true){
				this.alpha=1;
					
		    }else{
		    	this.alpha=0.7;			    	
		    }				
		},
		get: function () {
			return this._activMouse;
		}
	}


		/*set activMouse(value) {		
		if(this._activMouse!=value){
		    this._activMouse = value;		    
		    if(value==true){
				//this.alpha=1;
				this.div.style.pointerEvents=null;	
		    }else{
		    	//this.alpha=0.7;		    	
		    	this.div.style.pointerEvents="none";	
		    }		        
		}		
	}
  	get activMouse() { return  this._activMouse;}	*/

});


export function DBox(_cont, _x, _y, _fun) {
	DCont.call(this);
	this.type = 'DBox';
	var self = this;
	_cont.add(this);

	this.x = _x || 0;
	this.y = _y || 0;
	this.fun = _fun;


	this._link = '';
	this._title = '';
	this._width = 100;
	this._height = 100;
	this._otstup = 2;
	this.clearIndex = true;

	this._object = null;


	this._activ = false;

	this.idArr = -1;
	this.idArrKesh = -1;
	this.id = -1;
	this.funLoad;

	this.postDraw;
	this.funOver;
	this.funOut;

	this.content = new DCont();
	this.add(this.content);

	this.panel = new DPanel(this.content, 0, 0);


	this.image = new DImage(this.content, 0, 0, undefined, function () {
	
		self.draw();
		if (self.funLoad) self.funLoad();
	});

	this.label = new DLabel(this.content, 0, 0, '|');

	//this.image._preloaderBool = true;
	this.image.visible = false;
	this.label.visible = false;



	/*this.graphics = new PIXI.Graphics();
	this.content.addChild(this.graphics);*/

	this.object;
	this._color = "#ffffff";
	this._color1 = "#ff0000";
	this._lineSize = 2;
	this.boolOut = true;

	var ss;
	// Отрисовка и позиционирование иконки, обводки
	this.draw = function () {
		/*this.graphics.clear();
		if (this.boolOut == true) this.graphics.beginFill(0xffffff, 0);
		else this.graphics.beginFill(0xffffff, 0.2);
		this.graphics.drawRect(0, 0, this._width, this._height);
		this.graphics.endFill();
		if (this._activ == true) {
			this.graphics.lineStyle(this._lineSize, this._color, 1);
			this.graphics.drawRect(this._lineSize / 2, this._lineSize / 2, this._width - this._lineSize, this._height - this._lineSize);
			this.graphics.endFill();
		}*/

		ss = (this._width - this._otstup * 2) / this.image.picWidth;
		if (ss > (this._height - this._otstup * 2) / this.image.picHeight)ss = (this._height - this._otstup * 2) / this.image.picHeight;
		//this.image.scale = ss;
		//this.image.scale = 0.1;
		//this.image.scale.y = ss;
		
		this.image.x = 0;
		this.image.width=this.image.picWidth*ss;
		this.image.height=this.image.picHeight*ss;

		this.image.x = (this._width - this.image.picWidth * ss) / 2;
		this.image.y = (this._height - this.image.picHeight * ss) / 2;

		this.label.x = (this._width - this.label.curW) / 2;
		this.label.y = this._height - this.label.curH - this._otstup;
		if (this.postDraw) this.postDraw();
	};

	this.isObj = function (_obj) {
		if (this.object != undefined) {
			if (_obj != undefined) {
				if (_obj.link != undefined) {
					if (this.object.link != undefined) {
						if (this.object.link == _obj.link) {
							return true;
						}
					}
				}
			}
		}

		return false;
	};

	var b;
	// Добавление картинки и текста, пошаговая загрузка.
	this.startLoad = function (_obj) {
		this.object = _obj;

		if (_obj.title) {
			this.label.text = _obj.title;
			this.label.value = _obj.title;
			this.label.visible = true;
		}
		if (_obj.src) {
			this.image.visible = true;
			if (this.image.link == _obj.src) {
				if (self.funLoad) self.funLoad();
			} else {
				this.image.width = 100;
				this.image.height = 100;
				this.image.link = _obj.src;
			}
		}else{
			if (self.funLoad) self.funLoad();
		}
		this.draw();
	};
	// Очистка
	this.clear = function () {
		this.visible = false;
		this.label.visible = false;
		this.image.visible = false;
		if (this.clearIndex) {
			this.activ = false;
		}

	};
	this.funOver;
	this.funOut;
	// События
	this.mouseOver = function (e) {
		self.boolOut = false;
		if(self._activ==false)self.panel.color1=dcmParam.compToHexArray(dcmParam.hexDec(self._color1), -30);
		else self.panel.color1=dcmParam.compToHexArray(dcmParam.hexDec(self._color), -30);
		if (self.funOver) self.funOver(this);
	};
	this.mouseOut = function (e) {		
		
		if(self._activ==false)self.panel.color1=self._color1;
		else self.panel.color1=self._color;
		
		if (self.funOut) self.funOut(this);
	};
	this.mouseDown = function (e) {		
		if (self.fun) self.fun();
	};
	this.draw();


	this.panel.div.addEventListener("mouseout", this.mouseOut);
	this.image.image.addEventListener("mouseout", this.mouseOut);

	this.panel.div.addEventListener("mouseover", this.mouseOver);
	this.image.image.addEventListener("mouseover", this.mouseOver);




	this.image.image.addEventListener("mousedown", this.mouseDown)
	this.panel.div.addEventListener("mousedown", this.mouseDown)

	/*

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



	this.graphics.interactive = true;
	this.graphics.buttonMode = true;
	this.graphics.on('mouseover', this.mouseOver);
	this.graphics.on('mouseout', this.mouseOut);
	this.graphics.on('mousedown', this.mouseDown);*/


}
DBox.prototype = Object.create(DCont.prototype);
DBox.prototype.constructor = DBox;
Object.defineProperties(DBox.prototype, {
	activ: { // активный элемент
		set: function (value) {
			if (this._activ == value) return;
			this._activ = value;
			if(this._activ==false)this.panel.color1=this._color1;
			else this.panel.color1=this._color;

		},
		get: function () {
			return this._activ;
		}
	},
	color: { // цвет обводки
		set: function (value) {
			if (this._color == value) return;
			this._color = value;
			this.draw();

		},
		get: function () {
			return this._color;
		}
	},	
	color1: { // цвет актива
		set: function (value) {
			if (this._color1 == value) return;
			this._color1 = value;
			
		},
		get: function () {
			return this._color1;
		}
	},
	lineSize: { // ширина обводки
		set: function (value) {
			if (this._lineSize == value) return;
			this._lineSize = value;
			this.draw();

		},
		get: function () {
			return this._lineSize;
		}
	},
	otstup: { // Отступ
		set: function (value) {
			if (this._otstup == value) return;
			this._otstup = value;
			this.draw();
		},
		get: function () {
			return this._otstup;
		}
	},
	width: { // ширина элемента
		set: function (value) {
			if (this._width == value) return;
			this._width = value;
			this.panel.width = this._width;
			this.draw();
		},
		get: function () {
			return this._width;
		}
	},
	height: { // высота элемента
		set: function (value) {
			if (this._height == value) return;
			this._height = value;
			this.panel.height = this._height;
			this.draw();
		},
		get: function () {
			return this._height;
		}
	}
});
