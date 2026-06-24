1. Objects
## An object is a collection of related data stored as key-value pairs.
```
const user: {
    name: string;
    age: number;
    isStudent: boolean;
} = {
    name: "Jagan",
    age: 22,
    isStudent: true
};

```

2. Interfaces

As applications grow, repeatedly writing object types becomes tedious.
Instead, we create an interface.
An interface is a blueprint that defines the shape of an object.

Syntax
interface User {
    name: string;
    age: number;
    isStudent: boolean;
}
function createUser(user: { name:string;age: number;email:string;}) {}
## why to use interface
interface User {
    name: string;
    age: number;
    email: string;
}

function createUser(user: User) {}

function updateUser(user: User) {}

3. Optional Properties

Some properties may not always exist.

Use ?.
interface User {
    name: string;
    age: number;
    phone?: string;
}

const user1: User = {
    name: "Jagan",
    age: 22
};

const user2: User = {
    name: "Ravi",
    age: 25,
    phone: "9876543210"
};

## Readonly Properties
Use readonly when a property should never change.
interface User {
    readonly id: number;
    name: string;
}
// user.id = 2; ❌ Error
user.name = "Ravi"; // ✅

## Interfaces with Functions
Interfaces can define function signatures.
interface AddFunction {
    (a: number, b: number): number;
}

const add: AddFunction = (a, b) => a + b;
