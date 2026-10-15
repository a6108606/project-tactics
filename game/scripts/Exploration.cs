using Godot;
using System;
using System.Collections.Generic;
using ProjectTactics.Core;

public partial class Exploration : Node2D
{
    private readonly HashSet<Chunk> _loaded = new();
    private readonly Queue<Cell> _steps = new();
    private Camera2D _camera = null!;
    private Vector2 _hero;
    private Vector2 _companion;
    private Cell _heroCell = new(3, 3);
    private float _moveSpeed = 240f;
    private int _drawCounter = 0;

    public override void _Ready()
    {
        _camera = new Camera2D { Enabled = true, Zoom = new Vector2(0.9f, 0.9f) };
        AddChild(_camera);
        _hero = ToWorld(_heroCell);
        _companion = ToWorld(new Cell(3, 4));
        _camera.Position = _hero;
        UpdateChunks();
        QueueRedraw();
    }

    private static Vector2 ToWorld(Cell cell)
    {
        var (x, y) = Grid.Project(cell);
        return new Vector2(x, y);
    }

    public override void _UnhandledInput(InputEvent e)
    {
        if (e is InputEventMouseButton mouse && mouse.Pressed)
        {
            if (mouse.ButtonIndex == MouseButton.Left)
            {
                var p = GetGlobalMousePosition();
                var target = Grid.Unproject(p.X, p.Y);
                var path = Grid.FindPath(_heroCell, target);
                _steps.Clear();
                foreach (var point in path) _steps.Enqueue(point);
            }
            if (mouse.ButtonIndex == MouseButton.WheelUp)
                _camera.Zoom = (_camera.Zoom * 1.1f).Clamp(new Vector2(0.5f,0.5f), new Vector2(1.8f,1.8f));
            if (mouse.ButtonIndex == MouseButton.WheelDown)
                _camera.Zoom = (_camera.Zoom / 1.1f).Clamp(new Vector2(0.5f,0.5f), new Vector2(1.8f,1.8f));
        }
    }

    public override void _Process(double delta)
    {
        if (_steps.Count > 0)
        {
            var next = _steps.Peek();
            var target = ToWorld(next);
            _hero = _hero.MoveToward(target, _moveSpeed * (float)delta);
            if (_hero.DistanceTo(target) < 0.5f)
            {
                _hero = target;
                _heroCell = _steps.Dequeue();
                UpdateChunks();
            }
        }
        // Companion automatically follows during exploration, NOT during tactical combat.
        var wanted = _hero + new Vector2(-70, 15);
        if (_companion.DistanceTo(wanted) > 75f)
            _companion = _companion.MoveToward(wanted, _moveSpeed * 0.88f * (float)delta);
        _camera.Position = _camera.Position.Lerp(_hero, Mathf.Clamp((float)delta * 6f, 0, 1));
        QueueRedraw();
    }

    private void UpdateChunks()
    {
        var center = Grid.ToChunk(_heroCell);
        _loaded.Clear();
        for (int dx = -2; dx <= 2; dx++)
        for (int dy = -2; dy <= 2; dy++)
        {
            var c = new Chunk(center.X + dx, center.Y + dy);
            if (c.X >= 0 && c.Y >= 0 && c.X < 4 && c.Y < 4)
                _loaded.Add(c);
        }
    }

    public override void _Draw()
    {
        // Prototype: the visible-cell window is rendered procedurally.
        // _loaded models interest/loaded chunks. Actual chunk asset streaming is P1 follow-up.
        int range = 19;
        for (int sum = _heroCell.X + _heroCell.Y - range * 2;
             sum <= _heroCell.X + _heroCell.Y + range * 2; sum++)
        for (int x = Math.Max(0, _heroCell.X - range); x <= Math.Min(127, _heroCell.X + range); x++)
        {
            int y = sum - x;
            if (y < Math.Max(0, _heroCell.Y - range) || y > Math.Min(127, _heroCell.Y + range)) continue;
            var c = new Cell(x, y);
            if (!_loaded.Contains(Grid.ToChunk(c))) continue;
            Vector2 p = ToWorld(c);
            var color = Grid.IsBlocked(c)
                ? new Color("#627c60")
                : ((x + y) % 2 == 0 ? new Color("#9cba87") : new Color("#aac492"));
            Vector2[] diamond = { p + new Vector2(0, -32), p + new Vector2(64, 0),
                                  p + new Vector2(0, 32), p + new Vector2(-64, 0) };
            DrawColoredPolygon(diamond, color);
            if (Grid.IsBlocked(c))
                DrawCircle(p + new Vector2(0, -10), 12, new Color("#3d8152"));
        }

        // Characters rendered after terrain with simple non-proprietary placeholder shapes.
        DrawCircle(_companion + new Vector2(0, -11), 12, new Color("#8f57c0"));
        DrawCircle(_hero + new Vector2(0, -15), 14, new Color("#2b6fd0"));
        DrawCircle(_hero + new Vector2(0, -28), 6, new Color("#eec69e"));
        var font = ThemeDB.FallbackFont;
        DrawString(font, _camera.Position + new Vector2(-480,-280),
            $"PROJECT TACTICS · click to move · scroll to zoom · loaded chunks {_loaded.Count}", 
            HorizontalAlignment.Left, 980, 18, Colors.White);
    }
}
