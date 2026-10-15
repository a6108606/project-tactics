namespace ProjectTactics.Core;

public readonly record struct Cell(int X, int Y);
public readonly record struct Chunk(int X, int Y);

public static class Grid
{
    public const int WorldSize = 128;
    public const int ChunkSize = 32;
    public const float TileHalfWidth = 64f;
    public const float TileHalfHeight = 32f;

    public static Chunk ToChunk(Cell cell) =>
        new(FloorDiv(cell.X, ChunkSize), FloorDiv(cell.Y, ChunkSize));

    public static int FloorDiv(int n, int divisor) =>
        (int)Math.Floor((double)n / divisor);

    // This is the top vertex of a diamond tile in Godot world space.
    public static (float X, float Y) Project(Cell cell) =>
        ((cell.X - cell.Y) * TileHalfWidth,
         (cell.X + cell.Y) * TileHalfHeight);

    public static Cell Unproject(float x, float y)
    {
        var fx = (x / TileHalfWidth + y / TileHalfHeight) / 2f;
        var fy = (y / TileHalfHeight - x / TileHalfWidth) / 2f;
        return new Cell((int)MathF.Round(fx), (int)MathF.Round(fy));
    }

    public static bool InBounds(Cell c) =>
        c.X >= 0 && c.Y >= 0 && c.X < WorldSize && c.Y < WorldSize;

    public static bool IsBlocked(Cell c)
    {
        if (!InBounds(c)) return true;
        // Deterministic temporary terrain; corridors are kept open.
        if (c.X == 3 || c.Y == 3 || c.X == 4 || c.Y == 4) return false;
        var value = unchecked(c.X * 73856093 ^ c.Y * 19349663);
        return ((uint)value % 29) == 0;
    }

    public static List<Cell> FindPath(Cell from, Cell to)
    {
        if (IsBlocked(from) || IsBlocked(to)) return new List<Cell>();
        var open = new PriorityQueue<Cell, int>();
        var parent = new Dictionary<Cell, Cell>();
        var cost = new Dictionary<Cell, int> { [from] = 0 };
        open.Enqueue(from, 0);
        Cell[] directions = { new(1, 0), new(-1, 0), new(0, 1), new(0, -1) };
        while (open.Count != 0)
        {
            var current = open.Dequeue();
            if (current == to)
            {
                var result = new List<Cell>();
                for (var c = to; c != from; c = parent[c]) result.Add(c);
                result.Reverse();
                return result;
            }
            foreach (var d in directions)
            {
                var next = new Cell(current.X + d.X, current.Y + d.Y);
                if (IsBlocked(next)) continue;
                var nextCost = cost[current] + 1;
                if (cost.TryGetValue(next, out var old) && nextCost >= old) continue;
                parent[next] = current;
                cost[next] = nextCost;
                open.Enqueue(next, nextCost + Math.Abs(to.X - next.X) + Math.Abs(to.Y - next.Y));
            }
        }
        return new List<Cell>();
    }
}
