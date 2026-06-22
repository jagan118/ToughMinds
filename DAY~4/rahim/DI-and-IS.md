# Dependency Injection (DI) and Injectable Service (IS) in Angular

## First Important Note

When people say **AngularJS**, they often actually mean **modern Angular (Angular 2+)**.

This document explains **modern Angular** because that is where `@Injectable()` and modern Dependency Injection are used.

---

# 1. What is Dependency Injection (DI)?

Dependency Injection means:

> A component does not create the things it needs by itself.
> Angular creates and provides them automatically.

The component only says:

> "I need this dependency."

Angular supplies it.

---

## Without Dependency Injection

```ts
class Engine {}

class Car {
  engine = new Engine();
}
```

### What happens?

```text
Car
↓
creates Engine itself
↓
tight coupling
```

Problem:

- Harder to test
- Harder to reuse
- Components manage too many responsibilities

---

## With Dependency Injection

```ts
class Engine {}

class Car {
  constructor(engine) {
    this.engine = engine;
  }
}

let engine = new Engine();

let car = new Car(engine);
```

### What happens?

```text
Outside World
↓
creates Engine
↓
injects into Car
```

Car only uses the dependency.

---

# 2. Dependency Injection in Angular

Example:

```ts
@Component({})
export class Navbar {
  constructor(private router: Router) {}
}
```

### Under the hood

Angular secretly does something similar to:

```ts
let router = new Router();

let navbar = new Navbar(router);
```

You never write this manually.

Angular handles it.

---

# 3. What is Injectable Service (IS)?

Injectable Service means:

> A class that Angular is allowed to create and inject.

Example:

```ts
@Injectable({
  providedIn: "root",
})
export class AuthService {
  login() {}
}
```

This class can now be used anywhere in the application.

Services usually contain:

- API calls
- Authentication
- Shared state
- Business logic
- Utility functions

---

# 4. What Does `providedIn:'root'` Mean?

Example:

```ts
@Injectable({
 providedIn:'root'
})
```

Meaning:

```text
Register service globally
↓
One shared instance
↓
Available throughout app
```

Example:

```text
Root Injector
 └── AuthService

Navbar
Profile
Dashboard
↓
all use same instance
```

---

# 5. Full Angular Flow

Code:

```ts
@Injectable({
  providedIn: "root",
})
class UserService {}

@Component({})
class App {
  constructor(private user: UserService) {}
}
```

Execution:

```text
Angular Starts
↓
Registers UserService
↓
App requests UserService
↓
Injector creates object
↓
Injects into App
```

Internally:

```ts
let user = new UserService();

let app = new App(user);
```

---

# 6. Real Life Example

Imagine a restaurant.

Without DI:

```text
Chef
↓
goes to farm
↓
gets vegetables
↓
cooks
```

With DI:

```text
Supplier
↓
provides vegetables
↓
Chef cooks
```

Mapping:

```text
Supplier → Injector

Vegetables → Service

Chef → Component
```

Chef focuses only on cooking.

---

# 7. Angular Example

Service:

```ts
@Injectable({
  providedIn: "root",
})
export class UserService {
  getUser() {
    return "Rahim";
  }
}
```

Component:

```ts
@Component({})
export class Dashboard {
  constructor(private user: UserService) {}
}
```

Flow:

```text
Dashboard
↓
asks UserService
↓
Injector provides
↓
Dashboard uses
```

---

# 8. React vs Angular Comparison

| Concept              | React                    | Angular               |
| -------------------- | ------------------------ | --------------------- |
| Dependency Injection | Manual passing / Context | Built-in DI           |
| Shared Logic         | Hooks                    | Services              |
| Global State         | Redux / Zustand          | Services              |
| API Layer            | Axios / React Query      | HttpClient + Services |
| Routing              | React Router             | Angular Router        |
| Object Creation      | Usually manual           | Injector controlled   |
| App Structure        | Library ecosystem        | Framework             |

---

# 9. Final Mental Model

```text
Service
=
Reusable functionality

@Injectable()
=
Allow Angular to manage it

Dependency Injection
=
Request dependency

Injector
=
Creates and supplies dependency

providedIn:'root'
=
Store globally
```

Short version:

Angular components ask.

Injector provides.

Services work.
