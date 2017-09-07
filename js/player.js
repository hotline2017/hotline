document.write('<script type="text/javascript" language="JavaScript" src="js/jquery.min.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/MathExtension.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/MyInput.js"></script>');
document.write('<script type="text/javascript" language="JavaScript" src="js/bullet.js"></script>');

//----- ----- ----- -----
// プレイヤーのプロトタイプ
//----- ----- ----- -----
var Player = function(id, file_name, pos_x, pos_y, angle)
{
    this.id         = id;
    this.image      = new Image();
    this.image.src  = file_name;
    this.pos_x      = pos_x;
    this.pos_y      = pos_y;
    this.startX     = pos_x;
    this.startY     = pos_y;
    this.angle      = angle;
    this.is_alive   = true;
    
    this.bulletCollection = new Array();
};

Player.prototype = 
{
    update        : function(input)
    {
        var vecX = 0;
        var vecY = 0;

        var key_up    = 87;
        var key_down  = 83;
        var key_left  = 65;
        var key_right = 68;

        if(input.keydown(key_up   )) { vecY -= 10; }
        if(input.keydown(key_down )) { vecY += 10; }
        if(input.keydown(key_left )) { vecX -= 10; }
        if(input.keydown(key_right)) { vecX += 10; }

        var maxBulletCount = 2;

        if(input.isMousedown() && 
           this.bulletCollection.length < maxBulletCount)
        {
            this.bulletCollection.push(new Bullet(this.id, this.pos_x, this.pos_y, this.angle));
        }

        for(var i = 0; i < this.bulletCollection.length; i++)
        {
            this.bulletCollection[i].update();
            if(this.bulletCollection[i].is_alive == false)
            {
                this.bulletCollection.splice(i, 1);
            }
        }

        this.localMove(vecX, vecY);
        this.localRotate(input.mouse_x, input.mouse_y);

    },

    draw          : function(ctx)
    {
        ctx.save();
        ctx.translate(this.pos_x, this.pos_y);
        ctx.rotate(this.angle);

        ctx.fillStyle = ""
        ctx.drawImage(this.image, 0, 0, 45, 60, -22.5, -30, 45, 60);

        ctx.restore();

        for(var i = 0; i < this.bulletCollection.length; i++)
        {
            this.bulletCollection[i].draw(ctx);
        }
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

    localRotate        : function(mouse_x, mouse_y)
    {
        var dir_x = mouse_x - this.pos_x;
        var dir_y = mouse_y - this.pos_y;

        this.angle = Math.atan2(dir_y, dir_x) + Math.PI / 2;
    },

    receiveRotate : function(angle)
    {
        this.angle = MathExtension.lerp(this.angle, angle, 0.25);
    },

    getColor : function()
    {

    }
}