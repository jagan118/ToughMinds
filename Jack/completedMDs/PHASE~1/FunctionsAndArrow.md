## 3. Functions & arrow functions

function functionName(parameters): returnType {
    // code
}

ex: function greet(name: string): string {
    return `Hello, ${name}`;
}

console.log(greet("Jagan"));

## If a function doesn't return anything, use void.
function printMessage(message: string): void {
    console.log(message);
}

printMessage("Welcome!");

## Use ? when a parameter is optional.
function greetUser(name: string, city?: string): string {//code}

## Arrow Functions
Arrow functions are a shorter way to write functions.
const functionName = (parameters): returnType => {
    // code
};

* Arrow Function (Short Form)
If there is only one line, you can omit {} and return.

const square = (num: number): number => num * num;

* Arrow Function Without Parameters
const sayHello = (): void => {
    console.log("Hello World");
};

```
Use normal functions for reusable utility functions.
Use arrow functions for callbacks and modern application code.

function calculateTotal(price: number): number {
    return price * 1.18;
}

const showMessage = (msg: string): void => {
    console.log(msg);
};
```