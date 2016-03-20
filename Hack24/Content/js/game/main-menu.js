var Packed24 = Packed24 || {};

Packed24.MainMenu = function(){};

Packed24.MainMenu.prototype = {
    init: function () {

    },
    create: function () {
        setTimeout(function () {
            gs.createGame('playah 1');
            gs.joinGame('playah 2');
            gs.joinGame('playah 3');
            gs.ready('playah 1');
            gs.ready('playah 2');
            gs.ready('playah 3');
            gs.startGame();
        }, 250);
        

        this.state.start('Game');
    }
};
