(function ($) {
	$(document).ready(function(){
		var gameWidth = $(window).width();
      var gameHeight = gameWidth * 0.56;
      
		var game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', '/Content/assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '/content/assets/gridtiles.png');
    game.load.spritesheet('player', '/content/assets/spaceman.png', 16, 16);
    game.load.spritesheet('coin', '/content/assets/coin.png', 32, 32);
    game.load.spritesheet('puzzle_piece', '/content/assets/puzzle_piece.png', 32, 32);

}
var coins;
var map;
var layer;
var cursors;
var player;
var pieces;
var puzzle_pieces;

function create() {

   game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('map');

    //  Now add in the tileset
    map.addTilesetImage('walls', 'tiles');
    
    //  Create our layer
    layer = map.createLayer('Tile Layer 1');

    //layerObj = map.createLayer('Object Layer 1');


    map.setCollision([90,99]);
    //  Resize the world
    layer.resizeWorld();

    //  Un-comment this on to see the collision tiles
   //layer.debug = true;

    coins = game.add.group();
    puzzle_pieces = game.add.group();

    coins.enableBody = true;

    map.createFromObjects('Object Layer 1', 90, 'coin', 0, true, false, coins);
    coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');

    if (coins.children.length > 0) {
        for (var i = 0; i < coins.children.length; i++) {

            //game.add.sprite(coins.children[1].world.x, coins.children[0].world.y, 'player', 1);
        }
        //game.add.sprite(coins.children[1].world.x, coins.children[0].world.y, 'player', 1);
    }

    debugger

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
        movePlayer(player, 'left');
    }
    else if (cursors.right.isDown)
    {
        movePlayer(player,'right');
    }
    else
    {
        player.animations.stop();
    }
    
    if (cursors.up.isDown)
    {
        movePlayer(player, 'up');
    }
    else if (cursors.down.isDown)
    {
        movePlayer(player, 'down');
    }
    else
    {
        player.animations.stop();
    }

}

function movePlayer(playerObj, direction) {
    switch (direction) {
        case 'up':
            playerObj.body.velocity.y = -100;
            playerObj.play('up');
            break;
        case 'down':
            playerObj.body.velocity.y = 100;
            playerObj.play('down');
            break;
        case 'left':
            playerObj.body.velocity.x = -100;
            playerObj.play('left');
            break;
        case 'right':
            playerObj.body.velocity.x = 100;
            playerObj.play('right');
            break;
    }
}

function collectCoin(player, coin) {

    coin.kill();
    //add to player second screen
}

function render() {

    //game.debug.body(player);

}



	});
})(jQuery);

