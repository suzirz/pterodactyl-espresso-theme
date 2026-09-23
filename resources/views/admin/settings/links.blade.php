@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'links'])

@section('title')
    ByteNodes UI Editor
@endsection

@section('content-header')
    <h1>ByteNodes UI Editor<small>Customize panel branding, footer credits, color accents, Quick Hub cards, and custom CSS.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.settings') }}">Settings</a></li>
        <li class="active">ByteNodes UI Editor</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <form action="{{ route('admin.settings.links') }}" method="POST" id="bytenodesUiEditorForm">
                {!! csrf_field() !!}
                <input type="hidden" name="_method" value="PATCH" />

                <!-- TAB NAVIGATION -->
                <div class="nav-tabs-custom" style="background: transparent; box-shadow: none; margin-bottom: 20px;">
                    <ul class="nav nav-tabs" style="border-bottom: 1px solid rgba(191, 168, 158, 0.15);">
                        <li class="active">
                            <a href="#tab_branding" data-toggle="tab" style="font-weight: 600; font-size: 13.5px;">
                                <i class="fa fa-id-card text-khaki" style="margin-right: 6px;"></i> Branding &amp; Footer
                            </a>
                        </li>
                        <li>
                            <a href="#tab_colors" data-toggle="tab" style="font-weight: 600; font-size: 13.5px;">
                                <i class="fa fa-paint-brush text-khaki" style="margin-right: 6px;"></i> Colors &amp; Accents
                            </a>
                        </li>
                        <li>
                            <a href="#tab_links" data-toggle="tab" style="font-weight: 600; font-size: 13.5px;">
                                <i class="fa fa-link text-khaki" style="margin-right: 6px;"></i> Quick Hub &amp; Links
                            </a>
                        </li>
                        <li>
                            <a href="#tab_custom_css" data-toggle="tab" style="font-weight: 600; font-size: 13.5px;">
                                <i class="fa fa-code text-khaki" style="margin-right: 6px;"></i> Custom CSS
                            </a>
                        </li>
                    </ul>

                    <div class="tab-content" style="background: transparent; padding: 20px 0 0 0;">
                        <!-- TAB 1: BRANDING & FOOTER -->
                        <div class="tab-pane active" id="tab_branding">
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                    <h3 class="box-title"><i class="fa fa-shield text-khaki"></i> Brand Identity &amp; Global Footer Credit</h3>
                                </div>
                                <div class="box-body">
                                    <p class="text-muted" style="margin-bottom: 24px;">
                                        Configure panel naming and global footer credits across client dashboard sidebars, server management, and the admin panel.
                                    </p>

                                    <div class="row">
                                        <div class="col-md-6 form-group">
                                            <label class="control-label">Brand / Panel Name</label>
                                            <input type="text" class="form-control" name="brand_name" value="{{ $brand_name }}" placeholder="ByteNodes" />
                                            <p class="text-muted">Displayed in navigation headers and document titles.</p>
                                        </div>

                                        <div class="col-md-6 form-group">
                                            <label class="control-label">Custom Logo URL (Optional)</label>
                                            <input type="url" class="form-control" name="logo_url" value="{{ $logo_url }}" placeholder="https://your-domain.com/logo.svg" />
                                            <p class="text-muted">Leave empty to use the default embedded SVG logo.</p>
                                        </div>
                                    </div>

                                    <hr style="border-color: rgba(191, 168, 158, 0.12); margin: 15px 0 25px 0;">

                                    <div class="row">
                                        <div class="col-md-6 form-group">
                                            <label class="control-label">
                                                <i class="fa fa-copyright text-khaki" style="margin-right: 4px;"></i> Footer Credit Text
                                            </label>
                                            <input type="text" class="form-control" name="footer_credit_text" id="footer_credit_text" value="{{ $footer_credit_text }}" placeholder="Powered By ByteNodes.id" required />
                                            <p class="text-muted">Credit label shown at the bottom of the client sidebar, server sidebar, and admin footer.</p>
                                        </div>

                                        <div class="col-md-6 form-group">
                                            <label class="control-label">
                                                <i class="fa fa-external-link text-khaki" style="margin-right: 4px;"></i> Footer Credit Link URL
                                            </label>
                                            <input type="url" class="form-control" name="footer_credit_url" id="footer_credit_url" value="{{ $footer_credit_url }}" placeholder="https://bytenodes.id" required />
                                            <p class="text-muted">Target URL when users click on the footer credit link.</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <div style="background: rgba(191, 168, 158, 0.06); border: 1px dashed rgba(191, 168, 158, 0.25); border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                                                <div>
                                                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--bn-taupe); font-weight: 700; display: block; margin-bottom: 2px;">Live Credit Preview</span>
                                                    <span id="creditPreviewSpan" style="font-size: 13px; color: #8B786D;">
                                                        <span id="creditPreviewText">{{ $footer_credit_text }}</span>
                                                    </span>
                                                </div>
                                                <span class="label label-success"><i class="fa fa-check"></i> Active Everywhere</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 2: COLORS & ACCENTS -->
                        <div class="tab-pane" id="tab_colors">
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                    <h3 class="box-title"><i class="fa fa-eyedropper text-khaki"></i> Color Palette &amp; Master Accent</h3>
                                </div>
                                <div class="box-body">
                                    <p class="text-muted" style="margin-bottom: 24px;">
                                        Set your primary brand accent color. This accent applies to buttons, active navigation states, badges, and focus rings.
                                    </p>

                                    <div class="row">
                                        <div class="col-md-6 form-group">
                                            <label class="control-label">Primary Accent Color</label>
                                            <div class="input-group">
                                                <input type="color" id="accentColorPicker" value="{{ $accent_color }}" style="width: 44px; height: 40px; padding: 0; border: none; background: transparent; cursor: pointer; vertical-align: middle; border-radius: 8px; float: left; margin-right: 10px;">
                                                <input type="text" class="form-control" name="accent_color" id="accentColorInput" value="{{ $accent_color }}" style="font-family: 'JetBrains Mono', monospace; font-weight: 600; width: calc(100% - 54px);" />
                                            </div>
                                            <p class="text-muted" style="margin-top: 6px;">Click the swatch to open the color picker or enter a 6-digit hex code.</p>
                                        </div>

                                        <div class="col-md-6 form-group">
                                            <label class="control-label">Quick Palette Presets</label>
                                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
                                                <button type="button" class="btn btn-xs preset-btn" data-color="#BFA89E" style="background: #BFA89E; color: #141211; font-weight: 600; border-radius: 6px; padding: 6px 12px;">Warm Khaki</button>
                                                <button type="button" class="btn btn-xs preset-btn" data-color="#52b788" style="background: #52b788; color: #141211; font-weight: 600; border-radius: 6px; padding: 6px 12px;">Emerald</button>
                                                <button type="button" class="btn btn-xs preset-btn" data-color="#38bdf8" style="background: #38bdf8; color: #141211; font-weight: 600; border-radius: 6px; padding: 6px 12px;">Sky Blue</button>
                                                <button type="button" class="btn btn-xs preset-btn" data-color="#a855f7" style="background: #a855f7; color: #ffffff; font-weight: 600; border-radius: 6px; padding: 6px 12px;">Violet</button>
                                                <button type="button" class="btn btn-xs preset-btn" data-color="#f59e0b" style="background: #f59e0b; color: #141211; font-weight: 600; border-radius: 6px; padding: 6px 12px;">Amber</button>
                                                <button type="button" class="btn btn-xs preset-btn" data-color="#f43f5e" style="background: #f43f5e; color: #ffffff; font-weight: 600; border-radius: 6px; padding: 6px 12px;">Rose</button>
                                            </div>
                                            <p class="text-muted" style="margin-top: 8px;">Select a curated preset tuned for Warm Charcoal and Obsidian canvas.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 3: QUICK HUB & LINKS -->
                        <div class="tab-pane" id="tab_links">
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                    <h3 class="box-title"><i class="fa fa-compass text-khaki"></i> Quick Hub Action Cards &amp; Sidebar Navigation</h3>
                                </div>
                                <div class="box-body">
                                    <p class="text-muted" style="margin-bottom: 24px;">
                                        Manage links displayed on the client dashboard Quick Hub grid and sidebar navigation. Empty or disabled entries are hidden automatically.
                                    </p>

                                    <!-- Billing Row -->
                                    <div class="row" style="margin-bottom: 20px;">
                                        <div class="col-md-3">
                                            <label class="control-label" style="font-size: 14px;"><i class="fa fa-credit-card text-blue"></i> Billing System</label>
                                            <div>
                                                <input type="checkbox" name="billing_enabled" id="billing_enabled" value="1" @if($billing_enabled) checked @endif />
                                                <label for="billing_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link &amp; Hub Card</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                            <label class="control-label">Billing Portal URL</label>
                                            <input type="url" class="form-control" name="billing_url" value="{{ $billing_url }}" placeholder="https://billing.bytenodes.id" />
                                            <span class="help-block">Direct URL for user invoices, service renewals, and subscriptions.</span>
                                        </div>
                                    </div>
                                    <hr style="border-color: rgba(191, 168, 158, 0.12); margin-top: 10px; margin-bottom: 20px;">

                                    <!-- Discord Row -->
                                    <div class="row" style="margin-bottom: 20px;">
                                        <div class="col-md-3">
                                            <label class="control-label" style="font-size: 14px;"><i class="fa fa-comments text-purple"></i> Discord Community</label>
                                            <div>
                                                <input type="checkbox" name="discord_enabled" id="discord_enabled" value="1" @if($discord_enabled) checked @endif />
                                                <label for="discord_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link &amp; Hub Card</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                            <label class="control-label">Discord Community URL</label>
                                            <input type="url" class="form-control" name="discord_url" value="{{ $discord_url }}" placeholder="https://dsc.gg/bytenodes" />
                                            <span class="help-block">Invitation link for ByteNodes Discord community and announcements.</span>
                                        </div>
                                    </div>
                                    <hr style="border-color: rgba(191, 168, 158, 0.12); margin-top: 10px; margin-bottom: 20px;">

                                    <!-- Nodes Status Row -->
                                    <div class="row" style="margin-bottom: 20px;">
                                        <div class="col-md-3">
                                            <label class="control-label" style="font-size: 14px;"><i class="fa fa-server text-green"></i> Nodes Status</label>
                                            <div>
                                                <input type="checkbox" name="status_enabled" id="status_enabled" value="1" @if($status_enabled) checked @endif />
                                                <label for="status_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link &amp; Hub Card</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                            <label class="control-label">Infrastructure Status URL</label>
                                            <input type="url" class="form-control" name="status_url" value="{{ $status_url }}" placeholder="https://status.bytenodes.id" />
                                            <span class="help-block">Public status page link displaying node uptime and real-time latency.</span>
                                        </div>
                                    </div>
                                    <hr style="border-color: rgba(191, 168, 158, 0.12); margin-top: 10px; margin-bottom: 20px;">

                                    <!-- Priority Support Row -->
                                    <div class="row" style="margin-bottom: 20px;">
                                        <div class="col-md-3">
                                            <label class="control-label" style="font-size: 14px;"><i class="fa fa-life-ring text-yellow"></i> Priority Support</label>
                                            <div>
                                                <input type="checkbox" name="support_enabled" id="support_enabled" value="1" @if($support_enabled) checked @endif />
                                                <label for="support_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link &amp; Hub Card</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                            <label class="control-label">Support Portal / Ticket URL</label>
                                            <input type="url" class="form-control" name="support_url" value="{{ $support_url }}" placeholder="https://dsc.gg/bytenodes" />
                                            <span class="help-block">URL for dedicated VIP staff support or priority contact channel.</span>
                                        </div>
                                    </div>
                                    <hr style="border-color: rgba(191, 168, 158, 0.12); margin-top: 10px; margin-bottom: 20px;">

                                    <!-- Custom Link Row -->
                                    <div class="row" style="margin-bottom: 20px;">
                                        <div class="col-md-3">
                                            <label class="control-label" style="font-size: 14px;"><i class="fa fa-external-link text-khaki"></i> Custom Link</label>
                                            <div>
                                                <input type="checkbox" name="custom_link_enabled" id="custom_link_enabled" value="1" @if($custom_link_enabled) checked @endif />
                                                <label for="custom_link_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link &amp; Hub Card</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="control-label">Link Title</label>
                                            <input type="text" class="form-control" name="custom_link_title" value="{{ $custom_link_title }}" placeholder="Official Website" />
                                        </div>
                                        <div class="col-md-5">
                                            <label class="control-label">Link URL</label>
                                            <input type="url" class="form-control" name="custom_link_url" value="{{ $custom_link_url }}" placeholder="https://bytenodes.id" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <!-- TAB 4: CUSTOM CSS -->
                        <div class="tab-pane" id="tab_custom_css">
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                    <h3 class="box-title"><i class="fa fa-code text-khaki"></i> Custom CSS Injection</h3>
                                </div>
                                <div class="box-body">
                                    <p class="text-muted" style="margin-bottom: 16px;">
                                        Inject raw CSS directly into the <code>&lt;head&gt;</code> of all client and admin panel pages. Perfect for fine-tuning margins, fonts, or component styles.
                                    </p>
                                    <textarea name="custom_css" rows="12" class="form-control" style="font-family: 'JetBrains Mono', monospace; font-size: 12.5px; background: #141211 !important; color: #EBF5EE !important; border: 1px solid rgba(191, 168, 158, 0.22); border-radius: 8px; line-height: 1.6;" placeholder="/* Custom CSS Rules */&#10;:root {&#10;    /* Your custom rules */&#10;}">{{ $custom_css }}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="box-footer" style="background: var(--bn-bg-surface); border-top: 1px solid var(--bn-border-subtle); border-radius: 12px; padding: 16px 20px;">
                    <button type="submit" class="btn btn-primary pull-right" style="padding: 10px 24px; font-weight: 600; font-size: 14px;">
                        <i class="fa fa-save" style="margin-right: 6px;"></i> Save All Settings
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        $(function() {
            var $picker = $('#accentColorPicker');
            var $input = $('#accentColorInput');
            var $creditInput = $('#footer_credit_text');
            var $creditPreview = $('#creditPreviewText');

            $picker.on('input change', function() {
                $input.val($(this).val().toUpperCase());
            });

            $input.on('input', function() {
                var val = $(this).val();
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    $picker.val(val);
                }
            });

            $('.preset-btn').on('click', function() {
                var c = $(this).data('color');
                $picker.val(c);
                $input.val(c);
            });

            $creditInput.on('input', function() {
                $creditPreview.text($(this).val() || 'Powered By ByteNodes.id');
            });
        });
    </script>
@endsection
