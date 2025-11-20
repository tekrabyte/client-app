<?php
require "db.php";

$tenant = intval($_GET['tenant']);
$p = "wp_tekra_t{$tenant}_";

$daily = $mysqli->query("SELECT DATE(created_at) d, SUM(total) t FROM {$p}orders GROUP BY d ORDER BY d DESC LIMIT 30")->fetch_all(MYSQLI_ASSOC);
$monthly = $mysqli->query("SELECT DATE_FORMAT(created_at,'%Y-%m') m, SUM(total) t FROM {$p}orders GROUP BY m ORDER BY m DESC LIMIT 12")->fetch_all(MYSQLI_ASSOC);
$summary = $mysqli->query("SELECT COUNT(*) orders, SUM(total) revenue FROM {$p}orders")->fetch_assoc();

echo json_encode([
    "daily" => $daily,
    "monthly" => $monthly,
    "summary" => $summary
]);
