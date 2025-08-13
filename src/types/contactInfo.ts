import { Base } from "./base";
import ID from "./id";

export default interface ContactInfo extends Base {
  name: string;
  phoneNumber: string;
  eventId: ID;
}
