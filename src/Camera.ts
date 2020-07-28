export class Camera {
    private _top: number;
    private _left: number;
    private _bottom: number;
    private _right: number;
    private _width: number;
    private _height: number;
    private _halfHeight: number;
    private _halfWidth: number;

    constructor(left: number, top: number, width: number, height: number) {
        this._width = width;
        this._height = height;
        this._halfWidth = width / 2;
        this._halfHeight = height / 2;
        this._top = top;
        this._left = left;
        this._right = left + width;
        this._bottom = top - height;
    }
    get center() {
        return { x: this._left + this._halfWidth, y: this._top - this._halfHeight };
    }
    set center(p: { x: number, y: number }) {
        this._top = p.y + this._halfHeight;
        this._left = p.x - this._halfWidth;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get left() {
        return this._left;
    }
    get right() {
        return this._right;
    }
    get top() {
        return this._top;
    }
    get bottom() {
        return this._bottom;
    }
    contains(p: { x: number, y: number }): boolean {
        const { _top: top, _left: left, _right: right, _bottom: bottom } = this;
        const { x, y } = p;

        return left <= x && x <= right
            && bottom <= y && y <= top;
    }
}
