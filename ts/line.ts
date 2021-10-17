/// <reference path="point.ts">

class Line {
    p1 : Point;
    p2 : Point;
    id : string;
    static count : number = 0;

    constructor(_p1 : Point, _p2 : Point, _id : string = "") {
        this.p1 = _p1;
        this.p1.shared++;
        this.p2 = _p2;
        this.p2.shared++;
        this.id = _id ? _id : `line${Line.count++}`;
    }

    draw = (_color : string) => {
        return Line.draw(this.p1, this.p2, _color, this.id);
    }

    static draw = (_p1 : Point, _p2 : Point, _color : string, _id : string) => {
        let $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.id = _id;
        $line.setAttributeNS(null, "x1", `${_p1.x}`);
        $line.setAttributeNS(null, "y1", `${_p1.y}`);
        $line.setAttributeNS(null, "x2", `${_p2.x}`);
        $line.setAttributeNS(null, "y2", `${_p2.y}`);
        $line.setAttributeNS(null, "stroke", _color);
        return $line;
    }
}