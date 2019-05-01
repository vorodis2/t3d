

export function DParamObject (_cont, _x, _y, _fun) {
	DSettings.call(this);
	this.type = 'DParamObject';
	if(dcmParam==undefined)dcmParam=new DCM();
  	dcmParam.add(this);

	var self = this;
	this.fun = _fun;
	this._x = _x || 0;
	this._y = _y || 0;
	this.cont = _cont;
	this.infoInt = -1//_infoInt != undefined ? _infoInt : -1;

	this._height = 100;
	this._bWindow = true;
	this._ignTypeArr = false;
	this._actIgnBtn = false;
	this._title = 'DParamObject';
	this._priorityType = false;
	this._isScroll = false;// скрол панель 1 го уровня
	this.arrayColor = [];
	this.oShablon = [];

	this.textJSON = '{}';
	this.objJSON = {};

	this.funMinimize;
	this.funKorektObj=undefined// отдают на верх на коректировку обьекты наполнения
	this.parrentPLPO=undefined;
	this.tipRide = false;
	this.oP;
	this.ignBtn;
	this.wh = dcmParam.wh;
	this.w;

	this.typeArray = [];
	this.typeNotArray = null;
	this.typeYesArray = null;

	this.hhhhh=this._height

	if (this._bWindow) {
		this.w = new DWindow(this.cont, this._x, this._y, this._title, function () {
			if (self.funMinimize) {
				if (this.minimize == true) self._height = 1;
				else {
					self.draw();
					self._height = self.finalHeight;
				}
				self.funMinimize();
			}
		});
		
		this.w.content.add(this.content);			
		this.w.drag = false;
		this.w.width = this.width;
		this.w.height = this.height;

		/*if (this.infoInt == 0) {
			this.textArea = new PLTextArea(this.w.content, this._otstup, this._otstup, 'null');
			this.textArea.height = 60;
			this.textArea.width = this.w.width - this._otstup * 3 - 20;

			this.but = new PLButton(this.w.content, this.textArea.width + this._otstup * 2, this._otstup, '<', function () {
				self.setObjStr(self.textArea.text);
			});
			this.but.setStile(1, 64, 64);
			this.but.height = this.textArea.height;
			this.but.width = 20;

			this.funActMouse = function (b) {
				this.textArea.activMouse = !b;
			};
		}
		if (this.infoInt == 1) {*/
			//this.w.hasMinimizeButton = true;			
			this.w.drag = false;
			this._height = this.wh;
			this.w.fun = function () {
				/*if (this.minimize == true) {
					self._height = self.wh;
				} else {
					if (self.parrentPLPO != undefined) {
						// при открытии вложенного PLPO другие - закрываются
						for (var i = 0; i < self.parrentPLPO.arrPLPO.length; i++) {
							if (self.parrentPLPO.arrPLPO[i].w.minimize == false && self.parrentPLPO.arrPLPO[i].idArr != self.idArr) {
								self.parrentPLPO.arrPLPO[i].w.minimize = true;

								self.parrentPLPO.arrPLPO[i].w.fun();
							}
						}
					}
					self.draw();
					self._height = self.w.height;
				}
				if (self.parrentPLPO != undefined) self.parrentPLPO.draw();
				if (self.funMinimize) self.funMinimize(this.minimize);*/
			};
		//}
	} else {
		this.content.x = _x;
		this.content.y = _y;
	}


	this.arrType = [
		'numbercolor',
		'boolean',
		'number',
		'string'
	];

	for (var item in this.arrType) {
		this.oShablon[item] = [];
	}

	this.addObject = function (obj, tipRide) {
		
		if (tipRide != undefined) this.tipRide = tipRide;
		this.oP = obj;
		this.oShablon = [];

		// for( item of this.arrType) this.oShablon[item] = [];
		// замена для минимизации
		for (var i = 0; i < this.arrType.length; i++) {
			this.oShablon[this.arrType[i]] = [];
		}

		this.generatShablon();
		this.clearShablon();
		this.creatToShablon();
		this.startToShablon();
		this.draw2();
		this.setTextInput();
	};


	var ar, bb, bbb;
	// очищаем если есть левые параметры
	this.clearShablon = function (arrParam) {
		var i, j, k;
		
		if (this.typeYesArray != null && this._ignTypeArr == false) {
		
			for (i = 0; i < this.arrType.length; i++) {
				ar = this.oShablon[this.arrType[i]];
				
				for (j = 0; j < ar.length; j++) {
					bb = true;
					for (k = 0; k < this.typeYesArray.length; k++) {
						if (ar[j] == this.typeYesArray[k]) {
							bb = false;
						}
					}
					if (bb == true) {
						ar.splice(j, 1);
						k = 999;
						j = -1;
					}
				}
			}
			
			for (var s in this.oShablon) {
				bb = true;
				for (i = 0; i < this.arrType.length; i++) {
					if (this.arrType[i] == s) bb = false;
				}
				if (bb == true) {
					ar = this.oShablon[s];
					for (i = 0; i < ar.length; i++) {
						bbb = true;
						for (var ss in this.oP) {
							if (this.oP[ss] == ar[i]) {
								for (k = 0; k < this.typeYesArray.length; k++) {
									if (ss == this.typeYesArray[k]) {
										bbb = false;
										k = 999;
									}
								}
							}
						}
						if (bbb == true) {
							ar.splice(i, 1);
							i = -1;
						}
					}
				}
			}

		}

		if (this.typeNotArray != null && this._ignTypeArr == false) {
			for (i = 0; i < this.arrType.length; i++) {
				ar = this.oShablon[this.arrType[i]];
				for (j = 0; j < ar.length; j++) {
					for (k = 0; k < this.typeNotArray.length; k++) {
						if (ar[j] == this.typeNotArray[k]) {
							ar.splice(j, 1);
							k = 999;
							j = -1;
						}
					}
				}
			}
			for (var s in this.oShablon) {
				bb = true;
				for (i = 0; i < this.arrType.length; i++) {
					if (this.arrType[i] == s) bb = false;
				}
				if (bb == true) {
					ar = this.oShablon[s];
					for (i = 0; i < ar.length; i++) {
						for (var ss in this.oP) {
							if (this.oP[ss] == ar[i]) {
								for (k = 0; k < this.typeNotArray.length; k++) {
									if (ss == this.typeNotArray[k]) {
										ar.splice(i, 1);
										i = -1;
									}
								}
							}
						}
					}
				}
			}
		}
		

	};


	this.draw2 = function () {
	
		this.hhhhh = this.finalHeight//+pl102.wh/2;
		if(this.parrentPLPO!=undefined)this.hhhhh = this.finalHeight+pl102.wh-this._otstup;
		//else this.w.height = this.finalHeight;

		if (this.infoInt == 0) {
			this.textArea.y = this.finalHeight;
			this.but.y = this.finalHeight;
			this.hhhhh += this.textArea.height;
		}
		if (this.ignBtn) this.ignBtn.x = this.w.width - this.ignBtn.width - 3;
		this.w.height=this.hhhhh+dcmParam.wh
		self.updateScroll();

	};

	this.generatShablon = function () {
		var arrParam, arrParam1, arrParam2;
		var type;
		if (this.tipRide == true) {
			arrParam = this.oP;
			this.generatShablon2(arrParam);
		} else {
			arrParam1 = Object.getOwnPropertyNames(Object.getPrototypeOf(this.oP));
			arrParam2 = Object.getOwnPropertyNames(this.oP);
			this.generatShablon2(arrParam1);
		}
	};

	this.generatShablon2 = function (arrParam) {
		// Наполнение
		for (var item in arrParam) {
			if (this.tipRide != true) item = arrParam[item];
			if (item == 'constructor') continue;
			type = typeof this.oP[item];
			type = this.addPrefix(type, item, this.oP[item]);
			if (this.oShablon[type]) this.oShablon[type].push(item);
		}

		for (var c in this.oP) {
			if (this.oP[c] != undefined) {
				if (typeof this.oP[c] === 'object') {
					for (var i = 0; i < this.typeArray.length; i++) {
						if (this.oP[c] instanceof this.typeArray[i].type) {
							type = this.typeArray[i].name;
							if (this.oShablon[type] == undefined) this.oShablon[type] = [];
							if (this.typeArray[i].nameComp != undefined) {
								this.oShablon[type].push(c.replace('_', ''));
								if (this.arrType.indexOf(type) == -1) this.arrType.push(type);
							} else {
								this.oShablon[type].push(this.oP[c]);
							}
						}
					}
				}
			}
		}
		// Сортировка
		for (var type in this.oShablon) {
			this.oShablon[type].sort();
		}
	};

	this.component;
	this.arrPLPO = [];
	this.addComponent2 = function (_type, _name, _param) {
		var b = false;
		var g = this.typeArray;
		for (var i = 0; i < g.length; i++) {
			if (_name.indexOf(g[i].name) != -1 && g[i].nameComp == undefined) b = true;
		}

		if (b == true) {
			this.component = new PLParamObject(this.content, this.otstup, 0, this.down, 1);
			this.component.otstup = this.otstup;
			this.arrPLPO.push(this.component);
			this.arrPLPO[this.arrPLPO.length - 1].idArr = this.arrPLPO.length - 1;
			this.component.parrentPLPO = this;
			this.component.width = this._width - this.otstup * 2;
			this.component.funMinimize = this.funMin;
			if (_param != undefined) {
				if (_param.title != undefined) this.component.title = _param.title;
				if (_param.tipRide != undefined) this.component.tipRide = _param.tipRide;
			}

			if (this.dinFun != undefined) this.component.dinFun = this.dinFun;
		}
	};

	this.funMin = function (_component) {
		if (self.funMinimize) {
			self.draw();
			self._height = this.hhhhh;
			self.funMinimize();
		}
	};

	this.reDragObject = function (_component) {};

	this.creatToShablon = function () {
		for (var type in this.oShablon) {
			for (var i = 0; i < this.oShablon[type].length; i++) {
				this.addTypeComp(type, i);
			}
		}
	};

	this.addTypeComp = function (type, index) {
		var nameComp, comp, t;
		if (type == 'boolean') nameComp = 'DCheckBox';
		if (type == 'numbercolor') nameComp = 'DColor';
		if (type == 'number') nameComp = 'DSliderBig';
		if (type == 'string') nameComp = 'DStringDrag';
		
		for (var i = 0; i < this.typeArray.length; i++) {
			
			if (this.typeArray[i].name == type) {
				nameComp = 'PLParamObject';
				if (this.typeArray[i].nameComp != undefined) {
					nameComp = this.typeArray[i].nameComp;

				}
			}
		}

		if (this.objComp[type + index] == undefined && nameComp) {
		
			comp = this.addComponent(nameComp, type + index);
			this.funDragSlider(comp);
		}
	};

	this.setTextInput = function () {
		this.objJSON = this.getObjStr();
		this.textJSON = JSON.stringify(this.objJSON);
		if (this.infoInt == 0)self.textArea.text = this.textJSON;
	};

	this.getObjStr = function () {
		var o = {};
		var bb;
		for (var type in self.oShablon) {
			for (var i = 0; i < self.oShablon[type].length; i++) {
				bb = false;
				for (var j = 0; j < this.arrType.length; j++) {
					if (this.arrType[j] == type)bb = true;
				}
				if (bb == false) {
					for (var j = 0; j < this.arrComp2.length; j++) {
						if (this.arrComp2[j].type == 'PLParamObject') {
							for (var ss in this.oP) {
								if (this.oP[ss] == this.arrComp2[j].param) {
									o[ss] = this.arrComp2[j].getObjStr();
								}
							}
						}
					}
				} else {
					o[self.oShablon[type][i]] = self.oP[self.oShablon[type][i]];
				}

			}
		}
		return o;
	};


	this.setObjStr = function (_str) {
		var o = JSON.parse(_str);
		self.setObjStr2(o);
		self.korektObjParamMinMax();
		if (self.funD) self.funD();
	};

	this.setObjStr2 = function (o) {
		for (var c in o) {
			if (self.oP[c] != undefined) {
				if (typeof self.oP[c] === 'object') {
					for (var i = 0; i < this.arrComp2.length; i++) {
						if (this.arrComp2[i].param == self.oP[c]) {
							this.arrComp2[i].setObjStr2(o[c]);
						}
					}
				} else {
					self.oP[c] = o[c];
					if (self.objComp[c] != undefined) {
						self.objComp[c].value = o[c];
					}
				}
			}
		}
		this.korektObjParam();
	};

	this.korektObjParamMinMax = function () {
		if (this.object != undefined && this.object.param != undefined) {
			for (var i = 0; i < this.arrComp2.length; i++) {
				if (this.object.param[this.arrComp2[i].param] != undefined) {
					if (this.arrComp2[i].type == 'DSliderBig') {
						if (slider.isDinamMinMax === false) return;
						this.omm = this.diapozon(this.oP[this.arrComp2[i].param]);
						this.arrComp2[i].min = this.omm.min;
						this.arrComp2[i].max = this.omm.max;
					}

				}
			}
		}
		self.korektObjParam();
	};

	this.componentS;
	this.funComplit = function (s) {
		
		if(s==undefined)s=self.compFinal
		this.component = this;
		self.componentS = s;
		self.funDragSlider(this);
		self.setTextInput();
		
		if (self.fun) self.fun(s);
	};

	this.funD;
	this.funDrag = function () {
		if (self.funD) self.funD();
	};

	this.pointObject = { min: 0, max: 100 };
	this.arrayNum = [-10000000, -1000000, -100000, -10000, -5000, -1000, -500, -100, -50, -1, 0, 1, 50, 100, 500, 1000, 5000, 10000 , 100000 , 1000000 , 10000000 ];

	var zz = 1;
	this.diapozon = function (_num) {
		this.pointObject.min = 0;
		this.pointObject.max = 10;
		for (var i = 1; i < this.arrayNum.length - 1; i++) {
			if (this.arrayNum[i] == _num) {
				this.pointObject.min = this.arrayNum[i - 1];
				this.pointObject.max = this.arrayNum[i + 1];
				return this.pointObject;
			}
		}

		for (var i = 1; i < this.arrayNum.length - 1; i++) {
			if ((this.arrayNum[i - 1] < _num) && (this.arrayNum[i] > _num)) {
				this.pointObject.min = this.arrayNum[i - 1];
				this.pointObject.max = this.arrayNum[i];
				return this.pointObject;
			}
		}

		return this.pointObject;
	};

	this.omm;
	this.funDragSlider = function (slider) {
		if (!slider) return;		
		if (slider.type == 'DSliderBig') {
			if (slider.isDinamMinMax === false) return;
			if (slider.visiMinMax == false) slider.visiMinMax = true;
			this.omm = this.diapozon(slider.value);
			slider.min = this.omm.min;
			slider.max = this.omm.max;
			slider.value = slider.value;
		}
	};

	var bb;
	// Если нужен какой то уникальный слидер по названию
	this.addPrefix = function (type, param, znak) {
		if (type == 'string') {
			if (znak != undefined) {
				if (znak.length < 9) {
					if (znak.toLowerCase().indexOf('#') != -1) return type = 'numbercolor';
					if (znak.toLowerCase().indexOf('0x') != -1) return type = 'numbercolor';
				}
			}
		}
		return type;
	};

	this.formComp = function (_type, _i, _param, _obj) {
		var oo = { name: _type + _i, param: _param, title: _param };
		if (_type == 'number') {
			this.omm = this.diapozon(this.oP[_param]);
			oo.max = this.omm.max;
			oo.min = this.omm.min;
		}
		bb = false;
		for (var j = 0; j < this.arrType.length; j++) {
			if (this.arrType[j] == _type) {
				bb = true;
			}
		}
		if (bb == false) {
			for (var ss in this.oP) {
				if (this.oP[ss] == _param) {
					oo.title = ss;
					oo.tipRide = false;
					for (var ii = 0; ii < this.typeArray.length; ii++) {
						if (this.typeArray[ii].tipRide != undefined) {
							if (_param instanceof this.typeArray[ii].type) {
								oo.tipRide = this.typeArray[ii].tipRide;
							}
						}

						if (this.typeArray[ii].typeYesArray != undefined) {
							if (_param instanceof this.typeArray[ii].type) {
								oo.typeYesArray = this.typeArray[ii].typeYesArray;
							}
						}

						if (this.typeArray[ii].typeNotArray != undefined) {
							if (_param instanceof this.typeArray[ii].type) {
								oo.typeNotArray = this.typeArray[ii].typeNotArray;
							}
						}
					}
				}
			}
		} else {
			for (var ij = 0; ij < this.typeArray.length; ij++) {
				if (_type == this.typeArray[ij].name && this.typeArray[ij].typeYesArray != undefined) {
					oo.typeYesArray = this.typeArray[ij].typeYesArray;
				}
			}
		}



		/*if (this.typeYesArray != null && this._ignTypeArr == false) {

		}*/



		_obj.arrComp.push(oo);
	};

	this.startToShablon = function () {
		this.omm = this.diapozon(100);
		var oo, bb, jj;
		var o = {};
		o.arrComp = [];
		self.object = o;
		var pp, aa, aa2, bb;
		if (this._priorityType == true && this._ignTypeArr == false && this.typeYesArray != null) {
			aa = [];
			for (var s in this.oShablon) {
				for (var i = 0; i < this.oShablon[s].length; i++) {
					pp = 'null';
					if (typeof this.oShablon[s][i] === 'string') {
						pp = this.oShablon[s][i];
					} else {
						for (var ss in this.oP) {
							if (this.oP[ss] == this.oShablon[s][i]) pp = ss;
						}
					}
					aa.push(this.oShablon[s][i], s, pp);
				}
			}

			var sah = 0;
			for (var k = 0; k < this.typeYesArray.length; k++) {
				pp = this.typeYesArray[k];
				for (var i = 0; i < aa.length; i += 3) {
					if (pp == aa[i + 2]) {
						this.formComp(aa[i + 1], k, aa[i + 2], o);
					}
				}
				sah++;
			}
		} else {
			for (var type in this.oShablon) {
				for (var i = 0; i < this.oShablon[type].length; i++) {
					this.formComp(type, i, this.oShablon[type][i], o);
				}
			}
		}


		if (this.typeYesArray != null && this._ignTypeArr == false) {			
			var aa=[];
			for (var i = 0; i < this.typeYesArray.length; i++) {
				for (var j = 0; j <o.arrComp.length; j++) {
					if(o.arrComp[j].param==this.typeYesArray[i]){						
						aa.push(o.arrComp[j])						
						break;
					}
				}
			}
			o.arrComp=aa;
		}
		
		
		o.param = this.oP;
		o.fun = this.funDrag;
		o.funComplit = this.funComplit;

		if(this.funKorektObj!=undefined)this.funKorektObj(o);
		this.setObj(o);
	};

	this.funWH = function () {
		if (this.w) this.w.width = this.width;
	};

	this.getObj = function () {};

	var signBtn = 15;
	this.createIgnBtn = function () {
		this.ignBtn = new DButton(this.w, 0, 0, '+', function () {

			self.ignTypeArr = !self._ignTypeArr;

			if (self._ignTypeArr == true) this.text = '-';
			else this.text = '+';

			if (self.funMinimize) {
				if (self.w.minimize) self.w.minimize = false;

				self.draw();
				// self._height = self.finalHeight + self.wh + self.otstup;
				self._height = this.hhhhh;

				self.funMinimize();
			}
		});
		this.ignBtn.width = this.ignBtn.height = signBtn;
		this.ignBtn.visible = this._actIgnBtn;
		this.ignBtn.y = 7;
	};

	if (this._actIgnBtn == true) this.createIgnBtn();

	this._heightWindow = 100;

	this.updateScroll = function () {
		if (!this.scrollPane || !this.isScroll) return;

		var fheight = this.finalHeight;
		// -- finalHeight не учитывает колора который выподает todo нужно правильно расчитать finalHeight у SettingsBig
		for (var i = 0; i < this.arrComp2.length; i++) {
			if (!this.arrComp2[i].visible) continue;
			if (this.arrComp2[i].pLColorPickerPanel && this.arrComp2[i].pLColorPickerPanel.visible) {
				var bot = this.arrComp2[i].y + this.arrComp2[i].pLColorPickerPanel.y + this.arrComp2[i].pLColorPickerPanel.height;
				if (bot > fheight) {
					fheight += (bot - fheight);// если панелька колора ниже чем finalHeight
				}
				break;
			}
		}

		this.scrollPane.width = this._width;
		this.scrollPane.widthContent = this._width;
		this.scrollPane.height = this._heightWindow;
		this.scrollPane.heightContent = fheight;
		this.scrollPane.update();

		this.hhhhh = self._heightWindow;
		self._height = this.hhhhh;
	};

	this.initScroll = function () {
		if (this.w == undefined) return;
		if (this.scrollPane != undefined) return;
		this.scrollPane = new ScrollPane(this.w.content, 0, 0);
		this.scrollPane.addContent(this.content);
		this.scrollPane.boolPositOtctup = true;
		self.updateScroll();

	};
}

DParamObject.prototype.constructor = DParamObject;
Object.defineProperties(DParamObject.prototype, {
	/*bWindow: {
		set: function (v) {
			if (this._bWindow == v) return;
			this._bWindow = v;
			if (v == true) {
				if (!this.w) {
					this.w = new DWindow(this.cont, this._x, this._y, 'DParamObject Test');
					pl102.removeElement(this.w, true);
					this.w.width = this.width;
					this.w.height = this.height;
				}
				this.w.visible = true;
				this.w.addChild(this.content);
				this.content.x = 0;
				this.content.y = 30;
			} else {
				if (this.w) this.w.visible = false;
				this.cont.addChild(this.content);
				this.content.x = this._x;
				this.content.y = this._y;
			}
		},
		get: function () {
			return this._bWindow;
		}
	},*/

	x: {
		set: function (v) {
			this._x = v;
			if (this.w) this.w.x = this._x;
		},
		get: function () {
			return this._x;
		}
	},

	y: {
		set: function (v) {
			this._y = v;
			if (this.w) this.w.y = this._y;
		},
		get: function () {
			return this._y;
		}
	},

	height: {
		set: function (v) {

		},
		get: function () {
			return this._height;
		}
	},

	heightWindow: {
		set: function (v) {
			this._heightWindow = v;
			this.updateScroll();
		},
		get: function () {
			return this._heightWindow;
		}
	},

	visible: {
		set: function (v) {
			this._visible = v;
			if (this.w) this.w.visible = this._visible;

		},
		get: function () {
			return this._visible;
		}
	},

	title: {
		set: function (v) {
			if (this._title != v) {
				this._title = v;
				if (this.w) this.w.text = this._title;
			}
		},
		get: function () {
			return this._title;
		}
	},

	ignTypeArr: {
		set: function (v) {
			if (this._ignTypeArr == v) return;
			this._ignTypeArr = v;
			this.addObject(this.oP);
		},
		get: function () {
			return this._ignTypeArr;
		}
	},

	actIgnBtn: {
		set: function (v) {
			if (this._actIgnBtn == v) return;
			this._actIgnBtn = v;
			if (!this.ignBtn) this.createIgnBtn();
			this.ignBtn.visible = this._actIgnBtn;
		},
		get: function () {
			return this._actIgnBtn;
		}
	},

	priorityType: {
		set: function (v) {
			if (this._priorityType == v) return;
			this._priorityType = v;
			this.addObject(this.oP);
		},
		get: function () {
			return this._priorityType;
		}
	},

	isScroll: {
		set: function (v) {
			if (this._isScroll == v) return;
			this._isScroll = v;
			this.initScroll();
		},
		get: function () {
			return this._isScroll;
		}
	}
});
