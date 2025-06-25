<?php
ob_start();
require 'db.php';

// Handle order status update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $pdo->prepare("UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?");
    $stmt->execute([$_POST['order_status'], $_POST['payment_status'], $_POST['order_id']]);
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
    <!-- Hero Section -->
    <div class="p-4 mb-4 text-white rounded shadow-sm" style="background: linear-gradient(135deg, #ff6b00, #ffa54f);">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h1 class="display-6 fw-bold">🔥 Heat & Eat Admin</h1>
                <p class="lead">Monitor orders, update statuses & manage your kitchen operations</p>
            </div>
        </div>
    </div>

    <!-- Stats -->
    <?php
    $total = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $new = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status = 'placed'")->fetchColumn();
    $preparing = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status = 'preparing'")->fetchColumn();
    $ready = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status = 'ready'")->fetchColumn();
    $delivered = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status = 'delivered'")->fetchColumn();

    $statuses = [
        ['label' => 'Total Orders', 'count' => $total, 'color' => 'dark'],
        ['label' => 'New', 'count' => $new, 'color' => 'info'],
        ['label' => 'Preparing', 'count' => $preparing, 'color' => 'warning'],
        ['label' => 'Ready', 'count' => $ready, 'color' => 'success'],
        ['label' => 'Delivered', 'count' => $delivered, 'color' => 'secondary'],
    ];
    ?>

    <div class="row mb-4">
        <?php foreach ($statuses as $status): ?>
            <div class="col-6 col-md-2 mb-3">
                <div class="card text-center border-0 shadow-sm">
                    <div class="card-body bg-<?= $status['color'] ?> text-white rounded">
                        <h6 class="mb-0"><?= $status['label'] ?></h6>
                        <h4 class="fw-bold"><?= $status['count'] ?></h4>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- Filter Orders -->
    <div class="sticky-top bg-white py-2 mb-3 border-bottom z-2">
        <form method="GET" class="d-flex justify-content-center gap-3 align-items-center">
            <label class="form-label m-0 fw-semibold">Filter by Status:</label>
            <select name="status" class="form-select w-auto" onchange="this.form.submit()">
                <option value="">All</option>
                <?php foreach (["placed", "preparing", "ready", "delivered"] as $s): ?>
                    <option value="<?= $s ?>" <?= ($_GET['status'] ?? '') === $s ? 'selected' : '' ?>>
                        <?= ucfirst($s) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </form>
    </div>

    <!-- Orders Display -->
    <?php
    $query = "SELECT * FROM orders";
    $status = $_GET['status'] ?? '';
    if ($status) {
        $query .= " WHERE order_status = '" . $status . "'";
    }
    $query .= " ORDER BY created_at DESC";
    $orders = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);
    ?>

    <div class="row g-4">
        <?php foreach ($orders as $order): ?>
            <div class="col-12 col-md-6">
                <div class="card shadow-sm border-0">
                    <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                        <h5 class="mb-0">Order #<?= $order['id'] ?></h5>
                        <small><?= date("M d, Y h:i A", strtotime($order['created_at'])) ?></small>
                    </div>
                    <div class="card-body">
                        <p><strong>Status:</strong> <?= ucfirst($order['order_status']) ?> |
                           <strong>Payment:</strong> <?= ucfirst($order['payment_status']) ?></p>
                        <p><strong>Phone:</strong> <?= htmlspecialchars($order['customer_phone']) ?> |
                           <strong>Seat:</strong> <?= htmlspecialchars($order['seat_info']) ?></p>
                        <p><strong>Train:</strong> <?= $order['train_id'] ?> |
                           <strong>Station:</strong> <?= $order['station_id'] ?></p>
                        <p><strong>Total:</strong> LKR <?= $order['total_amount'] ?> |
                           <strong>Delivery:</strong> LKR <?= $order['delivery_fee'] ?></p>
                        <p><strong>Method:</strong> <?= ucfirst($order['payment_method']) ?></p>

                        <form method="POST" class="d-flex flex-wrap gap-2 mt-3">
                            <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                            <select name="order_status" class="form-select w-auto">
                                <?php foreach (["placed", "preparing", "ready", "delivered"] as $s): ?>
                                    <option value="<?= $s ?>" <?= $order['order_status'] === $s ? 'selected' : '' ?>>
                                        <?= ucfirst($s) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>

                            <select name="payment_status" class="form-select w-auto">
                                <?php foreach (["pending", "paid"] as $s): ?>
                                    <option value="<?= $s ?>" <?= $order['payment_status'] === $s ? 'selected' : '' ?>>
                                        <?= ucfirst($s) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>

                            <button type="submit" class="btn btn-sm btn-outline-primary">Update</button>
                        </form>

                        <button class="btn btn-link mt-3" data-bs-toggle="collapse" data-bs-target="#items-<?= $order['id'] ?>">📝 View Items</button>
                        <div class="collapse" id="items-<?= $order['id'] ?>">
                            <ul class="list-group mt-2">
                                <?php foreach (json_decode($order['items'], true) as $item): ?>
                                    <li class="list-group-item">
                                        ID: <?= $item['menuItemId'] ?> |
                                        Qty: <?= $item['quantity'] ?> |
                                        Price: LKR <?= $item['price'] ?>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</main>

<?php include 'includes/footer.php'; ?>
