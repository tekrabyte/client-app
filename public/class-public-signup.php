<?php
if (!defined('ABSPATH')) exit;

function tekra_saas_render_signup_form($atts) { 
    $atts = shortcode_atts(['plan' => 1], $atts);
    ?>

<div class="tekra-signup-wrapper" style="max-width:400px; margin:0 auto; padding:20px; background:#fff; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
    
    <h3 style="text-align:center; margin-bottom:20px;">Mulai Trial 14 Hari</h3>

    <form id="tekraSignupForm">
        <input type="hidden" name="plan_id" value="<?php echo esc_attr($atts['plan']); ?>">
        
        <div style="margin-bottom:15px;">
            <label style="display:block; font-weight:bold; margin-bottom:5px;">Nama Toko</label>
            <input type="text" name="store_name" placeholder="Contoh: Kopi Senja" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
        </div>

        <div style="margin-bottom:15px;">
            <label style="display:block; font-weight:bold; margin-bottom:5px;">Link Akses Toko (Slug)</label>
            <div style="display:flex; align-items:center; border:1px solid #ddd; border-radius:4px; background:#f9f9f9;">
                <span style="padding:10px; color:#666; font-size:13px; border-right:1px solid #ddd;">dashboard.tekrabyte.id/</span>
                <input type="text" name="slug" placeholder="kopisenja" required style="flex:1; border:none; padding:10px; background:transparent; outline:none;">
            </div>
            <small style="color:#888;">Gunakan huruf kecil, tanpa spasi.</small>
        </div>

        <div style="margin-bottom:15px;">
            <label style="display:block; font-weight:bold; margin-bottom:5px;">Email Bisnis</label>
            <input type="email" name="email" placeholder="nama@email.com" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
        </div>

        <div style="margin-bottom:20px;">
            <label style="display:block; font-weight:bold; margin-bottom:5px;">Password</label>
            <input type="password" name="password" placeholder="******" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
        </div>

        <button type="submit" id="btnSubmit" style="width:100%; padding:12px; background:#2563eb; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
            Buat Toko Sekarang
        </button>
        
        <div id="msgBox" style="margin-top:15px; font-size:14px; text-align:center;"></div>
    </form>
</div>

<script>
document.getElementById("tekraSignupForm").addEventListener("submit", async function(e){
    e.preventDefault();
    
    const btn = document.getElementById("btnSubmit");
    const msg = document.getElementById("msgBox");
    const formData = new FormData(this);

    btn.disabled = true;
    btn.innerText = "Sedang Memproses...";
    msg.innerHTML = "";

    try {
        const res = await fetch("/wp-json/tekra-saas/v1/signup", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.ok && data.success) {
            msg.style.color = "green";
            msg.innerHTML = "✅ " + data.message;
            
            // Redirect ke URL Link Toko yang baru dibuat
            // Contoh: https://dashboard.tekrabyte.id/kopikenangan/login
            setTimeout(() => {
                window.location.href = data.redirect_url; 
            }, 1500);
        } else {
            throw new Error(data.message || "Gagal mendaftar.");
        }

    } catch (err) {
        msg.style.color = "red";
        msg.innerHTML = "❌ " + err.message;
        btn.disabled = false;
        btn.innerText = "Buat Toko Sekarang";
    }
});
</script>

<?php }
add_shortcode('tekra_saas_signup', 'tekra_saas_render_signup_form');