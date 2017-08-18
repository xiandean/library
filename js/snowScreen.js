function Snow(data){
    this.initData = data;
    this.bitmap = new createjs.Bitmap(data.image);
    this.init(data);
}
Snow.prototype = {
    init: function(data){
        this.bitmap.image = data.image;
        this.bitmap.alpha = data.alpha || 1;
        this.bitmap.setTransform(data.x,data.y,data.scale || 1,data.scale || 1);
        this.bitmap.rotation = data.rotation || 0;
        this.vx = data.vx || 0;
        this.vy = data.vy || 0;
        this.vrotation = data.vrotation || 0;
    },
    update: function(){
        this.bitmap.x += this.vx;
        this.bitmap.y += this.vy;
        this.bitmap.rotation += this.vrotation;
        this.bitmap.rotation >= 360 && (this.bitmap.rotation = 0);
        this.bitmap.rotation <= -360 && (this.bitmap.rotation = 0);
    }
}

function snowScreen(config){
    this.stage = new createjs.Stage(config.canvasId);
    this.stage.canvas.width = config.width || window.innerWidth;
    this.stage.canvas.height = config.height || window.innerHeight;
    this.snowImages = config.snowImages;
    this.snowNum = config.snowNum;
    this.snows = [];
    this.init();
}   
snowScreen.prototype = {
    init: function(){
        for(var i = 0; i < this.snowNum; i++) {
            var snow = new Snow(this.initSnowData());
            this.snows.push(snow);
            this.stage.addChild(snow.bitmap);
        }
        this.stage.update();
        this.fpstext = new createjs.Text("","20px Arial","#fff");
        this.fpstext.x = 20;
        this.fpstext.y = 20;
        this.stage.addChild(this.fpstext);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(60);
    },
    initSnowData: function(){
        var snowData = {};
        snowData.image = this.snowImages[this.getRandom(0,this.snowImages.length - 1)];
        snowData.scale = this.getRandom(50,100)/100;
        snowData.x = this.getRandom(0,this.stage.canvas.width - snowData.image.width);
        snowData.y = -snowData.image.height;
        snowData.vx = this.getRandom(-5,5);
        snowData.vy = this.getRandom(2,10);
        snowData.alpha = this.getRandom(50,100)/100;
        snowData.rotation = this.getRandom(0,360);
        (snowData.vx >= 0) && (snowData.vrotation = 1);
        (snowData.vx < 0) && (snowData.vrotation = -1);
        return snowData;
    },
    start: function(){
        var _this = this;
        createjs.Ticker.addEventListener("tick", function(){
                _this.tick();
        });
    },
    stop: function(){
        createjs.Ticker.reset();
    },
    tick: function(){
        this.fpstext.text = Math.round(createjs.Ticker.getMeasuredFPS()) + "fps";
        for (var i in this.snows) { 
            var rectRange = this.snows[i].bitmap.getTransformedBounds();
            if(rectRange.x>this.stage.canvas.width||rectRange.x<-rectRange.width||rectRange.y>this.stage.canvas.height){
               this.snows[i].init(this.initSnowData());
            }else {
               this.snows[i].update();
            }
        }
        this.stage.update();
    },
    getRandom: function(a,b){
        return Math.round(Math.random()*(b-a)+a);
    }
}


//定义预加载图片数组对象，执行loading模块

// var manifest = [{
//     id: "leaf_01",
//     src: "images/leaf_01.png"
// },{
//     id: "leaf_02",
//     src: "images/leaf_02.png"
// },{
//     id: "leaf_03",
//     src: "images/leaf_03.png"
// },{
//     id: "leaf_04",
//     src: "images/leaf_04.png"
// },{
//     id: "leaf_05",
//     src: "images/leaf_05.png"
// },{
//     id: "leaf_06",
//     src: "images/leaf_06.png"
// },{
//     id: "leaf_07",
//     src: "images/leaf_07.png"
// }];
// var preload = new createjs.LoadQueue(false);
// preload.on("complete",completeHandler);
// preload.loadManifest(manifest);
// function completeHandler(e){
//     var snowImageArr = [];
//     for(var i in manifest) {
//         snowImageArr.push(preload.getResult(manifest[i].id));
//     }
//     var stage = new snowScreen({
//         canvasId: "myCanvas",
//         snowImages: snowImageArr,
//         snowNum: 100
//     });
//     stage.start();
//     setTimeout(function(){
//         stage.stop();
//     },2000);
// }