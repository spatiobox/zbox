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
    draw();
}

function gen() {
    balls = [];
    var count = 100;//4500;// Math.trunc(Math.random() * 5220);
    for (let index = 0; index < count; index++) {
        const ball = new Ball({ ctx });
        balls.push(ball);
    }
}

function loadImg() {
    return new Promise((resolve, reject) => {
        try {

            let img = new Image();
            img.src = '/assets/images/huian-3.jpg';//'fuzhou-metro.jpg';
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

    loadImg().then(img => {
        console.log('img', img, img.width, img.height, canvas.width, canvas.height, canvas.scrollWidth, canvas.scrollHeight);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        var pic = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log('image', pic.data);
        var data = pic.data;
        for (var i = 0; i < data.length; i += 4) {
            // TODO 反色
            // data[i] = 255 - data[i];     // red
            // data[i + 1] = 255 - data[i + 1]; // green
            // data[i + 2] = 255 - data[i + 2]; // blue

            // TODO 灰化
            // var t = (data[i] + data[i + 1] + data[i + 2]) / 3;
            // // t = (data[i] * 30 + data[i + 1] * 59 + data[i + 2] * 11 + 50) / 100;
            // // t = (data[i] ** 2.2 * 0.2973 + data[i + 1] ** 2.2 * 0.6274 + data[i + 2] ** 2.2 * 0.0753) ** (1 / 2.2);
            // data[i] = t;
            // data[i + 1] = t;
            // data[i + 2] = t;

            // TODO: 棕褐色
            // var t = (data[i] + data[i + 1] + data[i + 2]) / 3;
            // // t = (data[i] * 30 + data[i + 1] * 59 + data[i + 2] * 11 + 50) / 100;
            // // t = (data[i] ** 2.2 * 0.2973 + data[i + 1] ** 2.2 * 0.6274 + data[i + 2] ** 2.2 * 0.0753) ** (1 / 2.2);
            // data[i] = t;
            // data[i + 1] = t;
            // data[i + 2] = 0;
            
            let r = data[i]
            let g = data[i + 1]
            let b = data[i + 2]
            data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189) // red
            data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168) // green
            data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131) // blue
        }
        ctx.putImageData(pic, 0, 0);
    });
    // clear();
    // for (let i = 0; i < balls.length; i++) {
    //     for (let j = balls.length - 1; j > i; j--) {
    //         let b1 = balls[i];
    //         let b2 = balls[j];
    //         let distance = Math.sqrt((b2.x - b1.x) ** 2 + (b2.y - b1.y) ** 2);
    //         if (distance < b1.radius + b2.radius) {
    //             //碰撞
    //             if (b1.x) b1.xy = b1.y / b1.x;
    //             if (b2.x) b2.xy = b2.y / b2.x;
    //             if (b1.xy === b2.xy) {
    //                 b1.vx = -b1.vx;
    //                 b1.vy = -b1.vy;
    //                 b2.vx = -b2.vx;
    //                 b2.vy = -b2.vy;
    //             } else {
    //                 let vx1 = b1.vx;
    //                 b1.vx = b2.vx;
    //                 b2.vx = vx1;
    //                 let vy1 = b1.vy;
    //                 b1.vy = b2.vy;
    //                 b2.vy = vy1;
    //             }
    //         }
    //     }
    // }

    // for (const ball of balls) {
    //     ball.x += ball.vx;
    //     ball.y += ball.vy;

    //     if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
    //         ball.vy = -ball.vy;
    //     }
    //     if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
    //         ball.vx = -ball.vx;
    //     }
    //     ball.draw();
    // }


    // raf = window.requestAnimationFrame(draw);

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
