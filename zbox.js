import Ball from './ball.js';

var raf = null;
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var balls = [];


function main() {
    // const box = document.querySelector('#zbox');

    // //init
    // const ctx = box.getContext('webgl');

    // if (!ctx) {
    //     alert('do not support webgl')
    //     return;
    // }

    // ctx.clearColor(0.0, 0.0, 0.0, 0.5);

    // ctx.clear(ctx.COLOR_BUFFER_BIT);

    var t = document.querySelector('time');
    t.innerHTML = new Date();

    // raf = window.requestAnimationFrame(draw);
}

function gen() {
    balls = [];
    var count = Math.trunc(Math.random() * 100);
    for (let index = 0; index < count; index++) {
        const ball = new Ball({ ctx });
        balls.push(ball);
    }
}

function loadImg() {
    return new Promise((resolve, reject) => {
        try {

            let img = new Image();
            img.src = 'fuzhou-metro.jpg';
            img.onload = function () {
                resolve(img);
            };
        } catch (error) {
            reject();
        }

    });
}

function draw() {
    console.log('img', canvas.width, canvas.height, canvas.scrollWidth, canvas.scrollHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // loadImg().then(img => {
    //     console.log('img', img, img.width, img.height, canvas.width, canvas.height, canvas.scrollWidth, canvas.scrollHeight);
    //     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // });
    // clear();

    for (const ball of balls) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
            ball.vy = -ball.vy;
        }
        if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
            ball.vx = -ball.vx;
        }
        ball.draw();
    }


    raf = window.requestAnimationFrame(draw);

}

canvas.addEventListener('click', function (e) {
    console.log('canvas click');
    if (!raf) {
        gen();
        raf = window.requestAnimationFrame(draw);
    } else {
        window.cancelAnimationFrame(raf);
        raf = null;
    }
});

// canvas.addEventListener('mouseout', function (e) {
//     window.cancelAnimationFrame(raf);
//     running = false;
// });


main();
