namespace Hack24.Hubs
{
    using Microsoft.AspNet.SignalR;

    public class GameHub : Hub
    {
        public void CreateGame()
        {
        }

        public void JoinGame()
        {
        }

        public void LeaveGame()
        {
        }

        public void PlayerReady()
        {
        }

        public void StartGame()
        {
        }

        public void PlayerMove()
        {
        }

        public void CollectPiece()
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
    }
}