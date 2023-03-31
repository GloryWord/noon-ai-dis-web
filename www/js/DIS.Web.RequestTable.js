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

        let responseMessage;

        $.ajax({
            method: "get",
            url: "http://util-api.noonai.kr/api/progress/encrypt",
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result['progress'] = data.progress['encrypt_progress'];
                result['status'] = data.progress['status'];
                result['type'] = data.progress['file_type'];
                result['complete'] = data.progress['complete'];
            },
            error: function (xhr, status) {
                responseMessage = JSON.parse(xhr.responseText).message
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

        let responseMessage;
        
        $.ajax({
            method: "get",
            url: "http://util-api.noonai.kr/api/progress/decrypt",
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result['progress'] = data.progress['decrypt_progress'];
                result['status'] = data.progress['status'];
                result['complete'] = data.progress['complete'];
            },
            error: function (xhr, status) {
                responseMessage = JSON.parse(xhr.responseText).message
            }
        });

        return result;
    },

    getThumbProgress: function () {
        var result = {
            'progress': '',
            'type': '',
            'status': ''
        }
        $.ajax({
            method: "get",
            url: "http://util-api.noonai.kr/api/progress/thumbnail",
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result['status'] = data.progress['status'];
                result['complete'] = data.progress['complete'];
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    getRecentRequest: function (requestType) {
        var apiUrl = `http://${requestType}-api.noonai.kr/api/request/${requestType}/recent`
        let requestList, responseMessage;

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.requestList;
            },
            error: function (xhr, status) {
                responseMessage = JSON.parse(xhr.responseText).message
            }
        });

        var htmlStr = ''
        if (responseMessage == 'no request list') {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else {
            for (var i = 0; i < requestList.length; i++) {
                if (i == 5) break;

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

                if(requestList[i]['complete'] == 1) {
                    var status = '<p>완료</p>'
                }
                else if(requestList[i]['status'].indexOf("FAIL")==1 || requestList[i]['status'].indexOf("Fail")!=-1){
                    var status = '<p>실패</p>'
                }
                else {
                    var status = '<p id="progress"></p>'
                }
                // var status = (requestList[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
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
                    var disable = ""; 
                    var m_disable = ""; 
                    var text = "상세정보";
                }
                else{
                    var disable = "disable"; 
                    var m_disable = "style='pointer-events: none;'"
                    var text= "진행중";
                }
                if(screen.width<=600){
                    htmlStr += '<div class="m_logContent" data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" '+m_disable+'>\
                                    <div class="name_content" '+css+'><p>'+ namelist[0] + list + '</p></div>\
                                    <div class="etc_content">\
                                        <div class="type_content"><p>'+ type + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                                        <div class="status_content">'+ status + '</div>\
                                    </div>\
                            </div>'
                }
                else{
                    htmlStr += '<div class="logContent">\
                        <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                        <div class="type_content"><p>'+ type + '</p></div>\
                        <div class="name_content"><p>'+ namelist[0] + '</p>'+list+'</div>\
                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                        <div class="status_content">'+ status + '</div>\
                        <div class="detail_content">\
                            <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo '+disable+'">\
                                <p>'+text+'</p>\
                            </div>\
                        </div>\
                        </div>'
                }

            }
        }

        return htmlStr;
    },

    getAllEncRequestList: function (mode) {
        var requestList = ''

        $.ajax({
            method: "get",
            url: "http://encrypt-api.noonai.kr/api/request/encrypt/all",
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.requestList;
            },
            error: function (xhr, status) {
            }
        });

        var htmlStr = ''

        if (requestList[0] == null || requestList.message == 'error' || requestList.message=='No request list found') {
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
                if(requestList[i]['status']==null || requestList[i]['status']==0){
                    var sta = "[FAIL]"
                }
                else {
                    var sta = requestList[i]['status']
                }
                if(requestList[i]['complete'] == 1) {
                    var status = '<p>완료</p>'
                }
                else if(sta.indexOf("FAIL")==1 || sta.indexOf("Fail")!=-1){
                    var status = '<p>실패</p>'
                }
                else {
                    var status = '<p id="progress"></p>'
                }
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
                    var disable = ""; 
                    var m_disable = ""
                    var text = "상세정보";
                }
                else{
                    var disable = "disable"; 
                    var m_disable = "style='pointer-events: none;'"
                    var text= "진행중";
                }
                if(screen.width<=600){
                    htmlStr += '<div class="m_logContent" data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" '+m_disable+'>\
                                    <div class="name_content" '+css+'><p>'+ namelist[0] + list + '</p></div>\
                                    <div class="etc_content">\
                                        <div class="type_content"><p>'+ type + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                                        <div class="status_content">'+ status + '</div>\
                                    </div>\
                            </div>'
                }
                else{
                    htmlStr += '<div class="logContent">\
                        <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                        <div class="type_content"><p>'+ type + '</p></div>\
                        <div class="name_content"><p>'+ namelist[0] + '</p>'+list+'</div>\
                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                        <div class="status_content">'+ status + '</div>\
                        <div class="detail_content">\
                            <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo '+disable+'">\
                                <p>'+text+'</p>\
                            </div>\
                        </div>\
                        </div>'
                }
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
            url: "http://encrypt-api.noonai.kr/api/search/encrypt",
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.requestList;
            },
            error: function (xhr, status) {
            }
        });

        var htmlStr = ''

        if (requestList[0] == null || requestList.message == 'error' || requestList.message=='No request list found') {
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
    
                // var status = (requestList[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
                if(requestList[i]['status']==null || requestList[i]['status']==0){
                    var sta = "[FAIL]"
                }
                else {
                    var sta = requestList[i]['status']
                }

                if(requestList[i]['complete'] == 1) {
                    var status = '<p>완료</p>'
                }
                else if(sta.indexOf("FAIL")==1 || sta.indexOf("Fail")!=-1){
                    var status = '<p>실패</p>'
                }
                else {
                    var status = '<p id="progress"></p>'
                }
    
                if(status=="<p>완료</p>"){
                    var disable = ""; 
                    var m_disable = ""
                    var text = "상세정보";
                }
                else{
                    var disable = "disable"; 
                    var m_disable = "style='pointer-events: none;'"
                    var text= "진행중";
                }
                if(screen.width<=600){
                    htmlStr += '<div class="m_logContent" data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" '+m_disable+'>\
                                    <div class="name_content" '+css+'><p>'+ namelist[0] + list + '</p></div>\
                                    <div class="etc_content">\
                                        <div class="type_content"><p>'+ type + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                                        <div class="status_content">'+ status + '</div>\
                                    </div>\
                            </div>'
                }
                else{
                    htmlStr += '<div class="logContent">\
                        <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                        <div class="type_content"><p>'+ type + '</p></div>\
                        <div class="name_content"><p>'+ namelist[0] + '</p>'+list+'</div>\
                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                        <div class="status_content">'+ status + '</div>\
                        <div class="detail_content">\
                            <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo '+disable+'">\
                                <p>'+text+'</p>\
                            </div>\
                        </div>\
                        </div>'
                }
            }
        }
        return htmlStr;
    },

    getAllDecRequestList: function () {
        var requestList = ''

        $.ajax({
            method: "get",
            url: "http://decrypt-api.noonai.kr/api/request/decrypt/all",
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.requestList;
            },
            error: function (xhr, status) {
            }
        });

        var htmlStr = ''

        if (requestList.message == 'error' || requestList.message=='No request list found') {
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
    
                var fileList = requestList[i]['request_file_list'].split('\n');
                fileList = fileList.splice(0, fileList.length - 1);
    
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
                
    
                if (requestList[i]['file_type'] == "video") var type = "동영상 파일"
                else if (requestList[i]['file_type'] == "image") var type = "이미지 파일"
                else var type = ""
                if (requestList[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"
                if(screen.width<=600){
                    htmlStr += '<div class="m_logContent" data-id="'+ requestList[i]['id'] + '" data-type="' + type + '">\
                                    <div class="name_content" '+css+'><p>'+ namelist[0] + list + '</p></div>\
                                    <div class="etc_content">\
                                        <div class="type_content"><p>'+ type + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        <div class="status_content">'+ status + '</div>\
                                    </div>\
                                </div>'
                }
                else{
                    htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                                    <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                                    <div class="type_content"><p>'+ type + '</p></div>\
                                    <div class="name_content" '+css+'><p>'+ namelist[0] + '</p>'+list+'</div>\
                                    <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                    <div class="rest_content"><p></p></div>\
                                    <div class="status_content">'+ status + '</div>\
                                    <div class="detail_content"></div>\
                                </div>'
                }
            }
        }

        return htmlStr;
    },

    postDataDecSearch: function (filter_video, filter_image, filter_album, filter_file, startDate, endDate) {
        var postdata = { filter_video:filter_video, filter_image:filter_image, filter_album:filter_album, filter_file: filter_file, startDate: startDate, endDate: endDate }
        var requestList = ''
        $.ajax({
            method: "post",
            url: "http://decrypt-api.noonai.kr/api/search/decrypt",
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.requestList;
            },
            error: function (xhr, status) {
            }
        });

        var htmlStr = ''

        if (requestList[0] == null || requestList.message == 'error' || requestList.message=='No request list found') {
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
    
                var fileList = requestList[i]['request_file_list'].split('\n');
                fileList = fileList.splice(0, fileList.length - 1);
    
                var status = (requestList[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
    
                if (requestList[i]['file_type'] == "video") var type = "동영상 파일"
                else if (requestList[i]['file_type'] == "image") var type = "이미지 파일"
                else var type = ""
                if (requestList[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"
                if(screen.width<=600){
                    htmlStr += '<div class="m_logContent" data-id="'+ requestList[i]['id'] + '" data-type="' + type + '">\
                                    <div class="name_content" '+css+'><p>'+ namelist[0] + list + '</p></div>\
                                    <div class="etc_content">\
                                        <div class="type_content"><p>'+ type + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        <div class="status_content">'+ status + '</div>\
                                    </div>\
                                </div>'
                }
                else{
                    htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                                    <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                                    <div class="type_content"><p>'+ type + '</p></div>\
                                    <div class="name_content" '+css+'><p>'+ namelist[0] + '</p>'+list+'</div>\
                                    <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                    <div class="rest_content"><p></p></div>\
                                    <div class="status_content">'+ status + '</div>\
                                    <div class="detail_content"></div>\
                                </div>'
                }
            }
        }

        return htmlStr;
    },

    getAllKeyList: function () {
        var requestList = ''

        $.ajax({
            method: "get",
            url: "http://key-api.noonai.kr/api/key/all",
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data;
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        var htmlStr = ''
        if(requestList.message == "No keyList found"){
            htmlStr += '<div class="tableContent">\
                            <p>생성된 Key가 없어요</p>\
                        </div>'
        }
        else{
            if(screen.width<=600){
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
                                    <div class="name_content"><p>'+ requestList['keyList'][i]['key_name'] + '</p></div>\
                                    <div class="tableFooter">\
                                        <div class="number_content"><p>'+ requestList['keyList'][i]['id'] + '</p></div>\
                                        <div class="user_content"><p>'+ requestList['keyList'][i]['user_name'] + '</p></div>\
                                        <div class="create_content"><p>'+ dateFormat(date) + '</p></div>\
                                    </div>\
                                </div>'
                }
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
                                    <div class="user_content"><p>'+ requestList['keyList'][i]['user_name'] + '</p></div>\
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

        }

        return htmlStr;
    },

    getKeyMemo: function (key_idx) {
        var requestList = ''
        $.ajax({
            method: "get",
            url: "http://key-api.noonai.kr/api/key/memo/" + key_idx,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data;
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        if (requestList.message == "no memo") {
            var memo = ""
        }
        else {
            var memo = requestList.result.key_memo;
        }
        // var htmlStr = '<textarea id="key_memoBox" class="keymemo_modi">'+memo+'</textarea>'
        return memo;
    },

    updateKeyMemo: function (key_idx, key_memo) {
        var postdata = { key_memo: key_memo }
        $.ajax({
            method: "put",
            url: "http://key-api.noonai.kr/api/key/memo/" + key_idx,
            xhrFields: {
                withCredentials: true
            },
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

    getMonthUsage: function (searchMonth) {
        var requestList = ''
        $.ajax({
            method: "get",
            url: `http://util-api.noonai.kr/api/usage?searchMonth=${searchMonth}`,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                // result = data['progress']
                requestList = data['results'];
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        var htmlStr = ""

        var userName = []

        for(var i=0;i<requestList[0].length;i++){
            userName.push(requestList[0][i]["user_name"])
        }
        userName = new Set(userName)
        userName = Array.from(userName)

        var usageObject = {}
        var imageObject = {}
        var videoObject = {}
        
        for (var i = 0; i < userName.length; i++) {
            var detailUsage = {
                encrypt_request_count: 0,
                decrypt_request_count: 0,
                download_request_count: 0,
                total_download_size: 0,
                encrypt_request_charge: 0,
                decrypt_request_charge: 0,
                download_request_charge: 0
            }

            usageObject[userName[i]] = detailUsage;
        }

        for (var i = 0; i < userName.length; i++) {
            var detailUsage = {
                encrypt_request_count: 0,
                decrypt_request_count: 0,
                download_request_count: 0,
                total_download_size: 0
            }
            imageObject[userName[i]] = detailUsage;
        }

        for (var i = 0; i < userName.length; i++) {
            var detailUsage = {
                encrypt_request_count: 0,
                decrypt_request_count: 0,
                download_request_count: 0,
                total_download_size: 0
            }
            videoObject[userName[i]] = detailUsage;
        }

        for (var i = 0; i < requestList[0].length; i++) {
            var request_type = requestList[0][i]['request_type'];

            if(request_type == 'encrypt') {
                usageObject[requestList[0][i]['user_name']]['encrypt_request_count'] = requestList[0][i]['count(*)']
                usageObject[requestList[0][i]['user_name']]['encrypt_request_charge'] = requestList[0][i]['sum(service_charge)']
            }
            else if(request_type == 'decrypt') {
                usageObject[requestList[0][i]['user_name']]['decrypt_request_count'] = requestList[0][i]['count(*)']
                usageObject[requestList[0][i]['user_name']]['decrypt_request_charge'] = requestList[0][i]['sum(service_charge)']
            }
            else if(request_type == 'download') {
                usageObject[requestList[0][i]['user_name']]['download_request_count'] = requestList[0][i]['count(*)']
                usageObject[requestList[0][i]['user_name']]['total_download_size'] += requestList[0][i]['sum(file_size)']
                usageObject[requestList[0][i]['user_name']]['download_request_charge'] = requestList[0][i]['sum(service_charge)']
            }
        }
        var temp = searchMonth.split('-');
        var year = temp[0]
        var month = temp[1]
        if(screen.width<=600){
            htmlStr += "<div class='m_logArea'>\
                                <div class='usageBox'>\
                                <div class='textArea'>\
                                    <p>"+year+"년 "+month+"월 총 사용량</p>\
                                </div>\
                                <div class='tbHeader'>\
                                    <div class='user_header'><h3>담당자</h3></div>\
                                    <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
                                    <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
                                    <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
                                    <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
                                </div>\
                                <div class='tbBody'>"
                    console.log(usageObject)
                    for(var i=0;i<userName.length;i++){
                        htmlStr += "<div class='tbContent'>\
                                        <div class='user_content'><p>"+userName[i]+"</p></div>\
                                        <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['encrypt_request_count']+"</p></div>\
                                        <div class='decrypt_upload_content'><p>"+usageObject[userName[i]]['decrypt_request_count']+"</p></div>\
                                        <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['download_request_count']+"</p></div>\
                                        <div class='total_download_content'><p>"+formatBytes(usageObject[userName[i]]['total_download_size'])+"</p></div>\
                                    </div>"
                    }
                    htmlStr += "    </div>\
                            </div>\
                        </div>"
        }
        else{
            htmlStr += "<div class='usageBox'>\
                            <div class='textArea'>\
                                <p>"+year+"년 "+month+"월 총 사용량</p>\
                            </div>\
                            <div class='tbHeader'>\
                                <div class='user_header'><h3>담당자</h3></div>\
                                <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
                                <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
                                <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
                                <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
                            </div>\
                            <div class='tbBody'>"
                for(var i=0;i<userName.length;i++){
                    htmlStr += "<div class='tbContent'>\
                                    <div class='user_content'><p>"+userName[i]+"</p></div>\
                                    <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['encrypt_request_count']+"</p></div>\
                                    <div class='decrypt_upload_content'><p>"+usageObject[userName[i]]['decrypt_request_count']+"</p></div>\
                                    <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['download_request_count']+"</p></div>\
                                    <div class='total_download_content'><p>"+formatBytes(usageObject[userName[i]]['total_download_size'])+"</p></div>\
                                </div>"
                }
                htmlStr += "    </div>\
                        </div>"
        }

        for (var i = 0; i < requestList[1].length; i++) {
            var file_type = requestList[1][i]['file_type'];
            var request_type = requestList[1][i]['request_type'];

            if(request_type == 'encrypt') {
                if(file_type == 'image') imageObject[requestList[1][i]['user_name']]['encrypt_request_count'] = requestList[1][i]['count(*)']
                else if(file_type == 'video') videoObject[requestList[1][i]['user_name']]['encrypt_request_count'] = requestList[1][i]['count(*)']
            }
            else if(request_type == 'decrypt') {
                if(file_type == 'image') imageObject[requestList[1][i]['user_name']]['decrypt_request_count'] = requestList[1][i]['count(*)']
                else if(file_type == 'video') videoObject[requestList[1][i]['user_name']]['decrypt_request_count'] = requestList[1][i]['count(*)']
            }
            else if(request_type == 'download') {
                if(file_type == 'image') {
                    imageObject[requestList[1][i]['user_name']]['download_request_count'] = requestList[1][i]['count(*)']
                    imageObject[requestList[1][i]['user_name']]['total_download_size'] += requestList[1][i]['sum(file_size)']
                }
                else if(file_type == 'video'){
                    videoObject[requestList[1][i]['user_name']]['download_request_count'] = requestList[1][i]['count(*)']
                    videoObject[requestList[1][i]['user_name']]['total_download_size'] += requestList[1][i]['sum(file_size)']
                }
            }
        }

        var totalEncryptCharge = 0
        var totalDecryptCharge = 0 
        var totalDownloadCharge = 0 
        var totalCharge = 0
        for(var keys in usageObject) {
            totalEncryptCharge += usageObject[keys]['encrypt_request_charge'];
            totalDecryptCharge += usageObject[keys]['decrypt_request_charge'];
            totalDownloadCharge += usageObject[keys]['download_request_charge'];
        }
        totalCharge = totalEncryptCharge + totalDecryptCharge + totalDownloadCharge;

        //월별 청구 금액
        if(screen.width<=600){
            htmlStr += `<div class='m_logArea'>\
                            <div class='usageBox'>\
                                <div class='textArea'>\
                                    <p>${year}년 ${month}월 청구 금액</p>\
                                </div>\
                                <div class='tbHeader'>\
                                    <div class='encrypt_charge_header'><h3>비식별화 서비스 요금</h3></div>\
                                    <div class='decrypt_charge_header'><h3>복호화 서비스 요금</h3></div>\
                                    <div class='download_charge_header'><h3>다운로드 발생 비용</h3></div>\
                                    <div class='total_charge_header'><h3>합계</h3></div>\
                                </div>\
                                <div class='tbBody'>\
                                <div class='tbContent'>\
                                        <div class='encrypt_charge_content'><p>${totalEncryptCharge.toLocaleString('en-US')} 원</p></div>\
                                        <div class='decrypt_charge_content'><p>${totalDecryptCharge.toLocaleString('en-US')} 원</p></div>\
                                        <div class='download_charge_content'><p>${totalDownloadCharge.toLocaleString('en-US')} 원</p></div>\
                                        <div class='total_charge_content'><p>${totalCharge.toLocaleString('en-US')} 원</p></div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>`
        }
        else{
            htmlStr += `<div class='usageBox'>
                            <div class='textArea'>
                                <p>${year}년 ${month}월 청구 금액</p>
                            </div>
                            <div class='tbHeader'>
                                <div class='encrypt_charge_header'><h3>비식별화 서비스 요금</h3></div>
                                <div class='decrypt_charge_header'><h3>복호화 서비스 요금</h3></div>
                                <div class='download_charge_header'><h3>다운로드 발생 비용</h3></div>
                                <div class='total_charge_header'><h3>합계</h3></div>
                            </div>
                            <div class='tbBody'>
                            <div class='tbContent'>
                                    <div class='encrypt_charge_content'><p>${totalEncryptCharge.toLocaleString('en-US')} 원</p></div>
                                    <div class='decrypt_charge_content'><p>${totalDecryptCharge.toLocaleString('en-US')} 원</p></div>
                                    <div class='download_charge_content'><p>${totalDownloadCharge.toLocaleString('en-US')} 원</p></div>
                                    <div class='total_charge_content'><p>${totalCharge.toLocaleString('en-US')} 원</p></div>
                                </div>
                            </div>
                        </div>`
        }


        //월별 이미지 파일 사용량
        if(screen.width<=600){
            htmlStr += "<div class='m_logArea'>\
                            <div class='usageBox'>\
                                <div class='textArea'>\
                                    <p>"+year+"년 "+month+"월 이미지 파일 사용량</p>\
                                </div>\
                                <div class='tbHeader'>\
                                    <div class='user_header'><h3>담당자</h3></div>\
                                    <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
                                    <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
                                    <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
                                    <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
                                </div>\
                                <div class='tbBody'>"
                    for(var i=0;i<userName.length;i++){
                        htmlStr += "<div class='tbContent'>\
                                        <div class='user_content'><p>"+userName[i]+"</p></div>\
                                        <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['encrypt_request_count']+"</p></div>\
                                        <div class='decrypt_upload_content'><p>"+imageObject[userName[i]]['decrypt_request_count']+"</p></div>\
                                        <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['download_request_count']+"</p></div>\
                                        <div class='total_download_content'><p>"+formatBytes(imageObject[userName[i]]['total_download_size'])+"</p></div>\
                                    </div>"
                    }
                    htmlStr += "</div>\
                            </div>\
                        </div>"
        }
        else{
            htmlStr += "<div class='usageBox'>\
                            <div class='textArea'>\
                                <p>"+year+"년 "+month+"월 이미지 파일 사용량</p>\
                            </div>\
                            <div class='tbHeader'>\
                                <div class='user_header'><h3>담당자</h3></div>\
                                <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
                                <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
                                <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
                                <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
                            </div>\
                            <div class='tbBody'>"
                for(var i=0;i<userName.length;i++){
                    htmlStr += "<div class='tbContent'>\
                                    <div class='user_content'><p>"+userName[i]+"</p></div>\
                                    <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['encrypt_request_count']+"</p></div>\
                                    <div class='decrypt_upload_content'><p>"+imageObject[userName[i]]['decrypt_request_count']+"</p></div>\
                                    <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['download_request_count']+"</p></div>\
                                    <div class='total_download_content'><p>"+formatBytes(imageObject[userName[i]]['total_download_size'])+"</p></div>\
                                </div>"
                }
                htmlStr += "    </div>\
                        </div>"   
        }
    

        //월별 동영상 파일 사용량
        if(screen.width<=600){
            htmlStr += "<div class='m_logArea'>\
                            <div class='usageBox'>\
                                <div class='textArea'>\
                                    <p>"+year+"년 "+month+"월 동영상 파일 사용량</p>\
                                </div>\
                                <div class='tbHeader'>\
                                    <div class='user_header'><h3>담당자</h3></div>\
                                    <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
                                    <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
                                    <div class='encrypt_download_header'><h3>비식별화 파일 다운로드 건수</h3></div>\
                                    <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
                                </div>\
                                <div class='tbBody'>"
                    for(var i=0;i<userName.length;i++){
                        htmlStr += "<div class='tbContent'>\
                                        <div class='user_content'><p>"+userName[i]+"</p></div>\
                                        <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['encrypt_request_count']+"</p></div>\
                                        <div class='decrypt_upload_content'><p>"+videoObject[userName[i]]['decrypt_request_count']+"</p></div>\
                                        <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['download_request_count']+"</p></div>\
                                        <div class='total_download_content'><p>"+formatBytes(videoObject[userName[i]]['total_download_size'])+"</p></div>\
                                    </div>"
                    }
                    htmlStr += "</div>\
                            </div>\
                        </div>"
        }
        else{
            htmlStr += "<div class='usageBox'>\
                            <div class='textArea'>\
                                <p>"+year+"년 "+month+"월 동영상 파일 사용량</p>\
                            </div>\
                            <div class='tbHeader'>\
                                <div class='user_header'><h3>담당자</h3></div>\
                                <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
                                <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
                                <div class='encrypt_download_header'><h3>비식별화 파일 다운로드 건수</h3></div>\
                                <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
                            </div>\
                            <div class='tbBody'>"
                for(var i=0;i<userName.length;i++){
                    htmlStr += "<div class='tbContent'>\
                                    <div class='user_content'><p>"+userName[i]+"</p></div>\
                                    <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['encrypt_request_count']+"</p></div>\
                                    <div class='decrypt_upload_content'><p>"+videoObject[userName[i]]['decrypt_request_count']+"</p></div>\
                                    <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['download_request_count']+"</p></div>\
                                    <div class='total_download_content'><p>"+formatBytes(videoObject[userName[i]]['total_download_size'])+"</p></div>\
                                </div>"
                }
                htmlStr += "    </div>\
                        </div>"   
        }     

        return htmlStr;
    },

    getMonthTypeUsage: function (type, date) {
        var logType = ''
        if(type=="encrypt_request") logType = 'encrypt'
        else if(type=="decrypt_request") logType = 'decrypt'
        else if(type=="download_request") logType = 'download'
        var apiUrl = `http://util-api.noonai.kr/api/usage/${logType}?date=${date}`
        var requestList = ''
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.results;
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        let htmlStr = ''

        if(logType == 'decrypt'){
            var file_header = ""
        }
        else{
            var file_header = "파일 용량"
        }

        if (requestList[0] == null) {            
            htmlStr += "<div class='logTable'>\
                            <div class='logHeader'>\
                                <div class='id_header'><h3>ID</h3></div>\
                                <div class='user_header'><h3>사용자</h3></div>\
                                <div class='file_header'><h3>파일명</h3></div>\
                                <div class='type_header'><h3>파일 타입</h3></div>\
                                <div class='extension_header'><h3>파일 확장자명</h3></div>\
                                <div class='size_header'><h3>"+file_header+"</h3></div>\
                                <div class='date_content'><h3>요청 날짜</h3></div>\
                            </div>\
                            <div class='mainLog'>\
                                <div class='nodata'><p>요청 기록이 존재하지 않습니다.</p></div>\
                            </div>\
                        </div>"
        }
        else{
            htmlStr += "<div class='logTable'>\
                            <div class='logHeader'>\
                                <div class='id_header'><h3>ID</h3></div>\
                                <div class='user_header'><h3>사용자</h3></div>\
                                <div class='file_header'><h3>파일명</h3></div>\
                                <div class='type_header'><h3>파일 타입</h3></div>\
                                <div class='extension_header'><h3>파일 확장자명</h3></div>\
                                <div class='size_header'><h3>"+file_header+"</h3></div>\
                                <div class='date_content'><h3>요청 날짜</h3></div>\
                            </div>\
                            <div class='mainLog'>"
                for (var i = 0; i < requestList.length; i++) {
                    var date = new Date(requestList[i]['request_date'])
                    if(logType == 'decrypt'){
                        var file_content = ""
                    }
                    else{
                        var file_content = formatBytes(requestList[i]["file_size"])
                    }
                    if(screen.width<=600){
                        htmlStr += '<div class="m_logContent">\
                                        <div class="file_content"><p>'+ requestList[i]["file_name"] + '</p></div>\
                                        <div class="etc_content">\
                                            <div class="user_content"><p>'+ requestList[i]["user_name"] + '</p></div>\
                                            <div class="type_content"><p>'+ requestList[i]["file_type"] + '</p></div>\
                                            <div class="extension_content"><p>'+ requestList[i]["file_extension"] + '</p></div>\
                                            <div class="size_content"><p>'+ file_content + '</p></div>\
                                            <div class="date_content"><p>'+ dateFormat(date) +'</p></div>\
                                        </div>\
                                    </div>'
                    }
                    else{
                        htmlStr += '<div class="logContent">\
                                        <div class="id_content"><p>'+ requestList[i]["request_id"] + '</p></div>\
                                        <div class="user_content"><p>'+ requestList[i]["user_name"] + '</p></div>\
                                        <div class="file_content"><p>'+ requestList[i]["file_name"] + '</p></div>\
                                        <div class="type_content"><p>'+ requestList[i]["file_type"] + '</p></div>\
                                        <div class="extension_content"><p>'+ requestList[i]["file_extension"] + '</p></div>\
                                        <div class="size_content"><p>'+ file_content + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) +'</p></div>\
                                    </div>'
                    }
                }
            htmlStr += "    </div>\
                            <div id='enc_more' class='btn-wrap'><a href='javascript:;' class='morebutton'><p>더보기</p><img src='./static/imgs/main/plus_icon.png'></a></div>\
                        </div>"
        }
        return htmlStr;
    },
}