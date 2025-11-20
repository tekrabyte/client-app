<?php
require "db.php";

$tenant = intval($_GET['tenant']);
$p = "wp_tekra_t{$tenant}_";

$logs = $mysqli->query("
    SELECT * FROM {$p}stock_logs ORDER BY created_at DESC LIMIT 20
")->fetch_all(MYSQLI_ASSOC);

$orders = $mysqli->query("
    SELECT * FROM {$p}orders ORDER BY created_at DESC LIMIT 10
")->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "logs" => $logs,
    "orders" => $orders
]);
