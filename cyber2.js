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
    var texCoordLocation = ctx.getAttribLocation(program, "aTxtCoord");
    // 给矩形提供纹理坐标
    var texCoordBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0]), ctx.STATIC_DRAW);
    ctx.enableVertexAttribArray(texCoordLocation);
    ctx.vertexAttribPointer(texCoordLocation, 2, ctx.FLOAT, false, 0, 0);


    const texture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);

    // 设置参数，让我们可以绘制任何尺寸的图像
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);

    // 将图像上传到纹理
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);

    ctx.useProgram(program);

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
        
        void main() {
        // 在纹理上寻找对应颜色值
        gl_FragColor = texture2D(u_image, v_texCoord);
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