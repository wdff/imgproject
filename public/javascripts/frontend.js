$(document).ready(function() {

    /**
     * The host-URL the site is running on.
     * @type {string}
     */
    var host = "http://" + window.location.host;

    /**
     * Height at wich pictures are initially displayed.
     * @type {number}
     */
    var PICHEIGHT = 150;

    /**
     * Width at wich pictures are initially displayed.
     * @type {number}
     */
    var PICWIDTH = 150;

    /**
     * Height at wich videos are initially displayed.
     * @type {number}
     */
    var VIDHEIGHT = 150;

    /**
     * Width at wich videos are initially displayed.
     * @type {number}
     */
    var VIDWIDTH = 200;

    /**
     * AJAX to delete threads.
     * TODO server-side validation (logged in?)
     */
    $('.deleteThreadButton').on('click', function(event) {

        /**
         * The ID of the thread to delete.
         * @type {*|jQuery}
         */
        var deleteId = $(event.target).siblings('a').attr('href').split('/').pop();

        $.ajax({
            type            : "POST",
            data            : JSON.stringify({deleteId: deleteId}),
            contentType     : 'application/json; charset=utf-8',
            dataType        : "json",
            url             : host + '/thread/' + deleteId + '/delete'
        }).done(function(data) {
                if (data.deleted == "yes") {
                    console.log("deleted!");
                    $(event.target).parent().parent().slideUp(800,function() {
                        $(this).remove();
                    });
                    $('#threadCount').text(parseInt($('#threadCount').text()) -1);
                }
              console.log(data);
            })
    });

    /*  TODO delete comments
    $('.deleteCommentButton').on('click', function(event) {
        var commentIter = $(event.target).parent().siblings('.commentCounter').text();
            //delete this comment
    });
    */


    /**
     * Scrolls to the bottom of the page.
     */
    $('#toBottomButton').on('click', function() {
        window.scrollTo(0, document.body.scrollHeight);
    });

    /**
     * resizes pictures on click.
     */
    $('img.postpic').on('click', function(event) {
        if ($(event.target).css("width") == PICWIDTH + "px" ||
            $(event.target).css("height") == PICHEIGHT + "px") {
                var img = new Image();
                img.src= $(event.target).attr("src");

            /**
             * holds the proportional dimensions of a picture, max height 5000px.
             * @type {*}
             */
            var dimensions = scale(
                $(event.target).parent().width(),
                5000,
                img.width,
                img.height
            );

            $(event.target).css("width", dimensions[0] + "px").css("height", dimensions[1] + "px");
        } else {
            $(event.target).css("width", PICWIDTH + "px").css("height", PICHEIGHT + "px");
        }
    });

    /**
     * resizes videos on click.
     */
    $('video.postvideo').on('click', function(event) {

        if ($(event.target).css("width") == VIDWIDTH + "px" ||
            $(event.target).css("height") == VIDHEIGHT + "px") {

            var video = $(event.target);
            var originalWidth = video[0].videoWidth;
            var originalHeight = video[0].videoHeight;

            /**
             * holds the proportional dimensions of a video, max height 1000px.
             * @type {*}
             */
            var dimensions = scale(
                $(event.target).parent().width(),
                1000,
                originalWidth,
                originalHeight
            );

            $(event.target).css("width", dimensions[0] + "px").css("height", dimensions[1] + "px");
        } else {
            $(event.target).css("width", VIDWIDTH + "px").css("height", VIDHEIGHT + "px");
        }


        });


    /**
     * Scales a picture to its original (or proportional) size, depending on parent box.
     * @param parentW parent box width
     * @param parentH parent box height
     * @param picW original picture width
     * @param picH original picture height
     * @returns {Array} [new picture width, new picture height]
     */
    function scale(parentW, parentH, picW, picH) {

        var Wdiff = picW / parentW;
        var Hdiff = picH / parentH;

        if (picW > parentW) {
            picW = picW / Wdiff - 20;
            picH = picH / Wdiff;
        } else if (picH > parentH) {
            picH = picH / Hdiff;
            picW = picW / Hdiff;
        }
        return [picW, picH];
    }

    /**
     * validates the #newThread form (no empty posts).
     */
    $('#newThread').validate({
        debug: true,
        submitHandler: function(form) {
            form.submit();
        }
    });
});