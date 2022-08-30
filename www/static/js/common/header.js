$(document).ready(function () {
    $('.menuBtn').click(function () {
        if($('.dropdown-content').hasClass('on')){
            $('.dropdown-content').removeClass('on')
        }
        else{ 
            $('.dropdown-content').addClass('on')
        }
    })

    $(document).on("click", ".infoMove", function () {
        $("#saveConfir").addClass('active')
    });

    $(document).on("click", ".cancel", function () {
        $('.modal').removeClass('active')
        $('.cur_password').val("")
    });

    $(document).ready(function() {
        var auth = comm.adminonly();
        if(auth == "master"){
            $(".admin_only").removeClass('hide')
        }
        else if(auth == "sub"){
            $(".admin_only").addClass('hide')
        }
    });

    $(document).on("click", ".infoConfir", function () {
        // location.href="/myinfo"
        var cur_password = $(".cur_password").val()
        comm.joinInfo(cur_password);
    });
});