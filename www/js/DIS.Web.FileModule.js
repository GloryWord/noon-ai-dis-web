'use strict';

function imgChargeTable(chargeArray, fileWidth, fileHeight) {
    var html = ''
    for (var i = 0; i < chargeArray.length; i++) {
        chargeArray[i].resolution = (fileWidth[i] * fileHeight[i]) / (640 * 640);

        html += "<div class='charge_tb_content'>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p>해상도</p></div>\
                                            <div class='content_content'><p>"+ fileWidth[i] + " X " + fileHeight[i] + "</p></div>\
                                            <div class='price_content'><p>"+ price_three(chargeArray[i].resolution_charge) + "원</p></div>\
                                        </div>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p>평균 객체 수</p></div>\
                                            <div class='content_content'>\
                                                <textarea data-num='"+ i + "' onkeydown='return onlyNumber(event)' onkeyup='removeChar(event)' class='object_number' maxlength='2' placeholder='동영상에 평균적으로 등장하는 비식별 처리할 객체 수를 입력해주세요!'></textarea>\
                                            </div>\
                                            <div class='price_content'><p class='price_text "+ i + "'>?원</p></div>\
                                        </div>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p></p></div>\
                                            <div class='content_content'><p>예상 요금</p></div>\
                                            <div class='price_content'><p class='charge_text "+ i + "'>?원</p></div>\
                                        </div>\
                                    </div>"
    }
    html += "<div class='charge_tb_footer'>\
                                        <div class='empty_area'></div>\
                                        <div class='text_area'><p>총 요금</p></div>\
                                        <div class='price_area'><p class='total_text'>?원</p></div>\
                                    </div>"

    return html;
}

function videoChargeTable(currentFile, fileWidth, fileHeight, chargeArray) {
    var info_content_html = ''
    var charge_content_html = ''

    var [resolution_charge, frame_rate_charge, duration_charge, bitrate_charge] = chargeArray
    if (screen.width <= 600) {
        info_content_html = "<div class='info_area'>\
                                    <div class='first_area'>\
                                        <div class='res_content'>\
                                            <h1>해상도</h1>\
                                            <p>"+ fileWidth[0] + " X " + fileHeight[0] + "</p>\
                                        </div>\
                                        <div class='frame_content'>\
                                            <h1>프레임 레이트</h1>\
                                            <p>"+ currentFile.avg_frame_rate.split('/')[0] + " FPS</p>\
                                        </div>\
                                    </div>\
                                    <div class='second_area'>\
                                        <div class='dur_content'>\
                                            <h1>길이</h1>\
                                            <p>"+ time_change(currentFile.duration) + "</p>\
                                        </div>\
                                        <div class='bit_content'>\
                                            <h1>비트 레이트</h1>\
                                            <p>"+ currentFile.bit_rate + " bps</p>\
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
                                        <p>"+ currentFile.avg_frame_rate.split('/')[0] + " FPS</p>\
                                    </div>\
                                    <div class='dur_content'>\
                                        <p>"+ time_change(currentFile.duration) + "</p>\
                                    </div>\
                                    <div class='bit_content'>\
                                        <p>"+ currentFile.bit_rate + " bps</p>\
                                    </div>\
                                </div>"

        charge_content_html = "<div class='charge_tb_content'>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p>해상도</p></div>\
                                            <div class='content_content'><p>"+ fileWidth[0] + " X " + fileHeight[0] + "</p></div>\
                                            <div class='price_content'><p>"+ price_three(resolution_charge) + "원</p></div>\
                                        </div>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p>프레임 레이트</p></div>\
                                            <div class='content_content'><p>"+ currentFile.avg_frame_rate.split('/')[0] + " FPS</p></div>\
                                            <div class='price_content'><p>"+ price_three(frame_rate_charge) + "원</p></div>\
                                        </div>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p>길 이</p></div>\
                                            <div class='content_content'><p>"+ time_change(currentFile.duration) + "</p></div>\
                                            <div class='price_content'><p>"+ price_three(duration_charge) + "원</p></div>\
                                        </div>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p>비트 레이트</p></div>\
                                            <div class='content_content'><p>"+ currentFile.bit_rate + " bps</p></div>\
                                            <div class='price_content'><p>"+ price_three(bitrate_charge) + "원</p></div>\
                                        </div>\
                                        <div class='charge_info'>\
                                            <div class='category_content'><p>평균 객체 수</p></div>\
                                            <div class='content_content'>\
                                                <textarea data-num='"+ 0 + "' onkeydown='return onlyNumber(event)' onkeyup='removeChar(event)' class='object_number' maxlength='2' placeholder='동영상에 평균적으로 등장하는 비식별 처리할 객체 수를 입력해주세요!'></textarea>\
                                            </div>\
                                            <div class='price_content'><p class='price_text "+ 0 + "'>?원</p></div>\
                                        </div>\
                                    </div>\
                                    <div class='charge_tb_footer'>\
                                        <div class='empty_area'></div>\
                                        <div class='text_area'><p>예상 요금</p></div>\
                                        <div class='price_area'><p class='charge_text "+ 0 + "'>?원</p></div>\
                                    </div>"
    }

    return [info_content_html, charge_content_html]
}

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
                img.onload = () => {
                    // alert(img.width + " " + img.height);
                    fileWidth.push(img.width);
                    fileHeight.push(img.height);
                    fileCount += 1;
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

        return [html, fileWidth, fileHeight, fileSize, fileCount, videoDuration];
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

            $.ajax({
                method: "post",
                url: "/util-module/api/syncTime", // 세션에 현재 요청시간 정보를 담아줌
                dataType: "json",
                data: {
                    'curTime': curTime
                },
                success: function (data) {
                    var formData = new FormData();
                    var file = document.getElementById('file').files;
                    var mode = ''

                    if (file.length > 1) mode = '/multiple';
                    for (var i = 0; i < file.length; i++) formData.append('file', file[i]);
                    // formData.append('file', file);
                    var xhr = new XMLHttpRequest();
                    xhr.open('post', '/util-module/api/uploadNAS' + mode, true);
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
                            let resolution_charge, frame_rate_charge, duration_charge, bitrate_charge, avg_object_charge;
                            let base_charge;
                            filePath.push(response.filePath)

                            if (fileType == 'video') {
                                var ffmpegInfo = response.result.streams;
                                coefficient = {
                                    resolution: '',
                                    frame_rate: '',
                                    duration: '',
                                    bitrate: '',
                                    avg_object: 1
                                }
                                base_charge = 2000;
                                const charging_variable_count = Object.keys(coefficient).length;

                                for (var i = 0; i < fileWidth.length; i++) {
                                    var curFile = ffmpegInfo[i]
                                    var info_content = document.querySelector(".info_content")
                                    var charge_content = document.querySelector(".charge_content")

                                    coefficient.resolution = (fileWidth[i] * fileHeight[i]) / (640 * 640)

                                    var avg_frame_rate = curFile.avg_frame_rate
                                    avg_frame_rate = avg_frame_rate.split('/');
                                    avg_frame_rate = Number(avg_frame_rate[0]);
                                    coefficient.frame_rate = avg_frame_rate / 30;

                                    coefficient.duration = curFile.duration / 60;

                                    bitrateArray.push(curFile.bit_rate)
                                    coefficient.bitrate = curFile.bit_rate / (((640 * 640) * 30) / 4);

                                    // 요금 = (각 항목별 상대계수 X 기본요금) / 총 항목 갯수
                                    // 요금은 소숫점 둘째자리까지 반올림하여 계산
                                    resolution_charge = coefficient.resolution * base_charge / charging_variable_count;
                                    resolution_charge = Math.round(resolution_charge * 100) / 100

                                    frame_rate_charge = coefficient.frame_rate * base_charge / charging_variable_count;
                                    frame_rate_charge = Math.round(frame_rate_charge * 100) / 100

                                    duration_charge = coefficient.duration * base_charge / charging_variable_count;
                                    duration_charge = Math.round(duration_charge * 100) / 100

                                    bitrate_charge = coefficient.bitrate * base_charge / charging_variable_count;
                                    bitrate_charge = Math.round(bitrate_charge * 100) / 100

                                    avg_object_charge = coefficient.avg_object * base_charge / charging_variable_count;
                                    if (restoration == 1) avg_object_charge = avg_object_charge * 1.5

                                    var chargeArray = [resolution_charge, frame_rate_charge, duration_charge, bitrate_charge]

                                    var [info_content_html, charge_content_html] = videoChargeTable(curFile, fileWidth, fileHeight, chargeArray)

                                    info_content.innerHTML = info_content_html;
                                    charge_content.innerHTML = charge_content_html;
                                }
                            }
                            else if (fileType == "image") {
                                base_charge = 200;

                                var chargeArray = [];
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

                                    const charging_variable_count = Object.keys(coefficient).length;
                                    coefficient.resolution = (fileWidth[i] * fileHeight[i]) / (640 * 640)
                                    charge.resolution_charge = coefficient.resolution * base_charge / charging_variable_count;
                                    charge.resolution_charge = Math.round(charge.resolution_charge * 100) / 100
                                    charge.avg_object_charge = coefficient.avg_object * base_charge / charging_variable_count;
                                    if (restoration == 1) charge.avg_object_charge = charge.avg_object_charge * 1.5

                                    chargeArray.push(charge);
                                }

                                var html = imgChargeTable(chargeArray, fileWidth, fileHeight);
                                var charge_content = document.querySelector(".charge_content")
                                charge_content.innerHTML = html;
                            }

                            $('input[type=radio][name=restoration]').on('change', function () {
                                if ($(this).val() == 'true') {
                                    if (fileType == "video") avg_object_charge *= 1.5
                                    else for (let i = 0; i < chargeArray.length; i++) {
                                        chargeArray[i].avg_object_charge *= 1.5
                                    }
                                }
                                else {
                                    if (fileType == "video") avg_object_charge /= 1.5;
                                    else for (let i = 0; i < chargeArray.length; i++) {
                                        chargeArray[i].avg_object_charge *= 1.5
                                    }
                                }
                            });

                            $(document).on("change", ".object_number", function () {
                                var object_num = $(this).val();
                                var num = $(this).data("num")
                                var total = 0;
                                if (fileType == "video") {
                                    var total_avg_object_charge = object_num * avg_object_charge
                                    var total_charge = resolution_charge + frame_rate_charge + duration_charge + bitrate_charge + total_avg_object_charge;
                                    total_charge = Math.round(total_charge * 100) / 100
                                    $(".price_text." + num + "").text(price_three(total_avg_object_charge) + "원")
                                    $(".charge_text." + num + "").text(price_three(total_charge) + "원")
                                }
                                else if (fileType == "image") {

                                    var total_avg_object_charge = object_num * chargeArray[0].avg_object_charge;
                                    for (var i = 0; i < chargeArray.length; i++) {
                                        chargeArray[i].total_charge = 0;
                                        chargeArray[i].total_charge += chargeArray[i].resolution_charge;
                                        chargeArray[i].total_charge += chargeArray[i].avg_object_charge * object_num;
                                        chargeArray[i].total_charge = Math.round(chargeArray[i].total_charge * 100) / 100
                                    }

                                    $(".price_text." + num + "").text(price_three(total_avg_object_charge) + "원")
                                    $(".charge_text." + num + "").text(price_three(chargeArray[num].total_charge) + "원")
                                    for (var i = 0; i < $(".charge_text").length; i++) {
                                        const regex = /[^0-9.]/g;
                                        const result = $(".charge_text." + i + "").text().replace(regex, "");
                                        total += Number(result)
                                    }
                                    $(".total_text").text(price_three(Math.round(total * 100) / 100) + "원")
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
                        }
                        else {
                            alert('파일 업로드 실패')
                        }
                    };
                    xhr.send(formData);
                },
                error: function (xhr, status) {
                    // alert(xhr + " : " + status);
                    alert(JSON.stringify(xhr));
                }
            });
            resolve([postData, bitrateArray, filePath]);
        })
    },

    encrypt: function (postData, fileWidth, fileHeight, restoration, bitrateArray, fileType) {
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
                    for (var i = 0; i < $('.dropdown_content').length; i++) {
                        console.log($('.dropdown_content')[i].innerText)
                        if ($('.dropdown_content').eq(i).text() == keyName) keyIndex = $('.dropdown_content').eq(i).attr('data-idx');
                    }
                }
            }

            postData['restoration'] = restoration;
            postData['keyIndex'] = keyIndex;
            postData['keyName'] = keyName;

            $.ajax({
                method: "post",
                url: "/encrypt-module/api/request/encrypt",
                dataType: "json",
                data: postData,
                async: false,
                success: function (data) {
                    requestIndex = data.enc_request_list_id;
                    comm.meterEncrypt(postData.fileNameList, fileWidth, fileHeight, requestIndex, restoration);
                },
                error: function (xhr, status) {
                    // alert(xhr + " : " + status);
                    alert(JSON.stringify(xhr));
                }
            });
            postData['bitrate'] = JSON.stringify(bitrateArray);
            postData['requestIndex'] = requestIndex;
            resolve();
        }).then(() => {
            $.ajax({
                method: "post",
                url: "/encrypt-module/api/sendMessage/encrypt",
                dataType: "json",
                data: postData,
                success: function (data) {

                },
                error: function (xhr, status) {
                    // alert(xhr + " : " + status);
                    alert(JSON.stringify(xhr));
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
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.href = '/loading?type=' + fileType + '&service=encrypt';
                    }
                })
            })
        })
    },

    uploadKey: function () {
        var formData = new FormData();
        let file = document.getElementById('file').files[0];
        let upload_result;
        let file_name = (file != undefined) ? file.name : null;

        new Promise((resolve, reject) => {
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
                $.ajax({
                    method: 'post',
                    url: '/util-module/api/uploadNAS',
                    processData: false,
                    contentType: false,
                    data: formData,
                    async: false,
                    success: function (data) {
                        if (data.message == 'success') {
                            console.log('upload success');
                            upload_result = file_name;
                        }
                    },
                    error: function (xhr, status) {
                        upload_result = false;
                        console.log('upload key failed');
                    }
                });
            }
            resolve(upload_result)
        })
        return upload_result;
    },

    verifyKey: function (file_name, key_name) {
        let msg, keyPath, valid, verify_result;
        $.ajax({
            method: 'post',
            url: '/key-module/api/key/verify',
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
                $.ajax({
                    method: 'post',
                    url: '/decrypt-module/api/request/decrypt/thumbnail',
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

    storeThumbnailReqInfo: function (restorationReq, fileType, mode) {
        let reqInfo, msgTemplate, thumbRequestId;
        try {
            reqInfo = restorationReq['thumbReqInfo']['reqInfo'];
            msgTemplate = restorationReq['thumbReqInfo'];
            thumbRequestId = restorationReq['dec_thumbnail_id'];

            delete msgTemplate.reqInfo;

            $.ajax({
                method: 'post',
                url: '/decrypt-module/api/sendMessage/thumbnail',
                dataType: 'json',
                data: {
                    msgTemplate: JSON.stringify(msgTemplate),
                    reqInfo: JSON.stringify(reqInfo)
                },
                async: false,
                success: function (data) {
                    console.log('last request success');
                    location.href = '/loading?type=' + fileType + '&mode=' + mode + '&id=' + thumbRequestId + '&service=thumbnail';
                },
                error: function (xhr, status) {
                    console.log('encrypt request message send failed');
                }
            });
        }
        catch (error) { }
    },
    
    thumbnailList: function (idx, type, mode) {
        var result = ''
        var resultStr = ''
        var resultData = []
        var postdata = { idx: idx, type: type, mode: mode }
        $.ajax({
            method: "post",
            url: "/decrypt-module/api/decrypt/result/thumbnail",
            async: false,
            data: postdata,
            success: function (data) {
                result = data;
                console.log(result)
            }, // success 
            error: function (xhr, status) {
                alert("error : " + xhr + " : " + JSON.stringify(status));
            }
        })

        // <img class='encImg' src='../${result[0]['nas_directory']}/1/thnumbnail.jpg'>
        if (type == 'image') {
            if (mode == 'single') {
                var bodylen = []
                var headlen = []
                var lplen = []
                for (var i = 0; i < result[2].length; i++) {
                    if (result[2][i] != "thnumbnail.jpg") {
                        if (result[2][i].split("_")[0] == "0") bodylen.push(result[2][i])
                        else if (result[2][i].split("_")[0] == "1") headlen.push(result[2][i])
                        else if (result[2][i].split("_")[0] == "2") lplen.push(result[2][i])
                    }
                }
                resultStr += `<div class='recoArea' data-id=0>
                                <div class='encImgArea'>
                                    <img class='encImg' src='../${result[0]['nas_directory']}/${result[1][0]}/${result[2][result[2].length - 1]}'>
                                </div>
                                <div class='object_list'>
                                    <div class='textArea'>
                                        <h1>전신</h1>`
                if (bodylen.length != 0) {
                    resultStr += `<div class='allArea'>
                                                <input class='body_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                            </div>`
                }
                resultStr += `</div>
                                    <div class='cropArea'>`
                for (var i = 0; i < bodylen.length; i++) {
                    resultStr += `<div class='cropContent'>
                                                            <img class='cropImg' src='../${result[0]['nas_directory']}/${result[1][0]}/${bodylen[i]}'>
                                                            <div class='cropID'>
                                                                <p>${bodylen[i].split("_")[1].split(".")[0]}</p>
                                                            </div>
                                                            <input class='check_body ${result[1][0]}' type='checkbox' value=${bodylen[i].split("_")[1].split(".")[0]}>
                                                        </div>`
                }
                resultStr += `</div>
                                </div>
                                <div class='object_list'>
                                    <div class='textArea'>
                                        <h1>머리</h1>`
                if (headlen.length != 0) {
                    resultStr += `<div class='allArea'>
                                                <input class='head_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                            </div>`
                }
                resultStr += `</div>
                                    <div class='cropArea'>`
                for (var i = 0; i < headlen.length; i++) {
                    resultStr += `<div class='cropContent'>
                                                            <img class='cropImg' src='../${result[0]['nas_directory']}/${result[1][0]}/${headlen[i]}'>
                                                            <div class='cropID'>
                                                                <p>${headlen[i].split("_")[1].split(".")[0]}</p>
                                                            </div>
                                                            <input class='check_head ${result[1][0]}' type='checkbox' value=${headlen[i].split("_")[1].split(".")[0]}>
                                                        </div>`
                }
                resultStr += `</div>
                                </div>
                                <div class='object_list'>
                                    <div class='textArea'>
                                        <h1>자동차 번호판</h1>`
                if (lplen.length != 0) {
                    resultStr += `<div class='allArea'>
                                                <input class='lp_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                            </div>`
                }
                resultStr += `</div>
                                    <div class='cropArea'>`
                for (var i = 0; i < lplen.length; i++) {
                    resultStr += `<div class='cropContent'>
                                                            <img class='cropImg' src='../${result[0]['nas_directory']}/${result[1][0]}/${lplen[i]}'>
                                                            <div class='cropID'>
                                                                <p>${lplen[i].split("_")[1].split(".")[0]}</p>
                                                            </div>
                                                            <input class='check_lp ${result[1][0]}' type='checkbox' value=${lplen[i].split("_")[1].split(".")[0]}>
                                                        </div>`
                }
                resultStr += `</div>
                                </div>
                            </div>`
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
                                        <img class='encImg' src='../${result[0]['nas_directory']}/${(l)}/${result[j][result[j].length - 1]}'>
                                    </div>
                                    <div class='object_list'>
                                        <div class='textArea'>
                                            <h1>전신</h1>`
                    if (bodylen.length != 0) {
                        resultStr += `<div class='allArea'>
                                                <input class='body_allselect ${(l)}' type='checkbox' value=${(l)}><label class='allselect'>전체 선택</label>
                                            </div>`
                    }
                    resultStr += `</div>
                                                <div class='cropArea'>`
                    for (var m = 0; m < bodylen.length; m++) {
                        resultStr += `<div class='cropContent'>
                                <img class='cropImg' src='../${result[0]['nas_directory']}/${(l)}/${bodylen[m]}'>
                                <div class='cropID'>
                                    <p>${bodylen[m].split("_")[1].split(".")[0]}</p>
                                </div>
                                <input class='check_body ${(l)}' type='checkbox' value=${bodylen[m].split("_")[1].split(".")[0]}>
                            </div>`
                    }
                    resultStr += `</div>
                            </div>
                            <div class='object_list'>
                                <div class='textArea'>
                                    <h1>머리</h1>`
                    if (headlen.length != 0) {
                        resultStr += `<div class='allArea'>
                                            <input class='head_allselect ${(l)}' type='checkbox' value=${(l)}}><label class='allselect'>전체 선택</label>
                                        </div>`
                    }
                    resultStr += `</div>
                                <div class='cropArea'>`
                    for (var m = 0; m < headlen.length; m++) {
                        resultStr += `<div class='cropContent'>
                                                        <img class='cropImg' src='../${result[0]['nas_directory']}/${(l)}/${headlen[m]}'>
                                                        <div class='cropID'>
                                                            <p>${headlen[m].split("_")[1].split(".")[0]}</p>
                                                        </div>
                                                        <input class='check_head ${(l)}' type='checkbox' value=${headlen[m].split("_")[1].split(".")[0]}>
                                                    </div>`
                    }
                    resultStr += `</div>
                            </div>
                            <div class='object_list'>
                                <div class='textArea'>
                                    <h1>자동차 번호판</h1>`
                    if (lplen.length != 0) {
                        resultStr += `<div class='allArea'>
                                            <input class='lp_allselect ${(l)}' type='checkbox' value=${l}><label class='allselect'>전체 선택</label>
                                        </div>`
                    }
                    resultStr += `</div>
                                <div class='cropArea'>`
                    for (var m = 0; m < lplen.length; m++) {
                        resultStr += `<div class='cropContent'>
                                                        <img class='cropImg' src='../${result[0]['nas_directory']}/${(l)}/${lplen[m]}'>
                                                        <div class='cropID'>
                                                            <p>${lplen[m].split("_")[1].split(".")[0]}</p>
                                                        </div>
                                                        <input class='check_lp ${(l)}' type='checkbox' value=${lplen[m].split("_")[1].split(".")[0]}>
                                                    </div>`
                    }
                    resultStr += `</div>
                            </div>
                        </div>`
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
                                <div class='object_list'>
                                    <div class='textArea'>
                                        <h1>전신</h1>`
            if (bodylen.length != 0) {
                resultStr += `<div class='allArea'>
                                                <input class='body_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                            </div>`
            }
            resultStr += `</div>
                                    <div class='cropArea'>`
            for (var i = 0; i < bodylen.length; i++) {
                resultStr += `<div class='cropContent'>
                                                            <img class='cropImg' src='../${result[0]['nas_directory']}/${result[1][0]}/${bodylen[i]}'>
                                                            <div class='cropID'>
                                                                <p>${bodylen[i].split("_")[1].split(".")[0]}</p>
                                                            </div>
                                                            <input class='check_body ${result[1][0]}' type='checkbox' value=${bodylen[i].split("_")[1].split(".")[0]}>
                                                        </div>`
            }
            resultStr += `</div>
                                </div>
                                <div class='object_list'>
                                    <div class='textArea'>
                                        <h1>머리</h1>`
            if (headlen.length != 0) {
                resultStr += `<div class='allArea'>
                                                <input class='head_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                            </div>`
            }
            resultStr += `</div>
                                    <div class='cropArea'>`
            for (var i = 0; i < headlen.length; i++) {
                resultStr += `<div class='cropContent'>
                                                            <img class='cropImg' src='../${result[0]['nas_directory']}/${result[1][0]}/${headlen[i]}'>
                                                            <div class='cropID'>
                                                                <p>${headlen[i].split("_")[1].split(".")[0]}</p>
                                                            </div>
                                                            <input class='check_head ${result[1][0]}' type='checkbox' value=${headlen[i].split("_")[1].split(".")[0]}>
                                                        </div>`
            }
            resultStr += `</div>
                                </div>
                                <div class='object_list'>
                                    <div class='textArea'>
                                        <h1>자동차 번호판</h1>`
            if (lplen.length != 0) {
                resultStr += `<div class='allArea'>
                                                <input class='lp_allselect ${result[1][0]}' type='checkbox' value=${result[1][0]}><label class='allselect'>전체 선택</label>
                                            </div>`
            }
            resultStr += `</div>
                                    <div class='cropArea'>`
            for (var i = 0; i < lplen.length; i++) {
                resultStr += `<div class='cropContent'>
                                                            <img class='cropImg' src='../${result[0]['nas_directory']}/${result[1][0]}/${lplen[i]}'>
                                                            <div class='cropID'>
                                                                <p>${lplen[i].split("_")[1].split(".")[0]}</p>
                                                            </div>
                                                            <input class='check_lp ${result[1][0]}' type='checkbox' value=${lplen[i].split("_")[1].split(".")[0]}>
                                                        </div>`
            }
            resultStr += `</div>
                                </div>
                            </div>`
        }

        resultData.push(resultStr)
        resultData.push(result[0]['nas_directory'])

        return resultData
    },

    selectFile: function (idx, selectedFile) {
        $.ajax({
            method: "post",
            url: "/decrypt-module/api/decrypt/select",
            dataType: "json",
            data: {
                'req_idx': JSON.stringify(idx),
                'req_info': JSON.stringify(selectedFile),
            },
            async: false,
            success: function (data) {

            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                alert(JSON.stringify(xhr));
            }
        })
        return result;
    },

    decrypt: function (decryptArgs) {
        let result = null;

        $.ajax({
            method: "post",
            url: "/decrypt-module/api/request/decrypt",
            dataType: "json",
            data: {
                dec_thumbnail_idx: decryptArgs.idx,
                selectedFile: JSON.stringify(decryptArgs.selectedFile),
            },
            async: false,
            success: function (data) {
                console.log(data);
                result = data;
            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                alert(JSON.stringify(xhr));
            }
        });

        return result;
    },

    sendDecryptMessage: function (msg) {
        $.ajax({
            method: "post",
            url: "/decrypt-module/api/sendMessage/decrypt", //DB에 저장 후 복호화 요청정보를 Queue에 담아 전달
            dataType: "json",
            data: {
                msgTemplate: JSON.stringify(msg),
            },
            success: function (data) {

            },
            error: function (xhr, status) {
                // alert(xhr + " : " + status);
                alert(JSON.stringify(xhr));
            }
        });
    }
}
