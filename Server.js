/**
 * サーバーに必要な変数
 */

var INIT_GAMEEND_TIME = 180 * 60;


//player数
var player_num = 0;
//0がnone  1がスタンバイ、結果表示モード　2がゲームメイン
var game_mode = 0;
//ゲーム内のタイマー
var game_timer = INIT_GAMEEND_TIME;
//kill数
var kill_count = [];

/**
 * Socket.ioを使用した簡易チャット
 * https://socket.io/get-started/chat/
 */

//--------------------------------------
// モジュール読み込み
//--------------------------------------
var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

//--------------------------------------
// Webサーバ
//--------------------------------------
app.get('/', function(req, res){
  res.sendFile(__dirname + '/GameMain.html');
});
app.get('/image/:file', function(req, res){
  res.sendFile(__dirname + '/image/' + req.params.file);
});
app.get('/sound/:file', function (req, res) {
    res.sendFile(__dirname + '/sound/' + req.params.file);
});
app.get('/js/:file', function(req, res){
  res.sendFile(__dirname + '/js/' + req.params.file);
});
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

//--------------------------------------
// Socket.io
//--------------------------------------
io.on('connection', function (socket) {

  //プレイヤー情報を送る
  socket.on('sendplayerupdate', function(playerdata){
    io.emit('sendplayerupdate', playerdata);
  });

  //ゲーム時間の情報
  socket.on('gametimerdata', function(timerdata){
    if(timerdata < game_timer) game_timer = timerdata;
    io.emit('gametimerdata', game_timer);
  });

  //入場
  socket.on('playerjoin', function(){
    console.log('join');
    io.emit('playerjoin', '' + player_num);
    kill_count[player_num.toString()] = 0;
    player_num++;
  });

  //キルした時に使う
  socket.on('Killadd', function (id) {
      kill_count["" + id]++;
      console.log("" + id +  "" +kill_count["" + id]);
  });

  //初期化
  socket.on('gameinit', function(playerdata){
    console.log('init');
    io.emit('gameinit',playerdata);
  });

  socket.on('killcount', function (playerid) {
      io.emit('killcount', playerid, kill_count[playerid]);
  });

  //ゲーム終了宣言
  socket.on('gamefinish', function () {
      var max = 0;
      var id = "0";
      for (var key in kill_count) {
          if(kill_count[key] > max)
          {
              id = key;
              max = kill_count[key];
          }
      }
    io.emit('gamefinish',id);
  });

  //だれかが終了
  socket.on('gameend', function(exitid){
    console.log('gameend');
    if(exitid)
    {
        if (player_num > 0) player_num--;
        if (player_num == 0) game_timer = INIT_GAMEEND_TIME;
       io.emit('gameend',exitid);
    }
  });

  //だれかが弾を撃った
  socket.on('sendplayershot',function(playerdata)
  {
    io.emit('sendplayershot', playerdata);
  });

  socket.on('bulletupdate', function(playerdata)
  {
    io.emit('bulletupdate', playerdata);
  });

  socket.on('bulletdeath', function(id, bulletIndex)
  {
    io.emit('bulletdeath', id, bulletIndex);
  });

  //だれかが死んだ
  socket.on('sendplayerdeath', function(playerdata)
  {
    io.emit('sendplayerdeath', playerdata);
  });

  //だれかが復活した
  socket.on('sendplayerrespawn', function(playerdata)
  {
    io.emit('sendplayerrespawn', playerdata);
  });

  socket.on('sendalivestate', function(id, is_alive)
  {
    io.emit('sendalivestate', id, is_alive);
  });

  socket.on('gamereset', function () {
      game_timer = INIT_GAMEEND_TIME;
      player_num = 0;
      for (var key in kill_count) {
          kill_count["" +key] = 0;
      }
      io.emit('gamereset');
  });

  //切断
  socket.on('disconnect', function () {
    console.log('user disconnected player_count:'+player_num);
  });
});