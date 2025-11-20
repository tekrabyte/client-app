if (!canUse("multi_outlet", tenant.features) || tenant.features.multi_outlet < outlets.length) {
    return <LockedFeature message="Upgrade to PRO to add more outlets" />;
}