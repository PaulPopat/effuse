using SqlKata;
using SqlKata.Execution;

namespace Effuse.Core.Utils;

public static class QueryExtension
{
  public static T FromObject<T>(object data)
  {
    if (data is not IDictionary<string, object> data_dict)
    {
      throw new Exception("Could not parse data type");
    }

    var result = Activator.CreateInstance<T>();
    foreach (var property in typeof(T).GetProperties())
    {
      var found = data_dict[property.Name];
      var property_type = property.PropertyType;

      if (found is string found_string)
      {
        if (property_type == typeof(Guid))
        {
          property.SetValue(result, Guid.Parse(found_string));
        }
        else if (property_type == typeof(DateTime))
        {
          property.SetValue(result, DateTime.Parse(found_string));
        }
        else
        {
          property.SetValue(result, found);
        }
      }
      else
      {
        property.SetValue(result, found);
      }
    }

    return result;
  }

  public static async Task<T?> SafeFirstOrDefault<T>(this Query query)
  {
    var data = await query.FirstOrDefaultAsync<object>();
    if (data == null)
    {
      return default;
    }

    return FromObject<T>(data);
  }

  public static async Task<IEnumerable<T>> SafeGet<T>(this Query query)
  {
    var data = await query.GetAsync<object>();

    return data?.Select(FromObject<T>) ?? [];
  }
}