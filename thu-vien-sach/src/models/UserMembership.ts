import Membership from "./Membership";

export interface UserMembership {
  userId: number;
  membershipId: number;
  expireDate: string;
  membership: Membership;
}
