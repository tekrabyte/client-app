<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST_Billing {

    public function __construct() {
        add_action('rest_api_init', function() {
            register_rest_route('tekra-saas/v1', '/billing/info', [
                'methods' => 'GET',
                'callback' => [$this, 'billing_info'],
                'permission_callback' => [$this, 'check_auth']
            ]);
        });
    }

    public function check_auth() {
        return is_user_logged_in();
    }

    public function billing_info($req) {
        global $wpdb;
        
        // 1. Ambil Tenant dari User Login (OTOMATIS)
        $user_id = get_current_user_id();
        $tenant = TEKRAERPOS_SaaS_Tenant::get_by_owner($user_id);

        if (!$tenant) {
            // Fallback: Cek apakah user adalah staff
            $linked_tenant = get_user_meta($user_id, 'tekra_tenant_id', true);
            if ($linked_tenant) {
                $tenant = TEKRAERPOS_SaaS_Tenant::get($linked_tenant);
            }
        }

        if (!$tenant) {
            return new WP_Error("no_tenant", "Tenant tidak ditemukan untuk user ini.", ["status" => 404]);
        }

        // 2. Ambil Subscription Terakhir
        $sub_table = $wpdb->prefix . 'saas_subscriptions';
        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $sub_table WHERE tenant_id=%d ORDER BY id DESC LIMIT 1",
            $tenant->id
        ));

        // Jika tidak ada record subscription, buat dummy trial (untuk safety)
        if (!$sub) {
            $sub = (object) [
                'status' => 'trial',
                'plan_id' => $tenant->plan_id,
                'expires_at' => date('Y-m-d H:i:s', strtotime('+14 days', strtotime($tenant->created_at)))
            ];
        }

        // 3. Ambil Detail Plan
        // Prioritas: Plan dari Subscription > Plan dari Tenant
        $plan_id = $sub->plan_id ? $sub->plan_id : $tenant->plan_id;
        
        $plan_table = $wpdb->prefix . 'saas_plans';
        $plan = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $plan_table WHERE id=%d",
            $plan_id
        ));

        // 4. Ambil History Invoice
        $inv_table = $wpdb->prefix . 'saas_invoices';
        $invoices = [];
        
        // Cek tabel invoice ada dulu
        if($wpdb->get_var("SHOW TABLES LIKE '$inv_table'") == $inv_table) {
            $invoices = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $inv_table WHERE tenant_id=%d ORDER BY id DESC LIMIT 20",
                $tenant->id
            ));
        }

        return [
            "success" => true,
            "tenant" => $tenant,
            "subscription" => $sub,
            "plan" => $plan, // Object Plan lengkap (name, price, features)
            "invoices" => $invoices
        ];
    }
}

new TEKRAERPOS_SaaS_REST_Billing();