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
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
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
                let lockStatus = null;
                let loginable = false;

                lockStatus = login.selectLockStatus('tenant', '', account_name);
                loginable = lockStatus.loginable

                if (loginable) {
                    $(".auth_id").val($("#name").val());
                    $("#authModal").addClass('active');
                }
                else {
                    login.resetPasswordAfterLock(account_name);
                }
                master_tenant_id = data.tenant_id;
            },
            error: function (xhr, status) {
                if (xhr.responseJSON.reason !== 'ID not found') {
                    let loginFailCount = 0;
                    loginFailCount = login.plusLoginFailCount('tenant', '', account_name);
                    let lock_count = Math.floor(loginFailCount / 5)
                    if (loginFailCount >= 5) login.updateLockStatus('tenant', '', account_name, lock_count);
                }

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
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
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
            data: {
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
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
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
                let lockStatus = null;
                let loginable = false;
                let activateTime = null;
                master_tenant_id = data.tenant;

                lockStatus = login.selectLockStatus('sub-account', master_tenant_id, account_name);
                loginable = lockStatus.loginable;
                activateTime = lockStatus.activateTime

                if (loginable) {
                    let subEmail = login.getSubEmail(account_name, master_tenant_id);
                    $(".auth_id").val(subEmail);
                    $("#authModal").addClass('active');
                }
                else {
                    Swal.fire({
                        title: '계정 로그인 비활성화',
                        text: `소속된 기관의 관리자를 통해 잠금을 해제해 주세요.`,
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    });
                }
            },
            error: function (xhr, status) {
                let reason = xhr.responseJSON.message;

                if (reason !== 'ID not found' && reason !== 'tenant not found') {
                    let tenant_id = xhr.responseJSON.tenant_id;
                    let loginFailCount = 0;
                    loginFailCount = login.plusLoginFailCount('sub-account', tenant_id, account_name);
                    let lock_count = Math.floor(loginFailCount / 5)
                    
                    if (loginFailCount >= 5)  {
                        login.updateLockStatus('sub-account', tenant_id, account_name, lock_count); 
                        Swal.fire({
                            title: '계정 로그인 비활성화',
                            text: `소속된 기관의 관리자를 통해 잠금을 해제해 주세요.`,
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    } else {
                        Swal.fire({
                            title: '로그인에 실패하였습니다.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    }
                }
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
                            <a href="/login">\
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
                if (data.message === 'error') location.href = '/';
                if (data.message == 'success' && data.result == 'valid') html = validHtml;
                else if (data.message == 'success' && data.result == 'invalid') html = invalidHtml;
            },
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return html;
    },

    secondaryEmailSend: function (account_name) {
        let baseUrl = '/api/secondary-email-send'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let result = '';
        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                account_name
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = data.verifyId
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

    verifyOTP: function (id, verifyCode) {
        let baseUrl = '/api/verifyOTP'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let verify = false;
        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                id,
                verifyCode
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.message == '2차 인증번호 확인') {
                    if (data.verify === true) verify = true;
                }
            },
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return verify;
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

    forgetPassHtml: function () {
        let html = `<p>이름, 가입시 등록한 휴대전화 번호 확인 후 이메일로 인증번호가 발송됩니다.</p>
            <p>이름</p>
                <div class="emailArea">
                    <input type="email" class="find_id" value="" id="user_name" placeholder="이름">
                </div>
            <p>휴대전화 번호</p>
                <div class="emailArea">
                    <input type="email" class="find_id" value="" id="telephone" placeholder="휴대전화 번호(-제외)">
                    <div class="auth_send" id="email_send">
                        <h3>인증번호 발송</h3>
                    </div>
                </div>
                `
        return html;
    },

    resetPassword: function (account_name, user_name, telephone) {
        let baseUrl = '/api/reset-password'
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                account_name,
                user_name,
                telephone
            },
            success: function (data) {
                console.log(data);
                if (data.message == 'success') {
                    Swal.fire({
                        title: '메일 발송 완료',
                        text: '등록되어 있는 이메일 주소로 임시 비밀번호가 발송되었습니다.',
                        confirmButtonText: '확 인',
                        allowOutsideClick: false,
                        icon: 'success'
                    }).then((result) => {
                        if (result.isConfirmed) location.href = '/';
                    })
                }
                else if (data.message == 'fail') {
                    Swal.fire({
                        title: '일치하는 계정 없음',
                        text: '입력한 계정과 이름 또는 휴대전화 번호가 일치하지 않습니다',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
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

    resetPasswordAfterLock: function (account_name) {
        let user_name, telephone;
        Swal.fire({
            title: '비밀번호를 5회 이상 \n잘못 입력하셨습니다.',
            html: `<p class='loginSwalText'>회원가입 시 사용한 이메일을 <br>입력해 주세요. 본인 확인 후 <br>비밀번호를 초기화 할 수 있습니다.</p>`,
            showConfirmButton: true,
            confirmButtonText: '본인확인 이메일 전송',
            showCancelButton: true,
            cancelButtonText: "취소",
        }).then(async (result) => {
            if(result.isConfirmed) {
                $("#lockModal").addClass("active")
                $(document).on("click", ".lock_confirm", function(){
                    user_name = $(".lock_name").val()
                    telephone = $(".lock_phone").val()
                    let baseUrl = `/api/auth/tenant/identify`
                    let apiUrl = apiUrlConverter('util', baseUrl)
                    $.ajax({
                        method: "post",
                        url: apiUrl,
                        xhrFields: {
                            withCredentials: true
                        },
                        async: false,
                        data: {
                            account_name,
                            user_name,
                            telephone
                        },
                        success: function (data) {                
                            let identify = data.identify;
                            if(identify) {
                                login.resetPassword(account_name, user_name, telephone);
                            }
                            else {
                                Swal.fire({
                                    title: '개인정보 불일치',
                                    html: '로그인한 계정과 입력된 정보가 일치하지 않습니다.',
                                    icon: 'error',
                                    showConfirmButton: false,
                                    showDenyButton: true,
                                    denyButtonText: "확 인",
                                })
                            }
                        }, // success 
                        error: function (xhr, status) {
                            console.log("error")
                        }
                    })
                })
                // const apiResult = await Swal.fire({
                //     title: '이름, 가입시 등록한 휴대전화번호 확인 후 이메일이 발송됩니다.',
                //     html: '이름: <input id="swal-input1" class="username"><br>' +
                //     '휴대전화 번호: <input id="swal-input2" class="telephone">',
                //     showCancelButton: false,
                //     showLoaderOnConfirm: true,
                //     preConfirm: async () => {
                //         user_name = document.getElementById('swal-input1').value;
                //         telephone = document.getElementById('swal-input2').value
                //         let baseUrl = `/api/auth/tenant/identify`
                //         let apiUrl = apiUrlConverter('util', baseUrl)
                //         return fetch(apiUrl, {
                //             method: "POST",
                //             headers: {
                //                 "Content-Type": "application/json",
                //             },
                //             credentials: 'include',
                //             body: JSON.stringify({
                //                 "account_name": account_name,
                //                 "user_name": user_name,
                //                 "telephone": telephone
                //             })
                //         })
                //             .then(response => {
                //                 if (!response.ok) {
                //                     throw new Error(response.statusText)
                //                 }
                //                 return response.json()
                //             })
                //             .catch(error => {
                //                 Swal.showValidationMessage(
                //                     `Request failed: ${error}`
                //                 )
                //             })
                //     }
                // })

            }
        })
    },

    sessionCheck: function () {
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
                if (data.message == "success") {
                    location.href = "/main"
                }
                else {
                    return 0
                }
            },
            error: function (xhr, status) {
                //console.log("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return 0;
    },

    selectLockStatus: function (tenancy, tenant_id, account_name) {
        let baseUrl = `/api/auth/${tenancy}/selectLockStatus`
        let apiUrl = apiUrlConverter('util', baseUrl)

        let result = false;
        $.ajax({
            method: "post",
            url: apiUrl,
            data: {
                "tenant_id": tenant_id,
                "account_name": account_name,
            },
            async: false,
            success: function (data) {
                console.log(data);
                result = data
            }, // success 
            error: function (xhr, status) {
                alert(xhr + " : " + status);
            },
        });

        return result;
    },

    plusLoginFailCount: function (tenancy, tenant_id, account_name) {
        let baseUrl = `/api/auth/${tenancy}/failCount/plus`
        let apiUrl = apiUrlConverter('util', baseUrl)

        let result = 0;
        $.ajax({
            method: "put",
            url: apiUrl,
            data: {
                "account_name": account_name,
                "tenant_id": tenant_id,
            },
            async: false,
            success: function (data) {
                result = data.login_fail_count;
            }, // success 
            error: function (xhr, status) {

            },
        });

        return result;
    },

    updateLockStatus: function (tenancy, tenant_id, account_name, lock_count) {
        let baseUrl = `/api/auth/${tenancy}/lockStatus`
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "put",
            url: apiUrl,
            data: {
                "tenant_id": tenant_id,
                "account_name": account_name,
                "lock_count": lock_count,
            },
            async: false,
            success: function (data) {

            }, // success 
            error: function (xhr, status) {

            },
        });
    },

    updateClearLoginFailCount: function (tenancy, tenant_id, account_name) {
        let baseUrl = `/api/auth/${tenancy}/failCount/clear`
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "put",
            url: apiUrl,
            data: {
                "tenant_id": tenant_id,
                "account_name": account_name,
            },
            async: false,
            success: function (data) {

            }, // success 
            error: function (xhr, status) {

            },
        });
    },

    updateClearLockCount: function (tenancy, tenant_id, account_name) {
        let baseUrl = `/api/auth/${tenancy}/lockCount/clear`
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "put",
            url: apiUrl,
            data: {
                "tenant_id": tenant_id,
                "account_name": account_name,
            },
            async: false,
            success: function (data) {

            }, // success 
            error: function (xhr, status) {

            },
        });
    },
}