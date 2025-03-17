declare module 'firebase' {
  import { Database } from "firebase/database";

  export const database: Database;
  export const ref: typeof import('firebase/database').ref;
  export const set: typeof import('firebase/database').set;
  export const onValue: typeof import('firebase/database').onValue;
}
