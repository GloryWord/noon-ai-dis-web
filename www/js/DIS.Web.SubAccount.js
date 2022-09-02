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
                        <div class="auth_content">\
                            <div class="auth_modi" data-account='+result[i].account_name+'><p>권한 설정</p></div>\
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
    },
    
    getAuthList: function (accountName) {
        var result = ''
        var postdata = { accountName:accountName }
        $.ajax({
            method: "post",
            url: "/api/subaccount/auth",
            data: postdata,
            async: false,
            success: function (data) {
                result = data;
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        var bucket = result[0]['bucket_access_auth'].split("")
        var db = result[0]['db_access_auth'].split("")
        var enc = result[0]['encrypt_auth']
        var dec = result[0]['decrypt_auth']

        if(bucket[0]=="1") var bucket_c = "checked"
        else var bucket_c = ""
        if(bucket[1]=="1") var bucket_r = "checked"
        else var bucket_r = ""
        if(bucket[2]=="1") var bucket_u = "checked"
        else var bucket_u = ""

        if(db[0]=="1") var db_c = "checked"
        else var db_c = ""
        if(db[1]=="1") var db_r = "checked"
        else var db_r = ""
        if(db[2]=="1") var db_u = "checked"
        else var db_u = ""
        if(db[3]=="1") var db_d = "checked"
        else var db_d = ""

        if(enc=="1") var encCheck = "checked"
        else var encCheck = ""

        if(dec=="1") var decCheck = "checked"
        else var decCheck = ""

        var html = '<div class="bucketAuth">\
                        <h1>버킷 권한 설정</h1>\
                        <input class="bdownloadAuth" type="checkbox" '+bucket_c+'><label>다운로드</label>&nbsp;\
                        <input class="buploadAuth" type="checkbox" '+bucket_r+'><label>업로드</label>&nbsp;\
                        <input class="bdeleteAuth" type="checkbox" '+bucket_u+'><label>삭제</label>\
                    </div>\
                    <div class="dbAuth">\
                        <h1>DB 권한 설정</h1>\
                        <input class="dcreateAuth" type="checkbox" '+db_c+'><label>생성</label>&nbsp;\
                        <input class="dreadAuth" type="checkbox" '+db_r+'><label>읽기</label>&nbsp;\
                        <input class="dupdateAuth" type="checkbox" '+db_u+'><label>수정</label>&nbsp;\
                        <input class="ddeleteAuth" type="checkbox" '+db_d+'><label>삭제</label>\
                    </div>\
                    <div class="enc_dec_Auth">\
                        <h1>암복호화 권한 설정</h1>\
                        <input class="encAuth" type="checkbox" '+encCheck+'><label>비식별화</label>&nbsp;\
                        <input class="decAuth" type="checkbox" '+decCheck+'><label>복호화</label>\
                    </div>';
        return html;
    },
    
    putSubAuth: function (bucketAuth, dbAuth, enc, dec, accountName) {
        var postdata = { bucketAuth:bucketAuth, dbAuth:dbAuth, enc:enc, dec:dec, accountName:accountName }
        $.ajax({
            method: "put",
            url: "/api/subaccount/auth",
            data: postdata,
            async: false,
            success: function (data) {
                if(data.message == "success"){
                    Swal.fire('권한 설정이 완료됐습니다.', '', 'success').then(() => {
                        location.href = '/submanage';
                    })
                }
                else{
                    Swal.fire('권한 설정에 실패했습니다.', '', 'error').then(() => {
                    })
                }
            }, // success 
            error: function (xhr, status) {
                alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })
        
        return 0
    },
}