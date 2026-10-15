using ProjectTactics.Core;

static void Check(bool condition, string message)
{
    if (!condition) throw new Exception("FAILED: " + message);
    Console.WriteLine("OK: " + message);
}

Check(Grid.ToChunk(new Cell(0, 0)) == new Chunk(0, 0), "origin chunk");
Check(Grid.ToChunk(new Cell(31, 31)) == new Chunk(0, 0), "last cell of chunk");
Check(Grid.ToChunk(new Cell(32, 32)) == new Chunk(1, 1), "next chunk");
Check(Grid.ToChunk(new Cell(-1, -33)) == new Chunk(-1, -2), "negative chunk coordinates");
foreach (var c in new[] { new Cell(0, 0), new Cell(3, 4), new Cell(127, 127), new Cell(-2, 8) })
{
    var (x, y) = Grid.Project(c);
    Check(Grid.Unproject(x, y) == c, "isometric projection roundtrip " + c);
}
var path = Grid.FindPath(new Cell(3, 3), new Cell(36, 3));
Check(path.Count == 33, "inter-chunk path uses adjacent steps");
Check(path[^1] == new Cell(36, 3), "inter-chunk path destination");
Check(path.All(c => !Grid.IsBlocked(c)), "path avoids blocked cells");
Check(Grid.FindPath(new Cell(3, 3), new Cell(200, 3)).Count == 0, "out-of-bounds target");
Console.WriteLine("All smoke checks passed.");
