class Point {
    x : number;
    y : number;
    shared : number;
    isfixed : boolean;
    isforced : boolean;
    id : string;
    static count : number = 0;
    
    constructor(_x : number, _y : number, _id : string = "") {
        this.x = _x;
        this.y = _y;
        this.shared = 0;
        this.isfixed = false;
        this.isforced = false;
        this.id = _id ? _id : `point${Point.count++}`;
    }

    Dispose = (_$svg) => {
        if (this.isfixed) {
            _$svg.removeChild(document.getElementById(this.id + "_fix1"));
            _$svg.removeChild(document.getElementById(this.id + "_fix2"));
            this.isfixed = false;
        } else if (this.isforced) {
            _$svg.removeChild(document.getElementById(this.id + "_force1"));
            _$svg.removeChild(document.getElementById(this.id + "_force2"));
            _$svg.removeChild(document.getElementById(this.id + "_force3"));
            this.isforced = false;
        }
    }

    Distance = (_p : Point) : number => {
        return Math.sqrt((this.x - _p.x)**2 + (this.y - _p.y)**2);
    }

    Fix = (_$svg) => {
        if (!this.isfixed) {
            let $triangle1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            $triangle1.id = this.id + "_fix1";
            $triangle1.setAttributeNS(null, "d", `M${this.x} ${this.y} L${this.x - 10} ${this.y + 7} L${this.x - 10} ${this.y - 7} Z`);
            $triangle1.setAttributeNS(null, "fill", "blue");
            _$svg.appendChild($triangle1);
            let $triangle2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            $triangle2.id = this.id + "_fix2";
            $triangle2.setAttributeNS(null, "d", `M${this.x} ${this.y} L${this.x - 7} ${this.y + 10} L${this.x + 7} ${this.y + 10} Z`);
            $triangle2.setAttributeNS(null, "fill", "blue");
            _$svg.appendChild($triangle2);
            this.isfixed = true;
            if (this.isforced) {
                _$svg.removeChild(document.getElementById(this.id + "_force1"));
                _$svg.removeChild(document.getElementById(this.id + "_force2"));
                _$svg.removeChild(document.getElementById(this.id + "_force3"));
                this.isforced = false; 
            }
        } else {
            _$svg.removeChild(document.getElementById(this.id + "_fix1"));
            _$svg.removeChild(document.getElementById(this.id + "_fix2"));
            this.isfixed = false;
        }
    }

    Force = (_$svg, _p : Point) => {
        if (!this.isforced) {
            let $line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line1.id = this.id + "_force1";
            $line1.setAttributeNS(null, "x1", `${this.x}`);
            $line1.setAttributeNS(null, "y1", `${this.y}`);
            $line1.setAttributeNS(null, "x2", `${_p.x}`);
            $line1.setAttributeNS(null, "y2", `${_p.y}`);
            $line1.setAttributeNS(null, "stroke", "red");
            _$svg.appendChild($line1);
            let d : number = Math.sqrt((_p.x - this.x)**2 + (_p.y - this.y)**2);
            let c : number = (_p.x - this.x)/d, s : number = -(_p.y - this.y)/d;
            let $line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line2.id = this.id + "_force2";
            $line2.setAttributeNS(null, "x1", `${_p.x}`);
            $line2.setAttributeNS(null, "y1", `${_p.y}`);
            $line2.setAttributeNS(null, "x2", `${_p.x + 10*(-c + 0.5*s)}`);
            $line2.setAttributeNS(null, "y2", `${_p.y - 10*(-s - 0.5*c)}`);
            $line2.setAttributeNS(null, "stroke", "red");
            _$svg.appendChild($line2);
            let $line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line3.id = this.id + "_force3";
            $line3.setAttributeNS(null, "x1", `${_p.x}`);
            $line3.setAttributeNS(null, "y1", `${_p.y}`);
            $line3.setAttributeNS(null, "x2", `${_p.x + 10*(-c - 0.5*s)}`);
            $line3.setAttributeNS(null, "y2", `${_p.y - 10*(-s + 0.5*c)}`);
            $line3.setAttributeNS(null, "stroke", "red");
            _$svg.appendChild($line3);
            this.isforced = true;
            if (this.isfixed) {
                _$svg.removeChild(document.getElementById(this.id + "_fix1"));
                _$svg.removeChild(document.getElementById(this.id + "_fix2"));
                this.isfixed = false;
            }
        } else {
            _$svg.removeChild(document.getElementById(this.id + "_force1"));
            _$svg.removeChild(document.getElementById(this.id + "_force2"));
            _$svg.removeChild(document.getElementById(this.id + "_force3"));
            this.isforced = false;
        }
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