(function() {
    var lastTime=0;
    var vendors=['ms','moz','webkit','o'];
    for(var x=0;x<vendors.length && !window.requestAnimationFrame; ++x){
        window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame=window[vendors[x]+'cancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if(!window.requestAnimationFrame) window.requestAnimationFrame=function(callback,element){
        var currTime=new Date().getTime();
        var timeToCall=Math.max(0,16-(currTime-lastTime));
        var id=window.setTimeout(function(){
            callback(currTime+timeToCall);
        },timeToCall);
        lastTime=currTime+timeToCall;
        return id;
    };
    if(!window.cancelAnimationFrame) window.cancelAnimationFrame=function(id){
        clearTimeout(id);
    }
})();


// var lastTime = Date.now();
// var deltaTime = 0;

// var animateTimer = 0; 
// var animateInterval = 50;
// function loop() {
//     window.requestAnimationFrame(loop);
//     var now = Date.now();
//     deltaTime = now - lastTime;
//     lastTime = now;

//     animateTimer += deltaTime;
//     if(animateTimer > animateInterval) {
//         console.log("loop animated");
//         animateTimer %= animateInterval;
//     }
// }

// function getRandom(a,b){
//     return Math.round(Math.random()*(b-a)+a);
// }

// var ball=function(x,y,vx,vy,useCache){
//     this.x=x;
//     this.y=y;
//     this.vx=vx;
//     this.vy=vy;
//     this.r=getRandom(20,40);
//     this.color="rgba("+getRandom(0,255)+","+getRandom(0,255)+","+getRandom(0,255)+",1)";
//     this.cacheCanvas=document.createElement("canvas");
//     this.cacheCtx=this.cacheCanvas.getContext("2d");
//     this.cacheCanvas.width=2*this.r;
//     this.cacheCanvas.height=2*this.r;
//     var num=this.r/2;
//     this.useCache=useCache;
//     if(useCache){
//         this.cache();
//     }
// }
// ball.prototype={
//     paint:function(ctx){
//         if(!this.useCache){
//             ctx.save();
//             ctx.beginPath();
//             ctx.arc(this.x,this.y,this.r,0,2*Math.PI,true);
//             ctx.closePath();
//             ctx.fillStyle=this.color;
//             ctx.fill();
//             ctx.restore();
//         }else{
//             ctx.drawImage(this.cacheCanvas,this.x-this.r,this.y-this.r)
//         }
//     },
//     cache:function(){
//         this.cacheCtx.save();
//         this.cacheCtx.beginPath();
//         this.cacheCtx.arc(this.r,this.r,this.r,0,2*Math.PI,true);
//         this.cacheCtx.closePath();
//         this.cacheCtx.fillStyle=this.color;
//         this.cacheCtx.fill();
//         this.cacheCtx.restore();
//     },
//     move:function(ctx){
//         this.x+=this.vx;
//         this.y+=this.vy;
//         if(this.x>(ctx.canvas.width-this.r)||this.x<this.r){
//             this.x=this.x<this.r?this.r:(ctx.canvas.width-this.r);
//             this.vx=-this.vx;
//         }
//         if(this.y>(ctx.canvas.height-this.r)||this.y<this.r){
//             this.y=this.y<this.r?this.r:(ctx.canvas.height-this.r);
//             this.vy=-this.vy;
//         }
//         this.paint(ctx);
//     }
// }
// var box={
//     init:function(len){
//         this.canvas=document.getElementById("cas");
//         this.ctx=this.canvas.getContext("2d");
//         this.requestId="";
//         this.paused=true;
//         this.Balls=[];
//         this.fps=0;
//         this.startTime=0;
//         for(var i=0,len=len||1;i<len;i++){
//             var b=new ball(getRandom(0,this.canvas.width),getRandom(0,this.canvas.height),getRandom(-10,10),getRandom(-10,10),true);
//             this.Balls.push(b);
//         }
//     },
//     update:function(){
//         this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
//         for(var i=0,len=this.Balls.length;i<len;i++){
//             this.Balls[i].move(this.ctx);
//         }
//         this.fps++;
//     },
//     loop:function(time){
//         var time = time || 0;
//         if(!this.paused){
//             var _this=this;
//             this.update();
//             if(time-this.startTime>=1000){
//                 this.startTime=time;
//                 console.log("fps:"+this.fps);
//                 this.fps=0;
//             }
//             this.requestId=window.requestAnimationFrame(function(time){
//                 _this.loop(time);
//             });
//         }
//     },
//     start:function(){
//         this.paused=false;
//         this.loop();
//     },
//     stop:function(){
//         this.paused=true;
//         if(this.requestId){
//             window.cancelAnimationFrame(this.requestId);
//         }
//     }
// }

// box.init(2000);
// box.start();









