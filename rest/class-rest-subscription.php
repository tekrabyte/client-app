<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST_Subscription {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        // Endpoint: Buat Invoice Upgrade/Perpanjang
        register_rest_route("tekra-saas/v1", "/billing/create-invoice", [
            "methods" => "POST",
            "callback" => [$this, "create_invoice"],
            "permission_callback" => [$this, "check_permission"]
        ]);

        // Endpoint: Cek Status Subscription
        register_rest_route("tekra-saas/v1", "/billing/info", [
            "methods" => "GET",
            "callback" => [$this, "billing_info"],
            "permission_callback" => [$this, "check_permission"]
        ]);
    }

    public function check_permission() {
        return is_user_logged_in();
    }

    public function create_invoice($req) {
        $user_id = get_current_user_id();
        $tenant = TEKRAERPOS_SaaS_Tenant::get_by_owner($user_id);
        
        if (!$tenant) return new WP_Error("no_tenant", "Tenant not found", ["status" => 404]);

        $plan_id = intval($req["plan_id"]);

        // Pastikan modul invoice siap
        if (!class_exists('TEKRAERPOS_Xendit_Invoice')) {
            return new WP_Error("system_error", "Modul pembayaran belum dimuat.", ["status" => 500]);
        }

        // --- GUNAKAN HELPER CLASS YANG SUDAH KITA BUAT ---
        $invoice_url = TEKRAERPOS_Xendit_Invoice::create_invoice($tenant->id, $plan_id);

        if (!$invoice_url) {
            return new WP_Error("xendit_error", "Gagal membuat invoice. Cek log server.", ["status" => 500]);
        }

        return ["success" => true, "pay_url" => $invoice_url];
    }

    public function billing_info($req) {
        global $wpdb;
        
        $user_id = get_current_user_id();
        $tenant = TEKRAERPOS_SaaS_Tenant::get_by_owner($user_id);
        
        if (!$tenant) return new WP_Error("no_tenant", "Tenant not found", ["status" => 404]);

        // Ambil Data Langganan Aktif
        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}saas_subscriptions WHERE tenant_id=%d ORDER BY id DESC LIMIT 1",
            $tenant->id
        ));

        // Ambil Detail Plan
        $plan_id = $sub ? $sub->plan_id : $tenant->plan_id;
        $plan = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}saas_plans WHERE id=%d",
            $plan_id
        ));

        // Ambil History Invoice (20 Terakhir)
        $invoices = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}saas_invoices WHERE tenant_id=%d ORDER BY id DESC LIMIT 20",
            $tenant->id
        ));

        return [
            "subscription" => $sub,
            "plan" => $plan,
            "invoices" => $invoices
        ];
    }
}

new TEKRAERPOS_SaaS_REST_Subscription();