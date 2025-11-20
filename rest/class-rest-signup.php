<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_REST_Signup {

    public function __construct() {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes() {

        register_rest_route('tekra-saas/v1', '/signup', [
            'methods' => 'POST',
            'callback' => [$this, 'signup']
        ]);
    }

    public function signup($req) {
        global $wpdb;

        $name     = sanitize_text_field($req['store_name']);
        $slug     = sanitize_title($req['slug']);
        $email    = sanitize_email($req['email']);
        $password = $req['password'];

        if (empty($slug)) return new WP_Error('invalid', 'Slug invalid', ['status'=>400]);

        $tenant_table = $wpdb->prefix . 'saas_tenants';

        // cek slug
        $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$tenant_table} WHERE slug=%s", $slug));
        if ($exists) return new WP_Error('duplicate', 'Slug sudah dipakai', ['status'=>400]);

        // buat user
        if (email_exists($email)) {
            return new WP_Error('email_used', 'Email sudah digunakan', ['status'=>400]);
        }

        $uid = wp_create_user($email, $password, $email);
        wp_update_user(['ID'=>$uid, 'display_name'=>$name]);

        // buat tenant
        $wpdb->insert($tenant_table, [
            'name' => $name,
            'slug' => $slug,
            'owner_user_id' => $uid,
            'plan_id' => 1,
            'status' => 'trial',
            'created_at' => current_time('mysql')
        ]);

        $tenant_id = $wpdb->insert_id;

        // buat schema
        TEKRAERPOS_SaaS_Database::create_tenant_schema($tenant_id);

        // subscription 14 hari
        $sub_table = $wpdb->prefix . 'saas_subscriptions';

        $expires = date('Y-m-d H:i:s', strtotime('+14 days'));

        $wpdb->insert($sub_table, [
            'tenant_id' => $tenant_id,
            'plan_id'   => 1,
            'status'    => 'trial',
            'started_at'=> current_time('mysql'),
            'expires_at'=> $expires
        ]);

        return [
            'success'=>true,
            'tenant'=>[
                'id'=>$tenant_id,
                'slug'=>$slug
            ],
            'dashboard'=>"https://{$slug}.czone.tekrabyte.id"
        ];
    }
}
$tenant_id = TEKRAERPOS_SaaS_Provisioning::create_tenant_full([
                'name'    => $name,
                'email'   => $email,
                'user_id' => $user_id,
                'plan_id' => $plan_id
            ]);

            // Redirect URL sesuai permintaan: dashboard.tekrabyte.id/(nama tenant)
            // Karena baru daftar, kita arahkan ke halaman login di dalam slug tenant tersebut
            $dashboard_url = "https://dashboard.tekrabyte.id/" . $slug . "/login";

            return [
                'success'      => true,
                'message'      => 'Toko berhasil dibuat!',
                'redirect_url' => $dashboard_url, 
                'tenant_id'    => $tenant_id,
                'store_slug'   => $slug
            ];
new TEKRAERPOS_REST_Signup();
