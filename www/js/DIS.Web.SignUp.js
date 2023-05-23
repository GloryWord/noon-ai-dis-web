'use strict';

/**
 * DIS.Web.SignUp 네임스페이스
 * @class DIS.Web.Login
 */
DIS.Web.SignUp = DIS.Web.SignUp || {};

/**
 * DIS.Web.SignUp 클래스를 참조하는 글로벌 멤버 변수
 * @interface SignUp
 */
var signup = DIS.Web.SignUp;
signup = {
    tenantSignUp: function (account_name, password, company_name, owner_name, phone) {
        let baseUrl = `/api/signup/tenant`
        let apiUrl = apiUrlConverter('util', baseUrl)
        
        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                account_name,
                password,
                company_name,
                owner_name,
                phone
            },
            success: function (data) {
                if (data.message == 'success') {
                    Swal.fire({
                        title: '회원가입 요청 완료',
                        html: '1 영업일 이내로 요청 확인 후 승인 절차가 이루어집니다.',
                        icon: 'info',
                    }).then(()=> {
                        window.location = '/';
                    });
                } else {
                    alert(JSON.stringify(data));
                }
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },

    sendMail: function (email) {
        var postdata = { email_address: email }
        var result = ''

        let baseUrl = `/api/mail/verify`
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    result = data.verifyCode;
                } else {
                    alert(JSON.stringify(data));
                }
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    },

    checkDuplicate: function (email) {
        var result = ''

        let baseUrl = `/api/signup/duplicate`
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                email_address: email
            },
            async: false,
            success: function (data) {
                if (data.message == 'success') {
                    if (data.result == 'true') result = true;
                    else if (data.result == 'false') result = false;
                }
            }, // success 
            error: function (xhr, status) {
                result = JSON.parse(xhr.responseJSON.result)
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    }
}