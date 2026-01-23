using System.Globalization;

namespace Effuse.Core.Utils;

public static class DateTimeUtils
{
  public static string ToIsoString(this DateTime subject)
  {
    return subject.ToString("o", CultureInfo.InvariantCulture);
  }
}