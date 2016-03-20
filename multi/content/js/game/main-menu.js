var Packed24 = Packed24 || {};

Packed24.MainMenu = function(){};

Packed24.MainMenu.prototype =  {
    create: function() {
        this.state.start('Game');
    }
};
