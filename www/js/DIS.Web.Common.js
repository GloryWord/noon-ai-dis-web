'use strict';

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

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
    let files = document.getElementById("file").files;
    let myArray = {};
    let file = {};

    // manually create a new file obj for each File in the FileList
    for (let i = 0; i < files.length; i++) {
        let parsedArray = files[i].name.split('.');
        let ext = parsedArray[parsedArray.length - 1];
        parsedArray = parsedArray.splice(0, parsedArray.length - 1);
        let fileName = parsedArray.join('.');
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

function getFileNames() {
    let files = document.getElementById("file").files;
    let myArray = {};
    let file = {};

    // manually create a new file obj for each File in the FileList
    for (let i = 0; i < files.length; i++) {
        let parsedArray = files[i].name.split('.');
        let ext = parsedArray[parsedArray.length - 1];
        parsedArray = parsedArray.splice(0, parsedArray.length - 1);
        let fileName = parsedArray.join('.');
        file = {
            'name': fileName + '.' + ext
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

function time_change(duration) {
    var hours = Math.floor(duration / 3600);
    var minutes = Math.floor((duration - (hours * 3600)) / 60);
    var seconds = Math.floor(duration - (hours * 3600) - (minutes * 60));

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    if(hours=="00"){
        return minutes + '분 ' + seconds + '초';
    }
    else {
        return hours + '시 ' + minutes + '분 ' + seconds + '초';
    }
}

function onlyNumber(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ((keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39)
        return;
    else
        return false;
}

function removeChar(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if (keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39)
        return;
    else event.target.value = event.target.value.replace(/[^0-9]/g, "");
}

function price_three(price) {
    var result = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result
}

function apiUrlConverter(endpoint, baseUrl) {
    if (location.host === 'dis.noonai.kr') {
        return `https://${endpoint}-api.noonai.kr${baseUrl}`
    }
    else if (endpoint === 'socket') {
        return ''
    }
    else {
        return `/${endpoint}-module${baseUrl}`
    }
}

/** 
 * DIS 네임스페이스
 * @author 이민형(2022.07.20)
 * @namespace DIS 
 */
var DIS = DIS || {};

/**
 * DIS.Web 네임스페이스
 * @namespace DIS.Web
 */
DIS.Web = DIS.Web || {};

/**
 * DIS.Web.Common 네임스페이스
 * @class DIS.Web.Common
 */
DIS.Web.Common = DIS.Web.Common || {};

/**
 * DIS.Web.Common 클래스를 참조하는 글로벌 멤버 변수
 * @interface comm
 */
var comm = DIS.Web.Common;
comm = {
    /**
     * 사용자 로그인시 사용되는 공통 메서드 입니다.
     * @param {string} userId 회원 아이디
     * @param {string} password 회원 비밀번호
     */

    getUser: function () {
        let baseUrl = '/api/user'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var result = '';
        var resultStr = '';
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result = data;
            },
            error: function (xhr, status) {
                location.href = '/error'
                // alert(xhr + " : " + status);
            }
        });
        resultStr = "<p>" + result.user_name + '님</p>'
        return resultStr;
    },

    getKeyList: function () {
        let baseUrl = '/api/key'
        let apiUrl = apiUrlConverter('key', baseUrl)

        var result = '';
        var resultStr = '';
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result = data
            },
            error: function (xhr, status) {

            }
        });

        if (result.keyList) {
            let curDateTime = moment();
            for (var i = 0; i < result['keyList'].length; i++) {
                let expiry_notification = (result['keyList'][i]['expiry_notification'] === 1) ? true : false;
                let expiry_datetime = result['keyList'][i]['expiry_datetime'];
                let validUntil = moment(expiry_datetime).diff(curDateTime, 'days')
                resultStr += `<div class='dropdown_content' data-idx="${result['keyList'][i]['id']}" data-valid="${validUntil}" data-notification="${expiry_notification}">
                                <p>${result['keyList'][i]['key_name']}</p>
                            </div>`
            }
        }
        return resultStr;
    },

    getAuth: function () {
        let baseUrl = '/api/user/auth'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var result = ''
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.statusCode == 200) result = data.userAuth;
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    secondaryLogin: async function () {
        await Swal.fire({
            title: '2차 인증',
            input: 'password',
            text: `정보 보호를 위하여 다시 한 번 로그인해 주시기 바랍니다`,
            inputPlaceholder: '비밀번호를 입력해 주세요',
            inputAttributes: {
                maxlength: 16,
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            showCancelButton: true,
        }).then((result) => {
            const password = result.value;
            if (result.isDismissed) location.href = '/submanage';
            if (password) {
                var verify = login.secondaryLogin(password);
                if (verify) Swal.fire('2차 인증이 완료되었습니다.', '', 'success')
                else Swal.fire({
                    title: '2차 인증에 실패하였습니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                }).then(() => {
                    location.href = '/submanage';
                })
            }
            else {
                location.href = '/submanage';
            }
        })
    },

    generateKey: function (genKeyName, keyMemo) {
        let encodedKeyName = escapeHTML(genKeyName);
        let encodedKeyMemo = escapeHTML(keyMemo);
        let baseUrl = '/api/key'
        let apiUrl = apiUrlConverter('key', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                'keyName': encodedKeyName,
                'keyMemo': encodedKeyMemo
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.message == 'success') {
                    new Promise((resolve, reject) => {
                        download(data.privateKey, data.keyName + ".pem", "text/plain")
                        resolve();
                    }).then(() => {
                        Swal.fire('키 발급이 완료되었습니다.', '', 'success').then(() => {
                            if (window.location.pathname == '/key') {
                                location.reload();
                            }
                            else {
                                $("#selectKeyName").html(comm.getKeyList());
                                $("#genKeyName").attr("disabled", true);
                            }
                        })
                    })
                }
                else if (data.message == 'fail') {
                    Swal.fire({
                        title: '동일 이름의 키가 존재합니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    }).then(() => {
                        if (window.location.pathname == '/encrypt/image' || window.location.pathname == '/encrypt/video') {
                            location.reload();
                        }
                    });
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + JSON.stringify(status));
            }
        });
    },

    logout: function () {
        let baseUrl = '/api/logout'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                location.href = '/';
            }, // success 
            error: function (xhr, status) {
                console.log('logout failed');
            }
        })
    },

    joinInfo: function (cur_password = null) {
        let baseUrl = '/api/user/check'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var postdata = { cur_password: cur_password }

        let verify = false;
        $.ajax({
            method: "post",
            url: apiUrl,
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                verify = data.verify;
                // location.href = "/myinfo";
            },
            error: function (xhr, status) {
                if (xhr.responsJSON.message === 'password is not matching') {
                    Swal.fire({
                        title: '비밀번호가 틀렸습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            }
        });

        return verify;
    },

    expireJoinInfo: function () {
        let baseUrl = '/api/user/check/expire'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "GET",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {

            },
            error: function (xhr, status) {

            }
        });
    },

    adminonly: function () {
        let baseUrl = '/api/get-auth'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var auth = ''
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                auth = data.auth
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return auth
    },

    meterEncrypt: function (fileNameList, fileWidth, fileHeight, requestIndex, restoration) {
        let baseUrl = '/api/meterUsage/encrypt'
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        // var fileNameList = getFiles();
        var strFileWidth = JSON.stringify(fileWidth)
        var strFileHeight = JSON.stringify(fileHeight)
        let requestType = 'encrypt';
        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                fileNameList,
                strFileWidth,
                strFileHeight,
                requestIndex,
                restoration,
                requestType
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.message == "success") {

                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    },

    meterDecrypt: function (requestIndex, fileNameList, fileType) {
        console.log(requestIndex);
        let baseUrl = '/api/meterUsage/decrypt'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                requestIndex,
                fileNameList,
                fileType,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.message == "success") {

                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    },

    meterDownload: function (requestIndex, fileType, fileName, fileSize) {
        let baseUrl = '/api/meterUsage/download'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                requestIndex,
                fileType,
                fileName,
                fileSize
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.message == "success") {

                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    },

    meterAdditionalEncrypt: function(requestID, fileNames, type) {
        let baseUrl = '/api/meterUsage/encrypt/additional';
        let apiUrl = apiUrlConverter('encrypt', baseUrl);

        let postData = {
            requestID,
            fileNames,
            type
        }
        $.ajax({
            method: "post",
            url: apiUrl,
            data: postData,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.message == "success") {
                    
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    },

    loggingEncrypt: function (requestIndex) {
        let baseUrl = '/api/logging'
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                requestIndex,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.message == "success") {
                    console.log(data.result)
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    },

    loggingDecrypt: function (requestIndex) {
        let baseUrl = '/api/logging'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                requestIndex,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.message == "success") {
                    console.log(data.result)
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    },

    getEnv: function () {
        let baseUrl = '/api/env'
        let apiUrl = apiUrlConverter('util', baseUrl)
        let env = null;

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.message === 'success') {
                    env = data.env;
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
        return env;
    },

    increaseRequestCount: function(requestIndex, fileNames, requestType) {
        let baseUrl = `/api/request/additional/increaseCount`;
        let apiUrl = apiUrlConverter('util', baseUrl);
        $.ajax({
            method: "PATCH",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'requestIndex': requestIndex,
                'fileNames': fileNames,
                'requestType': requestType
            },
            async: false,
            success: function() {
                
            },
            error: function(xhr, status) {

            }
        })
    },

    parseCoordWebToTriton: function (curCoordinates) {
        let keys = Object.keys(curCoordinates)
        let parsedCurCoordinates = {};
        if (keys.length === 0) return false;
        else {
            for (let i = 0; i < keys.length; i++) {
                let curClass = curCoordinates[i].class
                if (!parsedCurCoordinates[curClass]) parsedCurCoordinates[curClass] = {};
                if (!parsedCurCoordinates[curClass]['real']) parsedCurCoordinates[curClass]['real'] = []
                if (!parsedCurCoordinates[curClass]['canvas']) parsedCurCoordinates[curClass]['canvas'] = []

                // //좌상단
                // let leftTop = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1]]

                // //우하단
                // let rightBottom = [curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                // parsedCurCoordinates[curClass]['real'].push([leftTop, rightBottom])
                let loc = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1], curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                parsedCurCoordinates[curClass]['real'].push(loc)

                // leftTop = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1]]
                // rightBottom = [curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                // parsedCurCoordinates[curClass]['canvas'].push([leftTop, rightBottom])
                loc = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1], curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                parsedCurCoordinates[curClass]['canvas'].push(loc)
            }
        }
        return parsedCurCoordinates;
    },

    parseCoordTritonToWeb: async function (curCoordinates) {
        console.log(curCoordinates)
        let canvasCoord = [];
        let originCoord = [];
        let classArray = [];
        let keys = '';
        if (curCoordinates) {
            keys = Object.keys(curCoordinates);

            for (let i = 0; i < keys.length; i++) {
                console.log(curCoordinates[0])
                for (let j = 0; j < curCoordinates[keys[i]].canvas.length; j++) {
                    //canvas 좌상단, 우하단
                    let canvasLeftTop = [curCoordinates[keys[i]].canvas[j][0], curCoordinates[keys[i]].canvas[j][1]]
                    let canvasRightBottom = [curCoordinates[keys[i]].canvas[j][2], curCoordinates[keys[i]].canvas[j][3]]
                    //real 좌상단, 우하단
                    let realLeftTop = [curCoordinates[keys[i]].real[j][0], curCoordinates[keys[i]].real[j][1]]
                    let realRightBottom = [curCoordinates[keys[i]].real[j][2], curCoordinates[keys[i]].real[j][3]]

                    canvasCoord.push([canvasLeftTop, canvasRightBottom])
                    originCoord.push([realLeftTop, realRightBottom])
                    classArray.push(Number(keys[i]))
                }
            }
            console.log(classArray)
            console.log(canvasCoord)
        }

        return {
            'canvasCoord': canvasCoord,
            'originCoord': originCoord,
            'classArray': classArray
        };
    },

    parseCoordWebToTritonVideo: function (type, restoration, curCoordinates, frameNumber) {
        let keys = Object.keys(curCoordinates)
        let parsedCurCoordinates = {};
        if (keys.length === 0) return false;
        else {
            if (restoration == 0) {
                if (type == "fix") {
                    for (let i = 0; i < keys.length; i++) {
                        let curClass = curCoordinates[i].class
                        if (!parsedCurCoordinates[curClass]) parsedCurCoordinates[curClass] = {};
                        if (!parsedCurCoordinates[curClass]['real']) parsedCurCoordinates[curClass]['real'] = []
                        if (!parsedCurCoordinates[curClass]['canvas']) parsedCurCoordinates[curClass]['canvas'] = []

                        // //좌상단
                        // let leftTop = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1]]

                        // //우하단
                        // let rightBottom = [curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                        // parsedCurCoordinates[curClass]['real'].push([leftTop, rightBottom])
                        let loc = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1], curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                        parsedCurCoordinates[curClass]['real'].push(loc)

                        // leftTop = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1]]
                        // rightBottom = [curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                        // parsedCurCoordinates[curClass]['canvas'].push([leftTop, rightBottom])
                        loc = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1], curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                        parsedCurCoordinates[curClass]['canvas'].push(loc)
                    }
                }
                else {
                    for (let i = 0; i < keys.length; i++) {
                        let curClass = curCoordinates[i].class
                        if (!parsedCurCoordinates[curClass]) parsedCurCoordinates[curClass] = {};
                        if (!parsedCurCoordinates[curClass]['real']) parsedCurCoordinates[curClass]['real'] = []
                        if (!parsedCurCoordinates[curClass]['canvas']) parsedCurCoordinates[curClass]['canvas'] = []

                        let loc = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1], curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                        parsedCurCoordinates[curClass]['real'].push(loc)

                        loc = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1], curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                        parsedCurCoordinates[curClass]['canvas'].push(loc)
                    }
                }
            }
            else {
                if (type == "fix") {
                    for (let i = 0; i < keys.length; i++) {
                        let curClass = curCoordinates[i].class
                        if (!parsedCurCoordinates[curClass]) parsedCurCoordinates[curClass] = {};
                        if (!parsedCurCoordinates[curClass]['real']) parsedCurCoordinates[curClass]['real'] = []
                        if (!parsedCurCoordinates[curClass]['canvas']) parsedCurCoordinates[curClass]['canvas'] = []

                        // //좌상단
                        // let leftTop = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1]]

                        // //우하단
                        // let rightBottom = [curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                        // parsedCurCoordinates[curClass]['real'].push([leftTop, rightBottom])
                        let loc = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1], curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                        parsedCurCoordinates[curClass]['real'].push(loc)

                        // leftTop = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1]]
                        // rightBottom = [curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                        // parsedCurCoordinates[curClass]['canvas'].push([leftTop, rightBottom])
                        loc = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1], curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                        parsedCurCoordinates[curClass]['canvas'].push(loc)
                    }
                }
                else{
                    for (let i = 0; i < keys.length; i++) {
                        let curClass = curCoordinates[i].class
                        let classID = curCoordinates[i].objectID
                        if (!parsedCurCoordinates[curClass]) parsedCurCoordinates[curClass] = {};
                        if (!parsedCurCoordinates[curClass][classID]) parsedCurCoordinates[curClass][classID] = {};
                        if (!parsedCurCoordinates[curClass][classID]['real']) parsedCurCoordinates[curClass][classID]['real'] = []
                        if (!parsedCurCoordinates[curClass][classID]['canvas']) parsedCurCoordinates[curClass][classID]['canvas'] = []

                        let loc = [curCoordinates[i]['real'][0], curCoordinates[i]['real'][1], curCoordinates[i]['real'][2], curCoordinates[i]['real'][3]]
                        parsedCurCoordinates[curClass][classID]['real'].push(loc)

                        loc = [curCoordinates[i]['canvas'][0], curCoordinates[i]['canvas'][1], curCoordinates[i]['canvas'][2], curCoordinates[i]['canvas'][3]]
                        parsedCurCoordinates[curClass][classID]['canvas'].push(loc)
                    }
                }
            }
        }
        return parsedCurCoordinates;
    },

    parseCoordTritonToWebVideo: async function (type, restoration, curCoordinates) {
        console.log(curCoordinates)
        let canvasCoord = [];
        let originCoord = [];
        let classArray = [];
        let keys = '';
        if (restoration == 0) {
            if (type == "fix") {
                if (curCoordinates) {
                    keys = Object.keys(curCoordinates);

                    for (let i = 0; i < keys.length; i++) {
                        for (let j = 0; j < curCoordinates[keys[i]].canvas.length; j++) {
                            //canvas 좌상단, 우하단
                            let canvasLeftTop = [curCoordinates[keys[i]].canvas[j][0], curCoordinates[keys[i]].canvas[j][1]]
                            let canvasRightBottom = [curCoordinates[keys[i]].canvas[j][2], curCoordinates[keys[i]].canvas[j][3]]
                            //real 좌상단, 우하단
                            let realLeftTop = [curCoordinates[keys[i]].real[j][0], curCoordinates[keys[i]].real[j][1]]
                            let realRightBottom = [curCoordinates[keys[i]].real[j][2], curCoordinates[keys[i]].real[j][3]]
        
                            canvasCoord.push([canvasLeftTop, canvasRightBottom])
                            originCoord.push([realLeftTop, realRightBottom])
                            classArray.push(Number(keys[i]))
                        }
                    }
                    console.log(classArray)
                    console.log(canvasCoord)
                }

                return {
                    'canvas': canvasCoord,
                    'origin': originCoord,
                    'class': classArray
                };
            }
            else {
                if (curCoordinates) {
                    keys = Object.keys(curCoordinates);
                    console.log(keys)

                    for (let i = 0; i < keys.length; i++) {
                        if( curCoordinates[keys[i]].canvas){
                            for (let j = 0; j < curCoordinates[keys[i]].canvas.length; j++) {
                                //canvas 좌상단, 우하단
                                let canvasLeftTop = [curCoordinates[keys[i]].canvas[j][0], curCoordinates[keys[i]].canvas[j][1]]
                                let canvasRightBottom = [curCoordinates[keys[i]].canvas[j][2], curCoordinates[keys[i]].canvas[j][3]]
                                //real 좌상단, 우하단
                                let realLeftTop = [curCoordinates[keys[i]].real[j][0], curCoordinates[keys[i]].real[j][1]]
                                let realRightBottom = [curCoordinates[keys[i]].real[j][2], curCoordinates[keys[i]].real[j][3]]
            
                                canvasCoord.push([canvasLeftTop, canvasRightBottom])
                                originCoord.push([realLeftTop, realRightBottom])
                                classArray.push(Number(keys[i]))
                            }
                        }
                    }
                }

                return {
                    'canvas': canvasCoord,
                    'origin': originCoord,
                    'class': classArray
                };
            }
        }
        else {
            if (type == "fix") {
                if (curCoordinates) {
                    keys = Object.keys(curCoordinates);

                    for (let i = 0; i < keys.length; i++) {
                        for (let j = 0; j < curCoordinates[keys[i]].canvas.length; j++) {
                            //canvas 좌상단, 우하단
                            let canvasLeftTop = [curCoordinates[keys[i]].canvas[j][0], curCoordinates[keys[i]].canvas[j][1]]
                            let canvasRightBottom = [curCoordinates[keys[i]].canvas[j][2], curCoordinates[keys[i]].canvas[j][3]]
                            //real 좌상단, 우하단
                            let realLeftTop = [curCoordinates[keys[i]].real[j][0], curCoordinates[keys[i]].real[j][1]]
                            let realRightBottom = [curCoordinates[keys[i]].real[j][2], curCoordinates[keys[i]].real[j][3]]
        
                            canvasCoord.push([canvasLeftTop, canvasRightBottom])
                            originCoord.push([realLeftTop, realRightBottom])
                            classArray.push(Number(keys[i]))
                        }
                    }
                    console.log(classArray)
                    console.log(canvasCoord)
                }

                return {
                    'canvas': canvasCoord,
                    'origin': originCoord,
                    'class': classArray
                };
            }
            else {
                let objectArray = []
                if (curCoordinates) {
                    keys = Object.keys(curCoordinates);
                    console.log(keys)

                    for (let i = 0; i < keys.length; i++) {
                        let objectKeys = Object.keys(curCoordinates[keys[i]]);
                        console.log(objectKeys)
                        for(let j=0;j<objectKeys.length;j++){
                            if( curCoordinates[keys[i]][objectKeys[j]].canvas){
                                for (let k = 0; k < curCoordinates[keys[i]][objectKeys[j]].canvas.length; k++) {
                                    //canvas 좌상단, 우하단
                                    let canvasLeftTop = [curCoordinates[keys[i]][objectKeys[j]].canvas[k][0], curCoordinates[keys[i]][objectKeys[j]].canvas[k][1]]
                                    let canvasRightBottom = [curCoordinates[keys[i]][objectKeys[j]].canvas[k][2], curCoordinates[keys[i]][objectKeys[j]].canvas[k][3]]
                                    //real 좌상단, 우하단
                                    let realLeftTop = [curCoordinates[keys[i]][objectKeys[j]].real[k][0], curCoordinates[keys[i]][objectKeys[j]].real[k][1]]
                                    let realRightBottom = [curCoordinates[keys[i]][objectKeys[j]].real[k][2], curCoordinates[keys[i]][objectKeys[j]].real[k][3]]
                
                                    canvasCoord.push([canvasLeftTop, canvasRightBottom])
                                    originCoord.push([realLeftTop, realRightBottom])
                                    classArray.push(Number(keys[i]))
                                    objectArray.push(Number(objectKeys[j]))
                                }
                            }
                        }
                    }
                }

                return {
                    'canvas': canvasCoord,
                    'origin': originCoord,
                    'class': classArray,
                    'objectID': objectArray
                };
            }
        }
    },

    test: function (requestIndex) {
        let keyIndex = requestIndex;
        let baseUrl = '/api/test'
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                keyIndex,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                console.log(data.result);
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    }
}