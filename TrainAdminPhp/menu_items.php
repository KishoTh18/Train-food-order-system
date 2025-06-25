<?php 
include 'includes/header.php'; 
include 'includes/sidebar.php'; 
require 'db.php';
?>

<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Menu Items</h4>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addItemModal">+ Add Item</button>
  </div>

  <?php
    $stmt = $pdo->query("SELECT * FROM menu_items ORDER BY created_at DESC");
    $menuItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
  ?>

  <table class="table table-hover table-bordered">
    <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
        <th>Price (Rs)</th>
        <th>Category</th>
        <th>Image</th>
        <th>Available</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($menuItems as $item): ?>
        <tr>
          <td><?= $item['id'] ?></td>
          <td><?= htmlspecialchars($item['name']) ?></td>
          <td><?= htmlspecialchars($item['description']) ?></td>
          <td><?= number_format($item['price'], 2) ?></td>
          <td><?= ucfirst($item['category']) ?></td>
          <td>
            <?php if ($item['image_url']): ?>
              <img src="<?= htmlspecialchars($item['image_url']) ?>" width="50">
            <?php else: ?>
              <span class="text-muted">No image</span>
            <?php endif; ?>
          </td>
          <td>
            <?= $item['is_available'] ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-danger">No</span>' ?>
          </td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editItem(<?= $item['id'] ?>)">Edit</button>
            <a href="delete_item.php?id=<?= $item['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete this item?')">Delete</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<!-- Add Item Modal -->
<div class="modal fade" id="addItemModal" tabindex="-1" aria-labelledby="addItemModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <form method="POST" action="save_item.php">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Menu Item</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-6">
            <label>Name</label>
            <input type="text" name="name" required class="form-control">
          </div>
          <div class="col-md-6">
            <label>Price (Rs)</label>
            <input type="number" step="0.01" name="price" required class="form-control">
          </div>
          <div class="col-md-6">
            <label>Category</label>
            <select name="category" class="form-control">
              <option value="rice">Rice</option>
              <option value="snacks">Snacks</option>
              <option value="beverages">Beverages</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>
          <div class="col-md-6">
            <label>Image URL</label>
            <input type="text" name="image_url" class="form-control">
          </div>
          <div class="col-12">
            <label>Description</label>
            <textarea name="description" required class="form-control" rows="3"></textarea>
          </div>
          <div class="col-12">
            <label>Available</label>
            <select name="is_available" class="form-control">
              <option value="1" selected>Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Save Item</button>
        </div>
      </div>
    </form>
  </div>
</div>

<?php include 'includes/footer.php'; ?>
