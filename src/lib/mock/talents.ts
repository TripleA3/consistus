import type { TalentProfile, User } from "@/lib/types";

export const mockTalentUsers: User[] = [
  {
    id: "talent-1",
    name: "Tech Unite Africa (TUA)",
    email: "hello@techuniteafrica.example",
    roles: ["talent"],
    talentProfile: {
      id: "profile-1",
      userId: "talent-1",
      category: "techie",
      bio: "Pan-African tech community and event collective. Panels, meetups and keynote appearances.",
      verified: true,
      ratePerVideo: 45000,
      ratePerAppearance: 250000,
      followerCount: 128000,
    },
  },
  {
    id: "talent-2",
    name: "Amara Divine",
    email: "amara@example.com",
    roles: ["talent"],
    talentProfile: {
      id: "profile-2",
      userId: "talent-2",
      category: "artist",
      bio: "Afrobeats vocalist and songwriter. Available for shoutouts, duets and live appearances.",
      verified: true,
      ratePerVideo: 60000,
      ratePerAppearance: 400000,
      followerCount: 542000,
    },
  },
  {
    id: "talent-3",
    name: "Kene Obi",
    email: "kene@example.com",
    roles: ["talent"],
    talentProfile: {
      id: "profile-3",
      userId: "talent-3",
      category: "comedian",
      bio: "Stand-up comedian and skit creator. Personalised roast videos are my specialty.",
      verified: false,
      ratePerVideo: 25000,
      ratePerAppearance: 150000,
      followerCount: 89000,
    },
  },
  {
    id: "talent-4",
    name: "Zola Marn",
    email: "zola@example.com",
    roles: ["talent"],
    talentProfile: {
      id: "profile-4",
      userId: "talent-4",
      category: "actor",
      bio: "Screen and stage actor. Birthday shoutouts, coaching sessions and cameo appearances.",
      verified: true,
      ratePerVideo: 35000,
      ratePerAppearance: 300000,
      followerCount: 210000,
    },
  },
];

export function getTalentProfiles(): TalentProfile[] {
  return mockTalentUsers
    .map((u) => u.talentProfile)
    .filter((p): p is TalentProfile => Boolean(p));
}

export function getTalentUserById(id: string): User | undefined {
  return mockTalentUsers.find((u) => u.id === id);
}
