'use strict';

/* global skel */
(function($) {
	skel.breakpoints({
		wide: '(max-width: 1920px)',
		normal: '(max-width: 1680px)',
		narrow: '(max-width: 1280px)',
		narrower: '(max-width: 1000px)',
		mobile: '(max-width: 736px)',
		mobilenarrow: '(max-width: 480px)'
	});

    $(document).ready( () => {
        const $window = $(window);
        const $body = $('body');
        const $header = $('#header');
        const $nav = $('.desktop_menu_holder');
        const $hamburger = $('#hamburger');

        // Disable animations/transitions until the page has loaded.

        $body.addClass('is-loading');

        $window.on('load', () => {
            window.setTimeout( function() {
                $body.removeClass('is-loading');
            }, 0);
        });

        // Touch mode.
        skel.on('change', () => {
            if (skel.vars.mobile || skel.breakpoint('mobile').active) {
                $body.addClass('is-touch');
            } else {
                $body.removeClass('is-touch');
            }
        });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', () => {
            $.prioritize(
                '.important\\28 mobile\\29',
                skel.breakpoint('mobile').active
            );
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9) {
            $(':last-child').addClass('last-child');
        }

        // Gallery.
        /*$window.on('load', function() {
            $('.gallery').poptrox({
                baseZIndex: 10001,
                useBodyOverflow: false,
                usePopupEasyClose: false,
                overlayColor: '#1f2328',
                overlayOpacity: 0.65,
                usePopupDefaultStyling: false,
                usePopupCaption: true,
                popupLoaderText: '',
                windowMargin: (skel.breakpoint('mobile').active ? 5 : 50),
                usePopupNav: true
            });
        });*/

        // Section transitions.
        if ( !skel.vars.mobile && skel.canUse('transition') ) {
            const on = () => {
                // Generic sections.
                $('.main.style1')
                    .scrollex({
                        mode: 'middle',
                        delay: 100,
                        initialize: () => { $(this).addClass('inactive'); },
                        terminate: () => { $(this).removeClass('inactive'); },
                        enter: () => { $(this).removeClass('inactive'); },
                        leave: () => { $(this).addClass('inactive'); }
                    });

                $('.main.style2')
                    .scrollex({
                        mode: 'middle',
                        delay: 100,
                        initialize: () => { $(this).addClass('inactive'); },
                        terminate: () => { $(this).removeClass('inactive'); },
                        enter: () => { $(this).removeClass('inactive'); },
                        leave: () => { $(this).addClass('inactive'); }
                    });
            };

            const off = () => {
                // Generic sections.
                $('.main.style1').unscrollex();

                $('.main.style2').unscrollex();
            };

            skel.on('change', () => {
                if (skel.breakpoint('mobile').active) {
                    (off)();
                } else {
                    (on)();
                }
            });
        }

        // Events.
        let resizeTimeout = null;
        let sectionIds = {};
        const sections = $('section');
        const headerHeight = $header.height();

        function setFirstLimit(shift) {
            const property = sections.eq(0).attr('id');
            const top = parseInt( sections.eq(0).first().offset().top, 10 );

            sectionIds[property] = Math.ceil(top - shift);
        }

        function setScreanSize(item, prev) {
            const prevScreanPart = parseInt( prev.height() / 2, 10);

            const property = item.attr('id');
            const top = parseInt( item.first().offset().top, 10);

            const value = Math.ceil(top) - prevScreanPart;

            return {
                property,
                value
            }
        }

        function setLimits(shift) {
            for (let i = 1, len = sections.length; i < len; i += 1) {
                let obj = setScreanSize( sections.eq(i), sections.eq(i-1) );

                sectionIds[obj.property] = obj.value - shift;
            }
        }

        function setTopOffset(shift) {
            setFirstLimit(shift);
            setLimits(shift);
        }

        $window.on('scroll', () => {
            const scrolled = $window.scrollTop();

            let current = null;

            //when reaches the row, also add a class to the navigation
            for (let key in sectionIds) {
                if ( sectionIds.hasOwnProperty(key) ) {

                    if (scrolled >= sectionIds[key]) {
                        let id = '#' + key;
                        current = $nav.find('a[href=' + id + ']');
                    }
                }
            }

            setNavIndicator(current);
        });

        $window
            .resize( () => {
                // Disable animations/transitions.
                $body.addClass('is-resizing');

                window.clearTimeout(resizeTimeout);

                resizeTimeout = window.setTimeout(function() {

                    // Update scrolly links.
                    $('a[href^=#]').scroll({
                        speed: 1500,
                        offset: $header.outerHeight() - 1
                    });

                    // Re-enable animations/transitions.
                    window.setTimeout(function() {
                        $body.removeClass('is-resizing');
                        $window.trigger('scroll');
                    }, 0);

                }, 100);

                setTopOffset(headerHeight);
            })
            .load( () => {
                $window.trigger('resize');
            });

        function setNavIndicator(current) {
            $nav.find('a').removeClass('active');

            current.addClass('active');

            const marginLeft = parseInt( current.parent().css('margin-left'), 10);
            const parent = current.parent();

            const left = parent.position().left + marginLeft + 'px';
            const width = parent.css('width');

            $('#nav-indicator').css({
                left,
                width
            });
        }

        // Hamburger Menu
        let isClosed = true;

        $hamburger.on('click', () => {
            if (isClosed) {
                $header.addClass('open');
                isClosed = false;
            } else {
                $header.removeClass('open');
                isClosed = true;
            }

            return false;
        });

        function clickHandler(event) {
            const id = $(event.target).attr('href');

            const offsetTop = Math.ceil( $(id).first().offset().top - headerHeight );

            $('html, body').animate({
                scrollTop: offsetTop + 'px'
            }, 300);

            if (isClosed === false) {
                $header.removeClass('open');
                isClosed = true;
            }

            return false;
        }

        $nav.find('a').on('click', clickHandler);

        setTopOffset(headerHeight);
    });
})(jQuery);
