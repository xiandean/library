/*loading模块
     *实现图片的预加载
     *参数：
            *sources: 图片数组.eg["0.jpg","1.jpg"] or 图片对象{"id1":"1.jpg","id2":"2.jpg"}
            *config: 加载完成的回调函数completeHandler or 参数对象{onprogress: progressHandler,oncomplete:completeHandler}
     */
    function loadImages(sources,config){
        var loadedImages = 0,
            numImages = 0,
            images = sources instanceof Array ? [] : {},
            config = config || {},
            progressFn = config.onProgress || "",
            completeFn = config.onComplete || "";

        // get num of sources    
        for (var src in sources) {
            numImages++;
        }

        for (var src in sources) {
            images[src] = new Image();
            //当一张图片加载完成时执行    
            images[src].onload = function(){
               
                //当所有图片加载完成时，执行回调函数callback
                loadedImages++;
                progressFn && progressFn(Math.floor(loadedImages/numImages*100));
                if (loadedImages >= numImages) {    
                    completeFn && completeFn(images); 
                    config instanceof Function && config(images)
                }    
            };  
            //把sources中的图片信息导入images数组  
            images[src].src = sources[src];    
        }    
    }   
    
    /*画布中的图片对像模块
     *参数：data
            *image: img对象（必传）
            *width: 该图片在画布中的宽度（可不传），默认为image图片的原始宽度
            *height: 该图片在画布中的高度（可不传），默认为image图片的原始高度
            *x: 该图片在画布中的x坐标（可不传）默认为0
            *y: 该图片在画布中的y坐标（可不传）默认为0
            *rotate: 该图片在画布中的旋转角度（可不传）默认为0，范围（-360，360），旋转中心为该图片的中心点 
            *scale: 该图片在画布中的缩放大小（可不传）默认为1，范围（0，），缩放中心为该图片的中心点 
            *alpha: 该图片在画布中的透明度大小（可不传）默认为1，范围（0，1）
            *vx: 该图片在画布中x坐标的移动速度（可不传）默认为0
            *vy: 该图片在画布中y坐标的移动速度（可不传）默认为0
            *vrotate: 该图片在画布中旋转角度的变化速度（可不传）默认为0
            *vscale: 该图片在画布中缩放大小的变化速度（可不传）默认为0
     */
    function Bitmap(data){
        this.initData = data;
        this.init(data);
    }
    Bitmap.prototype = {
        init: function(data){ //初始化或重置图片数据
            this.image = data.image;
            this.width = data.width || this.image.width;
            this.height = data.height || this.image.height;
            this.width = lib.flexible.rem2px(this.width/100);
            this.height = lib.flexible.rem2px(this.height/100);
            this.centerX = this.width/2;
            this.centerY = this.height/2;
            this.x = data.x || 0;
            this.y = data.y || 0;
            this.rotate = data.rotate || 0;
            this.scale = data.scale || 1;
            this.alpha = data.alpha || 1;
            this.vx = data.vx || 0;
            this.vy = data.vy || 0;
            this.vx = lib.flexible.rem2px(this.vx/100);
            this.vy = lib.flexible.rem2px(this.vy/100);
            this.vrotate = data.vrotate || 0;
            this.vscale = data.vscale || 0;
        },
        drawTo: function(context){ 
            context.save();
            context.translate(this.x + this.centerX, this.y + this.centerY);
            (this.scale != 1) && (context.scale(this.scale, this.scale));
            (this.alpha != 1) && (context.globalAlpha = this.alpha);
            (this.rotate != 0) && context.rotate(this.rotate * Math.PI/180);
            context.drawImage(this.image, -this.centerX, -this.centerY, this.width, this.height);
            context.restore();
            return this;
        },
        update: function(){ 
            this.x += this.vx;
            this.y += this.vy;
            this.rotate += this.vrotate;
            this.rotate >= 360 && (this.rotate = 0);
            this.rotate <= -360 && (this.rotate = 0);
            this.scale += this.vscale;
            this.scale < 0 && (this.scale = 0); 
        }
    }


    /*画布场景
     *参数：config
            *canvasId: 画布的id（必传）
            *width: 画布的宽度（可不传），默认为window的宽度
            *height: 画布的高度（可不传），默认为window的高度
            *tick: 画布场景的逻辑处理函数，画布每次自动刷新时执行（可不传），该函数中参数为canvasScreen实例对象this
     */
    function canvasScreen(config){
        this.canvas = document.getElementById(config.canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = config.width || window.innerWidth;
        this.canvas.height = config.height || window.innerHeight;
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenCtx = this.offScreenCanvas.getContext("2d");
        this.offScreenCanvas.width = this.canvas.width;
        this.offScreenCanvas.height = this.canvas.height;
        this.tickHandler = config.tick || "";
        this.countFPS = 0;
        this.fps = 60;
        this.showFPS = config.showFPS || false;
        this.init();
    }
    canvasScreen.prototype = {
        init:function(){
            this.paused=true;
            this.displayList=[];
        },
        addChild: function(obj){ 
            this.displayList.push(obj);
        },
        removeChild: function(obj){
            for (var i in this.displayList) {  
                if (this.displayList[i] === obj) {  
                    this.displayList.splice(i, 1);  
                }  
            }
        },
        update:function(){
            this.offScreenCtx.clearRect(0,0,this.offScreenCanvas.width,this.offScreenCanvas.height);
            for (var i in this.displayList) {    
                this.displayList[i].drawTo(this.offScreenCtx);  
            }   
            if(this.showFPS) {
                this.offScreenCtx.save();
                this.offScreenCtx.font = "30px impact";
                this.offScreenCtx.fillStyle = '#fff';
                this.offScreenCtx.fillText("fps: "+this.fps, 20, 40);
                this.offScreenCtx.restore();
            }
        
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.ctx.drawImage(this.offScreenCanvas,0,0);
        },
        tick:function(){
            if(!this.paused){
                var _this=this;
                if(this.tickHandler){
                    this.tickHandler(this);
                }else{
                    for (var i in this.displayList) {  
                        this.displayList[i].update();  
                    } 
                }
                this.update();
                this.requestId=window.requestAnimationFrame(function(){
                    _this.tick();
                });

                if(this.showFPS) {
                    var time = Date.now();
                    (!this.lastTime) && (this.lastTime = time);
                
                    if(time-this.lastTime>=1000){
                        this.lastTime = time;
                        this.fps = this.countFPS;
                        this.countFPS=0;
                    }else {
                        this.countFPS++;
                    }
                } 
            }
        },
        start:function(){
            this.paused=false;
            this.tick();
        },
        stop:function(){
            this.paused=true;
            if(this.requestId){
                window.cancelAnimationFrame(this.requestId);
            }
        },
        getRandom: function(a,b){
            return Math.round(Math.random()*(b-a)+a);
        },
        getFPS: function(){
            return this.fps;
        }
    };

    //继承
    function extend(Sub,Sup) { 
        //Sub表示子类，Sup表示超类
        // 首先定义一个空函数
        var F = function(){};

        // 设置空函数的原型为超类的原型
        F.prototype = Sup.prototype; 

        // 实例化空函数，并把超类原型引用传递给子类
        Sub.prototype = new F();
                
        // 重置子类原型的构造器为子类自身
        Sub.prototype.constructor = Sub;
                
        // 在子类中保存超类的原型,避免子类与超类耦合
        Sub.sup = Sup.prototype;

        if(Sup.prototype.constructor === Object.prototype.constructor) {
            // 检测超类原型的构造器是否为原型自身
            Sup.prototype.constructor = Sup;
        }
    }

    /*飘雪场景
     *参数：config
            *canvasId: 画布的id（必传）
            *width: 画布的宽度（可不传），默认为window的宽度
            *height: 画布的高度（可不传），默认为window的高度
            *tick: 画布场景的逻辑处理函数，画布每次自动刷新时执行（可不传），该函数中参数为canvasScreen实例对象this
            *snowImages: 画布中雪花种类的图片数组（必传）
            *snowNum: 画布中雪花的数量（必传）
     */
    function snowScreen(config) {
        canvasScreen.call(this,config);
        this.snowImages = config.snowImages; 
        this.snowNum = config.snowNum;
        this.setSnows();
        this.tickHandler = function(){
            for (var i in this.displayList) {  
                if(this.displayList[i].x>this.offScreenCanvas.width||this.displayList[i].x<-this.displayList[i].width||this.displayList[i].y>this.offScreenCanvas.height){
                    this.displayList[i].init(this.initSnowData());
                }else {
                    this.displayList[i].update();
                }
            }
        }
    }
    extend(snowScreen,canvasScreen); 
    snowScreen.prototype.initSnowData = function(){
        var snowData = {};
        snowData.image = this.snowImages[this.getRandom(0,this.snowImages.length - 1)];
        snowData.scale = this.getRandom(80,100)/100;
        snowData.x = this.getRandom(0,this.canvas.width - snowData.image.width);
        snowData.y = -snowData.image.height * 2;
        snowData.vx = this.getRandom(-5,5);
        snowData.vy = this.getRandom(2,5);
        snowData.alpha = this.getRandom(80,100)/100;
        snowData.rotate = this.getRandom(0,360);
        (snowData.vx >= 0) && (snowData.vrotate = 1);
        (snowData.vx < 0) && (snowData.vrotate = -1);
        return snowData;
    };
    snowScreen.prototype.setSnows = function(){
        for(var i = 0; i < this.snowNum; i++) {
            var bitmap = new Bitmap(this.initSnowData());
            this.addChild(bitmap);
        }
        this.update();
    }


    // var sources = [
    //    'http://guangdong.sinaimg.cn/subject/2017/0519/images/snow_01.png',
    //    'http://guangdong.sinaimg.cn/subject/2017/0519/images/snow_02.png',
    //    'http://guangdong.sinaimg.cn/subject/2017/0519/images/snow_03.png',
    //    'http://guangdong.sinaimg.cn/subject/2017/0519/images/snow_04.png',
    //    'http://guangdong.sinaimg.cn/subject/2017/0519/images/snow_05.png'
    // ];
    // loadImages(sources, function(images){
    //     var stage = new snowScreen({
    //         canvasId: "screen",
    //         snowImages: images,
    //         snowNum: 20
    //     });

    //     stage.start();


    //     // stage.stop();

    // });
