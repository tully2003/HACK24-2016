var gs = (function($) {
    var game = $.connection.gameHub;
    var server = game.server;
    var client = game.client;

    $(function() {
        // set up all the signalr stuff here :-)
        $.connection.hub.start().done(function() {
            game.client.playerJoined = function (name) {
                console.log("Player " + name + " joined the game");
                if (typeof gs.onPlayerJoined === 'function')
                    gs.onPlayerJoined();
            };

            game.client.playerLeft = function (name) {
                console.log("Player " + name + " left the game");
                if (typeof gs.onPlayerLeft === 'function')
                    gs.onPlayerLeft();
            };

            game.client.gameStarting = function () {
                if (typeof gs.onGameStarting === 'function')
                    gs.onGameStarting();
            };

            game.client.gameStarted = function () {
                if (typeof gs.onGameStarted === 'function')
                    gs.onGameStarted();
            };

            game.client.mazePieceCollected = function () {
                if (typeof gs.onMazePieceCollected === 'function')
                    gs.onMazePieceCollected();
            };

            game.client.puzzlePiecePlaced = function () {
                if (typeof gs.onPuzzlePiecePlaced === 'function')
                    gs.onPuzzlePiecePlaced();
            };

            game.client.gameCompleted = function () {
                if (typeof gs.onGameCompleted === 'function')
                    gs.onGameCompleted();
            };
        });
    });

    return {
        createGame: function() {
            server.createGame();
        },
        joinGame: function() {
            server.joinGame();
        },
        startGame: function() {
            server.startGame();
        },
        ready: function() {
            server.playerReady();
        }, 
        moved: function() {
            server.playerMoved();
        }, 
        collect: function() {
            server.collectMazePiece();
        }, 
        place: function() {
            server.placePiece();
        }
    };
}(jQuery))
