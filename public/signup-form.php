<?php
if (!defined('ABSPATH')) exit;

function tekra_saas_render_signup_form() { ?>
<div id="tekra-signup" style="max-width:500px;margin:auto">
    <h2>Daftar TekraERPOS</h2>
    <p>Mulai trial 14 hari. Tidak perlu kartu kredit.</p>

    <form id="tekraSignupForm">
        <label>Nama Toko</label>
        <input type="text" name="store_name" required>

        <label>Subdomain</label>
        <div style="display:flex;align-items:center;gap:5px">
            <input type="text" name="slug" required>
            <span>.czone.tekrabyte.id</span>
        </div>

        <label>Email</label>
        <input type="email" name="email" required>

        <label>Password</label>
        <input type="password" name="password" required>

        <button type="submit" class="button button-primary" style="margin-top:10px">
            Buat Akun & Tenant
        </button>
    </form>

    <div id="tekraSignupResult" style="margin-top:20px"></div>
</div>

<script>
document.getElementById("tekraSignupForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const form = new FormData(this);
    const res  = await fetch("/wp-json/tekra-saas/v1/signup", {
        method: "POST",
        body: form
    });

    const j = await res.json();

    if (j.success) {
        document.getElementById("tekraSignupResult").innerHTML =
            `<div style="padding:10px;background:#d1ffd1">
                Tenant berhasil dibuat.<br>
                <b>Dashboard:</b> https://${form.get("slug")}.czone.tekrabyte.id
            </div>`;
    } else {
        document.getElementById("tekraSignupResult").innerHTML =
            `<div style="padding:10px;background:#ffd1d1">${j.message}</div>`;
    }
});
</script>

<?php }
add_shortcode('tekra_saas_signup', 'tekra_saas_render_signup_form');
    