<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_Public_Shortcodes {

    public function __construct() {
        add_shortcode('erpos_signup', [$this, 'signup']);
        add_shortcode('erpos_login', [$this, 'login']);
        add_shortcode('erpos_dashboard_button', [$this, 'dashboard_button']);
    }

    public function signup() {
        ob_start();
        include ERPOS_PUBLIC . 'views/signup-form.php';
        return ob_get_clean();
    }

    public function login() {
        ob_start();
        include ERPOS_PUBLIC . 'views/login-form.php';
        return ob_get_clean();
    }

    public function dashboard_button() {
        if (!is_user_logged_in()) return "";

        $uid = get_current_user_id();
        $tenant = TEKRAERPOS_SaaS_Tenant::get_by_owner($uid);

        if (!$tenant) return "";

        return '<a href="/redirect" class="button">Open Dashboard</a>';
    }
}
