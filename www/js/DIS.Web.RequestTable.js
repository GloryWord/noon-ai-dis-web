'use strict';

/**
 * DIS.Web.RequestTable 네임스페이스
 * @class DIS.Web.RequestTable
 */
DIS.Web.RequestTable = DIS.Web.RequestTable || {};

/**
 * DIS.Web.RequestTable 클래스를 참조하는 글로벌 멤버 변수
 * @interface requestTable
 */
var requestTable = DIS.Web.RequestTable;
requestTable = {
    getEncProgress: function () {
        var result = {
            'progress': '',
            'type': '',
            'status': ''
        }
        $.ajax({
            method: "get",
            url: "/api/progress/encrypt",
            async: false,
            success: function (data) {
                result['progress'] = data['encrypt_progress'];
                result['type'] = data['file_type'];
                result['complete'] = data['complete'];
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    getDecProgress: function () {
        var result = {
            'progress': '',
            'type': '',
            'status': ''
        }
        $.ajax({
            method: "get",
            url: "/api/progress/decrypt",
            async: false,
            success: function (data) {
                result['progress'] = data['decrypt_progress'];
                result['complete'] = data['complete'];
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    getEncRequestList: function (mode) {
        var requestList = ''

        $.ajax({
            method: "get",
            url: "/api/request/encrypt",
            async: false,
            success: function (data) {
                // result = data['progress']
                requestList = data;
                console.log(requestList)
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        // var htmlStr = '<thead>\
        //                 <tr>\
        //                     <th class="col-xs-3">요청 번호</th>\
        //                     <th class="col-xs-6">파일명</th>\
        //                     <th class="col-xs-6">파일 타입</th>\
        //                     <th class="col-xs-6">요청 날짜</th>\
        //                     <th class="col-xs-6">진행률</th>\
        //                     <th class="col-xs-6">상태</th>\
        //                     <th class="col-xs-6">복호화</th>\
        //                     <th class="col-xs-3">상세보기</th>\
        //                 </tr>\
        //                 </thead>'

        var htmlStr = ''

        if (requestList.message == 'error') {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else {
            var count = 0;
            for (var i = 0; i < 5; i++) {
                if (requestList[i]['key_name'] == 'null' && mode == 'restoration') continue;
                if (requestList[i]['complete'] == 0 && mode == 'restoration') continue;

                var date = new Date(requestList[i]['request_date'])

                var namelist = requestList[i]['request_file_list'].split('\n')
                namelist = namelist.splice(0, namelist.length - 1);
    
                if(namelist.length > 1){
                    var list = "<label> 외 " +(Number(namelist.length)-1)+"개</label>"
                    var css = ""
                }
                else {
                    var list = ""
                    var css = 'style="margin:auto 0 auto auto"'
                }
                
                if (requestList[i]['restoration'] == 1) var restoration = "복원 가능"
                else var restoration = "복원 불가능"

                var fileList = requestList[i]['request_file_list'].split('\n');
                fileList = fileList.splice(0, fileList.length - 1);

                if (requestList[i]['file_type'] == "video") var type = "동영상 파일"
                else if (requestList[i]['file_type'] == "image") var type = "이미지 파일"
                if (requestList[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"

                var status = (requestList[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
                // if(requestList[i]['complete'] == 1){
                //     var status = '<p>완료</p>'
                // }
                // else if(requestList[i]['complete'] == 0){
                //     var status = '<p>오류발생</p>'
                // }
                // else{
                //     var status = '<p id="progress"></p>'
                // }

                if(status=="<p>완료</p>"){
                    var css = ""; 
                    var text = "상세정보";
                }
                else{
                    var css = "disable"; 
                    var text= "진행중";
                }
                htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                            <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="name_content" '+css+'><p>'+ namelist[0] + '</p>'+list+'</div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="status_content">'+ status + '</div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo '+css+'">\
                                    <p>'+text+'</p>\
                                </div>\
                            </div>\
                        </div>'
                count += 1;
                if (count == 5) break;
            }
        }

        return htmlStr;
    },

    getAllEncRequestList: function (mode) {
        var requestList = ''

        $.ajax({
            method: "get",
            url: "/api/request/encrypt",
            async: false,
            success: function (data) {
                // result = data['progress']
                requestList = data;
                console.log(data)
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        var htmlStr = ''

        if (requestList.message == 'error') {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else{
            for (var i = 0; i < requestList.length; i++) {
                if (requestList[i]['key_name'] == 'null' && mode == 'restoration') continue;
                if (requestList[i]['complete'] == 0 && mode == 'restoration') continue;
    
                var date = new Date(requestList[i]['request_date'])
    
                var namelist = requestList[i]['request_file_list'].split('\n')
                namelist = namelist.splice(0, namelist.length - 1);
        
                if(namelist.length > 1){
                    var list = "<label> 외 " +(Number(namelist.length)-1)+"개</label>"
                    var css = ""
                }
                else {
                    var list = ""
                    var css = 'style="margin:auto 0 auto auto"'
                }
                
                if (requestList[i]['restoration'] == 1) var restoration = "복원 가능"
                else var restoration = "복원 불가능"
    
                var fileList = requestList[i]['request_file_list'].split('\n');
                fileList = fileList.splice(0, fileList.length - 1);
    
                if (requestList[i]['file_type'] == "video") var type = "동영상 파일"
                else if (requestList[i]['file_type'] == "image") var type = "이미지 파일"
                if (requestList[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"
    
                var status = (requestList[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
                // if(requestList[i]['complete'] == 1){
                //     var status = '<p>완료</p>'
                // }
                // else if(requestList[i]['complete'] == 0){
                //     var status = '<p>오류발생</p>'
                // }
                // else{
                //     var status = '<p id="progress"></p>'
                // }
    
                if(status=="<p>완료</p>"){
                    var css = ""; 
                    var text = "상세정보";
                }
                else{
                    var css = "disable"; 
                    var text= "진행중";
                }
                htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                            <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="name_content" '+css+'><p>'+ namelist[0] + '</p>'+list+'</div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="status_content">'+ status + '</div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo '+css+'">\
                                    <p>'+text+'</p>\
                                </div>\
                            </div>\
                        </div>'
            }
        }

        return htmlStr;
        // return requestList;
    },

    postDataSearch: function (filter_video, filter_image, filter_album, filter_reco, filter_norest, filter_file, filter_rest, startDate, endDate) {
        var postdata = { filter_video:filter_video, filter_image:filter_image, filter_album:filter_album, filter_reco: filter_reco, filter_norest:filter_norest, filter_file: filter_file, filter_rest:filter_rest, startDate: startDate, endDate: endDate }
        var requestList = ''
        $.ajax({
            method: "post",
            url: "/api/search",
            data: postdata,
            async: false,
            success: function (data) {
                // result = data['progress']
                requestList = data;
                console.log(data)
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        var htmlStr = ''

        if (requestList[0] == null) {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else{
            for (var i = 0; i < requestList.length; i++) {
                var date = new Date(requestList[i]['request_date'])
    
                var namelist = requestList[i]['request_file_list'].split('\n')
                namelist = namelist.splice(0, namelist.length - 1);
        
                if(namelist.length > 1){
                    var list = "<label> 외 " +(Number(namelist.length)-1)+"개</label>"
                    var css = ""
                }
                else {
                    var list = ""
                    var css = 'style="margin:auto 0 auto auto"'
                }
                
                if (requestList[i]['restoration'] == 1) var restoration = "복원 가능"
                else var restoration = "복원 불가능"
    
                var fileList = requestList[i]['request_file_list'].split('\n');
                fileList = fileList.splice(0, fileList.length - 1);
    
                if (requestList[i]['file_type'] == "video") var type = "동영상 파일"
                else if (requestList[i]['file_type'] == "image") var type = "이미지 파일"
                if (requestList[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"
    
                var status = (requestList[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
                // if(requestList[i]['complete'] == 1){
                //     var status = '<p>완료</p>'
                // }
                // else if(requestList[i]['complete'] == 0){
                //     var status = '<p>오류발생</p>'
                // }
                // else{
                //     var status = '<p id="progress"></p>'
                // }
    
                if(status=="<p>완료</p>"){
                    var css = ""; 
                    var text = "상세정보";
                }
                else{
                    var css = "disable"; 
                    var text= "진행중";
                }
                htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                            <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="name_content" '+css+'><p>'+ namelist[0] + '</p>'+list+'</div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="status_content">'+ status + '</div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo '+css+'">\
                                    <p>'+text+'</p>\
                                </div>\
                            </div>\
                        </div>'
            }
        }
        return htmlStr;
    },

    getAllKeyList: function () {
        var requestList = ''

        $.ajax({
            method: "get",
            url: "/api/key/all",
            async: false,
            success: function (data) {
                // result = data['progress']
                requestList = data;
                console.log(requestList)
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        var htmlStr = ''
        if(requestList.message == "No keyList found"){
            htmlStr += '<div class="tableContent">\
                            <p>생성된 Key가 없어요</p>\
                        </div>'
        }
        else{
            for (var i = 0; i < requestList['keyList'].length; i++) {
                var date = new Date(requestList['keyList'][i]['generated_date'])
                if (requestList['keyList'][i]['key_memo'] == null || requestList['keyList'][i]['key_memo'] == "") {
                    var memo = ""
                }
                else {
                    var memo = requestList['keyList'][i]['key_memo']
                }

                if(requestList['account']!=requestList['keyList'][i]['account_name']){
                    var modi = "hide"
                }
                else{
                    var modi = ""
                }

                htmlStr += '<div class="tableContent" id=key_index-' + requestList['keyList'][i]['id'] + '>\
                                <div class="number_content"><p>'+ requestList['keyList'][i]['id'] + '</p></div>\
                                <div class="name_content"><p>'+ requestList['keyList'][i]['key_name'] + '</p></div>\
                                <div class="user_content"><p>'+ requestList['keyList'][i]['account_name'] + '</p></div>\
                                <div class="create_content"><p>'+ dateFormat(date) + '</p></div>\
                                <div class="memo_content">\
                                    <p class="memo_text">'+ memo + '</p>\
                                </div>\
                                <div class="modi_content">\
                                    <div data-id="'+ requestList['keyList'][i]['id'] + '" class="memo_modi '+modi+'">\
                                        <p>수정</p>\
                                    </div>\
                                </div>\
                            </div>'
            }
        }

        return htmlStr;
    },

    postSelectKeyMemo: function (key_idx) {
        var postdata = { key_idx: key_idx }
        var requestList = ''
        $.ajax({
            method: "post",
            url: "/api/key/memo",
            data: postdata,
            async: false,
            success: function (data) {
                // result = data['progress']
                requestList = data;
                console.log(data)
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        if (requestList.message == "No request list found") {
            var memo = ""
        }
        else {
            var memo = requestList[0]['key_memo']
        }
        // var htmlStr = '<textarea id="key_memoBox" class="keymemo_modi">'+memo+'</textarea>'

        return memo;
    },

    postUpdateKeyMemo: function (key_memo) {
        var postdata = { key_memo: key_memo }
        $.ajax({
            method: "put",
            url: "/api/key/memo",
            data: postdata,
            async: false,
            success: function (data) {
                Swal.fire('메모 수정이 완료됐습니다.', '', 'success').then(() => {
                    location.href = '/key';
                })
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return 0;
    },
}