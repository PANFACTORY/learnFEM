var Point = /** @class */ (function () {
    function Point(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.shared = 0;
    }
    return Point;
}());
var IsPointSame = function (_p0, _p1) {
    return Math.pow(_p0.x - _p1.x, 2.0) + Math.pow(_p0.y - _p1.y, 2.0) < 50;
};
var MargePoint = function (_point, _pointlist) {
    var point = _point;
    for (var i = 0; i < _pointlist.length; ++i) {
        if (IsPointSame(_point, _pointlist[i])) {
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
        this.draw = function (_color) {
            return Line.draw(_this.p1, _this.p2, _color, _this.id);
        };
        this.p1 = _p1;
        this.p1.shared++;
        this.p2 = _p2;
        this.p2.shared++;
        this.id = _id ? _id : "line" + Line.count++;
    }
    Line.count = 0;
    Line.draw = function (_p1, _p2, _color, _id) {
        var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.id = _id;
        $line.setAttributeNS(null, "x1", "" + _p1.x);
        $line.setAttributeNS(null, "y1", "" + _p1.y);
        $line.setAttributeNS(null, "x2", "" + _p2.x);
        $line.setAttributeNS(null, "y2", "" + _p2.y);
        $line.setAttributeNS(null, "stroke", _color);
        return $line;
    };
    return Line;
}());
/// <reference path="point.ts">
/// <reference path="line.ts">
var PointList = [];
var Point0, Point1;
var LineList = [];
var $svg = document.getElementById("svg");
$svg.addEventListener("mousedown", function (e) {
    if (e.buttons === 1) {
        Point0 = MargePoint(new Point(e.clientX, e.clientY), PointList);
        if (!Point0.shared) {
            PointList.push(Point0);
        }
    }
});
$svg.addEventListener("mousemove", function (e) {
    if (e.buttons === 1) {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = MargePoint(new Point(e.clientX, e.clientY), PointList);
        $svg.appendChild(Line.draw(Point0, Point1, "gold", "linetmp"));
    }
});
$svg.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        if (!Point1.shared) {
            PointList.push(Point1);
        }
        var line = new Line(Point0, Point1);
        LineList.push(line);
        $svg.appendChild(line.draw("black"));
        console.log(PointList);
        console.log(LineList);
    }
});
