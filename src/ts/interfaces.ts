export interface User {
  readonly name: string;
  role?: "admin" | "user" | "staff";
}

class UserC implements User {
  name: string;
  role?: "admin" | "user" | "staff" | undefined;
  ID!: number; // ToDo muss declared werden, da sonst die Klasse nicht instanziiert werden kann. Muss aber nicht in der Interface definiert werden.
  constructor(name: string) {
    this.name = name;
  }
}
interface Car {
  tire_count: 2 | 3 | 4;
}

interface Employee extends User, Car {
  is_staff: boolean;
}

let carl: Employee = {
  tire_count: 4,
  name: "Karl",
  is_staff: true,
};

type ID = number | string;
let id: ID = "123";
