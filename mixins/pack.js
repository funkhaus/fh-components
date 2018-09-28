export default {
    data() {
        return {
            transforms: [],
            containerHeight: ''
        }
    },
    methods: {
        pack(el) {
            if (!el) {
                console.log('No element to pack, returning...')
                return
            }

            // convenience vars
            const childCount = el.childElementCount
            const computedStyle = getComputedStyle(el)

            // count the number of columns in the CSS grid
            const computedColumns = computedStyle.gridTemplateColumns
            // computed grid-template-columns looks like this:
            // 120px 120x 120px
            // split by whitespace to determine the number of columns
            // TODO: is there a better way to do this?
            const columnCount = computedColumns.split(/\s/g).length

            // reset current transforms
            // each masonry block will get its transform from this array
            this.transforms = []

            // if the column count is 1, reset all transforms to 0 and exit -
            // no layout is necessary
            if (columnCount == 1) {
                this.transforms = Array(childCount).fill(0)
                this.heights = Array(childCount).fill('')
                this.containerHeight = ''
                return
            }

            // otherwise, let's start calculating
            // we'll keep track of total offsets for each column here
            const columnTotalOffsets = Array(columnCount).fill(0)
            // and the total real height for each column here
            const columnHeights = Array(columnCount).fill(0)

            // for each block...
            const blocks = [...el.children]
            blocks.forEach((block, i) => {
                // ...find which column we're in...
                const columnIndex = i % columnCount

                // ...apply the accumulated offset, pushing it up against
                // its upstairs neighbor...
                this.transforms.push(columnTotalOffsets[columnIndex] + 'px')

                // ...calculate the difference between our content height
                // and cell height...
                const myHeight = block.clientHeight
                const contentHeight = [...block.children].reduce(
                    (acc, curr) => {
                        // if we're a text node, get the container
                        if (curr.nodeType == Node.TEXT_NODE) {
                            curr = curr.parentNode
                        }

                        const styles = window.getComputedStyle(curr)
                        const margin =
                            parseFloat(styles['marginTop']) +
                            parseFloat(styles['marginBottom'])

                        return acc + curr.clientHeight + margin
                    },
                    0
                )

                // ...add that difference to the accumulated offset...
                columnTotalOffsets[columnIndex] -= myHeight - contentHeight

                // ...and add the total to this column's height
                columnHeights[columnIndex] += contentHeight
            })

            // finally, account for any extra space at the bottom of the wrapper:
            // first,find the tallest column in the packed content...
            let tallestHeight = columnHeights.reduce(
                (acc, curr) => (curr > acc ? curr : acc),
                0
            )

            // ...then find the row gaps declared by the grid...
            let rowGap = computedStyle.gridRowGap.match(/\d+/)
            if (rowGap) {
                // get the gap size, in px
                rowGap = rowGap[0]

                // find the number of times that gap repeats
                // (rounded down b/c there's always
                // 1 less gap than there are blocks in a column)
                const gapInstances = Math.max(
                    Math.floor(childCount / columnCount),
                    0
                )

                // add that total row gap size to the accumulated height
                tallestHeight += gapInstances * rowGap
            }

            // tell the container to match the height of the tallest column
            this.containerHeight = tallestHeight + 'px'
        }
    }
}
