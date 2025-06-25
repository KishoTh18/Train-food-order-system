<?php
$host = 'localhost';
$db = 'heat_eat_db';
$user = 'postgres';
$pass = '1234';
$port = '5432'; // Default PostgreSQL port

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("DB Connection failed: " . $e->getMessage());
}
?>
