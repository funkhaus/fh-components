Reusable components and directives for Vue. Designed for [Vuepress](https://github.com/funkhaus/vuepress), but most components work in regular Vue apps.

`fh-components` saves you the trouble of rewriting common components like images, video players, svgs, and several other elements. If you're looking at writing a custom component in Vuepress, check if one already exists here first - and if it doesn't, feel free to [contribute](#contributing)!

# Table of Contents
1. [Installation](#installation)
1. [Components](#components)
    1. [a-div](#a-div)
    1. [flex-text](#flex-text)
    1. [hamburger-button](#hamburger-button)
    1. [responsive-image](#responsive-image)
    1. [slide-show](#slide-show)
    1. [split-text](#split-text)
    1. [transition-fade](#transition-fade)
    1. [video-stage](#video-stage)
    1. [velocity-animate](#velocity-animate)
    1. [wp-content](#wp-content)
    1. [wp-menu](#wp-menu)
1. [Directives](#directives)
    1. [full-height](#full-height)
    1. [in-view](#in-view)
    1. [reverse-hover](#reverse-hover)
1. [Testing](#testing)
1. [Contributing](#contributing)
    1. [Prep](#prep)
    1. [New Components](#new-components)
    1. [Documentation](#documentation)
    1. [Tests](#tests)

# Installation
`npm install fh-components --save`

When you register components:

```js
import ComponentName from 'fh-components/component-name'

// Global in main.js...
Vue.component('component-name', ComponentName)

// ...or local to a .vue file...
export default {
    components: {
        'component-name': ComponentName
    }
}

// ...or a global component one-liner (no `import` statement needed)
Vue.component('component-name', require('fh-components/component-name').default)
```

# Components

## `a-div`
**Props**
* `href`: String, default empty. URL to link to.
* `new-window`: Boolean, default `true`. If component renders as an `<a>` tag, open in a new window.
* `replace-with`: String, default `div`. If the `href` isn't a link, render contents inside this tag instead.

**Classes**
* `anchor-div`
* `a-${ replace-with }` (substitutes with the `replace-with` tag name)

**Notes**:
* Renders content in a `<router-to>` tag if `href` starts with `/`
* Renders content in an `<a>` tag if `href` is a truthy value not starting with `/`
* Renders content in a given tag (`replace-with`, default `div`) if `href` is falsey.

## `flex-text`

## `hamburger-button`
**Classes**
* `hamburger`
* `activated`: when `$store.state.menuOpened` is `true`

**Notes**
* Lightweight hamburger SVG with open and closed states. Calls Vuepress's `'OPEN_MENU'` or `'CLOSE_MENU'` when clicked, depending on current `activated` state. Will also update correctly when menu is opened or closed elsewhere.

## `responsive-image`
**Props**
* `object`: Object, default `{}`. Serialized [Rest-Easy attachment](https://github.com/funkhaus/Rest-Easy#serializer-filters). Fills out the rest of these props automatically except `fit`.
* `html`: String, default ''. Desired <img> element as an HTML string. Provides all the sizing, fade-in, etc. benefits of a regular responsive-image.
* `src`: String, default empty. Works like `<img src>`.
* `video-src`: String, default empty. an optional video URL if the component should display a looping video rather than an image.
* `height`: String or number, default empty. Natural image height in pixels.
* `width`: String or number, default empty. Natural image width in pixels.
* `aspect`: String or number, default empty. Aspect ratio of desired image, as a percentage. `aspect="56.25"` would evaluate to a 56.25% aspect ratio. Calculated from height and width if not explicitly stated.
* `size`: String, default `'full'`. WordPress image size.
* `color`: String, default `'transparent'`. Background placeholder color. Any CSS-compatible color is valid.
* `respect-max`: Boolean, default `false`. Whether the image will have a `max-width` and `max-height` based on its natural dimensions.
* `fill-space`: Boolean, default `false`. When `true`, position absolutely and force the image to take up all available space; when `false`, use the image's natural aspect ratio.
* `fit`: String, default `'cover'`. Object-fit value for the image - `cover` or `contain`.
* `poster`: String or post, default `''`. URL to [poster](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) for video. If `false`, no poster used; if blank, defaults to the parsed image source.

**Classes**
* `rsp-image-module`
* `fit-${fit}`: Either `fit-cover` or `fit-contain`, depending on the `fit` prop.
* `loading`: only active when image hasn't finished loading
* `fill-space`: only active if `fill-space` prop is set to `true`
* `has-video`: only active if `videoSrc` is truthy (see notes below).

**Notes**
* Creates and fades in an image. Adds a placeholder for the image with a given background-color to prevent content jumping when the image loads.
* If you add a link to an .mp4 video in the "Alt" field in WordPress, this element will create and render a video, using the provided image as the poster (see "Poster" under "Attributes" [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)).

## `slide-show`

This component creates a basic slideshow element that will cycle through a list of items that you provide.

### Props

| Name | Type | Default | Description |
| ---- | :----: | :-------: | ----------- |
| `slides` | Array | `[]` | Array of items to be iterated over and turned into slides. |
| `auto` | Boolean | `true` | Controls if slideshow should auto-advance. |
| `loop` | Boolean | `true` | If true, slideshow will loop from last item back to first |
| `infinite` | Boolean | `true` | If true, slideshow will do a `next` style transition when looping from last to first and vice versa. |
| `interval` | Number | `4000` | Time between auto slide transitions. |
| `delay` | Number | `500` | Time to delay before initiating auto slide interval. |
| `index` | Number/Object | `null` | Used to manually control the current active slide of the slideshow. This prop can be bidirectionally bound using the `sync` modifier. See more details on how to use in the section below. |
| `pagination` | Boolean | `true` | Controls if pagination elements should be rendered or not. |
| `localKeyboard` | Boolean | `false` | If true, slideshow will bind keyboard listeners to the slideshow DOM element. If false, keyboard events will be bound to window. |
| `nextKey` | Number | `39` | Keycode for which key will trigger the next action. Default is the right arrow. |
| `prevKey` | Number | `37` | Keycode for which key will trigger the prev action. Default is the left arrow. |
| `css` | Boolean | `true` | Controls if the transition should use CSS classes or not. Use this when overriding the default transition using the provided javascript hooks. |

### Classes
* `fh-slideshow`
* `transitioning`: Active when slideshow is mid transition
* `first-slide`: Active when the current index is the first slide
* `last-slide`: Active when the current index is the last slide

### Slots

In order to use this component, you'll have to utilize the [Scoped Slots](https://vuejs.org/v2/guide/components.html#Scoped-Slots) feature of vue components. This component has 4 available slots, and 2 of them are scoped.

**slide:** Template for a single slide element

This is the most important slot. It allows you to provide a template to the component telling it how to render each slide item you provided through the `slides` prop. The slot accepts 2 arguments, `slide` and `index`. `slide` holds the data of whatever item is being iterated over, and `index` is the current item's index. Here's a simple example usage:

```vue
<slide-show :slides="pages">
    <div class="slide" slot="slide" slot-scope="args">
        <responsive-image :object="args.slide.featuredAttachment" />
    </div>
</slide-show>
```

In this example the slot is being fed all provided arguments through the `args` object. The single property on the `args` object will be `slide`, which carries the value of a single page. In this example an image object is being provided to a responsive-image, but you can use any data from the slide object within this slot to render your template.

**pagination-item:** Template for a single pagination item in the slideshow

This is the second scoped slot, it's used to define a template that the component will use when rendering the pagination. It also supports a single argument, `slide`. Building on the last example:

```vue
<slide-show :slides="pages">
    <!-- ... -->
    <span slot="pagination-item" slot-scope="args">{{ args.slide.title }}</span>
</slide-show>
```

This would render a list of pagination items, each with the title of the page inside. Pagination elements are automatically given event listeners to trigger their corresponding slides when clicked, and the currently active pagination item is given the class `active`.

**nav-next:** Element to be used as the next trigger

This is a non-scoped slot that will render an element to be used as the next trigger when clicked. The component will automatically add the click listeners to this component. Example Usage:

```vue
<slide-show :slides="pages">
    <!-- ... -->
    <svg-image src="arrow-right.svg" slot="nav-next" />
</slide-show>
```

**nav-prev:** Element to be used as the prev trigger

This non-scoped slot functions exactly the same as `nav-next`, but triggers the previous action.

**before:** Element(s) to go within the slideshow just before the slide slot

This non-scoped slot allows you to add extra content into the slideshow that does not affect the functionality of the core elements.

**default:** Element(s) to go within the slideshow, after all other slots.

This non-scoped slot is the default and allows you to add extra content into the slideshow that does not affect the functionality of the core elements.

### Transitions

By default, there is a simple css slide transition being applied to the slideshow. It has the name `fh-slide-${ direction }`, with direction being either `next` or `prev` depending on which way the slideshow is going. For simple transitions it's easy to override the default. For example, if you wanted to take the existing transition but change the speed to 3s you might do this:

```css
.fh-slideshow.fh-slide-next-enter-active,
.fh-slideshow.fh-slide-next-leave-active,
.fh-slideshow.fh-slide-prev-enter-active,
.fh-slideshow.fh-slide-prev-leave-active {
    transition-duration: 3s;
}
```

If css transitions alone are not enough for the effect you want, you can opt to use js hooks instead. The full set of [js transition events](https://vuejs.org/v2/guide/transitions.html#JavaScript-Hooks) are proxied up to the main `slide-show` component, so you can catch them there and use javascript to create your effects. Keep in mind that when doing this you will want to set the `css` prop to false so that the transition element is forced into js mode.

## `split-text`
**Props**
* `elements`: String or Array, default `span`. Wrap each resulting line in this element with class `line-{ line number }`. If `elements` is an array, split-text will wrap each line in its respective element, using the last element for any extra lines.
* `separator`: String or Array, default `' &#8211; '`. Splits text by this separator. If set to an array, find the first separator that results in a split string and use that one.
* `pieces`: Number or Array, default `-1`. Only include these zero-indexed pieces of the split text. If set to -1 (default), include the full split text.
* `text`: String, default empty. Text to split.
* `wrapper`: String, default `span`. Element wrapping rendered lines.

**Notes**
* Splits given text according to a given separator. Useful for formatting titles, for example - `Title - More Title Information` will render as `<span>Title</span><span>More Title Information</span>`.
* Contains two slots, named `before` and `after`, that render their content before and after the split text.

## `transition-fade`
**Classes**
* [Transition classes](https://vuejs.org/v2/guide/transitions.html#Transition-Classes) applied to a transition called `fade`.

**Notes**
* Fades the contained element over 0.4 seconds.

## `velocity-animate`
**Props**
* `reset`: Boolean, default `true`. Whether or not the changed elements should have their inline styles reset after the animation complete.
* `sequence`: Array, default `[]`. Sequence to run on appear.
* `wrapper`: String, default `div`. Element in which to wrap the enclosed content.

**Classes**
* `velocity-animate`

**Notes**
* A component to ease creating multi-step Velocity transitions. The `sequence` refers to a Velocity [sequence](http://velocityjs.org/#uiPack), first introduced in the UI pack. Instead of raw elements, the `e` property should contain the ref of the desired element. For example:

```
<template>
    <velocity-animate :sequence="sequence">
        <h2 ref="title">I'm here!</h2>

        <h3 ref="subtitle">So am I!</h3>

        <p ref="body">I'm the body</p>
    </velocity-animate>
</template>

<script>
export default {
    computed: {
        sequence(){
            return [
                { e: 'title', p: { opacity: [1, 0] } },
                { e: 'subtitle', p: { opacity: [1, 0] } },
                { e: 'body', p: { translateX: [0, '-100%'] }, o: { sequenceQueue: false } }
            ]
        }
    }
}
</script>
```

This will make the h2 fade in, then the h3 fade in and p tag slide in from the left.
* `velocity-animate` also allows you to set initial states of elements by forcefeeding starting values. See [this section](http://velocityjs.org/#forcefeeding) of the Velocity docs for details. Instead of just animating from the second value to the first, velocity-animate sets the element's desired property to the second value from the start of the animation.

## `video-stage`
**Props**
* `src`: String, default `''`. The source of the video to embed. This can either be a full iframe code, or for Vimeo videos can just be a permalink to the video.
* `autoplay`: Boolean, default `true`. Controls whether the component should attempt to autoplay the video. Only vimeo videos support autoplay at the moment.
* `autoOffsets`: Boolean, default `true`. If set to true, the components will attempt to automatically calculate a fitToParent offset based on the dimensions of any slot elements provided.

**Slots**
* `before`: Renders directly before the element that holds the iframe.
* `after`: Renders directly after the element that holds the iframe.

**Notes**
* This component uses [`fitToParent`](https://github.com/funkhaus/fitToParent) to automatically scale and center the iframe within the dimensions of the nearest positioned parent element. Example usage:
`<video-stage src="https://vimeo.com/123456789" @ended="goToNextPage" />`.

**Events**
* Events are only supported for Vimeo-based videos.
* `ended`: fires once the video has reached the end.
* `play`: fires any time the video begins playback
* `pause`: fires any time the video is paused

## `wp-content`

**Props**
* `html`: String, default `''`. HTML that can function as a Vue template. The component will dynamically compile the contents, and inject the results into the vue component tree.
* `unwrap`: Array, default `['p > img', 'p > iframe']`. Array of CSS selectors describing elements to unwrap from their parent nodes. (WordPress automatically wraps newlines in `<p>` tags, so this is a useful feature to remove standalone media from those `<p>` tags.)
* `fitvids`: Boolean, default `true`. When set to true, the component will run fitvids on all content inside.
* `replace`: Array, default `[]`. Array of objects containing:
    * `selector` - String with CSS selector for elements to replace
    * `callback` - Function describing what to replace old element with. Accepts one argument referring to the old element; should return a String or Node with the element's replacement.

    This feature lets you replace items in `wp-content`. For example:

    ```
    <wp-content :html="contentHtml" :replace="[ { selector: 'img', callback: el => `<p>Image with source ${ el.src }</p>` } ]"
    ```

    This setting would replace all `img` tags with a `p` containing the text 'Image with source [element's source]'. Useful for modifying wp-content HTML before it is rendered on the DOM.

**Classes**
* `wp-content-placeholder`: only present when no html template is provided
* `wp-content-rendered`: only present when an html template was provided and successfully rendered

**Notes**
* This was built to allow components to be used with the the contents of a Wordpress post. It's very effective for that purpose, but more generally can be used to compile any dynamically loaded template and render it into the component tree. Be aware that this should only ever be used when the template going into the `html` prop is trusted.

## wp-menu

[Vuepress](https://github.com/funkhaus/vuepress)-specific component to build WordPress menus. Uses the `wp-menu-item` component internally.

### Props

| Name | Type | Default | Description |
| ---- | :----: | :-------: | ----------- |
| `slug` | String | `''` | The WordPress slug of the menu to use. |
| `name` | String | `'Main Menu'` | The WordPress name of the menu to use. |

### Classes

* `menu`
* `${ slug }`: Either the `slug` prop or a kebab-cased version of the `name` prop, whichever is available.

### Slots

This component comes with an optional [scoped slot](https://vuejs.org/v2/guide/components.html#Scoped-Slots) that will allow you to override the default markup for a single menu item.

**menu-item:** Template for single menu item within component

This slot accepts 2 arguments, `menuItem`, which carries the serialized object of the single item that is being iterated over, and `index`, which carries the index of the current menu item. Here is an example of how you might use it to add an arrow icon next to the name of each element in the menu:

```vue
<wp-menu name="Main Menu">
    <li slot="menu-item" slot-scope="{ menuItem, index }">
        <router-link :to="menuItem.relativePath">
            <svg-image src="arrow.svg" />
            <span>{{ index }}. </span>
            <span v-html="menuItem.title" />
        </router-link>
    </li>
</wp-menu>
```

# Directives
Directives are declared as attributes. Remember to prefix `v-` to the directive name (so `full-height` becomes `v-full-height`)!

To use fh-components directives in your Vue app:

```js
import directiveName from 'fh-components/v-directive-name'
Vue.directive('directive-name', directiveName)
```

To pass arguments to directives:
```
<my-component v-my-directive="{ key: 'value' }"/>
```

Directives may also have "modifiers" to go with them. Modifiers can be used like this:
```
<my-component v-my-directive.example />
```

## `full-height`
**Notes**:
* Sizes the element to 100% of the window height. Replacement for the occasionally buggy 100vh css value.

**Modifiers**
* `min`: If provided, directive will use the `min-height` css property rather than `height`.

## `in-view`
**Arguments**
* `above`: String, default `above-view`. Class when element is above the viewport.
* `below`: String, default `below-view`. Class when element is below the viewport.
* `inView`: String, default `in-view`. Class when element is within the viewport.
* `onEnter`: Function, default `null`. Method to call when an element enters view from anywhere. Accepts one argument, the element that has entered the viewport.
* `onEnterAbove`: Function, default `null`. Method to call when an element enters view from the top of the screen. Accepts one argument, the element that has entered the viewport.
* `onEnterBelow`: Function, default `null`. Method to call when an element enters view from below the screen. Accepts one argument, the element that has entered the viewport.
* `onLeave`: Function, default `null`. Method to call when an element leaves view from anywhere. Accepts one argument, the element that has ;eft the viewport.
* `onLeaveAbove`: Function, default `null`. Method to call when an element leaves view, going above the screen. Accepts one argument, the element that has left the viewport.
* `onLeaveBelow`: Function, default `null`. Method to call when an element leaves view, going below the screen. Accepts one argument, the element that has left the viewport.

**Notes**
* Applies classes to an element based on its viewport visibility.
* Can also fire callbacks when an element has entered or left the viewport.

## `reverse-hover`
**Arguments**
* `containerActivatedClass`: String, default `rh-active-within`. When a triggering component is hovered over or focused, the target element will have this class added to it.
* `elActivatedClass`: String, default `rh-active`. A triggering component that is hovered over or focused will have this class added to it.
* `processedClass`: String, default `rh-processed`. Triggering components will have this class added to them. (Usually left alone - mainly for internal directive use.)
* `selectors`: Array or String, default `['a']`. All children of the target element that match this selector will become triggering components, reverse-hover listeners attached.

**Notes**
* Allows for a "reverse hover" effect, where hovering over one element of a set affects all elements of a set. For example:

```html
<ul class="container" v-reverse-hover>
    <li v-for="url in links">
        <a class="link" :href="url">Link to {{ url }}</a>
    </li>
</ul>
```

```css
.container.rh-active-within {
    background-color: #ccc;
}
.rh-active-within .link:not(.rh-active) {
    opacity: 0.5;
}
.link.rh-active {
    font-weight: 700;
}
```

When hovering/focusing over any `.link` element, the `.container` will receive the `rh-active-within` class (giving it a gray background) and all non-hovered/focused `.link`s will be reduced to 0.5 opacity. The element that triggered the reverse-hover (the original hovered/focused `.link`) will have its font-weight set to 700.

* You can set the class names yourself by passing an object:

```html
<ul v-reverse-hover="{ containerActivatedClass: 'container-activated' /* etc... */ }">
```

* You can also choose which selectors will act as triggers:

```html
<ul v-reverse-hover="{ selectors: ['a', 'button'] /* <a> and <button> tags will trigger the reverse-hover */ }">
```

# Testing
`npm test` to run the tests defined in the `tests` directory.

# Contributing

## Prep
We recommend using a single local install to develop for fh-components:

```sh
cd ~/your-misc-repo-directory
git clone https://github.com/funkhaus/fh-components
```

Then, in your Vuepress instance:

```sh
npm link fh-components ~/your-misc-repo-directory/fh-components
```

This will create a symlink from Vuepress's `npm_modules/fh-components` to the master fh-components install.

## New Components
Components each get a directory in the `/src` folder, with the following naming conventions:

```
src
+-- new-component
    +-- NewComponent.vue
```

When you're ready to build your component, run `npm run build` in `fh-components`.

## Documentation
Reusable components are only helpful if they're easy to reuse! Fill in this template to start your documentation:

```md
## `component-name`
**Props**
* `prop-name`: Type, default `default value`. Brief explanation of purpose.

**Classes**
* `always-applied`
* `conditional`: explanation of when class will/won't be applied

**Notes**
* Miscellaneous notes and information here. Why add this custom component? When can it be used?
```

## Tests
It's a good idea to include a test for your new component so that others can add onto it more easily.

Tests each get a .js file in the `tests` directory, named the same as the component they test. Here's the template to start writing a new test:

```js
import ComponentName from '../component-name'
import { mount } from '@vue/test-utils'
import tap from 'tap'

// mount component
let wrapper = mount(ComponentName)

tap.test('Component Name', t => {

    // Tests using Tap and wrapper here
    // ...

    t.end()
})
```

Note the following caveats:
1. You'll need to require the component from its built .js file, not its .vue file. (Replacing the `ComponentName` and `component-name` in the template should do the trick.)
1. fh-components uses the [node-tap](http://www.node-tap.org/) library to run its tests ([API](http://www.node-tap.org/api/)).

When you add a new feature to an existing component, be sure to document and test it!

--------

__fh-components__

http://funkhaus.us
