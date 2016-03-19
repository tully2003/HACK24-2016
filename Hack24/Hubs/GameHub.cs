namespace Hack24.Hubs
{
    using Microsoft.AspNet.SignalR;

    public class GameHub : Hub
    {
        public void Send(string player)
        {
            Clients.All.playerJoined(player);
        }
    }
}