<?php 
include 'includes/header.php'; 
include 'includes/sidebar.php'; 
require 'db.php';

// Fetch all users
$stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container mt-4">
  <h4 class="mb-4">User Accounts</h4>

  <table class="table table-bordered table-hover">
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Username</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Registered At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($users as $user): ?>
        <tr>
          <td><?= $user['id'] ?></td>
          <td><?= htmlspecialchars($user['username']) ?></td>
          <td><?= htmlspecialchars($user['email']) ?></td>
          <td><?= $user['phone'] ?: '-' ?></td>
          <td><?= date('Y-m-d H:i', strtotime($user['created_at'])) ?></td>
          <td>
            <a href="user_orders.php?user_id=<?= $user['id'] ?>" class="btn btn-sm btn-info">View Orders</a>
            <a href="delete_user.php?id=<?= $user['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete this user?')">Delete</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<?php include 'includes/footer.php'; ?>
