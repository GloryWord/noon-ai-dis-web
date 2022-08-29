'use strict';

/**
 * DIS.Web.Login 네임스페이스
 * @class DIS.Web.Login
 */
DIS.Web.Login = DIS.Web.Login || {};

/**
 * DIS.Web.Login 클래스를 참조하는 글로벌 멤버 변수
 * @interface login
 */
var login = DIS.Web.Login;
login = {
    /**
     * 유저 로그인 메서드 입니다.
     */
    login: function (account_name, password) {
        var postdata = { account_name: account_name, password: password };
        $.ajax({
            method: "post",
            url: "/api/login",
            data: postdata,
            success: function (data) {
                console.log(JSON.stringify(data));
                location.href = '/main';
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
    },

    secondaryLogin: function (password) {
        var result = false;
        $.ajax({
            method: "post",
            url: "/api/login/secondary",
            data: {
                password
            },
            async: false,
            success: function (data) {
                if(data.message == 'success') result = true;
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })
        return result;
    },

    subLogin: function (login_alias, account_name, password) {
        var postdata = { login_alias: login_alias, account_name: account_name, password: password };
        $.ajax({
            method: "post",
            url: "/api/subLogin",
            data: postdata,
            success: function (data) {
                console.log(data);
                location.href = '/main';
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
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

    signup: function (account_name, password, repassword) {
        if(password == repassword) {
            $.ajax({
                method: "post",
                url: "/api/signup",
                data: {
                    account_name,
                    password,
                },
                success: function (data) {
                    if (data.message == 'success') {
                        // $.ajax({
                        //     method: "post",
                        //     url: "/api/createBucket",
                        //     data: {
                        //         account_name
                        //     },
                        //     success: function (data) {
                        //         console.log(data.log)
                        //     },
                        //     error: function (xhr, status) {
                        //         alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
                        //     }
                        // })
                        alert('회원가입이 완료되었습니다.')
                        window.location = '/'
                    } else {
                        alert(JSON.stringify(data));
                    }
                }, // success 
                error: function (xhr, status) {
                    alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
                }
            })
        }
        else {
            alert("비밀번호 입력이 불일치합니다.")
        }
    },

    joinInfo: function(cur_password) {
        var postdata = {cur_password:cur_password}
        $.ajax({
            method: "post",
            url: "/api/join-info",
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