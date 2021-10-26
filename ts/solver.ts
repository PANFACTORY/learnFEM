/// <reference path="point.ts">
/// <reference path="line.ts">

const Solve = (_point : Point[], _line : Line[], _issavelog : boolean = true, _$svg = undefined) => {
    //  Renumber id of point
    if (_issavelog) {
        console.log("Renumber id of point");
    }
    for (let i : number = 0; i < _point.length; ++i) {
        _point[i].id = i;
    }

    //  Make globally assembled stiffness matrix
    if (_issavelog) {
        console.log("Make element stiffness matrix and assembling");
    }
    let K : number[][] = new Array(_point.length*3);
    for (let i : number = 0; i < _point.length*3; ++i) {
        K[i] = new Array(_point.length*3);
        for (let j : number = 0; j < _point.length*3; ++j) {
            K[i][j] = 0;
        }
    }
    for (let k : number = 0; k < _line.length; ++k) {
        let Ke : number[][] = _line[k].StiffnessMatrix();
        for (let i : number = 0; i < _line[k].point.length; ++i) {
            for (let j : number = 0; j < _line[k].point.length; ++j) {
                let gi : number = _line[k].point[i].id, gj : number = _line[k].point[j].id;
                K[3*gi + 0][3*gj + 0] += Ke[3*i + 0][3*j + 0]; K[3*gi + 0][3*gj + 1] += Ke[3*i + 0][3*j + 1]; K[3*gi + 0][3*gj + 2] += Ke[3*i + 0][3*j + 2];
                K[3*gi + 1][3*gj + 0] += Ke[3*i + 1][3*j + 0]; K[3*gi + 1][3*gj + 1] += Ke[3*i + 1][3*j + 1]; K[3*gi + 1][3*gj + 2] += Ke[3*i + 1][3*j + 2];
                K[3*gi + 2][3*gj + 0] += Ke[3*i + 2][3*j + 0]; K[3*gi + 2][3*gj + 1] += Ke[3*i + 2][3*j + 1]; K[3*gi + 2][3*gj + 2] += Ke[3*i + 2][3*j + 2];
            }
        }
        if (_issavelog) {
            console.log(k, Ke);
        }
    }

    //  Apply boundary condition of fix
    if (_issavelog) {
        console.log("Apply boundary condition of fix");
    }
    for (let i : number = 0; i < _point.length; ++i) {
        if (_point[i].isfixed) {
            let gi : number = _point[i].id;
            K[3*gi + 0][3*gi + 0] *= 10**9;
            K[3*gi + 1][3*gi + 1] *= 10**9;
            K[3*gi + 2][3*gi + 2] *= 10**9;
        }
    }

    //  Apply boundary condition of force
    if (_issavelog) {
        console.log("Apply boundary condition of force");
    }
    let F : number[] = new Array(_point.length*3);
    for (let i : number = 0; i < _point.length*3; ++i) {
        F[i] = 0;
    }
    for (let i : number = 0; i < _point.length; ++i) {
        if (_point[i].isforced) {
            let gi : number = _point[i].id;
            F[3*gi + 0] = _point[i].forcex;
            F[3*gi + 1] = _point[i].forcey;
        }
    }

    //  Solve linear system
    if (_issavelog) {
        console.log(K, F);
    }
    let u : number[] = Gauss(K, F);
    let umax : number = 0;
    for (let i : number = 0; i < _point.length; ++i) {
        let gi : number = _point[i].id;
        umax = Math.max(umax, Math.abs(u[3*gi + 0]), Math.abs(u[3*gi + 1]));
    }
    if (_issavelog) {
        console.log(u);
    }

    //  Postprocess for point
    for (let i : number = 0; i < _point.length; ++i) {
        let gi : number = _point[i].id;
        _point[i].ux = u[3*gi + 0];
        _point[i].uy = u[3*gi + 1];
        _point[i].ut = u[3*gi + 2];
    }

    //  Postprocess for line
    if (_$svg) {
        while (_$svg.firstChild) {
            _$svg.removeChild(_$svg.firstChild);
        }
        for (let k : number = 0; k < _line.length; ++k) {
            const $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            $line.setAttributeNS(null, "x1", `${_line[k].point[0].x + 100*_line[k].point[0].ux/umax}`);
            $line.setAttributeNS(null, "y1", `${_line[k].point[0].y + 100*_line[k].point[0].uy/umax}`);
            $line.setAttributeNS(null, "x2", `${_line[k].point[1].x + 100*_line[k].point[1].ux/umax}`);
            $line.setAttributeNS(null, "y2", `${_line[k].point[1].y + 100*_line[k].point[1].uy/umax}`);
            $line.setAttributeNS(null, "stroke", "red");
            _$svg.appendChild($line);
        } 
    }
}

const Gauss = (_A : number[][], _b : number[]) : number[] => {
    for(let i : number = 0; i < _A.length - 1; ++i){
        //----------Get pivot----------
        let pivot : number = Math.abs(_A[i][i]);
        let pivoti : number = i;
        for(let j : number = i + 1; j < _A.length; ++j){
            if(pivot < Math.abs(_A[j][i])){
                pivot = Math.abs(_A[j][i]);
                pivoti = j;
            }
        }
        
        //----------Exchange pivot----------
        if(pivoti != i){
            let tmp : number = _b[i];
            _b[i] = _b[pivoti];
            _b[pivoti] = tmp;
            for(let j : number = i; j < _A.length; ++j){
                let tmp : number = _A[i][j];
                _A[i][j] = _A[pivoti][j];
                _A[pivoti][j] = tmp;
            }
        }
        
        //----------Forward erase----------
        for(let j : number = i + 1; j < _A.length; ++j){
            for(let k : number = i + 1; k < _A.length; ++k){
                _A[j][k] -= _A[i][k]*_A[j][i]/_A[i][i];
            }
            _b[j] -= _b[i]*_A[j][i]/_A[i][i];
        }
    }
    
    //----------Back substitution----------
    let x : number[] = new Array(_A.length);
    for(let i : number = _A.length - 1; i >= 0; --i){
        x[i] = _b[i];
        for(let j : number = _A.length - 1; j > i; --j){
            x[i] -= x[j]*_A[i][j];
        }
        x[i] /= _A[i][i];
    }
    return x;
}