/// <reference path="point.ts">
var Line = /** @class */ (function () {
    function Line(_p1, _p2) {
        var _this = this;
        this.Dispose = function (_$svg_model, _$svg_result) {
            _this.point[0].shared--;
            _this.point[1].shared--;
            if (_this.$line) {
                _$svg_model.removeChild(_this.$line);
            }
            if (_this.$deformedline) {
                _$svg_result.removeChild(_this.$deformedline);
            }
        };
        this.Draw = function (_$svg) {
            _this.$line = document.createElementNS("http://www.w3.org/2000/svg", "g");
            var $line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line1.setAttributeNS(null, "x1", "" + _this.point[0].x);
            $line1.setAttributeNS(null, "y1", "" + _this.point[0].y);
            $line1.setAttributeNS(null, "x2", "" + _this.point[1].x);
            $line1.setAttributeNS(null, "y2", "" + _this.point[1].y);
            $line1.setAttributeNS(null, "stroke", "black");
            _this.$line.appendChild($line1);
            for (var i = 0; i < _this.point.length; ++i) {
                var $circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                $circle.setAttributeNS(null, "cx", "" + _this.point[i].x);
                $circle.setAttributeNS(null, "cy", "" + _this.point[i].y);
                $circle.setAttributeNS(null, "r", "" + 5);
                $circle.setAttributeNS(null, "stroke", "black");
                _this.$line.appendChild($circle);
            }
            var $length = document.createElementNS("http://www.w3.org/2000/svg", "text");
            $length.setAttributeNS(null, "x", "" + (_this.point[0].x + _this.point[1].x) / 2);
            $length.setAttributeNS(null, "y", "" + (_this.point[0].y + _this.point[1].y) / 2);
            $length.setAttributeNS(null, "style", "user-select: none");
            $length.innerHTML = "" + _this.point[0].Distance(_this.point[1]).toFixed();
            _this.$line.appendChild($length);
            _$svg.appendChild(_this.$line);
        };
        this.IsHit = function (_p) {
            var a = _this.point[1].y - _this.point[0].y;
            var b = _this.point[0].x - _this.point[1].x;
            var c = _this.point[1].x * _this.point[0].y - _this.point[0].x * _this.point[1].y;
            var d0 = Math.abs(a * _p.x + b * _p.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
            var d1 = _this.point[0].Distance(_p);
            var d2 = _this.point[1].Distance(_p);
            var d3 = _this.point[0].Distance(_this.point[1]);
            return d0 < 5 && d1 < d3 + 5 && d2 < d3 + 5;
        };
        this.StiffnessMatrix = function () {
            var A = _this.area, I = Math.pow(_this.area, 2) / (4 * Math.PI), L = _this.point[0].Distance(_this.point[1]);
            var k1 = A * _this.young / L, k2 = 12 * _this.young * I / (Math.pow(L, 3)), k3 = 6 * _this.young * I / (Math.pow(L, 2)), k4 = 4 * _this.young * I / L, k5 = 2 * _this.young * I / L;
            var c = (_this.point[1].x - _this.point[0].x) / L, s = (_this.point[1].y - _this.point[0].y) / L;
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
        this.SensitivityMatrix = function () {
            var dA = 1, dI = _this.area / (2 * Math.PI), L = _this.point[0].Distance(_this.point[1]);
            var k1 = dA * _this.young / L, k2 = 12 * _this.young * dI / (Math.pow(L, 3)), k3 = 6 * _this.young * dI / (Math.pow(L, 2)), k4 = 4 * _this.young * dI / L, k5 = 2 * _this.young * dI / L;
            var c = (_this.point[1].x - _this.point[0].x) / L, s = (_this.point[1].y - _this.point[0].y) / L;
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
        this.point = [];
        this.point.push(_p1);
        this.point[0].shared++;
        this.point.push(_p2);
        this.point[1].shared++;
        this.$line = undefined;
        this.$deformedline = undefined;
        this.area = 100.0;
        this.young = Math.pow(10, 6);
    }
    return Line;
}());
/// <reference path="point.ts">
/// <reference path="line.ts">
/// <reference path="solver.ts">
/// <reference path="grandstructure.ts">
var PointList = [];
var Point0, Point1;
var LineList = [];
var Mode = "beam";
var $svg = document.getElementById("svg");
var $guide = document.getElementById("guide");
var $guide_length = document.getElementById("guide_length");
var $svg_model = document.getElementById("svg_model");
var $svg_bc = document.getElementById("svg_bc");
var $svg_result = document.getElementById("svg_result");
var $svg_opt = document.getElementById("svg_opt");
var $mode = document.getElementById("form_mode");
$svg.addEventListener("mousedown", function (e) {
    Mode = $mode.elements["options"].value;
    if (e.buttons === 1) {
        Point0 = new Point(e.clientX, e.clientY);
        var ischanged = false;
        switch (Mode) {
            case "beam":
            case "load":
                Point0 = OverwritePoint(Point0, PointList);
                $guide.setAttributeNS(null, "x1", "" + Point0.x);
                $guide.setAttributeNS(null, "y1", "" + Point0.y);
                $guide.setAttributeNS(null, "x2", "" + Point0.x);
                $guide.setAttributeNS(null, "y2", "" + Point0.y);
                $guide.setAttributeNS(null, "stroke-opacity", "" + 1.0);
                $guide_length.setAttributeNS(null, "opacity", "" + 1.0);
                break;
            case "fix":
                for (var i = PointList.length - 1; i >= 0; --i) {
                    if (PointList[i].Distance(Point0) < 10) {
                        PointList[i].Fix($svg_bc);
                        ischanged = true;
                    }
                }
                break;
            case "delete":
                for (var i = LineList.length - 1; i >= 0; --i) {
                    if (LineList[i].IsHit(new Point(e.clientX, e.clientY))) {
                        LineList[i].Dispose($svg_model, $svg_result);
                        LineList.splice(i, 1);
                        ischanged = true;
                    }
                }
                for (var i = PointList.length - 1; i >= 0; --i) {
                    if (PointList[i].shared === 0) {
                        PointList[i].Dispose($svg_bc);
                        PointList.splice(i, 1);
                    }
                }
                break;
        }
        if (ischanged) {
            $svg_model.setAttributeNS(null, "opacity", "" + 1.0);
            $svg_result.setAttributeNS(null, "opacity", "" + 0.0);
            $svg_opt.setAttributeNS(null, "opacity", "" + 0.0);
        }
    }
});
$svg.addEventListener("mousemove", function (e) {
    if (e.buttons === 1 && (Mode === "beam" || (Mode === "load" && Point0.shared && !Point0.isforced))) {
        if (e.shiftKey) {
            if (Math.abs(Point0.x - e.clientX) > Math.abs(Point0.y - e.clientY)) {
                Point1 = OverwritePointX(new Point(e.clientX, Point0.y), PointList);
            }
            else {
                Point1 = OverwritePointY(new Point(Point0.x, e.clientY), PointList);
            }
        }
        else {
            Point1 = new Point(e.clientX, e.clientY);
        }
        Point1 = OverwritePoint(Point1, PointList);
        $guide.setAttributeNS(null, "x2", "" + Point1.x);
        $guide.setAttributeNS(null, "y2", "" + Point1.y);
        $guide_length.setAttributeNS(null, "x", "" + (Point0.x + Point1.x) / 2);
        $guide_length.setAttributeNS(null, "y", "" + (Point0.y + Point1.y) / 2);
        $guide_length.innerHTML = "" + Point0.Distance(Point1).toFixed();
    }
});
$svg.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
        $guide.setAttributeNS(null, "stroke-opacity", "" + 0.0);
        $guide_length.setAttributeNS(null, "opacity", "" + 0.0);
        $guide_length.innerHTML = "";
        if ((Mode === "beam" || (Mode === "load" && Point0.shared)) && Point0.Distance(Point1) > 20) {
            $svg_model.setAttributeNS(null, "opacity", "" + 1.0);
            $svg_result.setAttributeNS(null, "opacity", "" + 0.0);
            $svg_opt.setAttributeNS(null, "opacity", "" + 0.0);
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
                    line.Draw($svg_model);
                    console.log(PointList, LineList);
                    break;
                case "load":
                    Point0.Force($svg_bc, Point1);
                    break;
            }
        }
    }
});
$svg.addEventListener("mouseleave", function (e) {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", "" + 0.0);
        $guide_length.setAttributeNS(null, "opacity", "" + 0.0);
        $guide_length.innerHTML = "";
    }
});
$svg.addEventListener("mouseenter", function (e) {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", "" + 1.0);
        $guide_length.setAttributeNS(null, "opacity", "" + 1.0);
    }
});
var $btn_analyse = document.getElementById("btn_analyse");
$btn_analyse.addEventListener("click", function (e) {
    Solve(PointList, LineList, true, $svg_result);
    $svg_model.setAttributeNS(null, "opacity", "" + 1.0);
    $svg_result.setAttributeNS(null, "opacity", "" + 1.0);
    $svg_opt.setAttributeNS(null, "opacity", "" + 0.0);
});
var $btn_optimize = document.getElementById("btn_optimize");
$btn_optimize.addEventListener("click", function (e) {
    Optimize(PointList, LineList, $svg_opt);
    $svg_model.setAttributeNS(null, "opacity", "" + 0.0);
    $svg_result.setAttributeNS(null, "opacity", "" + 0.0);
    $svg_opt.setAttributeNS(null, "opacity", "" + 1.0);
});
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
        this.ut = 0;
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
var OverwritePointX = function (_point, _pointlist) {
    var point = _point;
    for (var i = 0; i < _pointlist.length; ++i) {
        if (Math.abs(point.x - _pointlist[i].x) < 5) {
            point.x = _pointlist[i].x;
        }
    }
    return point;
};
var OverwritePointY = function (_point, _pointlist) {
    var point = _point;
    for (var i = 0; i < _pointlist.length; ++i) {
        if (Math.abs(point.y - _pointlist[i].y) < 5) {
            point.y = _pointlist[i].y;
        }
    }
    return point;
};
/// <reference path="point.ts">
/// <reference path="line.ts">
var Solve = function (_point, _line, _issavelog, _$svg) {
    if (_issavelog === void 0) { _issavelog = true; }
    if (_$svg === void 0) { _$svg = undefined; }
    //  Renumber id of point
    if (_issavelog) {
        console.log("Renumber id of point");
    }
    for (var i = 0; i < _point.length; ++i) {
        _point[i].id = i;
    }
    //  Make globally assembled stiffness matrix
    if (_issavelog) {
        console.log("Make element stiffness matrix and assembling");
    }
    var K = new Array(_point.length * 3);
    for (var i = 0; i < _point.length * 3; ++i) {
        K[i] = new Array(_point.length * 3);
        for (var j = 0; j < _point.length * 3; ++j) {
            K[i][j] = 0;
        }
    }
    for (var k = 0; k < _line.length; ++k) {
        var Ke = _line[k].StiffnessMatrix();
        for (var i = 0; i < _line[k].point.length; ++i) {
            for (var j = 0; j < _line[k].point.length; ++j) {
                var gi = _line[k].point[i].id, gj = _line[k].point[j].id;
                K[3 * gi + 0][3 * gj + 0] += Ke[3 * i + 0][3 * j + 0];
                K[3 * gi + 0][3 * gj + 1] += Ke[3 * i + 0][3 * j + 1];
                K[3 * gi + 0][3 * gj + 2] += Ke[3 * i + 0][3 * j + 2];
                K[3 * gi + 1][3 * gj + 0] += Ke[3 * i + 1][3 * j + 0];
                K[3 * gi + 1][3 * gj + 1] += Ke[3 * i + 1][3 * j + 1];
                K[3 * gi + 1][3 * gj + 2] += Ke[3 * i + 1][3 * j + 2];
                K[3 * gi + 2][3 * gj + 0] += Ke[3 * i + 2][3 * j + 0];
                K[3 * gi + 2][3 * gj + 1] += Ke[3 * i + 2][3 * j + 1];
                K[3 * gi + 2][3 * gj + 2] += Ke[3 * i + 2][3 * j + 2];
            }
        }
        if (_issavelog) {
            console.log(k, Ke);
        }
    }
    //  Apply boundary condition of fix
    if (_issavelog) {
        console.log("Apply boundary condition of fix");
    }
    for (var i = 0; i < _point.length; ++i) {
        if (_point[i].isfixed) {
            var gi = _point[i].id;
            K[3 * gi + 0][3 * gi + 0] *= Math.pow(10, 9);
            K[3 * gi + 1][3 * gi + 1] *= Math.pow(10, 9);
            K[3 * gi + 2][3 * gi + 2] *= Math.pow(10, 9);
        }
    }
    //  Apply boundary condition of force
    if (_issavelog) {
        console.log("Apply boundary condition of force");
    }
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
    if (_issavelog) {
        console.log(K, F);
    }
    var u = Gauss(K, F);
    var umax = 0;
    for (var i = 0; i < _point.length; ++i) {
        var gi = _point[i].id;
        umax = Math.max(umax, Math.abs(u[3 * gi + 0]), Math.abs(u[3 * gi + 1]));
    }
    if (_issavelog) {
        console.log(u);
    }
    //  Postprocess for point
    for (var i = 0; i < _point.length; ++i) {
        var gi = _point[i].id;
        _point[i].ux = u[3 * gi + 0];
        _point[i].uy = u[3 * gi + 1];
        _point[i].ut = u[3 * gi + 2];
    }
    //  Postprocess for line
    if (_$svg) {
        while (_$svg.firstChild) {
            _$svg.removeChild(_$svg.firstChild);
        }
        for (var k = 0; k < _line.length; ++k) {
            var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line.setAttributeNS(null, "x1", "" + (_line[k].point[0].x + 100 * _line[k].point[0].ux / umax));
            $line.setAttributeNS(null, "y1", "" + (_line[k].point[0].y + 100 * _line[k].point[0].uy / umax));
            $line.setAttributeNS(null, "x2", "" + (_line[k].point[1].x + 100 * _line[k].point[1].ux / umax));
            $line.setAttributeNS(null, "y2", "" + (_line[k].point[1].y + 100 * _line[k].point[1].uy / umax));
            $line.setAttributeNS(null, "stroke", "red");
            _$svg.appendChild($line);
        }
    }
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
var Optimize = function (_point, _line, _$svg) {
    //  Parameters
    var amax = 10, amin = 1e-1;
    var itrmax = 100, iota = 0.5, eps = 1e-5, movelimit = 0.05, weightlimit = 0.5;
    //  Initialize
    var g0 = 0;
    for (var k = 0; k < _line.length; ++k) {
        _line[k].area = amax;
        g0 += _line[k].area * _line[k].point[0].Distance(_line[k].point[1]);
    }
    //  Optimization loop
    var dnew = new Array(_line.length);
    var dfdd = new Array(_line.length), dgdd = new Array(_line.length);
    for (var itr = 0; itr < itrmax; ++itr) {
        //  Get constraint function value and sensitivity
        var gnow = -1;
        for (var k = 0; k < _line.length; ++k) {
            gnow += _line[k].area * _line[k].point[0].Distance(_line[k].point[1]) / (g0 * weightlimit);
            dgdd[k] = _line[k].point[0].Distance(_line[k].point[1]) / (g0 * weightlimit);
        }
        //  Get objective function value
        var fnow = 0;
        Solve(_point, _line, false);
        for (var k = 0; k < _point.length; ++k) {
            fnow += _point[k].ux * _point[k].forcex + _point[k].uy * _point[k].forcey;
        }
        //  Get objective function sensitivity
        for (var k = 0; k < _line.length; ++k) {
            dfdd[k] = 0;
            var Ke = _line[k].SensitivityMatrix();
            for (var i = 0; i < _line[k].point.length; ++i) {
                var uxi = _line[k].point[i].ux, uyi = _line[k].point[i].uy, uti = _line[k].point[i].ut;
                for (var j = 0; j < _line[k].point.length; ++j) {
                    var uxj = _line[k].point[j].ux, uyj = _line[k].point[j].uy, utj = _line[k].point[j].ut;
                    dfdd[k] -= uxi * Ke[3 * i + 0][3 * j + 0] * uxj + uxi * Ke[3 * i + 0][3 * j + 1] * uyj + uxi * Ke[3 * i + 0][3 * j + 2] * utj
                        + uyi * Ke[3 * i + 1][3 * j + 0] * uxj + uyi * Ke[3 * i + 1][3 * j + 1] * uyj + uyi * Ke[3 * i + 1][3 * j + 2] * utj
                        + uti * Ke[3 * i + 2][3 * j + 0] * uxj + uti * Ke[3 * i + 2][3 * j + 1] * uyj + uti * Ke[3 * i + 2][3 * j + 2] * utj;
                }
            }
        }
        //  Update design variable
        var lambda0 = 0, lambda1 = 1e4, lambda = void 0;
        while (lambda1 - lambda0 > eps * (lambda1 + lambda0)) {
            lambda = 0.5 * (lambda1 + lambda0);
            for (var k = 0; k < _line.length; ++k) {
                dnew[k] = Math.pow(-dfdd[k] / (dgdd[k] * lambda), iota) * _line[k].area;
                if (dnew[k] < Math.max(amin, (1.0 - movelimit) * _line[k].area)) {
                    dnew[k] = Math.max(amin, (1.0 - movelimit) * _line[k].area);
                }
                else if (dnew[k] > Math.min(amax, (1.0 + movelimit) * _line[k].area)) {
                    dnew[k] = Math.min(amax, (1.0 + movelimit) * _line[k].area);
                }
            }
            var gnew = 0;
            for (var k = 0; k < _line.length; ++k) {
                gnew += dnew[k] * _line[k].point[0].Distance(_line[k].point[1]);
            }
            if (gnew > weightlimit * g0) {
                lambda0 = lambda;
            }
            else {
                lambda1 = lambda;
            }
        }
        for (var k = 0; k < _line.length; ++k) {
            _line[k].area = dnew[k];
        }
        console.log(itr, fnow, gnow);
        //console.log("itr", itr, "lambda", lambda, "g", gnow, "dfdd", dfdd, "dgdd", dgdd, "dnew", dnew);
    }
    //  Export result
    while (_$svg.firstChild) {
        _$svg.removeChild(_$svg.firstChild);
    }
    for (var k = 0; k < _line.length; ++k) {
        var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.setAttributeNS(null, "x1", "" + _line[k].point[0].x);
        $line.setAttributeNS(null, "y1", "" + _line[k].point[0].y);
        $line.setAttributeNS(null, "x2", "" + _line[k].point[1].x);
        $line.setAttributeNS(null, "y2", "" + _line[k].point[1].y);
        $line.setAttributeNS(null, "stroke", "black");
        $line.setAttributeNS(null, "stroke-width", _line[k].area + "px");
        _$svg.appendChild($line);
    }
};
