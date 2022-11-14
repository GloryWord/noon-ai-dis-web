'use strict';

DIS.Web.Init = DIS.Web.Init || {};

var init = DIS.Web.Init;
init = {

    // 유저 로그인 화면 제어
    index: function () {

        login.sessionCheck();

        $(document).on("click", "#loginButton", function () {
            var accountName = $("#name").val();
            var password = $("#pass").val();
            if (accountName && password) login.login(accountName, password);
            else {
                if (accountName == '') var msg = '아이디';
                if (password == '') var msg = '비밀번호';
                if (accountName == '' && password == '') var msg = '아이디와 비밀번호';
                Swal.fire({
                    title: msg + '를 입력해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        });
        let verifyCode = null;
        $(document).on("click", "#email_send", function () {
            let email = $(".auth_id").val();
            verifyCode = login.secondaryEmailSend(email);
        });
        $(document).on("click", ".auth_confirm", function () {
            let user_code = $("#user_input_code").val();
            let isDev = login.isDevSession();
            console.log('isDev : '+isDev);
            if (isDev) {
                login.authenticationVerify();
                location.href = "/main"
            }
            else {
                if (verifyCode == user_code) {
                    login.authenticationVerify();
                    location.href = "/main"
                } else {
                    Swal.fire({
                        title: "2차 인증에 실패했습니다.",
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
        });
    },

    sublogin: function () {

        login.sessionCheck();
        
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
                Swal.fire({
                    title: msg + '를 입력해 주세요.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        });
        let verifyCode = null;
        $(document).on("click", "#email_send", function () {
            let email = $(".auth_id").val();
            verifyCode = login.secondaryEmailSend(email);
        });

        $(document).on("click", ".auth_confirm", function () {
            let user_code = $("#user_input_code").val();
            let isDev = login.isDevSession();
            //isDev = false;
            if (isDev) {
                login.authenticationVerify();
                location.href = "/main"
            }
            else {
                if (verifyCode == user_code) {
                    login.authenticationVerify();
                    location.href = "/main"
                } else {
                    Swal.fire({
                        title: "2차 인증에 실패했습니다.",
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
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
            var status = encProgress['status']
            if(status == null){
                return 0
            }
            else{
                if(status.indexOf('FAIL')==1){
                    return 0
                }
                else if(status.indexOf("SUCCESS")==1) {
                    if (encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
                    else {
                        var mainLog = requestTable.getRecentRequest('encrypt');
                        $(".mainLog").html(mainLog);
                    }
                }
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
        var socket = io();
        var html = ''
        var fileCount = 0;
        var fileIndex = [];
        var fileWidth = []
        var fileHeight = []
        var fileSize = []
        var videoDuration = []

        var uploadID = makeid(6);

        socket.on('delMsgToClient', function (msg) {
            if(uploadID == msg.id) {
                Swal.fire({
                    title: msg.title,
                    html: msg.html,
                    confirmButtonText: '확인',
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) location.reload();
                })
            }
        });

        $("#selectKeyName").html(comm.getKeyList());

        // 파일 업로드 정보가 바뀔때마다 html 엎어서 화면에 갱신하고, 파일 너비 높이, 갯수 최신화
        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, fileSize, fileCount, videoDuration] = fileModule.getFileList('image', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileWidth.length;
                fileIndex = [];
                for (var i = 0; i < fileCount; i++) fileIndex.push(i);
            }, 200)
        });

        // 파일 업로드 정보가 바뀔때마다 html 엎어서 화면에 갱신하고, 파일 너비 높이, 갯수 최신화
        $("#folder").on('change', function () {
            [html, fileWidth, fileHeight, fileSize, fileCount, videoDuration] = fileModule.getFileList('image', 'folder');
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

        var cKey = 1
        var sKey = "select"
        // 키 발급 만약 에러뜬다면 genKeyName val == '' 확인, 에러확률 거의 없음
        $(document).on("click", "#generateKey", function () {
            var genKeyName = $("#genKeyName").val();
            cKey = 1;
            sKey = "select";
            comm.generateKey(genKeyName, null);
        });

        var restoration = 0;
        var keyselect = '';
        $('input[type=radio][name=restoration]').on('change', function () {
            if ($(this).val() == 'true') {
                restoration = 1;
                cKey = 0;
                sKey = "";
            }
            else {
                restoration = 0;
                cKey = 1
                sKey = "select";
            }
        });

        $('input[type=radio][name=keySelect]').on('change', function () {
            if ($(this).val() == 'skey') {
                $("#genKeyName").attr("disabled", false);
                keyselect = $(this).val();
                cKey = 1;
            }
            else {
                keyselect = $(this).val();
                cKey = 0;
            }
        });

        $(document).on("click", ".dropdown_content", function () {
            sKey = "select"
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

        $(document).on("click", ".uploadBtnArea", function () {
            $(".uploadBtn_area").removeClass('hide')
            $(".nextBtn").removeClass('hide')
            $(".progressContainer").addClass('hide')
            $(".file_info_area").removeClass('active')
            $(".uploadFooter").removeClass('active')
        });

        $(document).on("click", ".prevBtn", function () {
            location.href = "/main"
        });

        var postData, filePath;
        $(document).on("click", ".nextBtn", function () {
            if (fileCount == 0) {
                Swal.fire({
                    title: '파일 오류',
                    html:
                        '업로드된 파일이 없거나 잘못되었습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                $(".nextBtn").addClass('hide')
                $(".progressContainer").removeClass('hide')
                var callback = fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, 'image');
                setTimeout(function() {
                    callback.then((data) => {
                        console.log(data);
                        postData = data[0]
                        filePath = data[2][0]
                        setTimeout(function() {
                            socket.emit('delUploadedFile', {
                                filePath: filePath,
                                id: uploadID
                            })
                        }, 1000)
                    })
                }, 1000)
            }
        });

        $(document).on("click", ".encryptBtn", function () {
            var encryptObject = []
            var allCheck = ""
            for (var i = 0; i < fileCount; i++) {
                if (screen.width <= 600) {
                    var body = $('#file-' + i + ' .selectObject')[0].children[1].children[0].children[0].checked
                    var head = $('#file-' + i + ' .selectObject')[0].children[1].children[1].children[0].checked
                    var lp = $('#file-' + i + ' .selectObject')[0].children[1].children[2].children[0].checked
                }
                else {
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
            if (allCheck == "true" && cKey==1 && sKey!="") {
                var encryptObj = Object.assign({}, encryptObject);
                postData['encryptObject'] = JSON.stringify(encryptObj);
                var bitrateArray = []
                fileModule.encrypt(postData, fileWidth, fileHeight, restoration, bitrateArray, 'image');
                socket.emit('cancelDeleteFile', 'cancel')
            }
            else if(allCheck == "false") {
                Swal.fire({
                    title: '비식별 객체 선택 오류',
                    html:
                        '비식별 객체를 선택하지 않은 파일이 있어요.<br/>' +
                        '확인 후 재시도해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if(cKey==0 || sKey==""){
                Swal.fire({
                    title: '키 선택 오류',
                    html:
                        '키를 선택하지 않으셨습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
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
                            comm.meterDownload(eventIndex, type, fileName, fileSize);

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
            var status = progressObject['status']
            $('#progress').html(progress);
            if(status.indexOf('FAIL')==1 || status.indexOf('Fail')!=-1){
                Swal.fire({
                    title: '예기치 못한 오류로 작업이 중단됐습니다.',
                    text: '지속적으로 오류가 발생하면 문의해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                }).then((result) => {
                    location.href = "/main"
                })
            }
            else if(status.indexOf("SUCCESS")==1 || status.indexOf("Sucess")==1) {
                if (progressObject['complete'] != 1) setTimeout(reloadProgress, 200);
                else {
                    var msg = (service == 'encrypt') ? '비식별화' : '복호화';
                    Swal.fire({
                        title: msg + '가 완료되었습니다!',
                        showCancelButton: false,
                        confirmButtonText: '확인',
                        icon: 'success',
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (service == 'encrypt') location.href = '/encrypt/log';
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
        }
        setTimeout(reloadProgress, 300);
    },

    video: function () {
        var socket = io();
        var html = ''
        var fileCount = 0;
        var fileWidth = []
        var fileHeight = []
        var fileSize = []
        var videoDuration = []

        var uploaded = false;

        socket.on('delMsgToClient', function (msg) {
            if(uploaded) {
                Swal.fire({
                    title: msg.title,
                    html: msg.html,
                    confirmButtonText: '확인',
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) location.reload();
                })
            }
        });

        $("#selectKeyName").html(comm.getKeyList());

        $("#file").on('change', function () {
            [html, fileWidth, fileHeight, fileSize, fileCount, videoDuration] = fileModule.getFileList('video', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileWidth.length;
                console.log(fileCount)
            }, 200);
        });

        $("#folder").on('change', function () {
            [html, fileWidth, fileHeight, fileSize, fileCount, videoDuration] = fileModule.getFileList('video', 'folder');
            setTimeout(function () {
                $('.uploadContent').html(html);
            }, 200);
        });

        $(document).on("click", ".uploadDelete", function () {
            var idx = $(this).attr('value')
            fileModule.deleteFile(idx);
        });

        var cKey = 1
        var sKey = "select"
        $(document).on("click", "#generateKey", function () {
            var genKeyName = $("#genKeyName").val();
            cKey = 1;
            sKey = "select";
            comm.generateKey(genKeyName, null);
        });

        var restoration = 0;
        var keyselect = '';
        $('input[type=radio][name=restoration]').on('change', function () {
            if ($(this).val() == 'true') {
                restoration = 1;
                cKey = 0;
                sKey = "";
            }
            else {
                restoration = 0;
                cKey = 1
                sKey = "select";
            }
        });

        $('input[type=radio][name=keySelect]').on('change', function () {
            if ($(this).val() == 'skey') {
                $("#genKeyName").attr("disabled", false);
                keyselect = $(this).val();
                cKey = 1;
            }
            else {
                keyselect = $(this).val();
                cKey = 0;
            }
        });

        $(document).on("click", ".dropdown_content", function () {
            sKey = "select"
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

        $(document).on("click", ".uploadBtnArea", function () {
            $(".uploadBtn_area").removeClass('hide')
            $(".nextBtn").removeClass('hide')
            $(".progressContainer").addClass('hide')
            $(".file_info_area").removeClass('active')
            $(".uploadFooter").removeClass('active')
        });

        $(document).on("click", ".prevBtn", function () {
            location.href = "/main"
        });

        var postData, bitrateArray, filePath;
        $(document).on("click", ".nextBtn", function () {
            if (fileCount == 0) {
                Swal.fire({
                    title: '파일 오류',
                    html:
                        '업로드된 파일이 없거나 잘못되었습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if (fileWidth[0]+fileHeight[0] > 3000) {
                Swal.fire({
                    title: '파일 해상도 초과',
                    html:
                        '1920 X 1080 을 초과하는 해상도입니다.<br/>' +
                        '서비스 안정성을 위해 1920 X 1080 크기 까지의<br/>' +
                        '영상을 서비스합니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if (fileSize[0] > 157286400) {
                Swal.fire({
                    title: '파일 용량제한 초과',
                    html:
                        '파일 용량이 150MB를 초과하였습니다.<br/>' +
                        '서비스 안정성을 위해 150MB 이하의<br/>' +
                        '영상을 서비스합니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                $(".nextBtn").addClass('hide')
                $(".progressContainer").removeClass('hide')

                var callback = fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, 'video');
                setTimeout(function() {
                    callback.then((data) => {
                        uploaded = true;
                        console.log(data);
                        postData = data[0]
                        bitrateArray = data[1]
                        filePath = data[2][0]
                        setTimeout(function() {
                            socket.emit('delUploadedFile', {
                                filePath: filePath
                            })
                        }, 1000)
                    })
                }, 1000)
            }
        });

        $(document).on("click", ".encryptBtn", function () {
            var encryptObject = []
            var allCheck = ""
            for (var i = 0; i < fileCount; i++) {
                if (screen.width <= 600) {
                    var body = $('#file-' + i + ' .selectObject')[0].children[1].children[0].children[0].checked
                    var head = $('#file-' + i + ' .selectObject')[0].children[1].children[1].children[0].checked
                    var lp = $('#file-' + i + ' .selectObject')[0].children[1].children[2].children[0].checked
                }
                else {
                    var body = $('#file-' + i + ' .selectObject')[0].children[0].children[0].checked
                    var head = $('#file-' + i + ' .selectObject')[0].children[0].children[2].checked
                    var lp = $('#file-' + i + ' .selectObject')[0].children[0].children[4].checked
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
            if (allCheck == "true" && cKey==1 && sKey!="") {
                var encryptObj = Object.assign({}, encryptObject);
                postData['encryptObject'] = JSON.stringify(encryptObj);
                fileModule.encrypt(postData, fileWidth, fileHeight, restoration, bitrateArray, 'video');
                socket.emit('cancelDeleteFile', 'cancel')
            }
            else if(allCheck == "false") {
                Swal.fire({
                    title: '비식별 객체 선택 오류',
                    html:
                        '비식별 객체를 선택하지 않은 파일이 있어요.<br/>' +
                        '확인 후 재시도해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if(cKey==0 || sKey==""){
                Swal.fire({
                    title: '키 선택 오류',
                    html:
                        '키를 선택하지 않으셨습니다.<br/>' +
                        '확인 후 재시도해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
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
        var selectModalImg = 0;

        var selectedFile = []
        // [encDirectory, fileList] = resultLoader.getEncFileInfo(eventIndex);
        var encFileInfo = resultLoader.getEncFileInfo(eventIndex); //비식별화 결과물 저장 경로와 파일 목록을 불러옴
        var encDirectory = encFileInfo.encDirectory;
        var fileList = encFileInfo.fileList;
        var infoHtml = resultLoader.getInfoHtml(eventIndex); // 우측 상세 정보 불러오기
        $('.infoArea')[0].innerHTML = infoHtml;

        $(document).on("click", ".recoBtn", function () {
            if (type == 'video' && mode == 'single') {
                location.href = "/decrypt/inspection" + "?type=video&mode=single";
            }
            else if (type == 'image' && mode == 'single') {
                location.href = "/decrypt/inspection" + "?type=image&mode=single";
            }
            else if (type == 'image' && mode == 'group') {
                location.href = "/decrypt/inspection" + "?type=image&mode=group";
            }
        });

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
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
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
                    comm.meterDownload(eventIndex, type, fileName, fileSize);
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
                    if (screen.width > 600) {
                        var imgnum = $(this).data("num")
                        selectModalImg = imgnum
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
                    selectModalImg = imgnum
                    var imgtag = '<img class="viewImg" src="' + signedUrl[imgnum][0] + '">'
                    var downloadArea = '<a class="imgConfirm" href="' + signedUrl[imgnum][0] + '" download>\
                        <p>이미지 다운로드</p>\
                    </a>'
                    document.getElementById('selectImgArea').innerHTML = imgtag
                    document.getElementById('selectBtnArea').innerHTML = downloadArea
                    $("#imgView").addClass('active')
                });

                $(document).on("click", ".imgConfirm", function () {
                    console.log(selectModalImg)
                    var selectSize = signedUrl[selectModalImg][1];
                    comm.meterDownload(eventIndex, type, fileList[selectModalImg], selectSize);
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

                
                // $(document).on("click", ".viewImg", function () {
                //     const canvas = document.getElementById('canvas');
                //     const ctx = canvas.getContext('2d');
                //     var cropImage = new Image()
                //     cropImage.src = $(this).attr("src")
                //     cropImage.onload = function(){
                //         ctx.drawImage(cropImage, 0, 0, 640, 720, 0,0, canvas.width, canvas.height);
                //     }
                    
                //     var ourRequest = new XMLHttpRequest();
                //     ourRequest.open('GET','http://ddragon.leagueoflegends.com/cdn/10.14.1/data/en_US/champion.json');
                //     ourRequest.send();
                //     ourRequest.onload = function(){
                //         // let data = ourRequest.responseText
                //         var a = JSON.parse(ourRequest.responseText)
                //         console.log(Object.keys(a["data"]).length)
                //         for(var key in a.data){
                //             console.log(JSON.stringify(a["data"][key]))
                //         }
                //         // console.log(a["data"]["Aatrox"])
                //     }
                // });

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
                            setTimeout(function () {
                                new Promise((resolve, reject) => {
                                    //파일 다운로드 경로 획득
                                    var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], ['Download.zip']);
                                    var fileUrl = signedUrl[0][0];
                                    var fileSize = signedUrl[0][1];
                                    location.href = fileUrl;

                                    comm.meterDownload(eventIndex, type, 'Download.zip', fileSize);
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
                comm.meterDownload(eventIndex, type, fileName, fileSize);
            })
        }
    },

    log: function () {

        var pathname = window.location.pathname;
        pathname = pathname.split('/');
        var requestType = pathname[1];

        function reloadProgress() {
            if (requestType == 'encrypt') var reqProgress = requestTable.getEncProgress();
            else if (requestType == 'decrypt') var reqProgress = requestTable.getDecProgress();
            var progress = reqProgress['progress']
            $('#progress').html(progress);            
            var status = reqProgress['status']
            if(status == null){
                return 0
            }
            else{
                if(status.indexOf('FAIL')==1){
                    return 0
                }
                else if(status.indexOf("SUCCESS")==1) {
                    if (reqProgress['complete'] != 1) setTimeout(reloadProgress, 200);
                    else {
                        if (requestType == 'encrypt') var mainLog = requestTable.getAllEncRequestList()
                        else if (requestType == 'decrypt') var mainLog = requestTable.getAllDecRequestList()
                        $(".mainLog").html(mainLog);
                    }
                }
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
            if (requestType == 'encrypt'){
                var filter_video = $('.filter_video').is(':checked')
                var filter_image = $('.filter_image').is(':checked')
                var filter_album = $('.filter_album').is(':checked')
                var filter_reco = $('.filter_rest').is(':checked')
                var filter_norest = $('.filter_norest').is(':checked')
                if (screen.width <= 600) {
                    var startDate = $(".m_date .startVal").val();
                    var endDate = $(".m_date .endVal").val();
                }
                else {
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
                    Swal.fire({
                        title: '검색을 진행하시려면 조건을 정한 뒤 진행해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
                else if (startDate > today() || endDate > today()) {
                    Swal.fire({
                        title: '오늘날짜보다 크게 설정 할 수 없어요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
                else if (startDate > endDate) {
                    Swal.fire({
                        title: '시작날짜를 종료날짜보다 크게 할 수 없어요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
                else {
                    console.log(filter_video, filter_image, filter_album, filter_reco, filter_norest, filter_file, filter_rest, startDate, endDate)
                    var mainLog = requestTable.postDataSearch(filter_video, filter_image, filter_album, filter_reco, filter_norest, filter_file, filter_rest, startDate, endDate)
                    $(".mainLog").html(mainLog);
                    if (screen.width <= 600) {
                        m_load('.mainLog', '5');
                    }
                    else {
                        load('.mainLog', '5');
                    }
                }
            }
            else if (requestType == 'decrypt') {
                var filter_video = $('.filter_video').is(':checked')
                var filter_image = $('.filter_image').is(':checked')
                var filter_album = $('.filter_album').is(':checked')
                if (screen.width <= 600) {
                    var startDate = $(".m_date .startVal").val();
                    var endDate = $(".m_date .endVal").val();
                }
                else {
                    var startDate = $(".pc_date .startVal").val();
                    var endDate = $(".pc_date .endVal").val();
                }

                if (filter_video == false && filter_image == false && filter_album == false || filter_video == true && filter_image == true && filter_album == true) {
                    var filter_file = ""
                }
                else {
                    var filter_file = "no"
                }

                if (filter_video == "" && filter_image == "" && filter_album == "" && startDate == "" && endDate == "") {
                    Swal.fire({
                        title: '검색을 진행하시려면 조건을 정한 뒤 진행해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
                else if (startDate > today() || endDate > today()) {
                    Swal.fire({
                        title: '오늘날짜보다 크게 설정 할 수 없어요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
                else if (startDate > endDate) {
                    Swal.fire({
                        title: '시작날짜를 종료날짜보다 크게 할 수 없어요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
                else {
                    console.log(filter_video, filter_image, filter_album, filter_file, startDate, endDate)
                    var mainLog = requestTable.postDataDecSearch(filter_video, filter_image, filter_album, filter_file, startDate, endDate)
                    $(".mainLog").html(mainLog);
                    if (screen.width <= 600) {
                        m_load('.mainLog', '5');
                    }
                    else {
                        load('.mainLog', '5');
                    }
                }
            }
        });

        $(document).on("click", ".detailInfo", function () {
            if (requestType == 'encrypt') {
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
            }
        });

        $(document).on("click", ".m_logContent", function () {
            if (requestType == 'encrypt') {
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
            }
        });

        if (requestType == 'encrypt') var mainLog = requestTable.getAllEncRequestList()
        else if (requestType == 'decrypt') var mainLog = requestTable.getAllDecRequestList()
        $(".mainLog").html(mainLog);


        if (screen.width <= 600) {
            m_load('.mainLog', '5');
            $(document).on("click", "#enc_more .morebutton", function () {
                m_load('.mainLog', '5', '#enc_more');
            })
        }
        else {
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

    inspection: function () {
        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        // var eventIndex = urlParams.get('id');
        var mode = urlParams.get('mode');
        var inspec_body = document.querySelector(".inspec_body")
        if(type == 'image'){
            if(mode == 'single'){
                inspec_body.innerHTML = "<div class='recoArea' data-id=0>\
                                            <div class='encImgArea'>\
                                                <img class='encImg'>\
                                            </div>\
                                            <div class='object_list'>\
                                                <div class='textArea'>\
                                                    <h1>전신</h1>\
                                                    <div class='allArea'>\
                                                        <input class='body_allselect 0' type='checkbox' value=0><label class='allselect'>전체 선택</label>\
                                                    </div>\
                                                </div>\
                                                <div class='cropArea'>\
                                                </div>\
                                            </div>\
                                            <div class='object_list'>\
                                                <div class='textArea'>\
                                                    <h1>머리</h1>\
                                                    <div class='allArea'>\
                                                        <input class='head_allselect 0' type='checkbox' value=0><label class='allselect'>전체 선택</label>\
                                                    </div>\
                                                </div>\
                                                <div class='cropArea'>\
                                                    <div class='cropContent'>\
                                                        <img class='cropImg'>\
                                                        <div class='cropID'>\
                                                            <p>1</p>\
                                                        </div>\
                                                        <input class='check_head 0' type='checkbox' value=1>\
                                                    </div>\
                                                    <div class='cropContent'>\
                                                        <img class='cropImg'>\
                                                        <div class='cropID'>\
                                                            <p>2</p>\
                                                        </div>\
                                                        <input class='check_head 0' type='checkbox' value=2>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class='object_list'>\
                                                <div class='textArea'>\
                                                    <h1>자동차 번호판</h1>\
                                                    <div class='allArea'>\
                                                        <input class='lp_allselect 0' type='checkbox' value=0><label class='allselect'>전체 선택</label>\
                                                    </div>\
                                                </div>\
                                                <div class='cropArea'>\
                                                </div>\
                                            </div>\
                                        </div>"
            }
            else if(mode == 'group'){
                for (var i=0;i<5;i++){
                    inspec_body.innerHTML += "<div class='recoArea' data-id="+i+">\
                                                <div class='encImgArea'>\
                                                    <img class='encImg' src='../static/imgs/1920main_bg.png'>\
                                                </div>\
                                                <div class='object_list'>\
                                                    <div class='textArea'>\
                                                        <h1>전신</h1>\
                                                        <div class='allArea'>\
                                                            <input class='body_allselect "+i+"' type='checkbox'><label class='allselect'>전체 선택</label>\
                                                        </div>\
                                                    </div>\
                                                    <div class='cropArea'>\
                                                    </div>\
                                                </div>\
                                                <div class='object_list'>\
                                                    <div class='textArea'>\
                                                        <h1>머리</h1>\
                                                        <div class='allArea'>\
                                                            <input class='head_allselect "+i+"' type='checkbox'><label class='allselect'>전체 선택</label>\
                                                        </div>\
                                                    </div>\
                                                    <div class='cropArea'>\
                                                        <div class='cropContent'>\
                                                            <img class='cropImg' src='../static/imgs/login/login_back.png'>\
                                                            <div class='cropID'>\
                                                                <p>1</p>\
                                                            </div>\
                                                            <input class='check_head "+i+"' type='checkbox' value=1>\
                                                        </div>\
                                                        <div class='cropContent'>\
                                                            <img class='cropImg' src='../static/imgs/info/info_icon.png'>\
                                                            <div class='cropID'>\
                                                                <p>2</p>\
                                                            </div>\
                                                            <input class='check_head "+i+"' type='checkbox' value=2>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                                <div class='object_list'>\
                                                    <div class='textArea'>\
                                                        <h1>자동차 번호판</h1>\
                                                        <div class='allArea'>\
                                                            <input class='lp_allselect "+i+"' type='checkbox'><label class='allselect'>전체 선택</label>\
                                                        </div>\
                                                    </div>\
                                                    <div class='cropArea'>\
                                                    </div>\
                                                </div>\
                                            </div>"
                }
                $('.inspec_body').slick({
                    dots: false,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    slide: 'div',		//슬라이드 되어야 할 태그 ex) div, li 
                    // speed : 100,	 // 다음 버튼 누르고 다음 화면 뜨는데까지 걸리는 시간(ms)
                    arrows : true, 		// 옆으로 이동하는 화살표 표시 여부
                    prevArrow: '<div class="prev_arrow"><img class="arrow_img" src="../static/imgs/common/arrow_left.png"></div>',
                    nextArrow: '<div class="next_arrow"><img class="arrow_img" src="../static/imgs/common/arrow_right.png"></div>',
                    vertical : false,		// 세로 방향 슬라이드 옵션
                    draggable : false, 
                    responsive: [ // 반응형 웹 구현 옵션
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 1,
                                arrows : false, 
                                draggable:true,
                            }
                        },
                    ]
                });
            }
        }
        else if(type == 'video'){
            inspec_body.innerHTML = "<div class='recoArea' data-id=0>\
                                        <div class='object_list'>\
                                            <div class='textArea'>\
                                                <h1>전신</h1>\
                                                <div class='allArea'>\
                                                    <input class='body_allselect 0' type='checkbox' value=0><label class='allselect'>전체 선택</label>\
                                                </div>\
                                            </div>\
                                            <div class='cropArea'>\
                                                <div class='cropContent'>\
                                                    <img class='cropImg'>\
                                                    <div class='cropID'>\
                                                        <p>1</p>\
                                                    </div>\
                                                    <input class='check_body 0' type='checkbox' value=1>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class='object_list'>\
                                            <div class='textArea'>\
                                                <h1>머리</h1>\
                                                <div class='allArea'>\
                                                    <input class='head_allselect 0' type='checkbox' value=0><label class='allselect'>전체 선택</label>\
                                                </div>\
                                            </div>\
                                            <div class='cropArea'>\
                                                <div class='cropContent'>\
                                                    <img class='cropImg'>\
                                                    <div class='cropID'>\
                                                        <p>1</p>\
                                                    </div>\
                                                    <input class='check_head 0' type='checkbox' value=1>\
                                                </div>\
                                                <div class='cropContent'>\
                                                    <img class='cropImg'>\
                                                    <div class='cropID'>\
                                                        <p>2</p>\
                                                    </div>\
                                                    <input class='check_head 0' type='checkbox' value=2>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class='object_list'>\
                                            <div class='textArea'>\
                                                <h1>자동차 번호판</h1>\
                                                <div class='allArea'>\
                                                    <input class='lp_allselect 0' type='checkbox' value=0><label class='allselect'>전체 선택</label>\
                                                </div>\
                                            </div>\
                                            <div class='cropArea'>\
                                                <div class='cropContent'>\
                                                    <img class='cropImg'>\
                                                    <div class='cropID'>\
                                                        <p>1</p>\
                                                    </div>\
                                                    <input class='check_lp 0' type='checkbox' value=1>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>"
        }

        $(document).on("click", ".encImg", function () {
            var imgsrc = $(this).attr("src")
            $(".cropView").attr("src", imgsrc)
            $("#cropView").addClass('active')
        });

        $(document).on("click", ".cropImg", function () {
            var imgsrc = $(this).attr("src")
            $(".cropView").attr("src", imgsrc)
            $("#cropView").addClass('active')
        });

        $(document).on("click", ".recovery", function () {
            var recoFileLen = document.getElementsByClassName('recoArea').length;
            var selectedFile = new Array();
            for (var i = 0; i < recoFileLen; i++) {
                var data = new Object();
                var allCheck = [$('.body_allselect.'+i+'').is(':checked'), $('.head_allselect.'+i+'').is(':checked'), $('.lp_allselect.'+i+'').is(':checked')]
                if(allCheck[0]==true && allCheck[1]==true && allCheck[2]==true){
                    data.allCheck = true
                }
                else {
                    if(allCheck[0]==true){
                        data.body = "all"
                    }
                    else{
                        var cropList = document.getElementsByClassName('check_body '+i+'');
                        var bodyList = []
                        for (var j = 0; j < cropList.length; j++) {
                            if (cropList[j].checked == true){
                                bodyList.push(cropList[j].value)
                            }
                        }
                        if(cropList.length == 0){
                            data.body = bodyList
                        }
                        else if(cropList.length == bodyList.length){
                            data.body = "all"
                        }
                        else{
                            data.body = bodyList
                        }
                    }
                    if(allCheck[1]==true){
                        data.head = "all"
                    }
                    else{
                        var cropList = document.getElementsByClassName('check_head '+i+'');
                        var headList = []
                        for (var j = 0; j < cropList.length; j++) {
                            if (cropList[j].checked == true){
                                headList.push(cropList[j].value)
                            }
                        }
                        if(cropList.length == 0){
                            data.head = headList
                        }
                        else if(cropList.length == headList.length){
                            data.head = "all"
                        }
                        else{
                            data.head = headList
                        }
                    }
                    if(allCheck[2]==true){
                        data.lp = "all"
                    }
                    else{
                        var cropList = document.getElementsByClassName('check_lp '+i+'');
                        var lpList = []
                        for (var j = 0; j < cropList.length; j++) {
                            if (cropList[j].checked == true){
                                lpList.push(cropList[j].value)
                            }
                        }
                        if(cropList.length == 0){
                            data.lp = lpList
                        }
                        else if(cropList.length == lpList.length){
                            data.lp = "all"
                        }
                        else{
                            data.lp = lpList
                        }
                    }
                    if(data.body == "all" && data.head == "all" && data.lp == "all"){
                        data.allCheck = true
                        delete data.body
                        delete data.head
                        delete data.lp
                    }
                    else{
                        data.allCheck = false
                    }
                }
                selectedFile.push(data)
            }
            console.log(selectedFile)
        });
    },

    usage: function () {
        var d = new Date();
        var sel_month = -1; // 월을 조절하시면 됩니다. -1이면 전달을 +1이면 다음달을..
        d.setMonth(d.getMonth() + sel_month);

        var year = d.getFullYear();
        var month = ('0' + (d.getMonth() + 1)).slice(-2);
        var searchMonth = year + "-" + month;

        $("#startVal").val(searchMonth);

        var getMonthUsage = requestTable.getMonthUsage(searchMonth)
        $(".logArea").html(getMonthUsage);

        $(document).on("click", ".search", function () {
            var type = $("input[type=radio][name=search_filter]:checked").val();
            var date = $("#startVal").val();
            if (type == "all_count") {
                var getMonthUsage = requestTable.getMonthUsage(date)
                $(".logArea").html(getMonthUsage);
            }
            else {
                var getMonthTypeUsage = requestTable.getMonthTypeUsage(type, date)
                $(".logArea").html(getMonthTypeUsage);
                if (screen.width <= 600) {
                    m_load('.mainLog', '5');
                }
                else {
                    load('.mainLog', '5');
                }
            }
        });

        $(document).on("click", "#enc_more .morebutton", function () {
            load('.mainLog', '5', '#enc_more');
        })

        if (screen.width <= 600) {
            m_load('.mainLog', '5');
            $(document).on("click", "#enc_more .morebutton", function () {
                m_load('.mainLog', '5', '#enc_more');
            })
        }
        else {
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
            if (screen.width <= 600) {
                var startDate = $(".m_date .startVal").val();
                var endDate = $(".m_date .endVal").val();
            }
            else {
                var startDate = $(".pc_date .startVal").val();
                var endDate = $(".pc_date .endVal").val();
            }

            if (filter_video == false && filter_image == false && filter_album == false || filter_video == true && filter_image == true && filter_album == true) {
                var filter_file = ""
            }
            else {
                var filter_file = "no"
            }

            if (filter_video == "" && filter_image == "" && filter_album == "" && startDate == "" && endDate == "") {
                Swal.fire({
                    title: '검색을 진행하시려면 조건을 정한 뒤 진행해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if (startDate > today() || endDate > today()) {
                Swal.fire({
                    title: '오늘날짜보다 크게 설정 할 수 없어요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if (startDate > endDate) {
                Swal.fire({
                    title: '시작날짜를 종료날짜보다 크게 할 수 없어요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                console.log(filter_video, filter_image, filter_album, filter_file, startDate, endDate)
                var mainLog = requestTable.postDataDecSearch(filter_video, filter_image, filter_album, filter_file, startDate, endDate)
                $(".mainLog").html(mainLog);
                if (screen.width <= 600) {
                    m_load('.mainLog', '5');
                }
                else {
                    load('.mainLog', '5');
                }
            }
        });

        var requestList = requestTable.getAllDecRequestList()
        $(".mainLog").html(requestList);

        if (screen.width <= 600) {
            m_load('.mainLog', '5');
            $(document).on("click", "#enc_more .morebutton", function () {
                m_load('.mainLog', '5', '#enc_more');
            })
        }
        else {
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
                Swal.fire({
                    title: 'Key 이름을 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
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

            if (accountName == '' || password == '' || repassword == '' || userName == '' || email == '') Swal.fire({
                title: '빈 칸에 정보를 입력해주세요.',
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            });
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
                        Swal.fire({
                            title: '비밀번호는 8자 이상 입력해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                    else if (result == "check_error") {
                        Swal.fire({
                            title: '비밀번호는 대문자, 소문자, 숫자, 특수기호를 혼합하여 입력해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                    else {
                        Swal.fire({
                            title: '비밀번호를 다시 한번 확인해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                }
                else {
                    Swal.fire({
                        title: '비밀번호가 일치하지 않습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
        });

        $(document).on("click", ".addCancel", function () {
            location.href = "/submanage"
        });

        comm.secondaryLogin();
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
                    Swal.fire('이메일로 인증번호가 전송되었습니다.', '', 'success').then(() => {
                        verifyCode = signup.sendMail(email);
                        $('.auth_send').addClass('hide')
                        $('.re_auth_send').addClass('active')
                    })
                }
                else {
                    Swal.fire({
                        title: '이미 사용중인 계정입니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
            else Swal.fire({
                title: '이메일 주소를 입력해 주세요.',
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            });
            // Swal.fire('이메일 인증번호를 확인해 주세요', '', 'info');
        });

        $(document).on("click", "#re_email_send", function () {
            var email = $("#account_name").val();
            if (email) {
                var exist = signup.checkDuplicate(email);
                if (!exist) {
                    Swal.fire('이메일로 인증번호가 전송되었습니다.', '', 'success').then(() => {
                        verifyCode = signup.sendMail(email);
                    })
                }
                else {
                    Swal.fire({
                        title: '이미 사용중인 계정입니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
            else Swal.fire({
                title: '이메일 주소를 입력해 주세요.',
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            });
            // Swal.fire('이메일 인증번호를 확인해 주세요', '', 'info');
        });

        $(document).on("click", "#email_verify", function () {
            if (!$(this).hasClass('click')) {
                if ($("#verify_number").val() == verifyCode) {
                    Swal.fire('인증이 완료되었습니다.', '', 'success').then(() => {
                        $('.re_auth_send').removeClass('active')
                        $('.auth_confirm').addClass('hide')
                        $('.su_auth_send').addClass('active')
                        $('.su_auth_confirm').addClass('active')
                    })
                    verify = true;
                    $("#account_name").attr('disabled', true); // or false
                }
                else {
                    Swal.fire({
                        title: '인증번호가 일치하지 않습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
        });

        $(document).on("click", "#tenant_register", function () {
            if (!verify) Swal.fire({
                title: '인증 실패',
                text: '이메일 인증을 완료해 주세요',
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            });
            else {
                var accountName = $("#account_name").val();
                var password = $("#password").val();
                var repassword = $("#repassword").val();
                var companyName = $("#company_name").val();
                var ownerName = $("#owner_name").val();
                var check_num = /[0-9]/;    // 숫자 
                var check_big = /[A-Z]/;    // 대문자
                var check_small = /[a-z]/;    // 소문자
                var check_symbol = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g; // 특수기호
                if(password.length<8){
                    Swal.fire({
                        title: '비밀번호는 8자 이상 입력해주세요.',
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    })
                }
                else if(check_num.test(password)!=true || check_big.test(password)!=true || check_small.test(password)!=true || check_symbol.test(password)!=true){
                    Swal.fire({
                        title: '비밀번호는 대문자, 소문자, 숫자, 특수기호를 혼합하여 입력해주세요.',
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    })
                }
                else if (password != repassword) Swal.fire({
                    title: '비밀번호가 일치하지 않습니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
                else if (password == '' || repassword == '' || companyName == '' || ownerName == '') Swal.fire({
                    title: '빈 칸에 정보를 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
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
                    Swal.fire({
                        title: '가입된 정보가 없습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
            else Swal.fire({
                title: '빈 칸을 입력해 주세요.',
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            });
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
                Swal.fire({
                    title: '변경할 비밀번호를 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                if (password != repassword) Swal.fire({
                    title: '비밀번호 불일치',
                    text: '입력하신 비밀번호가 일치하지 않습니다. 다시 입력해 주세요',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
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
                Swal.fire({
                    title: msg + '를 입력해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
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