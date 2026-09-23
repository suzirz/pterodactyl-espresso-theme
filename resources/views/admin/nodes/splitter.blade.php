@extends('layouts.admin')

@section('title')
    Node Splitter & Virtual Private Nodes
@endsection

@section('scripts')
    @parent
    {!! Theme::css('vendor/fontawesome/animation.min.css') !!}
    <style>
        /* Bytenodes Warm Obsidian Design System Tokens */
        :root {
            --bn-bg-base: #141211;
            --bn-bg-surface: #1c1917;
            --bn-bg-card: #25211e;
            --bn-bg-card-hover: #302b27;
            --bn-mint: #EBF5EE;
            --bn-khaki: #BFA89E;
            --bn-taupe: #8B786D;
            --bn-border: rgba(191, 168, 158, 0.15);
            --bn-border-active: #BFA89E;
            --bn-green: #52b788;
            --bn-blue: #60a5fa;
            --bn-amber: #dd9754;
        }

        .bn-page-header {
            margin-bottom: 24px;
        }
        .bn-page-title {
            font-family: 'Outfit', -apple-system, sans-serif;
            font-weight: 700;
            color: var(--bn-mint);
            font-size: 24px;
            letter-spacing: -0.02em;
            margin: 0 0 6px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .bn-page-subtitle {
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 13.5px;
            color: var(--bn-taupe);
            margin: 0;
        }

        /* Bento Box Containers */
        .bn-card {
            background-color: var(--bn-bg-card);
            border: 1px solid var(--bn-border);
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            transition: border-color 0.2s ease;
            overflow: hidden;
        }
        .bn-card:hover {
            border-color: rgba(191, 168, 158, 0.28);
        }
        .bn-card-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--bn-border);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0) 100%);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .bn-card-title {
            font-family: 'Outfit', -apple-system, sans-serif;
            font-weight: 600;
            font-size: 15px;
            color: var(--bn-mint);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .bn-card-body {
            padding: 20px;
        }
        .bn-card-footer {
            padding: 16px 20px;
            border-top: 1px solid var(--bn-border);
            background-color: var(--bn-bg-surface);
        }

        /* Badges & Pills */
        .bn-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 500;
            line-height: 1;
        }
        .bn-badge-khaki {
            background: rgba(191, 168, 158, 0.12);
            color: var(--bn-khaki);
            border: 1px solid rgba(191, 168, 158, 0.25);
        }
        .bn-badge-green {
            background: rgba(82, 183, 136, 0.12);
            color: var(--bn-green);
            border: 1px solid rgba(82, 183, 136, 0.25);
        }
        .bn-badge-blue {
            background: rgba(96, 165, 250, 0.12);
            color: var(--bn-blue);
            border: 1px solid rgba(96, 165, 250, 0.25);
        }
        .bn-badge-amber {
            background: rgba(221, 151, 84, 0.12);
            color: var(--bn-amber);
            border: 1px solid rgba(221, 151, 84, 0.25);
        }

        /* Form Controls */
        .bn-form-group {
            margin-bottom: 18px;
        }
        .bn-label {
            display: block;
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 13px;
            font-weight: 600;
            color: var(--bn-mint);
            margin-bottom: 6px;
        }
        .bn-label-desc {
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 12px;
            color: var(--bn-taupe);
            margin-top: 5px;
            line-height: 1.4;
        }
        .bn-input, .bn-select, .bn-textarea {
            width: 100%;
            background-color: #171412 !important;
            border: 1px solid var(--bn-border) !important;
            border-radius: 8px !important;
            color: var(--bn-mint) !important;
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 13.5px;
            padding: 9px 12px;
            transition: all 0.15s ease;
            outline: none;
            box-shadow: none;
        }
        .bn-select {
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23BFA89E' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 14px center !important;
            background-size: 14px 14px !important;
            padding-right: 40px !important;
            cursor: pointer !important;
        }
        .bn-select option {
            background-color: #1c1917 !important;
            color: var(--bn-mint) !important;
            padding: 10px 14px !important;
        }
        .bn-select optgroup {
            background-color: #141211 !important;
            color: var(--bn-khaki) !important;
            font-weight: 700;
        }
        .bn-input:focus, .bn-select:focus, .bn-textarea:focus {
            border-color: var(--bn-khaki) !important;
            box-shadow: 0 0 0 3px rgba(191, 168, 158, 0.2) !important;
        }
        .bn-input-mono {
            font-family: 'JetBrains Mono', monospace !important;
            font-size: 13px !important;
        }

        /* Capacity Visualizer */
        .bn-capacity-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            background: #191614;
            border: 1px solid var(--bn-border);
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .bn-capacity-stat {
            text-align: center;
        }
        .bn-capacity-val {
            font-family: 'JetBrains Mono', monospace;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 4px 0;
            line-height: 1;
        }
        .bn-capacity-label {
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 11.5px;
            font-weight: 500;
            color: var(--bn-taupe);
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        /* Preset Pills */
        .bn-preset-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
        }
        .bn-preset-btn {
            background: #1e1a18;
            border: 1px solid var(--bn-border);
            border-radius: 6px;
            color: var(--bn-mint);
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 500;
            padding: 4px 10px;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .bn-preset-btn:hover {
            background: #2a2522;
            border-color: var(--bn-khaki);
            color: #ffffff;
            transform: translateY(-1px);
        }
        .bn-preset-btn:active {
            transform: scale(0.96);
        }

        /* Port Box */
        .bn-port-dock {
            background: #181513;
            border: 1px solid var(--bn-border);
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .bn-port-preview {
            margin-top: 10px;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .bn-port-preview-active {
            background: rgba(82, 183, 136, 0.1);
            border: 1px solid rgba(82, 183, 136, 0.25);
            color: var(--bn-green);
        }
        .bn-port-preview-empty {
            background: rgba(139, 120, 109, 0.1);
            border: 1px solid rgba(139, 120, 109, 0.25);
            color: var(--bn-taupe);
        }

        /* Tactile Action Button */
        .bn-btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            background-color: var(--bn-khaki);
            color: #141211;
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 14.5px;
            font-weight: 700;
            padding: 12px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(191, 168, 158, 0.25);
            transition: all 0.15s ease;
        }
        .bn-btn-primary:hover {
            background-color: #d6c4bc;
            box-shadow: 0 6px 20px rgba(191, 168, 158, 0.35);
            transform: translateY(-1px);
            color: #141211;
        }
        .bn-btn-primary:active {
            transform: scale(0.98);
        }

        /* Sub-Node Table */
        .bn-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-family: 'Outfit', -apple-system, sans-serif;
        }
        .bn-table th {
            background-color: #191614;
            color: var(--bn-taupe);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 12px 16px;
            border-bottom: 1px solid var(--bn-border);
        }
        .bn-table td {
            padding: 14px 16px;
            border-bottom: 1px solid rgba(191, 168, 158, 0.08);
            color: var(--bn-mint);
            font-size: 13px;
            vertical-align: middle;
        }
        .bn-table tr:hover td {
            background-color: var(--bn-bg-card-hover);
        }
        .bn-table tr:last-child td {
            border-bottom: none;
        }

        .bn-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--bn-green);
            display: inline-block;
            box-shadow: 0 0 8px rgba(82, 183, 136, 0.6);
            margin-right: 6px;
            flex-shrink: 0;
        }

        .bn-action-btn {
            background: #1f1b19;
            border: 1px solid var(--bn-border);
            color: var(--bn-mint);
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            text-decoration: none;
        }
        .bn-action-btn:hover {
            border-color: var(--bn-khaki);
            background: #2b2522;
            color: #ffffff;
            transform: translateY(-1px);
        }

        /* SSL Alert Banner */
        .bn-ssl-alert {
            background: linear-gradient(90deg, #1b242e 0%, #151c24 100%);
            border: 1px solid rgba(96, 165, 250, 0.3);
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 24px;
            color: var(--bn-mint);
        }
        .bn-code-box {
            background: #0d1117;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 10px 14px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: #4ade80;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            word-break: break-all;
        }

        /* Guide Card */
        .bn-guide-list {
            padding-left: 0;
            list-style: none;
            margin: 0;
        }
        .bn-guide-list li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 12px;
            font-size: 13px;
            line-height: 1.5;
            color: var(--bn-mint);
        }
        .bn-guide-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            top: 1px;
            color: var(--bn-khaki);
            font-weight: bold;
            font-family: 'JetBrains Mono', monospace;
        }

        /* Modal Customization */
        .bn-modal .modal-content {
            background-color: var(--bn-bg-card);
            border: 1px solid var(--bn-border);
            border-radius: 12px;
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
            color: var(--bn-mint);
        }
        .bn-modal .modal-header {
            border-bottom: 1px solid var(--bn-border);
            padding: 16px 20px;
        }
        .bn-modal .modal-footer {
            border-top: 1px solid var(--bn-border);
            background-color: var(--bn-bg-surface);
            padding: 14px 20px;
        }
    </style>
@endsection

@section('content-header')
    <div class="bn-page-header">
        <h1 class="bn-page-title">
            <i class="fa fa-code-fork" style="color: var(--bn-khaki);"></i> Node Splitter
        </h1>
        <p class="bn-page-subtitle">
            Partition parent physical nodes into Virtual Private Sub-Nodes with white-label FQDNs and isolated resource quotas.
        </p>
    </div>
@endsection

@section('content')
@if (session('ssl_helper_cmd'))
    <div class="row">
        <div class="col-xs-12">
            <div class="bn-ssl-alert">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h4 style="margin: 0 0 6px 0; font-family: 'Outfit'; font-weight: 600; color: #60a5fa;">
                            <i class="fa fa-shield"></i> Additional Step: Activate SSL Certificate for New Domain ({{ session('ssl_helper_fqdn') }})
                        </h4>
                        <p style="margin: 0; font-size: 13px; color: #cbd5e1;">
                            Because this sub-node FQDN differs from the parent host domain, execute the following Certbot command on the parent physical node so Wings recognizes SSL immediately:
                        </p>
                    </div>
                </div>
                <div class="bn-code-box">
                    <span id="sslCmdText">{{ session('ssl_helper_cmd') }}</span>
                    <button type="button" class="bn-action-btn" onclick="copySslCmd()" style="margin-left: 12px; flex-shrink: 0;">
                        <i class="fa fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        </div>
    </div>
@endif

<div class="row">
    <!-- LEFT COLUMN: CREATE SUB-NODE FORM -->
    <div class="col-md-7">
        <div class="bn-card">
            <div class="bn-card-header">
                <h3 class="bn-card-title">
                    <i class="fa fa-cubes" style="color: var(--bn-khaki);"></i> Create New Private Sub-Node
                </h3>
                <span class="bn-badge bn-badge-khaki">
                    <i class="fa fa-server"></i> ByteNodes Partition Engine
                </span>
            </div>

            <form action="{{ route('admin.nodes.splitter.store') }}" method="POST">
                {!! csrf_field() !!}
                <div class="bn-card-body">
                    <!-- 1. PARENT NODE SELECTION -->
                    <div class="bn-form-group">
                        <label for="parent_node_id" class="bn-label">
                            <i class="fa fa-server" style="color: var(--bn-taupe); margin-right: 4px;"></i> Select Parent Node (Physical Host)
                        </label>
                        <select id="parent_node_id" name="parent_node_id" class="bn-select" onchange="updateParentVisual()">
                            @foreach ($parentNodes as $p)
                                <option value="{{ $p->id }}" 
                                    data-name="{{ $p->name }}"
                                    data-fqdn="{{ $p->fqdn }}"
                                    data-mem="{{ $p->memory }}"
                                    data-disk="{{ $p->disk }}"
                                    data-location="{{ $p->location_id }}"
                                    data-servers="{{ $p->servers->count() }}"
                                    {{ $defaultParent && $defaultParent->id == $p->id ? 'selected' : '' }}>
                                    Node #{{ $p->id }}: {{ $p->name }} ({{ $p->fqdn }}) &mdash; {{ round($p->memory / 1024, 0) }} GB RAM / {{ round($p->disk / 1024, 0) }} GB Disk
                                </option>
                            @endforeach
                        </select>
                        <div class="bn-label-desc">The physical machine and Wings daemon of this parent node will host all servers created under the new sub-node.</div>
                    </div>

                    <!-- CAPACITY VISUALIZER BENTO -->
                    <div class="bn-capacity-grid" id="capacityVisualCard">
                        <div class="bn-capacity-stat">
                            <div class="bn-capacity-val" style="color: var(--bn-blue);" id="dispTotalMem">558 GB</div>
                            <div class="bn-capacity-label">Parent Host RAM</div>
                        </div>
                        <div class="bn-capacity-stat">
                            <div class="bn-capacity-val" style="color: var(--bn-green);" id="dispTotalDisk">2560 GB</div>
                            <div class="bn-capacity-label">Parent Host Disk</div>
                        </div>
                        <div class="bn-capacity-stat">
                            <div class="bn-capacity-val" style="color: var(--bn-amber);" id="dispServerCount">12</div>
                            <div class="bn-capacity-label">Active Servers</div>
                        </div>
                    </div>

                    <!-- 2. NAME & LOCATION -->
                    <div class="row">
                        <div class="col-sm-6 bn-form-group">
                            <label for="name" class="bn-label">Private Node Name <span style="color: #ef4444;">*</span></label>
                            <input type="text" autocomplete="off" name="name" id="name" class="bn-input" value="{{ old('name') }}" placeholder="e.g. Private Node - Velmora" required>
                            <div class="bn-label-desc">Arbitrary display name, can be renamed anytime.</div>
                        </div>

                        <div class="col-sm-6 bn-form-group">
                            <label for="location_id" class="bn-label">Location Group <span style="color: #ef4444;">*</span></label>
                            <select name="location_id" id="location_id" class="bn-select" required>
                                @foreach ($locations as $loc)
                                    <option value="{{ $loc->id }}" {{ $defaultParent && $defaultParent->location_id == $loc->id ? 'selected' : '' }}>{{ $loc->short }} ({{ $loc->long }})</option>
                                @endforeach
                            </select>
                            <div class="bn-label-desc">Panel server location group.</div>
                        </div>
                    </div>

                    <!-- 3. FQDN & SCHEME -->
                    <div class="row">
                        <div class="col-sm-8 bn-form-group">
                            <label for="fqdn" class="bn-label">Sub-Node FQDN / Domain <span style="color: #ef4444;">*</span></label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" autocomplete="off" name="fqdn" id="fqdn" class="bn-input bn-input-mono" value="{{ old('fqdn') }}" placeholder="node-velmora.bytenodes.id" required>
                                <button type="button" class="bn-action-btn" onclick="useParentFqdn()" style="flex-shrink: 0;" title="Use parent domain">
                                    <i class="fa fa-clone"></i> Parent FQDN
                                </button>
                            </div>
                            <div class="bn-label-desc">You can use your own custom domain for white-labeling.</div>
                        </div>

                        <div class="col-sm-4 bn-form-group">
                            <label for="scheme" class="bn-label">SSL Scheme <span style="color: #ef4444;">*</span></label>
                            <select name="scheme" id="scheme" class="bn-select" required>
                                <option value="https" selected>HTTPS (SSL Enabled)</option>
                                <option value="http">HTTP (Plain / Insecure)</option>
                            </select>
                            <div class="bn-label-desc">Daemon security protocol.</div>
                        </div>
                    </div>

                    <!-- 4. PORTS DAEMON & SFTP -->
                    <div class="row">
                        <div class="col-sm-6 bn-form-group">
                            <label for="daemonListen" class="bn-label">Daemon Port (Wings)</label>
                            <input type="number" name="daemonListen" id="daemonListen" class="bn-input bn-input-mono" value="8080" required>
                        </div>
                        <div class="col-sm-6 bn-form-group">
                            <label for="daemonSFTP" class="bn-label">SFTP Port</label>
                            <input type="number" name="daemonSFTP" id="daemonSFTP" class="bn-input bn-input-mono" value="2022" required>
                        </div>
                    </div>

                    <!-- 5. RESOURCE QUOTAS -->
                    <div class="row">
                        <div class="col-sm-6 bn-form-group">
                            <label for="memory" class="bn-label">RAM Allocation (MB) <span style="color: #ef4444;">*</span></label>
                            <input type="number" name="memory" id="memory" class="bn-input bn-input-mono" value="{{ old('memory', 65536) }}" required>
                            <div class="bn-preset-pills">
                                <button type="button" class="bn-preset-btn" onclick="setRam(16384)">16 GB</button>
                                <button type="button" class="bn-preset-btn" onclick="setRam(32768)">32 GB</button>
                                <button type="button" class="bn-preset-btn" onclick="setRam(65536)">64 GB</button>
                                <button type="button" class="bn-preset-btn" onclick="setRam(131072)">128 GB</button>
                            </div>
                        </div>

                        <div class="col-sm-6 bn-form-group">
                            <label for="disk" class="bn-label">NVMe Disk Allocation (MB) <span style="color: #ef4444;">*</span></label>
                            <input type="number" name="disk" id="disk" class="bn-input bn-input-mono" value="{{ old('disk', 250000) }}" required>
                            <div class="bn-preset-pills">
                                <button type="button" class="bn-preset-btn" onclick="setDisk(100000)">100 GB</button>
                                <button type="button" class="bn-preset-btn" onclick="setDisk(250000)">250 GB</button>
                                <button type="button" class="bn-preset-btn" onclick="setDisk(500000)">500 GB</button>
                                <button type="button" class="bn-preset-btn" onclick="setDisk(1000000)">1 TB</button>
                            </div>
                        </div>
                    </div>

                    <!-- 6. PORT POOL GENERATOR -->
                    <div class="bn-port-dock">
                        <label class="bn-label" style="margin-bottom: 8px;">
                            <i class="fa fa-plug" style="color: var(--bn-khaki); margin-right: 5px;"></i> Automatic Port Pool Generator
                        </label>
                        <div class="row">
                            <div class="col-sm-6">
                                <label class="bn-label-desc" style="margin-bottom: 4px;">Starting Port</label>
                                <input type="number" name="start_port" id="start_port" class="bn-input bn-input-mono" value="19200" placeholder="19200" oninput="updatePortPreview()">
                            </div>
                            <div class="col-sm-6">
                                <label class="bn-label-desc" style="margin-bottom: 4px;">Port Count</label>
                                <input type="number" name="port_count" id="port_count" class="bn-input bn-input-mono" value="10" placeholder="10" oninput="updatePortPreview()">
                            </div>
                        </div>
                        <div id="portPreviewText" class="bn-port-preview bn-port-preview-active">
                            <i class="fa fa-check-circle"></i> Allocations to generate: <strong>19200 &rarr; 19209</strong> (10 Ports)
                        </div>
                    </div>

                    <!-- 7. DESCRIPTION -->
                    <div class="bn-form-group" style="margin-bottom: 0;">
                        <label for="description" class="bn-label">Description / Admin Notes</label>
                        <textarea name="description" id="description" class="bn-textarea" rows="2" placeholder="e.g. Client A Private Node, 64GB Tier"></textarea>
                    </div>
                </div>

                <div class="bn-card-footer">
                    <button type="submit" class="bn-btn-primary">
                        <i class="fa fa-bolt"></i> Create & Attach Private Sub-Node
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- RIGHT COLUMN: ACTIVE SUB-NODES & BUSINESS GUIDE -->
    <div class="col-md-5">
        <!-- 1. ACTIVE SUB-NODES -->
        <div class="bn-card">
            <div class="bn-card-header">
                <h3 class="bn-card-title">
                    <i class="fa fa-cubes" style="color: var(--bn-green);"></i> Active Virtual Sub-Nodes
                </h3>
                <span class="bn-badge bn-badge-green">
                    {{ $subNodes->count() }} Sub-Nodes
                </span>
            </div>

            <div class="table-responsive" style="overflow-x: auto;">
                @if ($subNodes->count() === 0)
                    <div style="text-align: center; padding: 48px 20px; color: var(--bn-taupe);">
                        <i class="fa fa-sitemap" style="font-size: 36px; opacity: 0.35; margin-bottom: 12px; display: block;"></i>
                        <p style="font-size: 14px; margin: 0 0 6px 0; color: var(--bn-mint);">No Virtual Sub-Nodes Found</p>
                        <small style="font-size: 12px; color: var(--bn-taupe);">Use the form on the left to partition parent node resources into your first private sub-node!</small>
                    </div>
                @else
                    <table class="bn-table">
                        <thead>
                            <tr>
                                <th>Sub-Node</th>
                                <th>Parent Node</th>
                                <th>RAM / Disk</th>
                                <th>Ports</th>
                                <th style="text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($subNodes as $sub)
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center;">
                                            <span class="bn-status-dot" title="Connected"></span>
                                            <strong style="font-family: 'Outfit';">
                                                <a href="{{ route('admin.nodes.view', $sub->id) }}" style="color: var(--bn-mint); text-decoration: none;">
                                                    {{ $sub->name }}
                                                </a>
                                            </strong>
                                        </div>
                                        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--bn-taupe); margin-top: 3px;">
                                            <i class="fa fa-globe"></i> {{ $sub->fqdn }}
                                        </div>
                                    </td>
                                    <td>
                                        <span class="bn-badge bn-badge-khaki">{{ $sub->parent_node->name ?? 'Parent' }}</span>
                                    </td>
                                    <td>
                                        <span class="bn-badge bn-badge-blue" style="margin-right: 4px;">{{ round($sub->memory / 1024, 0) }}G</span>
                                        <span class="bn-badge bn-badge-green">{{ round($sub->disk / 1024, 0) }}G</span>
                                    </td>
                                    <td>
                                        <span class="bn-badge bn-badge-amber">{{ $sub->allocations->count() }}</span>
                                    </td>
                                    <td style="text-align: right; white-space: nowrap;">
                                        <button type="button" class="bn-action-btn" onclick="openRenameModal({{ $sub->id }}, '{{ addslashes($sub->name) }}')" title="Rename Sub-Node">
                                            <i class="fa fa-pencil"></i>
                                        </button>
                                        <a href="{{ route('admin.nodes.view', $sub->id) }}" class="bn-action-btn" title="Node Settings">
                                            <i class="fa fa-cog"></i>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            </div>
        </div>

        <!-- 2. BUSINESS GUIDE CARD -->
        <div class="bn-card">
            <div class="bn-card-header">
                <h3 class="bn-card-title">
                    <i class="fa fa-lightbulb-o" style="color: var(--bn-khaki);"></i> White-Label Private Node Guide
                </h3>
            </div>
            <div class="bn-card-body" style="font-size: 13.5px; color: var(--bn-taupe);">
                <p style="margin-top: 0; line-height: 1.6; color: var(--bn-mint);">
                    <strong style="color: var(--bn-khaki);">What is a Virtual Sub-Node?</strong><br>
                    A sub-node is a formal panel partition featuring its own name, custom domain, and isolated quota. All server workloads remain transparently executed by the high-performance parent host.
                </p>

                <h5 style="font-family: 'Outfit'; font-weight: 600; color: var(--bn-mint); margin: 16px 0 10px 0; text-transform: uppercase; font-size: 11.5px; letter-spacing: 0.05em;">
                    Hosting Business Advantages:
                </h5>
                <ul class="bn-guide-list">
                    <li>Clients see their own exclusive branding & FQDN inside the panel.</li>
                    <li>Direct SFTP connections using the client's custom domain FQDN.</li>
                    <li>Zero host risk: Clients have no root or SSH access to the underlying physical node.</li>
                    <li>Clients can partition and reallocate their servers via the <strong>Server Splitter</strong> module.</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<!-- MODAL QUICK RENAME -->
<div class="modal fade bn-modal" id="renameModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-sm" role="document">
        <form id="renameForm" method="POST">
            {!! csrf_field() !!}
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" style="color: var(--bn-taupe); opacity: 1;">&times;</button>
                    <h4 class="modal-title" style="font-family: 'Outfit'; font-weight: 600; font-size: 16px; color: var(--bn-mint);">
                        <i class="fa fa-pencil" style="color: var(--bn-khaki); margin-right: 6px;"></i> Rename Sub-Node
                    </h4>
                </div>
                <div class="modal-body">
                    <div class="bn-form-group" style="margin-bottom: 0;">
                        <label for="rename_name" class="bn-label">New Sub-Node Name</label>
                        <input type="text" name="name" id="rename_name" class="bn-input" required autocomplete="off">
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button type="button" class="bn-action-btn" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="bn-action-btn" style="background: var(--bn-khaki); color: #141211; font-weight: 600; border-color: var(--bn-khaki);">
                        <i class="fa fa-save"></i> Save Changes
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        function updateParentVisual() {
            var sel = document.getElementById('parent_node_id');
            if (!sel || !sel.options || sel.selectedIndex < 0) return;
            var opt = sel.options[sel.selectedIndex];
            var memGb = Math.round(parseInt(opt.getAttribute('data-mem')) / 1024);
            var diskGb = Math.round(parseInt(opt.getAttribute('data-disk')) / 1024);
            var srv = opt.getAttribute('data-servers');
            var loc = opt.getAttribute('data-location');

            var memEl = document.getElementById('dispTotalMem');
            var diskEl = document.getElementById('dispTotalDisk');
            var srvEl = document.getElementById('dispServerCount');

            if (memEl) memEl.innerText = memGb + ' GB';
            if (diskEl) diskEl.innerText = diskGb + ' GB';
            if (srvEl) srvEl.innerText = srv;

            if (loc && document.getElementById('location_id')) {
                document.getElementById('location_id').value = loc;
            }
        }

        function useParentFqdn() {
            var sel = document.getElementById('parent_node_id');
            if (!sel || !sel.options || sel.selectedIndex < 0) return;
            var opt = sel.options[sel.selectedIndex];
            var fqdnInput = document.getElementById('fqdn');
            if (fqdnInput) {
                fqdnInput.value = opt.getAttribute('data-fqdn');
            }
        }

        function setRam(mb) {
            var input = document.getElementById('memory');
            if (input) input.value = mb;
        }

        function setDisk(mb) {
            var input = document.getElementById('disk');
            if (input) input.value = mb;
        }

        function updatePortPreview() {
            var start = parseInt(document.getElementById('start_port').value) || 0;
            var count = parseInt(document.getElementById('port_count').value) || 0;
            var el = document.getElementById('portPreviewText');
            if (!el) return;

            if (start > 0 && count > 0) {
                var end = start + count - 1;
                el.innerHTML = '<i class="fa fa-check-circle"></i> Allocations to generate: <strong>' + start + ' &rarr; ' + end + '</strong> (' + count + ' Ports)';
                el.className = 'bn-port-preview bn-port-preview-active';
            } else {
                el.innerHTML = '<i class="fa fa-info-circle"></i> No ports will be automatically generated.';
                el.className = 'bn-port-preview bn-port-preview-empty';
            }
        }

        function openRenameModal(nodeId, currentName) {
            var nameInput = document.getElementById('rename_name');
            var form = document.getElementById('renameForm');
            if (nameInput) nameInput.value = currentName;
            if (form) form.action = '/admin/nodes/splitter/' + nodeId + '/rename';
            $('#renameModal').modal('show');
        }

        function copySslCmd() {
            var el = document.getElementById('sslCmdText');
            if (!el) return;
            var text = el.innerText;
            navigator.clipboard.writeText(text).then(function() {
                alert('Certbot command copied to clipboard!');
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            updateParentVisual();
            updatePortPreview();
        });
    </script>
@endsection
