/// <reference path="point.ts">
/// <reference path="line.ts">

let PointList : Point[] = [];
let Point0 : Point, Point1 : Point;
let IsPoint1New : boolean;
let LineList : Line[] = [];

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
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = { x : e.clientX, y : e.clientY };
        IsPoint1New = IsPointNew(Point1, PointList);
        $svg.appendChild((new Line(Point0, Point1, "linetmp")).draw("gold"));
    }
});
$svg.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        LineList.push(new Line(Point0, Point1))
        $svg.appendChild(LineList[LineList.length - 1].draw("black"));
        if (IsPoint1New) {
            PointList.push(Point1);
        }
        console.log(PointList);
        console.log(LineList);
    }
});