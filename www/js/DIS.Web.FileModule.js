'use strict';

var estimated_charge_coefficient = []
var objectCount = 0;
$(document).on("click", ".dropdown_content", function () {
    var keyIndex = $(this).data("idx")
    var keyName = $(this).children().text()
    $('.selectText').text(keyName)
    $('.selectKey').data("idx", keyIndex)
    console.log($('.selectKey').data("idx"))
    objectCount = $('.selectKey').data("idx");

    var estimated_charge = estimated_charge_coefficient[0]*objectCount*9000
    $('#charge').text('예상요금 = '+estimated_charge);
});

/**
 * DIS.Web.FileModule 네임스페이스
 * @class DIS.Web.FileModule
 */
DIS.Web.FileModule = DIS.Web.FileModule || {};

/**
 * DIS.Web.FileModule 클래스를 참조하는 글로벌 멤버 변수
 * @interface FileModule
 */

var fileModule = DIS.Web.FileModule;
fileModule = {
    getFileList: function (type, mode) {
        var files = document.getElementById(mode).files;
        var fileTypeInfo = ''
        var fileType = []
        var fileExt = []
        var fileWidth = []
        var fileHeight = []
        var videoDuration = []
        var fileCount = 0;

        const dataTransfer = new DataTransfer();
        let fileArray = Array.from(files);	//변수에 할당된 파일을 배열로 변환(FileList -> Array)
        var filteredFileArray = fileArray.filter((element) => element.type.split('/')[0] == type);

        filteredFileArray.forEach(file => { dataTransfer.items.add(file); });
        $('#file')[0].files = dataTransfer.files;	//제거 처리된 FileList를 돌려줌
        files = $('#file')[0].files;

        for (var i = 0; i < files.length; i++) {
            fileTypeInfo = files[i].type.split('/');
            fileType.push(fileTypeInfo[0]);
            fileExt.push(fileTypeInfo[1]);
        }

        for (var i = 0; i < files.length; i++) {
            if (fileType[i] == 'image') {
                let img = new Image()
                img.src = window.URL.createObjectURL(files[i])
                img.onload = () => {
                    // alert(img.width + " " + img.height);
                    fileWidth.push(img.width);
                    fileHeight.push(img.height);
                    fileCount += 1;
                }
            }
            else if (fileType[i] == 'video') {
                const video = document.createElement('video');
                video.addEventListener('loadedmetadata', event => {
                    fileCount += 1;
                    fileWidth.push(video.videoWidth);
                    fileHeight.push(video.videoHeight);
                    videoDuration.push(video.duration);
                });
                video.src = URL.createObjectURL(files[i]);
            }
        }

        var fileList = ''
        for (var i = 0; i < files.length; i++) {
            fileList += '파일 이름: ' + files[i].name + '<br>'
                + '크기: ' + formatBytes(files[i].size) + '<br>'
                + '종류: ' + fileType[i] + '<br>'
        }

        var html = '<div class="file_header">\
                        <div class="name_header"><p>파일명</p></div>\
                        <div class="size_header"><p>용량</p></div>\
                        <div class="object_header"><p>비식별 처리할 객체 선택</p></div>\
                        <div class="delete_header"></div>\
                    </div>';
        if (type == 'image') html = '<div class="file_header">\
                                        <div class="name_header"><p>파일명</p></div>\
                                        <div class="size_header"><p>용량</p></div>\
                                        <div class="object_header">\
                                            <p>비식별 처리할 객체 선택</p>\
                                            <div class="allObject">\
                                                <input class="allbody" type="checkbox"><label class="bodylabel">사람 - 전신</label>\
                                                <input class="allface" type="checkbox"><label class="facelabel">사람 - 얼굴</label>\
                                                <input class="allcar" type="checkbox"><label class="carlabel">차량 번호판</label>\
                                            </div>\
                                        </div>\
                                        <div class="delete_header">\
                                            <div class="allDelete">\
                                                <p>전체삭제</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="imgContent">';
        if (type == 'image') {
            if (screen.width <= 600) {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content">\
                                    <h1>파일명</h1>\
                                    <div class="file_name_text">\
                                        <p>'+ files[i].name + '</p>\
                                    </div>\
                                </div>\
                                <div class="second_info">\
                                    <div class="selectObject">\
                                        <p>객체선택</p>\
                                        <div class="checkList">\
                                            <div class="check_box">\
                                                <input class="body" type="checkbox" name="body"><label>사람 - 전신</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="face" type="checkbox" name="head"><label>사람 - 얼굴</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="car" type="checkbox" name="lp"><label>차량 번호판</label>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="size_btn_area">\
                                        <div class="size_content">\
                                            <h1>용량</h1>\
                                            <p>'+ formatBytes(files[i].size) + '</p>\
                                        </div>\
                                        <div class="delete_content">\
                                            <div class="uploadDelete" value='+ i + '>\
                                                <p>삭제</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content"><p>'+ files[i].name + '</p></div>\
                                <div class="size_content"><p>'+ formatBytes(files[i].size) + '</p></div>\
                                <div class="selectObject">\
                                    <div class="checkList">\
                                        <input class="body" type="checkbox" name="body">\
                                        <input class="face" type="checkbox" name="head">\
                                        <input class="car" type="checkbox" name="lp">\
                                    </div>\
                                </div>\
                                <div class="delete_content">\
                                    <div class="uploadDelete" value='+ i + '>\
                                        <p>삭제하기</p>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }
        }
        else {
            if (screen.width <= 600) {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content">\
                                    <h1>파일명</h1>\
                                    <div class="file_name_text">\
                                        <p>'+ files[i].name + '</p>\
                                    </div>\
                                </div>\
                                <div class="second_info">\
                                    <div class="selectObject">\
                                        <p>객체선택</p>\
                                        <div class="checkList">\
                                            <div class="check_box">\
                                                <input class="body" type="checkbox" name="body"><label>사람 - 전신</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="face" type="checkbox" name="head"><label>사람 - 얼굴</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="car" type="checkbox" name="lp"><label>차량 번호판</label>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="size_btn_area">\
                                        <div class="size_content">\
                                            <h1>용량</h1>\
                                            <p>'+ formatBytes(files[i].size) + '</p>\
                                        </div>\
                                        <div class="delete_content">\
                                            <div class="uploadDelete" value='+ i + '>\
                                                <p>삭제</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content"><p>'+ files[i].name + '</p></div>\
                                <div class="size_content"><p>'+ formatBytes(files[i].size) + '</p></div>\
                                <div class="selectObject">\
                                    <div class="checkList">\
                                        <input class="body" type="checkbox" name="body"><label>사람 - 전신</label>\
                                        <input class="face" type="checkbox" name="head"><label>사람 - 얼굴</label>\
                                        <input class="car" type="checkbox" name="lp"><label>차량 번호판</label>\
                                    </div>\
                                </div>\
                                <div class="delete_content">\
                                    <div class="uploadDelete" value='+ i + '>\
                                        <p>삭제하기</p>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }

        }
        if (type == 'image') html += '</div>'

        return [html, fileWidth, fileHeight, fileCount, videoDuration];
    },

    alldeleteFile: function () {
        $("div").remove(".file_content");
    },

    deleteFile: function (index) {
        $("div").remove("#file-" + index);
        const dataTransfer = new DataTransfer();
        const files = $('#file')[0].files;	//사용자가 입력한 파일을 변수에 할당
        let fileArray = Array.from(files);	//변수에 할당된 파일을 배열로 변환(FileList -> Array)
        fileArray.splice(index, 1);	//해당하는 index의 파일을 배열에서 제거
        fileArray.forEach(file => { dataTransfer.items.add(file); });
        //남은 배열을 dataTransfer로 처리(Array -> FileList)
        $('#file')[0].files = dataTransfer.files;	//제거 처리된 FileList를 돌려줌
    },

    uploadFile: function (fileWidth, fileHeight, videoDuration, restoration, encryptObject, fileType) {
        var curTime = getTime();
        var fileNameList = getFiles();
        var fileWidthObj = Object.assign({}, fileWidth)
        var fileHeightObj = Object.assign({}, fileHeight)
        var videoDurationObj = Object.assign({}, videoDuration)
        var encryptObj = Object.assign({}, encryptObject);

        var keyIndex = 0;
        var keyName = 'null';
        if (restoration == 1) {
            // keyIndex = $('#selectKeyName').val()
            // keyName = $('#selectKeyName option:checked').text()
            if ($('input[type=radio][name=keySelect]')[0].checked) {
                keyIndex = $('.selectKey').data("idx")
                keyName = $('.selectText').text()
            }
            else {
                keyName = $('#genKeyName').val();
                for (var i = 0; i < $('.dropdown_content').length; i++) {
                    console.log($('.dropdown_content')[i].innerText)
                    if ($('.dropdown_content').eq(i).text() == keyName) keyIndex = $('.dropdown_content').eq(i).attr('data-idx');
                }
            }
        }

        // RabbitMQ에 넣을 메시지 형태를 미리 만들어줌
        var postData = {
            'requestType': 'encrypt',
            'fileNameList': fileNameList,
            'fileWidth': JSON.stringify(fileWidthObj),
            'fileHeight': JSON.stringify(fileHeightObj),
            'videoDuration': JSON.stringify(videoDurationObj),
            'curTime': curTime,
            'keyIndex': keyIndex,
            'keyName': keyName,
            'requestIndex': '',
            'restoration': restoration,
            'encryptObject': JSON.stringify(encryptObj)
        }

        $.ajax({
            method: "post",
            url: "/util-module/api/syncTime", // 세션에 현재 요청시간 정보를 담아줌
            dataType: "json",
            data: {
                'curTime': curTime
            },
            success: function (data) {
                var formData = new FormData();
                var file = document.getElementById('file').files;
                var mode = ''
                var a = 0;
                if (file.length > 1) mode = '/multiple';
                for (var i = 0; i < file.length; i++) formData.append('file', file[i]);
                // formData.append('file', file);
                var xhr = new XMLHttpRequest();
                xhr.open('post', '/util-module/api/uploadNAS' + mode, true);
                xhr.upload.onprogress = function (e) {
                    console.log(e);
                    if (e.lengthComputable) {
                        var per = (e.loaded / e.total) * 100;
                        progressBar(per);
                        console.log(per + "%");
                    }
                }
                xhr.onerror = function (e) {
                    console.log(e);
                    Swal.fire({
                        title: '업로드 에러',
                        text: '파일 업로드에 실패하였습니다.',
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    });
                };
                xhr.onload = function () {
                    Swal.fire({
                        title: '업로드 완료',
                        text: '파일 업로드에 성공했습니다.',
                        showConfirmButton:true,
                        showDenyButton:false,
                        denyButtonText:"확 인",
                        icon:"success"
                    });
                    var response = JSON.parse(this.responseText);
                    console.log(response);
                    if (response.message == 'success') {
                        // console.log(response.result.streams[0].bit_rate);
                        var ffmpegInfo = response.result.streams;
                        
                        let resolution_coefficient, frame_rate_coefficient, duration_coefficient, bitrate_coefficient, avg_object_coefficient
                        for(var i = 0; i < fileWidth.length; i++) {
                            var curFile = ffmpegInfo[i]
                            resolution_coefficient = (fileWidth[i] * fileHeight[i]) / (640 * 640)
                            
                            var avg_frame_rate = curFile.avg_frame_rate
                            avg_frame_rate = avg_frame_rate.split('/');
                            avg_frame_rate = Number(avg_frame_rate[0]);
                            frame_rate_coefficient = avg_frame_rate / 30;
                            
                            duration_coefficient = curFile.duration / 60;
                            bitrate_coefficient = curFile.bit_rate / ((640*640)*30);
                            bitrate_coefficient = bitrate_coefficient / 4;
                            estimated_charge_coefficient.push(resolution_coefficient*frame_rate_coefficient*duration_coefficient*bitrate_coefficient);
                        }

                        // new Promise((resolve, reject) => {
                        //     var requestIndex = ''
                        //     $.ajax({
                        //         method: "post",
                        //         url: "/encrypt-module/api/request/encrypt",
                        //         dataType: "json",
                        //         data: postData,
                        //         async: false,
                        //         success: function (data) {
                        //             requestIndex = data.enc_request_list_id;
                        //             comm.meterEncUpload(fileNameList, fileWidth, fileHeight, requestIndex, restoration);
                        //         },
                        //         error: function (xhr, status) {
                        //             // alert(xhr + " : " + status);
                        //             alert(JSON.stringify(xhr));
                        //         }
                        //     });
                        //     postData['requestIndex'] = requestIndex;
                        //     resolve();
                        // }).then(() => {
                        //     Swal.fire({
                        //         title: '비식별화 요청이 \n완료되었습니다.',
                        //         showCancelButton: false,
                        //         confirmButtonText: '확인',
                        //         allowOutsideClick: false,
                        //         icon:'success'
                        //     }).then((result) => {
                        //         if (result.isConfirmed) {
                        //             location.href = '/loading?type='+fileType+'&service=encrypt';
                        //         }
                        //     });
                        //     new Promise((resolve, reject) => {
                        //         resolve()
                        //     }).then(() => {
                        //         Swal.fire({
                        //             title: '비식별화 요청이 \n완료되었습니다.',
                        //             showCancelButton: false,
                        //             confirmButtonText: '확인',
                        //             allowOutsideClick: false,
                        //         }).then((result) => {
                        //             if (result.isConfirmed) {
                        //                 location.href = '/loading?type='+fileType+'&service=encrypt';
                        //             }
                        //         })
                        //     })
                        // })

                        $(document).on("click", "#execute", function () {
                            new Promise((resolve, reject) => {
                                var requestIndex = ''
                                $.ajax({
                                    method: "post",
                                    url: "/encrypt-module/api/request/encrypt",
                                    dataType: "json",
                                    data: postData,
                                    async: false,
                                    success: function (data) {
                                        requestIndex = data.enc_request_list_id;
                                        comm.meterEncUpload(fileNameList, fileWidth, fileHeight, requestIndex, restoration);
                                    },
                                    error: function (xhr, status) {
                                        // alert(xhr + " : " + status);
                                        alert(JSON.stringify(xhr));
                                    }
                                });
                                postData['requestIndex'] = requestIndex;
                                resolve();
                            }).then(() => {
                                $.ajax({
                                    method: "post",
                                    url: "/encrypt-module/api/sendMessage/encrypt",
                                    dataType: "json",
                                    data: postData,
                                    success: function (data) {
    
                                    },
                                    error: function (xhr, status) {
                                        // alert(xhr + " : " + status);
                                        alert(JSON.stringify(xhr));
                                    }
                                });
                                new Promise((resolve, reject) => {
                                    resolve()
                                }).then(() => {
                                    Swal.fire({
                                        title: '비식별화 요청이 \n완료되었습니다.',
                                        showCancelButton: false,
                                        confirmButtonText: '확인',
                                        allowOutsideClick: false,
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            location.href = '/loading?type='+fileType+'&service=encrypt';
                                        }
                                    })
                                })
                            })
                        });
                    }
                    else {
                        alert('파일 업로드 실패')
                    }
                };
                xhr.send(formData);
            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                alert(JSON.stringify(xhr));
            }
        });
    },

    verifyKey: function (keyName, index, fileList, fileType) {
        var formData = new FormData();
        var file = document.getElementById('file').files[0];
        if (file == undefined) file = document.getElementById('select_file').files[0];
        var fileName;
        var valid = false;

        if (file == undefined) {
            Swal.fire({
                title: '키 파일이 없습니다!',
                text: '키 파일을 업로드했는지 확인해주세요.',
                showConfirmButton:false,
                showDenyButton:true,
                denyButtonText:"확 인",
                icon:"error"
            });
        }
        else {
            fileName = file.name;
            formData.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.open('post', '/util-module/api/uploadNAS', true);
            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    var percentage = (e.loaded / e.total) * 100;
                    console.log(percentage + "%");
                }
            }
            xhr.onerror = function (e) {
                console.log('Error');
                console.log(e);
            };
            xhr.onload = function () {
                new Promise((resolve, reject) => {
                    var msg = '';
                    var keyPath = '';
                    $.ajax({
                        method: "post",
                        url: "/key-module/api/key/verify",
                        dataType: "json",
                        data: {
                            'fileName': fileName, // 남자향수.pem -> 이민형.pem
                            'keyName': keyName // DB에서 비교해볼 키 네임
                        },
                        async: false,
                        success: function (data) {
                            if (data['result'] == 'valid') valid = true;
                            msg = data.log;
                            keyPath = data.keyPath;
                        },
                        error: function (xhr, status) {
                            // alert(xhr + " : " + status);
                            alert(JSON.stringify(xhr));
                        }
                    });
                    resolve({ valid, msg, keyPath })
                }).then(({ valid, msg, keyPath }) => {
                    if (!valid) {
                        Swal.fire({
                            title: '복호화 키 불일치',
                            text: msg,
                            showCancelButton: false,
                            showConfirmButton:false,
                            showDenyButton:true,
                            denyButtonText:"확 인",
                            icon:"error"
                        });
                    }
                    else {
                        new Promise((resolve, reject) => {
                            var userAuth = comm.getAuth();
                            var result = '';
                            $.ajax({
                                method: "post",
                                url: "/decrypt-module/api/request/decrypt", //DB에 복호화 요청정보 저장
                                dataType: "json",
                                data: {
                                    enc_request_id: index,
                                    account_auth_id: userAuth.id,
                                    fileList: JSON.stringify(fileList),
                                    keyPath: keyPath
                                },
                                async: false,
                                success: function (data) {
                                    result = data;
                                    console.log(result);
                                },
                                error: function (xhr, status) {
                                    // alert(xhr + " : " + status);
                                    alert(JSON.stringify(xhr));
                                }
                            });
                            resolve(result);
                        }).then((result) => {
                            var reqInfo = result['decReqInfo']['reqInfo'];
                            var msgTemplate = result['decReqInfo'];
                            var decRequestId = result['dec_request_list_id'];
                            delete msgTemplate.reqInfo;
                            $.ajax({
                                method: "post",
                                url: "/decrypt-module/api/sendMessage/decrypt", //DB에 저장 후 복호화 요청정보를 Queue에 담아 전달
                                dataType: "json",
                                data: {
                                    'msgTemplate': JSON.stringify(msgTemplate),
                                    'reqInfo': JSON.stringify(reqInfo)
                                },
                                success: function (data) {

                                },
                                error: function (xhr, status) {
                                    // alert(xhr + " : " + status);
                                    alert(JSON.stringify(xhr));
                                }
                            });
                            new Promise((resolve, reject) => {
                                resolve()
                            }).then(() => {
                                Swal.fire({
                                    title: '복호화 요청이 \n완료되었습니다.',
                                    showCancelButton: false,
                                    confirmButtonText: '확인',
                                    allowOutsideClick: false,
                                    icon:'success'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        location.href = '/loading?type=' + fileType + '&id=' + decRequestId + '&service=decrypt';
                                    }
                                })
                            })
                        })
                    }
                })
            };
            xhr.send(formData);
        }
    }
}