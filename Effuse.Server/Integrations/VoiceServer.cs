using System.Collections.Concurrent;
using System.Net;
using SIPSorcery.Media;
using SIPSorcery.SIP;
using SIPSorcery.SIP.App;
using SIPSorceryMedia.Abstractions;

namespace Effuse.Server.Integrations;

public class VoiceServer : IDisposable
{
  private readonly SIPTransport transport = new();

  private readonly ConcurrentDictionary<string, SIPUserAgent> calls = new();
  private readonly string base_url;
  private readonly int port;
  private readonly Func<string, Task<bool>> is_allowed;
  private readonly Guid channel_id;

  public VoiceServer(Guid channel_id, string base_url, int port, Func<string, Task<bool>> is_allowed)
  {
    this.channel_id = channel_id;
    this.base_url = base_url;
    this.port = port;

    transport.ContactHost = base_url;
    transport.AddSIPChannel(new SIPUDPChannel(new IPEndPoint(IPAddress.Any, port)));
    transport.SIPTransportRequestReceived += OnRequest;
    this.is_allowed = is_allowed;
  }

  public Guid ChannelId => channel_id;
  public string BaseUrl => base_url;
  public int Port => port;

  private async Task OnRequest(SIPEndPoint localSIPEndPoint, SIPEndPoint remoteEndPoint, SIPRequest sipRequest)
  {
    try
    {
      switch (sipRequest.Method)
      {
        case SIPMethodsEnum.INVITE:
          var ua = new SIPUserAgent(transport, null);
          ua.OnCallHungup += OnHangup;
          ua.ServerCallRingTimeout += (uas) =>
          {
            ua.Hangup();
          };

          var uas = ua.AcceptCall(sipRequest);
          var rtpSession = CreateRtpSession(ua, sipRequest.URI.User, port);

          var token = sipRequest
            .Header
            .AuthenticationHeaders
            .Single(h => h.AuthorisationType == SIPAuthorisationHeadersEnum.Authorize)
            .Value
            .Replace("Bearer ", "");
          if (!await is_allowed(token))
          {
            ua.Cancel();
            return;
          }

          await ua.Answer(uas, rtpSession, IPAddress.Parse(base_url));
          if (ua.IsCallActive)
          {
            await rtpSession.Start();
            calls.TryAdd(ua.Dialogue.CallId, ua);
          }
          break;
        case SIPMethodsEnum.BYE:
          SIPResponse byeResponse = SIPResponse.GetResponse(sipRequest, SIPResponseStatusCodesEnum.CallLegTransactionDoesNotExist, null);
          await transport.SendResponseAsync(byeResponse);
          break;
        case SIPMethodsEnum.SUBSCRIBE:
          SIPResponse notAllowededResponse = SIPResponse.GetResponse(sipRequest, SIPResponseStatusCodesEnum.MethodNotAllowed, null);
          await transport.SendResponseAsync(notAllowededResponse);
          break;
        case SIPMethodsEnum.OPTIONS:
        case SIPMethodsEnum.REGISTER:
          SIPResponse optionsResponse = SIPResponse.GetResponse(sipRequest, SIPResponseStatusCodesEnum.Ok, null);
          await transport.SendResponseAsync(optionsResponse);
          break;
        default:
          return;
      }
    }
    catch (Exception error)
    {
      Console.WriteLine(error);
    }
  }

  private static VoIPMediaSession CreateRtpSession(SIPUserAgent ua, string dst, int bindPort)
  {
    var codecs = new List<AudioCodecsEnum> { AudioCodecsEnum.PCMU, AudioCodecsEnum.PCMA, AudioCodecsEnum.G722 };

    var audioSource = AudioSourcesEnum.SineWave;
    if (string.IsNullOrEmpty(dst) || !Enum.TryParse(dst, out audioSource))
    {
      audioSource = AudioSourcesEnum.Music;
    }


    var audioExtrasSource = new AudioExtrasSource(new AudioEncoder(), new AudioSourceOptions { AudioSource = audioSource });
    audioExtrasSource.RestrictFormats(formats => codecs.Contains(formats.Codec));
    var rtpAudioSession = new VoIPMediaSession(new MediaEndPoints { AudioSource = audioExtrasSource }, bindPort: bindPort)
    {
      AcceptRtpFromAny = true
    };

    rtpAudioSession.OnTimeout += (mediaType) =>
    {
      ua.Hangup();
    };

    return rtpAudioSession;
  }

  private void OnHangup(SIPDialogue dialogue)
  {
    if (dialogue != null)
    {
      var callID = dialogue.CallId;
      if (calls.ContainsKey(callID))
      {
        if (calls.TryRemove(callID, out var ua))
        {
          ua.Close();
        }
      }
    }
  }


  public void Dispose()
  {
    transport.Shutdown();
  }
}