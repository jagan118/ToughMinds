## mouse Event,Syntax,Purpose / When to use it
1. Click,(click),"User clicks an element (Buttons, links, cards)."
2. Double Click,(dblclick),"User double-clicks an element (e.g., zooming or editing a row)."
3. Mouse Enter,(mouseenter),Mouse cursor moves onto an element (Great for hover dropdowns/tooltips).
4. Mouse Leave,(mouseleave),Mouse cursor moves off an element (Hiding tooltips/dropdowns).
5. Mouse Move,(mousemove),"Mouse is moving inside an element (Tracking coordinates, drawing canvases)."
6. Mouse Over,(mouseover),"Similar to mouseenter, but triggers even when moving over child elements."
7. Mouse Out,(mouseout),"Similar to mouseleave, triggers when moving out of child elements."
8. Context Menu,(contextmenu),User right-clicks (Used to override the default browser right-click menu).

## keyboard Event,Syntax,Purpose / When to use it
1. Key Up,(keyup),User releases a key after pressing it (Best for real-time search boxes).
2. Key Down,(keydown),User presses down a key (Best for intercepting shortcuts like Ctrl+S).
3. Key Press,(keypress),"User presses a character key (Deprecated in modern browsers, use keydown)."

## Input Event,Syntax,Purpose / When to use it
1. Input,(input),Triggers instantly every time a value changes inside a textbox/textarea.
2. Change,(change),"Triggers when value changes and the user clicks away (Drop-downs, checkboxes)."
3. Submit,(submit) / (ngSubmit),Triggers when a user clicks a form submit button or presses Enter inside a form.
4. Focus,(focus),"User clicks inside an input field (Highlighting the field, showing hints)."
5. Blur,(blur),User clicks out of an input field (Great for instant form validation).

## Scroll Event,Syntax,Purpose / When to use it
1. Scroll,(scroll),User scrolls up or down a container or page (Infinite scroll loading).
2. Resize,(window:resize),The browser window size changes (Adjusting UI elements dynamically).
3. Load,(load),An image or iframe finishes downloading completely.
4. Error,(error),An asset (like a broken image URL) fails to load (Used to show fallback images).

## drag Event,Syntax,Purpose / When to use it
1. Drag Start,(dragstart),User starts dragging an item.
2. Drag Over,(dragover),An item is being dragged over a valid drop zone.
3. Drop,(drop),"User releases the mouse, dropping the item into the zone."