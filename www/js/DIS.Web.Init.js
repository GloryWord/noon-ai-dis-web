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
        var socket = io();
        var temp = comm.getUser()
        $(".curTenant").html(temp);
        $("#selectKeyName").html(comm.getKeyList());

        function reloadProgress() {
            var encProgress = requestTable.getEncProgress();
            var progress = encProgress['progress']
            $('#progress').html(progress);
            if(encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
            else {
                var mainLog = requestTable.getEncRequestList()
                $(".mainLog").html(mainLog);
            }
        }

        reloadProgress();

        $(document).on("click", ".video_select", function () {
            location.href = "/encrypt/video"
        });

        $(document).on("click", ".image_select", function () {
            location.href = "/encrypt/image"
        });

        var mainLog = requestTable.getEncRequestList()
        $(".mainLog").html(mainLog);

        $(document).on("click", ".detailInfo", function () {
            var type = $(this).data('type')
            if (type == '영상') {
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).attr('data-id');
            }
            else if (type == '이미지') {
                location.href = "/encrypt/image/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=single";
            }
            else if (type == '이미지 그룹') {
                location.href = "/encrypt/album/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=group";
            }
        });
    },

    image: function () {
        var html = ''
        var fileWidth = []
        var fileHeight = []
        var videoDuration = []

        $("#selectKeyName").html(comm.getKeyList());

        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, videoDuration] = fileModule.getFileList('image', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
            }, 100);
        });

        $("#folder").on('change', function () {
            [html, fileWidth, fileHeight, videoDuration] = fileModule.getFileList('image', 'folder');
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
            comm.generateKey(genKeyName, null);
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
            var encryptObject = []
            for (var i = 0; i < fileWidth.length; i++) {
                var head = $('#file-' + i + ' .selectObject')[0].children[0].checked
                var body = $('#file-' + i + ' .selectObject')[0].children[2].checked
                var lp = $('#file-' + i + ' .selectObject')[0].children[4].checked

                var select = ''
                select = (head) ? select += '1' : select += '0'
                select = (body) ? select += '1' : select += '0'
                select = (lp) ? select += '1' : select += '0'
                encryptObject.push(select)
            }
            fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, encryptObject);
        });
    },

    loading: function () {
        function reloadProgress() {
            var encProgress = requestTable.getEncProgress();
            var progress = encProgress['progress']
            $('#progress').html(progress);
            if(encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
            else {
                Swal.fire({
                    title: '비식별화가 완료되었습니다!',
                    showCancelButton: false,
                    confirmButtonText: '확인',
                    icon: 'success'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.href = '/log';
                    }
                })
            }
        }

        reloadProgress();
    },

    video: function () {
        var html = ''
        var fileWidth = []
        var fileHeight = []
        var videoDuration = []

        $("#selectKeyName").html(comm.getKeyList());

        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, videoDuration] = fileModule.getFileList('video', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
            }, 100);
        });

        $("#folder").on('change', function () {
            [html, fileWidth, fileHeight, videoDuration] = fileModule.getFileList('video', 'folder');
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
            comm.generateKey(genKeyName, null);
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
    },

    detail: function () {
        var socket = io();
        
        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var eventIndex = urlParams.get('id');
        var mode = urlParams.get('mode');

        var encDirectory = [];
        var fileList = [];
        [encDirectory, fileList] = resultLoader.getFileInfo(eventIndex);
        var infoHtml = resultLoader.getInfoHtml(eventIndex);
        $('.infoArea')[0].innerHTML = infoHtml;

        $(document).ready(function () {
            var rest = $(".rest_info").text()
            if(rest == "X"){
                $(".file_recoConfirm").addClass("hide")
                $(".select_recoConfirm").addClass("hide")
            }
        });

        $(document).on("click", ".file_recoConfirm", function () {
            $("#recoData").addClass('active')
        });

        $(document).on("click", ".cancel", function () {
            $('.modal').removeClass('active')
        });

        $("#file").on('change', function () {
            var file = document.getElementById('file').files[0];
            var fileName = file.name;
            $('.pemUpload').val(fileName);
        });

        $(document).on("click", ".recoConfirm", function () {
            var keyName = $('.file_key')[0].children[1].innerHTML
            fileModule.verifyKey(keyName, eventIndex);
        });

        if (type == 'image') {
            var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);
            var html = resultLoader.getImageDetailHtml(signedUrl, mode, fileList);

            if (mode == 'single') {
                $('.lockData')[0].innerHTML = html;
                $('#signedUrl').attr('href', signedUrl[0]);
            }
            else if (mode == 'group') {
                $(document).on("click", ".select_recoConfirm", function () {
                    $("#select_recoData").addClass('active')
                });

                $(document).on("click", ".albumImg", function () {
                    if ($(this).hasClass("active")) {
                        $(this).removeClass('active')
                    }
                    else {
                        $(this).addClass('active')
                    }
                });

                $(document).on("click", ".plusBtn", function () {
                    $("#imgView").addClass('active')
                });

                $(document).on("click", ".recoConfirm", function () {
                    $('.modal').removeClass('active')
                });

                $(document).on("click", "#signedUrl", function () {
                    resultLoader.fileToZip({
                        id: eventIndex,
                        bucketName: encDirectory[0],    //참조할 버킷 이름
                        subDirectory: encDirectory[1],  //참조할 object의 세부 경로
                        fileName: fileList              //참조할 object filename 목록
                    });
                    socket.on('compress', function (data) {
                        if(data.log == '압축 완료') {
                            new Promise((resolve, reject) => {
                                //파일 다운로드 경로 획득
                                var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], ['Download.zip']);
                                location.href = signedUrl;
                                resolve();
                            }).then(() => {
                                new Promise((resolve, reject) => {
                                    //다운로드 후 zip 파일 삭제
                                    Swal.fire('파일 다운로드가 시작되었습니다.', '', 'success')
                                    var complete = resultLoader.deleteZipFile(encDirectory[0], encDirectory[1]);
                                    resolve(complete);
                                })
                            })
                        }
                    });
                });
                $('.lockDataList')[0].innerHTML = html;
            }
        }
        else if (type == 'video') {
            var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);
            // var html = resultLoader.getVideoDetailHtml(signedUrl, fileList);
            $('#signedUrl').attr('href', signedUrl[0]);
        }
    },

    log: function () {
        $(document).on("click", ".detailInfo", function () {
            var type = $(this).parent().parent().children()[1].textContent
            if (type == '영상') {
                location.href = "/video_detail"
            }
            else if (type == '이미지') {
                location.href = "/image_detail"
            }
            else if (type == '이미지 그룹') {
                location.href = "/album_detail"
            }
        });

        $(document).on("click", ".filter_video", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_file").val("")
            }
            else {
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("video")
            }
        });

        $(document).on("click", ".filter_image", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_file").val("")
            }
            else {
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("image")
            }
        });

        $(document).on("click", ".filter_album", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_file").val("")
            }
            else {
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("album")
            }
        });

        $(document).on("click", ".filter_rest", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_rest").val("")
            }
            else {
                $(".rest_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_rest").val(1)
            }
        });

        $(document).on("click", ".filter_norest", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_rest").val("")
            }
            else {
                $(".rest_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_rest").val(0)
            }
        });

        $(document).on("click", ".date_filter", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
            }
            else {
                $(".date_filter").removeClass('active')
                $(this).addClass('active')
                if ($(this).children().text() == "오늘") {
                    $(".startVal").val(today());
                    $(".endVal").val(today());
                }
                else if ($(this).children().text() == "어제") {
                    $(".startVal").val(yesterday());
                    $(".endVal").val(yesterday());
                }
                else if ($(this).children().text() == "일주일") {
                    $(".startVal").val(week());
                    $(".endVal").val(today());
                }
                else if ($(this).children().text() == "한달") {
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
            if (filter_file == "" && filter_rest == "" && startDate == "" && endDate == "") {
                Swal.fire('검색을 진행하시려면 조건을 정한 뒤 진행해주세요.', '', 'error')
            }
            else {
                var mainLog = requestTable.postDataSearch(filter_file, filter_rest, startDate, endDate)
                $(".mainLog").html(mainLog);
            }
        });

        $(document).on("click", ".detailInfo", function () {
            var type = $(this).data('type')
            if (type == '영상') {
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).attr('data-id');
            }
            else if (type == '이미지') {
                location.href = "/encrypt/image/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=single";
            }
            else if (type == '이미지 그룹') {
                location.href = "/encrypt/album/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=group";
            }
        });

        var mainLog = requestTable.getAllEncRequestList()
        $(".mainLog").html(mainLog);
    },

    myinfo: function () {
        $(document).on("click", ".infoSave", function () {
            var name = $(".view_name").val()
            var email = $(".view_email").val()
            var phone = $(".view_phone").val()
            var now_pass = $(".now_pass").val()
            var new_pass = $(".new_pass").val()
            var new_passConfig = $(".new_passConfig").val()
            // console.log(name, email, phone, now_pass, new_pass, new_passConfig)
            userinfo.infoModi(name, email, phone, now_pass, new_pass, new_passConfig)
        });

        $(document).on("click", ".infoCancel", function () {
            location.href = "/myinfo"
        });

        var infoArea = userinfo.getUserInfo()
        $(".infoArea").html(infoArea);
    },

    key: function () {
        var keyContent = requestTable.getAllKeyList()
        $(".listContent").html(keyContent);

        $(document).on("click", ".key_add", function () {
            $("#keyAdd").addClass('active')
        });

        $(document).on("click", ".memo_modi", function () {
            var key_idx = $(this).data("id")
            var keymemo_modi = requestTable.postSelectKeyMemo(key_idx)
            $(".keymemo_modi").val(keymemo_modi)
            // $(".bodyMiddle").html(keymemo_modi)
            $("#memoModi").addClass('active')
        });

        $(document).on("click", ".memosave", function () {
            var key_memo = $(".keymemo_modi").val()
            requestTable.postUpdateKeyMemo(key_memo)
        });

        $(document).on("click", ".cancel", function () {
            $('.modal').removeClass('active')
            $('.keyname').val("")
            $('.keymemo').val("")
        });

        $(document).on("click", ".allClear", function () {
            $('.keymemo_modi').val('')
        });

        $(document).on("click", "#generateKey", function () {
            var genKeyName = $("#genKeyName").val();
            var keyMemo = $("#keyMemo").val();
            comm.generateKey(genKeyName, keyMemo);
        });
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
    },

    test: function () {
        $(document).on("click", "#user", function () {
            // $.ajax({
            //     method: "get",
            //     url: "/api/socket",
            //     async: false,
            //     success: function (data) {
            //         if (data.message == 'success') {
            //             console.log(data);
            //         }
            //         // else alert(JSON.stringify(data));
            //     }, // success 
            //     error: function (xhr, status) {
            //         alert("error : " + xhr + " : " + JSON.stringify(status));
            //     }
            // })
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