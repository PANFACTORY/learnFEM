var IsPointSame = function (_p0, _p1) {
    return Math.pow(_p0.x - _p1.x, 2.0) + Math.pow(_p0.y - _p1.y, 2.0) < 50;
};
var IsPointNew = function (_point, _pointlist) {
    var ispointnew = true;
    for (var i = 0; i < _pointlist.length; ++i) {
        if (IsPointSame(_point, _pointlist[i])) {
            ispointnew = false;
            _point.x = _pointlist[i].x;
            _point.y = _pointlist[i].y;
        }
    }
    return ispointnew;
};
/// <reference path="point.ts">
var Line = /** @class */ (function () {
    function Line(_p1, _p2, _id) {
        var _this = this;
        if (_id === void 0) { _id = ""; }
        this.draw = function (_color) {
            var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line.id = _this.id;
            $line.setAttributeNS(null, "x1", "" + _this.p1.x);
            $line.setAttributeNS(null, "y1", "" + _this.p1.y);
            $line.setAttributeNS(null, "x2", "" + _this.p2.x);
            $line.setAttributeNS(null, "y2", "" + _this.p2.y);
            $line.setAttributeNS(null, "stroke", _color);
            return $line;
        };
        this.p1 = _p1;
        this.p2 = _p2;
        this.id = _id ? _id : "line" + Line.count++;
    }
    Line.count = 0;
    return Line;
}());
var GetSVGLine = function (_p1, _p2, _color) {
    var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    $line.setAttributeNS(null, "x1", "" + _p1.x);
    $line.setAttributeNS(null, "y1", "" + _p1.y);
    $line.setAttributeNS(null, "x2", "" + _p2.x);
    $line.setAttributeNS(null, "y2", "" + _p2.y);
    $line.setAttributeNS(null, "stroke", _color);
    return $line;
};
/// <reference path="point.ts">
/// <reference path="line.ts">
var PointList = [];
var Point0, Point1;
var IsPoint1New;
var LineList = [];
var $svg = document.getElementById("svg");
$svg.addEventListener("mousedown", function (e) {
    if (e.buttons === 1) {
        Point0 = { x: e.clientX, y: e.clientY };
        if (IsPointNew(Point0, PointList)) {
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
        Point1 = { x: e.clientX, y: e.clientY };
        IsPoint1New = IsPointNew(Point1, PointList);
        $svg.appendChild((new Line(Point0, Point1, "linetmp")).draw("gold"));
    }
});
$svg.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
        var $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        LineList.push(new Line(Point0, Point1));
        $svg.appendChild(LineList[LineList.length - 1].draw("black"));
        if (IsPoint1New) {
            PointList.push(Point1);
        }
        console.log(PointList);
        console.log(LineList);
    }
});
