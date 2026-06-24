# Data types in typeScript
* In TypeScript, you declare variables by writing the variable name followed by a colon (:) and the type.

let variableName: Type = value;

```
let username: string = "Jagan";
let age: number = 22;
let isStudent: boolean = true;
let apiResponse: unknown = { success: true };
let selectedCourse: string | null = null;

```
## Why do we specify types?
1. in other scripts it allows to chnage the data type any time but in type script it wouldnt

```
Without TypeScript:

let age = 22;
age = "twenty two"; // Allowed ❌

With TypeScript:

let age: number = 22;
age = "twenty two"; // Error ✅

This catches bugs while writing code instead of at runtime.
```