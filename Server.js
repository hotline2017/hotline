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
io.on('connection', function(socket){
  //接続時のメッセージ
  console.log('a user connected player_count:'+player_num);

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
    io.emit('playerjoin',''+player_num);
    player_num++;
  });

  //初期化
  socket.on('gameinit', function(playerdata){
    console.log('init');
    io.emit('gameinit',playerdata);
  });

  //ゲーム終了宣言
  socket.on('gamefinish', function(){
    game_timer = 1000000;
       io.emit('gamefinish',INIT_GAMEEND_TIME);
  });

  //だれかが終了
  socket.on('gameend', function(exitid){
    console.log('gameend');
    if(exitid)
    {
       player_num--;
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

  //切断
  socket.on('disconnect', function(){
    console.log('user disconnected player_count:'+player_num);
  });
});