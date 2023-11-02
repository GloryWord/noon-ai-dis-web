'use strict';

/**
 * DIS.Web.Login 네임스페이스
 * @class DIS.Web.Login
 */
DIS.Web.UserInfo = DIS.Web.UserInfo || {};

/**
 * DIS.Web.Login 클래스를 참조하는 글로벌 멤버 변수
 * @interface userinfo
 */
var userinfo = DIS.Web.UserInfo;
userinfo = {
    getFirtstInfo: function () {
        var requestList = ''

        let baseUrl = `/api/user/info`
        let apiUrl = apiUrlConverter('user-info', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.result;
            },
            error: function (xhr, status) {

            }
        });
        var htmlStr = ''

        if (requestList[0]['email'] == null || requestList[0]['email'] == "") {
            var email = ""
        }
        else {
            var email = requestList[0]['email']
        }

        if (requestList[0]['telephone'] == null || requestList[0]['telephone'] == "") {
            var telephone = ""
        }
        else {
            var telephone = requestList[0]['telephone']
        }
        var only_num = "this.value.replace(/[^0-9]/g,'')"
        let name = requestList[0]['user_name'];
        htmlStr += '<div class="infoBody head">\
                        <p>아이디</p>\
                        <h1>'+ requestList[0]['account_name'] + '</h1>\
                    </div>\
                    <div class="infoBody">\
                        <p>이름</p>\
                        <input class="view_name" value="'+ name + '" placeholder="이름을 입력해 주세요">\
                    </div>\
                    <div class="infoBody">\
                        <p>이메일</p>\
                        <input class="view_email" type="email" value="'+ email + '" placeholder="인증 받을 이메일을 입력해 주세요">\
                        <h3 class="email_error">메일 주소를 다시 확인해 주세요</h3>\
                    </div>\
                    <div class="infoBody">\
                        <h3 class="none_text active"></h3>\
                        <div class="auth_send active">\
                            <p>이메일 인증</p>\
                        </div>\
                        <p class="valid_text">인증번호</p>\
                        <input class="view_emailValid" onKeyup="'+ only_num + '" placeholder="인증 번호을 입력해 주세요">\
                        <div class="auth_config">\
                            <p>인증 확인</p>\
                        </div>\
                    </div>';
        return { getFirstInfo: htmlStr, first_name: name, first_email: email, first_phone: telephone };
    },

    getSecondInfo: function () {
        var requestList = ''

        let baseUrl = `/api/user/info`
        let apiUrl = apiUrlConverter('user-info', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.result;
                console.log(requestList)
            },
            error: function (xhr, status) {

            }
        });
        var htmlStr = ''

        if (requestList[0]['login_alias'] == null || requestList[0]['login_alias'] == "") {
            var login_alias = ""
        }
        else {
            var login_alias = requestList[0]['login_alias']
        }
        // var pattern = "this.value.replace(/[^a-zA-Z0-9]/g,'')"
        htmlStr += `<div class="infoBody head">\
                        <p>접속 키</p>\
                        <h1 class="login_alias">${login_alias}</h1>\
                    </div>\
                    <div class="infoBody">\
                        <p>휴대전화 번호</p>\
                        <input class="phone" value=${requestList[0].telephone}>\
                    </div>\
                    <div class="infoBody">\
                        <p>현재 비밀번호</p>\
                        <input class="now_pass" type="password" placeholder="기존의 비밀번호를 입력해 주세요">\
                    </div>\
                    <div class="infoBody">\
                        <p>새 비밀번호</p>\
                        <input class="new_pass" type="password" maxlength="16" placeholder="영문 대문자 + 소문자 + 숫자 + 특수기호 혼합 8자 이상~16자이내">\
                    </div>\
                    <div class="infoBody">\
                        <p>새 비밀번호 확인</p>\
                        <input class="new_passConfig" type="password" maxlength="16" placeholder="새 비밀번호를 한번 더 입력해 주세요">\
                    </div>`
        return htmlStr;
    },

    getloginAlias: function () {
        var requestList = ''

        let baseUrl = `/api/user/alias`
        let apiUrl = apiUrlConverter('user-info', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.result;
            },
            error: function (xhr, status) {

            }
        });
        var htmlStr = ''

        htmlStr += '' + requestList[0]['login_alias'] + ''
        return htmlStr;
    },

    infoModi: function (name, email, origin_phone, phone, now_pass, new_pass, new_passConfig, origin_name, origin_email, email_config) {
        let encodedName = escapeHTML(name);
        let encodedEmail = escapeHTML(email);
        var postdata = { name: encodedName, email: encodedEmail, origin_phone: origin_phone, phone: phone, now_pass: now_pass, new_pass: new_pass, new_passConfig: new_passConfig, origin_name: origin_name, origin_email: origin_email, email_config: email_config };

        let baseUrl = `/api/user/info`
        let apiUrl = apiUrlConverter('user-info', baseUrl)

        $.ajax({
            method: "put",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            async: false,
            success: function (data) {
                Swal.fire({
                    title: `${data.change}\n완료되었습니다.`,
                    showConfirmButton: true,
                    showDenyButton: false,
                    confirmButtonText: "확 인",
                    icon: "success"
                }).then(() => {
                    location.href = '/main';
                })
            },
            error: function (xhr, status) {
                let message = JSON.parse(xhr.responseText).message;
                if (message == 'email_config_failed') {
                    Swal.fire({
                        title: '이메일 인증을 완료해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'length_error') {
                    Swal.fire({
                        title: '비밀번호는 8자 이상 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'check_error') {
                    Swal.fire({
                        title: '비밀번호는 대문자, 소문자, 숫자, 특수기호를 혼합하여 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'no_change') {
                    Swal.fire({
                        title: '변경사항이 없습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'now_blank') {
                    Swal.fire({
                        title: '기존 비밀번호를 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'new_blank') {
                    Swal.fire({
                        title: '새 비밀번호를 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'new_config_blank') {
                    Swal.fire({
                        title: '새 비밀번호 확인을 입력해주세요.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'name_change_failed') {
                    Swal.fire({
                        title: '이름 변경에 실패했습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'email_change_failed') {
                    Swal.fire({
                        title: '이메일 변경에 실패했습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'user_input_not_match') {
                    Swal.fire({
                        title: '현재 비밀번호가 일치하지 않습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'new_pass_config_not_match') {
                    Swal.fire({
                        title: '새 비밀번호가 서로 일치하지 않습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else if (message == 'pw_same_error') {
                    Swal.fire({
                        title: '현재 비밀번호와 새 비밀번호가 동일합니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
                else {
                    Swal.fire({
                        title: '정보 수정에 실패했습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    })
                }
            }
        });

        return 0;
    },

    emailAuthentication: function (email) {
        let result = '';

        let baseUrl = `/api/user/email-send`
        let apiUrl = apiUrlConverter('user-info', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                email
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = data.verifyCode;
                    Swal.fire({
                        title: '인증번호 발송 완료',
                        text: '등록되어 있는 이메일 주소로 \n인증번호가 발송되었습니다.',
                        confirmButtonText: '확 인',
                        allowOutsideClick: false,
                        icon: 'success'
                    })
                }
                else {
                    alert("인증번호 발송 실패");
                }
            },
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    },
}