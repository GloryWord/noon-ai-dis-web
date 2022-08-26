$(document).ready(function () {
    $('.menuBtn').click(function () {
        if($('.dropdown-content').hasClass('on')){
            $('.dropdown-content').removeClass('on')
        }
        else{ 
            $('.dropdown-content').addClass('on')
        }
    })
});