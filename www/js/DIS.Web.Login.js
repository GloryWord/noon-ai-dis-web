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
                console.log(JSON.stringify(data));
                location.href = '/main';
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
                Swal.fire('로그인에 실패하였습니다.', '', 'error');
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
                Swal.fire('로그인에 실패하였습니다.', '', 'error');
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
                location.href = '/main';
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
                Swal.fire('로그인에 실패하였습니다.', '', 'error');
            }
        })
    },

    verifyResetToken: function (accountName, token) {
        var validHtml = '<span>※ 변경하실 새로운 비밀번호를 입력해 주세요</span>\
                    <br>\
                    <div class="passform">\
                        <p>새 비밀번호</p>\
                        <input type="password" id="password" maxlength="16" placeholder="신규 비밀번호를 입력해 주세요">\
                    </div>\
                    <div class="passform">\
                        <p>새 비밀번호 확인</p>\
                        <input type="password" id="repassword" maxlength="16" placeholder="신규 비밀번호를 확인해 주세요">\
                    </div>\
                    <div class="btnArea">\
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
                console.log(data);
                if(data.message == 'success' && data.result == 'valid') html = validHtml;
                else if(data.message == 'success' && data.result == 'invalid') html = invalidHtml;
            },
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return html;
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
                        confirmButtonText: '확인',
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
                        confirmButtonText: '확인',
                        allowOutsideClick: false,
                        icon: 'error'
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
                        confirmButtonText: '확인',
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