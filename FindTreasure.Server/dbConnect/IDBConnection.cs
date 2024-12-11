using System.Reflection;

public interface IDBConnection
{
    int Insert(TreasureModal data);
    List<TreasureModal> GetAll();
}

public class JsonFileConnection: IDBConnection
{
    private string _jsonPathFile;
    public JsonFileConnection(string connectionString= "")
    {
        _jsonPathFile = System.IO.Path.GetDirectoryName(Assembly.GetEntryAssembly()?.Location) ?? "";
        _jsonPathFile += $"{System.IO.Path.DirectorySeparatorChar}data{System.IO.Path.DirectorySeparatorChar}ServerData.json";
    }

    public List<TreasureModal> GetAll()
    {
        return ReadFromFile();
    }

    public int Insert(TreasureModal data)
    {
        var listData = ReadFromFile();
        if (listData.Any(i => i.Row == data.Row && i.Column == data.Column
                           && i.Target == data.Target && i.MatrixString == data.MatrixString
                           && i.Result == data.Result))
            return 0;
        listData.Add(data);

        return AddToFile(listData) ? 1 : 0;
    }

    private bool AddToFile(List<TreasureModal> listData)
    {
        var result = true;
        try
        {
            var stringData = System.Text.Json.JsonSerializer.Serialize(listData);
            File.WriteAllText(_jsonPathFile, stringData);
        }
        catch (Exception)
        {
            result = false;
        }

        return result;
    }

    private List<TreasureModal> ReadFromFile()
    {
        var listData = new List<TreasureModal>();
        try
        {
            var jsonData = System.IO.File.ReadAllText(_jsonPathFile);

            if (string.IsNullOrWhiteSpace(jsonData)) return new List<TreasureModal>();

            listData = System.Text.Json.JsonSerializer.Deserialize<List<TreasureModal>>(jsonData);
        }
        catch (Exception)
        {

        }

        return listData ?? new List<TreasureModal>();
    }
}

public class TreasureModal
{
    public int Row { get; set; }
    public int Column { get; set; }
    public int Target { get; set; }
    public string MatrixString { get; set; } = "";
    public float Result { get; set; }
}