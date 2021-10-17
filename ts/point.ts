class Point {
    x : number;
    y : number;
    shared : number;
    isfixed : boolean;
    
    constructor(_x : number, _y : number) {
        this.x = _x;
        this.y = _y;
        this.shared = 0;
        this.isfixed = false;
    }

    Distance = (_p : Point) : number => {
        return Math.sqrt((this.x - _p.x)**2 + (this.y - _p.y)**2);
    }
}

const OverwritePoint = (_point : Point, _pointlist : Point[]) : Point => {
    let point = _point;
    for (let i : number = 0; i < _pointlist.length; ++i) {
        if (_point.Distance(_pointlist[i]) < 5) {
            point = _pointlist[i];
        }
    }
    return point;
}