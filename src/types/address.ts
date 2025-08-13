import { Base } from "./base";
import ID from "./id";

export default interface Address extends Base {
  details: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  eventId: ID;
}
