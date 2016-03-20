var Packed24 = Packed24 || {};

Packed24.Game = function(){};

var coins;
var map;
var layer;
var cursors;
var player;
var pieces;

Packed24.Game.prototype = {
  create: function() {
       this.game.stage.backgroundColor = '#787878';
   
    map = this.game.add.tilemap('map');

    //  Now add in the tileset
    map.addTilesetImage('walls', 'tiles');
    
    //  Create our layer
    layer = map.createLayer('Tile Layer 1');

    map.setCollision([90,99]);

    //  Resize the world
    layer.resizeWorld();

    //  Un-comment this on to see the collision tiles
    //layer.debug = true;

    coins = this.game.add.group();
    //puzzle_pieces = this.game.add.group();

    coins.enableBody = true;

    map.createFromObjects('Object Layer 1', 90, 'coin', 0, true, false, coins);
    var coin = coins.create(this.game.world.randomX, this.game.world.randomY, 'coin');
    coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    coins.callAll('animations.play', 'animations', 'spin');

    //  Player
    player = this.game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [8,9], 10, true);
    player.animations.add('right', [1,2], 10, true);
    player.animations.add('up', [11,12,13], 10, true);
    player.animations.add('down', [4,5,6], 10, true);

    this.game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(10, 14, 2, 1);

    //this.game.camera.follow(player);

    cursors = this.game.input.keyboard.createCursorKeys();

    //var help = this.game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
    //help.fixedToCamera = true;
    //new Tile(layer, index, x, y, width, height)
  },
  update: function() {
    this.game.physics.arcade.collide(player, layer);
    this.game.physics.arcade.overlap(player, coins, collectCoin, null, this);

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
  },
};

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