var Packed24 = Packed24 || {};

Packed24.Game = function(){};

var coins;
var map;
var layer;
var cursors;
var player;
var pieces;
var puzzle_pieces;

var player_speed = 300;

Packed24.Game.prototype = {
    init: function() {

    },
  create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.stage.backgroundColor = '#787878';
      this.game.stage.backgroundImage =

      this.game.add.sprite(0, 0, 'background');

      sizeGameToWindow(this.game);

      map = this.game.add.tilemap('map');

      //  Now add in the tileset
      //map.addTilesetImage('walls', 'tiles');
      map.addTilesetImage('council', 'tiles');

      //  Create our layer
      layer = map.createLayer('Collision');

      map.setCollision([52]);
      //  Resize the world
      layer.resizeWorld();

      //  Un-comment this on to see the collision tiles
      layer.debug = true;

      //  Player
      player = this.game.add.sprite(100, 100, 'player', 1);
      player.animations.add('left', [8, 9], 10, true);
      player.animations.add('right', [1, 2], 10, true);
      player.animations.add('up', [11, 12, 13], 10, true);
      player.animations.add('down', [4, 5, 6], 10, true);

      this.game.physics.enable(player, Phaser.Physics.ARCADE);
      player.body.collideWorldBounds = true;

      player.body.setSize(128, 128, 0, 0);

      cursors = this.game.input.keyboard.createCursorKeys();

      window.cursors = cursors;
      //var help = game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
      //help.fixedToCamera = true;
  },
  update: function() {
      this.game.physics.arcade.collide(player, layer);
      //game.physics.arcade.overlap(player, coins, collectCoin, null, this);

      player.body.velocity.set(0);

      if (cursors.left.isDown) {

          movePlayer(player, 'left');
      }
      else if (cursors.right.isDown) {
          movePlayer(player, 'right');
      }
      else {
          player.animations.stop('left');
          player.animations.stop('right');
          //player.animations.stop();
      }

      if (cursors.up.isDown) {
          movePlayer(player, 'up');
      }
      else if (cursors.down.isDown) {
          movePlayer(player, 'down');
      }
      else {
          player.animations.stop('up');
          player.animations.stop('down');
          //player.animations.stop();
      }
  },
};

function movePlayer(playerObj, direction) {
    switch (direction) {
        case 'up':
            playerObj.body.velocity.y = -player_speed;
            playerObj.play('up');
            break;
        case 'down':
            playerObj.body.velocity.y = player_speed;
            playerObj.play('down');
            break;
        case 'left':
            playerObj.body.velocity.x = -player_speed;
            playerObj.play('left');
            break;
        case 'right':
            playerObj.body.velocity.x = player_speed;
            playerObj.play('right');
            break;
    }
}

function collectCoin(player, coin) {

    coin.kill();
    //add to player second screen
}

function render() {

    this.game.debug.body(player);

}


function sizeGameToWindow(game) {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

/*
chrome.runtime.onMessage.addListener(function (msg, sender) {

    if (msg.name === "keyup") {
        cursors.up.isDown = false;
        cursors.down.isDown = false;
        cursors.right.isDown = false;
        cursors.left.isDown = false;
        return;
    }

    switch (msg.keyCode) {
        case 37:
            cursors.up.isDown = false;
            cursors.down.isDown = false;
            cursors.right.isDown = false;
            cursors.left.isDown = true;
            break;
        case 38:
            cursors.up.isDown = true;
            cursors.down.isDown = false;
            cursors.right.isDown = false;
            cursors.left.isDown = false;
            break;
        case 39:
            cursors.up.isDown = false;
            cursors.down.isDown = false;
            cursors.right.isDown = true;
            cursors.left.isDown = false;
            break;
        case 40:
            cursors.up.isDown = false;
            cursors.down.isDown = true;
            cursors.right.isDown = false;
            cursors.left.isDown = false;
            break;
    }


    if (msg.keyCode === 39) {
    }



    $.event.trigger({ type: 'keypress', which: 39 });
});
*/

$(window).bind('resize', function (e) {
    window.resizeEvt;
    $(window).resize(function () {
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function () {
            sizeGameToWindow();
        }, 250);
    });
});