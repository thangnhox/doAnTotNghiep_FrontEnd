export default interface Membership {
  id: number;
  name: string;
  rank: number;
  allowNew: number;
  price: number;
  description: string[];
}

export enum MembershipAllowNew {
  DISABLED = 0,
  NEW = 1,
  RENEW = 2,
}

export enum MembershipRank {
  READ = 1,
  NOTE_TAG = 2,
}

export function MembershipRankDescription(rank: number): string {
  let permissions: string[] = [];
  if (rank & MembershipRank.READ) {
    permissions.push("READ");
  }
  if (rank & MembershipRank.NOTE_TAG) {
    permissions.push("NOTE_TAG");
  }
  return permissions.join(" + ");
}