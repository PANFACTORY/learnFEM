/// <reference path="point.ts">

class Line {
    p1 : Point;
    p2 : Point;
    diameter : number;
    young : number;
    private $line : SVGElement;

    constructor(_p1 : Point, _p2 : Point) {
        this.p1 = _p1;
        this.p1.shared++;
        this.p2 = _p2;
        this.p2.shared++;
        this.$line = undefined;
        this.diameter = 100.0;
        this.young = 10**6;
    }

    Dispose = (_$svg) => {
        this.p1.shared--;
        this.p2.shared--;
        if (this.$line) {
            _$svg.removeChild(this.$line);
        }
    }

    Draw = (_$svg) => {
        this.$line = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const $line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line1.setAttributeNS(null, "x1", `${this.p1.x}`);
        $line1.setAttributeNS(null, "y1", `${this.p1.y}`);
        $line1.setAttributeNS(null, "x2", `${this.p2.x}`);
        $line1.setAttributeNS(null, "y2", `${this.p2.y}`);
        $line1.setAttributeNS(null, "stroke", "black");
        this.$line.appendChild($line1);
        const $circle1 : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $circle1.setAttributeNS(null, "cx", `${this.p1.x}`);
        $circle1.setAttributeNS(null, "cy", `${this.p1.y}`);
        $circle1.setAttributeNS(null, "r", `${5}`);
        $circle1.setAttributeNS(null, "stroke", "black");
        this.$line.appendChild($circle1);
        const $circle2 : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $circle2.setAttributeNS(null, "cx", `${this.p2.x}`);
        $circle2.setAttributeNS(null, "cy", `${this.p2.y}`);
        $circle2.setAttributeNS(null, "r", `${5}`);
        $circle2.setAttributeNS(null, "stroke", "black");
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

    StiffnessMatrix = () : number[][] => {
        const A : number = 0.25*Math.PI*this.diameter**2, I : number = Math.PI*this.diameter**4/64, L : number = this.p1.Distance(this.p2);
        let k1 : number = A*this.young/L, k2 : number = 12*this.young*I/(L**3), k3 : number = 6*this.young*I/(L**2), k4 : number = 4*this.young*I/L, k5 : number = 2*this.young*I/L;
        let c : number = (this.p2.x - this.p1.x)/L, s : number = (this.p2.y - this.p1.y)/L;
        let Ke : number[][] = new Array(6);
        for (let i : number = 0; i < 6; ++i) {
            Ke[i] = new Array(6);
        }
        Ke[0][0] = k1*c*c + k2*s*s; Ke[0][1] = k1*c*s - k2*c*s; Ke[0][2] = -k3*s;    Ke[0][3] = -k1*c*c - k2*s*s; Ke[0][4] = -k1*c*s + k2*c*s; Ke[0][5] = -k3*s;
        Ke[1][0] = Ke[0][1];        Ke[1][1] = k1*s*s + k2*c*c; Ke[1][2] = k3*c;     Ke[1][3] = -k1*c*s + k2*c*s; Ke[1][4] = -k1*s*s - k2*c*c; Ke[1][5] = k3*c;
        Ke[2][0] = Ke[0][2];        Ke[2][1] = Ke[1][2];        Ke[2][2] = k4;       Ke[2][3] = k3*s;             Ke[2][4] = -k3*c;            Ke[2][5] = k5;
        Ke[3][0] = Ke[0][3];        Ke[3][1] = Ke[1][3];        Ke[3][2] = Ke[2][3]; Ke[3][3] = k1*c*c + k2*s*s;  Ke[3][4] = k1*c*s - k2*c*s;  Ke[3][5] = k3*s;
        Ke[4][0] = Ke[0][4];        Ke[4][1] = Ke[1][4];        Ke[4][2] = Ke[2][4]; Ke[4][3] = Ke[3][4];         Ke[4][4] = k1*s*s + k2*c*c;  Ke[4][5] = -k3*c;
        Ke[5][0] = Ke[0][5];        Ke[5][1] = Ke[1][5];        Ke[5][2] = Ke[2][5]; Ke[5][3] = Ke[3][5];         Ke[5][4] = Ke[4][5];         Ke[5][5] = k4;
        return Ke;
    }

    DrawDisplacement = (_$svg) => {
        const $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.setAttributeNS(null, "x1", `${this.p1.x + this.p1.ux}`);
        $line.setAttributeNS(null, "y1", `${this.p1.y + this.p1.uy}`);
        $line.setAttributeNS(null, "x2", `${this.p2.x + this.p2.ux}`);
        $line.setAttributeNS(null, "y2", `${this.p2.y + this.p2.uy}`);
        $line.setAttributeNS(null, "stroke", "red");
        _$svg.appendChild($line);
    }
}