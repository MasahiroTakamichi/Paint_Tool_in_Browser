'use strict';
 
let canvas;
let ctx;
 
let canvasState;

let color;
var fcolor;

//エリア外を認識に使う変数
var outx;
var outy;
 
//Canvas情報を保存するためのクラス
class CanvasState {
    constructor() {
        //描画フラグ
        this.drawing = false;
        //座標初期値
        this.x = 0;
        this.y = 0;
        this.beforeX = 0;
        this.beforeY = 0;
    }
 
    //Canvas上の座標取得
    setPos(e) {
        const rect = e.target.getBoundingClientRect();
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;

        outx = e.clientX - rect.left;
        outy = e.clientY - rect.top;
    }
 
    //マウスが動く直前の座標保持、直前と直後を繰り返し描画させることで線にする
    movePos() {
        this.beforeX = this.x;
        this.beforeY = this.y;
    }
}
 
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    color = document.getElementById('color');
 
    canvasState = new CanvasState();
 
    registerEvent();
}
 
//イベント
function registerEvent() {
    //クリック時
    canvas.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
 
        //マウス座標をセットする
        canvasState.setPos(e);
        canvasState.movePos();
        canvasState.drawing = true;
    });
 
    //マウス移動時
    canvas.addEventListener('mousemove', function(e) {
        if (!canvasState.drawing) return;
 
        //マウス座標をセットする
        canvasState.setPos(e);
 
        ctx.beginPath();
        ctx.moveTo(canvasState.beforeX, canvasState.beforeY);
        ctx.lineTo(canvasState.x, canvasState.y);
        ctx.stroke();
 
        canvasState.movePos();

        //マウスがエリア外に出た場合、描画フラグを初期化する
        if(outx > 640 || outy > 480 || outx <= 0 || outy <= 0){
            canvasState.drawing = false;    
        }
    });
 
    //クリックが話された時
    canvas.addEventListener('mouseup', function(e) {
        canvasState.drawing = false;
    });

    //
}  

function changeColor(){
    var fcolor = document.getElementsByClassName('color');
    ctx.strokeStyle = fcolor.css("background-color");
}


 
init();