'use strict';

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
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
    var files = document.getElementById("file").files;
    var myArray = {};
    var file = {};

    // manually create a new file obj for each File in the FileList
    for (var i = 0; i < files.length; i++) {
        var parsedArray = files[i].name.split('.');
        var ext = parsedArray[parsedArray.length - 1];
        parsedArray = parsedArray.splice(0, parsedArray.length - 1);
        var fileName = parsedArray.join('.');
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

function time_change(duration) {
    var hours = Math.floor(duration / 3600);
    var minutes = Math.floor((duration - (hours * 3600)) / 60);
    var seconds = Math.floor(duration - (hours * 3600) - (minutes * 60));

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
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

function price_three(price){
    var result = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result
}

function apiUrlConverter(endpoint, baseUrl) {
    if(location.host === 'dis.noonai.kr') {
        return `https://${endpoint}-api.noonai.kr${baseUrl}`
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
        resultStr = "<p>"+result.user_name+'님</p>'
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
            for (var i = 0; i < result['keyList'].length; i++) {
                resultStr += "<div class='dropdown_content' data-idx=" + result['keyList'][i]['id'] + "><p>" + result['keyList'][i]['key_name'] + "</p></div>"
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
                if(data.statusCode == 200) result = data.userAuth;
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
                    showConfirmButton:false,
                    showDenyButton:true,
                    denyButtonText:"확 인",
                    icon:"error"
                }).then(() => {
                    location.href = '/submanage';
                })
            }
            else{
                location.href = '/submanage';
            }
        })
    },

    generateKey: function (genKeyName, keyMemo) {
        let baseUrl = '/api/key'
        let apiUrl = apiUrlConverter('key', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: { 
                'keyName': genKeyName,
                'keyMemo': keyMemo
             },
             xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if(data.message == 'success') {
                    new Promise((resolve, reject) => {
                        download(data.privateKey, data.keyName + ".pem", "text/plain")
                        resolve();
                    }).then(() => {
                        Swal.fire('키 발급이 완료되었습니다.', '', 'success').then(() => {
                            if(window.location.pathname == '/key') {
                                location.reload();
                            }
                            else {
                                $("#selectKeyName").html(comm.getKeyList());
                                $("#genKeyName").attr("disabled", true);    
                            }
                        })
                    })
                }
                else if(data.message == 'fail') {
                    Swal.fire({
                        title:'동일 이름의 키가 존재합니다.',
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    }).then(() => {
                        if(window.location.pathname == '/encrypt/image' || window.location.pathname == '/encrypt/video') {
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
    
    joinInfo: function(cur_password) {
        let baseUrl = '/api/user/check'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var postdata = {cur_password:cur_password}
        $.ajax({
            method: "post",
            url: apiUrl,
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                location.href = "/myinfo" + "?auth=1";
            },
            error: function (xhr, status) {
                Swal.fire({
                    title: '비밀번호가 틀렸습니다.',
                    showConfirmButton:false,
                    showDenyButton:true,
                    denyButtonText:"확 인",
                    icon:"error"
                });
            }
        });

        return 0;
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
        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                fileNameList,
                strFileWidth,
                strFileHeight,
                requestIndex,
                restoration
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message == "success"){
                    
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    },

    meterDecrypt: function (requestIndex, fileNameList, fileType) {
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
                if(data.message == "success"){
                    
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
                if(data.message == "success"){
                    
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
    }
}