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
        
        public void PlayerMove(string playerName, int x, int y)
        {
            GameCoordinator.Instance.Game.MovePlayer(playerName, x, y);
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