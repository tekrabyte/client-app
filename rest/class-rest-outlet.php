$features = TEKRAERPOS_SaaS_Tenant::get_features($tenant_id);
$current_outlets = $wpdb->get_var("SELECT COUNT(*) FROM {$tenant_prefix}outlets");

if ($current_outlets >= $features['multi_outlet']) {
    return new WP_REST_Response([
        "error" => "Outlet limit reached. Upgrade your plan."
    ], 403);
}
