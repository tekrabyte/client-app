if (data.reason === "suspended") {
    alert(data.message);
    window.location.href = data.renew_url;
}