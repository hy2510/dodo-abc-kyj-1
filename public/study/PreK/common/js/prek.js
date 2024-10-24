var ua, event, _snd;;
let isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
var isIOS = false;
var _round;
var _studyId;
var _usermode = 1;
var _pNum;
var _gvStudyId;
let homepageUrl;
let duplicateInterval;

let studySessionId = "";
var gvLanguage = "KOR"

/*
// 뒤로가기 방지
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
    //this.handleGoback();
};
window.history.forward(0);
*/

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}



function freeze() {
    if ($("html").css("position") != "fixed") {
        var top = $("html").scrollTop() ? $("html").scrollTop() : $("body").scrollTop();
        if (window.innerWidth > $("html").width()) {
            $("html").css("overflow-y", "scroll");
        }
        $("html").css({ "width": "100%", "height": "100%", "position": "fixed", "top": -top });
    }
}

freeze();


$(document).ready(function () {
    ua = navigator.userAgent, event;
    event = (ua.match(/iPad/i)) ? "touchstart" : "click";
});

/* 화면초기화, 좌표 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */


function goToLogOut() {
    wsBRPK.GetCustomerUrl(onSuccLogOut, onFail);
}

function onSuccLogOut(p1, p2) {
    goLogOut(p1);
}

function onFail(p1, p2) {
    alert(p1);
}

function getArgs() {
    const apiStudyInfoString = sessionStorage.getItem("apiStudyInfo");
    const apiStudyInfo = JSON.parse(apiStudyInfoString)
    _pNum = apiStudyInfo.arg1
    _usermode = apiStudyInfo.arg2
    if (_usermode === "3") {
        _gvStudyId = "teacher123";
    } else {
        _gvStudyId = apiStudyInfo.arg3
    }
    if (_usermode === '3' || _usermode === '2') {
        $('#divBtn').css('display', 'block');
        _gvStudyId = "teacher123";
    } else {
        //_gvStudyId = getUrlParameter('arg3').toString().toLowerCase();
        //_gvStudyId = obj.study_id;
    }
}

function deprecated_getArgs() {
    //if (!isEmpty(getUrlParameter('arg1')) && !isEmpty(getUrlParameter('arg2')) && !isEmpty(getUrlParameter('arg3'))) {
    if (!isEmpty(getUrlParameter('arg1')) && !isEmpty(getUrlParameter('arg2'))) {
        
        _pNum = getUrlParameter('arg1').toString().toLowerCase();
        _usermode = getUrlParameter('arg2').toString().toLowerCase();
        
        if (_usermode == 3) {
            _gvStudyId = "teacher123";
        } else {
            _gvStudyId = getUrlParameter('arg3').toString().toLowerCase();
        }
    } else {
        var pkeStudyInfo;
        
        //pkeStudyInfo = sessionStorage.getItem("pkeStudyInfo");
        //pkeStudyInfo = sslStudyInfo;    

        //pkeStudyInfo = decodeURIComponent(sslStudyInfo);
        pkeStudyInfo = sslStudyInfo;    

        if (pkeStudyInfo == "") {
            alert("ERROR 01");
        } else {

            var obj = $.parseJSON(pkeStudyInfo);

            _pNum = obj.round;
            _usermode = obj.mode;        
            _gvStudyId = obj.study_id;
            homepageUrl = obj.url;
        }

    }

    if (_usermode == 3 || _usermode == 2) {
        $('#divBtn').css('display', 'block');
        _gvStudyId = "teacher123";
    } else {
        //_gvStudyId = getUrlParameter('arg3').toString().toLowerCase();
        //_gvStudyId = obj.study_id;
    }

    //wsBRPK.GetStudyInfo(onGetStudyInfo, onFail);
    
}

function onGetStudyInfo(p1) {
    if (p1 != '') {
        var obj = JSON.parse(p1);

        if (obj[0].StatusCode == '025008' && _usermode == 1) {
            _usermode = 2;
        }
    }
}

// 접속 디바이스 구별 함수 (https://cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.4.5/mobile-detect.min.js)
const md = new MobileDetect(window.navigator.userAgent);
const isAndroid = md.os() === 'AndroidOS';
const isIos = md.os() === 'iOS' || 'iPadOS';

// 화면 사이즈를 변경하기 위한 변수
let targetLayout = "divFrame";

function scaleElementPC() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const isTouchScreen = () => {
        return navigator.maxTouchPoints > 0;
    }

    let portraitScale = width / 1280;
    let landscapeScale = height / 720;

    if (window.matchMedia("(orientation: landscape)").matches) {
        document.getElementById(targetLayout).style.transform =
        `scale(${isTouchScreen() ?  portraitScale :landscapeScale})`;
    } else {
        document.getElementById(targetLayout).style.transform =
        `scale(${isTouchScreen() ? portraitScale :landscapeScale})`;
    }
}

function scaleElementMobile() {
    const width = window.innerWidth;
    const height = window.innerHeight;  

    let portraitScale = width / 1280;
    let landscapeScale = height / 720;

    if (window.matchMedia("(orientation: landscape)").matches) {
        document.getElementById(targetLayout).style.transform =
        `scale(${landscapeScale})`;
    } else {
        document.getElementById(targetLayout).style.transform =
        `scale(${portraitScale})`;
    }
}

function checkMobile() {
    if (!md.is('iPhone')) {
        if (window.matchMedia("(orientation: landscape)").matches) {
            return screen.height < 600
        } 
        if (window.matchMedia("(orientation: portrait)").matches) {
            return screen.width < 600
        }
    } else {
        return true;
    }
}

window.addEventListener('DOMContentLoaded', checkMobile() ? scaleElementMobile : scaleElementPC);
window.addEventListener('resize', checkMobile() ? scaleElementMobile : scaleElementPC);

// 태블릿에서 스크롤되지 않도록
addEventListener('touchmove', function (e) {
    if (!$(e.target).hasClass("scrollable")) {
        e.preventDefault();
    }
});

//(function ($) {
//    $.fn.nodoubletapzoom = function () {
//        $(this).bind('touchstart', function preventZoom(e) {
//            var t2 = e.timeStamp
//              , t1 = $(this).data('lastTouch') || t2
//              , dt = t2 - t1
//              , fingers = e.originalEvent.touches.length;
//            $(this).data('lastTouch', t2);
//            if (!dt || dt > 500 || fingers > 1) return; // not double-tap

//            e.preventDefault(); // double tap - prevent the zoom
//            // also synthesize click events we just swallowed up
//            $(this).trigger('click').trigger('click');
//        });
//    };
//})(jQuery);
/* 화면초기화, 좌표 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */


/* Audio, 오디오 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */
var Sound = function (pObj, pFunStartPlay, pFunEndPlay) {
    this.isplay = false;
    this.infinity = false;

    try {
        if (pObj != undefined) {
            this.audAtt = pObj;
            this.StartFun = pFunStartPlay;
            this.EndFun = pFunStartPlay;
            this.repeat = audAtt.repeat;
            this.audio = new Audio(audAtt.src);
            if (repeat < 0) {
                alert('repeat must be bigger than 0');
                return undefined;
            } else if (this.repeat == 0) {
                this.infinity = true;
            }

            this.Play = function () {
                //audio.loop = true;

                audio.addEventListener('ended', function () {
                    repeat -= 1;

                    if (repeat > 0 || infinity) {
                        audio.play();
                    } else {
                        // Stop Sound
                        isplay = false;
                        if (pFunEndPlay != undefined) {
                            pFunEndPlay();
                        }
                    }
                });

                audio.addEventListener('timeupdate', function () {
                    if (isplay == false) {
                        // Play Sound
                        isplay = true;

                        if (pFunStartPlay != undefined) {
                            pFunStartPlay();
                        }
                    }
                });

                //sunnyfantest
                audio.play();
            }

            this.Stop = function () {
                audio.setAttribute('src', '');
                audio.addEventListener('timeupdate', null);

                audio.pause();
                if (audio.duration) {
                    audio.currentTime = 0;
                }

                isplay = false;
            }

            this.Pause = function () {
                alert('Pause');
            }
        }
    } catch (e) {
        alert(e);
    }

    return this;
};

function playSound(pStr, pFunEndPlay) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    var audio = $("#player");
    var sndAddr = "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pStr + ".mp3";
    audio.attr('src', sndAddr);
    audio[0].pause();
    audio[0].load();
    audio[0].play();
    return false;
}

function playLetter(pLetter, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/words/" + pLetter + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function playPhonetic(pLetter, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pLetter + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function playWord(pWord, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pWord + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function playWord2(pWord, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/Words/" + pWord + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayFinish(pEndFun) {
    //if (_bgm != undefined && _bgm != NaN) {
    //    _bgm.Stop();
    //}

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/finish.mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayGoodJob(pEndFun) {
    //if (_bgm != undefined && _bgm != NaN) {
    //    _bgm.Stop();
    //}

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/GoodJob.mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayStart(pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/start.mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    $('#imgStart').attr('src', '../common/img/start_d.png');

    _snd.Play();
}

var arrCorrect = ['correct1.mp3', 'correct2.mp3', 'correct3.mp3', 'correct4.mp3', 'correct5.mp3', 'correct6.mp3'];
function playCorrectDrag(pStartFun, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    var randomValue = arrCorrect[Math.floor(arrCorrect.length * Math.random())];

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/" + randomValue,
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    if (isMobile == true) {
        if (pEndFun != undefined && pEndFun != NaN) {
            setTimeout(pEndFun, 1000);
        }
    } else {
        _snd.Play();
    }
}

function playCorrect(pStartFun, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    var randomValue = arrCorrect[Math.floor(arrCorrect.length * Math.random())];

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/" + randomValue,
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    _snd.Play();
}

function playTryAgainDrag(pStartFun, pEndFun) {
    UnLockScreen();

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/tryagain.mp3",
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    if (isMobile == true) {
        if (pEndFun != undefined && pEndFun != NaN) {
            setTimeout(pEndFun, 1000);
        }
    } else {
        _snd.Play();
    }
}

function playTryAgain(pStartFun, pEndFun) {
    UnLockScreen();

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/tryagain.mp3",
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    _snd.Play();
}

/* Audio, 오디오 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */


/* Animation, 애니메이션 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */
var Animation = function AnimationDraw(pObj) {
    this.isplay = false;
    this.cartoon;
    this.ani;
    this.infinity = false;
    this.repeatCount = 0;

    try {
        if (pObj != undefined) {
            this.zindex = pObj.zindex;
            this.image = pObj.image;
            this.imgW = pObj.imgW;
            this.imgH = pObj.imgH;
            this.aniW = pObj.aniW;
            this.aniH = pObj.aniH;
            this.cx = pObj.left;
            this.cy = pObj.top;
            this.frame = pObj.frame;
            this.msec = pObj.msec;
            this.endfn = pObj.completed;
            this.container = pObj.container;
            this.repeat = pObj.repeat;
            this.onclick = pObj.onclick;
            this.tm = 0;

            if (this.frame == undefined) {
                alert('"frame" must be defined!');
                return undefined;
            }

            if (this.container == undefined) {
                alert('"container" must be defined!');
                return undefined;
            }

            if (this.repeat < 0) {
                alert('"repeat" must be bigger than 0');
                return undefined;
            } else if (this.repeat == 0) {
                this.infinity = true;
            } else {
                this.repeatCount = this.repeat;
            }

            // 컨테이너 생성
            //this.cartoon = $('<div class="cartoon" onclick="' + this.onclick + '" onmousedown="' + this.onclick + '"></div>').css({
            //this.cartoon = $('<div class="cartoon" onclick="' + this.clickfname + '"></div>').css({
            this.cartoon = $('<div class="cartoon">').css({
                width: this.aniW,
                height: this.aniH,
                left: this.cx,
                top: this.cy,
                position: 'absolute',
                overflow: 'hidden',
                zindex: 12,
                click: this.click
            }).appendTo($("#" + this.container)).click((this.onclick!=undefined) ? this.onclick : function () {});

            //this.cartoon.click(this.clickfname);

            // 애니메이션 이미지 컨테이너에 추가 추가
            this.ani = $('<img class="ani" src="' + this.image + '"/>').css({
                width: this.aniW,
                height: this.frame * this.aniH
            }).data('count', this.frame).appendTo(this.cartoon);

            this.Play = function (pObj) {
                (function animate() {
                    var count = pObj.ani.data('count');

                    if (count) {
                        var nth = pObj.frame - count;
                        var height = pObj.aniH;//this.ani.height() / this.frame;
                        pObj.ani.css({
                            'top': -(nth * height),
                            'position': 'absolute'
                        });

                        pObj.cartoon.css({
                            'height': height
                        })

                        pObj.ani.data("count", count - 1);

                        this.tm = setTimeout(animate, pObj.msec);
                    } else {
                        pObj.repeat -= 1;

                        if (pObj.infinity == true || pObj.repeat > 0) {
                            pObj.ani.data("count", pObj.frame);
                            this.tm = setTimeout(animate, 0);
                        } else {
                            if (pObj.endfn != undefined) {
                                (pObj.endfn)();
                            }
                        }
                    }
                })();
            }

            this.Stop = function (pObj) {
                // 타이머값이 고유하게 저장되지 않네... 음...
                //if (pObj.tm != undefined) {
                //    clearTimeout(pObj.tm);
                //}
                
                //this.infinity = false;
            }

            this.Replay = function (pInit) {
                if (pInit == true) {
                    this.repeat = this.repeatCount;
                    this.ani.data("count", this.frame);
                }

                this.cartoon.parent('.cartoon').remove();
                (this.Play)(this);
            }

            this.Show = function () {
                $('.cartoon').css('display', 'block');
            }

            this.Hide = function () {
                $('.cartoon').css('display', 'none');
            }

            this.Dispose = function () {
                //this.ani.parent().remove();
                if (this.tm != undefined) {
                    clearTimeout(this.tm);
                }

                this.cartoon.parent('.cartoon').remove();
            }

            this.Scale = function (pScale) {
                this.cartoon.css({
                    '-webkit-transform': 'scale(' + pScale + ')',
                    '-moz-transform': 'scale(' + pScale + ')',
                    '-ms-transform': 'scale(' + pScale + ')',
                    '-o-transform': 'scale(' + pScale + ')',
                    'transform': 'scale(' + pScale + ')'
                });
            }

        } else {
            return undefined;
        }
    } catch(e) {

    }

    return this;
}
/* Animation, 애니메이션 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */


/* Text Slide, 애니메이션 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */
var TextSlide = function(pObj) {
    this.isplay = false;
    this.cartoon;
    this.ani;
    this.infinity = false;
    this.repeatCount = 0;

    try {
        if (pObj != undefined) {
            this.zindex = pObj.zindex;
            this.divW = pObj.divW;
            this.divH = pObj.divH;
            this.txtW = pObj.txtW;
            this.txtH = pObj.txtH;
            this.speed = pObj.speed;
            this.value = pObj.value;
            this.cx = pObj.left;
            this.cy = pObj.top;
            this.msec = pObj.msec;
            this.endfn = pObj.completed;
            this.container = pObj.container;
            this.repeat = pObj.repeat;
            this.onclick = pObj.onclick;
            this.tm = 0;

            if (this.container == undefined) {
                alert('"container" must be defined!');
                return undefined;
            }

            if (this.repeat < 0) {
                alert('"repeat" must be bigger than 0');
                return undefined;
            } else if (this.repeat == 0) {
                this.infinity = true;
            } else {
                this.repeatCount = this.repeat;
            }

            // 컨테이너 생성
            this.cartoon = $('<div class="cartoon">').css({
                width: this.divW,
                height: this.divH,
                left: this.cx,
                top: this.cy,
                position: 'absolute',
                overflow: 'hidden',
                zindex: 12,
                click: this.click
            }).appendTo($("#" + this.container)).click((this.onclick != undefined) ? this.onclick : function () { });

            // input을 컨테이너에 추가 추가
            this.inp = $('<input class="textInput" value="' + this.value + '"/>').css({
                'width': this.txtW,
                'height': this.txtH,
                'left': this.divW,
                'font-size': 'xx-large',
                'color': 'white',
                'text-align': 'center',
                'border-width': '0px',
                'background': 'rgba(0, 0, 0, 0)'
            }).appendTo(this.cartoon);

            var cnt = 0;
            var wth = this.txtW;
            var spd = this.speed;
            var ini = this.divW;

            this.Slide = function (pObj) {
                (function txtSlide() {
                    if (cnt < wth) {
                        pObj.inp.css({
                            'left': -(cnt += spd),
                            'position': 'absolute'
                        });

                        this.tm = setTimeout(txtSlide, pObj.msec);
                    } else {
                        cnt = -ini;
                        this.tm = setTimeout(txtSlide, pObj.msec);
                        //pObj.repeat -= 1;

                        //if (pObj.infinity == true || pObj.repeat > 0) {
                        //    this.tm = setTimeout(txtSlide, 0);
                        //} else {
                        //    if (pObj.endfn != undefined) {
                        //        (pObj.endfn)();
                        //    }
                        //}
                    }
                })();
            }

            this.Stop = function () {
                // 타이머값이 고유하게 저장되지 않네... 음...
                //if (pObj.tm != undefined) {
                //    clearTimeout(this.tm);
                //}

                this.infinity = false;
            }

            this.Dispose = function () {
                //this.ani.parent().remove();
                if (this.tm != undefined) {
                    clearTimeout(this.tm);
                }

                this.cartoon.parent('.cartoon').remove();
            }
        } else {
            return undefined;
        }
    } catch (e) {

    }

    return this;
}
/* Text Slide, 애니메이션 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */

function goStep(pUrl) {
    $('body').fadeOut(300);
    setTimeout(function () { window.location.replace(pUrl); }, 300);
    return false;
}

function goIndex() {
    onExitStudy()
}

function goHome(pUrl) {
    return false;
}

// Home 으로 이동 추가 시작 - 16-08-05 박현기
function goToHome() {
    onExitStudy()
}

function onSuccGoHome(p1, p2) {
    //goHome(p1);
}

function onFail() {
}
// Home 으로 이동 추가 끝 - 16-08-05 박현기

function goLogOut(pUrl) {
    onExitStudy()
    return false;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    let pValue = '';
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            pValue = sParameterName[1];
            if( pValue){
                break;
            }
        }
    }
    if(!pValue) {
        return '';
    }
    return pValue;
}

// studyid 비교, wsBRPK.GetCrntStudyID(onSuccGetCrntStudyID, onFail); 호출 후 발생
function onSuccGetCrntStudyID(p1, p2, p3) {
    if (p1.toLowerCase() != _gvStudyId.toLowerCase()) {
        alert('another login detected');
        goToHome();
    }
}

var _bgm;
//function PlayLandBGM(pLand) {
//    var sndSrc;
//    var urlLand;

//    if (pLand == "ALPHABET") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/bgm_alphabetland.mp3"
//    } else if (pLand == "SOUND") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "SONG") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "WORD") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/bgm_wordland.mp3"
//    } else if (pLand == "PHONICS") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/bgm_phonicsland.mp3"
//    }

//    if (_bgm != undefined && _bgm != NaN) {
//        _bgm.Stop();
//    }

//    _bgm = Sound({
//        src: sndSrc,
//        repeat: 0
//    },
//        undefined,
//        undefined
//    );

//    _bgm.Play();
//}

//function PlayLandBGM(pLand) {
//    if (pLand == "ALPHABET") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/bgm_alphabetland_.mp3"
//    } else if (pLand == "SOUND") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "SONG") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "WORD") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/bgm_wordland.mp3"
//    } else if (pLand == "PHONICS") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/bgm_phonicsland.mp3"
//    }

//    var audio = new Audio();
//    audio.volume = 0.25;
//    audio.setAttribute('src', sndSrc);

//    audio.addEventListener('ended', function () {
//        audio.play();
//    });

//    audio.play();
//}

function PlayLandBGM(pLand) {
    if (pLand == "ALPHABET") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/bgm_alphabetland_.mp3"
    } else if (pLand == "SOUND") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
    } else if (pLand == "SONG") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
    } else if (pLand == "WORD") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/bgm_wordland.mp3"
    } else if (pLand == "PHONICS") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/bgm_phonicsland.mp3"
    }

    if (_bgm != undefined && _bgm != NaN) {
        _bgm.pause();
    }

    _bgm = new Audio();
    _bgm.volume = 0.25;
    _bgm.setAttribute('src', sndSrc);

    _bgm.addEventListener('ended', function () {
        _bgm.play();
    });

    _bgm.play();
}

function PlayLandMain(pLand) {
    if (pLand == "ALPHABET") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/AL-Main.mp3"
    } else if (pLand == "SOUND") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SoundLand/SL-Main.mp3"
    } else if (pLand == "SONG") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/SL-Main.mp3"
    } else if (pLand == "WORD") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/WL-Main.mp3"
    } else if (pLand == "PHONICS") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/PL-Main.mp3"
    }

    if (_bgm != undefined && _bgm != NaN) {
        _bgm.pause();
    }

    _bgm = new Audio();
    _bgm.volume = 0.25;
    _bgm.setAttribute('src', sndSrc);

    _bgm.addEventListener('ended', function () {
        _bgm.addEventListener('ended', undefined);
        PlayLandBGM(pLand);
        //_bgm.play();
    });

    _bgm.play();
}

function StopLandBGM() {
    if (_bgm != undefined && _bgm != NaN) {
        _bgm.pause();
    }
    //_bgm.Dispose();
}

function PlayDirection(pLand, pDirection, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/" + pLand + "/" + pDirection,
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

// 7차용 지시문 음원 재생 함수 추가 - 2024-08-09 박현기
function PlayDirection7th(pLand, pDirection, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/7th/" + pDirection,
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayEffect(pEffect, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/" + pEffect,
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function showClick() {
    $('#imgClick').css('display', 'block');
    setTimeout(function () { $('#imgClick').css('display', 'none') }, 300);
    setTimeout(function () { $('#imgClick').css('display', 'block') }, 600);
    setTimeout(function () { $('#imgClick').css('display', 'none') }, 900);
    setTimeout(function () { $('#imgClick').css('display', 'block') }, 1200);
    setTimeout(function () { $('#imgClick').css('display', 'none') }, 1500);
}

function showClick2() {
    $('#imgClick').addClass('clickMove');
    $('#imgClick').css('display', 'block');
}


function hideClick() {
    $('#imgClick').css('display', 'none');
}

function showDragUp() {
    $('#divDrag').css('display', 'block');
    $('#imgDragF1').animate({ 'left': '+=60px', 'top': '-=150px' }, { 'duration': 1200 }, { 'easing': 'linear' });
    setTimeout(function () {
        $('#imgDragF1').animate({ 'left': '-=60px', 'top': '+=150px' }, { 'duration': 50 }, { 'easing': 'linear' });
        $('#imgDragF1').animate({'left': '+=60px', 'top': '-=150px'}, { 'duration': 1200 }, { 'easing': 'linear' });
    }, 1300);
}

function showDragDn() {
    $('#divDrag').css('display', 'block');
    $('#imgDragF2').animate({ 'left': '+=60px', 'top': '+=150px' }, { 'duration': 1200 }, { 'easing': 'linear' });
    setTimeout(function () {
        $('#imgDragF2').animate({ 'left': '-=60px', 'top': '-=150px' }, { 'duration': 50 }, { 'easing': 'linear' });
        $('#imgDragF2').animate({ 'left': '+=60px', 'top': '+=150px' }, { 'duration': 1200 }, { 'easing': 'linear' });
    }, 1300);
}

function hideDrag() {
    $('#divDrag').css('display', 'none');
}

/* Tools */
function isAlpha(pStr) {
    var chkString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (i = 0; i < pStr.length; i++) {
        if (chkString.indexOf(pStr.substring(i, i + 1)) == -1)
            return false;
    }

    return true;
}

function setScale(pObj, pScale) {
    pObj.css('transform', 'scale(' + pScale + ')');
}

function ChoiceShuffle(pArr) {
    var currentIndex = pArr.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = pArr[currentIndex];
        pArr[currentIndex] = pArr[randomIndex];
        pArr[randomIndex] = temporaryValue;
    }

    return pArr;
}

function LockScreen() {
    $('#divLock').css('display', 'block');
}

function UnLockScreen() {
    $('#divLock').css('display', 'none');
}

function ShowNextQzBtn() {
    $('#divSpeaker').css('display', 'block');
    LockScreen();
}

function HideNextQzBtn() {
    $('#divSpeaker').css('display', 'none');
}

function hello() {
    alert('hello');
}

function getBrowserInfo() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

function IE10Under() {
    var retn = false;
    var ieInfo = getBrowserInfo();

    if ((ieInfo.name == 'IE' || ieInfo.name == 'MSIE') && (ieInfo.version == '10' || ieInfo.version == '9' || ieInfo.version == '8' || ieInfo.version == '7')) {
        retn = true;
    }

    return retn;
}
/*************************************************************/

// Alphabet Land Step 체크하여 바로가기 추가 - 16-04-29 박현기
function fnc_chkAlphabetLandStep() {
    var vScoreStep1 = document.getElementById("txtScoreStep1").value;
    var vScoreStep2 = document.getElementById("txtScoreStep2").value;
    var vScoreStep3 = document.getElementById("txtScoreStep3").value;

    if (_usermode == 1) {
        if (vScoreStep2 == "100") {
            goStep('step3p.html?arg1=' + getParam("arg1") + '&arg2=' + getParam("arg2") + '&arg3=' + getParam("arg3"));
            return false;
        } else if (vScoreStep1 == "100") {
            // Step2 Activity로 이동
            //alert("Step2(으)로 이동합니다.");

            if (GetOrder(_alphabet) % 2 == 1) {
                goStep('step2a.html?arg1=' + getParam("arg1") + '&arg2=' + getParam("arg2") + '&arg3=' + getParam("arg3"));
            } else {
                goStep('step2b.html?arg1=' + _pNum + '&arg2=' + _usermode + '&arg3=' + _gvStudyId);
            }

            return false;
        }
    }
}

var isEmpty = function (value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true;
    } else {
        return false;
    }
};

// StudyInfo
function fncGetStudyInfo() {
    alert("fncGetStudyInfo()");
}

// REF.StudyId 와 _gvStudyId 비교
function fncCheckStudyId() {
    var sessionStorageApiStudyInfo = sessionStorage.getItem("apiStudyInfo");

    //var obj = $.parseJSON(sessionStorageApiStudyInfo);
    var obj = JSON.parse(sessionStorageApiStudyInfo);
    var gvStorageStudyInfo = new Array();

    gvStorageStudyInfo.StudyId = obj.StudyId;

    var _usermode = getUrlParameter('arg2').toString().toLowerCase();
    var _gvStudyId = getUrlParameter('arg3').toString().toLowerCase();

    if (_usermode == "1") {
        if (gvStorageStudyInfo.StudyId.toLowerCase() != _gvStudyId.toLowerCase()) {
            alert('Another study detected!');
            //goToHome();
        } else {
            //alert("StudyId OK !");
        }
    }
}