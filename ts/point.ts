interface Point {
    x : number;
    y : number;
}

const IsPointSame = (_p0 : Point, _p1 : Point) : boolean => {
    return Math.pow(_p0.x - _p1.x, 2.0) + Math.pow(_p0.y - _p1.y, 2.0) < 50;
}

const IsPointNew = (_point : Point, _pointlist : Point[]) : boolean => {
    let ispointnew = true;
    for (let i : number = 0; i < _pointlist.length; ++i) {
        if (IsPointSame(_point, _pointlist[i])) {
            ispointnew = false;
            _point.x = _pointlist[i].x;
            _point.y = _pointlist[i].y;
        }
    }
    return ispointnew;
}