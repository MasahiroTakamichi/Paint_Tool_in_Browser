//点しか書けないJS
'use strict';
 
let canvas;
let ctx;
 
function init() {
    //canvasの情報を取得
    canvas = document.getElementById('canvas');
    //２D描画コンテキストを作成
    ctx = canvas.getContext('2d');
 
    registerEvent();
}
 
//イベント
function registerEvent() {

    //マウスがおされた場合のイベント
    canvas.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        
        //Canvas上のマウスの位置を取得
        //getBoundingClineRectをclientを引くことで、ブラウザではなくCanvas上の座標を求める
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
 
        //描画処理
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1, y + 1);
        ctx.stroke();
    });
}
 
init();