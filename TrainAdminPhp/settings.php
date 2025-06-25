<?php 
include 'includes/header.php'; 
include 'includes/sidebar.php'; 
?>

<div class="container mt-5" style="max-width:600px;">
  <h3 class="mb-4">System Settings</h3>
  
  <form id="settingsForm">
    <div class="mb-3">
      <label for="siteName" class="form-label">Site Name</label>
      <input type="text" class="form-control" id="siteName" placeholder="Train Food Order System" value="Train Food Order System" required>
    </div>
    
    <div class="mb-3">
      <label for="adminEmail" class="form-label">Admin Email</label>
      <input type="email" class="form-control" id="adminEmail" placeholder="admin@example.com" value="admin@example.com" required>
    </div>
    
    <div class="mb-3">
      <label for="deliveryFee" class="form-label">Delivery Fee (Rs)</label>
      <input type="number" step="0.01" class="form-control" id="deliveryFee" value="100.00" required>
    </div>
    
    <button type="submit" class="btn btn-primary">Save Settings</button>
  </form>
  
  <div id="message" class="mt-3" style="display:none;"></div>
</div>

<script>
  document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Fake saving delay
    const msg = document.getElementById('message');
    msg.style.display = 'block';
    msg.className = 'alert alert-info';
    msg.textContent = 'Saving settings...';

    setTimeout(() => {
      msg.className = 'alert alert-success';
      msg.textContent = 'Settings saved successfully.';
    }, 1000);
  });
</script>

<?php include 'includes/footer.php'; ?>
