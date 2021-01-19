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

    window.requestAnimationFrame(draw)
}

function loadImg() {
    return new Promise((resolve, reject) => {
        try {

            let img = new Image();
            img.src = 'fuzhou-metro.jpg'; 
            img.onload = function () {
                resolve(img);
            }
        } catch (error) {
            reject();
        }

    })
}

function draw() {
    const box = document.querySelector('#zbox');
    const ctx = box.getContext('2d');
    window.box = box

    ctx.clearRect(0, 0, box.width, box.height);

    loadImg().then(img=>{ 
        console.log('img', img, img.width, img.height, box.width, box.height, box.scrollWidth, box.scrollHeight);  
        ctx.drawImage(img, 0, 0, box.width, box.height)
    })
}


main();