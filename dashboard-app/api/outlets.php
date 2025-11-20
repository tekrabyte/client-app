<?php
require "db.php";

$tenant = intval($_GET['tenant']);
$p = "wp_tekra_t{$tenant}_";

$data = $mysqli->query("
    SELECT o.name outlet, COUNT(ord.id) orders, SUM(ord.total) revenue
    FROM {$p}orders ord
    LEFT JOIN {$p}outlets o ON ord.outlet_id=o.id
    GROUP BY ord.outlet_id
")->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);
