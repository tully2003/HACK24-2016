using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Hack24.Startup))]

namespace Hack24
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
            app.UseNancy();
        }
    }
}
