function uploadBox(config) {
    this.config = config;
    this.stage;
    this.uploadBitmap;
    this.uploadEXIF;
    this.uploadSrc;
    this.gestureArea;
    this.transform;
    this.G;
    this.C;
    this.gestured = false;
    this.ratio;
    this.init();
}
uploadBox.prototype = {
    init: function() {
        var _this = this;
        this.createStage();
        this.createFileReader();
        this.choose();
        this.gesture();
        if(this.config.uploadButton) {
            document.getElementById(this.config.uploadButton).addEventListener("touchstart",function(){
                _this.submit();
            });
        }
    },
    createStage: function() {
        var _this = this;
        this.stage = new createjs.Stage(this.config.uploadCanvas);
        createjs.Ticker.setFPS(5);
        createjs.Ticker.addEventListener("tick", Tick);
        function Tick(e) {
            _this.stage.update(e);
        }
    },
    createFileReader: function() {
        var _this = this;
        this.oFReader = new FileReader(),
        this.rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        this.oFReader.onload = function(file) {
            _this.createBitmap(file.target.result);
        }
    },
    createBitmap: function(img) {
        var _this = this;
        if (img == "") {
            return
        }
        var image = new Image();
        image.src = img;
        image.onload = function() {
            _this.stage.removeChild(_this.uploadBitmap);
            _this.uploadBitmap = new createjs.Bitmap(img);
            _this.uploadBitmap.regX = 0,
            _this.uploadBitmap.regY = 0,
            _this.ratio = (_this.uploadBitmap.image.width/_this.uploadBitmap.image.height) >= (_this.stage.canvas.width/_this.stage.canvas.height)?1:0;
            switch(_this.uploadEXIF){
                case 6:
                    _this.transform.a = 90;
                    _this.ratio = (_this.uploadBitmap.image.height/_this.uploadBitmap.image.width) >= (_this.stage.canvas.width/_this.stage.canvas.height)?1:0;
                    if(!_this.ratio) {
                        _this.transform.s = _this.stage.canvas.width/_this.uploadBitmap.image.height;
                        _this.transform.x = _this.stage.canvas.width;
                        _this.transform.y = (_this.stage.canvas.height-_this.uploadBitmap.image.width*_this.transform.s)/2;
                    }else {
                        _this.transform.s = _this.stage.canvas.height/_this.uploadBitmap.image.width;
                        _this.transform.x = _this.uploadBitmap.image.height*_this.transform.s + (_this.stage.canvas.width-_this.uploadBitmap.image.height*_this.transform.s)/2;                   
                    }
                    break;
                case 3:
                    _this.transform.a = 180;
                    if(!_this.ratio) {
                        _this.transform.s = _this.stage.canvas.width/_this.uploadBitmap.image.width;
                        _this.transform.x = _this.uploadBitmap.image.width*_this.transform.s;
                        _this.transform.y = (_this.stage.canvas.height+_this.uploadBitmap.image.height*_this.transform.s)/2;
                    }else {
                        _this.transform.s = _this.stage.canvas.height/_this.uploadBitmap.image.height;
                        _this.transform.x = (_this.stage.canvas.width+_this.uploadBitmap.image.width*_this.transform.s)/2;
                        _this.transform.y = _this.uploadBitmap.image.height*_this.transform.s;
                    }
                    break; 
                default:
                    if(!_this.ratio) {
                        _this.transform.s = _this.stage.canvas.width/_this.uploadBitmap.image.width;
                        _this.transform.y = (_this.stage.canvas.height-_this.uploadBitmap.image.height*_this.transform.s)/2;
                    }else {
                        _this.transform.s = _this.stage.canvas.height/_this.uploadBitmap.image.height;
                        _this.transform.x = (_this.stage.canvas.width-_this.uploadBitmap.image.width*_this.transform.s)/2;
                    }
                    break;  
            }  
            _this.G = _this.transform.s;
            _this.C = _this.transform.a;
            _this.uploadBitmap.scaleX = _this.transform.s,
            _this.uploadBitmap.scaleY = _this.transform.s,
            _this.uploadBitmap.rotation = _this.transform.a,
            _this.uploadBitmap.x = _this.transform.x,
            _this.uploadBitmap.y = _this.transform.y;
            _this.stage.addChild(_this.uploadBitmap);
            _this.stage.update()
        }
        
    },
    choose: function() {
        var _this = this;
        document.getElementById(this.config.chooseButton).onchange = function(J) {
            J.preventDefault();
            _this.resetParam();
            if (document.getElementById(_this.config.chooseButton).files.length === 0) {
                return
            }
            var I = document.getElementById(_this.config.chooseButton).files[0];
            // if (!_this.rFilter.test(I.type)) {
            //     alert("You must select a valid image file!");
            //     return
            // }

            //获取照片方向角属性，用户旋转控制  
            EXIF.getData(I, function() {  
    
                EXIF.getAllTags(this);   

                _this.uploadEXIF = EXIF.getTag(this, 'Orientation');  

            }); 
  
            _this.oFReader.readAsDataURL(I)
        }
    },
    resetParam: function() {
        this.gestured = false;
        this.transform = {
            x: 0,
            y: 0,
            s: 1,
            a: 0
        };
        this.G = 1,
        this.C = 0
    },
    gesture: function() {
        var _this = this;

        this.gestureArea = document.getElementById(this.config.gestureArea);
        interact(this.gestureArea).gesturable({
            onstart: function(H) {
                H.preventDefault()
            },
            onmove: function(H) {
                H.preventDefault();
                if (typeof _this.uploadBitmap == "undefined") {
                    return
                }
                _this.G = _this.G * (1 + H.ds/2);
                _this.C += H.da/2;
                var x = (parseFloat(_this.transform.x) || 0) + H.dx,
                y = (parseFloat(_this.transform.y) || 0) + H.dy;
                _this.transform.x = x;
                _this.transform.y = y;
                _this.gestured = true;
                _this.transform.s = _this.G;
                _this.transform.a = _this.C;
                _this.uploadBitmap.scaleX = _this.transform.s,
                _this.uploadBitmap.scaleY = _this.transform.s,
                _this.uploadBitmap.rotation = _this.transform.a,
                _this.uploadBitmap.x = _this.transform.x,
                _this.uploadBitmap.y = _this.transform.y;

                _this.stage.update()
            },
            onend: function(H) {}
        }).draggable({
            onmove: function(e) {
                _this.dragMoveListener(e);
            }
        })
    },
    dragMoveListener: function(K) {
        K.preventDefault();
        if (typeof this.uploadBitmap == "undefined") {
            return
        }
        var H = (parseFloat(this.transform.x) || 0) + K.dx;
        var L = (parseFloat(this.transform.y) || 0) + K.dy;
        var J = (parseFloat(this.transform.s) || 1);
        var I = (parseFloat(this.transform.a) || 0);

        if(!this.gestured) {
            if(this.uploadEXIF == 6) {
                H = H > this.uploadBitmap.image.height*this.transform.s ? this.uploadBitmap.image.height*this.transform.s : H < this.stage.canvas.width ? this.stage.canvas.width : H;
                L = L > 0 ? 0 : L < this.stage.canvas.height - this.uploadBitmap.image.width*this.transform.s? this.stage.canvas.height - this.uploadBitmap.image.width*this.transform.s : L;
            }else if(this.uploadEXIF == 3) {
                H = H > this.uploadBitmap.image.width*this.transform.s ? this.uploadBitmap.image.width*this.transform.s : H < this.stage.canvas.width ? this.stage.canvas.width : H;
                L = L > this.uploadBitmap.image.height*this.transform.s ? this.uploadBitmap.image.height*this.transform.s : L < (this.stage.canvas.height + this.uploadBitmap.image.height*this.transform.s)/2? (this.stage.canvas.height + this.uploadBitmap.image.height*this.transform.s)/2 : L;
            }else {
                H = H > 0 ? 0 : H < this.stage.canvas.width - this.uploadBitmap.image.width*this.transform.s? this.stage.canvas.width - this.uploadBitmap.image.width*this.transform.s : H;
                L = L > 0 ? 0 : L < this.stage.canvas.height - this.uploadBitmap.image.height*this.transform.s? this.stage.canvas.height - this.uploadBitmap.image.height*this.transform.s : L;
            }
        }

        this.uploadBitmap.scaleX = this.transform.s,
        this.uploadBitmap.scaleY = this.transform.s,
        this.uploadBitmap.rotation = this.transform.a,
        this.uploadBitmap.x = this.transform.x,
        this.uploadBitmap.y = this.transform.y;
        this.transform.x = H;
        this.transform.y = L;
        this.stage.update();
    },
    submit: function() {
        var H = document.getElementById(this.config.uploadCanvas);
        this.uploadSrc = H.toDataURL("image/png", 1);
        if(this.config.uploadServered) {
            this.upload(this.uploadSrc);
        }else {
            this.config.callback && this.config.callback(this.uploadSrc);
        }
    },
    upload: function(pic) {
        var _this = this;
        var pic = pic.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        $.post('http://news.gd.sina.com.cn/market/c/interfacelanshenghuo201603/youlun_img_add',{ "img":pic},function(t){
            // console.log(t);
            if(t.error==0){
                _this.uploadSrc = t.data;
                _this.config.callback && _this.config.callback(_this.uploadSrc);
            }else{
                alert("上传失败");
            }      
        },'json');
    },
    getSrc: function() {
        return this.uploadSrc;
    }
}