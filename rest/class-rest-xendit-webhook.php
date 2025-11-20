<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_Xendit_Webhook {

    public static function register() {
        add_action('rest_api_init', function() {
            register_rest_route('tekraerpos/v1', '/xendit/webhook', [
                'methods' => 'POST',
                'callback' => [__CLASS__, 'handle'],
                'permission_callback' => '__return_true'
            ]);
        });
    }

    public static function handle(WP_REST_Request $req) {
        global $wpdb;

        $payload = $req->get_json_params();
        if (!$payload || !isset($payload["event"])) {
            return new WP_REST_Response(["error"=>"invalid_payload"], 400);
        }

        $event = $payload['event'];
        $invoice_id = $payload['data']['id'];

        $sub_table = $wpdb->prefix . 'saas_subscriptions';
        $tenant_table = $wpdb->prefix . 'saas_tenants';

        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $sub_table WHERE xendit_invoice_id=%s",
            $invoice_id
        ));

        if (!$sub)
            return new WP_REST_Response(["status"=>"ignored"], 200);

        $tenant_id = intval($sub->tenant_id);

        /**
         * EVENT HANDLER
         */

        // 1️⃣ INVOICE PAID → ACTIVATE PLAN
        if ($event === "invoice.paid") {

            $expires = date("Y-m-d H:i:s", strtotime("+30 days"));

            $wpdb->update($sub_table, [
                "status" => "active",
                "expires_at" => $expires
            ], ["id" => $sub->id]);

            $wpdb->update($tenant_table, [
                "status" => "active"
            ], ["id" => $tenant_id]);

            return new WP_REST_Response(["status"=>"activated"], 200);
        }

        // 2️⃣ INVOICE EXPIRED → SUSPEND TENANT
        if ($event === "invoice.expired") {

            // update subscription
            $wpdb->update($sub_table, [
                "status" => "expired"
            ], ["id" => $sub->id]);

            // suspend tenant
            $wpdb->update($tenant_table, [
                "status" => "suspended"
            ], ["id" => $tenant_id]);

            return new WP_REST_Response(["status"=>"tenant_suspended"], 200);
        }

        return new WP_REST_Response(["status"=>"ignored"], 200);
    }
}
if ($event === "invoice.expired") {

    // downgrade
    $downgrade = TEKRAERPOS_SaaS_Tenant::downgrade_plan($tenant_id);

    // mark subscription expired
    $wpdb->update($sub_table, [
        "status" => "expired"
    ], ["id" => $sub->id]);

    return new WP_REST_Response([
        "status" => "downgraded",
        "new_plan" => $downgrade
    ], 200);
}

TEKRAERPOS_Xendit_Webhook::register();
