var canvas = new fabric.Canvas('canvas');
var canvasImg = document.getElementById('canvasBackImg');
var url = canvasImg.src;
var img = new Image();
img.src = url;
var isDrawingMode = true;
var startX, startY;
var rect;
var isMovingOrResizing = false;
var idCounter = 1; // id 카운터 추가
var areas = {}; // 객체 변수 선언
var original = {}
var objectClass = 0
var backColor = "rgba(226,214,255,0.6)"
var strokeColor = "rgba(161,122,255)"
var selectDiv
var bodyClass = 1
var headClass = 1
var carClass = 1
var u = 0.01;

activateDrawingMode();

$(document).on("click", ".colorDiv", function () {
    $(".colorDiv").removeClass("active")
    $(this).addClass("active")
    objectClass = $(this).data("class")
    if (objectClass == 0) {
        backColor = "rgba(226,214,255,0.6)"
        strokeColor = "rgba(161,122,255)"
    }
    else if (objectClass == 1) {
        backColor = "rgba(252,230,247,0.6)"
        strokeColor = "rgba(255,97,208)"
    }
    else if (objectClass == 2) {
        backColor = "rgb(192,237,234,0.6)"
        strokeColor = "rgb(51,199,187)"
    }
})

function activateDrawingMode() {
    isDrawingMode = true;
    canvas.selection = false;
    canvas.forEachObject(function (obj) {
        obj.set('evented', false);
        obj.set('selectable', false);
    });
}

function activateMoveResizeMode() {
    isDrawingMode = false;
    canvas.selection = true;
    canvas.forEachObject(function (obj) {
        obj.set('evented', true);
        obj.set('selectable', true);
        obj.setControlsVisibility({
            tl: true,
            tr: true,
            bl: true,
            br: true,
            mt: true,
            mb: true,
            ml: true,
            mr: true,
            mtr: false,
        });
        if (obj === canvas.getActiveObject()) {
            obj.set({
                borderColor: 'red',
                cornerColor: 'green',
                cornerSize: 6,
            });
        } else {
            obj.set({
                borderColor: 'transparent',
                cornerColor: 'rgba(0,0,0,0.5)',
                cornerSize: 5,
            });
        }
    });
    isMovingOrResizing = true;
}

$(document).on("click", ".clear", function () {
    allClear();
})

function sortTags() {
    var tagContainer = document.querySelector('.tagdiv');
    var tags = Array.from(tagContainer.querySelectorAll('.tag'));

    // 클래스 및 클래스 ID에 따라 태그 정렬
    tags.sort(function (tagA, tagB) {
        var classA = tagA.getAttribute('data-class');
        var classIdA = tagA.getAttribute('data-classid');
        var classB = tagB.getAttribute('data-class');
        var classIdB = tagB.getAttribute('data-classid');

        // 클래스로 먼저 정렬하고, 클래스가 같으면 클래스 ID로 정렬
        if (classA === classB) {
            return classIdA - classIdB;
        } else {
            return classA - classB;
        }
    });

    // 정렬된 순서대로 태그를 컨테이너에 추가
    tagContainer.innerHTML = '';
    tags.forEach(function (tag) {
        tagContainer.appendChild(tag);
    });
}

function createBlock(id, left, top, right, bottom, width, height, tagClass, classID) {
    var area = document.getElementById("layer")
    var divClass
    var divColor
    var tagActive = ""
    var offActive = "active"
    var onActive = ""
    var type = ""
    if (tagClass == "0") {
        divClass = "body"
        divColor = "rgba(226,214,255,0.6)"
        type = "전신"
    }
    else if (tagClass == "1") {
        divClass = "head"
        divColor = "rgba(210,223,255,0.6)"
        type = "얼굴"
    }
    else if (tagClass == "2") {
        divClass = "car"
        divColor = "rgb(192,237,234,0.6)"
        type = "차량"
    }

    if (selectDiv != null) {
        if (selectDiv == id) {
            tagActive = "active"
            offActive = ""
            onActive = "active"
        }
    }
    var tag = `<div class='tag ${divClass} ${tagActive}' data-id=${id} data-loc=${left, top, right, bottom} data-class=${tagClass} data-classID=${classID}>
                    <p>${type}${classID}</p>
                    <img class='tagdel off ${offActive}' data-id=${id} data-loc=${left, top, right, bottom} data-class=${tagClass} src='../../static/imgs/check/offDelete.png'>
                    <img class='tagdel on ${onActive}' data-id=${id} data-loc=${left, top, right, bottom} data-class=${tagClass} src='../../static/imgs/check/onDelete.png'>
                </div>`
    area.innerHTML += tag
    sortTags();
}

$(document).on("click", ".tag", function () {
    var id = Number(this.getAttribute('data-id'));
    if ($(this).hasClass("active")) {
        $(".tag").removeClass("active")
        $(".tagdel.off").addClass("active")
        $(".tagdel.on").removeClass("active")
        var selectedObject = canvas.getObjects().find(function (obj) {
            return obj.id === id;
        });
        if (selectedObject) {
            canvas.setActiveObject(selectedObject);
            canvas.requestRenderAll();
            isDrawingMode = true;
            isMovingOrResizing = false;
            canvas.selection = false;
            canvas.forEachObject(function (obj) {
                obj.set('evented', false);
                obj.set('selectable', false);
                obj.setControlsVisibility({
                    tl: false,
                    tr: false,
                    bl: false,
                    br: false,
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                    mtr: false,
                    border: false
                });
                if (obj === canvas.getActiveObject()) {
                    obj.set({
                        borderColor: 'rgba(0,0,0,0)',
                        cornerSize: 0,
                    });
                }
            });
        }
        selectDiv = null
    }
    else {
        $(".tag").removeClass("active")
        $(this).addClass("active")
        $(".tagdel.off").addClass("active")
        $(".tagdel.on").removeClass("active")
        $(this).find(".tagdel.off").removeClass("active")
        $(this).find(".tagdel.on").addClass("active")

        var selectedObject = canvas.getObjects().find(function (obj) {
            return obj.id === id;
        });
        if (selectedObject) {
            canvas.setActiveObject(selectedObject);
            canvas.requestRenderAll();
            isDrawingMode = false;
            canvas.selection = true;
            canvas.forEachObject(function (obj) {
                obj.set('evented', true);
                obj.set('selectable', true);
                obj.setControlsVisibility({
                    tl: true,
                    tr: true,
                    bl: true,
                    br: true,
                    mt: true,
                    mb: true,
                    ml: true,
                    mr: true,
                    mtr: false,
                });
                if (obj === canvas.getActiveObject()) {
                    obj.set({
                        borderColor: 'red',
                        cornerColor: 'green',
                        cornerSize: 6,
                    });
                } else {
                    obj.set({
                        borderColor: 'transparent',
                        cornerColor: 'rgba(0,0,0,0.5)',
                        cornerSize: 5,
                    });
                }
            });
            isMovingOrResizing = true;
        }
        selectDiv = id
    }
})

$(document).on("click", ".tagdel", function () {
    var id = Number(this.getAttribute('data-id'));
    var activeObject = canvas.getObjects().find(function (obj) {
        return obj.id === id;
    });
    if (activeObject) {
        canvas.remove(activeObject);
        var id = activeObject.id;
        delete areas[id];
        delete original[id];
        updateAreaDisplay();
        activateDrawingMode();
        selectDiv = null
    }
})

function updateAreaDisplay() {
    var areaDiv = document.querySelector('.tagdiv');
    areaDiv.innerHTML = '';
    for (var id in areas) {
        var areaInfo = areas[id];
        createBlock(id, Math.round(areaInfo.left), Math.round(areaInfo.top), Math.round(areaInfo.right), Math.round(areaInfo.bottom), Math.round(areaInfo.width), Math.round(areaInfo.height), areaInfo.class, areaInfo.classID);
    }
}

canvas.on('mouse:down', function (event) {
    if (isDrawingMode && !isMovingOrResizing) {
        var pointer = canvas.getPointer(event.e);
        startX = pointer.x;
        startY = pointer.y;
        rect = new fabric.Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: 'transparent',
            backgroundColor: backColor,
            stroke: strokeColor,
            strokeWidth: 4,
            id: idCounter,
        });
        canvas.add(rect);
    }
});


canvas.on('mouse:move', function (event) {
    if (isDrawingMode && rect && !isMovingOrResizing) {
        var pointer = canvas.getPointer(event.e);
        var left = Math.min(startX, pointer.x);
        var top = Math.min(startY, pointer.y);
        var width = Math.abs(pointer.x - startX);
        var height = Math.abs(pointer.y - startY);
        rect.set({ left: left, top: top, width: width, height: height });
        canvas.renderAll();
    }
});

canvas.on('mouse:up', function (event) {
    if (isDrawingMode && !isMovingOrResizing) {
        var pointer = canvas.getPointer(event.e);
        var width = pointer.x - startX;
        var height = pointer.y - startY;
        var left = startX;
        var top = startY;
        var right = pointer.x;
        var bottom = pointer.y;
        var boxClassID

        // 조정된 좌표값 계산
        if (width < 0) {
            left = left + width;
            right = startX;
            width = Math.abs(width);
        }
        if (height < 0) {
            top = top + height;
            bottom = startY;
            height = Math.abs(height);
        }

        if (objectClass == 0) {
            boxClassID = bodyClass
            bodyClass++
        }
        else if (objectClass == 1) {
            boxClassID = headClass
            headClass++
        }
        else if (objectClass == 2) {
            boxClassID = carClass
            carClass++
        }

        var naturalX1 = 0;
        var naturalY1 = 0;
        var naturalX2 = 0;
        var naturalY2 = 0;
        naturalX1 = (img.naturalWidth / canvas.width) * Math.round(left);
        naturalY1 = (img.naturalHeight / canvas.height) * Math.round(top);
        naturalX2 = (img.naturalWidth / canvas.width) * Math.round(right);
        naturalY2 = (img.naturalHeight / canvas.height) * Math.round(bottom);
        naturalX1 = Math.round(naturalX1 / u) * u
        naturalY1 = Math.round(naturalY1 / u) * u
        naturalX2 = Math.round(naturalX2 / u) * u
        naturalY2 = Math.round(naturalY2 / u) * u

        if (width >= 20 && height >= 20) {
            areas[idCounter] = { left: Math.round(left), top: Math.round(top), right: Math.round(right), bottom: Math.round(bottom), width: Math.round(width), height: Math.round(height), class: objectClass, classID: boxClassID };
            original[idCounter] = { left: Math.round(naturalX1), top: Math.round(naturalY1), right: Math.round(naturalX2), bottom: Math.round(naturalY2), class: objectClass, classID: boxClassID };
            createBlock(idCounter, left, top, right, bottom, width, height, objectClass, boxClassID);
            idCounter++; // idCounter 증감
        } else {
            canvas.remove(rect);
        }

        rect = null;
    }
    isMovingOrResizing = false;
});

canvas.on('object:modified', function (event) {
    var modifiedObject = event.target;
    if (modifiedObject && modifiedObject.id in areas) {
        var areaInfo = areas[modifiedObject.id];
        var originalInfo = original[modifiedObject.id];
        var boundingBox = modifiedObject.getBoundingRect();

        areaInfo.left = Math.round(boundingBox.left);
        areaInfo.top = Math.round(boundingBox.top);
        areaInfo.right = Math.round(boundingBox.left) + Math.round(boundingBox.width);
        areaInfo.bottom = Math.round(boundingBox.top) + Math.round(boundingBox.height);
        areaInfo.width = Math.round(boundingBox.width);
        areaInfo.height = Math.round(boundingBox.height);

        var naturalX1 = 0;
        var naturalY1 = 0;
        var naturalX2 = 0;
        var naturalY2 = 0;
        naturalX1 = (img.naturalWidth / canvas.width) * areaInfo.left;
        naturalY1 = (img.naturalHeight / canvas.height) * areaInfo.top;
        naturalX2 = (img.naturalWidth / canvas.width) * areaInfo.right;
        naturalY2 = (img.naturalHeight / canvas.height) * areaInfo.bottom;
        naturalX1 = Math.round(naturalX1 / u) * u
        naturalY1 = Math.round(naturalY1 / u) * u
        naturalX2 = Math.round(naturalX2 / u) * u
        naturalY2 = Math.round(naturalY2 / u) * u

        originalInfo.left = Math.round(naturalX1)
        originalInfo.top = Math.round(naturalY1)
        originalInfo.right = Math.round(naturalX2)
        originalInfo.bottom = Math.round(naturalY2)

        updateAreaDisplay();
    }
});

canvas.on('selection:created', function (event) {
    isMovingOrResizing = true;
});

canvas.on('selection:cleared', function (event) {
    isMovingOrResizing = false;
});

function saveInput(sectorType, restoration) {
    let objJson = {}
    if(sectorType=="detail" && restoration==1){
        let index = 0
        for (const key in areas) {
            const area = areas[key];
            const canvas = [area.left, area.top, area.right, area.bottom];
            const real = [original[key].left, original[key].top, original[key].right, original[key].bottom];
            const cls = area.class;
            const classid = area.classID
          
            objJson[index] = { canvas, real, class: cls, objectID: classid };
            index++
          }
        console.log(objJson)
        return objJson
    }
    else{
        let index = 0
        for (const key in areas) {
            const area = areas[key];
            const canvas = [area.left, area.top, area.right, area.bottom];
            const real = [original[key].left, original[key].top, original[key].right, original[key].bottom];
            const cls = area.class;
          
            objJson[index] = { canvas, real, class: cls };
            index++
          }
        console.log(objJson)
        return objJson
    }
}

function loadData(canvasCoord, originCoord, classArray, restoration, sectorType, objectID) {
    result = canvasCoord;
    originResult = originCoord;
    classResult = classArray;
    idCounter = (result.length+1);
    let classNum
    let loadBackColor
    let loadStrokeColor
    for(let i=0;i<result.length;i++){
        
        if(restoration==1 && sectorType=="detail"){
            classNum = objectID[i]
            if(classResult[i]==0){
                loadBackColor = "rgba(226,214,255,0.6)"
                loadStrokeColor = "rgba(161,122,255)"
            }
            else if(classResult[i]==1){
                loadBackColor = "rgba(252,230,247,0.6)"
                loadStrokeColor = "rgba(255,97,208)"
            }
            else if(classResult[i]==2){
                loadBackColor = "rgb(192,237,234,0.6)"
                loadStrokeColor = "rgb(51,199,187)"
            }
            areas[(i+1)] = { left: result[i][0][0], top: result[i][0][1], right: result[i][1][0], bottom: result[i][1][1], width: (result[i][1][0]-result[i][0][0]), height: (result[i][1][1]-result[i][0][1]), class: classResult[i], classID: classNum };
            original[(i+1)] = { left: originResult[i][0][0], top: originResult[i][0][1], right: originResult[i][1][0], bottom: originResult[i][1][1], width: (originResult[i][1][0]-originResult[i][0][0]), height: (originResult[i][1][1]-originResult[i][0][1]), class: classResult[i], classID: classNum };    
        
            createBlock((i+1), result[i][0][0], result[i][0][1], result[i][1][0], result[i][1][1], (result[i][1][0]-result[i][0][0]), (result[i][1][1]-result[i][0][1]), classResult[i], classNum)
        }
        else{
            if(classResult[i]==0){
                classNum = bodyClass
                bodyClass++
                loadBackColor = "rgba(226,214,255,0.6)"
                loadStrokeColor = "rgba(161,122,255)"
            }
            else if(classResult[i]==1){
                classNum = headClass
                headClass++
                loadBackColor = "rgba(252,230,247,0.6)"
                loadStrokeColor = "rgba(255,97,208)"
            }
            else if(classResult[i]==2){
                classNum = carClass
                carClass++
                loadBackColor = "rgb(192,237,234,0.6)"
                loadStrokeColor = "rgb(51,199,187)"
            }
            areas[(i+1)] = { left: result[i][0][0], top: result[i][0][1], right: result[i][1][0], bottom: result[i][1][1], width: (result[i][1][0]-result[i][0][0]), height: (result[i][1][1]-result[i][0][1]), class: classResult[i], classID: classNum };
            original[(i+1)] = { left: originResult[i][0][0], top: originResult[i][0][1], right: originResult[i][1][0], bottom: originResult[i][1][1], width: (originResult[i][1][0]-originResult[i][0][0]), height: (originResult[i][1][1]-originResult[i][0][1]), class: classResult[i], classID: classNum };    
        
            createBlock((i+1), result[i][0][0], result[i][0][1], result[i][1][0], result[i][1][1], (result[i][1][0]-result[i][0][0]), (result[i][1][1]-result[i][0][1]), classResult[i], classNum)
        }

        rect = new fabric.Rect({
            left: result[i][0][0],
            top: result[i][0][1],
            width: (result[i][1][0]-result[i][0][0]),
            height: (result[i][1][1]-result[i][0][1]),
            fill: 'transparent',
            backgroundColor: loadBackColor,
            stroke: loadStrokeColor,
            strokeWidth: 4,
            id: (i+1),
        });
        canvas.add(rect);
    }
    rect=null
    $(".tag").removeClass("active")
    $(".tagdel.off").addClass("active")
    $(".tagdel.on").removeClass("active")
    activateDrawingMode();
}

function allClear(){
    canvas.clear();
    areas = {};
    original = {};
    updateAreaDisplay();
}

function loadCount(body, head, car){
    bodyClass = body
    headClass = head
    carClass = car
}

function sendCount() {
    return[bodyClass, headClass, carClass]
}