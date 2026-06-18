## Signals
# Create and manage dynamic data.
## In Angular, you use signals to create and manage state. A signal is a lightweight wrapper around a value.
# Use the signal function to create a signal for holding local state:

```
import {signal} from '@angular/core';
// Create a signal with the `signal` function.
 const firstName = signal('Morgan');
// Read a signal value by calling it— signals are functions.
 console.log(firstName());
// Change the value of this signal by calling its `set` method with a new value.
 firstName.set('Jaime');
// You can also use the `update` method to change the value
// based on the previous value.
 firstName.update((name) => name.toUpperCase());
 ```

## Computed expressions
A computed is a signal that produces its value based on other signals.

``` import {signal, computed} from '@angular/core';
const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN ```

A computed signal is read-only; it does not have a set or an update method. Instead, the value of the computed signal automatically changes when any of the signals it reads change: