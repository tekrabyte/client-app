<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST_Auth {

    public function __construct() {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes() {
        register_rest_route('tekra-saas/v1', '/auth/login', [
            'methods' => 'POST',
            'callback' => [$this, 'login'],
            'permission_callback' => '__return_true'
        ]);
    }

    public function login($req) {
        $email = sanitize_email($req['email']);
        $pass  = $req['password'];

        // Autentikasi User WordPress
        $user = wp_authenticate($email, $pass);

        if (is_wp_error($user)) {
            return new WP_Error('invalid_credentials', 'Email atau password salah.', ['status'=>403]);
        }

        // Ambil Data Tenant User Ini
        $tenant = TEKRAERPOS_SaaS_Tenant::get_by_owner($user->ID);

        if (!$tenant) {
             // Opsional: Handle jika user terdaftar tapi tidak punya tenant (misal staff)
             // Cek user meta jika dia staff
             $linked_tenant_id = get_user_meta($user->ID, 'tekra_tenant_id', true);
             if ($linked_tenant_id) {
                 $tenant = TEKRAERPOS_SaaS_Tenant::get($linked_tenant_id);
             }
        }

        if (!$tenant) {
            return new WP_Error('no_tenant', 'User tidak terhubung dengan Tenant manapun.', ['status'=>403]);
        }

        // Cek Status Tenant
        if ($tenant->status === 'suspended') {
            return new WP_Error('suspended', 'Akun tenant ditangguhkan. Silakan hubungi admin.', [
                'status' => 403,
                'reason' => 'suspended',
                'renew_url' => site_url("/billing?tenant={$tenant->id}") 
            ]);
        }

        // Generate Token Sederhana (Untuk keperluan demo/MVP)
        // Di production sebaiknya pakai JWT Auth Plugin
        $token = base64_encode($user->ID . ':' . wp_generate_password(20));

        return [
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'           => $user->ID,
                'display_name' => $user->display_name,
                'email'        => $user->user_email,
                'role'         => get_user_meta($user->ID, 'tekra_role', true) ?: 'owner',
                'tenant'       => $tenant
            ]
        ];
    }
}

new TEKRAERPOS_SaaS_REST_Auth();