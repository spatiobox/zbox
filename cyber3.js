import GLCyber from './gl-cyber.js';


async function main() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('webgl');
    const cyber = new GLCyber({ context: ctx });

    // ctx.

    // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    var image = await loadImage();
    console.log('img', image);
    // ctx.drawImage(data, 0, 0, canvas.clientWidth, canvas.clientHeight);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // loadImage().then(img => {
    //     console.log('img', img);
    //     ctx.drawImage(img, 0, 0); 
    // });
    var vShader = cyber.createShader({ source: getVertexSource(), type: ctx.VERTEX_SHADER });
    var fShader = cyber.createShader({ source: getFragmentSource(), type: ctx.FRAGMENT_SHADER });
    var program = cyber.createProgram({ vertexShader: vShader, fragmentShader: fShader });
    ctx.useProgram(program);

    ctx.clearDepth(1.0);
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.ALWAYS);//ctx.LEQUAL);

    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

    // 找到纹理的地址
    var texCoordLocation = ctx.getAttribLocation(program, "aVertexPosition");
    var colorUniformLocation = ctx.getUniformLocation(program, "color");


    function setRectangle({ x, y, width, height }) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;

        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x2, y2,
            x2, y1,
            x2, y2
        ]), ctx.STATIC_DRAW);
    }

    // 给矩形提供纹理坐标
    var texCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
    const r = 1;
    let sec2 = [];
    let sec3 = [];
    let sec4 = [];
    let positions = Array.from(new Array(100), (x, i) => i / 100).reduce((p, c) => {
        let y = Math.sqrt(r ** 2 - c ** 2) /2;
        let x = c /2 * canvas.height / canvas.width;
        p.push(x, y);
        sec2.unshift(-x, y);
        sec3.push(-x, -y);
        sec4.unshift(x, -y);
        return p;
    }, []);
    positions = [...positions, ...sec4, ...sec3, ...sec2];
    // positions = [...positions, ...sec3, ...sec2, ...sec4]
    // positions.unshift(0);
    // positions.unshift(0);
    console.log('pos', positions);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(positions), ctx.STATIC_DRAW);
    ctx.enableVertexAttribArray(texCoordLocation);
    ctx.vertexAttribPointer(texCoordLocation, 2, ctx.FLOAT, false, 0, 0);


    // const texture = ctx.createTexture();
    // ctx.bindTexture(ctx.TEXTURE_2D, texture);

    // // 设置参数，让我们可以绘制任何尺寸的图像
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);

    // // 将图像上传到纹理
    // ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);

    ctx.useProgram(program);

    // Array.from(new Array(50), (x, i) => i).forEach(x => {
    //     setRectangle({ x: Math.random()*255, y: Math.random()*255, width: Math.random()*255, height: Math.random()*255 });
    //     ctx.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    //     ctx.drawArrays(ctx.TRIANGLES, 0, 6)
    // });
    ctx.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), Math.random()/3);
    ctx.drawArrays(ctx.LINE_LOOP, 0, 400);


}

function loadImage() {
    return new Promise((resolve, reject) => {
        try {
            /** @type { HTMLImageElement } */
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.src = "/assets/images/cyberpunk.jpg";
        } catch (error) {
            reject(error);
        }
    });
}

function getFragmentSource() {
    return `
        precision mediump float;
    
        // 纹理
        uniform sampler2D u_image;
        
        // 从顶点着色器传入的纹理坐标
        varying vec2 v_texCoord;

        
        uniform vec4 color;
        
        void main() {
            // 在纹理上寻找对应颜色值
            //gl_FragColor = texture2D(u_image, v_texCoord);
             gl_FragColor = color;

        }
    `;
}

function getVertexSource() {
    return `
        attribute vec4 aVertexPosition;
        // attribute vec4 aTxtCoord;

        void main() {
            gl_Position = aVertexPosition;
            // gl_TexCoord = aTxtCoord;
        }
    `;
}


main();