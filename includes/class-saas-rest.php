<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST {

    public function __construct() {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes() {
        // Ganti namespace jadi 'tekra-saas/v1' agar seragam
        register_rest_route('tekra-saas/v1', '/plans', [
            'methods'  => 'GET',
            'callback' => [$this, 'plans'],
            'permission_callback' => '__return_true'
        ]);

        // HAPUS rute signup dari sini karena sudah ditangani oleh rest/class-rest-signup.php
    }

    public function plans() {
        if (!class_exists('TEKRAERPOS_SaaS_Plans')) {
            return new WP_Error('system_error', 'Plans manager not loaded', ['status'=>500]);
        }
        return TEKRAERPOS_SaaS_Plans::all();
    }
}

new TEKRAERPOS_SaaS_REST();