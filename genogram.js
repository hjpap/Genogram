// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Genogram                          │ \\
// │                                       │ \\
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
    var Person = function(paper, opts){
        if(!paper) return;
        var that = this;
        /**************
         Config
         ***************/
        this.id = opts.id;
        that._gender = opts.gender || null;
        that._ifCurrent = opts.current || null;
        that.shape = null;
        that.shape2 = null;
        that.text = null;
        that.name = opts.name || "";
        that._dia = 5;
        that._rect = 10;
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
                if(opts.none){
                    this.drawNone();
                    return
                }
                if(opts.unkown){
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
            },
            drawText: function(){
                if(!that.name)return;
                that.text = paper.text(that._x+1, that._y+25, that.name);
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
                    that.shape2 = paper.rect(that._x-8, that._y-7, that._rect+10, that._rect+10);
                    that.shape2.attr('stroke', that._rectStrokeColor);
                    that.shape2.attr('stroke-width',2);
                }
                that.shape = paper.rect(that._x-3, that._y-2, that._rect, that._rect);
                that.shape.attr('stroke', that._rectStrokeColor);
                that.shape.attr('stroke-width',that._strokeWidth);
            },
            drawFemale: function(){
                if(that._ifCurrent){
                    that.shape2 = paper.circle(that._x+2, that._y+2, that._dia+6);
                    that.shape2.attr('stroke', that._strokeColor);
                    that.shape2.attr('stroke-width',2);
                }
                that.shape = paper.circle(that._x+2, that._y+2, that._dia);
                that.shape.attr('stroke', that._strokeColor);
                that.shape.attr('stroke-width',that._strokeWidth);
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
                    that.shape.attr('x',that._x-3);
                    if(that.shape2)that.shape2.attr('x',that._x-8);
                }else if(that._gender == 'Female'){
                    that.shape.attr('cx',that._x+2);
                    if(that.shape2)that.shape2.attr('cx',that._x);
                }else{
                    that.shape.attr('x',that._x+2);
                }
                if(that.text)that.text.attr('x',that._x+1);
                if(that.marriageLine && that.marriageLine.length>0){
                    for(var i in that.marriageLine){
                        if(that.marriageLine[i].line.id){
                            that.marriageLine[i].init();
                        }
                    }
                }
            }else{
                return that._x;
            }
        }
        that.y = function(y){
            if(y){
                that._y = y;
                if(that._gender == 'Male'){
                    that.shape.attr('y',that._y-2);
                    if(that.shape2)that.shape2.attr('y',that._y-7);
                }else if(that._gender == 'Female'){
                    that.shape.attr('cy',that._y+2);
                    if(that.shape2)that.shape2.attr('cy',that._y+2);
                }else{
                    that.shape.attr('y',that._y);
                }
                if(that.text)that.text.attr('y',that._y+25);
                if(that.marriageLine && that.marriageLine.length>0){
                    for(var i in that.marriageLine){
                        if(that.marriageLine[i].line.id){
                            that.marriageLine[i].init();
                        }
                    }
                }
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
            lineToNone: function(){
                var gap = 45;
                var startX,startY,v = 15, h;
                that.startX = startX = that.person1.x() + 2;
                that.y = startY = that.person1.y() + gap;
                that.endX = h = that.person2.x()-32;
                that.line = that.paper.path('M '+ startX +','+startY+'V '+(startY+v)+'H '+h);
                that.person1.marriageLine = that.person1.marriageLine || [];
                that.person2.marriageLine = that.person2.marriageLine || [];
                that.person1.marriageLine.push(that);
                that.person2.marriageLine.push(that);
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
            gapX: 70,
            gapY: 100,
            dataSource: null
        };
        for(var i in opts){
            _opts[i] = opts[i];
        }
        /*******************
         Private Func
         ********************/
        var generations = null;
        var _f = {
            convertDataAndDraw: function(person){
                if(!person)return;
                generations = {
                    cPre2:{
                        line:[]
                    },
                    cPre1:{
                        normal:[],
                        line:[]
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
                        children:[]
                    }
                };
                var current = new Person(that.paper,{
                    id:person.Id,
                    x:_opts.origin.x,
                    y:_opts.origin.y,
                    gender:person.Sex,
                    name:person.Name,
                    current:true
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
                    this.drawBroAndSis(p);
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
                    y:generations.c0.current.y(),
                    none:true
                });
                new Line(that.paper,generations.c0.current,p,'lineToNone');
                generations.c0.mate.push(p);
                generations.c0.line.push(p);
            },
            drawWifeOrHusband: function(person){
                var x = generations.c0.line[generations.c0.line.length-1].x()+_opts.gapX;
                var p = new Person(that.paper,{
                    id:person.Id,
                    x:x,
                    y:generations.c0.current.y(),
                    gender:person.Sex,
                    name:person.Name
                });
                new Line(that.paper,generations.c0.current,p,'marriage');
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
                    name:person.Name
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
                        name:m.Name
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
                    name:person.Name
                });
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
                        name:c1.Name
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
                        name:cm.Name
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
                var isWifeRight = false;
                var currentForPerson = null;
                for(var i in generations.c0.line){
                    var per = generations.c0.line[i];
                    if(isWifeRight){
                        var x = currentForPerson.x() + _opts.gapX;
                        var y =  currentForPerson.y();
                        per.x(x);
                        per.y(y);
                        currentForPerson = per;
                    }else if(per.id == generations.c0.mate[0].id){
                        isWifeRight = true;
                        currentForPerson = per;
                    }
                }
            },
            drawParents: function(parents){
                return;
                var adopted = [],normal = [],forster = [];
                for(var i in parents){
                    var p = parents[i];
                    switch (p.SpecialFlag){
                        case RelationshipFlag.normal:
                            normal.push(p);
                            generations.cPre1.normal.push(p);
                            break;
                        case RelationshipFlag.Adopted:
                            adopted.push(p);
                            generations.cPre1.adopted.push(p);
                            break;
                        case RelationshipFlag.Foster:
                            forster.push(p);
                            generations.cPre1.forster.push(p);
                            break;
                    }
                }
                // ## 1.Draw normal
                var par1 = normal[0],par2 = normal[1];
                var x = generations.c0.current.x() - (_opts.gapX/2);
                var y = generations.c0.current.y() - _opts.gapY;
                var p1 = new Person(that.paper,{
                    id:par1.Id,
                    x:x,
                    y:y,
                    gender:par1.Sex,
                    name:par1.Name
                });
                generations.cPre1.line.push(p1);

                var posPerson = generations.c0.bOs.length<=0?generations.c0.current: generations.c0.bOs[generations.c0.bOs.length-1];
                var x = posPerson.x() + (_opts.gapX/2);
                var y = posPerson.y() - _opts.gapY;
                var p2 = new Person(that.paper,{
                    id:par2.Id,
                    x:x,
                    y:y,
                    gender:par2.Sex,
                    name:par2.Name
                });
                generations.cPre1.line.push(p2);
                new Line(that.paper,p1,p2,'marriage');

                // ## Draw line
                new Line(that.paper,p1,generations.c0.current,'child');
                for(var z in generations.c0.bOs){
                    var bs = generations.c0.bOs[z];
                    new Line(that.paper,p1,bs,'child');
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
            if (that.zoom < 0.5) {
                that.zoom = 0.5;
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