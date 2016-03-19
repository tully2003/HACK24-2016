using Newtonsoft.Json;

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
                var reference = DataStore.StartGame(x.PlayerName);

                return JsonConvert.SerializeObject(new { reference });
            };

            Post["/JoinGame/{GameRef}/{PlayerName}"] = x =>
            {
                DataStore.JoinGame(x.GameRef.ToString().ToUpper(), x.PlayerName);

                return "Joined game!";
            };
        }
    }
}