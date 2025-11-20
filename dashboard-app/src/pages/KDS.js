if (!tenant.features.kds) {
    return <LockedFeature message="KDS is available only on Enterprise Plan" />;
}
