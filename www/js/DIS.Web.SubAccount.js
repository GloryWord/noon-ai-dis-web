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

        let baseUrl = `/api/subaccount`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result = data.results;
                console.log(result);
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        var html = ''
        if(result.message == "error"){
            html += '<div class="tableContent">\
                        <p>생성된 서브 계정이 없어요</p>\
                    </div>';
        }
        else{
            if(screen.width<=600){
                for (var i = 0; i < result.length; i++) {
                    let date_login = (result[i].last_login !== null) ? new Date(result[i].last_login) : '-'
                    if(date_login !== '-') date_login = moment(date_login).format('YYYY.MM.DD');
                    let date_register = moment(result[i].register_date).format('YYYY.MM.DD');
                    html += '<div class="tableContent">\
                                <div class="id_content"><p>'+result[i].account_name+'</p></div>\
                                <div class="middle_content">\
                                    <div class="number_content"><p>'+result[i].id+'</p></div>\
                                    <div class="name_content"><p>'+result[i].user_name+'</p></div>\
                                    <div class="last_content"><p>'+date_login+'</p></div>\
                                    <div class="create_content"><p>'+date_register+'</p></div>\
                                    <div class="lock_content"><p>'+lockText+'</p></div>\
                                </div>\
                                <div class="bottom_content">\
                                    <div class="pass_content">\
                                        <div class="pass_modi" value='+result[i].id+'><p>재설정</p></div>\
                                    </div>\
                                    <div class="auth_content">\
                                        <div class="auth_modi" data-account='+result[i].account_name+'><p>권한 설정</p></div>\
                                    </div>\
                                    <div class="auth_content">\
                                        <div class="auth_modi" data-account='+result[i].account_name+'><p>잠금 해제</p></div>\
                                    </div>\
                                    <div class="del_content">\
                                        <div class="delBtn" value='+result[i].id+'><p>삭제하기</p></div>\
                                    </div>\
                                </div>\
                            </div>';
                }
            }
            else{
                for (var i = 0; i < result.length; i++) {
                    let date_login = (result[i].last_login !== null) ? new Date(result[i].last_login) : '-'
                    if(date_login !== '-') date_login = moment(date_login).format('YYYY.MM.DD');
                    let date_register = moment(result[i].register_date).format('YYYY.MM.DD');
                    let lockText
                    let lockBtn
                    if(result[i].is_lock==1){
                        lockText = "O"
                        lockBtn = "lockOn"
                    }
                    else{
                        lockText = "X"
                        lockBtn = "lockOff"
                    }
                    html += '<div class="tableContent">\
                                <div class="number_content"><p>'+result[i].id+'</p></div>\
                                <div class="id_content"><p>'+result[i].account_name+'</p></div>\
                                <div class="name_content"><p>'+result[i].user_name+'</p></div>\
                                <div class="last_content"><p>'+date_login+'</p></div>\
                                <div class="create_content"><p>'+date_register+'</p></div>\
                                <div class="lock_content"><p>'+lockText+'</p></div>\
                                <div class="pass_content">\
                                    <div class="pass_modi" value='+result[i].id+'><p>재설정</p></div>\
                                </div>\
                                <div class="auth_content">\
                                    <div class="auth_modi" data-account='+result[i].account_name+'><p>권한 설정</p></div>\
                                </div>\
                                <div class="lockbtn_content">\
                                    <div class="lockBtn '+lockBtn+'" data-id='+result[i].id+'><p>잠금 해제</p></div>\
                                </div>\
                                <div class="del_content">\
                                    <div class="delBtn" value='+result[i].id+'><p>삭제하기</p></div>\
                                </div>\
                            </div>';
                }
            }
        }
        
        return html;
    },

    resetPassword: function(index, newPassword) {
        var result = false;

        let baseUrl = `/api/subaccount/password`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                index,
                newPassword
            },
            async: false,
            success: function (data) {
                result = true;
            }, // success 
            error: function (xhr, status) {
            }
        })
        return result;
    },

    unlock: function(idx) {
        Swal.fire({
            title: '서브계정 로그인 잠금 해제',
            html: '로그인 5회 이상 실패한 계정입니다.<br>잠금을 해제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                let baseUrl = `/api/subaccount/unlock`
                let apiUrl = apiUrlConverter('sub-account', baseUrl)
                $.ajax({
                    method: "post",
                    url: apiUrl,
                    data: {
                        user_id: idx,
                    },
                    success: function (data) {
                        if (data.message === 'success') {
                            Swal.fire({
                                title: '계정 잠금 해제 완료',
                                showCancelButton: false,
                                confirmButtonText: '확인',
                                icon: 'success',
                                allowOutsideClick: false,
                            }).then(() => {
                                location.reload();
                            })
                        }
                    }, // success 
                    error: function (xhr, status) {
                        alert(xhr + " : " + status);
                    },
                });
            }
        })
    },

    addSubAccount: function(subAccountInfo) {
        var result = false;

        let baseUrl = `/api/subaccount`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: subAccountInfo,
            async: false,
            success: function (data) {
                    result = true;
            }, // success 
            error: function (xhr, status) {
                let message = JSON.parse(xhr.responseText).message;
                if(message == 'length_error') {
                    result = "length_error"
                }
                else if(message == 'check_error') {
                    result = "check_error"
                }
                else {
                    result = false
                }
            }
        })
        return result;
    },

    deleteSubAccount: function(index) {
        var result = false;

        let baseUrl = `/api/subaccount/${index}`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "delete",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message == 'success') result = true;
            }, // success 
            error: function (xhr, status) {
            }
        })
        return true;
    },
    
    getAuthList: function (accountName) {
        var result = ''
        var postdata = { accountName:accountName }

        let baseUrl = `/api/subaccount/auth`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            async: false,
            success: function (data) {
                result = data.requestList;
            }, // success 
            error: function (xhr, status) {
            }
        })

        if(result[0]==null){
            var bucket = 0
            var db = 0
            var enc = 0
            var dec = 0
        }
        else{
            if(result[0]['bucket_access_auth']==null) var bucket = "0"
            else var bucket = result[0]['bucket_access_auth'].split("")
            if(result[0]['db_access_auth']==null) var db = "0"
            else var db = result[0]['db_access_auth'].split("")
            if(result[0]['encrypt_auth']==null) var enc = "0"
            else var enc = result[0]['encrypt_auth']
            if(result[0]['decrypt_auth']==null) var dec = "0"
            else var dec = result[0]['decrypt_auth']
        }

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
                        <div class="selectArea">\
                            <input class="bdownloadAuth" type="checkbox" '+bucket_c+'><label>다운로드</label>\
                            <input class="buploadAuth" type="checkbox" '+bucket_r+'><label>업로드</label>\
                            <input class="bdeleteAuth" type="checkbox" '+bucket_u+'><label>삭제</label>\
                        </div>\
                    </div>\
                    <div class="dbAuth">\
                        <h1>DB 권한 설정</h1>\
                        <div class="selectArea">\
                            <input class="dcreateAuth" type="checkbox" '+db_c+'><label>생성</label>\
                            <input class="dreadAuth" type="checkbox" '+db_r+'><label>읽기</label>\
                            <input class="dupdateAuth" type="checkbox" '+db_u+'><label>수정</label>\
                            <input class="ddeleteAuth" type="checkbox" '+db_d+'><label>삭제</label>\
                        </div>\
                    </div>\
                    <div class="enc_dec_Auth">\
                        <h1>암복호화 권한 설정</h1>\
                        <div class="selectArea">\
                            <input class="encAuth" type="checkbox" '+encCheck+'><label>비식별화</label>\
                            <input class="decAuth" type="checkbox" '+decCheck+'><label>복호화</label>\
                        </div>\
                    </div>';
        return html;
    },
    
    putSubAuth: function (bucketAuth, dbAuth, enc, dec, accountName) {
        var postdata = { bucketAuth:bucketAuth, dbAuth:dbAuth, enc:enc, dec:dec, accountName:accountName }

        let baseUrl = `/api/subaccount/auth`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "put",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            async: false,
            success: function (data) {
                Swal.fire('권한 설정이 완료됐습니다.', '', 'success').then(() => {
                    location.href = '/submanage';
                })
            }, // success 
            error: function (xhr, status) {
                Swal.fire({
                    title: '권한 설정에 실패했습니다.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                })
            }
        })
        
        return 0
    },
    getAccessKey: function () {
        var result = ""
        var resultStr = ""

        let baseUrl = `/api/subaccount/key`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result = data.login_alias
            }, // success 
            error: function (xhr, status) {
                //alert("error : " + JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        })

        if(result==null){
            resultStr += "<p>접속 키</p>\
            <input class='accessKey' placeholder='접속 키를 설정해주세요.'>"
        }
        else{
            resultStr += "<p>접속 키</p>\
            <input class='accessKey' value='"+result+"'>"
        }
        
        return resultStr
    },

    putAccessKey: function (accessKey) {
        var postdata = { accessKey:accessKey }

        let baseUrl = `/api/subaccount/key`
        let apiUrl = apiUrlConverter('sub-account', baseUrl)

        $.ajax({
            method: "put",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            async: false,
            success: function (data) {
                Swal.fire('접속 키를 변경했어요.', '', 'success').then(() => {
                    location.href = "/submanage"
                })
            }, // success 
            error: function (xhr, status) {
                let message = JSON.parse(xhr.responseText).message;
                if(message == "need access key"){
                    Swal.fire({
                        title: '접속 키를 입력해주세요.',
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    })
                }
                else if(message == "already exist"){
                    Swal.fire({
                        title: '존재하는 접속 키에요.',
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    })
                }
                else if(message == "same login alias"){
                    Swal.fire({
                        title: '접속 키가 변경되지 않았어요.',
                        showConfirmButton:false,
                        showDenyButton:true,
                        denyButtonText:"확 인",
                        icon:"error"
                    })
                }
            }
        })
        
        return 0
    },
}