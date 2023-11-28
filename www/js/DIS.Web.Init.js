'use strict';

// const { all } = require("../../../noon-ai-dis-was/noon-ai-dis-was-util/api/api");

// const { off } = require("process");

DIS.Web.Init = DIS.Web.Init || {};

function escapeHTML(text) {
    var element = document.createElement('div');
    element.innerText = text;
    return element.innerHTML;
}

function htmlDecode(text) {
    var element = document.createElement('textarea');
    element.innerHTML = text;
    return element.value;
}

const patterns = {
    account_name: /^([a-z\d.-]+)@([a-z\d-]+\.)+([a-z]{2,})$/,
    password: /^[\w@-]{8,20}$/,
    repassword: /^[\w@-]{8,20}$/,
    company_name: /^[a-z\d]{1,20}$/i,
    owner_name: /^[a-z\d]{1,20}$/i,
    verify_number: /^[0-9]{6}$/,
    phone: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
};

let whitelist = [
    { tenant_id: 39 },
    { tenant_id: 62 },
]

var init = DIS.Web.Init;
init = {

    index: function () {
        $('.explanSlider').slick({
            slide: 'div',		//슬라이드 되어야 할 태그 ex) div, li 
            infinite: true, 	//무한 반복 옵션	 
            slidesToShow: 1,		// 한 화면에 보여질 컨텐츠 개수
            slidesToScroll: 1,		//스크롤 한번에 움직일 컨텐츠 개수
            speed: 500,	 // 다음 버튼 누르고 다음 화면 뜨는데까지 걸리는 시간(ms)
            arrows: false, 		// 옆으로 이동하는 화살표 표시 여부
            dots: true, 		// 스크롤바 아래 점으로 페이지네이션 여부
            autoplay: true,			// 자동 스크롤 사용 여부
            autoplaySpeed: 7000, 		// 자동 스크롤 시 다음으로 넘어가는데 걸리는 시간 (ms)
            pauseOnHover: true,		// 슬라이드 이동	시 마우스 호버하면 슬라이더 멈추게 설정
            vertical: false,		// 세로 방향 슬라이드 옵션
            prevArrow: false,		// 이전 화살표 모양 설정
            nextArrow: false,		// 다음 화살표 모양 설정
            dotsClass: "slick-dots", 	//아래 나오는 페이지네이션(점) css class 지정
            draggable: true, 	//드래그 가능 여부 
        });
    },

    charge: function () {

    },

    // 유저 로그인 화면 제어
    login: function () {
        let isDev = comm.getEnv();
        login.sessionCheck();
        let master_tenant_id = null;
        $(document).on("click", "#loginButton", function () {
            var accountName = $("#name").val();
            var password = $("#pass").val();
            if (accountName && password) {
                master_tenant_id = login.firstLogin(accountName, password);
            }
            else {
                if (accountName == '') var msg = '아이디';
                if (password == '') var msg = '비밀번호';
                if (accountName == '' && password == '') var msg = '아이디와 비밀번호';
                Swal.fire({
                    title: msg + '를 \n입력해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        });
        let verifyId = null;
        $(document).on("click", "#email_send", function () {
            let account_name = $(".auth_id").val();
            verifyId = login.secondaryEmailSend(account_name);
        });
        $(document).on("click", ".auth_confirm", function () {
            let user_code = $("#user_input_code").val();
            let pass = false;
            whitelist.forEach((val) => {
                if (val.tenant_id == master_tenant_id || isDev === 'dev') {
                    pass = true;
                }
            });
            if (pass) {
                let accountName = $("#name").val();
                let password = $("#pass").val();
                login.login(accountName, password);
                login.updateClearLoginFailCount('tenant', master_tenant_id, accountName);
                login.updateClearLockCount('tenant', master_tenant_id, accountName); 
            }
            else {
                let verify = login.verifyOTP(verifyId, user_code);
                if (verify) {
                    let accountName = $("#name").val();
                    let password = $("#pass").val();
                    login.login(accountName, password);
                    login.updateClearLoginFailCount('tenant', mater_tenant_id, accountName);
                    login.updateClearLockCount('tenant', mater_tenant_id, accountName);
                }
                else {
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
        let isDev = comm.getEnv();
        login.sessionCheck();
        let master_tenant_id = null;
        $(document).on("click", "#loginButton", function () {
            var loginAlias = $("#loginAlias").val();
            var accountName = $("#name").val();
            var password = $("#pass").val();
            if (loginAlias && accountName && password) {
                master_tenant_id = login.firstSubLogin(loginAlias, accountName, password);
            }
            else {
                if (loginAlias == '') var msg = '접속키'
                if (accountName == '') var msg = '아이디';
                if (password == '') var msg = '비밀번호';
                if (accountName == '' && password == '') var msg = '아이디와 비밀번호';
                Swal.fire({
                    title: msg + '를 \n입력해 주세요.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        });
        let verifyId = null;
        $(document).on("click", "#email_send", function () {
            let account_name = $(".auth_id").val();
            verifyId = login.secondaryEmailSend(account_name);
        });

        $(document).on("click", ".auth_confirm", function () {
            let user_code = $("#user_input_code").val();
            let pass = false;
            whitelist.forEach((val) => {
                if (val.tenant_id == master_tenant_id || isDev === 'dev') {
                    pass = true;
                }
            });
            if (pass) {
                let accountName = $("#name").val();
                let loginAlias = $("#loginAlias").val();
                let password = $("#pass").val();
                login.subLogin(loginAlias, accountName, password);
                login.updateClearLoginFailCount('sub-account', master_tenant_id, accountName);
                login.updateClearLockCount('sub-account', master_tenant_id, accountName);
            }
            else {
                let verify = login.verifyOTP(verifyId, user_code);
                if (verify) {
                    let accountName = $("#name").val();
                    let loginAlias = $("#loginAlias").val();
                    let password = $("#pass").val();
                    login.subLogin(loginAlias, accountName, password);
                    login.updateClearLoginFailCount('sub-account', master_tenant_id, accountName);
                    login.updateClearLockCount('sub-account', master_tenant_id, accountName);
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

    agree: function () {
        $(document).on("click", ".checkAllArea", function () {
            if ($('.agreeAllCheck').is(':checked')) {
                $(".agreeServiceCheck").prop("checked", false);
                $(".agreePrivacyCheck").prop("checked", false);
                $(".noneAllCheck").addClass("active")
                $(".checkAll").removeClass("active")
                $(".noneServiceCheck").addClass("active")
                $(".checkService").removeClass("active")
                $(".nonePrivacyCheck").addClass("active")
                $(".checkPrivacy").removeClass("active")
                $(".nextBtn").addClass("disable")
            }
            else {
                $(".agreeServiceCheck").prop("checked", true);
                $(".agreePrivacyCheck").prop("checked", true);
                $(".noneAllCheck").removeClass("active")
                $(".checkAll").addClass("active")
                $(".noneServiceCheck").removeClass("active")
                $(".checkService").addClass("active")
                $(".nonePrivacyCheck").removeClass("active")
                $(".checkPrivacy").addClass("active")
                $(".nextBtn").removeClass("disable")
            }
        });

        $(document).on("click", ".checkServiceArea", function () {
            if ($('.agreeServiceCheck').is(':checked')) {
                $(".agreeAllCheck").prop("checked", false);
                $(".noneAllCheck").addClass("active")
                $(".checkAll").removeClass("active")
                $(".noneServiceCheck").addClass("active")
                $(".checkService").removeClass("active")
                if ($(".noneServiceCheck").hasClass("active") || $(".nonePrivacyCheck").hasClass("active")) {
                    $(".nextBtn").addClass("disable")
                }
            }
            else {
                $(".noneServiceCheck").removeClass("active")
                $(".checkService").addClass("active")
                if ($(".checkService").hasClass("active") && $(".checkPrivacy").hasClass("active")) {
                    $(".nextBtn").removeClass("disable")
                }
            }
        });

        $(document).on("click", ".checkPrivacyArea", function () {
            if ($('.agreePrivacyCheck').is(':checked')) {
                $(".agreeAllCheck").prop("checked", false);
                $(".noneAllCheck").addClass("active")
                $(".checkAll").removeClass("active")
                $(".nonePrivacyCheck").addClass("active")
                $(".checkPrivacy").removeClass("active")
                if ($(".noneServiceCheck").hasClass("active") || $(".nonePrivacyCheck").hasClass("active")) {
                    $(".nextBtn").addClass("disable")
                }
            }
            else {
                $(".nonePrivacyCheck").removeClass("active")
                $(".checkPrivacy").addClass("active")
                if ($(".checkService").hasClass("active") && $(".checkPrivacy").hasClass("active")) {
                    $(".nextBtn").removeClass("disable")
                }
            }
        });

        $(document).on("click", ".nextBtn", function () {
            if ($('.agreeServiceCheck').is(':checked') && $('.agreePrivacyCheck').is(':checked')) {
                location.href = "/join"
            }
            else {
                console.log("error")
            }
        });
    },

    main: function () {
        var temp = comm.getUser()

        $(".curTenant").html(temp);

        // function reloadProgress() {
        //     var encProgress = requestTable.getEncProgress();
        //     if (encProgress['progress']) {
        //         var progress = encProgress['progress']
        //         $('#progress').html(progress);
        //         var status = encProgress['status']
        //         if (status == null) {
        //             return 0
        //         }
        //         else {
        //             if (status.indexOf('FAIL') == 1) {
        //                 return 0
        //             }
        //             else if (status.indexOf("SUCCESS") == 1) {
        //                 if (encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
        //                 else {
        //                     var mainLog = requestTable.getRecentRequest('encrypt');
        //                     $(".mainLog").html(mainLog);
        //                 }
        //             }
        //         }
        //     }
        // }

        // reloadProgress();

        var mainLog = requestTable.getRecentRequest('encrypt');
        $(".mainLog").html(mainLog);

        $(document).on("click", ".video_select", function () {
            location.href = "/encrypt/video"
        });

        $(document).on("click", ".image_select", function () {
            location.href = "/encrypt/image"
        });

        var mainLog = requestTable.getRecentRequest('encrypt');
        $(".mainLog").html(mainLog);

        $(document).on("click", ".detailInfo", function () {
            let type = $(this).data('type')
            let restoration = $(this).data('restoration')
            if (type == '동영상 파일') {
                location.href = `/encrypt/video/detail?type=video&id=${$(this).attr('data-id')}&restoration=${restoration}&mode=single`;
            }
            else if (type == '이미지 파일') {
                location.href = `/encrypt/image/detail?type=image&id=${$(this).attr('data-id')}&restoration=${restoration}&mode=single`;
            }
            else if (type == '이미지 그룹') {
                location.href = `/encrypt/album/detail?type=image&id=${$(this).attr('data-id')}&restoration=${restoration}&mode=group`;
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
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });

        var html = ''
        var fileCount = 0;
        var fileIndex = [];
        var fileWidth = []
        var fileHeight = []
        var fileSize = []
        var videoDuration = []
        let checksum = null;
        var files = [];
        var imgInfo = []

        var uploadID = 0;

        socket.on('delMsgToClient', function (msg) {
            if (uploadID == msg.id) {
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
            [html, fileWidth, fileHeight, fileSize, fileCount, videoDuration, files] = fileModule.getFileList('image', 'file');
            setTimeout(function () {
                $('.uploadContent').html(html);
                fileCount = fileSize.length;
                fileIndex = [];
                for (var i = 0; i < fileCount; i++) {
                    fileIndex.push(i);
                }
                imgInfo = []
                for (var i = 0; i < fileCount; i++) {
                    let img = new Image();
                    img.src = window.URL.createObjectURL(files[i]);
                    imgInfo.push(img);
                    // fileWidth.push(0); // 초기값으로 넣어둠
                    // fileHeight.push(0); // 초기값으로 넣어둠

                    img.onload = function () {
                        const loadedImgIndex = imgInfo.indexOf(this);
                        if (loadedImgIndex !== -1) {
                            fileWidth[loadedImgIndex] = this.width;
                            fileHeight[loadedImgIndex] = this.height;
                        }
                    };
                }
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
            $(".uploadFooter").removeClass('active')
            $(".uploadBtn_area").removeClass('hide')
            $(".nextBtn").removeClass('hide')
            $(".progressContainer").addClass('hide')
        });

        // 파일 삭제버튼 누를경우 작동 (튼튼함)
        $(document).on("click", ".uploadDelete", function () {
            var idx = $(this).attr('value')
            fileModule.deleteFile(idx);
            fileCount--;
            fileIndex = fileIndex.filter(function (item) {
                return item !== Number(idx);
            })
            if (fileCount == 0) {
                $(".uploadFooter").removeClass('active')
                $(".uploadBtn_area").removeClass('hide')
                $(".nextBtn").removeClass('hide')
                $(".progressContainer").addClass('hide')
            }
        });

        var cKey = 1
        var sKey = "select"
        // 키 발급 만약 에러뜬다면 genKeyName val == '' 확인, 에러확률 거의 없음
        $(document).on("click", "#generateKey", function () {
            var genKeyName = $("#genKeyName").val();
            var check_num = /[0-9]/;    // 숫자 
            // var check_big = /[A-Z]/;    // 대문자
            var check_small = /[a-z]/;    // 소문자
            if (genKeyName.length < 8 || genKeyName.length > 20) {
                Swal.fire({
                    title: '암호 키 이름은 8~20자 이내로 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                })
            }
            else if (check_num.test(genKeyName) != true || check_small.test(genKeyName) != true) {
                Swal.fire({
                    title: '암호 키 이름은 영문 소문자, 숫자를 혼합하여 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                })
            }
            else {
                cKey = 1;
                sKey = "select";
                comm.generateKey(genKeyName, null);
            }
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
            let key_idx = $(this).data("idx")
            let validUntil = $(this).data("valid")
            let notification = $(this).data("notification")
            if (validUntil < 90 && notification) {
                Swal.fire({
                    title: `해당 암호 키는 ${validUntil}일 뒤 \n만료됩니다.`,
                    html: `선택한 암호 키를 사용해서 비식별화 한 기록은 ${validUntil}일 뒤 복호화가 불가능합니다. 다른 암호 키를 사용하거나 추후 다른 암호 키로 변경해 주세요.`,
                    showCancelButton: true,
                    confirmButtonText: '확인',
                    cancelButtonText: '일주일동안 알림 끄기'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        // const { changed, count } = await key.changeKeyAll(key_idx);
                        // console.log(changed)
                        // console.log(count);
                        // if(changed) {
                        //     Swal.fire({
                        //         title: '키 변경 완료',
                        //         icon: 'success',
                        //         html: `${count}개의 기록에 대해 <br>키 변경이 완료되었습니다.`,
                        //         allowOutsideClick: false
                        //     }).then((result) => {
                        //         if(result.isConfirmed) location.reload();
                        //     })
                        // }
                    }

                    if (result.isDismissed) {
                        await key.disableNotification(key_idx);
                    }
                })
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

        $(document).on("click", ".uploadBtnArea", function () {
            $(".uploadBtn_area").removeClass('hide')
            $(".nextBtn").removeClass('hide')
            $(".progressContainer").addClass('hide')
            $(".file_info_area").removeClass('active')
            $(".uploadFooter").removeClass('active')
            $('input[type=radio][name=restoration]').prop("checked", false)
            $('input[type=radio][name=restoration][value=false]').prop("checked", true)
        });

        $(document).on("click", ".prevBtn", function () {
            location.href = "/main"
        });

        var postData, filePath;
        $(document).on("click", ".nextBtn", async function () {
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
                uploadID = makeid(6);
                $(".nextBtn").addClass('hide')
                $(".progressContainer").removeClass('hide')
                var callback = fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, 'image');
                callback.then((data) => {
                    postData = data[0]
                    filePath = data[2][0]
                    checksum = data[3]
                    socket.emit('delUploadedFile', {
                        filePath: filePath,
                        id: uploadID,
                        immediate: 'false'
                    })
                })
                // let reso = true;
                // for(let i=0;i<fileWidth.length;i++){
                //     if (fileWidth[i] + fileHeight[i] > 3000) {
                //         Swal.fire({
                //             title: '파일 해상도 초과',
                //             html:
                //                 '1920 X 1080 을 <br>초과하는 해상도입니다.<br/>' +
                //                 '서비스 안정성을 위해 <br>1920 X 1080 크기 까지의<br/>' +
                //                 '영상을 서비스합니다.',
                //             showConfirmButton: false,
                //             showDenyButton: true,
                //             denyButtonText: "확 인",
                //             icon: "error"
                //         });
                //         reso = false;
                //         break;
                //     }
                // }
                // if(reso==true){
                //     uploadID = makeid(6);
                //     $(".nextBtn").addClass('hide')
                //     $(".progressContainer").removeClass('hide')
                //     var callback = fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, 'image');
                //     callback.then((data) => {
                //         postData = data[0]
                //         filePath = data[2][0]
                //         checksum = data[3]
                //         socket.emit('delUploadedFile', {
                //             filePath: filePath,
                //             id: uploadID,
                //             immediate: 'false'
                //         })
                //     })
                // }
            }
        });

        $(document).on("click", ".encryptBtn", function () {
            console.log('fileWidth : ', fileWidth);
            console.log('fileHeight : ', fileHeight);
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
            if (allCheck == "true" && cKey == 1 && sKey != "") {
                var encryptObj = Object.assign({}, encryptObject);
                // if(postData["encryptObject"])
                postData['encryptObject'] = JSON.stringify(encryptObj);
                var bitrateArray = []
                fileModule.encrypt(postData, fileWidth, fileHeight, restoration, bitrateArray, 'image', checksum, 0);
                socket.emit('cancelDeleteFile', {
                    id: uploadID
                })
            }
            else if (allCheck == "false") {
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
            else if (cKey == 0 || sKey == "") {
                Swal.fire({
                    title: '암호 키 선택 오류',
                    html:
                        '암호 키를 선택하지 않으셨습니다.<br/>' +
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
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });
        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var service = urlParams.get('service');
        let detail, restoration, mode, requestID, reportErrorestoration, sectorid, token;
        if (service == 'thumbnail') {
            mode = urlParams.get('mode');
            var index = urlParams.get('id');
            var encid = urlParams.get('encid');
        }
        else if (service == "check") {
            requestID = urlParams.get('requestID');
            restoration = urlParams.get('restoration');
            reportErrorestoration = urlParams.get('restoration');
            // endID = urlParams.get('restoration');
            mode = urlParams.get('mode');
            if (type == "image") {
                if (mode == "single") {
                    detail = "image"
                }
                else if (mode == "group") {
                    detail = "album"
                }
            }
            else if (type == "video") {
                detail = "video"
            }
        }
        else if (service == "sector") {
            requestID = urlParams.get('requestID');
            restoration = urlParams.get('restoration');
            sectorid = urlParams.get('id');
            mode = urlParams.get('mode');
            token = urlParams.get('token');
            if (type == "image") {
                if (mode == "single") {
                    detail = "image"
                }
                else if (mode == "group") {
                    detail = "album"
                }
            }
            else if (type == "video") {
                detail = "video"
            }
        }
        var eventIndex = urlParams.get('id');

        var progressObject = ''

        function downloadAlert(typeStr, downloadURL, decDirectory, fileList, fileSize) {
            let timerInterval;
            Swal.fire({
                title: '부분 복호화 ' + typeStr + ' 다운로드',
                html:
                    '생성된 다운로드 버튼은 <br><b></b>동안 유효합니다.<br/>' +
                    '<a href="" id="signedUrl" download>' +
                    '<div id="download" class="btn">' +
                    '<p>다운로드</p>' +
                    '</div>' +
                    '</a>',
                // timer: 60000 * 15,
                timer: 60000 * 15,
                timerProgressBar: false,
                showConfirmButton: false,
                icon: 'info',
                allowOutsideClick: false,
                didOpen: () => {
                    const content = Swal.getHtmlContainer()
                    const $ = content.querySelector.bind(content)

                    // Swal.showLoading()

                    const download = $('#download');
                    const downloadLink = $('#signedUrl');
                    downloadLink.href = downloadURL;
                    // fileModule.updateDownloadLink(eventIndex, downloadURL);

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
                            // comm.updateDownloadStatus(eventIndex);
                            let requestType = 'download';
                            let originEncIndex = urlParams.get('encID');
                            if (fileList.length > 1) comm.increaseRequestCount(originEncIndex, fileList, requestType);
                            else comm.increaseRequestCount(originEncIndex, [fileName], requestType);
                            Swal.fire({
                                title: '다운로드가 시작됩니다!',
                                html: '확인 버튼을 누르면 <br>메인 페이지로 이동합니다.',
                                confirmButtonText: '확인',
                                allowOutsideClick: false,
                                icon: 'success'
                            }).then((result) => {
                                if (result.isConfirmed) location.href = '/main';
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
            let progressID = urlParams.get('id');
            if (service == 'encrypt') progressObject = requestTable.getEncProgress(progressID);
            else if (service == 'decrypt') progressObject = requestTable.getDecProgress(progressID);
            else if (service == 'thumbnail') progressObject = requestTable.getThumbProgress(progressID);
            else if (service == 'check') progressObject = requestTable.getCheckProgress(progressID);
            else if (service == 'sector') progressObject = requestTable.getSectorProgress(progressID);
            var progress = progressObject['progress'];
            var status = progressObject['status']
            $('#progress').html(progress);
            if (status == null) {
                setTimeout(reloadProgress, 200);
            }
            else {
                if (status.indexOf('FAIL') == 1 || status.indexOf('Fail') != -1) {
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
                else if (status.indexOf("SUCCESS") == 1 || status.indexOf("Sucess") == 1) {
                    if (progressObject['complete'] != 1) setTimeout(reloadProgress, 200);
                    else {
                        if (service == 'encrypt') var msg = '비식별화가';
                        else if (service == 'decrypt') var msg = '복호화가';
                        else if (service == 'thumbnail') var msg = '썸네일 생성이\n';
                        else if (service == 'check') var msg = '비식별화 추가가\n';
                        else if (service == 'sector') var msg = '프레임 이미지 \n생성이';
                        Swal.fire({
                            title: msg + ' 완료되었습니다!',
                            showCancelButton: false,
                            confirmButtonText: '확인',
                            icon: 'success',
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                if (service == 'encrypt') location.href = '/encrypt/log';
                                if (service == 'thumbnail') {
                                    let fileNamse = urlParams.get('fileNames');
                                    location.href = `/decrypt/inspection?type=${type}&mode=${mode}&id=${index}&encid=${encid}&fileNames=${fileNamse}`;
                                }
                                if (service == 'check') location.href = `/encrypt/${detail}/detail?type=${type}&id=${requestID}&restoration=${restoration}&mode=${mode}`;
                                if (service == 'sector') location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorid}&id=${requestID}&restoration=${restoration}&mode=${mode}&sectorNum=1&imgNum=0`;
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
        }
        setTimeout(reloadProgress, 300);
    },

    video: function () {
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });
        var html = ''
        var fileCount = 0;
        var fileWidth = []
        var fileHeight = []
        var fileSize = []
        var videoDuration = []

        let checksum = null;

        var uploadID = 0;

        socket.on('delMsgToClient', function (msg) {
            if (uploadID == msg.id) {
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
            $(".file_info_area").removeClass('active')
            $(".uploadFooter").removeClass('active')
            $(".uploadBtn_area").removeClass('hide')
            $(".nextBtn").removeClass('hide')
            $(".progressContainer").addClass('hide')
        });

        var cKey = 1
        var sKey = "select"
        $(document).on("click", "#generateKey", function () {
            var genKeyName = $("#genKeyName").val();
            var check_num = /[0-9]/;    // 숫자 
            // var check_big = /[A-Z]/;    // 대문자
            var check_small = /[a-z]/;    // 소문자
            if (genKeyName.length < 8 || genKeyName.length > 20) {
                Swal.fire({
                    title: '암호 키 이름은 8~20자 이내로 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                })
            }
            else if (check_num.test(genKeyName) != true || check_small.test(genKeyName) != true) {
                Swal.fire({
                    title: '암호 키 이름은 영문 소문자, 숫자를 혼합하여 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                })
            }
            else {
                cKey = 1;
                sKey = "select";
                comm.generateKey(genKeyName, null);
            }
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
            console.log($(this))
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
            let validUntil = $(this).data("valid")
            if (validUntil < 90) {
                Swal.fire({
                    title: `해당 키는 ${validUntil}일 뒤 \n만료됩니다.`,
                    html: `선택한 키를 사용해서 비식별화 한 기록은 ${validUntil}일 뒤 복호화가 불가능합니다. 다른 키를 사용하거나 추후 다른 키로 변경해 주세요.`,
                    showCancelButton: true,
                    confirmButtonText: '확인',
                    cancelButtonText: '일주일동안 알림 끄기'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        // const { changed, count } = await key.changeKeyAll(key_idx);
                        // console.log(changed)
                        // console.log(count);
                        // if(changed) {
                        //     Swal.fire({
                        //         title: '키 변경 완료',
                        //         icon: 'success',
                        //         html: `${count}개의 기록에 대해 <br>키 변경이 완료되었습니다.`,
                        //         allowOutsideClick: false
                        //     }).then((result) => {
                        //         if(result.isConfirmed) location.reload();
                        //     })
                        // }
                    }
                })
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

        $(document).on("click", ".uploadBtnArea", function () {
            $(".uploadBtn_area").removeClass('hide')
            $(".nextBtn").removeClass('hide')
            $(".progressContainer").addClass('hide')
            $(".file_info_area").removeClass('active')
            $(".uploadFooter").removeClass('active')
            $('input[type=radio][name=restoration]').prop("checked", false)
            $('input[type=radio][name=restoration][value=false]').prop("checked", true)
        });

        $(document).on("click", ".prevBtn", function () {
            location.href = "/main"
        });

        var postData, bitrateArray, filePath;
        $(document).on("click", ".nextBtn", function () {
            if (fileWidth[0] + fileHeight[0] > 3000) {
                Swal.fire({
                    title: '파일 해상도 초과',
                    html:
                        '1920 X 1080 을 <br>초과하는 해상도입니다.<br/>' +
                        '서비스 안정성을 위해 <br>1920 X 1080 크기 까지의<br/>' +
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
            else if (fileCount == 0) {
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
                uploadID = makeid(6);
                $(".nextBtn").addClass('hide')
                $(".progressContainer").removeClass('hide')

                var callback = fileModule.uploadFile(fileWidth, fileHeight, videoDuration, restoration, 'video');
                callback.then((data) => {
                    postData = data[0]
                    bitrateArray = data[1]
                    filePath = data[2][0]
                    checksum = data[3]
                    socket.emit('delUploadedFile', {
                        filePath: filePath,
                        id: uploadID,
                        immediate: 'false'
                    })
                })
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
            if (videoDuration[0] > 300 && $(".restore:checked").val() == "false") {
                Swal.fire({
                    title: '파일 길이 초과',
                    html:
                        '파일의 길이가 5분을 초과했습니다.<br/>' +
                        '복호화 불가능 파일은 5분 이하의 <br>파일만 올려주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if (videoDuration[0] > 180 && $(".restore:checked").val() == "true") {
                Swal.fire({
                    title: '파일 길이 초과',
                    html:
                        '파일의 길이가 3분을 초과했습니다.<br/>' +
                        '복호화 가능 파일은 3분 이하의 <br>파일만 올려주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else if (allCheck == "true" && cKey == 1 && sKey != "") {
                var encryptObj = Object.assign({}, encryptObject);
                postData['encryptObject'] = JSON.stringify(encryptObj);
                fileModule.encrypt(postData, fileWidth, fileHeight, restoration, bitrateArray, 'video', checksum, videoDuration);
                socket.emit('cancelDeleteFile', {
                    id: uploadID
                })
            }
            else if (allCheck == "false") {
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
            else if (cKey == 0 || sKey == "") {
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

    log: function () {

        var pathname = window.location.pathname;
        pathname = pathname.split('/');
        var requestType = pathname[1];

        var mainLog = requestTable.getAllEncRequestList()
        $(".mainLog").html(mainLog[0]);
        console.log(mainLog[1])

        function reloadProgress() {
            var reqProgress = requestTable.getEncProgress();
            if (reqProgress['progress']) {
                var progress = reqProgress['progress']
                $('#progress').html(progress);
                var status = reqProgress['status']
                if (status == null) {
                    return 0
                }
                else {
                    if (status.indexOf('FAIL') == 1) {
                        return 0
                    }
                    else if (status.indexOf("SUCCESS") == 1) {
                        if (reqProgress['complete'] != 1) setTimeout(reloadProgress, 200);
                        else {
                            var loadLog = requestTable.getAllEncRequestList()
                            $(".mainLog").html(loadLog[0]);
                        }
                    }
                }
            }
        }

        reloadProgress();

        // reloadProgress();
        if (requestType == 'encrypt') var mainLog = requestTable.getAllEncRequestList()
        else if (requestType == 'decrypt') var mainLog = requestTable.getAllDecRequestList()
        $(".mainLog").html(mainLog);
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
            if (requestType == 'encrypt') {
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
                let restoration = $(this).data('restoration')
                if (type == '동영상 파일') {
                    location.href = `/encrypt/video/detail?type=video&id=${$(this).attr('data-id')}&restoration=${restoration}&mode=single`;
                }
                else if (type == '이미지 파일') {
                    location.href = `/encrypt/image/detail?type=image&id=${$(this).attr('data-id')}&restoration=${restoration}&mode=single`;
                }
                else if (type == '이미지 그룹') {
                    location.href = `/encrypt/album/detail?type=image&id=${$(this).attr('data-id')}&restoration=${restoration}&mode=group`;
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
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });
        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var mode = urlParams.get('mode');
        var idx = urlParams.get('id');
        var encryptIdx = urlParams.get('encid');
        let thumb = fileModule.thumbnailList(idx, type, mode)
        let thumbPath = thumb[1]

        let uploadID = 0;

        socket.on('delMsgToClient', function (msg) {
            if (uploadID == msg.id) {
                Swal.fire({
                    title: msg.title,
                    html: msg.html,
                    confirmButtonText: '확인',
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) location.href = '/main';
                })
            }
        });

        uploadID = makeid(6);
        socket.emit('delUploadedFile', {
            filePath: thumbPath,
            id: uploadID,
            immediate: 'false'
        })

        $(".inspec_body").html(thumb[0]);
        if (type == 'video') {
            var encFileInfo = resultLoader.getEncFileInfo(encryptIdx)
            var encDirectory = encFileInfo.encDirectory
            var fileList = encFileInfo.fileList;
            var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);
            resultLoader.getVideoInspectionHtml(signedUrl, fileList);
        }

        $('.inspec_body').slick({
            dots: false,
            infinite: false,
            speed: 0,
            slidesToShow: 1,
            slidesToScroll: 1,
            slide: 'div',		//슬라이드 되어야 할 태그 ex) div, li 
            // speed : 100,	 // 다음 버튼 누르고 다음 화면 뜨는데까지 걸리는 시간(ms)
            arrows: true, 		// 옆으로 이동하는 화살표 표시 여부
            prevArrow: '<div class="prev_arrow"><img class="arrow_img" src="../static/imgs/common/arrow_left.png"></div>',
            nextArrow: '<div class="next_arrow"><img class="arrow_img" src="../static/imgs/common/arrow_right.png"></div>',
            vertical: false,		// 세로 방향 슬라이드 옵션
            draggable: false,
            responsive: [ // 반응형 웹 구현 옵션
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 1,
                        arrows: false,
                        draggable: true,
                    }
                },
            ]
        });

        $(document).on("click", ".encImg", function () {
            var imgsrc = $(this).attr("src")
            $(".cropView").attr("src", imgsrc)
            $(".cancel").addClass('active')
            $(".cropHeader").removeClass('active')
            $("#cropView").addClass('active')
        });

        $(document).on("click", ".cropImg.body", function () {
            var groupidx = $(this).data("groupidx")
            var imgidx = $(this).data("imgidx")
            if ($('.check_body.' + groupidx + '.body' + imgidx + '').is(':checked')) {
                $('.check_body.' + groupidx + '.body' + imgidx + '').prop("checked", false);
                $(".body_allselect." + groupidx + "").prop("checked", false);
            }
            else {
                $('.check_body.' + groupidx + '.body' + imgidx + '').prop("checked", true);
            }
            $(".selectText.body." + groupidx + "").text($(".check_body." + groupidx + ":checked").length);
        });

        $(document).on("click", ".cropImg.head", function () {
            var groupidx = $(this).data("groupidx")
            var imgidx = $(this).data("imgidx")
            if ($('.check_head.' + groupidx + '.head' + imgidx + '').is(':checked')) {
                $('.check_head.' + groupidx + '.head' + imgidx + '').prop("checked", false);
                $(".head_allselect." + groupidx + "").prop("checked", false);
            }
            else {
                $('.check_head.' + groupidx + '.head' + imgidx + '').prop("checked", true);
            }
            $(".selectText.head." + groupidx + "").text($(".check_head." + groupidx + ":checked").length);
        });

        $(document).on("click", ".cropImg.lp", function () {
            var groupidx = $(this).data("groupidx")
            var imgidx = $(this).data("imgidx")
            if ($('.check_lp.' + groupidx + '.lp' + imgidx + '').is(':checked')) {
                $('.check_lp.' + groupidx + '.lp' + imgidx + '').prop("checked", false);
                $(".lp_allselect." + groupidx + "").prop("checked", false);
            }
            else {
                $('.check_lp.' + groupidx + '.lp' + imgidx + '').prop("checked", true);
            }
            $(".selectText.lp." + groupidx + "").text($(".check_lp." + groupidx + ":checked").length);
        });

        $(document).on("click", ".originBtn", function () {
            var imgsrc = $(this).parent().children("img").attr("src")
            $(".cropView").attr("src", imgsrc)
            $(".cropHeader").addClass('active')
            $(".cancel").removeClass('active')
            $("#cropView").addClass('active')
        });

        $(document).on("click", ".recovery", function () {
            var recoFileLen = document.getElementsByClassName('recoArea').length;
            var selectedFile = new Array();
            for (var i = 1; i < recoFileLen + 1; i++) {
                var data = new Object();
                var allCheck = [$('.body_allselect.' + i + '').is(':checked'), $('.head_allselect.' + i + '').is(':checked'), $('.lp_allselect.' + i + '').is(':checked')]
                if (allCheck[0] == true && allCheck[1] == true && allCheck[2] == true) {
                    data.allCheck = true
                }
                else {
                    if (allCheck[0] == true) {
                        data.body = ["all"]
                    }
                    else {
                        var cropList = document.getElementsByClassName('check_body ' + i + '');
                        var bodyList = []
                        for (var j = 0; j < cropList.length; j++) {
                            if (cropList[j].checked == true) {
                                bodyList.push(cropList[j].value)
                            }
                        }
                        if (cropList.length == 0) {
                            data.body = bodyList
                        }
                        else if (cropList.length == bodyList.length) {
                            data.body = ["all"]
                        }
                        else {
                            data.body = bodyList
                        }
                    }
                    if (allCheck[1] == true) {
                        data.head = ["all"]
                    }
                    else {
                        var cropList = document.getElementsByClassName('check_head ' + i + '');
                        var headList = []
                        for (var j = 0; j < cropList.length; j++) {
                            if (cropList[j].checked == true) {
                                headList.push(cropList[j].value)
                            }
                        }
                        if (cropList.length == 0) {
                            data.head = headList
                        }
                        else if (cropList.length == headList.length) {
                            data.head = ["all"]
                        }
                        else {
                            data.head = headList
                        }
                    }
                    if (allCheck[2] == true) {
                        data.lp = ["all"]
                    }
                    else {
                        var cropList = document.getElementsByClassName('check_lp ' + i + '');
                        var lpList = []
                        for (var j = 0; j < cropList.length; j++) {
                            if (cropList[j].checked == true) {
                                lpList.push(cropList[j].value)
                            }
                        }
                        if (cropList.length == 0) {
                            data.lp = lpList
                        }
                        else if (cropList.length == lpList.length) {
                            data.lp = ["all"]
                        }
                        else {
                            data.lp = lpList
                        }
                    }
                    if (data.body == ["all"] && data.head == ["all"] && data.lp == ["all"]) {
                        data.allCheck = true
                        delete data.body
                        delete data.head
                        delete data.lp
                    }
                    else {
                        data.allCheck = false
                    }
                }
                selectedFile.push(data)
            }

            // test.selectFile(idx, selectedFile)
            let decryptArgs = {
                idx: idx,
                selectedFile: selectedFile,
                encryptIdx: encryptIdx
            }

            let decryptAjaxResponse = fileModule.decrypt(decryptArgs);
            console.log('selectedFile : ', selectedFile);
            // 복호화 카운트 증가시키는 함수 추가
            let fileNames = urlParams.get('fileNames');
            fileNames = fileNames.split(',');
            let requestType = 'restoration';
            comm.increaseRequestCount(encryptIdx, fileNames, requestType);
            let decRequestId = decryptAjaxResponse.decReqInfo.decRequestId;
            let fileList = decryptAjaxResponse.fileList;
            if (decryptAjaxResponse) {
                uploadID = makeid(6);
                fileModule.sendDecryptMessage(decryptAjaxResponse.decReqInfo, thumb[1]);
                comm.meterDecrypt(decRequestId, JSON.stringify(fileList), type);
                comm.loggingDecrypt(decRequestId);

                socket.emit('delUploadedFile', {
                    filePath: thumb[1],
                    id: uploadID,
                    immediate: 'true'
                })

                Swal.fire({
                    title: '복호화 요청이 \n완료되었습니다.',
                    showCancelButton: false,
                    confirmButtonText: '확인',
                    allowOutsideClick: false,
                    icon: 'success'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.href = '/loading?type=' + type + '&id=' + decRequestId + '&service=decrypt' + '&encID=' + encryptIdx;
                    }
                })
            }
        });

        if (mode == "group") {
            for (var i = 0; i < $(".encImgArea").length; i++) {
                load('.cropArea.body.' + (i + 1) + '', 'body', '5', (i + 1), '');
                load('.cropArea.head.' + (i + 1) + '', 'head', '5', (i + 1), '');
                load('.cropArea.lp.' + (i + 1) + '', 'lp', '5', (i + 1), '');
            }
        }
        else {
            load('.cropArea.body', 'body', '5', '1');
            load('.cropArea.head', 'head', '5', '1');
            load('.cropArea.lp', 'lp', '5', '1');
        }

        $(document).on("click", ".btn-wrap.body .morebutton", function () {
            if (mode == "group") {
                var groupidx = $(this).data("idx")
                load('.cropArea.body.' + groupidx + '', 'body', '5', groupidx, '.btn-wrap');
            }
            else {
                load('.cropArea.body', 'body', '5', '1', '.btn-wrap');
            }
        })

        $(document).on("click", ".btn-wrap.head .morebutton", function () {
            if (mode == "group") {
                var groupidx = $(this).data("idx")
                load('.cropArea.head.' + groupidx + '', 'head', '5', groupidx, '.btn-wrap');
            }
            else {
                load('.cropArea.head', 'head', '5', '1', '.btn-wrap');
            }
        })

        $(document).on("click", ".btn-wrap.lp .morebutton", function () {
            if (mode == "group") {
                var groupidx = $(this).data("idx")
                load('.cropArea.lp.' + groupidx + '', 'lp', '5', groupidx, '.btn-wrap');
            }
            else {
                load('.cropArea.lp', 'lp', '5', '1', '.btn-wrap');
            }
        })

        function load(id, type, cnt, idx, btn) {
            var enc_list = id + " .cropContent:not(.active)";
            var enc_length = $(enc_list).length;
            var enc_total_cnt;
            if (cnt < enc_length) {
                enc_total_cnt = cnt;
                $('.btn-wrap.' + type + '.' + idx + '').show()
            } else {
                enc_total_cnt = enc_length;
                $('.btn-wrap.' + type + '.' + idx + '').hide()
            }
            $(id + " .cropContent:not(.active):lt(" + enc_total_cnt + ")").addClass("active");
            // 더보기 클릭 시 첫째열에 전부 나오지 않도록 각 열에 하나씩 배치하는 코드
            // for(var i=0;i<enc_total_cnt;i++){
            //     $(id +" .column"+(i+1)+"_"+type+".group"+idx+" .cropContent:not(.active):lt(1)").addClass("active");
            // }
        }
    },

    usage_past: function () {
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
            // resultLoader.meterUsageExcel();
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

    usage: function () {
        function dateChange(year, month) {
            $(".selectYearText").text(`${year}년`)
            $(".selectMonthText").text(`${month}월`)
            $(".monthPriceText").text(`${month}월 이용 요금`)
            let yearMonth = `${year}-${month}`;
            let todayDate = new Date()
            let todayMonth = todayDate.getMonth() + 1
            let startDate = `${year}. ${month}. 01`
            let endDate
            if (month == String(todayMonth).padStart(2, "0")) {
                endDate = `${year}. ${month}. ${String(todayDate.getDate()).padStart(2, "0")}`
            }
            else {
                let end = new Date(year, month, 0)
                endDate = `${year}. ${month}. ${String(end.getDate()).padStart(2, "0")}`
            }
            $(".dateLength").text(`이용 기간 : ${startDate} ~ ${endDate}`)
            console.log(yearMonth)
            requestTable.getFileHistory(yearMonth).then((monthFiles) => {
                sessionStorage.setItem("fileData", JSON.stringify(monthFiles))
                fileHTML(JSON.parse(sessionStorage.getItem("fileData")))
            })
            requestTable.getJobHistory(yearMonth).then((monthFiles) => {
                sessionStorage.setItem("workData", JSON.stringify(monthFiles))
            })
        }

        function paging() {
            $(".tableBody").paging({
                number_of_items: 10,   //default: 5 | takes: non-zero numeral less than total limit
                pagination_type: "full_numbers", // default full_numbers | takes: full_numbers | prev_next | first_prev_next_last
                number_of_page_buttons: 10, //default 3 | takes: non-zero numeral less than total page size
                stealth_mode: false, //default false | takes: Boolean true | false
                theme: "light_connected", //default light_connected | takes: light_connected | light | blue | ""
                animate: false, //default true | takes: true | false
                onBeforeInit: function (instance, $el) { },
                onAfterInit: function (instance, $el) { },
                onBeforeEveryDraw: function (instance, $pager) { },
                onAfterEveryDraw: function (instance, $pager) { },
                onFirstPage: function (instance, $pager) { },
                onLastPage: function (instance, $pager) { }
            });
        }

        function getHeaderData(yearMonth) {
            requestTable.getMonthFare(yearMonth).then((fares) => {
                console.log('fares.total_charge : ', fares.total_charge);
                $('.priceText').text(`${price_three(fares["total_charge"])}`);
                let calcPrice = `<p>총 서비스 기본 금액  ${price_three(fares["basic_charge"])} + 총 추가 발생 금액  ${price_three(fares["extra_charge"])} - 총 할인 금액  ${price_three(fares["free_charge"])} = 총 차감 금액  ${price_three(fares["total_charge"])}</p>`
                $(".calcPrice").html(calcPrice)
            });
            requestTable.getMonthUsage(yearMonth).then(([imageUsage, videoUsage]) => {
                console.log('imageUsage : ', imageUsage);
                console.log('videoUsage : ', videoUsage);
                let usageCountTable = `<div class="usageTableContent">
                                            <div class="usageTableInfo">
                                                <div class="usageContentText category">
                                                    <p>이미지 파일</p>
                                                </div>
                                                <div class="usageContentText encrypt">
                                                    <p>${imageUsage["de_identification"]} 회</p>
                                                </div>
                                                <div class="usageContentText additional">
                                                    <p>${imageUsage["masking_count"]} 회</p>
                                                </div>
                                                <div class="usageContentText decrypt">
                                                    <p>${imageUsage["restoration_count"]} 회</p>
                                                </div>
                                                <div class="usageContentText download">
                                                    <p>${imageUsage["download_count"]} 회</p>
                                                </div>
                                                <div class="usageContentText total">
                                                    <p>${imageUsage["total_count"]} 회</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="usageTableContent">
                                            <div class="usageTableInfo">
                                                <div class="usageContentText category">
                                                    <p>영상 파일</p>
                                                </div>
                                                <div class="usageContentText encrypt">
                                                    <p>${videoUsage["de_identification"]} 회</p>
                                                </div>
                                                <div class="usageContentText additional">
                                                    <p>${videoUsage["masking_count"]} 회</p>
                                                </div>
                                                <div class="usageContentText decrypt">
                                                    <p>${videoUsage["restoration_count"]} 회</p>
                                                </div>
                                                <div class="usageContentText download">
                                                    <p>${videoUsage["download_count"]} 회</p>
                                                </div>
                                                <div class="usageContentText total">
                                                    <p>${videoUsage["total_count"]} 회</p>
                                                </div>
                                            </div>
                                        </div>`
                $(".usageTableBody").html(usageCountTable)
            })
        }

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1; // JavaScript의 월은 0부터 시작하므로 +1 해줍니다.

        // 월을 두 자리로 표현하도록 포맷팅합니다.
        let formattedMonth = currentMonth.toString().padStart(2, "0");

        $("#searchMonth").val(`${currentYear}-${formattedMonth}`);
        getHeaderData($("#searchMonth").val())

        $(document).on("change", "#searchMonth", function () {
            getHeaderData($("#searchMonth").val())
        })

        $(document).on("click", ".option", function () {
            let type = $(this).val()
            workHTML(JSON.parse(sessionStorage.getItem("workData")), type)
        })

        // let yearMonth = `${currentYear}-${formattedMonth}`;
        // requestTable.getMonthFare(yearMonth).then((fares) => {
        //     console.log('fares.total_charge : ',fares.total_charge);
        //     $('.priceText').text(`${fares.total_charge}`);
        // });
        // requestTable.getMonthUsage('2023-10').then(([imageUsage, videoUsage]) => {
        //     console.log('imageUsage : ',imageUsage);
        //     console.log('videoUsage : ',videoUsage);
        // })

        dateChange($("#searchMonth").val().split('-')[0], $("#searchMonth").val().split('-')[1])

        $(document).on("change", "#searchMonth", function () {
            dateChange($("#searchMonth").val().split('-')[0], $("#searchMonth").val().split('-')[1])
            $(".tableArea").html("")
            $(".logBtn.file").addClass("active")
            $(".logBtn.work").removeClass("active")
        })

        $(document).on("click", ".logBtn", function () {
            let viewType = $(this).data("type")
            $(".excelDownload").removeClass("file")
            $(".excelDownload").removeClass("work")
            $(".excelDownload").removeClass("credit")
            $(".excelDownload").addClass(`${viewType}`)
            $(".logBtn").removeClass("active")
            $(this).addClass("active")
            if (viewType == "file") {
                fileHTML(JSON.parse(sessionStorage.getItem("fileData")))
            }
            else if (viewType == "work") {
                workHTML(JSON.parse(sessionStorage.getItem("workData")), "all")
            }
        })

        $(document).on("click", ".detailBtn", function () {
            $("#priceDetail").addClass("active")
            let filename = $(this).parent().parent().children()[4].textContent.replace(/ /g, "").replace(/\n/g, "")
            let filetype = $(this).parent().parent().children()[5].textContent.replace(/ /g, "").replace(/\n/g, "")
            let rest = $(this).parent().parent().children()[6].textContent.replace(/ /g, "").replace(/\n/g, "")
            requestTable.getFileDetailHistory($(this).data("idx"), filename, filetype, rest).then((detailData) => {
                $(".priceContent").html(detailData)
            })
        })

        function fileHTML(fileData) {
            let contentHTML = `<div class="tableTitle">
                                    <h3 class="titleText">파일별 이용 및 요금 내역</h3>
                                </div>
                                <div class="tableHeader">
                                    <div class='logHeader num file'>
                                        <p>번 호</p>
                                    </div>
                                    <div class='logHeader user file'>
                                        <p>사용자</p>
                                    </div>
                                    <div class='logHeader start file'>
                                        <p>작업 시작일</p>
                                    </div>
                                    <div class='logHeader recent file'>
                                        <p>최근 작업일</p>
                                    </div>
                                    <div class='logHeader filename file'>
                                        <p>파일명</p>
                                    </div>
                                    <div class='logHeader filetype file'>
                                        <p>파일 유형</p>
                                    </div>
                                    <div class='logHeader service file'>
                                        <div class='mainHeading'>
                                            <p>이용 서비스</p>
                                        </div>
                                        <div class='subHeading'>
                                            <div class='heading'>
                                                <p>비식별화 <br>(복호화 여부)</p>
                                            </div>
                                            <div class='heading'>
                                                <p>추가 <br>비식별화</p>
                                            </div>
                                            <div class='heading'>
                                                <p>부분 <br>복호화</p>
                                            </div>
                                            <div class='heading'>
                                                <p>다운로드</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='logHeader end file'>
                                        <p>파일 만료일</p>
                                    </div>
                                    <div class='logHeader price file'>
                                        <p>차감 요금</p>
                                    </div>
                                    <div class='logHeader detail file'>
                                        <p>요금 <br>상세보기</p>
                                    </div>
                                </div>`
            contentHTML += `<div class='tableBody'>
                                    <div class='tableContent'>`
            if (fileData.length == 0) {
                contentHTML += `<div class='contentInfo'>
                                    <div class='logContent num file' style='width:100%'>
                                        <p>내역이 없습니다.</p>
                                    </div>
                                </div>`
            }
            else {
                for (let i = 0; i < fileData.length; i++) {
                    let restorationData
                    let fileType
                    if (fileData[i]["restoration"] == 0) {
                        restorationData = "X"
                    }
                    else {
                        restorationData = "O"
                    }
                    if (fileData[i]["file_type"] == "image") {
                        fileType = "이미지"
                    }
                    else {
                        fileType = "영상"
                    }
                    contentHTML += `<div class='contentInfo'>
                                        <div class='logContent num file'>
                                            <p>${fileData[i]["id"]}</p>
                                        </div>
                                        <div class='logContent user file'>
                                            <p>${fileData[i]["fk_account_name"]}</p>
                                        </div>
                                        <div class='logContent start file'>
                                            <p>${fileData[i]["upload_datetime"]}</p>
                                        </div>
                                        <div class='logContent recent file'>
                                            <p>${fileData[i]["recent_date"]}</p>
                                        </div>
                                        <div class='logContent filename file'>
                                            <p>${fileData[i]["upload_filename"]}</p>
                                        </div>
                                        <div class='logContent filetype file'>
                                            <p>${fileType}</p>
                                        </div>
                                        <div class='logContent encrpyt file'>
                                            <p>${restorationData}</p>
                                        </div>
                                        <div class='logContent additional file'>
                                            <p>${fileData[i]["masking_success"]} 회</p>
                                        </div>
                                        <div class='logContent decrypt file'>
                                            <p>${fileData[i]["restoration_success"]} 회</p>
                                        </div>
                                        <div class='logContent download file'>
                                            <p>${fileData[i]["download_count"]} 회</p>
                                        </div>
                                        <div class='logContent end file'>
                                            <p>${fileData[i]["expiration_datetime"]}</p>
                                        </div>
                                        <div class='logContent price file'>
                                            <p>${price_three(Number(fileData[i]["file_charge"]))}</p>
                                        </div>
                                        <div class='logContent detail file'>
                                            <div class='detailBtn' data-idx=${fileData[i]["id"]}>
                                                <span>상세 내역</span>
                                                <img src='./static/imgs/usage/detailPriceIcon.png'>
                                            </div>
                                        </div>
                                    </div>`
                }
            }
            contentHTML += `</div>
                                </div>`
            $(".tableArea").html(contentHTML)
            paging()
        }

        function workHTML(workData, viewType) {
            let allCheck = ""
            let encCheck = ""
            let addCheck = ""
            let decCheck = ""
            let downCheck = ""
            if (viewType == "all") {
                allCheck = "checked"
            }
            else if (viewType == "encrypt") {
                encCheck = "checked"
            }
            else if (viewType == "additional_encrypt") {
                addCheck = "checked"
            }
            else if (viewType == "decrypt") {
                decCheck = "checked"
            }
            else if (viewType == "download") {
                downCheck = "checked"
            }
            let contentHTML = `<div class="tableTitle work">
                                    <h3 class="titleText">작업별 이용 및 요금 내역</h3>
                                    <div class="inputOption">
                                        <label><input class='option' type="radio" name="option" value="all" ${allCheck}>전체</label>
                                        <label><input class='option' type="radio" name="option" value="encrypt" ${encCheck}> 비식별화 사용량</label>
                                        <label><input class='option' type="radio" name="option" value="additional_encrypt" ${addCheck}>추가 비식별화 사용량</label>
                                        <label><input class='option' type="radio" name="option" value="decrypt" ${decCheck}>복호화 사용량</label>
                                        <label><input class='option' type="radio" name="option" value="download" ${downCheck}>다운로드 사용량</label>
                                    </div>
                                </div>
                                <div class="tableHeader">
                                    <div class='logHeader num work'>
                                        <p>번 호</p>
                                    </div>
                                    <div class='logHeader user work'>
                                        <p>사용자</p>
                                    </div>
                                    <div class='logHeader date work'>
                                        <p>작업 일시</p>
                                    </div>
                                    <div class='logHeader filename work'>
                                        <p>파일명</p>
                                    </div>
                                    <div class='logHeader filetype work'>
                                        <p>파일 유형</p>
                                    </div>
                                    <div class='logHeader service work'>
                                        <p>이용 서비스</p>
                                    </div>
                                    <div class='logHeader basic work'>
                                        <p>기본료</p>
                                    </div>
                                    <div class='logHeader resolution work'>
                                        <p>해상도</p>
                                    </div>
                                    <div class='logHeader duration work'>
                                        <p>영상 길이</p>
                                    </div>
                                    <div class='logHeader object work'>
                                        <p>처리 객체수</p>
                                    </div>
                                    <div class='logHeader base work'>
                                        <p>서비스 <br>기본 금액</p>
                                    </div>
                                    <div class='logHeader add work'>
                                        <p>추가 <br>발생 금액</p>
                                    </div>
                                    <div class='logHeader discount work'>
                                        <p>할인 금액</p>
                                    </div>
                                    <div class='logHeader price work'>
                                        <p>차감 금액</p>
                                    </div>
                                </div>`
            contentHTML += `<div class='tableBody'>
                                    <div class='tableContent'>`
            if (workData["jobHistory"].length == 0) {
                contentHTML += `<div class='contentInfo'>
                                    <div class='logContent num work' style='width:100%'>
                                        <p>내역이 없습니다.</p>
                                    </div>
                                </div>`
            }
            else {
                for (let i = 0; i < workData["jobHistory"].length; i++) {
                    let fileType
                    let serviceType
                    let hdType
                    let fileResolution = Number(workData["jobHistory"][i]["file_width"]) * Number(workData["jobHistory"][i]["file_height"])
                    let duration = "<p>-</p>"
                    let basePrice
                    if (workData["jobHistory"][i]["file_type"] == "image") {
                        fileType = "이미지"
                    }
                    else {
                        fileType = "영상"
                    }

                    if (workData["jobHistory"][i]["request_type"] == "encrypt") {
                        serviceType = "비식별화"
                    }
                    else if (workData["jobHistory"][i]["request_type"] == "additional_encrypt") {
                        serviceType = "추가 비식별화"
                    }
                    else if (workData["jobHistory"][i]["request_type"] == "decrypt") {
                        serviceType = "부분 복호화"
                    }
                    else if (workData["jobHistory"][i]["request_type"] == "download") {
                        serviceType = "다운로드"
                    }

                    if (fileResolution <= 921600) {
                        hdType = `HD 이하`
                    }
                    else if (fileResolution <= 2073600) {
                        hdType = `FHD 이하`
                    }
                    else {
                        hdType = `FHD 초과`
                    }

                    if (fileType != "이미지") {
                        duration = `<span>${time_change(Number(workData["jobHistory"][i]["duration"]))}</span>
                                    <h5>(${price_three(Number(workData["jobHistory"][i]["duration"]))}초)</h5>`
                    }

                    if (fileType == "영상" && workData["jobHistory"][i]["restoration"] == 1) {
                        basePrice = price_three(10000)
                    }
                    else if (fileType == "영상" && workData["jobHistory"][i]["restoration"] == 0) {
                        basePrice = price_three(7000)
                    }
                    else if (fileType == "이미지" && workData["jobHistory"][i]["restoration"] == 1) {
                        basePrice = price_three(600)
                    }
                    else if (fileType == "이미지" && workData["jobHistory"][i]["restoration"] == 0) {
                        basePrice = price_three(400)
                    }
                    if (viewType == "all") {
                        contentHTML += `<div class='contentInfo'>
                                            <div class='logContent num work'>
                                                <p>${workData["jobHistory"][i]["id"]}</p>
                                            </div>
                                            <div class='logContent user work'>
                                                <p>${workData["jobHistory"][i]["account_name"]}</p>
                                            </div>
                                            <div class='logContent date work'>
                                                <p>${workData["jobHistory"][i]["request_date"]} <br>${workData["jobHistory"][i]["request_time"]}</p>
                                            </div>
                                            <div class='logContent filename work'>
                                                <p>${workData["jobHistory"][i]["file_name"]}</p>
                                            </div>
                                            <div class='logContent filetype work'>
                                                <p>${fileType}</p>
                                            </div>
                                            <div class='logContent service work'>
                                                <p>${serviceType}</p>
                                            </div>
                                            <div class='logContent basic work'>
                                                <p>${basePrice}</p>
                                            </div>
                                            <div class='logContent resolution work'>
                                                <div class='textArea'>
                                                    <span>${hdType}</span>
                                                    <h5>(${workData["jobHistory"][i]["file_width"]}X${workData["jobHistory"][i]["file_height"]})</h5>
                                                </div>
                                            </div>
                                            <div class='logContent duration work'>
                                                <div class='textArea'>
                                                    ${duration}
                                                </div>
                                            </div>
                                            <div class='logContent object work'>
                                                <p>${workData["jobHistory"][i]["object_count"]}개</p>
                                            </div>
                                            <div class='logContent base work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["basic_charge"]))}</p>
                                            </div>
                                            <div class='logContent add work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["extra_charge"]))}</p>
                                            </div>
                                            <div class='logContent discount work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["free_charge"]))}</p>
                                            </div>
                                            <div class='logContent price work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["service_charge"]))}</p>
                                            </div>
                                        </div>`
                    }
                    else if (viewType == "encrypt" && workData["jobHistory"][i]["request_type"] == "encrypt") {
                        contentHTML += `<div class='contentInfo'>
                                            <div class='logContent num work'>
                                                <p>${workData["jobHistory"][i]["id"]}</p>
                                            </div>
                                            <div class='logContent user work'>
                                                <p>${workData["jobHistory"][i]["account_name"]}</p>
                                            </div>
                                            <div class='logContent date work'>
                                                <p>${workData["jobHistory"][i]["request_date"]} <br>${workData["jobHistory"][i]["request_time"]}</p>
                                            </div>
                                            <div class='logContent filename work'>
                                                <p>${workData["jobHistory"][i]["file_name"]}</p>
                                            </div>
                                            <div class='logContent filetype work'>
                                                <p>${fileType}</p>
                                            </div>
                                            <div class='logContent service work'>
                                                <p>${serviceType}</p>
                                            </div>
                                            <div class='logContent basic work'>
                                                <p>${basePrice}</p>
                                            </div>
                                            <div class='logContent resolution work'>
                                                <div class='textArea'>
                                                    <span>${hdType}</span>
                                                    <h5>(${workData["jobHistory"][i]["file_width"]}X${workData["jobHistory"][i]["file_height"]})</h5>
                                                </div>
                                            </div>
                                            <div class='logContent duration work'>
                                                <div class='textArea'>
                                                    ${duration}
                                                </div>
                                            </div>
                                            <div class='logContent object work'>
                                                <p>${workData["jobHistory"][i]["object_count"]}개</p>
                                            </div>
                                            <div class='logContent base work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["basic_charge"]))}</p>
                                            </div>
                                            <div class='logContent add work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["extra_charge"]))}</p>
                                            </div>
                                            <div class='logContent discount work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["free_charge"]))}</p>
                                            </div>
                                            <div class='logContent price work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["service_charge"]))}</p>
                                            </div>
                                        </div>`
                    }
                    else if (viewType == "additional_encrypt" && workData["jobHistory"][i]["request_type"] == "additional_encrypt") {
                        contentHTML += `<div class='contentInfo'>
                                            <div class='logContent num work'>
                                                <p>${workData["jobHistory"][i]["id"]}</p>
                                            </div>
                                            <div class='logContent user work'>
                                                <p>${workData["jobHistory"][i]["account_name"]}</p>
                                            </div>
                                            <div class='logContent date work'>
                                                <p>${workData["jobHistory"][i]["request_date"]} <br>${workData["jobHistory"][i]["request_time"]}</p>
                                            </div>
                                            <div class='logContent filename work'>
                                                <p>${workData["jobHistory"][i]["file_name"]}</p>
                                            </div>
                                            <div class='logContent filetype work'>
                                                <p>${fileType}</p>
                                            </div>
                                            <div class='logContent service work'>
                                                <p>${serviceType}</p>
                                            </div>
                                            <div class='logContent basic work'>
                                                <p>${basePrice}</p>
                                            </div>
                                            <div class='logContent resolution work'>
                                                <div class='textArea'>
                                                    <span>${hdType}</span>
                                                    <h5>(${workData["jobHistory"][i]["file_width"]}X${workData["jobHistory"][i]["file_height"]})</h5>
                                                </div>
                                            </div>
                                            <div class='logContent duration work'>
                                                <div class='textArea'>
                                                    ${duration}
                                                </div>
                                            </div>
                                            <div class='logContent object work'>
                                                <p>${workData["jobHistory"][i]["object_count"]}개</p>
                                            </div>
                                            <div class='logContent base work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["basic_charge"]))}</p>
                                            </div>
                                            <div class='logContent add work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["extra_charge"]))}</p>
                                            </div>
                                            <div class='logContent discount work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["free_charge"]))}</p>
                                            </div>
                                            <div class='logContent price work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["service_charge"]))}</p>
                                            </div>
                                        </div>`
                    }
                    else if (viewType == "decrypt" && workData["jobHistory"][i]["request_type"] == "decrypt") {
                        contentHTML += `<div class='contentInfo'>
                                            <div class='logContent num work'>
                                                <p>${workData["jobHistory"][i]["id"]}</p>
                                            </div>
                                            <div class='logContent user work'>
                                                <p>${workData["jobHistory"][i]["account_name"]}</p>
                                            </div>
                                            <div class='logContent date work'>
                                                <p>${workData["jobHistory"][i]["request_date"]} <br>${workData["jobHistory"][i]["request_time"]}</p>
                                            </div>
                                            <div class='logContent filename work'>
                                                <p>${workData["jobHistory"][i]["file_name"]}</p>
                                            </div>
                                            <div class='logContent filetype work'>
                                                <p>${fileType}</p>
                                            </div>
                                            <div class='logContent service work'>
                                                <p>${serviceType}</p>
                                            </div>
                                            <div class='logContent basic work'>
                                                <p>${basePrice}</p>
                                            </div>
                                            <div class='logContent resolution work'>
                                                <div class='textArea'>
                                                    <span>${hdType}</span>
                                                    <h5>(${workData["jobHistory"][i]["file_width"]}X${workData["jobHistory"][i]["file_height"]})</h5>
                                                </div>
                                            </div>
                                            <div class='logContent duration work'>
                                                <div class='textArea'>
                                                    ${duration}
                                                </div>
                                            </div>
                                            <div class='logContent object work'>
                                                <p>${workData["jobHistory"][i]["object_count"]}개</p>
                                            </div>
                                            <div class='logContent base work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["basic_charge"]))}</p>
                                            </div>
                                            <div class='logContent add work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["extra_charge"]))}</p>
                                            </div>
                                            <div class='logContent discount work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["free_charge"]))}</p>
                                            </div>
                                            <div class='logContent price work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["service_charge"]))}</p>
                                            </div>
                                        </div>`
                    }
                    else if (viewType == "download" && workData["jobHistory"][i]["request_type"] == "download") {
                        contentHTML += `<div class='contentInfo'>
                                            <div class='logContent num work'>
                                                <p>${workData["jobHistory"][i]["id"]}</p>
                                            </div>
                                            <div class='logContent user work'>
                                                <p>${workData["jobHistory"][i]["account_name"]}</p>
                                            </div>
                                            <div class='logContent date work'>
                                                <p>${workData["jobHistory"][i]["request_date"]} <br>${workData["jobHistory"][i]["request_time"]}</p>
                                            </div>
                                            <div class='logContent filename work'>
                                                <p>${workData["jobHistory"][i]["file_name"]}</p>
                                            </div>
                                            <div class='logContent filetype work'>
                                                <p>${fileType}</p>
                                            </div>
                                            <div class='logContent service work'>
                                                <p>${serviceType}</p>
                                            </div>
                                            <div class='logContent basic work'>
                                                <p>${basePrice}</p>
                                            </div>
                                            <div class='logContent resolution work'>
                                                <div class='textArea'>
                                                    <span>${hdType}</span>
                                                    <h5>(${workData["jobHistory"][i]["file_width"]}X${workData["jobHistory"][i]["file_height"]})</h5>
                                                </div>
                                            </div>
                                            <div class='logContent duration work'>
                                                <div class='textArea'>
                                                    ${duration}
                                                </div>
                                            </div>
                                            <div class='logContent object work'>
                                                <p>${workData["jobHistory"][i]["object_count"]}개</p>
                                            </div>
                                            <div class='logContent base work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["basic_charge"]))}</p>
                                            </div>
                                            <div class='logContent add work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["extra_charge"]))}</p>
                                            </div>
                                            <div class='logContent discount work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["free_charge"]))}</p>
                                            </div>
                                            <div class='logContent price work'>
                                                <p>${price_three(Number(workData["jobHistory"][i]["service_charge"]))}</p>
                                            </div>
                                        </div>`
                    }
                }
            }
            contentHTML += `</div>
                                </div>`
            $(".tableArea").html(contentHTML)
            paging()
        }
    },

    cash: function async() {
        function getCash(start, end) {
            requestTable.getCashHistory(start, end).then((cashData) => {
                sessionStorage.setItem("cashData", JSON.stringify(cashData))
                tableCreate(JSON.parse(sessionStorage.getItem("cashData")), "all")
            })
        }

        function tablePaging() {
            $(".cashTableContent").paging({
                number_of_items: 10,   //default: 5 | takes: non-zero numeral less than total limit
                pagination_type: "full_numbers", // default full_numbers | takes: full_numbers | prev_next | first_prev_next_last
                number_of_page_buttons: 10, //default 3 | takes: non-zero numeral less than total page size
                stealth_mode: false, //default false | takes: Boolean true | false
                theme: "light_connected", //default light_connected | takes: light_connected | light | blue | ""
                animate: false, //default true | takes: true | false
                onBeforeInit: function (instance, $el) { },
                onAfterInit: function (instance, $el) { },
                onBeforeEveryDraw: function (instance, $pager) { },
                onAfterEveryDraw: function (instance, $pager) { },
                onFirstPage: function (instance, $pager) { },
                onLastPage: function (instance, $pager) { }
            });
        }

        function checkDateDifference() {
            // 입력 요소에서 날짜 값을 가져옵니다.
            var date1 = new Date($(".startDate").val());
            var date2 = new Date($(".endDate").val());

            // 날짜 차이를 계산합니다.
            var timeDiff = Math.abs(date2 - date1);
            var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // 날짜 차이가 1년 이상이면 alert를 표시합니다.
            if (daysDiff >= 365) {
                return false
            } else {
                return true
            }
        }

        let todayDate = new Date()
        let todayYear = todayDate.getFullYear()
        let todayMonth = String(todayDate.getMonth() + 1).padStart(2, "0")
        let todayDay = String(todayDate.getDate()).padStart(2, "0")
        let startDate = `${todayYear}-${todayMonth}-01`
        let endDate = `${todayYear}-${todayMonth}-${todayDay}`

        getCash(startDate, endDate)

        $(".priceText").text(`${price_three(comm.getNowPoint())}`)

        $(document).on("click", ".option", function () {
            let type = $(this).val()
            tableCreate(JSON.parse(sessionStorage.getItem("cashData")), type)
        })

        $(document).on("change", ".endDate", function () {
            if ($(".startDate").val() == "") {
                Swal.fire({
                    title: '시작날짜를 선택해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
                $(".endDate").val("")
            }
            else if ($(".startDate").val() > $(".endDate").val()) {
                Swal.fire({
                    title: '시작날짜를 종료날짜보다 \n크게 할 수 없어요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
                $(".startDate").val("")
                $(".endDate").val("")
            }
            else if (checkDateDifference() == false) {
                Swal.fire({
                    title: '검색할 수 있는 \n최대 범위를 초과했어요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
                $(".startDate").val("")
                $(".endDate").val("")
            }
            else {
                getCash($(".startDate").val(), $(".endDate").val())
                $(".priceText").text(`${price_three(comm.getNowPoint())}`)
            }
        })

        function tableCreate(cash, type) {
            let tableHTML = `<div class="cashTableHeader">
                                <div class="cashHeader date">
                                    <p>일 시</p>
                                </div>
                                <div class="cashHeader content">
                                    <p>내 용</p>
                                </div>
                                <div class="cashHeader cash">
                                    <p>캐 시</p>
                                </div>
                            </div>
                            <div class="cashTableContent">
                                <div class="cashList">`
            if (cash.length == 0) {
                tableHTML += `<div class='cashBox'>
                                <div class="cashContent date" style='width:100%;'>
                                    <p>내역이 없습니다.</p>
                                </div>
                            </div>`
            }
            else {
                if (type == "all") {
                    for (let i = 0; i < cash.length; i++) {
                        let contentHTML = ``
                        let plusAndminus = ``
                        let cashType = ``
                        if (cash[i]["transaction_type"] == "charge") {
                            contentHTML = `<h2>캐시 충전</h2>`
                            cashType = `plusCash`
                            plusAndminus = `+`
                        }
                        else {
                            let serviceType
                            if (cash[i]["request_type"] == "encrypt") {
                                serviceType = "비식별화"
                            }
                            else if (cash[i]["request_type"] == "additional_encrypt") {
                                serviceType = "추가 비식별화"
                            }
                            else if (cash[i]["request_type"] == "decrypt") {
                                serviceType = "부분 복호화"
                            }
                            else if (cash[i]["request_type"] == "download") {
                                serviceType = "다운로드"
                            }
                            contentHTML = `<h5>${cash[i]["user_name"]}</h5>
                                            <h3>${serviceType}</h3>
                                            <h4>{파일명}</h4>`
                            cashType = `minusCash`
                            plusAndminus = `-`
                        }
                        tableHTML += `<div class='cashBox'>
                                        <div class="cashContent date">
                                            <p>${cash[i]["transaction_date"].split("T")[0]} ${cash[i]["transaction_time"]}</p>
                                        </div>
                                        <div class="cashContent content">
                                            <div class="textArea">
                                                ${contentHTML}
                                            </div>
                                        </div>
                                        <div class="cashContent cash">
                                            <span class="${cashType}">${plusAndminus} ${price_three(cash[i]["amount"])}</span>
                                        </div>
                                    </div>`
                    }
                }
                else if (type == "charge") {
                    // let chargeLength = 0

                    // for(let i;i<cash.length;i++){
                    //     if(cash[i]["transaction_type"] == "charge"){
                    //         chargeLength += 1
                    //     }
                    // }

                    // if(chargeLength==0){
                    //     tableHTML += `<div class='cashBox'>
                    //                     <div class="cashContent date" style='width:100%;'>
                    //                         <p>내역이 없습니다.</p>
                    //                     </div>
                    //                 </div>`
                    // }
                    // else{
                    for (let i = 0; i < cash.length; i++) {
                        if (cash[i]["transaction_type"] == "charge") {
                            let contentHTML = `<h2>캐시 충전</h2>`
                            let cashType = `plusCash`
                            tableHTML += `<div class='cashBox'>
                                                <div class="cashContent date">
                                                    <p>${cash[i]["transaction_date"].split("T")[0]} ${cash[i]["transaction_time"]}</p>
                                                </div>
                                                <div class="cashContent content">
                                                    <div class="textArea">
                                                        ${contentHTML}
                                                    </div>
                                                </div>
                                                <div class="cashContent cash">
                                                    <span class="${cashType}">+ ${price_three(cash[i]["amount"])}</span>
                                                </div>
                                            </div>`
                        }
                    }
                    // }
                }
                else if (type == "use") {
                    // let useLength = 0

                    // for(let i;i<cash.length;i++){
                    //     if(cash[i]["transaction_type"] == "withdraw"){
                    //         useLength += 1
                    //     }
                    // }

                    // if(useLength==0){
                    //     tableHTML += `<div class='cashBox'>
                    //                     <div class="cashContent date" style='width:100%;'>
                    //                         <p>내역이 없습니다.</p>
                    //                     </div>
                    //                 </div>`
                    // }
                    // else{
                    for (let i = 0; i < cash.length; i++) {
                        if (cash[i]["transaction_type"] == "withdraw") {
                            let cashType = ``
                            let serviceType
                            if (cash[i]["request_type"] == "encrypt") {
                                serviceType = "비식별화"
                            }
                            else if (cash[i]["request_type"] == "additional_encrypt") {
                                serviceType = "추가 비식별화"
                            }
                            else if (cash[i]["request_type"] == "decrypt") {
                                serviceType = "부분 복호화"
                            }
                            else if (cash[i]["request_type"] == "download") {
                                serviceType = "다운로드"
                            }
                            let contentHTML = `<h5>${cash[i]["user_name"]}</h5>
                                                <h3>${serviceType}</h3>
                                                <h4>{파일명}</h4>`
                            cashType = `minusCash`
                            tableHTML += `<div class='cashBox'>
                                                <div class="cashContent date">
                                                    <p>${cash[i]["transaction_date"].split("T")[0]} ${cash[i]["transaction_time"]}</p>
                                                </div>
                                                <div class="cashContent content">
                                                    <div class="textArea">
                                                        ${contentHTML}
                                                    </div>
                                                </div>
                                                <div class="cashContent cash">
                                                    <span class="${cashType}">- ${price_three(cash[i]["amount"])}</span>
                                                </div>
                                            </div>`
                        }
                    }
                    // }
                }
            }
            tableHTML += `    </div>
                                </div>`

            $(".tableContentArea").html(tableHTML)
            tablePaging()
        }
    },

    qna: function () {
        $(document).on("click", ".checkService", function () {
            if ($('.agreeServiceCheck').is(':checked')) {
                $(".noneServiceCheck").addClass("active")
                $(".checkService").removeClass("active")
            }
            else {
                $(".noneServiceCheck").removeClass("active")
                $(".checkService").addClass("active")
            }
        });

        $(document).on("click", ".confirmBtn", function () {
            if ($('.nameInfo').val() == "") {
                Swal.fire({
                    title: '이름(기관명)을 \n입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                if ($('.emailInfo').val() == "") {
                    Swal.fire({
                        title: '이메일을 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
                else {
                    if ($('.typeInfo').val() == "") {
                        Swal.fire({
                            title: '문의 유형을 입력해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                    else {
                        if ($('.phoneInfo').val() == "") {
                            Swal.fire({
                                title: '연락처를 입력해주세요.',
                                showConfirmButton: false,
                                showDenyButton: true,
                                denyButtonText: "확 인",
                                icon: "error"
                            });
                        }
                        else {
                            if ($('.titleInfo').val() == "") {
                                Swal.fire({
                                    title: '문의 제목을 입력해주세요.',
                                    showConfirmButton: false,
                                    showDenyButton: true,
                                    denyButtonText: "확 인",
                                    icon: "error"
                                });
                            }
                            else {
                                if ($('.contentInfo').val() == "") {
                                    Swal.fire({
                                        title: '문의 내용을 입력해주세요.',
                                        showConfirmButton: false,
                                        showDenyButton: true,
                                        denyButtonText: "확 인",
                                        icon: "error"
                                    });
                                }
                                else {
                                    if ($(".agreeServiceCheck").is(":checked") == false) {
                                        Swal.fire({
                                            title: '개인정보 수집 및 이용에 \n동의해주세요.',
                                            showConfirmButton: false,
                                            showDenyButton: true,
                                            denyButtonText: "확 인",
                                            icon: "error"
                                        });
                                    }
                                    else {
                                        console.log($('.nameInfo').val(), $('.emailInfo').val(), $('.typeInfo').val(), $('.phoneInfo').val(), $('.titleInfo').val(), $('.contentInfo').val())
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    },

    decrypt_log: function () {

        function reloadProgress() {
            var encProgress = requestTable.getDecProgress();
            var progress = encProgress['progress']
            if (progress == null) return 0;
            else {
                $('#progress').html(progress);
                if (encProgress['complete'] != 1) setTimeout(reloadProgress, 200);
                else {
                    var mainLog = requestTable.getAllDecRequestList()
                    $(".mainLog").html(mainLog);
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

    myinfo: async function () {
        // var queryString = location.search;
        // const urlParams = new URLSearchParams(queryString);
        // var auth = urlParams.get('auth');

        // $(document).ready(function () {
        //     if (auth != "1") {
        //         location.href = "/main"
        //     }
        // });
        let verify = await comm.joinInfo();
        if (!verify) location.href = '/main';
        await comm.expireJoinInfo();

        let verifyCode = '';
        let email_config = false;
        $(document).on("click", ".auth_send", function () {
            let user_email = $(".view_email").val();
            if (user_email == first_email) {
                Swal.fire({
                    title: '이메일이 \n변경되지 않았습니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                if (validEmail({ value: user_email })) {
                    verifyCode = userinfo.emailAuthentication(user_email);
                    $(".none_text").removeClass('active')
                    $(".auth_send").removeClass('active')
                    $(".valid_text").addClass('active')
                    $(".view_emailValid").addClass('active')
                    $(".auth_config").addClass('active')
                }
                else {
                    Swal.fire({
                        title: '이메일 형식이 맞지 않습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
        });

        $(document).on("click", ".auth_config", function () {
            let user_code = $(".view_emailValid").val();
            if (user_code == verifyCode) {
                email_config = true;
                Swal.fire({
                    title: '인증이 완료되었습니다.',
                    showConfirmButton: true,
                    showDenyButton: false,
                    denyButtonText: "확 인",
                    icon: "success"
                });
            }
            else {
                Swal.fire({
                    title: '인증번호가 틀렸습니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        })

        $(document).on("click", ".infoSave", function () {
            var name = $(".view_name").val()
            var email = $(".view_email").val()
            var phone = $(".phone").val()
            var now_pass = $(".now_pass").val()
            var new_pass = $(".new_pass").val()
            var new_passConfig = $(".new_passConfig").val()
            let origin_name = first_name;
            let origin_email = first_email;
            let origin_phone = first_phone;
            if (!patterns.phone.test(phone)) {
                Swal.fire({
                    title: '휴대전화 번호를 다시 입력해 주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                })
            }
            else userinfo.infoModi(name, email, origin_phone, phone, now_pass, new_pass, new_passConfig, origin_name, origin_email, email_config);
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

        var { getFirstInfo, first_name, first_email, first_phone } = userinfo.getFirtstInfo();
        $(".userinfoFirst").html(getFirstInfo);

        var getSecondInfo = userinfo.getSecondInfo()
        $(".userinfoSecond").html(getSecondInfo);

        var getloginAlias = userinfo.getloginAlias()
        $(".login_alias").html(getloginAlias);
    },

    key: function () {
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });
        var keyContent = requestTable.getAllKeyList()
        $(".listContent").html(keyContent);

        $(document).on("click", ".key_add", function () {
            $("#keyAdd").addClass('active')
            $("#keyAdd").find('[autofocus]').focus();
        });

        $(document).on("mouseover", ".memo_text", function () {
            let num = $(this).data("id")
            $(".memoModal").removeClass("active")
            $(`.memoModal.num${num}`).addClass("active")
        });

        $(document).on("mouseleave", ".memo_text", function () {
            $(".memoModal").removeClass("active")
        });

        $(document).on("click", ".memo_modi", function () {
            var key_idx = $(this).data("id")
            var keymemo_modi = requestTable.getKeyMemo(key_idx)
            $(".keymemo_modi").val(keymemo_modi)
            $("#memoModi").addClass('active')

            // $(document).on("click", ".memosave", function () {
            //     var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
            //     var key_memo = $(".keymemo_modi").val()
            //     if (regExp.test(key_memo)) {
            //         Swal.fire({
            //             title: 'Key 메모는 특수 문자 사용이 불가능해요.',
            //             showConfirmButton: false,
            //             showDenyButton: true,
            //             denyButtonText: "확 인",
            //             icon: "error"
            //         })
            //     }
            //     else {
            //         requestTable.updateKeyMemo(key_idx, key_memo)
            //     }
            // });

            $(document).on("click", ".memosave", function () {
                var key_memo = escapeHTML($(".keymemo_modi").val())
                requestTable.updateKeyMemo(key_idx, key_memo)
            });
        });

        $(document).on("click", ".change_btn", function () {
            let key_idx = $(this).data("id");
            let keyName = $(`.keyname${key_idx}`).text()
            Swal.fire({
                title: `${keyName} 암호 키를 변경하시겠습니까?`,
                html: `${keyName} 암호 키를 사용하여 비식별화한 기록들을 다른 암호 키로 복호화 할 수 있도록 변경합니다.
                 변경 후 ${keyName} 암호 키로는 복호화가 불가능합니다.`,
                showCancelButton: true,
                confirmButtonText: '네',
                cancelButtonText: '취소'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { changed, count } = await key.changeKeyAll(socket, key_idx);
                    console.log(changed)
                    console.log(count);
                    if (changed) {
                        Swal.fire({
                            title: '암호 키 변경 완료',
                            icon: 'success',
                            html: `${count}개의 기록에 대해 <br>암호 키 변경이 완료되었습니다.`,
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) location.reload();
                        })
                    }
                }
            })
        })

        $(document).on("click", ".delete_btn", function () {
            let key_idx = $(this).data("id");
            let keyName = $(`.keyname${key_idx}`).text()
            Swal.fire({
                title: `${keyName} 암호 키를\n 삭제하시겠습니까?`,
                html: `<p>${keyName} 암호 키를 삭제하면 ${keyName} 암호 키를 사용하여 비식별화한 데이터들을 복원할 수 없습니다.</p>
                        <input class='deleteKeyInput' placeholder='삭제할 암호 키 이름을 입력해주세요.'>`,
                showCancelButton: true,
                confirmButtonText: '네',
                cancelButtonText: '취소'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (keyName == $(".deleteKeyInput").val()) {
                        const removed = key.removeKeyRef(key_idx);
                        const deleted = key.deleteKey(key_idx);
                        if (removed && deleted) {
                            Swal.fire({
                                title: '암호 키 삭제 완료',
                                icon: 'success',
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.isConfirmed) location.reload();
                            })
                        }
                        else {
                            Swal.fire({
                                title: '암호 키 삭제 실패',
                                html: '다시 시도해 주세요',
                                icon: 'error',
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                showDenyButton: true,
                            })
                        }
                    }
                    else if ($(".deleteKeyInput").val() == "") {
                        Swal.fire({
                            title: '암호 키 삭제 실패',
                            html: '삭제할 암호 키 이름을 \n입력해주세요.',
                            icon: 'error',
                            denyButtonText: "확 인",
                            showConfirmButton: false,
                            showDenyButton: true,
                        })
                    }
                    else if (keyName != $(".deleteKeyInput").val()) {
                        Swal.fire({
                            title: '암호 키 삭제 실패',
                            html: '삭제할 암호 키 이름이 \n일치하지 않습니다.',
                            icon: 'error',
                            denyButtonText: "확 인",
                            showConfirmButton: false,
                            showDenyButton: true,
                        })
                    }
                }
            })
        })

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
                    title: '암호 키 이름을 입력해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                var genKeyName = $("#genKeyName").val();
                var keyMemo = $("#keyMemo").val();
                var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
                var check_num = /[0-9]/;    // 숫자 
                // var check_big = /[A-Z]/;    // 대문자
                var check_small = /[a-z]/;    // 소문자
                if (genKeyName.length < 8 || genKeyName.length > 20) {
                    Swal.fire({
                        title: '암호 키 이름은 8~20자 이내로 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                // else if (regExp.test(keyMemo)) {
                //     Swal.fire({
                //         title: 'Key 메모는 특수 문자 사용이 불가능해요.',
                //         showConfirmButton: false,
                //         showDenyButton: true,
                //         denyButtonText: "확 인",
                //         icon: "error"
                //     })
                // }
                else if (check_num.test(genKeyName) != true || check_small.test(genKeyName) != true) {
                    Swal.fire({
                        title: '암호 키 이름은 영문 소문자, 숫자를 혼합하여 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else {
                    comm.generateKey(genKeyName, keyMemo);
                }
            }
        });
    },

    submanage: function () {
        var auth = comm.adminonly();
        if (auth !== 'master') location.href = '/main'
        $(document).on("click", ".sub_add", function () {
            location.href = "/submanage/add"
        });

        $(document).on("click", ".subkey_modi", function () {
            var accessInput = subaccount.getAccessKey();
            $(".keyArea").html(accessInput);
            $("#subKeyModi").addClass('active')
        });

        $(document).on("click", ".keyConfig", function () {
            var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
            var accessKey = escapeHTML($(".accessKey").val());
            subaccount.putAccessKey(accessKey)
            // if (regExp.test(accessKey)) {
            //     Swal.fire({
            //         title: '접속 키는 특수 문자 사용이 불가능해요.',
            //         showConfirmButton: false,
            //         showDenyButton: true,
            //         denyButtonText: "확 인",
            //         icon: "error"
            //     })
            // }
            // else {
            //     subaccount.putAccessKey(accessKey)
            // }
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

        $(document).on("click", ".lockBtn", function () {
            let idx = $(this).data("id");
            subaccount.unlock(idx);
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
                        Swal.fire({
                            title: '서브계정 생성이 \n완료되었습니다.',
                            showConfirmButton: true,
                            showDenyButton: false,
                            confirmButtonText: "확 인",
                            icon: "success"
                        }).then((result) => {
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
                    Swal.fire({
                        title: '이메일로 인증번호가 \n전송되었습니다.',
                        showConfirmButton: true,
                        showDenyButton: false,
                        confirmButtonText: "확 인",
                        icon: "success"
                    }).then(() => {
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
                    Swal.fire({
                        title: '이메일로 인증번호가 \n전송되었습니다.',
                        showConfirmButton: true,
                        showDenyButton: false,
                        confirmButtonText: "확 인",
                        icon: "success"
                    }).then(() => {
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
                    Swal.fire({
                        title: '인증이 완료되었습니다.',
                        showConfirmButton: true,
                        showDenyButton: false,
                        confirmButtonText: "확 인",
                        icon: "success"
                    }).then(() => {
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
                var phone = $("#phone").val();
                var check_num = /[0-9]/;    // 숫자 
                var check_big = /[A-Z]/;    // 대문자
                var check_small = /[a-z]/;    // 소문자
                var check_symbol = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g; // 특수기호
                if (password.length < 8) {
                    Swal.fire({
                        title: '비밀번호는 8자 이상 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (check_num.test(password) != true || check_big.test(password) != true || check_small.test(password) != true || check_symbol.test(password) != true) {
                    Swal.fire({
                        title: '비밀번호는 대문자, 소문자, 숫자, 특수기호를 혼합하여 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
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
                else if (!patterns.phone.test(phone)) {
                    Swal.fire({
                        title: '휴대전화 번호를 다시 입력해 주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else signup.tenantSignUp(accountName, password, companyName, ownerName, phone);
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

        let account_name = null;
        $(document).on("click", "#email_send", function () {
            let user_name = $("#user_name").val();
            let telephone = $("#telephone").val();
            login.resetPassword(account_name, user_name, telephone);
        })

        $(document).on("click", "#check_btn", function () {
            account_name = $("#account_name").val();
            if (account_name) {
                var exist = signup.checkDuplicate(account_name);
                if (exist) {
                    let html = login.forgetPassHtml();
                    $('#findBody').html(html);
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
                    login.resetPassword(token, password);
                }
            }
        })
    },

    detail: function () {
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });

        // socket.on('delMsgToClient', function (msg) {
        //     console.log(msg)
        //     if (uploadID == msg.id) {
        //         Swal.fire({
        //             title: msg.title,
        //             html: msg.html,
        //             confirmButtonText: '확인',
        //             allowOutsideClick: false,
        //         }).then((result) => {
        //             if (result.isConfirmed) location.reload();
        //         })
        //     }
        // });

        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var eventIndex = urlParams.get('id');
        var mode = urlParams.get('mode');
        var restoration = urlParams.get('restoration');
        var selectModalImg = 0;

        let uploadID = 0;

        var selectedFile = []
        // [encDirectory, fileList] = resultLoader.getEncFileInfo(eventIndex);
        var encFileInfo = resultLoader.getEncFileInfo(eventIndex); //비식별화 결과물 저장 경로와 파일 목록을 불러옴
        if (encFileInfo != '') {
            var encDirectory = encFileInfo.encDirectory;
            var fileList = encFileInfo.fileList;
        }
        var infoHtml = resultLoader.getInfoHtml(eventIndex); // 우측 상세 정보 불러오기
        $('.infoArea')[0].innerHTML = infoHtml;

        $(document).on("click", ".recoBtn", function () {
            location.href = `/decrypt/inspection?type=${type}&mode=${mode}`;
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

        $(document).on("click", ".keyChange", function () {
            let key_idx = $(this).data("id");

            Swal.fire({
                title: '해당 암호 키를 변경하시겠습니까?',
                html: `해당 암호 키를 사용하여 비식별화한 기록을 다른 암호 키로 복호화 할 수 있도록 변경합니다.
                 변경 후 기존 암호 키로는 복호화가 불가능합니다.`,
                showCancelButton: true,
                confirmButtonText: '네',
                cancelButtonText: '취소'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { changed, count } = await key.changeKeyElement(socket, key_idx, eventIndex);
                    if (changed) {
                        Swal.fire({
                            title: '암호 키 변경 완료',
                            icon: 'success',
                            html: `${count}개의 기록에 대해 <br>암호 키 변경이 완료되었습니다.`,
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) location.reload();
                        })
                    }
                }
            })
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
            $('.pemUpload').removeClass('active')
            $('.uploadBtn').removeClass("active");
            $('.modal').removeClass('active')
        });

        // 여기서는 업로드된 복호화 키 정보를 읽어오는 부분
        $("#file").on('change', function () {
            var file = document.getElementById('file').files[0];
            var fileName = file.name;
            $('.pemUpload').val(fileName);
            $('.pemUpload').addClass("active");
            $('.uploadBtn').addClass("active");
        });

        // 여기서는 업로드된 복호화 키 정보를 읽어오는 부분
        $("#addfile").on('change', function () {
            var file = document.getElementById('addfile').files[0];
            var fileName = file.name;
            $('.pemUpload').val(fileName);
            $('.pemUpload').addClass("active");
            $('.uploadBtn').addClass("active");
        });

        // 여기서는 업로드된 복호화 키 정보를 읽어오는 부분
        $("#select_file").on('change', function () {
            var file = document.getElementById('select_file').files[0];
            var fileName = file.name;
            $('.pemUpload').val(fileName);
            $('.pemUpload').addClass("active");
            $('.uploadBtn').addClass("active");
        });

        //이게 복호화 요청 확인 누르면
        $(document).on("click", ".recoConfirm", async function () {
            let key_name = $('.file_key')[0].children[1].innerHTML
            if (mode == 'single') {
                uploadID = makeid(6);
                let uploadResult = fileModule.uploadKey();

                uploadResult.then((data) => {
                    let file_name = data[0]
                    let keyPath = data[1]
                    socket.emit('delUploadedFile', {
                        filePath: keyPath,
                        id: uploadID,
                        immediate: 'false'
                    })

                    if (file_name) {
                        console.log('file_name : ' + JSON.stringify(file_name));
                        let verify_result = fileModule.verifyKey(file_name, key_name);
                        let restorationReq = fileModule.restorationRequest(verify_result, eventIndex, fileList);
                        fileModule.sendThumbnailMessage(restorationReq, type, mode, eventIndex);
                    }
                    else {
                        console.log('file_name : ' + file_name);
                        Swal.fire({
                            title: '암호 키 파일 업로드 실패',
                            text: '암호 키 파일을 다시 업로드해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                })
            }
            else if (mode == 'group') {
                var selected = $(this).data('value');
                uploadID = makeid(6);
                let uploadResult = fileModule.uploadKey();

                uploadResult.then((data) => {
                    let file_name = data[0]
                    let keyPath = data[1]
                    socket.emit('delUploadedFile', {
                        filePath: keyPath,
                        id: uploadID,
                        immediate: 'false'
                    })

                    if (file_name) {
                        if (selected == 'all') {
                            let verify_result = fileModule.verifyKey(file_name, key_name);
                            let restorationReq = fileModule.restorationRequest(verify_result, eventIndex, fileList);
                            fileModule.sendThumbnailMessage(restorationReq, type, mode, eventIndex);
                        }
                        else if (selected == 'select') {
                            if (selectedFile.length == 0) Swal.fire({
                                title: '선택된 파일이 없습니다',
                                text: '복호화할 파일을 선택해 주세요.',
                                showConfirmButton: false,
                                showDenyButton: true,
                                denyButtonText: "확 인",
                                icon: "error"
                            });
                            else {
                                let verify_result = fileModule.verifyKey(file_name, key_name);
                                let restorationReq = fileModule.restorationRequest(verify_result, eventIndex, selectedFile);
                                fileModule.sendThumbnailMessage(restorationReq, type, mode, eventIndex);
                            }
                        }
                    }
                    else {
                        Swal.fire({
                            title: '암호 키 파일 업로드 실패',
                            text: '암호 키 파일을 다시 업로드해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                })
            }
        });

        if (encFileInfo != '') {
            if (type == 'image') {
                var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);
                var html = resultLoader.getImageDetailHtml(signedUrl, mode, fileList);

                if (mode == 'single') {
                    $('.lockData')[0].innerHTML = html;
                    $('#signedUrl').attr('href', signedUrl[0][0]);
                    var fileSize = signedUrl[0][1];
                    var fileName = fileList[0];

                    $(document).on("click", "#signedUrl", function () {
                        let additionalID = comm.getAdditionalID(eventIndex, fileName);
                        comm.meterDownload(eventIndex, type, fileName, fileSize, additionalID[0]); // complete
                        let requestType = 'download';
                        comm.increaseRequestCount(eventIndex, [fileName], requestType);
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
                        let additionalID = comm.getAdditionalID(eventIndex, fileList[selectModalImg]);
                        additionalID = additionalID.join('');
                        var selectSize = signedUrl[selectModalImg][1];
                        // comm.meterDownload(eventIndex, type, fileList[selectModalImg], selectSize, additionalID);
                        comm.meterDownload(eventIndex, type, additionalID);
                        let requestType = 'download';
                        comm.increaseRequestCount(eventIndex, [fileList[selectModalImg]], requestType);
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

                    $(document).on("mouseover", ".hoverdiv", function () {
                        var num = $(this).data('num')
                        $("." + num + "").removeClass("hide")
                    });

                    $(document).on("mouseleave", ".albumImg", function () {
                        var num = $(this).data('num')
                        $("." + num + "").addClass("hide")
                    });

                    $(document).on("mouseleave", ".hoverdiv", function () {
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
                                socket.emit('deleteFile', {
                                    bucketName: encDirectory[0],
                                    subDirectory: encDirectory[1],
                                    fileName: ['Download.zip']
                                })

                                setTimeout(function () {
                                    new Promise((resolve, reject) => {
                                        //파일 다운로드 경로 획득
                                        let signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], ['Download.zip']);
                                        let fileUrl = signedUrl[0][0];
                                        location.href = fileUrl;
                                        let additionalIDs = comm.getAdditionalID(eventIndex, '');
                                        comm.meterDownload(eventIndex, type, additionalIDs);
                                        let requestType = 'download';
                                        comm.increaseRequestCount(eventIndex, fileList, requestType);
                                        resolve();
                                    }).then(() => {
                                        Swal.fire({
                                            title: '파일 다운로드가 \n시작되었습니다.',
                                            showConfirmButton: true,
                                            showDenyButton: false,
                                            confirmButtonText: "확 인",
                                            icon: "success"
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
                let fileUrl, fileSize;
                if (signedUrl[0][0].indexOf('thumbnail') >= 0) {
                    fileUrl = signedUrl[1][0];
                    fileSize = signedUrl[1][1];
                }
                else {
                    fileUrl = signedUrl[0][0];
                    fileSize = signedUrl[0][1];
                }

                var html = resultLoader.getVideoDetailHtml(signedUrl, fileList);
                $('#signedUrl').attr('href', fileUrl);
                $('.fullname').text($('.file_fullname').text())

                var fileName = fileList[0];

                $(document).on("click", "#signedUrl", function () {
                    comm.meterDownload(eventIndex, type, fileName, fileSize);
                    let requestType = 'download';
                    comm.increaseRequestCount(eventIndex, fileList, requestType);
                })
            }
        }
        else {
            $(".infoContent").addClass("error")
            $(".viewContent").addClass("hide")
        }


        $(document).on("click", ".checkBtn", function () {
            uploadID = makeid(6);
            console.log('restoration : ', restoration);
            if (restoration === '1') {
                $('#addfile').val('');
                $('.pemUpload').val('');
                $('.addConfirm').attr('data-value', $(this).data('value'));
                $("#addData").addClass('active')

                $(document).on("click", ".addConfirm", function () {
                    let key_name = $('.file_key')[0].children[1].innerHTML
                    let uploadResult = fileModule.uploadKey('addfile');

                    uploadResult.then(async (data) => {
                        let file_name = data[0]
                        let keyPath = data[1]
                        socket.emit('delUploadedFile', {
                            filePath: keyPath,
                            id: uploadID,
                            immediate: 'false'
                        })

                        if (file_name) {
                            console.log('file_name : ' + JSON.stringify(file_name));
                            let verify_result = fileModule.verifyKey(file_name, key_name);
                            const { valid, msg, keyPath } = verify_result;
                            if (!valid) {
                                Swal.fire({
                                    title: '암호 키 불일치',
                                    text: msg,
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                    showDenyButton: true,
                                    denyButtonText: "확 인",
                                    icon: "error"
                                });
                            }
                            else {
                                let result = await fileModule.makePasswordbin(eventIndex, keyPath);
                                if (result) {
                                    if (type == 'image') {
                                        if (mode == 'single') {
                                            location.href = `/encrypt/image/check?type=${type}&token=${uploadID}&id=${eventIndex}&mode=${mode}&restoration=${restoration}&imgNum=0`;
                                        }
                                        else if (mode == 'group') {
                                            selectedFile = [];
                                            var imgDivList = document.getElementsByClassName('check_reco');
                                            var len = imgDivList.length;
                                            for (var i = 0; i < len; i++) {
                                                if (imgDivList[i].checked == true) selectedFile.push(fileList[i])
                                            }
                                            let fileIDs = await fileModule.getSelectedFileID(selectedFile, eventIndex);
                                            fileIDs = fileIDs.join(',');
                                            location.href = `/encrypt/album/check?type=${type}&token=${uploadID}&id=${eventIndex}&mode=${mode}&restoration=${restoration}&imgNum=0&fileIDs=${fileIDs}`;
                                        }
                                    }
                                    else if (type == 'video') {
                                        location.href = `/encrypt/video/select?type=${type}&token=${uploadID}&id=${eventIndex}&mode=${mode}&restoration=${restoration}`;
                                    }
                                }
                                else {
                                    Swal.fire({
                                        title: '작업 실패',
                                        text: '다시 시도해 주세요',
                                        showCancelButton: false,
                                        showConfirmButton: false,
                                        showDenyButton: true,
                                        denyButtonText: "확 인",
                                        icon: "error"
                                    });
                                }
                            }
                        }
                        else {
                            console.log('file_name : ' + file_name);
                            Swal.fire({
                                title: '암호 키 파일 업로드 실패',
                                text: '암호 키 파일을 다시 업로드해주세요.',
                                showConfirmButton: false,
                                showDenyButton: true,
                                denyButtonText: "확 인",
                                icon: "error"
                            });
                        }
                    })
                })
            }
            else {
                if (type == 'image') {
                    if (mode == 'single') {
                        location.href = `/encrypt/image/check?type=${type}&token=${uploadID}&id=${eventIndex}&mode=${mode}&restoration=${restoration}&imgNum=0`;
                    }
                    else if (mode == 'group') {
                        selectedFile = [];
                        var imgDivList = document.getElementsByClassName('check_reco');
                        var len = imgDivList.length;
                        for (var i = 0; i < len; i++) {
                            if (imgDivList[i].checked == true) selectedFile.push(fileList[i])
                        }
                        fileModule.getSelectedFileID(selectedFile, eventIndex).then((fileIDs) => {
                            fileIDs = fileIDs.join(',');
                            location.href = `/encrypt/album/check?type=${type}&token=${uploadID}&id=${eventIndex}&mode=${mode}&restoration=${restoration}&imgNum=0&fileIDs=${fileIDs}`;
                        });
                    }
                }
                else if (type == 'video') {
                    location.href = `/encrypt/video/select?type=${type}&token=${uploadID}&id=${eventIndex}&mode=${mode}&restoration=${restoration}`;
                }
            }
        })
    },

    select: async function () {
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });

        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var requestId = urlParams.get('id');
        var mode = urlParams.get('mode');
        var restoration = urlParams.get('restoration');
        var encFileInfo = resultLoader.getEncFileInfo(requestId); //비식별화 결과물 저장 경로와 파일 목록을 불러옴
        let encVideoData = resultLoader.getVideoData(requestId);
        var encDirectory = encFileInfo.encDirectory;
        var fileList = encFileInfo.fileList;
        console.log(fileList)

        var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);

        let thumbnailVideo = document.getElementById('video')
        if (signedUrl[0][0].indexOf("thumbnail.mp4") != -1) {
            thumbnailVideo.src = signedUrl[1][0]
        }
        else {
            thumbnailVideo.src = signedUrl[0][0]
        }

        thumbnailVideo.onloadeddata = function async() {
            var script = document.createElement('script');
            script.src = '../../static/js/check/select.js';
            script.onload = function () {
                // 스크립트 로드 후에 실행되는 부분
                // 스크립트 로드 후에 할 작업들을 여기에 추가하세요.
            };
            // 이제 스크립트는 영상 로딩 후에 추가됩니다.
            document.head.appendChild(script);

            //select.js가 헤더에 포함되기를 기다림.
            let intervalId = setInterval(async () => {
                let headScripts = document.head.getElementsByTagName('script');
                for (let i = 0; i < headScripts.length; i++) {
                    if (headScripts[i].attributes.src.value === '../../static/js/check/select.js') {

                        frameRate(encVideoData["fps"])
                        const frameSlider = document.getElementById('frame-slider');
                        const frameIndicator = document.getElementById('frame-indicator');
                        // const totalFrames = Math.round(thumbnailVideo.duration * encVideoData["fps"]);
                        const totalFrames = encVideoData["frame_count"];
                        frameSlider.max = totalFrames;
                        frameIndicator.textContent = `1 / ${totalFrames}`;

                        clearInterval(intervalId);
                        break;
                    }
                }
            }, 50)
        };
    },

    check: async function () {
        let socketURI = apiUrlConverter('socket', '');
        const socket = io(socketURI, {
            withCredentials: true,
            transports: ['websocket']
        });

        var queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        var type = urlParams.get('type');
        var token = urlParams.get('token');
        var requestId = urlParams.get('id');
        var mode = urlParams.get('mode');
        var restoration = urlParams.get('restoration');
        var imgNum = urlParams.get('imgNum');
        var encFileInfo = resultLoader.getEncFileInfo(requestId); //비식별화 결과물 저장 경로와 파일 목록을 불러옴
        var encDirectory = encFileInfo.encDirectory;
        var fileList = encFileInfo.fileList;

        let totalCoordinates = {};
        var detail;
        let beforeCoordinates

        if (type == 'image') {
            if (mode == 'single') {
                let signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);
                let coordinates = await fileModule.readCoordinatesToJson(token, mode, requestId);
                console.log(coordinates)

                let thumbnailImg = document.getElementById('canvasBackImg')
                thumbnailImg.src = signedUrl[imgNum][0]
                thumbnailImg.onload = function () {
                    const canvas = document.getElementById('canvas');
                    var height = document.getElementById('canvasBackImg').clientHeight;
                    canvas.height = Number(height)
                    var script = document.createElement('script');
                    script.src = '../../static/js/check/image.js';
                    document.head.appendChild(script);
                    document.getElementById("layer").style.height = `${Number(height - 39)}px`
                }

                //check.js가 헤더에 포함되기를 기다림.
                let intervalId = setInterval(async () => {
                    let headScripts = document.head.getElementsByTagName('script');
                    for (let i = 0; i < headScripts.length; i++) {
                        if (headScripts[i].attributes.src.value === '../../static/js/check/image.js') {

                            //헤더에 포함 완료되었다면 기존 좌표를 읽어옴
                            if (coordinates) {
                                let coordTritonToWeb = await comm.parseCoordTritonToWeb(coordinates[fileList[0]]);
                                let canvasCoord = coordTritonToWeb.canvasCoord;
                                let originCoord = coordTritonToWeb.originCoord;
                                let classArray = coordTritonToWeb.classArray;
                                if (canvasCoord.length > 0) setTimeout(() => loadData(canvasCoord, originCoord, classArray), 50)
                            }
                            clearInterval(intervalId);
                            break;
                        }
                    }
                }, 50)

            }
            else if (mode == 'group') {
                let selectedFileIDs = urlParams.get('fileIDs');
                let fileNames = await fileModule.getFileNameFromID(selectedFileIDs);
                let signedUrl = await resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileNames);
                console.log('signedUrl : ', signedUrl);
                let coordinates = await fileModule.readCoordinatesToJson(token, mode, requestId);
                if (coordinates) totalCoordinates = coordinates;
                let imgList = ``;
                for (let i = 0; i < signedUrl.length; i++) {
                    imgList += `<div class='listImgDiv'>
                                    <div class='saveIcon'>
                                        <img src='../../static/imgs/check/saveIcon.png'>
                                    </div>
                                    <div class='thumbnailImg img${i}' style='background:url(${signedUrl[i][0]}); background-size: cover; background-position: 50% 50%;' data-imgNum=${i}></div>
                                    <p>${fileNames[i]}</p>
                                </div>`
                }
                $(".checkImgList").html(imgList)
                let imgNumDiv = `<input class='selectInputNum' value=${Number(imgNum) + 1}><p>/ ${signedUrl.length}</p>`
                $(".selectImgNum").html(imgNumDiv)

                $(`.thumbnailImg`).removeClass("active")
                $(`.img${imgNum}`).addClass("active")

                if (coordinates != false) {
                    // 모든 listImgDiv 클래스를 가진 요소들을 가져옵니다.
                    const listImgDivElements = document.querySelectorAll(".listImgDiv");

                    // 각 요소에 대해 작업을 수행합니다.
                    listImgDivElements.forEach((element) => {
                        // p 태그의 텍스트를 가져옵니다.
                        const pText = element.querySelector("p").innerText;

                        // coordinates 객체에서 pText에 해당하는 값들을 찾아냅니다.
                        const matchingKeys = Object.keys(coordinates).filter((key) => key === pText);

                        // 일치하는 값이 존재하는 경우
                        if (matchingKeys.length > 0) {
                            // 해당 listImgDiv 요소의 saveIcon 클래스에 active 클래스를 추가합니다.
                            element.querySelector(".saveIcon").classList.add("active");
                        }
                    });
                }

                $(document).on("change", ".selectInputNum", function () {
                    let num = Number($(".selectInputNum").val())
                    if (num <= signedUrl.length) {
                        location.href = `/encrypt/album/check?type=${type}&token=${token}&id=${requestId}&mode=${mode}&restoration=${restoration}&imgNum=${num - 1}`
                    }
                });

                let scrollableDiv = document.getElementById('imgDiv');

                scrollableDiv.addEventListener('wheel', (event) => {
                    event.preventDefault();
                    let scrollDirection = 0;
                    let scrollSpeed = 40;
                    if (event.deltaY < 0) {
                        // 휠업 이벤트 처리
                        scrollDirection = -1;
                    }
                    else if (event.deltaY > 0) {
                        // 휠다운 이벤트 처리
                        scrollDirection = 1;
                    }

                    scrollableDiv.scrollLeft += scrollDirection * scrollSpeed;
                });

                const container = document.getElementById("imgDiv");
                const activeElement = container.querySelector(".thumbnailImg.active").parentElement;
                if (activeElement) {
                    const containerWidth = container.offsetWidth;
                    const containerScrollLeft = container.scrollLeft;
                    const activeElementWidth = activeElement.offsetWidth;
                    const activeElementLeft = activeElement.offsetLeft - ((screen.width - 988) / 2);
                    const activeElementRight = activeElementLeft + activeElementWidth;
                    const centerPosition = containerScrollLeft + containerWidth / 2;

                    // activeElement가 container 영역의 절반을 넘어간 경우에만 스크롤 이동
                    if (activeElementLeft < centerPosition + (screen.width - 988) / 2 || activeElementRight > containerScrollLeft + containerWidth) {
                        const scrollOffset = activeElementLeft - containerWidth / 2 + activeElementWidth / 2;

                        // 스크롤 이동
                        container.scrollTo({
                            left: scrollOffset,
                            // behavior: "smooth" // 부드러운 스크롤
                        });
                    }
                }

                const imgDiv = document.getElementById('imgDiv');
                const thumbnailImgs = document.querySelectorAll('.thumbnailImg');

                // 이미지가 모두 로드될 때까지 대기
                let loadedImages = 0;
                thumbnailImgs.forEach((img) => {
                    img.addEventListener('load', () => {
                        loadedImages++;
                        if (loadedImages === thumbnailImgs.length) {
                            // 모든 이미지가 로드되었을 때 실행될 코드
                            // 활성화된 이미지 찾기
                            let activeImgIndex = -1;
                            thumbnailImgs.forEach((img, index) => {
                                if (img.classList.contains('active')) {
                                    activeImgIndex = index;
                                }
                            });

                            // 활성화된 이미지가 가운데로 오도록 스크롤 위치 조정
                            if (activeImgIndex !== -1) {
                                const activeImg = thumbnailImgs[activeImgIndex];
                                const imgOffsetLeft = activeImg.offsetLeft;
                                const imgWidth = activeImg.offsetWidth;
                                const containerWidth = imgDiv.offsetWidth;

                                let scrollOffset;
                                if (activeImgIndex === 0) {
                                    // 첫 번째 이미지(child 0)는 좌측 마진 고려
                                    scrollOffset = imgOffsetLeft - (containerWidth - imgWidth - 2 * 24) / 2;
                                } else {
                                    // 그 외의 이미지는 오른쪽 마진만 고려
                                    scrollOffset = imgOffsetLeft - (containerWidth - imgWidth - 24) / 2;
                                }
                                console.log(scrollOffset)
                                imgDiv.scrollLeft = scrollOffset;
                            }
                        }
                    });
                });

                let thumbnailImg = document.getElementById('canvasBackImg')
                thumbnailImg.src = signedUrl[imgNum][0]
                thumbnailImg.onload = function () {
                    const canvas = document.getElementById('canvas');
                    var height = document.getElementById('canvasBackImg').clientHeight;
                    canvas.height = Number(height)
                    var script = document.createElement('script');
                    script.src = '../../static/js/check/image.js';
                    document.head.appendChild(script);
                    document.getElementById("layer").style.height = `${Number(height - 69)}px`
                }

                //check.js가 헤더에 포함되기를 기다림.
                let intervalId = setInterval(async () => {
                    let headScripts = document.head.getElementsByTagName('script');
                    for (let i = 0; i < headScripts.length; i++) {
                        if (headScripts[i].attributes.src.value === '../../static/js/check/image.js') {

                            //헤더에 포함 완료되었다면 기존 좌표를 읽어옴
                            if (coordinates) {
                                let coordTritonToWeb = await comm.parseCoordTritonToWeb(coordinates[fileNames[imgNum]]);
                                let canvasCoord = coordTritonToWeb.canvasCoord;
                                let originCoord = coordTritonToWeb.originCoord;
                                let classArray = coordTritonToWeb.classArray;
                                if (canvasCoord.length > 0) setTimeout(() => loadData(canvasCoord, originCoord, classArray), 50)
                            }
                            clearInterval(intervalId);
                            break;
                        }
                    }
                }, 50)
            }
        }
        else if (type == 'video') {
            var sectorNum = urlParams.get('sectorNum');
            var sectorId = urlParams.get('sectorID');
            var sectorInfo = await fileModule.readSectorToJson(token, requestId)
            beforeCoordinates = await fileModule.readVideoJson(type, token, requestId, sectorNum);
            if (beforeCoordinates) totalCoordinates = beforeCoordinates
            console.log(sectorInfo)
            let sectorList = ``
            for (let i = 0; i < Object.keys(sectorInfo).length; i++) {
                let iconActive = ''
                if (sectorInfo[Object.keys(sectorInfo)[i]]["complete"] == 1) {
                    iconActive = "active"
                }
                sectorList += `<div class='listSectorDiv'>
                                    <div class='saveIcon ${iconActive}'>
                                        <img src='../../static/imgs/check/saveIcon.png'>
                                    </div>
                                    <div class='sectorBox sector${(i + 1)} ${sectorInfo[Object.keys(sectorInfo)[i]]["type"]}' data-type=${sectorInfo[Object.keys(sectorInfo)[i]]["type"]} 
                                    data-start=${sectorInfo[Object.keys(sectorInfo)[i]]["start"]} data-end=${sectorInfo[Object.keys(sectorInfo)[i]]["end"]} data-sectornum=${(i + 1)}>
                                        <div class='textArea'>
                                            <h2>Sector${Object.keys(sectorInfo)[i]}</h2>
                                            <p>${sectorInfo[Object.keys(sectorInfo)[i]]["start"]}~${sectorInfo[Object.keys(sectorInfo)[i]]["end"]}</p>
                                        </div>
                                    </div>
                                </div>`
            }
            $(".checkSectorList").html(sectorList)
            let sectorNumDiv = `<p>${sectorNum} / ${Object.keys(sectorInfo).length}</p>`
            $(".selectSectorNum").html(sectorNumDiv)

            $(`.sectorBox`).removeClass("active")
            $(`.sector${sectorNum}`).addClass("active")

            var videoJson
            if (sectorInfo != false) {
                // 모든 listImgDiv 클래스를 가진 요소들을 가져옵니다.
                const listImgDivElements = document.querySelectorAll(".sectorBox");
                await $(".nowSectorInfo").text(`Sector${$(".sectorBox.active").data("sectornum")} ${$(".sectorBox.active").data("start")}~${$(".sectorBox.active").data("end")}`)
                await $(".imgList").addClass(`${$(".sectorBox.active").data("type")}`)
                // 이미지 요소들을 선택합니다. 여기에서는 클래스 이름이 'imgList'인 요소들을 선택하겠습니다.
                var imgElement = document.querySelector('.imgList');
                imgElement.setAttribute('data-sectortype', `${$(".sectorBox.active").data("type")}`);

                let imgLocList = await fileModule.readSectorImg(type, token, requestId, sectorNum)
                console.log(imgLocList)
                let imgListHtml = ``
                videoJson = await fileModule.readVideoJson(type, token, requestId, sectorNum)
                console.log(videoJson)
                if ($(".imgList").hasClass("fix") == true) {
                    for (let i = 0; i < imgLocList.length; i++) {
                        let imgName = imgLocList[i].split("/")
                        imgName = imgName[imgName.length - 1].split(".")[0]
                        let frameOrder
                        if (i == 0) {
                            frameOrder = "시작 프레임"
                        }
                        else {
                            frameOrder = "종료 프레임"
                        }

                        let activeStatus
                        if (imgNum == i) {
                            activeStatus = "active"
                        }
                        else {
                            activeStatus = ""
                        }

                        imgListHtml += `<div class='frameBox ${activeStatus}' data-imgnum=${i} data-framenum=${imgName}>
                                            <div class='sectorFrame active' style="background-image: url(../../${imgLocList[i]}); background-size:cover;"></div>
                                            <p>${frameOrder} ${imgName}</p>
                                        </div>`
                    }
                    $(".imgList").html(imgListHtml)
                    $(".selectImgNum").text(`${(Number(imgNum) + 1)} / ${imgLocList.length}`)

                    let selectSectorType = $(".imgList").data("sectortype")

                    let thumbnailImg = document.getElementById('canvasBackImg')
                    thumbnailImg.src = "../../" + imgLocList[imgNum]
                    thumbnailImg.onload = function () {
                        const canvas = document.getElementById('canvas');
                        var height = document.getElementById('canvasBackImg').clientHeight;
                        canvas.height = Number(height)
                        var script = document.createElement('script');
                        script.src = '../../static/js/check/video.js';
                        document.head.appendChild(script);
                        document.getElementById("layer").style.height = `${Number(height - 38)}px`
                    }

                    //video.js가 헤더에 포함되기를 기다림.
                    let intervalId = setInterval(async () => {
                        let headScripts = document.head.getElementsByTagName('script');
                        for (let i = 0; i < headScripts.length; i++) {
                            if (headScripts[i].attributes.src.value === '../../static/js/check/video.js') {

                                //헤더에 포함 완료되었다면 기존 좌표를 읽어옴
                                if (videoJson) {
                                    let coordTritonToWeb = await comm.parseCoordTritonToWebVideo(selectSectorType, restoration, videoJson["frame"]["location"]);
                                    if (coordTritonToWeb != null) {
                                        let canvasCoord = coordTritonToWeb.canvas;
                                        let originCoord = coordTritonToWeb.origin;
                                        let classArray = coordTritonToWeb.class;
                                        if (canvasCoord.length > 0) setTimeout(() => loadData(canvasCoord, originCoord, classArray), 50)
                                    }
                                    else {
                                        setTimeout(() => 50)
                                    }
                                }
                                clearInterval(intervalId);
                                break;
                            }
                        }
                    }, 50)

                    $(document).on("click", ".frameBox", async function () {
                        let num = $(this).data("imgnum")
                        location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${sectorNum}&imgNum=${num}`;
                    })
                }
                else {
                    $(".loadArea").addClass("active")
                    let imgName = imgLocList[Number(imgNum)].split("/")
                    imgName = imgName[imgName.length - 1].split(".")[0]
                    if (imgNum != 0) {
                        let preImgName = imgLocList[Number(imgNum) - 1].split("/")
                        preImgName = preImgName[preImgName.length - 1].split(".")[0]
                        imgListHtml += `<div class='frameBox detail prev' data-imgnum=${Number(imgNum) - 1} data-framenum=${preImgName}>
                                            <div class='sectorFrame' style="background-image: url(../../${imgLocList[Number(imgNum) - 1]}); background-size:cover;"></div>
                                            <p>Sector${sectorNum} ${preImgName}</p>
                                        </div>
                                        <div class='detailPreBtn' data-imgnum=${Number(imgNum) - 1}>
                                            <img src='../../static/imgs/check/detailPreBtn.png'>
                                        </div>`
                    }
                    else {
                        imgListHtml += `<div class='blankArea'></div>`
                    }
                    imgListHtml += `<div class='frameBox detail active' data-imgnum=${Number(imgNum)} data-framenum=${imgName}>
                                        <div class='sectorFrame' style="background-image: url(../../${imgLocList[Number(imgNum)]}); background-size:cover;"></div>
                                        <p>Sector${sectorNum} ${imgName}</p>
                                    </div>`
                    if (imgNum != (imgLocList.length - 1)) {
                        let nextImgName = imgLocList[Number(imgNum) + 1].split("/")
                        nextImgName = nextImgName[nextImgName.length - 1].split(".")[0]
                        imgListHtml += `<div class='detailNextBtn' data-imgnum=${Number(imgNum) + 1}>
                                            <img src='../../static/imgs/check/detailNextBtn.png'>
                                        </div>
                                        <div class='frameBox detail next' data-imgnum=${Number(imgNum) + 1} data-framenum=${nextImgName}>
                                            <div class='sectorFrame' style="background-image: url(../../${imgLocList[Number(imgNum) + 1]}); background-size:cover;"></div>
                                            <p>Sector${sectorNum} ${nextImgName}</p>
                                        </div>`
                    }
                    else {
                        imgListHtml += `<div class='blankArea'></div>`
                    }

                    $(".imgList").html(imgListHtml)
                    $(".selectImgNum").text(`${(Number(imgNum) + 1)} / ${imgLocList.length}`)

                    let selectSectorType = $(".imgList").data("sectortype")

                    let thumbnailImg = document.getElementById('canvasBackImg')
                    thumbnailImg.src = "../../" + imgLocList[imgNum]
                    thumbnailImg.onload = function () {
                        const canvas = document.getElementById('canvas');
                        var height = document.getElementById('canvasBackImg').clientHeight;
                        canvas.height = Number(height)
                        var script = document.createElement('script');
                        script.src = '../../static/js/check/video.js';
                        document.head.appendChild(script);
                        document.getElementById("layer").style.height = `${Number(height - 38)}px`
                    }

                    //video.js가 헤더에 포함되기를 기다림.
                    let intervalId = setInterval(async () => {
                        let headScripts = document.head.getElementsByTagName('script');
                        for (let i = 0; i < headScripts.length; i++) {
                            if (headScripts[i].attributes.src.value === '../../static/js/check/video.js') {

                                //헤더에 포함 완료되었다면 기존 좌표를 읽어옴
                                if (videoJson) {
                                    let coordTritonToWeb
                                    if (imgNum == 0) {
                                        coordTritonToWeb = await comm.parseCoordTritonToWebVideo(selectSectorType, restoration, videoJson["frame"]["location"][$(".frameBox.active").data("framenum")]);
                                    }
                                    else {
                                        coordTritonToWeb = await comm.parseCoordTritonToWebVideo(selectSectorType, restoration, videoJson["frame"]["location"][$(".frameBox.active").data("framenum")]);
                                        if (coordTritonToWeb["canvas"].length == 0) {
                                            coordTritonToWeb = await comm.parseCoordTritonToWebVideo(selectSectorType, restoration, videoJson["frame"]["location"][Number($(".frameBox.active").data("framenum")) - 1]);
                                        }
                                    }

                                    if (restoration == 0) {
                                        if (coordTritonToWeb != null) {
                                            let canvasCoord = coordTritonToWeb.canvas;
                                            let originCoord = coordTritonToWeb.origin;
                                            let classArray = coordTritonToWeb.class;

                                            if (canvasCoord.length > 0) setTimeout(() => loadData(canvasCoord, originCoord, classArray, restoration, $(".imgList").data("sectortype")), 50)
                                        }
                                        else {
                                            setTimeout(() => 50)
                                        }
                                    }
                                    else {
                                        if (coordTritonToWeb != null) {
                                            let canvasCoord = coordTritonToWeb.canvas;
                                            let originCoord = coordTritonToWeb.origin;
                                            let classArray = coordTritonToWeb.class;
                                            let objectArray = coordTritonToWeb.objectID;

                                            loadCount(videoJson["frame"]["location"]["bodyMax"], videoJson["frame"]["location"]["headMax"], videoJson["frame"]["location"]["carMax"])
                                            if (canvasCoord.length > 0) setTimeout(() => loadData(canvasCoord, originCoord, classArray, restoration, $(".imgList").data("sectortype"), objectArray), 50)
                                        }
                                        else {
                                            setTimeout(() => 50)
                                        }
                                    }
                                }
                                clearInterval(intervalId);
                                break;
                            }
                        }
                    }, 50)

                    $(document).on("click", ".frameBox", async function () {
                        let num = $(this).data("imgnum")
                        let sectorType = $(".imgList").data("sectortype")
                        let curCoordinates = saveInput(sectorType, restoration);
                        let frameNumber = $(".frameBox.active").data("framenum");
                        let parsedCoordinates = await comm.parseCoordWebToTritonVideo(sectorType, restoration, curCoordinates, frameNumber);
                        if ($(this).hasClass("next")) {
                            if ($(".frameBox.active").data("imgnum") == 0) {
                                if (parsedCoordinates) {
                                    totalCoordinates["frame"]["location"][frameNumber] = parsedCoordinates;
                                    console.log(totalCoordinates)
                                    if (restoration == 1) {
                                        let classMax = sendCount()
                                        totalCoordinates["frame"]["location"]["bodyMax"] = classMax[0]
                                        totalCoordinates["frame"]["location"]["headMax"] = classMax[1]
                                        totalCoordinates["frame"]["location"]["carMax"] = classMax[2]
                                    }
                                    let isComplete = true;
                                    for (let key in totalCoordinates["frame"]["location"]) {
                                        if (Object.keys(totalCoordinates["frame"]["location"][key]).length == 0) {
                                            totalCoordinates["complete"] = 0;
                                            isComplete = false;
                                            break;
                                        }
                                    }
                                    if (isComplete) {
                                        totalCoordinates["complete"] = 1;
                                    }
                                    let filePath = await fileModule.writeVideoJson(token, requestId, sectorNum, totalCoordinates);
                                    socket.emit('cancelDeleteFile', {
                                        id: token
                                    })
                                    socket.emit('delUploadedFile', {
                                        filePath: filePath,
                                        id: token,
                                        immediate: 'false'
                                    })

                                    location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${sectorNum}&imgNum=${num}`;
                                }
                                else {
                                    Swal.fire({
                                        title: '영역을 그려주세요.',
                                        showConfirmButton: false,
                                        showDenyButton: true,
                                        denyButtonText: "확 인",
                                        icon: "error"
                                    }).then((result) => {
                                    })
                                }
                            }
                            else {
                                if (restoration == 1) {
                                    let classMax = sendCount()
                                    totalCoordinates["frame"]["location"]["bodyMax"] = classMax[0]
                                    totalCoordinates["frame"]["location"]["headMax"] = classMax[1]
                                    totalCoordinates["frame"]["location"]["carMax"] = classMax[2]
                                }
                                if (parsedCoordinates) {
                                    totalCoordinates["frame"]["location"][frameNumber] = parsedCoordinates;
                                    console.log(totalCoordinates)
                                }
                                else {
                                    if (totalCoordinates["frame"]["location"][frameNumber]) totalCoordinates["frame"]["location"][frameNumber] = {}
                                }
                                let isComplete = true;
                                for (let key in totalCoordinates["frame"]["location"]) {
                                    if (Object.keys(totalCoordinates["frame"]["location"][key]).length == 0) {
                                        totalCoordinates["complete"] = 0;
                                        isComplete = false;
                                        break;
                                    }
                                }
                                if (isComplete) {
                                    totalCoordinates["complete"] = 1;
                                }
                                let filePath = await fileModule.writeVideoJson(token, requestId, sectorNum, totalCoordinates);
                                socket.emit('cancelDeleteFile', {
                                    id: token
                                })
                                socket.emit('delUploadedFile', {
                                    filePath: filePath,
                                    id: token,
                                    immediate: 'false'
                                })

                                location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${sectorNum}&imgNum=${num}`;
                            }
                        }
                        else if ($(this).hasClass("prev")) {
                            if (totalCoordinates["frame"]["location"][frameNumber]) totalCoordinates["frame"]["location"][frameNumber] = {}
                            let isComplete = true;
                            for (let key in totalCoordinates["frame"]["location"]) {
                                if (Object.keys(totalCoordinates["frame"]["location"][key]).length == 0) {
                                    totalCoordinates["complete"] = 0;
                                    isComplete = false;
                                    break;
                                }
                            }
                            if (isComplete) {
                                totalCoordinates["complete"] = 1;
                            }
                            let filePath = await fileModule.writeVideoJson(token, requestId, sectorNum, totalCoordinates);
                            socket.emit('cancelDeleteFile', {
                                id: token
                            })
                            socket.emit('delUploadedFile', {
                                filePath: filePath,
                                id: token,
                                immediate: 'false'
                            })

                            location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${sectorNum}&imgNum=${num}`;
                        }
                    })

                    $(document).on("click", ".detailPreBtn", async function () {
                        let num = $(this).data("imgnum")
                        let sectorType = $(".imgList").data("sectortype")
                        let curCoordinates = saveInput(sectorType, restoration);
                        let frameNumber = $(".frameBox.active").data("framenum");
                        let parsedCoordinates = await comm.parseCoordWebToTritonVideo(sectorType, restoration, curCoordinates, frameNumber);
                        if (totalCoordinates["frame"]["location"][frameNumber]) totalCoordinates["frame"]["location"][frameNumber] = {}
                        let isComplete = true;
                        for (let key in totalCoordinates["frame"]["location"]) {
                            if (Object.keys(totalCoordinates["frame"]["location"][key]).length == 0) {
                                totalCoordinates["complete"] = 0;
                                isComplete = false;
                                break;
                            }
                        }
                        if (isComplete) {
                            totalCoordinates["complete"] = 1;
                        }
                        let filePath = await fileModule.writeVideoJson(token, requestId, sectorNum, totalCoordinates);
                        socket.emit('cancelDeleteFile', {
                            id: token
                        })
                        socket.emit('delUploadedFile', {
                            filePath: filePath,
                            id: token,
                            immediate: 'false'
                        })

                        location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${sectorNum}&imgNum=${num}`;
                    })

                    $(document).on("click", ".detailNextBtn", async function () {
                        let num = $(this).data("imgnum")
                        let sectorType = $(".imgList").data("sectortype")
                        let curCoordinates = saveInput(sectorType, restoration);
                        let frameNumber = $(".frameBox.active").data("framenum");
                        let parsedCoordinates = await comm.parseCoordWebToTritonVideo(sectorType, restoration, curCoordinates, frameNumber);
                        if ($(".frameBox.active").data("imgnum") == 0) {
                            if (parsedCoordinates) {
                                totalCoordinates["frame"]["location"][frameNumber] = parsedCoordinates;
                                console.log(totalCoordinates)
                                if (restoration == 1) {
                                    let classMax = sendCount()
                                    totalCoordinates["frame"]["location"]["bodyMax"] = classMax[0]
                                    totalCoordinates["frame"]["location"]["headMax"] = classMax[1]
                                    totalCoordinates["frame"]["location"]["carMax"] = classMax[2]
                                }
                                let isComplete = true;
                                for (let key in totalCoordinates["frame"]["location"]) {
                                    if (Object.keys(totalCoordinates["frame"]["location"][key]).length == 0) {
                                        totalCoordinates["complete"] = 0;
                                        isComplete = false;
                                        break;
                                    }
                                }
                                if (isComplete) {
                                    totalCoordinates["complete"] = 1;
                                }
                                let filePath = await fileModule.writeVideoJson(token, requestId, sectorNum, totalCoordinates);
                                socket.emit('cancelDeleteFile', {
                                    id: token
                                })
                                socket.emit('delUploadedFile', {
                                    filePath: filePath,
                                    id: token,
                                    immediate: 'false'
                                })

                                location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${sectorNum}&imgNum=${num}`;
                            }
                            else {
                                Swal.fire({
                                    title: '영역을 그려주세요.',
                                    showConfirmButton: false,
                                    showDenyButton: true,
                                    denyButtonText: "확 인",
                                    icon: "error"
                                }).then((result) => {
                                })
                            }
                        }
                        else {
                            if (restoration == 1) {
                                let classMax = sendCount()
                                totalCoordinates["frame"]["location"]["bodyMax"] = classMax[0]
                                totalCoordinates["frame"]["location"]["headMax"] = classMax[1]
                                totalCoordinates["frame"]["location"]["carMax"] = classMax[2]
                            }
                            if (parsedCoordinates) {
                                totalCoordinates["frame"]["location"][frameNumber] = parsedCoordinates;
                                console.log(totalCoordinates)
                            }
                            else {
                                if (totalCoordinates["frame"]["location"][frameNumber]) totalCoordinates["frame"]["location"][frameNumber] = {}
                            }
                            let isComplete = true;
                            for (let key in totalCoordinates["frame"]["location"]) {
                                if (Object.keys(totalCoordinates["frame"]["location"][key]).length == 0) {
                                    totalCoordinates["complete"] = 0;
                                    isComplete = false;
                                    break;
                                }
                            }
                            if (isComplete) {
                                totalCoordinates["complete"] = 1;
                            }
                            let filePath = await fileModule.writeVideoJson(token, requestId, sectorNum, totalCoordinates);
                            socket.emit('cancelDeleteFile', {
                                id: token
                            })
                            socket.emit('delUploadedFile', {
                                filePath: filePath,
                                id: token,
                                immediate: 'false'
                            })

                            location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${sectorNum}&imgNum=${num}`;
                        }
                    })

                    $(document).on("click", ".loadArea", async function () {
                        let coordTritonToWeb
                        allClear()
                        if (restoration == 1) {
                            loadCount(videoJson["frame"]["location"]["bodyMax"], videoJson["frame"]["location"]["headMax"], videoJson["frame"]["location"]["carMax"])
                        }
                        else {
                            loadCount(1, 1, 1)
                        }
                        if (imgNum == 0) {
                            coordTritonToWeb = await comm.parseCoordTritonToWebVideo(selectSectorType, restoration, videoJson["frame"]["location"][$(".frameBox.active").data("framenum")]);
                        }
                        else {
                            coordTritonToWeb = await comm.parseCoordTritonToWebVideo(selectSectorType, restoration, videoJson["frame"]["location"][$(".frameBox.active").data("framenum")]);
                            if (coordTritonToWeb["canvas"].length == 0) {
                                coordTritonToWeb = await comm.parseCoordTritonToWebVideo(selectSectorType, restoration, videoJson["frame"]["location"][Number($(".frameBox.active").data("framenum")) - 1]);
                            }
                        }

                        if (restoration == 0) {
                            if (coordTritonToWeb != null) {
                                let canvasCoord = coordTritonToWeb.canvas;
                                let originCoord = coordTritonToWeb.origin;
                                let classArray = coordTritonToWeb.class;

                                if (canvasCoord.length > 0) setTimeout(() => loadData(canvasCoord, originCoord, classArray, restoration, $(".imgList").data("sectortype")), 50)
                            }
                            else {
                                setTimeout(() => 50)
                            }
                        }
                        else {
                            if (coordTritonToWeb != null) {
                                let canvasCoord = coordTritonToWeb.canvas;
                                let originCoord = coordTritonToWeb.origin;
                                let classArray = coordTritonToWeb.class;
                                let objectArray = coordTritonToWeb.objectID;

                                loadCount(videoJson["frame"]["location"]["bodyMax"], videoJson["frame"]["location"]["headMax"], videoJson["frame"]["location"]["carMax"])
                                if (canvasCoord.length > 0) setTimeout(() => loadData(canvasCoord, originCoord, classArray, restoration, $(".imgList").data("sectortype"), objectArray), 50)
                            }
                            else {
                                setTimeout(() => 50)
                            }
                        }
                    })
                }
            }

            let scrollableDiv = document.getElementById('sectorDiv');

            scrollableDiv.addEventListener('wheel', (event) => {
                event.preventDefault();
                let scrollDirection = 0;
                let scrollSpeed = 40;
                if (event.deltaY < 0) {
                    // 휠업 이벤트 처리
                    scrollDirection = -1;
                }
                else if (event.deltaY > 0) {
                    // 휠다운 이벤트 처리
                    scrollDirection = 1;
                }

                scrollableDiv.scrollLeft += scrollDirection * scrollSpeed;
            });

            const container = document.getElementById("sectorDiv");
            const activeElement = container.querySelector(".sectorBox.active").parentElement;
            if (activeElement) {
                const containerWidth = container.offsetWidth;
                const containerScrollLeft = container.scrollLeft;
                const activeElementWidth = activeElement.offsetWidth;
                const activeElementLeft = activeElement.offsetLeft - ((screen.width - 988) / 2);
                const activeElementRight = activeElementLeft + activeElementWidth;
                const centerPosition = containerScrollLeft + containerWidth / 2;

                // activeElement가 container 영역의 절반을 넘어간 경우에만 스크롤 이동
                if (activeElementLeft < centerPosition + (screen.width - 988) / 2 || activeElementRight > containerScrollLeft + containerWidth) {
                    const scrollOffset = activeElementLeft - containerWidth / 2 + activeElementWidth / 2;

                    // 스크롤 이동
                    container.scrollTo({
                        left: scrollOffset,
                        // behavior: "smooth" // 부드러운 스크롤
                    });
                }
            }
            // var signedUrl = resultLoader.getFileUrl(encDirectory[0], encDirectory[1], fileList);
        }

        $(document).on("click", ".sectorBox", async function () {
            let num = $(this).data("sectornum")
            location.href = `/encrypt/video/check?type=${type}&token=${token}&sectorID=${sectorId}&id=${requestId}&restoration=${restoration}&mode=${mode}&sectorNum=${num}&imgNum=0`;
        })

        $(document).on("click", ".thumbnailImg", async function () {
            let num = $(this).data("imgnum");
            let fileIDs = urlParams.get('fileIDs');
            if (type == 'image') {
                if (mode == 'group') {
                    location.href = `/encrypt/album/check?type=${type}&token=${token}&id=${requestId}&restoration=${restoration}&mode=${mode}&imgNum=${num}&fileIDs=${fileIDs}`;
                }
            }
        })
        $(document).on("click", ".save", async function () {
            let sectorType = $(".imgList").data("sectortype")
            let curCoordinates = saveInput(sectorType, restoration);
            let frameNumber = $(".frameBox.active").data("framenum");
            let fileIDs = urlParams.get('fileIDs');
            let fileNames = await fileModule.getFileNameFromID(fileIDs);
            let parsedCoordinates;
            if (type == "image") {
                if (mode == "group") {
                    parsedCoordinates = await comm.parseCoordWebToTriton(curCoordinates);
                    if (parsedCoordinates) {
                        totalCoordinates[fileNames[imgNum]] = parsedCoordinates;
                    }
                    else {
                        if (totalCoordinates[fileNames[imgNum]]) delete totalCoordinates[fileNames[imgNum]]
                    }
                }
                else {
                    parsedCoordinates = await comm.parseCoordWebToTriton(curCoordinates);
                    if (parsedCoordinates) {
                        totalCoordinates[fileList[imgNum]] = parsedCoordinates;
                    }
                    else {
                        if (totalCoordinates[fileList[imgNum]]) delete totalCoordinates[fileList[imgNum]]
                    }
                }
            }
            else if (type == "video") {
                if (sectorType == "fix") {
                    parsedCoordinates = await comm.parseCoordWebToTritonVideo(sectorType, restoration, curCoordinates);
                    if (parsedCoordinates) {
                        totalCoordinates["frame"]["location"] = parsedCoordinates;
                        totalCoordinates["complete"] = 1;
                        $('.listSectorDiv').each(function () {
                            if ($(this).find('.sectorBox').hasClass('active')) {
                                // sectorBox가 active 클래스를 가지고 있으면 saveIcon에도 active 클래스 추가
                                $(this).find('.saveIcon').addClass('active');
                            }
                        });
                        console.log(totalCoordinates)
                    }
                    else {
                        if (totalCoordinates["frame"]["location"]) delete totalCoordinates["frame"]["location"]
                        totalCoordinates["complete"] = 0;
                        $('.listSectorDiv').each(function () {
                            if ($(this).find('.sectorBox').hasClass('active')) {
                                // sectorBox가 active 클래스를 가지고 있으면 saveIcon에도 active 클래스 추가
                                $(this).find('.saveIcon').removeClass('active');
                            }
                        });
                    }
                }
                else {
                    parsedCoordinates = await comm.parseCoordWebToTritonVideo(sectorType, restoration, curCoordinates, frameNumber);
                    if (restoration == 1) {
                        let classMax = sendCount()
                        totalCoordinates["frame"]["location"]["bodyMax"] = classMax[0]
                        totalCoordinates["frame"]["location"]["headMax"] = classMax[1]
                        totalCoordinates["frame"]["location"]["carMax"] = classMax[2]
                    }
                    if (parsedCoordinates) {
                        totalCoordinates["frame"]["location"][frameNumber] = parsedCoordinates;
                        console.log(totalCoordinates)
                    }
                    else {
                        if (totalCoordinates["frame"]["location"][frameNumber]) totalCoordinates["frame"]["location"][frameNumber] = {}
                    }
                    let isComplete = true;
                    for (let key in totalCoordinates["frame"]["location"]) {
                        if (!isNaN(key)) {
                            if (Object.keys(totalCoordinates["frame"]["location"][key]).length == 0) {
                                totalCoordinates["complete"] = 0;
                                isComplete = false;
                                $('.listSectorDiv').each(function () {
                                    if ($(this).find('.sectorBox').hasClass('active')) {
                                        // sectorBox가 active 클래스를 가지고 있으면 saveIcon에도 active 클래스 추가
                                        $(this).find('.saveIcon').removeClass('active');
                                    }
                                });
                                break;
                            }
                        }
                    }
                    if (isComplete) {
                        totalCoordinates["complete"] = 1;
                        $('.listSectorDiv').each(function () {
                            if ($(this).find('.sectorBox').hasClass('active')) {
                                // sectorBox가 active 클래스를 가지고 있으면 saveIcon에도 active 클래스 추가
                                $(this).find('.saveIcon').addClass('active');
                            }
                        });
                    }
                }
            }
            // beforeColor = ""

            if (type == "image") {
                let filePath = await fileModule.writeCoordinatesToJson(token, requestId, totalCoordinates);
                console.log(filePath)
                socket.emit('cancelDeleteFile', {
                    id: token
                })
                socket.emit('delUploadedFile', {
                    filePath: filePath,
                    id: token,
                    immediate: 'false'
                })
                console.log(totalCoordinates)
            }
            else if (type == "video") {
                let filePath = await fileModule.writeVideoJson(token, requestId, sectorNum, totalCoordinates);
                socket.emit('cancelDeleteFile', {
                    id: token
                })
                socket.emit('delUploadedFile', {
                    filePath: filePath,
                    id: token,
                    immediate: 'false'
                })
                console.log(totalCoordinates)
            }
            if (type == "image" && mode == "single") {
                //DB에 비식별화 추가 관련 정보 쿼리
                //현재 토큰, id, mode 전달하고 keypath는 세션에서 읽어와서 MQ에 담아보내기.
                let additionalFileList = Object.keys(totalCoordinates)
                let fileCount = additionalFileList.length
                detail = {
                    'token': token,
                    'fileList': additionalFileList,
                    'fileCount': fileCount,
                }
                if (restoration == 0) {
                    Swal.fire({
                        title: '추가 비식별화를 진행할 경우 \n기존 비식별화 파일은 \n다운로드 받을 수 없습니다.\n 진행하시겠습니까?',
                        showCancelButton: true,
                        confirmButtonText: '네',
                        cancelButtonText: '취소',
                        icon: "info"
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            let [insertId, encReqInfo] = await fileModule.additionalEncrypt(detail, requestId);
                            // additional_encrypt에 대한 metering DB 테이블 삽입 함수 호출
                            // restoration, request_id, fileList, postData.fileNameList
                            comm.meterAdditionalEncrypt(requestId, insertId, additionalFileList, type);
                            let addMessage = await fileModule.sendAdditionalEncryptMessage(encReqInfo, additionalFileList);
                            let requestType = 'masking';
                            comm.increaseRequestCount(requestId, additionalFileList, requestType);
                            if (addMessage) {
                                Swal.fire({
                                    title: '비식별화 추가 요청이 \n완료되었습니다.',
                                    showCancelButton: false,
                                    confirmButtonText: '확인',
                                    allowOutsideClick: false,
                                    icon: 'success'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        location.href = `/loading?type=${type}&token=${token}&requestID=${requestId}&id=${insertId}&restoration=${restoration}&mode=${mode}&service=check`
                                    }
                                })
                            }
                        }
                    })
                }
                else {
                    let [insertId, encReqInfo] = await fileModule.additionalEncrypt(detail, requestId);
                    comm.meterAdditionalEncrypt(requestId, insertId, additionalFileList, type);
                    let addMessage = await fileModule.sendAdditionalEncryptMessage(encReqInfo, additionalFileList);
                    let requestType = 'masking';
                    comm.increaseRequestCount(requestId, additionalFileList, requestType);
                    if (addMessage) {
                        Swal.fire({
                            title: '비식별화 추가 요청이 \n완료되었습니다.',
                            showCancelButton: false,
                            confirmButtonText: '확인',
                            allowOutsideClick: false,
                            icon: 'success'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.href = `/loading?type=${type}&token=${token}&requestID=${requestId}&id=${insertId}&restoration=${restoration}&mode=${mode}&service=check`
                            }
                        })
                    }
                }
            }
            else {
                Swal.fire({
                    title: '저장이 완료되었습니다.',
                    showCancelButton: false,
                    confirmButtonText: '확인',
                    allowOutsideClick: false,
                    icon: 'success'
                })
                if (document.querySelectorAll(".tag").length != 0) {
                    if (type == "image" && mode == "group") {
                        $(`.img${imgNum}`).parent().find(".saveIcon").addClass("active");
                    }
                    else if (type == "video" && mode == "single") {
                        videoJson = await fileModule.readVideoJson(type, token, requestId, sectorNum)
                        console.log(videoJson)
                    }
                }
                else {
                    if (type == "image" && mode == "group") {
                        $(`.img${imgNum}`).parent().find(".saveIcon").removeClass("active");
                    }
                }
            }
        })

        $(document).on("click", ".confirmAdd", async function () {
            if (restoration == 0) {
                if (type == "image") {
                    let allImgClear = true;
                    let fileIDs = urlParams.get('fileIDs');
                    let selectedFiles = await fileModule.getFileNameFromID(fileIDs);
                    for (let i = 0; i < selectedFiles.length; i++) {
                        if (totalCoordinates.hasOwnProperty(selectedFiles[i])) {
                            continue; // 해당 키가 객체에 있는 경우, 다음 반복으로 이동
                        } else {
                            allImgClear = false;
                            break; // 루프 중단
                        }
                    }
                    if (allImgClear == false) {
                        Swal.fire({
                            title: '모든 이미지의 영역을 \n지정해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                    else {
                        //DB에 비식별화 추가 관련 정보 쿼리
                        //현재 토큰, id, mode 전달하고 keypath는 세션에서 읽어와서 MQ에 담아보내기.
                        let additionalFileList = Object.keys(totalCoordinates)
                        let fileCount = additionalFileList.length
                        detail = {
                            'token': token,
                            'fileList': additionalFileList,
                            'fileCount': fileCount,
                        }
                        Swal.fire({
                            title: '추가 비식별화를 진행할 경우 \n기존 비식별화 파일은 \n다운로드 받을 수 없습니다.\n 진행하시겠습니까?',
                            showCancelButton: true,
                            confirmButtonText: '네',
                            cancelButtonText: '취소',
                            icon: "info"
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                let [insertId, encReqInfo] = await fileModule.additionalEncrypt(detail, requestId);
                                comm.meterAdditionalEncrypt(requestId, insertId, additionalFileList, type);
                                let addMessage = await fileModule.sendAdditionalEncryptMessage(encReqInfo, additionalFileList);
                                let requestType = 'masking';
                                comm.increaseRequestCount(requestId, fileList, requestType);
                                if (addMessage) {
                                    Swal.fire({
                                        title: '비식별화 추가 요청이 \n완료되었습니다.',
                                        showCancelButton: false,
                                        confirmButtonText: '확인',
                                        allowOutsideClick: false,
                                        icon: 'success'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            location.href = `/loading?type=${type}&token=${token}&requestID=${requestId}&id=${insertId}&restoration=${restoration}&mode=${mode}&service=check`
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
                else if (type == "video") {
                    let allSectorClear = await fileModule.readallSectorClear(token, requestId)
                    if (allSectorClear == true) {
                        detail = {
                            'token': token,
                            'sectorList': Object.keys(sectorInfo)
                        }
                        Swal.fire({
                            title: '추가 비식별화를 진행할 경우 \n기존 비식별화 파일은 \n다운로드 받을 수 없습니다.\n 진행하시겠습니까?',
                            showCancelButton: true,
                            confirmButtonText: '네',
                            cancelButtonText: '취소',
                            icon: "info"
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                let [insertId, encReqInfo] = await fileModule.additionalVideoEncrypt(detail, requestId);
                                comm.meterAdditionalEncrypt(requestId, insertId, fileList, type);
                                let addMessage = await fileModule.sendAdditionalEncryptMessage(encReqInfo, fileList);
                                let requestType = 'masking';
                                comm.increaseRequestCount(requestId, fileList, requestType);
                                if (addMessage) {
                                    Swal.fire({
                                        title: '비식별화 추가 요청이 \n완료되었습니다.',
                                        showCancelButton: false,
                                        confirmButtonText: '확인',
                                        allowOutsideClick: false,
                                        icon: 'success'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            location.href = `/loading?type=${type}&token=${token}&requestID=${requestId}&id=${insertId}&restoration=${restoration}&mode=${mode}&service=check`
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else {
                        Swal.fire({
                            title: '모든 구간의 영역을 \n지정해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                }
            }
            else {
                if (type == "image") {
                    let allImgClear = true;
                    let fileIDs = urlParams.get('fileIDs');
                    let selectedFiles = await fileModule.getFileNameFromID(fileIDs);
                    for (let i = 0; i < selectedFiles.length; i++) {
                        if (totalCoordinates.hasOwnProperty(selectedFiles[i])) {
                            continue; // 해당 키가 객체에 있는 경우, 다음 반복으로 이동
                        } else {
                            allImgClear = false;
                            break; // 루프 중단
                        }
                    }
                    if (allImgClear == false) {
                        Swal.fire({
                            title: '모든 이미지의 영역을 \n지정해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                    else {
                        //DB에 비식별화 추가 관련 정보 쿼리
                        //현재 토큰, id, mode 전달하고 keypath는 세션에서 읽어와서 MQ에 담아보내기.
                        let additionalFileList = Object.keys(totalCoordinates)
                        let fileCount = additionalFileList.length
                        detail = {
                            'token': token,
                            'fileList': additionalFileList,
                            'fileCount': fileCount,
                        }
                        let [insertId, encReqInfo] = await fileModule.additionalEncrypt(detail, requestId);
                        comm.meterAdditionalEncrypt(requestId, insertId, additionalFileList, type);
                        let addMessage = await fileModule.sendAdditionalEncryptMessage(encReqInfo, selectedFiles);
                        let requestType = 'masking';
                        comm.increaseRequestCount(requestId, selectedFiles, requestType);
                        if (addMessage) {
                            Swal.fire({
                                title: '비식별화 추가 요청이 \n완료되었습니다.',
                                showCancelButton: false,
                                confirmButtonText: '확인',
                                allowOutsideClick: false,
                                icon: 'success'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.href = `/loading?type=${type}&token=${token}&requestID=${requestId}&id=${insertId}&restoration=${restoration}&mode=${mode}&service=check`
                                }
                            })
                        }
                    }
                }
                else if (type == "video") {
                    let allSectorClear = await fileModule.readallSectorClear(token, requestId)
                    if (allSectorClear == true) {
                        detail = {
                            'token': token,
                            'sectorList': Object.keys(sectorInfo)
                        }
                        let [insertId, encReqInfo] = await fileModule.additionalVideoEncrypt(detail, requestId);
                        comm.meterAdditionalEncrypt(requestId, insertId, fileList, type);
                        let addMessage = await fileModule.sendAdditionalEncryptMessage(encReqInfo, fileList);
                        let requestType = 'masking';
                        comm.increaseRequestCount(requestId, fileList, requestType);
                        if (addMessage) {
                            Swal.fire({
                                title: '비식별화 추가 요청이 \n완료되었습니다.',
                                showCancelButton: false,
                                confirmButtonText: '확인',
                                allowOutsideClick: false,
                                icon: 'success'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    location.href = `/loading?type=${type}&token=${token}&requestID=${requestId}&id=${insertId}&restoration=${restoration}&mode=${mode}&service=check`
                                }
                            })
                        }
                    }
                    else {
                        Swal.fire({
                            title: '모든 구간의 영역을 \n지정해주세요.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                }
            }
        })
    },
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