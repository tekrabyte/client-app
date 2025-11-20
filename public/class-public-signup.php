<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_Public_Signup {

    public function __construct() {
        add_action('admin_post_nopriv_erpos_signup', [$this, 'handle']);
        add_action('admin_post_erpos_signup', [$this, 'handle']);
    }

    public function handle() {
        global $wpdb;

        $email = sanitize_email($_POST['email']);
        $store = sanitize_text_field($_POST['store']);

        if (!$email || !$store) wp_die("Invalid form.");

        if (email_exists($email)) {
            wp_die("Email already registered.");
        }

        $password = wp_generate_password();
        $uid = wp_create_user($email, $password, $email);

        $tenant_id = TEKRAERPOS_SaaS_Tenant::create([
            'name'=>$store,
            'owner_user_id'=>$uid,
            'slug'=>sanitize_title($store),
            'plan_id'=>1,
            'status'=>'trial'
        ]);

        TEKRAERPOS_SaaS_Database::create_tenant_schema($tenant_id);

        TEKRAERPOS_SaaS_Subscriptions::start_trial($tenant_id, 14);

        wp_redirect('/signup?success=1');
        exit;
    }
}
