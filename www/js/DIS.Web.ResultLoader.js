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
    getFileInfo: function (index) {
        var result = ''
        $.ajax({
            method: "get",
            url: "/api/encrypt/result/"+index,
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = data.result;
                }
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })

        var parsedDirectory = result.encrypt_directory.split('/');
        var encDirectory = [parsedDirectory[0], ''];
        for (var i = 1; i < parsedDirectory.length; i++) {
            if (i == 1) encDirectory[1] += parsedDirectory[i];
            else encDirectory[1] += '/'+ parsedDirectory[i];
        }

        var fileList = result.fileList.split('\n');
        fileList = fileList.splice(0, fileList.length-1);
        return [encDirectory, fileList];
    },

    getFileUrl: function (bucketName, subDirectory, objectName) {
        var result = [];
        for(var i = 0; i < objectName.length; i++) {
            $.ajax({
                method: "post",
                url: "/api/encrypt/result/url",
                data: {
                    'bucketName': bucketName,
                    'objectName': subDirectory + '/' + objectName[i],
                    'fileName': objectName[i]
                },
                async: false,
                success: function (data) {
                    if (data.message == 'success') {
                        result.push(data.result);
                    }
                    // else alert(JSON.stringify(data));
                }, // success 
                error: function (xhr, status) {
                    alert("error : " + xhr + " : " + JSON.stringify(status));
                }
            })
        }
        return result;
    },

    getImageDetailHtml: function (urlList, mode, objectName) {
        var html = ''
        if (mode == 'single') {
            for (var i = 0; i < urlList.length; i++) {
                html += '<img src="' + urlList[i] + '">'
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
                            <img class="albumImg" src="'+urlList[i]+'">\
                            <div class="albumFooter">\
                                <p>'+objectName[i]+'</p>\
                                <div class="plusBtn">\
                                    <img class="plus_img" src="../../static/imgs/plusBtn.png">\
                                </div>\
                            </div>\
                        </div>'
                if (cur == i - 2 || i == urlList.length - 1) html += '</div>';
            }
        }
        return html;
    },

    getVideoDetailHtml: function (urlList, objectName) {
        var player = videojs("myPlayer", {
            sources : [
                { src : urlList[0], type : "video/mp4"}
            ],
            // poster : "test-poster.png",
            controls : true,
            playsinline : true,
            muted : true,
            preload : "metadata",
        });
    },

    getInfoHtml: function (index) {
        var result = ''
        var html = ''
        $.ajax({
            method: "get",
            url: "/api/request/encrypt/" + index,
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = data.result;
                    console.log(data.result);
                }
                // else alert(JSON.stringify(data));
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })

        var fileNameArray = result.request_file_list.split('\n');
        fileNameArray = fileNameArray.splice(0, fileNameArray.length - 1);
        var count = fileNameArray.length;
        var nameCount = (count > 1) ? ' 외 '+count+'장' : '';
        var type = (result.file_type == 'image') ? '이미지' : '비디오'
        var group = (count > 1) ? '그룹' : '';
        var restoration = (result.restoration == 1) ? 'O' : 'X';
        var date = new Date(result.request_date)
        html = '<div class="file_name">\
                    <p class="title">파일명 : </p>\
                    <p>'+fileNameArray[0]+ nameCount +'</p>\
                </div>\
                <div class="file_type">\
                    <p class="title">파일 타입 : </p>\
                    <p>'+type+' '+group+'</p>\
                </div>\
                <div class="file_reco">\
                    <p class="title">복호화 여부 : </p>\
                    <p>'+restoration+'</p>\
                </div>';
        
        if(restoration == 'O') {
            html += '<div class="file_key">\
                        <p class="title">복호화 키 : </p>\
                        <p>'+result.key_name+'</p>\
                    </div>';
        }

        html += '<div class="file_date">\
                    <p class="title">날짜 : </p>\
                    <p>'+dateFormat(date)+'</p>\
                </div>'

        if (group == '그룹' && type == '이미지') {
            html += '<div class="file_download" id="signedUrl">\
                        <p>이미지 일괄 다운로드</p>\
                    </div>\
                    <div class="file_recoConfirm">\
                        <p>전체 원본 복원하기</p>\
                    </div>\
                    <div class="select_recoConfirm">\
                        <p>선택 원본 복원하기</p>\
                    </div>'
        }
        else {
            html += '<a href="" id="signedUrl" download>\
                        <div class="file_download">\
                            <p>'+type+' 다운로드</p>\
                        </div>\
                    </a>\
                    <div class="file_recoConfirm">\
                        <p>원본 복원하기</p>\
                    </div>'
        }

        return html
    },

    fileToZip: function (options) {
        var bucketName = options.bucketName;
        var subDirectory = options.subDirectory;
        var fileListArray = JSON.stringify(options.fileName);

        $.ajax({
            method: "post",
            url: "/api/encrypt/result/file/zip",
            data: {
                bucketName,
                subDirectory,
                fileListArray
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    console.log(data);
                }
                // else alert(JSON.stringify(data));
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
    },

    deleteZipFile: function (bucketName, subDirectory) {
        var parameter = "/" + bucketName + "/" + encodeURIComponent(subDirectory);

        var result = false;
        $.ajax({
            method: "delete",
            url: "/api/encrypt/result/file/zip" + parameter,
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    console.log(data);
                    result = true;
                }
                else alert(JSON.stringify(data));
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
        return result;
    },
}