var canvas = document.getElementById("canvas");;
var canvasImg = document.getElementById('canvasBackImg');;
var url = canvasImg.src;;
var img = new Image();
var ctx = canvas.getContext("2d");;
ctx.lineWidth = 4;
var arRectangle = new Array();
var sx, sy;                  // 드래그 시작점
var ex, ey;                  // 드래그 끝점
var selectorClass = 0;
var selectorColor = "rgba(226,214,255,0.6)";
var color = "rgba(226,214,255,0.6)"; // 현재 색상
var strokeColor
var drawing;                // 그리고 있는 중인가
var moving = false             // 이동중인 도형 첨자
var classLoc
var result = []
var classResult = []
var originResult = []
var beforeColor = ""
var tagdiv = document.getElementById("layer")
var u = 0.01;
var scale = 1.0; // 현재 확대/축소 비율
var bodyNum = 1
var headNum = 1
var carNum = 1

// 박스 크기 조절 관련 변수
var resizing = false;
var resizeStartX, resizeStartY;

// 박스 이동 관련 변수
var movingBox = false;
var moveStartX, moveStartY;

$(document).ready(function () {
    img.src = url;

    result = []
    classResult = []
    originResult = []
    // 화면 다시 그리고 현재 도형 그림
    arRectangle.length = 0;
});

// 사각형 생성자
function Rectangle(sx, sy, ex, ey) {
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
    this.color = selectorColor;;
}

function LoadRectangle(sx, sy, ex, ey) {
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
    this.color = color;
}

// x, y 위치의 사각형 찾음. 없으면 -1
function getRectangle(x, y) {
    for (var i = 0; i < arRectangle.length; i++) {
        var rect = arRectangle[i];
        if (x > rect.sx && x < rect.ex && y > rect.sy && y < rect.ey) {
            return i;
        }
    }
    return -1;
}

// 화면 지우고 모든 도형을 순서대로 다 그림
function drawRects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < arRectangle.length; i++) {
        var r = arRectangle[i];
        var rStrokeColor
        if(r.color=="rgba(226,214,255,0.6)"||r.color=="rgba(161,122,255,0.6)"){
            rStrokeColor = "rgba(161,122,255,0.6)"
        }
        else if(r.color=="rgba(210,223,255,0.6)"||r.color=="rgba(109,153,255,0.6)"){
            rStrokeColor = "rgba(109,153,255,0.6)"
        }
        else if(r.color=="rgb(192,237,234,0.6)"||r.color=="rgb(51,199,187,0.6)"){
            rStrokeColor = "rgb(51,199,187,0.6)"
        }
        if (r.sx != r.ex && r.sy != r.ey) {
            ctx.fillStyle = r.color;
            ctx.strokeStyle = rStrokeColor;
            ctx.fillRect(r.sx, r.sy, r.ex - r.sx, r.ey - r.sy);
            ctx.strokeRect(r.sx, r.sy, r.ex - r.sx, r.ey - r.sy);
        }
    }
}

function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var zoomedWidth = img.width * scale; // 확대된 이미지 가로 크기
    var zoomedHeight = img.height * scale; // 확대된 이미지 세로 크기
  
    // 이미지를 확대/축소하여 그립니다
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      zoomedWidth,
      zoomedHeight
    );
}

function handleMouseWheel(event) {
    event.preventDefault();

    // 컨트롤 키를 누르고 있는지 확인
    if (event.ctrlKey) {
      var delta = event.deltaY || event.detail || event.wheelDelta;
  
      // 확대 또는 축소할 비율 조정 (휠업일 경우 1.1, 휠다운일 경우 0.9)
      var scaleFactor = delta < 0 ? 1.1 : 0.9;
  
      // 현재 비율에 scaleFactor를 곱하여 새로운 비율 계산
      scale *= scaleFactor;
  
      // 축소 비율 제한 (1.0까지만 허용)
      if (scale < 1.0) {
        scale = 1.0;
      }
  
      // 이미지 표시 영역 조정
      displayWidth = canvas.width / scale;
      displayHeight = canvas.height / scale;
  
      drawImage();
      drawRects();
    }
}

window.onload = function () {
    if (canvas == null || canvas.getContext == null) return;
    $(document).on("click", ".colorDiv", function () {
        $(".colorDiv").removeClass("active")
        $(this).addClass("active")
        selectorClass = $(this).data("class")
        selectorColor = $(this).data("color")
        color = selectorColor
        ctx.fillStyle = color;
        if(selectorClass=="0"){
            strokeColor = "rgba(161,122,255,0.6)"
        }
        else if(selectorClass=="1"){
            strokeColor = "rgba(109,153,255,0.6)"
        }
        else if(selectorClass=="2"){
            strokeColor = "rgb(51,199,187,0.6)"
        }
        ctx.strokeStyle = strokeColor;
    })

    canvas.onmousedown = function (e) {
        if (e.buttons == 1) {
            e.preventDefault();
            // 클릭한 좌표 구하고 그 위치에 도형이 있는지 조사
            sx = canvasX(e.clientX);
            sy = canvasY(e.clientY);
            moving = getRectangle(sx, sy);
            // 도형을 클릭한 것이 아니면 그리기 시작
            drawing = true;
            moving = true;
        }
        // 박스 크기 조절 기능 추가
        if (resizing) {
            resizeStartX = ex;
            resizeStartY = ey;
        }
    
        // 박스 이동 기능 추가
        if (movingBox) {
            moveStartX = ex;
            moveStartY = ey;
        }
    }

    canvas.onmousemove = function (e) {
        e.preventDefault();
        ex = canvasX(e.clientX);
        ey = canvasY(e.clientY);
        // 화면 다시 그리고 현재 도형 그림
        if (drawing) {
            drawRects();
            ctx.fillStyle = color;
            if(selectorClass=="0"){
                strokeColor = "rgba(161,122,255,0.6)"
            }
            else if(selectorClass=="1"){
                strokeColor = "rgba(109,153,255,0.6)"
            }
            else if(selectorClass=="2"){
                strokeColor = "rgb(51,199,187,0.6)"
            }
            ctx.strokeStyle = strokeColor;
            ctx.fillRect(sx, sy, ex - sx, ey - sy);
            ctx.strokeRect(sx, sy, ex - sx, ey - sy);
        }
        // 박스 크기 조절 기능 추가
        if (resizing) {
            var diffX = ex - resizeStartX;
            var diffY = ey - resizeStartY;
    
            // 화면 다시 그리고 현재 도형 그림
            drawRects();
    
            // 박스 크기 조절 미리보기
            ctx.fillStyle = color;
            ctx.fillRect(sx, sy, diffX, diffY);
            ctx.strokeRect(sx, sy, diffX, diffY);
        }
    
        // 박스 이동 기능 추가
        if (movingBox) {
            var diffX = ex - moveStartX;
            var diffY = ey - moveStartY;
    
            // 화면 다시 그리고 현재 도형 그림
            drawRects();
    
            // 박스 이동
            sx += diffX;
            ex += diffX;
            sy += diffY;
            ey += diffY;
            ctx.fillStyle = color;
            ctx.fillRect(sx, sy, ex - sx, ey - sy);
            ctx.strokeRect(sx, sy, ex - sx, ey - sy);
        }
    }

    canvas.addEventListener("wheel", handleMouseWheel);

    canvas.onmouseup = function (e) {
        // 좌표 정규화해서 새로운 도형을 배열에 추가
        color = selectorColor;
        if (drawing) {
            var x1 = Math.min(sx, ex);
            var y1 = Math.min(sy, ey);
            var x2 = Math.max(sx, ex);
            var y2 = Math.max(sy, ey);
            // if(x1!=x2 && y1!=y2){
            if ((x2 - x1) > 20 && y2 - y1 > 20) {
                arRectangle.push(new Rectangle(x1.toFixed(0), y1.toFixed(0), x2.toFixed(0), y2.toFixed(0), color));
            }
        }
        // 박스 크기 조절 기능 추가
        if (resizing) {
            var diffX = ex - resizeStartX;
            var diffY = ey - resizeStartY;

            // 박스 크기 조절 완료 후 업데이트
            ex += diffX;
            ey += diffY;
            arRectangle.push(new Rectangle(sx, sy, ex, ey, color));
            result.push([start, end], "/");
        }
        drawing = false;
        var start = [x1.toFixed(0), y1.toFixed(0)];
        var end = [x2.toFixed(0), y2.toFixed(0)]
        // if(start[0]!=end[0] && start[1]!=end[1]){
        if ((end[0] - start[0]) > 20 && (end[1] - start[1]) > 20) {
            result.push([start, end], "/")

            var naturalX1 = 0;
            var naturalY1 = 0;
            var naturalX2 = 0;
            var naturalY2 = 0;
            naturalX1 = (img.naturalWidth / canvas.width) * x1;
            naturalY1 = (img.naturalHeight / canvas.height) * y1;
            naturalX2 = (img.naturalWidth / canvas.width) * x2;
            naturalY2 = (img.naturalHeight / canvas.height) * y2;
            naturalX1 = Math.round(naturalX1 / u) * u
            naturalY1 = Math.round(naturalY1 / u) * u
            naturalX2 = Math.round(naturalX2 / u) * u
            naturalY2 = Math.round(naturalY2 / u) * u
            originResult.push([[naturalX1.toFixed(0), naturalY1.toFixed(0)], [naturalX2.toFixed(0), naturalY2.toFixed(0)]], "/")

            classLoc = selectorClass
            classResult.push(classLoc, "/")
            var a = $('.location').val()
            a += start + "," + end + "/"
            $('.location').val(a)
            var divClass
            if(classLoc=="0"){
                divClass = "body"
            }
            else if(classLoc=="1"){
                divClass = "head"
            }
            else if(classLoc=="2"){
                divClass = "car"
            }
            var tag1 = "<div class='tag "+divClass+"' style='background-color:" + selectorColor + ";' data-loc=" + start + "," + end + " data-class=" + classLoc + ">"
                    if(divClass=="body"){
                        tag1 +="<p>사람 - 전신 "+bodyNum+"</p>"
                        bodyNum += 1
                    }
                    else if(divClass=="head"){
                        tag1 +="<p>사람 - 얼굴 "+headNum+"</p>"
                        headNum += 1
                    }
                    else if(divClass=="car"){
                        tag1 +="<p>차량번호판 "+carNum+"</p>"
                        carNum += 1
                    }
                    tag1 += "<img class='tagdel off active' data-loc="+ start + "," + end + " data-class=" + classLoc + " src='../../static/imgs/check/offDelete.png'>\
                            <img class='tagdel on' data-loc="+ start + "," + end + " data-class=" + classLoc + " src='../../static/imgs/check/onDelete.png'>\
                        </div>"
            tagdiv.innerHTML += tag1

            const divs = document.querySelectorAll('.tag'); // 모든 .tag 요소 선택
            const body = document.querySelector('.tagdiv'); // 부모 요소의 클래스 이름 사용
        
            // divs를 배열로 변환하여 순서를 다시 설정
            const divArray = Array.from(divs);
            divArray.sort((a, b) => {
                // 순서를 변경하고 싶은 클래스 이름의 우선순위를 정의 (body < head < car)
                const classPriority = ['body', 'head', 'car'];
                return classPriority.indexOf(a.className.split(' ')[1]) - classPriority.indexOf(b.className.split(' ')[1]);
            });

            // 변경된 순서대로 다시 부모 요소에 추가
            divArray.forEach(div => body.appendChild(div));
        }
        else {
            $('.dellocation').val(end)
        }
    }
}

$(document).on("click", ".clear", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arRectangle.length = 0;
    result = [];
    $('.location').val("");
    originResult = [];
    $('.originLocation').val("");
    classResult = [];
    $('.locClass').val("");
    beforeColor = ""
    tagdiv.innerHTML = ""
    bodyNum = 1
    headNum = 1
    carNum = 1
})

function canvasX(clientX) {
    var bound = canvas.getBoundingClientRect();
    var bw = 1;
    return (clientX - bound.left - bw) * (canvas.width / (bound.width - bw * 2));
}

function canvasY(clientY) {
    var bound = canvas.getBoundingClientRect();
    var bw = 1;
    return (clientY - bound.top - bw) * (canvas.height / (bound.height - bw * 2));
}

$(document).on("mousemove", ".canvasClass", function () {
    color = selectorColor;
});

var tagInfo
$(document).on("click", ".tag", function () {
    if($(this).hasClass("active")==true){
        $(".tag").removeClass("active")
        $(".tagdel.off").addClass("active")
        $(".tagdel.on").removeClass("active")
        var tagloc = $(this).data("loc")
        tagInfo = $(this)
        var tagclass = $(this).data("class")
        var tagArr = tagloc.split(",")
        for (var i = 0; i < document.getElementsByClassName("tag").length; i++) {
            if (document.getElementsByClassName("tag")[i].dataset['class'] == 0) {
                document.getElementsByClassName("tag")[i].style.backgroundColor = "rgba(226,214,255,0.6)"
            }
            else if (document.getElementsByClassName("tag")[i].dataset['class'] == 1) {
                document.getElementsByClassName("tag")[i].style.backgroundColor = "rgba(210,223,255,0.6)"
            }
            else if (document.getElementsByClassName("tag")[i].dataset['class'] == 2) {
                document.getElementsByClassName("tag")[i].style.backgroundColor = "rgb(192,237,234,0.6)"
            }
        }
        for (var i = 0; i < arRectangle.length; i++) {
            if (arRectangle[i].color == "rgba(161,122,255,0.6)") {
                var orColor = "rgba(226,214,255,0.6)"
                arRectangle[i].color = orColor;
            }
            else if (arRectangle[i].color == "rgba(109,153,255,0.6)") {
                var orColor = "rgba(210,223,255,0.6)"
                arRectangle[i].color = orColor;
            }
            else if (arRectangle[i].color == "rgb(51,199,187,0.6)") {
                var orColor = "rgb(192,237,234,0.6)"
                arRectangle[i].color = orColor;
            }
        }
        drawRects();
        drawing = true;
        resizing = false;
        movingBox = false;
    }
    else{
        $(".tag").removeClass("active")
        $(this).addClass("active")
        var tagloc = $(this).data("loc")
        tagInfo = $(this)
    
        $(".tagdel.off").addClass("active")
        $(".tagdel.on").removeClass("active")
        $(this).find(".tagdel.off").removeClass("active")
        $(this).find(".tagdel.on").addClass("active")
    
        $('.dellocation').val(tagloc)
        var tagclass = $(this).data("class")
        var tagArr = tagloc.split(",")
        for (var i = 0; i < document.getElementsByClassName("tag").length; i++) {
            if (document.getElementsByClassName("tag")[i].dataset['class'] == 0) {
                document.getElementsByClassName("tag")[i].style.backgroundColor = "rgba(226,214,255,0.6)"
            }
            else if (document.getElementsByClassName("tag")[i].dataset['class'] == 1) {
                document.getElementsByClassName("tag")[i].style.backgroundColor = "rgba(210,223,255,0.6)"
            }
            else if (document.getElementsByClassName("tag")[i].dataset['class'] == 2) {
                document.getElementsByClassName("tag")[i].style.backgroundColor = "rgb(192,237,234,0.6)"
            }
        }
        for (var i = 0; i < arRectangle.length; i++) {
            if (arRectangle[i].color == "rgba(161,122,255,0.6)") {
                var orColor = "rgba(226,214,255,0.6)"
                arRectangle[i].color = orColor;
            }
            else if (arRectangle[i].color == "rgba(109,153,255,0.6)") {
                var orColor = "rgba(210,223,255,0.6)"
                arRectangle[i].color = orColor;
            }
            else if (arRectangle[i].color == "rgb(51,199,187,0.6)") {
                var orColor = "rgb(192,237,234,0.6)"
                arRectangle[i].color = orColor;
            }
        }
        drawRects();
        for (var i = 0; i < arRectangle.length; i++) {
            if (tagArr[0] == arRectangle[i].sx && tagArr[1] == arRectangle[i].sy && tagArr[2] == arRectangle[i].ex && tagArr[3] == arRectangle[i].ey) {
                if (tagclass == 0) {
                    var tagcolor = "rgba(161,122,255,0.6)"
                    this.style.backgroundColor = "rgba(161,122,255,0.6)"
                }
                else if (tagclass == 1) {
                    var tagcolor = "rgba(109,153,255,0.6)"
                    this.style.backgroundColor = "rgba(109,153,255,0.6)"
                }
                else if (tagclass == 2) {
                    var tagcolor = "rgb(51,199,187,0.6)"
                    this.style.backgroundColor = "rgb(51,199,187,0.6)"
                }
                arRectangle[i].color = tagcolor;
                arRectangle[i].strokeStyle = tagcolor;
                drawRects();
                break
            }
        }
        drawing = false;      
        resizing = true;
        movingBox = true;
    }
});

$(document).on("click", ".tagdel", function () {
    var delLoc = $(this).data("loc")
    tagText = $(this)
    tagInfo = $(this).parent()
    var delArr = delLoc.split(",")
    var delArr1 = []
    // var locArr = []
    for (var i = 0; i < result.length; i += 2) {
        if (Number(result[i][0][0]) == Number(delArr[0]) && Number(result[i][0][1]) == Number(delArr[1]) && Number(result[i][1][0]) == Number(delArr[2]) && Number(result[i][1][1]) == Number(delArr[3])) {
            var sx = Number(result[i][0][0])
            var sy = Number(result[i][0][1])
            var ex = Number(result[i][1][0])
            var ey = Number(result[i][1][1])
            delArr1.push(i, i + 1)
            result.splice(i, 2)
            originResult.splice(i, 2)
            classResult.splice(i, 2)
            break
        }
        console.log("if후 " + i + "번 : " + result[i])
    }
    console.log(delArr1)
    for (var j = 0; j < arRectangle.length; j++) {
        if (arRectangle[j].sx == Number(delArr[0]) && arRectangle[j].sy == Number(delArr[1]) && arRectangle[j].ex == Number(delArr[2]) && arRectangle[j].ey == Number(delArr[3])) {
            arRectangle.splice(j, 1)
            drawRects();
            break
        }
    }
    tagInfo.remove();
    tagText.remove();
    tagInfo = ""
    tagText = ""
    $('.dellocation').val("")
    beforeColor = ""
});

function saveInput() {
    $('.location').val(result)
    $('.originLocation').val(originResult)
    $('.locClass').val(classResult)
    console.log(result)
    console.log(originResult)
    console.log(classResult)
    var loc = $('.location').val()
    var originLoc = $('.originLocation').val()
    var loclass = $('.locClass').val()
    var loc1 = loc.split("/")
    var originLoc1 = originLoc.split("/")
    var loclass1 = loclass.split("/")
    var loc2 = ""
    var originLoc2 = ""
    var loclass2 = ""
    // loc1.pop();
    // loclass1.pop();
    for (var i = 0; i < loc1.length; i++) {
        if (loc1[i].slice(0, 1) == ",") {
            loc1[i] = loc1[i].substr(1);
        }
        if (loc1[i].slice(-1) == ",") {
            loc1[i] = loc1[i].substr(0, loc1[i].length - 1);
            loc2 += String(loc1[i]) + "/"
        }
    }
    for (var i = 0; i < originLoc1.length; i++) {
        if (originLoc1[i].slice(0, 1) == ",") {
            originLoc1[i] = originLoc1[i].substr(1);
        }
        if (originLoc1[i].slice(-1) == ",") {
            originLoc1[i] = originLoc1[i].substr(0, originLoc1[i].length - 1);
            originLoc2 += String(originLoc1[i]) + "/"
        }
    }
    for (var j = 0; j < loclass1.length; j++) {
        if (loclass1[j].slice(0, 1) == ",") {
            loclass1[j] = loclass1[j].substr(1);
        }
        if (loclass1[j].slice(-1) == ",") {
            loclass1[j] = loclass1[j].substr(0, loclass1[j].length - 1);
            loclass2 += String(loclass1[j]) + "/"
        }
    }
    $('.location').val(loc2)
    $('.originLocation').val(originLoc2)
    $('.locClass').val(loclass2)
    var locData = $('.location').val().split("/")
    let originData = $('.originLocation').val().split("/")
    let classData = $('.locClass').val().split("/")
    let objJson = {}
    for (var i = 0; i < classData.length; i++) {
        if (originData[i] != "") {
            objJson[i] = {
                real: originData[i].split(","),
                canvas: locData[i].split(","),
                class: Number(classData[i])
            };
        }
    }
    // for (var key in objJson) {
    //     var obj = objJson[key];
    //     var origin = obj.origin;
    //     var transformedOrigin = [];

    //     for (var i = 0; i < origin.length; i += 2) {
    //       transformedOrigin.push([Number(origin[i]), Number(origin[i + 1])]);
    //     }

    //     objJson[key] = {
    //       class: obj.class,
    //       origin: transformedOrigin
    //     };
    //   }
    console.log(objJson)
    return objJson
}

function loadData(canvasCoord, originCoord, classArray) {
    result = canvasCoord;
    originResult = originCoord;
    classResult = classArray;

    $('.location').val(result.join("/"))
    $('.originLocation').val(originResult.join("/"))
    $('.locClass').val(classResult.join("/"))
    
    result = []
    originResult = []
    classResult = []
    // 화면 다시 그리고 현재 도형 그림
    arRectangle.length = 0;
    var loc = $('.location').val()
    var col = $('.locClass').val()
    locArr = loc.split("/");
    colorArr = col.split("/");
    // locArr.pop();
    // colorArr.pop();
    var loadtag = ""
    tagdiv.innerHTML = ""
    for(var i=0; i<locArr.length; i++){
        var divClass
        if(colorArr[i]==0){
            color="rgba(226,214,255,0.6)"
            divClass = "body"
        }
        else if(colorArr[i]==1){
            color="rgba(210,223,255,0.6)"
            divClass = "head"
        }
        else if(colorArr[i]==2){
            color="rgb(192,237,234,0.6)"
            divClass = "car"
        }
        loadtag += "<div class='tag "+divClass+"' style='background-color:"+color+";' data-loc="+locArr[i]+" data-class="+colorArr[i]+">"
                if(divClass=="body"){
                    loadtag +="<p>사람 - 전신 "+bodyNum+"</p>"
                    bodyNum += 1
                }
                else if(divClass=="head"){
                    loadtag +="<p>사람 - 얼굴 "+headNum+"</p>"
                    headNum += 1
                }
                else if(divClass=="car"){
                    loadtag +="<p>차량번호판 "+carNum+"</p>"
                    carNum += 1
                }
            loadtag += "<img class='tagdel off active' data-loc="+locArr[i]+" data-class="+colorArr[i]+" src='../../static/imgs/check/offDelete.png'>\
                        <img class='tagdel on' data-loc="+locArr[i]+" data-class="+colorArr[i]+" src='../../static/imgs/check/onDelete.png'>\
                    </div>"
    }
    tagdiv.innerHTML += loadtag
    
    const divs = document.querySelectorAll('.tag'); // 모든 .tag 요소 선택
    const body = document.querySelector('.tagdiv'); // 부모 요소의 클래스 이름 사용

    // divs를 배열로 변환하여 순서를 다시 설정
    const divArray = Array.from(divs);
    divArray.sort((a, b) => {
        // 순서를 변경하고 싶은 클래스 이름의 우선순위를 정의 (body < head < car)
        const classPriority = ['body', 'head', 'car'];
        return classPriority.indexOf(a.className.split(' ')[1]) - classPriority.indexOf(b.className.split(' ')[1]);
    });

    // 변경된 순서대로 다시 부모 요소에 추가
    divArray.forEach(div => body.appendChild(div));

    for(var i=0; i<locArr.length; i++){
        var locArr1 = locArr[i].split(",");
        var locArr2 = []
        for(var j=0; j<locArr1.length; j++){
            if(locArr1[j]!=''){
                locArr2.push(locArr1[j])
            }
        }  
        color = colorArr[i]
        var colorClass = ""
        if(color==0){
            color="rgba(226,214,255,0.6)"
            colorClass=0
        }
        else if(color==1){
            color="rgba(210,223,255,0.6)"
            colorClass=1
        }
        else if(color==2){
            color="rgb(192,237,234,0.6)"
            colorClass=2
        }
        var start = [locArr2[0], locArr2[1]];
        var end = [locArr2[2], locArr2[3]]
        result.push([start,end],"/")            
        var naturalX1 = 0;
        var naturalY1 = 0;
        var naturalX2 = 0;
        var naturalY2 = 0;
        naturalX1 = (img.naturalWidth / canvas.width) * locArr2[0];
        naturalY1 = (img.naturalHeight / canvas.height) * locArr2[1];
        naturalX2 = (img.naturalWidth / canvas.width) * locArr2[2];
        naturalY2 = (img.naturalHeight / canvas.height) * locArr2[3];
        naturalX1 = Math.round(naturalX1 / u) * u
        naturalY1 = Math.round(naturalY1 / u) * u
        naturalX2 = Math.round(naturalX2 / u) * u
        naturalY2 = Math.round(naturalY2 / u) * u
        originResult.push([[naturalX1.toFixed(0), naturalY1.toFixed(0)], [naturalX2.toFixed(0), naturalY2.toFixed(0)]], "/")
        classResult.push(colorClass,"/")
        arRectangle.push(new LoadRectangle(locArr2[0], locArr2[1], locArr2[2], locArr2[3], color))
    }
    color="rgba(226,214,255,0.6)"
    colorClass=0
    drawRects();
    beforeColor = ""

    return '1'
}