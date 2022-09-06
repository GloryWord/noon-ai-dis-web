'use strict';

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

        var html = '<table>\
                    <tr>\
                        <th>파일명</th>\
                        <th>용량</th>\
                        <th>객체 선택</th>\
                        <th>파일 삭제</th>\
                    </tr>';
        if (type == 'image') html = '<table>\
                                    <tr>\
                                        <th>파일명</th>\
                                        <th>용량</th>\
                                        <th>객체 선택<br>\
                                            <input class="allbody" type="checkbox"><label>사람-몸</label>&nbsp;\
                                            <input class="allface" type="checkbox"><label>사람-얼굴</label>&nbsp;\
                                            <input class="allcar" type="checkbox"><label>자동차 번호판</label>\
                                        </th>\
                                        <th>파일 삭제</th>\
                                    </tr>';
        for (var i = 0; i < files.length; i++) {
            html += '<tr id=file-' + [i] + '>\
                        <td>'+ files[i].name + '</td>\
                        <td>'+ formatBytes(files[i].size) + '</td>\
                        <td class="selectObject">\
                            <input class="body" type="checkbox" name="body"><label>사람-몸</label>&nbsp;\
                            <input class="face" type="checkbox" name="head"><label>사람-얼굴</label>&nbsp;\
                            <input class="car" type="checkbox" name="lp"><label>자동차 번호판</label>\
                        </td>\
                        <td>\
                            <div class="uploadDelete" value='+ i + '>\
                                <p>삭제하기</p>\
                            </div>\
                        </td>\
                    </tr>'
        }
        html += '</table>';

        return [html, fileWidth, fileHeight, fileCount, videoDuration];
    },

    deleteFile: function (index) {
        $("tr").remove("#file-" + index);
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
            keyIndex = $('#selectKeyName').val()
            keyName = $('#selectKeyName option:checked').text()
        }

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
            url: "/api/syncTime",
            dataType: "json",
            data: {
                'curTime': curTime
            },
            success: function (data) {
                var formData = new FormData();
                var file = document.getElementById('file').files;
                var mode = ''
                if (file.length > 1) mode = '/multiple';
                for (var i = 0; i < file.length; i++) formData.append('file', file[i]);
                // formData.append('file', file);
                var xhr = new XMLHttpRequest();
                xhr.open('post', '/api/uploadNAS' + mode, true);
                xhr.upload.onprogress = function (e) {
                    console.log(e);
                    if (e.lengthComputable) {
                        var percentage = (e.loaded / e.total) * 100;
                        console.log(percentage + "%");
                    }
                }
                xhr.onerror = function (e) {
                    console.log(e);
                    Swal.fire({
                        title: '업로드 에러',
                        text: '파일 업로드에 실패하였습니다.',
                        confirmButtonText: '확인',
                        allowOutsideClick: false,
                        icon: 'error'
                    })
                };
                xhr.onload = function () {
                    new Promise((resolve, reject) => {
                        var requestIndex = ''
                        $.ajax({
                            method: "post",
                            url: "/api/request/encrypt",
                            dataType: "json",
                            data: postData,
                            async: false,
                            success: function (data) {
                                requestIndex = data.enc_request_list_id;
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
                            url: "/api/sendMessage/encrypt",
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
                confirmButtonText: '확인',
                allowOutsideClick: false,
                icon: 'error'
            })
        }
        else {
            fileName = file.name;
            formData.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.open('post', '/api/uploadNAS', true);
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
                    $.ajax({
                        method: "post",
                        url: "/api/key/verify",
                        dataType: "json",
                        data: {
                            'fileName': fileName,
                            'keyName': keyName
                        },
                        async: false,
                        success: function (data) {
                            if (data['log'] == 'valid') valid = true;
                        },
                        error: function (xhr, status) {
                            // alert(xhr + " : " + status);
                            alert(JSON.stringify(xhr));
                        }
                    });
                    resolve(valid)
                }).then((valid) => {
                    if (!valid) {
                        Swal.fire({
                            title: '복호화 키 불일치',
                            text: '비식별화시 사용된 키 파일 정보와 일치하지 않습니다.',
                            showCancelButton: false,
                            confirmButtonText: '확인',
                            icon: 'error'
                        })
                    }
                    else {
                        new Promise((resolve, reject) => {
                            var userAuth = comm.getAuth();
                            var result = '';
                            $.ajax({
                                method: "post",
                                url: "/api/request/decrypt",
                                dataType: "json",
                                data: {
                                    enc_request_id: index,
                                    account_auth_id: userAuth.id,
                                    fileList: JSON.stringify(fileList),
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
                                url: "/api/sendMessage/decrypt",
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
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        location.href = '/loading?type='+fileType+'&id='+decRequestId+'&service=decrypt';
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