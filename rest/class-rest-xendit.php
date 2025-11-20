<?php

class TEKRAERPOS_SaaS_Xendit_Webhook {

    public static function register() {
        add_action("rest_api_init", function () {
            register_rest_route("tekra-saas/v1", "/xendit/webhook", [
                "methods" => "POST",
                "callback" => [__CLASS__, "handle"],
                "permission_callback" => "__return_true"
            ]);
        });
    }

    public static function handle($r) {
        $data = $r->get_json_params();

        if ($data["status"] === "PAID") {
            global $wpdb;

            $sub = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}saas_subscriptions WHERE xendit_invoice_id=%s",
                $data["id"]
            ));

            if ($sub) {
                $wpdb->update(
                    $wpdb->prefix . "saas_subscriptions",
                    [
                        "status" => "active",
                        "started_at" => current_time("mysql"),
                        "expires_at" => date("Y-m-d H:i:s", strtotime("+30 days"))
                    ],
                    ["id" => $sub->id]
                );

                $wpdb->update(
                    $wpdb->prefix . "saas_tenants",
                    ["status" => "active", "plan_id" => $sub->plan_id],
                    ["id" => $sub->tenant_id]
                );
            }
        }

        return wp_send_json_success();
    }
}
