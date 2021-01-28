
export default class GLCyber {
    /** @type {WebGLRenderingContext} */
    ctx = null;

    /**
     * 
     * @param {Object} param0 
     * @param {!WebGLRenderingContext} param0.context - webgl.ctx 上下文
     */
    constructor({ context }) {
        this.ctx = context;
    }

    /**
     * 创建并编译一个着色器
     * 
     * @param {Object} param0  
     * @param {string} param0.source - GLSL 格式的着色器代码
     * @param {number} param0.type - 着色器类型: VERTEX_SHADER | FRAGMENT_SHADER
     * @return {!WebGLShader} 着色器
     */
    createShader({ source, type }) {
        // 创建
        const shader = this.ctx.createShader(type);

        // 设定着色器源码
        this.ctx.shaderSource(shader, source);

        // 编译着色器
        this.ctx.compileShader(shader);

        // 检查编译状态
        let success = this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS);
        if (!success) {
            // 编译过程出错，获取错误信息。
            throw "🙂 Error: could not compile shader:" + this.ctx.getShaderInfoLog(shader);
        }

        return shader;
    }

    /**
     * 从 2 个着色器中创建一个程序
     * 
     * @param {Object} param0  
     * @param {!WebGLShader} param0.vertexShader - 顶点着色器
     * @param {!WebGLShader} param0.fragmentShader - 片段着色器
     * @returns {!WebGLProgram}
     */
    createProgram({ vertexShader, fragmentShader }) {
        const program = this.ctx.createProgram();

        this.ctx.attachShader(program, vertexShader);
        this.ctx.attachShader(program, fragmentShader);

        // 链接 程序
        this.ctx.linkProgram(program);

        let success = this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS);
        if (!success) {
            // 链接过程出现问题
            throw ("🙂 Error: program failed to link:" + this.ctx.getProgramInfoLog(program));
        }

        return program;
    }

    /**
     * 
     * @param {Object} param0 
     * @param {string} param0.selector - script标签的id
     * @param {Object} param0.shaderType - 要创建的着色器类型. 如果没有定义，就使用script标签的type属性
     * @returns {!WebGLShader} 着色器
     */
    createShaderFromScript({ selector, shaderType }) {
        /** @type {HTMLScriptElement} */
        let script = document.querySelector(selector);
        if (!script) {
            throw `🙂 Error: unknown script element: ${selector}`;
        }

        let source = script.text;
        let type = shaderType;
        let tagType = script.type;
        switch (tagType) {
            case 'x-shader/x-vertex':
                type = this.ctx.VERTEX_SHADER;
                break;
            case 'x-shader/x-fragment':
                type = this.ctx.FRAGMENT_SHADER;
                break;
            default:
                break;
        }
        if (!type) {
            throw `🙂 Error: shader type not defined`;
        }
        return this.compileShader({ source, type });
    }


    /**
     * 通过两个 script 标签创建程序。
     *
     * @param {Object} parameter
     * @param {string} parameter.vertexShaderId 顶点着色器的标签选择器。
     * @param {string} parameter.fragmentShaderId 片断着色器的标签选择器。
     * @return {!WebGLProgram}
     */
    createProgramFromScripts({ vertexShaderId, fragmentShaderId }) {
        var vertexShader = this.createShaderFromScript({ selector: vertexShaderId, shaderType: this.ctx.VERTEX_SHADER });
        var fragmentShader = this.createShaderFromScript({ selector: fragmentShaderId, shaderType: this.ctx.FRAGMENT_SHADER });
        return this.createProgram({ vertexShader, fragmentShader });
    }

}