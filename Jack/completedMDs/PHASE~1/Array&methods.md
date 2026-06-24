## Arrays and aray methods
* An array is a collection of multiple values stored in a single variable.

1. Declaring array in ts
2 - wayss
const numbers: number[] = [10, 20, 30];
or
const numbers: Array<number> = [10, 20, 30];

3. for mixed types 
const data: any[] = ["Jagan", 22, true];
```
4. push()--add at last & pop() -- remove at last
    * Loop through array use foreach all true values
    * map() transforms every element and returns a new array.
    it returns a new array 
    ex: const numbers = [1, 2, 3, 4];
        const doubled = numbers.map(num => num * 2);
        console.log(doubled);
    * filter() selects elements that satisfy a condition.
    ex:const numbers = [10, 15, 20, 25, 30];
        const greaterThan20 = numbers.filter(
        num => num > 20
        );
        [25,30]
    * reduce() reduces an array into a single value.
          ex:Sum ,Average ,Total-price ,Count ,min,max
        ex: const numbers = [10, 20, 30];
                const total = numbers.reduce(
                     (sum, num) => sum + num
                    ),0;
```
* returns booleans:
1. find()
Returns the first matching element.
2. some()
Returns true if at least one element matches.
3. every()
Returns true if all elements match.

Use map() when you want to transform data.
Use filter() when you want to select data.
Use reduce() when you want to combine data into a single value.