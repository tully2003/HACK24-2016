$(function(){

    $('#play').click(function() {
        chrome.runtime.sendMessage('game.create');

        chrome.app.window.create("pages/puzzle.html", {
            'id': 'secondary',
            'state': 'fullscreen'
        });     
    });
});

