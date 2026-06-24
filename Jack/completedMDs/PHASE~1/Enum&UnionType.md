
## Enums in TypeScript

An Enum (Enumeration) is a special TypeScript feature that allows us to define a set of named constants.

Instead of using hardcoded values like strings or numbers throughout your code, you can use meaningful names.


## Rule of Thumb

If a variable can only have a limited number of values, consider using an enum.

enum Theme {
    Light = "LIGHT",
    Dark = "DARK"
}

let currentTheme: Theme = Theme.Dark;

const Role = {
    Admin: "ADMIN",
    User: "USER"
} as const;

Modern TypeScript projects often prefer objects with as const, but enums are still widely used.


```
1. Union Type
let value: string | number;
Means:

"value can be either a string or a number."

2. Type Guard
if (typeof value === "string") {
    console.log(value.toUpperCase());
}
Means:
"Check the type before using it."

Rule of Thumb;

Use Union Types when a value can have multiple possible types.
Use Type Guards to safely work with those values.
function print(
    value: string | number
) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }
}

Union types and type guards are heavily used in modern TypeScript applications, especially when handling API responses, user input, and external data.

```