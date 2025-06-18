/*
===========================================================================
 EXCLUSIVE ON themeforest.net
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Template Name   : Maria - Responsive Personal Portfolio Template
 Author          : mital_04
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Copyright (c) 2018 - Maria - Responsive Personal Portfolio Template
===========================================================================
*/


(function($){
	"use strict";

	/* ---------------------------------------------- /*
	 * Pre Loader
	/* ---------------------------------------------- */
	$(window).on("load",function() {
	   document.getElementById("loading").style.display = "none"; 
	});
	/* ---------------------------------------------- /*
	 * Pre Loader End
	/* ---------------------------------------------- */

	/* ---------------------------------------------- /*
	 * Header Fixed
	/* ---------------------------------------------- */
	$(window).on("scroll", function(){
	    if ($(window).scrollTop() >= 60) {
	       $('header').addClass('fixed-header');
	       $('body').addClass('fixed-header-body');
	    }
	    else {
	       $('header').removeClass('fixed-header');
	       $('body').removeClass('fixed-header-body');
	    }
	});
	/* ---------------------------------------------- /*
	* Header End
	/* ---------------------------------------------- */
		
	$(document).on("ready", function(){

		$('.skillbar').skillBars({
			from: 0,
			speed: 4000, 
			interval: 100,
			decimals: 0,
		});

		/* ---------------------------------------------- /*
		 * Portfolio Filter
		/* ---------------------------------------------- */
			var containerEl = document.querySelector('.portfolio-filter');
			var mixer = mixitup(containerEl);
		/* ---------------------------------------------- /*
		 * Portfolio Filter End
		/* ---------------------------------------------- */

		/* ---------------------------------------------- /*
		 * home Banner
		/* ---------------------------------------------- */
		$(".full-screen").height($(window).height());			

		/* ---------------------------------------------- /*
		 * Testimonials
		/* ---------------------------------------------- */
		var testimonials_slider = $('#testimonials-slider');
	    testimonials_slider.owlCarousel({
	        loop: true,
	        margin: 30,
	        nav:false,
	        responsive: {
	          0: {
	            items: 1
	          },
	          768: {
	            items: 2
	          },
	          991: {
	            items: 3
	          },
	          1140: {
	            items: 3
	          }
	        }
	    });
	    /* ---------------------------------------------- /*
		 * Testimonials End
		/* ---------------------------------------------- */
		
		/*=====================================
		  Start Counter JS
		 =====================================*/

		var a = 0;
		$(window).on("scroll", function() {
		  var oTop = $('.counter-box').offset().top - window.innerHeight;
		  if (a == 0 && $(window).scrollTop() > oTop) {
		    $('.count').each(function () {
		          $(this).prop('Counter',0).animate({
		              Counter: $(this).text()
		          }, {
		              duration: 4000,
		              easing: 'swing',
		              step: function (now) {
		                  $(this).text(Math.ceil(now));
		              }
		          });
		      });
		    a = 1;
		  }
		});
		
	}); // Document Get Ready End here

	$(window).on("resize", function(){
		$(".full-screen").height($(window).height());
	});
	 
})(jQuery);