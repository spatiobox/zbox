main();
function main() {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('webgl');

    const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;
    const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 0.3);
    }
  `;

    const major = getProgram({ ctx, vsSource, fsSource });

    console.log(typeof ctx.getAttribLocation(major, 'aVertexPosition'), ctx.getAttribLocation(major, 'aVertexPosition'));
    const params = {
        program: major,
        attribLocations: {
            vertexPosition: ctx.getAttribLocation(major, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: ctx.getUniformLocation(major, 'uProjectionMatrix'),
            modelViewMatrix: ctx.getUniformLocation(major, 'uModelViewMatrix'),
        },
    };

    const buffers = initBuffers({ ctx });
    drawScene({ ctx, program: params, buffers });

}

function getProgram({ ctx, vsSource, fsSource }) {

    const vertexShader = getShader({ ctx, type: ctx.VERTEX_SHADER, source: vsSource });
    const fragmentShader = getShader({ ctx, type: ctx.FRAGMENT_SHADER, source: fsSource });


    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        console.log('unable to init the program: ', ctx.getProgramInfoLog(program));
        return null;
    }

    return program;
}


// Set clear color to black, fully opaque
//   ctx.clearColor(0.0, 0.0, 0.0, .1);
//   // Clear the color buffer with specified clear color
// ctx.clear(ctx.COLOR_BUFFER_BIT);
// 

function getShader({ ctx, type, source }) {
    const shader = ctx.createShader(type);
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.log('An error occurred compiling the shaders: ', ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader);
        return null;
    }
    return shader;
}


function initBuffers({ ctx }) {
    const positionBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);

    var vertexs = [
        1.0, 1.0, 1,
        -1.0, 1.0, 1,
        1.0, -1.0, 1,
        -1.0, -1.0, 1
    ];

    ctx.bufferData(ctx.ARRAY_BUFFER,
        new Float32Array(vertexs),
        ctx.STATIC_DRAW);

    return {
        position: positionBuffer,
    };
}


function drawScene({ ctx, program, buffers }) {
    // ctx.clearColor(0.0, 0.0, 0.0, 1);
    ctx.clearDepth(1.0);
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.ALWAYS);//ctx.LEQUAL);

    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);


    const fieldOfView = 45 * Math.PI / 180;
    const aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
    console.log('aspect', aspect);
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    console.log('pj matrix', projectionMatrix);

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    console.log('mv matrix', modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

    {
        const numComponents = 3;
        const type = ctx.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.position);

        ctx.vertexAttribPointer(program.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        console.log('arr', program.attribLocations.vertexPosition);

        ctx.enableVertexAttribArray(program.attribLocations.vertexPosition);
    }

    ctx.useProgram(program.program);

    ctx.uniformMatrix4fv(
        program.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );

    ctx.uniformMatrix4fv(
        program.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );

    {
        const offset = 0;
        const vertexCount = 4;
        ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount);

    }
}