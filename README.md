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
* `object` - Serialized [Rest-Easy attachment](https://github.com/funkhaus/Rest-Easy#serializer-filters)


## `flex-text`

## `video-player`

# Directives

# Contributing

--------

__fh-components__

http://funkhaus.us

Version: 1.0.0

* 1.0.0 - Initial release
