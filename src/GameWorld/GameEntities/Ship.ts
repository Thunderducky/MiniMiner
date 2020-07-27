export default class Ship {
    designation: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    constructor(designation: string, x: number, y: number, dx: number, dy: number) {
        this.designation = designation;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
}