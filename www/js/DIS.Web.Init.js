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
    let dateFormat2 = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
    return dateFormat2;
}

function underTen(data) {
    let underTen;
    if(Number(data)<=9){
        underTen = "0"+data
    }
    else{
        underTen = data
    }
    return underTen;
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
        var parsedArray = files[i].name.split('.');
        var ext = parsedArray[parsedArray.length -1];
        parsedArray = parsedArray.splice(0, parsedArray.length -1);
        var fileName = parsedArray.join('.');
        console.log(fileName);
        console.log(ext);
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
            else {
                if (accountName == '') var msg = '아이디';
                if (password == '') var msg = '비밀번호';
                if (accountName == '' && password == '') var msg = '아이디와 비밀번호';
                Swal.fire(msg + '를 입력해 주세요.', '', 'warning');
            }
        });
    },

    sublogin: function () {
        $(document).on("click", "#loginButton", function () {
            var loginAlias = $("#loginAlias").val();
            var accountName = $("#name").val();
            var password = $("#pass").val();
            if (loginAlias && accountName && password) login.subLogin(loginAlias, accountName, password);
            else {
                if (loginAlias == '') var msg = '접속키'
                if (accountName == '') var msg = '아이디';
                if (password == '') var msg = '비밀번호';
                if (accountName == '' && password == '') var msg = '아이디와 비밀번호';
                Swal.fire(msg + '를 입력해 주세요.', '', 'warning');
            }
        });
    },

    main: function () {
        var socket = io();
        var temp = comm.getUser()
        console.log(temp);
        $(".curTenant").html(temp);
        // $("#selectKeyName").html(comm.getKeyList());

        function reloadProgress() {
            var encProgress = requestTable.getEncProgress();
            var progress = encProgress['progress']
            $('#progress').html(progress);
            if (encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
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
            if (type == '동영상 파일') {
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).attr('data-id') + "&mode=single";
            }
            else if (type == '이미지 파일') {
                location.href = "/encrypt/image/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=single";
            }
            else if (type == '이미지 그룹') {
                location.href = "/encrypt/album/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=group";
            }
        });
    },

    image: function () {
        var html = ''
        var fileCount = 0;
        var fileIndex = [];
        var fileWidth = []
        var fileHeight = []
        var videoDuration = []

        $("#selectKeyName").html(comm.getKeyList());

        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, fileCount, videoDuration] = fileModule.getFileList('image', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileWidth.length;
                fileIndex = [];
                for(var i = 0; i < fileCount; i++) fileIndex.push(i);
            }, 200)
        });

        $("#folder").on('change', function () {
            [html, fileWidth, fileHeight, fileCount, videoDuration] = fileModule.getFileList('image', 'folder');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileWidth.length;
                fileIndex = [];
                for(var i = 0; i < fileCount; i++) fileIndex.push(i);
            }, 200)
        });

        $(document).on("click", ".uploadDelete", function () {
            var idx = $(this).attr('value')
            fileModule.deleteFile(idx);
            fileCount--;
            fileIndex = fileIndex.filter(function(item) {
                return item !== Number(idx);
            })
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
            $(".folderSelect").removeClass('active')
            $(".fileSelect").addClass('active')
        });

        $(document).on("click", ".folderSelect", function () {
            $(".fileUpload").removeClass('active')
            $(".folderUpload").addClass('active')
            $(".fileSelect").removeClass('active')
            $(".folderSelect").addClass('active')
        });

        $(document).on("click", ".prevBtn", function () {
            location.href = "/main"
        });

        $(document).on("click", ".nextBtn", function () {
            if (fileCount == 0) {
                Swal.fire({
                    title: '파일 오류',
                    html:
                        '업로드된 파일이 없거나 잘못되었습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    icon: 'warning',
                });
            }
            else {
                var encryptObject = []
                for (var i = 0; i < fileCount; i++) {
                    var body = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[0].checked
                    var head = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[2].checked
                    var lp = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[4].checked

                    var select = ''
                    select = (body) ? select += '1' : select += '0'
                    select = (head) ? select += '1' : select += '0'
                    select = (lp) ? select += '1' : select += '0'
                    encryptObject.push(select)
                }
                fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, encryptObject, 'image');
            }
        });
    },

    loading: function () {
        var socket = io();
        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var service = urlParams.get('service');
        var eventIndex = urlParams.get('id');

        var progressObject = ''

        function reloadProgress() {
            if (service == 'encrypt') progressObject = requestTable.getEncProgress();
            else if (service == 'decrypt') progressObject = requestTable.getDecProgress();
            var progress = progressObject['progress'];
            $('#progress').html(progress);
            if (progressObject['complete'] != 1) setTimeout(reloadProgress, 200);
            else {
                var msg = (service == 'encrypt') ? '비식별화' : '복호화';
                Swal.fire({
                    title: msg + '가 완료되었습니다!',
                    showCancelButton: false,
                    confirmButtonText: '확인',
                    icon: 'success',
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (service == 'encrypt') location.href = '/log';
                        if (service == 'decrypt') {
                            let timerInterval;
                            var typeStr = (type == 'image') ? '이미지' : '영상';
                            Swal.fire({
                                title: '원본 ' + typeStr + ' 다운로드',
                                html:
                                    '생성된 다운로드 버튼은 <b></b>동안 유효합니다.<br/>' +
                                    '<a href="" id="signedUrl" download>' +
                                    '<div id="download" class="btn">' +
                                    '<p>다운로드</p>' +
                                    '</div>' +
                                    '</a>',
                                // timer: 60000 * 15,
                                timer: 60000 * 15,
                                timerProgressBar: true,
                                icon: 'info',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    const content = Swal.getHtmlContainer()
                                    const $ = content.querySelector.bind(content)

                                    Swal.showLoading()
                                    let decDirectory, fileList, signedUrl;
                                    [decDirectory, fileList] = resultLoader.getDecFileInfo(eventIndex);

                                    const download = $('#download');
                                    const downloadLink = $('#signedUrl');

                                    if (fileList.length == 1) {
                                        signedUrl = resultLoader.getFileUrl(decDirectory[0], decDirectory[1], fileList);
                                        downloadLink.href = signedUrl[0]
                                    }
                                    else if (fileList.length > 1) {
                                        resultLoader.fileToZip({
                                            id: eventIndex,
                                            bucketName: decDirectory[0],    //참조할 버킷 이름
                                            subDirectory: decDirectory[1],  //참조할 object의 세부 경로
                                            fileName: fileList              //참조할 object filename 목록
                                        });

                                        socket.on('compress', function (data) {
                                            if (data.log == '압축 완료') {
                                                signedUrl = resultLoader.getFileUrl(decDirectory[0], decDirectory[1], ['Download.zip']);
                                                downloadLink.href = signedUrl;
                                            }
                                        });
                                    }
                                    download.addEventListener('click', () => {
                                        if(downloadLink.href == '') {
                                            Swal.fire({
                                                title: '다운로드 링크 생성중',
                                                text: '잠시만 기다려주세요! 서버에서 다운로드 링크를 생성중입니다.',
                                                confirmButtonText: '확인',
                                                allowOutsideClick: false,
                                                icon: 'info'
                                            })
                                        }
                                        else {
                                            socket.emit('deleteFile', {
                                                bucketName: decDirectory[0],
                                                subDirectory: decDirectory[1],
                                                fileName: (fileList.length > 1) ? ['Download.zip'] : fileList
                                            })
    
                                            Swal.fire({
                                                title: '다운로드가 시작됩니다!',
                                                text: '확인 버튼을 누르면 이전 페이지로 이동합니다.',
                                                confirmButtonText: '확인',
                                                allowOutsideClick: false
                                            }).then((result) => {
                                                if (result.isConfirmed) history.back();
                                            })
                                        }
                                    })

                                    const b = Swal.getHtmlContainer().querySelector('b')
                                    timerInterval = setInterval(() => {
                                        var seconds = parseInt(Swal.getTimerLeft() / 1000);
                                        var minute = parseInt((seconds % 3600) / 60);
                                        var sec = seconds % 60;
                                        b.textContent = minute + '분 ' + sec + '초'
                                    }, 100)
                                },
                                willClose: () => {
                                    clearInterval(timerInterval)
                                }
                            }).then((result) => {
                                if (result.dismiss === Swal.DismissReason.timer) {
                                    console.log('asdadsdas')
                                }
                            })
                        }
                    }
                })
            }
        }
        setTimeout(reloadProgress, 100);
    },

    video: function () {
        var html = ''
        var fileCount = 0;
        var fileWidth = []
        var fileHeight = []
        var videoDuration = []

        $("#selectKeyName").html(comm.getKeyList());

        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, fileCount, videoDuration] = fileModule.getFileList('video', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileWidth.length;
                console.log(fileCount)
            }, 200);
        });

        $("#folder").on('change', function () {
            [html, fileWidth, fileHeight, fileCount, videoDuration] = fileModule.getFileList('video', 'folder');
            setTimeout(function () {
                $('.uploadContent').html(html);
            }, 200);
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
            $(".folderSelect").removeClass('active')
            $(".fileSelect").addClass('active')
        });

        $(document).on("click", ".folderSelect", function () {
            $(".fileUpload").removeClass('active')
            $(".folderUpload").addClass('active')
            $(".fileSelect").removeClass('active')
            $(".folderSelect").addClass('active')
        });

        $(document).on("click", ".prevBtn", function () {
            location.href = "/main"
        });

        $(document).on("click", ".nextBtn", function () {
            if (fileCount == 0) {
                Swal.fire({
                    title: '파일 오류',
                    html:
                        '업로드된 파일이 없거나 잘못되었습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    icon: 'warning',
                });
            }
            else {
                var encryptObject = []
                for (var i = 0; i < fileCount; i++) {
                    var body = $('#file-' + i + ' .selectObject')[0].children[0].checked
                    var head = $('#file-' + i + ' .selectObject')[0].children[2].checked
                    var lp = $('#file-' + i + ' .selectObject')[0].children[4].checked

                    var select = ''
                    select = (body) ? select += '1' : select += '0'
                    select = (head) ? select += '1' : select += '0'
                    select = (lp) ? select += '1' : select += '0'
                    encryptObject.push(select)
                }
                fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, encryptObject, 'video');
            }
        });
    },

    detail: function () {
        var socket = io();

        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var eventIndex = urlParams.get('id');
        var mode = urlParams.get('mode');

        var selectedFile = []
        // [encDirectory, fileList] = resultLoader.getEncFileInfo(eventIndex);
        var encFileInfo = resultLoader.getEncFileInfo(eventIndex);
        var encDirectory = encFileInfo.encDirectory;
        var fileList = encFileInfo.fileList;
        var infoHtml = resultLoader.getInfoHtml(eventIndex);
        $('.infoArea')[0].innerHTML = infoHtml;

        $(document).ready(function () {
            var rest = $(".rest_info").text()
            if (rest == "O") {
                $(".file_recoConfirm").removeClass("hide")
                $(".select_recoConfirm").removeClass("hide")
            }
        });

        $(document).on("click", ".file_recoConfirm", function () {
            $('.recoConfirm').attr('data-value', $(this).data('value'));
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

        $("#select_file").on('change', function () {
            var file = document.getElementById('select_file').files[0];
            var fileName = file.name;
            $('.pemUpload').val(fileName);
        });

        $(document).on("click", ".recoConfirm", function () {
            var keyName = $('.file_key')[0].children[1].innerHTML
            if (mode == 'single') fileModule.verifyKey(keyName, eventIndex, fileList, type);
            else if (mode == 'group') {
                var selected = $(this).data('value');
                if(selected == 'all') fileModule.verifyKey(keyName, eventIndex, fileList, type);
                else if(selected == 'select'){
                    if(selectedFile.length == 0) Swal.fire({
                        title: '선택된 파일이 없습니다',
                        text: '복호화할 파일을 선택해 주세요.',
                        confirmButtonText: '확인',
                        allowOutsideClick: false,
                        icon: 'error'
                    })
                    else fileModule.verifyKey(keyName, eventIndex, selectedFile, type);
                }
            }
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
                    $('.recoConfirm').attr('data-value', $(this).data('value'));
                    selectedFile = [];
                    var imgDivList = document.getElementsByClassName('albumImg');
                    var len = imgDivList.length;
                    for (var i = 0; i < len; i++) {
                        if (imgDivList[i].className == 'albumImg active') selectedFile.push(fileList[i])
                    }
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
                    var imgnum = $(this).data("num")
                    var imgtag = '<img class="viewImg" src="' + signedUrl[imgnum] + '">'
                    var downloadArea = '<a class="imgConfirm" href="' + signedUrl[imgnum] + '" download>\
                        <p>이미지 다운로드</p>\
                    </a>\
                    <div class="cancel">\
                        <p>취소</p>\
                    </div>'
                    document.getElementById('selectImgArea').innerHTML = imgtag
                    document.getElementById('selectBtnArea').innerHTML = downloadArea
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
                        if (data.log == '압축 완료') {
                            new Promise((resolve, reject) => {
                                //파일 다운로드 경로 획득
                                var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], ['Download.zip']);
                                location.href = signedUrl;
                                resolve();
                            }).then(() => {
                                new Promise((resolve, reject) => {
                                    //다운로드 후 zip 파일 삭제
                                    Swal.fire('파일 다운로드가 시작되었습니다.', '', 'success')
                                    // var complete = resultLoader.deleteZipFile(encDirectory[0], encDirectory[1]);
                                    socket.emit('deleteFile', {
                                        bucketName: encDirectory[0],
                                        subDirectory: encDirectory[1],
                                        fileName: ['Download.zip']
                                    })
                                    // resolve(complete);
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
            var html = resultLoader.getVideoDetailHtml(signedUrl, fileList);
            $('#signedUrl').attr('href', signedUrl[0]);
        }
    },

    log: function () {
    
        function reloadProgress() {
            var encProgress = requestTable.getEncProgress();
            var progress = encProgress['progress']
            $('#progress').html(progress);
            if (encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
            else {
                var mainLog = requestTable.getAllEncRequestList()
                $(".mainLog").html(mainLog);
            }
        }

        reloadProgress();

        $(document).on("click", ".filter_video", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_file").val("")
                $(".group_file").val("")
            }
            else {
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("video")
                $(".group_file").val(0)
            }
        });

        $(document).on("click", ".filter_image", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_file").val("")
                $(".group_file").val("")
            }
            else {
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("image")
                $(".group_file").val(0)
            }
        });

        $(document).on("click", ".filter_album", function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass('active')
                $(".filter_file").val("")
                $(".group_file").val("")
            }
            else {
                $(".file_filter").removeClass('active')
                $(this).addClass('active')
                $(".filter_file").val("album")
                $(".group_file").val(1)
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
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).attr('data-id') + "&mode=single";;
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

        $(document).on("click", ".auth_modi", function () {
            var accountName = $(this).data("account");
            $(".subid").val(accountName)
            var authArea = subaccount.getAuthList(accountName);
            $(".authArea").html(authArea);
            $("#authModi").addClass('active')
        });

        $(document).on("click", ".authConfig", function () {
            var bucketAuth = ""
            var dbAuth = ""

            if ($('.bdownloadAuth').is(':checked')) bucketAuth += "1"
            else bucketAuth += "0"
            if ($('.buploadAuth').is(':checked')) bucketAuth += "1"
            else bucketAuth += "0"
            if ($('.bdeleteAuth').is(':checked')) bucketAuth += "1"
            else bucketAuth += "0"

            if ($('.dcreateAuth').is(':checked')) dbAuth += "1"
            else dbAuth += "0"
            if ($('.dreadAuth').is(':checked')) dbAuth += "1"
            else dbAuth += "0"
            if ($('.dupdateAuth').is(':checked')) dbAuth += "1"
            else dbAuth += "0"
            if ($('.ddeleteAuth').is(':checked')) dbAuth += "1"
            else dbAuth += "0"

            if ($('.encAuth').is(':checked')) var enc = 1
            else var enc = 0
            if ($('.decAuth').is(':checked')) var dec = 1
            else var dec = 0

            var accountName = $(".subid").val()

            subaccount.putSubAuth(bucketAuth, dbAuth, enc, dec, accountName)
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

        const patterns = {
            account_name: /^([a-z\d.-]+)@([a-z\d-]+\.)+([a-z]{2,})$/,
            password: /^[\w@-]{8,20}$/,
            repassword: /^[\w@-]{8,20}$/,
            company_name: /^[a-z\d]{1,20}$/i,
            owner_name: /^[a-z\d]{1,20}$/i,
            telephone: /^[0-9]{11}$/,
            verify_number: /^[0-9]{6}$/
        };

        const inputs = document.querySelectorAll('input');

        function validate(input, regex) {
            return regex.test(input.value) ? 'valid' : 'invalid';
        }

        inputs.forEach((input) => {
            input.addEventListener('keyup', (event) => {
                input.className = validate(event.target, patterns[event.target.attributes.name.value]);
            });
        });

        var verify = false;
        var verifyCode = null;
        $(document).on("click", "#email_send", function () {
            var email = $("#account_name").val();
            if (email) {
                Swal.fire('이메일로 인증번호가 전송되었습니다.', '', 'info').then(() => {
                    verifyCode = signup.sendMail(email);
                })
            }
            else Swal.fire('이메일 주소를 입력해 주세요', '', 'warning');
            // Swal.fire('이메일 인증번호를 확인해 주세요', '', 'info');
        });

        $(document).on("click", "#email_verify", function () {
            if (!$(this).hasClass('click')) {
                if ($("#verify_number").val() == verifyCode) {
                    Swal.fire('인증이 완료되었습니다.', '', 'success');
                    verify = true;
                    $(this).addClass('click');
                    $("#account_name").attr('disabled', true); // or false
                }
                else {
                    Swal.fire('인증번호가 일치하지 않습니다.', '', 'error');
                }
            }
        });

        $(document).on("click", "#tenant_register", function () {
            if (!verify) Swal.fire('인증 실패', '이메일 인증을 완료해 주세요', 'error');
            else {
                var accountName = $("#account_name").val();
                var password = $("#password").val();
                var repassword = $("#repassword").val();
                var companyName = $("#company_name").val();
                var ownerName = $("#owner_name").val();
                var telePhone = $("#telephone").val();
                if (password != repassword) Swal.fire('비밀번호가 일치하지 않습니다.', '', 'error');
                else signup.tenantSignUp(accountName, password, companyName, ownerName, telePhone);
            }
        });
    },

    findpwd: function () {
        $(document).on("click", ".findSave", function () {
            location.href = "/"
        });

        $(document).on("click", ".findCancel", function () {
            location.href = "/"
        });

        $(document).on("click", "#email_send", function () {
            var email = $("#account_name").val();
            if (email) login.forgetPassword(email);
        });
    },

    changepassword: function () {
        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var accountName = urlParams.get('emailAddress');
        var token = urlParams.get('token');

        var html = login.verifyResetToken(accountName, token);
        $('#changePassForm').html(html);

        $(document).on("click", "#confirm", function () {
            var password = $('#password').val();
            var repassword = $('#repassword').val();
        
            if (password != repassword) Swal.fire({
                title: '비밀번호 불일치',
                text: '입력하신 비밀번호가 일치하지 않습니다. 다시 입력해 주세요',
                confirmButtonText: '확인',
                allowOutsideClick: false,
                icon: 'warning'
            })
            else {
                login.resetPassword(accountName, password);
            }
        })
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