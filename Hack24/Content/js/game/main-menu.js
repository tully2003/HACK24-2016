var Packed24 = Packed24 || {};

Packed24.MainMenu = function(){};

Packed24.MainMenu.prototype =  {
    create: function () {
        setTimeout(function () {
            gs.createGame('test');
        }, 250);
        

        this.state.start('Game');
    }
};
