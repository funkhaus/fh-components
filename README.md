Reusable components and directives for [Vuepress](https://github.com/funkhaus/vuepress).

`fh-components` saves you the trouble of rewriting common components like images, video players, svgs, and several other elements. If you're looking at writing a custom component in Vuepress, check if one already exists here first - and if it doesn't, feel free to [contribute](#contributing)!

# Table of Contents
1. [Installation](#installation)
1. [Components](#components)
    1. [a-div](#a-div)
    1. [flex-text](#flex-text)
    1. [hamburger-button](#hamburger-button)
    1. [responsive-image](#responsive-image)
    1. [split-text](#split-text)
    1. [transition-fade](#transition-fade)
    1. [video-stage](#video-stage)
    1. [wp-content](#wp-content)
    1. [wp-menu](#wp-menu)
1. [Directives](#directives)
    1. [full-height](#full-height)
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

**Classes**
* `rsp-image-module`
* `fit-${fit}`: Either `fit-cover` or `fit-contain`, depending on the `fit` prop.
* `loading`: only active when image hasn't finished loading
* `fill-space`: only active if `fill-space` prop is set to `true`
* `has-video`: only active if `videoSrc` is truthy (see notes below).

**Notes**
* Creates and fades in an image. Adds a placeholder for the image with a given background-color to prevent content jumping when the image loads.
* If you add a link to an .mp4 video in the "Alt" field in WordPress, this element will create and render a video, using the provided image as the poster (see "Poster" under "Attributes" [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)).

## `split-text`
**Props**
* `elements`: String or Array, default `span`. Wrap each resulting line in this element with class `line-{ line number }`. If `elements` is an array, split-text will wrap each line in its respective element, using the last element for any extra lines.
* `separator`: String, default ` - `. Splits text by this separator.
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

## `video-stage`
**Props**
* `src`: String, default `''`. The source of the video to embed. This can either be a full iframe code, or for Vimeo videos can just be a permalink to the video.
* `autoplay`: Boolean, default `true`. Controls whether the component should attempt to autoplay the video. Only vimeo videos support autoplay at the moment.

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

**Classes**
* `wp-content-placeholder`: only present when no html template is provided
* `wp-content-rendered`: only present when an html template was provided and successfully rendered

**Notes**
* This was built to allow components to be used with the the contents of a Wordpress post. It's very effective for that purpose, but more generally can be used to compile any dynamically loaded template and render it into the component tree. Be aware that this should only ever be used when the template going into the `html` prop is trusted.

## `wp-menu`
**Props**
* `slug`: String, default `''`. The WordPress slug of the menu to fetch.
* `name`: String, default `'Main Menu'`. The WordPress name of the menu to fetch.

**Classes**
* `menu`
* `[slug]`: Either the `slug` prop or a kebab-cased version of the `name` prop, whichever is available.

**Notes**
* [Vuepress](https://github.com/funkhaus/vuepress)-specific component to build WordPress menus. Uses the `wp-menu-item` component internally.

# Directives
Directives are declared as attributes. Remember to prefix `v-` to the directive name (so `full-height` becomes `v-full-height`)!

## `full-height`
**Notes**:
* Sizes the element to 100% of the window height. Replacement for the occasionally buggy 100vh css value.

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
