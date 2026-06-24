
## Component

* The Blueprint (Selector): This is just a custom HTML tag you invent (like <app-login>). Whenever you drop that tag into your code,it stamps all it information
* The Skeleton (Template): This is the basic HTML code. It defines what items (buttons, text, inputs) inside it
* The Paint (Styles): This is the CSS. The best part? The paint you apply to this brick won't accidentally spill over and color any other brick on your website. It is locked inside

## ngOnInit
* Why use it? You never load data inside the constructor (that’s just for setting up internal machinery). You use ngOnInit to go grab your data.
* Real-world analogy: The moment you turn on your phone, it immediately checks the cell tower for new messages. That initial check is ngOnInit.

## ngOnDestroys
* Why use it? If your component was running a continuous timer or listening to a live data stream in the background, it won't stop by itself just because the UI vanished. It will keep running in your computer's hidden memory, slowing everything down (Memory Leak). You use ngOnDestroy to pull the plug and turn it off safely.
* Real-world analogy: Before you leave a hotel room, you turn off the AC and the lights so you don't waste electricity. That cleanup is ngOnDestroy.