/// <reference path="point.ts">
/// <reference path="line.ts">

let PointList : Point[] = [];
let Point0 : Point, Point1 : Point;
let LineList : Line[] = [];

const $svg = document.getElementById("svg");
$svg.addEventListener("mousedown", (e) => {
    if (e.buttons === 1) {
        Point0 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
        if (!Point0.shared) {
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
        Point1 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
        Line.draw($svg, Point0, Point1, "gold", "linetmp");
    }
});
$svg.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        if (!Point1.shared) {
            PointList.push(Point1);
        }
        const line = new Line(Point0, Point1);
        LineList.push(line)
        line.draw($svg, "black");
        console.log(PointList);
        console.log(LineList);
    }
});