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
    tenantSignUp: function (account_name, password, company_name, owner_name, telephone) {
        $.ajax({
            method: "post",
            url: "/api/signup/tenant",
            data: {
                account_name,
                password,
                company_name,
                owner_name,
                telephone
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
                    alert('회원가입 요청이 완료되었습니다.\n 1 영업일 이내로 요청 확인 후 승인 절차가 이루어집니다.')
                    window.location = '/'
                } else {
                    alert(JSON.stringify(data));
                }
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
    },

    sendMail: function (email) {
        var postdata = { email_address: email }
        var result = ''
        $.ajax({
            method: "post",
            url: "/api/mail/verify",
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
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        return result;
    }
}