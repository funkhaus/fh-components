Reusable components and directives for [Vuepress](https://github.com/funkhaus/vuepress).

`npm install fh-components --save`

In your .vue files:

`import { ComponentName } from 'fh-components' // this is the goal - doesn't work yet`

# Table of Contents
1. [Components](#components)
    1. [a-div](#a-div)
    1. [bg-image](#bg-image)
    1. [flex-text](#flex-text)
    1. [video-player](#video-player)
1. [Directives](#directives)
1. [Contributing](#contributing)

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
* `object` - Object, default `{}`. Serialized [Rest-Easy attachment](https://github.com/funkhaus/Rest-Easy#serializer-filters). Fills out the rest of these props automatically except `fit`.
* `src` - String, default empty. Works like `<img src>`.
* `height` - String or number, default empty. Natural image height in pixels.
* `width` - String or number, default empty. Natural image width in pixels.
* `aspect` - String or number, default empty. Aspect ratio of desired image, as a percentage. `aspect="56.25"` would evaluate to a 56.25% aspect ratio.
* `size` - String, default `'full'`. WordPress image size.
* `color` - String, default `'transparent'`. Background placeholder color. Any CSS-compatible color is valid.
* `fit` - String, default `'cover'`. Object-fit value for the image - `cover` or `contain`.

**Classes**
* `bg-image-module`
* `loading` - only active when image hasn't finished loading
* `fit-${fit}` - Either `fit-cover` or `fit-contain`, depending on the `fit` prop.

**Notes**
* Creates and fades in an image. Adds a placeholder for the image with a given background-color to prevent content jumping when the image loads.

## `flex-text`

## `video-player`

# Directives

# Contributing

--------

__fh-components__

http://funkhaus.us

Version: 1.0.0

* 1.0.0 - Initial release
