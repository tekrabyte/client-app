<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Database {

    public static function create_global_tables() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset_collate = $wpdb->get_charset_collate();

        // DEFINISI VARIABEL (Menggunakan Concatenation/Titik agar aman)
        $t_tenants = $wpdb->prefix . 'saas_tenants';
        $t_plans   = $wpdb->prefix . 'saas_plans';
        $t_subs    = $wpdb->prefix . 'saas_subscriptions';
        $t_inv     = $wpdb->prefix . 'saas_invoices';

        // SQL QUERY (Murni String tanpa variabel di dalamnya)
        $sql_tenants = "CREATE TABLE " . $t_tenants . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(191) NOT NULL,
            slug varchar(191) NOT NULL,
            owner_user_id bigint(20) NOT NULL,
            plan_id bigint(20) NOT NULL,
            email varchar(191) DEFAULT '' NOT NULL,
            status varchar(20) DEFAULT 'trial',
            created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            updated_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY slug (slug)
        ) " . $charset_collate . ";";

        $sql_plans = "CREATE TABLE " . $t_plans . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(191) NOT NULL,
            slug varchar(191) DEFAULT '' NOT NULL,
            price_month decimal(10,2) DEFAULT '0.00' NOT NULL,
            price_year decimal(10,2) DEFAULT '0.00' NOT NULL,
            trial_days int(11) DEFAULT 14 NOT NULL,
            features text NOT NULL,
            created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY slug (slug)
        ) " . $charset_collate . ";";

        $sql_subs = "CREATE TABLE " . $t_subs . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            tenant_id bigint(20) NOT NULL,
            plan_id bigint(20) NOT NULL,
            status varchar(20) DEFAULT '' NOT NULL,
            started_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            expires_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            xendit_invoice_id varchar(255) DEFAULT '' NOT NULL,
            created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id)
        ) " . $charset_collate . ";";

        $sql_invoices = "CREATE TABLE " . $t_inv . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            tenant_id bigint(20) NOT NULL,
            invoice_id varchar(255) DEFAULT '' NOT NULL,
            amount decimal(10,2) DEFAULT '0.00' NOT NULL,
            status varchar(50) DEFAULT '' NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) " . $charset_collate . ";";

        dbDelta($sql_tenants);
        dbDelta($sql_plans);
        dbDelta($sql_subs);
        dbDelta($sql_invoices);
    }

    public static function create_tenant_schema($tenant_id) {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset_collate = $wpdb->get_charset_collate();

        // Menggunakan titik (.) untuk menggabungkan string
        $p = "tekra_t" . $tenant_id . "_";

        $t_outlets     = $wpdb->prefix . $p . 'outlets';
        $t_products    = $wpdb->prefix . $p . 'products';
        $t_orders      = $wpdb->prefix . $p . 'orders';
        $t_order_items = $wpdb->prefix . $p . 'order_items';
        $t_stock_logs  = $wpdb->prefix . $p . 'stock_logs';

        $sql = [];

        $sql[] = "CREATE TABLE " . $t_outlets . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(191) NOT NULL,
            address text NOT NULL,
            status varchar(20) DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) " . $charset_collate . ";";

        $sql[] = "CREATE TABLE " . $t_products . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            sku varchar(191) DEFAULT '' NOT NULL,
            name varchar(191) NOT NULL,
            price decimal(10,2) DEFAULT '0.00' NOT NULL,
            stock int(11) DEFAULT 0 NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) " . $charset_collate . ";";

        $sql[] = "CREATE TABLE " . $t_orders . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            order_number varchar(191) DEFAULT '' NOT NULL,
            outlet_id bigint(20) DEFAULT 0 NOT NULL, 
            total decimal(10,2) DEFAULT '0.00' NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) " . $charset_collate . ";";

        $sql[] = "CREATE TABLE " . $t_order_items . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            order_id bigint(20) NOT NULL,
            product_id bigint(20) NOT NULL,
            qty int(11) DEFAULT 0 NOT NULL,
            price decimal(10,2) DEFAULT '0.00' NOT NULL,
            subtotal decimal(10,2) DEFAULT '0.00' NOT NULL,
            PRIMARY KEY  (id)
        ) " . $charset_collate . ";";

        $sql[] = "CREATE TABLE " . $t_stock_logs . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            product_id bigint(20) NOT NULL,
            qty_change int(11) DEFAULT 0 NOT NULL,
            note varchar(255) DEFAULT '' NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY product_id (product_id)
        ) " . $charset_collate . ";";

        foreach ($sql as $q) {
            dbDelta($q);
        }

        // Insert default outlet
        $check = $wpdb->get_var("SELECT COUNT(*) FROM " . $t_outlets);
        if ($check == 0) {
            $wpdb->insert($t_outlets, [
                'name' => 'Main Outlet',
                'status' => 'active',
                'address' => 'Main HQ',
                'created_at' => current_time('mysql')
            ]);
        }
    }
}