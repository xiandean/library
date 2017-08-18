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

//测试
// function A(x) {
//     this.x = x;
//     this.getX = function(){
//         return this.x;
//     }
// }
// A.prototype.add = function(){
//     return this.x + this.x;
// }
// A.prototype.mul = function(){
//     return this.x * this.x;
// }
// // 构造函数B
// function B(x, y){
//     this.y = y;
//     A.call(this,x); // 继承构造函数A中的所有属性及方法
// }
// extend(B,A);  // B继承于A


// var b = new B(11,12);
// console.log(b.getX()); // 11
// console.log(b.add());  // 22
// console.log(b.mul());  // 121
