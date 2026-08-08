// primitive Types

let myString: string = "das ist ein String"; // Bsp. "as12"," "0"
let myNumber: number = 123; // Bsp. 1655, 15.3, NaN
let myBoolean: boolean = false; //Bsp: true

let myNull: null = null;
// Wenn man ein Arry füllt mit 5 Werten aber der eine Wert noch  nicht definiert ist, null reinschreiben und nicht undefined.
let myUndefined: undefined;
// undefined ist einfach nicht da, nicht definiert, man weiß nicht was das sein soll.

// weitere primitive types: bigInit Symbol

let myAnyType; // Hat den Wert any
// any einfach vermeiden

// Zuweisungen

let myVariable = "hallo";
myVariable = 123; // Der Fehler wird angezeigt, weil die Variable den type number hat.

// Union-Type
let myUNIONType: string | number = "halle"; //Bsp. UNION-Type, die Variable hat beide types. String oder number
myUNIONType = 123; //Durchd en UNION-Type ist der Zahlenwert jetzt auch gültig und kein Fehler mehr.
let anotherVariable: number | undefined; //SOllte im zweifel vermieden werden.
anotherVariable = 123;
anotherVariable;

class MyClass {
  myAttr: string;

  constructor() {
    this.myAttr = "123";
  }
}

let myLiteral: "admin" | "staff" | "member" | 42 = 42;

let myFirstArry: number[] = [123, 1234654, 987465];
let mySecondArry: (string | number)[] = [123, 1234654, "Hallo"];
let myThirdArry: (string | boolean | number)[] = [123, true, "Hallo"];
let myFourthArry: string[] | number[] = [];

// Tupels

let myTupelArray = ["admin", 42];
let myTupelSecondArray: [string, number, number] = ["admin", 42, 123]; // das tupel ist hier dies: [string, number, number]

function withReturn(a: number, b: number): number {
  return a + b;
}

function withoutReturn(name?: string): void {
  console.log(name ? name : "unknown");
}

let firstProduct: {
  name: string;
  price?: number;
} = {
  name: "book",
  price: 42,
};

let secondProduct: {
  name: string;
  price?: number;
  logger: (msg: string) => void;
} = {
  name: "book",
  logger: (msg) => {
    console.log(msg);
  },
};

//Interfaces

function logAdmin(user: User): User {
  return user;
}

// Import/Export

import { User } from "./interfaces";

let a: unknown;

if (typeof a == "string") {
  let b = a.toUpperCase();
}
