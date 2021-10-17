class Point {
    x : number;
    y : number;
    shared : number;
    
    constructor(_x : number, _y : number) {
        this.x = _x;
        this.y = _y;
        this.shared = 0;
    }
}

const IsPointSame = (_p0 : Point, _p1 : Point) : boolean => {
    return Math.pow(_p0.x - _p1.x, 2.0) + Math.pow(_p0.y - _p1.y, 2.0) < 50;
}

const OverwritePoint = (_point : Point, _pointlist : Point[]) : Point => {
    let point = _point;
    for (let i : number = 0; i < _pointlist.length; ++i) {
        if (IsPointSame(_point, _pointlist[i])) {
            point = _pointlist[i];
        }
    }
    return point;
}