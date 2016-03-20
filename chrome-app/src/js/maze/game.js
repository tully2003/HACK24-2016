var Packed24 = Packed24 || {};

Packed24.Game = function(){};

var map;
var layer;
var cursors;
var player;
var puzzle_pieces = [
    'puzzle-piece-0',
    'puzzle-piece-1',
    'puzzle-piece-2',
    'puzzle-piece-3',
    'puzzle-piece-4',
    'puzzle-piece-5',
    'puzzle-piece-6',
    'puzzle-piece-7',
    'puzzle-piece-8'    
];
var pieces;

var player_speed = 500;

Packed24.Game.prototype = {
    init: function () {
    },
  create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.stage.backgroundColor = '#787878';
      this.game.stage.backgroundImage =

      this.game.add.sprite(0, 0, 'background');

      sizeGameToWindow(this.game);

      map = this.game.add.tilemap('map');

      //  Now add in the tileset
      map.addTilesetImage('council', 'tiles');

      //  Create our layer
      layer = map.createLayer('Collision');

      map.setCollision([4]);
      //  Resize the world
      layer.resizeWorld();

      //  Un-comment this on to see the collision tiles
      layer.debug = true;

      //  Player
      this.createPlayer();

      // pieces
      this.createPieces();

      cursors = this.game.input.keyboard.createCursorKeys();
      window.cursors = cursors;
      //var help = game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
      //help.fixedToCamera = true;
  },
  update: function() {
      this.game.physics.arcade.collide(player, layer);
      this.game.physics.arcade.overlap(player,  pieces, collectPiece, null, this);

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
  createPieces: function () {
      pieces = this.game.add.group();
      //enable physics in them
      pieces.enableBody = true;
      pieces.physicsBodyType = Phaser.Physics.ARCADE;

      gs.onPlaceMazePiece = function (id, position, x, y) {
          // this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
          var piece = pieces.create((x * 128) + 3, (y * 128) + 3, puzzle_pieces[position]);
          piece.scale.setTo(0.34, 0.5);
          piece.meta = {
              id: id,
              position: position
          }
      };
  },
  createPlayer: function () {
      player = this.game.add.sprite(100, 100, 'player', 1);
      player.animations.add('left', [8, 9], 10, true);
      player.animations.add('right', [1, 2], 10, true);
      player.animations.add('up', [11, 12, 13], 10, true);
      player.animations.add('down', [4, 5, 6], 10, true);
      this.game.physics.enable(player, Phaser.Physics.ARCADE);
      player.body.collideWorldBounds = true;
      player.body.setSize(120, 120, 0, 0);
  }
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

    gs.moved(Math.floor((playerObj.position.x / 128)), Math.floor((playerObj.position.y / 128)));
}

function collectPiece(player, piece) {
    piece.kill();
    gs.collect(piece.meta.id);
    chrome.runtime.sendMessage({
        cmd: "collectedPiece",
        piecePosition: piece.meta.position
    });
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
