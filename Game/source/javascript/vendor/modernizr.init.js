Modernizr.addTest('highresdisplay', function(){
	if (window.matchMedia) {
		var mq = window.matchMedia("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
		if(mq && mq.matches) {
			return true;
		}
	}
});

//Live
//var jsPath = '/assets/js';
//Local
var jsPath = '/js';

if (Modernizr.touch) {
//load touch enabled scripts
	Modernizr.load
	(
		[
            // jsPath + '/min/tooltip.min.js',
			//jsPath + '/popover.min.js',
			jsPath + '/vendor/affix.js',
			jsPath + '/vendor/dropdown.js',
			// jsPath + '/min/tab.min.js',
			jsPath + '/vendor/modal.js',
			// jsPath + '/min/collapse.min.js',
			// jsPath + '/min/transition.min.js',
			// jsPath + '/custom/min/datahref.jquery.min.js',
			// jsPath + '/custom/jquery.scrollTo.min.js',
			// jsPath + '/custom/min/matchheights.jquery.min.js',
			// jsPath + '/custom/min/isotope.pkgd.min.js',
			jsPath + '/vendor/slick.js',
			jsPath + '/vendor/init.touch.js'
		]
	)
}
else {
	if (Modernizr.mq && Modernizr.csstransforms3d) {
	//load modern browser scripts
	Modernizr.load
	(
		[
            //  jsPath + 'js/tooltip.min.js',
			//jsPath + 'js/popover.min.js',
			jsPath + '/vendor/affix.js',
			 jsPath + '/vendor/dropdown.js',
			// jsPath + '/min/tab.min.js',
			jsPath + '/vendor/modal.js',
			// jsPath + '/min/collapse.min.js',
			// jsPath + '/min/transition.min.js',
			// jsPath + '/custom/min/datahref.jquery.min.js',
			// jsPath + '/custom/jquery.scrollTo.min.js',
			// jsPath + '/custom/min/matchheights.jquery.min.js',
			// jsPath + '/custom/min/isotope.pkgd.min.js',
			jsPath + '/vendor/slick.js',
			jsPath + '/vendor/init.standard.js'
		]
	)
}

else {
	//load legacy browser scripts
	Modernizr.load
	(
		[
            // jsPath + '/min/tooltip.min.js',
			//jsPath + '/min/popover.min.js',
			jsPath + '/vendor/affix.js',
			 jsPath + '/vendor/dropdown.js',
			// jsPath + '/min/tab.min.js',
			jsPath + '/vendor/modal.js',
			// jsPath + '/min/collapse.min.js',
			// jsPath + '/min/transition.min.js',
			// jsPath + '/custom/min/datahref.jquery.min.js',
			// jsPath + '/custom/jquery.scrollTo.min.js',
			// jsPath + '/custom/min/matchheights.jquery.min.js',
			// jsPath + '/custom/min/isotope.pkgd.min.js',
			jsPath + '/vendor/slick.js',
			jsPath + '/vendor/init.legacy.js'
			]
		)
	}
}
