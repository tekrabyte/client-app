<?php

class TEKRAERPOS_SaaS_REST_Subscription {

    public static function register() {
        register_rest_route("tekra-saas/v1", "/billing/create-invoice", [
            "methods" => "POST",
            "callback" => [__CLASS__, "create_invoice"],
        ]);

        register_rest_route("tekra-saas/v1", "/billing/status", [
            "methods" => "GET",
            "callback" => [__CLASS__, "status"],
        ]);
    }

    public static function create_invoice($r) {
        $tenant_id = get_current_user_id() ? get_user_meta(get_current_user_id(), "tenant_id", true) : 0;
        if (!$tenant_id) return wp_send_json_error("Tenant not found");

        $plan = $r["plan_id"];

        $x = new \Xendit\Invoice();
        $inv = $x->create([
            "external_id" => "tenant_{$tenant_id}_" . time(),
            "payer_email" => wp_get_current_user()->user_email,
            "description" => "TekraERPOS Subscription",
            "amount" => intval($r["amount"]),
            "success_redirect_url" => site_url("/dashboard/billing?success=1"),
            "failure_redirect_url" => site_url("/dashboard/billing?failed=1")
        ]);

        global $wpdb;
        $wpdb->insert($wpdb->prefix . "saas_subscriptions", [
            "tenant_id" => $tenant_id,
            "plan_id" => $plan,
            "status" => "pending",
            "xendit_invoice_id" => $inv["id"],
            "created_at" => current_time("mysql"),
        ]);

        return wp_send_json_success([
            "pay_url" => $inv["invoice_url"]
        ]);
    }

    public static function status() {
        $tenant_id = get_current_user_id() ? get_user_meta(get_current_user_id(), "tenant_id", true) : 0;

        global $wpdb;
        $s = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}saas_subscriptions WHERE tenant_id=$tenant_id ORDER BY id DESC");

        return wp_send_json_success(["subscription" => $s]);
    }
}
