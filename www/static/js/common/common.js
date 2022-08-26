$(document).ready(function () {
    $('.restore').click(function () {
        if($('.restore').is(":checked")){
            $('.restoreKey').addClass('on')
        }
        else{
            $('.restoreKey').removeClass('on')
            $('.selectKey').removeClass('on')
            $('.createKey').removeClass('on')
            $('input[name=keySelect]:checked').prop('checked', false)
        }
    })

    $('.keySelect').click(function () {
        if($('input[name=keySelect]:checked').val()=='skey'){
            $('.selectKey').addClass('on')
            $('.createKey').removeClass('on')
        }
        else{
            $('.selectKey').removeClass('on')
            $('.createKey').addClass('on')
        }
    })

    $('.allface').click(function () {
        if($('.allface').is(":checked")){
            $("input:checkbox[class=face]").prop("checked", true);
        }
        else{
            $('input[class=face]:checked').prop('checked', false)
        }
    })
    
    $('.allbody').click(function () {
        if($('.allbody').is(":checked")){
            $("input:checkbox[class=body]").prop("checked", true);
        }
        else{
            $('input[class=body]:checked').prop('checked', false)
        }
    })
    
    $('.allcar').click(function () {
        if($('.allcar').is(":checked")){
            $("input:checkbox[class=car]").prop("checked", true);
        }
        else{
            $('input[class=car]:checked').prop('checked', false)
        }
    })

    $('.face').click(function () {
        if(!$(this).is(":checked")){
            $("input:checkbox[class=allface]").prop("checked",false);
        }
    })
    
    $('.body').click(function () {
        if(!$(this).is(":checked")){
            $("input:checkbox[class=allbody]").prop("checked",false);
        }
    })
    
    $('.car').click(function () {
        if(!$(this).is(":checked")){
            $("input:checkbox[class=allcar]").prop("checked",false);
        }
    })
});