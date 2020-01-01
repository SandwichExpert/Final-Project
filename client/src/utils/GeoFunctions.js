function getCurrentLocation() {
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(function(position) {
      const lat = Number(position.coords.latitude);
      const lng = Number(position.coords.longitude);
      return { lat, lng };
    });
  }
  return null;
}

export { getCurrentLocation };
