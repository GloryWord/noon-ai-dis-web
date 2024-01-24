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
    getEncProgress: function (progressID) {
        var result = {
            'progress': '',
            'type': '',
            'status': '',
            'archived': '',
        }

        let responseMessage;

        let baseUrl = `/api/progress/encrypt?requestID=${progressID}`;
        let apiUrl = apiUrlConverter('util', baseUrl);

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.progress) {
                    result['progress'] = data.progress['encrypt_progress'];
                    result['status'] = data.progress['status'];
                    result['type'] = data.progress['file_type'];
                    result['complete'] = data.progress['complete'];
                }
                result['archived'] = data.archived;
            },
            error: function (xhr, status) {
                responseMessage = JSON.parse(xhr.responseText).message
            }
        });

        return result;
    },

    getDecProgress: function (progressID) {
        var result = {
            'progress': '',
            'type': '',
            'status': '',
            'archived': '',
        }

        let responseMessage;

        let baseUrl = `/api/progress/decrypt?requestID=${progressID}`;
        let apiUrl = apiUrlConverter('util', baseUrl);

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if (data.progress) {
                    result['progress'] = data.progress['decrypt_progress'];
                    result['status'] = data.progress['status'];
                    result['complete'] = data.progress['complete'];
                }
                result['archived'] = data.archived;
            },
            error: function (xhr, status) {
                responseMessage = JSON.parse(xhr.responseText).message
            }
        });

        return result;
    },

    getThumbProgress: function (requestID) {
        var result = {
            'progress': '',
            'type': '',
            'status': ''
        }

        let baseUrl = `/api/progress/thumbnail?requestID=${requestID}`;
        let apiUrl = apiUrlConverter('util', baseUrl);

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result['status'] = data.progress['status'];
                result['complete'] = data.progress['complete'];
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    getCheckProgress: function (requestID) {
        var result = {
            'progress': '',
            'type': '',
            'status': ''
        }

        let baseUrl = `/api/progress/check?requestID=${requestID}`
        let apiUrl = apiUrlConverter('util', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result['status'] = data.progress['status'];
                result['complete'] = data.progress['complete'];
                result['progress'] = data.progress['additional_progress'];
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    getSectorProgress: function (requestID) {
        var result = {
            'progress': '',
            'type': '',
            'status': ''
        }

        let baseUrl = `/api/progress/sector?requestID=${requestID}`;
        let apiUrl = apiUrlConverter('util', baseUrl);

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                result['status'] = data.progress['status'];
                result['complete'] = data.progress['complete'];
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    getRecentRequest: function (requestType) {
        let baseUrl = `/api/request/${requestType}/recent`
        let apiUrl = apiUrlConverter(requestType, baseUrl)
        let requestList, archived, responseMessage;

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.requestList;
                archived = data.archived;
            },
            error: function (xhr, status) {
                responseMessage = xhr.responseJSON.message
            }
        });

        var htmlStr = ''
        if (responseMessage == 'no request list') {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else {
            let cnt = 0
            console.log(requestList);
            if (requestList.length !== 0) {
                let status;
                for (var i = 0; i < requestList.length; i++) {
                    if (i == 5) break;

                    var date = new Date(requestList[i]['request_date'])

                    var namelist = requestList[i]['request_file_list'].split('\n')
                    namelist = namelist.splice(0, namelist.length - 1);

                    if (namelist.length > 1) {
                        var list = "<label> 외 " + (Number(namelist.length) - 1) + "개</label>"
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

                    if (requestList[i]['complete'] == 1) {
                        status = '<p>완료</p>'
                    }
                    else {
                        // if (requestList[i]['status'] === null) status = '<p>실패</p>';
                        // else {
                        //     if (requestList[i]['status'].indexOf('FAIL') == 1) {
                        //         status = '<p>실패</p>'
                        //     }
                        //     else {
                        //         status = `<p class="progress log${requestList[i]['id']}">${requestList[i]['encrypt_progress']}</p>`
                        //     }
                        // }
                        if (requestList[i]['status'].indexOf('FAIL') == 1) {
                            status = '<p>실패</p>'
                        }
                        else {
                            status = `<p class="progress log${requestList[i]['id']}">${requestList[i]['encrypt_progress']}</p>`
                        }
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
                    
                    if (status == "<p>완료</p>") {
                        var disable = "";
                        var m_disable = ""
                        var text = "상세정보";
                        var background = ""
                    }
                    else if (status == "<p>실패</p>") {
                        var disable = "";
                        var m_disable = ""
                        var text = "상세정보";
                        var background = "style='background-color:#f64957'"
                    }
                    else {
                        var disable = "disable";
                        var m_disable = "style='pointer-events: none;'"
                        var text = "진행중";
                        var background = ""
                    }

                    if (screen.width <= 600) {
                        htmlStr += '<div class="m_logContent" data-id="' + requestList[i]['id'] + '" data-type="' + type + '" ' + m_disable + '>\
                                        <div class="name_content" '+ css + '><p>' + namelist[0] + list + '</p></div>\
                                        <div class="etc_content">\
                                            <div class="type_content"><p>'+ type + '</p></div>\
                                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                                            <div class="status_content">'+ status + '</div>\
                                        </div>\
                                </div>'
                    }
                    else {
                        htmlStr += '<div class="logContent">\
                            <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="name_content"><p>'+ namelist[0] + '</p>' + list + '</div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="status_content">'+ status + '</div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" data-restoration="' + requestList[i]['restoration'] + '" class="detailInfo ' + disable + '" ' + background + '>\
                                    <p>'+ text + '</p>\
                                </div>\
                            </div>\
                            </div>'
                    }
                    cnt++;
                }
            }
            if (archived.length !== 0 && cnt < 5) {
                let status;
                for (var i = 0; i < archived.length; i++) {
                    if (cnt === 5) break;
                    var date = new Date(archived[i]['request_date'])

                    var namelist = archived[i]['request_file_list'].split('\n')
                    namelist = namelist.splice(0, namelist.length - 1);

                    if (namelist.length > 1) {
                        var list = "<label> 외 " + (Number(namelist.length) - 1) + "개</label>"
                        var css = ""
                    }
                    else {
                        var list = ""
                        var css = 'style="margin:auto 0 auto auto"'
                    }

                    if (archived[i]['restoration'] == 1) var restoration = "복원 가능"
                    else var restoration = "복원 불가능"
                    var fileList = archived[i]['request_file_list'].split('\n');
                    fileList = fileList.splice(0, fileList.length - 1);

                    if (archived[i]['file_type'] == "video") var type = "동영상 파일"
                    else if (archived[i]['file_type'] == "image") var type = "이미지 파일"
                    if (archived[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"
                    status = '<p> </p>'
                    var disable = "disable";
                    var m_disable = "style='pointer-events: none;'"
                    var text = "만료됨";
                    if (screen.width <= 600) {
                        htmlStr += '<div class="m_logContent" data-id="' + archived[i]['fk_enc_request_list_id'] + '" data-type="' + type + '" ' + m_disable + '>\
                                        <div class="name_content" '+ css + '><p>' + namelist[0] + list + '</p></div>\
                                        <div class="etc_content">\
                                            <div class="type_content"><p>'+ type + '</p></div>\
                                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                                            <div class="status_content">'+ status + '</div>\
                                        </div>\
                                </div>'
                    }
                    else {
                        htmlStr += '<div class="logContent">\
                            <div class="id_content"><p>'+ underTen(archived[i]['fk_enc_request_list_id']) + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="name_content"><p>'+ namelist[0] + '</p>' + list + '</div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="status_content">'+ status + '</div>\
                            <div class="detail_content">\
                                <div data-id="'+ archived[i]['fk_enc_request_list_id'] + '" data-type="' + type + '" data-restoration="' + archived[i]['restoration'] + '" class="detailInfo ' + disable + '">\
                                    <p>'+ text + '</p>\
                                </div>\
                            </div>\
                            </div>'
                    }
                    cnt++;
                }
            }
        }

        return htmlStr;
    },

    getAllEncRequestList: function (mode) {
        var requestList = ''
        let archived = null;

        let baseUrl = '/api/request/encrypt/all'
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        let noConfirm = []

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data.requestList;
                archived = data.archived;
            },
            error: function (xhr, status) {
                let responseJSON = xhr.responseJSON
                requestList = responseJSON.requestList;
                archived = responseJSON.archived;
            }
        });

        var htmlStr = ''
        console.log(requestList.length);
        if (requestList.length === 0 && archived.length === 0) {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else {
            if (requestList.length !== 0) {
                let status;
                for (var i = 0; i < requestList.length; i++) {
                    if (requestList[i]['key_name'] == 'null' && mode == 'restoration') continue;
                    if (requestList[i]['complete'] == 0 && mode == 'restoration') continue;

                    var date = new Date(requestList[i]['request_date'])

                    var namelist = requestList[i]['request_file_list'].split('\n')
                    namelist = namelist.splice(0, namelist.length - 1);

                    if (namelist.length > 1) {
                        var list = "<label> 외 " + (Number(namelist.length) - 1) + "개</label>"
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
                    // if(requestList[i]['status']==null || requestList[i]['status']==0){
                    //     var sta = "[FAIL]"
                    // }
                    // else {
                    //     var sta = requestList[i]['status']
                    // }

                    if (requestList[i]['complete'] == 1) {
                        status = '<p>완료</p>'
                    }
                    else {
                        let fail = 'FAIL'
                        if (requestList[i]['status'] === null) status = '<p>실패</p>';
                        else {
                            if (requestList[i]['status'].indexOf('FAIL') == 1) {
                                status = '<p>실패</p>'
                            }
                            else {
                                // noConfirm.push(requestList[i]['id'])
                                status = `<p class="progress log${requestList[i]['id']}"></p>`
                            }
                        }
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

                    if (status == "<p>완료</p>") {
                        var disable = "";
                        var m_disable = ""
                        var text = "상세정보";
                        var background = ""
                    }
                    else if (status == "<p>실패</p>") {
                        var disable = "";
                        var m_disable = ""
                        var text = "상세정보";
                        var background = "style='background-color:#f64957'"
                    }
                    else {
                        var disable = "disable";
                        var m_disable = "style='pointer-events: none;'"
                        var text = "진행중";
                        var background = ""
                    }
                    if (screen.width <= 600) {
                        htmlStr += '<div class="m_logContent" data-id="' + requestList[i]['id'] + '" data-type="' + type + '" ' + m_disable + '>\
                                        <div class="name_content" '+ css + '><p>' + namelist[0] + list + '</p></div>\
                                        <div class="etc_content">\
                                            <div class="type_content"><p>'+ type + '</p></div>\
                                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                                            <div class="status_content">'+ status + '</div>\
                                        </div>\
                                </div>'
                    }
                    else {
                        htmlStr += '<div class="logContent">\
                            <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="name_content"><p>'+ namelist[0] + '</p>' + list + '</div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="status_content">'+ status + '</div>\
                            <div class="detail_content">\
                                <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" data-restoration="' + requestList[i]['restoration'] + '" class="detailInfo ' + disable + '" ' + background + '>\
                                    <p>'+ text + '</p>\
                                </div>\
                            </div>\
                            </div>'
                    }
                }
            }
            if (archived.length !== 0) {
                let status;
                for (var i = 0; i < archived.length; i++) {
                    if (archived[i]['complete'] == 0 && mode == 'restoration') continue;

                    var date = new Date(archived[i]['request_date'])
                    var namelist = archived[i]['request_file_list'].split('\n')
                    namelist = namelist.splice(0, namelist.length - 1);

                    if (namelist.length > 1) {
                        var list = "<label> 외 " + (Number(namelist.length) - 1) + "개</label>"
                        var css = ""
                    }
                    else {
                        var list = ""
                        var css = 'style="margin:auto 0 auto auto"'
                    }

                    if (archived[i]['restoration'] == 1) var restoration = "복원 가능"
                    else var restoration = "복원 불가능"
                    var fileList = archived[i]['request_file_list'].split('\n');
                    fileList = fileList.splice(0, fileList.length - 1);

                    if (archived[i]['file_type'] == "video") var type = "동영상 파일"
                    else if (archived[i]['file_type'] == "image") var type = "이미지 파일"
                    if (archived[i]['file_type'] == "image" && fileList.length > 1) var type = "이미지 그룹"
                    status = '<p> </p>'
                    var disable = "disable";
                    var m_disable = "style='pointer-events: none;'"
                    var text = "만료됨";
                    if (screen.width <= 600) {
                        htmlStr += '<div class="m_logContent" data-id="' + archived[i]['fk_enc_request_list_id'] + '" data-type="' + type + '" ' + m_disable + '>\
                                        <div class="name_content" '+ css + '><p>' + namelist[0] + list + '</p></div>\
                                        <div class="etc_content">\
                                            <div class="type_content"><p>'+ type + '</p></div>\
                                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                                            <div class="status_content">'+ status + '</div>\
                                        </div>\
                                </div>'
                    }
                    else {
                        htmlStr += '<div class="logContent">\
                            <div class="id_content"><p>'+ underTen(archived[i]['fk_enc_request_list_id']) + '</p></div>\
                            <div class="type_content"><p>'+ type + '</p></div>\
                            <div class="name_content"><p>'+ namelist[0] + '</p>' + list + '</div>\
                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                            <div class="rest_content"><p>'+ restoration + '</p></div>\
                            <div class="status_content">'+ status + '</div>\
                            <div class="detail_content">\
                                <div data-id="'+ archived[i]['fk_enc_request_list_id'] + '" data-type="' + type + '" data-restoration="' + archived[i]['restoration'] + '" class="detailInfo ' + disable + '">\
                                    <p>'+ text + '</p>\
                                </div>\
                            </div>\
                            </div>'
                    }
                }
            }
        }

        return [htmlStr, noConfirm];
        // return requestList;
    },

    postDataSearch: function (filter_video, filter_image, filter_album, filter_reco, filter_norest, filter_file, filter_rest, startDate, endDate) {
        var postdata = { filter_video: filter_video, filter_image: filter_image, filter_album: filter_album, filter_reco: filter_reco, filter_norest: filter_norest, filter_file: filter_file, filter_rest: filter_rest, startDate: startDate, endDate: endDate }
        var requestList = ''

        let baseUrl = '/api/search/encrypt'
        let apiUrl = apiUrlConverter('encrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
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

        if (requestList[0] == null || requestList.message == 'error' || requestList.message == 'No request list found') {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else {
            for (var i = 0; i < requestList.length; i++) {
                var date = new Date(requestList[i]['request_date'])

                var namelist = requestList[i]['request_file_list'].split('\n')
                namelist = namelist.splice(0, namelist.length - 1);

                if (namelist.length > 1) {
                    var list = "<label> 외 " + (Number(namelist.length) - 1) + "개</label>"
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
                if (requestList[i]['status'] == null || requestList[i]['status'] == 0) {
                    var sta = "[FAIL]"
                }
                else {
                    var sta = requestList[i]['status']
                }

                if (requestList[i]['complete'] == 1) {
                    var status = '<p>완료</p>'
                }
                else if (sta.indexOf("FAIL") == 1 || sta.indexOf("Fail") != -1) {
                    var status = '<p>실패</p>'
                }
                else {
                    var status = '<p id="progress"></p>'
                }

                if (status == "<p>완료</p>") {
                    var disable = "";
                    var m_disable = ""
                    var text = "상세정보";
                    var background = ""
                }
                else if (status == "<p>실패</p>") {
                    var disable = "";
                    var m_disable = ""
                    var text = "상세정보";
                    var background = "style='background-color:#f64957'"
                }
                else {
                    var disable = "disable";
                    var m_disable = "style='pointer-events: none;'"
                    var text = "진행중";
                    var background = ""
                }
                if (screen.width <= 600) {
                    htmlStr += '<div class="m_logContent" data-id="' + requestList[i]['id'] + '" data-type="' + type + '" ' + m_disable + '>\
                                    <div class="name_content" '+ css + '><p>' + namelist[0] + list + '</p></div>\
                                    <div class="etc_content">\
                                        <div class="type_content"><p>'+ type + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                                        <div class="status_content">'+ status + '</div>\
                                    </div>\
                            </div>'
                }
                else {
                    htmlStr += '<div class="logContent">\
                        <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                        <div class="type_content"><p>'+ type + '</p></div>\
                        <div class="name_content"><p>'+ namelist[0] + '</p>' + list + '</div>\
                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                        <div class="rest_content"><p>'+ restoration + '</p></div>\
                        <div class="status_content">'+ status + '</div>\
                        <div class="detail_content">\
                            <div data-id="'+ requestList[i]['id'] + '" data-type="' + type + '" data-restoration="' + requestList[i]['restoration'] + '" class="detailInfo ' + disable + '" ' + background + '>\
                                <p>'+ text + '</p>\
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
        let archived = null;

        let baseUrl = '/api/request/decrypt/all'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                console.log(data);
                requestList = data.requestList;
                archived = data.archived;
            },
            error: function (xhr, status) {
                let responseJSON = xhr.responseJSON
                requestList = responseJSON.requestList;
                archived = responseJSON.archived;
            }
        });

        var htmlStr = ''

        if (requestList.length === 0 && archived.length === 0) {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else {
            if (requestList.length !== 0) {
                let status;
                let btn;
                for (let i = 0; i < requestList.length; i++) {
                    let namelist = requestList[i]['request_file_list'].split('\n')
                    namelist = namelist.splice(0, namelist.length - 1);

                    if (namelist.length > 2 && requestList[i].file_type === 'image') {
                        var list = "<label> 외 " + (Number(namelist.length) / 2 - 1) + "개</label>"
                        var css = ""
                    }
                    else {
                        var list = ""
                        var css = 'style="margin:auto 0 auto auto"'
                    }

                    let fileList = requestList[i]['request_file_list'].split('\n');
                    fileList = fileList.splice(0, fileList.length - 1);

                    // status = (requestList[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
                    
                    if(requestList[i]['download_status']=="waiting"){
                        status="대기중"
                        btn = ""
                    }
                    else if(requestList[i]['download_status']=="processing"){
                        status="진행중"
                        btn = ""
                    }
                    else if(requestList[i]['download_status']=="complete"){
                        status="완 료"
                        btn = `<div class='decDownload active' data-idx=${requestList[i]['id']}>
                                    <a href=${requestList[i]['download_url']} download>
                                        <span>다운로드</span>
                                    </a>
                                </div>`
                    }
                    else if(requestList[i]['download_status']=="downloaded"){
                        status="다운로드 \n완료"
                        btn = `<div class='decDownload disable'>
                                    <span>만 료</span>
                                </div>`
                    }
                    else if(requestList[i]['download_status']=="expired" || requestList[i]['download_status']==null){
                        status="기간 만료"
                        btn = `<div class='decDownload disable'>
                                    <span>만 료</span>
                                </div>`
                    }
                    else if(requestList[i]['download_status']=="failed"){
                        status="실 패"
                        btn = `<div class='decDownload fail'>
                                    <a href='/qna'>
                                        <span>실 패</span>
                                    </a>
                                </div>`
                    }
                    
                    if (requestList[i]['file_type'] == "video") var type = "동영상 파일"
                    else if (requestList[i]['file_type'] == "image") var type = "이미지 파일"
                    else var type = ""
                    if (requestList[i]['file_type'] == "image" && fileList.length > 2) var type = "이미지 그룹"
                    let expiredDate = ""
                    if(requestList[i]["expiration_datetime"]!=null){
                        expiredDate = koreanTimeStamp(requestList[i]["expiration_datetime"])
                    }
                    if (screen.width <= 600) {
                        htmlStr += `<div class="m_logContent" data-id="${requestList[i]["id"]}" data-type="${type}">
                                        <div class="name_content" ${css}><p>${namelist[0]}${list}</p></div>
                                        <div class="etc_content">
                                            <div class="type_content"><p>${type}</p></div>
                                            <div class="date_content"><p>${dateFormat(date)}</p></div>
                                            <div class="status_content"><p>${status}</p></div>
                                        </div>\
                                    </div>`
                    }
                    else {
                        htmlStr += `<div class="logContent" id=enc_request_index-${requestList[i]['id']}>
                                        <div class="id_content"><p>${underTen(requestList[i]['id'])}</p></div>
                                        <div class="type_content"><p>${type}</p></div>
                                        <div class="name_content" ${css}><p>${namelist[0]}</p>${list}</div>
                                        <div class="date_content"><p>${koreanTimeStamp(requestList[i]["request_datetime"])}</p></div>
                                        <div class="rest_content"><p>${expiredDate}</p></div>
                                        <div class="status_content"><p class='status${requestList[i]['id']} progress log${requestList[i]['id']}'>${status}</p></div>
                                        <div class="detail_content">${btn}</div>
                                    </div>`
                    }
                }
            }
            if (archived.length !== 0) {
                let status;
                let btn = `<div class='decDownload disable'>
                                <span>만 료</span>
                            </div>`
                for (let i = 0; i < archived.length; i++) {
                    let date = new Date(archived[i]['request_date'])

                    let namelist = archived[i]['request_file_list'].split('\n')
                    namelist = namelist.splice(0, namelist.length - 1);

                    if (namelist.length > 2 && archived[i].file_type === 'image') {
                        var list = "<label> 외 " + (Number(namelist.length) / 2 - 1) + "개</label>"
                        var css = ""
                    }
                    else {
                        var list = ""
                        var css = 'style="margin:auto 0 auto auto"'
                    }

                    var fileList = archived[i]['request_file_list'].split('\n');
                    fileList = fileList.splice(0, fileList.length - 1);

                    // status = (archived[i]['complete'] == 1) ? '<p>완료</p>' : '<p id="progress"></p>'
                    
                    if(archived[i]['download_status']=="waiting"){
                        status="대기중"
                    }
                    else if(archived[i]['download_status']=="processing"){
                        status="진행중"
                    }
                    else if(archived[i]['download_status']=="complete"){
                        status="완 료"
                    }
                    else if(archived[i]['download_status']=="downloaded"){
                        status="다운로드 \n완료"
                    }
                    else if(archived[i]['download_status']=="expired" || archived[i]['download_status']==null){
                        status="기간 만료"
                    }
                    else if(archived[i]['download_status']=="failed"){
                        status="실 패"
                        btn = `<div class='decDownload disable'>
                                    <a href='/qna'>
                                        <span>실 패</span>
                                    </a>
                                </div>`
                    }

                    if (archived[i]['file_type'] == "video") var type = "동영상 파일"
                    else if (archived[i]['file_type'] == "image") var type = "이미지 파일"
                    else var type = ""
                    if (archived[i]['file_type'] == "image" && fileList.length > 2) var type = "이미지 그룹"
                    let expiredDate = ""
                    if(archived[i]["expiration_datetime"]!=null){
                        expiredDate = koreanTimeStamp(archived[i]["expiration_datetime"])
                    }
                    if (screen.width <= 600) {
                        htmlStr += `<div class="m_logContent" data-id="${archived[i]['fk_dec_request_list_id']}" data-type="${type}">
                                        <div class="name_content" ${css}><p>${namelist[0]}${list}</p></div>
                                        <div class="etc_content">
                                            <div class="type_content"><p>${type}</p></div>
                                            <div class="date_content"><p>${dateFormat(date)}</p></div>
                                            <div class="status_content">${status}</div>
                                        </div>\
                                    </div>`
                    }
                    else {
                        htmlStr += `<div class="logContent" id=enc_request_index-${archived[i]['fk_dec_request_list_id']}>
                                        <div class="id_content"><p>${underTen(archived[i]['fk_dec_request_list_id'])}</p></div>
                                        <div class="type_content"><p>${type}</p></div>
                                        <div class="name_content" ${css}><p>${namelist[0]}</p>${list}</div>
                                        <div class="date_content"><p>${koreanTimeStamp(archived[i]["request_datetime"])}</p></div>
                                        <div class="rest_content"><p>${expiredDate}</p></div>
                                        <div class="status_content"><p>${status}</p></div>
                                        <div class="detail_content">${btn}</div>
                                    </div>`
                    }
                }
            }
        }

        return htmlStr;
    },

    postDataDecSearch: function (filter_video, filter_image, filter_album, filter_file, startDate, endDate) {
        var postdata = { filter_video: filter_video, filter_image: filter_image, filter_album: filter_album, filter_file: filter_file, startDate: startDate, endDate: endDate }
        var requestList = ''

        let baseUrl = '/api/search/decrypt'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
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

        if (requestList[0] == null || requestList.message == 'error' || requestList.message == 'No request list found') {
            htmlStr = '<div class="nodata"><p>요청 기록이 존재하지 않습니다.</p></div>'
        }
        else {
            for (var i = 0; i < requestList.length; i++) {
                var date = new Date(requestList[i]['request_date'])

                var namelist = requestList[i]['request_file_list'].split('\n')
                namelist = namelist.splice(0, namelist.length - 1);

                if (namelist.length > 1) {
                    var list = "<label> 외 " + (Number(namelist.length) - 1) + "개</label>"
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
                if (screen.width <= 600) {
                    htmlStr += '<div class="m_logContent" data-id="' + requestList[i]['id'] + '" data-type="' + type + '">\
                                    <div class="name_content" '+ css + '><p>' + namelist[0] + list + '</p></div>\
                                    <div class="etc_content">\
                                        <div class="type_content"><p>'+ type + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        <div class="status_content">'+ status + '</div>\
                                    </div>\
                                </div>'
                }
                else {
                    htmlStr += '<div class="logContent" id=enc_request_index-' + requestList[i]['id'] + '>\
                                    <div class="id_content"><p>'+ underTen(requestList[i]['id']) + '</p></div>\
                                    <div class="type_content"><p>'+ type + '</p></div>\
                                    <div class="name_content" '+ css + '><p>' + namelist[0] + '</p>' + list + '</div>\
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

        let baseUrl = '/api/key/all'
        let apiUrl = apiUrlConverter('key', baseUrl)
        let auth = null;
        let responseMessage = '';

        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                requestList = data;
                auth = data.auth;
            },
            error: function (xhr, status) {
                responseMessage = xhr.responseJSON.message
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        var htmlStr = ''
        if (responseMessage == "no key list") {
            htmlStr += '<div class="tableContent">\
                            <p>생성된 암호 키가 없어요</p>\
                        </div>'
        }
        else {
            if (screen.width <= 600) {
                for (var i = 0; i < requestList['keyList'].length; i++) {
                    var date = new Date(requestList['keyList'][i]['generated_date'])
                    if (requestList['keyList'][i]['key_memo'] == null || requestList['keyList'][i]['key_memo'] == "") {
                        var memo = ""
                    }
                    else {
                        var memo = requestList['keyList'][i]['key_memo']
                    }

                    if (requestList['account'] != requestList['keyList'][i]['account_name']) {
                        var modi = "hide"
                    }
                    else {
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
            else {
                for (var i = 0; i < requestList['keyList'].length; i++) {
                    var date = new Date(requestList['keyList'][i]['generated_date'])
                    var expiry_date = moment(requestList['keyList'][i]['expiry_datetime']).format('YYYY-MM-DD');
                    if (requestList['keyList'][i]['key_memo'] == null || requestList['keyList'][i]['key_memo'] == "") {
                        var memo = ""
                    }
                    else {
                        var memo = requestList['keyList'][i]['key_memo']
                    }

                    if (requestList['account'] != requestList['keyList'][i]['account_name']) {
                        var modi = "hide"
                    }
                    else {
                        var modi = ""
                    }

                    let visible = ""
                    if (auth !== 'master') visible = "hide";

                    let memoModal = ""
                    if (memo != "") {
                        memoModal = `<div class='memoModal num${requestList['keyList'][i]['id']}'>
                                        <span>${memo}</span>
                                    </div>`
                    }

                    htmlStr += `<div class="tableContent" id=key_index-${requestList['keyList'][i]['id']}>
                                    <div class="number_content"><p>${requestList['keyList'][i]['id']}</p></div>
                                    <div class="name_content"><p class="keyname${requestList['keyList'][i]['id']}">${requestList['keyList'][i]['key_name']}</p></div>
                                    <div class="user_content"><p>${requestList['keyList'][i]['user_name']}</p></div>
                                    <div class="create_content"><p>${dateFormat(date)}</p></div>
                                    <div class="expiration_content"><p>${expiry_date}</p></div>
                                    <div class="memo_content">
                                        <p class="memo_text" data-id="${requestList['keyList'][i]['id']}">${memo}</p>
                                        <div data-id="${requestList['keyList'][i]['id']}" class="memo_modi ${modi}">
                                            <img src="./static/imgs/key/memoModidyIcon.png">
                                        </div>
                                        ${memoModal}
                                    </div>
                                    <div class="change_content">
                                        <div data-id="${requestList['keyList'][i]['id']}" class="change_btn">
                                            <p>변경</p>
                                        </div>
                                    </div>
                                    <div class="delete_content">
                                        <div data-id="${requestList['keyList'][i]['id']}" class="delete_btn">
                                            <p>삭제</p>
                                        </div>
                                    </div>
                                </div>`
                }
            }

        }

        return htmlStr;
    },

    getKeyMemo: function (key_idx) {
        var requestList = ''

        let baseUrl = `/api/key/memo/${key_idx}`
        let apiUrl = apiUrlConverter('key', baseUrl)

        $.ajax({
            method: "get",
            url: apiUrl,
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

        let baseUrl = `/api/key/memo/${key_idx}`
        let apiUrl = apiUrlConverter('key', baseUrl)

        $.ajax({
            method: "put",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            async: false,
            success: function (data) {
                Swal.fire({
                    title: '메모 수정이 완료되었습니다.',
                    showConfirmButton: true,
                    showDenyButton: false,
                    confirmButtonText: "확 인",
                    icon: "success"
                }).then(() => {
                    location.href = '/key';
                })
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return 0;
    },

    // getMonthUsage: function (searchMonth) {
    //     var requestList = ''

    //     let baseUrl = `/api/usage?searchMonth=${searchMonth}`
    //     let apiUrl = apiUrlConverter('util', baseUrl)

    //     $.ajax({
    //         method: "get",
    //         url: apiUrl,
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         async: false,
    //         success: function (data) {
    //             // result = data['progress']
    //             requestList = data['results'];
    //         },
    //         error: function (xhr, status) {
    //             // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
    //         }
    //     });

    //     var htmlStr = ""

    //     var userName = []

    //     for(var i=0;i<requestList[0].length;i++){
    //         userName.push(requestList[0][i]["user_name"])
    //     }
    //     userName = new Set(userName)
    //     userName = Array.from(userName)

    //     var usageObject = {}
    //     var imageObject = {}
    //     var videoObject = {}

    //     for (var i = 0; i < userName.length; i++) {
    //         var detailUsage = {
    //             encrypt_request_count: 0,
    //             decrypt_request_count: 0,
    //             download_request_count: 0,
    //             total_download_size: 0,
    //             encrypt_request_charge: 0,
    //             decrypt_request_charge: 0,
    //             download_request_charge: 0
    //         }

    //         usageObject[userName[i]] = detailUsage;
    //     }

    //     for (var i = 0; i < userName.length; i++) {
    //         var detailUsage = {
    //             encrypt_request_count: 0,
    //             decrypt_request_count: 0,
    //             download_request_count: 0,
    //             total_download_size: 0
    //         }
    //         imageObject[userName[i]] = detailUsage;
    //     }

    //     for (var i = 0; i < userName.length; i++) {
    //         var detailUsage = {
    //             encrypt_request_count: 0,
    //             decrypt_request_count: 0,
    //             download_request_count: 0,
    //             total_download_size: 0
    //         }
    //         videoObject[userName[i]] = detailUsage;
    //     }

    //     for (var i = 0; i < requestList[0].length; i++) {
    //         var request_type = requestList[0][i]['request_type'];

    //         if(request_type == 'encrypt') {
    //             usageObject[requestList[0][i]['user_name']]['encrypt_request_count'] = requestList[0][i]['count(*)']
    //             usageObject[requestList[0][i]['user_name']]['encrypt_request_charge'] = Number(requestList[0][i]['sum(service_charge)'])
    //         }
    //         else if(request_type == 'decrypt') {
    //             usageObject[requestList[0][i]['user_name']]['decrypt_request_count'] = requestList[0][i]['count(*)']
    //             usageObject[requestList[0][i]['user_name']]['decrypt_request_charge'] = Number(requestList[0][i]['sum(service_charge)'])
    //         }
    //         else if(request_type == 'download') {
    //             usageObject[requestList[0][i]['user_name']]['download_request_count'] = requestList[0][i]['count(*)']
    //             usageObject[requestList[0][i]['user_name']]['total_download_size'] += requestList[0][i]['sum(file_size)']
    //             usageObject[requestList[0][i]['user_name']]['download_request_charge'] = Number(requestList[0][i]['sum(service_charge)'])
    //         }
    //     }
    //     var temp = searchMonth.split('-');
    //     var year = temp[0]
    //     var month = temp[1]
    //     if(screen.width<=600){
    //         htmlStr += "<div class='m_logArea'>\
    //                             <div class='usageBox'>\
    //                             <div class='textArea'>\
    //                                 <p>"+year+"년 "+month+"월 총 사용량</p>\
    //                             </div>\
    //                             <div class='tbHeader'>\
    //                                 <div class='user_header'><h3>담당자</h3></div>\
    //                                 <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
    //                                 <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
    //                                 <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
    //                                 <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
    //                             </div>\
    //                             <div class='tbBody'>"
    //                 console.log(usageObject)
    //                 for(var i=0;i<userName.length;i++){
    //                     htmlStr += "<div class='tbContent'>\
    //                                     <div class='user_content'><p>"+userName[i]+"</p></div>\
    //                                     <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['encrypt_request_count']+"</p></div>\
    //                                     <div class='decrypt_upload_content'><p>"+usageObject[userName[i]]['decrypt_request_count']+"</p></div>\
    //                                     <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['download_request_count']+"</p></div>\
    //                                     <div class='total_download_content'><p>"+formatBytes(usageObject[userName[i]]['total_download_size'])+"</p></div>\
    //                                 </div>"
    //                 }
    //                 htmlStr += "    </div>\
    //                         </div>\
    //                     </div>"
    //     }
    //     else{
    //         htmlStr += "<div class='usageBox'>\
    //                         <div class='textArea'>\
    //                             <p>"+year+"년 "+month+"월 총 사용량</p>\
    //                         </div>\
    //                         <div class='tbHeader'>\
    //                             <div class='user_header'><h3>담당자</h3></div>\
    //                             <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
    //                             <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
    //                             <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
    //                             <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
    //                         </div>\
    //                         <div class='tbBody'>"
    //             for(var i=0;i<userName.length;i++){
    //                 htmlStr += "<div class='tbContent'>\
    //                                 <div class='user_content'><p>"+userName[i]+"</p></div>\
    //                                 <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['encrypt_request_count']+"</p></div>\
    //                                 <div class='decrypt_upload_content'><p>"+usageObject[userName[i]]['decrypt_request_count']+"</p></div>\
    //                                 <div class='encrypt_upload_content'><p>"+usageObject[userName[i]]['download_request_count']+"</p></div>\
    //                                 <div class='total_download_content'><p>"+formatBytes(usageObject[userName[i]]['total_download_size'])+"</p></div>\
    //                             </div>"
    //             }
    //             htmlStr += "    </div>\
    //                     </div>"
    //     }

    //     for (var i = 0; i < requestList[1].length; i++) {
    //         var file_type = requestList[1][i]['file_type'];
    //         var request_type = requestList[1][i]['request_type'];

    //         if(request_type == 'encrypt') {
    //             if(file_type == 'image') imageObject[requestList[1][i]['user_name']]['encrypt_request_count'] = requestList[1][i]['count(*)']
    //             else if(file_type == 'video') videoObject[requestList[1][i]['user_name']]['encrypt_request_count'] = requestList[1][i]['count(*)']
    //         }
    //         else if(request_type == 'decrypt') {
    //             if(file_type == 'image') imageObject[requestList[1][i]['user_name']]['decrypt_request_count'] = requestList[1][i]['count(*)']
    //             else if(file_type == 'video') videoObject[requestList[1][i]['user_name']]['decrypt_request_count'] = requestList[1][i]['count(*)']
    //         }
    //         else if(request_type == 'download') {
    //             if(file_type == 'image') {
    //                 imageObject[requestList[1][i]['user_name']]['download_request_count'] = requestList[1][i]['count(*)']
    //                 imageObject[requestList[1][i]['user_name']]['total_download_size'] += requestList[1][i]['sum(file_size)']
    //             }
    //             else if(file_type == 'video'){
    //                 videoObject[requestList[1][i]['user_name']]['download_request_count'] = requestList[1][i]['count(*)']
    //                 videoObject[requestList[1][i]['user_name']]['total_download_size'] += requestList[1][i]['sum(file_size)']
    //             }
    //         }
    //     }

    //     var totalEncryptCharge = 0
    //     var totalDecryptCharge = 0 
    //     var totalDownloadCharge = 0 
    //     var totalCharge = 0

    //     for(var keys in usageObject) {
    //         totalEncryptCharge += usageObject[keys]['encrypt_request_charge'];
    //         totalDecryptCharge += usageObject[keys]['decrypt_request_charge'];
    //         totalDownloadCharge += usageObject[keys]['download_request_charge'];
    //     }
    //     totalCharge = totalEncryptCharge + totalDecryptCharge + totalDownloadCharge;

    //     //월별 청구 금액
    //     if(screen.width<=600){
    //         htmlStr += `<div class='m_logArea'>\
    //                         <div class='usageBox'>\
    //                             <div class='textArea'>\
    //                                 <p>${year}년 ${month}월 청구 금액</p>\
    //                             </div>\
    //                             <div class='tbHeader'>\
    //                                 <div class='encrypt_charge_header'><h3>비식별화 서비스 요금</h3></div>\
    //                                 <div class='decrypt_charge_header'><h3>복호화 서비스 요금</h3></div>\
    //                                 <div class='download_charge_header'><h3>다운로드 발생 비용</h3></div>\
    //                                 <div class='total_charge_header'><h3>합계</h3></div>\
    //                             </div>\
    //                             <div class='tbBody'>\
    //                             <div class='tbContent'>\
    //                                     <div class='encrypt_charge_content'><p>${totalEncryptCharge.toLocaleString('en-US')} 원</p></div>\
    //                                     <div class='decrypt_charge_content'><p>${totalDecryptCharge.toLocaleString('en-US')} 원</p></div>\
    //                                     <div class='download_charge_content'><p>${totalDownloadCharge.toLocaleString('en-US')} 원</p></div>\
    //                                     <div class='total_charge_content'><p>${totalCharge.toLocaleString('en-US')} 원</p></div>\
    //                                 </div>\
    //                             </div>\
    //                         </div>\
    //                     </div>`
    //     }
    //     else{
    //         htmlStr += `<div class='usageBox'>
    //                         <div class='textArea'>
    //                             <p>${year}년 ${month}월 청구 금액</p>
    //                         </div>
    //                         <div class='tbHeader'>
    //                             <div class='encrypt_charge_header'><h3>비식별화 서비스 요금</h3></div>
    //                             <div class='decrypt_charge_header'><h3>복호화 서비스 요금</h3></div>
    //                             <div class='download_charge_header'><h3>다운로드 발생 비용</h3></div>
    //                             <div class='total_charge_header'><h3>합계</h3></div>
    //                         </div>
    //                         <div class='tbBody'>
    //                         <div class='tbContent'>
    //                                 <div class='encrypt_charge_content'><p>${totalEncryptCharge.toLocaleString('en-US')} 원</p></div>
    //                                 <div class='decrypt_charge_content'><p>${totalDecryptCharge.toLocaleString('en-US')} 원</p></div>
    //                                 <div class='download_charge_content'><p>${totalDownloadCharge.toLocaleString('en-US')} 원</p></div>
    //                                 <div class='total_charge_content'><p>${totalCharge.toLocaleString('en-US')} 원</p></div>
    //                             </div>
    //                         </div>
    //                     </div>`
    //     }


    //     //월별 이미지 파일 사용량
    //     if(screen.width<=600){
    //         htmlStr += "<div class='m_logArea'>\
    //                         <div class='usageBox'>\
    //                             <div class='textArea'>\
    //                                 <p>"+year+"년 "+month+"월 이미지 파일 사용량</p>\
    //                             </div>\
    //                             <div class='tbHeader'>\
    //                                 <div class='user_header'><h3>담당자</h3></div>\
    //                                 <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
    //                                 <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
    //                                 <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
    //                                 <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
    //                             </div>\
    //                             <div class='tbBody'>"
    //                 for(var i=0;i<userName.length;i++){
    //                     htmlStr += "<div class='tbContent'>\
    //                                     <div class='user_content'><p>"+userName[i]+"</p></div>\
    //                                     <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['encrypt_request_count']+"</p></div>\
    //                                     <div class='decrypt_upload_content'><p>"+imageObject[userName[i]]['decrypt_request_count']+"</p></div>\
    //                                     <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['download_request_count']+"</p></div>\
    //                                     <div class='total_download_content'><p>"+formatBytes(imageObject[userName[i]]['total_download_size'])+"</p></div>\
    //                                 </div>"
    //                 }
    //                 htmlStr += "</div>\
    //                         </div>\
    //                     </div>"
    //     }
    //     else{
    //         htmlStr += "<div class='usageBox'>\
    //                         <div class='textArea'>\
    //                             <p>"+year+"년 "+month+"월 이미지 파일 사용량</p>\
    //                         </div>\
    //                         <div class='tbHeader'>\
    //                             <div class='user_header'><h3>담당자</h3></div>\
    //                             <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
    //                             <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
    //                             <div class='encrypt_download_header'><h3>파일 다운로드 건수</h3></div>\
    //                             <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
    //                         </div>\
    //                         <div class='tbBody'>"
    //             for(var i=0;i<userName.length;i++){
    //                 htmlStr += "<div class='tbContent'>\
    //                                 <div class='user_content'><p>"+userName[i]+"</p></div>\
    //                                 <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['encrypt_request_count']+"</p></div>\
    //                                 <div class='decrypt_upload_content'><p>"+imageObject[userName[i]]['decrypt_request_count']+"</p></div>\
    //                                 <div class='encrypt_upload_content'><p>"+imageObject[userName[i]]['download_request_count']+"</p></div>\
    //                                 <div class='total_download_content'><p>"+formatBytes(imageObject[userName[i]]['total_download_size'])+"</p></div>\
    //                             </div>"
    //             }
    //             htmlStr += "    </div>\
    //                     </div>"   
    //     }


    //     //월별 동영상 파일 사용량
    //     if(screen.width<=600){
    //         htmlStr += "<div class='m_logArea'>\
    //                         <div class='usageBox'>\
    //                             <div class='textArea'>\
    //                                 <p>"+year+"년 "+month+"월 동영상 파일 사용량</p>\
    //                             </div>\
    //                             <div class='tbHeader'>\
    //                                 <div class='user_header'><h3>담당자</h3></div>\
    //                                 <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
    //                                 <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
    //                                 <div class='encrypt_download_header'><h3>비식별화 파일 다운로드 건수</h3></div>\
    //                                 <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
    //                             </div>\
    //                             <div class='tbBody'>"
    //                 for(var i=0;i<userName.length;i++){
    //                     htmlStr += "<div class='tbContent'>\
    //                                     <div class='user_content'><p>"+userName[i]+"</p></div>\
    //                                     <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['encrypt_request_count']+"</p></div>\
    //                                     <div class='decrypt_upload_content'><p>"+videoObject[userName[i]]['decrypt_request_count']+"</p></div>\
    //                                     <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['download_request_count']+"</p></div>\
    //                                     <div class='total_download_content'><p>"+formatBytes(videoObject[userName[i]]['total_download_size'])+"</p></div>\
    //                                 </div>"
    //                 }
    //                 htmlStr += "</div>\
    //                         </div>\
    //                     </div>"
    //     }
    //     else{
    //         htmlStr += "<div class='usageBox'>\
    //                         <div class='textArea'>\
    //                             <p>"+year+"년 "+month+"월 동영상 파일 사용량</p>\
    //                         </div>\
    //                         <div class='tbHeader'>\
    //                             <div class='user_header'><h3>담당자</h3></div>\
    //                             <div class='encrypt_upload_header'><h3>비식별화 요청 건수</h3></div>\
    //                             <div class='decrypt_upload_header'><h3>복호화 요청 건수</h3></div>\
    //                             <div class='encrypt_download_header'><h3>비식별화 파일 다운로드 건수</h3></div>\
    //                             <div class='total_download_header'><h3>총 다운로드 용량</h3></div>\
    //                         </div>\
    //                         <div class='tbBody'>"
    //             for(var i=0;i<userName.length;i++){
    //                 htmlStr += "<div class='tbContent'>\
    //                                 <div class='user_content'><p>"+userName[i]+"</p></div>\
    //                                 <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['encrypt_request_count']+"</p></div>\
    //                                 <div class='decrypt_upload_content'><p>"+videoObject[userName[i]]['decrypt_request_count']+"</p></div>\
    //                                 <div class='encrypt_upload_content'><p>"+videoObject[userName[i]]['download_request_count']+"</p></div>\
    //                                 <div class='total_download_content'><p>"+formatBytes(videoObject[userName[i]]['total_download_size'])+"</p></div>\
    //                             </div>"
    //             }
    //             htmlStr += "    </div>\
    //                     </div>"   
    //     }     

    //     return htmlStr;
    // },

    getMonthTypeUsage: function (type, date) {
        var logType = ''
        if (type == "encrypt_request") logType = 'encrypt'
        else if (type == "decrypt_request") logType = 'decrypt'
        else if (type == "download_request") logType = 'download'

        let baseUrl = `/api/usage${logType}?date=${date}`
        let apiUrl = apiUrlConverter('util', baseUrl)

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
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        let htmlStr = ''

        if (logType == 'decrypt') {
            var file_header = ""
        }
        else {
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
                                <div class='size_header'><h3>"+ file_header + "</h3></div>\
                                <div class='date_content'><h3>요청 날짜</h3></div>\
                            </div>\
                            <div class='mainLog'>\
                                <div class='nodata'><p>요청 기록이 존재하지 않습니다.</p></div>\
                            </div>\
                        </div>"
        }
        else {
            htmlStr += "<div class='logTable'>\
                            <div class='logHeader'>\
                                <div class='id_header'><h3>ID</h3></div>\
                                <div class='user_header'><h3>사용자</h3></div>\
                                <div class='file_header'><h3>파일명</h3></div>\
                                <div class='type_header'><h3>파일 타입</h3></div>\
                                <div class='extension_header'><h3>파일 확장자명</h3></div>\
                                <div class='size_header'><h3>"+ file_header + "</h3></div>\
                                <div class='date_content'><h3>요청 날짜</h3></div>\
                            </div>\
                            <div class='mainLog'>"
            for (var i = 0; i < requestList.length; i++) {
                var date = new Date(requestList[i]['request_date'])
                if (logType == 'decrypt') {
                    var file_content = ""
                }
                else {
                    var file_content = formatBytes(requestList[i]["file_size"])
                }
                if (screen.width <= 600) {
                    htmlStr += '<div class="m_logContent">\
                                        <div class="file_content"><p>'+ requestList[i]["file_name"] + '</p></div>\
                                        <div class="etc_content">\
                                            <div class="user_content"><p>'+ requestList[i]["user_name"] + '</p></div>\
                                            <div class="type_content"><p>'+ requestList[i]["file_type"] + '</p></div>\
                                            <div class="extension_content"><p>'+ requestList[i]["file_extension"] + '</p></div>\
                                            <div class="size_content"><p>'+ file_content + '</p></div>\
                                            <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                        </div>\
                                    </div>'
                }
                else {
                    htmlStr += '<div class="logContent">\
                                        <div class="id_content"><p>'+ requestList[i]["request_id"] + '</p></div>\
                                        <div class="user_content"><p>'+ requestList[i]["user_name"] + '</p></div>\
                                        <div class="file_content"><p>'+ requestList[i]["file_name"] + '</p></div>\
                                        <div class="type_content"><p>'+ requestList[i]["file_type"] + '</p></div>\
                                        <div class="extension_content"><p>'+ requestList[i]["file_extension"] + '</p></div>\
                                        <div class="size_content"><p>'+ file_content + '</p></div>\
                                        <div class="date_content"><p>'+ dateFormat(date) + '</p></div>\
                                    </div>'
                }
            }
            htmlStr += "    </div>\
                            <div id='enc_more' class='btn-wrap'><a href='javascript:;' class='morebutton'><p>더보기</p><img src='./static/imgs/main/plus_icon.png'></a></div>\
                        </div>"
        }
        return htmlStr;
    },

    getMonthFare: async function (yearMonth) {
        let baseUrl = `/api/fare/month?yearMonth=${yearMonth}`;
        let apiUrl = apiUrlConverter('util', baseUrl);
        let fares;
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (result) {
                fares = result.fares;
            },
            error: function () {

            }
        });
        return fares;
    },

    getMonthUsage: async function (yearMonth) {
        let baseUrl = `/api/usage/month?yearMonth=${yearMonth}`;
        let apiUrl = apiUrlConverter('util', baseUrl);
        let imageUsage, videoUsage;
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (result) {
                imageUsage = result.imageUsage;
                videoUsage = result.videoUsage;
            },
            error: function () {

            }
        });
        return [imageUsage, videoUsage];
    },

    getFileHistory: async function (yearMonth) {
        let baseUrl = `/api/history/file?yearMonth=${yearMonth}`;
        let apiUrl = apiUrlConverter('util', baseUrl);
        let monthFiles;
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (result) {
                monthFiles = result.monthFiles;
            },
            error: function () {

            }
        });
        return monthFiles;
    },

    getFileDetailHistory: async function (additionalRequestID, filename, filetype, rest) {
        let baseUrl = `/api/history/file/detail?additionalRequestID=${additionalRequestID}`;
        let apiUrl = apiUrlConverter('util', baseUrl);
        let results
        let resultStr = ``
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (result) {
                results = result
                console.log(results)
            },
            error: function () {

            }
        });
        resultStr += `<div class="priceFileInfo">
                        <div class="fileName">
                            <span>파일명 :&nbsp;</span>
                            <p>${filename}</p>
                        </div>
                        <div class="fileType">
                            <span>파일 유형 :&nbsp;</span>
                            <p>${filetype}</p>
                        </div>
                    </div>
                    <div class="priceInfo">
                        <div class="priceArea encrypt">
                            <h2>비식별화 요금 내역</h2>
                            <div class="priceTableHeader">
                                <div class="tableHeader date">
                                    <p>작업 일시</p>
                                </div>
                                <div class="tableHeader basic">
                                    <p>기본료</p>
                                </div>
                                <div class="tableHeader resolution">
                                    <p>해상도</p>
                                </div>
                                <div class="tableHeader duration">
                                    <p>영상 길이</p>
                                </div>
                                <div class="tableHeader object">
                                    <p>처리 객체수</p>
                                </div>
                                <div class="tableHeader base">
                                    <p>서비스 기본 금액</p>
                                </div>
                                <div class="tableHeader add">
                                    <p>추가 발생 금액</p>
                                </div>
                                <div class="tableHeader discount">
                                    <p>할인 금액</p>
                                </div>
                                <div class="tableHeader total">
                                    <p>차감 금액</p>
                                </div>
                            </div>
                            <div class="priceTableContent">
                                <div class="tableBox">
                                    <div class="tableContent date">
                                        <p>${results["encrypt"][0]["request_date"]}<br>
                                        ${results["encrypt"][0]["request_time"]}</p>
                                    </div>
                                    <div class="tableContent basic">
                                        <p>${encrypt_base(filetype, rest)}</p>
                                    </div>
                                    <div class="tableContent resolution">
                                        <div class="textArea">
                                            <p>${hd_change(Number(results["encrypt"][0]["file_width"]), Number(results["encrypt"][0]["file_height"]))}</p>
                                            <span>(${results["encrypt"][0]["file_width"]}X${results["encrypt"][0]["file_height"]})</span>
                                        </div>
                                    </div>
                                    <div class="tableContent duration">
                                        <div class="textArea">`
                                        if(filetype=="이미지"){
                                resultStr += `<p>-</p>`
                                        }
                                        else{
                                resultStr += `<p>${time_change(Number(results["encrypt"][0]["duration"]))}</p>
                                            <span>(${price_three(Number(results["encrypt"][0]["duration"]))}초)</span>`
                                        }
                        resultStr += `</div>
                                    </div>
                                    <div class="tableContent object">
                                        <p>${results["encrypt"][0]["object_count"]}개</p>
                                    </div>
                                    <div class="tableContent base">
                                        <p>${price_three(results["encrypt"][0]["basic_charge"])}</p>
                                    </div>
                                    <div class="tableContent add">
                                        <p>${price_three(results["encrypt"][0]["extra_charge"])}</p>
                                    </div>
                                    <div class="tableContent discount">
                                        <p>-</p>
                                    </div>
                                    <div class="tableContent total">
                                        <h3>${price_three(results["encrypt"][0]["service_charge"])}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="priceArea additional">
                            <h2>추가 비식별화 요금 내역</h2>
                            <div class="priceTableHeader">
                                <div class="tableHeader date">
                                    <p>작업 일시</p>
                                </div>
                                <div class="tableHeader basic">
                                    <p>기본료</p>
                                </div>
                                <div class="tableHeader resolution">
                                    <p>해상도</p>
                                </div>
                                <div class="tableHeader duration">
                                    <p>영상 길이</p>
                                </div>
                                <div class="tableHeader object">
                                    <p>처리 객체수</p>
                                </div>
                                <div class="tableHeader base">
                                    <p>서비스 기본 금액</p>
                                </div>
                                <div class="tableHeader add">
                                    <p>추가 발생 금액</p>
                                </div>
                                <div class="tableHeader discount">
                                    <p>할인 금액</p>
                                </div>
                                <div class="tableHeader total">
                                    <p>차감 금액</p>
                                </div>
                            </div>
                            <div class="priceTableContent">`
        if (results["additional"].length == 0) {
            resultStr += `<div class="tableBox">
                            <div class="tableContent" style='width:100%;'>
                                <p>내역이 없습니다.</p>
                            </div>
                        </div>`
        }
        else {
            for (let i = 0; i < results["additional"].length; i++) {
                resultStr += `<div class="tableBox">
                                <div class="tableContent date">
                                    <p>${results["additional"][i]["request_date"]}<br>
                                    ${results["additional"][i]["request_time"]}</p>
                                </div>
                                <div class="tableContent basic">
                                    <p>-</p>
                                </div>
                                <div class="tableContent resolution">
                                    <div class="textArea">
                                        <p>${hd_change(Number(results["additional"][i]["file_width"]), Number(results["additional"][i]["file_height"]))}</p>
                                        <span>(${results["additional"][i]["file_width"]}X${results["additional"][i]["file_height"]})</span>
                                    </div>
                                </div>
                                <div class="tableContent duration">
                                    <div class="textArea">`
                        if(filetype=="이미지"){
                            resultStr += `<p>-</p>`
                                    }
                                    else{
                            resultStr += `<p>${time_change(Number(results["additional"][i]["duration"]))}</p>
                                        <span>(${price_three(Number(results["additional"][i]["duration"]))}초)</span>`
                                    }
                    resultStr += `</div>
                                </div>
                                <div class="tableContent object">
                                    <p>${results["additional"][i]["object_count"]}개</p>
                                </div>
                                <div class="tableContent base">
                                    <p>${price_three(results["additional"][i]["basic_charge"])}</p>
                                </div>
                                <div class="tableContent add">
                                    <p>${price_three(results["additional"][i]["extra_charge"])}</p>
                                </div>
                                <div class="tableContent discount">
                                    <p>${price_three(results["additional"][i]["free_charge"])}</p>
                                </div>
                                <div class="tableContent total">
                                    <h3>${price_three(results["additional"][i]["service_charge"])}</h3>
                                </div>
                            </div>`
            }
        }
        resultStr += `</div>
                            <div class="subtotal additional">
                                <p>소 계</p>
                                <h3>${price_three(results["addSum"])}</h3>
                            </div>
                        </div>
                        <div class="priceArea decrypt">
                            <h2>부분 복호화 요금 내역</h2>
                            <div class="priceTableHeader">
                                <div class="tableHeader date">
                                    <p>작업 일시</p>
                                </div>
                                <div class="tableHeader basic">
                                    <p>기본료</p>
                                </div>
                                <div class="tableHeader resolution">
                                    <p>해상도</p>
                                </div>
                                <div class="tableHeader duration">
                                    <p>영상 길이</p>
                                </div>
                                <div class="tableHeader object">
                                    <p>처리 객체수</p>
                                </div>
                                <div class="tableHeader base">
                                    <p>서비스 기본 금액</p>
                                </div>
                                <div class="tableHeader add">
                                    <p>추가 발생 금액</p>
                                </div>
                                <div class="tableHeader discount">
                                    <p>할인 금액</p>
                                </div>
                                <div class="tableHeader total">
                                    <p>차감 금액</p>
                                </div>
                            </div>
                            <div class="priceTableContent">`
        if (results["decrypt"].length == 0) {
            resultStr += `<div class="tableBox">
                            <div class="tableContent" style='width:100%;'>
                                <p>내역이 없습니다.</p>
                            </div>
                        </div>`
        }
        else {
            for (let i = 0; i < results["decrypt"].length; i++) {
                resultStr += `<div class="tableBox">
                                <div class="tableContent date">
                                    <p>${results["decrypt"][i]["request_date"]}<br>
                                    ${results["decrypt"][i]["request_time"]}</p>
                                </div>
                                <div class="tableContent basic">
                                    <p>-</p>
                                </div>
                                <div class="tableContent resolution">
                                    <div class="textArea">
                                        <p>${hd_change(Number(results["decrypt"][i]["file_width"]), Number(results["decrypt"][i]["file_height"]))}</p>
                                        <span>(${results["decrypt"][i]["file_width"]}X${results["decrypt"][i]["file_height"]})</span>
                                    </div>
                                </div>
                                <div class="tableContent duration">
                                    <div class="textArea">`
                                    if(filetype=="이미지"){
                            resultStr += `<p>-</p>`
                                    }
                                    else{
                            resultStr += `<p>${time_change(Number(results["decrypt"][i]["duration"]))}</p>
                                        <span>(${price_three(Number(results["decrypt"][i]["duration"]))}초)</span>`
                                    }
                    resultStr += `</div>
                                </div>
                                <div class="tableContent object">
                                    <p>${results["decrypt"][i]["object_count"]}개</p>
                                </div>
                                <div class="tableContent base">
                                    <p>${price_three(results["decrypt"][i]["basic_charge"])}</p>
                                </div>
                                <div class="tableContent add">
                                    <p>${price_three(results["decrypt"][i]["extra_charge"])}</p>
                                </div>
                                <div class="tableContent discount">
                                    <p>${price_three(results["decrypt"][i]["free_charge"])}</p>
                                </div>
                                <div class="tableContent total">
                                    <h3>${price_three(results["decrypt"][i]["service_charge"])}</h3>
                                </div>
                            </div>`
            }
        }
        resultStr += `</div>
                            <div class="subtotal decrypt">
                                <p>소 계</p>
                                <h3>${price_three(results["decSum"])}</h3>
                            </div>
                        </div>
                        <div class="priceArea download">
                            <h2>다운로드 요금 내역</h2>
                            <div class="priceTableHeader">
                                <div class="tableHeader date">
                                    <p>작업 일시</p>
                                </div>
                                <div class="tableHeader basic">
                                    <p>기본료</p>
                                </div>
                                <div class="tableHeader resolution">
                                    <p>해상도</p>
                                </div>
                                <div class="tableHeader duration">
                                    <p>영상 길이</p>
                                </div>
                                <div class="tableHeader object">
                                    <p>처리 객체수</p>
                                </div>
                                <div class="tableHeader base">
                                    <p>서비스 기본 금액</p>
                                </div>
                                <div class="tableHeader add">
                                    <p>추가 발생 금액</p>
                                </div>
                                <div class="tableHeader discount">
                                    <p>할인 금액</p>
                                </div>
                                <div class="tableHeader total">
                                    <p>차감 금액</p>
                                </div>
                            </div>
                            <div class="priceTableContent">`
        if (results["download"].length == 0) {
            resultStr += `<div class="tableBox">
                            <div class="tableContent" style='width:100%;'>
                                <p>내역이 없습니다.</p>
                            </div>
                        </div>`
        }
        else {
            for (let i = 0; i < results["download"].length; i++) {
                resultStr += `<div class="tableBox">
                                <div class="tableContent date">
                                    <p>${results["download"][i]["request_date"]}<br>
                                    ${results["download"][i]["request_time"]}</p>
                                </div>
                                <div class="tableContent basic">
                                    <p>-</p>
                                </div>
                                <div class="tableContent resolution">
                                    <div class="textArea">
                                        <p>${hd_change(Number(results["download"][i]["file_width"]), Number(results["download"][i]["file_height"]))}</p>
                                        <span>(${results["download"][i]["file_width"]}X${results["download"][i]["file_height"]})</span>
                                    </div>
                                </div>
                                <div class="tableContent duration">
                                    <div class="textArea">
                                        <p>-</p>
                                    </div>
                                </div>
                                <div class="tableContent object">
                                    <p>-</p>
                                </div>
                                <div class="tableContent base">
                                    <p>${price_three(results["download"][i]["basic_charge"])}</p>
                                </div>
                                <div class="tableContent add">
                                    <p>-</p>
                                </div>
                                <div class="tableContent discount">
                                    <p>${price_three(results["download"][i]["free_charge"])}</p>
                                </div>
                                <div class="tableContent total">
                                    <h3>${price_three(results["download"][i]["service_charge"])}</h3>
                                </div>
                            </div>`
            }
        }
        resultStr += `</div>
                            <div class="subtotal download">
                                <p>소 계</p>
                                <h3>${price_three(results["downSum"])}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="totalPriceArea">
                        <h2>총 차감 금액</h2>
                        <span>${price_three(Number(results["addSum"]) + Number(results["decSum"]) + Number(results["downSum"]) + Number(results["encrypt"][0]["service_charge"]))}</span>
                        <p>원</p>
                    </div>`

        return resultStr;
    },

    getJobHistory: async function (yearMonth) {
        let baseUrl = `/api/history/job?yearMonth=${yearMonth}`;
        let apiUrl = apiUrlConverter('util', baseUrl);
        let results
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (result) {
                // console.log('getJobHistory result : ',result.jobHistory);
                results = result
            },
            error: function () {

            }
        });
        return results;
    },

    getCashHistory: async function(startDate, endDate) {
        let baseUrl = `/api/history/cash?startDate=${startDate}&endDate=${endDate}`;
        let apiUrl = apiUrlConverter('util', baseUrl);
        let results;
        $.ajax({
            method: "get",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (result) {
                results = result.cashHistory;
            },
            error: function() {

            }
        });
        return results;
    },

    downloadExcel: async function (workData, fileData) {
        const baseUrl = `/api/usage/excel`
        const apiUrl = apiUrlConverter('util', baseUrl)
        const sessionData = { workData, fileData }
        
        try {
            const data = await $.ajax({
                method: 'post',
                url: apiUrl,
                data: sessionData,
                xhrFields: {
                    withCredentials: true,
                    responseType: 'blob'
                },
            });
            return data
        } catch(err) {
            console.error(err)
            return null
        }
    },

    downloadCashExcel: async function (cashData) {
        const baseUrl = `/api/cash/excel`
        const apiUrl = apiUrlConverter('util', baseUrl)
        const sessionData = { cashData }
        
        try {
            const data = await $.ajax({
                method: 'post',
                url: apiUrl,
                data: sessionData,
                xhrFields: {
                    withCredentials: true,
                    responseType: 'blob'
                },
            });
            return data
        } catch(err) {
            console.error(err)
            return null
        }
    },

    // precessTest: async function () {
    //     const baseUrl = `/api/encrypt/id/process`
    //     const apiUrl = apiUrlConverter('encrypt', baseUrl)
        
    //     try {
    //         const data = await $.ajax({
    //             method: 'get',
    //             url: apiUrl,
    //             data,
    //         });
    //         console.log(data)
    //         return data
    //     } catch(err) {
    //         console.error(err)
    //         return null
    //     }
    // },

    processTest: function(requestType) {
        let baseUrl = `/api/${requestType}/id/progress`
        let apiUrl = apiUrlConverter(requestType, baseUrl)
        let results;
        $.ajax({
            method: "get",
            url: apiUrl,
            async: false,
            success: function (result) {
                results = result["result"];
            },
            error: function() {

            }
        });
        console.log(results)
        if(0<results.length){
            for(let i=0;i<results.length;i++){
                $(`.progress.log${results[i]["id"]}`).text(results[i]["encrypt_progress"])
            }
        }
        return results;
    },
}