## 1. Interpolation: One-Way (Component $\rightarrow$ HTML)
* This is used to display text or numbers from your TypeScript file directly onto the screen.
The Syntax: Double curly braces {{ variableName }}
In Simple Terms: "Hey HTML, look at my TypeScript file, grab the value of this variable, and print it right here."

## 2. Property Binding: One-Way (Component $\rightarrow$ HTML Attribute)
* This is used when you want to control HTML attributes (like a button's disabled state, an image's src, or a checkbox's checked status) using your code.
The Syntax: Square brackets [attribute]="variableName"
In Simple Terms: "Hey HTML, don't hardcode this setting. Look at my TypeScript variable to decide if this button should be clickable or if this image should show up."

## 3. Two-Way Binding: Both Ways (Component $\leftrightarrow$ HTML)
This is most commonly used in forms and inputs. It links a variable and an input field together so that if one changes, the other changes automatically.
1. The Syntax: The "Banana in a Box" [(ngModel)]="variableName"
2. In Simple Terms: "If I type something into this input box, update the TypeScript variable instantly. If my TypeScript code changes that variable, update what's written in the input box instantly."

## Event Binding: One-Way (HTML $\rightarrow$ Component)
* Event binding is how you listen for user actions on the screen (like a click, a keystroke, or a mouse hover) and respond to them by running a function in your TypeScript code.
The Syntax: Parentheses (event)="function()"
In Simple Terms: "Hey Angular, watch this HTML element. The moment the user does X action, immediately run Y function in my TypeScript file."