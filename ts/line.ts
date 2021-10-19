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

    Dispose = () => {
        this.p1.shared--;
        this.p2.shared--;
    }

    Draw = (_$svg, _color : string) => {
        Line.Draw(_$svg, this.p1, this.p2, _color, this.id);
        let $circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $circle1.id = this.id + "_circle1"; 
        $circle1.setAttributeNS(null, "cx", `${this.p1.x}`);
        $circle1.setAttributeNS(null, "cy", `${this.p1.y}`);
        $circle1.setAttributeNS(null, "r", `${5}`);
        $circle1.setAttributeNS(null, "stroke", _color);
        _$svg.appendChild($circle1);
        let $circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $circle2.id = this.id + "_circle2";
        $circle2.setAttributeNS(null, "cx", `${this.p2.x}`);
        $circle2.setAttributeNS(null, "cy", `${this.p2.y}`);
        $circle2.setAttributeNS(null, "r", `${5}`);
        $circle2.setAttributeNS(null, "stroke", _color);
        _$svg.appendChild($circle2);
    }

    Undraw = (_$svg) => {
        let $line = document.getElementById(this.id);
        if ($line) {
            _$svg.removeChild($line);
        }
        let $circle1 = document.getElementById(this.id + "_circle1");
        if ($circle1) {
            _$svg.removeChild($circle1);
        }
        let $circle2 = document.getElementById(this.id + "_circle2");
        if ($circle2) {
            _$svg.removeChild($circle2);
        }
    }

    IsHit = (_p : Point) : boolean => {
        var a = this.p2.y - this.p1.y;
        var b = this.p1.x - this.p2.x;
        var c = this.p2.x*this.p1.y - this.p1.x*this.p2.y;
        var d0 = Math.abs(a*_p.x + b*_p.y + c)/Math.sqrt(a**2 + b**2);
        var d1 = this.p1.Distance(_p);
        var d2 = this.p2.Distance(_p);
        var d3 = this.p1.Distance(this.p2);
        return d0 < 5 && d1 < d3 + 5 && d2 < d3 + 5;
    }

    static Draw = (_$svg, _p1 : Point, _p2 : Point, _color : string, _id : string) => {
        let $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.id = _id;
        $line.setAttributeNS(null, "x1", `${_p1.x}`);
        $line.setAttributeNS(null, "y1", `${_p1.y}`);
        $line.setAttributeNS(null, "x2", `${_p2.x}`);
        $line.setAttributeNS(null, "y2", `${_p2.y}`);
        $line.setAttributeNS(null, "stroke", _color);
        _$svg.appendChild($line);
        return $line;
    }
}