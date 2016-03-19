namespace Hack24.DataAccess
{
    using System.Data.Common;
    using System.Data.SQLite;
    using System.IO;
    using System.Web.Hosting;
    using Dapper;

    public class Store
    {
        private static readonly string DbName = HostingEnvironment.MapPath("~/App_Data/Hack24.sqlite");
        private static readonly string SetupScript = HostingEnvironment.MapPath("~/DataAccess/Scripts/setup.sql");
        private static readonly string ConnectionString = "Data Source=" + DbName + ";Version=3;";

        static Store()
        {
            InitialiseDb();
        }

        private static void InitialiseDb()
        {
            if (!File.Exists(DbName))
                CreateDb();
        }

        private static void CreateDb()
        {
            SQLiteConnection.CreateFile(DbName);

            using (var connection = CreateOpenConnection())
            {
                string up = File.ReadAllText(SetupScript);
                connection.Execute(up);
            }
        }

        public static bool Alive()
        {
            using (var connection = CreateOpenConnection())
            {
                return true;
            }
        }

        internal static DbConnection CreateOpenConnection()
        {
            SQLiteConnection connection = new SQLiteConnection(ConnectionString);
            connection.Open();
            return connection;
        }
    }
}