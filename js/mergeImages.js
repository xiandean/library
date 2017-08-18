function mergeImages(config) {
    this.mergeData = config.mergeData;
    this.sources = {};
    this.width = config.width;
    this.height = config.height;
    this.callback = config.callback || "";
    this.mergeSrc;
    this.init();
}
mergeImages.prototype = {
    init: function() {
        var _this = this;
        this.mergeCanvas = document.createElement("canvas");
        this.mergeCtx = this.mergeCanvas.getContext("2d");
        this.mergeCanvas.width = this.width;
        this.mergeCanvas.height = this.height;
        for(var i=0; i<this.mergeData.length; i++) {
            this.sources[this.mergeData[i].id] = this.mergeData[i].src;
        }
        this.loadImages(this.sources,{
            onComplete: function(images) {
                for(var i=0; i<_this.mergeData.length; i++) {
                    _this.mergeData[i].image = images[_this.mergeData[i].id];
                    _this.Sprite(_this.mergeData[i],_this.mergeCtx);
                }

                _this.mergeSrc = _this.mergeCanvas.toDataURL("image/jpg", 1);

                _this.callback && _this.callback(_this.mergeSrc);
                
            }
        });
    },
    loadImages: function(sources,config) {    
        var loadedImages = 0;    
        var numImages = 0;  
        var images = sources instanceof Array ? [] : {};
        var config = config || {};

        var progressFn = config.onProgress || "";
        var completeFn = config.onComplete || "";

        // get num of sources    
        for (var src in sources) {    
            numImages++;    
        }    
        for (var src in sources) {    
            images[src] = new Image();
            if(src != "main") {
            // images[src].crossOrigin = "*";
            }
            //当一张图片加载完成时执行    
            images[src].onload = function(){ 
               
                //当所有图片加载完成时，执行回调函数callback
                loadedImages++;
                progressFn && progressFn(loadedImages);
                if (loadedImages >= numImages) {    
                    completeFn && completeFn(images); 
                    config instanceof Function && config(images)
                }    
            };  
            //把sources中的图片信息导入images数组  
            images[src].src = sources[src];    
        }    
    },
    upload: function(pic,callback) {
        var _this = this;
        var pic = pic.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        $.post('http://news.gd.sina.com.cn/market/c/interfacelanshenghuo201603/youlun_img_add',{ "img":pic},function(t){
            // console.log(t);
            if(t.error==0){
                var picsrc = t.data;
                callback && callback(picsrc);
            }else{
                alert("上传失败");
            }      
        },'json');
    },
    Sprite: function(data, context) {
        var x = data.x || 0;
        var y = data.y || 0;
        var image = data.image;
        var width = image.width;
        var height = image.height;
        var halfWidth = width/2;
        var halfHeight = height/2;
        var rotate = data.rotate*Math.PI/180 || 0;
        var scaleX = data.scale || 1;
        var scaleY = data.scale || 1;
        var alpha = data.alpha || 1;
        context.save();
        context.scale(scaleX, scaleY);
        context.translate(x + halfWidth, y + halfHeight);
        context.globalAlpha = alpha;
        context.rotate(rotate);
        context.drawImage(image, -halfWidth, -halfHeight);
        context.restore();
    }

}

// 只合成图像用例 只依赖mergeImage.js插件
// var mergeData = [{
//     id: "bg",
//     src: "images/bg.png",
//     x: 0,
//     y: 0,
//     scale: 0.5
// },{
//     id: "main",
//     src: "images/main.jpg",
//     x: 45,
//     y: 29,
//     rotate: 0
// }];  

// var mergeConfig ={
//     width: 268,
//     height: 252,
//     mergeData: mergeData,
//     callback: function(src){
//         console.log(src);// base64 图片地址
//         mergeBox.upload(src,function(imgsrc){
//             console.log(imgsrc);// 转换成jpg格式并上传后的图片地址
//         });
//     }
// }
// var mergeBox = new mergeImages(mergeConfig);