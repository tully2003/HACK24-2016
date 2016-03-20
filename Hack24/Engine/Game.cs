using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Hack24.Hubs;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Hack24
{
    public enum GameState
    {
        WaitingToStart,
        Running,
        Complete
    }

    public class Game
    {
        private int[] _map = { 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 0, 0, 99, 99, 99, 99, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 99, 99, 0, 0, 99, 99, 0, 0, 0, 0, 99, 99, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 99, 99, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 99, 99, 99, 99, 0, 0, 0, 0, 0, 99, 0, 0, 99, 99, 0, 0, 99, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 99, 99, 0, 0, 99, 99, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 99, 0, 0, 0, 99, 99, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 99, 0, 0, 0, 99, 99, 0, 0, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 0, 0, 99, 99, 99, 99, 99, 99, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 99, 99, 0, 0, 99, 99, 99, 99, 0, 0, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 99, 99, 99, 0, 0, 0, 0, 0, 0, 99, 0, 0, 99, 99, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 99, 0, 0, 99, 99, 0, 0, 99, 99, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 99, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99};
        private byte[][] _board;
        private int _boardWidth;
        private int _boardHeight;
        private List<Player> _players;
        private List<Piece> _pieces;
        private object _lock;
        private Thread _pieceAdderThread;
        private bool _gameStartWhenReady;
        private DataStore.Puzzle _puzzle;
        private string _gameRef;
        private GameState _state;
        private IHubContext _hub;

        private class Player
        {
            public Player(string name, int startX, int startY)
            {
                Name = name;
                Position = new Position
                {
                    X = startX,
                    Y = startY
                };
            }

            public string Name { get; }
            public Position Position { get; set; }
            public int? CollectedPieceId { get; set; }
            public bool Ready { get; set; }
        }

        private class Piece
        {
            public int Id { get; set; }
            public int PieceId { get; set; }
            public Position Position { get; set; }

            public Piece(int id, int x, int y)
            {
                Id = id;
                Position = new Position
                {
                    X = x,
                    Y = y
                };
            }
        }

        private class Position
        {
            public int X { get; set; }
            public int Y { get; set; }
        }

        public Game(string hostPlayerName)
        {
            _hub = GlobalHost.ConnectionManager.GetHubContext<GameHub>();

            var mapRows = Split(_map, 25);

            var byteArrayList = new List<Byte[]>();

            foreach (var mapRow in mapRows)
            {
                var byteList = new List<byte>();

                foreach (var i in mapRow)
                {
                    var b = (byte) (i == 0 ? 0 : 1);
                    byteList.Add(b);
                }

                byteArrayList.Add(byteList.ToArray());
            }

            _board = byteArrayList.ToArray();

            _boardWidth = _board[0].Length;
            _boardHeight = _board.Length;

            _players = new List<Player>();
            _pieces = new List<Piece>();
            _lock = new object();

            _state = GameState.WaitingToStart;

            _gameRef = DataStore.StartGame(hostPlayerName);
            AddPlayer(hostPlayerName);
            _puzzle = DataStore.GetPuzzle();
            _puzzle = DataStore.GetPuzzle();
        }

        public static IEnumerable<IEnumerable<T>> Split<T>(T[] array, int size)
        {
            for (var i = 0; i < (float)array.Length / size; i++)
            {
                yield return array.Skip(i * size).Take(size);
            }
        }
        
        public void GameStart()
        {
            _gameStartWhenReady = true;
            StartIfReady();
        }

        public void PlayerReady(string playerName)
        {
            _players.First(p => p.Name.Equals(playerName, StringComparison.CurrentCultureIgnoreCase)).Ready = true;
            StartIfReady();
        }

        private void StartIfReady()
        {
            if (!_gameStartWhenReady || _players.Any(p => !p.Ready))
            {
                return;
            }

            _state = GameState.Running;
            _pieceAdderThread = new Thread(AddPieces);
            _pieceAdderThread.Start();
        }

        private void AddPieces()
        {
            var random = new Random();

            while (true)
            {
                var maxPieces = (_players.Count / 2) + 1;

                var numberOfPiecesCurrently = _pieces.Count;

                if (numberOfPiecesCurrently < maxPieces)
                {
                    int x;
                    int y;

                    var piece = _puzzle.Pieces[random.Next(0, _puzzle.Pieces.Count - 1)];

                    lock (_lock)
                    {
                        do
                        {
                            x = random.Next(0, _boardWidth);
                            y = random.Next(0, _boardHeight);
                        }   // ensures there is not already a piece or a wall there
                        while (_pieces.Any(p => p.Position.X == x && p.Position.Y == y) || _board[x][y] == 1);

                        _pieces.Add(new Piece(piece.Id, x, y));
                    }

                    NotifyOfPieceAdded(piece.Id, x, y, piece.EncodedImage);
                }

                var maxTimeToWait = 5000;
                var minTimeToWait = 500;
                Thread.Sleep(random.Next(minTimeToWait, maxTimeToWait));
            }
        }

        public object GetGameState()
        {
            lock (_lock)
            {
                return new
                {
                    Players = _players.Select(p => new
                    {
                        Name = p.Name,
                        Payload = p.CollectedPieceId,
                        X = p.Position.X,
                        Y = p.Position.Y
                    }).ToList(),
                    Pieces = _pieces.Select(pi => new
                    {
                        Id = pi.Id,
                        X = pi.Position.X,
                        Y = pi.Position.Y,
                        EncodedImage = _puzzle.Pieces.First(pu => pu.Id == pi.PieceId).EncodedImage
                    }).ToList(),
                    Puzzle = _puzzle.Name,
                    EncodedImage = _puzzle.EncodedImage
                };
            }
        }

        public bool AddPlayer(string playerName)
        {
            if (_players.Any(p => p.Name.Equals(playerName, StringComparison.CurrentCultureIgnoreCase)))
            {
                return false;
            }

            DataStore.JoinGame(_gameRef, playerName);

            _players.Add(new Player(playerName, _boardWidth / 2, _boardHeight / 2));

            NotifyOfNewPlayer(playerName);

            return true;
        }

        public bool MovePlayer(string playerName, int newX, int newY)
        {
            var p = _players.First(player => player.Name == playerName);

            if (_board[newX][newY] == 0)
            {
                p.Position.X = newX;
                p.Position.Y = newY;

                NotifyOfPlayerMove(playerName, newX, newY);

                lock (_lock)
                {
                    var piece = _pieces.FirstOrDefault(pi => pi.Position.X == newX && pi.Position.Y == newY);

                    if (piece != null)
                    {
                        p.CollectedPieceId = piece.PieceId;
                        NotifyOfPieceCollected(playerName, piece.Id);

                        _pieces.Remove(piece);
                    }
                }

                return true;
            }

            return false;
        }

        private void NotifyOfPieceCollected(string playerName, int id)
        {
            throw new NotImplementedException();
        }

        private void NotifyOfPlayerMove(string playerName, int newX, int newY)
        {
            throw new NotImplementedException();
        }

        private void NotifyOfNewPlayer(string playerName)
        {
        }

        private void NotifyOfPieceAdded(int pieceId, int x, int y, string encodedImage)
        {
            _hub.Clients.All.placeMazePiece(pieceId, x, y, encodedImage);
        }
    }
}