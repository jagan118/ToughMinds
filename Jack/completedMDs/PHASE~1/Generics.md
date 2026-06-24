## Generics (<T>) in TypeScript

* Generics allow us to write reusable and type-safe code.

* Instead of writing separate functions or classes for different data types, we can write one generic version that works with many types.
ex:Suppose you want a function that returns the value passed to it.

without generics
function getValue(value: string): string {
    return value;
}//only stringss

function getNumber(value: number): number {
    return value;
}//only numberss
//duplicate code moree

* with generics
function getValue<T>(value: T): T {
    return value;
}
<T>> is a type parameter.
T is just a placeholder name (like a variable for types).
You can replace T with any type.

console.log(getValue<string>("Hello"));
console.log(getValue<number>(100));
console.log(getValue<boolean>(true));

* Type Inference
means u dont need to mention type when calling at this time 
ex: console.log(getValue<string>("hello"));
we can simply : console.log(getValue("Hello"));

Most of the time, you don't need to specify the type explicitly.

## Generic Arrays
function getFirstElement<T>(arr: T[]): T {
    return arr[0];
}
const firstNumber = getFirstElement([10, 20, 30]);
const firstName = getFirstElement(["Jagan", "Ravi"]);

## Multiple Generic Types

You can use multiple type parameters.

function createPair<T, U>(first: T, second: U) {
    return {
        first,
        second
    };
}

Usage:

const pair = createPair<string, number>(
    "Age",
    22
);
output
{
    first: "Age",
    second: 22
}

## Generic Interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
}

Example 1:

interface User {
    id: number;
    name: string;
}

const response: ApiResponse<User> = {
    success: true,
    data: {
        id: 1,
        name: "Jagan"
    }
};

## Generic Constraints

Sometimes you want to restrict what types can be used.

Example:

function getLength<T extends { length: number }> (item: T): number {
    return item.length;
}

Valid:

console.log(getLength("Hello"));
console.log(getLength([1, 2, 3]));

## Generic Classes
class Box<T> {
    constructor(public value: T) {}

    getValue(): T {
        return this.value;
    }
}

Usage:

const numberBox = new Box<number>(100);
const stringBox = new Box<string>("Hello");

console.log(numberBox.getValue());
console.log(stringBox.getValue());

```
Common Generic Names
Name	Meaning
T	Type
U	Second Type
K	Key
V	Value
```

Use generics when:

The same code should work with multiple types.
You want reusability without losing type safety.
You're building reusable functions, classes, or interfaces