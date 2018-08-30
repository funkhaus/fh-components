<template>
    <div :class="classes">

        <slot name="top" />
        <slot />

        <transition :name="transitionName" mode="out-in">
            <div v-if="state != 'success'" class="form" key="form">
                <slot name="before-form" />

                <form v-if="isMadMimi" ref="form" @submit.prevent="onSubmit" target="_blank" :action="actionUrl" accept-charset="UTF-8" method="POST">
                    <input name="utf8" type="hidden" value="✓"/>

                    <slot name="label">
                        <label for="mailing_list_email">Email</label>
                    </slot>

                    <input id="mailing_list_email"
                        class="email"
                        name="signup[email]"
                        type="text"
                        :placeholder="placeholder"
                        v-model="email" />

                    <div style="background: white; font-size:1px; height: 0; overflow: hidden" aria-hidden="true">
                        <input type="text" :name="token" tabindex="-1" style="font-size: 1px; width: 1px !important; height:1px !important; border:0 !important; line-height: 1px !important; padding: 0 0; min-height:1px !important;"/>
                        <input class="checkbox" type="checkbox" name="beacon"/>
                    </div>

                    <slot name="within-form" />
                    <input type="submit" class="submit" :value="submitText" />
                </form>

                <form v-else-if="isMailchimp" ref="form" :action="actionUrl" method="GET" target="_blank" novalidate @submit.prevent="onSubmit">
                    <label for="mailing_list_email">Email</label>
                    <input id="mailing_list_email" type="email" class="email" name="EMAIL" :placeholder="placeholder" v-model="email" />
                    <div style="position: absolute; left: -5000px;" aria-hidden="true">
                        <input type="text" :name="token" tabindex="-1" value="">
                    </div>
                    <slot name="within-form" />
                    <input type="submit" class="submit" :value="submitText">
                </form>

                <slot name="after-form" />
            </div>
            <div v-else-if="state == 'success'" class="success-message" key="success">
                <span class="message" v-html="successMessage" />
                <slot name="success" />
            </div>
        </transition>

        <div v-if="state == 'error'" class="error-message" key="error">
            <span class="message" v-html="errorMessage" />
            <slot name="error" />
        </div>

        <slot name="bottom" />
    </div>
</template>

<script>
import fetchJsonp from 'fetch-jsonp'
import Cookies from 'js-cookie'

export default {
    props: {
        provider: {
            type: String,
            default: 'mailchimp',
            validator(val) {
                return ['mailchimp', 'madmimi'].includes(val)
            }
        },
        actionUrl: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        successMessage: {
            type: String,
            default: 'Thank You!'
        },
        submitText: {
            type: String,
            default: 'Subscribe'
        },
        placeholder: {
            type: String,
            default: 'Email Address'
        },
        transitionName: {
            type: String,
            default: 'newsletter-submit'
        },
        delay: {
            type: Number,
            default: 5000
        },
        cookieLength: {
            type: Number,
            default: 30
        }
    },
    data() {
        return {
            success: false,
            errorMessage: '',
            loading: false,
            email: 'test'
        }
    },
    computed: {
        isMadMimi() {
            return this.provider == 'madmimi'
        },
        isMailchimp() {
            return this.provider == 'mailchimp'
        },
        state() {
            if (this.success) return 'success'
            else if (this.errorMessage) return 'error'
            return 'none'
        },
        callbackName() {
            if (this.isMadMimi) return 'callback'
            if (this.isMailchimp) return 'c'
            return ''
        },
        formAction() {
            if (this.isMadMimi) return `${this.actionUrl}.json?`
            if (this.isMailchimp) {
                const modified = this.actionUrl.replace('/post?', '/post-json?')
                return `${modified}&`
            }
            return ''
        },
        classes() {
            return [
                'fh-mailing-list',
                `state-${this.state}`,
                `provider-${this.provider}`,
                { loading: this.loading },
                { empty: !this.email }
            ]
        }
    },
    methods: {
        isSuccess(response) {
            if (this.isMadMimi) return response.success
            if (this.isMailchimp) return response.result == 'success'
            return false
        },
        getErrorMessage(response) {
            if (this.isMadMimi) return response.error
            if (this.isMailchimp) return response.msg
            return 'Something went wrong. Please try again.'
        },
        async onSubmit(e) {
            // serlize form data
            const formData = new FormData(this.$refs.form)
            const serialized = [...formData.entries()].map(e => {
                return `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`
            })

            // send request
            this.loading = true
            try {
                const response = await fetchJsonp(
                    this.formAction + serialized.join('&'),
                    {
                        jsonpCallback: this.callbackName
                    }
                ).then(r => r.json())

                // handle error or success
                if (this.isSuccess(response)) this.success = true
                else this.errorMessage = this.getErrorMessage(response)
            } catch (err) {
                this.errorMessage = 'Something went wrong.'
            }

            this.$emit('addressSubmitted', {
                success: this.success,
                errorMessage: this.errorMessage
            })

            this.loading = false
        }
    },
    mounted() {
        if (!Cookies.get('newsletter')) {
            setTimeout(() => this.$emit('cookieCreated'), this.delay)
            Cookies.set('newsletter', 'true', { expires: this.cookieLength })
        }
    }
}
</script>

<style lang="scss">
// define transition
.newsletter-submit-enter-active,
.newsletter-submit-leave-active {
    transition: opacity 300ms;
}
.newsletter-submit-enter,
.newsletter-submit-leave-to {
    opacity: 0;
}
</style>
