@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'links'])

@section('title')
    ByteNodes UI & Links
@endsection

@section('content-header')
    <h1>ByteNodes UI & Links<small>Configure Quick Hub action cards, custom external links, and dashboard navigation.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.settings') }}">Settings</a></li>
        <li class="active">ByteNodes UI & Links</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <form action="{{ route('admin.settings.links') }}" method="POST">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title"><i class="fa fa-sliders text-khaki"></i> ByteNodes UI & Quick Hub Configuration</h3>
                    </div>
                    <div class="box-body">
                        <p class="text-muted" style="margin-bottom: 25px;">
                            Enable or disable Quick Hub action cards and sidebar external links for client panels. Disabled or empty entries are automatically hidden from users.
                        </p>

                        <!-- Billing Row -->
                        <div class="row" style="margin-bottom: 20px;">
                            <div class="col-md-3">
                                <label class="control-label" style="font-size: 14px;"><i class="fa fa-credit-card text-blue"></i> Billing System</label>
                                <div>
                                    <input type="checkbox" name="billing_enabled" id="billing_enabled" value="1" @if($billing_enabled) checked @endif />
                                    <label for="billing_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link & Hub Card</label>
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
                                    <label for="discord_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link & Hub Card</label>
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
                                    <label for="status_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link & Hub Card</label>
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
                                    <label for="support_enabled" class="control-label" style="font-weight: normal; margin-left: 6px;">Show Link & Hub Card</label>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <label class="control-label">Support Portal / Ticket URL</label>
                                <input type="url" class="form-control" name="support_url" value="{{ $support_url }}" placeholder="https://dsc.gg/bytenodes" />
                                <span class="help-block">URL for dedicated VIP staff support or priority contact channel.</span>
                            </div>
                        </div>

                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <input type="hidden" name="_method" value="PATCH" />
                        <button type="submit" class="btn btn-primary pull-right"><i class="fa fa-save"></i> Save UI Configuration</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
