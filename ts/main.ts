/// <reference path="point.ts">
/// <reference path="line.ts">

let PointList : Point[] = [];
let Point0 : Point, Point1 : Point;
let LineList : Line[] = [];

const $mode : HTMLFormElement = <HTMLFormElement>document.getElementById("form_mode");
const $svg = document.getElementById("svg");
$svg.addEventListener("mousedown", (e) => {
    if (e.buttons === 1) {
        Point0 = new Point(e.clientX, e.clientY);
        if ($mode.elements["options"].value === "beam" || $mode.elements["options"].value === "load") {
            Point0 = OverwritePoint(Point0, PointList);
        } else if ($mode.elements["options"].value === "fix") {
            for (let i : number = PointList.length - 1; i >= 0; --i) {
                if(PointList[i].Distance(Point0) < 10) {
                    PointList[i].Fix($svg);
                }
            }
            console.log(PointList, LineList);
        } else if ($mode.elements["options"].value === "delete") {
            for (let i : number = LineList.length - 1; i >= 0; --i) {
                if (LineList[i].IsHit(new Point(e.clientX, e.clientY))) {
                    LineList[i].Undraw($svg);
                    LineList[i].Dispose();
                    LineList.splice(i, 1);
                }
            }
            for (let i : number = PointList.length - 1; i >= 0; --i) {
                if(PointList[i].shared === 0) {
                    PointList[i].Dispose($svg);
                    PointList.splice(i, 1);
                }
            }
            console.log(PointList, LineList);
        }
    }
});
$svg.addEventListener("mousemove", (e) => {
    if (e.buttons === 1 && $mode.elements["options"].value === "beam") {
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
        Line.Draw($svg, Point0, Point1, "gold", "linetmp");
    } else if (e.buttons === 1 && $mode.elements["options"].value === "load" && Point0.shared) {
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        Point1 = new Point(e.clientX, e.clientY);
        Line.Draw($svg, Point0, Point1, "red", "linetmp");
    }
});
$svg.addEventListener("mouseup", (e) => {
    if (e.button === 0 && $mode.elements["options"].value === "beam") {
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
    } else if (e.button === 0 && $mode.elements["options"].value === "load") {
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
        if (Point0.Distance(Point1) > 20) {
            Point0.Force($svg, Point1);
        }
    }
});
$svg.addEventListener("mouseout", (e) => {
    if (e.button === 0 && $mode.elements["options"].value === "beam") {
        let $tmpline = document.getElementById("linetmp");
        if ($tmpline) {
            $svg.removeChild($tmpline);
        }
    }
});