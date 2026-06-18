# Templates
Use Angular's template syntax to create dynamic user interfaces.
## Component templates aren't just static HTML— they can use data from your component class and set up handlers for user interaction

### You can create a binding to show some dynamic text in a template by using double curly-braces:
```
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{ userName() }}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

## Setting dynamic properties and attributes
Angular supports binding dynamic values into DOM properties with square brackets:
```
@Component({
  /*...*/
  // Set the `disabled` property of the button based on the value of `isValidUserId`.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

## If you need to pass the event object to your listener, you can use Angular's built-in $event variable inside the function call:
```
template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
```

## Control flow with @if and @for
```
<h1>User profile</h1>
@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
} @else {
  <h2>User settings</h2>
  <!-- ... -->
}
```
```
<h1>User profile</h1>
<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{ badge.name }}</li>
  }
</ul>
```