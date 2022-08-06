/// <reference path="point.ts">

class Line {
    point : Point[];
    area : number;
    young : number;
    private $line : SVGElement;
    private $deformedline : SVGElement;

    constructor(_p1 : Point, _p2 : Point) {
        this.point = [];
        this.point.push(_p1);
        this.point[0].shared++;
        this.point.push(_p2);
        this.point[1].shared++;
        this.$line = undefined;
        this.$deformedline = undefined;
        this.area = 100.0;
        this.young = 10**6;
    }

    Dispose = (_$svg_model, _$svg_result) => {
        this.point[0].shared--;
        this.point[1].shared--;
        if (this.$line) {
            _$svg_model.removeChild(this.$line);   
        }
        if (this.$deformedline) {
            _$svg_result.removeChild(this.$deformedline);
        }
    }

    Draw = (_$svg) => {
        this.$line = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const $line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line1.setAttributeNS(null, "x1", `${this.point[0].x}`);
        $line1.setAttributeNS(null, "y1", `${this.point[0].y}`);
        $line1.setAttributeNS(null, "x2", `${this.point[1].x}`);
        $line1.setAttributeNS(null, "y2", `${this.point[1].y}`);
        $line1.setAttributeNS(null, "stroke", "black");
        $line1.setAttributeNS(null, "stroke-width", "5");
        this.$line.appendChild($line1);
        for (let i : number = 0; i < this.point.length; ++i) {
            const $circle : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $circle.setAttributeNS(null, "cx", `${this.point[i].x}`);
            $circle.setAttributeNS(null, "cy", `${this.point[i].y}`);
            $circle.setAttributeNS(null, "r", `${20}`);
            $circle.setAttributeNS(null, "stroke", "black");
            this.$line.appendChild($circle);
        }
        const $length : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        $length.setAttributeNS(null, "x", `${(this.point[0].x + this.point[1].x)/2}`);
        $length.setAttributeNS(null, "y", `${(this.point[0].y + this.point[1].y)/2}`);
        $length.setAttributeNS(null, "style", "user-select: none");
        $length.innerHTML = `${this.point[0].Distance(this.point[1]).toFixed()}`;
        this.$line.appendChild($length);
        _$svg.appendChild(this.$line);
    }

    IsHit = (_p : Point) : boolean => {
        var a = this.point[1].y - this.point[0].y;
        var b = this.point[0].x - this.point[1].x;
        var c = this.point[1].x*this.point[0].y - this.point[0].x*this.point[1].y;
        var d0 = Math.abs(a*_p.x + b*_p.y + c)/Math.sqrt(a**2 + b**2);
        var d1 = this.point[0].Distance(_p);
        var d2 = this.point[1].Distance(_p);
        var d3 = this.point[0].Distance(this.point[1]);
        return d0 < 10 && d1 < d3 + 10 && d2 < d3 + 10;
    }

    StiffnessMatrix = () : number[][] => {
        const A : number = this.area, I : number = this.area**2/(4*Math.PI), L : number = this.point[0].Distance(this.point[1]);
        let k1 : number = A*this.young/L, k2 : number = 12*this.young*I/(L**3), k3 : number = 6*this.young*I/(L**2), k4 : number = 4*this.young*I/L, k5 : number = 2*this.young*I/L;
        let c : number = (this.point[1].x - this.point[0].x)/L, s : number = (this.point[1].y - this.point[0].y)/L;
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

    SensitivityMatrix = () : number[][] => {
        const dA : number = 1, dI : number = this.area/(2*Math.PI), L : number = this.point[0].Distance(this.point[1]);
        let k1 : number = dA*this.young/L, k2 : number = 12*this.young*dI/(L**3), k3 : number = 6*this.young*dI/(L**2), k4 : number = 4*this.young*dI/L, k5 : number = 2*this.young*dI/L;
        let c : number = (this.point[1].x - this.point[0].x)/L, s : number = (this.point[1].y - this.point[0].y)/L;
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
}