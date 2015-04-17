// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Genogram                                                           │ \\
// │                                                                    │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function(window){

    var RelationshipFlag = {
        normal   : 0,
        Adopted  : 1,
        InLaw    : 2,
        Foster   : 3,
        Half     : 4,
        Step     : 5,
        Unknow   : 6
    };

    /*
    var PersonsGap = function(person1, person2){
        var x = Math.abs(person1.x() - person2.x());
        var y = Math.abs(person1.y() - person2.y());
        return {x:x,y:y};
    };
    */
	var gapX = 80;
    var gapY = 100;
    var Person = function(paper, opts){
        if(!paper) return;
        var that = this;
        /**************
         Config
         ***************/
        this.id = opts.id;
		that.none = opts.none || false;
		that.unkown = opts.unkown || false;
		that.SpecialFlag = opts.SpecialFlag || 0;
        that._gender = opts.gender || null;
        that._ifCurrent = opts.current || null;
        that.shape = null;
        that.shape2 = null;
        that.text = null;
        that.deathSvg = null;
        that.ageSvg = null;
        that.name = opts.name || "";
        that.age = opts.age || "";
        that.death = opts.death || false;
        that._dia = 11;
        that._rect = 20;
        that._x = opts.x || 10;
        that._y = opts.y || 10;
        that._strokeColor = '#F37883';
        that._rectStrokeColor = '#299DCD';
        that._strokeWidth = 2;
        /*******************
         Private Func
         ********************/
        var _f = {
            init: function(){
                if(that.none){
                    this.drawNone();
                    return
                }
                if(that.unkown){
                    this.drawUnkown();
                    return
                }
                if(that._gender == 'Male')
                    this.drawMale();
                else if(that._gender == 'Female')
                    this.drawFemale();
                else
                    this.drawUnkownSex();
                this.drawText();
                this.drawDeath();
				this.drawAge();
            },
            drawAge: function () {
				if(!that.age)
					return;
				var disY = that._gender != 'Male'&&that._gender != 'Female'?15:8;
                if (that.ageSvg) {
					that.ageBgSvg.attr({x:that._x-4,y: that._y+disY-5});
                    that.ageSvg.attr('x', that._x);
                    that.ageSvg.attr('y', that._y + disY);
                } else {
					that.ageBgSvg = paper.rect(that._x-4, that._y+disY-5,10,10);
					that.ageBgSvg.attr('fill','#fff');
					that.ageBgSvg.attr('stroke','#fff');
                    that.ageSvg = paper.text(that._x, that._y+disY, that.age);
                }
            },
            drawDeath: function () {
                if (!that.death || that.none) return;
                if (!that.deathSvg) {
                    if (that._ifCurrent) {
                        that.deathSvg = paper.text(that._x + 1, that._y + 8, 'X');
                        that.deathSvg.attr({
                            "font-size": "32px"
                        });
                    } else if (that._gender != 'Male' && that._gender != 'Female') {
                        that.deathSvg = paper.text(that._x + 2, that._y, 'X');
                        that.deathSvg.attr({
                            "font-size": "20px"
                        });
                    } else {
                        that.deathSvg = paper.text(that._x , that._y + 8, 'X');
						that.deathSvg.attr({
                            "font-size": "27px"
                        });
                    }
                } else {
                    if (that._ifCurrent) {
                        that.deathSvg.attr({
                            "x": that._x + 1,
                            "y": that._y + 8
                        });
                    } else if (that._gender != 'Male' && that._gender != 'Female') {
                        that.deathSvg.attr({
                            "x": that._x + 2,
                            "y": that._y
                        });
                    } else {
                        that.deathSvg.attr({
                            "x": that._x ,
                            "y": that._y + 8
                        });
                    }
                }
            },
            drawText: function(){
                if(!that.name)return;
				if(that.text){
					that.text.attr({'x':that._x+1,'y':that._y+30});
					return;
				}
                that.text= paper.text(that._x+1, that._y+30, that.name);
            },
            drawNone:function(){
                that.shape = paper.rect(that._x-3, that._y-2, that._rect+10, that._rect+10);
                that.shape.attr('stroke', '#fff');
                that.shape.attr('stroke-color','#fff ');
            },
            drawUnkown: function(){
                that.shape = paper.rect(that._x-3, that._y-2, that._rect+10, that._rect+10);
                that.shape.attr('stroke', '#6E6E6E');
                that.shape.attr('stroke-dasharray','- ');
            },
            drawUnkownSex: function(){
                that.shape = paper.text(that._x+2, that._y, "?").attr({
                    font: "20px sans-serif"
                });
            },
            drawMale: function(){
                if(that._ifCurrent){
					if(that.shape2){
						that.shape2.attr({x:that._x-that._rect/2-3,y:that._y-5});
					}else{
						that.shape2 = paper.rect(that._x-that._rect/2-3, that._y-5, that._rect+6, that._rect+6);
						that.shape2.attr('stroke', that._rectStrokeColor);
						that.shape2.attr('stroke-width',2);
					}
                }
				if(that.shape){
					that.shape.attr({x:that._x-that._rect/2,y:that._y-2});
				}else{
					that.shape = paper.rect(that._x-that._rect/2, that._y-2, that._rect, that._rect);
					that.shape.attr('stroke', that._rectStrokeColor);
					that.shape.attr('stroke-width',that._strokeWidth);
				}
            },
            drawFemale: function(){
                if(that._ifCurrent){
					if( that.shape2 ){
						that.shape2.attr({cx:that._x,cy:that._y+7}); 
					}else{
						that.shape2 = paper.circle(that._x, that._y+7, that._dia+4);
						that.shape2.attr('stroke', that._strokeColor);
						that.shape2.attr('stroke-width',2);
					}
                }
				if(that.shape){
					that.shape.attr({cx:that._x,cy:that._y+7});
				}else{
					that.shape = paper.circle(that._x, that._y+7, that._dia);
					that.shape.attr('stroke', that._strokeColor);
					that.shape.attr('stroke-width',that._strokeWidth);
				}
            }
        }
        _f.init();
        /*********************
         Instance Func
         **********************/
        that.x = function(x){
            if(x){
                that._x = x;
                if(that._gender == 'Male'){
                    //that.shape.attr('x',that._x-3);
                    //if(that.shape2)that.shape2.attr('x',that._x-8);
					_f.drawMale();
                }else if(that._gender == 'Female'){
                    //that.shape.attr('cx',that._x+2);
                    //if(that.shape2)that.shape2.attr('cx',that._x);
					_f.drawFemale();
                }else{
                    that.shape.attr('x',that._x+2);
                }
                if(that.marriageLine && that.marriageLine.length>0){
                    for(var i in that.marriageLine){
                        if(that.marriageLine[i].line.id){
                            that.marriageLine[i].init();
                        }
                    }
                }
				_f.drawText();
                _f.drawDeath();
				_f.drawAge();
            }else{
                return that._x;
            }
        }
        that.y = function(y){
            if(y){
                that._y = y;
                if(that._gender == 'Male'){
                    //that.shape.attr('y',that._y-2);
                    //if(that.shape2)that.shape2.attr('y',that._y-7);
					_f.drawMale();
                }else if(that._gender == 'Female'){
                    //that.shape.attr('cy',that._y+2);
                    //if(that.shape2)that.shape2.attr('cy',that._y+2);
					_f.drawFemale();
                }else{
                    that.shape.attr('y',that._y);
                }
                
                if(that.marriageLine && that.marriageLine.length>0){
                    for(var i in that.marriageLine){
                        if(that.marriageLine[i].line.id){
                            that.marriageLine[i].init();
                        }
                    }
                }
				_f.drawText();
				_f.drawDeath();
                _f.drawAge();
            }else{
                return that._y;
            }
        }
    };

    var Line = function(paper,person, person2 ,relationship){
        var that = this;
        that.paper = paper;
        that.person1 = person;
        that.person2 = person2;
        that.relationship = relationship;
        that.y;
        that.startX;
        that.endX;
        var drawFunc = {
            marriage:function(){
                var gap = 45;
                var startX,startY,v = 15, h,end;
                that.startX = startX = that.person1.x() + 2;
                that.y = startY = that.person1.y() + gap;
                that.endX = h = that.person2.x();
                end = that.person2.y() + gap;
                that.line = that.paper.path('M '+ startX +','+startY+'V '+(startY+v)+'H '+h+'V '+end);
                that.person1.marriageLine = that.person1.marriageLine || [];
                that.person2.marriageLine = that.person2.marriageLine || [];
                that.person1.marriageLine.push(that);
                that.person2.marriageLine.push(that);
            },
            child: function(type){
                that.person1;
                var startX = that.person2.x()+2,startY = that.person2.y() - 10;
                var v = 30;
                that.line = that.paper.path('M '+ startX +','+startY+'V '+(startY-v));
                if(type == 'adopted child'){
                    var cls = 'adopted-child';
                    that.line.attr('stroke','blue');
                    that.line.attr('stroke-dasharray','--');
                }else if(type == 'foster child'){
                    var cls = 'foster-child';
                    that.line.attr('stroke','green');
                    that.line.attr('stroke-dasharray','.');
                }
            },
            lineToNone: function(flag){
                var gap = 45;
                var startX,startY,v = 15, h;
                that.startX = startX = that.person1.x() + 2;
                that.y = startY = that.person1.y() + gap;
                if(flag)
					that.endX = h = that.person2.x()+3;
				else
					that.endX = h = that.person2.x()-gapX/2+3;
                that.line = that.paper.path('M '+ startX +','+startY+'V '+(startY+v)+'H '+h);
                that.person1.marriageLine = that.person1.marriageLine || [];
                that.person2.marriageLine = that.person2.marriageLine || [];
                that.person1.marriageLine.push(that);
                that.person2.marriageLine.push(that);
            },
            toChild: function (flag) {
                var startX = that.person1.x() + gapX / 2 + 3,
						startY = that.person1.y() + 60,
						v = startY + 14,
						h = that.person2.x() + 2,
						v2 = v + 15;
				if(flag == 'adopted'){
				    that.line = that.paper.path('M ' + startX + ',' + startY + 'V ' + v + 'H ' + h + 'V ' + v2);
					that.line.attr('stroke','blue');
                    that.line.attr('stroke-dasharray','--');
				} else if (flag == 'foster') {
				    //v += 6;
				    that.line = that.paper.path('M ' + startX + ',' + startY + 'V ' + v + 'H ' + h + 'V ' + v2);
					that.line.attr('stroke','green');
                    that.line.attr('stroke-dasharray','.');
				}
			},
            toChildSingle: function (flag) {
                var startX = that.person1.x(),
						startY = that.person1.y() + 49,
						v = startY + 25,
						h = that.person2.x() + 2,
						v2 = v + 15;
				if(flag == 'adopted'){
					that.line = that.paper.path('M '+ startX +','+startY+'V '+v+'H '+h+'V '+v2);
					that.line.attr('stroke','blue');
                    that.line.attr('stroke-dasharray','--');
				} else if (flag == 'foster') {
				    //v += 9;
					that.line = that.paper.path('M ' + startX + ',' + startY + 'V ' + v + 'H ' + h + 'V ' + v2);
					that.line.attr('stroke','green');
                    that.line.attr('stroke-dasharray','.');
				}
			}
        };
        that.init = function(){
            if(that.line)that.line.remove();
            switch (that.relationship){
                case 'marriage':
                    drawFunc.marriage();
                    break;
                case 'child':
                    drawFunc.child();
                    break;
                case 'adopted child':
                    drawFunc.child('adopted child');
                    break;
                case 'foster child':
                    drawFunc.child('foster child');
                    break;
                case 'lineToNone':
                    drawFunc.lineToNone();
					break;
				case 'lineToPerson':
					drawFunc.lineToNone(true);
					break;
				case 'adoptedtochild':
					drawFunc.toChild('adopted');
					break;
				case 'fostertochild':
					drawFunc.toChild('foster');
					break;
				case 'adoptedtochildsingle':
					drawFunc.toChildSingle('adopted');
					break;
				case 'fostertochildsingle':
					drawFunc.toChildSingle('foster');
					break;

            }
        };
        that.init();
    };

    var DrawFunc = function(paper, opts){
        if(!paper) return;
        var that = this;
        that.paper = paper;
        /***************
         Config
         ***************/
        var _opts = {
            origin:{
                x: paper.width/2,
                y: paper.height/2
            },
            gapX: gapX,
            gapY: gapY,
            dataSource: null
        };
        for(var i in opts){
            _opts[i] = opts[i];
        }
        /*******************
         Private Func
         ********************/
		var _e = {
			initZoom: function(){
				var zoomoutDom = $('#geno-zoom-out');
				var zoominDom = $('#geno-zoom-in');
				var zoomsliderDom = $('#geno-zoom-slider');
				var top = 23;
				zoomoutDom.bind('click',function(){
					if(that.zoom<=0.61){
						top = 46;
					}else{
						top+=11.5
					}
					zoomsliderDom.css('top',top+"px");
					that.zoomOut();
				});
				zoominDom.bind('click',function(){
					if(that.zoom>=1.39){
						top = 0;
					}else{
						top-=11.5
					}
					zoomsliderDom.css('top',top+"px");
					that.zoomIn();
				});
			}
		}
		_e.initZoom();
		
        var generations = null;
        var _f = {
            convertDataAndDraw: function(person){
                if(!person)return;
                generations = {
                    cPre2:{
						PaternalGrandparents:[],
						MaternalGrandparents:[],
                        line:[]
                    },
                    cPre1:{
                        normal:{father:null,mother:null},
						adopted:{father:null,mother:null},
						foster:{father:null,mother:null},
						leftline:[]
                    },
                    c0:{
                        current:null,
                        mate:[],
                        bOs:[],
                        line:[]
                    },
                    c1:{
                        c1line:[],
                        line:[],
						bOs:[],
                        children:[]
                    }
                };
                var current = new Person(that.paper,{
                    id:person.Id,
                    x:_opts.origin.x,
                    y:_opts.origin.y,
                    gender:person.Sex,
                    name: person.Name,
                    age: person.Age,
                    death: person.Deceased,
                    current:true,
					SpecialFlag:person.SpecialFlag
                });
                generations.c0.current = current;
                generations.c0.line.push(current);

                var mates = person.Mate;
                var bOs = person.BrothersAndSisters;
                var children = person.Children;
                // ## 1.Draw wife or husband
                var normalCount = 0;
                for(var i in mates){
                    var p = mates[i];
                    if(p.SpecialFlag == RelationshipFlag.normal) {
                        this.drawWifeOrHusband(p);
                        normalCount++;
                    }
                }
                if(normalCount == 0&&children.length>0) {
                    this.drawNoMateBugChildren();
                }
                // ## 2.Draw brothers and sisters
                for(var i in bOs){
                    var p = bOs[i];
					if(p.SpecialFlag == 1 || p.SpecialFlag == 3|| p.SpecialFlag == 0){
						this.drawBroAndSis(p);
					}
                }
                // ## 3.Draw Children
                for(var i in children){
                    var p = children[i];
                    this.drawChilds(p);
                }
                // ## 4.set c0 position
                this.setC0Position();
                // ## 5.Draw parents
                this.drawParents(person.Parents);
            },
            drawNoMateBugChildren:function(){
                var x = generations.c0.line[generations.c0.line.length-1].x()+_opts.gapX;
                var p = new Person(that.paper,{
                    id:'none-'+Math.floor(Math.random()*10000),
                    x:x,
                    y: generations.c0.current.y(),
                    none:true
                });
                //new Line(that.paper,generations.c0.current,p,'lineToNone');
                generations.c0.mate.push(p);
                generations.c0.line.push(p);
            },
            drawWifeOrHusband: function(person){
                var x = generations.c0.line[generations.c0.line.length-1].x()+_opts.gapX;
                var p = new Person(that.paper,{
                    id:person.Id,
                    x:x,
                    y:generations.c0.current.y(),
                    gender: person.Sex,
                    age:person.Age,
                    name: person.Name,
                    death: person.Deceased,
					SpecialFlag:person.SpecialFlag
                });
                //new Line(that.paper,generations.c0.current,p,'marriage');
                generations.c0.mate.push(p);
                generations.c0.line.push(p);
            },
            drawBroAndSis: function(person){
                var x = generations.c0.line[generations.c0.line.length-1].x()+_opts.gapX;
                var p = new Person(that.paper,{
                    id:person.Id,
                    x:x,
                    y:generations.c0.current.y(),
                    gender:person.Sex,
                    name: person.Name,
                    age: person.Age,
                    death: person.Deceased,
					SpecialFlag:person.SpecialFlag
                });
                generations.c0.bOs.push(p);
                generations.c0.line.push(p);
                // ## Draw borather's wife or sisiter's husband
                var mates = person.Mate;
                for(var i in mates){
                    var m = mates[i];
                    if(m.SpecialFlag != 0)continue;
                    var x = generations.c0.line[generations.c0.line.length-1].x()+_opts.gapX;
                    var pm = new Person(that.paper,{
                        id:person.Id,
                        x:x,
                        y:generations.c0.current.y(),
                        gender:m.Sex,
                        name: m.Name,
                        age: m.Age,
                        death: m.Deceased,
						SpecialFlag:m.SpecialFlag
                    });
                    new Line(that.paper,p,pm,'marriage');
                    generations.c0.line.push(pm);
                }
            },
            drawChilds: function(person){
                var x = generations.c0.current.x() + (_opts.gapX/2);
                var y = generations.c0.current.y() + _opts.gapY;
                if(generations.c1.c1line.length>0){
                    x = generations.c1.c1line[generations.c1.c1line.length-1].x() + _opts.gapX;
                    y = generations.c1.c1line[generations.c1.c1line.length-1].y();
                }
                var p = new Person(that.paper,{
                    id:person.Id,
                    x:x,
                    y:y,
                    gender:person.Sex,
                    name: person.Name,
                    age: person.Age,
                    death: person.Deceased,
					SpecialFlag:person.SpecialFlag
                });
				generations.c1.bOs.push(p);
                // ## Draw line
                var relationShip = 'child';
                switch (person.SpecialFlag){
                    case 0:
                        relationShip = 'child';
                        break;
                    case 1:
                        relationShip = 'adopted child';
                        break;
                    case 3:
                        relationShip = 'foster child';
                        break;
                }
                new Line(that.paper,generations.c0.current,p,relationShip);
                generations.c1.c1line.push(p);
                generations.c1.line.push(p);
                // ## 1.Draw Children
                var children = person.Children;
                var currentChild = null;
                for(var i in children){
                    var x = generations.c1.c1line[generations.c1.c1line.length-1].x() + (_opts.gapX/2);
                    var y = generations.c1.c1line[generations.c1.c1line.length-1].y() + _opts.gapY;
                    if(currentChild){
                        x = currentChild.x() + _opts.gapX;
                        y = currentChild.y();
                    }
                    var c1 = children[i];
                    var cp1 = new Person(that.paper,{
                        id:person.Id,
                        x:x,
                        y:y,
                        gender:c1.Sex,
                        name: c1.Name,
                        age: c1.Age,
                        death: c1.Deceased,
						SpecialFlag:c1.SpecialFlag
                    });
                    generations.c1.children.push(cp1);
                    currentChild = cp1;
                    // ## Draw line
                    var relationShip = 'child';
                    switch (c1.SpecialFlag){
                        case 0:
                            relationShip = 'child';
                            break;
                        case 1:
                            relationShip = 'adopted child';
                            break;
                        case 3:
                            relationShip = 'foster child';
                            break;
                    }
                    new Line(that.paper,p,cp1,relationShip);
                }
                // ## 2.Draw Patner
                var mates = person.Mate;
                var normalCount = 0;
                for(var i in mates){
                    var cm = mates[i];
                    if(cm.SpecialFlag != RelationshipFlag.normal)continue;
                    normalCount++;
                    var x = generations.c1.c1line[generations.c1.c1line.length-1].x() + _opts.gapX;
                    var y = generations.c1.c1line[generations.c1.c1line.length-1].y();
                   // if(currentChild){
                   //     x = currentChild.x() + (_opts.gapX/2);
                   //     y = currentChild.y() - _opts.gapY;
                   // }
                    var cmp = new Person(that.paper,{
                        id:person.Id,
                        x:x,
                        y:y,
                        gender:cm.Sex,
                        name: cm.Name,
                        age: cm.Age,
                        death: cm.Deceased,
						SpecialFlag:cm.SpecialFlag
                    });
                    new Line(that.paper,p,cmp,'marriage');
                    generations.c1.c1line.push(cmp);
                    generations.c1.line.push(cmp);
                }
                if(normalCount == 0 && children.length>0){
                    var x = generations.c1.c1line[generations.c1.c1line.length-1].x() + _opts.gapX;
                    var y = generations.c1.c1line[generations.c1.c1line.length-1].y();
                    if(currentChild){
                        x = currentChild.x() + (_opts.gapX/2);
                        y = generations.c1.c1line[generations.c1.c1line.length-1].y();
                    }
                    var cmp = new Person(that.paper,{
                        id:'none-'+Math.floor(Math.random()*10000),
                        x:x,
                        y:y,
                        none:true
                    });
                    new Line(that.paper,p,cmp,'lineToNone');
                    generations.c1.c1line.push(cmp);
                    generations.c1.line.push(cmp);
                }
            },
            setC0Position: function(){
                if(generations.c1.line.length<=0)return;
                // ## set current's wife position
                var x = generations.c1.c1line[generations.c1.c1line.length-1].x()+(_opts.gapX/2);
                generations.c0.mate[0].x(x);

                // ## set brother and sister
                var isMateRight = false;
                var currentForPerson = null;
                for(var i in generations.c0.line){
                    var per = generations.c0.line[i];
                    if(isMateRight){
                        var x = currentForPerson.x() + _opts.gapX;
                        var y =  currentForPerson.y();
                        per.x(x);
                        per.y(y);
                        currentForPerson = per;
                    }else if(per.id == generations.c0.mate[0].id){
                        isMateRight = true;
                        currentForPerson = per;
                    }
                }
				// ## Draw Marriage Line
				if(generations.c0.mate[0] && generations.c0.mate[0].none == false){
					new Line(that.paper,generations.c0.current,generations.c0.mate[0],'marriage');
				}else if(generations.c0.mate[0] && generations.c0.mate[0].none == true){
					if(generations.c1.bOs.length>0){
						new Line(that.paper,generations.c0.current,generations.c1.bOs[generations.c1.bOs.length-1],'lineToPerson');
					}
				}
            },
            drawParents: function(parents){
                var adopted = {father:null,mother:null},normal = {father:null,mother:null},forster = {father:null,mother:null};
                for(var i in parents){
                    var p = parents[i];
                    switch (p.SpecialFlag){
                        case RelationshipFlag.normal:
							if(p.Sex == "Male"){
								normal.father = p;
							}else if(p.Sex == "Female"){
								normal.mother = p;
							}
                            break;
                        case RelationshipFlag.Adopted:
							if(p.Sex == "Male"){
								adopted.father = p;
							}else if(p.Sex == "Female"){
								adopted.mother = p;
							}
                            break;
                        case RelationshipFlag.Foster:
							if(p.Sex == "Male"){
								forster.father = p;
							}else if(p.Sex == "Female"){
								forster.mother = p;
							}
                            break;
                    }
                }
                // ## 1.Draw normal
				this.drawNormalParents(normal);
				// ## 2.Draw adopted
				this.drawAdoptedOrFosterParents(adopted,'adopted');
				// ## 3.Draw foster
				this.drawAdoptedOrFosterParents(forster,'foster');
            },
			drawNormalParents: function(normal){
				var personData = _opts.dataSource;
				if(normal.mother == null && normal.father == null){
					if(personData.PaternalGrandparents.length == 0 && personData.MaternalGrandparents.length == 0
					&&personData.BrothersAndSisters.length == 0)return;
					// ## Have no parents but grandparents
					normal.father = new PersonClass();
					normal.mother = new PersonClass();
				}
				// ## Draw Father
				var father = normal.father?normal.father:new PersonClass(),mother = normal.mother?normal.mother:new PersonClass();
                var x = generations.c0.current.x() - (_opts.gapX/2);
                var y = generations.c0.current.y() - _opts.gapY;
                var fa = new Person(that.paper,{
                    id:father.Id?father.Id:'none-'+Math.floor(Math.random()*10000),
                    x:x,
                    y:y,
                    gender:father.Id?father.Sex:'Unkown',
                    name: father.Name,
                    age: father.Age,
                    death: father.Deceased,
					SpecialFlag:father.SpecialFlag
                });
                generations.cPre1.normal.father = fa;
				// ## Draw Paternal Grandparents
				personData.PaternalGrandparents = personData.PaternalGrandparents||[];
				for(var i in personData.PaternalGrandparents){
					var x = generations.cPre1.normal.father.x() - (_opts.gapX/2);
					var y = generations.cPre1.normal.father.y() - _opts.gapY;
					if(generations.cPre2.PaternalGrandparents[generations.cPre2.PaternalGrandparents.length-1]){
						x = generations.cPre2.PaternalGrandparents[generations.cPre2.PaternalGrandparents.length-1].x() + _opts.gapX;
						y = generations.cPre2.PaternalGrandparents[generations.cPre2.PaternalGrandparents.length-1].y();
					}
					var onePer = personData.PaternalGrandparents[i];
					var per = new Person(that.paper,{
                        id:onePer.Id,
                        x:x,
                        y:y,
                        gender:onePer.Sex,
                        name: onePer.Name,
                        age: onePer.Age,
                        death: onePer.Deceased,
						SpecialFlag: onePer.SpecialFlag
                    });
					generations.cPre2.PaternalGrandparents.push(per);
					generations.cPre2.line.push(per);
				}
				if(personData.PaternalGrandparents.length>0)new Line(that.paper, generations.cPre2.PaternalGrandparents[0],generations.cPre1.normal.father,'child');
				if(personData.PaternalGrandparents.length==2){
					new Line(that.paper,generations.cPre2.PaternalGrandparents[0],generations.cPre2.PaternalGrandparents[1],'marriage');
				}else if(personData.PaternalGrandparents.length==1){
					new Line(that.paper,generations.cPre2.PaternalGrandparents[0],generations.cPre1.normal.father,'lineToPerson');
				}
				
				// ## Draw Mother
				var posPerson = generations.c0.bOs.length<=0?generations.c0.current: generations.c0.bOs[generations.c0.bOs.length-1];
				var x = posPerson.x() + (_opts.gapX/2),xx;
                var y = generations.c0.current.y() - _opts.gapY;
				if(generations.cPre2.PaternalGrandparents.length>0 || personData.MaternalGrandparents.length>0){
					xx = generations.c0.current.x() + 3* _opts.gapX;
					y = generations.c0.current.y() - _opts.gapY;
				}
				if(x<xx){
					x = xx;
				}
                var mo = new Person(that.paper,{
					id:mother.Id?father.Id:'none-'+Math.floor(Math.random()*10000),
                    x:x,
                    y:y,
                    gender:mother.Id?mother.Sex:'Unkown',
                    name: mother.Name,
                    age: mother.Age,
                    death: mother.Deceased,
					SpecialFlag:mother.SpecialFlag
                });
                generations.cPre1.normal.mother = mo;
                new Line(that.paper,generations.cPre1.normal.father,generations.cPre1.normal.mother,'marriage');
				
				// ## Draw Maternal Grandparents
				personData.MaternalGrandparents = personData.MaternalGrandparents || [];
				for(var i in personData.MaternalGrandparents){
					var x = generations.cPre1.normal.mother.x() - (_opts.gapX/2);
					var y = generations.cPre1.normal.mother.y() - _opts.gapY;
					if(generations.cPre2.MaternalGrandparents[generations.cPre2.MaternalGrandparents.length-1]){
						x = generations.cPre2.MaternalGrandparents[generations.cPre2.MaternalGrandparents.length-1].x() + _opts.gapX;
						y = generations.cPre2.MaternalGrandparents[generations.cPre2.MaternalGrandparents.length-1].y();
					}
					var onePer = personData.MaternalGrandparents[i];
					var per = new Person(that.paper,{
                        id:onePer.Id,
                        x:x,
                        y:y,
                        gender:onePer.Sex,
                        name: onePer.Name,
                        age: onePer.Age,
                        death: onePer.Deceased,
						SpecialFlag:onePer.SpecialFlag
                    });
					generations.cPre2.MaternalGrandparents.push(per);
					generations.cPre2.line.push(per);
				}
				if(personData.MaternalGrandparents.length>0)new Line(that.paper, generations.cPre2.MaternalGrandparents[0],generations.cPre1.normal.mother,'child');
				if(personData.MaternalGrandparents.length==2){
					new Line(that.paper,generations.cPre2.MaternalGrandparents[0],generations.cPre2.MaternalGrandparents[1],'marriage');
				}else if(personData.MaternalGrandparents.length==1){
					new Line(that.paper,generations.cPre2.MaternalGrandparents[0],generations.cPre1.normal.mother,'lineToPerson');
				}

                // ## Draw line
                new Line(that.paper, generations.cPre1.normal.father,generations.c0.current,'child');
                for(var z in generations.c0.bOs){
                    var bs = generations.c0.bOs[z];
					if(bs.SpecialFlag == 0){
						new Line(that.paper, generations.cPre1.normal.father,bs,'child');
					}else if(bs.SpecialFlag == 3){
						new Line(that.paper, generations.cPre1.normal.father,bs,'foster child');
					}else if(bs.SpecialFlag == 1){
						new Line(that.paper, generations.cPre1.normal.father,bs,'adopted child');
					}
                }
			},
			drawAdoptedOrFosterParents: function(parents,flag){
				/*if(parents.father && !parents.mother){
					parents.mother = new PersonClass();
				}
				if(!parents.father && parents.mother){
					parents.father = new PersonClass();
				}*/
				if(!parents.father && !parents.mother)return;
				for(var i in parents){
					var x = generations.c0.current.x() - 2*_opts.gapX;
					var y = generations.c0.current.y() - _opts.gapY;
					if(generations.cPre1.normal.father){
						x = generations.cPre1.normal.father.x() - 2*_opts.gapX;
						y = generations.cPre1.normal.father.y()
					}
					if(generations.cPre1.leftline.length>0){
						x = generations.cPre1.leftline[generations.cPre1.leftline.length-1].x() - _opts.gapX;
						y = generations.cPre1.leftline[generations.cPre1.leftline.length-1].y()
					}
					var onePer = parents[i];
					if(!onePer)continue;
					var per = new Person(that.paper,{
                        id:onePer.Id?onePer.Id:'none-'+Math.floor(Math.random()*10000),
                        x:x,
                        y:y,
                        gender:onePer.Sex,
                        name: onePer.Name,
                        age: onePer.Age,
                        death: onePer.Deceased,
						none: onePer.Id?false:true,
						SpecialFlag:onePer.SpecialFlag
                    });
					generations.cPre1.leftline.push(per);
					if(flag == 'adopted')generations.cPre1.adopted[i] = per;
					if(flag == 'foster')generations.cPre1.foster[i] = per;
				}
				
				// ## Draw Line
				var lineStyle; 
				if(flag == 'adopted'){
					lineStyle = 'adopted';
				}else if(flag == 'foster'){
					lineStyle = 'foster';
				}
				
				if(parents.father && parents.mother){
					// ## there are both parents
					new Line(that.paper,generations.cPre1[flag].father,generations.cPre1[flag].mother,'marriage');
					var posPerson = generations.cPre1[flag].father;
					if(generations.cPre1[flag].mother.x()<generations.cPre1[flag].father.x()){
						posPerson = generations.cPre1[flag].mother;
					}
					new Line(that.paper,posPerson,generations.c0.current,flag+'tochild');
				}
				if(parents.father && !parents.mother){
					new Line(that.paper,generations.cPre1[flag].father,generations.c0.current,flag+'tochildsingle');
				}
				if(!parents.father && parents.mother){
					new Line(that.paper,generations.cPre1[flag].mother,generations.c0.current,flag+'tochildsingle');
				}
			}
        };
		
        _f.convertDataAndDraw(_opts.dataSource);
        /*********************
         Instance Func
         **********************/
        that.reInit = function(dataSource){
            that.paper.clear();
            _opts.dataSource = dataSource;
            _f.convertDataAndDraw(_opts.dataSource);
        };
        that.zoom = 1;
        that.zoomIn = function () {
            that.zoom += 0.2;
            if (that.zoom > 1.4) {
                that.zoom = 1.4;
            }
            var ftDom = $("svg");
            var cssName = getVendorCssStyle("transform");
            var cssVal = "scale(" + that.zoom + "," + that.zoom + ")";
            var cssObj = {};
            cssObj[cssName] = cssVal;
            ftDom.css(cssObj);
        };
        that.zoomOut = function () {
            that.zoom -= 0.2;
            if (that.zoom < 0.6) {
                that.zoom = 0.6;
            }
            var ftDom = $("svg");
            var cssName = getVendorCssStyle("transform");
            var cssVal = "scale(" + that.zoom + "," + that.zoom + ")";
            var cssObj = {};
            cssObj[cssName] = cssVal;
            ftDom.css(cssObj);
        }
    };

    var PersonClass = function(id,name,sex,age,RelationshipFlag){
        this.Id = id;
        this.Name = name;
        this.Sex = sex;
        this.Age = age || 0;
        this.Partner = [];
        this.Guardian = [];
        this.Parents = [];
        this.BrothersAndSisters = [];
		this.MaternalGrandparents = [];
		this.PaternalGrandparents = [];
        this.Children = [];
        this.OtherFMember = [];
        this.OtherNMember = [];
        this.Mate = [];
        this.SpecialFlag=RelationshipFlag || 0
    };

    window.PersonClass = PersonClass;
    window.Person = Person;
    window.Line = Line;
    window.DrawFunc = DrawFunc;
})(window);

var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    /*return {
     dom: dom,
     lowercase: pre,
     css: '-' + pre + '-',
     js: pre[0].toUpperCase() + pre.substr(1)
     };*/
    return  pre;
})();

function getVendorCssStyle(style){
    if(prefix=='' || style==null)
        return style;
    style=style.charAt(0).toUpperCase()+style.substr(1);
    return prefix+style;
}