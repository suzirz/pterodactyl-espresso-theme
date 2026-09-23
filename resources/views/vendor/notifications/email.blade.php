<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? config('app.name') }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333333; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f9fc; padding: 40px 15px;">
        <tr>
            <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e6ebf1; overflow: hidden;">
                    
                    <!-- BRAND HEADER -->
                    <tr>
                        <td style="padding: 24px 36px 18px 36px; border-bottom: 1px solid #f0f3f7;">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <img src="{{ isset($message) ? $message->embed(public_path('assets/images/bytenodes_logo.png')) : 'https://panel.bytenodes.id/assets/svgs/pterodactyl.svg' }}" alt="{{ config('app.name', 'Pterodactyl') }}" width="28" height="28" style="display: block; border-radius: 6px; border: 0;">
                                    </td>
                                    <td style="padding-left: 10px; vertical-align: middle; font-size: 15px; font-weight: 700; color: #111827;">
                                        {{ config('app.name', 'Pterodactyl') }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CONTENT BODY -->
                    <tr>
                        <td style="padding: 30px 36px 24px 36px;">
                            
                            <h1 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #111827;">
                                @if (! empty($greeting))
                                    {{ $greeting }}
                                @else
                                    @if ($level == 'error')
                                        Perhatian
                                    @else
                                        Halo!
                                    @endif
                                @endif
                            </h1>

                            @foreach ($introLines as $line)
                                <p style="margin: 0 0 14px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                                    {{ $line }}
                                </p>
                            @endforeach

                            @if (isset($actionText))
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                                    <tr>
                                        <td align="left">
                                            <a href="{{ $actionUrl }}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 11px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
                                                {{ $actionText }} &rarr;
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            @foreach ($outroLines as $line)
                                <p style="margin: 0 0 14px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                                    {{ $line }}
                                </p>
                            @endforeach

                            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                                <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                    Salam,<br>
                                    <strong>Team {{ config('app.name', 'Pterodactyl') }}</strong>
                                </p>
                            </div>

                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="padding: 18px 36px; background-color: #fafbfc; border-top: 1px solid #f0f3f7; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                            &copy; {{ date('Y') }} {{ config('app.name', 'Pterodactyl') }}. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
