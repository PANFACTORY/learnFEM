var Point = /** @class */ (function () {
    function Point(_x, _y) {
        var _this = this;
        this.Dispose = function (_$svg) {
            if (_this.isfixed) {
                _$svg.removeChild(_this.$fix);
                _this.isfixed = false;
            }
            else if (_this.isforced) {
                _$svg.removeChild(_this.$force);
                _this.isforced = false;
            }
        };
        this.Distance = function (_p) {
            return Math.sqrt(Math.pow((_this.x - _p.x), 2) + Math.pow((_this.y - _p.y), 2));
        };
        this.Fix = function (_$svg) {
            if (!_this.isfixed) {
                _this.$fix = document.createElementNS("http://www.w3.org/2000/svg", "g");
                var $triangle1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                $triangle1.setAttributeNS(null, "d", "M" + _this.x + " " + _this.y + " L" + (_this.x - 10) + " " + (_this.y + 7) + " L" + (_this.x - 10) + " " + (_this.y - 7) + " Z");
                $triangle1.setAttributeNS(null, "fill", "blue");
                _this.$fix.appendChild($triangle1);
                var $triangle2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                $triangle2.setAttributeNS(null, "d", "M" + _this.x + " " + _this.y + " L" + (_this.x - 7) + " " + (_this.y + 10) + " L" + (_this.x + 7) + " " + (_this.y + 10) + " Z");
                $triangle2.setAttributeNS(null, "fill", "blue");
                _this.$fix.appendChild($triangle2);
                _$svg.appendChild(_this.$fix);
                _this.isfixed = true;
                if (_this.isforced) {
                    _$svg.removeChild(_this.$force);
                    _this.isforced = false;
                    _this.forcex = 0;
                    _this.forcey = 0;
                }
            }
            else {
                _$svg.removeChild(_this.$fix);
                _this.isfixed = false;
            }
        };
        this.Force = function (_$svg, _p) {
            if (!_this.isforced) {
                _this.$force = document.createElementNS("http://www.w3.org/2000/svg", "g");
                var $line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                $line1.setAttributeNS(null, "x1", "" + _this.x);
                $line1.setAttributeNS(null, "y1", "" + _this.y);
                $line1.setAttributeNS(null, "x2", "" + _p.x);
                $line1.setAttributeNS(null, "y2", "" + _p.y);
                $line1.setAttributeNS(null, "stroke", "red");
                _this.$force.appendChild($line1);
                var d = Math.sqrt(Math.pow((_p.x - _this.x), 2) + Math.pow((_p.y - _this.y), 2));
                var c = (_p.x - _this.x) / d, s = (_p.y - _this.y) / d;
                var $line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                $line2.setAttributeNS(null, "x1", "" + _p.x);
                $line2.setAttributeNS(null, "y1", "" + _p.y);
                $line2.setAttributeNS(null, "x2", "" + (_p.x + 10 * (-c + 0.5 * s)));
                $line2.setAttributeNS(null, "y2", "" + (_p.y + 10 * (-s - 0.5 * c)));
                $line2.setAttributeNS(null, "stroke", "red");
                _this.$force.appendChild($line2);
                var $line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                $line3.setAttributeNS(null, "x1", "" + _p.x);
                $line3.setAttributeNS(null, "y1", "" + _p.y);
                $line3.setAttributeNS(null, "x2", "" + (_p.x + 10 * (-c - 0.5 * s)));
                $line3.setAttributeNS(null, "y2", "" + (_p.y + 10 * (-s + 0.5 * c)));
                $line3.setAttributeNS(null, "stroke", "red");
                _this.$force.appendChild($line3);
                _$svg.appendChild(_this.$force);
                _this.isforced = true;
                _this.forcex = _p.x - _this.x;
                _this.forcey = _p.y - _this.y;
                if (_this.isfixed) {
                    _$svg.removeChild(_this.$fix);
                    _this.isfixed = false;
                }
            }
            else {
                _$svg.removeChild(_this.$force);
                _this.isforced = false;
                _this.forcex = 0;
                _this.forcey = 0;
            }
        };
        this.x = _x;
        this.y = _y;
        this.shared = 0;
        this.isfixed = false;
        this.isforced = false;
        this.forcex = 0;
        this.forcey = 0;
        this.ux = 0;
        this.uy = 0;
        this.id = -1;
        this.$fix = undefined;
        this.$force = undefined;
    }
    return Point;
}());
var OverwritePoint = function (_point, _pointlist) {
    var point = _point;
    for (var i = 0; i < _pointlist.length; ++i) {
        if (_point.Distance(_pointlist[i]) < 5) {
            point = _pointlist[i];
        }
    }
    return point;
};
/// <reference path="point.ts">
var Line = /** @class */ (function () {
    function Line(_p1, _p2) {
        var _this = this;
        this.Dispose = function (_$svg) {
            _this.p1.shared--;
            _this.p2.shared--;
            if (_this.$line) {
                _$svg.removeChild(_this.$line);
            }
        };
        this.Draw = function (_$svg) {
            _this.$line = document.createElementNS("http://www.w3.org/2000/svg", "g");
            var $line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line1.setAttributeNS(null, "x1", "" + _this.p1.x);
            $line1.setAttributeNS(null, "y1", "" + _this.p1.y);
            $line1.setAttributeNS(null, "x2", "" + _this.p2.x);
            $line1.setAttributeNS(null, "y2", "" + _this.p2.y);
            $line1.setAttributeNS(null, "stroke", "black");
            _this.$line.appendChild($line1);
            var $circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $circle1.setAttributeNS(null, "cx", "" + _this.p1.x);
            $circle1.setAttributeNS(null, "cy", "" + _this.p1.y);
            $circle1.setAttributeNS(null, "r", "" + 5);
            $circle1.setAttributeNS(null, "stroke", "black");
            _this.$line.appendChild($circle1);
            var $circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $circle2.setAttributeNS(null, "cx", "" + _this.p2.x);
            $circle2.setAttributeNS(null, "cy", "" + _this.p2.y);
            $circle2.setAttributeNS(null, "r", "" + 5);
            $circle2.setAttributeNS(null, "stroke", "black");
            _this.$line.appendChild($circle2);
            _$svg.appendChild(_this.$line);
        };
        this.IsHit = function (_p) {
            var a = _this.p2.y - _this.p1.y;
            var b = _this.p1.x - _this.p2.x;
            var c = _this.p2.x * _this.p1.y - _this.p1.x * _this.p2.y;
            var d0 = Math.abs(a * _p.x + b * _p.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
            var d1 = _this.p1.Distance(_p);
            var d2 = _this.p2.Distance(_p);
            var d3 = _this.p1.Distance(_this.p2);
            return d0 < 5 && d1 < d3 + 5 && d2 < d3 + 5;
        };
        this.StiffnessMatrix = function () {
            var A = 0.25 * Math.PI * Math.pow(_this.diameter, 2), I = Math.PI * Math.pow(_this.diameter, 4) / 64, L = _this.p1.Distance(_this.p2);
            var k1 = A * _this.young / L, k2 = 12 * _this.young * I / (Math.pow(L, 3)), k3 = 6 * _this.young * I / (Math.pow(L, 2)), k4 = 4 * _this.young * I / L, k5 = 2 * _this.young * I / L;
            var c = (_this.p2.x - _this.p1.x) / L, s = (_this.p2.y - _this.p1.y) / L;
            var Ke = new Array(6);
            for (var i = 0; i < 6; ++i) {
                Ke[i] = new Array(6);
            }
            Ke[0][0] = k1 * c * c + k2 * s * s;
            Ke[0][1] = k1 * c * s - k2 * c * s;
            Ke[0][2] = -k3 * s;
            Ke[0][3] = -k1 * c * c - k2 * s * s;
            Ke[0][4] = -k1 * c * s + k2 * c * s;
            Ke[0][5] = -k3 * s;
            Ke[1][0] = Ke[0][1];
            Ke[1][1] = k1 * s * s + k2 * c * c;
            Ke[1][2] = k3 * c;
            Ke[1][3] = -k1 * c * s + k2 * c * s;
            Ke[1][4] = -k1 * s * s - k2 * c * c;
            Ke[1][5] = k3 * c;
            Ke[2][0] = Ke[0][2];
            Ke[2][1] = Ke[1][2];
            Ke[2][2] = k4;
            Ke[2][3] = k3 * s;
            Ke[2][4] = -k3 * c;
            Ke[2][5] = k5;
            Ke[3][0] = Ke[0][3];
            Ke[3][1] = Ke[1][3];
            Ke[3][2] = Ke[2][3];
            Ke[3][3] = k1 * c * c + k2 * s * s;
            Ke[3][4] = k1 * c * s - k2 * c * s;
            Ke[3][5] = k3 * s;
            Ke[4][0] = Ke[0][4];
            Ke[4][1] = Ke[1][4];
            Ke[4][2] = Ke[2][4];
            Ke[4][3] = Ke[3][4];
            Ke[4][4] = k1 * s * s + k2 * c * c;
            Ke[4][5] = -k3 * c;
            Ke[5][0] = Ke[0][5];
            Ke[5][1] = Ke[1][5];
            Ke[5][2] = Ke[2][5];
            Ke[5][3] = Ke[3][5];
            Ke[5][4] = Ke[4][5];
            Ke[5][5] = k4;
            return Ke;
        };
        this.DrawDisplacement = function (_$svg) {
            var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line.setAttributeNS(null, "x1", "" + (_this.p1.x + _this.p1.ux));
            $line.setAttributeNS(null, "y1", "" + (_this.p1.y + _this.p1.uy));
            $line.setAttributeNS(null, "x2", "" + (_this.p2.x + _this.p2.ux));
            $line.setAttributeNS(null, "y2", "" + (_this.p2.y + _this.p2.uy));
            $line.setAttributeNS(null, "stroke", "red");
            _$svg.appendChild($line);
        };
        this.p1 = _p1;
        this.p1.shared++;
        this.p2 = _p2;
        this.p2.shared++;
        this.$line = undefined;
        this.diameter = 100.0;
        this.young = Math.pow(10, 6);
    }
    return Line;
}());
/// <reference path="point.ts">
/// <reference path="line.ts">
var Solve = function (_point, _line) {
    //  Renumber id of point
    console.log("Renumber id of point");
    for (var i = 0; i < _point.length; ++i) {
        _point[i].id = i;
    }
    //  Make globally assembled stiffness matrix
    console.log("Make element stiffness matrix and assembling");
    var K = new Array(_point.length * 3);
    for (var i = 0; i < _point.length * 3; ++i) {
        K[i] = new Array(_point.length * 3);
        for (var j = 0; j < _point.length * 3; ++j) {
            K[i][j] = 0;
        }
    }
    for (var i = 0; i < _line.length; ++i) {
        var Ke = _line[i].StiffnessMatrix();
        var g1 = _line[i].p1.id, g2 = _line[i].p2.id;
        console.log(i, Ke);
        K[3 * g1 + 0][3 * g1 + 0] += Ke[0][0];
        K[3 * g1 + 0][3 * g1 + 1] += Ke[0][1];
        K[3 * g1 + 0][3 * g1 + 2] += Ke[0][2];
        K[3 * g1 + 0][3 * g2 + 0] += Ke[0][3];
        K[3 * g1 + 0][3 * g2 + 1] += Ke[0][4];
        K[3 * g1 + 0][3 * g2 + 2] += Ke[0][5];
        K[3 * g1 + 1][3 * g1 + 0] += Ke[1][0];
        K[3 * g1 + 1][3 * g1 + 1] += Ke[1][1];
        K[3 * g1 + 1][3 * g1 + 2] += Ke[1][2];
        K[3 * g1 + 1][3 * g2 + 0] += Ke[1][3];
        K[3 * g1 + 1][3 * g2 + 1] += Ke[1][4];
        K[3 * g1 + 1][3 * g2 + 2] += Ke[1][5];
        K[3 * g1 + 2][3 * g1 + 0] += Ke[2][0];
        K[3 * g1 + 2][3 * g1 + 1] += Ke[2][1];
        K[3 * g1 + 2][3 * g1 + 2] += Ke[2][2];
        K[3 * g1 + 2][3 * g2 + 0] += Ke[2][3];
        K[3 * g1 + 2][3 * g2 + 1] += Ke[2][4];
        K[3 * g1 + 2][3 * g2 + 2] += Ke[2][5];
        K[3 * g2 + 0][3 * g1 + 0] += Ke[3][0];
        K[3 * g2 + 0][3 * g1 + 1] += Ke[3][1];
        K[3 * g2 + 0][3 * g1 + 2] += Ke[3][2];
        K[3 * g2 + 0][3 * g2 + 0] += Ke[3][3];
        K[3 * g2 + 0][3 * g2 + 1] += Ke[3][4];
        K[3 * g2 + 0][3 * g2 + 2] += Ke[3][5];
        K[3 * g2 + 1][3 * g1 + 0] += Ke[4][0];
        K[3 * g2 + 1][3 * g1 + 1] += Ke[4][1];
        K[3 * g2 + 1][3 * g1 + 2] += Ke[4][2];
        K[3 * g2 + 1][3 * g2 + 0] += Ke[4][3];
        K[3 * g2 + 1][3 * g2 + 1] += Ke[4][4];
        K[3 * g2 + 1][3 * g2 + 2] += Ke[4][5];
        K[3 * g2 + 2][3 * g1 + 0] += Ke[5][0];
        K[3 * g2 + 2][3 * g1 + 1] += Ke[5][1];
        K[3 * g2 + 2][3 * g1 + 2] += Ke[5][2];
        K[3 * g2 + 2][3 * g2 + 0] += Ke[5][3];
        K[3 * g2 + 2][3 * g2 + 1] += Ke[5][4];
        K[3 * g2 + 2][3 * g2 + 2] += Ke[5][5];
    }
    //  Apply boundary condition of fix
    console.log("Apply boundary condition of fix");
    for (var i = 0; i < _point.length; ++i) {
        if (_point[i].isfixed) {
            var gi = _point[i].id;
            K[3 * gi + 0][3 * gi + 0] *= Math.pow(10, 9);
            K[3 * gi + 1][3 * gi + 1] *= Math.pow(10, 9);
            K[3 * gi + 2][3 * gi + 2] *= Math.pow(10, 9);
        }
    }
    //  Apply boundary condition of force
    console.log("Apply boundary condition of force");
    var F = new Array(_point.length * 3);
    for (var i = 0; i < _point.length * 3; ++i) {
        F[i] = 0;
    }
    for (var i = 0; i < _point.length; ++i) {
        if (_point[i].isforced) {
            var gi = _point[i].id;
            F[3 * gi + 0] = _point[i].forcex;
            F[3 * gi + 1] = _point[i].forcey;
        }
    }
    //  Solve linear system
    console.log(K, F);
    var u = Gauss(K, F);
    var umax = 0;
    for (var i = 0; i < _point.length; ++i) {
        var gi = _point[i].id;
        umax = Math.max(umax, Math.abs(u[3 * gi + 0]), Math.abs(u[3 * gi + 1]));
    }
    console.log(u);
    //  Postprocess for point
    for (var i = 0; i < _point.length; ++i) {
        var gi = _point[i].id;
        _point[i].ux = u[3 * gi + 0] * 100 / umax;
        _point[i].uy = u[3 * gi + 1] * 100 / umax;
    }
    //  Postprocess for line
};
var Gauss = function (_A, _b) {
    for (var i = 0; i < _A.length - 1; ++i) {
        //----------Get pivot----------
        var pivot = Math.abs(_A[i][i]);
        var pivoti = i;
        for (var j = i + 1; j < _A.length; ++j) {
            if (pivot < Math.abs(_A[j][i])) {
                pivot = Math.abs(_A[j][i]);
                pivoti = j;
            }
        }
        //----------Exchange pivot----------
        if (pivoti != i) {
            var tmp = _b[i];
            _b[i] = _b[pivoti];
            _b[pivoti] = tmp;
            for (var j = i; j < _A.length; ++j) {
                var tmp_1 = _A[i][j];
                _A[i][j] = _A[pivoti][j];
                _A[pivoti][j] = tmp_1;
            }
        }
        //----------Forward erase----------
        for (var j = i + 1; j < _A.length; ++j) {
            for (var k = i + 1; k < _A.length; ++k) {
                _A[j][k] -= _A[i][k] * _A[j][i] / _A[i][i];
            }
            _b[j] -= _b[i] * _A[j][i] / _A[i][i];
        }
    }
    //----------Back substitution----------
    var x = new Array(_A.length);
    for (var i = _A.length - 1; i >= 0; --i) {
        x[i] = _b[i];
        for (var j = _A.length - 1; j > i; --j) {
            x[i] -= x[j] * _A[i][j];
        }
        x[i] /= _A[i][i];
    }
    return x;
};
/// <reference path="point.ts">
/// <reference path="line.ts">
/// <reference path="solver.ts">
var PointList = [];
var Point0, Point1;
var LineList = [];
var Mode = "beam";
var $svg = document.getElementById("svg");
var $guide = document.getElementById("guide");
var $mode = document.getElementById("form_mode");
var $btn_analyse = document.getElementById("btn_analyse");
$btn_analyse.addEventListener("click", function (e) {
    Solve(PointList, LineList);
    for (var i = 0; i < LineList.length; ++i) {
        LineList[i].DrawDisplacement($svg);
    }
});
$svg.addEventListener("mousedown", function (e) {
    Mode = $mode.elements["options"].value;
    if (e.buttons === 1) {
        Point0 = new Point(e.clientX, e.clientY);
        switch (Mode) {
            case "beam":
            case "load":
                Point0 = OverwritePoint(Point0, PointList);
                $guide.setAttributeNS(null, "x1", "" + Point0.x);
                $guide.setAttributeNS(null, "y1", "" + Point0.y);
                $guide.setAttributeNS(null, "x2", "" + Point0.x);
                $guide.setAttributeNS(null, "y2", "" + Point0.y);
                $guide.setAttributeNS(null, "stroke-opacity", "" + 1.0);
                break;
            case "fix":
                for (var i = PointList.length - 1; i >= 0; --i) {
                    if (PointList[i].Distance(Point0) < 10) {
                        PointList[i].Fix($svg);
                    }
                }
                break;
            case "delete":
                for (var i = LineList.length - 1; i >= 0; --i) {
                    if (LineList[i].IsHit(new Point(e.clientX, e.clientY))) {
                        LineList[i].Dispose($svg);
                        LineList.splice(i, 1);
                    }
                }
                for (var i = PointList.length - 1; i >= 0; --i) {
                    if (PointList[i].shared === 0) {
                        PointList[i].Dispose($svg);
                        PointList.splice(i, 1);
                    }
                }
                break;
        }
    }
});
$svg.addEventListener("mousemove", function (e) {
    if (e.buttons === 1 && (Mode === "beam" || (Mode === "load" && Point0.shared && !Point0.isforced))) {
        Point1 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
        $guide.setAttributeNS(null, "x2", "" + Point1.x);
        $guide.setAttributeNS(null, "y2", "" + Point1.y);
    }
});
$svg.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
        $guide.setAttributeNS(null, "stroke-opacity", "" + 0.0);
        if ((Mode === "beam" || (Mode === "load" && Point0.shared)) && Point0.Distance(Point1) > 20) {
            switch (Mode) {
                case "beam":
                    if (!Point0.shared) {
                        PointList.push(Point0);
                    }
                    if (!Point1.shared) {
                        PointList.push(Point1);
                    }
                    var line = new Line(Point0, Point1);
                    LineList.push(line);
                    line.Draw($svg);
                    console.log(PointList, LineList);
                    break;
                case "load":
                    Point0.Force($svg, Point1);
                    break;
            }
        }
    }
});
$svg.addEventListener("mouseleave", function (e) {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", "" + 0.0);
    }
});
$svg.addEventListener("mouseenter", function (e) {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", "" + 1.0);
    }
});
