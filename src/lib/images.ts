/**
 * The photography that came with the design bundle, unpacked from its
 * manifest into public/images. There's no mapping from a seeded record to
 * a particular shot, so each entity is assigned one deterministically —
 * the same id always gets the same photo, on the server and the client.
 *
 * Replace these arrays (or set a real URL on the record) as soon as the
 * catalogue carries its own artwork; nothing else has to change.
 */
const TALENT = [
  "/images/talent/celeb-bisi-adeyemi.jpg",
  "/images/talent/celeb-chioma-eze.jpg",
  "/images/talent/celeb-nia-kalu.jpg",
  "/images/talent/celeb-tunde-ade.jpg",
  "/images/talent/celeb-zara-bello.jpg",
];

const EVENTS = [
  "/images/events/s1387174.jpg",
  "/images/events/s9002827.jpg",
  "/images/events/s10063045.jpg",
  "/images/events/s15286980.jpg",
  "/images/events/s28251081.jpg",
  "/images/events/s34779355.jpg",
];

/** FNV-1a: ids differ in only a few characters, so avalanche matters. */
function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function talentPhoto(id: string) {
  return TALENT[hash(id) % TALENT.length];
}

export function eventPhoto(id: string) {
  return EVENTS[hash(id) % EVENTS.length];
}
