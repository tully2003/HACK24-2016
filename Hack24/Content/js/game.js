(function ($) {
    $(function () {
        // Declare a proxy to reference the hub.
        var game = $.connection.gameHub;

        game.client.playerJoined = function (name) {
            console.log("Player " + name + " joined the game");
        };

        game.client.playerLeft = function (name) {
            console.log("Player " + name + " left the game");
        };

        game.client.gameStarting = function () {

        };

        game.client.gameStarted = function () {

        };

        game.client.mazePieceCollected = function () {

        };

        game.client.puzzlePiecePlaced = function () {

        };

        game.client.gameCompleted = function () {

        };

        $.connection.hub.start().done(function () {
            function createGame() {
                game.server.createGame();
            }

            function joinGame() {
                game.server.joinGame();
            }

            function startGame() {
                game.server.joinGame();
            }

            function ready() {
                game.server.playerReady();
            }

            function moved() {
                game.server.playerMoved();
            }

            function collect() {
                game.server.collectMazePiece();
            }

            function place() {
                game.server.placePiece();
            }
        });
    });
}(jQuery, window, document));