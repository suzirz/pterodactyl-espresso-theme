@php
    $planName = $server->billing_plan ?: ($server->getOptimizedBillingPlan() ?: null);
    $price = method_exists($server, 'calculateBillingPrice') ? $server->calculateBillingPrice() : ($server->billing_custom_price ?? null);
    $formattedPrice = $price ? 'Rp ' . number_format($price, 0, ',', '.') . ' / bulan' : null;
    $expiryDate = $server->expires_at ? \Carbon\Carbon::parse($server->expires_at)->format('d F Y') : null;
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Anda Siap Digunakan - {{ config('app.name', 'Pterodactyl') }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333333; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f9fc; padding: 40px 15px;">
        <tr>
            <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e6ebf1; overflow: hidden;">
                    
                    <!-- BRAND HEADER -->
                    <tr>
                        <td style="padding: 24px 36px 18px 36px; border-bottom: 1px solid #f0f3f7;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="left" style="vertical-align: middle;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="vertical-align: middle;">
                                                    <img src="{{ isset($message) ? $message->embed(public_path('assets/images/bytenodes_logo.png')) : 'https://panel.bytenodes.id/assets/svgs/pterodactyl.svg' }}" alt="{{ config('app.name', 'Pterodactyl') }}" width="32" height="32" style="display: block; border-radius: 6px; border: 0;">
                                                </td>
                                                <td style="padding-left: 10px; vertical-align: middle; font-size: 16px; font-weight: 700; color: #111827; letter-spacing: -0.3px;">
                                                    {{ config('app.name', 'Pterodactyl') }}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td align="right" style="vertical-align: middle; font-size: 12px; color: #6b7280;">
                                        @if($planName)
                                            <span style="background-color: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 4px; font-weight: 600; margin-right: 6px;">Paket {{ strtoupper($planName) }}</span>
                                        @endif
                                        #BN-{{ strtoupper($server->uuidShort) }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CONTENT BODY -->
                    <tr>
                        <td style="padding: 32px 36px 28px 36px;">
                            
                            <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.4px;">
                                Server Anda Siap Digunakan
                            </h1>

                            <p style="margin: 0 0 24px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                                Halo <strong>{{ $user->username }}</strong>,<br>
                                Server <strong>{{ $server->name }}</strong> @if($planName)(Paket <strong>{{ strtoupper($planName) }}</strong>)@endif telah selesai disiapkan dan saat ini sudah aktif. Berikut rincian paket dan akses server Anda:
                            </p>

                            <!-- INVOICE / SPECS TABLE -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 24px; font-size: 13px;">
                                <tr style="background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                                    <td colspan="2" style="padding: 10px 14px; font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Rincian Layanan & Spesifikasi
                                    </td>
                                </tr>
                                @if($planName)
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Paket Layanan</td>
                                    <td style="padding: 11px 14px; color: #111827; font-weight: 700; text-align: right; border-bottom: 1px solid #f3f4f6;">Paket {{ strtoupper($planName) }}</td>
                                </tr>
                                @endif
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Nama Server</td>
                                    <td style="padding: 11px 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $server->name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Software / Engine</td>
                                    <td style="padding: 11px 14px; color: #111827; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $server->egg ? $server->egg->name : 'Minecraft' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Alokasi RAM</td>
                                    <td style="padding: 11px 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $server->memory >= 1024 ? round($server->memory / 1024, 1) . ' GB' : $server->memory . ' MB' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">CPU Limit</td>
                                    <td style="padding: 11px 14px; color: #111827; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $server->cpu }}% ({{ $server->cpu > 0 ? round($server->cpu / 100, 1) . ' Core' : 'Dedicated' }})</td>
                                </tr>
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Storage (Disk)</td>
                                    <td style="padding: 11px 14px; color: #111827; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $server->disk >= 1024 ? round($server->disk / 1024, 1) . ' GB' : $server->disk . ' MB' }} NVMe SSD</td>
                                </tr>
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Node / Lokasi</td>
                                    <td style="padding: 11px 14px; color: #111827; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $server->node ? $server->node->name : '{{ config('app.name', 'Pterodactyl') }}' }}</td>
                                </tr>
                                @if($formattedPrice)
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Harga Langganan</td>
                                    <td style="padding: 11px 14px; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $formattedPrice }}</td>
                                </tr>
                                @endif
                                @if($expiryDate)
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Masa Aktif s/d</td>
                                    <td style="padding: 11px 14px; color: #111827; text-align: right; border-bottom: 1px solid #f3f4f6;">{{ $expiryDate }}</td>
                                </tr>
                                @endif
                                <tr>
                                    <td style="padding: 11px 14px; color: #6b7280;">IP & Port</td>
                                    <td style="padding: 11px 14px; color: #2563eb; font-weight: 600; text-align: right; font-family: monospace;">{{ $server->allocation ? ($server->allocation->alias ?? $server->allocation->ip) . ':' . $server->allocation->port : '-' }}</td>
                                </tr>
                            </table>

                            <!-- SFTP DETAILS -->
                            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px 16px; margin-bottom: 26px;">
                                <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Akses SFTP (File Manager / WinSCP)</div>
                                <div style="font-size: 12px; color: #4b5563; line-height: 1.6; font-family: monospace;">
                                    Host: <strong>{{ $server->node ? $server->node->fqdn : 'panel.bytenodes.id' }}</strong><br>
                                    Port: <strong>{{ $server->node ? ($server->node->daemonSFTP ?? 2022) : 2022 }}</strong><br>
                                    User: <strong>{{ $user->username }}.{{ $server->uuidShort }}</strong><br>
                                    Password: <em>(Password akun panel Anda)</em>
                                </div>
                            </div>

                            <!-- BUTTON CTA -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 26px;">
                                <tr>
                                    <td align="left">
                                        <a href="{{ config('app.url') }}/server/{{ $server->uuidShort }}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 26px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
                                            Kelola Server di Panel &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                Jika Anda memerlukan bantuan atau ingin melakukan upgrade paket, silakan hubungi kami melalui Discord atau balas email ini.
                            </p>

                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="padding: 20px 36px; background-color: #fafbfc; border-top: 1px solid #f0f3f7; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                            &copy; {{ date('Y') }} {{ config('app.name', 'Pterodactyl') }}. All rights reserved.<br>
                            Email dikirim otomatis ke {{ $user->email }} terkait layanan aktif di {{ config('app.name', 'Pterodactyl') }}.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
