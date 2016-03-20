using System;
using Hack24.Engine;
using Newtonsoft.Json;

namespace Hack24.Hubs
{
    using Microsoft.AspNet.SignalR;

    public class GameHub : Hub
    {
        /// <summary>
        /// Creates a new game.
        /// </summary>
        /// <param name="hostName">The name of the player acting as host.</param>
        /// <returns>The game state.</returns>
        public object CreateGame(string hostName)
        {
            GameCoordinator.Instance.Game = new Game(hostName);
            var state = GameCoordinator.Instance.Game.GetGameState();
            return state;
        }

        /// <summary>
        /// Allows a player to join a game that already exists.
        /// </summary>
        /// <param name="playerName">The name of the joining player.</param>
        /// <returns>The game state.</returns>
        public object JoinGame(string playerName)
        {
            GameCoordinator.Instance.Game.AddPlayer(playerName);
            var state = GameCoordinator.Instance.Game.GetGameState();
            return state;
        }

        public void PlayerReady(string playerName)
        {
            GameCoordinator.Instance.Game.PlayerReady(playerName);
        }

        public void StartGame()
        {
            GameCoordinator.Instance.Game.GameStart();
        }
        
        /// <summary>
        /// Allows a player to leave a game in progress.
        /// Probably will be denied if the player is host.
        /// </summary>
        /// <param name="playerName">The name of the leaving player.</param>
        /// <param name="gameReference">The game reference.</param>
        /// <returns>True is player has left, otherwise false.</returns>
        public bool LeaveGame(string playerName, string gameReference)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Allows a player to notifiy the server that they have moved.
        /// </summary>
        /// <param name="gameReference">The game reference.</param>
        /// <param name="playerName">The name of the player who has moved.</param>
        /// <param name="x">The new x coordinate of the player.</param>
        /// <param name="y">The new y coordinate of the player.</param>
        public void PlayerMove(string gameReference, string playerName, int x, int y)
        {
        }

        /// <summary>
        /// Places a new Maze Piece in the game maze.
        /// </summary>
        /// <param name="mazePieceId"></param>
        /// <param name="xCoordinate"></param>
        /// <param name="yCoordinate"></param>
        /// <param name="encodedImage"></param>
        public void PlaceMazePiece(int mazePieceId, int xCoordinate, int yCoordinate, string encodedImage)
        {
            //Clients.All.boo("test");
            //Clients.All.placeMazePiece(mazePieceId, xCoordinate, yCoordinate, encodedImage);
        }

        public void CollectMazePiece(string gameReference, string playerName, int mazePieceId)
        {
        }

        public void PlacePiece()
        {
        }

        public void GameWon()
        {
        }

        public void Send(string player)
        {
            Clients.All.playerJoined(player);
        }

        public string GetGameState()
        {
            var state = GameCoordinator.Instance.Game.GetGameState();
            return JsonConvert.SerializeObject(state);
        }
    }
}