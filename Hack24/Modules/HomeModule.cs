namespace Hack24.Modules
{
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ => "Hello world";

            Get["/test"] = _ => "testing";

            Post["/StartGame/{PlayerName}"] = x =>
            {
                var code = DataStore.StartGame(x.PlayerName);

                return $"'{x.PlayerName}' has started a game. Game code: {code}";
            };
        }
    }
}