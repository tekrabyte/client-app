<?php
session_start();

if (!isset($_SESSION['tenant_id'])) {
    die("Unauthorized");
}

$tenant_id = intval($_SESSION['tenant_id']);
$tenant_prefix = "wp_tekra_t{$tenant_id}_";

require_once __DIR__ . "/api/db.php";
?>
<!DOCTYPE html>
<html>
<head>
    <title>TekraERPOS Dashboard</title>
    <link rel="stylesheet" href="assets/dashboard.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<div class="sidebar">
    <h2>TekraERPOS</h2>
    <a href="#" onclick="changeTab('overview')">Overview</a>
    <a href="#" onclick="changeTab('sales')">Sales</a>
    <a href="#" onclick="changeTab('products')">Products</a>
    <a href="#" onclick="changeTab('outlets')">Outlets</a>
    <a href="#" onclick="changeTab('activity')">Activity</a>
</div>

<div class="content">
    <div id="dashboard-container"></div>
</div>

<script src="assets/dashboard.js"></script>
</body>
</html>
