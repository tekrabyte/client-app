<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Loader {

    public static function init() {
        // Load semua file core (Helper, DB, Encryption, dll)
        self::load_core_files();

        // --- PUBLIC / FRONTEND MODULES (WAJIB UNTUK SHORTCODE) ---
        
        // 1. Load Shortcode Form Signup Modern (Yang baru kita buat)
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/signup-form.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/signup-form.php';
        }

        // 2. Load Router (Untuk menangani URL /tenant/slug, /login, /signup)
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-router.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-router.php';
             TEKRAERPOS_Public_Router::get_instance();
        }

        // 3. Load Auth Handler (Untuk proses Login form POST)
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-auth.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-auth.php';
             new TEKRAERPOS_Public_Auth();
        }

        // 4. Load Public API (Jika ada endpoint public khusus)
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-api.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-api.php';
        }


        // --- REST API MODULES (BACKEND) ---
        
        // Core REST
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'includes/class-saas-rest.php')) {
            require_once TEKRAERPOS_SAAS_DIR . 'includes/class-saas-rest.php';
        }
        
        // Signup Handler (Penting untuk form pendaftaran)
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-signup.php')) {
            require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-signup.php';
        }

        // Dashboard & Auth API
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-dashboard.php')) {
            require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-dashboard.php';
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-auth.php')) {
            require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-auth.php';
        }

        // Webhooks & Billing
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-xendit-webhook.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-xendit-webhook.php';
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-subscription.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-subscription.php';
        }
        
        // CRUD Modules (Produk, Outlet, Order, Employee)
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-products.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-products.php';
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-outlet.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-outlet.php';
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-orders.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-orders.php';
        }
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-employees.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-employees.php';
        }


        // --- WP-CLI COMMANDS ---
        if (defined('WP_CLI') && WP_CLI) {
            if (file_exists(TEKRAERPOS_SAAS_DIR . 'includes/class-cli-commands.php')) {
                require_once TEKRAERPOS_SAAS_DIR . 'includes/class-cli-commands.php';
            }
        }

        // --- ADMIN MODULES ---
        if (is_admin()) {
            require_once TEKRAERPOS_SAAS_DIR . 'admin/class-admin-menu.php';
            new TEKRAERPOS_Admin_Menu();
        }
    }

    /**
     * Helper function untuk memuat file-file inti plugin.
     */
    private static function load_core_files() {
        require_once TEKRAERPOS_SAAS_DIR . 'includes/helpers.php';
        require_once TEKRAERPOS_SAAS_DIR . 'includes/class-encryption.php';
        require_once TEKRAERPOS_SAAS_DIR . 'includes/class-saas-database.php';
        require_once TEKRAERPOS_SAAS_DIR . 'includes/class-tenant-manager.php';
        require_once TEKRAERPOS_SAAS_DIR . 'includes/class-plan-manager.php';
        require_once TEKRAERPOS_SAAS_DIR . 'includes/class-subscription-manager.php';
        require_once TEKRAERPOS_SAAS_DIR . 'includes/class-provisioning.php';
        require_once TEKRAERPOS_SAAS_DIR . 'includes/class-provisioning-seeds.php';
    }

    public static function activate() {
        self::load_core_files();
        TEKRAERPOS_SaaS_Database::create_global_tables();
        TEKRAERPOS_SaaS_Provisioning_Seeds::seed_default_plans();
    }

    public static function deactivate() {}
}