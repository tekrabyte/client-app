<?php
require "db.php";

$tenant = intval($_GET['tenant']);
$p = "wp_tekra_t{$tenant}_";

$data = $mysqli->query("
    SELECT oi.product_id, SUM(oi.qty) qty, SUM(oi.subtotal) total, p.name
    FROM {$p}order_items oi
    LEFT JOIN {$p}products p ON oi.product_id=p.id
    GROUP BY oi.product_id
    ORDER BY qty DESC
    LIMIT 10
")->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);
