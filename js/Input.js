var Input = function()
{
    this.KeyStates    = new Array(256);
    this.KeyPressTime = new Array(256);
    for(var i = 0; i < this.KeyStates.Length; i++)
    {
        this.KeyStates[i]    = false;
        this.KeyPressTime[i] = 0;
    }

    this.mouse_x = 0;
    this.mouse_y = 0;
};

Input.prototype =
{
    update      : function()
    {
        for(var i = 0; i < this.KeyStates.Length; i++)
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
    },

    isKeydown   : function(code)
    {
        return this.KeyStates[code]    == true &&
               this.KeyPressTime[code] == 0;
    },

    keydown     : function(code)
    {
        return this.KeyStates[code] == true;
    },

    isKeyup     : function(code)
    {
        return this.KeyStates[code]    == false &&
               this.KeyPressTime[code] != 0;
    },

    keyup       : function(code)
    {
        return this.KeyStates[code] == false;
    }
}