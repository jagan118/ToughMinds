## classes in typescript
class User {
    //properties
    name: string;
    age: number;

        //initialization
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    methods behaviour
    greet(): void {
        console.log(`Hello, I am ${this.name}`);
    }
}
const user1 = new User("Jagan", 22);
const user2 = new User("Ravi", 25);

user1.greet();
user2.greet();

2. Constructor:
A constructor is a special method that runs automatically when an object is created.
new User() creates an object.
Constructor initializes the object's data.

4. Access Modifiers

TypeScript provides three access modifiers:
1. public (Default)
Accessible from anywhere.
    public name: string;


2. private
Accessible only inside
    private balance: number = 1000;
Use private to protect sensitive data.

3. protected
Accessible inside the class and its child classes.
        protected name: string;

4. Inheritance
Inheritance allows one class to acquire properties and methods from another class.
    Use extends.
    class Dog extends Animal {}
Dog inherits everything from Animal.

5. Method Overriding
A child class can replace a parent class method.

6. super Keyword
super refers to the parent class.
Without super(), the child class cannot access the parent constructor,methods

7. short constructor syntaxxx:
u can skip the defining of properties!!
class User {
    constructor(
        public name: string,
        public age: number
    ) {}
}

## OOPsss

```
1. Encapsulation
Hiding internal details.
    ex: private balance: number;

2. Inheritance
Reusing code from parent classes.
    ex: class Dog extends Animal {}

3. Polymorphism
Same method, different behavior.
    makeSound() a method can bee
Animal → generic sound
Dog → bark

4. Abstraction
Showing only essential details and hiding complexity.
Example:
car.start();
You don't need to know how the engine works internally.
```