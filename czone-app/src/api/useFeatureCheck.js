export async function checkFeature(feature) {
  const res = await fetch(`/wp-json/tekraerpos/v1/check-feature/${feature}`);
  const data = await res.json();

  if (data.error === "feature_locked") {
    window.location.href = data.upgrade_url;
    return false;
  }
  return true;
}
const ok = await checkFeature("add_outlet");
if (!ok) return;
if (!res.allowed) {
   window.location.href = res.upgrade_url;
}