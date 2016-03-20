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
        private int[] _map = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52, 52, 52, 0, 0, 52, 0, 52, 52, 52, 0, 52, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 52, 0, 0, 52, 0, 0, 0, 0, 0, 52, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52, 52, 0, 0, 52, 52, 0, 0, 52, 0, 0, 52, 0, 0, 52, 52, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52, 0, 0, 52, 0, 0, 0, 0, 0, 0, 52, 0, 0, 0, 0, 0, 52, 52, 0, 0, 0, 0, 0, 0, 0, 0, 52, 52, 0, 0, 0, 0, 52, 52, 0, 0, 0, 0, 0, 0, 52, 0, 0, 52, 0, 0, 0, 0, 0, 0, 52, 0, 0, 0, 0, 0, 52, 52, 0, 0, 52, 0, 0, 52, 0, 0, 52, 52, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
        private int _mapSplitOn = 20;
        private byte[][] _board;
        private int _boardWidth;
        private int _boardHeight;
        private List<Player> _players;
        private List<Piece> _pieces;
        private object _lock;
        private Thread _pieceAdderThread;
        private bool _gameStartWhenReady;
        private string _gameRef;
        private GameState _state;
        private IHubContext _hub;

        private class Player
        {
            public Player(string name, int startX, int startY)
            {
                Name = name;
                Location = new Location
                {
                    X = startX,
                    Y = startY
                };
            }

            public string Name { get; }
            public Location Location { get; set; }
            public int? CollectedPiecePosition { get; set; }
            public bool Ready { get; set; }
        }

        private static int _counter = 1;

        private class Piece
        {
            public int Id { get; set; }
            public int Position { get; set; }
            public Location Location { get; set; }

            public Piece(int position, int x, int y)
            {
                Id = _counter++;
                Position = position;
                Location = new Location
                {
                    X = x,
                    Y = y
                };
            }
        }

        private class Location
        {
            public int X { get; set; }
            public int Y { get; set; }
        }

        public Game(string hostPlayerName)
        {
            _hub = GlobalHost.ConnectionManager.GetHubContext<GameHub>();

            var mapRows = Split(_map, _mapSplitOn);

            _board = mapRows.Select(mapRow => mapRow.Select(i => (byte) (i == 0 ? 0 : 1)).ToArray()).ToArray();

            _boardWidth = _board[0].Length;
            _boardHeight = _board.Length;

            _players = new List<Player>();
            _pieces = new List<Piece>();
            _lock = new object();

            _state = GameState.WaitingToStart;

            _gameRef = DataStore.StartGame(hostPlayerName);
            AddPlayer(hostPlayerName);
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
                var maxPieces = _players.Count + 2;

                var numberOfPiecesCurrently = _pieces.Count;

                if (numberOfPiecesCurrently < maxPieces)
                {
                    int x;
                    int y;

                    var position = random.Next(0, 8);
                    
                    lock (_lock)
                    {
                        do
                        {
                            x = random.Next(0, _boardWidth);
                            y = random.Next(0, _boardHeight);
                        }   // ensures there is not already a piece or a wall there
                        while (_pieces.Any(p => p.Location.X == x && p.Location.Y == y) || _board[y][x] == 1);

                        var piece = new Piece(position, x, y);
                        _pieces.Add(piece);
                        NotifyOfPieceAdded(piece.Id, position, x, y);
                    }

                    
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
                        Payload = p.CollectedPiecePosition,
                        X = p.Location.X,
                        Y = p.Location.Y
                    }).ToList(),
                    Pieces = _pieces.Select(pi => new
                    {
                        Id = pi.Id,
                        Position = pi.Position,
                        X = pi.Location.X,
                        Y = pi.Location.Y
                    }).ToList()
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
                p.Location.X = newX;
                p.Location.Y = newY;

                NotifyOfPlayerMove(playerName, newX, newY);

                lock (_lock)
                {
                    var piece = _pieces.FirstOrDefault(pi => pi.Location.X == newX && pi.Location.Y == newY);

                    if (piece != null)
                    {
                        p.CollectedPiecePosition = piece.Position;
                        NotifyOfPieceCollected(playerName, piece.Id);

                        _pieces.Remove(piece);
                    }
                }

                return true;
            }

            return false;
        }

        public void PieceCollected(string playerName, int id)
        {
            var player = _players.First(p => p.Name == playerName);

            Piece piece;

            lock (_lock)
            {
                piece = _pieces.First(p=> p.Id == id);
                _pieces.Remove(piece);
            }

            player.CollectedPiecePosition = piece.Position;
        }

        private void NotifyOfPieceCollected(string playerName, int id)
        {
            _hub.Clients.All.mazePieceCollected(playerName, id);
        }

        private void NotifyOfPlayerMove(string playerName, int newX, int newY)
        {
            _hub.Clients.All.playerMoved(playerName, newX, newY);
        }

        private void NotifyOfNewPlayer(string playerName)
        {
            _hub.Clients.All.newPlayer(playerName);
        }

        private void NotifyOfPieceAdded(int id, int position, int x, int y)
        {
            _hub.Clients.All.placeMazePiece(id, position, x, y);
        }
    }
}