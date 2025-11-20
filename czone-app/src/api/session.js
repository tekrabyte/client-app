if (data.new_plan) {
    alert("Your plan has been downgraded to: " + data.new_plan);
}

export function canUse(feature, limits) {
    if (!limits || limits[feature] === undefined) return false;
    return limits[feature];
}
