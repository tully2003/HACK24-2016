namespace Hack24.Modules
{
    using DataAccess;
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ =>
            {
                return Store.Alive().ToString();
            };

            Get["/dbtest"] = _ =>
            {
                return Store.Alive().ToString();
            };
        }
    }
}