@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'splitter'])

@section('title')
    Server Splitter Settings
@endsection

@section('scripts')
    @parent
    {!! Theme::css('vendor/fontawesome/animation.min.css') !!}
    <style>
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
            --bn-danger: #ef4444;
        }

        .bn-card {
            background-color: var(--bn-bg-card);
            border: 1px solid var(--bn-border);
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            transition: border-color 0.2s ease;
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
            display: flex;
            justify-content: flex-end;
        }

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
        .bn-badge-blue {
            background: rgba(96, 165, 250, 0.12);
            color: var(--bn-blue);
            border: 1px solid rgba(96, 165, 250, 0.25);
        }
        .bn-badge-danger {
            background: rgba(239, 68, 68, 0.12);
            color: var(--bn-danger);
            border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .bn-form-group {
            margin-bottom: 16px;
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
        .bn-input, .bn-select {
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
        .bn-input:focus, .bn-select:focus {
            border-color: var(--bn-khaki) !important;
            box-shadow: 0 0 0 2px rgba(191, 168, 158, 0.2) !important;
        }
        .bn-input-mono {
            font-family: 'JetBrains Mono', monospace !important;
        }

        .bn-btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: var(--bn-khaki);
            color: #141211;
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 13.5px;
            font-weight: 700;
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(191, 168, 158, 0.25);
            transition: all 0.15s ease;
        }
        .bn-btn-primary:hover {
            background-color: #d6c4bc;
            color: #141211;
            transform: translateY(-1px);
        }
        .bn-btn-primary:active {
            transform: scale(0.98);
        }

        .bn-action-btn {
            background: #1f1b19;
            border: 1px solid var(--bn-border);
            color: var(--bn-mint);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
        }
        .bn-action-btn:hover {
            border-color: var(--bn-khaki);
            background: #2b2522;
            color: #ffffff;
            transform: translateY(-1px);
        }

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

        .bn-section-heading {
            font-family: 'Outfit', -apple-system, sans-serif;
            font-size: 12.5px;
            font-weight: 700;
            color: var(--bn-khaki);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin: 0 0 14px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--bn-border);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .bn-brand-banner {
            background: linear-gradient(135deg, #25211e 0%, #1a1715 100%);
            border: 1px solid var(--bn-border);
            border-radius: 10px;
            padding: 24px 16px;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
    </style>
@endsection

@section('content-header')
    <div style="margin-bottom: 24px;">
        <h1 style="font-family: 'Outfit'; font-weight: 700; color: var(--bn-mint); font-size: 24px; margin: 0 0 6px 0; display: flex; align-items: center; gap: 10px;">
            <i class="fa fa-sliders" style="color: var(--bn-khaki);"></i> Server Splitter Settings
        </h1>
        <p style="font-family: 'Outfit'; font-size: 13.5px; color: var(--bn-taupe); margin: 0;">
            Kelola batasan resource induk, perilaku modifikasi server, dan aturan eggs splitter.
        </p>
    </div>
@endsection

@section('content')
    @yield('settings::nav')

    <div class="row">
        <!-- 1. LEFT COLUMN: Info & Support -->
        <div class="col-md-3">
            <div class="bn-card">
                <div class="bn-card-header">
                    <h3 class="bn-card-title">
                        <i class="fa fa-info-circle" style="color: var(--bn-blue);"></i> Ekstensi Splitter
                    </h3>
                </div>
                <div class="bn-card-body text-center">
                    <div style="font-size: 48px; color: var(--bn-khaki); margin-bottom: 12px;">
                        <i class="fa fa-server"></i>
                    </div>
                    <h4 style="font-family: 'Outfit'; font-weight: 600; color: var(--bn-mint); margin: 0 0 4px 0;">ByteNodes Server Splitter</h4>
                    <span class="bn-badge bn-badge-khaki">v1.1.5 Enterprise</span>
                    
                    <hr style="border-color: var(--bn-border); margin: 16px 0;">
                    
                    <div class="text-left" style="font-size: 12.5px; color: var(--bn-mint);">
                        <div style="font-family: 'Outfit'; font-weight: 600; color: var(--bn-khaki); margin-bottom: 8px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">
                            Fitur Aktif:
                        </div>
                        <ul style="padding-left: 18px; margin: 0; line-height: 1.6; color: var(--bn-taupe);">
                            <li><span style="color: var(--bn-mint);">Safety Locks</span> saat resize server</li>
                            <li><span style="color: var(--bn-mint);">Advanced Egg Rules</span></li>
                            <li><span style="color: var(--bn-mint);">Disk Limits Toggle</span></li>
                            <li><span style="color: var(--bn-mint);">Multi-tenant isolation</span></li>
                        </ul>
                    </div>

                    <hr style="border-color: var(--bn-border); margin: 16px 0;">

                    <a href="https://discord.gg/bytenodes" target="_blank" class="bn-action-btn" style="width: 100%; justify-content: center; background: #5865F2; color: #fff; border-color: #5865F2;">
                        <i class="fa fa-comments"></i> Discord Support
                    </a>
                </div>
            </div>

            <!-- Visual Badge -->
            <div class="bn-brand-banner">
                <span style="font-family: 'Outfit'; font-size: 11px; font-weight: 600; color: var(--bn-khaki); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">
                    ByteNodes Engine
                </span>
                <span style="font-family: 'Outfit'; font-size: 18px; font-weight: 700; color: var(--bn-mint); display: block; line-height: 1.3;">
                    Resource Partition
                </span>
                <span class="bn-badge bn-badge-khaki" style="margin-top: 14px;">
                    <i class="fa fa-check-circle"></i> Ready to Split
                </span>
            </div>
        </div>

        <!-- 2. MIDDLE COLUMN: Configuration -->
        <div class="col-md-9">
            <form action="{{ route('admin.settings.splitter') }}" method="POST">
                @csrf
                @method('PATCH')
                <div class="bn-card">
                    <div class="bn-card-header">
                        <h3 class="bn-card-title">
                            <i class="fa fa-sliders" style="color: var(--bn-khaki);"></i> Konfigurasi Batasan Resource Induk
                        </h3>
                    </div>
                    <div class="bn-card-body">
                        <!-- Reserved Resources on Master -->
                        <div class="bn-section-heading">
                            <i class="fa fa-shield"></i> Kuota Minimum yang Wajib Tersisa di Server Induk (Master)
                        </div>
                        <div class="row">
                            <div class="col-md-4 bn-form-group">
                                <label class="bn-label">Min CPU (%)</label>
                                <input type="number" required class="bn-input bn-input-mono" name="bytenodes::splitter::min_cpu" value="{{ old('bytenodes::splitter::min_cpu', $min_cpu) }}" min="0">
                                <div class="bn-label-desc">Sisa CPU minimal di master.</div>
                            </div>
                            <div class="col-md-4 bn-form-group">
                                <label class="bn-label">Min Memory (MiB)</label>
                                <input type="number" required class="bn-input bn-input-mono" name="bytenodes::splitter::min_mem" value="{{ old('bytenodes::splitter::min_mem', $min_mem) }}" min="0">
                                <div class="bn-label-desc">Sisa RAM minimal di master.</div>
                            </div>
                            <div class="col-md-4 bn-form-group">
                                <label class="bn-label">Min Disk (MiB)</label>
                                <input type="number" required class="bn-input bn-input-mono" name="bytenodes::splitter::min_disk" value="{{ old('bytenodes::splitter::min_disk', $min_disk) }}" min="0">
                                <div class="bn-label-desc">Sisa Disk minimal di master.</div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4 bn-form-group">
                                <label class="bn-label">Min Databases</label>
                                <input type="number" required class="bn-input bn-input-mono" name="bytenodes::splitter::min_db" value="{{ old('bytenodes::splitter::min_db', $min_db) }}" min="0">
                            </div>
                            <div class="col-md-4 bn-form-group">
                                <label class="bn-label">Min Allocations</label>
                                <input type="number" required class="bn-input bn-input-mono" name="bytenodes::splitter::min_alloc" value="{{ old('bytenodes::splitter::min_alloc', $min_alloc) }}" min="0">
                            </div>
                            <div class="col-md-4 bn-form-group">
                                <label class="bn-label">Min Backups</label>
                                <input type="number" required class="bn-input bn-input-mono" name="bytenodes::splitter::min_backup" value="{{ old('bytenodes::splitter::min_backup', $min_backup) }}" min="0">
                            </div>
                        </div>

                        <!-- Advanced Settings -->
                        <div class="bn-section-heading" style="margin-top: 14px;">
                            <i class="fa fa-cogs"></i> Perilaku Lanjutan (Advanced Behaviours)
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 bn-form-group">
                                <label class="bn-label">Hitung Batasan Disk (Include Disk Limits)</label>
                                <select name="bytenodes::splitter::include_disk" class="bn-select">
                                    <option value="1" {{ $include_disk ? 'selected' : '' }}>Ya (Kurangi Kuota Disk Induk)</option>
                                    <option value="0" {{ !$include_disk ? 'selected' : '' }}>Tidak (Disk Bebas/Independen)</option>
                                </select>
                                <div class="bn-label-desc">Jika Ya, alokasi disk child server akan mengurangi kuota master server.</div>
                            </div>

                            <div class="col-md-6 bn-form-group">
                                <label class="bn-label">Tampilkan Kuota Reserved di Progress Bar Klien</label>
                                <select name="bytenodes::splitter::display_reserved" class="bn-select">
                                    <option value="1" {{ $display_reserved ? 'selected' : '' }}>Ya (Tampilkan)</option>
                                    <option value="0" {{ !$display_reserved ? 'selected' : '' }}>Tidak (Sembunyikan)</option>
                                </select>
                                <div class="bn-label-desc">Menampilkan batas reserved server master di bar alokasi antarmuka klien.</div>
                            </div>
                        </div>

                        <div class="bn-form-group" style="margin-bottom: 0;">
                            <label class="bn-label">Aksi Server Induk saat Split / Resize</label>
                            <select name="bytenodes::splitter::server_action" class="bn-select">
                                <option value="restart" {{ $server_action == 'restart' ? 'selected' : '' }}>Restart Parent Server</option>
                                <option value="stop" {{ $server_action == 'stop' ? 'selected' : '' }}>Stop Parent Server</option>
                                <option value="kill" {{ $server_action == 'kill' ? 'selected' : '' }}>Kill Parent Server</option>
                                <option value="none" {{ $server_action == 'none' ? 'selected' : '' }}>None (Jangan Ubah State Daya)</option>
                            </select>
                            <div class="bn-label-desc">Aksi power yang dijalankan pada server induk saat resource diperbarui.</div>
                        </div>
                    </div>
                    <div class="bn-card-footer">
                        <button type="submit" class="bn-btn-primary">
                            <i class="fa fa-save"></i> Simpan Konfigurasi
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- 3. BOTTOM ROW: Egg Rules Configuration -->
    <div class="row">
        <div class="col-xs-12">
            <div class="bn-card">
                <div class="bn-card-header">
                    <h3 class="bn-card-title">
                        <i class="fa fa-code-fork" style="color: var(--bn-khaki);"></i> Aturan Pemecahan Egg (Egg Rules)
                    </h3>
                </div>
                <div class="table-responsive" style="overflow-x: auto;">
                    <table class="bn-table">
                        <thead>
                            <tr>
                                <th>Parent Egg</th>
                                <th>Allowed Child Eggs</th>
                                <th style="text-align: right;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if(empty($rules))
                                <tr>
                                    <td colspan="3" style="text-align: center; color: var(--bn-taupe); padding: 32px 16px;">
                                        Belum ada aturan egg yang dikonfigurasi. Semua egg dapat memilih sembarang child egg.
                                    </td>
                                </tr>
                            @else
                                @foreach($rules as $parentEggId => $allowedEggIds)
                                    @php
                                        $parentEgg = $eggs->firstWhere('id', $parentEggId);
                                    @endphp
                                    <tr>
                                        <td>
                                            @if($parentEgg)
                                                <strong style="color: var(--bn-mint);">{{ $parentEgg->name }}</strong>
                                                <small style="color: var(--bn-taupe); margin-left: 4px;">({{ $parentEgg->nest->name }})</small>
                                            @else
                                                <span style="color: var(--bn-danger);">Unknown Egg (ID: {{ $parentEggId }})</span>
                                            @endif
                                        </td>
                                        <td>
                                            @foreach($allowedEggIds as $id)
                                                @php
                                                    $childEgg = $eggs->firstWhere('id', $id);
                                                @endphp
                                                @if($childEgg)
                                                    <span class="bn-badge bn-badge-blue" style="margin-right: 4px; margin-bottom: 4px;">
                                                        {{ $childEgg->name }} <small>({{ $childEgg->nest->name }})</small>
                                                    </span>
                                                @else
                                                    <span class="bn-badge bn-badge-danger" style="margin-right: 4px;">Unknown (ID: {{ $id }})</span>
                                                @endif
                                            @endforeach
                                        </td>
                                        <td style="text-align: right;">
                                            <form action="{{ route('admin.settings.splitter.rules.delete', $parentEggId) }}" method="POST" style="display:inline-block;">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="bn-action-btn" style="color: var(--bn-danger); border-color: rgba(239, 68, 68, 0.3);" onclick="return confirm('Hapus aturan egg ini?')">
                                                    <i class="fa fa-trash"></i> Hapus
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- 4. ADD NEW EGG RULE FORM -->
    <div class="row">
        <div class="col-xs-12">
            <div class="bn-card">
                <div class="bn-card-header">
                    <h3 class="bn-card-title">
                        <i class="fa fa-plus-circle" style="color: var(--bn-green);"></i> Tambah Aturan Egg Baru
                    </h3>
                </div>
                <form action="{{ route('admin.settings.splitter.rules') }}" method="POST">
                    @csrf
                    <div class="bn-card-body">
                        <div class="row">
                            <div class="col-md-4 bn-form-group">
                                <label class="bn-label">Pilih Parent Egg</label>
                                <select name="parent_egg_id" class="bn-select" required>
                                    <option value="">-- Pilih Parent Egg --</option>
                                    @foreach($nests as $nest)
                                        <optgroup label="Nest: {{ $nest->name }}">
                                            @foreach($eggs->where('nest_id', $nest->id) as $egg)
                                                <option value="{{ $egg->id }}">{{ $egg->name }}</option>
                                            @endforeach
                                        </optgroup>
                                    @endforeach
                                </select>
                                <div class="bn-label-desc">Egg yang memicu aturan pemecahan ini.</div>
                            </div>
                            <div class="col-md-8 bn-form-group">
                                <label class="bn-label">Pilih Allowed Child Eggs</label>
                                <select name="allowed_egg_ids[]" class="bn-select" multiple style="height: 120px;" required>
                                    @foreach($nests as $nest)
                                        <optgroup label="Nest: {{ $nest->name }}">
                                            @foreach($eggs->where('nest_id', $nest->id) as $egg)
                                                <option value="{{ $egg->id }}">{{ $egg->name }}</option>
                                            @endforeach
                                        </optgroup>
                                    @endforeach
                                </select>
                                <div class="bn-label-desc">Tekan tombol Ctrl/Cmd untuk memilih beberapa egg sekaligus.</div>
                            </div>
                        </div>
                    </div>
                    <div class="bn-card-footer">
                        <button type="submit" class="bn-btn-primary">
                            <i class="fa fa-plus"></i> Tambah Aturan Egg
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
