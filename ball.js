export default class Ball {
    ctx = null;
    x = 30;
    y = 30;
    vx = 1;
    vy = 1;
    radius = 2;
    color = 'orange';

    constructor({ ctx, x, y, vx, vy, radius, color } = {}) {
        this.ctx = ctx;
        this.x = x || Math.trunc(Math.random() * 1000);
        this.y = y || Math.trunc(Math.random() * 1000);
        this.vx = vx || Math.trunc(Math.random() * 20);
        this.vy = vy || Math.trunc(Math.random() * 20);
        this.radius = radius || 5;
        this.color = color || `rgb(${Math.trunc(Math.random() * 255)}, ${Math.trunc(Math.random() * 255)}, ${Math.trunc(Math.random() * 255)})`;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}