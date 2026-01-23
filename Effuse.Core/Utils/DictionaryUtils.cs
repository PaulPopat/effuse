namespace Effuse.Core.Utils;

public static class DictionaryUtils
{
  public static T GetKey<T>(this IDictionary<string, object> dict, string key)
  {
    return (T)dict[key];
  }
}