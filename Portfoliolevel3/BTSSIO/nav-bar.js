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
	$(document).on("ready", function(){
	 
		var singlePageNavBar = $('.navbar');
		singlePageNavBar.singlePageNav({
	        offset: 50,                 // Offset from top
	        currentClass: 'current',    // Class added to menu link when section is active
	        currentThreshold: 500,      // Threshold for triggering current section action
	        duration: 500,              // Duration of scroll animation in milliseconds
	        effect: 'swing'
	    });
    }); // Document Get Ready End here

})(jQuery);
