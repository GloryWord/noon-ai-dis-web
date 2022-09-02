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
            htmlStr = '요청 기록이 존재하지 않습니다.'
        }
        else {
            var count = 0;
            for (var i = 0; i < 5; i++) {
                if (requestList[i]['key_name'] == 'null' && mode == 'restoration') continue;
                if (requestList[i]['complete'] == 0 && mode == 'restoration') continue;

                var date = new Date(requestList[i]['request_date'])

                if (requestList[i]['restoration'] == 1) var restoration = "O"
                else var restoration = "X"

                var fileList = requestList[i]['request_file_list'].split('\n');
                fileList = fileList.splice(0, fileList.length - 1);

                if (requestList[i]['file_type'] == "video") var type = "영상"
                else if (requestList[i]['file_type'] == "image") var type = "이미지"
                if (requestList[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"

                var status = (requestList[i]['complete'] == 1) ? '완료' : '진행중'
                htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                            <div class="id_content"><p>'+ requestList[i]['id'] + '</p></div>\
                            <div class="name_content"><p>'+ requestList[i]['request_file_list'] + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="progress_content" id="progress"><p>-</p></div>\
                            <div class="status_content"><p>'+ status + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo">\
                                    <p>상세보기</p>\
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

        var count = 0;
        for (var i = 0; i < requestList.length; i++) {
            if (requestList[i]['key_name'] == 'null' && mode == 'restoration') continue;
            if (requestList[i]['complete'] == 0 && mode == 'restoration') continue;

            var date = new Date(requestList[i]['request_date'])

            if (requestList[i]['restoration'] == 1) var restoration = "O"
            else var restoration = "X"

            var fileList = requestList[i]['request_file_list'].split('\n');
            fileList = fileList.splice(0, fileList.length - 1);

            if (requestList[i]['file_type'] == "video") var type = "영상"
            else if (requestList[i]['file_type'] == "image") var type = "이미지"
            if (requestList[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"

            var status = (requestList[i]['complete'] == 1) ? '완료' : '진행중'
            htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                            <div class="id_content"><p>'+ requestList[i]['id'] + '</p></div>\
                            <div class="name_content"><p>'+ requestList[i]['request_file_list'] + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="progress_content" id="progress"><p>-</p></div>\
                            <div class="status_content"><p>'+ status + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo">\
                                    <p>상세보기</p>\
                                </div>\
                            </div>\
                        </div>'
            // count += 1;
            // if (count == 5) break;
        }
        return htmlStr;
    },

    postDataSearch: function (filter_file, filter_rest, startDate, endDate) {
        var postdata = { filter_file: filter_file, filter_rest: filter_rest, startDate: startDate, endDate: endDate }
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

        var count = 0;
        for (var i = 0; i < requestList.length; i++) {
            // if (requestList[i]['key_name'] == 'null' && mode == 'restoration') continue;
            // if (requestList[i]['complete'] == 0 && mode == 'restoration') continue;

            var date = new Date(requestList[i]['request_date'])

            if (requestList[i]['restoration'] == 1) {
                var restoration = "O"
            }
            else {
                var restoration = "X"
            }

            if (requestList[i]['file_type'] == "video") {
                var type = "영상"
            }
            else if (requestList[i]['file_type'] == "image") {
                var type = "이미지"
            }

            var status = (requestList[i]['complete'] == 1) ? '완료' : '진행중'
            htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                            <div class="id_content"><p>'+ requestList[i]['id'] + '</p></div>\
                            <div class="name_content"><p>'+ requestList[i]['request_file_list'] + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="progress_content" id="progress"><p>-</p></div>\
                            <div class="status_content"><p>'+ status + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" class="detailInfo">\
                                    <p>상세보기</p>\
                                </div>\
                            </div>\
                        </div>'
            // count += 1;
            // if (count == 5) break;
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
                console.log(data)
            },
            error: function (xhr, status) {
                alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        var htmlStr = ''

        for (var i = 0; i < requestList.length; i++) {
            var date = new Date(requestList[i]['generated_date'])
            if (requestList[i]['key_memo'] == null || requestList[i]['key_memo'] == "") {
                var memo = ""
            }
            else {
                var memo = requestList[i]['key_memo']
            }
            htmlStr += '<div class="tableContent" id=key_index-' + requestList[i]['id'] + '>\
                            <div class="number_content"><p>'+ requestList[i]['id'] + '</p></div>\
                            <div class="name_content"><p>'+ requestList[i]['key_name'] + '</p></div>\
                            <div class="user_content"><p>'+ requestList[i]['account_name'] + '</p></div>\
                            <div class="create_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="memo_content">\
                                <p class="memo_text">'+ memo + '</p>\
                                <div data-id="'+ requestList[i]['id'] + '" class="memo_modi">\
                                    <p>수정</p>\
                                </div>\
                            </div>\
                        </div>'
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

        if (requestList[0]['key_memo'] == "" || requestList[0]['key_memo'] == null) {
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