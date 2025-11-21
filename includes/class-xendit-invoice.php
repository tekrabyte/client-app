<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_Xendit_Invoice {

    public static function create_invoice($tenant_id, $plan_id) {
        global $wpdb;

        // PERBAIKAN: Ambil dari 'tekra_saas_xendit_options' (Bukan General)
        $options = get_option('tekra_saas_xendit_options');
        $secret_key = $options['xendit_secret'] ?? '';

        if (empty($secret_key)) {
            error_log("TekraERPOS Error: Secret Key Xendit kosong. Cek Settings > Tab Xendit.");
            return false;
        }

        $plan = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}saas_plans WHERE id=%d", $plan_id));
        if (!$plan) return false;

        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}saas_subscriptions WHERE tenant_id=%d ORDER BY id DESC LIMIT 1", 
            $tenant_id
        ));
        if (!$sub) return false;

        $tenant = TEKRAERPOS_SaaS_Tenant::get($tenant_id);
        $external_id = "inv_" . $tenant_id . "_" . time();
        
        $payload = [
            "external_id" => $external_id,
            "payer_email" => $tenant->email,
            "description" => "Langganan: " . $plan->name,
            "amount"      => floatval($plan->price_month),
            "currency"    => "IDR",
            // Redirect kembali ke halaman billing setelah bayar
            "success_redirect_url" => "https://dashboard.tekrabyte.id/" . $tenant->slug . "/settings/billing",
            "failure_redirect_url" => "https://dashboard.tekrabyte.id/" . $tenant->slug . "/settings/billing?failed=1"
        ];

        $resp = wp_remote_post("https://api.xendit.co/v2/invoices", [
            "headers" => [
                "Authorization" => "Basic " . base64_encode($secret_key . ":"),
                "Content-Type"  => "application/json"
            ],
            "body" => json_encode($payload),
            "timeout" => 45
        ]);

        if (is_wp_error($resp)) {
            error_log("Xendit Error: " . $resp->get_error_message());
            return false;
        }

        $body = json_decode(wp_remote_retrieve_body($resp), true);

        if (!isset($body["id"])) {
            error_log("Xendit API Failed: " . print_r($body, true));
            return false;
        }

        $wpdb->update(
            $wpdb->prefix . "saas_subscriptions", 
            ["xendit_invoice_id" => $body["id"], "status" => "pending_payment"], 
            ["id" => $sub->id]
        );

        return $body["invoice_url"];
    }
}


### 2. Perbaiki Error "Unknown Plan" (Billing Info)
**Masalah:** Jika paket Trial ID=1 tidak ditemukan di database (karena reset/hapus), API mengembalikan `null` dan frontend menampilkan "Unknown". Kita tambahkan *fallback*.

📂 **File:** `rest/class-rest-billing.php`

```php
<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST_Billing {

    public function __construct() {
        add_action('rest_api_init', function() {
            register_rest_route('tekra-saas/v1', '/billing/info', [
                'methods' => 'GET',
                'callback' => [$this, 'billing_info'],
                'permission_callback' => [$this, 'check_auth']
            ]);
        });
    }

    public function check_auth() {
        return is_user_logged_in();
    }

    public function billing_info($req) {
        global $wpdb;
        $user_id = get_current_user_id();
        $tenant = TEKRAERPOS_SaaS_Tenant::get_by_owner($user_id);

        if (!$tenant) {
             $linked = get_user_meta($user_id, 'tekra_tenant_id', true);
             if($linked) $tenant = TEKRAERPOS_SaaS_Tenant::get($linked);
        }

        if (!$tenant) return new WP_Error("no_tenant", "Tenant not found", ["status" => 404]);

        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}saas_subscriptions WHERE tenant_id=%d ORDER BY id DESC LIMIT 1",
            $tenant->id
        ));

        // Fallback jika subscription hilang
        if (!$sub) {
            $sub = (object) [
                'status' => 'trial',
                'plan_id' => $tenant->plan_id,
                'expires_at' => date('Y-m-d H:i:s', strtotime('+14 days', strtotime($tenant->created_at)))
            ];
        }

        $plan_id = $sub->plan_id ? $sub->plan_id : $tenant->plan_id;
        $plan = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}saas_plans WHERE id=%d", $plan_id));

        // PERBAIKAN: Fallback Object jika Plan ID tidak ada di DB
        if (!$plan) {
            $plan = (object) [
                'id' => $plan_id,
                'name' => 'Starter (Trial)',
                'price_month' => 0,
                'features' => json_encode(['multi_outlet' => 1, 'multi_user' => 1])
            ];
        }

        $invoices = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}saas_invoices WHERE tenant_id=%d ORDER BY id DESC LIMIT 20",
            $tenant->id
        ));

        return [
            "subscription" => $sub,
            "plan" => $plan,
            "invoices" => $invoices
        ];
    }
}
new TEKRAERPOS_SaaS_REST_Billing();


### 3. Perbaiki Error 404 (Dashboard Sales)
**Masalah:** File endpoint untuk dashboard sales belum ada atau belum dimuat.

📂 **File:** `rest/class-rest-dashboard.php`

```php
<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_REST_Dashboard {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route('tekra-saas/v1', '/dashboard/sales', [
            'methods' => 'GET',
            'callback' => [$this, 'get_sales'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    public function check_auth() {
        return is_user_logged_in();
    }

    public function get_sales() {
        global $wpdb;
        $user_id = get_current_user_id();
        $tenant = TEKRAERPOS_SaaS_Tenant::get_by_owner($user_id);

        if(!$tenant) return new WP_Error('no_tenant', 'Tenant not found', ['status'=>404]);

        $p = "tekra_t{$tenant->id}_";
        $summary = ['revenue' => 0, 'orders' => 0];
        $daily = [];

        if($wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}{$p}orders'")) {
            $summary = $wpdb->get_row("SELECT COUNT(*) as orders, COALESCE(SUM(total),0) as revenue FROM {$wpdb->prefix}{$p}orders");
            $daily = $wpdb->get_results("SELECT DATE(created_at) as d, SUM(total) as t FROM {$wpdb->prefix}{$p}orders GROUP BY d ORDER BY d DESC LIMIT 7");
        }

        return ['summary' => $summary, 'daily' => $daily];
    }
}
new TEKRAERPOS_SaaS_REST_Dashboard();


### 4. Perbaiki Error 401 (Loader Authentication)
**Masalah:** Kadang `getallheaders()` tidak tersedia di server tertentu, menyebabkan Header Authorization tidak terbaca.

📂 **File:** `includes/class-saas-loader.php`

```php
<?php
if (!defined('ABSPATH')) exit;

class TEKRAERPOS_SaaS_Loader {
    public static function init() {
        // CORS Setup
        add_action('init', function() {
            $origin = get_http_origin();
            if ($origin) {
                header("Access-Control-Allow-Origin: " . $origin);
                header("Access-Control-Allow-Credentials: true");
                header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
                header("Access-Control-Allow-Headers: Authorization, Content-Type");
            }
            if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
                status_header(200); exit();
            }
        });

        // AUTH HANDLER (Fix untuk Server Nginx/Apache)
        add_filter('determine_current_user', function($user) {
            if (!empty($user)) return $user;
            
            // Coba ambil header dari berbagai sumber
            $auth_header = null;
            if (function_exists('getallheaders')) {
                $headers = getallheaders();
                $auth_header = $headers['Authorization'] ?? null;
            }
            if (!$auth_header) {
                $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
            }

            if (!empty($auth_header) && preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
                $token = $matches[1];
                $decoded = base64_decode($token);
                if ($decoded) {
                    list($user_id, $secret) = explode(':', $decoded);
                    $stored = get_user_meta($user_id, 'tekra_api_token', true);
                    if ($stored && hash_equals($stored, $secret)) {
                        return $user_id;
                    }
                }
            }
            return $user;
        });

        self::load_core_files();
        self::load_modules();
    }

    private static function load_core_files() {
        $files = [
            'includes/helpers.php', 'includes/class-encryption.php', 'includes/class-saas-database.php',
            'includes/class-tenant-manager.php', 'includes/class-plan-manager.php', 'includes/class-subscription-manager.php',
            'includes/class-provisioning.php', 'includes/class-provisioning-seeds.php', 'includes/class-xendit-invoice.php'
        ];
        foreach($files as $file) if (file_exists(TEKRAERPOS_SAAS_DIR . $file)) require_once TEKRAERPOS_SAAS_DIR . $file;
    }

    private static function load_modules() {
        // Load semua REST API & Public
        $apis = ['signup', 'auth', 'dashboard', 'products', 'orders', 'outlet', 'employees', 'subscription', 'xendit-webhook', 'tenant-settings', 'health', 'billing'];
        foreach($apis as $api) {
            $f = TEKRAERPOS_SAAS_DIR . "rest/class-rest-$api.php";
            if (file_exists($f)) require_once $f;
        }
        
        if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-router.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-router.php';
             TEKRAERPOS_Public_Router::get_instance();
        }
         if (file_exists(TEKRAERPOS_SAAS_DIR . 'public/class-public-shortcodes.php')) {
             require_once TEKRAERPOS_SAAS_DIR . 'public/class-public-shortcodes.php';
             new TEKRAERPOS_Public_Shortcodes();
        }
        
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