'use strict';

/**
 * DIS.Web.SubAccount 네임스페이스
 * @class DIS.Web.SubAccount
 */
DIS.Web.SubAccount = DIS.Web.SubAccount || {};

/**
 * DIS.Web.SubAccount 클래스를 참조하는 글로벌 멤버 변수
 * @interface SubAccount
 */
var subaccount = DIS.Web.SubAccount;
subaccount = {
    getList: function () {
        var result = ''
        $.ajax({
            method: "get",
            url: "/api/subaccount",
            async: false,
            success: function (data) {
                result = data;
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        function dateFormat(date) {
            let dateFormat2 = date.getFullYear() +
                '-' + ( (date.getMonth()+1) < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) )+
                '-' + ( (date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()) );
            return dateFormat2;
        }

        var html = ''
        for (var i = 0; i < result.length; i++) {
            var date_login = new Date(result[i].last_login)
            var date_register = new Date(result[i].register_date)
            html += '<div class="tableContent">\
                        <div class="number_content"><p>'+result[i].id+'</p></div>\
                        <div class="id_content"><p>'+result[i].account_name+'</p></div>\
                        <div class="name_content"><p>'+result[i].user_name+'</p></div>\
                        <div class="last_content"><p>'+dateFormat(date_login)+'</p></div>\
                        <div class="create_content"><p>'+dateFormat(date_register)+'</p></div>\
                        <div class="pass_content">\
                            <div class="pass_modi" value='+result[i].id+'><p>재설정</p></div>\
                        </div>\
                        <div class="del_content">\
                            <civ class="delBtn" value='+result[i].id+'><p>삭제하기</p></div>\
                        </div>\
                    </div>';
        }
        return html;
    },

    resetPassword: function(index, newPassword) {
        var result = false;
        $.ajax({
            method: "post",
            url: "/api/subaccount/password",
            data: {
                index,
                newPassword
            },
            async: false,
            success: function (data) {
                console.log(data);
                if(data.message == 'success') result = true;
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return true;
    },

    addSubAccount: function(subAccountInfo) {
        var result = false;
        $.ajax({
            method: "post",
            url: "/api/subaccount",
            data: subAccountInfo,
            async: false,
            success: function (data) {
                console.log(data);
                if(data.message == 'success') result = true;
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return true;
    },

    deleteSubAccount: function(index) {
        var result = false;
        $.ajax({
            method: "delete",
            url: "/api/subaccount/"+index,
            async: false,
            success: function (data) {
                console.log(data);
                if(data.message == 'success') result = true;
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        return true;
    }
}