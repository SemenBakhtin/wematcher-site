/**
 * @preserve
 * Sharer.js
 *
 * @description Create your own social share buttons
 * @version 0.4.0
 * @author Ellison Leao <ellisonleao@gmail.com>
 * @license GPLv3
 *
 */

(function(window, document) {
    'use strict';
    /**
   * @constructor
   */
    var Sharer = function(elem) {
        this.elem = elem;
    };

    /**
   *  @function init
   *  @description bind the events for multiple sharer elements
   *  @returns {Empty}
   */
    Sharer.init = function() {
        var elems = document.querySelectorAll('[data-sharer]'),
            i,
            l = elems.length;

        for (i = 0; i < l; i++) {
            elems[i].addEventListener('click', Sharer.add);
        }
    };

    /**
   *  @function add
   *  @description bind the share event for a single dom element
   *  @returns {Empty}
   */
    Sharer.add = function(elem) {
        var target = elem.currentTarget || elem.srcElement;
        var sharer = new Sharer(target);
        sharer.share();
    };

    // instance methods
    Sharer.prototype = {
        constructor: Sharer,
        /**
     *  @function getValue
     *  @description Helper to get the attribute of a DOM element
     *  @param {String} attr DOM element attribute
     *  @returns {String|Empty} returns the attr value or empty string
     */
        getValue: function(attr) {
            var val = this.elem.getAttribute('data-' + attr);
            // handing facebook hashtag attribute
            if (val && attr === 'hashtag') {
                if (!val.startsWith('#')) {
                    val = '#' + val;
                }
            }
            return val;
        },

        /**
     * @event share
     * @description Main share event. Will pop a window or redirect to a link
     * based on the data-sharer attribute.
     */
        share: function() {
            var sharer = this.getValue('sharer').toLowerCase(),
                sharers = {
                    facebook: {
                        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
                        params: {
                            u: this.getValue('url'),
                            hashtag: this.getValue('hashtag')
                        }
                    },
                    twitter: {
                        shareUrl: 'https://twitter.com/intent/tweet/',
                        params: {
                            text: this.getValue('title'),
                            url: this.getValue('url'),
                            hashtags: this.getValue('hashtags'),
                            via: this.getValue('via')
                        }
                    },
                    whatsapp: {
                        shareUrl: this.getValue('web') !== null ? 'https://api.whatsapp.com/send' : 'whatsapp://send',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    telegram: {
                        shareUrl: this.getValue('web') !== null ? 'https://telegram.me/share' : 'tg://msg_url',
                        params: {
                            text: this.getValue('title'),
                            url: this.getValue('url'),
                            to: this.getValue('to')
                        },
                        isLink: true
                    },
                    
                    line: {
                        shareUrl:
              'http://line.me/R/msg/text/?' + encodeURIComponent(this.getValue('title') + ' ' + this.getValue('url')),
                        isLink: true
                    },
                    pinterest: {
                        shareUrl: 'https://www.pinterest.com/pin/create/button/',
                        params: {
                            url: this.getValue('url'),
                            media: this.getValue('image'),
                            description: this.getValue('description')
                        }
                    },
                    tumblr: {
                        shareUrl: 'http://tumblr.com/widgets/share/tool',
                        params: {
                            canonicalUrl: this.getValue('url'),
                            content: this.getValue('url'),
                            posttype: 'link',
                            title: this.getValue('title'),
                            caption: this.getValue('caption'),
                            tags: this.getValue('tags')
                        }
                    },
                    hackernews: {
                        shareUrl: 'https://news.ycombinator.com/submitlink',
                        params: {
                            u: this.getValue('url'),
                            t: this.getValue('title')
                        }
                    },
                    reddit: {
                        shareUrl: 'https://www.reddit.com/submit',
                        params: { url: this.getValue('url') }
                    },
                    vk: {
                        shareUrl: 'http://vk.com/share.php',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            description: this.getValue('caption'),
                            image: this.getValue('image')
                        }
                    }
                },

                s = sharers[sharer];

            // custom popups sizes
            if (s) {
                s.width = this.getValue('width');
                s.height = this.getValue('height');
            }
            return s !== undefined ? this.urlSharer(s) : false;
        },
        /**
     * @event urlSharer
     * @param {Object} sharer
     */
        urlSharer: function(sharer) {
            var p = sharer.params || {},
                keys = Object.keys(p),
                i,
                str = keys.length > 0 ? '?' : '';
            for (i = 0; i < keys.length; i++) {
                if (str !== '?') {
                    str += '&';
                }
                if (p[keys[i]]) {
                    str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
                }
            }
            sharer.shareUrl += str;

            if (!sharer.isLink) {
                var popWidth = sharer.width || 600,
                    popHeight = sharer.height || 480,
                    left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
                    top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
                    popParams = 'scrollbars=no, width=' + popWidth + ', height=' + popHeight + ', top=' + top + ', left=' + left,
                    newWindow = window.open(sharer.shareUrl, '', popParams);

                if (window.focus) {
                    newWindow.focus();
                }
            } else {
                window.location.href = sharer.shareUrl;
            }
        }
    };

    // adding sharer events on domcontentload
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
        Sharer.init();
    } else {
        document.addEventListener('DOMContentLoaded', Sharer.init);
    }

    // turbolinks 3 compatibility
    window.addEventListener('page:load', Sharer.init);

    // turbolinks 5 compatibility
    window.addEventListener('turbolinks:load', Sharer.init);

    // exporting sharer for external usage
    window.Sharer = Sharer;
})(window, document);
