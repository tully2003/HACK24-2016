var Packed24 = Packed24 || {};

Packed24.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Packed 24');
 
Packed24.game.state.add('Boot', Packed24.Boot);
Packed24.game.state.add('Preload', Packed24.Preload);
Packed24.game.state.add('MainMenu', Packed24.MainMenu);
Packed24.game.state.add('Game', Packed24.Game);