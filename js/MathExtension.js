var MathExtension =
{
    lerp : function(a, b, t)
    {
        return a*(1-t)+b*t;
    },

    clamp : function(n, min, max)
    {
        return Math.min(max, Math.max(n, min));
    },

    random : function(min,max)
    {
        return  a = Math.floor( Math.random() * (max + 1 - min) ) + min ;
    }
};