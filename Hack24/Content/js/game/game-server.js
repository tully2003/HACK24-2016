var gs = (function($) {
    var game = $.connection.gameHub;
    var server = game.server;
    var client = game.client;

    client.playerJoined = function (name) {
        console.log("Player " + name + " joined the game");
        if (typeof gs.onPlayerJoined === 'function')
            gs.onPlayerJoined();
    };

    client.playerLeft = function (name) {
        console.log("Player " + name + " left the game");
        if (typeof gs.onPlayerLeft === 'function')
            gs.onPlayerLeft();
    };

    client.gameStarting = function () {
        if (typeof gs.onGameStarting === 'function')
            gs.onGameStarting();
    };

    client.gameStarted = function () {
        if (typeof gs.onGameStarted === 'function')
            gs.onGameStarted();
    };

    client.placeMazePiece = function (mazePieceId, position, x, y) {
        if (typeof gs.onPlaceMazePiece === 'function')
            gs.onPlaceMazePiece(mazePieceId, position, x, y);
    }

    client.mazePieceCollected = function (name, id) {
        if (typeof gs.onMazePieceCollected === 'function')
            gs.onMazePieceCollected(name, id);
    };

    client.puzzlePiecePlaced = function () {
        if (typeof gs.onPuzzlePiecePlaced === 'function')
            gs.onPuzzlePiecePlaced();
    };

    client.gameCompleted = function () {
        if (typeof gs.onGameCompleted === 'function')
            gs.onGameCompleted();
    };

    // set up all the signalr stuff here :-)
    $.connection.hub.logging = true;
    $.connection.hub.start().done(function () {
        console.log("signlar kicked off!")
    });

    return {
        createGame: function(host) {
            server.createGame(host);
        },
        joinGame: function(playerName) {
            server.joinGame(playerName);
        },
        startGame: function() {
            server.startGame();
        },
        ready: function(playerName) {
            server.playerReady(playerName);
        }, 
        moved: function(x, y) {
            server.playerMove('host', x, y);
        },
        collect: function(id) {
            server.pieceCollected('host', id);
        },
        place: function() {
            server.placePiece();
        },
        getGameState: function () {
            server.getGameState();
        }
    };
}(jQuery))
