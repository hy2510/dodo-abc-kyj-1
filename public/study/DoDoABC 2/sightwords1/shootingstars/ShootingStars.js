﻿let quizDataArr;
let exampleArr = [];                    // 보기
let imgArr = [];                        // 이미지
let correctCount = 0;                   // 현재 문제의 번호
let maxCorrectCount = 0;
let wordType = "sight";

//let drake;
const sndCorrect = effectSightWords + "correct_good.mp3";                           // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect_tryagain.mp3";              // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndFallingStar = effectSightWords + "shootingstar.mp3";                       // (09) (1200 ~ 1500) 별 떨어지는 소리
const sndFallingStars = effectSightWords + "falling_stars.mp3";                     // (10) (2000 ~ 3000) 마지막 별똥별 세개 떨어지는 소리
let transImg = 'https://wcfresource.a1edu.com/newsystem/image/transparency.png';

$(document).ready(() => {
    dodomodalStart();
});

const startStudy = () => {
    if (isSafari()) {
        $(".js-speaker").addClass("safari");
    }

    lockScreen(true);
    step = 5;
    quizType = "A";
    currentActivity = "A5A";    // 제일 먼저 세팅해야함.


    focusCurrent(currentActivity);

    const imgArr = [];

    doPreloadImages(imgArr, loadQuiz);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");

    loadQuizData(step, quizType, setData);
    
}

const loadQuiz = () => {
    //loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizDataArr = data;
    quizDataArr = shuffle(quizDataArr);
    maxCorrectCount = quizDataArr.length;
    //console.log(data);
    setupQuiz();
    playBGM(sndBgmA5B);
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    lockScreen(true);

    try {
        quizData = quizDataArr[correctCount];
    
        checkGetDataSuccess();
        checkStudyType();

        isCorrect = true;

        setTimeout(() => {
            setExample();
        }, 500);
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 보기 세팅
const setExample = () => {
    lockScreen(true);
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        exampleArr = [];
        let examples = '';
        let answers = '';
        let fixidx = 0;
        let idx = 0;

        if (quizData.Example1 != quizData.Question) {
            exampleArr[idx++] = quizData.Example1;
        } else {
            fixidx = 1;
        }

        if (quizData.Example2 != quizData.Question) {
            exampleArr[idx++] = quizData.Example2;
        } else {
            fixidx = 2;
        }

        if (quizData.Example3 != '' && quizData.Example3 != quizData.Question) {
            exampleArr[idx++] = quizData.Example3;
        } else {
            fixidx = 3;
        }

        exampleArr = shuffle(exampleArr);

        let exampleli = '';

        for (let i = 0; i < exampleArr.length; i++) {
            exampleli += `<li>${exampleArr[i]}</li>`;
        }

        for (let i = 0; i < quizData.ExampleCount; i++) {
            answers += `<li class="js-answer${i + 1}"></li>`;
        }

        $(".example_box").append(exampleli);
        //$('p').not('p.abc')
        //p 요소 중 abc를 클래스 값으로 가지지 않은 것을 선택합니다.
        
        $('.example_box li').not('.empty').on(
            'click',
            function () {
                lockScreen(true);
                $this = event.currentTarget;
                const index = $(".example_box li").index($this);
                const answer = $(".example_box").children().eq(index).text();
                $(".example_box").children().eq(index).addClass("empty");
                $(".example_box").children().eq(index).off('click');
                setClickEvent(answer);
            }
        );

        $(".answer_box").append(answers);
        $(`.js-answer${fixidx}`).text(quizData.Question);
        $(`.js-answer${fixidx}`).addClass("word");
        $(`.js-answer${fixidx}`).append("<span></span>");

        if (isCorrect == true) {
            $(`.quiz_box li`).html(`<img src="${quizData.Image1}"/>`);
        }

        if (correctCount > 0 && isSafari()) {
            $(".js-speaker").addClass("delay");
            setFocus();
        } else {
            playSound(quizData.Sound1, function () {
                lockScreen(false);
                setFocus();
            });
        }
    }
    catch (e) {
        alert("Set Example Error: " + e);
        doLogout();
    }
}

// 클릭이벤트
const setClickEvent = (pAnswer) => {
    playSound(sndFallingStar, function () {
    });

    if ($('.js-answer1').text() == '') {
        $(".shootingstar1").animate({
            top: "541px",
            left: "84px",
            width: "48px",
            height: "43px"
        }, 1800, function () {
            $('.js-answer1').text(pAnswer);
            $(`.js-answer1`).addClass('word');
            setFocus();
            checkAnswer();
        });
    } else if ($('.js-answer2').html() == '') {
        $(".shootingstar2").animate({
            top: "541px",
            left: "476px",
            width: "48px",
            height: "43px"
        }, 1800, function () {
            $('.js-answer2').text(pAnswer);
            $(`.js-answer2`).addClass('word');
            setFocus();
            checkAnswer();
        });
    } else if ($('.js-answer3').text() == '') {
        $(".shootingstar3").animate({
            top: "541px",
            left: "868px",
            width: "48px",
            height: "43px"
        }, 1800, function () {
            $('.js-answer3').text(pAnswer);
            $(`.js-answer3`).addClass('word');
            setFocus();
            checkAnswer();
        });
    }
}

const checkAnswer = () => {
    lockScreen(false);
    // 문제 3개
    if ($('.js-answer1').text() != '' && $('.js-answer2').text() != '' && $('.js-answer3').text() != '' && quizData.ExampleCount == 3) {
        if ($('.js-answer1').text() == quizData.Example1 && $('.js-answer2').text() == quizData.Example2 && $('.js-answer3').text() == quizData.Example3) {
            isCorrect = true;
        } else {
            isCorrect = false;
        }

        if (isCorrect) {
            correctAction();
        }
        else {
            incorrectAction();
        }
    }

    // 문제 2개
    if ($('.js-answer1').text() != '' && $('.js-answer2').text() != '' && quizData.ExampleCount == 2) {
        if ($('.js-answer1').text() == quizData.Example1 && $('.js-answer2').text() == quizData.Example2) {
            isCorrect = true;
        } else {
            isCorrect = false;
        }

        if (isCorrect) {
            correctAction();
        }
        else {
            incorrectAction();
        }
    }
}

const correctAction = () => {
    lockScreen(true)

    playSound(sndCorrect, function () {
        setInit();
        $(".answer_box").append(`<li class="word" style="width:900px;">${quizData.Example1 + ' ' + quizData.Example2 + ' ' + quizData.Example3}</li>`);
        playSound(quizData.Sound1, function () {
            setTimeout(() => {
                correctCount++;
                if (correctCount < quizDataArr.length) {
                    setInit();
                    setupQuiz();
                } else {
                    playEffect1(sndFallingStars);
                    $('.js-shooting_stars').append(`<img class="js_star shooting_star1" src="./images/shooting_star.png" />
                        <img class="js_star shooting_star2" src="./images/shooting_star.png" />
                        <img class="js_star shooting_star3" src="./images/shooting_star.png" />`);

                    setTimeout(() => {
                        dodomodalFinish();
                    }, 3000);
                }
            }, 1500);
        });
    });
}

const playQuestion = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
};

const incorrectAction = () => {
    lockScreen(true);

    setTimeout(() => {
        playEffect1(sndIncorrectBoing);
    }, 200);

    setTimeout(() => {
        setInit();
        setExample();
    }, 2000);
}

const setInit = () => {
    $(`.answer_box`).html('');
    $(`.example_box`).html('');
    $(`.js-shootingstars`).html('');
    $(`.js-shootingstars`).append(`<img class="js_star shootingstar1" src="./images/word_star.png" /><img class="js_star shootingstar2" src="./images/word_star.png" /><img class="js_star shootingstar3" src="./images/word_star.png" />`);
}

const setFocus = () => {
    for (let i = 1; i <= 3; i++) {
        if ($(`.js-answer${i}`).text() == '') {
            $(`.js-answer${i}`).addClass("focus");
            break;
        } else {
            $(`.js-answer${i}`).removeClass("focus");
        }
    }
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA5B);
    hideNext();
}
