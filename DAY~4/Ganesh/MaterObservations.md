**Todays Major Learnings**

### Using ngModel along with the reactive model signal 
```
Using ngModel paired with a Model Signal (model()) in Angular combines the robust form-handling capabilities of template-driven forms with the modern performance and reactivity of Angular Signals.
Instead of traditional two-way data binding with standard mutable class properties, binding [(ngModel)] directly to a ModelSignal gives you the following advantages:
🚀 Key Advantages:
Fine-Grained Change Detection: Traditional ngModel triggers a top-down dirty checking sweep across component views. Pairing it with a Model Signal enables target-specific updates, bypassing heavy framework re-checks and supporting future zoneless rendering.
Bidirectional Output Notification: Unlike a standard input() signal which is strictly read-only, a model() signal automatically registers an internal output event emitter. When the user types into the ngModel field, it updates the signal value and instantly propagates the change to the parent component.
Less Boilerplate: It removes the requirement for separate @Input() and @Output() variableChange = new EventEmitter() combinations. One single line (username = model('')) manages both input and output pipelines seamlessly.
```