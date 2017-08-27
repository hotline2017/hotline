var MyInput = function()
{
    this.KeyStates    = new Array(256);
    this.KeyPressTime = new Array(256);
    
    this.mouse_x = 0;
    this.mouse_y = 0;
    this.clickStatus = false;
    this.clickTime   = 0;
};

MyInput.prototype =
{
    init        : function()
    {
        for(var i = 0; i < 256; i++)
        {
            this.KeyStates[i]    = false;
            this.KeyPressTime[i] = 0;
        }
    },

    rateUpdate  : function()
    {
        for(var i = 0; i < 256; i++)
        {
            if(this.KeyStates[i]    == true)
            {
                this.KeyPressTime[i] += 1;
                continue;
            }

            if(this.KeyStates[i]    == false && 
               this.KeyPressTime[i] != 0)
            {
                this.KeyPressTime[i] = 0;
                continue;
            }
        }

        if(this.clickStatus == true)
        {
            this.clickTime += 1;
            return;
        }

        if(this.clickStatus == false &&
           this.clickTime   != 0)
        {
            this.clickTime = 0;
            return;
        }
    },

    isKeydown   : function(code)
    {
        return this.KeyStates[code]    == true &&
               this.KeyPressTime[code] == 0;
    },

    keydown     : function(code)
    {
        return this.KeyStates[code]    == true;
    },

    isKeyup     : function(code)
    {
        return this.KeyStates[code]    == false &&
               this.KeyPressTime[code] != 0;
    },

    keyup       : function(code)
    {
        return this.KeyStates[code]    == false;
    },

    isMousedown : function()
    {
        return this.clickStatus == true &&
               this.clickTime   == 0;
    },

    mousedown   : function()
    {
        return this.clickStatus == true;
    },

    isMouseup   : function()
    {
        return this.clickStatus == false &&
               this.clickTime   != 0;
    },
    
    mouseup     : function()
    {
        return this.clickStatus == false;
    }
}