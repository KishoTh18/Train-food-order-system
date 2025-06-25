<?php
include 'includes/header.php'; 
include 'includes/sidebar.php'; 
require 'db.php';
?>

<div class="container mt-4">
  <h4 class="mb-4">Orders</h4>
  <?php
    $sql = "
      SELECT o.*, u.username, t.name AS train_name, s.name AS station_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN trains t ON o.train_id = t.id
      JOIN stations s ON o.station_id = s.id
      ORDER BY o.created_at DESC
    ";
    $stmt = $pdo->query($sql);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
  ?>

  <table class="table table-bordered table-hover">
    <thead class="table-dark">
      <tr>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Train</th>
        <th>Station</th>
        <th>Phone</th>
        <th>Total (Rs)</th>
        <th>Seat</th>
        <th>Payment</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($orders as $order): ?>
        <tr>
          <td><?= $order['id'] ?></td>
          <td><?= htmlspecialchars($order['username']) ?></td>
          <td><?= htmlspecialchars($order['train_name']) ?></td>
          <td><?= htmlspecialchars($order['station_name']) ?></td>
          <td><?= htmlspecialchars($order['customer_phone']) ?></td>
          <td><?= number_format($order['total_amount'], 2) ?></td>
          <td><?= htmlspecialchars($order['seat_info'] ?: '-') ?></td>
          <td>
            <span class="badge <?= $order['payment_status'] === 'paid' ? 'bg-success' : 'bg-warning' ?>">
              <?= ucfirst($order['payment_status']) ?>
            </span>
          </td>
          <td>
            <span class="badge <?= $order['order_status'] === 'completed' ? 'bg-success' : 'bg-info' ?>">
              <?= ucfirst($order['order_status']) ?>
            </span>
          </td>
          <td><?= date('Y-m-d H:i', strtotime($order['created_at'])) ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<?php include 'includes/footer.php'; ?>
