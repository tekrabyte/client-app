<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST {

    public function __construct() {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public static function get_instance() { return new self(); }

    public function routes() {

        // Endpoint: Get Subscription Plans
        register_rest_route('tekraerpos/v1', '/plans', [
            'methods'  => 'GET',
            'callback' => [$this, 'plans'],
            'permission_callback' => '__return_true'
        ]);

        // Endpoint: Tenant Signup
        register_rest_route('tekraerpos/v1', '/signup', [
            'methods'  => 'POST',
            'callback' => [$this, 'signup'],
            'permission_callback' => '__return_true'
        ]);
    }

    public function plans() {
        // Pastikan class Plans sudah dimuat
        if (!class_exists('TEKRAERPOS_SaaS_Plans')) {
            return new WP_Error('system_error', 'Plans manager not loaded', ['status'=>500]);
        }
        return TEKRAERPOS_SaaS_Plans::all();
    }

    public function signup($req) {
        global $wpdb;

        $email = sanitize_email($req['email']);
        $name  = sanitize_text_field($req['name']);
        $plan  = intval($req['plan_id']);

        if (email_exists($email)) {
            return new WP_Error('email_used', 'Email already exists', ['status'=>400]);
        }

        // Create WP User
        $user = wp_create_user($email, wp_generate_password(), $email);
        
        if (is_wp_error($user)) {
            return $user;
        }

        // Create Tenant & Schema
        // Pastikan class Provisioning sudah dimuat di loader
        $tenant_id = TEKRAERPOS_SaaS_Provisioning::create_tenant_full([
            'name'    => $name,
            'email'   => $email,
            'user_id' => $user,
            'plan_id' => $plan
        ]);

        return [
            'success'   => true,
            'tenant_id' => $tenant_id,
            'message'   => 'Tenant created successfully'
        ];
    }
}

// Inisialisasi Class
new TEKRAERPOS_SaaS_REST();