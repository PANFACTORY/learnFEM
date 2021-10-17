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
var GetSVGLine = function (_x1, _y1, _x2, _y2, _color) {
    var $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    $line.setAttributeNS(null, "x1", "" + _x1);
    $line.setAttributeNS(null, "y1", "" + _y1);
    $line.setAttributeNS(null, "x2", "" + _x2);
    $line.setAttributeNS(null, "y2", "" + _y2);
    $line.setAttributeNS(null, "stroke", _color);
    return $line;
};
/// <reference path="point.ts">
/// <reference path="svg.ts">
var PointList = [];
var Point0, Point1;
var IsPoint1New;
var $tmpline = undefined;
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
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = { x: e.clientX, y: e.clientY };
        IsPoint1New = IsPointNew(Point1, PointList);
        $tmpline = GetSVGLine(Point0.x, Point0.y, Point1.x, Point1.y, "gold");
        $svg.appendChild($tmpline);
    }
});
$svg.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
        if ($tmpline) {
            $svg.removeChild($tmpline);
            $tmpline = undefined;
        }
        $svg.appendChild(GetSVGLine(Point0.x, Point0.y, Point1.x, Point1.y, "black"));
        if (IsPoint1New) {
            PointList.push(Point1);
        }
        console.log(PointList);
    }
});
