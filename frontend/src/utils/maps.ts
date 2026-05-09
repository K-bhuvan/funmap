/** Open turn-by-turn / directions in Google Maps (works well on web + Android). */
export function openGoogleMapsDirections(lat: number, lng: number): void {
  const destination = `${lat},${lng}`;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Open directions in Apple Maps (best on iOS; on other platforms may open web Maps). */
export function openAppleMapsDirections(lat: number, lng: number): void {
  const url = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
  window.open(url, "_blank", "noopener,noreferrer");
}
