namespace Hack24.Engine
{
    using System;
    using Hubs;
    using Microsoft.AspNet.SignalR;
    using Microsoft.AspNet.SignalR.Hubs;

    public class GameCoordinator
    {
        private static readonly Lazy<GameCoordinator> instance =
            new Lazy<GameCoordinator>(() => new GameCoordinator(GlobalHost.ConnectionManager.GetHubContext<GameHub>().Clients));

        private readonly IHubConnectionContext<dynamic> clients;

        public GameCoordinator(IHubConnectionContext<dynamic> clients)
        {
            this.clients = clients;
        }

        public static GameCoordinator Instance
        {
            get { return instance.Value; }
        }
    }
}