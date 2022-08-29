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

    $(document).on("click", ".infoConfir", function () {
        // location.href="/myinfo"
        var cur_password = $(".cur_password").val()
        login.joinInfo(cur_password);
    });
});