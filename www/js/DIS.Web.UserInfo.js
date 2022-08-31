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
    getUserInfo: function() {
        var requestList = ''
        $.ajax({
            method: "get",
            url: "/api/user/info",
            async: false,
            success: function (data) {
                requestList = data;
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });
        console.log(requestList)
        var htmlStr = ''

        if(requestList[0]['email']==null || requestList[0]['email']==""){
            var email = ""
        }
        else{
            var email = requestList[0]['email']
        }

        if(requestList[0]['telephone']==null || requestList[0]['telephone']==""){
            var telephone = ""
        }
        else{
            var telephone = requestList[0]['telephone']
        }

        htmlStr += '<h1>내 정보</h1>\
                    <div class="infoBody">\
                        <p>아이디 : </p>\
                        <input class="view_id" value="'+requestList[0]['account_name']+'" disabled>\
                    </div>\
                    <div class="infoBody">\
                        <p>이름 : </p>\
                        <input class="view_name" value="'+requestList[0]['user_name']+'">\
                    </div>\
                    <div class="infoBody">\
                        <p>이메일 : </p>\
                        <input class="view_email" value="'+email+'">\
                    </div>\
                    <div class="infoBody">\
                        <p>전화번호 : </p>\
                        <input class="view_phone" value="'+telephone+'" placeholder="- 를 제외하고 입력해주세요.">\
                    </div>\
                    <div class="infoBody">\
                        <p>현재 비밀번호 : </p>\
                        <input class="now_pass" type="password">\
                    </div>\
                    <div class="infoBody">\
                        <p>새 비밀번호 : </p>\
                        <input class="new_pass" type="password">\
                    </div>\
                    <div class="infoBody">\
                        <p>새 비밀번호 확인 : </p>\
                        <input class="new_passConfig" type="password">\
                    </div>\
                    <div class="btnArea">\
                        <div class="infoSave">\
                            <p>저장</p>\
                        </div>\
                        <div class="infoCancel" onclick="window.history.back()">\
                            <p>취소</p>\
                        </div>\
                    </div>'
        return htmlStr;
    },
    
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