namespace Hack24.DataAccess
{
    using System;
    using System.Collections.Generic;
    using System.Data.Common;
    using System.Data.SQLite;
    using System.IO;
    using System.Linq;
    using System.Web;
    using Dapper;

    public class Store
    {
        private const string DbName = "Hack24.sqlite";
        private const string SetupScript = "DataAccess/Scripts/setup.sql";
        private const string CugConnectionString = "Data Source=" + DbName + ";Version=3;";

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
            SQLiteConnection connection = new SQLiteConnection(CugConnectionString);
            connection.Open();
            return connection;
        }
    }
}