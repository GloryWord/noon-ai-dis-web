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
            url: "/util-module/api/login",
            data: postdata,
            success: function (data) {
                $(".auth_id").val($("#name").val())
                $("#authModal").addClass('active')
                // location.href = '/main';
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
                Swal.fire({
                    title: '로그인에 실패하였습니다.',
                    showConfirmButton:false,
                    showDenyButton:true,
                    denyButtonText:"확 인",
                    icon:"error"
                });
            }
        })
    },

    secondaryLogin: function (password) {
        var result = false;
        $.ajax({
            method: "post",
            url: "/util-module/api/user/check",
            data: {
                cur_password: password
            },
            async: false,
            success: function (data) {
                if(data.message == 'success') result = true;
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
                Swal.fire({
                    title: '로그인에 실패하였습니다.',
                    showConfirmButton:false,
                    showDenyButton:true,
                    denyButtonText:"확 인",
                    icon:"error"
                });
            }
        })
        return result;
    },

    subLogin: function (login_alias, account_name, password) {
        var postdata = { login_alias: login_alias, account_name: account_name, password: password };
        $.ajax({
            method: "post",
            url: "/util-module/api/subLogin",
            data: postdata,
            success: function (data) {
                console.log(data);
                $(".auth_id").val($("#name").val())
                $("#authModal").addClass('active')
                // location.href = '/main';
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
                Swal.fire({
                    title: '로그인에 실패하였습니다.',
                    showConfirmButton:false,
                    showDenyButton:true,
                    denyButtonText:"확 인",
                    icon:"error"
                });
            }
        })
    },

    verifyResetToken: function (accountName, token) {
        var validHtml = '<div class="passform">\
                        <p>새 비밀번호</p>\
                        <input type="password" id="password" maxlength="16" placeholder="신규 비밀번호를 입력해 주세요">\
                    </div>\
                    <div class="passform">\
                        <p>새 비밀번호 확인</p>\
                        <input type="password" id="repassword" maxlength="16" placeholder="신규 비밀번호를 확인해 주세요">\
                    </div>\
                    <div class="btn">\
                        <div id="confirm">\
                            <p>변경하기</p>\
                        </div>\
                        <div id="cancel">\
                            <a href="/">\
                                <p>취소</p>\
                            </a>\
                        </div>\
                    </div>';

        var invalidHtml = '<div>유효하지 않은 링크입니다.</div>\
                            <div>이미 만료 되었거나 인증시간이 초과 되었습니다 (10분 이내)</div>';

        var html;
        $.ajax({
            method: "get",
            url: "/util-module/api/token/verify/"+accountName+"/"+token,
            async: false,
            success: function (data) {
                if(data.message == 'success' && data.result == 'valid') html = validHtml;
                else if(data.message == 'success' && data.result == 'invalid') html = invalidHtml;
            },
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return html;
    },

    secondaryEmailSend: function (email) {
        let result ='';
        $.ajax({
            method: "post",
            url: "/util-module/api/secondary-email-send",
            data: {
                email
            },
            async: false,
            success: function (data) {
                if(data.message == 'success'){
                    result = data.verifyCode;
                    Swal.fire({
                        title: '인증번호 발송 완료',
                        text: '등록되어 있는 이메일 주소로 인증번호가 발송되었습니다.',
                        confirmButtonText: '확 인',
                        allowOutsideClick: false,
                        icon: 'success'
                    })
                } else {
                    alert("secondary email send failed.");
                }
            },
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    },

    authenticationVerify: function () {
        $.ajax({
            method: "post",
            url: "/util-module/api/authentication-verify",
            data: {
                email_verify: true
            },
            async: false,
            success: function (data) {
                console.log(data.message);
            },
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },

    isDevSession: function() {
        let dev_result = '';
        $.ajax({
            method: "get",
            url: "/util-module/api/is-dev-session",
            async: false,
            success: function (data) {
                console.log(data.message);
                dev_result = data.result;
            },
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return dev_result;
    },

    forgetPassword: function (accountName) {
        $.ajax({
            method: "post",
            url: "/util-module/api/forget-password",
            data: {
                accountName
            },
            success: function (data) {
                if(data.message == 'success') {
                    Swal.fire({
                        title: '메일 발송 완료',
                        text: '등록되어 있는 이메일 주소로 메일이 발송되었습니다.',
                        confirmButtonText: '확 인',
                        allowOutsideClick: false,
                        icon: 'success'
                    }).then((result) => {
                        if (result.isConfirmed) location.reload();
                    })
                }
                else if(data.message == 'error') {
                    Swal.fire({
                        title: 'ID를 다시 입력해 주세요',
                        text: data.log,
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    }).then((result) => {
                        if (result.isConfirmed) location.reload();
                    })
                }
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },

    resetPassword: function (accountName, password) {
        $.ajax({
            method: "post",
            url: "/util-module/api/reset-password",
            data: {
                accountName,
                password
            },
            success: function (data) {
                if(data.message == 'success') {
                    Swal.fire({
                        title: '비밀번호 변경 완료',
                        text: '새로운 비밀번호로 비밀번호 변경이 완료되었습니다!',
                        confirmButtonText: '확 인',
                        allowOutsideClick: false,
                        icon: 'success'
                    }).then((result) => {
                        if (result.isConfirmed) location.href = '/';
                    })
                }
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },
}