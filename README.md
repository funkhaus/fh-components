Reusable components and directives for Vue. Designed for [Vuepress](https://github.com/funkhaus/vuepress), but most components work in regular Vue apps.

`fh-components` saves you the trouble of rewriting common components like images, video players, svgs, and several other elements. If you're looking at writing a custom component in Vuepress, check if one already exists here first - and if it doesn't, feel free to [contribute](#contributing)!

# Table of Contents

1.  [Installation](#installation)
1.  [Components](#components)
    1.  [a-div](#a-div)
    1.  [count-up](#count-up)
    1.  [flex-text](#flex-text)
    1.  [hamburger-button](#hamburger-button)
    1.  [image-loader](#image-loader)
    1.  [load-on-view](#load-on-view)
    1.  [mailing-list](#mailing-list)
    1.  [responsive-image](#responsive-image)
    1.  [reveal-footer](#reveal-footer)
    1.  [scroll-to](#scroll-to)
    1.  [slide-show](#slide-show)
    1.  [split-text](#split-text)
    1.  [sticky-wrap](#sticky-wrap)
    1.  [text-typer](#text-typer)
    1.  [transition-fade](#transition-fade)
    1.  [transition-slide-toggle](#transition-slide-toggle)
    1.  [video-stage](#video-stage)
    1.  [velocity-animate](#velocity-animate)
    1.  [wp-content](#wp-content)
    1.  [wp-menu](#wp-menu)
1.  [Directives](#directives)
    1.  [animated](#animated)
    1.  [coverup](#coverup)
    1.  [draggable](#draggable)
    1.  [full-height](#full-height)
    1.  [in-view](#in-view)
    1.  [interact](#interact)
    1.  [keydown](#keydown)
    1.  [reverse-hover](#reverse-hover)
1.  [Mixins](#mixins)
    1.  [Idle](#idle)
    1.  [Pack](#pack)
    1.  [Rect](#rect)
    1.  [Sequence](#sequence)
    1.  [WaitFor](#waitfor)
1.  [Animations](#animations)
    1. [Sequential Fade](#sequential-fade)
1.  [Transitions](#transitions)
    1.  [Slide-Toggle](#slide-toggle)
1.  [Testing](#testing)
1.  [Contributing](#contributing)
    1.  [Prep](#prep)
    1.  [New Components](#new-components)
    1.  [Documentation](#documentation)
    1.  [Tests](#tests)

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
Vue.component('component-name', require('fh-components/component-name'))
```

# Components

## `a-div`

**Props**

-   `href`: String, default empty. URL to link to.
-   `new-window`: Boolean, default `true`. If component renders as an `<a>` tag, open in a new window.
-   `replace-with`: String, default `div`. If the `href` isn't a link, render contents inside this tag instead.

**Classes**

-   `anchor-div`
-   `a-${ replace-with }` (substitutes with the `replace-with` tag name)

**Notes**:

-   Renders content in a `<router-to>` tag if `href` starts with `/`
-   Renders content in an `<a>` tag if `href` is a truthy value not starting with `/`
-   Renders content in a given tag (`replace-with`, default `div`) if `href` is falsey.

## `count-up`

Count up to a specified number over a period of time. Requires [Popmotion](https://popmotion.io/).

### Props

| Name     | Type             | Default | Description                                    |
| -------- | ---------------- | ------- | ---------------------------------------------- |
| appear   | Boolean          | false   | Whether or not to start counting on `mounted`. |
| delay    | Number           | 0       | How long to delay before starting the count.   |
| duration | Number           | 700     | How long, in ms, to count up to `to`.          |
| from     | [String, Number] | 0       | Number to start at.                            |
| to       | [String, Number] | 100     | Number to count up to.                         |

### Notes

Set `running` to `true` to start counting. `running` will automatically be set back to `false` when complete. For example:

```html
<template>
    <count-up ref="count"/>

    <button @click="$refs.count.running = true">Start Counting</button>
</template>
```

## `flex-text`

## `hamburger-button`

**Classes**

-   `hamburger`
-   `activated`: when `$store.state.menuOpened` is `true`

**Notes**

-   Lightweight hamburger SVG with open and closed states. Calls Vuepress's `'OPEN_MENU'` or `'CLOSE_MENU'` when clicked, depending on current `activated` state. Will also update correctly when menu is opened or closed elsewhere.
-   Default slot is a three-line hamburger icon that changes to an "X" when activated. The user can replace this with their own svg using the `svg-image` component. For example:
    ```
    <hamburger-button>
        <svg-image src="hamburger.svg" />
    </hamburger-button>
    ```

## `image-loader`

This component will, given a list of serialized images, preload those images.

### Props

| Name     | Type   | Default | Description                                        |
| -------- | ------ | ------- | -------------------------------------------------- |
| `images` | Array  | `[]`    | Array of serialized images or URL strings to load. |
| `size`   | String | `full`  | WordPress name for image size to load.             |

## `load-on-view`

This component will keep track of its own scroll position, and when it enters the viewport will send a fetch request to a provided URL, emitting any resulting error or data through events. This is most useful for "infinite-scroll" functionality, where you feed pagination URLs into this component and use the resulting request data.

### Props

| Name          |  Type   |             Default              | Description                                                                                  |
| ------------- | :-----: | :------------------------------: | -------------------------------------------------------------------------------------------- |
| `url`         | String  |               `''`               | Target URL to send a fetch request to once the component is in view.                         |
| `repeatUrl`   | Boolean |             `false`              | If set to false, load-on-view will not send the next request until the provided URL changes. |
| `fetchConfig` | Object  | `{ credentials: 'same-origin' }` | An configuration object to be used with the fetch request.                                   |

### Events

| Name        | Callback Signature | Description                                                                                           |
| ----------- | :----------------: | ----------------------------------------------------------------------------------------------------- |
| `data`      |     (response)     | Fired whenever a fetch request is completed and returns a 2xx status code                             |
| `error`     |       (err)        | Fired whenever an error occurs during the fetch request, or when the request returns a non-2xx status |
| `on-text`   |     (textData)     | Fired when a fetch is completed and the contentType of the response is text                           |
| `on-json`   |     (jsonData)     | Fired when a fetch is completed and the contentType of the response is json                           |
| `on-buffer` |   (arrayBuffer)    | Fired when a fetch is completed and the contentType of the response is neither text nor json          |

## `mailing-list`

**Props**

| Name             | Type   | Default             | Description                                                   |
| ---------------- | ------ | ------------------- | ------------------------------------------------------------- |
| `provider`       | String | `mailchimp`         | Newsletter service provider. Either `mailchimp` or `madmimi`. |
| `actionUrl`      | String | none (required)     | Action URL for signup form.                                   |
| `token`          | String | none (required)     | API token.                                                    |
| `successMessage` | String | `Thank You!`        | Message to show to user on successful signup                  |
| `submitText`     | String | `Subscribe`         | Text on 'submit signup' button                                |
| `placeholder`    | String | `Email Address`     | Placeholder text for email address input                      |
| `transitionName` | String | `newsletter-submit` | Name for transition wrapping mailing-list element             |
| `delay`          | Number | 5000                | Time in ms to wait before firing `cookieCreated` event        |
| `cookieLength`   | Number | 30                  | Time in days until cookie expires                             |

**Classes**

-   `fh-mailing-list`
-   `loading`: if mailing list request has been submitted
-   `state-${ state }`: either `state-success`, `state-error`, or `state-none`, depending on submission state
-   `provider-${ provider }`: either `provider-mailchimp` or `provider-madmimi`
-   `empty`: Added if the email input field is empty.

**Slots**

| Name          | Location                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------- |
| `top`         | First element in mailing list wrapper, before any inputs                                    |
| `label`       | Label for email input element. Default: `<label for="mailing_list_email">Email</label>`     |
| `before-form` | Wrapped by transition, appears before input form (hidden after form submitted successfully) |
| `after-form`  | Wrapped by transition, appears after input form (hidden after form submitted successfully)  |
| `success`     | Appears after successful submission and `successMessage` prop                               |
| `error`       | Appears after form if error detected. Not wrapper by transition element.                    |
| `bottom`      | Last element in mailing list wrapper. After all inputs and transition wrap.                 |

**Events**

| Name               | Payload                                      | Trigger                                                                  |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------ |
| `addressSubmitted` | `{ success: Boolean, errorMessage: String }` | Fires when an email address is submitted                                 |
| `cookieCreated`    | null                                         | Fired when a cookie is created. (Designed to trigger overlay activation) |

**Notes**

-   Element to build out common mailing list signups.
-   Requires an action URL and an API token.
    -   **Mailchimp**: The action URL is the value of the `action` attribute on the `form` element in the form builder, and the API token is the value of the `name` attribute on the input wrapped by the `left: -5000px` div.
-   Waits `delay` ms, then fires the `cookieCreated` event and creates a cookie that prevents firing that event again for `cookieLength` days.

## `responsive-image`

**Props**

-   `object`: Object, default `{}`. Serialized [Rest-Easy attachment](https://github.com/funkhaus/Rest-Easy#serializer-filters). Fills out the rest of these props automatically except `fit`.
-   `html`: String, default ''. Desired <img> element as an HTML string. Provides all the sizing, fade-in, etc. benefits of a regular responsive-image.
-   `src`: String, default empty. Works like `<img src>`.
-   `video-src`: String, default empty. an optional video URL if the component should display a looping video rather than an image.
-   `height`: String or number, default empty. Natural image height in pixels.
-   `width`: String or number, default empty. Natural image width in pixels.
-   `aspect`: String or number, default empty. Aspect ratio of desired image, as a percentage. `aspect="56.25"` would evaluate to a 56.25% aspect ratio. Calculated from height and width if not explicitly stated.
-   `size`: String, default `'full'`. WordPress image size.
-   `color`: String, default `'transparent'`. Background placeholder color. Any CSS-compatible color is valid.
-   `respect-max`: Boolean, default `false`. Whether the image will have a `max-width` and `max-height` based on its natural dimensions.
-   `fill-space`: Boolean, default `false`. When `true`, position absolutely and force the image to take up all available space; when `false`, use the image's natural aspect ratio.
-   `fit`: String, default `'cover'`. Object-fit value for the image - `cover` or `contain`.
-   `poster`: String or post, default `''`. URL to [poster](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) for video. If `false`, no poster used; if blank, defaults to the parsed image source.
-   `volume`: Number, default `0`. Controls the volume when rendering a video. If set to 0 (or not set) the video will be muted and will be able to autoplay.

**Classes**

-   `rsp-image-module`
-   `responsive-image`
-   `fit-${fit}`: Either `fit-cover` or `fit-contain`, depending on the `fit` prop.
-   `loading`: only active when image hasn't finished loading
-   `fill-space`: only active if `fill-space` prop is set to `true`
-   `has-video`: only active if `videoSrc` is truthy (see notes below).

**Notes**

-   Creates and fades in an image. Adds a placeholder for the image with a given background-color to prevent content jumping when the image loads.
-   If you add a link to an .mp4 video in the "Alt" field in WordPress, this element will create and render a video, using the provided image as the poster (see "Poster" under "Attributes" [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)).
-   Also works when `object` is set to an Advanced Custom Fields image array. Only provides `fullscreen` size and image alt in this case.
-   Works with [Focushaus](https://github.com/funkhaus/focushaus), if installed, to set a custom focal point for an image. Defaults to standard browser behavior, focal point in the center of the image.

## `reveal-footer`

A component that reveals the section at the bottom of a page. Like the footer on the [Funkhaus site](http://funkhaus.us/).

Adds a slot wrapped with an empty div `footer-wrap`, preceded by an empty div that expands to match the `footer-wrap` height. `footer-wrap` is `position: fixed` and has `right`, `bottom`, and `left` set to 0.

### Classes

-   `reveal-footer`
-   `footer-wrap`

## `scroll-to`

Wrap this component around any element to add "scroll-to" functionality, where the window is scrolled to a target element when the wrapped element is clicked.

### Props

| Name       |     Type      |     Default     | Description                                                                                       |
| ---------- | :-----------: | :-------------: | ------------------------------------------------------------------------------------------------- |
| `target`   | String/Object | `scroll-target` | Target element to scroll to. This can be the name of a $ref, a CSS selector, or a DOM element.    |
| `duration` |    Number     |     `1000`      | The duration of the scroll animation in ms.                                                       |
| `easing`   |    String     |   `inOutQuad`   | The animation easing to use. See [ease](https://github.com/component/ease) for all valid options. |
| `offset`   |    Number     |       `0`       | Number of pixels to offset the scroll target by. Can be positive or negative.                     |
| `debug`    |    Boolean    |     `false`     | Whether or not to display debug information on click.                                             |

### Events

-   `complete`: Fires when the page has finished scrolling to the target. Fired immediately if `target` is not found.

## `slide-show`

This component creates a basic slideshow element that will cycle through a list of items that you provide.

Requires:

-   An array of `slides` that will serve as the source for the individual slides
-   A `slide` slot describing the format of an individual slide

The simplest possible `slide-show` looks like this:

```html
<slide-show :slides="[1, 2, 3]">

    <div slot="slide" slot-scope="{ slide }">

        <!-- This will create a slideshow of the numbers 1, 2, and 3, as specified in the "slides" prop-->
        {{ slide }}

    </div>

</slide-show>
```

See the [slots](https://github.com/funkhaus/fh-components#slots) section for more information.

### Props

| Name               |     Type      | Default | Description                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | :-----------: | :-----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slides`           |     Array     |  `[]`   | Array of items to be iterated over and turned into slides.                                                                                                                                                                                                                                                                                                |
| `auto`             |    Boolean    | `true`  | Controls if slideshow should auto-advance.                                                                                                                                                                                                                                                                                                                |
| `swipe`            |    Boolean    | `true`  | Controls if left/right swipe should be enabled                                                                                                                                                                                                                                                                                                            |
| `loop`             |    Boolean    | `true`  | If true, slideshow will loop from last item back to first on automatic playthroughs                                                                                                                                                                                                                                                                       |
| `manual-loop`      |    Boolean    | `false` | If true, slideshow will loop from last item back to first on automatic and manual slide changes                                                                                                                                                                                                                                                           |
| `infinite`         |    Boolean    | `true`  | If true, slideshow will do a `next` style transition when looping from last to first and vice versa.                                                                                                                                                                                                                                                      |
| `interval`         |    Number     | `4000`  | Time between auto slide transitions.                                                                                                                                                                                                                                                                                                                      |
| `delay`            |    Number     |  `500`  | Time to delay before initiating auto slide interval.                                                                                                                                                                                                                                                                                                      |
| `index`            | Number/Object | `null`  | Used to manually control the current active slide of the slideshow. This prop can be bidirectionally bound using the `sync` modifier - `<slide-show :index.sync="myLocalIndex"/>` will keep `myLocalIndex` up to date and reflect updates immediately if changed. Note that the value will also wrap correctly if under 0 or over the total slide number. |
| `pagination`       |    Boolean    | `true`  | Controls if pagination elements should be rendered or not.                                                                                                                                                                                                                                                                                                |
| `localKeyboard`    |    Boolean    | `false` | If true, slideshow will bind keyboard listeners to the slideshow DOM element. If false, keyboard events will be bound to window.                                                                                                                                                                                                                          |
| `nextKey`          |    Number     |  `39`   | Keycode for which key will trigger the next action. Default is the right arrow.                                                                                                                                                                                                                                                                           |
| `prevKey`          |    Number     |  `37`   | Keycode for which key will trigger the prev action. Default is the left arrow.                                                                                                                                                                                                                                                                            |
| `css`              |    Boolean    | `true`  | Controls if the transition should use CSS classes or not. Use this when overriding the default transition using the provided javascript hooks.                                                                                                                                                                                                            |
| `can-control`      |    Boolean    | `true`  | Controls whether or not the user has any manual control over this slideshow progression.                                                                                                                                                                                                                                                                  |
| `force-transition` |    String     |  `''`   | Tell the slideshow to use this transition name instead of the default `next` and `prev` classes. Useful if the transition will not change depending on slideshow direction.                                                                                                                                                                               |
| `slide-wrap`       |    String     |  `div`  | The element to wrap each individual slide in. Required to use the transition correctly.                                                                                                                                                                                                                                                                   |
| `enter`            |   Function    | `null`  | The `enter` function for the JS transition. Only runs if `css` is set to `false`.                                                                                                                                                                                                                                                                         |
| `leave`            |   Function    | `null`  | The `leave` function for the JS transition. Only runs if `css` is set to `false`.                                                                                                                                                                                                                                                                         |

### Classes

-   `fh-slideshow`
-   `transitioning`: Active when slideshow is mid transition
-   `first-slide`: Active when the current index is the first slide
-   `last-slide`: Active when the current index is the last slide

### Common Tasks

To use a transition other than the built-in one (for example, a fade transition):

```html
<slide-show
    force-transition="fade">
    ...
</slide-show>
```

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

If css transitions alone are not enough for the effect you want, you can opt to use js hooks instead. The full set of [js transition events](https://vuejs.org/v2/guide/transitions.html#JavaScript-Hooks) are available to the main `slide-show` component, so you can pass them as props there and use javascript to create your effects. Keep in mind that when doing this you will want to set the `css` prop to false so that the transition element is forced into js mode.

## `split-text`

**Props**

-   `elements`: String or Array, default `span`. Wrap each resulting line in this element with classes `line` and `line-{ line number }`. If `elements` is an array, split-text will wrap each line in its respective element, using the last element for any extra lines.
-   `separator`: String or Array, default `' &#8211; '`. Splits text by this separator. If set to an array, find the first separator that results in a split string and use that one.
-   `pieces`: Number or Array, default `-1`. Only include these zero-indexed pieces of the split text. If set to -1 (default), include the full split text.
-   `text`: String, default empty. Text to split.
-   `wrapper`: String, default `span`. Element wrapping rendered lines.

**Notes**

-   Splits given text according to a given separator. Useful for formatting titles, for example - `Title - More Title Information` will render as `<span>Title</span><span>More Title Information</span>`.
-   Contains two slots, named `before` and `after`, that render their content before and after the split text.

## `sticky-wrap`

**Props**

-   `wrapper`: String, default `div`. Element that wraps the entire component.
-   `margin`: Number or String, default `0`. Distance in pixels to pad the top of the sticky element.
-   `max`: Number or String, default `-1`. The maximum distance this element will be able to translate.

**Classes**

-   `sticky-wrap`

**Notes**

-   Mimics `position: sticky` using a wrapper element and translation. Sticks an element to the top of the screen without breaking page flow. Place content to be stuck inside the main slot - for example:

```html
<sticky-wrap>
    <h2>I'm stuck content</h2>
    <p>I'll be stuck too</p>
</sticky-wrap>
```

## `text-typer`

**Props**

-   `wrapper`: String, default `span`. Wrapper element for the typed text.
-   `html`: String, default `''`. HTML to be typed out.
-   `minTime`: Number, default `2`. Minimum number of ms to pass between keystrokes.
-   `maxtime`: Number, default `5`. Maximum number of ms to pass between keystrokes.

**Classes**

-   `text-typer`

**Notes**

-   Element to create a text typing effect that preserves HTML tags.
-   Uses a naive tag splitter that just detects for the presence of `<` or `>` characters.

## `transition-fade`

**Classes**

-   [Transition classes](https://vuejs.org/v2/guide/transitions.html#Transition-Classes) applied to a transition called `fade`.

**Notes**

-   Fades the contained element over 0.4 seconds.

## `transition-slide-toggle`

**Notes**

-   Velocity.js match of jQuery's [slideToggle](http://api.jquery.com/slidetoggle/) method, wrapped in a Vue transition.

## `velocity-animate`

**Props**

-   `reset`: Boolean, default `true`. Whether or not the changed elements should have their inline styles reset after the animation complete.
-   `sequence`: Array, default `[]`. Sequence to run on appear.
-   `wrapper`: String, default `div`. Element in which to wrap the enclosed content.

**Classes**

-   `velocity-animate`

**Notes**

-   A component to ease creating multi-step Velocity transitions. The `sequence` refers to a Velocity [sequence](http://velocityjs.org/#uiPack), first introduced in the UI pack. Instead of raw elements, the `e` property should contain the ref of the desired element. For example:

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

-   `velocity-animate` also allows you to set initial states of elements by forcefeeding starting values. See [this section](http://velocityjs.org/#forcefeeding) of the Velocity docs for details. Instead of just animating from the second value to the first, velocity-animate sets the element's desired property to the second value from the start of the animation.

## `video-stage`

**Props**

-   `src`: String, default `''`. The source of the video to embed. This can either be a full iframe code, or for Vimeo videos can just be a permalink to the video.
-   `autoplay`: Boolean, default `true`. Controls whether the component should attempt to autoplay the video. Only vimeo videos support autoplay at the moment.
-   `autoOffsets`: Boolean, default `true`. If set to true, the components will attempt to automatically calculate a fitToParent offset based on the dimensions of any slot elements provided.
-   `paused`: Boolean, default `false`. If set to true, the player will pause; if false, the player will play.
-   `muted`: Boolean, default `false`. If set to true, Vimeo player will start muted.

**Slots**

-   `before`: Renders directly before the element that holds the iframe.
-   `after`: Renders directly after the element that holds the iframe.

**Notes**

-   This component uses [`fitToParent`](https://github.com/funkhaus/fitToParent) to automatically scale and center the iframe within the dimensions of the nearest positioned parent element. Example usage:
    `<video-stage src="https://vimeo.com/123456789" @ended="goToNextPage" />`.

**Events**

-   Events are only supported for Vimeo-based videos.
-   `ended`: fires once the video has reached the end.
-   `play`: fires any time the video begins playback
-   `pause`: fires any time the video is paused

## `wp-content`

**Props**

-   `html`: String, default `''`. HTML that can function as a Vue template. The component will dynamically compile the contents, and inject the results into the vue component tree.
-   `unwrap`: Array, default `['p > img', 'p > iframe']`. Array of CSS selectors describing elements to unwrap from their parent nodes. (WordPress automatically wraps newlines in `<p>` tags, so this is a useful feature to remove standalone media from those `<p>` tags.)
-   `fitvids`: Boolean, default `true`. When set to true, the component will run fitvids on all content inside.
-   `replace`: Array, default `[]`. Array of objects containing:

    -   `selector` - String with CSS selector for elements to replace
    -   `callback` - Function describing what to replace old element with. Accepts one argument referring to the old element; should return a String or Node with the element's replacement.

    This feature lets you replace items in `wp-content`. For example:

    ```
    <wp-content :html="contentHtml" :replace="[ { selector: 'img', callback: el => `<p>Image with source ${ el.src }</p>` } ]"
    ```

    This setting would replace all `img` tags with a `p` containing the text 'Image with source [element's source]'. Useful for modifying wp-content HTML before it is rendered on the DOM.

**Classes**

-   `wp-content-placeholder`: only present when no html template is provided
-   `wp-content-rendered`: only present when an html template was provided and successfully rendered

**Notes**

-   This was built to allow components to be used with the the contents of a Wordpress post. It's very effective for that purpose, but more generally can be used to compile any dynamically loaded template and render it into the component tree. Be aware that this should only ever be used when the template going into the `html` prop is trusted.

## wp-menu

[Vuepress](https://github.com/funkhaus/vuepress)-specific component to build WordPress menus. Uses the `wp-menu-item` component internally.

### Props

| Name   |  Type  |    Default    | Description                            |
| ------ | :----: | :-----------: | -------------------------------------- |
| `slug` | String |     `''`      | The WordPress slug of the menu to use. |
| `name` | String | `'Main Menu'` | The WordPress name of the menu to use. |

### Classes

-   `menu`
-   `${ slug }`: Either the `slug` prop or a kebab-cased version of the `name` prop, whichever is available.

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

## `animated`

**Notes**:

-   Applies a class to an element on hover or focus. Only removes that class when an animation is finished with its current iteration. See [this pen](https://codepen.io/SanderMoolin/full/yMGxgw) for an example - the arrows will always finish their bounce animations.
-   Must be more than 1 animation iteration to remove class correctly.
-   Accepts one argument, the class name to apply. Default `animating`.
-   Recommended use:

```html
<template>
    <router-link
        v-animated
        class="link"
        to="/">I'll animate!</router-link>
</template>

<style lang="scss">

.link.animating {
    // must be more than one iteration - this won't work:
    animation: my-animation 1s 1;
    // but this will:
    animation: my-animation 1s infinite;
}

@keyframes my-animation {
    // your keyframes...
}

</style>
```

## `coverup`

**Notes**:

-   Sticks the bottom edge of an element to the bottom edge of the screen. Like position: sticky, but keeps the element stuck.
-   Jittery in Firefox and Safari. Works in Chrome.

## `draggable`

**Notes**

-   Gives the user access to mousedowm/move/up events and deltas.
-   User needs to full functionality in arguments - directive just handles communicating data to those events.

**Arguments**

-   `dragStart`: Function, default null. Called when the user clicks on an element. Takes two arguments, the event itself and an object with the clientX and clientY properties in `x` and `y`.
-   `drag`: Function, default null. Called when the user clicks on an element. Takes two arguments, the event itself and an object with:
    -   `lastPos`: the clientX and clientY properties in `x` and `y`
    -   `delta`: the change in pixels between this frame and the previous in `x` and `y`.
    -   `totalDelta`: the change in pixels of the drag from start to the current frame, in `x` and `y`.
-   `dragStop`: Function, default null. Called when the user releases a click on an element. Takes two arguments, the event itself and an object with:
    -   `lastPos`: the clientX and clientY properties in `x` and `y`
    -   `totalDelta`: the change in pixels of the drag from start to finish, in `x` and `y`.

## `full-height`

**Notes**:

-   Sizes the element to 100% of the window height. Replacement for the occasionally buggy 100vh css value.

**Modifiers**

-   `min`: If provided, directive will use the `min-height` css property rather than `height`.

## `in-view`

**Arguments**

-   `above`: String, default `above-view`. Class when element is above the viewport.
-   `below`: String, default `below-view`. Class when element is below the viewport.
-   `left`: String, default `left-of-view`. Class when element is left of viewport.
-   `right`: String, default `right-of-view`. Class when element is right of viewport.
-   `inView`: String, default `in-view`. Class when element is within the viewport.
-   `onEnter`: Function, default `null`. Method to call when an element enters view from anywhere. Accepts one argument, the element that has entered the viewport.
-   `onEnterAbove`: Function, default `null`. Method to call when an element enters view from the top of the screen. Accepts one argument, the element that has entered the viewport.
-   `onEnterBelow`: Function, default `null`. Method to call when an element enters view from below the screen. Accepts one argument, the element that has entered the viewport.
-   `onEnterLeft`: Function, default `null`. Method to call when an element enters view from left of the screen. Accepts one argument, the element that has entered the viewport.
-   `onEnterRight`: Function, default `null`. Method to call when an element enters view from right of the screen. Accepts one argument, the element that has entered the viewport.
-   `onLeave`: Function, default `null`. Method to call when an element leaves view from anywhere. Accepts one argument, the element that has ;eft the viewport.
-   `onLeaveAbove`: Function, default `null`. Method to call when an element leaves view, going above the screen. Accepts one argument, the element that has left the viewport.
-   `onLeaveBelow`: Function, default `null`. Method to call when an element leaves view, going below the screen. Accepts one argument, the element that has left the viewport.
-   `onLeaveLeft`: Function, default `null`. Method to call when an element leaves view, going left of the screen. Accepts one argument, the element that has left the viewport.
-   `onLeaveRight`: Function, default `null`. Method to call when an element leaves view, going right of screen. Accepts one argument, the element that has left the viewport.

**Modifiers**

-   `appear`: If set, events and classes will be calculated on insertion.

**Notes**

-   Applies classes to an element based on its viewport visibility.
-   Can also fire callbacks when an element has entered or left the viewport.

## `interact`

**Arguments**

You can pass either a function or an object to `v-interact`. If you pass a function, that function will act as the `callback` parameter below.

If you pass an object, your available parameters are:

-   `callback`: Function, default `() => {}`. Callback to fire when any event triggers.
-   `events`: Array of objects, default `{ mouseenter: callback, focus: callback }` or `{ mouseleave: callback, blur: callback }`, depending on whether the `end` modifier exists (see below). The keys in this object are event types, the values are the functions to call on those events.

**Modifiers**

-   `end` - Consolidates `mouseleave` and `blur` instead of `mouseenter` and `focus`.

**Notes**

-   Event consolidator that handles both `mouseenter`/`focus` and `mouseleave`/`blur`.
-   `v-interact` funnels multiple events into one callback and/or event. It's designed to consolidate mouseenter/focus and mouseleave/blur, but it can be used with any set of events.
-   Example:

    ```
    <!-- method defined in Vue instance - receives event as argument -->
    <router-link v-interact="startInteract">

    <!-- method defined in Vue instance with additional argument -->
    <router-link v-for="(link, i) in links) v-interact="evt => startInteract(evt, i)">

    <!-- mouseleave/blur event -->
    <router-link v-interact.end="endInteract">

    <!-- custom events -->
    <router-link v-interact="{ events: { mousedown: clicked, mouseup: clicked } }">
    ```

## `keydown`

**Modifiers**

-   `esc` - Only run callback on `esc` keydown.
-   `up` - Only run callback on `up arrow` keydown.
-   `right` - Only run callback on `right arrow` keydown.
-   `down` - Only run callback on `down arrow` keydown.
-   `left` - Only run callback on `left arrow` keydown.

**Notes**

Bind a global keydown listener to this component. Listener is created and destroyed with the component. For example, to implement an esc key toggle on a menu:

```html
<menu-component v-keydown.esc="() => $store.commit('TOGGLE_MENU')"/>
```

Note that the value must be an arrow function or a reference to a method in the Vue instance. These should work:

```html
<menu-component v-keydown.esc="toggleMenu"/>
<menu-component v-keydown.esc="() => toggleMenu(false)"/>
```

But this won't:

```html
<menu-component v-keydown.esc="toggleMenu()"/>
```

## `reverse-hover`

**Arguments**

-   `containerActivatedClass`: String, default `rh-active-within`. When a triggering component is hovered over or focused, the target element will have this class added to it.
-   `elActivatedClass`: String, default `rh-active`. A triggering component that is hovered over or focused will have this class added to it.
-   `processedClass`: String, default `rh-processed`. Triggering components will have this class added to them. (Usually left alone - mainly for internal directive use.)
-   `selectors`: Array or String, default `['a']`. All children of the target element that match this selector will become triggering components, reverse-hover listeners attached.

**Notes**

-   Allows for a "reverse hover" effect, where hovering over one element of a set affects all elements of a set. For example:

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

-   You can set the class names yourself by passing an object:

```html
<ul v-reverse-hover="{ containerActivatedClass: 'container-activated' /* etc... */ }">
```

-   You can also choose which selectors will act as triggers:

```html
<ul v-reverse-hover="{ selectors: ['a', 'button'] /* <a> and <button> tags will trigger the reverse-hover */ }">
```

# Mixins

To use an fh-component mixin:

```js
import mixin from 'fh-components/mixins/mixin-name'

export default {
    mixins: [mixin]
}
```

Mixins define component properties, lifecycle hooks, data, and more to save you time when writing new components.

## `idle`

### Adds

| Name        | Type    | Description                                     |
| ----------- | ------- | ----------------------------------------------- |
| `idle`      | Boolean | Whether or not the component is idle.           |
| `idleDelay` | Number  | How long, in ms, to wait before marking as idle |

### Notes

Fires an event after a given number of ms. For example:

```html
<template>
    <img src="img.png" v-show="idle">
</template>

<script>
import idle from 'fh-components/mixins/idle.js'

export default {
    mixins: [idle]
}
</script>
```

This will hide the image after 5 seconds of inactivity and show it again when the user scrolls or moves the mouse.

## `rect`

### Adds

| Name           | Type     | Description                                                                        |
| -------------- | -------- | ---------------------------------------------------------------------------------- |
| `clientRect`   | Object   | Object describing element dimensions.                                              |
| `setRect`      | Function | Update `clientRect`. Called internally. Can be called manually to force an update. |
| `rectThrottle` | Number   | ms throttle before firing scroll and resize events. Default 150.                   |

## `pack`

Like [Masonry](https://masonry.desandro.com/) but more lightweight and based on CSS grid.

### Adds

| Name              | Type             | Description                                                                   |
| ----------------- | ---------------- | ----------------------------------------------------------------------------- |
| `transforms`      | Array of strings | Array of pixel lengths to offset each packed block.                           |
| `containerHeight` | String           | Height of the container element in pixels.                                    |
| `pack`            | Function         | Recalculate the packing values. Requires one argument, the container element. |

### Notes

-   Best used with [waitFor](#waitFor) so that content is rendered before sizes are calculated.
-   Set each block to translate up by its corresponding `transforms` value to create a Masonry-style, tightly-packed grid.
-   It's a good idea to watch the window width in a debounce function and rerun `pack` when it changes.
-   **Known bugs**:
    -   Sometimes, child content wrapped in a flexbox won't calculate height correctly. To solve, wrap the flexbox in a container div.
    -   Sometimes when watching the `window.innerWidth` directly, the sizes and transforms don't calculate correctly. To solve, debounce or throttle the window width watcher.

Example:

```html
<template>

    <section :style="{ height: containerHeight }" ref="container">
        <repeated-block
            v-for="(block, i) in ..."
            :key="i"
            :style="{transform: transforms[i]}"/>
    </section>

</template>

<script>
import waitFor from 'fh-components/mixins/waitFor'
import pack from 'fh-components/mixins/pack'

export default {
    mixins: [waitFor, pack],
    mounted() {
        // pack when the grid is ready to render
        // (this.pack will receive this.$refs.container from waitFor)
        this.waitFor('$refs.container', this.pack)
    },
    watch: {
        // assuming a debounced/throttled window width value on the root element
        '$root.winWidth'() {
            // pack when the window width changes
            this.pack(this.$refs.container)
        }
    }
}

</script>

<style>
/* The container element must used display: grid! */
/* Other than that, row/column gaps, templates, and breakpoints will work correctly */

.container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 80px;
}

@media 'only screen and (min-width: 1800px)' {
    .container {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media 'only screen and (max-width: 750px)' {
    .container {
        grid-template-columns: repeat(1, 1fr);
    }
}

</style>
```

## `sequence`

Increment a number over a time period. Useful for [sequential fading on work grids](http://carbonvfx.com/), for example.

### Adds

| Name                    | Type                | Description                                                                                                                                        |
| ----------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sequenceStep`          | Number, default 0   | Current step of the sequence.                                                                                                                      |
| `sequenceMax`           | Number, default 100 | Maximum number for the sequence to count to.                                                                                                       |
| `sequenceStepLength`    | Number, default 300 | ms between each `sequenceStep` increment                                                                                                           |
| `sequenceInitialDelay`  | Number, default 0   | ms to wait before starting the count-up                                                                                                            |
| `incrementSequenceStep` | Function            | Increment `sequenceStep` by 1. If `sequenceStep` is less than `sequenceMax`, set a timeout to call this function again in `sequenceStepLength` ms. |
| `reset`                 | Function            | Resets `sequenceStep` to 0 and starts counting up again after `sequenceInitialDelay` ms.                                                           |

### Notes

A quick and simple mixin for keeping track of the bounding box (`width`, `height`, `top`, and `left`, in screen-space px) of an element. Updated automatically on resize and scroll.

## `waitFor`

### Adds

| Name                           | Type                        | Description                                                                                                                         |
| ------------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `awaitedItem`                  | String, default null        | Item to wait for.                                                                                                                   |
| `awaitedItemCallback`          | Function, default null      | Callback to run when `awaitedItem` exists.                                                                                          |
| `awaitedItemCallbackCompleted` | Boolean, default `false`    | Whether or not the callback has run. Set internally.                                                                                |
| `waitFor`                      | Function (string, callback) | Wait for the first argument to exist, and when it does, run `callback`. `callback` receives the awaited item as its only parameter. |

### Notes

Checks for the existence (using `lodash/get`) of an item. If the item exists, runs a callback immediately; if it doesn't, watches the current loading state and runs the callback when the page is loaded.

Useful for manipulating data that may or may not be asynchronous. For example, to select all `a` tags in a content field when they've been loaded and rendered:

```html
<template>
    <wp-content :html="content" ref="content"/>
</template>

<script>
import waitFor from 'fh-components/mixins/waitFor'

export default {
    mixins: [waitFor],
    mounted(){
        this.waitFor('$refs.content.$el', this.selectLinks)
    },
    methods: {
        selectLinks(el){
            // `el` = this.$refs.content.$el
            console.log([...el.querySelectorAll('a')])
        }
    }
}
</script>
```

# Animations

fh-components comes with built-in [Popmotion](https://popmotion.io/) animations.

## `sequential-fade`

Fade in a series of items using Popmotion's [stagger](https://popmotion.io/api/stagger/). Example:

```html
<template>
    <ul ref="list">
        <li>Item one</li>
        <li>Item two</li>
        <li>Item three</li>
    </ul>
</template>

<script>
import { sequentialFade } from 'fh-components/animations/sequential-fade'

export default {
    mounted(){
        // Pass an array of nodes to the function to fade in sequentially.

        // using defaults:
        sequentialFade([...this.$refs.list.querySelectorAll('li')])

        // using options:
        sequentialFade(
            // items to fade
            [...this.$refs.querySelectorAll('li')],

            // object to pass directly to tween options
            {
                from: { opacity: 0, y: 200 },
                to: { opacity: 1, y: 0 }
            },

            // interval between tween starts, in ms
            100
        })
    }
}
</script>
```

# Transitions

fh-components also comes with built-in [Popmotion](https://popmotion.io/) transitions. To use, either import the `enter` and `leave` methods and call in a JS transition. See any entry below for an example.

## slide-toggle

Mimics jQuery's [slideToggle](http://api.jquery.com/slidetoggle/). Example:

```html
<template>
    <transition @enter="enter" @leave="leave" :css="false">
        <button v-if="shown">Toggle me!</button>
    </transition>
</template>

<script>
import { enter, leave } from 'fh-components/animations/slide-toggle'

export default {
    data(){
        return {
            shown: true
        }
    },
    methods: {
        enter,
        leave
    }
}
</script>
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

| Name       | Type | Default   | Description     |
| ---------- | ---- | --------- | --------------- |
| `propName` | Type | `default` | About this prop |

**Classes**

-   `always-applied`
-   `conditional`: explanation of when class will/won't be applied

**Notes**

-   Miscellaneous notes and information here. Why add this custom component? When can it be used?
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

1.  You'll need to require the component from its built .js file, not its .vue file. (Replacing the `ComponentName` and `component-name` in the template should do the trick.)
1.  fh-components uses the [node-tap](http://www.node-tap.org/) library to run its tests ([API](http://www.node-tap.org/api/)).

When you add a new feature to an existing component, be sure to document and test it!

---

**fh-components**

http://funkhaus.us
