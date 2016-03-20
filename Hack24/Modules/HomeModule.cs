using Newtonsoft.Json;

namespace Hack24.Modules
{
    using DataAccess;
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ => View["index_.html"];
        }
    }
}