<?php
if (!defined('ABSPATH')) exit;
$allowed = apply_filters("tekraerpos/check_feature", true, $tenant_id, "add_outlet");


class TEKRAERPOS_REST_Plan {

    public function __construct() {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes() {

        register_rest_route('tekra-saas/v1', '/plans', [
            'methods' => 'GET',
            'callback' => [$this, 'plans']
        ]);
    }

    public function plans() {
        global $wpdb;

        $table = $wpdb->prefix . 'saas_plans';
        $plans = $wpdb->get_results("SELECT * FROM {$table}", ARRAY_A);

        return ['success'=>true, 'plans'=>$plans];
    }
}

new TEKRAERPOS_REST_Plan();
