export default {
    data() {
        return {
            sequenceStep: 0,
            sequenceMax: 100,
            sequenceStepLength: 300,
            sequenceInitialDelay: 0
        }
    },
    mounted() {
        setTimeout(this.incrementSequenceStep, this.sequenceInitialDelay)
    },
    methods: {
        incrementSequenceStep() {
            this.sequenceStep++

            if (this.sequenceStep < this.sequenceMax) {
                setTimeout(this.incrementSequenceStep, this.sequenceStepLength)
            }
        }
    }
}
