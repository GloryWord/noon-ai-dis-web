'use strict';

function imgChargeTable(chargeArray, fileWidth, fileHeight, nameArray) {
    var html = ''
    for (var i = 0; i < chargeArray.length; i++) {
        // chargeArray[i].resolution = (fileWidth[i] * fileHeight[i]) / (640 * 640);
        let hdType = ``
        let fileResolution = fileWidth[i]*fileHeight[i]
        if(fileResolution<=921600){
            hdType = `HD 이하`
        }
        else if(fileResolution<=2073600){
            hdType = `FHD 이하`
        }
        else{
            hdType = `FHD 초과`
        }
        html += `<div class='name_text_area'>
                    <h3>파일명 : </h3>
                    <p>${nameArray[i]["name"]}</p>
                </div>
                <div class="charge_tb_header">
                    <div class="category_header"><p>구 분</p></div>
                    <div class="content_header"><p>파일 정보</p></div>
                    <div class="price_header"><p>기본 서비스 요금</p></div>
                    <div class="add_price_header"><p>추가 요금</p></div>
                </div>
                <div class='charge_tb_content'>
                    <div class='charge_info' style='height:48px;'>
                        <div class='category_content'><p>복호화 여부</p></div>
                        <div class='content_content'><p class='reso_text'>복호화 진행 안함</p></div>
                        <div class='price_content'><p class='base_charge'>기본료 : 400</p></div>
                        <div class='add_price_content'><p class='add_base_charge'>추가 요금 기본료 : 200</p></div>
                    </div>
                    <div class='charge_info' style='height:64px;'>
                        <div class='category_content'><p>해상도</p></div>
                        <div class='content_content'>
                            <div class='textArea'>
                                <h5>${hdType}</h5>
                                <p>(${fileWidth[i]}X${fileHeight[i]})</p>
                            </div>
                        </div>
                        <div class='price_content'><p>X ${price_three(chargeArray[i].resolution_charge)}</p></div>
                        <div class='add_price_content'><p>-</p></div>
                    </div>
                    <div class='charge_info' style='height:64px;'>
                        <div class='category_content'><p>평균 객체 수</p></div>
                        <div class='content_content'>
                            <textarea data-num=${i} onkeydown='return onlyNumber(event)' onkeyup='removeChar(event)' class='object_number' maxlength='2' placeholder='이미지에서 비식별 처리할 \n객체 수를 입력해주세요!'></textarea>
                        </div>
                        <div class='price_content'>
                            <p class='price_text ${i}'>-</p>
                        </div>
                        <div class='add_price_content'>
                            <div class='textArea ${i}'>
                                <h5 class='object_over ${i}'></h5>
                                <p class='add_price_text ${i}'>-</p>
                            </div>
                        </div>
                    </div>
                    <div class='charge_info price'>
                        <div class="total_price_area"><p>예상 요금</p><span class='single_price ${i}'>0<h4>캐시</h4></span></div>
                        <div class="price_area"><p class='single_base_price ${i}'>0</p><p>+</p><p class='single_add_price ${i}'>0</p></div>
                    </div>
                </div>`
    }

    return html;
}

function videoChargeTable(currentFile, fileWidth, fileHeight, chargeArray) {
    var info_content_html = ''
    var charge_content_html = ''

    let avg_frame_rate = currentFile.avg_frame_rate
    avg_frame_rate = avg_frame_rate.split('/');
    avg_frame_rate = Math.round(avg_frame_rate[0]/avg_frame_rate[1])

    let add_duration = `-`
    if(chargeArray[2]!=0){
        add_duration = `X ${chargeArray[2]}`
    }

    let duration_over = ``
    let duration_over_margin = ``
    if(Math.floor(currentFile.duration)>300){
        duration_over = `${Math.floor(currentFile.duration)-300}초 초과`
        duration_over_margin = `style='margin-bottom:0px;'`
    }

    let hdType = ``
    let fileResolution = fileWidth[0]*fileHeight[0]
    if(fileResolution<=921600){
        hdType = `HD 이하`
    }
    else if(fileResolution<=2073600){
        hdType = `FHD 이하`
    }
    else{
        hdType = `FHD 초과`
    }

    if (screen.width <= 600) {
        info_content_html = "<div class='info_area'>\
                                    <div class='first_area'>\
                                        <div class='res_content'>\
                                            <h1>해상도</h1>\
                                            <p>"+ fileWidth[0] + " X " + fileHeight[0] + "</p>\
                                        </div>\
                                        <div class='frame_content'>\
                                            <h1>"+ avg_frame_rate + " 프레임 레이트</h1>\
                                            <p>FPS</p>\
                                        </div>\
                                    </div>\
                                    <div class='second_area'>\
                                        <div class='dur_content'>\
                                            <h1>길이</h1>\
                                            <p>"+ time_change(currentFile.duration) + "</p>\
                                        </div>\
                                        <div class='bit_content'>\
                                            <h1>"+ currentFile.bit_rate + " 비트 레이트</h1>\
                                            <p>bps</p>\
                                        </div>\
                                    </div>\
                                </div>"
    }
    else {
        info_content_html = "<div class='info_area'>\
                                    <div class='res_content'>\
                                        <p>"+ fileWidth[0] + " X " + fileHeight[0] + "</p>\
                                    </div>\
                                    <div class='frame_content'>\
                                        <p>"+ avg_frame_rate + " FPS</p>\
                                    </div>\
                                    <div class='dur_content'>\
                                        <p>"+ time_change(currentFile.duration) + "</p>\
                                    </div>\
                                    <div class='bit_content'>\
                                        <p>"+ currentFile.bit_rate + " bps</p>\
                                    </div>\
                                </div>"

        charge_content_html = `<div class='charge_tb_content'>
                                        <div class='charge_info' style='height:48px;'>
                                            <div class='category_content'><p>복호화 여부</p></div>
                                            <div class='content_content'><p class='reso_text'>복호화 진행 안함</p></div>
                                            <div class='price_content'><p class='base_charge'>기본료 : 7,000</p></div>
                                            <div class='add_price_content'><p class='add_base_charge'>추가 요금 기본료 : 3,500</p></div>
                                        </div>
                                        <div class='charge_info' style='height:64px;'>
                                            <div class='category_content'><p>해상도</p></div>
                                            <div class='content_content'>
                                                <div class='textArea'>
                                                    <h5>${hdType}</h5>
                                                    <p>(${fileWidth[0]}X${fileHeight[0]})</p>
                                                </div>
                                            </div>
                                            <div class='price_content'><p>X ${chargeArray[0]}</p></div>
                                            <div class='add_price_content'><p>-</p></div>
                                        </div>
                                        <div class='charge_info' style='height:64px;'>
                                            <div class='category_content'><p>영상 길이</p></div>
                                            <div class='content_content'><p>${time_change(currentFile.duration)} (${Math.floor(currentFile.duration)}초)</p></div>
                                            <div class='price_content'><p>X ${chargeArray[1]}</p></div>
                                            <div class='add_price_content'>
                                                <div class='textArea'>
                                                    <h5 class='duration_over' ${duration_over_margin}>${duration_over}</h5>
                                                    <p>${add_duration}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='charge_info' style='height:64px;'>
                                            <div class='category_content'><p>처리 객체 수</p></div>
                                            <div class='content_content'>
                                                <textarea data-num=0  onkeydown='return onlyNumber(event)' onkeyup='removeChar(event)' class='object_number' maxlength='2' placeholder='동영상에서 비식별 처리할 \n객체 수를 입력해주세요!'></textarea>
                                            </div>
                                            <div class='price_content'><p class='price_text 0'>-</p></div>
                                            <div class='add_price_content'>
                                                <div class='textArea'>
                                                    <h5 class='object_over'></h5>
                                                    <p class='add_price_text'>-</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='charge_tb_footer'>
                                        <div class="total_price_area"><p>총 예상 요금</p><span class='total_price'>0<h4>캐시</h4></span></div>
                                        <div class="price_area"><p class='base_price'>0</p><p>+</p><p class='add_price'>0</p></div>
                                    </div>
                                </div>`
    }

    return [info_content_html, charge_content_html]
}
// 크롭이미지 열로 묶는 함수
// function column(type, groupidx, imgidx, imgSrc) {
//     if(Number(imgidx)%5==1){
//         let el = document.querySelector('.column1_'+type+'.col.group'+groupidx+'');
//         el.innerHTML += `<div class='cropContent'>
//                             <img class='cropImg ${type}' data-groupidx=${groupidx} data-imgidx=${imgidx} src='${imgSrc}'>
//                             <div class='cropID'>
//                                 <p>${imgidx}</p>
//                             </div>
//                             <div class="originBtn">
//                                 <p>원본 보기</p>
//                             </div>
//                             <input class='check_${type} ${groupidx} ${type}${imgidx}' type='checkbox' value=${imgidx}>
//                         </div>`
//     }
//     else if(Number(imgidx)%5==2){
//         let el = document.querySelector('.column2_'+type+'.col.group'+groupidx+'');
//         el.innerHTML += `<div class='cropContent'>
//                             <img class='cropImg ${type}' data-groupidx=${groupidx} data-imgidx=${imgidx} src='${imgSrc}'>
//                             <div class='cropID'>
//                                 <p>${imgidx}</p>
//                             </div>
//                             <div class="originBtn">
//                                 <p>원본 보기</p>
//                             </div>
//                             <input class='check_${type} ${groupidx} ${type}${imgidx}' type='checkbox' value=${imgidx}>
//                         </div>`
//     }
//     else if(Number(imgidx)%5==3){
//         let el = document.querySelector('.column3_'+type+'.col.group'+groupidx+'');
//         el.innerHTML += `<div class='cropContent'>
//                             <img class='cropImg ${type}' data-groupidx=${groupidx} data-imgidx=${imgidx} src='${imgSrc}'>
//                             <div class='cropID'>
//                                 <p>${imgidx}</p>
//                             </div>
//                             <div class="originBtn">
//                                 <p>원본 보기</p>
//                             </div>
//                             <input class='check_${type} ${groupidx} ${type}${imgidx}' type='checkbox' value=${imgidx}>
//                         </div>`
//     }
//     else if(Number(imgidx)%5==4){
//         let el = document.querySelector('.column4_'+type+'.col.group'+groupidx+'');
//         el.innerHTML += `<div class='cropContent'>
//                             <img class='cropImg ${type}' data-groupidx=${groupidx} data-imgidx=${imgidx} src='${imgSrc}'>
//                             <div class='cropID'>
//                                 <p>${imgidx}</p>
//                             </div>
//                             <div class="originBtn">
//                                 <p>원본 보기</p>
//                             </div>
//                             <input class='check_${type} ${groupidx} ${type}${imgidx}' type='checkbox' value=${imgidx}>
//                         </div>`
//     }
//     else if(Number(imgidx)%5==0){
//         let el = document.querySelector('.column5_'+type+'.col.group'+groupidx+'');
//         el.innerHTML += `<div class='cropContent'>
//                             <img class='cropImg ${type}' data-groupidx=${groupidx} data-imgidx=${imgidx} src='${imgSrc}'>
//                             <div class='cropID'>
//                                 <p>${imgidx}</p>
//                             </div>
//                             <div class="originBtn">
//                                 <p>원본 보기</p>
//                             </div>
//                             <input class='check_${type} ${groupidx} ${type}${imgidx}' type='checkbox' value=${imgidx}>
//                         </div>`
//     }
// }

/**
 * DIS.Web.Test 네임스페이스
 * @class DIS.Web.Test
 */
DIS.Web.FileModule = DIS.Web.FileModule || {};

/**
 * DIS.Web.FileModule 클래스를 참조하는 글로벌 멤버 변수
 * @interface Test
 */

var fileModule = DIS.Web.FileModule;
fileModule = {
    getFileList: function (type, mode) {
        var files = document.getElementById(mode).files;
        var fileTypeInfo = ''
        var fileType = []
        var fileExt = []
        var fileSize = []
        var fileWidth = []
        var fileHeight = []
        var videoDuration = []
        var fileCount = 0;

        const dataTransfer = new DataTransfer();
        let fileArray = Array.from(files);	//변수에 할당된 파일을 배열로 변환(FileList -> Array)
        var filteredFileArray = fileArray.filter((element) => element.type.split('/')[0] == type);

        filteredFileArray.forEach(file => { dataTransfer.items.add(file); });
        $('#file')[0].files = dataTransfer.files;	//제거 처리된 FileList를 돌려줌
        files = $('#file')[0].files;

        for (var i = 0; i < files.length; i++) {
            fileTypeInfo = files[i].type.split('/');
            fileType.push(fileTypeInfo[0]);
            fileExt.push(fileTypeInfo[1]);
        }

        for (var i = 0; i < files.length; i++) {
            if (fileType[i] == 'image') {
                let img = new Image()
                img.src = window.URL.createObjectURL(files[i])
                img.onerror = (error) => {
                    Swal.fire({
                        title: '파일 에러',
                        html: '올바르지 않은 파일을<br>업로드하였습니다.',
                        showConfirmButton: false,
                        showDenyButton: true,
                        denyButtonText: "확 인",
                        icon: "error"
                    }).then(() => location.reload())
                }
            }
            else if (fileType[i] == 'video') {
                const video = document.createElement('video');
                video.addEventListener('loadedmetadata', event => {
                    fileCount += 1;
                    fileWidth.push(video.videoWidth);
                    fileHeight.push(video.videoHeight);
                    videoDuration.push(video.duration);
                });
                video.addEventListener('error', function() {
                    /* Video playback failed: show a message saying why */
                    switch (video.error.code) {
                        case 1:
                            // alert('MEDIA_ERR_ABORTED = 1 Media data download is stopped by the user');
                            break;
                        case 2:
                            // alert('MEDIA_ERR_NETWORK = 2 Download is stopped due to network error ');
                            break;
                        case 3:
                            // alert('MEDIA_ERR_DECODE = 3 Media data decoding failure ');
                            break;
                        case 4:
                            // alert('MEDIA_ERR_SRC_NOT_SUPPORTED = 4 Format not supported');
                            fileCount += 1;
                            fileWidth.push(0);
                            fileHeight.push(0);
                            videoDuration.push(0);
                            break
                    }
                }, false);
                video.src = URL.createObjectURL(files[i]);
            }
            fileSize.push(files[i].size)
        }

        var fileList = ''
        for (var i = 0; i < files.length; i++) {
            fileList += '파일 이름: ' + files[i].name + '<br>'
                + '크기: ' + formatBytes(files[i].size) + '<br>'
                + '종류: ' + fileType[i] + '<br>'
        }

        var html = '<div class="file_header">\
                        <div class="name_header"><p>파일명</p></div>\
                        <div class="size_header"><p>용량</p></div>\
                        <div class="object_header"><p>비식별 처리할 객체 선택</p></div>\
                        <div class="delete_header"></div>\
                    </div>';
        if (type == 'image') html = '<div class="file_header">\
                                        <div class="name_header"><p>파일명</p></div>\
                                        <div class="size_header"><p>용량</p></div>\
                                        <div class="object_header">\
                                            <p>비식별 처리할 객체 선택</p>\
                                            <div class="allObject">\
                                                <input class="allbody" type="checkbox"><label class="bodylabel">사람 - 전신</label>\
                                                <input class="allface" type="checkbox"><label class="facelabel">사람 - 얼굴</label>\
                                                <input class="allcar" type="checkbox"><label class="carlabel">차량 번호판</label>\
                                            </div>\
                                        </div>\
                                        <div class="delete_header">\
                                            <div class="allDelete">\
                                                <p>전체삭제</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="imgContent">';
        if (type == 'image') {
            if (screen.width <= 600) {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content">\
                                    <h1>파일명</h1>\
                                    <div class="file_name_text">\
                                        <p>'+ files[i].name + '</p>\
                                    </div>\
                                </div>\
                                <div class="second_info">\
                                    <div class="selectObject">\
                                        <p>객체선택</p>\
                                        <div class="checkList">\
                                            <div class="check_box">\
                                                <input class="body" type="checkbox" name="body"><label>사람 - 전신</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="face" type="checkbox" name="head"><label>사람 - 얼굴</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="car" type="checkbox" name="lp"><label>차량 번호판</label>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="size_btn_area">\
                                        <div class="size_content">\
                                            <h1>용량</h1>\
                                            <p>'+ formatBytes(files[i].size) + '</p>\
                                        </div>\
                                        <div class="delete_content">\
                                            <div class="uploadDelete" value='+ i + '>\
                                                <p>삭제</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content"><p>'+ files[i].name + '</p></div>\
                                <div class="size_content"><p>'+ formatBytes(files[i].size) + '</p></div>\
                                <div class="selectObject">\
                                    <div class="checkList">\
                                        <input class="body" type="checkbox" name="body">\
                                        <input class="face" type="checkbox" name="head">\
                                        <input class="car" type="checkbox" name="lp">\
                                    </div>\
                                </div>\
                                <div class="delete_content">\
                                    <div class="uploadDelete" value='+ i + '>\
                                        <p>삭제하기</p>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }
        }
        else {
            if (screen.width <= 600) {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content">\
                                    <h1>파일명</h1>\
                                    <div class="file_name_text">\
                                        <p>'+ files[i].name + '</p>\
                                    </div>\
                                </div>\
                                <div class="second_info">\
                                    <div class="selectObject">\
                                        <p>객체선택</p>\
                                        <div class="checkList">\
                                            <div class="check_box">\
                                                <input class="body" type="checkbox" name="body"><label>사람 - 전신</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="face" type="checkbox" name="head"><label>사람 - 얼굴</label>\
                                            </div>\
                                            <div class="check_box">\
                                                <input class="car" type="checkbox" name="lp"><label>차량 번호판</label>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="size_btn_area">\
                                        <div class="size_content">\
                                            <h1>용량</h1>\
                                            <p>'+ formatBytes(files[i].size) + '</p>\
                                        </div>\
                                        <div class="delete_content">\
                                            <div class="uploadDelete" value='+ i + '>\
                                                <p>삭제</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    html += '<div class="file_content" id=file-' + [i] + '>\
                                <div class="name_content"><p>'+ files[i].name + '</p></div>\
                                <div class="size_content"><p>'+ formatBytes(files[i].size) + '</p></div>\
                                <div class="selectObject">\
                                    <div class="checkList">\
                                        <input class="body" type="checkbox" name="body"><label>사람 - 전신</label>\
                                        <input class="face" type="checkbox" name="head"><label>사람 - 얼굴</label>\
                                        <input class="car" type="checkbox" name="lp"><label>차량 번호판</label>\
                                    </div>\
                                </div>\
                                <div class="delete_content">\
                                    <div class="uploadDelete" value='+ i + '>\
                                        <p>삭제하기</p>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }

        }
        if (type == 'image') html += '</div>'
        return [html, fileWidth, fileHeight, fileSize, fileCount, videoDuration, files];
    },

    alldeleteFile: function () {
        $("div").remove(".file_content");
    },

    deleteFile: function (index) {
        $("div").remove("#file-" + index);
        const dataTransfer = new DataTransfer();
        const files = $('#file')[0].files;	//사용자가 입력한 파일을 변수에 할당
        let fileArray = Array.from(files);	//변수에 할당된 파일을 배열로 변환(FileList -> Array)
        fileArray.splice(index, 1);	//해당하는 index의 파일을 배열에서 제거
        fileArray.forEach(file => { dataTransfer.items.add(file); });
        //남은 배열을 dataTransfer로 처리(Array -> FileList)
        $('#file')[0].files = dataTransfer.files;	//제거 처리된 FileList를 돌려줌
    },

    uploadFile: function (fileWidth, fileHeight, videoDuration, restoration, fileType) {
        return new Promise((resolve, reject) => {
            var curTime = getTime();
            var fileNameList = getFiles();
            var fileWidthObj = Object.assign({}, fileWidth)
            var fileHeightObj = Object.assign({}, fileHeight)
            var videoDurationObj = Object.assign({}, videoDuration)
            var bitrateArray = []
            var filePath = []
            var userInfo = ''
            let checksum = null;

            // RabbitMQ에 넣을 메시지 형태를 미리 만들어줌
            var postData = {
                'requestType': 'encrypt',
                'fileNameList': fileNameList,
                'fileWidth': JSON.stringify(fileWidthObj),
                'fileHeight': JSON.stringify(fileHeightObj),
                'videoDuration': JSON.stringify(videoDurationObj),
                'curTime': curTime,
                'keyIndex': '',
                'keyName': '',
                'requestIndex': '',
                'restoration': '',
                'encryptObject': ''
            }

            let baseUrl = '/api/syncTime'
            let apiUrl = apiUrlConverter('util', baseUrl)

            $.ajax({
                method: "post",
                url: apiUrl, // 세션에 현재 요청시간 정보를 담아줌
                dataType: "json",
                data: {
                    'curTime': curTime
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    var formData = new FormData();
                    var file = document.getElementById('file').files;
                    var mode = ''

                    if (file.length > 1) mode = '/multiple';
                    for (var i = 0; i < file.length; i++) formData.append('file', file[i]);
                    // formData.append('file', file);

                    let baseUrl = '/api/uploadNAS'
                    let apiUrl = apiUrlConverter('util', baseUrl)

                    var xhr = new XMLHttpRequest();
                    xhr.open('post', apiUrl + mode, true);
                    xhr.withCredentials = true;
                    xhr.upload.onprogress = function (e) {
                        if (e.lengthComputable) {
                            var per = (e.loaded / e.total) * 100;
                            progressBar(per);
                        }
                    }
                    xhr.onerror = function (e) {
                        console.log(e);
                        Swal.fire({
                            title: '업로드 에러',
                            text: '파일 업로드에 실패하였습니다.',
                            showConfirmButton: false,
                            showDenyButton: true,
                            denyButtonText: "확 인",
                            icon: "error"
                        });
                    };
                    xhr.onload = function () {
                        Swal.fire({
                            title: '업로드 완료',
                            text: '파일 업로드에 성공했습니다.',
                            showConfirmButton: true,
                            showDenyButton: false,
                            denyButtonText: "확 인",
                            icon: "success"
                        }).then(() => {
                            $(".uploadBtn_area").addClass('hide')
                            $(".file_info_area").addClass('active')
                            $(".uploadFooter").addClass('active')
                        });
                        var response = JSON.parse(this.responseText);
                        if (response.message == 'success') {
                            let coefficient = {};
                            let resolution_charge, frame_rate_charge, duration_charge, duration_base, duration_add, bitrate_charge, avg_object_charge;
                            let base_charge;

                            checksum = response.checksum;
                            filePath.push(response.filePath)

                            if (fileType == 'video') {
                                var ffmpegInfo = response.result.streams;
                                ffmpegInfo = ffmpegInfo.filter((stream) => {
                                    return stream.codec_type != 'audio'
                                })
                                
                                coefficient = {
                                    resolution: '',
                                    duration: '',
                                    avg_object: 1
                                }
                                base_charge = 5000;
                                const charging_variable_count = Object.keys(coefficient).length;

                                for (var i = 0; i < fileWidth.length; i++) {
                                    var curFile = ffmpegInfo[i]
                                    var info_content = document.querySelector(".info_content")
                                    var charge_content = document.querySelector(".charge_content")
                                    console.log(curFile);
                                    if(curFile.bit_rate === 'N/A') Swal.fire({
                                        title: '파일 에러',
                                        html: '올바르지 않은 파일을<br>업로드하였습니다.',
                                        showConfirmButton: false,
                                        showDenyButton: true,
                                        denyButtonText: "확 인",
                                        icon: "error"
                                    }).then(() => location.reload())
                                    if(fileWidth[i] === 0 && fileHeight[i] === 0) {
                                        fileWidth[i] = curFile.width;
                                        fileHeight[i] = curFile.height;
                                    }
                                    bitrateArray.push(curFile.bit_rate)

                                    var avg_frame_rate = curFile.avg_frame_rate
                                    avg_frame_rate = avg_frame_rate.split('/');
                                    avg_frame_rate = Math.round(avg_frame_rate[0]/avg_frame_rate[1])

                                    // coefficient.resolution = (fileWidth[i] * fileHeight[i]) / (640 * 640)
                                    // 요금 = (각 항목별 상대계수 X 기본요금) / 총 항목 갯수
                                    // 요금은 소숫점 둘째자리까지 반올림하여 계산
                                    // resolution_charge = coefficient.resolution * base_charge;
                                    // resolution_charge = Math.round(resolution_charge * 100) / 100

                                    coefficient.resolution = (fileWidth[i] * fileHeight[i])
                                    if(coefficient.resolution<=921600){
                                        resolution_charge = 1
                                    }
                                    else if(921600<coefficient.resolution<=2073600){
                                        resolution_charge = 1.5
                                    }
                                    else{
                                        //미정
                                        resolution_charge = 2
                                    }

                                    // coefficient.duration = curFile.duration / 60;
                                    if(curFile.duration<=180){
                                        coefficient.duration = [1, 0]
                                        // duration_charge = coefficient.duration[0]
                                        duration_base = coefficient.duration[0]
                                        duration_add = coefficient.duration[1]
                                    }
                                    else if(curFile.duration<=300){
                                        coefficient.duration = [1.5, 0]
                                        // duration_charge = coefficient.duration[1].toFixed(2)
                                        duration_base = coefficient.duration[0]
                                        duration_add = coefficient.duration[1]
                                        // duration_charge = coefficient.duration[0] + coefficient.duration[1]
                                    }
                                    else {
                                        let addTime = Math.floor(((curFile.duration - 300)/10))*0.03
                                        coefficient.duration = [1.5, addTime]
                                        duration_base = coefficient.duration[0]
                                        duration_add = coefficient.duration[1]
                                    }

                                    var chargeArray = [resolution_charge, duration_base, duration_add.toFixed(2)]

                                    var [info_content_html, charge_content_html] = videoChargeTable(curFile, fileWidth, fileHeight, chargeArray)

                                    info_content.innerHTML = info_content_html;
                                    charge_content.innerHTML = charge_content_html;
                                }
                            }
                            else if (fileType == "image") {
                                var chargeArray = [];
                                var nameArray = JSON.parse(getFileNames());
                                for (var i = 0; i < fileWidth.length; i++) {
                                    coefficient = {
                                        resolution: '',
                                        avg_object: 1
                                    }

                                    var charge = {
                                        resolution_charge: 0,
                                        avg_object_charge: 0,
                                        total_charge: 0
                                    }

                                    coefficient.resolution = (fileWidth[i] * fileHeight[i])
                                    if(coefficient.resolution<=921600){
                                        charge.resolution_charge = 1
                                    }
                                    else if(coefficient.resolution<=2073600){
                                        charge.resolution_charge = 1.5
                                    }
                                    else{
                                        //미정
                                        charge.resolution_charge = 2
                                    }

                                    chargeArray.push(charge);
                                }

                                var html = imgChargeTable(chargeArray, fileWidth, fileHeight, nameArray);
                                var charge_content = document.querySelector(".charge_content")
                                charge_content.innerHTML = html;
                            }

                            $('input[type=radio][name=restoration]').on('change', function () {
                                if (fileType == 'video') {
                                    if($('input[type=radio][name=restoration]:checked').val()=='true'){
                                        $(".reso_text").text("복호화 진행")
                                        $(".base_charge").text("기본료 : 10,000")
                                        $(".add_base_charge").text("추가 요금 기본료 : 5,000")
                                    }
                                    else {
                                        $(".reso_text").text("복호화 진행 안함")
                                        $(".base_charge").text("기본료 : 7,000")
                                        $(".add_base_charge").text("추가 요금 기본료 : 3,500")
                                    }
                                }
                                else {
                                    if($('input[type=radio][name=restoration]:checked').val()=='true'){
                                        $(".reso_text").text("복호화 진행")
                                        $(".base_charge").text("기본료 : 600")
                                        $(".add_base_charge").text("추가 요금 기본료 : 300")
                                    }
                                    else {
                                        $(".reso_text").text("복호화 진행 안함")
                                        $(".base_charge").text("기본료 : 400")
                                        $(".add_base_charge").text("추가 요금 기본료 : 200")
                                    }
                                }
                            });

                            $(document).on("click", ".cancel", function () {
                                $(".modal").removeClass("active")
                                $(".object_number").val("")
                                $(".price_text").text("-")
                                $(".add_price_text").text("-")
                                $(".total_price").html(`0<h4>캐시</h4>`)
                                $(".base_price").text("0")
                                $(".add_price").text("0")
                                $(".single_price").html(`0<h4>캐시</h4>`)
                                $(".single_base_price").text("0")
                                $(".single_add_price").text("0")
                            });

                            $(document).on("change", ".object_number", function () {
                                var object_num = Number($(this).val());
                                var num = $(this).data("num")
                                var total = 0;
                                if (fileType == "video") {
                                    var total_avg_object_charge
                                    var add_charge
                                    if(object_num<=5){
                                        total_avg_object_charge = [1, 0]
                                    }
                                    else if(object_num<=10){
                                        total_avg_object_charge = [1.5, 0]
                                    }
                                    else if(10<object_num){
                                        let addObject = ((object_num - 10))*0.08
                                        total_avg_object_charge = [1.5, addObject.toFixed(2)]
                                    }

                                    var total_charge
                                    if($('input[type=radio][name=restoration]:checked').val()=='true'){
                                        // total_charge = Math.round((((resolution_charge)/3) * duration_base * total_avg_object_charge * 5000) + (((resolution_charge)/3) * duration_add * total_avg_object_charge * 3000));
                                        total_charge = 10000*resolution_charge*Number(duration_base)*total_avg_object_charge[0]
                                        if(Number(duration_add)!=0 || total_avg_object_charge[1]!=0){
                                            add_charge = 5000*(1+Number(duration_add))*(1+total_avg_object_charge[1])
                                        }
                                        else{
                                            add_charge = 0
                                        }
                                    }
                                    else{
                                        total_charge = 7000*resolution_charge*Number(duration_base)*total_avg_object_charge[0]
                                        if(Number(duration_add)!=0 || total_avg_object_charge[1]!=0){
                                            add_charge = 3500*(1+Number(duration_add))*(1+total_avg_object_charge[1])
                                        }
                                        else{
                                            add_charge = 0
                                        }
                                    }
                                    // total_charge = Math.round(total_charge * 100) / 100
                                    $(".price_text." + num + "").text(`X ${total_avg_object_charge[0]}`)
                                    if(total_avg_object_charge[1]!=0){
                                        $(".object_over").text(`${object_num-10}개 초과`)
                                        $(".add_price_text").text(`X ${total_avg_object_charge[1]}`)
                                    }
                                    else{
                                        $(".object_over").text(``)
                                        $(".add_price_text").text(`-`)
                                    }
                                    // $(".charge_text." + num + "").text(`${price_three(total_charge)} 원, ${price_three(add_charge)}`)
                                    $(".base_price").text(`${price_three(Math.floor(total_charge))}`)
                                    $(".add_price").text(`${price_three(Math.floor(add_charge))}`)
                                    $(".total_price").html(`${price_three(Math.floor(total_charge) + Math.floor(add_charge))}<h4>캐시</h4>`)
                                }
                                else if (fileType == "image") {
                                    chargeArray[num].total_charge = 0;
                                    chargeArray[num].add_charge = 0;
                                    chargeArray[num].total_avg_object_charge
                                    if(object_num<=5){
                                        chargeArray[num].total_avg_object_charge = [1, 0]
                                    }
                                    else if(object_num<=10){
                                        chargeArray[num].total_avg_object_charge = [1.5, 0]
                                    }
                                    else if(10<object_num){
                                        let addObject = ((object_num - 10))*0.08
                                        chargeArray[num].total_avg_object_charge = [1.5, addObject.toFixed(2)]
                                    }

                                    
                                    if($('input[type=radio][name=restoration]:checked').val()=='true'){
                                        chargeArray[num].total_charge = 600*chargeArray[num].total_avg_object_charge[0]
                                        if(chargeArray[num].total_avg_object_charge[1]!=0){
                                            chargeArray[num].add_charge = 300*(1+chargeArray[num].total_avg_object_charge[1])
                                        }
                                        else{
                                            chargeArray[num].add_charge = 0
                                        }
                                    }
                                    else{
                                        chargeArray[num].total_charge = 400*chargeArray[num].total_avg_object_charge[0]
                                        if(chargeArray[num].total_avg_object_charge[1]!=0){
                                            chargeArray[num].add_charge = 200*(1+chargeArray[num].total_avg_object_charge[1])
                                        }
                                        else{
                                            chargeArray[num].add_charge = 0
                                        }
                                    }
                                    $(`.price_text.${num}`).text(`X ${chargeArray[num].total_avg_object_charge[0]}`)
                                    if(chargeArray[num].total_avg_object_charge[1]!=0){
                                        $(`.object_over.${num}`).text(`${object_num-10}개 초과`)
                                        $(`.add_price_text.${num}`).text(`X ${chargeArray[num].total_avg_object_charge[1]}`)
                                    }
                                    else{
                                        $(`.object_over.${num}`).text(``)
                                        $(`.add_price_text.${num}`).text(`-`)
                                    }
                                    $(`.single_base_price.${num}`).text(`${price_three(Math.floor(chargeArray[num].total_charge))}`)
                                    $(`.single_add_price.${num}`).text(`${price_three(Math.floor(chargeArray[num].add_charge))}`)
                                    $(`.single_price.${num}`).html(`${price_three(Math.floor(chargeArray[num].total_charge) + Math.floor(chargeArray[num].add_charge))}<h4>캐시</h4>`)
                                    var add_total = 0
                                    let reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                                    for (var i = 0; i < $(".single_base_price").length; i++) {
                                        // const regex = /[^0-9.]/g;
                                        // const result = $(".charge_text." + i + "").text().replace(regex, "");
                                        // total += Number(result)
                                        total += Number($(`.single_base_price.${i}`).text().replace(reg,''))
                                        add_total += Number($(`.single_add_price.${i}`).text().replace(reg,''))
                                    }
                                    $(`.base_price`).text(`${price_three(total)}`)
                                    $(`.add_price`).text(`${price_three(add_total)}`)
                                    $(`.total_price`).html(`${price_three(total + add_total)}<h4>캐시</h4>`)
                                }
                            });

                            $(document).on("click", ".uploadDelete", function () {
                                var idx = $(this).attr('value')
                                chargeArray.splice(idx, 1);

                                if (fileType == 'video') {
                                    var [info_content_html, charge_content_html] = videoChargeTable(curFile, fileWidth, fileHeight, chargeArray)

                                    info_content.innerHTML = info_content_html;
                                    charge_content.innerHTML = charge_content_html;
                                }
                                else if (fileType == 'image') {
                                    var html = imgChargeTable(chargeArray, fileWidth, fileHeight);
                                    var charge_content = document.querySelector(".charge_content")
                                    charge_content.innerHTML = html;
                                }
                            });
                            resolve([postData, bitrateArray, filePath, checksum])
                        }
                        else {
                            alert('파일 업로드 실패')
                        }
                    };
                    xhr.send(formData);
                },
                error: function (xhr, status) {
                    // alert(xhr + " : " + status);
                    // alert(JSON.stringify(xhr));
                }
            });
        })
    },

    encrypt: function (postData, fileWidth, fileHeight, restoration, bitrateArray, fileType, checksum, videoDuration) {
        new Promise((resolve, reject) => {
            var requestIndex = ''

            var keyIndex = 0;
            var keyName = 'null';

            if (restoration == 1) {
                if ($('input[type=radio][name=keySelect]')[0].checked) {
                    keyIndex = $('.selectKey').data("idx")
                    keyName = $('.selectText').text()
                }
                else {
                    keyName = $('#genKeyName').val();
                    keyIndex = key.getKeyId(keyName);
                }
            }

            postData['restoration'] = restoration;
            postData['keyIndex'] = keyIndex;
            postData['keyName'] = keyName;
            postData['checksum'] = JSON.stringify(checksum);

            let baseUrl = '/api/request/encrypt'
            let apiUrl = apiUrlConverter('encrypt', baseUrl)

            $.ajax({
                method: "post",
                url: apiUrl,
                dataType: "json",
                data: postData,
                xhrFields: {
                    withCredentials: true
                },
                async: false,
                success: function (data) {
                    requestIndex = data.enc_request_list_id;
                    comm.meterEncrypt(postData.fileNameList, fileWidth, fileHeight, requestIndex, restoration);
                    comm.loggingEncrypt(requestIndex);
                },
                error: function (xhr, status) {
                    // alert(xhr + " : " + status);
                    // alert(JSON.stringify(xhr));
                }
            });
            postData['bitrate'] = JSON.stringify(bitrateArray);
            postData['videoDuration'] = JSON.stringify(videoDuration);
            postData['requestIndex'] = requestIndex;
            resolve();
        }).then(() => {
            let baseUrl = '/api/sendMessage/encrypt'
            let apiUrl = apiUrlConverter('encrypt', baseUrl)
            $.ajax({
                method: "post",
                url: apiUrl,
                dataType: "json",
                data: postData,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {

                },
                error: function (xhr, status) {
                    // alert(xhr + " : " + status);
                    // alert(JSON.stringify(xhr));
                }
            });
            new Promise((resolve, reject) => {
                resolve()
            }).then(() => {
                Swal.fire({
                    title: '비식별화 요청이 \n완료되었습니다.',
                    showCancelButton: false,
                    confirmButtonText: '확인',
                    allowOutsideClick: false,
                    icon:'success'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.href = '/loading?type=' + fileType + '&service=encrypt';
                    }
                })
            })
        })
    },

    uploadKey: function (inputElementClass = 'file') {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            let file = null;
            if(inputElementClass === 'file' || inputElementClass === 'addfile') file = document.getElementById(inputElementClass).files[0];
            else file = document.getElementsByClassName(inputElementClass)[0].files[0];
            let upload_result, keyPath;
            let file_name = (file != undefined) ? file.name : null;
            let curTime = getTime();

            if (file == undefined) {
                try {
                    file = document.getElementById('select_file').files[0];
                    file_name = file.name;
                }
                catch (error) {}
            }
            if (file == undefined) {
                Swal.fire({
                    title: '키 파일이 없습니다!',
                    text: '키 파일을 업로드했는지 확인해주세요.',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                });
            }
            else {
                formData.append('file', file);

                let baseUrl = '/api/syncTime'
                let apiUrl = apiUrlConverter('util', baseUrl)

                $.ajax({
                    method: "post",
                    url: apiUrl, // 세션에 현재 요청시간 정보를 담아줌
                    dataType: "json",
                    async: false,
                    data: {
                        'curTime': curTime
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {

                    },
                    error: function (xhr, status) {
                        // alert(xhr + " : " + status);
                        // alert(JSON.stringify(xhr));
                    }
                }).done(() => {
                    let baseUrl = '/api/uploadNAS'
                    let apiUrl = apiUrlConverter('util', baseUrl)

                    $.ajax({
                        method: 'post',
                        url: apiUrl,
                        processData: false,
                        contentType: false,
                        data: formData,
                        xhrFields: {
                            withCredentials: true
                        },
                        async: false,
                        success: function (data) {
                            if (data.message == 'success') {
                                upload_result = file_name;
                                keyPath = data.filePath;
                            }
                        },
                        error: function (xhr, status) {
                            upload_result = false;
                            console.log('upload key failed');
                        }
                    });
                })
                resolve([upload_result, keyPath])
            }
        })
    },

    verifyKey: function (file_name, key_name) {
        let baseUrl = '/api/key/verify'
        let apiUrl = apiUrlConverter('key', baseUrl)

        let msg, keyPath, valid, verify_result;
        $.ajax({
            method: 'post',
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            data: {
                fileName: file_name,
                keyName: key_name
            },
            async: false,
            success: function (data) {
                if (data['result'] == 'valid') valid = true;
                msg = data.log;
                keyPath = data.keyPath;
                verify_result = { valid, msg, keyPath };
            },
            error: function (xhr, status){
                console.log('@@@@'+JSON.stringify(xhr));
                console.log('verify key failed');
                verify_result = false;
            }
        })
        return verify_result;
    },

    restorationRequest: function (verify_result, index, fileList) {
        const { valid, msg, keyPath } = verify_result;
        let result;
        if (!valid) {
            Swal.fire({
                title: '복호화 키 불일치',
                text: msg,
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            });
        }
        else {
            let userAuth = comm.getAuth();
            if (userAuth['decrypt_auth'] == 0) {
                Swal.fire({
                    title: '복호화 권한이 없어요.',
                    showCancelButton: false,
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: "확 인",
                    icon: "error"
                })
                location.reload;
            }
            else if (userAuth['decrypt_auth'] == 1) {
                let baseUrl = '/api/request/decrypt/thumbnail'
                let apiUrl = apiUrlConverter('decrypt', baseUrl)

                $.ajax({
                    method: 'post',
                    url: apiUrl,
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: 'json',
                    data: {
                        enc_request_id: index,
                        account_auth_id: userAuth.id,
                        fileList: JSON.stringify(fileList),
                        keyPath: keyPath
                    },
                    async: false,
                    success: function (data) {
                        result = data;
                        console.log('restoration function : '+JSON.stringify(result));
                    },
                    error: function (xhr, status) {
                        console.log('decrypt request info store failed');
                    }
                });
            }
        }
        return result;
    },

    sendThumbnailMessage: function (restorationReq, fileType, mode, eventIndex) {
        let reqInfo, msgTemplate, thumbRequestId;
        try {
            reqInfo = restorationReq['thumbReqInfo']['reqInfo'];
            msgTemplate = restorationReq['thumbReqInfo'];
            thumbRequestId = restorationReq['dec_thumbnail_id'];

            delete msgTemplate.reqInfo;

            let baseUrl = '/api/sendMessage/thumbnail'
            let apiUrl = apiUrlConverter('decrypt', baseUrl);
            $.ajax({
                method: 'post',
                url: apiUrl,
                dataType: 'json',
                data: {
                    msgTemplate: JSON.stringify(msgTemplate),
                    reqInfo: JSON.stringify(reqInfo)
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false,
                success: function (data) {
                    let fileNames = data.fileNames;
                    console.log('last request success');
                    location.href = '/loading?type=' + fileType + '&mode=' + mode + '&id=' + thumbRequestId + '&service=thumbnail&encid='+eventIndex + '&fileNames='+fileNames;
                },
                error: function (xhr, status) {
                    console.log('encrypt request message send failed');
                }
            });
        }
        catch (error) { }
    },
    
    thumbnailList: function (idx, type, mode) {
        let baseUrl = '/api/decrypt/result/thumbnail'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        var result = ''
        var resultStr = ''
        var resultData = []
        var postdata = { idx: idx, type: type, mode: mode }

        $.ajax({
            method: "post",
            url: apiUrl,
            async: false,
            data: postdata,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                result = data;
                console.log(result)
            }, // success 
            error: function (xhr, status) {
                // alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })

        const cropType = []
        const cropGroupID = []
        const cropImgID = []
        const cropImgSrc = []
        // <img class='encImg' src='../${result[0]['nas_directory']}/1/thnumbnail.jpg'>
        if (type == 'image') {
            if (mode == 'single') {
                var bodylen = []
                var headlen = []
                var lplen = []
                var check_num = /^[0-9]+$/;
                var folder_num = null
                for (let i = 0; i < result[1].length; i++) {
                    if (check_num.test(result[1][i])) {
                        folder_num = i;
                        break;
                    }
                }
                for (var i = 0; i < result[2].length; i++) {
                    if (result[2][i] != "thnumbnail.jpg") {
                        if (result[2][i].split("_")[0] == "0") bodylen.push(result[2][i])
                        else if (result[2][i].split("_")[0] == "1") headlen.push(result[2][i])
                        else if (result[2][i].split("_")[0] == "2") lplen.push(result[2][i])
                    }
                }
                resultStr += `<div class='recoArea' data-id=0>
                                <div class='encImgArea'>
                                    <img class='encImg' src='../${result[0]['nas_directory']}/${result[1][folder_num]}/${result[2][result[2].length - 1]}'>
                                </div>`
                if (bodylen.length != 0) {
                    let numBody = []
                    let objtype = bodylen[0].split("_")[0]
                    let fileType = bodylen[0].split("_")[1].split(".")[1]
                    for(var i=0;i<bodylen.length;i++){
                        numBody.push(Number(bodylen[i].split("_")[1].split(".")[0]))
                    }
                    bodylen = []
                    numBody.sort(function compare(a, b) {
                        return a - b;
                    });
                    for(var i=0;i<numBody.length;i++){
                        bodylen.push(objtype+"_"+numBody[i]+"."+fileType)
                    }
                    resultStr += `<div class='object_list bodyContent'>
                                    <div class='textArea'>
                                        <h1>사람-전신</h1>
                                        <p>전체 ${bodylen.length}장 / 선택 <span class='selectText body ${result[1][folder_num]}'>0</span>장</p>
                                        <div class='allArea'>
                                            <input class='body_allselect ${result[1][folder_num]}' type='checkbox' value=${result[1][folder_num]}><label class='allselect'>전체 선택</label>
                                        </div>
                                    </div>
                                    <div class='cropArea body'>`
                                        // <div class='columArea'>
                                        //     <div class='column1_body group${result[1][0]} col'></div>
                                        //     <div class='column2_body group${result[1][0]} col'></div>
                                        //     <div class='column3_body group${result[1][0]} col'></div>
                                        //     <div class='column4_body group${result[1][0]} col'></div>
                                        //     <div class='column5_body group${result[1][0]} col'></div>
                                        // </div>
                                        // for (var i = 0; i < bodylen.length; i++) {
                                        //     cropType.push("body")
                                        //     cropGroupID.push(result[1][0])
                                        //     cropImgID.push(bodylen[i].split("_")[1].split(".")[0])
                                        //     cropImgSrc.push('../'+result[0]['nas_directory']+'/'+result[1][0]+'/'+bodylen[i]+'')
                                        // }
                    for (var i = 0; i < bodylen.length; i++) {
                        resultStr += `<div class='cropContent'>
                                        <div class='cropID'>
                                            <p>${bodylen[i].split("_")[1].split(".")[0]}</p>
                                        </div>
                                        <div class="originBtn">
                                            <p>원본 보기</p>
                                        </div>
                                        <img class='cropImg body' data-groupidx=${result[1][folder_num]} data-imgidx=${bodylen[i].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${result[1][folder_num]}/${bodylen[i]}'>
                                        <input class='check_body ${result[1][folder_num]} body${bodylen[i].split("_")[1].split(".")[0]}' type='checkbox' value=${bodylen[i].split("_")[1].split(".")[0]}>
                                    </div>`
                    }
                    resultStr += `<div class="btn-wrap body ${result[1][folder_num]}"><a href="javascript:;" class="morebutton"><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                            </div>
                        </div>`
                }
                if (headlen.length != 0) {
                    let numHead = []
                    let objtype = headlen[0].split("_")[0]
                    let fileType = headlen[0].split("_")[1].split(".")[1]
                    for(var i=0;i<headlen.length;i++){
                        numHead.push(Number(headlen[i].split("_")[1].split(".")[0]))
                    }
                    headlen = []
                    numHead.sort(function compare(a, b) {
                        return a - b;
                    });
                    for(var i=0;i<numHead.length;i++){
                        headlen.push(objtype+"_"+numHead[i]+"."+fileType)
                    }
                    headlen.sort(function compare(a, b) {
                        return a - b;
                    });
                    resultStr += `<div class='object_list headContent'>
                                    <div class='textArea'>
                                        <h1>사람-얼굴</h1>
                                        <p>전체 ${headlen.length}장 / 선택 <span class='selectText head ${result[1][folder_num]}'>0</span>장</p>
                                        <div class='allArea'>
                                                <input class='head_allselect ${result[1][folder_num]}' type='checkbox' value=${result[1][folder_num]}><label class='allselect'>전체 선택</label>
                                            </div>
                                        </div>
                                    <div class='cropArea head'>`
                                        // <div class='columArea'>
                                        //     <div class='column1_head group${result[1][0]} col'></div>
                                        //     <div class='column2_head group${result[1][0]} col'></div>
                                        //     <div class='column3_head group${result[1][0]} col'></div>
                                        //     <div class='column4_head group${result[1][0]} col'></div>
                                        //     <div class='column5_head group${result[1][0]} col'></div>
                                        // </div>
                    for (var i = 0; i < headlen.length; i++) {
                        // colum("head", result[1][0], headlen[i].split("_")[1].split(".")[0], '../'+result[0]['nas_directory']+'/'+result[1][0]+'/'+headlen[i]+'')
                        // cropType.push("head")
                        // cropGroupID.push(result[1][0])
                        // cropImgID.push(headlen[i].split("_")[1].split(".")[0])
                        // cropImgSrc.push('../'+result[0]['nas_directory']+'/'+result[1][0]+'/'+headlen[i]+'')
                        resultStr += `<div class='cropContent'>
                                            <div class='cropID'>
                                                <p>${headlen[i].split("_")[1].split(".")[0]}</p>
                                            </div>
                                            <div class="originBtn">
                                                <p>원본 보기</p>
                                            </div>
                                            <img class='cropImg head' data-groupidx=${result[1][folder_num]} data-imgidx=${headlen[i].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${result[1][folder_num]}/${headlen[i]}'>
                                            <input class='check_head ${result[1][folder_num]} head${headlen[i].split("_")[1].split(".")[0]}' type='checkbox' value=${headlen[i].split("_")[1].split(".")[0]}>
                                        </div>`
                    }
                    resultStr += `<div class="btn-wrap head ${result[1][folder_num]}"><a href="javascript:;" class="morebutton"><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                                </div>
                            </div>`
                }
                if (lplen.length != 0) {
                    let numLp = []
                    let objtype = lplen[0].split("_")[0]
                    let fileType = lplen[0].split("_")[1].split(".")[1]
                    for(var i=0;i<lplen.length;i++){
                        numLp.push(Number(lplen[i].split("_")[1].split(".")[0]))
                    }
                    numLp.sort(function compare(a, b) {
                        return a - b;
                    });
                    lplen = []
                    for(var i=0;i<numLp.length;i++){
                        lplen.push(objtype+"_"+numLp[i]+"."+fileType)
                    }
                    resultStr += `<div class='object_list lpContent'>
                                    <div class='textArea'>
                                        <h1>차량 번호판</h1>
                                        <p>전체 ${lplen.length}장 / 선택 <span class='selectText lp ${result[1][folder_num]}'>0</span>장</p>
                                        <div class='allArea'>
                                            <input class='lp_allselect ${result[1][folder_num]}' type='checkbox' value=${result[1][folder_num]}><label class='allselect'>전체 선택</label>
                                        </div>
                                    </div>
                                        <div class='cropArea lp'>`
                                        // <div class='columArea'>
                                        //     <div class='column1_lp group${result[1][0]} col'></div>
                                        //     <div class='column2_lp group${result[1][0]} col'></div>
                                        //     <div class='column3_lp group${result[1][0]} col'></div>
                                        //     <div class='column4_lp group${result[1][0]} col'></div>
                                        //     <div class='column5_lp group${result[1][0]} col'></div>
                                        // </div>
                                        // for (var i = 0; i < lplen.length; i++) {
                                        //     cropType.push("lp")
                                        //     cropGroupID.push(result[1][0])
                                        //     cropImgID.push(lplen[i].split("_")[1].split(".")[0])
                                        //     cropImgSrc.push('../'+result[0]['nas_directory']+'/'+result[1][0]+'/'+lplen[i]+'')
                                        // }
                    for (var i = 0; i < lplen.length; i++) {
                        resultStr += `<div class='cropContent'>
                                        <div class='cropID'>
                                            <p>${lplen[i].split("_")[1].split(".")[0]}</p>
                                        </div>
                                        <div class="originBtn">
                                            <p>원본 보기</p>
                                        </div>
                                        <img class='cropImg lp' data-groupidx=${result[1][folder_num]} data-imgidx=${lplen[i].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${result[1][folder_num]}/${lplen[i]}'>
                                        <input class='check_lp ${result[1][folder_num]} lp${lplen[i].split("_")[1].split(".")[0]}' type='checkbox' value=${lplen[i].split("_")[1].split(".")[0]}>
                                    </div>`
                }
                resultStr += `<div class="btn-wrap lp ${result[1][folder_num]}"><a href="javascript:;" class="morebutton"><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                                </div>
                            </div>`
                }
                resultStr += `</div>`
            }
            else if (mode == 'group') {
                for (var j = 2; j < result.length; j++) {
                    var bodylen = []
                    var headlen = []
                    var lplen = []
                    var i = 0
                    var l = i + j - 1
                    for (var k = 0; k < result[j].length; k++) {
                        if (result[j][k] != "thnumbnail.jpg") {
                            if (result[j][k].split("_")[0] == "0") bodylen.push(result[j][k])
                            else if (result[j][k].split("_")[0] == "1") headlen.push(result[j][k])
                            else if (result[j][k].split("_")[0] == "2") lplen.push(result[j][k])
                        }
                    }
                    resultStr += `<div class='recoArea' data-id=${(l)}>
                                    <div class='encImgArea'>
                                        <p>${j-1}/${result.length-2}</p>
                                        <img class='encImg' src='../${result[0]['nas_directory']}/${(l)}/${result[j][result[j].length - 1]}'>
                                    </div>`
                    if (bodylen.length != 0) {
                        let numBody = []
                        let objtype = bodylen[0].split("_")[0]
                        let fileType = bodylen[0].split("_")[1].split(".")[1]
                        for(var i=0;i<bodylen.length;i++){
                            numBody.push(Number(bodylen[i].split("_")[1].split(".")[0]))
                        }
                        bodylen = []
                        numBody.sort(function compare(a, b) {
                            return a - b;
                        });
                        for(var i=0;i<numBody.length;i++){
                            bodylen.push(objtype+"_"+numBody[i]+"."+fileType)
                        }
                        resultStr += `<div class='object_list bodyContent'>
                                        <div class='textArea'>
                                            <h1>사람-전신</h1>
                                            <p>전체 ${bodylen.length}장 / 선택 <span class='selectText body ${(l)}'>0</span>장</p>
                                            <div class='allArea'>
                                                <input class='body_allselect ${(l)}' type='checkbox' value=${(l)}><label class='allselect'>전체 선택</label>
                                            </div>
                                        </div>
                                        <div class='cropArea body ${(l)}'>`
                        for (var m = 0; m < bodylen.length; m++) {
                            resultStr += `<div class='cropContent'>
                                            <div class='cropID'>
                                                <p>${bodylen[m].split("_")[1].split(".")[0]}</p>
                                            </div>
                                            <div class="originBtn">
                                                <p>원본 보기</p>
                                            </div>
                                            <img class='cropImg body' data-groupidx=${(l)} data-imgidx=${bodylen[m].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${(l)}/${bodylen[m]}'>
                                            <input class='check_body ${(l)} body${bodylen[m].split("_")[1].split(".")[0]}' type='checkbox' value=${bodylen[m].split("_")[1].split(".")[0]}>
                                        </div>`
                        }
                        resultStr += `<div class="btn-wrap body ${(l)}"><a href="javascript:;" class="morebutton" data-idx=${(l)}><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                                        </div>
                                    </div>`
                    }
                    if (headlen.length != 0) {
                        let numHead = []
                        let objtype = headlen[0].split("_")[0]
                        let fileType = headlen[0].split("_")[1].split(".")[1]
                        for(var i=0;i<headlen.length;i++){
                            numHead.push(Number(headlen[i].split("_")[1].split(".")[0]))
                        }
                        headlen = []
                        numHead.sort(function compare(a, b) {
                            return a - b;
                        });
                        for(var i=0;i<numHead.length;i++){
                            headlen.push(objtype+"_"+numHead[i]+"."+fileType)
                        }
                        headlen.sort(function compare(a, b) {
                            return a - b;
                        });
                        resultStr += `<div class='object_list headContent'>
                                        <div class='textArea'>
                                            <h1>사람-얼굴</h1>
                                            <p>전체 ${headlen.length}장 / 선택 <span class='selectText head ${(l)}'>0</span>장</p>
                                            <div class='allArea'>
                                                <input class='head_allselect ${(l)}' type='checkbox' value=${(l)}}><label class='allselect'>전체 선택</label>
                                            </div>
                                        </div>
                                        <div class='cropArea head ${(l)}'>`
                        for (var m = 0; m < headlen.length; m++) {
                            resultStr += `<div class='cropContent'>
                                            <div class='cropID'>
                                                <p>${headlen[m].split("_")[1].split(".")[0]}</p>
                                            </div>
                                            <div class="originBtn">
                                                <p>원본 보기</p>
                                            </div>
                                            <img class='cropImg head' data-groupidx=${(l)} data-imgidx=${headlen[m].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${(l)}/${headlen[m]}'>
                                            <input class='check_head ${(l)} head${headlen[m].split("_")[1].split(".")[0]}' type='checkbox' value=${headlen[m].split("_")[1].split(".")[0]}>
                                        </div>`
                        }
                        resultStr += `<div class="btn-wrap head ${(l)}"><a href="javascript:;" class="morebutton" data-idx=${(l)}><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                                        </div>
                                    </div>`
                    }
                    if (lplen.length != 0) {
                        let numLp = []
                        let objtype = lplen[0].split("_")[0]
                        let fileType = lplen[0].split("_")[1].split(".")[1]
                        for(var i=0;i<lplen.length;i++){
                            numLp.push(Number(lplen[i].split("_")[1].split(".")[0]))
                        }
                        numLp.sort(function compare(a, b) {
                            return a - b;
                        });
                        lplen = []
                        for(var i=0;i<numLp.length;i++){
                            lplen.push(objtype+"_"+numLp[i]+"."+fileType)
                        }
                        resultStr += `<div class='object_list lpContent'>
                                        <div class='textArea'>
                                            <h1>차량 번호판</h1>
                                            <p>전체 ${lplen.length}장 / 선택 <span class='selectText lp ${(l)}'>0</span>장</p>
                                            <div class='allArea'>
                                            <input class='lp_allselect ${(l)}' type='checkbox' value=${l}><label class='allselect'>전체 선택</label>
                                        </div>
                                    </div>
                                    <div class='cropArea lp ${(l)}'>`
                        for (var m = 0; m < lplen.length; m++) {
                            resultStr += `<div class='cropContent'>
                                            <div class='cropID'>
                                                <p>${lplen[m].split("_")[1].split(".")[0]}</p>
                                            </div>
                                            <div class="originBtn">
                                                <p>원본 보기</p>
                                            </div>
                                            <img class='cropImg lp' data-groupidx=${(l)} data-imgidx=${lplen[m].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${(l)}/${lplen[m]}'>
                                            <input class='check_lp ${(l)} lp${lplen[m].split("_")[1].split(".")[0]}' type='checkbox' value=${lplen[m].split("_")[1].split(".")[0]}>
                                        </div>`
                        }
                        resultStr += `<div class="btn-wrap lp ${(l)}"><a href="javascript:;" class="morebutton" data-idx=${(l)}><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                                        </div>
                                    </div>`
                    }
                    resultStr += `</div>`
                }
                i++
            }
        }
        else if (type == 'video') {
            var bodylen = []
            var headlen = []
            var lplen = []
            for (var i = 0; i < result[2].length; i++) {
                if (result[2][i] != "thnumbnail.json") {
                    if (result[2][i].split("_")[0] == "0") bodylen.push(result[2][i])
                    else if (result[2][i].split("_")[0] == "1") headlen.push(result[2][i])
                    else if (result[2][i].split("_")[0] == "2") lplen.push(result[2][i])
                }
            }
            resultStr += `<div class='recoArea' data-id=0>
                            <div class='encVideoArea'>
                                <video id="myPlayer" class="video-js vjs-default-skin" webkit-playsinline></video>
                            </div>`
            if (bodylen.length != 0) {
                let numBody = []
                let objtype = bodylen[0].split("_")[0]
                let fileType = bodylen[0].split("_")[1].split(".")[1]
                for(var i=0;i<bodylen.length;i++){
                    if(bodylen[i].split("_")[1].split(".")[0].indexOf("A")==0){
                        numBody.push(bodylen[i].split("_")[1].split(".")[0])
                    }
                    else{
                        numBody.push(Number(bodylen[i].split("_")[1].split(".")[0]))
                    }
                }
                bodylen = []
                numBody.sort(function compare(a, b) {
                    return a - b;
                });
                for(var i=0;i<numBody.length;i++){
                    bodylen.push(objtype+"_"+numBody[i]+"."+fileType)
                }
                resultStr += `<div class='object_list bodyContent'>
                                <div class='textArea'>
                                    <h1>사람-전신</h1>
                                    <p>전체 ${bodylen.length}장 / 선택 <span class='selectText body ${result[1][0]}'>0</span>장</p>
                                    <div class='allArea'>
                                        <input class='body_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                    </div>
                                </div>
                                <div class='cropArea body'>`
                                    // <div class='columArea'>
                                    //     <div class='column1_body group${result[1][0]} col'></div>
                                    //     <div class='column2_body group${result[1][0]} col'></div>
                                    //     <div class='column3_body group${result[1][0]} col'></div>
                                    //     <div class='column4_body group${result[1][0]} col'></div>
                                    //     <div class='column5_body group${result[1][0]} col'></div>
                                    // </div>
                                    // for (var i = 0; i < bodylen.length; i++) {
                                    //     cropType.push("body")
                                    //     cropGroupID.push(result[1][0])
                                    //     cropImgID.push(bodylen[i].split("_")[1].split(".")[0])
                                    //     cropImgSrc.push('../'+result[0]['nas_directory']+'/'+result[1][0]+'/'+bodylen[i]+'')
                                    // }
                for (var i = 0; i < bodylen.length; i++) {
                    resultStr += `<div class='cropContent'>
                                        <div class='cropID'>
                                            <p>${bodylen[i].split("_")[1].split(".")[0]}</p>
                                        </div>
                                        <div class="originBtn">
                                            <p>원본 보기</p>
                                        </div>
                                        <img class='cropImg body' data-groupidx=${result[1][0]} data-imgidx=${bodylen[i].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${result[1][0]}/${bodylen[i]}'>
                                        <input class='check_body ${result[1][0]} body${bodylen[i].split("_")[1].split(".")[0]}' type='checkbox' value=${bodylen[i].split("_")[1].split(".")[0]}>
                                    </div>`
                }
                resultStr += `<div class="btn-wrap body ${result[1][0]}"><a href="javascript:;" class="morebutton"><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                            </div>
                        </div>`
            }
            if (headlen.length != 0) {
                let numHead = []
                let objtype = headlen[0].split("_")[0]
                let fileType = headlen[0].split("_")[1].split(".")[1]
                for(var i=0;i<headlen.length;i++){
                    if(headlen[i].split("_")[1].split(".")[0].indexOf("A")==0){
                        numHead.push(headlen[i].split("_")[1].split(".")[0])
                    }
                    else{
                        numHead.push(Number(headlen[i].split("_")[1].split(".")[0]))
                    }
                }
                headlen = []
                numHead.sort(function compare(a, b) {
                    return a - b;
                });
                for(var i=0;i<numHead.length;i++){
                    headlen.push(objtype+"_"+numHead[i]+"."+fileType)
                }
                headlen.sort(function compare(a, b) {
                    return a - b;
                });
                resultStr += `<div class='object_list headContent'>
                                <div class='textArea'>
                                    <h1>사람-얼굴</h1>
                                    <p>전체 ${headlen.length}장 / 선택 <span class='selectText head ${result[1][0]}'>0</span>장</p>
                                    <div class='allArea'>
                                        <input class='head_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                    </div>
                                </div>
                                <div class='cropArea head'>`
                                    // <div class='columArea'>
                                    //     <div class='column1_head group${result[1][0]} col'></div>
                                    //     <div class='column2_head group${result[1][0]} col'></div>
                                    //     <div class='column3_head group${result[1][0]} col'></div>
                                    //     <div class='column4_head group${result[1][0]} col'></div>
                                    //     <div class='column5_head group${result[1][0]} col'></div>
                                    // </div>
                                    // for (var i = 0; i < headlen.length; i++) {
                                    //     cropType.push("head")
                                    //     cropGroupID.push(result[1][0])
                                    //     cropImgID.push(headlen[i].split("_")[1].split(".")[0])
                                    //     cropImgSrc.push('../'+result[0]['nas_directory']+'/'+result[1][0]+'/'+headlen[i]+'')
                                    // }
                for (var i = 0; i < headlen.length; i++) {
                    resultStr += `<div class='cropContent'>
                                        <div class='cropID'>
                                            <p>${headlen[i].split("_")[1].split(".")[0]}</p>
                                        </div>
                                        <div class="originBtn">
                                            <p>원본 보기</p>
                                        </div>
                                        <img class='cropImg head' data-groupidx=${result[1][0]} data-imgidx=${headlen[i].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${result[1][0]}/${headlen[i]}'>
                                        <input class='check_head ${result[1][0]} head${headlen[i].split("_")[1].split(".")[0]}' type='checkbox' value=${headlen[i].split("_")[1].split(".")[0]}>
                                    </div>`
                }
                resultStr += `<div class="btn-wrap head ${result[1][0]}"><a href="javascript:;" class="morebutton"><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                            </div>
                        </div>`
            }
            if (lplen.length != 0) {
                let numLp = []
                let objtype = lplen[0].split("_")[0]
                let fileType = lplen[0].split("_")[1].split(".")[1]
                for(var i=0;i<lplen.length;i++){
                    if(lplen[i].split("_")[1].split(".")[0].indexOf("A")==0){
                        numLp.push(lplen[i].split("_")[1].split(".")[0])
                    }
                    else{
                        numLp.push(Number(lplen[i].split("_")[1].split(".")[0]))
                    }
                }
                numLp.sort(function compare(a, b) {
                    return a - b;
                });
                lplen = []
                for(var i=0;i<numLp.length;i++){
                    lplen.push(objtype+"_"+numLp[i]+"."+fileType)
                }
                resultStr += `<div class='object_list lpContent'>
                                <div class='textArea'>
                                    <h1>차량 번호판</h1>
                                    <p>전체 ${lplen.length}장 / 선택 <span class='selectText lp ${result[1][0]}'>0</span>장</p>
                                    <div class='allArea'>
                                        <input class='lp_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                    </div>
                                </div>
                                <div class='cropArea lp'>`
                                // <div class='columArea'>
                                //     <div class='column1_lp group${result[1][0]} col'></div>
                                //     <div class='column2_lp group${result[1][0]} col'></div>
                                //     <div class='column3_lp group${result[1][0]} col'></div>
                                //     <div class='column4_lp group${result[1][0]} col'></div>
                                //     <div class='column5_lp group${result[1][0]} col'></div>
                                // </div>
                                // for (var i = 0; i < lplen.length; i++) {
                                //     cropType.push("lp")
                                //     cropGroupID.push(result[1][0])
                                //     cropImgID.push(lplen[i].split("_")[1].split(".")[0])
                                //     cropImgSrc.push('../'+result[0]['nas_directory']+'/'+result[1][0]+'/'+lplen[i]+'')
                                // }
                for (var i = 0; i < lplen.length; i++) {
                    resultStr += `<div class='cropContent'>
                                        <div class='cropID'>
                                            <p>${lplen[i].split("_")[1].split(".")[0]}</p>
                                        </div>
                                        <div class="originBtn">
                                            <p>원본 보기</p>
                                        </div>
                                        <img class='cropImg lp' data-groupidx=${result[1][0]} data-imgidx=${lplen[i].split("_")[1].split(".")[0]} src='../${result[0]['nas_directory']}/${result[1][0]}/${lplen[i]}'>
                                        <input class='check_lp ${result[1][0]} lp${lplen[i].split("_")[1].split(".")[0]}' type='checkbox' value=${lplen[i].split("_")[1].split(".")[0]}>
                                    </div>`
                }
                resultStr += `<div class="btn-wrap lp ${result[1][0]}"><a href="javascript:;" class="morebutton"><p>더보기</p><img src="../static/imgs/main/plus_icon.png"></a></div>
                            </div>
                        </div>`
                                
            }
            resultStr += `</div>`
        }

        resultData.push(resultStr)
        resultData.push(result[0]['nas_directory'])
        // resultData.push(cropType)
        // resultData.push(cropGroupID)
        // resultData.push(cropImgID)
        // resultData.push(cropImgSrc)

        return resultData
    },

    selectFile: function (idx, selectedFile) {
        let baseUrl = '/api/decrypt/select'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl,
            dataType: "json",
            data: {
                'req_idx': JSON.stringify(idx),
                'req_info': JSON.stringify(selectedFile),
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {

            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                // alert(JSON.stringify(xhr));
            }
        })
        return result;
    },

    decrypt: function (decryptArgs) {
        let baseUrl = '/api/request/decrypt'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        let result = null;

        $.ajax({
            method: "post",
            url: apiUrl,
            dataType: "json",
            data: {
                dec_thumbnail_idx: decryptArgs.idx,
                selectedFile: JSON.stringify(decryptArgs.selectedFile),
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                console.log(data);
                result = data;
            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                // alert(JSON.stringify(xhr));
            }
        });

        return result;
    },

    sendDecryptMessage: function (msg, thumbnailPath) {
        let baseUrl = '/api/sendMessage/decrypt'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        $.ajax({
            method: "post",
            url: apiUrl, //DB에 저장 후 복호화 요청정보를 Queue에 담아 전달
            dataType: "json",
            data: {
                msgTemplate: JSON.stringify(msg),
                folderPath: thumbnailPath
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                // alert(JSON.stringify(xhr));
            }
        });
    },

    sendAdditionalEncryptMessage: function (msg, fileList) {
        let baseUrl = '/api/sendMessage/encrypt/additional'
        let apiUrl = apiUrlConverter('encrypt', baseUrl)
        let result = false;
        $.ajax({
            method: "post",
            url: apiUrl, //DB에 저장 후 복호화 요청정보를 Queue에 담아 전달
            dataType: "json",
            data: {
                msgTemplate: JSON.stringify(msg),
                fileList: fileList
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') result = true;
            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                // alert(JSON.stringify(xhr));
            }
        });
        return result
    },

    sendSectorEncryptMessage: async function (msg) {
        let baseUrl = '/api/sendMessage/encrypt/sector'
        let apiUrl = apiUrlConverter('encrypt', baseUrl)
        let result = false;
        $.ajax({
            method: "post",
            url: apiUrl, //DB에 저장 후 복호화 요청정보를 Queue에 담아 전달
            dataType: "json",
            data: {
                msgTemplate: JSON.stringify(msg),
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') result = true;
            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                // alert(JSON.stringify(xhr));
            }
        });
        return result
    },

    makePasswordbin: async function (enc_request_id, keyPath) {
        let baseUrl = '/api/passwordbin'
        let apiUrl = apiUrlConverter('decrypt', baseUrl)

        let result = false;
        $.ajax({
            method: "POST",
            url: apiUrl,
            dataType: "json",
            data: {
                enc_request_id,
                keyPath
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') result = true;
            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                // alert(JSON.stringify(xhr));
            }
        });

        return result;
    },

    writeSectorToJson: async function (token, requestId, sectors, type, mode, restoration) {
        let userAuth = comm.getAuth();
        let account_auth_id = userAuth.id;
        let baseUrl = '/api/sector'
        let apiUrl = apiUrlConverter('util', baseUrl)
        let result
        $.ajax({
            method: "POST",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'token': token,
                'requestId': requestId,
                'sectors': JSON.stringify(sectors),
                'account_auth_id' : account_auth_id
            },
            async: false,
            success: function (data) {
                result = data
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result
    },

    readSectorToJson: async function (token, requestId) {
        let baseUrl = `/api/sector/${token}/${requestId}`
        let apiUrl = apiUrlConverter('util', baseUrl)

        let sectors = false;
        $.ajax({
            method: "GET",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') {
                    if(data.sectors !== '') sectors = data.sectors;
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return sectors;
    },

    writeCoordinatesToJson: async function (token, requestId, totalCoordinates = {}) {
        let baseUrl = '/api/coordinates'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let filePath = '';
        
        $.ajax({
            method: "POST",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'token': token,
                'requestId': requestId,
                'totalCoordinates': JSON.stringify(totalCoordinates)
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') {
                    filePath = data.filePath;
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return filePath;
    },

    readSectorImg: async function (type, token, requestId, sectorNum) {
        let baseUrl = `/api/sector/${type}/${token}/${requestId}/${sectorNum}`
        let apiUrl = apiUrlConverter('util', baseUrl)

        let imageFiles = false;
        $.ajax({
            method: "GET",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') {
                    if(data.imageFiles !== '') imageFiles = JSON.parse(data.imageFiles);
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return imageFiles;
    },

    readVideoJson: async function (type, token, requestId, sectorNum) {
        let baseUrl = `/api/video/${type}/${token}/${requestId}/${sectorNum}`
        let apiUrl = apiUrlConverter('util', baseUrl)

        let coordinates = false;
        $.ajax({
            method: "GET",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') {
                    if(data.coordinates !== '') coordinates = JSON.parse(data.coordinates);
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return coordinates;
    },

    writeVideoJson: async function (token, requestId, sectorNum, totalCoordinates = {}) {
        let baseUrl = '/api/video'
        let apiUrl = apiUrlConverter('util', baseUrl)

        let filePath = '';
        
        $.ajax({
            method: "POST",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'token': token,
                'requestId': requestId,
                'sectorNum': sectorNum,
                'totalCoordinates': JSON.stringify(totalCoordinates)
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') {
                    filePath = data.filePath;
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return filePath;
    },

    readCoordinatesToJson: async function (token, mode, requestId) {
        let baseUrl = `/api/coordinates/${token}/${mode}/${requestId}`
        let apiUrl = apiUrlConverter('util', baseUrl)

        let coordinates = false;
        $.ajax({
            method: "GET",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') {
                    if(data.coordinates !== '') coordinates = JSON.parse(data.coordinates);
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return coordinates;
    },

    readallSectorClear: async function (token, requestId) {
        let baseUrl = `/api/sector/clear/${token}/${requestId}`
        let apiUrl = apiUrlConverter('util', baseUrl)

        let result;
        $.ajax({
            method: "GET",
            url: apiUrl,
            xhrFields: {
                withCredentials: true
            },
            async: false,
            success: function (data) {
                if(data.message === 'success') {
                    result = data.complete;
                }
            },
            error: function (xhr, status) {
                // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
            }
        });

        return result;
    },

    additionalEncrypt: async function (detail, requestId) {
        let userAuth = comm.getAuth();
        let detailStr = JSON.stringify(detail);
        let account_auth_id = userAuth.id;

        let insertId = ''
        let encReqInfo = ''
        if (userAuth['encrypt_auth'] === 0) {
            Swal.fire({
                title: '비식별화화 권한이 없어요.',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            })
            location.reload;
        }
        else {
            let baseUrl = `/api/request/encrypt/additional`;
            let apiUrl = apiUrlConverter('encrypt', baseUrl);
            $.ajax({
                method: "POST",
                url: apiUrl,
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    detailStr,
                    account_auth_id,
                    requestId
                },
                async: false,
                success: function (data) {
                    if(data.message === 'success') {
                        console.log(data)
                        insertId = data.insertId;
                        encReqInfo = data.encReqInfo;
                    }
                },
                error: function (xhr, status) {
                    // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
                }
            });
        }
        return [insertId, encReqInfo];
    },

    additionalVideoEncrypt: async function (detail, requestId) {
        let userAuth = comm.getAuth();
        let detailStr = JSON.stringify(detail);
        let account_auth_id = userAuth.id;

        let insertId = ''
        let encReqInfo = ''
        if (userAuth['encrypt_auth'] === 0) {
            Swal.fire({
                title: '비식별화화 권한이 없어요.',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: true,
                denyButtonText: "확 인",
                icon: "error"
            })
            location.reload;
        }
        else {
            let baseUrl = `/api/request/encrypt/video`;
            let apiUrl = apiUrlConverter('encrypt', baseUrl);
            $.ajax({
                method: "POST",
                url: apiUrl,
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    detailStr,
                    account_auth_id,
                    requestId
                },
                async: false,
                success: function (data) {
                    if(data.message === 'success') {
                        console.log(data)
                        insertId = data.insertId;
                        encReqInfo = data.encReqInfo;
                    }
                },
                error: function (xhr, status) {
                    // alert(JSON.stringify(xhr) + " : " + JSON.stringify(status));
                }
            });
        }
        return [insertId, encReqInfo];
    }
}
