export default {
    data() {
        return {
            transforms: [],
            heights: [],
            containerHeight: '',
            emptySpace: 0
        }
    },
    methods: {
        pack(el) {
            if (!el) {
                console.log('No element to pack, returning...')
                return
            }

            // convenience vars
            const childCount = el.childNodes.length
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

            // reset empty space tracker
            this.emptySpace = 0

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
            // and the final desired height for each column here
            this.heights = Array(childCount).fill('')

            // for each block...
            const blocks = el.childNodes
            blocks.forEach((block, i) => {
                // ...find which column we're in...
                const columnIndex = i % columnCount

                // ...apply the accumulated offset, pushing it up against
                // its upstairs neighbor...
                this.transforms.push(columnTotalOffsets[columnIndex])

                // ...calculate the difference between our content height
                // and cell height...
                const myHeight = block.clientHeight
                const contentHeight = [...block.childNodes].reduce(
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

            // find the tallest column in the packed content...
            let tallestHeight = columnHeights.reduce(
                (acc, curr) => (curr > acc ? curr : acc),
                0
            )

            let rowGap = computedStyle.gridRowGap.match(/\d+/)
            if (rowGap) {
                rowGap = rowGap[0]
                const gapInstances = Math.max(
                    Math.floor(childCount / columnCount),
                    0
                )
                tallestHeight += gapInstances * rowGap
            }

            this.containerHeight = tallestHeight + 'px'
        }
    }
}
