document.write('<script type="text/javascript" language="JavaScript" src="js/jquery.min.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/MathExtension.js"></script>');

//----- ----- ----- -----
// プレイヤーのプロトタイプ
//----- ----- ----- -----
var Player = function(id, file_name, pos_x, pos_y, angle)
{
    this.id        = id;
    this.image     = new Image();
    this.image.src = file_name;
    this.pos_x     = pos_x;
    this.pos_y     = pos_y;
    this.startX    = pos_x;
    this.startY    = pos_y;
    this.angle     = angle;
    this.is_alive  = true;
    this.is_shot   = false;
    this.input_key = new InputKeyboard();
};

Player.prototype = 
{
    //更新
    update        : function()
    {
        var vecX = 0;
        var vecY = 0;

        // 上キーが押された
		if(input_key.isDown(119)) { vecY -= 10; }

		// 下キーが押された
		if(input_key.isDown(115)) { vecY += 10; }

		// 左キーが押された
		if(input_key.isDown(97 )) { vecX -= 10; }

		// 右キーが押された
		if(input_key.isDown(100)) { vecX += 10; }

        this.localMove(vecX, vecY);

        //fix me - サーバーにデータを送る関数
        
    },

    draw          : function(ctx)
    {
        ctx.drawImage(this.imgo, 0, 0, 179, 240, this.pos_x, this.pos_y, 179, 240);
    },

    localMove     : function(x_velocity, y_velocity)
    {
        this.pos_x += x_velocity;
        this.pos_y += y_velocity;
    },

    receiveMove   : function(id, x_position, y_position)
    {
        this.pos_x = MathExtension.lerp(this.x_pos, x_position, 0.25);
        this.pos_y = MathExtension.lerp(this.y_pos, y_position, 0.25);
    },

    rotate        : function(mouse_x, mouse_y)
    {
        var dir_x = mouse_x - this.pos_x;
        var dir_y = mouse_y - this.pos_y;

        this.angle = Math.atan2(dir_y, dir_x);
    },

    receiverotate : function(angle)
    {
        this.angle = MathExtension.lerp(this.angle, angle, 0.25);
    }
}