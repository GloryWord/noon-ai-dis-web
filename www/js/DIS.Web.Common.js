'use strict';

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
        var result = '';
        var resultStr = '';
        $.ajax({
            method: "get",
            url: "/api/user",
            async: false,
            success: function (data) {
                result = data
            },
            error: function (xhr, status) {
                alert(xhr + " : " + status);
            }
        });
        // resultStr = '<p>접속 서버 환경: ' + result.env + '</p>\
        //     <p>현재 테넌트: tenant-'+ result.tenant_id + '</p>\
        //     <p>유저 권한: '+ result.auth + '</p>\
        //     <p>회사명: '+ result.company_name + '</p>\
        //     <p>현재 아이디: '+ result.account_name + '</p>';
        resultStr = "<p>"+result.user_name+'님</p>'
        return resultStr;
    },

    getKeyList: function () {
        var result = '';
        var resultStr = '';
        $.ajax({
            method: "get",
            url: "/api/key",
            async: false,
            success: function (data) {
                result = data
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        if (!result.keyList) {
            for (var i = 0; i < result.length; i++) {
                resultStr += "<div class='dropdown_content' data-idx=" + result[i]['id'] + "><p>" + result[i]['key_name'] + "</p></div>"
            }
        }
        return resultStr;
    },

    getAuth: function () {
        var result = ''
        $.ajax({
            method: "get",
            url: "/api/user/auth",
            async: false,
            success: function (data) {
                result = data
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    secondaryLogin: async function () {
        await Swal.fire({
            title: '2차 인증',
            input: 'password',
            inputLabel: '정보 보호를 위하여 다시 한 번 로그인해 주시기 바랍니다',
            inputPlaceholder: '비밀번호를 입력해 주세요',
            inputAttributes: {
                maxlength: 10,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
        }).then((result) => {
            const password = result.value;
            if (result.isDismissed) location.href = '/submanage';
            if (password) {
                var verify = login.secondaryLogin(password);
                if (verify) Swal.fire('2차 인증이 완료되었습니다.', '', 'success')
                else Swal.fire('2차 인증에 실패하였습니다.', '', 'error').then(() => {
                    location.href = '/submanage';
                })
            }
        })
    },

    generateKey: function (genKeyName, keyMemo) {
        $.ajax({
            method: "post",
            url: "/api/key",
            data: { 
                'keyName': genKeyName,
                'keyMemo': keyMemo
             },
            success: function (data) {
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
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + JSON.stringify(status));
            }
        });
    },

    logout: function () {
        $.ajax({
            method: "get",
            url: "/api/logout",
            success: function (data) {
                location.href = '/';
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },    
    
    joinInfo: function(cur_password) {
        var postdata = {cur_password:cur_password}
        $.ajax({
            method: "post",
            url: "/api/user/check",
            data: postdata,
            async: false,
            success: function (data) {
                if(data.message == "success"){
                    location.href = '/myinfo';
                }
                else{
                    Swal.fire('비밀번호가 틀렸습니다.', '', 'error').then(() => {
                    })
                }
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return 0;
    },

    adminonly: function () {
        var auth = ''
        $.ajax({
            method: "get",
            url: "/api/get-auth",
            async: false,
            success: function (data) {
                auth = data.auth
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return auth
    },
}