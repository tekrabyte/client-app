<?php
require "../../api/db.php";
$tenant = intval($_GET['tenant']);

$res = $mysqli->query("
    SELECT * FROM wp_saas_invoices WHERE tenant_id=$tenant ORDER BY id DESC
")->fetch_all(MYSQLI_ASSOC);

echo json_encode($res);
