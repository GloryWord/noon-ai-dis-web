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

    getHtml: function (urlList, mode, objectName) {
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

    getFileToZip: function (options) {
        var id = options.id;
        var bucketName = options.bucketName;
        var subDirectory = options.subDirectory;
        var parameter = "/" + id + "/" + bucketName + "/" + subDirectory;
        $.ajax({
            method: "get",
            url: "/api/encrypt/result/file"+parameter,
            success: function (data) {
                console.log(data);
                if (data.message == 'success') {
                    
                }
                // else alert(JSON.stringify(data));
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
    },
}