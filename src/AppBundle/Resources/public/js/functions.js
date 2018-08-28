//INTRO HEIGHT
var sliderHeight = function(){
	var thisHeight = $('.slider img').outerHeight();
	$('.slider, .intro').css('height', thisHeight);
};

$(document).ready(function(){

    /*HAMBURGER*/
    $('.hamburger').on('click', function(){
        if(!$('.hamburger').hasClass('is-active')) {
            $(this).addClass('is-active');
            $('nav').addClass('active');
            $('body').addClass('noScroll');
        } else {
            $(this).removeClass('is-active');
            $('nav').removeClass('active');
            $('body').removeClass('noScroll');
        }
    });

    /*MOBILE NAV*/
    $('body').on('click', 'nav.active ul li a', function(){
        $('nav').removeClass('active');
        $('.hamburger').removeClass('is-active');
        $('body').removeClass('noScroll');
    });

	//SLIDER
	$(function(){
		$('.slider img:gt(0)').hide();
		setInterval(function(){
			$('.slider img:first-child').fadeOut(1000)
				.next('img').fadeIn(1000)
				.end().appendTo('.slider');},
		5000);
	});

	//GALLERY TABS
	var owlGallery = $(".owl-gallery");
    owlGallery.owlCarousel({
        singleItem: true,
        pagination: false,
        slideSpeed: 1000,
        rewindSpeed: 1000,
        transitionStyle : "backSlide",
        afterAction: owlGalleryCurrentPos
    });

    //WELCOME GALLERY
    var owlWelcome = $(".owl-welcome");
    owlWelcome.owlCarousel({
        singleItem: true,
        pagination: false,
        slideSpeed: 1000,
        rewindSpeed: 1000,
        transitionStyle : "backSlide",
        afterAction: owlWelcomeCurrentPos
    });

     /*SCROLL*/
    smoothScroll.init({
        offset: 56,
        easing: 'easeOutCubic',
        speed: 2000
    });

    function owlGalleryCurrentPos() {
			var value = this.owl.currentItem;
			if(value == 0) {
				$('.gallery ul li').removeClass('active');
				$('.gallery ul li.one').addClass('active');
			} else if(value == 1) {
				$('.gallery ul li').removeClass('active');
				$('.gallery ul li.two').addClass('active');
			} else if(value == 2) {
				$('.gallery ul li').removeClass('active');
				$('.gallery ul li.three').addClass('active');
			}
		};

		$(".gallery ul li.one").click(function(){owlGallery.trigger('owl.goTo', 0);})
		$(".gallery ul li.two").click(function(){owlGallery.trigger('owl.goTo', 1);})
		$(".gallery ul li.three").click(function(){owlGallery.trigger('owl.goTo', 2);})

        function owlWelcomeCurrentPos() {
            var value = this.owl.currentItem;
            if(value == 0) {
                $('.owl-welcome-pagination ul li').removeClass('active');
                $('.owl-welcome-pagination ul li.one').addClass('active');
            } else if(value == 1) {
                $('.owl-welcome-pagination ul li').removeClass('active');
                $('.owl-welcome-pagination ul li.two').addClass('active');
            } else if(value == 2) {
                $('.owl-welcome-pagination ul li').removeClass('active');
                $('.owl-welcome-pagination ul li.three').addClass('active');
            }
        };

        $(".owl-welcome-pagination ul li.one").click(function(){owlWelcome.trigger('owl.goTo', 0);})
        $(".owl-welcome-pagination ul li.two").click(function(){owlWelcome.trigger('owl.goTo', 1);})
        $(".owl-welcome-pagination ul li.three").click(function(){owlWelcome.trigger('owl.goTo', 2);})

        $(".owl-welcome-arrows .next").click(function(){owlWelcome.trigger('owl.next');})
        $(".owl-welcome-arrows .prev").click(function(){owlWelcome.trigger('owl.prev');})

	/*GALERIA DE FOTOS*/
	var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');

});

$(window).load(function(){
	sliderHeight();
});

$(window).resize(function(){
	sliderHeight();
});

$(window).scroll(function(){
    var scroll = $(window).scrollTop();

    if(scroll >= 30) {
        $('header, .sub-header').addClass('sticky');
    } else {
        $('header, .sub-header').removeClass('sticky');
    }
});