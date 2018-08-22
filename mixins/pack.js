export default {
    data() {
        return {
            transforms: []
        }
    },
    methods: {
        pack(el) {
            if (!el) {
                console.log('No element to pack, returning...')
                return
            }

            // count the number of columns in the CSS grid
            const computedColumns = getComputedStyle(el).gridTemplateColumns
            // computed grid-template-columns looks like this:
            // 120px 120x 120px
            // split by whitespace to determine the number of columns - is there
            // a better way to do this?
            const columnCount = computedColumns.split(/\s/g).length

            // reset current transforms
            // each masonry block will get its transform from this array
            this.transforms = []

            // if the column count is 1, reset all transforms to 0 and exit -
            // no layout is necessary
            if (columnCount == 1) {
                this.transforms = Array(el.childNodes.length).fill(0)
                return
            }

            // otherwise, let's start calculating
            // we'll keep track of total offsets for each column here
            const columnTotalOffsets = Array(columnCount).fill(0)

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

                // ...and add that difference to the accumulated offset
                columnTotalOffsets[columnIndex] -= myHeight - contentHeight
            })
        }
    }
}
