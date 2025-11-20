<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_Xendit_Invoice {

    public static function create_invoice($tenant_id, $plan_id) {
        global $wpdb;

        $plans = $wpdb->prefix . "saas_plans";
        $plan = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $plans WHERE id=%d", $plan_id
        ));

        if (!$plan) return false;

        $amount = $plan->price_month;

        $sub_table = $wpdb->prefix . "saas_subscriptions";
        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $sub_table WHERE tenant_id=%d", $tenant_id
        ));

        $invoice_payload = [
            "external_id" => "tenant_" . $tenant_id . "_upgrade_" . time(),
            "payer_email" => "billing@tenant-" . $tenant_id . ".com",
            "description" => "Upgrade Plan to: " . $plan->name,
            "amount" => intval($amount),
            "currency" => "IDR",
            "success_redirect_url" => site_url("/billing-success?tenant={$tenant_id}"),
            "failure_redirect_url" => site_url("/billing-failed?tenant={$tenant_id}")
        ];

        $resp = wp_remote_post("https://api.xendit.co/v2/invoices", [
            "headers" => [
                "Authorization" => "Basic " . base64_encode(XENDIT_SECRET_KEY . ":")
            ],
            "body" => $invoice_payload
        ]);

        if (is_wp_error($resp)) {
            return false;
        }

        $json = json_decode(wp_remote_retrieve_body($resp), true);

        if (!isset($json["id"])) return false;

        // update subscription
        $wpdb->update($sub_table, [
            "xendit_invoice_id" => $json["id"]
        ], ["id" => $sub->id]);

        return $json["invoice_url"];
    }
}
