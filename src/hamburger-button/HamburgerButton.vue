<template>

    <button
        :class="['hamburger', { activated }]"
        @click="$store.commit($store.state.menuOpened ? 'CLOSE_MENU' : 'OPEN_MENU')">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 10"
            stroke="#000">

            <!-- paths start at 1 and move by 13px to prevent clipping when rotated -->
            <path class="top" d="M1,0.5 l13,0"/>
            <path class="middle" d="M1,5 l13,0"/>
            <path class="second-middle" d="M1,5 l13,0"/>
            <path class="bottom" d="M1,9.5 l13,0"/>
        </svg>
    </button>

</template>

<script>
export default {
    computed: {
        activated() {
            return this.$store.state.menuOpened
        }
    }
}
</script>

<style lang="scss">
.hamburger {
    width: 40px;
    height: 40px;
    appearance: none;
    border: none;
    cursor: pointer;
    padding: 0;
    box-sizing: content-box;

    &:focus {
        outline: none;
    }
    path {
        transition: transform 0.4s, opacity 0.4s;
        transform-origin: center;
    }
}

// activation animations go here
.hamburger.activated {
    .top {
        transform: translateY(4px) scale(0, 1);
        opacity: 0;
    }
    .middle {
        transform: scale(0.9) rotate(45deg);
    }
    .second-middle {
        transform: scale(0.9) rotate(-45deg);
    }
    .bottom {
        transform: translateY(-4px) scale(0, 1);
        opacity: 0;
    }
}
</style>
