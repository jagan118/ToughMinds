
```
The Problem It Solves
You're building a form with an input field. You want:

Auto-trim whitespace
Auto-convert to uppercase
Show a validation error with a red border
Disable the field on certain conditions

Without directives, you'd copy-paste the same logic across 10 components. Directives = reusable DOM manipulation logic that you attach to any element.

What a Custom Directive Actually Does
A directive intercepts element creation/updates and modifies:

Styles
Attributes
Event listeners
DOM structure (structural directives)

Two types:

Attribute Directive – modifies the element itself ([appHighlight])
Structural Directive – adds/removes elements (*appIf)


```

```
## steps
1. generate directives using ng g d folder/<name> 2 files are created directive.ts testing
2. write the directve logic in file ts 
3. directive file mention standalone :true
4. to use it in component :
    1.import directive class in component
    ex:import { HighlightDirective } from './highlight.directive';
    2.then import to component decorator 
    ex:imports: [HighlightDirective],
    3.use inputs in elements 
        rules:in directive ts file selector will given 
        * mention that in element like appColorChangeDirective

    <p appColorChangeDirective BgColor="lightblue" textColor="navy">Hover meee</p>
    <p appColorChangeDirective BgColor="black" textColor="white">Hover meee</p>

Why This Happened
Angular sees:

@Directive({ selector: '[appColorChangeDirective]' }) → "Look for elements with [appColorChangeDirective] attribute"

If the attribute isn't there → directive never initializes
So @HostListener never listens, @Input values are ignored



```
```
1.for task clicklimit
steps 
1. create directive files 
write logic for it 
i obsrved that :
    1.first get input from user @Input
    2.write logic in hostlistner
    3.emit  a event after limit reached for that declare  a emiter called  EventEmitter<void>(); by output which passes data to component
    @Output() onLimitReached = new EventEmitter<void>();
    4. use the emited event in component.


how structural diretives works:
UI Interaction ➔ Component Data Changes ➔ Value Passes Through Template Bridge ➔ Directive Receives Input ➔ Directive Evaluates Condition ➔ Container Clears or Stamps the HTML Template

2. for task display or hide buttons elements or data in component using directives 
    flow is:    
        UI Click ➔ radio.set() updates Component Signal ➔ Signal Rings Bell ➔ HTML Bridge passes value to Directive Input ➔ Directive Setter updates Internal Signal ➔ Directive Effect fires ➔ DOM is cleared and rebuilt.  

3. Change search box text colour using custom directives
    steps:
        1.create directives called changeText
        2.create ui in html like 
        <input type text > and bind signal if u need
        3.in directive create @inputs for take data from component html
            ex:@Input TextColor ='red'
        4.bind a event listner to host listner and write event method 
        for this 'input' listner method 'onInput' 
        5.in onInput() method u will apply text color for that in construction create a veraible ex el with Elementref type
        6. in onInput method using this.el.nativeElement.style.color=TextColor;u will update the text color
        7.to use this directive or to apply this in html for input u need to use directive selector as atribute and pass the data that u want to pass with the veraible name in directive as a input 
        8.like this when user types in input 
            the attributes in that input and to pass data to directive bridge for directive will go to the directive and it activates in the directive the logic written -> event listner logic fires and changes the text it will appear  
```
// DecoratorWhat It Does
// @Input()Pass data INTO the directive
// @Output()Emit events FROM the directive
// @HostListener()Listen to element events (click, hover, focus, etc.)
// @HostBinding()Bind to element properties directly
// ElementRef: Access the DOM element
// TemplateRef: Access the <ng-template> (for structural directives)
// ViewContainerRefCreate/destroy views dynamically