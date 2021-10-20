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
                var c = (_p.x - _this.x) / d, s = -(_p.y - _this.y) / d;
                var $line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                $line2.setAttributeNS(null, "x1", "" + _p.x);
                $line2.setAttributeNS(null, "y1", "" + _p.y);
                $line2.setAttributeNS(null, "x2", "" + (_p.x + 10 * (-c + 0.5 * s)));
                $line2.setAttributeNS(null, "y2", "" + (_p.y - 10 * (-s - 0.5 * c)));
                $line2.setAttributeNS(null, "stroke", "red");
                _this.$force.appendChild($line2);
                var $line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                $line3.setAttributeNS(null, "x1", "" + _p.x);
                $line3.setAttributeNS(null, "y1", "" + _p.y);
                $line3.setAttributeNS(null, "x2", "" + (_p.x + 10 * (-c - 0.5 * s)));
                $line3.setAttributeNS(null, "y2", "" + (_p.y - 10 * (-s + 0.5 * c)));
                $line3.setAttributeNS(null, "stroke", "red");
                _this.$force.appendChild($line3);
                _$svg.appendChild(_this.$force);
                _this.isforced = true;
                if (_this.isfixed) {
                    _$svg.removeChild(_this.$fix);
                    _this.isfixed = false;
                }
            }
            else {
                _$svg.removeChild(_this.$force);
                _this.isforced = false;
            }
        };
        this.x = _x;
        this.y = _y;
        this.shared = 0;
        this.isfixed = false;
        this.isforced = false;
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
    function Line(_p1, _p2, _id) {
        var _this = this;
        if (_id === void 0) { _id = ""; }
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
        this.p1 = _p1;
        this.p1.shared++;
        this.p2 = _p2;
        this.p2.shared++;
        this.id = _id ? _id : "line" + Line.count++;
        this.$line = undefined;
    }
    Line.count = 0;
    return Line;
}());
/// <reference path="point.ts">
/// <reference path="line.ts">
var PointList = [];
var Point0, Point1;
var LineList = [];
var Mode = "beam";
var $svg = document.getElementById("svg");
var $tmpline = document.createElementNS("http://www.w3.org/2000/svg", "line");
$tmpline.setAttributeNS(null, "stroke", "black");
$tmpline.setAttributeNS(null, "stroke-dasharray", "" + 4);
$tmpline.setAttributeNS(null, "stroke-opacity", "" + 0.0);
$svg.appendChild($tmpline);
var $mode = document.getElementById("form_mode");
$svg.addEventListener("mousedown", function (e) {
    Mode = $mode.elements["options"].value;
    if (e.buttons === 1) {
        Point0 = new Point(e.clientX, e.clientY);
        switch (Mode) {
            case "beam":
            case "load":
                Point0 = OverwritePoint(Point0, PointList);
                $tmpline.setAttributeNS(null, "x1", "" + Point0.x);
                $tmpline.setAttributeNS(null, "y1", "" + Point0.y);
                $tmpline.setAttributeNS(null, "x2", "" + Point0.x);
                $tmpline.setAttributeNS(null, "y2", "" + Point0.y);
                $tmpline.setAttributeNS(null, "stroke-opacity", "" + 1.0);
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
        $tmpline.setAttributeNS(null, "x2", "" + Point1.x);
        $tmpline.setAttributeNS(null, "y2", "" + Point1.y);
    }
});
$svg.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
        $tmpline.setAttributeNS(null, "stroke-opacity", "" + 0.0);
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
        $tmpline.setAttributeNS(null, "stroke-opacity", "" + 0.0);
    }
});
$svg.addEventListener("mouseenter", function (e) {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $tmpline.setAttributeNS(null, "stroke-opacity", "" + 1.0);
    }
});
