/*start
 *loading模块
 *实现图片的预加载
 *参数：图片数组对象，加载完成的回调函数
 */
function loadImages(sources,config){    
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
}   







//定义预加载图片数组对象，执行loading模块
// var sources = [   
//     "images/demo0.png",    
//     "images/demo1.png", 
//     "images/demo2.png",    
//     "images/demo.jpg"
// ];    
// var sources = {    
//     PaperBoy1: "images/demo0.png",    
//     PaperBoy2: "images/demo1.png", 
//     PaperBoy3: "images/demo2.png",    
//     PaperBoy4: "images/demo.jpg"
// };    

// loadImages(sources,completeHandle); 

// loadImages(sources,{
//     onProgress: progressHandle,
//     onComplete: completeHandle
// });

// function progressHandle(progress) {
//     console.log(progress);
// }
// function completeHandle(images) {
//     console.log(images);
// }