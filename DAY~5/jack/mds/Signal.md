## Core Concepts of Signals
## Signals are built on three fundamental concepts:
* 1. Writable Signals
Technical Definition: A reactive value wrapper that allows both direct reads and direct writes/updates to its state payload.

2. Computed Signals
* Technical Definition: A read-only reactive variable that derives its value from one or more other signals. It is lazily evaluated and internally cached (memoized).

3. Effects
* Technical Definition: An operation or callback function that runs automatically whenever any of the signals it references inside its block change their value.

