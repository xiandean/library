var Browser = {
    //是否是Android系统
    IsAndroid: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    //是否是IOS系统
    IsIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    IsIPad: function() {
        /// <summary>是否是IPad</summary>
        return navigator.userAgent.match(/iPad/i) ? true : false;
    },
    //是否是IEMobile
    IsIEMobile: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    IsIE: function() {
        /// <summary>是否是IE</summary>
        return navigator.userAgent.match("MSIE") ? true : false;
    },
    BrowserVersion: function() {
        /// <summary>检测浏览器版本号 支持 ie firefox chrome opera safari</summary>
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? s = s[1]:
            (s = ua.match(/firefox\/([\d.]+)/)) ? s = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? s = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? s = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? s = s[1] : 0;
        return s;
    },
    //是否是BlackBerry
    IsBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    //是否是移动设备
    IsMobile: function() {
        return (Browser.IsAndroid() || Browser.IsIOS() || Browser.IsIEMobile() || Browser.IsBlackBerry());
    },
    IsWeiXin: function() {
        /// <summary>是不是微信浏览器</summary>
        return navigator.userAgent.match(/MicroMessenger/i) ? true : false;
    }
};
