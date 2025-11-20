useEffect(() => {
    fetch("/wp-json/tekraerpos/v1/tenant/limits")
    .then(r => r.json())
    .then(setLimits);
}, []);

<button
  disabled={!limits.multi_outlet}
  onClick={() => openNewOutlet()}
  className={!limits.multi_outlet ? "btn-disabled" : ""}
>
  + Add Outlet
</button>

{!limits.multi_outlet && (
  <div className="locked-feature-banner">
     Starter plan cannot add more outlets. <a href="/billing">Upgrade Now</a>
  </div>
)}
