export default {
    data() {
        return {
            transforms: [],
            heights: [],
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

            // count the number of columns in the CSS grid
            const computedColumns = getComputedStyle(el).gridTemplateColumns
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
            const tallestHeight = columnHeights.reduce(
                (acc, curr) => (curr > acc ? curr : acc),
                0
            )

            // ...then find the height of the containing el...
            const wrapperHeight = el.getBoundingClientRect().height

            // ...and save the difference between the two
            const extraSpace = wrapperHeight - tallestHeight
            let accountedSpace = 0
            let row = 0

            while (extraSpace > accountedSpace) {
                // create an array of all the blocks in the current row
                const finalRowLength = childCount % columnCount || columnCount
                const startIndex =
                    childCount - finalRowLength - columnCount * row
                const endIndex = childCount - columnCount * row

                const currentRow = [...el.childNodes].slice(
                    startIndex,
                    endIndex
                )

                let tallestInRow = 0
                currentRow.map(block => {
                    const currentHeight = block.getBoundingClientRect().height

                    if (currentHeight > tallestInRow) {
                        tallestInRow = currentHeight
                    }
                }, 0)

                const desiredHeight = Math.max(tallestInRow - extraSpace, 0)

                for (let i = 0; i < endIndex - startIndex; i++) {
                    this.heights[endIndex - i - 1] = desiredHeight
                }

                accountedSpace += tallestInRow - desiredHeight
                row++
            }
        }
    }
}
