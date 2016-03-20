using Dapper;
using Hack24.DataAccess;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using Nancy;

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

        public static Puzzle GetPuzzle()
        {
            using (var conn = Store.CreateOpenConnection())
            {
                var puzzle = conn.Query<Puzzle>("SELECT * FROM Puzzle").First();
                puzzle.Pieces = conn.Query<Piece>("SELECT * FROM Piece WHERE PuzzleId = " + puzzle.Id).ToList();
                return puzzle;
            }
        }

        public class Puzzle
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public List<Piece> Pieces { get; set; }
            public string EncodedImage { get; set; }
        }

        public class Piece
        {
            public int Id { get; set; }
            public int PuzzleId { get; set; }
            public int Position { get; set; }
            public string EncodedImage { get; set; }
        }
    }
}