// utils/geo.ts
import type { LatLngExpression } from "leaflet";

export function parseBoundary(boundary: string): LatLngExpression[] {
  if (!boundary) return [];
  return boundary
    .split(";")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [latStr, lngStr] = pair.split(",").map((v) => v.trim());
      return [Number(latStr), Number(lngStr)] as LatLngExpression;
    });
}
