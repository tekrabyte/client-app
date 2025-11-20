<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST {

    public function __construct() {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public static function get_instance() { return new self(); }

    public function routes() {

        register_rest_route('tekraerpos/v1', '/plans', [
            'methods'=>'GET',
            'callback'=>[$this,'plans']
        ]);

        register_rest_route('tekraerpos/v1', '/signup', [
            'methods'=>'POST',
            'callback'=>[$this,'signup']
        ]);
    }

    public function plans() {
        return TEKRAERPOS_SaaS_Plans::all();
    }

    public function signup($req) {

        $email = sanitize_email($req['email']);
        $name  = sanitize_text_field($req['name']);
        $plan  = intval($req['plan_id']);

        if (email_exists($email))
            return new WP_Error('email_used','Email already exists');

        $user = wp_create_user($email, wp_generate_password(), $email);

        $tenant = TEKRAERPOS_SaaS_Provisioning::create_tenant_full([
            'name'=>$name,
            'email'=>$email,
            'user_id'=>$user,
            'plan_id'=>$plan
        ]);

        return [
            'success'=>true,
            'tenant_id'=>$tenant
        ];
    }
}
