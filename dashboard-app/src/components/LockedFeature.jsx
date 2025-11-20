export default function LockedFeature({message}) {
    return (
        <div className="locked-box">
            <h3>{message}</h3>
            <a className="btn-upgrade" href="https://dashboard.tekrabyte.id/billing">
                Upgrade Plan
            </a>
        </div>
    );
}
