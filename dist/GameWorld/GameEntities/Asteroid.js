"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Asteroid {
    constructor(designation, x, y, value) {
        this.designation = designation;
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
        this.value = value;
    }
}
exports.default = Asteroid;
