var gs = (function($) {
    var game = $.connection.gameHub;
    var server = game.server;
    var client = game.client;

    // set up all the signalr stuff here :-)
    $.connection.hub.logging = true;
    $.connection.hub.start().done(function () {
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

        client.placeMazePiece = function (mazePieceId, xCoordinate, yCoordinate, encodedImage) {
            alert('new piece!');
            gs.onMazePlaceAdded(mazePieceId, xCoordinate, yCoordinate, encodedImage);
        }
        
        client.mazePieceCollected = function () {
            if (typeof gs.onMazePieceCollected === 'function')
                gs.onMazePieceCollected();
        };

        client.puzzlePiecePlaced = function () {
            if (typeof gs.onPuzzlePiecePlaced === 'function')
                gs.onPuzzlePiecePlaced();
        };

        client.gameCompleted = function () {
            if (typeof gs.onGameCompleted === 'function')
                gs.onGameCompleted();
        };
    });

    var onMazePlaceAdded = function (mazePieceId, xCoordinate, yCoordinate, encodedImage) {
        alert('new maze piece! ' + mazePieceId + xCoordinate + yCoordinate + encodedImage);
    }

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