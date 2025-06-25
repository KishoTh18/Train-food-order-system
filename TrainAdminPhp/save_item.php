<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO menu_items (name, description, price, category, image_url, is_available) 
                           VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $_POST['name'],
        $_POST['description'],
        $_POST['price'],
        $_POST['category'],
        $_POST['image_url'] ?: null,
        $_POST['is_available']
    ]);
}
header("Location: menu_items.php");
exit;
