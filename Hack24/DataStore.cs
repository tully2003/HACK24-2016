using Dapper;
using Hack24.DataAccess;
using System;
using System.Data.Common;
using System.Linq;

namespace Hack24
{
    public static class DataStore
    {
        private const string ConnectionString = "";

        private static int GetLastGeneratedId(this DbConnection conn)
        {
            return conn.Query<int>("SELECT last_insert_rowid()").Single();
        }

        private static string SqlAddPlayer = @"INSERT INTO Player (Name) VALUES (@name)";
        private static string SqlAddPlayerToGame = "UPDATE Player SET GameId = @GameId WHERE Id = @PlayerId";

        public static string StartGame(string playerName)
        {
            var uniqueRef = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();

            var addGame = @"INSERT INTO Game (UniqueReference, Host) VALUES (@uniqueRef, @playerId)";

            using (var conn = Store.CreateOpenConnection())
            {
                conn.Execute(SqlAddPlayer, new { name = playerName });
                var playerId = conn.GetLastGeneratedId();

                conn.Query<int>(addGame, new { PlayerId = playerId, UniqueRef = uniqueRef });
                var gameId = conn.GetLastGeneratedId();

                conn.Execute(SqlAddPlayerToGame, new { GameId = gameId, PlayerId = playerId });
            }

            return uniqueRef;
        }

        public static void JoinGame(string gameRef, string playerName)
        {
            using (var conn = Store.CreateOpenConnection())
            {
                conn.Execute(SqlAddPlayer, new { name = playerName });
                var playerId = conn.GetLastGeneratedId();

                var gameId =
                    conn.Query<int>("SELECT Id FROM Game WHERE UniqueReference = @gameRef", new { GameRef = gameRef }).Single();

                conn.Execute(SqlAddPlayerToGame, new { GameId = gameId, PlayerId = playerId });
            }
        }
    }
}