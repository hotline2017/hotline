document.write('<script type="text/javascript" language="JavaScript" src="js/jquery.min.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/MathExtension.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/InputKey.js"></script>');

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
};

Player.prototype = 
{
    update        : function(input)
    {
        var vecX = 0;
        var vecY = 0;

        // 上キーが押された
        if(input.keydown(87)) { vecY -= 10; }

        // 下キーが押された
        if(input.keydown(83)) { vecY += 10; }

        // 左キーが押された
        if(input.keydown(65)) { vecX -= 10; }

        // 右キーが押された
        if(input.keydown(68)) { vecX += 10; }

        this.localMove(vecX, vecY);
        this.rotate(input.mouse_x, input.mouse_y);

    },

    draw          : function(ctx)
    {
        ctx.save();
        ctx.translate(this.pos_x, this.pos_y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, 0, 0, 45, 60, -22.5, -30, 45, 60);

        ctx.restore();
    },

    localMove     : function(vel_x, vel_y)
    {
        this.pos_x += vel_x;
        this.pos_y += vel_y;
    },

    receiveMove   : function(id, x_position, y_position)
    {
        this.pos_x = MathExtension.lerp(this.pos_x, x_position, 0.25);
        this.pos_y = MathExtension.lerp(this.pos_y, y_position, 0.25);
    },

    rotate        : function(mouse_x, mouse_y)
    {
        var dir_x = mouse_x - this.pos_x;
        var dir_y = mouse_y - this.pos_y;

        this.angle = Math.atan2(dir_y, dir_x) + Math.PI / 2;
    },

    receiverotate : function(angle)
    {
        this.angle = MathExtension.lerp(this.angle, angle, 0.25);
    }
}