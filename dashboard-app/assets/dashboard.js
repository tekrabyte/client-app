let tenant = TENANT_ID;

function changeTab(tab) {
    fetch(`api/${tab}.php?tenant=${tenant}`)
    .then(r => r.json())
    .then(render[tab]);
}

const render = {};

render.overview = data => {
    document.getElementById('dashboard-container').innerHTML = `
        <h1>Dashboard Overview</h1>
        <div class="cards">
            <div class="card">Revenue: Rp ${data.summary.revenue}</div>
            <div class="card">Orders: ${data.summary.orders}</div>
        </div>
    `;
};

render.sales = data => {
    let labels = data.daily.map(x => x.d).reverse();
    let values = data.daily.map(x => x.t).reverse();

    document.getElementById('dashboard-container').innerHTML = `
        <h1>Sales Analytics</h1>
        <canvas id="salesChart"></canvas>
    `;

    new Chart(document.getElementById("salesChart"), {
        type:'line',
        data:{
            labels:labels,
            datasets:[{label:"Daily Sales",data:values}]
        }
    });
};

render.products = data => {
    let html = `
        <h1>Top Products</h1>
        <table class="wp-list-table widefat striped">
            <thead><tr><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
    `;
    data.forEach(d => {
        html += `<tr><td>${d.name}</td><td>${d.qty}</td><td>Rp ${d.total}</td></tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('dashboard-container').innerHTML = html;
};

render.outlets = data => {
    let html = `
        <h1>Outlet Performance</h1>
        <table class="wp-list-table widefat striped">
            <thead><tr><th>Outlet</th><th>Orders</th><th>Revenue</th></tr></thead>
            <tbody>
    `;
    data.forEach(d => {
        html += `<tr><td>${d.outlet}</td><td>${d.orders}</td><td>Rp ${d.revenue}</td></tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('dashboard-container').innerHTML = html;
};

render.activity = data => {
    document.getElementById("dashboard-container").innerHTML = `
        <h1>Activity</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
};
