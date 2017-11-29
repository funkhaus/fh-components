Reusable components and directives for [Vuepress](https://github.com/funkhaus/vuepress).

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

// ...or a global one-liner
Vue.component('component-name', require.default('fh-components/component-name'))
```

# Table of Contents
1. [Components](#components)
    1. [a-div](#a-div)
    1. [bg-image](#bg-image)
    1. [flex-text](#flex-text)
    1. [video-player](#video-player)
1. [Directives](#directives)
1. [Contributing](#contributing)
    1. [Prep](#prep)
    1. [New Components](#new-components)
    1. [Documentation](#documentation)

# Components

## `a-div`
**Props**
* `href`: String, default empty. URL to link to.
* `new-window`: Boolean, default `true`. If component renders as an `<a>` tag, open in a new window.

**Classes**
* `anchor-div`

**Notes**:
* Renders content in a `<router-to>` tag if `href` starts with `/`
* Renders content in an `<a>` tag if `href` is a truthy value not starting with `/`
* Renders content in a `<div>` if `href` is falsey.

## `bg-image`
**Props**
* `object`: Object, default `{}`. Serialized [Rest-Easy attachment](https://github.com/funkhaus/Rest-Easy#serializer-filters). Fills out the rest of these props automatically except `fit`.
* `src`: String, default empty. Works like `<img src>`.
* `height`: String or number, default empty. Natural image height in pixels.
* `width`: String or number, default empty. Natural image width in pixels.
* `aspect`: String or number, default empty. Aspect ratio of desired image, as a percentage. `aspect="56.25"` would evaluate to a 56.25% aspect ratio.
* `size`: String, default `'full'`. WordPress image size.
* `color`: String, default `'transparent'`. Background placeholder color. Any CSS-compatible color is valid.
* `fit`: String, default `'cover'`. Object-fit value for the image - `cover` or `contain`.

**Classes**
* `bg-image-module`
* `loading`: only active when image hasn't finished loading
* `fit-${fit}`: Either `fit-cover` or `fit-contain`, depending on the `fit` prop.

**Notes**
* Creates and fades in an image. Adds a placeholder for the image with a given background-color to prevent content jumping when the image loads.

## `flex-text`

## `video-player`

# Directives

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

When you're ready to test your component, run `npm run build` in `fh-components`.

## Documentation
Reusable components are only helpful if they're easy to reuse! Fill in this template to start your documentation:

```md
## `component-name`
**Props**
* `prop-name`: Type, default `default value`. Brief explanation of purpose.

**Classes**
* `always-applied`
* `conditional`: explanation of when class will/won't be applied

**Notes**:
* Miscellaneous notes and information here. Why add this custom component? When can it be used?
```

--------

__fh-components__

http://funkhaus.us

Version: 1.1.0

* 1.1.0 - Ready for use in production
* 1.0.0 - Initial release
