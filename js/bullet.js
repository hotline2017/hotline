document.write('<script type="text/javascript" language="JavaScript" src="js/jquery.min.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/MathExtension.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/MyInput.js"></script>');
//----- ----- ----- -----
// 弾のプロトタイプ
//----- ----- ----- -----
var Bullet = function(id, pos_x, pos_y, angle)
{
    this.id        = id;
    this.image     = new Image();
    this.image.src = "image/chalk" + id + ".png";
    this.pos_x     = pos_x;
    this.pos_y     = pos_y;
    this.angle     = angle;
    this.vel_x     = Math.cos(angle - Math.PI / 2) ;
    this.vel_y     = Math.sin(angle - Math.PI / 2) ;
    this.is_alive  = true;
    this.speed     = 5;

    this.left   =0;
    this.right  =0;
    this.top    =0;
    this.bottom =0; 
};

Bullet.prototype =
{
    update        : function(input)
    {
        var w = $('#canvas').width();
        var h = $('#canvas').height();


        this.left   = 19;
        this.right  = w - 19;
        this.top    = 28;   // 32 + 38
        this.bottom = h - 28;

        this.pos_x += this.vel_x*this.speed;
        this.pos_y += this.vel_y*this.speed;

        //画面外に出たら消す
        if(this.pos_x>=this.right){
          this.is_alive=0;
        }

        if (this.pos_x <= this.left) {
            this.is_alive = 0;
        }

        if (this.pos_y <= this.top) {
            this.is_alive = 0;
        }

        if (this.pos_y >= this.bottom) {
            this.is_alive = 0;
        }
        
    },

    draw          : function(ctx)
    {
        ctx.save();
        ctx.translate(this.pos_x, this.pos_y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, 0, 0, 19, 38, -9.0, -19, 19, 38);
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
    }
}