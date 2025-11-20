<?php
session_start();
if (!isset($_SESSION['tenant_id'])) die("Unauthorized");

$tenant_id = intval($_SESSION['tenant_id']);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Billing – TekraERPOS</title>
    <link rel="stylesheet" href="billing.css">
</head>
<body>

<h1>Billing & Subscription</h1>

<div id="billing-container">
    Loading billing info...
</div>

<script>
const TENANT = <?= $tenant_id ?>;
</script>
<script src="billing-ui.js"></script>
</body>
</html>
