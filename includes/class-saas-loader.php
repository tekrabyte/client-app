<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Loader {

    public static function init() {
        // Load semua file core
        self::load_core_files();

        // REST modules
        // Pastikan file ini ada atau sesuaikan namanya jika Anda menggantinya (misal: class-rest-dashboard.php)
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'includes/class-saas-rest.php')) {
            require_once TEKRAERPOS_SAAS_DIR . 'includes/class-saas-rest.php';
        }
        
        // Load REST Dashboard baru jika sudah dibuat
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'rest/class-rest-dashboard.php')) {
            require_once TEKRAERPOS_SAAS_DIR . 'rest/class-rest-dashboard.php';
        }

        // Admin
        if (is_admin()) {
            require_once TEKRAERPOS_SAAS_DIR . 'admin/class-admin-menu.php';
            new TEKRAERPOS_Admin_Menu();
        }
    }

    /**
     * Helper function untuk memuat file-file inti plugin.
     * Digunakan di init() dan activate() agar tidak terjadi duplikasi kode.
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
        // PENTING: Kita harus memuat file class secara manual di sini
        // karena 'init' belum tentu berjalan saat hook aktivasi dipanggil.
        self::load_core_files();

        // create SaaS global tables
        TEKRAERPOS_SaaS_Database::create_global_tables();

        // seed default subscription plans
        TEKRAERPOS_SaaS_Provisioning_Seeds::seed_default_plans();
    }

    public static function deactivate() {}
}