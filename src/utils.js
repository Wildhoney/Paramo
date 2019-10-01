export function getDefaultLink() {
    const locationAvailable = typeof global.location === 'undefined';
    return locationAvailable ? global.location.search : null;
}
