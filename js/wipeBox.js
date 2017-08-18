function wipeBox(config) {
    this.canvas = document.querySelector(config.id);  
    this.ctx = this.canvas.getContext("2d");   
    this.callback = config.callback || "";
    this.develop = config.develop || false;
    this.taped = false;
    this.init();       
}
wipeBox.prototype = {
    init: function() {
        this.x1 = 30;
        this.y1 = 30;
        this.a = 30;
        this.timeout = null;
        this.stop = false;
        this.totimes = 100;
        this.distance = 30;
        this.tapClip();
    },
    tapClip: function() {
        var _this = this;
        var hastouch = "ontouchstart" in window ? true : false,
        tapstart = hastouch ? "touchstart" : "mousedown",
        tapmove = hastouch ? "touchmove" : "mousemove",
        tapend = hastouch ? "touchend" : "mouseup";

        var area;
        var x2,y2;
        _this.ctx.lineCap = "round";
        _this.ctx.lineJoin = "round";
        _this.ctx.lineWidth = _this.a * 2;
        _this.ctx.save();
        _this.ctx.globalCompositeOperation = "destination-out";
        if(!_this.taped) {
            _this.taped = true;
            _this.canvas.addEventListener(tapstart, function (e) {
                clearTimeout(_this.timeout);
                e.preventDefault();
                area = _this.getClipArea(e, hastouch);

                _this.x1 = area.x;
                _this.y1 = area.y;

                _this.drawLine(_this.x1, _this.y1);
            });
            _this.canvas.addEventListener(tapmove, tapmoveHandler);

            _this.canvas.addEventListener(tapend, function () {
                //检测擦除状态
                _this.timeout = setTimeout(function () {
                    var imgData = _this.ctx.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
                    var dd = 0;
                    for (var x = 0; x < imgData.width; x += _this.distance) {
                        for (var y = 0; y < imgData.height; y += _this.distance) {
                            var i = (y * imgData.width + x) * 4;
                            if (imgData.data[i + 3] > 0) { dd++ }
                        }
                    }
                    if (dd / (imgData.width * imgData.height / (_this.distance * _this.distance)) < 0.5) {

                        _this.callback && _this.callback(_this);

                    }
                }, _this.totimes);
            });
            function tapmoveHandler(e) {
                // clearTimeout(_this.timeout);

                e.preventDefault();

                area = _this.getClipArea(e, hastouch);

                x2 = area.x;
                y2 = area.y;

                _this.drawLine(_this.x1, _this.y1, x2, y2);

                _this.x1 = x2;
                _this.y1 = y2;

            }
        }
        
    },
    getClipArea: function(e, hastouch) {
        var x = hastouch ? e.targetTouches[0].pageX : e.pageX;
        var y = hastouch ? e.targetTouches[0].pageY : e.pageY;
        var ndom = this.canvas;

        while(ndom.tagName!=="BODY"){
            x -= ndom.offsetLeft;
            y -= ndom.offsetTop;
            ndom = ndom.parentNode;
        }

        return {
            x: x,
            y: y
        }
    },
    drawLine: function(x1, y1, x2, y2) {
        this.ctx.save();
        this.ctx.beginPath();
        if(arguments.length==2){
            this.ctx.arc(x1, y1, this.a, 0, 2 * Math.PI);
            this.ctx.fill();
        }else {
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
}

// 测试用例
// var box = new wipeBox({
//     id: "#p2-canvas",
//     develop: false,
//     callback: function(obj) {
//         console.log(obj);
//     }
// });