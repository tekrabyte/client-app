<?php
if (!defined('ABSPATH')) exit;
$allowed = apply_filters("tekraerpos/check_feature", true, $tenant_id, "add_outlet");


class TEKRAERPOS_REST_Auth {

    public function __construct() {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes() {
        register_rest_route('tekra-saas/v1', '/auth/login', [
            'methods' => 'POST',
            'callback' => [$this, 'login']
        ]);
    }

    public function login($req) {
        $email = sanitize_text_field($req['email']);
        $pass  = $req['password'];

        $user = wp_authenticate($email, $pass);

        if (is_wp_error($user)) {
            return new WP_Error('invalid', 'Email/password salah', ['status'=>403]);
        }

        return [
            'success'=>true,
            'user'=>[
                'id'=>$user->ID,
                'name'=>$user->display_name,
                'email'=>$user->user_email
            ]
        ];
    }
}

new TEKRAERPOS_REST_Auth();
