/// <reference path="point.ts">
/// <reference path="svg.ts">

let PointList : Point[] = [];
let Point0 : Point, Point1 : Point;
let IsPoint1New : boolean;
let $tmpline = undefined;

const $svg = document.getElementById("svg");
$svg.addEventListener("mousedown", (e) => {
    if (e.buttons === 1) {
        Point0 = { x : e.clientX, y : e.clientY };
        if (IsPointNew(Point0, PointList)) {
            PointList.push(Point0);
        }
    }
});
$svg.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) {
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = { x : e.clientX, y : e.clientY };
        IsPoint1New = IsPointNew(Point1, PointList);
        $tmpline = GetSVGLine(Point0.x, Point0.y, Point1.x, Point1.y, "gold");
        $svg.appendChild($tmpline);
    }
});
$svg.addEventListener("mouseup", (e) => {
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