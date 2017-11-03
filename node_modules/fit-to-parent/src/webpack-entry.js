import fitToParent from './fitToParent'

// attach to lib if possible, default to global
const $ = window.jQuery || window.Zepto
if ( $ ) {
    $.fn.fitToParent = function(ops){
        this.each(function(){
            fitToParent({ element: this, ...ops })
            return this
        })
    }
} else { window.fitToParent = fitToParent }
