Date.prototype.Format = function(format){ 
    var o = { 
        "M+" : this.getMonth()+1, //month 
        "d+" : this.getDate(), //day 
        "h+" : this.getHours(), //hour 
        "m+" : this.getMinutes(), //minute 
        "s+" : this.getSeconds(), //second 
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
        "S" : this.getMilliseconds() //millisecond 
    } 

    if(/(y+)/.test(format)) { 
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    } 

    for(var k in o) { 
        if(new RegExp("("+ k +")").test(format)) { 
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
        } 
    } 
    return format; 
}

//示例： 
// alert(new Date().Format("yyyy年MM月dd日")); 
// alert(new Date().Format("MM/dd/yyyy")); 
// alert(new Date().Format("yyyyMMdd")); 
// alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));

//时间比较（yyyy-MM-dd HH:mm:ss）
function compareTime(startTime, endTime) {
    var startTimes = startTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');
    startTime = startTimes[1] + '-' + startTimes[2] + '-' + startTimes[0] + ' ' + startTime.substring(10, 19);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
    var thisResult = (Date.parse(endTime.replace(/-/g, '/')) - Date.parse(startTime.replace(/-/g, '/'))) / 3600 / 1000;
    if (thisResult < 0) {
        return -1;
    } else if (thisResult > 0) {
        return 1;
    } else if (thisResult == 0) {
        return 0
    } else {
        return '异常';
    }
}

function timeToDo (time, onAfter, onBefore) {
    var time = time || "2018-01-01 00:00:00";
    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
    if (compareTime(now, time) == 1) {
        if (onBefore) {
            onBefore();
        }
    } else {
        if (onAfter) {
            onAfter()
        }
    }
}
