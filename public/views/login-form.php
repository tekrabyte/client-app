<h2>Login Tenant</h2>

<form method="post" action="/wp-admin/admin-post.php">
    <input type="hidden" name="action" value="erpos_login">

    <label>Email</label>
    <input type="email" name="email" required>

    <label>Password</label>
    <input type="password" name="password" required>

    <button type="submit">Login</button>
</form>
