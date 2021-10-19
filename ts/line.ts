/// <reference path="point.ts">

class Line {
    p1 : Point;
    p2 : Point;
    id : string;
    static count : number = 0;
    private $line : SVGElement;

    constructor(_p1 : Point, _p2 : Point, _id : string = "") {
        this.p1 = _p1;
        this.p1.shared++;
        this.p2 = _p2;
        this.p2.shared++;
        this.id = _id ? _id : `line${Line.count++}`;
        this.$line = undefined;
    }

    Dispose = (_$svg) => {
        this.p1.shared--;
        this.p2.shared--;
        if (this.$line) {
            _$svg.removeChild(this.$line);
        }
    }

    Draw = (_$svg, _color : string) => {
        this.$line = document.createElementNS("http://www.w3.org/2000/svg", "g");
        Line.Draw(this.$line, this.p1, this.p2, _color, this.id);
        const $circle1 : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $circle1.setAttributeNS(null, "cx", `${this.p1.x}`);
        $circle1.setAttributeNS(null, "cy", `${this.p1.y}`);
        $circle1.setAttributeNS(null, "r", `${5}`);
        $circle1.setAttributeNS(null, "stroke", _color);
        this.$line.appendChild($circle1);
        const $circle2 : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $circle2.setAttributeNS(null, "cx", `${this.p2.x}`);
        $circle2.setAttributeNS(null, "cy", `${this.p2.y}`);
        $circle2.setAttributeNS(null, "r", `${5}`);
        $circle2.setAttributeNS(null, "stroke", _color);
        this.$line.appendChild($circle2);
        _$svg.appendChild(this.$line);
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