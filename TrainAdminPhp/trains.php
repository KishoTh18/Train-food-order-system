<?php 
include 'includes/header.php'; 
include 'includes/sidebar.php'; 
require 'db.php';

// Fetch trains
$stmt = $pdo->query("SELECT * FROM trains ORDER BY id DESC");
$trains = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Train Management</h4>
    <a href="add_train.php" class="btn btn-primary">+ Add Train</a>
  </div>

  <table class="table table-bordered table-hover">
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Type</th>
        <th>Departure</th>
        <th>Arrival</th>
        <th>Frequency</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($trains as $train): ?>
        <tr>
          <td><?= $train['id'] ?></td>
          <td><?= htmlspecialchars($train['name']) ?></td>
          <td><?= htmlspecialchars($train['train_type']) ?></td>
          <td><?= $train['departure_time'] ?></td>
          <td><?= $train['arrival_time'] ?></td>
          <td><?= htmlspecialchars($train['frequency']) ?></td>
          <td>
            <?= $train['is_active'] ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-secondary">Inactive</span>' ?>
          </td>
          <td>
            <a href="edit_train.php?id=<?= $train['id'] ?>" class="btn btn-sm btn-warning">Edit</a>
            <a href="delete_train.php?id=<?= $train['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure to delete this train?')">Delete</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<?php include 'includes/footer.php'; ?>
