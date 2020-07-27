export default class Asteroid {
    designation: string;
    x: number;
    y: number;
    value: number;
    dx: number;
    dy: number;

    constructor(designation: string, x: number, y: number, value: number) {
        this.designation = designation;
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
        this.value = value;
    }
}