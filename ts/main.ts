/// <reference path="point.ts">
/// <reference path="line.ts">
/// <reference path="solver.ts">
/// <reference path="grandstructure.ts">

let PointList : Point[] = [];
let Point0 : Point, Point1 : Point;
let LineList : Line[] = [];
let Mode : string = "beam";

const $svg = document.getElementById("svg");
const $guide = document.getElementById("guide");
const $guide_length = document.getElementById("guide_length");
const $svg_model = document.getElementById("svg_model");
const $svg_bc = document.getElementById("svg_bc");
const $svg_result = document.getElementById("svg_result");
const $svg_opt = document.getElementById("svg_opt");
const $mode : HTMLFormElement = <HTMLFormElement>document.getElementById("form_mode");

const load = () => {
    $svg.setAttributeNS(null, "width", `${0.95*document.documentElement.clientWidth}`);
    $svg.setAttributeNS(null, "height", `${0.95*(document.documentElement.clientHeight - document.getElementById("row_buttons").clientHeight)}`);
    const $grid = document.getElementById("grid");
    $grid.setAttributeNS(null, "width", `${0.95*document.documentElement.clientWidth}`);
    $grid.setAttributeNS(null, "height", `${0.95*(document.documentElement.clientHeight - document.getElementById("row_buttons").clientHeight)}`);
}
load();
window.onresize = load;

$svg.addEventListener("mousedown", (e) => {
    Mode = $mode.elements["options"].value;
    if (e.buttons === 1) {
        Point0 = new Point(e.clientX, e.clientY);
        let ischanged : boolean = false;
        switch (Mode) {
            case "beam":
            case "load":
                Point0 = OverwritePoint(Point0, PointList);
                $guide.setAttributeNS(null, "x1", `${Point0.x}`);
                $guide.setAttributeNS(null, "y1", `${Point0.y}`);
                $guide.setAttributeNS(null, "x2", `${Point0.x}`);
                $guide.setAttributeNS(null, "y2", `${Point0.y}`);
                $guide.setAttributeNS(null, "stroke-opacity", `${1.0}`);
                $guide_length.setAttributeNS(null, "opacity", `${1.0}`);
                break;
            case "fix":
                for (let i : number = PointList.length - 1; i >= 0; --i) {
                    if(PointList[i].Distance(Point0) < 10) {
                        PointList[i].Fix($svg_bc);
                        ischanged = true;
                    }
                }
                break;
            case "delete":
                for (let i : number = LineList.length - 1; i >= 0; --i) {
                    if (LineList[i].IsHit(new Point(e.clientX, e.clientY))) {
                        LineList[i].Dispose($svg_model, $svg_result);
                        LineList.splice(i, 1);
                        ischanged = true;
                    }
                }
                for (let i : number = PointList.length - 1; i >= 0; --i) {
                    if(PointList[i].shared === 0) {
                        PointList[i].Dispose($svg_bc);
                        PointList.splice(i, 1);
                    }
                }
                break;
        }
        if (ischanged) {
            $svg_model.setAttributeNS(null, "opacity", `${1.0}`);
            $svg_result.setAttributeNS(null, "opacity", `${0.0}`);
            $svg_opt.setAttributeNS(null, "opacity", `${0.0}`);
        }
    }
});
$svg.addEventListener("mousemove", (e) => {
    if (e.buttons === 1 && (Mode === "beam" || (Mode === "load" && Point0.shared && !Point0.isforced))) {
        if (e.shiftKey) {
            if (Math.abs(Point0.x - e.clientX) > Math.abs(Point0.y - e.clientY)) {
                Point1 = OverwritePointX(new Point(e.clientX, Point0.y), PointList);
            } else {
                Point1 = OverwritePointY(new Point(Point0.x, e.clientY), PointList);
            }
        } else {
            Point1 = new Point(e.clientX, e.clientY);
        }
        Point1 = OverwritePoint(Point1, PointList);
        $guide.setAttributeNS(null, "x2", `${Point1.x}`);
        $guide.setAttributeNS(null, "y2", `${Point1.y}`);
        $guide_length.setAttributeNS(null, "x", `${(Point0.x + Point1.x)/2}`);
        $guide_length.setAttributeNS(null, "y", `${(Point0.y + Point1.y)/2}`);
        $guide_length.innerHTML = `${Point0.Distance(Point1).toFixed()}`;    
    }
});
$svg.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        $guide.setAttributeNS(null, "stroke-opacity", `${0.0}`);
        $guide_length.setAttributeNS(null, "opacity", `${0.0}`);
        $guide_length.innerHTML = ""; 
        if ((Mode === "beam" || (Mode === "load" && Point0.shared)) && Point0.Distance(Point1) > 20) {
            $svg_model.setAttributeNS(null, "opacity", `${1.0}`);
            $svg_result.setAttributeNS(null, "opacity", `${0.0}`);
            $svg_opt.setAttributeNS(null, "opacity", `${0.0}`);
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
                    line.Draw($svg_model);
                    console.log(PointList, LineList);
                    break;
                case "load":
                    Point0.Force($svg_bc, Point1);
                    break;
            }
        }
    }
});
$svg.addEventListener("mouseleave", (e) => {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", `${0.0}`);
        $guide_length.setAttributeNS(null, "opacity", `${0.0}`);
        $guide_length.innerHTML = "";
    }
});
$svg.addEventListener("mouseenter", (e) => {
    if (e.button === 0 && (Mode === "beam" || Mode === "load")) {
        $guide.setAttributeNS(null, "stroke-opacity", `${1.0}`);
        $guide_length.setAttributeNS(null, "opacity", `${1.0}`);
    }
});

const $btn_analyse = document.getElementById("btn_analyse");
$btn_analyse.addEventListener("click", (e) => {
    Solve(PointList, LineList, true, $svg_result);
    $svg_model.setAttributeNS(null, "opacity", `${1.0}`);
    $svg_result.setAttributeNS(null, "opacity", `${1.0}`);
    $svg_opt.setAttributeNS(null, "opacity", `${0.0}`);
});

const $btn_optimize = document.getElementById("btn_optimize");
$btn_optimize.addEventListener("click", (e) => {
    Optimize(PointList, LineList, $svg_opt);
    $svg_model.setAttributeNS(null, "opacity", `${0.0}`);
    $svg_result.setAttributeNS(null, "opacity", `${0.0}`);
    $svg_opt.setAttributeNS(null, "opacity", `${1.0}`);
});