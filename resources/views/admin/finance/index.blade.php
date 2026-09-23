@extends('layouts.admin')

@section('title')
    Financial & Billing Manager
@endsection

@section('content-header')
    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
        <div>
            <h1 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: #EBF5EE; margin: 0; letter-spacing: -0.02em;">
                Financial & Billing Manager
            </h1>
            <p style="font-family: 'Outfit', sans-serif; font-size: 13px; color: #8B786D; margin: 4px 0 0 0;">
                Monitor recurring revenue (MRR), subscription lifecycles, outstanding balances, and billing states.
            </p>
        </div>
        <ol class="breadcrumb" style="position: static; float: none; background: transparent; padding: 0; margin: 0; font-size: 12px;">
            <li><a href="{{ route('admin.index') }}" style="color: #8B786D;"><i class="fa fa-dashboard"></i> Admin</a></li>
            <li style="color: #8B786D;">Extensions</li>
            <li class="active" style="color: #BFA89E; font-weight: 600;">Financial Manager</li>
        </ol>
    </div>
@endsection

@section('content')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --bn-bg-base: #141211;
            --bn-bg-surface: #1c1917;
            --bn-bg-card: #25211e;
            --bn-bg-card-hover: #2e2824;
            --bn-mint: #EBF5EE;
            --bn-khaki: #BFA89E;
            --bn-taupe: #8B786D;
            --bn-border: rgba(191, 168, 158, 0.14);
            --bn-border-active: rgba(191, 168, 158, 0.35);
            --bn-emerald: #52b788;
            --bn-amber: #dd9754;
            --bn-crimson: #c94b4b;
            --bn-violet: #a855f7;
            --bn-slate: #94a3b8;
        }

        /* Bento Grid 5 Cards */
        .fn-bento-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 22px;
        }
        @media (max-width: 1200px) {
            .fn-bento-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }
        @media (max-width: 768px) {
            .fn-bento-grid {
                grid-template-columns: repeat(1, minmax(0, 1fr));
            }
        }

        .fn-bento-card {
            background-color: var(--bn-bg-surface);
            border: 1px solid var(--bn-border);
            border-radius: 12px;
            padding: 16px 18px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 112px;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }
        .fn-bento-card:hover {
            transform: translateY(-2px);
            border-color: var(--bn-border-active);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }
        .fn-bento-topline {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
        }

        .fn-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .fn-card-label {
            font-family: 'Outfit', sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.07em;
            text-transform: uppercase;
            color: var(--bn-taupe);
        }
        .fn-card-icon-wrap {
            width: 28px;
            height: 28px;
            border-radius: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
        }
        .fn-card-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 21px;
            font-weight: 700;
            color: var(--bn-mint);
            letter-spacing: -0.02em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
            margin-bottom: 8px;
        }
        .fn-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: 'Outfit', sans-serif;
            font-size: 11px;
            font-weight: 600;
            color: var(--bn-khaki);
            border-top: 1px solid rgba(191, 168, 158, 0.08);
            padding-top: 8px;
            margin-top: auto;
        }

        /* Collapsible Billing Guide Rules */
        .fn-rules-container {
            background-color: var(--bn-bg-surface);
            border: 1px solid var(--bn-border);
            border-radius: 12px;
            margin-bottom: 22px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .fn-rules-header {
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            user-select: none;
            background: rgba(191, 168, 158, 0.03);
            border-bottom: 1px solid transparent;
            transition: background 0.15s ease;
        }
        .fn-rules-header:hover {
            background: rgba(191, 168, 158, 0.07);
        }
        .fn-rules-header.open {
            border-bottom-color: var(--bn-border);
        }
        .fn-rules-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 12px;
            padding: 16px 18px;
        }
        @media (max-width: 1024px) {
            .fn-rules-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
        @media (max-width: 640px) {
            .fn-rules-grid {
                grid-template-columns: 1fr;
            }
        }
        .fn-rule-item {
            background: var(--bn-bg-card);
            border: 1px solid rgba(191, 168, 158, 0.08);
            border-radius: 9px;
            padding: 12px 14px;
        }
        .fn-rule-title {
            font-family: 'Outfit', sans-serif;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 7px;
            margin-bottom: 6px;
        }
        .fn-rule-desc {
            font-family: 'Outfit', sans-serif;
            font-size: 11.5px;
            color: #b5a49a;
            line-height: 1.45;
            margin: 0;
        }
        .fn-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            flex-shrink: 0;
        }

        /* Ledger Table Container */
        .fn-ledger-box {
            background-color: var(--bn-bg-surface);
            border: 1px solid var(--bn-border);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
        }
        .fn-ledger-toolbar {
            padding: 14px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            border-bottom: 1px solid var(--bn-border);
            background: rgba(28, 25, 23, 0.95);
        }
        .fn-toolbar-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .fn-toolbar-title {
            font-family: 'Outfit', sans-serif;
            font-size: 15px;
            font-weight: 700;
            color: var(--bn-mint);
            margin: 0;
            letter-spacing: -0.01em;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .fn-toolbar-right {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }

        /* Inputs & Controls */
        .fn-control-select, .fn-search-input {
            background-color: var(--bn-bg-card);
            border: 1px solid var(--bn-border);
            color: var(--bn-mint);
            border-radius: 8px;
            font-family: 'Outfit', sans-serif;
            font-size: 12.5px;
            height: 34px;
            padding: 0 12px;
            outline: none;
            transition: all 0.15s ease;
        }
        .fn-control-select:focus, .fn-search-input:focus {
            border-color: var(--bn-khaki);
            box-shadow: 0 0 0 2px rgba(191, 168, 158, 0.2);
        }
        .fn-search-wrapper {
            position: relative;
        }
        .fn-search-input {
            padding-left: 32px;
            width: 250px;
        }
        .fn-search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--bn-taupe);
            font-size: 12px;
            pointer-events: none;
        }

        /* Table */
        .fn-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 0;
        }
        .fn-table thead th {
            background-color: #171513;
            color: var(--bn-taupe);
            font-family: 'Outfit', sans-serif;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 12px 18px;
            border-bottom: 1px solid var(--bn-border);
            border-top: none;
            vertical-align: middle;
            white-space: nowrap;
        }
        .fn-table tbody tr {
            background-color: var(--bn-bg-surface);
            transition: background-color 0.15s ease;
        }
        .fn-table tbody tr:hover {
            background-color: var(--bn-bg-card-hover) !important;
        }
        .fn-table tbody td {
            padding: 14px 18px;
            border-bottom: 1px solid rgba(191, 168, 158, 0.08);
            border-top: none;
            vertical-align: middle;
            color: #d1c5bc;
            font-family: 'Outfit', sans-serif;
        }

        /* Status Badges */
        .fn-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 6px;
            font-family: 'Outfit', sans-serif;
            font-size: 11.5px;
            font-weight: 700;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            white-space: nowrap;
        }
        .fn-badge-paid {
            background-color: rgba(82, 183, 136, 0.12);
            border: 1px solid rgba(82, 183, 136, 0.35);
            color: #52b788 !important;
        }
        .fn-badge-unpaid {
            background-color: rgba(221, 151, 84, 0.12);
            border: 1px solid rgba(221, 151, 84, 0.35);
            color: #dd9754 !important;
        }
        .fn-badge-overdue {
            background-color: rgba(201, 75, 75, 0.14);
            border: 1px solid rgba(201, 75, 75, 0.35);
            color: #f87171 !important;
        }
        .fn-badge-split {
            background-color: rgba(168, 85, 247, 0.12);
            border: 1px solid rgba(168, 85, 247, 0.35);
            color: #c084fc !important;
        }
        .fn-badge-free {
            background-color: rgba(148, 163, 184, 0.12);
            border: 1px solid rgba(148, 163, 184, 0.3);
            color: #94a3b8 !important;
        }

        /* Node Pill */
        .fn-node-pill {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: var(--bn-bg-card);
            border: 1px solid rgba(191, 168, 158, 0.2);
            color: var(--bn-khaki);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .fn-node-pill:hover {
            border-color: var(--bn-khaki);
            background: rgba(191, 168, 158, 0.12);
            color: var(--bn-mint);
            transform: translateY(-1px);
        }

        /* Action Buttons */
        .fn-btn-action {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            border-radius: 6px;
            font-family: 'Outfit', sans-serif;
            font-size: 11.5px;
            font-weight: 600;
            text-decoration: none !important;
            cursor: pointer;
            transition: all 0.15s ease;
            border: none;
            outline: none;
        }
        .fn-btn-action:active {
            transform: scale(0.97);
        }
        .fn-btn-paid {
            background: rgba(82, 183, 136, 0.12);
            border: 1px solid rgba(82, 183, 136, 0.3);
            color: #52b788;
        }
        .fn-btn-paid:hover {
            background: #52b788;
            color: #141211;
        }
        .fn-btn-suspend {
            background: rgba(201, 75, 75, 0.12);
            border: 1px solid rgba(201, 75, 75, 0.3);
            color: #f87171;
        }
        .fn-btn-suspend:hover {
            background: #c94b4b;
            color: #ffffff;
        }
        .fn-btn-unsuspend {
            background: rgba(82, 183, 136, 0.12);
            border: 1px solid rgba(82, 183, 136, 0.3);
            color: #52b788;
        }
        .fn-btn-unsuspend:hover {
            background: #52b788;
            color: #141211;
        }
        .fn-btn-detail {
            background: var(--bn-bg-card);
            border: 1px solid rgba(191, 168, 158, 0.2);
            color: var(--bn-khaki);
        }
        .fn-btn-detail:hover {
            border-color: var(--bn-khaki);
            color: var(--bn-mint);
        }

        .fn-mrr-setting-btn {
            background: transparent;
            border: 1px solid rgba(191, 168, 158, 0.25);
            color: var(--bn-khaki);
            border-radius: 6px;
            padding: 2px 8px;
            font-size: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .fn-mrr-setting-btn:hover {
            background: rgba(191, 168, 158, 0.12);
            color: var(--bn-mint);
        }
    </style>

    <!-- Top 5 Bento Stat Cards -->
    <div class="fn-bento-grid">
        <!-- 1. Monthly Revenue -->
        <div class="fn-bento-card">
            <div class="fn-bento-topline" style="background: var(--bn-emerald);"></div>
            <div class="fn-card-header">
                <span class="fn-card-label">Monthly Revenue (MRR)</span>
                <div class="fn-card-icon-wrap" style="background: rgba(82, 183, 136, 0.15); color: #52b788;">
                    <i class="fa fa-line-chart"></i>
                </div>
            </div>
            <div class="fn-card-value" title="{{ $totalPaidRevenue }}">
                {{ $totalPaidRevenue }}
            </div>
            <div class="fn-card-footer">
                <span><i class="fa fa-check-circle" style="color: var(--bn-emerald); margin-right: 4px;"></i> {{ $paidCount }} Paid Servers</span>
                <button type="button" class="fn-mrr-setting-btn" data-toggle="modal" data-target="#customMrrModal">
                    <i class="fa fa-pencil"></i> {{ $isCustomMrr ? 'Custom MRR' : 'Set MRR' }}
                </button>
            </div>
        </div>

        <!-- 2. Total Outstanding (Pending & Overdue) -->
        <div class="fn-bento-card">
            <div class="fn-bento-topline" style="background: var(--bn-amber);"></div>
            <div class="fn-card-header">
                <span class="fn-card-label">Total Outstanding</span>
                <div class="fn-card-icon-wrap" style="background: rgba(221, 151, 84, 0.15); color: #dd9754;">
                    <i class="fa fa-clock-o"></i>
                </div>
            </div>
            <div class="fn-card-value" title="{{ $totalPendingRevenue }}">
                {{ $totalPendingRevenue }}
            </div>
            <div class="fn-card-footer">
                <span><i class="fa fa-exclamation-circle" style="color: var(--bn-amber); margin-right: 4px;"></i> {{ $unpaidCount }} Unpaid &middot; {{ $overdueCount }} Overdue</span>
            </div>
        </div>

        <!-- 3. Overdue (Actionable for Suspension) -->
        <div class="fn-bento-card">
            <div class="fn-bento-topline" style="background: var(--bn-crimson);"></div>
            <div class="fn-card-header">
                <span class="fn-card-label">Overdue Servers</span>
                <div class="fn-card-icon-wrap" style="background: rgba(201, 75, 75, 0.15); color: #f87171;">
                    <i class="fa fa-ban"></i>
                </div>
            </div>
            <div class="fn-card-value">
                {{ $overdueCount }} <span style="font-size: 13px; font-weight: 500; color: var(--bn-taupe);">Servers</span>
            </div>
            <div class="fn-card-footer">
                <span><i class="fa fa-shield" style="color: var(--bn-crimson); margin-right: 4px;"></i> Eligible for Suspension</span>
            </div>
        </div>

        <!-- 4. Split Servers -->
        <div class="fn-bento-card">
            <div class="fn-bento-topline" style="background: var(--bn-violet);"></div>
            <div class="fn-card-header">
                <span class="fn-card-label">Split Instances</span>
                <div class="fn-card-icon-wrap" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">
                    <i class="fa fa-sitemap"></i>
                </div>
            </div>
            <div class="fn-card-value">
                {{ $splitCount }} <span style="font-size: 13px; font-weight: 500; color: var(--bn-taupe);">Servers</span>
            </div>
            <div class="fn-card-footer">
                <span><i class="fa fa-link" style="color: var(--bn-violet); margin-right: 4px;"></i> Linked to Parent Node</span>
            </div>
        </div>

        <!-- 5. Total Server Panel -->
        <div class="fn-bento-card">
            <div class="fn-bento-topline" style="background: var(--bn-khaki);"></div>
            <div class="fn-card-header">
                <span class="fn-card-label">Total Panel Servers</span>
                <div class="fn-card-icon-wrap" style="background: rgba(191, 168, 158, 0.15); color: #BFA89E;">
                    <i class="fa fa-server"></i>
                </div>
            </div>
            <div class="fn-card-value">
                {{ $totalServers }} <span style="font-size: 13px; font-weight: 500; color: var(--bn-taupe);">Servers</span>
            </div>
            <div class="fn-card-footer">
                <span><i class="fa fa-cube" style="color: var(--bn-khaki); margin-right: 4px;"></i> {{ $freeCount }} Free / Demo Tier</span>
            </div>
        </div>
    </div>

    <!-- Collapsible 7-Days Billing Rules Reference -->
    <div class="fn-rules-container">
        <div class="fn-rules-header" id="fn-rules-toggle">
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa fa-sliders" style="color: var(--bn-khaki); font-size: 13px;"></i>
                <span style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; color: var(--bn-mint);">
                    Automated Billing Logic Guide (7-Day Rules)
                </span>
            </div>
            <div style="font-size: 12px; color: var(--bn-taupe);">
                <span id="fn-rules-toggle-text">Hide Guide</span>
                <i class="fa fa-chevron-up" id="fn-rules-icon" style="margin-left: 6px; font-size: 11px;"></i>
            </div>
        </div>
        <div class="fn-rules-grid" id="fn-rules-body">
            <div class="fn-rule-item">
                <div class="fn-rule-title" style="color: var(--bn-emerald);">
                    <span class="fn-dot" style="background: var(--bn-emerald);"></span>
                    PAID
                </div>
                <p class="fn-rule-desc">
                    Active subscription period (more than 7 days remaining before expiration or recently renewed).
                </p>
            </div>
            <div class="fn-rule-item">
                <div class="fn-rule-title" style="color: var(--bn-amber);">
                    <span class="fn-dot" style="background: var(--bn-amber);"></span>
                    UNPAID (Due Soon)
                </div>
                <p class="fn-rule-desc">
                    7 days or less remaining before expiration date (renewal notice and invoice window).
                </p>
            </div>
            <div class="fn-rule-item">
                <div class="fn-rule-title" style="color: #f87171;">
                    <span class="fn-dot" style="background: var(--bn-crimson);"></span>
                    OVERDUE
                </div>
                <p class="fn-rule-desc">
                    Past expiration date without renewal, or currently in <strong>SUSPENDED</strong> status.
                </p>
            </div>
            <div class="fn-rule-item">
                <div class="fn-rule-title" style="color: #c084fc;">
                    <span class="fn-dot" style="background: var(--bn-violet);"></span>
                    SPLIT SERVER
                </div>
                <p class="fn-rule-desc">
                    Sub-instance allocated from primary server. Billing cycle and lifecycle follow parent server.
                </p>
            </div>
            <div class="fn-rule-item">
                <div class="fn-rule-title" style="color: var(--bn-slate);">
                    <span class="fn-dot" style="background: var(--bn-slate);"></span>
                    FREE / DEMO
                </div>
                <p class="fn-rule-desc">
                    Complimentary demo or test server instances with zero rate (0).
                </p>
            </div>
        </div>
    </div>

    <!-- Main Server Finance Ledger -->
    <div class="fn-ledger-box">
        <div class="fn-ledger-toolbar">
            <div class="fn-toolbar-left">
                <h3 class="fn-toolbar-title">
                    <i class="fa fa-database" style="color: var(--bn-khaki);"></i>
                    Server Financial Ledger
                </h3>
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; background: rgba(191, 168, 158, 0.1); border: 1px solid rgba(191, 168, 158, 0.18); color: var(--bn-khaki); padding: 2px 8px; border-radius: 9999px;">
                    {{ count($servers) }} total
                </span>
            </div>

            <div class="fn-toolbar-right">
                <!-- Currency Selector Form -->
                <form id="currency-form" action="{{ route('admin.finance.currency') }}" method="POST" style="display: inline-flex; align-items: center; gap: 6px; margin: 0;">
                    @csrf
                    <label for="currency-select" style="font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700; color: var(--bn-taupe); text-transform: uppercase; margin: 0;">
                        Currency:
                    </label>
                    <select id="currency-select" name="currency" class="fn-control-select" onchange="document.getElementById('currency-form').submit();" style="font-weight: 600; width: 150px;">
                        <option value="IDR" {{ $currency === 'IDR' ? 'selected' : '' }}>IDR &middot; Rp (Indonesia)</option>
                        <option value="USD" {{ $currency === 'USD' ? 'selected' : '' }}>USD &middot; $ (United States)</option>
                        <option value="EUR" {{ $currency === 'EUR' ? 'selected' : '' }}>EUR &middot; &euro; (Eurozone)</option>
                        <option value="SGD" {{ $currency === 'SGD' ? 'selected' : '' }}>SGD &middot; S$ (Singapore)</option>
                        <option value="MYR" {{ $currency === 'MYR' ? 'selected' : '' }}>MYR &middot; RM (Malaysia)</option>
                        <option value="GBP" {{ $currency === 'GBP' ? 'selected' : '' }}>GBP &middot; &pound; (United Kingdom)</option>
                        <option value="JPY" {{ $currency === 'JPY' ? 'selected' : '' }}>JPY &middot; &yen; (Japan)</option>
                        <option value="AUD" {{ $currency === 'AUD' ? 'selected' : '' }}>AUD &middot; A$ (Australia)</option>
                    </select>
                </form>

                <!-- Node Filter Dropdown -->
                <select id="node-filter" class="fn-control-select" style="width: 170px;">
                    <option value="">All Nodes</option>
                    @foreach($nodes as $node)
                        <option value="{{ strtolower($node->name) }}">Node: {{ $node->name }}</option>
                    @endforeach
                </select>

                <!-- Search Input -->
                <div class="fn-search-wrapper">
                    <i class="fa fa-search fn-search-icon"></i>
                    <input type="text" id="finance-search" class="fn-search-input" placeholder="Filter server, owner, UUID...">
                </div>
            </div>
        </div>

        <div class="table-responsive" style="margin: 0; border: none;">
            <table class="fn-table" id="finance-table">
                <thead>
                    <tr>
                        <th style="width: 27%;">Server &amp; Owner</th>
                        <th style="width: 14%;">Node</th>
                        <th style="width: 17%;">Monthly Rate</th>
                        <th style="width: 17%;">Due Date</th>
                        <th style="width: 13%;">Payment Status</th>
                        <th style="width: 12%; text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($servers as $server)
                        @php
                            $fin = $server->finance;
                            $status = $server->computed_status;
                            $price = $server->computed_effective_price;
                            $dueDate = $server->computed_due_date;
                            $displayDueDate = $dueDate ? \Carbon\Carbon::parse($dueDate)->format('d M Y') : '-';
                            $formattedPrice = \Pterodactyl\Http\Controllers\Admin\FinancialController::formatMoney((float)$price, $currency);
                        @endphp
                        <tr data-node="{{ strtolower($server->node->name) }}" data-search="{{ strtolower($server->name . ' ' . $server->user->username . ' ' . $server->user->email . ' ' . $server->node->name . ' ' . $server->uuidShort) }}">
                            <td>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
                                    <a href="{{ route('admin.servers.view', $server->id) }}" style="font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px; color: var(--bn-mint); text-decoration: none;">
                                        {{ $server->name }}
                                    </a>
                                    @if($server->suspended)
                                        <span class="fn-badge fn-badge-overdue" style="font-size: 9.5px; padding: 2px 6px;">SUSPENDED</span>
                                    @endif
                                    @if($server->is_split_server)
                                        <span class="fn-badge fn-badge-split" style="font-size: 9.5px; padding: 2px 6px;"><i class="fa fa-sitemap"></i> SPLIT</span>
                                    @endif
                                </div>
                                <div style="font-size: 11.5px; color: var(--bn-taupe); margin-bottom: 2px;">
                                    <i class="fa fa-user-circle-o" style="margin-right: 4px;"></i> {{ $server->user->username }} <span style="opacity: 0.65;">({{ $server->user->email }})</span>
                                </div>
                                <div style="font-size: 11px; color: #7a6a60; font-family: 'JetBrains Mono', monospace;">
                                    <span>Plan: {{ $server->computed_plan_name ?? 'Billing Plan' }}</span> &middot; <span>UUID: {{ $server->uuidShort }}</span>
                                </div>
                            </td>

                            <td>
                                <span class="fn-node-pill" data-node-name="{{ strtolower($server->node->name) }}" title="Filter by Node {{ $server->node->name }}">
                                    <i class="fa fa-server" style="color: var(--bn-khaki); font-size: 10px;"></i>
                                    {{ $server->node->name }}
                                </span>
                            </td>

                            <td>
                                @if($server->is_split_server)
                                    <div style="font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px; color: #c084fc;">
                                        <i class="fa fa-link"></i> Split Sub-Instance
                                    </div>
                                    <small style="font-size: 11px; color: var(--bn-taupe);">Billed to parent server</small>
                                @elseif($price == 0)
                                    <div style="font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 14px; color: var(--bn-slate);">
                                        {{ $formattedPrice }}
                                    </div>
                                    <small style="font-size: 11px; color: var(--bn-taupe);"><i class="fa fa-cube"></i> Free / Demo Tier</small>
                                @else
                                    <div style="font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 15px; color: var(--bn-emerald);">
                                        {{ $formattedPrice }}
                                    </div>
                                    <small style="font-size: 11px; color: var(--bn-taupe);"><i class="fa fa-tag"></i> {{ $server->computed_plan_name ?? 'Billing Plan' }}</small>
                                @endif
                            </td>

                            <td>
                                @if($server->is_split_server)
                                    <div style="font-size: 12.5px; color: #c084fc; font-weight: 600;">
                                        <i class="fa fa-link"></i> Follows Parent
                                    </div>
                                @else
                                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 600; color: var(--bn-mint);">
                                        <i class="fa fa-calendar-o" style="color: var(--bn-khaki); margin-right: 4px; font-size: 12px;"></i>
                                        {{ $displayDueDate }}
                                    </div>
                                    @if($server->expires_at)
                                        <small style="font-size: 11px; color: var(--bn-taupe);">
                                            {{ $server->expires_at->diffForHumans() }}
                                        </small>
                                    @endif
                                @endif
                            </td>

                            <td>
                                @if($status === 'paid')
                                    <span class="fn-badge fn-badge-paid">
                                        <i class="fa fa-check"></i> PAID
                                    </span>
                                @elseif($status === 'unpaid')
                                    <span class="fn-badge fn-badge-unpaid">
                                        <i class="fa fa-clock-o"></i> UNPAID
                                    </span>
                                @elseif($status === 'overdue')
                                    <span class="fn-badge fn-badge-overdue">
                                        <i class="fa fa-exclamation-triangle"></i> OVERDUE
                                    </span>
                                @elseif($status === 'split')
                                    <span class="fn-badge fn-badge-split">
                                        <i class="fa fa-sitemap"></i> SPLIT CHILD
                                    </span>
                                @else
                                    <span class="fn-badge fn-badge-free">
                                        <i class="fa fa-cube"></i> FREE / DEMO
                                    </span>
                                @endif
                            </td>

                            <td style="text-align: right;">
                                <div style="display: inline-flex; align-items: center; justify-content: flex-end; gap: 6px;">
                                    @if($status !== 'paid' && !$server->is_split_server)
                                        <form action="{{ route('admin.finance.mark_paid', $server->id) }}" method="POST" style="margin: 0; display: inline;">
                                            @csrf
                                            <button type="submit" class="fn-btn-action fn-btn-paid" title="Mark as Paid & Extend +1 Month" onclick="return confirm('Mark server {{ $server->name }} as paid and extend lease by +1 month?')">
                                                <i class="fa fa-check"></i> Paid
                                            </button>
                                        </form>
                                    @endif

                                    @if($server->suspended)
                                        <form action="{{ route('admin.finance.unsuspend', $server->id) }}" method="POST" style="margin: 0; display: inline;">
                                            @csrf
                                            <button type="submit" class="fn-btn-action fn-btn-unsuspend" title="Unsuspend Server">
                                                <i class="fa fa-play"></i> Unsuspend
                                            </button>
                                        </form>
                                    @else
                                        <form action="{{ route('admin.finance.suspend', $server->id) }}" method="POST" style="margin: 0; display: inline;">
                                            @csrf
                                            <button type="submit" class="fn-btn-action fn-btn-suspend" title="Suspend Server" onclick="return confirm('Are you sure you want to suspend server {{ $server->name }}?')">
                                                <i class="fa fa-pause"></i> Suspend
                                            </button>
                                        </form>
                                    @endif

                                    <a href="{{ route('admin.servers.view.details', $server->id) }}" class="fn-btn-action fn-btn-detail" title="Server Details">
                                        <i class="fa fa-cog"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal Custom MRR -->
    <div class="modal fade" id="customMrrModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content" style="background: #1c1917; border: 1px solid rgba(191, 168, 158, 0.25); border-radius: 12px; color: #EBF5EE;">
                <form action="{{ route('admin.finance.custom_mrr') }}" method="POST">
                    @csrf
                    <div class="modal-header" style="border-bottom: 1px solid rgba(191, 168, 158, 0.15); padding: 14px 18px;">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: #8B786D; opacity: 1;">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;">
                            <i class="fa fa-pencil" style="color: #BFA89E;"></i> Custom MRR Configuration
                        </h4>
                    </div>
                    <div class="modal-body" style="padding: 16px 18px;">
                        <p style="font-size: 12px; color: #8B786D; margin-bottom: 12px;">
                            Set a custom Monthly Recurring Revenue target. Leave empty to automatically calculate from active paid servers.
                        </p>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #BFA89E;">Target MRR ({{ $currency }}):</label>
                            <input type="text" name="custom_mrr" class="fn-search-input" style="width: 100%;" placeholder="e.g. 2500000" value="{{ $isCustomMrr ? preg_replace('/[^0-9]/', '', $totalPaidRevenue) : '' }}">
                        </div>
                    </div>
                    <div class="modal-footer" style="border-top: 1px solid rgba(191, 168, 158, 0.15); padding: 12px 18px; display: flex; justify-content: flex-end; gap: 8px;">
                        <button type="button" class="fn-btn-action fn-btn-detail" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="fn-btn-action fn-btn-paid" style="padding: 6px 14px;">Save MRR</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        $(document).ready(function() {
            // Live Search Filter & Node Dropdown Filter
            function filterTable() {
                var searchValue = ($('#finance-search').val() || '').toLowerCase();
                var nodeValue = ($('#node-filter').val() || '').toLowerCase();

                $('#finance-table tbody tr').each(function() {
                    var searchData = ($(this).attr('data-search') || '').toLowerCase();
                    var nodeData = ($(this).attr('data-node') || '').toLowerCase();

                    var textMatch = !searchValue || searchData.indexOf(searchValue) > -1;
                    var nodeMatch = !nodeValue || nodeData === nodeValue;

                    $(this).toggle(textMatch && nodeMatch);
                });
            }

            $('#finance-search').on('keyup', filterTable);
            $('#node-filter').on('change', filterTable);

            // Interactive Node badge click filter
            $('.fn-node-pill').on('click', function(e) {
                e.stopPropagation();
                var nodeName = $(this).attr('data-node-name');
                $('#node-filter').val(nodeName).trigger('change');
            });

            // Toggle 7-Days Billing Rules reference
            $('#fn-rules-toggle').on('click', function() {
                var body = $('#fn-rules-body');
                var icon = $('#fn-rules-icon');
                var text = $('#fn-rules-toggle-text');
                var header = $(this);

                if (body.is(':visible')) {
                    body.slideUp(180);
                    header.removeClass('open');
                    icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    text.text('Show Guide');
                } else {
                    body.slideDown(180);
                    header.addClass('open');
                    icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    text.text('Hide Guide');
                }
            });
        });
    </script>
@endsection
