import { Fancybox } from '@fancyapps/ui';
import Cookies from 'js-cookie';

import '@fancyapps/ui/src/Fancybox/Fancybox.scss';

import '../scss/main.scss';
import '../index.html';

document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.querySelector('.wrapper');
    const tabs = document.querySelectorAll('.actualTab');
    // const keySubmit = document.querySelector('.key-submit');
    // const keyCross = document.querySelector('.key-cross');
    // const keyInput = document.querySelector('.key-input');
    const timerBtn = document.querySelector('.timer-btn');
    const timerWrapper = document.querySelector('.timer-wrapper');
    const animatedTab = document.querySelector('.animatedTab');
    const next = document.querySelector('.menu-next');
    const prev = document.querySelector('.menu-prev');
    const menuItems = document.querySelectorAll('.menu-item');
    const mainAnimation = document.querySelector('.mainAnimation');

    const timerTime = +wrapper.dataset.timer;

    const algItemsFirst = document.querySelectorAll('.alg-item_first');
    const algItemsSecond = document.querySelectorAll('.alg-item_second');
    const minPercentLow = +wrapper.dataset.minpercentlow;
    const maxPercentLow = +wrapper.dataset.maxpercentlow;
    const minPercentHigh = +wrapper.dataset.minpercenthigh;
    const maxPercentHigh = +wrapper.dataset.maxpercenthigh;
    let cookieThing;

    const percentDesc = document.querySelector('.percent-desc');
    const percent = document.querySelector('.percent')
    const percentText = document.querySelector('.percent-text');
    const percentCircleText = document.querySelector('.percent-circle__text');
    const percentDescSpan = document.querySelector('.percent-desc span');
    const percentButtonText = document.querySelector('.percent-button__text');
    const percentButton = document.querySelector('.percent-button');
    const percentButtonButton = document.querySelector('.percent-button__button');
    const percentLineCircle = document.querySelector('.percent-line__circle');
    const percentLineInner = document.querySelector('.percent-line__inner');

    const mainBtn = document.querySelector('.mainBtn');

    const fancybox = Fancybox.show([
        {
            src: "./wp-content/themes/udnet/img/modal.jpg",
            type: "image",
        },
    ]);

    const checkTabs = (index) => {
        let acceptableIndex = 0;
        authorized = Cookies.get('authorized');

        if (index > acceptableIndex) {
            prev.classList.remove('hidden');
        } else {
            prev.classList.add('hidden');
        }

        if (index >= maxIndex) {
            next.classList.add('hidden');
            maxIndex = index;
        } else {
            next.classList.remove('hidden');
        }

        menuItems.forEach(item => item.classList.remove('active'));
        menuItems[index].classList.add('active');
    }

    Cookies.set('authorized', true, {expires: 1});
    checkTabs(0);

    let key = 0;
    let authorized = Cookies.get('authorized');
    let globalIndex = authorized ? 0 : 0;
    let maxIndex = 1;

    const getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const updateCookie = () => {
        if (!Cookies.get('visit')) {
            Cookies.set('visit', 'first', {expires: 365});
        } else if (Cookies.get('visit') === 'first') {
            Cookies.set('visit', 'second', {expires: 365});
        } else if (Cookies.get('visit') === 'second') {
            Cookies.set('visit', 'third', {expires: 365});
        } else if (Cookies.get('visit') === 'third') {
            Cookies.set('visit', 'random', {expires: 365});
        }
    }

    const updateRandomCookie = () => {
        Cookies.set('randomCookie', getRandomIntInclusive(0, 1), {expires: 1});
    }

    const checkCookie = () => {
        if (Cookies.get('visit') === 'first') {
            cookieThing = false;
        } else if (Cookies.get('visit') === 'second') {
            cookieThing = true;
        } else if (Cookies.get('visit') === 'third') {
            cookieThing = true;
        } else if (Cookies.get('visit') === 'random') {
            if (Cookies.get('randomCookie') == '1') {
                cookieThing = true;
            } else {
                cookieThing = false;
            }
        }
    }

    const generateInfo = () => {
        Cookies.set('fullAuthorised', false, {expires: 1 / 24});
        Cookies.set('halfAuthorised', false, {expires: 1 / 24});
        maxIndex = 1;
        updateRandomCookie();
        updateCookie();
        checkCookie();
        let algFirst = getRandomIntInclusive(0, algItemsFirst.length - 1);
        let algSecond = getRandomIntInclusive(0, algItemsSecond.length - 1);
        Cookies.set('algFirst', algFirst, {expires: 1});
        Cookies.set('algSecond', algSecond, {expires: 1});

        if (cookieThing) {
            Cookies.set('percent', getRandomIntInclusive(minPercentHigh, maxPercentHigh), {expires: 1});
        } else {
            Cookies.set('percent', getRandomIntInclusive(minPercentLow, maxPercentLow), {expires: 1});
        }
    }

    const runningNumbers = () => {
        const time = 2000;
        const step = 1;
        let elem = percentText;
        let num = +Cookies.get('percent');
        let n = 0;
        let t = Math.round(time / (num / step));
        let interval = setInterval(() => {
            n = n + step;
            if (n == num) {
                clearInterval(interval);
                percentDesc.classList.add('fadeUp');
                percentButton.classList.add('fadeUp');
            }
            elem.textContent = n + '%';
            percentLineCircle.style.left = n + '%';
            percentLineInner.style.width = n + '%';
        }, t);
    }

    const fillInfo = () => {
        checkCookie();
        if (!Cookies.get('algFirst')) {
            return;
        }
        if (cookieThing) {
            percent.classList.remove('percent_red');
            percentCircleText.innerHTML = 'Алгоритм <br> найден';
            percentDescSpan.textContent = 'Высокий';
            percentButtonText.classList.add('hidden');
            percentButtonButton.classList.remove('hidden');
        } else {
            percent.classList.add('percent_red');
            percentCircleText.innerHTML = 'Алгоритм <br> не найден';
            percentDescSpan.textContent = 'Низкий';
            percentButtonText.classList.remove('hidden');
            percentButtonButton.classList.add('hidden');
        }

        algItemsFirst.forEach(item => item.classList.remove('active'));
        algItemsSecond.forEach(item => item.classList.remove('active'));

        algItemsFirst[+Cookies.get('algFirst')].classList.add('active', 'fadeUp');
        algItemsSecond[+Cookies.get('algSecond')].classList.add('active', 'fadeUp', 'delay');

        let cookiePercent = Cookies.get('percent');

        percentDesc.classList.add('fadeUp');
        percentButton.classList.add('fadeUp');
        percentText.textContent = cookiePercent + '%';
        percentLineCircle.style.left = cookiePercent + '%';
        percentLineInner.style.width = cookiePercent + '%';
    }

    const updateKey = () => {
        let aj = new XMLHttpRequest();
        aj.open('GET', '/wp-content/themes/udnet/code_generator.txt', true);
        aj.onload = () => {  
            Cookies.set('key', aj.responseText, {expires: 365});
            key = Cookies.get('key');
        }
        aj.send(null);
    }

    updateKey();
    setInterval(() => {
        updateKey();
    }, 2 * 60 * 1000);

    if (document.querySelector('.password')) {
        document.querySelector('.password').textContent = Cookies.get('key');
    }

    const hide = (array) => {
        array.forEach((item) => {
            item.forEach((item) => {
                item.classList.remove('active');
            });
        });
    };

    if (Cookies.get('halfAuthorised') == 'true') {
        maxIndex = tabs.length - 2;
        checkTabs(globalIndex);
    }

    if (Cookies.get('fullAuthorised') == 'true') {
        maxIndex = tabs.length - 1;
        checkTabs(globalIndex);
    }

    const show = (index, array) => {
        if (!array[0][index].classList.contains('active')) {
            hide(array);

            array.forEach((item) => {
                item[index].classList.add('active');
            });
        }
        // if (index === tabs.length - 1) {
        //     wrapper.classList.add('wrapper_light');
        //     mainAnimation.classList.add('hidden');
        // } else {
        //     wrapper.classList.remove('wrapper_light');
        //     mainAnimation.classList.remove('hidden');
        // }
        globalIndex = index;
        checkTabs(index);
    };

    if (!authorized) {
        maxIndex = 0;
        checkTabs(0);
    } else {
        // show(1, [tabs]);
    }

    const animatedTabShow = () => {
        hide([tabs]);
        animatedTab.classList.add('active');
    }

    const animatedTabKill = () => {
        animatedTab.classList.remove('active');
    }

    const getTimeRemaining = (endtime) => {
        const t = Date.parse(endtime) - Date.parse(new Date());
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    };

    const initializeClock = (id, endtime) => {
        const clock = document.getElementById(id);
        const minutesSpan = clock.querySelector('.timer-minutes');
        const secondsSpan = clock.querySelector('.timer-seconds');

        const updateClock = () => {
            const t = getTimeRemaining(endtime);
            Cookies.set('timer', endtime, {expires: 365});

            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                clearInterval(timeinterval);
                Cookies.remove('timer');
                timerBtn.classList.remove('inactive');
                timerWrapper.classList.add('hidden');
            }
        };

        updateClock();
        const timeinterval = setInterval(updateClock, 1000);
    };

    if (Cookies.get('timer')) {
        fillInfo();
        timerBtn.classList.add('inactive');
        timerWrapper.classList.remove('hidden');
        initializeClock('timer', Cookies.get('timer'));
    } else {
        fillInfo();
    }

    prev.addEventListener('click', () => {
        show(--globalIndex, [tabs]);
    });

    next.addEventListener('click', () => {
        show(++globalIndex, [tabs]);
    });

    // keyInput.addEventListener('input', () => {
    //     if (keyInput.value === key) {
    //         keySubmit.classList.remove('hidden');
    //         keyCross.classList.add('hidden');
    //         Cookies.set('authorized', true, {expires: 1 / 12});
    //         setTimeout(() => {
    //             show(1, [tabs]);
    //         }, 1500);
    //     } else {
    //         keySubmit.classList.add('hidden');
    //         keyCross.classList.remove('hidden');
    //     }
    // });

    mainBtn.addEventListener('click', () => {
        show(1, [tabs]);
    });

    timerBtn.addEventListener('click', () => {
        const deadline = new Date(Date.parse(new Date()) + timerTime);
        Cookies.set('timer', deadline, {expires: 365});
        generateInfo();
        fillInfo();
        checkTabs(1);
        timerBtn.classList.add('inactive');
        timerWrapper.classList.remove('hidden');
        initializeClock('timer', deadline);
        setTimeout(() => {
            animatedTabShow();
        }, 1500);
        setTimeout(() => {
            animatedTabKill();
            show(2, [tabs]);
            runningNumbers();
            Cookies.set('halfAuthorised', true, {expires: 1 / 24});
        }, 8500);
    });

    percentButtonButton.addEventListener('click', () => {
        Cookies.set('fullAuthorised', true, {expires: 1 / 24});
        maxIndex = tabs.length - 1;
        show(3, [tabs]);
    });
});
