export default interface Membership {
  id: number;
  name: string;
  rank: string;
  allowNew: {
    type: string;
    data: number[];
  };
  price: string;
}
