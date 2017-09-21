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
    this.image.src  = file_name + id + ".png";
    this.pos_x      = pos_x;
    this.pos_y      = pos_y;
    this.startX     = pos_x;
    this.startY     = pos_y;
    this.angle      = angle;
    this.is_alive   = true;
    
    this.killCount  = 0;
    this.deathCount = 0;
    this.returnTime = 0;
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

        this.clampPosition();
        var maxBulletCount = 2;

        this.bulletUpdate();
        socket.emit('bulletupdate', this);

        this.localRotate(input.mouse_x, input.mouse_y);

        if(input.isMousedown() && 
           this.bulletCollection.length < maxBulletCount)
        {
            //alert(this.angle);

            this.bulletCollection.push(new Bullet(this.id, this.pos_x, this.pos_y, this.angle));
            socket.emit('sendplayershot', this);
        }

        this.returnTime--;
        if(this.returnTime <= 0 && !this.is_alive)
        {
            this.pos_x = this.startX;
            this.pos_y = this.startY;
            this.is_alive = true;
            socket.emit('sendplayerrespawn', this);
        }

        this.localMove(vecX, vecY);
    },

    bulletUpdate : function()
    {
        for(var i = 0; i < this.bulletCollection.length; i++)
        {
            this.bulletCollection[i].update();
            if(this.bulletCollection[i].is_alive == false)
            {
                this.bulletCollection.splice(i, 1);
            }
        }
    },

    draw          : function(ctx)
    {
        if(this.is_alive)
        {
            ctx.save();
            ctx.translate(this.pos_x, this.pos_y);
            ctx.rotate(this.angle);

            ctx.drawImage(this.image, 0, 0, 45, 60, -22.5, -30, 45, 60);

            ctx.restore();
        }

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

    localRotate   : function(mouse_x, mouse_y)
    {
        var dir_x = mouse_x - this.pos_x;
        var dir_y = mouse_y - this.pos_y;

        this.angle = Math.atan2(dir_y, dir_x) + Math.PI / 2;
    },

    receiveRotate : function(angle)
    {
        this.angle = MathExtension.lerp(this.angle, angle, 0.25);
    },

    receiveShot   : function(pos_x, pos_y, angle)
    {
        this.bulletCollection.push(new Bullet(this.id, pos_x, pos_y, angle));
    },

    dead          : function()
    {
        this.is_alive = false;
    },

    respawn       :function()
    {
        this.pos_x = this.startX;
        this.pos_y = this.startY;
        this.is_alive = true;
    },

    clampPosition : function()
    {
        var w = $('#canvas').width();
        var h = $('#canvas').height();

        var left   =     45;
        var right  = w - 45;
        var top    =     124;   // 64 + 60
        var bottom = h - 60;

        this.pos_x = MathExtension.clamp(this.pos_x, left, right );
        this.pos_y = MathExtension.clamp(this.pos_y, top,  bottom);
    },

    collision : function(other)
    {
        if(other.id == this.id) { return; }

        var r = 20;

        var dx = this.pos_x - other.pos_x;
        var dy = this.pos_y - other.pos_y;
        
        if(this.is_alive && other.is_alive)
        {
            if(Math.hypot(dx, dy) <= r+r)
            {
                //衝突
                this .is_alive = false;
                other.is_alive = false;

                this .deathCount++;
                this .returnTime = 180; //3 second
                other.deathCount++;
                other.returnTime = 180; //3 second
                socket.emit('sendplayerdeath', this);
                socket.emit('sendplayerdeath', other);
                return;
            }
        }

        var br = 10;
        if(this.is_alive)
        {
            for(var i = 0; i < other.bulletCollection.length; i++)
            {
                var ob = other.bulletCollection[i];
                var dx = this.pos_x - ob.pos_x;
                var dy = this.pos_y - ob.pos_y;

                if(Math.hypot(dx, dy) <= r + br)
                {
                    this.is_alive   = false;
                    this.deathCount++;
                    this.returnTime = 180;
                    other.killCount ++;
                    socket.emit('sendplayerdeath', this);
                    return;
                }
            }
        }

        if(other.is_alive)
        {
            for(var i = 0; i < this.bulletCollection.length; i++)
            {
                var sb = this.bulletCollection[i];
                var dx = other.pos_x - sb.pos_x;
                var dy = other.pos_y - sb.pos_y;
                
                //斜辺を求める
                if(Math.hypot(dx, dy) <= r + br)
                {
                    other.is_alive = false;
                    other.deathCount++;
                    other.returnTime = 180;
                    this.killCount ++;
                    socket.emit('sendplayerdeath', other);
                    return;
                }
            }
        }
    }
}