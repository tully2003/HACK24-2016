chrome.app.runtime.onLaunched.addListener(function() {

   chrome.system.display.getInfo(function(displays) {

	var display = displays[1];
    
	chrome.app.window.create("src/pages/Start.html", {
	    // 'state': 'fullscreen'
	});

	chrome.app.window.create('_build/_index.html', {
	    'outerBounds': {
		'left': display.bounds.left,
		'top': 0 
	    },
            // 'state': 'fullscreen'
	});
	
   }); 
});
