var Packed24 = Packed24 || {};

Packed24.Boot = function(){};

Packed24.Boot.prototype = {
    init: function() {
        this.game.stage.disableVisibilityChange = true;
    },
    preload: function() {
        this.game.load.tilemap('map', '/Content/assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', '/content/assets/gridtiles.png');
        this.game.load.spritesheet('player', '/content/assets/spaceman.png', 16, 16);
        this.game.load.spritesheet('coin', '/content/assets/coin.png', 32, 32);
    },
    create: function() {
        //loading screen will have a white background
        this.game.stage.backgroundColor = '#fff';

        this.state.start('Preload');
    }
};