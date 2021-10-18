var Point = /** @class */ (function () {
    function Point(_x, _y, _id) {
        var _this = this;
        if (_id === void 0) { _id = ""; }
        this.Dispose = function (_$svg) {
            if (_this.isfixed) {
                _$svg.removeChild(document.getElementById(_this.id + "_fix1"));
                _$svg.removeChild(document.getElementById(_this.id + "_fix2"));
                _this.isfixed = false;
            }
        };
        this.Distance = function (_p) {
            return Math.sqrt(Math.pow((_this.x - _p.x), 2) + Math.pow((_this.y - _p.y), 2));
        };
        this.Fix = function (_$svg) {
            if (!_this.isfixed) {
                var $triangle1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                $triangle1.id = _this.id + "_fix1";
                $triangle1.setAttributeNS(null, "d", "M" + _this.x + " " + _this.y + " L" + (_this.x - 10) + " " + (_this.y + 7) + " L" + (_this.x - 10) + " " + (_this.y - 7) + " Z");
                $triangle1.setAttributeNS(null, "fill", "blue");
                _$svg.appendChild($triangle1);
                var $triangle2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                $triangle2.id = _this.id + "_fix2";
                $triangle2.setAttributeNS(null, "d", "M" + _this.x + " " + _this.y + " L" + (_this.x - 7) + " " + (_this.y + 10) + " L" + (_this.x + 7) + " " + (_this.y + 10) + " Z");
                $triangle2.setAttributeNS(null, "fill", "blue");
                _$svg.appendChild($triangle2);
                _this.isfixed = true;
            }
            else {
                _$svg.removeChild(document.getElementById(_this.id + "_fix1"));
                _$svg.removeChild(document.getElementById(_this.id + "_fix2"));
                _this.isfixed = false;
            }
        };
        this.Force = function (_$svg, _p) {
            if (!_this.isforced) {
                var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                $line.id = _this.id + "_force";
                $line.setAttributeNS(null, "x1", "" + _this.x);
                $line.setAttributeNS(null, "y1", "" + _this.y);
                $line.setAttributeNS(null, "x2", "" + _p.x);
                $line.setAttributeNS(null, "y2", "" + _p.y);
                $line.setAttributeNS(null, "stroke", "red");
                _$svg.appendChild($line);
                _this.isforced = true;
            }
        };
        this.x = _x;
        this.y = _y;
        this.shared = 0;
        this.isfixed = false;
        this.id = _id ? _id : "point" + Point.count++;
    }
    Point.count = 0;
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
        this.Dispose = function () {
            _this.p1.shared--;
            _this.p2.shared--;
        };
        this.Draw = function (_$svg, _color) {
            Line.Draw(_$svg, _this.p1, _this.p2, _color, _this.id);
            var $circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $circle1.id = _this.id + "_circle1";
            $circle1.setAttributeNS(null, "cx", "" + _this.p1.x);
            $circle1.setAttributeNS(null, "cy", "" + _this.p1.y);
            $circle1.setAttributeNS(null, "r", "" + 5);
            $circle1.setAttributeNS(null, "stroke", _color);
            _$svg.appendChild($circle1);
            var $circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $circle2.id = _this.id + "_circle2";
            $circle2.setAttributeNS(null, "cx", "" + _this.p2.x);
            $circle2.setAttributeNS(null, "cy", "" + _this.p2.y);
            $circle2.setAttributeNS(null, "r", "" + 5);
            $circle2.setAttributeNS(null, "stroke", _color);
            _$svg.appendChild($circle2);
        };
        this.Undraw = function (_$svg) {
            var $line = document.getElementById(_this.id);
            if ($line) {
                _$svg.removeChild($line);
            }
            var $circle1 = document.getElementById(_this.id + "_circle1");
            if ($circle1) {
                _$svg.removeChild($circle1);
            }
            var $circle2 = document.getElementById(_this.id + "_circle2");
            if ($circle2) {
                _$svg.removeChild($circle2);
            }
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
    }
    Line.count = 0;
    Line.Draw = function (_$svg, _p1, _p2, _color, _id) {
        var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.id = _id;
        $line.setAttributeNS(null, "x1", "" + _p1.x);
        $line.setAttributeNS(null, "y1", "" + _p1.y);
        $line.setAttributeNS(null, "x2", "" + _p2.x);
        $line.setAttributeNS(null, "y2", "" + _p2.y);
        $line.setAttributeNS(null, "stroke", _color);
        _$svg.appendChild($line);
    };
    return Line;
}());
/// <reference path="point.ts">
/// <reference path="line.ts">
var PointList = [];
var Point0, Point1;
var LineList = [];
var $mode = document.getElementById("form_mode");
var $svg = document.getElementById("svg");
$svg.addEventListener("mousedown", function (e) {
    if (e.buttons === 1) {
        Point0 = new Point(e.clientX, e.clientY);
        if ($mode.elements["options"].value === "beam" || $mode.elements["options"].value === "load") {
            Point0 = OverwritePoint(Point0, PointList);
        }
        else if ($mode.elements["options"].value === "fix") {
            for (var i = PointList.length - 1; i >= 0; --i) {
                if (PointList[i].Distance(Point0) < 10) {
                    PointList[i].Fix($svg);
                }
            }
            console.log(PointList, LineList);
        }
        else if ($mode.elements["options"].value === "delete") {
            for (var i = LineList.length - 1; i >= 0; --i) {
                if (LineList[i].IsHit(new Point(e.clientX, e.clientY))) {
                    LineList[i].Undraw($svg);
                    LineList[i].Dispose();
                    LineList.splice(i, 1);
                }
            }
            for (var i = PointList.length - 1; i >= 0; --i) {
                if (PointList[i].shared === 0) {
                    PointList[i].Dispose($svg);
                    PointList.splice(i, 1);
                }
            }
            console.log(PointList, LineList);
        }
    }
});
$svg.addEventListener("mousemove", function (e) {
    if (e.buttons === 1 && $mode.elements["options"].value === "beam") {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
        Line.Draw($svg, Point0, Point1, "gold", "linetmp");
    }
    else if (e.buttons === 1 && $mode.elements["options"].value === "load" && Point0.shared) {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = new Point(e.clientX, e.clientY);
        Line.Draw($svg, Point0, Point1, "red", "linetmp");
    }
});
$svg.addEventListener("mouseup", function (e) {
    if (e.button === 0 && $mode.elements["options"].value === "beam") {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        if (Point0.Distance(Point1) > 20) {
            if (!Point0.shared) {
                PointList.push(Point0);
            }
            if (!Point1.shared) {
                PointList.push(Point1);
            }
            var line = new Line(Point0, Point1);
            LineList.push(line);
            line.Draw($svg, "black");
            console.log(PointList, LineList);
        }
    }
    else if (e.button === 0 && $mode.elements["options"].value === "load") {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        if (Point0.Distance(Point1) > 20) {
            Point0.Force($svg, Point1);
        }
    }
});
$svg.addEventListener("mouseout", function (e) {
    if (e.button === 0 && $mode.elements["options"].value === "beam") {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
    }
});
