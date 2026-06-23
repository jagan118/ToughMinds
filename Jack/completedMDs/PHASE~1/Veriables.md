## Variables in TypeScript (let, const, var)
* Variables are containers used to store data.
```
let username: string = "Jagan";
Here:

let → variable keyword
username → variable name
string → data type
"Jagan" → value
```
## Use let when the value may change later
ex: let age: number = 22;
age = 23; // Allowed
console.log(age); // 23

Where do we use let?
Counter values
User input values
Loop variables
Variables whose values change

## Use const when the value should never be reassigned.
const prevents reassignment, but objects and arrays can still be modified.
ex: const pi: number = 3.14;
// pi = 3.1415; ❌ Error

Where do we use const?
API URLs
Configuration values
Values that shouldn't change
Function declarations

## 3. var ❌ (Avoid in modern TypeScript)
var is the old JavaScript way of declaring variables.
ex: var → Function Scope
if (true) {
    var y = 20;
}
console.log(y); // ✅ 20

Even though y was declared inside the if block, it is accessible outside.
This can lead to bugs.

```
Quick Comparison
Feature	let	const	var
Can reassign?	✅ Yes	    ❌ No	    ✅ Yes
Block scoped?	✅ Yes	    ✅ Yes	    ❌ No
Hoisted?	    ✅ Yes (TDZ)	✅ Yes (TDZ)	✅ Yes
Recommended?	✅ Yes	    ✅ Most preferred	❌ No
```