namespace Hack24.DataAccess
{
    using System;
    using System.Data.Common;
    using System.Data.SQLite;
    using System.IO;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web.Hosting;
    using Dapper;

    public class Store
    {
        private static readonly string DbName = HostingEnvironment.MapPath("~/App_Data/Hack24.sqlite");
        private static readonly string SetupScriptsDirectory = HostingEnvironment.MapPath("~/DataAccess/Scripts");
        
        private static readonly string ConnectionString = "Data Source=" + DbName + ";Version=3;";

        static Store()
        {
            InitialiseDb();
        }

        private static void InitialiseDb()
        {
            if (!File.Exists(DbName) || GetExistingSchemaHash() != CalulateScriptsHash())
                CreateDb();
        }

        private static void CreateDb()
        {
            SQLiteConnection.CreateFile(DbName);

            using (var connection = CreateOpenConnection())
            {
                string up = BuildUpScripts();
                connection.Execute(up);
            }

            SaveSchemaHash(CalulateScriptsHash());

            SeedDb();
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

        private static string CalulateScriptsHash()
        {
            string hash = string.Empty;
            string scriptContents = BuildUpScripts();

            using (var provider = new MD5CryptoServiceProvider())
            {
                return BitConverter.ToString(provider.ComputeHash(Encoding.UTF8.GetBytes(scriptContents))).Replace("-", string.Empty);
            }
        }

        private static string BuildUpScripts()
        {
            return string.Join("\n", Directory.GetFiles(SetupScriptsDirectory, "*.sql").Select(f => File.ReadAllText(f)));
        }

        private static string GetExistingSchemaHash()
        {
            try
            {
                using (var connection = CreateOpenConnection())
                {
                    return connection.ExecuteScalar<string>("select Hash from SchemaVersion limit 1") ?? string.Empty;
                }
            }
            catch
            {
                return string.Empty;
            }
        }

        private static void SaveSchemaHash(string hash)
        {
            using (var connection = CreateOpenConnection())
            {
                connection.Execute("INSERT INTO SchemaVersion(Hash) VALUES(@hash)", param: new { hash });
            }
        }

        private static void SeedDb()
        {
            using (var conn = CreateOpenConnection())
            {
                // TODO: actual useful seed stuff
                conn.Execute("INSERT INTO Puzzle (Name, EncodedImage) VALUES ('testPuzzle', '0123456789abcdefghijklmnopqrstuvwxyz')");
                var puzzleId = conn.Query<int>("SELECT Id FROM Puzzle").First();
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 1, '10123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 2, '20123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 3, '30123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 4, '40123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 5, '50123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 6, '60123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 7, '70123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 8, '80123456789abcdefghijklmnopqrstuvwxyz')");
                conn.Execute($"INSERT INTO Piece (PuzzleId, Position, EncodedImage) VALUES ({puzzleId}, 9, '90123456789abcdefghijklmnopqrstuvwxyz')");
            }
        }
    }
}