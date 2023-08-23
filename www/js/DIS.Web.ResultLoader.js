'use strict';

/**
 * DIS.Web.ResultLoader 네임스페이스
 * @class DIS.Web.ResultLoader
 */
DIS.Web.ResultLoader = DIS.Web.ResultLoader || {};

/**
 * DIS.Web.ResultLoader 클래스를 참조하는 글로벌 멤버 변수
 * @interface ResultLoader
 */

var resultLoader = DIS.Web.ResultLoader;
resultLoader = {
    getEncFileInfo: function (index) {
        var result = ''

        let baseUrl = `/api/encrypt/result/${index}`
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = data.result;
                    var parsedDirectory = result.encrypt_directory.split('/');
                    var encDirectory = [parsedDirectory[0], ''];
                    for (var i = 1; i < parsedDirectory.length; i++) {
                        if (i == 1) encDirectory[1] += parsedDirectory[i];
                        else encDirectory[1] += '/' + parsedDirectory[i];
                    } 

                    var fileList = result.fileList.split('\n');

                    if (fileList[fileList.length - 1] == '') fileList = fileList.splice(0, fileList.length - 1);

                    result = {
                        encDirectory: encDirectory,
                        fileList: fileList
                    }
                }
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
        return result;
    },

    getDecFileInfo: function (index) {
        var result = ''

        let baseUrl = `/api/decrypt/result/${index}`
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                console.log(data);
                if (data.message == 'success') {
                    result = data.result;
                }
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })

        var parsedDirectory = result.save_directory.split('/');
        var decDirectory = [parsedDirectory[0], ''];
        for (var i = 1; i < parsedDirectory.length; i++) {
            if (i == 1) decDirectory[1] += parsedDirectory[i];
            else decDirectory[1] += '/' + parsedDirectory[i];
        }

        var fileList = result.fileList.split('\n');

        if (fileList[fileList.length - 1] == '') fileList = fileList.splice(0, fileList.length - 1);
        return [decDirectory, fileList];
    },

    getVideoData: function (index) {
        var result = ''

        let baseUrl = `/api/encrypt/info/${index}`
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = data.result;
                }
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
        
        return result
    },

    getFileUrl: function (bucketName, subDirectory, objectName) {
        var result = [];

        let baseUrl = `/api/result/url`
        let apiUrl = apiUrlConverter('util', baseUrl)

        for (var i = 0; i < objectName.length; i++) {
            $.ajax({
                method: "post",
                url: apiUrl,
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    'bucketName': bucketName,
                    'objectName': subDirectory + '/' + objectName[i],
                    'fileName': objectName[i]
                },
                async: false,
                success: function (data) {
                    if (data.message == 'success') {
                        result.push([data.result, data.fileSize]);
                    }
                    // else alert(JSON.stringify(data));
                }, // success 
                error: function (xhr, status) {
                    // alert("error : " + xhr + " : " + JSON.stringify(status));
                }
            })
        }

        result.sort((entry1, entry2) => {
            let index1 = objectName.indexOf(entry1[0]);
            let index2 = objectName.indexOf(entry2[0]);

            return index1 - index2;
        });
        return result;
    },

    getImageDetailHtml: function (urlList, mode, objectName) {
        var html = ''
        if (mode == 'single') {
            for (var i = 0; i < urlList.length; i++) {
                html += '<img class="getImg" src="' + urlList[i][0] + '">\
                <div class="fileFullName">\
                    <p>'+ objectName[0] + '</p>\
                </div>'
            }
        }
        else if (mode == 'group') {
            var cur = 0;
            for (var i = 0; i < urlList.length; i++) {
                if (i % 3 == 0) {
                    cur = i;
                    html += '<div class="threeArea">';
                }
                html += '<div class ="albumlist">\
                            <img data-num='+ i + ' class="albumImg" src="' + urlList[i][0] + '">\
                            <div class="albumFooter">\
                                <p>'+ objectName[i] + '</p>\
                            </div>\
                            <input class="check_reco hide" type="checkbox">\
                            <div class="'+ i + ' hoverdiv hide" data-num=' + i + '><p>이미지 크게 보기</p></div>\
                        </div>'
                if (cur == i - 2 || i == urlList.length - 1) html += '</div>';
            }
        }
        return html;
    },

    getVideoDetailHtml: function (urlList, objectName) {
        let videoURL = (urlList[0][0].indexOf('thumbnail') >= 0) ? urlList[1][0] : urlList[0][0]
        var player = videojs("myPlayer", {
            sources: [
                { src: videoURL, type: "video/mp4" }
            ],
            // poster : "test-poster.png",
            controls: true,
            playsinline: true,
            muted: true,
            preload: "metadata",
            preload: "none",
            fluid: true,
            fill: true
        });

        player.ready(function () {
            player.on('timeupdate', function () {
                var currentTime = player.currentTime();
                if (currentTime == 2) {
                    player.addClass('highlight');
                } else {
                    player.removeClass('highlight');
                }
            });
        });


        const canvas = document.getElementById('captureCanvas');
        const canvasDiv = document.getElementById('canvasDiv');

        $(document).on("click", ".captureBtn", function () {
            canvasDiv.style.width = player.videoWidth();
            canvasDiv.style.height = player.videoHeight();
            canvas.width = player.videoWidth();
            canvas.height = player.videoHeight();
            // 캔버스에 현재 비디오 프레임을 그립니다.
            // console.log(player.tech().el())
            canvas.getContext('2d').drawImage(player.tech().el(), 0, 0, canvas.width, canvas.height)
            // html2canvas(document.getElementById('captureCanvas'), { useCORS: true }).then(function (canvas) {
            //     var imgBase64 = canvas.toDataURL();
            //     console.log("imgBase64:", imgBase64);
            //     var imgURL = "data:image/" + imgBase64;
            //     var triggerDownload = $("<a>").attr("href", imgURL).attr("download", "layout_" + new Date().getTime() + ".jpeg").appendTo("body");
            //     triggerDownload[0].click();
            //     triggerDownload.remove();
            // });

            // 캡처한 이미지를 Blob 형식으로 저장
            // canvas.toBlob((blob) => {
            //     // Blob을 다운로드하거나 원하는 방식으로 활용할 수 있습니다.
            //     // 예: saveAs(blob, 'frame.png');
            // }, 'image/png');
        })

    },

    getVideoInspectionHtml: function (urlList, objectName) {
        let videoURL = (urlList[0][0].indexOf('thumbnail') >= 0) ? urlList[0][0] : urlList[1][0]
        console.log(videoURL)
        var player = videojs("myPlayer", {
            sources: [
                { src: videoURL, type: "video/mp4" }
            ],
            // poster : "test-poster.png",
            controls: true,
            playsinline: true,
            muted: true,
            preload: "metadata",
            preload: "none",
            fluid: true,
            fill: true
        });
    },

    getInfoHtml: function (index) {
        var result = ''
        var html = ''

        let baseUrl = `/api/request/encrypt?id=${index}`
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result = data.result;
            }, // success 
            error: function (xhr, status) {

            }
        })

        var fileNameArray = result.request_file_list.split('\n');
        fileNameArray = fileNameArray.splice(0, fileNameArray.length - 1);
        var count = fileNameArray.length;
        var nameCount = (fileNameArray.length > 1) ? ' 외 ' + (count - 1) + '장' : '';
        var type = (result.file_type == 'image') ? '이미지' : '동영상'
        var group = (count > 1) ? '그룹' : '';
        var restoration = (result.restoration == 1) ? '복원 가능' : '복원 불가능';
        var date = new Date(result.request_date)
        var userName = result.user_name;

        if (screen.width <= 600) {
            html = '<div class="file_first">\
                        <div class="file_type">\
                            <p class="title">파일 타입</p>\
                            <p>'+ type + ' ' + group + '</p>\
                        </div>\
                        <div class="file_user admin_only">\
                            <p class="title">담당자</p>\
                            <p>'+ userName + '</p>\
                        </div>\
                    </div>';


            html += '<div class="file_second">\
                        <div class="file_name">\
                            <p class="title">파일명</p>\
                            <p class="file_fullname">'+ fileNameArray[0] + nameCount + '</p>\
                        </div>\
                        <div class="file_date">\
                            <p class="title">작업 날짜</p>\
                            <p>'+ dateFormat(date) + ' ' + result.request_time + '</p>\
                        </div>\
                        <div class="file_reco">\
                            <p class="title">복호화 여부</p>\
                            <p class="rest_info">'+ restoration + '</p>\
                        </div>'
            if (restoration == '복원 가능') {
                html += '<div class="file_key">\
                                <p class="title">복호화 키</p>\
                                <p>'+ result.key_name + '</p>\
                            </div>';
            }
            else {
                html += '<div class="file_key">\
                                <p class="title">복호화 키</p>\
                                <p>복호화 키 지정 안됨</p>\
                            </div>';
            }
            html += '</div>';
        }
        else {
            html = '<div class="file_first">\
                        <div class="file_type">\
                            <p class="title">파일 타입</p>\
                            <p>'+ type + ' ' + group + '</p>\
                        </div>\
                        <div class="file_name">\
                            <p class="title">파일명</p>\
                            <p class="file_fullname">'+ fileNameArray[0] + nameCount + '</p>\
                        </div>\
                        <div class="file_date">\
                            <p class="title">작업 날짜</p>\
                            <p>'+ dateFormat(date) + ' ' + result.request_time + '</p>\
                        </div>\
                    </div>';


            html += '<div class="file_second">\
                        <div class="file_user admin_only">\
                            <p class="title">담당자</p>\
                            <p>'+ userName + '</p>\
                        </div>\
                        <div class="file_reco">\
                            <p class="title">복호화 여부</p>\
                            <p class="rest_info">'+ restoration + '</p>\
                        </div>'
            if (restoration == '복원 가능') {
                html += '<div class="file_key">\
                                <p class="title">복호화 키</p>\
                                <p>'+ result.key_name + '</p>\
                                <div class="keyChange" data-id=' + result.fk_rsa_key_pair_id + '>\
                                    <span>변경하기</span>\
                                </div>\
                            </div>';
            }
            else {
                html += '<div class="file_key">\
                                <p class="title">복호화 키</p>\
                                <p>복호화 키 지정 안됨</p>\
                            </div>';
            }
            html += '</div>';
        }



        return html
    },

    fileToZip: function (options) {
        var bucketName = options.bucketName;
        var subDirectory = options.subDirectory;
        var fileListArray = JSON.stringify(options.fileName);

        let baseUrl = `/api/encrypt/result/file/zip`
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                bucketName,
                subDirectory,
                fileListArray
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {

                }
                // else alert(JSON.stringify(data));
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
    },
}