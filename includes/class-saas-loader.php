<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Loader {

    public static function init() {
        // 1. HANDLE CORS (FIXED)
        add_action('init', function() {
            // Ambil Origin dari request
            $origin = get_http_origin();
            
            // Daftar domain yang diizinkan
            $allowed_origins = [
                'http://localhost:5173',            // Development Local
                'https://dashboard.tekrabyte.id'    // Production
            ];

            if ($origin && in_array($origin, $allowed_origins)) {
                header("Access-Control-Allow-Origin: " . $origin);
                header("Access-Control-Allow-Credentials: true");
                header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
                header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
                header("Vary: Origin");
            }

            // Handle Preflight Request
            if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
                status_header(200);
                exit();
            }
        });

        // 2. HANDLE JSON AUTHENTICATION (PENTING UNTUK 401)
        add_filter('determine_current_user', function($user) {
            if (!empty($user)) return $user;

            $headers = getallheaders();
            $auth_header = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

            if (!empty($auth_header) && preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
                $token = $matches[1];
                
                // Decode Token (Format: USER_ID : SECRET)
                $decoded = base64_decode($token);
                if (!$decoded) return $user;

                list($user_id, $secret) = explode(':', $decoded);
                
                // Validasi Token
                $stored_secret = get_user_meta($user_id, 'tekra_api_token', true);
                
                if ($stored_secret && hash_equals($stored_secret, $secret)) {
                    return $user_id; // LOGIN BERHASIL
                }
            }
            return $user;
        });

        self::load_core_files();
        self::load_modules();
    }

    private static function load_core_files() {
        $files = [
            'includes/helpers.php',
            'includes/class-encryption.php',
            'includes/class-saas-database.php',
            'includes/class-tenant-manager.php',
            'includes/class-plan-manager.php',
            'includes/class-subscription-manager.php',
            'includes/class-provisioning.php',
            'includes/class-provisioning-seeds.php',
            'includes/class-xendit-invoice.php'
        ];
        foreach($files as $file) {
            if (file_exists(TEKRAERPOS_SAAS_DIR . $file)) require_once TEKRAERPOS_SAAS_DIR . $file;
        }
    }

    private static function load_modules() {
        // Public & Shortcodes
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-router.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-router.php';
             TEKRAERPOS_Public_Router::get_instance();
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-auth.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-auth.php';
             new TEKRAERPOS_Public_Auth();
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-shortcodes.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-shortcodes.php';
             new TEKRAERPOS_Public_Shortcodes();
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/signup-form.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/signup-form.php';
        }

        // REST API
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'includes/class-saas-rest.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'includes/class-saas-rest.php';
        }

        $apis = ['signup', 'auth', 'dashboard', 'products', 'orders', 'outlet', 'employees', 'subscription', 'xendit-webhook', 'tenant-settings', 'health', 'billing'];
        foreach($apis as $api) {
            $path = TEKRAERPOS_SAAS_DIR . "rest/class-rest-$api.php";
            if (file_exists($path)) require_once $path;
        }

        // Admin
        if (is_admin()) {
            require_once TEKRAERPOS_SAAS_DIR . 'admin/class-admin-menu.php';
            new TEKRAERPOS_Admin_Menu();
        }
    }

    public static function activate() {
        self::load_core_files();
        TEKRAERPOS_SaaS_Database::create_global_tables();
        TEKRAERPOS_SaaS_Provisioning_Seeds::seed_default_plans();
    }

    public static function deactivate() {}
}