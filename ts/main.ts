/// <reference path="point.ts">
/// <reference path="line.ts">

let PointList : Point[] = [];
let Point0 : Point, Point1 : Point;
let LineList : Line[] = [];
let Mode : string = "beam";

const $svg = document.getElementById("svg");
const $guide = document.getElementById("guide");
const $mode : HTMLFormElement = <HTMLFormElement>document.getElementById("form_mode");

$svg.addEventListener("mousedown", (e) => {
    Mode = $mode.elements["options"].value;
    if (e.buttons === 1) {
        Point0 = new Point(e.clientX, e.clientY);
        switch (Mode) {
            case "beam":
            case "load":
                Point0 = OverwritePoint(Point0, PointList);
                $guide.setAttributeNS(null, "x1", `${Point0.x}`);
                $guide.setAttributeNS(null, "y1", `${Point0.y}`);
                $guide.setAttributeNS(null, "x2", `${Point0.x}`);
                $guide.setAttributeNS(null, "y2", `${Point0.y}`);
                $guide.setAttributeNS(null, "stroke-opacity", `${1.0}`);
                break;
            case "fix":
                for (let i : number = PointList.length - 1; i >= 0; --i) {
                    if(PointList[i].Distance(Point0) < 10) {
                        PointList[i].Fix($svg);
                    }
                }
                break;
            case "delete":
                for (let i : number = LineList.length - 1; i >= 0; --i) {
                    if (LineList[i].IsHit(new Point(e.clientX, e.clientY))) {
                        LineList[i].Dispose($svg);
                        LineList.splice(i, 1);
                    }
                }
                for (let i : number = PointList.length - 1; i >= 0; --i) {
                    if(PointList[i].shared === 0) {
                        PointList[i].Dispose($svg);
                        PointList.splice(i, 1);
                    }
                }
                break;
        }
    }
});
$svg.addEventListener("mousemove", (e) => {
    if (e.buttons === 1 && (Mode === "beam" || (Mode === "load" && Point0.shared && !Point0.isforced))) {
        Point1 = OverwritePoint(new Point(e.clientX, e.clientY), PointList);
        $guide.setAttributeNS(null, "x2", `${Point1.x}`);
        $guide.setAttributeNS(null, "y2", `${Point1.y}`);        
    }
});
$svg.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        $guide.setAttributeNS(null, "stroke-opacity", `${0.0}`);
        if ((Mode === "beam" || (Mode === "load" && Point0.shared)) && Point0.Distance(Point1) > 20) {
            switch (Mode) {
                case "beam":
                    if (!Point0.shared) {
                        PointList.push(Point0);
                    }
                    if (!Point1.shared) {
                        PointList.push(Point1);
                    }
                    const line = new Line(Point0, Point1);
                    LineList.push(line)
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
$svg.addEventListener("mouseleave", (e) => {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", `${0.0}`);
    }
});
$svg.addEventListener("mouseenter", (e) => {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", `${1.0}`);
    }
});