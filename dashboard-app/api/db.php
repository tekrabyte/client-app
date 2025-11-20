<?php
$mysqli = new mysqli("127.0.0.1", "u215947863_Ie2Vq", "8PhuO1YTsH", "u215947863_DOx1d");
if ($mysqli->connect_errno) {
    die("DB ERROR: " . $mysqli->connect_error);
}
