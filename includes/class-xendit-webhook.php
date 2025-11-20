<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Xendit_Webhook {

    public function __construct() {
        add_action('rest_api_init', function() {
            register_rest_route('tekraerpos/v1', '/billing/xendit-webhook', [
                'methods' => 'POST',
                'callback' => [$this, 'webhook']
            ]);
        });
    }

    public function webhook($req) {
        global $wpdb;

        $body = $req->get_json_params();

        if ($body['status'] === 'PAID') {

            $external = $body['external_id'];
            preg_match("/INV\-([0-9]+)\-/", $external, $m);
            $tenant_id = intval($m[1]);

            // Update subscription
            $wpdb->update(
                "{$wpdb->prefix}saas_subscriptions",
                [
                    "status" => "active",
                    "expires_at" => date("Y-m-d H:i:s", strtotime("+30 days"))
                ],
                ["tenant_id" => $tenant_id]
            );

            // Save invoice
            $wpdb->insert(
                "{$wpdb->prefix}saas_invoices",
                [
                    "tenant_id" => $tenant_id,
                    "invoice_id" => $body['id'],
                    "amount" => $body['amount'],
                    "status" => "paid"
                ]
            );
        }

        return ["success" => true];
    }
}
new TEKRAERPOS_SaaS_Xendit_Webhook();
