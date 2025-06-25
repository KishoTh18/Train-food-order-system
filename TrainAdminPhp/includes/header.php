<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Heat & Eat Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Bootstrap CSS & Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />

  <!-- Custom Styles -->
  <style>
    html, body {
      height: 100%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f9fa;
      margin: 0;
    }

    .dashboard-wrapper {
      display: flex;
      min-height: 100vh;
      flex-direction: column;
    }

    .dashboard-body {
      flex: 1;
      display: flex;
    }

    /* Stylish top navbar */
    header.navbar {
      background: linear-gradient(90deg, #ff6b00, #ff9e00);
      box-shadow: 0 6px 12px rgba(255, 107, 0, 0.6);
      z-index: 1030;
      position: sticky;
      top: 0;
      transition: background 0.3s ease;
    }

    header.navbar:hover {
      background: linear-gradient(90deg, #ff8c33, #ffb84d);
      box-shadow: 0 8px 20px rgba(255, 140, 51, 0.8);
    }

    .navbar-brand {
      font-size: 1.8rem;
      font-weight: 900;
      color: #fff !important;
      display: flex;
      align-items: center;
      gap: 12px;
      text-shadow: 0 0 8px rgba(255, 107, 0, 0.8);
      cursor: pointer;
      user-select: none;
    }

    .navbar-brand img {
      width: 36px;
      height: 36px;
      filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7));
      border-radius: 6px;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .navbar .nav-link {
      color: #fff !important;
      font-weight: 600;
      letter-spacing: 0.03em;
      transition: color 0.25s ease, transform 0.2s ease;
      position: relative;
    }

    .navbar .nav-link:hover {
      color: #fff8e7 !important;
      transform: scale(1.1);
      text-shadow: 0 0 10px #fff8e7;
    }

    /* Add a subtle pulse glow on logout icon */
    .nav-link .bi-box-arrow-right {
      animation: pulseGlow 3s infinite ease-in-out;
    }

    @keyframes pulseGlow {
      0%, 100% {
        text-shadow: 0 0 6px #fff3cd;
      }
      50% {
        text-shadow: 0 0 15px #ffc107;
      }
    }

    /* Responsive hamburger menu for mobile */
    @media (max-width: 768px) {
      header.navbar {
        flex-wrap: wrap;
        padding: 0.5rem 1rem;
      }

      .navbar-nav {
        width: 100%;
        justify-content: flex-end;
      }
    }
  </style>
</head>
<body>

<div class="dashboard-wrapper">

  <!-- 🔥 Top navbar -->
  <header class="navbar d-flex justify-content-between align-items-center px-3 py-2">
    <a class="navbar-brand" href="index.php">
      Heat & Eat
    </a>
    <nav class="navbar-nav">
      <a class="nav-link">
        <i class="bi bi-box-arrow-right me-1"></i> Logout
      </a>
    </nav>
  </header>

  <div class="dashboard-body">
