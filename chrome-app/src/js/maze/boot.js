var Packed24 = Packed24 || {};

Packed24.Boot = function(){};

Packed24.Boot.prototype = {
    init: function() {
        this.game.stage.disableVisibilityChange = true;
    },
    preload: function() {
        this.game.load.tilemap('map', '/Content/assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', '/content/assets/council_tiles.png');
        this.game.load.spritesheet('player', '/content/assets/spaceman.png', 128, 128);
        this.game.load.image('background', '/content/assets/background.png');
        this.game.load.image('puzzle-piece-0', '/content/assets/puzzle/0.jpg');
        this.game.load.image('puzzle-piece-1', '/content/assets/puzzle/1.jpg');
        this.game.load.image('puzzle-piece-2', '/content/assets/puzzle/2.jpg');
        this.game.load.image('puzzle-piece-3', '/content/assets/puzzle/3.jpg');
        this.game.load.image('puzzle-piece-4', '/content/assets/puzzle/4.jpg');
        this.game.load.image('puzzle-piece-5', '/content/assets/puzzle/5.jpg');
        this.game.load.image('puzzle-piece-6', '/content/assets/puzzle/6.jpg');
        this.game.load.image('puzzle-piece-7', '/content/assets/puzzle/7.jpg');
        this.game.load.image('puzzle-piece-8', '/content/assets/puzzle/8.jpg');
    },
    create: function() {
        //loading screen will have a white background
        this.game.stage.backgroundColor = '#fff';

        this.state.start('Preload');
    }
};