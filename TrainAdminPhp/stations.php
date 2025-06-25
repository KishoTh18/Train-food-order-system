<?php 
include 'includes/header.php'; 
include 'includes/sidebar.php'; 
require 'db.php';

// Fetch stations
$stmt = $pdo->query("SELECT * FROM stations ORDER BY \"order\"");
$stations = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>Train Stations</h4>
    <a href="add_station.php" class="btn btn-primary">+ Add Station</a>
  </div>

  <table class="table table-bordered table-hover">
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Name (English)</th>
        <th>Name (Sinhala)</th>
        <th>Distance from Colombo (km)</th>
        <th>Order</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($stations as $station): ?>
        <tr>
          <td><?= $station['id'] ?></td>
          <td><?= htmlspecialchars($station['name']) ?></td>
          <td><?= htmlspecialchars($station['sinhala_name']) ?></td>
          <td><?= $station['distance_from_colombo'] ?> km</td>
          <td><?= $station['order'] ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<?php include 'includes/footer.php'; ?>
