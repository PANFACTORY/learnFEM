/// <reference path="point.ts">
/// <reference path="line.ts">
/// <reference path="solver.ts">

const Optimize = (_point : Point[], _line : Line[], _$svg) => {
    //  Parameters
    let amax : number = 900, smax : number = 1, smin : number = 1e-2;
    let itrmax : number = 100, iota : number = 1.0, eps : number = 1e-5, movelimit : number = 0.05, weightlimit : number = 0.5, p : number = 3;
    let s : number[] = new Array(_line.length), snew : number[] = new Array(_line.length);
    for (let k : number = 0; k < _line.length; ++k) {
        s[k] = 0.5;
        _line[k].area = amax*s[k]**p;
    }

    //  Initialize
    let g0 : number = 0;
    for (let k : number = 0; k < _line.length; ++k) {
        g0 += amax*s[k]*_line[k].point[0].Distance(_line[k].point[1]);
    }

    //  Optimization loop
    let dfdd : number[] = new Array(_line.length), dgdd : number[] = new Array(_line.length);
    for (let itr : number = 0; itr < itrmax; ++itr) {
        //  Set area from design variable
        for (let k : number = 0; k < _line.length; ++k) {
            _line[k].area = amax*s[k]**p;
        }

        //  Get constraint function value and sensitivity
        let gnow : number = -1;
        for (let k : number = 0; k < _line.length; ++k) {
            gnow += amax*s[k]*_line[k].point[0].Distance(_line[k].point[1])/(g0*weightlimit);
            dgdd[k] = amax*_line[k].point[0].Distance(_line[k].point[1])/(g0*weightlimit);
        }

        //  Get objective function value
        let fnow : number = 0;
        Solve(_point, _line, false);
        for (let k : number = 0; k < _point.length; ++k) {
            fnow += _point[k].ux*_point[k].forcex + _point[k].uy*_point[k].forcey;
        }

        //  Get objective function sensitivity
        for (let k : number = 0; k < _line.length; ++k) {
            dfdd[k] = 0;
            let Ke : number[][] = _line[k].SensitivityMatrix();
            for (let i : number = 0; i < _line[k].point.length; ++i) {
                let uxi : number = _line[k].point[i].ux, uyi : number = _line[k].point[i].uy, uti : number = _line[k].point[i].ut;
                for (let j : number = 0; j < _line[k].point.length; ++j) {
                    let uxj : number = _line[k].point[j].ux, uyj : number = _line[k].point[j].uy, utj : number = _line[k].point[j].ut;
                    dfdd[k] -= uxi*Ke[3*i + 0][3*j + 0]*uxj + uxi*Ke[3*i + 0][3*j + 1]*uyj + uxi*Ke[3*i + 0][3*j + 2]*utj
                        + uyi*Ke[3*i + 1][3*j + 0]*uxj + uyi*Ke[3*i + 1][3*j + 1]*uyj + uyi*Ke[3*i + 1][3*j + 2]*utj
                        + uti*Ke[3*i + 2][3*j + 0]*uxj + uti*Ke[3*i + 2][3*j + 1]*uyj + uti*Ke[3*i + 2][3*j + 2]*utj;
                }
            }
            dfdd[k] *= amax*p*s[k]**(p - 1);
        }

        //  Update design variable
        let lambda0 : number = 0, lambda1 : number = 1e4, lambda : number;
        while (lambda1 - lambda0 > eps*(lambda1 + lambda0)) {
            lambda = 0.5*(lambda1 + lambda0);

            for (let k : number = 0; k < _line.length; ++k) {
                snew[k] = Math.pow(-dfdd[k]/(dgdd[k]*lambda), iota)*s[k];
                if(snew[k] < Math.max(smin, (1.0 - movelimit)*s[k])) {
					snew[k] = Math.max(smin, (1.0 - movelimit)*s[k]);
				} else if(snew[k] > Math.min(smax, (1.0 + movelimit)*s[k])) {
					snew[k] = Math.min(smax, (1.0 + movelimit)*s[k]);
				}
            }

            let gnew : number = 0;
            for (let k : number = 0; k < _line.length; ++k) {
                gnew += amax*snew[k]*_line[k].point[0].Distance(_line[k].point[1]);
            }
            if (gnew > weightlimit*g0) {
                lambda0 = lambda;
            } else {
                lambda1 = lambda;
            }
        }
        for (let k : number = 0; k < _line.length; ++k) {
            s[k] = snew[k];
        }
        console.log(itr, fnow, gnow);
        //console.log("itr", itr, "lambda", lambda, "g", gnow, "dfdd", dfdd, "dgdd", dgdd, "dnew", dnew);
    }

    //  Export result
    while (_$svg.firstChild) {
        _$svg.removeChild(_$svg.firstChild);
    }
    for (let k : number = 0; k < _line.length; ++k) {
        const $line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        $line.setAttributeNS(null, "x1", `${_line[k].point[0].x}`);
        $line.setAttributeNS(null, "y1", `${_line[k].point[0].y}`);
        $line.setAttributeNS(null, "x2", `${_line[k].point[1].x}`);
        $line.setAttributeNS(null, "y2", `${_line[k].point[1].y}`);
        $line.setAttributeNS(null, "stroke", "black");
        $line.setAttributeNS(null, "stroke-width", `${Math.sqrt(_line[k].area)}px`);
        _$svg.appendChild($line);
    }
}