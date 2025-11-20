<?php
if (!defined('ABSPATH')) exit;
$allowed = apply_filters("tekraerpos/check_feature", true, $tenant_id, "add_outlet");


class TEKRAERPOS_SaaS_REST_Billing {

    public function __construct() {
        add_action('rest_api_init', function() {
            register_rest_route('tekraerpos/v1', '/billing/info', [
                'methods' => 'GET',
                'callback' => [$this, 'billing_info']
            ]);
        });
    }

    public function billing_info($req) {
        global $wpdb;

        $tenant = intval($req->get_param('tenant'));
        $subs = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}saas_subscriptions WHERE tenant_id=$tenant");
        $plan = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}saas_plans WHERE id={$subs->plan_id}");

        $invoices = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}saas_invoices WHERE tenant_id=$tenant ORDER BY id DESC LIMIT 20");

        return [
            "subscription" => $subs,
            "plan" => $plan,
            "invoices" => $invoices
        ];
    }
}
new TEKRAERPOS_SaaS_REST_Billing();
