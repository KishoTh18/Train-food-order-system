<?php 
include 'includes/header.php'; 
include 'includes/sidebar.php'; 
require 'db.php';

// Default date range = last 7 days
$fromDate = $_GET['from'] ?? date('Y-m-d', strtotime('-7 days'));
$toDate   = $_GET['to'] ?? date('Y-m-d');

$stmt = $pdo->prepare("
  SELECT COUNT(*) AS total_orders,
         SUM(total_amount) AS total_revenue,
         COUNT(DISTINCT train_id) AS trains_used,
         COUNT(DISTINCT station_id) AS stations_covered
  FROM orders
  WHERE created_at BETWEEN ? AND ?
");
$stmt->execute([$fromDate . ' 00:00:00', $toDate . ' 23:59:59']);
$report = $stmt->fetch(PDO::FETCH_ASSOC);

// Most popular menu items
$popular = $pdo->query("
  SELECT mi.name, COUNT(*) AS qty
  FROM orders o, json_array_elements(o.items) AS item
  JOIN menu_items mi ON item->>'id' = mi.id::text
  GROUP BY mi.name
  ORDER BY qty DESC
  LIMIT 5
")->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container mt-4">
  <h4 class="mb-3">Reports (<?= $fromDate ?> → <?= $toDate ?>)</h4>

  <!-- Filter Form -->
  <form method="GET" class="row g-2 mb-4">
    <div class="col-md-3">
      <label>From:</label>
      <input type="date" name="from" class="form-control" value="<?= $fromDate ?>">
    </div>
    <div class="col-md-3">
      <label>To:</label>
      <input type="date" name="to" class="form-control" value="<?= $toDate ?>">
    </div>
    <div class="col-md-2 align-self-end">
      <button class="btn btn-primary w-100">Filter</button>
    </div>
  </form>

  <!-- Summary Cards -->
  <div class="row g-4">
    <div class="col-md-3">
      <div class="card border-success shadow-sm">
        <div class="card-body">
          <h6 class="card-title text-muted">Total Orders</h6>
          <h3><?= $report['total_orders'] ?? 0 ?></h3>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card border-warning shadow-sm">
        <div class="card-body">
          <h6 class="card-title text-muted">Total Revenue</h6>
          <h3>Rs. <?= number_format($report['total_revenue'], 2) ?></h3>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card border-info shadow-sm">
        <div class="card-body">
          <h6 class="card-title text-muted">Trains Used</h6>
          <h3><?= $report['trains_used'] ?></h3>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card border-secondary shadow-sm">
        <div class="card-body">
          <h6 class="card-title text-muted">Stations Covered</h6>
          <h3><?= $report['stations_covered'] ?></h3>
        </div>
      </div>
    </div>
  </div>

  <!-- Most Popular Items -->
  <div class="mt-5">
    <h5>Top 5 Popular Menu Items</h5>
    <?php if (count($popular)): ?>
      <ul class="list-group">
        <?php foreach ($popular as $item): ?>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <?= htmlspecialchars($item['name']) ?>
            <span class="badge bg-primary rounded-pill"><?= $item['qty'] ?></span>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php else: ?>
      <p class="text-muted">No data available for this period.</p>
    <?php endif; ?>
  </div>
</div>

<?php include 'includes/footer.php'; ?>
