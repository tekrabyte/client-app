<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Database {

    public static function create_global_tables() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();

        $tables = [
            'saas_tenants' => "CREATE TABLE %s (
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
            ) %s;",

            'saas_plans' => "CREATE TABLE %s (
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
            ) %s;",

            'saas_subscriptions' => "CREATE TABLE %s (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                tenant_id bigint(20) NOT NULL,
                plan_id bigint(20) NOT NULL,
                status varchar(20) DEFAULT '' NOT NULL,
                started_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
                expires_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
                xendit_invoice_id varchar(255) DEFAULT '' NOT NULL,
                created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
                PRIMARY KEY  (id)
            ) %s;",

            'saas_invoices' => "CREATE TABLE %s (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                tenant_id bigint(20) NOT NULL,
                invoice_id varchar(255) DEFAULT '' NOT NULL,
                amount decimal(10,2) DEFAULT '0.00' NOT NULL,
                status varchar(50) DEFAULT '' NOT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY  (id)
            ) %s;"
        ];

        foreach ($tables as $name => $query) {
            $table_name = $wpdb->prefix . $name;
            $sql = sprintf($query, $table_name, $charset);
            dbDelta($sql);
        }
    }

    public static function create_tenant_schema($tenant_id) {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();

        $p = "tekra_t" . $tenant_id . "_"; // Prefix tenant

        $schemas = [
            'outlets' => "CREATE TABLE %s (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                name varchar(191) NOT NULL,
                address text NOT NULL,
                status varchar(20) DEFAULT 'active',
                created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY  (id)
            ) %s;",

            'products' => "CREATE TABLE %s (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                sku varchar(191) DEFAULT '' NOT NULL,
                name varchar(191) NOT NULL,
                price decimal(10,2) DEFAULT '0.00' NOT NULL,
                stock int(11) DEFAULT 0 NOT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY  (id)
            ) %s;",

            'orders' => "CREATE TABLE %s (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                order_number varchar(191) DEFAULT '' NOT NULL,
                outlet_id bigint(20) DEFAULT 0 NOT NULL, 
                total decimal(10,2) DEFAULT '0.00' NOT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY  (id)
            ) %s;",

            'order_items' => "CREATE TABLE %s (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                order_id bigint(20) NOT NULL,
                product_id bigint(20) NOT NULL,
                qty int(11) DEFAULT 0 NOT NULL,
                price decimal(10,2) DEFAULT '0.00' NOT NULL,
                subtotal decimal(10,2) DEFAULT '0.00' NOT NULL,
                PRIMARY KEY  (id)
            ) %s;",

            'stock_logs' => "CREATE TABLE %s (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                product_id bigint(20) NOT NULL,
                qty_change int(11) DEFAULT 0 NOT NULL,
                note varchar(255) DEFAULT '' NOT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY  (id),
                KEY product_id (product_id)
            ) %s;"
        ];

        foreach ($schemas as $key => $query) {
            $table_name = $wpdb->prefix . $p . $key;
            $sql = sprintf($query, $table_name, $charset);
            dbDelta($sql);
        }

        // Insert Default Outlet
        $outlet_table = $wpdb->prefix . $p . 'outlets';
        $check = $wpdb->get_var("SELECT COUNT(*) FROM $outlet_table");
        
        if ($check == 0) {
            $wpdb->insert($outlet_table, [
                'name' => 'Main Outlet',
                'status' => 'active',
                'address' => 'Headquarters',
                'created_at' => current_time('mysql')
            ]);
        }
    }
}