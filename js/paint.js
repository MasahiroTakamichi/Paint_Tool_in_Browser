'use strict';
 
let canvas;
let ctx;
 
let canvasState;

let color;
//文字の太さ用の変数
let lineWidth;
let lineWidthRange;
//文字の濃さの変数
let opacity;
let opacityRange;
//クリアボタン用変数
let clear;

//戻るボタン用の変数
let back;
let canvas2;

//
let save;
let canvasImg;

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

    //色用の要素取得
    color = document.getElementById('color');

    //線の太さ用の要素取得
    lineWidth = document.getElementById('lineWidth');
    lineWidthRange = document.getElementById('lineWidthRange');

    //線の濃さ用の要素取得
    opacity = document.getElementById('opacity');
    opacityRange = document.getElementById('opacityRange');

    //クリアボタンの要素取得
    clear = document.getElementById('clear');

    //
    back = document.getElementById('back');

    //
    save = document.getElementById('save');
 
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


        //戻るボタン用のCanvas情報取得
        canvas2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
    });
 
    //マウス移動時
    canvas.addEventListener('mousemove', function(e) {
        if (!canvasState.drawing) return;
 
        //マウス座標をセットする
        canvasState.setPos(e);
 
        ctx.beginPath();
        //線を丸くする
        ctx.lineCap="round";
        ctx.moveTo(canvasState.beforeX, canvasState.beforeY);
        ctx.lineTo(canvasState.x, canvasState.y);

        ctx.stroke();
 
        canvasState.movePos();

        //マウスがエリア外に出た場合、描画フラグを初期化する
        if(outx > 640 || outy > 480 || outx <= 0 || outy <= 0){
            canvasState.drawing = false;    
        }
    });
 
    //クリックが離された時
    canvas.addEventListener('mouseup', function(e) {
        canvasState.drawing = false;
    });

    //input colorで入力された数値を反映させる
    color.addEventListener('change', function(e) {
        ctx.strokeStyle = e.target.value;
        ctx.fillStyle = e.target.value;
    });

    //▽線の太さの数値の内容が変わった時のイベントリスナー▽
    lineWidth.addEventListener('change', function (e) {
        changeLineWidth(e);
        lineWidthRange.value = e.target.value;
    });
 
    lineWidthRange.addEventListener('change', function (e) {
        changeLineWidth(e);
        lineWidth.value = e.target.value;
    });
    //△                           △

    //▽線の濃さの数値が変わった時のイベントリスナー▽
    opacity.addEventListener('change', function (e) {
        changeOpacity(e);
        opacityRange.value = e.target.value;
    });
 
    opacityRange.addEventListener('change', function (e) {
        changeOpacity(e);
        opacity.value = e.target.value;
    });
    //△                            △

    //クリアボタンが押された時のイベントリスナー
    clear.addEventListener('click', function(e){
        canvasClear(e);
    });

    //
    back.addEventListener('click', function(e){
        canvasBack(e);
    });

    //
    save.addEventListener('click', function(e){
        canvasSave(e);
    });
}  

//入力された値が数字かどうかを検索
function isNumber(val) {
    if (val == null || val.trim() === '') {
        return false;
    }
    return !isNaN(val);
}
 
//線の太さの値が変更された時の関数
function changeLineWidth(e) {
    const num = e.target.value;
    if (!isNumber(num)) return;
    const lineWidthValue = parseInt(num, 10);
    if (lineWidthValue < 1 || lineWidthValue > 100) return;
    ctx.lineWidth = lineWidthValue;
}

//線の濃さの値が変更された時の関数
function changeOpacity(e) {
    const num = e.target.value;
    if (!isNumber(num)) return;
    const opacityValue = parseFloat(num);
    if (opacityValue < 0 || opacityValue > 1) return;
    ctx.globalAlpha = opacityValue;
}

//クリアボタンが押された時の関数
function canvasClear(e){
    //戻るボタン用のCanvas情報取得
    canvas2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//
function canvasBack(e){
    ctx.putImageData(canvas2, 0, 0);
}

//
function canvasSave(e){
    canvasImg = canvas.toDataURL("image/png");
    canvasImg = canvasImg.replace("image/png", "image/octet-stream");
    window.open(canvasImg,"save");
}

init();