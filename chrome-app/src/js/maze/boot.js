var Packed24 = Packed24 || {};

Packed24.Boot = function(){};

Packed24.Boot.prototype = {
    init: function() {
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.backgroundColor = '#fff';
    },
    preload: function() {
        this.game.load.tilemap('map', '/assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', '/images/council_tiles.png');
        this.game.load.spritesheet('player', '/images/spaceman.png', 128, 128);
        this.game.load.image('background', '/images/background.png');
        this.game.load.image('puzzle-piece-0', '/images/puzzle/0.jpg');
        this.game.load.image('puzzle-piece-1', '/images/puzzle/1.jpg');
        this.game.load.image('puzzle-piece-2', '/images/puzzle/2.jpg');
        this.game.load.image('puzzle-piece-3', '/images/puzzle/3.jpg');
        this.game.load.image('puzzle-piece-4', '/images/puzzle/4.jpg');
        this.game.load.image('puzzle-piece-5', '/images/puzzle/5.jpg');
        this.game.load.image('puzzle-piece-6', '/images/puzzle/6.jpg');
        this.game.load.image('puzzle-piece-7', '/images/puzzle/7.jpg');
        this.game.load.image('puzzle-piece-8', '/images/puzzle/8.jpg');
    },
    create: function() {
        //loading screen will have a white background
        this.state.start('Preload');
    }
};