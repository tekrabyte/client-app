<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Xendit_Webhook {

    public function __construct() {
        add_action('rest_api_init', function() {
            register_rest_route('tekraerpos/v1', '/xendit/webhook', [
                'methods' => 'POST',
                'callback' => [$this, 'handle'],
                'permission_callback' => '__return_true'
            ]);
        });
    }

    public function handle(WP_REST_Request $req) {
        global $wpdb;

        $payload = $req->get_json_params();
        
        // Validasi Payload
        if (!$payload || !isset($payload["event"])) {
            // Cek apakah ini tes ping dari Xendit?
            return new WP_REST_Response(["status" => "listening"], 200);
        }

        $event = $payload['event'];
        // Struktur data Xendit bisa berbeda tergantung event, ambil ID invoice dengan aman
        $data_obj = $payload['data'] ?? $payload; 
        $invoice_id = $data_obj['id'] ?? '';

        if (empty($invoice_id)) {
            return new WP_REST_Response(["error" => "no_invoice_id"], 400);
        }

        $sub_table = $wpdb->prefix . 'saas_subscriptions';
        $tenant_table = $wpdb->prefix . 'saas_tenants';
        $inv_table = $wpdb->prefix . 'saas_invoices';

        // Cari Subscription berdasarkan Invoice ID
        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $sub_table WHERE xendit_invoice_id=%s",
            $invoice_id
        ));

        if (!$sub) {
            return new WP_REST_Response(["status" => "ignored_not_found"], 200);
        }

        $tenant_id = intval($sub->tenant_id);

        // --- LOGIKA UTAMA ---

        // 1. INVOICE SUKSES DIBAYAR
        if ($event === "invoice.paid") {
            $expires = date("Y-m-d H:i:s", strtotime("+30 days"));

            // Aktifkan Subscription
            $wpdb->update($sub_table, [
                "status" => "active",
                "expires_at" => $expires
            ], ["id" => $sub->id]);

            // Aktifkan Tenant & Update Plan sesuai Subscription
            $wpdb->update($tenant_table, [
                "status" => "active",
                "plan_id" => $sub->plan_id
            ], ["id" => $tenant_id]);

            // Catat di History Invoice
            $wpdb->insert($inv_table, [
                "tenant_id" => $tenant_id,
                "invoice_id" => $invoice_id,
                "amount" => $data_obj['amount'] ?? 0,
                "status" => "paid",
                "created_at" => current_time('mysql')
            ]);

            return new WP_REST_Response(["status" => "activated"], 200);
        }

        // 2. INVOICE KADALUARSA (EXPIRED)
        if ($event === "invoice.expired") {
            // Logic Downgrade Plan / Suspend
            $downgrade_result = TEKRAERPOS_SaaS_Tenant::downgrade_plan($tenant_id);

            // Update status subscription jadi expired
            $wpdb->update($sub_table, [
                "status" => "expired"
            ], ["id" => $sub->id]);

            return new WP_REST_Response([
                "status" => "processed_expired",
                "action" => $downgrade_result // 'suspended' atau slug plan baru
            ], 200);
        }

        return new WP_REST_Response(["status" => "ignored_event"], 200);
    }
}

new TEKRAERPOS_SaaS_Xendit_Webhook();