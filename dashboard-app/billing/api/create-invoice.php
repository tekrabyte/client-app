<?php
require "../../api/db.php";
$tenant = intval($_GET['tenant']);

$secret = "xnd_development_I5qPPq8DhcYtuB89vQ1y5biXnxGS4AjSlQ0Bb1fNftFyFsyHVhXKFV43enMIZM";

$rand = rand(1000,9999);
$external_id = "INV-{$tenant}-" . time();

$payload = [
    "external_id" => $external_id,
    "payer_email" => "billing@tenant{$tenant}.com",
    "description" => "TekraERPOS Subscription Renewal",
    "amount" => 79000,
    "success_redirect_url" => "https://dashboard.tekrabyte.id/billing/success",
    "failure_redirect_url" => "https://dashboard.tekrabyte.id/billing/failed"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.xendit.co/v2/invoices");
curl_setopt($ch, CURLOPT_USERPWD, $secret . ":");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
$res = curl_exec($ch);
curl_close($ch);

echo $res;
