/// <reference path="point.ts">
/// <reference path="line.ts">

let PointList : Point[] = [];
let Point0 : Point, Point1 : Point;
let LineList : Line[] = [];

const $svg = document.getElementById("svg");
$svg.addEventListener("mousedown", (e) => {
    if (e.buttons === 1) {
        Point0 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
    } else if (e.buttons === 4) {
        for (let i : number = LineList.length - 1; i >= 0; --i) {
            if (LineList[i].IsHit(new Point(e.clientX, e.clientY))) {
                LineList[i].Undraw($svg);
                LineList[i].Dispose();
                LineList.splice(i, 1);
            }
        }
        for (let i : number = PointList.length - 1; i >= 0; --i) {
            if(PointList[i].shared === 0) {
                PointList.splice(i, 1);
            }
        }
        console.log(PointList, LineList);
    }
});
$svg.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) {
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
        Line.Draw($svg, Point0, Point1, "gold", "linetmp");
    }
});
$svg.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        let $tmpline = document.getElementById("linetmp");
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
            const line = new Line(Point0, Point1);
            LineList.push(line)
            line.Draw($svg, "black");
            console.log(PointList, LineList);
        }
    }
});