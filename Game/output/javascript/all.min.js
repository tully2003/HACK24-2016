(function ($) {
	$(document).ready(function(){
		var gameWidth = $(window).width();
      var gameHeight = gameWidth * 0.56;
      
		var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/gridtiles.png');
    game.load.spritesheet('player', 'assets/spaceman.png', 16, 16);
    game.load.spritesheet('coin', 'assets/coin.png', 32, 32);

}
var coins;
var map;
var layer;
var cursors;
var player;

function create() {

   game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('map');

    //  Now add in the tileset
    map.addTilesetImage('walls', 'tiles');
    
    //  Create our layer
    layer = map.createLayer('Tile Layer 1');


    map.setCollisionBetween([0,150]);
    //  Resize the world
    layer.resizeWorld();

    //  This isn't totally accurate, but it'll do for now
    

    //  Un-comment this on to see the collision tiles
   //layer.debug = true;

    coins = game.add.group();
    coins.enableBody = true;

    map.createFromObjects('Object Layer 1', 89, 'coin', 0, true, false, coins);

    //  Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [8,9], 10, true);
    player.animations.add('right', [1,2], 10, true);
    player.animations.add('up', [11,12,13], 10, true);
    player.animations.add('down', [4,5,6], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(10, 14, 2, 1);

    //game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    //var help = game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
    //help.fixedToCamera = true;

}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.overlap(player, coins, collectCoin, null, this);

    player.body.velocity.set(0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 100;
        player.play('right');
    }
    else
    {
        player.animations.stop();
    }
    
    if (cursors.up.isDown)
    {
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 100;
        player.play('down');
    }
    else
    {
        player.animations.stop();
    }

}

function collectCoin(player, coin) {

    coin.kill();

}

function render() {

    // game.debug.body(player);

}



	});
})(jQuery);

