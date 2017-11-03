## What is it?

fitToParent is a tool that will resize a DOM element to fit its parent container while maintaining its original aspect ratio. Kind of like `background-size: contain;` for anything.

## Installation

Just grab `fitToParent.min.js` from this repo and include it in the head of your page. If using with jQuery or Zepto, make sure fitToParent is called after the core library.

If you're use NPM or yarn:
```
npm install fit-to-parent --save
```

## Basics

If you have an iframe that needs to fit to its parent element:

```js
var vid = document.querySelector('iframe');

// sets iframe size
fitToParent(vid);

// Most of the time we will need to update on resize as well
window.addEventListener('resize', function(){
    fitToParent(vid);
});
```

You can either pass a DOM element to fitToParent, like the example above, or you can pass an object of options including the element like so:
```js
fitToParent({
    element: vid,
    heightOffset: 200
})
```

When using jQuery or Zepto, fitToParent will just attach itself as a plugin:

```js
$('iframe').fitToParent();
$(window).on('resize', function(){
    $('iframe').fitToParent();
});
```

### Aspect Ratio

When sizing the element, fitToParent will need to know the aspect ratio of the element. Unless explicitly set, fitToParent will attempt to calculate the ratio of the element automatically. This happens once the first time it's called on that particular element, and then it will use the calculated value each consecutive call.

When determining the ratio for a single element, fitToParent will run in this order:

1. Ratio set manually in options (see 'Options' below)
1. Ratio defined as a data attribute on the element, as the property 'aspect'
1. Calculated ratio using the sizes passed to `elHeight` and `elWidth` (see 'Options' below)
1. Calculated ratio using the `height` and `width` attributes set directly on the element
1. Calculated ratio using the intended `height` and `width` of the element as set in css
1. If none of these options are available, fitToParent will measure the height and width of the element directly as rendered in the DOM and calculate the ratio from that

__examples__:

for this markup:
```html
<div class="stage">
    <iframe src="https://vimeo...." width="640" height="360"></iframe>
</div>
```

Calling `$('iframe').fitToParent()` will calculate the ratio based on attributes, so it will come up with 1.77 (which is 640 / 360).

Calling `$('iframe').fitToParent({ elWidth: 1920, elHeight: 800  })` will calculate with the provided dimensions and come up with 2.4

Calling `$('iframe').fitToParent({ ratio: 2 })` will use the provided value of 2.

### Parent element

When determining the size of the parent to fit to, fitToParent looks in this order:

1. Sizes passed into `parentHeight` and `parentWidth` (see 'Options' below)
1. The size of the closest ancestor element with the class `size-parent`
1. If no `.size-parent` found, then it uses the size of the direct parent element

__examples__:

Calling `$('iframe').fitToParent()` will use the above logic to figure out the intended size.

Calling `$('iframe').fitToParent({ parentHeight: 200 })` will use 200px as the parent height and the width of `.size-parent` as the parent width.

## Example
An example of a common Vimeo embed sized and centered in the window

```html
<div class="stage">
    <iframe src="https://player.vimeo.com/video/20744468" width="640" height="360"></iframe>
</div>
```

```css
.stage {
    height: 100vh;
    width: 100%;
    display: flex;
}
iframe {
    margin: auto;
}
```

```js
$(document).ready(function(){
    $('iframe').fitToParent();
    $(window).on('resize', function(){
        $('iframe').fitToParent();
    });
}):  
```

You can find full examples in the "examples" folder of this repo.

## Options

Common options for basic use
```js
fitToParent({
    element: null,      // (obj) Dom element to set size for (not needed with jQuery or Zepto)
    heightOffset: 0,    // (int) Put some space around the element
    widthOffset: 0,     // (int) Put some space around the element
    upres: true         // (bool) allows fitToParent to size the target element above initial size
    callback: function([newWidth, newHeight]){

        // Fires after fitting is complete
        // this === element

    }
});
```

Less common options when manual overrides are needed:
```js
fitToParent({
    parentHeight: null, // (int) Height to fit to, defaults to parent height
    parentWidth: null,  // (int) Width to fit to, defaults to parent width
    elHeight: null,     // (int) Starting height of element, see "aspect Ratio" above for default value
    elWidth: null,      // (int) Starting width of element, see "aspect Ratio" above for default value
    ratio: null,        // (float) Intended aspect ratio of element (width/height). Uses info from DOM by default
})
```

It's important to note that fitToParent is **not** an asynchronous operation. When used purely as a function it will return its output synchronously. That being said, it's still often useful to have a callback when using fitToParent as a jQuery plugin.

## Advanced usage

### Using with jQuery/Zepto
If you're using fitToParent in a module system and you want it to act as a jQuery/Zepto plugin:

* Import jQuery first
* Import fitToParent with: `import 'fitToParent/dist/fitToParent.min'`

This way you'll be able to use fitToParent like this:

`jQuery('.selector').fitToParent({})`

### DOM-less use
fitToParent may be useful to you even in environments with no DOM. There's no reason an element has to be provided as an argument, you could set the numbers manually and only use the return value like this:

```js
import fitToParent from 'fit-to-parent'

// fitting a square into a 16:9 container
const [newWidth, newHeight] = fitToParent({
    ratio: 1,
    parentWidth: 1920,
    parentHeight: 1080
})

// do something with calculated dimensions

```

## Development
```
npm install
npm run dev
```

Runs a webpack dev server and opens the page.

### Structure
FitToParent consists of two main sections:

* the `fitToParent` function, a calculator based on aspect ratios, offsets, and other options
* the `src/webpack-entry.js` functionality, which ties that calculator to jQuery, Zepto, or vanilla JS.

The fitToParent doesn't assume that a browser exists, instead just giving you access to the basic calculator functions of the plugin. `webpack-entry`, on the other hand, assumes a browser environment, plugging into (in order of most to least preferred) jQuery, Zepto, or the window as a global function.

## More Info
Originally by Drew Baker, based on improvements to [the answer from @TrueBlueAussie](http://stackoverflow.com/questions/18838963/proportionally-scale-iframe-to-fit-in-a-div-using-jquery) developed over time.

--------

__fitToParent__

http://funkhaus.us

Version: 1.3.2

* 1.3.2 - Updated to webpack-dev-server, organized files, set up lib/ and dist/
