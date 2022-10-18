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
    let dateFormat2 = date.getFullYear() + '.' + ("0" + (date.getMonth() + 1)).slice(-2) + '.' + ("0" + date.getDate()).slice(-2);
    return dateFormat2;
}

function underTen(data) {
    let underTen;
    if (Number(data) <= 9) {
        underTen = "0" + data
    }
    else {
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
        var ext = parsedArray[parsedArray.length - 1];
        parsedArray = parsedArray.splice(0, parsedArray.length - 1);
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

function validEmail(obj) {
    if (validEmailCheck(obj) == false) {
        return false;
    }
    else {
        return true;
    }
}

function validEmailCheck(obj) {
    var pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return (obj.value.match(pattern) != null)
}

function validPhone(obj) {
    if (obj.length == 11) {
        return true;
    }
    else {
        return false;
    }
}
function progressBar(per) {
    if (per > 55) {
        $(".progressPer").css("color", "#fff");
    }
    per = per.toFixed(1);
    $(".progressPer").text(per + " %");
    $(".progressNow").css("width", "calc(" + per + "% - 20px)");
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
        var temp = comm.getUser()

        $(".curTenant").html(temp);
        // $("#selectKeyName").html(comm.getKeyList());

        function reloadProgress() {
            var encProgress = requestTable.getEncProgress();
            var progress = encProgress['progress']
            $('#progress').html(progress);
            if (encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
            else {
                var mainLog = requestTable.getRecentRequest('encrypt');
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

        var mainLog = requestTable.getRecentRequest('encrypt');
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

        $(document).on("click", ".m_logContent", function () {
            var type = $(this).data('type')
            if (type == '동영상 파일') {
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).data('id') + "&mode=single";
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

        // 파일 업로드 정보가 바뀔때마다 html 엎어서 화면에 갱신하고, 파일 너비 높이, 갯수 최신화
        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, fileCount, videoDuration] = fileModule.getFileList('image', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileWidth.length;
                fileIndex = [];
                for (var i = 0; i < fileCount; i++) fileIndex.push(i);
            }, 200)
        });

        // 파일 업로드 정보가 바뀔때마다 html 엎어서 화면에 갱신하고, 파일 너비 높이, 갯수 최신화
        $("#folder").on('change', function () {
            [html, fileWidth, fileHeight, fileCount, videoDuration] = fileModule.getFileList('image', 'folder');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileWidth.length;
                fileIndex = [];
                for (var i = 0; i < fileCount; i++) fileIndex.push(i);
            }, 200)
        });

        // 전체 삭제
        $(document).on("click", ".allDelete", function () {
            fileModule.alldeleteFile();
            fileCount = 0;
        });

        // 파일 삭제버튼 누를경우 작동 (튼튼함)
        $(document).on("click", ".uploadDelete", function () {
            var idx = $(this).attr('value')
            fileModule.deleteFile(idx);
            fileCount--;
            fileIndex = fileIndex.filter(function (item) {
                return item !== Number(idx);
            })
        });

        // 키 발급 만약 에러뜬다면 genKeyName val == '' 확인, 에러확률 거의 없음
        $(document).on("click", "#generateKey", function () {
            var genKeyName = $("#genKeyName").val();
            comm.generateKey(genKeyName, null);
        });

        var restoration = 0;
        var keyselect = '';
        $('input[type=radio][name=restoration]').on('change', function () {
            if ($(this).val() == 'true') {
                restoration = 1;
            }
            else {
                restoration = 0;
            }
        });

        $('input[type=radio][name=keySelect]').on('change', function () {
            if ($(this).val() == 'skey') {
                $("#genKeyName").attr("disabled", false);
                keyselect = $(this).val();
            }
            else keyselect = $(this).val();
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
            else if (keyselect == '' && restoration == 1) {
                Swal.fire({
                    title: '키 선택 오류',
                    html:
                        '키를 선택하지 않으셨습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    icon: 'warning',
                });
            }
            else {
                var encryptObject = []
                var allCheck = ""
                for (var i = 0; i < fileCount; i++) {
                    if(screen.width<=600){
                        var body = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[1].children[0].children[0].checked
                        var head = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[1].children[1].children[0].checked
                        var lp = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[1].children[2].children[0].checked
                    }
                    else{
                        var body = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[0].children[0].checked
                        var head = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[0].children[1].checked
                        var lp = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[0].children[2].checked
                    }
                    // var body = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[0].checked
                    // var head = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[2].checked
                    // var lp = $('#file-' + fileIndex[i] + ' .selectObject')[0].children[4].checked

                    var select = ''
                    select = (body) ? select += '1' : select += '0'
                    select = (head) ? select += '1' : select += '0'
                    select = (lp) ? select += '1' : select += '0'
                    encryptObject.push(select)
                }
                for (var j = 0; j < encryptObject.length; j++) {
                    if (encryptObject[j] == "000") {
                        allCheck = "false"
                        break;
                    }
                    else {
                        allCheck = "true"
                    }
                }
                if (allCheck == "true") {
                    //파일 업로드 후 최종 요청하는 내용(비식별화)
                    fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, encryptObject, 'image');
                    // comm.metering(fileWidth, fileHeight);
                }
                else {
                    Swal.fire({
                        title: '비식별 객체 선택 오류',
                        html:
                            '비식별 객체를 선택하지 않은 파일이 있어요.<br/>' +
                            '확인 후 재시도해 주세요.',
                        icon: 'warning',
                    });
                }
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

        function downloadAlert(typeStr, downloadURL, decDirectory, fileList, fileSize) {
            let timerInterval;
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

                    const download = $('#download');
                    const downloadLink = $('#signedUrl');
                    downloadLink.href = downloadURL;

                    download.addEventListener('click', () => {
                        if (downloadLink.href == '') {
                            Swal.fire({
                                title: '다운로드 링크 생성중',
                                text: '잠시만 기다려주세요! 서버에서 다운로드 링크를 생성중입니다.',
                                confirmButtonText: '확인',
                                allowOutsideClick: false,
                                icon: 'info'
                            })
                            downloadAlert(typeStr, downloadURL, decDirectory, fileList, fileSize);
                        }
                        else {
                            socket.emit('deleteFile', {
                                bucketName: decDirectory[0],
                                subDirectory: decDirectory[1],
                                fileName: (fileList.length > 1) ? ['Download.zip'] : fileList
                            })

                            var fileName = (fileList.length > 1) ? 'Download.zip' : fileList[0];
                            comm.meterDecDownload(eventIndex, type, fileName, fileSize);

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
                            let decDirectory, fileList, signedUrl, fileUrl, fileSize;
                            [decDirectory, fileList] = resultLoader.getDecFileInfo(eventIndex);

                            if (fileList.length == 1) {
                                //요청 결과물이 저장된 버킷 경로와 파일 이름을 갖고, 임시 다운로드 링크를 생성함
                                //에러나는 경우 : result_file_list가 없을때, 실제 파일이름이 다를때
                                signedUrl = resultLoader.getFileUrl(decDirectory[0], decDirectory[1], fileList);
                                // downloadLink.href = signedUrl[0]
                                fileUrl = signedUrl[0][0];
                                fileSize = signedUrl[0][1];
                                downloadAlert(typeStr, fileUrl, decDirectory, fileList, fileSize);
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
                                        fileUrl = signedUrl[0][0];
                                        fileSize = signedUrl[0][1];
                                        downloadAlert(typeStr, fileUrl, decDirectory, fileList, fileSize);
                                    }
                                });
                            }
                        }
                    }
                })
            }
        }
        setTimeout(reloadProgress, 300);
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
        var keyselect = '';
        $('input[type=radio][name=restoration]').on('change', function () {
            if ($(this).val() == 'true') {
                restoration = 1;
            }
            else {
                restoration = 0;
            }
        });

        $('input[type=radio][name=keySelect]').on('change', function () {
            if ($(this).val() == 'skey') {
                $("#genKeyName").attr("disabled", false);
                keyselect = $(this).val();
            }
            else keyselect = $(this).val();
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
            else if (keyselect == '' && restoration == 1) {
                Swal.fire({
                    title: '키 선택 오류',
                    html:
                        '키를 선택하지 않으셨습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    icon: 'warning',
                });
            }
            else {
                var encryptObject = []
                var allCheck = ""
                for (var i = 0; i < fileCount; i++) {
                    if(screen.width<=600){
                        var body = $('#file-' + i + ' .selectObject')[0].children[1].children[0].children[0].checked
                        var head = $('#file-' + i + ' .selectObject')[0].children[1].children[1].children[0].checked
                        var lp = $('#file-' + i + ' .selectObject')[0].children[1].children[2].children[0].checked
                    }
                    else{
                        var body = $('#file-' + i + ' .selectObject')[0].children[0].children[0].checked
                        var head = $('#file-' + i + ' .selectObject')[0].children[0].children[1].checked
                        var lp = $('#file-' + i + ' .selectObject')[0].children[0].children[2].checked
                    }

                    var select = ''
                    select = (body) ? select += '1' : select += '0'
                    select = (head) ? select += '1' : select += '0'
                    select = (lp) ? select += '1' : select += '0'
                    encryptObject.push(select)
                }
                for (var j = 0; j < encryptObject.length; j++) {
                    if (encryptObject[j] == "000") {
                        allCheck = "false"
                        break;
                    }
                    else {
                        allCheck = "true"
                    }
                }
                if (allCheck == "true") {
                    fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, encryptObject, 'video');
                }
                else {
                    Swal.fire({
                        title: '비식별 객체 선택 오류',
                        html:
                            '비식별 객체를 선택하지 않은 파일이 있어요.<br/>' +
                            '확인 후 재시도해 주세요.',
                        icon: 'warning',
                    });
                }
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
        var encFileInfo = resultLoader.getEncFileInfo(eventIndex); //비식별화 결과물 저장 경로와 파일 목록을 불러옴
        var encDirectory = encFileInfo.encDirectory;
        var fileList = encFileInfo.fileList;
        var infoHtml = resultLoader.getInfoHtml(eventIndex); // 우측 상세 정보 불러오기
        $('.infoArea')[0].innerHTML = infoHtml;

        $(document).ready(function () {
            var rest = $(".rest_info").text()
            if (rest == "복원 가능") {
                $(".file_recoConfirm").removeClass("hide")
                $(".select_recoConfirm").removeClass("hide")
                $(".check_reco").removeClass("hide")
                $(".allselect").removeClass("hide")
            }
        });

        $(document).on("click", ".file_recoConfirm", function () {
            $('#file').val('');
            $('.pemUpload').val('');
            $('.recoConfirm').attr('data-value', $(this).data('value'));
            $("#recoData").addClass('active')
        });

        $(document).on("click", ".cancel", function () {
            $('#file').val('');
            $('.pemUpload').val('');
            $('.modal').removeClass('active')
        });

        // 여기서는 업로드된 복호화 키 정보를 읽어오는 부분
        $("#file").on('change', function () {
            var file = document.getElementById('file').files[0];
            var fileName = file.name;
            $('.pemUpload').val(fileName);
        });

        // 여기서는 업로드된 복호화 키 정보를 읽어오는 부분
        $("#select_file").on('change', function () {
            var file = document.getElementById('select_file').files[0];
            var fileName = file.name;
            $('.pemUpload').val(fileName);
        });

        //이게 복호화 요청 확인 누르면
        $(document).on("click", ".recoConfirm", function () {
            var keyName = $('.file_key')[0].children[1].innerHTML
            if (mode == 'single') fileModule.verifyKey(keyName, eventIndex, fileList, type);
            else if (mode == 'group') {
                var selected = $(this).data('value');
                if (selected == 'all') fileModule.verifyKey(keyName, eventIndex, fileList, type);
                else if (selected == 'select') {
                    if (selectedFile.length == 0) Swal.fire({
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
                $('#signedUrl').attr('href', signedUrl[0][0]);
                var fileSize = signedUrl[0][1];
                var fileName = fileList[0];
                
                $(document).on("click", "#signedUrl", function () {
                    comm.meterEncDownload(eventIndex, type, fileName, fileSize);
                })
            }
            else if (mode == 'group') {
                $(document).on("click", ".select_recoConfirm", function () {
                    $('.recoConfirm').attr('data-value', $(this).data('value'));
                    selectedFile = [];
                    var imgDivList = document.getElementsByClassName('check_reco');
                    var len = imgDivList.length;
                    for (var i = 0; i < len; i++) {
                        if (imgDivList[i].checked == true) selectedFile.push(fileList[i])
                    }
                    $("#select_recoData").addClass('active')
                });

                $(document).on("click", ".albumImg", function () {
                    if(screen.width>600){
                        var imgnum = $(this).data("num")
                        var imgtag = '<img class="viewImg" src="' + signedUrl[imgnum][0] + '">'
                        var downloadArea = '<a class="imgConfirm" href="' + signedUrl[imgnum][0] + '" download>\
                            <p>이미지 다운로드</p>\
                        </a>'
                        document.getElementById('selectImgArea').innerHTML = imgtag
                        document.getElementById('selectBtnArea').innerHTML = downloadArea
                        $("#imgView").addClass('active')
                    }
                });

                $(document).on("click", ".hoverdiv", function () {
                    var imgnum = $(this).data("num")
                    var imgtag = '<img class="viewImg" src="' + signedUrl[imgnum][0] + '">'
                    var downloadArea = '<a class="imgConfirm" href="' + signedUrl[imgnum][0] + '" download>\
                        <p>이미지 다운로드</p>\
                    </a>'
                    document.getElementById('selectImgArea').innerHTML = imgtag
                    document.getElementById('selectBtnArea').innerHTML = downloadArea
                    $("#imgView").addClass('active')
                });

                $(document).on("click", ".allselect", function () {
                    if ($('.allselect').is(":checked")) {
                        $("input:checkbox[class=check_reco]").prop("checked", true);
                    }
                    else {
                        $('input[class=check_reco]:checked').prop('checked', false)
                    }
                });

                $(document).on("click", ".check_reco", function () {
                    if (!$(this).is(":checked")) {
                        $("input:checkbox[class=allselect]").prop("checked", false);
                    }
                });

                $(document).on("mouseover", ".albumImg", function () {
                    var num = $(this).data('num')
                    $("." + num + "").removeClass("hide")
                });

                $(document).on("mouseleave", ".albumImg", function () {
                    var num = $(this).data('num')
                    $("." + num + "").addClass("hide")
                });

                $(document).on("click", ".recoConfirm", function () {
                    $('.modal').removeClass('active')
                });

                $(document).on("click", "#signedUrl", function () {
                    let timerInterval
                    Swal.fire({
                        title: '파일 다운로드 준비중',
                        text: '파일을 압축중입니다. 잠시만 기다려주세요!',
                        timer: 99999999999,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                            console.log('I was closed by the timer')
                        }
                    })
                    resultLoader.fileToZip({
                        id: eventIndex,
                        bucketName: encDirectory[0],    //참조할 버킷 이름
                        subDirectory: encDirectory[1],  //참조할 object의 세부 경로
                        fileName: fileList              //참조할 object filename 목록
                    });
                    socket.on('compress', function (data) {
                        if (data.log == '압축 완료') {
                            setTimeout(function() {
                                new Promise((resolve, reject) => {
                                    //파일 다운로드 경로 획득
                                    var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], ['Download.zip']);
                                    var fileUrl = signedUrl[0][0];
                                    var fileSize = signedUrl[0][1];
                                    location.href = fileUrl;

                                    comm.meterEncDownload(eventIndex, type, 'Download.zip', fileSize);
                                    resolve();
                                }).then(() => {
                                    new Promise((resolve, reject) => {
                                        //다운로드 후 zip 파일 삭제
                                        Swal.fire('파일 다운로드가 시작되었습니다.', '', 'success')
                                        socket.emit('deleteFile', {
                                            bucketName: encDirectory[0],
                                            subDirectory: encDirectory[1],
                                            fileName: ['Download.zip']
                                        })
                                        // resolve(complete);
                                    })
                                })
                            }, 500)
                        }
                    });
                });
                $('.lockDataList')[0].innerHTML = html;
            }
        }
        else if (type == 'video') {
            var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);
            var html = resultLoader.getVideoDetailHtml(signedUrl, fileList);
            $('#signedUrl').attr('href', signedUrl[0][0]);
            $('.fullname').text($('.file_fullname').text())

            var fileSize = signedUrl[0][1];
            var fileName = fileList[0];
            
            $(document).on("click", "#signedUrl", function () {
                comm.meterEncDownload(eventIndex, type, fileName, fileSize);
            })
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

        $(document).on("click", ".allSearch", function () {
            if ($('.allSearch').is(':checked')) {
                $(".filter_video").prop("checked", true);
                $(".filter_image").prop("checked", true);
                $(".filter_album").prop("checked", true);
                $(".filter_rest").prop("checked", true);
                $(".filter_norest").prop("checked", true);
                $(".date_filter").prop("checked", false);
                $(".startVal").val("")
                $(".endVal").val("")
            }
            else {
                $(".filter_video").prop("checked", false);
                $(".filter_image").prop("checked", false);
                $(".filter_album").prop("checked", false);
                $(".filter_rest").prop("checked", false);
                $(".filter_norest").prop("checked", false);
                $(".date_filter").prop("checked", false);
                $(".startVal").val("")
                $(".endVal").val("")
            }
            $('.startVal').addClass('disable')
            $('.endVal').addClass('disable')
        });

        $(document).on("click", ".date_filter", function () {
            var date = $(this).val()
            if (date == "select") {
                $('.startVal').removeClass('disable')
                $('.endVal').removeClass('disable')
            }
            else if (date == "yesterday") {
                $(".startVal").val(yesterday())
                $(".endVal").val(yesterday())
                $('.startVal').addClass('disable')
                $('.endVal').addClass('disable')
            }
            else if (date == "today") {
                $(".startVal").val(today())
                $(".endVal").val(today())
                $('.startVal').addClass('disable')
                $('.endVal').addClass('disable')
            }
            else if (date == "week") {
                $(".startVal").val(week())
                $(".endVal").val(today())
                $('.startVal').addClass('disable')
                $('.endVal').addClass('disable')
            }
            else if (date == "month") {
                $(".startVal").val(month())
                $(".endVal").val(today())
                $('.startVal').addClass('disable')
                $('.endVal').addClass('disable')
            }
        });

        $(document).on("click", ".search", function () {
            var filter_video = $('.filter_video').is(':checked')
            var filter_image = $('.filter_image').is(':checked')
            var filter_album = $('.filter_album').is(':checked')
            var filter_reco = $('.filter_rest').is(':checked')
            var filter_norest = $('.filter_norest').is(':checked')
            if(screen.width<=600){
                var startDate = $(".m_date .startVal").val();
                var endDate = $(".m_date .endVal").val();
            }
            else{
                var startDate = $(".pc_date .startVal").val();
                var endDate = $(".pc_date .endVal").val();
            }

            if (filter_video == false && filter_image == false && filter_album == false || filter_video == true && filter_image == true && filter_album == true) {
                var filter_file = ""
            }
            else {
                var filter_file = "no"
            }

            if (filter_reco == false && filter_norest == false || filter_reco == true && filter_norest == true) {
                var filter_rest = ""
            }
            else {
                var filter_rest = "no"
            }

            if (filter_video == "" && filter_image == "" && filter_album == "" && filter_reco == "" && filter_norest == "" && startDate == "" && endDate == "") {
                Swal.fire('검색을 진행하시려면 조건을 정한 뒤 진행해주세요.', '', 'error')
            }
            else if (startDate > today() || endDate > today()) {
                Swal.fire('오늘날짜보다 크게 설정 할 수 없어요.', '', 'error')
            }
            else if (startDate > endDate) {
                Swal.fire('시작날짜를 종료날짜보다 크게 할 수 없어요.', '', 'error')
            }
            else {
                console.log(filter_video, filter_image, filter_album, filter_reco, filter_norest, filter_file, filter_rest, startDate, endDate)
                var mainLog = requestTable.postDataSearch(filter_video, filter_image, filter_album, filter_reco, filter_norest, filter_file, filter_rest, startDate, endDate)
                $(".mainLog").html(mainLog);
                if(screen.width<=600){
                    m_load('.mainLog', '5');
                }
                else{
                    load('.mainLog', '5');
                }
            }
        });

        $(document).on("click", ".detailInfo", function () {
            var type = $(this).data('type')
            if (type == '동영상 파일') {
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).attr('data-id') + "&mode=single";;
            }
            else if (type == '이미지 파일') {
                location.href = "/encrypt/image/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=single";
            }
            else if (type == '이미지 그룹') {
                location.href = "/encrypt/album/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=group";
            }
        });

        $(document).on("click", ".m_logContent", function () {
            var type = $(this).data('type')
            if (type == '동영상 파일') {
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).attr('data-id') + "&mode=single";;
            }
            else if (type == '이미지 파일') {
                location.href = "/encrypt/image/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=single";
            }
            else if (type == '이미지 그룹') {
                location.href = "/encrypt/album/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=group";
            }
        });

        var requestList = requestTable.getAllEncRequestList()
        $(".mainLog").html(requestList);

        
        if(screen.width<=600){
            m_load('.mainLog', '5');
            $(document).on("click", "#enc_more .morebutton", function () {
                m_load('.mainLog', '5', '#enc_more');
            })
        }
        else{
            load('.mainLog', '5');
            $(document).on("click", "#enc_more .morebutton", function () {
                load('.mainLog', '5', '#enc_more');
            })
        }

        function load(id, cnt, btn) {
            var enc_list = id + " .logContent:not(.active)";
            var enc_length = $(enc_list).length;
            var enc_total_cnt;
            if (cnt < enc_length) {
                enc_total_cnt = cnt;
                $('#enc_more').show()
            } else {
                enc_total_cnt = enc_length;
                $('#enc_more').hide()
            }
            $(enc_list + ":lt(" + enc_total_cnt + ")").addClass("active");
        }

        function m_load(id, cnt, btn) {
            var enc_list = id + " .m_logContent:not(.active)";
            var enc_length = $(enc_list).length;
            var enc_total_cnt;
            if (cnt < enc_length) {
                enc_total_cnt = cnt;
                $('#enc_more').show()
            } else {
                enc_total_cnt = enc_length;
                $('#enc_more').hide()
            }
            $(enc_list + ":lt(" + enc_total_cnt + ")").addClass("active");
        }
    },

    usage: function () {
        var d = new Date();
        var sel_month = -1; // 월을 조절하시면 됩니다. -1이면 전달을 +1이면 다음달을..
        d.setMonth(d.getMonth() + sel_month ); 
        
        var year    = d.getFullYear();
        var month   = ('0' + (d.getMonth() +  1 )).slice(-2);
        var searchMonth = year+"-"+month;

        $("#startVal").val(searchMonth);

        var getMonthUsage = requestTable.getMonthUsage(searchMonth)
        $(".logArea").html(getMonthUsage);

        $(document).on("click", ".search", function () {
            var type = $("input[type=radio][name=search_filter]:checked").val();
            var date = $("#startVal").val();
            if(type="all_count"){
                var getMonthUsage = requestTable.getMonthUsage(date)
                $(".logArea").html(getMonthUsage);
            }
            else{
                var getMonthTypeUsage = requestTable.getMonthTypeUsage(type, date)
                $(".logArea").html(getMonthTypeUsage);
                load('.mainLog', '5');
            }
        });

        $(document).on("click", "#enc_more .morebutton", function () {
            load('.mainLog', '5', '#enc_more');
        })

        function load(id, cnt, btn) {
            var enc_list = id + " .logContent:not(.active)";
            var enc_length = $(enc_list).length;
            var enc_total_cnt;
            if (cnt < enc_length) {
                enc_total_cnt = cnt;
                $('#enc_more').show()
            } else {
                enc_total_cnt = enc_length;
                $('#enc_more').hide()
            }
            $(enc_list + ":lt(" + enc_total_cnt + ")").addClass("active");
        }
    },

    decrypt_log: function () {

        function reloadProgress() {
            var encProgress = requestTable.getDecProgress();
            var progress = encProgress['progress']
            $('#progress').html(progress);
            if (encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
            else {
                var mainLog = requestTable.getAllDecRequestList()
                $(".mainLog").html(mainLog);
            }
        }

        reloadProgress();

        $(document).on("click", ".allSearch", function () {
            if ($('.allSearch').is(':checked')) {
                // $(".filter_video").prop("checked", true);
                // $(".filter_image").prop("checked", true);
                // $(".filter_album").prop("checked", true);
                // $(".filter_rest").prop("checked", true);
                // $(".filter_norest").prop("checked", true);
                $(".date_filter").prop("checked", false);
                $("#startVal").val("")
                $("#endVal").val("")
            }
            else {
                // $(".filter_video").prop("checked", false);
                // $(".filter_image").prop("checked", false);
                // $(".filter_album").prop("checked", false);
                // $(".filter_rest").prop("checked", false);
                // $(".filter_norest").prop("checked", false);
                $(".date_filter").prop("checked", false);
                $("#startVal").val("")
                $("#endVal").val("")
            }
            var start = document.getElementById('startVal')
            var end = document.getElementById('endVal')
            start.disabled = true;
            end.disabled = true;
        });

        $(document).on("click", ".date_filter", function () {
            var date = $(this).val()
            var start = document.getElementById('startVal')
            var end = document.getElementById('endVal')
            if (date == "select") {
                start.disabled = false;
                end.disabled = false;
            }
            else if (date == "yesterday") {
                $("#startVal").val(yesterday())
                $("#endVal").val(yesterday())
                start.disabled = true;
                end.disabled = true;
            }
            else if (date == "today") {
                $("#startVal").val(today())
                $("#endVal").val(today())
                start.disabled = true;
                end.disabled = true;
            }
            else if (date == "week") {
                $("#startVal").val(week())
                $("#endVal").val(today())
                start.disabled = true;
                end.disabled = true;
            }
            else if (date == "month") {
                $("#startVal").val(month())
                $("#endVal").val(today())
                start.disabled = true;
                end.disabled = true;
            }
        });

        // $(document).on("click", ".search", function () {
        //     // var filter_video = $('.filter_video').is(':checked')
        //     // var filter_image = $('.filter_image').is(':checked')
        //     // var filter_album = $('.filter_album').is(':checked')
        //     // var filter_reco = $('.filter_rest').is(':checked')
        //     // var filter_norest = $('.filter_norest').is(':checked')
        //     var startDate = $("#startVal").val();
        //     var endDate = $("#endVal").val();

        //     // if(filter_video == false && filter_image == false && filter_album == false || filter_video == true && filter_image == true && filter_album == true){
        //     //     var filter_file = ""
        //     // }
        //     // else {
        //     //     var filter_file = "no"
        //     // }

        //     // if(filter_reco == false && filter_norest == false || filter_reco == true && filter_norest == true){
        //     //     var filter_rest = ""
        //     // }
        //     // else {
        //     //     var filter_rest = "no"
        //     // }

        //     // if (filter_video == "" && filter_image == "" && filter_album == "" && filter_reco == "" && filter_norest == "" && startDate == "" && endDate == "") {
        //     //     Swal.fire('검색을 진행하시려면 조건을 정한 뒤 진행해주세요.', '', 'error')
        //     // }
        //     if(startDate>today() || endDate>today()){
        //         Swal.fire('오늘날짜보다 크게 설정 할 수 없어요.', '', 'error')
        //     }
        //     else if(startDate>endDate){
        //         Swal.fire('시작날짜를 종료날짜보다 크게 할 수 없어요.', '', 'error')
        //     }
        //     else {
        //         // console.log(filter_video, filter_image, filter_album, filter_reco, filter_norest, filter_file, filter_rest, startDate, endDate)
        //         var mainLog = requestTable.postDataSearch(startDate, endDate)
        //         $(".mainLog").html(mainLog);
        //         load('.mainLog', '5');
        //     }
        // });

        $(document).on("click", ".detailInfo", function () {
            var type = $(this).data('type')
            if (type == '동영상 파일') {
                location.href = "/encrypt/video/detail" + "?type=video&id=" + $(this).attr('data-id') + "&mode=single";;
            }
            else if (type == '이미지 파일') {
                location.href = "/encrypt/image/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=single";
            }
            else if (type == '이미지 그룹') {
                location.href = "/encrypt/album/detail" + "?type=image&id=" + $(this).attr('data-id') + "&mode=group";
            }
        });

        var requestList = requestTable.getAllDecRequestList()
        $(".mainLog").html(requestList);

        load('.mainLog', '5');
        $(document).on("click", "#enc_more .morebutton", function () {
            load('.mainLog', '5', '#enc_more');
        })

        function load(id, cnt, btn) {
            var enc_list = id + " .logContent:not(.active)";
            var enc_length = $(enc_list).length;
            var enc_total_cnt;
            if (cnt < enc_length) {
                enc_total_cnt = cnt;
                $('#enc_more').show()
            } else {
                enc_total_cnt = enc_length;
                $('#enc_more').hide()
            }
            $(enc_list + ":lt(" + enc_total_cnt + ")").addClass("active");
        }
    },

    myinfo: function () {
        $(document).on("click", ".infoSave", function () {
            var name = $(".view_name").val()
            var email = $(".view_email").val()
            var now_pass = $(".now_pass").val()
            var new_pass = $(".new_pass").val()
            var new_passConfig = $(".new_passConfig").val()
            userinfo.infoModi(name, email, now_pass, new_pass, new_passConfig)
        });

        $(document).on("change", ".view_email", function () {
            if ($(this).val() != "") {
                var validemail = validEmail(this)
                if (validemail == false) {
                    $(".email_error").addClass('active')
                }
                else {
                    $(".email_error").removeClass('active')
                }
            }
        });

        $(document).on("change", ".view_phone", function () {
            if ($(this).val() != "") {
                var validphone = validPhone(this)
                if (validphone == false) {
                    $(".phone_error").addClass('active')
                }
                else {
                    $(".phone_error").removeClass('active')
                }
            }
        });

        var getFirtstInfo = userinfo.getFirtstInfo()
        $(".userinfoFirst").html(getFirtstInfo);

        var getSecondInfo = userinfo.getSecondInfo()
        $(".userinfoSecond").html(getSecondInfo);

        var getloginAlias = userinfo.getloginAlias()
        $(".login_alias").html(getloginAlias);
    },

    key: function () {
        var keyContent = requestTable.getAllKeyList()
        $(".listContent").html(keyContent);

        $(document).on("click", ".key_add", function () {
            $("#keyAdd").addClass('active')
            $("#keyAdd").find('[autofocus]').focus();
        });

        $(document).on("click", ".memo_modi", function () {
            var key_idx = $(this).data("id")
            var keymemo_modi = requestTable.getKeyMemo(key_idx)
            $(".keymemo_modi").val(keymemo_modi)
            // $(".bodyMiddle").html(keymemo_modi)
            $("#memoModi").addClass('active')

            $(document).on("click", ".memosave", function () {
                var key_memo = $(".keymemo_modi").val()
                requestTable.updateKeyMemo(key_idx, key_memo)
            });
        });

        // $(document).on("click", ".memosave", function () {
        //     var key_memo = $(".keymemo_modi").val()
        //     requestTable.postUpdateKeyMemo(key_memo)
        // });

        $(document).on("click", ".cancel", function () {
            $('.modal').removeClass('active')
            $('.keyname').val("")
            $('.keymemo').val("")
        });

        $(document).on("click", ".allClear", function () {
            $('.keymemo_modi').val('')
        });

        $(document).on("click", "#generateKey", function () {
            if ($("#genKeyName").val() == "") {
                Swal.fire('Key 이름을 입력해주세요.', '', 'warning');
            }
            else {
                var genKeyName = $("#genKeyName").val();
                var keyMemo = $("#keyMemo").val();
                comm.generateKey(genKeyName, keyMemo);
            }
        });
    },

    submanage: function () {
        $(document).on("click", ".sub_add", function () {
            location.href = "/submanage/add"
        });

        $(document).on("click", ".subkey_modi", function () {
            var accessInput = subaccount.getAccessKey();
            $(".keyArea").html(accessInput);
            $("#subKeyModi").addClass('active')
        });

        $(document).on("click", ".keyConfig", function () {
            var accessKey = $(".accessKey").val();
            subaccount.putAccessKey(accessKey)
        });

        $(document).on("click", ".pass_modi", function () {
            $("#passModi").addClass('active')
            $("#passModi").find('[autofocus]').focus();
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
            $('.modi_password').val("");
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

            if (accountName == '' || password == '' || repassword == '' || userName == '' || email == '') Swal.fire('빈 칸에 정보를 입력해주세요.', '', 'warning');
            else {
                if (password == repassword) {
                    var subAccountInfo = {
                        account_name: accountName,
                        password: password,
                        user_name: userName,
                        email: email
                    }
                    var result = subaccount.addSubAccount(subAccountInfo);
                    if (result == true) {
                        Swal.fire('서브계정 생성이 완료되었습니다.', '', 'success').then(() => {
                            location.href = '/submanage';
                        })
                    }
                    else if (result == "length_error") {
                        Swal.fire('비밀번호는 8자 이상 입력해주세요.', '', 'warning').then(() => {
                        })
                    }
                    else if (result == "check_error") {
                        Swal.fire('비밀번호는 영문, 숫자를 혼합하여 입력해주세요.', '', 'warning').then(() => {
                        })
                    }
                    else {
                        Swal.fire('비밀번호를 다시 한번 확인해주세요.', '', 'warning').then(() => {
                        })
                    }
                }
                else {
                    Swal.fire('비밀번호가 일치하지 않습니다.', '', 'error')
                }
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

        $(document).on("change", ".regi_id", function () {
            if ($(this).val() != "") {
                var validemail = validEmail(this)
                if (validemail == false) {
                    $(".email_error").addClass('active')
                }
                else {
                    $(".email_error").removeClass('active')
                }
            }
        });

        const patterns = {
            account_name: /^([a-z\d.-]+)@([a-z\d-]+\.)+([a-z]{2,})$/,
            password: /^[\w@-]{8,20}$/,
            repassword: /^[\w@-]{8,20}$/,
            company_name: /^[a-z\d]{1,20}$/i,
            owner_name: /^[a-z\d]{1,20}$/i,
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
                var exist = signup.checkDuplicate(email);
                if (!exist) {
                    Swal.fire('이메일로 인증번호가 전송되었습니다.', '', 'info').then(() => {
                        verifyCode = signup.sendMail(email);
                    })
                }
                else {
                    Swal.fire('이미 사용중인 계정입니다.', '', 'warning')
                }
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
                if (password != repassword) Swal.fire('비밀번호가 일치하지 않습니다.', '', 'error');
                else if (password == '' || repassword == '' || companyName == '' || ownerName == '') Swal.fire('빈 칸에 정보를 입력해주세요.', '', 'warning');
                else signup.tenantSignUp(accountName, password, companyName, ownerName);
            }
        });
    },

    findid: function () {

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
            if (email) {
                var exist = signup.checkDuplicate(email);
                if (exist) {
                    login.forgetPassword(email);
                }
                else {
                    Swal.fire('가입된 정보가 없습니다.', '', 'warning')
                }
            }
            else Swal.fire('빈 칸을 입력해 주세요.', '', 'warning')
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

            if (password == '') {
                Swal.fire('변경할 비밀번호를 입력해주세요.', '', 'warning');
            }
            else {
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
            }
        })
    },

    test: function () {
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