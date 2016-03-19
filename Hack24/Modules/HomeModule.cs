namespace Hack24.Modules
{
    using DataAccess;
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ => "Hello world";

            Get["/dbtest"] = _ =>
            {
                return Store.Alive().ToString();
            };

            Post["/StartGame/{PlayerName}"] = x =>
            {
                var code = DataStore.StartGame(x.PlayerName);

                return $"'{x.PlayerName}' has started a game. Game code: {code}";
            };

            Post["/JoinGame/{GameRef}/{PlayerName}"] = x =>
            {
                DataStore.JoinGame(x.GameRef, x.PlayerName);

                return "Joined game!";
            };
        }
    }
}