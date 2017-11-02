<template>

    <div class="video-player">

        <slot v-if="!embedHtml" name="loading"></slot>
        <div class="player-wrap" v-else v-html="embedHtml"></div>

    </div>

</template>

<script>

export default {
    props: {
        'vimeo-url': {
            type: String,
            default: ''
        },
        'vimeo-id': {
            type: Number,
            default: -1
        },
        'vimeo-embed': {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            embedHtml: ''
        }
    },
    async mounted(){
        if( this.vimeoEmbed ){
            // use specified embed HTML and render
            this.embedHtml = this.vimeoEmbed
            return
        }

        // fetch HTML using Vimeo embed API (https://developer.vimeo.com/apis/oembed)
        this.embedHtml = await
            fetch(`https://vimeo.com/api/oembed.json?url=${ this.vimeoUrl || 'https://vimeo.com/' + this.vimeoId }`)
            .then( res => {
                if( !res.ok ){
                    // fetch error handling:
                    // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
                    throw Error(res.statusText)
                }
                return res.json()
            } )
            .then( json => { return json.html } )
            .catch( err => console.log(err) )
    }
}

</script>
