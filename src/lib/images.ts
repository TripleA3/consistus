/**
 * The photography that shipped with the design bundles, unpacked from
 * their manifests into public/images. Files are named for what they show
 * ("event-afro-night-live", "celeb-nia-kalu"), so a record whose title
 * matches gets its own picture; anything else falls back to a stable
 * choice from the same set.
 */
const TALENT = [
  "celeb-dj-remi",
  "celeb-femi-ojo",
  "celeb-imani-cole",
  "celeb-kola-martins",
  "celeb-lola-ige",
  "celeb-nia-kalu",
  "celeb-tunde-ade",
  "celeb-zara-bello",
];

const EVENTS = [
  "event-afro-night-live",
  "event-afrobeats-london",
  "event-creator-bootcamp",
  "event-detty-december-kickoff",
  "event-founders-mixer",
  "event-gaming-arena-live",
  "event-lagos-food-festival",
  "event-lagos-tech-fest",
  "event-laugh-out-abuja",
  "event-naija-night-houston",
  "event-owambe-sunday",
  "event-quilox-saturdays",
  "event-wine-paint-night",
  "event-women-in-business-brunch",
];

const COMMUNITY = [
  "community-comedy-lovers-ng",
  "community-nollywood-insiders",
  "community-super-falcons-fans",
  "community-tems-fan-club",
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

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Prefers a file named for the record, then falls back to a stable pick.
 * `name` is the title or person's name; `id` only has to be stable.
 */
function pick(dir: string, pool: string[], prefix: string, id: string, name?: string) {
  if (name) {
    const wanted = `${prefix}-${slug(name)}`;
    if (pool.includes(wanted)) return `/images/${dir}/${wanted}.jpg`;
  }
  return `/images/${dir}/${pool[hash(id) % pool.length]}.jpg`;
}

export function talentPhoto(id: string, name?: string) {
  return pick("talent", TALENT, "celeb", id, name);
}

export function eventPhoto(id: string, title?: string) {
  return pick("events", EVENTS, "event", id, title);
}

export function communityPhoto(id: string, name?: string) {
  return pick("community", COMMUNITY, "community", id, name);
}
