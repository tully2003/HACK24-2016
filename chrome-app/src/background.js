chrome.app.runtime.onLaunched.addListener(function() {

   chrome.system.display.getInfo(function(displays) {

	var display = displays[1];
    
	chrome.app.window.create('window.html', {
	    'outerBounds': {
		'left': display.bounds.left,
		'top': 0 
	    },
	    'state': 'fullscreen'
	});

	chrome.app.window.create('window-2.html', {
	    'state': 'fullscreen'
	});
	
   }); 
});
