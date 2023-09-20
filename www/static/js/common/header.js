$(document).ready(function () {
    var loginUser = comm.getUser()
    if(loginUser=="noLogin"){
        let menu = `<div class='loginMove'><a href='/login'><p>로그인</p></a></div>`
        $(".menuBtn").html(menu)
        $(".menuBtn").addClass("noLogin")
    }
    else{
        $(".login_user").html(loginUser);
        $(".menuBtn").removeClass("noLogin")
    }

    if(screen.width<1024){
        $(".onlyPC").addClass("hide")
    }
    else {
        $(".onlyMobile").addClass("hide")
    }

    $(document).on("click", ".menuBtn", function () {
        if($('.dropdown-content').hasClass('on')){
            $('.dropdown-content').removeClass('on')
        }
        else{ 
            $('.dropdown-content').addClass('on')
        }
    })
    
    // document.addEventListener('mouseup', function(e) {
    //     if($('.dropdown-content').hasClass('on')){
    //         var container = document.getElementById('myDropdown');
    //         if (!container.contains(e.target)) {
    //             $('.dropdown-content').removeClass('on')
    //         }
    //     }
    // });

    $(document).on("click", ".header_content .logo", function () {
        var loginUser = comm.moveMain()
        if(loginUser==""){
            location.href = "/"
        }
        else{
            location.href = "/main"
        }
    });

    $(document).on("click", ".infoMove", function () {
        $("#saveConfir").addClass('active')
        $("#saveConfir").find('[autofocus]').focus();
    });


    $("#saveConfir").keypress(function (e) {
        if (e.keyCode == 13) {
            $(".infoConfir").click();
        }
    });

    $(document).on("click", ".cancel", function () {
        $('.modal').removeClass('active')
        $('.cur_password').val("")
    });

    $(document).on("click", ".infoConfir", function () {
        // location.href="/myinfo"
        var cur_password = $(".cur_password").val()
        let verify = comm.joinInfo(cur_password);
        if(verify) location.href = '/myinfo'
    });

    $(document).on("click", "#logout", function () {
        comm.logout();
    });
});