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

        public static string StartGame(string playerName)
        {
            var uniqueRef = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();

            var addPlayer = @"INSERT INTO Player (Name) VALUES (@name)";

            var addGame = @"INSERT INTO Game (UniqueReference, Host) VALUES (@uniqueRef, @playerId)";

            var addPlayerToGame = "UPDATE Player SET GameId = @GameId WHERE Id = @PlayerId";

            using (var conn = Store.CreateOpenConnection())
            {
                conn.Execute(addPlayer, new { name = playerName });
                var playerId = conn.GetLastGeneratedId();

                conn.Query<int>(addGame, new { PlayerId = playerId, UniqueRef = uniqueRef });
                var gameId = conn.GetLastGeneratedId();

                conn.Execute(addPlayerToGame, new { GameId = gameId, PlayerId = playerId });
            }

            return uniqueRef;
        }
    }
}