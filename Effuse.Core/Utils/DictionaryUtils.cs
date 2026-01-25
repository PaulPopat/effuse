namespace Effuse.Core.Utils;

public static class DictionaryUtils
{
  public static T GetKey<T>(this IDictionary<string, object> dict, string key)
  {
    var result = dict[key];

    if (result == null)
    {
      throw new NullReferenceException();
    }

    return (T)result;
  }
}