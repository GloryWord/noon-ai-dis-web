const video = document.getElementById('video');
const frameSlider = document.getElementById('frame-slider');
const frameIndicator = document.getElementById('frame-indicator');

let FPS
let isPlaying = false;
let isSliding = false; // Variable to track slider interaction
let startFrame = 1; // Starting frame of the selected range
let endFrame = 1; // Ending frame of the selected range
let nowFrame = null;
let keydown = false;

var queryString = location.search;
const urlParams = new URLSearchParams(queryString);
var type = urlParams.get('type');
var requestId = urlParams.get('id');
var mode = urlParams.get('mode');
var restoration = urlParams.get('restoration');

let sectors = [];

video.addEventListener('loadedmetadata', function () {
    // FPS = video.webkitDecodedFrameCount || FPS; // Try to get the actual FPS, if available

    const totalFrames = Math.floor(video.duration * FPS);
    frameSlider.max = totalFrames;
    frameIndicator.textContent = `1 / ${totalFrames}`;
});

frameSlider.addEventListener('input', function () {
    const frame = parseInt(this.value);
    const timeInSeconds = (frame) / FPS;
    video.currentTime = timeInSeconds;
    frameIndicator.textContent = `${frame} / ${frameSlider.max}`;
    isSliding = true; // Slider interaction started
});

frameSlider.addEventListener('change', function () {
    isSliding = false; // Slider interaction ended
});

video.addEventListener('timeupdate', function () {
    if (!isSliding) { // Only update when not sliding
        const currentTime = video.currentTime;
        console.log("currentTime : " + currentTime)
        const currentFrame = Math.floor(currentTime * FPS);
        frameSlider.value = currentFrame;
        frameIndicator.textContent = `${currentFrame} / ${frameSlider.max}`;
    }
});

$(document).on("click", ".startFrame", function () {
    startFrame = Math.floor(video.currentTime * FPS);
    if(startFrame==0){
        startFrame = 1;
    }
    if(isOverlapWithExistingSectors(startFrame)==false){
        $(".startFrame").removeClass("active")
        $(".endFrame").addClass("active")
    }
    else{
        video.pause();
        $(".playIcon").addClass("active");
        $(".pauseIcon").removeClass("active");
        const currentTime = video.currentTime;
        let currentFrame = Math.floor(currentTime * FPS);
        if(currentFrame==0){
            currentFrame = 1;
        }
        frameSlider.value = currentFrame;
        frameIndicator.textContent = `${currentFrame} / ${frameSlider.max}`;
        video.currentTime = (currentFrame / FPS);
        isSliding = true; // Slider interaction ended
        Swal.fire({
            title:'이미 선택된 범위 내 \n프레임입니다.',
            showConfirmButton:false,
            showDenyButton:true,
            denyButtonText:"확 인",
            icon:"error"
        });
    }
})

$(document).on("click", ".endFrame", function () {
    endFrame = Math.floor(video.currentTime * FPS);
    if(endFrame==0){
        endFrame = 1;
    }
    if(endFrame<startFrame){
        Swal.fire({
            title:'시작 프레임이 \n종료 프레임보다 큽니다.',
            showConfirmButton:false,
            showDenyButton:true,
            denyButtonText:"확 인",
            icon:"error"
        });
    }
    else{
        if(isOverlapWithExistingSectors(endFrame)==false){
            $(".startFrame").addClass("active")
            $(".endFrame").removeClass("active")
            video.pause();
            $(".playIcon").addClass("active");
            $(".pauseIcon").removeClass("active");
            const currentTime = video.currentTime;
            let currentFrame = Math.floor(currentTime * FPS);
            if(currentFrame==0){
                currentFrame = 1;
            }
            frameSlider.value = currentFrame;
            frameIndicator.textContent = `${currentFrame} / ${frameSlider.max}`;
            video.currentTime = (currentFrame / FPS);
            isSliding = true; // Slider interaction ended
            $("#sectorClass").addClass("active")
        }
        else{
            video.pause();
            $(".playIcon").addClass("active");
            $(".pauseIcon").removeClass("active");
            const currentTime = video.currentTime;
            const currentFrame = Math.floor(currentTime * FPS);
            frameSlider.value = currentFrame;
            frameIndicator.textContent = `${currentFrame} / ${frameSlider.max}`;
            video.currentTime = (currentFrame / FPS);
            isSliding = true; // Slider interaction ended
            Swal.fire({
                title:'이미 선택된 범위 내 \n프레임입니다.',
                showConfirmButton:false,
                showDenyButton:true,
                denyButtonText:"확 인",
                icon:"error"
            });
        }
    }
})

$(document).on("click", ".detailSector", function () {
    const sectorData = {
        'type': 'detail',
        'restoration' : restoration,
        'complete':0,
        'frame' : {
            'start': startFrame,
            'end': endFrame,
            "location": {}
        }
    };

    for (let i = startFrame; i <= endFrame; i++) {
        sectorData.frame.location[i] = {};
    }

    if(restoration==1){
        sectorData.frame.location["bodyMax"] = 1;
        sectorData.frame.location["headMax"] = 1;
        sectorData.frame.location["carMax"] = 1;
    }

    createSectorDiv(sectorData);

    $(".modal").removeClass("active")
})

$(document).on("click", ".fixSector", function () {
    const sectorData = {
        'type': 'fix',
        'restoration' : restoration,
        'complete':0,
        'frame' : {
            'start': startFrame,
            'end': endFrame,
            "location": {}
        }
    };

    createSectorDiv(sectorData);

    $(".modal").removeClass("active")
});

$(document).on("click", ".sectorAllDelete", function () {
    sectors = [];
    $('.frameContent').empty();
});

$(document).on('click', '.sectorDelete', function () {
    const sectorIndex = $(this).closest('.sector').index();
    sectors.splice(sectorIndex, 1);
    $(this).closest('.sector').remove();
    rearrangeSectors();
});

$(document).on('click', '.confirmSave', async function () {
    if(document.querySelectorAll(".sector").length==0){
        Swal.fire({
            title: '지정한 구간이 없습니다.',
            icon: 'error',
            allowOutsideClick: false,
            showConfirmButton: false,
            showDenyButton: true,
        })
    }
    else{
        var token = makeid(6);
        let sectorResult = await fileModule.writeSectorToJson(token, requestId, sectors, type, mode, restoration)
        let sectorMessage = await fileModule.sendSectorEncryptMessage(sectorResult['sectorEncReqInfo']);
        if (sectorMessage) {
            Swal.fire({
                title: '구간이 저장되었습니다.',
                showCancelButton: false,
                confirmButtonText: '확인',
                allowOutsideClick: false,
                icon: 'success'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = `/loading?type=${type}&token=${token}&requestID=${requestId}&id=${sectorResult['insertId']}&restoration=${restoration}&mode=${mode}&service=sector`
                }
            })
        }
    }
});

function createSectorDiv(sectorData) {
    sectors.push(sectorData);

    sectors.sort((a, b) => a.frame.start - b.frame.start);

    $('.frameContent').empty();

    sectors.forEach((sector, index) => {
        let sectorDiv = `<div class="sector ${sector.type}" data-class=${sector.type} data-start=${sector.frame.start} data-end=${sector.frame.end}>
                            <div class="textArea">
                                <h2>Sector${(index + 1)}</h2>
                                <p>${sector.frame.start}~${sector.frame.end}</p>
                            </div>
                            <img class="sectorDelete" src="../../static/imgs/check/offDelete.png">
                        </div>`
        $('.frameContent').append(sectorDiv);
    });
}

function rearrangeSectors() {    
    sectors.sort((a, b) => a.frame.start - b.frame.start);

    $('.frameContent').empty();

    sectors.forEach((sector, index) => {
        let sectorDiv = `<div class="sector ${sector.type}" data-class=${sector.type} data-start=${sector.frame.start} data-end=${sector.frame.end}>
                            <div class="textArea">
                                <h2>Sector${(index + 1)}</h2>
                                <p>${sector.frame.start}~${sector.frame.end}</p>
                            </div>
                            <img class="sectorDelete" src="../../static/imgs/check/offDelete.png">
                        </div>`
        $('.frameContent').append(sectorDiv);
    });
}

function isOverlapWithExistingSectors(newSector) {
    for (const sector of sectors) {
      if (
        (newSector >= sector.frame.start && newSector <= sector.frame.end) ||
        (newSector >= sector.frame.start && newSector <= sector.frame.end) ||
        (newSector <= sector.frame.start && newSector >= sector.frame.end)
      ) {
        return true;
      }
    }
    return false;
  }

$(document).on("click", ".playBtn", function () {
    playPause()
});

$(document).on("click", ".leftArrow", function () {
    leftMove()
});

$(document).on("click", ".rightArrow", function () {
    rightMove()
});

document.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowRight') {
        rightMove()
    } else if (event.code === 'ArrowLeft') {
        leftMove()
    } else if (event.code === 'Space') {
        playPause()
    }
});

function playPause() {
    if (isPlaying) {
        video.pause();
        $(".playIcon").addClass("active");
        $(".pauseIcon").removeClass("active");
        const currentTime = video.currentTime;
        const currentFrame = Math.floor(currentTime * FPS) + 1;
        frameSlider.value = currentFrame;
        frameIndicator.textContent = `${currentFrame} / ${frameSlider.max}`;
        video.currentTime = (currentFrame / FPS);
        isSliding = true; // Slider interaction ended
    } else {
        video.play();
        $(".playIcon").removeClass("active");
        $(".pauseIcon").addClass("active");
        isSliding = false; // Slider interaction ended
    }
    isPlaying = !isPlaying;
}

function leftMove() {
    const currentTime = video.currentTime;
    const newTime = currentTime - 1 / FPS;
    const currentFrame = Math.floor(newTime * FPS);
    video.currentTime = newTime;
    frameIndicator.textContent = `${currentFrame} / ${frameSlider.max}`;
}

function rightMove() {
    const currentTime = video.currentTime;
    const newTime = currentTime + 1 / FPS;
    const currentFrame = Math.floor(newTime * FPS);
    video.currentTime = newTime;
    frameIndicator.textContent = `${currentFrame} / ${frameSlider.max}`;
}

function frameRate(frame) {
    FPS = frame
}