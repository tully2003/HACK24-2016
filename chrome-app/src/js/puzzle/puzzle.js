(function ($) {
    $(function(){

        chrome.runtime.onMessage.addListener(function(msg, sender) {
           
           console.log("in puzzle got " + msg);
            console.log(msg);

            $("[data-id='" + msg.piecePosition + "']").show();
        });

        $("[data-id]").hide();

        var thresHold = "50%",
        faces = $(".piece"),
        droppables = $(".droppables span");

        //set up the original offset for the choice element
        $.each(faces, function (i, e) {
            e.originalOffset = $(e).offset();
        });

        Draggable.create(".piece", {
            type: "x,y",
            bounds: ".content",

            onDrag: function () {
                for (var i = 0; i < droppables.length; i++) {
                    if (this.hitTest(droppables[i], thresHold)) {
                        $(droppables[i]).addClass("highlight");
                    } else {
                        $(droppables[i]).removeClass("highlight");
                    }
                }
            },

            onDragEnd: function () {
                var i = droppables.length,
                    snappedEl = false,
                    originalOffset = this.target.originalOffset;

                for (var j = 0; j < i; j++) {
                    var thisTarget = $('#pos_' + $(this.target).attr('data-id'));
                    
                    if (this.hitTest(thisTarget, thresHold)) {
                        var targetOffset = $(thisTarget).offset();

                        snappedEl = true;

                        $(this.target).addClass("snapped");

                        TweenLite.to(this.target, 0.1, {
                            x: targetOffset.left - originalOffset.left,
                            y: targetOffset.top - originalOffset.top
                        });
                    }
                }

                if (!snappedEl) {

                    TweenLite.to(this.target, 0.2, { x: 0, y: 0 });
                }

                checkComplete();
            }
        });


        function checkComplete() {
            if ($('.piece.snapped').length == 9) {
                alert('GAME WON!');
            }
        }

    });
})(jQuery);
