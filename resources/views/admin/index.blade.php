@extends('layouts.admin')

@section('title')
    Overview
@endsection

@section('content-header')
    <div class="bytenodes-hero-bar">
        <div>
            <h1 class="bytenodes-hero-title">
                <i class="fa fa-server" style="color: var(--bn-khaki);"></i> System Overview
            </h1>
            <p class="bytenodes-hero-sub">Virtualization telemetry, resource allocations, and node health monitoring.</p>
        </div>
        <div class="hidden-xs">
            @if ($version->isLatestPanel())
                <span class="label label-success" style="font-size: 11px; padding: 5px 10px;">
                    <i class="fa fa-check-circle"></i> PANEL v{{ config('app.version') }} · UP TO DATE
                </span>
            @else
                <a href="https://github.com/Pterodactyl/Panel/releases/v{{ $version->getPanel() }}" target="_blank">
                    <span class="label label-warning" style="font-size: 11px; padding: 5px 10px;">
                        <i class="fa fa-exclamation-triangle"></i> UPDATE AVAILABLE: v{{ $version->getPanel() }}
                    </span>
                </a>
            @endif
        </div>
    </div>
@endsection

@section('content')
<!-- Global Fleet Telemetry 4-Stat Grid -->
<div class="bytenodes-fleet-grid">
    <div class="bytenodes-stat-card">
        <div class="bytenodes-stat-label">
            <span>Total Servers</span>
            <i class="fa fa-cubes" style="color: var(--bn-khaki);"></i>
        </div>
        <div class="bytenodes-stat-val">{{ number_format($totalServers) }}</div>
        <div class="bytenodes-stat-sub">
            <a href="{{ route('admin.servers') }}" style="color: var(--bn-khaki); font-size: 12px; text-decoration: none; font-weight: 600;">
                Manage instances <i class="fa fa-arrow-right" style="font-size: 10px;"></i>
            </a>
        </div>
    </div>

    <div class="bytenodes-stat-card">
        <div class="bytenodes-stat-label">
            <span>Registered Users</span>
            <i class="fa fa-users" style="color: var(--bn-accent-emerald);"></i>
        </div>
        <div class="bytenodes-stat-val">{{ number_format($totalUsers) }}</div>
        <div class="bytenodes-stat-sub">
            <a href="{{ route('admin.users') }}" style="color: var(--bn-accent-emerald); font-size: 12px; text-decoration: none;">
                View user database <i class="fa fa-arrow-right" style="font-size: 10px;"></i>
            </a>
        </div>
    </div>

    <div class="bytenodes-stat-card">
        <div class="bytenodes-stat-label">
            <span>Allocated Memory</span>
            <i class="fa fa-microchip" style="color: var(--bn-accent-violet);"></i>
        </div>
        <div class="bytenodes-stat-val">
            {{ round($totalAllocatedMemory / 1024, 0) }} <span style="font-size: 13px; color: var(--bn-text-muted); font-weight: 500;">/ {{ round($totalPooledMemory / 1024, 0) }} GB</span>
        </div>
        <div class="bytenodes-stat-sub">
            <span style="font-family: 'JetBrains Mono', monospace; color: var(--bn-accent-violet);">
                {{ round(($totalAllocatedMemory / max($totalPooledMemory, 1)) * 100, 1) }}% Utilized
            </span>
        </div>
    </div>

    <div class="bytenodes-stat-card">
        <div class="bytenodes-stat-label">
            <span>Allocated Storage</span>
            <i class="fa fa-hdd-o" style="color: var(--bn-accent-amber);"></i>
        </div>
        <div class="bytenodes-stat-val">
            {{ round($totalAllocatedDisk / 1024 / 1024, 2) }} <span style="font-size: 13px; color: var(--bn-text-muted); font-weight: 500;">/ {{ round($totalPooledDisk / 1024 / 1024, 2) }} TB</span>
        </div>
        <div class="bytenodes-stat-sub">
            <span style="font-family: 'JetBrains Mono', monospace; color: var(--bn-accent-amber);">
                {{ round(($totalAllocatedDisk / max($totalPooledDisk, 1)) * 100, 1) }}% Utilized
            </span>
        </div>
    </div>
</div>

<!-- Node Infrastructure Bento Grid -->
<div class="row">
    <div class="col-xs-12">
        <div class="box">
            <div class="box-header">
                <h3 class="box-title">
                    <i class="fa fa-sitemap" style="color: var(--bn-khaki); margin-right: 6px;"></i> Node Infrastructure ({{ count($nodes) }} Nodes)
                </h3>
                <div class="box-tools pull-right">
                    <a href="{{ route('admin.nodes.new') }}" class="btn btn-xs btn-primary">
                        <i class="fa fa-plus"></i> Add Node
                    </a>
                </div>
            </div>
            <div class="box-body" style="padding: 18px !important;">
                <div class="bytenodes-node-grid">
                    @foreach($nodes as $node)
                        @php
                            $ramPercent = min(100, round(((int)$node->servers_sum_memory / max((int)$node->memory, 1)) * 100, 1));
                            $diskPercent = min(100, round(((int)$node->servers_sum_disk / max((int)$node->disk, 1)) * 100, 1));
                            $ramFillClass = $ramPercent > 85 ? 'bytenodes-fill-rose' : ($ramPercent > 65 ? 'bytenodes-fill-amber' : 'bytenodes-fill-sky');
                            $diskFillClass = $diskPercent > 85 ? 'bytenodes-fill-rose' : ($diskPercent > 65 ? 'bytenodes-fill-amber' : 'bytenodes-fill-emerald');
                        @endphp
                        <div class="bytenodes-node-card">
                            <div class="bytenodes-node-header">
                                <div>
                                    <div class="bytenodes-node-name">
                                        <i class="fa fa-server" style="color: var(--bn-khaki); font-size: 13px;"></i>
                                        <a href="{{ route('admin.nodes.view', $node->id) }}" style="color: var(--bn-text-primary); text-decoration: none;">
                                            {{ $node->name }}
                                        </a>
                                        <span class="label label-default" style="font-size: 10px;">{{ $node->location ? $node->location->short : 'N/A' }}</span>
                                    </div>
                                    <div style="font-size: 11px; color: var(--bn-text-muted); font-family: 'JetBrains Mono', monospace; margin-top: 3px;">
                                        {{ $node->fqdn }}:{{ $node->daemonListen }}
                                    </div>
                                </div>
                                <div>
                                    <span class="label label-default" data-action="ping" data-secret="{{ $node->getDecryptedKey() }}" data-location="{{ $node->scheme }}://{{ $node->fqdn }}:{{ $node->daemonListen }}/api/system">
                                        <i class="fa fa-refresh fa-spin"></i> Pinging...
                                    </span>
                                </div>
                            </div>

                            <div class="bytenodes-meter-group">
                                <!-- RAM Allocation -->
                                <div class="bytenodes-meter-row">
                                    <div class="bytenodes-meter-label">
                                        <span>RAM Allocated</span>
                                        <span class="bytenodes-meter-val">{{ round((int)$node->servers_sum_memory / 1024, 1) }} GB / {{ round($node->memory / 1024, 1) }} GB ({{ $ramPercent }}%)</span>
                                    </div>
                                    <div class="bytenodes-progress-track">
                                        <div class="bytenodes-progress-fill {{ $ramFillClass }}" style="width: {{ $ramPercent }}%;"></div>
                                    </div>
                                </div>

                                <!-- Disk Allocation -->
                                <div class="bytenodes-meter-row">
                                    <div class="bytenodes-meter-label">
                                        <span>Disk Allocated</span>
                                        <span class="bytenodes-meter-val">{{ round((int)$node->servers_sum_disk / 1024, 1) }} GB / {{ round($node->disk / 1024, 1) }} GB ({{ $diskPercent }}%)</span>
                                    </div>
                                    <div class="bytenodes-progress-track">
                                        <div class="bytenodes-progress-fill {{ $diskFillClass }}" style="width: {{ $diskPercent }}%;"></div>
                                    </div>
                                </div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--bn-border-subtle); padding-top: 10px; font-size: 11.5px; color: var(--bn-text-muted);">
                                <span>{{ $node->servers_count }} active instances</span>
                                <a href="{{ route('admin.nodes.view', $node->id) }}" style="color: var(--bn-khaki); text-decoration: none; font-weight: 600;">
                                    Node Details &rarr;
                                </a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    {!! Theme::js('js/admin/index.js?t={cache-version}') !!}
    <script>
    (function pingOverviewNodes() {
        $('span[data-action="ping"]').each(function(i, element) {
            var $el = $(element);
            var loc = $el.data('location');
            var secret = $el.data('secret');

            if (!loc || !secret) {
                $el.css({
                    'background': 'rgba(201, 75, 75, 0.15)',
                    'color': '#f87171',
                    'border': '1px solid rgba(201, 75, 75, 0.35)',
                    'font-size': '11px',
                    'padding': '4px 8px',
                    'border-radius': '6px',
                    'display': 'inline-block'
                }).html('<i class="fa fa-circle-o" style="font-size: 7px; vertical-align: middle; margin-right: 4px;"></i> Unreachable');
                return;
            }

            $.ajax({
                type: 'GET',
                url: loc,
                headers: {
                    'Authorization': 'Bearer ' + secret
                },
                timeout: 4500
            }).done(function(data) {
                var ver = data && data.version ? data.version : '';
                $el.css({
                    'background': 'rgba(82, 183, 136, 0.15)',
                    'color': '#52b788',
                    'border': '1px solid rgba(82, 183, 136, 0.35)',
                    'font-size': '11px',
                    'padding': '4px 8px',
                    'border-radius': '6px',
                    'display': 'inline-block'
                }).html('<i class="fa fa-circle" style="font-size: 7px; vertical-align: middle; margin-right: 4px;"></i> Online' + (ver ? ' <span style="opacity: 0.75; font-size: 10px;">(' + ver + ')</span>' : ''));
            }).fail(function(err) {
                var reason = 'Connection timeout or certificate error';
                try {
                    if (err.responseJSON && err.responseJSON.errors) {
                        reason = err.responseJSON.errors[0].detail;
                    }
                } catch(e) {}

                $el.css({
                    'background': 'rgba(201, 75, 75, 0.15)',
                    'color': '#f87171',
                    'border': '1px solid rgba(201, 75, 75, 0.35)',
                    'font-size': '11px',
                    'padding': '4px 8px',
                    'border-radius': '6px',
                    'display': 'inline-block',
                    'cursor': 'pointer'
                }).attr('title', reason).html('<i class="fa fa-circle-o" style="font-size: 7px; vertical-align: middle; margin-right: 4px;"></i> Offline');
            });
        });
    })();
    </script>
@endsection

