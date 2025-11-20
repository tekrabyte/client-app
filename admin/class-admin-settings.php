<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_Admin_Settings {

    public static function init() {
        add_action('admin_init', [__CLASS__, 'register_settings']);
    }

    public static function render() {
        if (!current_user_can('manage_options')) {
            return;
        }

        // Memanggil file View yang baru saja Anda buat
        if (file_exists(__DIR__ . '/views/settings.php')) {
            include __DIR__ . '/views/settings.php';
        } else {
            echo '<div class="wrap"><h1>Error: View file not found</h1></div>';
        }
    }

    public static function register_settings() {
        // --- TAB GENERAL ---
        register_setting('tekra_saas_general', 'tekra_saas_general_options');
        add_settings_section(
            'tekra_saas_general_section',
            'General Settings',
            null,
            'tekra_saas_general'
        );
        add_settings_field(
            'tekra_saas_xendit_secret',
            'Xendit Secret Key',
            [__CLASS__, 'field_xendit_secret'],
            'tekra_saas_general',
            'tekra_saas_general_section'
        );

        // --- TAB XENDIT ---
        register_setting('tekra_saas_xendit', 'tekra_saas_xendit_options');
        add_settings_section(
            'tekra_saas_xendit_main',
            'Xendit Configuration',
            null,
            'tekra_saas_xendit'
        );

        // --- TAB PLANS ---
        register_setting('tekra_saas_plans', 'tekra_saas_plans_options');
        
        // --- TAB BRANDING ---
        register_setting('tekra_saas_branding', 'tekra_saas_branding_options');
    }

    public static function field_xendit_secret() {
        $options = get_option('tekra_saas_general_options');
        $value = $options['xendit_secret'] ?? '';
        echo "<input type='password' name='tekra_saas_general_options[xendit_secret]' value='" . esc_attr($value) . "' class='regular-text'>";
    }
}

// Jalankan init
TEKRAERPOS_Admin_Settings::init();