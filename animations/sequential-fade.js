import { tween, styler, stagger } from 'popmotion'

export default (items, opts = {}, interval = 100) => {
    // ignore if no items
    if (!items.length) {
        return null
    }

    // set opts and use defaults
    opts = {
        from: { opacity: 0, y: 10 },
        to: { opacity: 1, y: 0 },
        duration: 400,
        ...opts
    }

    // create stylers for items
    const stylers = items.map(item => styler(item))

    // set initial state
    stylers.forEach(s => s.set(opts.from))

    // create tweens for items
    const tweens = stylers.map(s => tween(opts))

    // set up stagger
    const anim = stagger(tweens, interval)

    // run stagger and return result
    return anim.start(values => {
        values.forEach((v = opts.from, i) => {
            stylers[i].set(v)
        })
    })
}
