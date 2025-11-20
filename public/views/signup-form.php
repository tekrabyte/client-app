<h2>Daftar Trial 14 Hari</h2>

<form method="post" action="/wp-admin/admin-post.php">
    <input type="hidden" name="action" value="erpos_signup">

    <label>Nama Toko</label>
    <input type="text" name="store" required>

    <label>Email</label>
    <input type="email" name="email" required>

    <button type="submit">Mulai Trial Sekarang</button>

</form>

<?php if ($_GET['success'] ?? false): ?>
<div style="color:green;">
    Pendaftaran berhasil! Silahkan cek email Anda.
</div>
<?php endif; ?>
