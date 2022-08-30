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
    infoModi: function(name, email, phone, now_pass, new_pass, new_passConfig) {
        var postdata = {name:name, email:email, phone:phone, now_pass:now_pass, new_pass:new_pass, new_passConfig:new_passConfig}
        $.ajax({
            method: "put",
            url: "/api/user/info",
            data: postdata,
            async: false,
            success: function (data) {
                if(data.message == "success"){
                    Swal.fire('내 정보 수정이 완료됐습니다.', '', 'success').then(() => {
                        location.href = '/myinfo';
                    })
                }
                else{
                    Swal.fire('비밀번호를 다시 한번 확인해주세요.', '', 'error').then(() => {
                    })
                }
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return 0;
    },
}