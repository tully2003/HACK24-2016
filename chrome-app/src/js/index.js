document.addEventListener("keydown", function(evt) {
    chrome.runtime.sendMessage({
        name: "keydown",
        keyCode: evt.keyCode
    });
}, false);

document.addEventListener("keyup", function(evt) {
    console.log("keyup");
    chrome.runtime.sendMessage({
        name: "keyup",
        keyCode: evt.keyCode
    });
}, false);



$(document).ready(function () {

    var apiUrl = 'http://localhost:58191/';

    $('#btn-start-new').click(function (e) {
        e.preventDefault();
        

        var name = $('#player-name').val();
        var url = apiUrl + 'StartGame/' + encodeURIComponent(name) + '/';

        $.post(url, null, function (data) {
            var gameRef = data.reference;
            //alert('Game started - ref: ' + gameRef);

            $('#status').html('Game Started');
            var joinUrl = apiUrl + 'Join.html?g=' + gameRef;
            var instructions = 'To invite others to this game give them this link: <a href="' + joinUrl + '">' + joinUrl + '</a>.';
            $('#join-instructions').html(instructions);

            $('#output').removeAttr('hidden');

        }, 'JSON');
    });
});
