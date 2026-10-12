import { useEffect, useState } from 'react';
import { RESTAURANT } from '@/lib/restaurant';

/* ────────────────────────────────────────────────────────────────
   Ambiance : le site suit la lumière d'Angers.

   Le coucher du soleil est calculé pour les coordonnées du restaurant
   (algorithme de la NOAA, à la minute près — aucune API). Une demi-
   heure avant, le site passe en ambiance « soir » : lumière plus
   basse, plus chaude, comme la salle. `<html data-ambiance="soir">`
   porte l'état ; le CSS fait le reste (lueur de bougie sur le hero).

   Pour la démonstration : `?ambiance=soir` ou `?ambiance=jour` dans
   l'adresse force l'une ou l'autre. */

export type Ambiance = 'jour' | 'soir';

const RAD = Math.PI / 180;
const DAY_MS = 864e5;
const J1970 = 2440588;
const J2000 = 2451545;

/** Lever et coucher du soleil (UTC) pour une date et un lieu. */
export function sunTimes(date: Date, lat = RESTAURANT.latitude, lng = RESTAURANT.longitude) {
  const d = date.valueOf() / DAY_MS - 0.5 + J1970 - J2000;
  const lw = RAD * -lng;
  const phi = RAD * lat;
  const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
  const ds = 0.0009 + lw / (2 * Math.PI) + n;
  const M = RAD * (357.5291 + 0.98560028 * ds);
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + RAD * 102.9372 + Math.PI;
  const dec = Math.asin(Math.sin(RAD * 23.4397) * Math.sin(L));
  const jNoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const w = Math.acos((Math.sin(RAD * -0.833) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
  const a = 0.0009 + (w + lw) / (2 * Math.PI) + n;
  const jSet = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const jRise = jNoon - (jSet - jNoon);
  const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * DAY_MS);
  return { sunrise: fromJulian(jRise), sunset: fromJulian(jSet) };
}

function forcedAmbiance(): Ambiance | null {
  if (typeof window === 'undefined') return null;
  const v = new URLSearchParams(window.location.search).get('ambiance');
  return v === 'soir' || v === 'jour' ? v : null;
}

export function ambianceAt(now = new Date()): Ambiance {
  const forced = forcedAmbiance();
  if (forced) return forced;
  const { sunrise, sunset } = sunTimes(now);
  const t = now.getTime();
  return t >= sunset.getTime() - 30 * 60_000 || t < sunrise.getTime() ? 'soir' : 'jour';
}

/** Ambiance recalculée chaque minute. Pose `data-ambiance` sur <html>. */
export function useAmbiance() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const ambiance = ambianceAt(now);
  useEffect(() => {
    document.documentElement.dataset.ambiance = ambiance;
  }, [ambiance]);
  return ambiance;
}
