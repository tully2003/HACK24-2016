namespace Hack24.Modules
{
    using DataAccess;
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ => "Hello world";

            Get["/test"] = _=> "testing";

            Get["/dbtest"] = _ =>
            {
                return Store.Alive().ToString();
            };
        }
    }
}