function loadBilling() {
    fetch(`/wp-json/tekraerpos/v1/billing/info?tenant=${TENANT}`)
    .then(r => r.json())
    .then(data => renderBilling(data));
}

function renderBilling(data) {
    let html = `
        <div class="card">
            <h2>Current Plan</h2>
            <p><b>${data.plan.name}</b></p>
            <p>Status: <span class="${data.subscription.status}">${data.subscription.status}</span></p>
            <p>Expires: ${data.subscription.expires_at}</p>
            <button onclick="upgradePlan()">Upgrade Plan</button>
        </div>

        <div class="card">
            <h2>Invoices</h2>
            <ul>
    `;
    data.invoices.forEach(i => {
        html += `<li>#${i.id} – ${i.status} – <a href="${i.pay_url}" target="_blank">Pay</a></li>`;
    });
    html += `</ul></div>`;
    document.getElementById("billing-container").innerHTML = html;
}

function upgradePlan() {
    fetch("api/create-invoice.php?tenant=" + TENANT)
    .then(r => r.json())
    .then(d => {
        window.open(d.invoice_url, "_blank");
    });
}

loadBilling();
