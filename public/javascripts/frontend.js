$(document).ready(function() {

    var host = "http://192.168.1.3:3000";

    $('.deleteThreadButton').on('click', function(event) {

        var deleteId = $(event.target).siblings('a').attr('href').split('/').pop();
        console.log(deleteId);

        $.ajax({
            type            : "DELETE",
            data            : JSON.stringify({deleteId: deleteId}),
            contentType     : 'application/json; charset=utf-8',
            dataType        : "json",
            url             : host + '/thread/' + deleteId + '/delete'
//            success         : function(data) {
//                console.log(data);
//                console.log("successfully deleted thread " + deleteId);
//            },
//            error           : function(err) {
//                console.log("Error while deleting the thread! " + err.message);
//            }
        }).done(function(data) {
                if (data.deleted == "yes") {
                    console.log("deleted!");
                    $(event.target).parent().hide(200).remove();
                    $('#threadCount').text(parseInt($('#threadCount').text()) -1);
                }
              console.log(data);
            })
    });

    $('#toBottomButton').on('click', function() {
       window.scrollTo(0, document.body.scrollHeight);
    });

    /*$('#newComment').submit(function(event) {

        event.preventDefault();

        var threadId = $(location).attr('href').split('/').pop();
        console.log("id = " + threadId);
        var formData = $('#newComment').serialize();
        console.log("formdata:");
        console.log(formData);

        $.ajax({
            type            : "POST",
            data            : $('#newComment').serialize(),
            url             : host + '/thread/' + threadId + '/addcomment'
        }).done(function(data) {
                console.log("comment saved!");
            })
    })*/
});