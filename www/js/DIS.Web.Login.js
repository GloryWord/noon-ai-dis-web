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
        let baseUrl = '/api/login'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var postdata = { account_name: account_name, password: password };
        $.ajax({
            method: "post",
            url: apiUrl,
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                location.href = "/main";
            },
            error: function (xhr, status) {
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

    firstLogin: function (account_name, password) {
        let baseUrl = '/api/first-login'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let postdata = { account_name: account_name, password: password };
        let master_tenant_id = '';
        $.ajax({
            method: "post",
            url: apiUrl,
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                $(".auth_id").val($("#name").val());
                $("#authModal").addClass('active');
                master_tenant_id = data.tenant_id;
            },
            error: function (xhr, status) {
                Swal.fire({
                    title: '로그인에 실패하였습니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        })
        return master_tenant_id;
    },

    secondaryLogin: function (password) {
        let baseUrl = '/api/user/check'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var result = false;
        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                cur_password: password
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result = true;
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

    getSubEmail: function (account_name, tenant_id) {
        let baseUrl = '/api/getSubEmail'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let subEmail = '';
        $.ajax({
            method: "post",
            url: apiUrl,
            data : {
                account_name: account_name,
                tenant_id: tenant_id
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                subEmail = data.email;
            },
            error: function (xhr, status) {
                alert("서브 계정 email을 가져올 수 없습니다.");
            }
        })
        return subEmail;
    },

    subLogin: function (login_alias, account_name, password) {
        let baseUrl = '/api/subLogin'
        let apiUrl = apiUrlConverter('util', baseUrl)

        var postdata = { login_alias: login_alias, account_name: account_name, password: password };
        $.ajax({
            method: "post",
            url: apiUrl,
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                location.href = "/main";
            },
            error: function (xhr, status) {
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

    firstSubLogin: function (login_alias, account_name, password) {
        let baseUrl = '/api/first-login-sub'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let postdata = { login_alias: login_alias, account_name: account_name, password: password };
        let master_tenant_id = '';
        $.ajax({
            method: "post",
            url: apiUrl,
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                let subEmail = login.getSubEmail(account_name, data.tenant);
                $(".auth_id").val(subEmail);
                $("#authModal").addClass('active');
                master_tenant_id = data.tenant;
            },
            error: function (xhr, status) {
                Swal.fire({
                    title: '로그인에 실패하였습니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
        })
        return master_tenant_id;
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

        let baseUrl = '/api/token/verify'
        let apiUrl = apiUrlConverter('util', baseUrl)
        
        $.ajax({
            method: "get",
            url: `${apiUrl}/${accountName}/${token}`,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message == 'success' && data.result == 'valid') html = validHtml;
                else if(data.message == 'success' && data.result == 'invalid') html = invalidHtml;
            },
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return html;
    },

    secondaryEmailSend: function (email) {
        let baseUrl = '/api/secondary-email-send'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let result ='';
        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                email
            },
            xhrFields: {
                withCredentials: true
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
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    },

    authenticationVerify: function () {
        let baseUrl = '/api/authentication-verify'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                email_verify: true
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
            },
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },
    
    forgetPassword: function (accountName) {
        let baseUrl = '/api/forget-password'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
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
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },

    resetPassword: function (accountName, password) {
        let baseUrl = '/api/reset-password'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                accountName,
                password
            },
            xhrFields: {
                withCredentials: true
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
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },

    sessionCheck: function() {
        let baseUrl = '/api/session-check'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message == "success"){
                    location.href = "/main"
                }
                else{
                    return 0
                }
            },
            error: function (xhr, status) {
                //console.log("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return 0;
    },
}