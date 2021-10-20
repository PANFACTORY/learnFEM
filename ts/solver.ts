/// <reference path="point.ts">
/// <reference path="line.ts">

const Solve = (_point : Point[], _line : Line[]) => {
    //  Renumber id of point
    console.log("Renumber id of point");
    for (let i : number = 0; i < _point.length; ++i) {
        _point[i].id = i;
    }

    //  Make globally assembled stiffness matrix
    console.log("Make element stiffness matrix and assembling");
    let K : number[][] = new Array(_point.length*3);
    for (let i : number = 0; i < _point.length*3; ++i) {
        K[i] = new Array(_point.length*3);
        for (let j : number = 0; j < _point.length*3; ++j) {
            K[i][j] = 0;
        }
    }
    for (let i : number = 0; i < _line.length; ++i) {
        let Ke : number[][] = _line[i].StiffnessMatrix();
        let g1 : number = _line[i].p1.id, g2 : number = _line[i].p2.id;
        console.log(i, Ke);
        K[3*g1 + 0][3*g1 + 0] += Ke[0][0]; K[3*g1 + 0][3*g1 + 1] += Ke[0][1]; K[3*g1 + 0][3*g1 + 2] += Ke[0][2]; K[3*g1 + 0][3*g2 + 0] += Ke[0][3]; K[3*g1 + 0][3*g2 + 1] += Ke[0][4]; K[3*g1 + 0][3*g2 + 2] += Ke[0][5];
        K[3*g1 + 1][3*g1 + 0] += Ke[1][0]; K[3*g1 + 1][3*g1 + 1] += Ke[1][1]; K[3*g1 + 1][3*g1 + 2] += Ke[1][2]; K[3*g1 + 1][3*g2 + 0] += Ke[1][3]; K[3*g1 + 1][3*g2 + 1] += Ke[1][4]; K[3*g1 + 1][3*g2 + 2] += Ke[1][5];
        K[3*g1 + 2][3*g1 + 0] += Ke[2][0]; K[3*g1 + 2][3*g1 + 1] += Ke[2][1]; K[3*g1 + 2][3*g1 + 2] += Ke[2][2]; K[3*g1 + 2][3*g2 + 0] += Ke[2][3]; K[3*g1 + 2][3*g2 + 1] += Ke[2][4]; K[3*g1 + 2][3*g2 + 2] += Ke[2][5];
        K[3*g2 + 0][3*g1 + 0] += Ke[3][0]; K[3*g2 + 0][3*g1 + 1] += Ke[3][1]; K[3*g2 + 0][3*g1 + 2] += Ke[3][2]; K[3*g2 + 0][3*g2 + 0] += Ke[3][3]; K[3*g2 + 0][3*g2 + 1] += Ke[3][4]; K[3*g2 + 0][3*g2 + 2] += Ke[3][5];
        K[3*g2 + 1][3*g1 + 0] += Ke[4][0]; K[3*g2 + 1][3*g1 + 1] += Ke[4][1]; K[3*g2 + 1][3*g1 + 2] += Ke[4][2]; K[3*g2 + 1][3*g2 + 0] += Ke[4][3]; K[3*g2 + 1][3*g2 + 1] += Ke[4][4]; K[3*g2 + 1][3*g2 + 2] += Ke[4][5];
        K[3*g2 + 2][3*g1 + 0] += Ke[5][0]; K[3*g2 + 2][3*g1 + 1] += Ke[5][1]; K[3*g2 + 2][3*g1 + 2] += Ke[5][2]; K[3*g2 + 2][3*g2 + 0] += Ke[5][3]; K[3*g2 + 2][3*g2 + 1] += Ke[5][4]; K[3*g2 + 2][3*g2 + 2] += Ke[5][5];
    }

    //  Apply boundary condition of fix
    console.log("Apply boundary condition of fix");
    for (let i : number = 0; i < _point.length; ++i) {
        if (_point[i].isfixed) {
            let gi : number = _point[i].id;
            K[3*gi + 0][3*gi + 0] *= 10**9;
            K[3*gi + 1][3*gi + 1] *= 10**9;
            K[3*gi + 2][3*gi + 2] *= 10**9;
        }
    }

    //  Apply boundary condition of force
    console.log("Apply boundary condition of force");
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
    console.log(K, F);
    let u : number[] = Gauss(K, F);
    let umax : number = 0;
    for (let i : number = 0; i < _point.length; ++i) {
        let gi : number = _point[i].id;
        umax = Math.max(umax, Math.abs(u[3*gi + 0]), Math.abs(u[3*gi + 1]));
    }
    console.log(u);

    //  Postprocess for point
    for (let i : number = 0; i < _point.length; ++i) {
        let gi : number = _point[i].id;
        _point[i].ux = u[3*gi + 0]*100/umax;
        _point[i].uy = u[3*gi + 1]*100/umax;
    }

    //  Postprocess for line
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