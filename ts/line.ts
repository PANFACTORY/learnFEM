/// <reference path="point.ts">

class Line {
    p1 : Point;
    p2 : Point;
    id : string;
    static count : number = 0;

    constructor(_p1 : Point, _p2 : Point, _id : string = "") {
        this.p1 = _p1;
        this.p2 = _p2;
        this.id = _id ? _id : `line${Line.count++}`;
    }

    draw = (_color : string) => {
        let $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.id = this.id;
        $line.setAttributeNS(null, "x1", `${this.p1.x}`);
        $line.setAttributeNS(null, "y1", `${this.p1.y}`);
        $line.setAttributeNS(null, "x2", `${this.p2.x}`);
        $line.setAttributeNS(null, "y2", `${this.p2.y}`);
        $line.setAttributeNS(null, "stroke", _color);
        return $line;
    }
}