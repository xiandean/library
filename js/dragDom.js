function Drag(config) {
    this.obj = config.element;
    this.parent = config.limitedElement || this.obj.parentNode;
    this.objBound = {x: this.getOffset(this.obj).left,y: this.getOffset(this.obj).top, width: this.obj.offsetWidth, height: this.obj.offsetHeight};
    this.parentBound = {x: this.getOffset(this.parent).left,y: this.getOffset(this.parent).top, width: this.parent.offsetWidth, height: this.parent.offsetHeight};
    this.limitedArea = {minX: this.parentBound.x - this.objBound.x, maxX: this.parentBound.x + this.parentBound.width - (this.objBound.x + this.objBound.width),minY: this.parentBound.y - this.objBound.y, maxY: this.parentBound.y + this.parentBound.height - (this.objBound.y + this.objBound.height)};
    this.mousePress = false;
    this.curPos = {x:0,y:0};
    this.init();
}
Drag.prototype = {
    init: function() {
        var that = this;
        this.obj.addEventListener('mousedown', function(event){ 
            that.beginDrag(event); 
        }, false);
        document.addEventListener('mousemove', function(event){
            that.draging(event); 
        }, false);
        document.addEventListener('mouseup', function(event){
            that.endDrag(event);
        }, false);
        this.obj.addEventListener('touchstart', function(event){ 
            that.beginDrag(event); 
        }, false);
        this.obj.addEventListener('touchmove', function(event){
            that.draging(event); 
        }, false);
        this.obj.addEventListener('touchend', function(event){
            that.endDrag(event);
        }, false);
    },
    beginDrag: function(event) {
        this.mousePress = true;
        this.lastPos = this.getPos(event);
    },
    draging: function(event) {
        event.preventDefault();
        if(!this.mousePress) {
            return;
        }
        var pos = this.getPos(event);
        this.curPos.x += (pos.x - this.lastPos.x);
        this.curPos.y += (pos.y - this.lastPos.y);
        if(this.curPos.x < this.limitedArea.minX) {
            this.curPos.x = this.limitedArea.minX;
        }else if(this.curPos.x > this.limitedArea.maxX) {
            this.curPos.x = this.limitedArea.maxX;
        }
        if(this.curPos.y < this.limitedArea.minY) {
            this.curPos.y = this.limitedArea.minY;
        }else if(this.curPos.y > this.limitedArea.maxY) {
            this.curPos.y = this.limitedArea.maxY;
        }
        this.lastPos = pos;
        this.obj.style.webkitTransform = "translate("+this.curPos.x+"px,"+this.curPos.y+"px)";
        this.obj.style.transform = "translate("+this.curPos.x+"px,"+this.curPos.y+"px)";
    },
    endDrag: function(event) {
        event.preventDefault();
        this.mousePress = false;
    },
    getPos: function(event) {
        var x, y;
        if(this.isTouch(event)) {
            x = event.targetTouches[0].pageX;
            y = event.targetTouches[0].pageY;
        }else {
            x = event.clientX;
            y = event.clientY;
        }
        return { x: x,y: y}
    },
    getOffset: function(element) {
        var offset = { left: 0, top: 0};
        var offsetParent = element;
        while(offsetParent != null && offsetParent != document.body) {
            offset.left += offsetParent.offsetLeft;
            offset.top += offsetParent.offsetTop;
            offsetParent = offsetParent.offsetParent;
        }
        return offset;
    },
    isTouch: function(event) {
        if(event.type.indexOf('touch') >= 0) {
            return true;
        }else {
            return false;
        }
    }
}
// var drag = new Drag({
//     element: document.querySelector(".upload-box"), //element: 需拖动的dom元素
//     limitedElement: document // 拖动不能超出的限制，不填默认为父级元素
// });