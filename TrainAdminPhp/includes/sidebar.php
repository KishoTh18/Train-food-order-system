<!-- Sidebar -->
<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-white sidebar shadow-sm collapse border-end">
  <div class="position-sticky pt-3 px-2">
    <div class="text-center mb-4">
      <h5 class="mt-2 text-primary fw-bold">Quick Links</h5>
      <hr>
    </div>

    <ul class="nav flex-column">
      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="dashboard.php">
          <i class="bi bi-speedometer2"></i> Dashboard
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'orders.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="orders.php">
          <i class="bi bi-box-seam"></i> Orders
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'menu_items.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="menu_items.php">
          <i class="bi bi-list-ul"></i> Menu Items
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'stations.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="stations.php">
          <i class="bi bi-geo-alt"></i> Stations
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'trains.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="trains.php">
          <i class="bi bi-train-front"></i> Trains
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'users.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="users.php">
          <i class="bi bi-people"></i> Users
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'reports.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="reports.php">
          <i class="bi bi-bar-chart-line"></i> Reports
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 <?= basename($_SERVER['PHP_SELF']) == 'settings.php' ? 'active text-primary fw-bold' : 'text-dark' ?>" href="settings.php">
          <i class="bi bi-gear"></i> Settings
        </a>
      </li>
    </ul>
  </div>
</nav>
