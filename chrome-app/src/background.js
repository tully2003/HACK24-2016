chrome.app.runtime.onLaunched.addListener(function() {

   chrome.system.display.getInfo(function(displays) {

	var display = displays[1];

        chrome.runtime.onMessage.addListener(function(msg, sender) { 
            console.log(sender);
            var w = chrome.app.window.get("secondary");
            w.sendMessage("moveLeft");
        });    

    chrome.app.window.create("pages/maze.html", {
        'id': 'primary',
        'state': 'fullscreen'
    });

    chrome.app.window.create("pages/puzzle.html", {
        'id': 'secondary',
            'state': 'fullscreen'
    });

/*
	chrome.app.window.create("pages/Start.html", {
	    'id': 'primary',
            'state': 'fullscreen'
	});

	chrome.app.window.create('index.html', {
            'id': 'secondary',
	    'outerBounds': {
		'left': display.bounds.left,
		'top': 0 
	    },
            'state': 'fullscreen'
	});*/
	
   }); 
});
