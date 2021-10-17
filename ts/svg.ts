const GetSVGLine = (_x1 : number, _y1 : number, _x2 : number, _y2 : number, _color : string) => {
    let $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    $line.setAttributeNS(null, "x1", `${_x1}`);
    $line.setAttributeNS(null, "y1", `${_y1}`);
    $line.setAttributeNS(null, "x2", `${_x2}`);
    $line.setAttributeNS(null, "y2", `${_y2}`);
    $line.setAttributeNS(null, "stroke", _color);
    return $line;
}