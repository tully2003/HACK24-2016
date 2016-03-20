$(function(){

    $('#play').click(function() {
        
        $('.content').remove();

        Packed24.Start();

        //chrome.runtime.sendMessage('game.create');

        chrome.app.window.create("pages/puzzle.html", {
            'id': 'secondary',
            'state': 'fullscreen'
        });     
    });
});

