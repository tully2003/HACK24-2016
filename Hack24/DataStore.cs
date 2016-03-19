using Dapper;
using System;
using System.Data.SqlClient;

namespace Hack24
{
    public static class DataStore
    {
        private const string ConnectionString = "";

        public static string StartGame(string playerName)
        {
            var uniqueRef = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();

            var addPlayer = "INSERT INTO Player (Name) VALUES (@player)";
            var addGame = "INSERT INTO Game (UniqueReference, Host) VALUES (@uniqueRef, @playerId)";

            using (var conn = new SqlConnection(ConnectionString))
            {
                var playerId = conn.Query<int>(addPlayer, new { Player = playerName });
                conn.Execute(addGame, new { PlayerId = playerId, UniqueRef = uniqueRef });
            }

            return uniqueRef;
        }
    }
}