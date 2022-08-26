'use strict';

DIS.Web.Init = DIS.Web.Init || {};
var modiidx = null;

function getToday() {
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '-' + month + '-' + day;

    return dateString;
}

function getTime() {
    var today = new Date();
    var hours = ('0' + today.getHours()).slice(-2);
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2);

    var timeString = hours + ':' + minutes + ':' + seconds;

    return timeString;
}

function dateFormat(date) {
    let dateFormat2 = date.getFullYear() +
        '-' + ((date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
        '-' + ((date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()));
    return dateFormat2;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getFiles() {
    var files = document.getElementById("file").files;
    var myArray = {};
    var file = {};

    // manually create a new file obj for each File in the FileList
    for (var i = 0; i < files.length; i++) {
        var [ext, fileName] = files[i].name.split('.').reverse();
        file = {
            'lastMod': files[i].lastModified,
            'lastModDate': files[i].lastModifiedDate,
            'name': fileName + '-' + getToday() + '.' + ext,
            'size': files[i].size,
            'type': files[i].type,
        }
        //add the file obj to your array
        myArray[i] = file
    }
    //stringify array
    return JSON.stringify(myArray);
}

function today() {
    var date = new Date();
    var year = date.getFullYear(); // 년도
    var month = date.getMonth() + 1;  // 월
    var date = date.getDate();  // 날짜

    var today = "" + year + "-" + (("00" + month.toString()).slice(-2)) + "-" + (("00" + date.toString()).slice(-2)) + "";

    return today
}

function yesterday() {
    var now = new Date();
    var date = new Date(now.setDate(now.getDate() - 1));

    var y_year = date.getFullYear(); // 년도
    var y_month = date.getMonth() + 1;  // 월
    var y_date = date.getDate();  // 날짜

    var yesterday = "" + y_year + "-" + (("00" + y_month.toString()).slice(-2)) + "-" + (("00" + y_date.toString()).slice(-2)) + "";

    return yesterday
}

function week() {
    var now = new Date();
    var date = new Date(now.setDate(now.getDate() - 7));

    var w_year = date.getFullYear(); // 년도
    var w_month = date.getMonth() + 1;  // 월
    var w_day = date.getDate();  // 날짜

    var week = "" + w_year + "-" + (("00" + w_month.toString()).slice(-2)) + "-" + (("00" + w_day.toString()).slice(-2)) + "";

    return week
}

function month() {
    var now = new Date();
    var date = new Date(now.setMonth(now.getMonth() - 1));

    var m_year = date.getFullYear(); // 년도
    var m_month = date.getMonth() + 1;  // 월
    var m_day = date.getDate();  // 날짜

    var month = "" + m_year + "-" + (("00" + m_month.toString()).slice(-2)) + "-" + (("00" + m_day.toString()).slice(-2)) + "";

    return month
}

var init = DIS.Web.Init;
init = {

    // 유저 로그인 화면 제어
    index: function () {
        $(document).on("click", "#loginButton", function () {
            var accountName = $("#name").val();
            var password = $("#pass").val();
            if (accountName && password) login.login(accountName, password);
            else alert('아이디를 입력해 주세요.')
        });
    },

    sublogin: function () {
        $(document).on("click", "#loginButton", function () {
            var loginAlias = $("#loginAlias").val();
            var accountName = $("#name").val();
            var password = $("#pass").val();
            console.log(loginAlias)
            if (accountName && password) login.subLogin(loginAlias, accountName, password);
            else alert('아이디를 입력해 주세요.')
        });
    },

    main: function () {
        var temp = comm.getUser()
        $(".curTenant").html(temp);
        $("#selectKeyName").html(comm.getKeyList());

        function reloadProgress() {
            var encProgress = requestTable.getEncProgress();
            $('#progress').html(encProgress['progress']);
            if (encProgress['file_type'] == 'video' && progress != '100%') {
                setTimeout(reloadProgress, 200);
            }
            else if (encProgress['file_type'] == 'image') {
                var cur = encProgress['progress'].split('/')
                if (cur[0] != cur[1]) setTimeout(reloadProgress, 200);
            }
        }

        new Promise((resolve, reject) => {
            $('#requestListTable').html(requestTable.getEncRequestList('all'));
            resolve();
        }).then(() => {
            reloadProgress();
        })

        $(document).on("click", ".video_select", function () {
            location.href = "/encrypt/video"
        });

        $(document).on("click", ".image_select", function () {
            location.href = "/encrypt/image"
        });

        $(document).on("click", "#logout", function () {
            login.logout();
        });

        var mainLog = requestTable.getEncRequestList()
        $(".mainLog").html(mainLog);

        $(document).on("click", ".detailInfo", function () {
            var type = $(this).data('type')
            if(type == '영상'){
                location.href = "/video_detail"
            }
            else if(type == '이미지'){
                location.href = "/image_detail"
            }
            else if(type == '이미지 그룹'){
                location.href = "/album_detail"
            }
        });
    },

    main2: function () {
        var temp = comm.getUser()
        $(".curTenant").html(temp);
        $("#selectKeyName").html(comm.getKeyList());

        function reloadProgress() {
            var encProgress = requestTable.getEncProgress();
            $('#progress').html(encProgress['progress']);
            if (encProgress['file_type'] == 'video' && progress != '100%') {
                setTimeout(reloadProgress, 200);
            }
            else if (encProgress['file_type'] == 'image') {
                var cur = encProgress['progress'].split('/')
                if (cur[0] != cur[1]) setTimeout(reloadProgress, 200);
            }
        }

        new Promise((resolve, reject) => {
            $('#requestListTable').html(requestTable.getEncRequestList('all'));
            resolve();
        }).then(() => {
            reloadProgress();
        })

        $(document).on("click", ".video_select", function () {
            location.href = "/encrypt/video"
        });

        $(document).on("click", ".image_select", function () {
            location.href = "/encrypt/image"
        });

        $(document).on("click", "#logout", function () {
            login.logout();
        });
    },

    image: function () {
        $(document).on("click", ".fileSelect", function () {
            $(".folderUpload").removeClass('active')
            $(".fileUpload").addClass('active')
        });

        $(document).on("click", ".folderSelect", function () {
            $(".fileUpload").removeClass('active')
            $(".folderUpload").addClass('active')
        });
    },

    loading: function () {

    },

    video: function () {
        var html = ''
        var fileWidth = []
        var fileHeight = []
        var videoDuration = []

        $("#selectKeyName").html(comm.getKeyList());

        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, videoDuration] = fileModule.getFileList();
            setTimeout(function () {
                $('.uploadContent').html(html);
            }, 100);
        });

        $(document).on("click", ".uploadDelete", function () {
            var idx = $(this).attr('value')
            fileModule.deleteFile(idx);
        });

        $(document).on("click", "#generateKey", function () {
            var genKeyName = $("#genKeyName").val();
            comm.generateKey(genKeyName);
        });

        var restoration = 0;
        $('input[type=checkbox][name=restoration]').on('change', function () {
            switch ($(this)[0].checked) {
                case true:
                    restoration = 1;
                    break;
                case false:
                    restoration = 0;
                    break;
            }
        });

        $(document).on("click", ".fileSelect", function () {
            $(".folderUpload").removeClass('active')
            $(".fileUpload").addClass('active')
        });

        $(document).on("click", ".folderSelect", function () {
            $(".fileUpload").removeClass('active')
            $(".folderUpload").addClass('active')
        });

        $(document).on("click", ".btnArea", function () {
            fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration);
        });

        $(document).on("click", "#logout", function () {
            login.logout();
        });
    },

    log: function () {
        $(document).on("click", ".detailInfo", function () {
            var type = $(this).parent().parent().children()[1].textContent
            if(type == '영상'){
                location.href = "/video_detail"
            }
            else if(type == '이미지'){
                location.href = "/image_detail"
            }
            else if(type == '이미지 그룹'){
                location.href = "/album_detail"
            }
        });

        $(document).on("click", ".filter_video", function () {
            if($(this).hasClass("active")){
                $(this).removeClass('active')
                $(".filter_file").val("")
            }
            else{
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("video")
            }
        });

        $(document).on("click", ".filter_image", function () {
            if($(this).hasClass("active")){
                $(this).removeClass('active')
                $(".filter_file").val("")
            }
            else{
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("image")
            }
        });

        $(document).on("click", ".filter_album", function () {
            if($(this).hasClass("active")){
                $(this).removeClass('active')
                $(".filter_file").val("")
            }
            else{
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("album")
            }
        });

        $(document).on("click", ".filter_rest", function () {
            if($(this).hasClass("active")){
                $(this).removeClass('active')
                $(".filter_rest").val("")
            }
            else{
                $(".rest_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_rest").val(1)
            }
        });

        $(document).on("click", ".filter_norest", function () {
            if($(this).hasClass("active")){
                $(this).removeClass('active')
                $(".filter_rest").val("")
            }
            else{
                $(".rest_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_rest").val(0)
            }
        });

        $(document).on("click", ".date_filter", function () {
            if($(this).hasClass("active")){
                $(this).removeClass('active')
            }
            else{
                $(".date_filter").removeClass('active')
                $(this).addClass('active')
                if($(this).children().text()=="오늘"){
                    $(".startVal").val(today());
                    $(".endVal").val(today());
                }
                else if($(this).children().text()=="어제"){
                    $(".startVal").val(yesterday());
                    $(".endVal").val(yesterday());
                }
                else if($(this).children().text()=="일주일"){
                    $(".startVal").val(week());
                    $(".endVal").val(today());
                }
                else if($(this).children().text()=="한달"){
                    $(".startVal").val(month());
                    $(".endVal").val(today());
                }
            }
        });

        $(document).on("click", ".clear", function () {
            $(".file_filter").removeClass('active')   
            $(".rest_filter").removeClass('active')   
            $(".date_filter").removeClass('active') 
            $(".filter_file").val("")  
            $(".filter_rest").val("")
            $(".startVal").val("");
            $(".endVal").val("");
        });

        $(document).on("click", ".allSearch", function () {
            $(".file_filter").removeClass('active')   
            $(".rest_filter").removeClass('active')   
            $(".date_filter").removeClass('active') 
            $(".filter_file").val("")  
            $(".filter_rest").val("")
            $(".startVal").val("");
            $(".endVal").val("");
            var mainLog = requestTable.getAllEncRequestList()
            $(".mainLog").html(mainLog);
        });

        $(document).on("click", ".search", function () {
            var filter_file = $(".filter_file").val();
            var filter_rest = $(".filter_rest").val();
            var startDate = $(".startVal").val();
            var endDate = $(".endVal").val();
            if(filter_file=="" && filter_rest=="" && startDate=="" && endDate==""){
                Swal.fire('검색을 진행하시려면 조건을 정한 뒤 진행해주세요.', '', 'error')
            }
            else{
                var mainLog = requestTable.postDataSearch(filter_file, filter_rest, startDate, endDate)
                $(".mainLog").html(mainLog);
            }
        });

        var mainLog = requestTable.getAllEncRequestList()
        $(".mainLog").html(mainLog);
    },

    key: function () {

        var keyContent = requestTable.getAllKeyList()
        $(".listContent").html(keyContent);

        $(document).on("click", ".key_add", function () {
            $("#keyAdd").addClass('active')
        });

        $(document).on("click", ".memo_modi", function () {
            $("#memoModi").addClass('active')
        });

        $(document).on("click", ".cancel", function () {
            $('.modal').removeClass('active')
            $('.keyname').val("")
            $('.keymemo').val("")
        });

        $(document).on("click", ".allClear", function () {
            $('.keymemo_modi').val('')
        });
    },

    decrypt: function () {
        var html = comm.getUser()
        $(".curTenant").html(html);
        $('#requestListTable').html(requestTable.getEncRequestList('restoration'));
    },

    submanage: function () {
        $(document).on("click", ".sub_add", function () {
            location.href = "/submanage/add"
        });

        $(document).on("click", ".pass_modi", function () {
            $("#passModi").addClass('active')
        });

        $(document).on("click", ".cancel", function () {
            $('.modal').removeClass('active')
        });

        var subAccountList = subaccount.getList();
        $(".listContent").html(subAccountList);
    },

    add: function () {
        $(document).on("click", ".cancel", function () {
            $('.modal').removeClass('active')
        });

        $(document).on("click", ".addSave", function () {
            var accountName = $(".sub_id").val();
            var password = $(".sub_password").val();
            var repassword = $(".sub_repassword").val();
            var userName = $(".sub_username").val();
            var email = $(".sub_email").val();

            if (password == repassword) {
                var subAccountInfo = {
                    account_name: accountName,
                    password: password,
                    user_name: userName,
                    email: email
                }
                var result = subaccount.addSubAccount(subAccountInfo);
                if (result) {
                    Swal.fire('서브계정 생성이 완료되었습니다.', '', 'success').then(() => {
                        location.href = '/submanage';
                    })
                }
            }
            else {
                Swal.fire('비밀번호가 일치하지 않습니다.', '', 'error')
            }
        });

        $(document).on("click", ".addCancel", function () {
            location.href = "/submanage"
        });

        comm.secondaryLogin();
    },

    admin: function () {

    },

    join: function () {
        $(document).on("click", ".regiCancel", function () {
            location.href = "/"
        });
    },

    findpwd: function () {
        $(document).on("click", ".findSave", function () {
            location.href = "/"
        });

        $(document).on("click", ".findCancel", function () {
            location.href = "/"
        });
    }
};

$(document).ready(function () {
    var url = document.location.href;
    var len = url.split('/').length;
    var pageName = url.split('/')[len - 1];
    pageName = pageName.split('#')[0]
    pageName = pageName.split('?')[0]
    if (pageName == '') {
        init['index']();
    } else {
        init[pageName]();
    }
});