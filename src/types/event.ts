import { Base } from "./base";
import ID from "./id";

export default interface Event extends Base {
  name: string;
  deadline: Date;
  startAt: Date;
  userId: ID;
}
