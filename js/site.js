document.write('<script type="text/javascript" language="JavaScript" src="js/jquery.min.js"></script>');

var Site = function(id, pos_x, pos_y)
{
    this.image = new Image(); 
    this.image.src = 'image/site' + id + '.png';
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.scale = 0;
    this.angle = Math.random() * Math.PI;
};

Site.prototype =
{
    draw : function(ctx)
    {
        this.scale += 0.033;
        this.scale = Math.min(this.scale, 0.75);

        ctx.save();
        ctx.translate(this.pos_x, this.pos_y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, 0, 0, 500, 500, -62.5*this.scale, -62.5*this.scale, 125*this.scale, 125*this.scale);

        ctx.restore();
    }
};