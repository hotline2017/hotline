/**
 * サーバーに必要な変数
 */

var player_num = 0;

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
app.get('/js/:file', function(req, res){
  res.sendFile(__dirname + '/js/' + req.params.file);
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});

//--------------------------------------
// Socket.io
//--------------------------------------
io.on('connection', function(socket){
  //接続時のメッセージ
  console.log('a user connected player_count:'+player_num);

  //プレイヤー情報を送る
  socket.on('movechar', function(data){
    io.emit('movechar', data);
  });

  //入場
  socket.on('playerjoin', function(){
    console.log('join');
    io.emit('playerjoin',player_num);
    player_num++;
  });

  //初期化
  socket.on('gameinit', function(playerdata){
    console.log('init');
    io.emit('gameinit',playerdata);
  });

  //切断
  socket.on('disconnect', function(){
    player_num--;
    console.log('user disconnected player_count:'+player_num);
  });
});