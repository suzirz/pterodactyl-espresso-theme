<?php

namespace Pterodactyl\Http\Controllers\Admin\Settings;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Illuminate\Http\Request;

class HubLinksController extends Controller
{
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    public function index(): View
    {
        return view('admin.settings.links', [
            // Branding & Footer
            'brand_name' => $this->settings->get('settings::bytenodes:ui:brand_name', 'ByteNodes'),
            'footer_credit_text' => $this->settings->get('settings::bytenodes:ui:footer_credit_text', 'Powered By ByteNodes.id'),
            'footer_credit_url' => $this->settings->get('settings::bytenodes:ui:footer_credit_url', 'https://bytenodes.id'),
            'logo_url' => $this->settings->get('settings::bytenodes:ui:logo_url', ''),
            'favicon_url' => $this->settings->get('settings::bytenodes:ui:favicon_url', ''),

            // Colors & Accents
            'accent_color' => $this->settings->get('settings::bytenodes:ui:accent_color', '#BFA89E'),
            'custom_css' => $this->settings->get('settings::bytenodes:ui:custom_css', ''),

            // Quick Hub & External Links
            'billing_enabled' => (bool) $this->settings->get('settings::bytenodes:hub:billing_enabled', true),
            'billing_url' => $this->settings->get('settings::bytenodes:hub:billing_url', 'https://billing.bytenodes.id'),
            'discord_enabled' => (bool) $this->settings->get('settings::bytenodes:hub:discord_enabled', true),
            'discord_url' => $this->settings->get('settings::bytenodes:hub:discord_url', 'https://dsc.gg/bytenodes'),
            'status_enabled' => (bool) $this->settings->get('settings::bytenodes:hub:status_enabled', true),
            'status_url' => $this->settings->get('settings::bytenodes:hub:status_url', 'https://status.bytenodes.id'),
            'support_enabled' => (bool) $this->settings->get('settings::bytenodes:hub:support_enabled', true),
            'support_url' => $this->settings->get('settings::bytenodes:hub:support_url', 'https://dsc.gg/bytenodes'),
            
            // Custom External Link
            'custom_link_enabled' => (bool) $this->settings->get('settings::bytenodes:hub:custom_link_enabled', false),
            'custom_link_title' => $this->settings->get('settings::bytenodes:hub:custom_link_title', 'Website'),
            'custom_link_url' => $this->settings->get('settings::bytenodes:hub:custom_link_url', 'https://bytenodes.id'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        // 1. Branding & Footer
        $this->settings->set('settings::bytenodes:ui:brand_name', $request->input('brand_name', 'ByteNodes'));
        $this->settings->set('settings::bytenodes:ui:footer_credit_text', $request->input('footer_credit_text', 'Powered By ByteNodes.id'));
        $this->settings->set('settings::bytenodes:ui:footer_credit_url', $request->input('footer_credit_url', 'https://bytenodes.id'));
        $this->settings->set('settings::bytenodes:ui:logo_url', $request->input('logo_url', ''));
        $this->settings->set('settings::bytenodes:ui:favicon_url', $request->input('favicon_url', ''));

        // 2. Color & Accent
        $this->settings->set('settings::bytenodes:ui:accent_color', $request->input('accent_color', '#BFA89E'));
        $this->settings->set('settings::bytenodes:ui:custom_css', $request->input('custom_css', ''));

        // 3. Quick Hub & Links
        $this->settings->set('settings::bytenodes:hub:billing_enabled', $request->has('billing_enabled'));
        $this->settings->set('settings::bytenodes:hub:billing_url', $request->input('billing_url', ''));

        $this->settings->set('settings::bytenodes:hub:discord_enabled', $request->has('discord_enabled'));
        $this->settings->set('settings::bytenodes:hub:discord_url', $request->input('discord_url', ''));

        $this->settings->set('settings::bytenodes:hub:status_enabled', $request->has('status_enabled'));
        $this->settings->set('settings::bytenodes:hub:status_url', $request->input('status_url', ''));

        $this->settings->set('settings::bytenodes:hub:support_enabled', $request->has('support_enabled'));
        $this->settings->set('settings::bytenodes:hub:support_url', $request->input('support_url', ''));

        $this->settings->set('settings::bytenodes:hub:custom_link_enabled', $request->has('custom_link_enabled'));
        $this->settings->set('settings::bytenodes:hub:custom_link_title', $request->input('custom_link_title', ''));
        $this->settings->set('settings::bytenodes:hub:custom_link_url', $request->input('custom_link_url', ''));

        $this->alert->success('ByteNodes UI & Links settings have been successfully updated.')->flash();

        return redirect()->route('admin.settings.links');
    }
}
