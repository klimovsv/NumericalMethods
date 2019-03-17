import * as math from 'mathjs'

let length = 1;
let n_steps = 100;

const generate_func = (vars,xvar,funcs) => {
    let functions = [];
    for ( let n = 0 ; n < funcs.length ; n++){
        functions.push((t,args) =>{
            const scope = {};
            scope[xvar] = t;
            for (let i = 0 ; i < vars.length ; i++){
                scope[vars[i]] = args[i];
            }
            console.log(funcs[n],scope);
            return math.eval(funcs[n],scope)
        })
    }
    return functions
};

const runge_step = (t, start, functions, step_size) => {
    let range = functions.length;
    let k1 = [];
    let k2 = [];
    let k3 = [];
    let k4 = [];
    for (let i = 0 ; i < range ; i++ ){
        k1.push(functions[i](t,start)*step_size)
    }
    for (let i = 0 ; i < range ; i++ ){
        k2.push(functions[i](t + step_size/2,start.map((value,i) =>{
            return k1[i]/2 + value
        }))*step_size)
    }
    for (let i = 0 ; i < range ; i++ ){
        k3.push(functions[i](t + step_size/2,start.map((value,i) =>{
            return k2[i]/2 + value
        }))*step_size)
    }
    for (let i = 0 ; i < range ; i++ ){
        k4.push(functions[i](t + step_size,start.map((value,i) =>{
            return k3[i] + value
        }))*step_size)
    }
    return k1.map((value,i)=>{
        return start[i] + (k1[i] + 2 * (k2[i]+k3[i]) + k4[i])/6
    })
};



const runge_kutt = ({
                        start_time,
                        end_time,
                        steps,
                        initial,
                        funcs,
                        user_func,
                        n })=>{
    const step = (end_time-start_time)/steps;

    let time = [];
    for (let t = start_time , i = 0; i <= steps; t+=step,i++){
        time.push(t)
    }

    let result = [];
    console.log(initial);
    for(let i = 0 ; i < n ; i ++) {
        result.push(Number(math.eval(initial[i])))
    }
    console.log(result);

    result = [result];
    for (let i = 0 ; i < steps ; i++){
        let next = runge_step(time[i],result[result.length-1],funcs,step);
        result.push(next)
    }

    console.log(result);
    const user_res = [];
    for(let i = 0 ; i <=steps; i++){
        let tmp = [];
        for(let j = 0 ; j < user_func.length; j++){
            tmp.push(user_func[j](time[i],[]))
        }
        user_res.push(tmp)
    }
    let diff = user_res.map((arr,ind) => {
        return arr.map((el,i) => {
            return Math.abs(el - result[ind][i])
        })
    });

    return [result , user_res ,  diff ,time]
};

const transform_to_system = (n, coefs , f_x) => {
    let functions = [];
    for (let i = 1 ; i < n ; i++){
        functions.push("y" + (i + 1))
    }
    functions.push(`(${f_x} - (${coefs.map((c,ind) => {
        if (ind < n){
            return `(${coefs[ind]})*y${ind+1}`
        }
    }).slice(0,n).reduce(
        (a,b) => {
            return a + '+' +b
        }
    )}) )/(${coefs[n]})`);
    return functions
};


const system_solver = (e) => {
    const values = e.data;
    const command = e.data.cmd;
    const n = values.number;
    const vars = values.vars;
    const functions = [];
    const user_f = [];
    const vals = values.vals;

    for (let i = 0; i < n; i++) {
        let fun = [];
        for (let j = 0; j < n; j++) {
            fun.push(`(${vals[i][j]})*(${vars[j]})`)
        }
        if (!e.data.homogeneous){
            fun.push(vals[i][n]);
        }
        user_f.push(values.user[i]);
        functions.push(fun.join(" + "))
    }
    const funcs = generate_func(vars.slice(0, n), "t", functions);
    const user = generate_func([], "t", user_f);

    const [result, user_res, diff, time] = runge_kutt({
        start_time: values.start,
        end_time: values.start + length,
        steps: n_steps,
        funcs: funcs,
        user_func: user,
        n: n,
        initial: vals.start
    });

    postMessage({
        ok: true,
        cmd: command,
        data: e.data,
        result: result,
        user: user_res,
        diff: diff,
        time: time
    });
};

const bash_moul = (result,steps,step,f,time,n) => {
    let y_r = result.slice(0,4);
    for (let i = 3; i < steps; i++) {
        let local_y = [];
        let f_pred_loc = [];
        let y_pred_loc = [];

        for ( let j = 0 ; j < n ; j++){
            let y_pred = y_r[i][j] +(step/24)*(55*f[j](time[i],y_r[i])-59*f[j](time[i-1],y_r[i-1]) + 37 * f[j](time[i-2],y_r[i-2]) -9 * f[j](time[i-3],y_r[i-3]));
            y_pred_loc.push(y_pred)
        }

        for ( let j = 0 ; j < n ; j++){
            let f_pred = f[j](time[i+1],y_pred_loc);
            f_pred_loc.push(f_pred)
        }

        for ( let j = 0 ; j < n ; j++){
            local_y.push(y_r[i][j] + step*(9*f_pred_loc[j] + 19 *f[j](time[i],y_r[i]) - 5 * f[j](time[i-1],y_r[i-1]) + f[j](time[i-2],y_r[i-2]) )/24)
        }

        y_r.push(local_y)
    }
    return y_r
};

const admas_bash = (initial,steps,step,f,time,n) => {
    let y_r = [initial];
    for(let i = 0 ; i < steps ; i++){
        let y_loc = [];
        for ( let j = 0 ; j < n ; j++){
            y_loc.push(y_r[i][j] + step * f[j](time[i],y_r[i]))
        }
        y_r.push(y_loc)
    }
    return y_r
};

const adams = ({start_time,
                   end_time,
                   steps,
                   initial,
                   funcs,
                   user_func,
                   n,
                    type}) => {
    const step = (end_time-start_time)/steps;
    let [result, user_res, diff, time] = runge_kutt({start_time,
        end_time,
        steps,
        initial,
        funcs,
        user_func,
        n
    });


    let res;
    if (type === 1){
        res = bash_moul(result,steps,step,funcs,time,n);
    }else{
        res = admas_bash(initial,steps,step,funcs,time,n)
    }

    user_res = [];
    for(let i = 0 ; i <=steps; i++){
        let tmp = [];
        for(let j = 0 ; j < user_func.length; j++){
            tmp.push(user_func[j](time[i],[]))
        }
        user_res.push(tmp)
    }
    diff = user_res.map((arr,ind) => {
        return arr.map((el,i) => {
            return Math.abs(el - res[ind][i])
        })
    });
    return [result , user_res ,  diff ,time]
};

// комманды для систем
// 1 - с разделяющимися переменными
// 2 - однородные урванения
// 10 - пост одн
// 11 - пост неодн
// 12 - непост одн
// 13 - непост неодн
// 14 - уравнения deg-го порядка

// eslint-disable-next-line
self.addEventListener('message',(e) => {
    const command = e.data.cmd;
    switch (command) {
        case -1:
            n_steps = Number(e.data.steps);
            break;
        case 0:
            length = Number(e.data.length);
            break;
        case 1:
            (()=>{
                const values = e.data;
                const mode = e.data.mode;
                const user_f = generate_func([], "x", [values.user]);
                const initial = [values.start_value];
                let funcs;
                if (mode === 1){
                    funcs = generate_func(['y'],"x",[`-((${values.m})*(${values.n}))/((${values.p})*(${values.q}))`])
                }else{
                    funcs = generate_func(['y'],"x",[`${values.f}`])
                }

                const [result, user_res, diff, time] = runge_kutt({
                    start_time: values.start,
                    end_time: values.start + length,
                    steps: n_steps,
                    funcs: funcs,
                    user_func: user_f,
                    n: 1,
                    initial: initial
                });
                postMessage({
                    ok: true,
                    cmd: command,
                    data: e.data,
                    result: result.map(v => v[0]),
                    user: user_res.map(v => v[0]),
                    diff: diff.map(v => v[0]),
                    time: time
                });
            })();
            break;
        case 2:
            (()=>{
                const values = e.data;
                const mode = e.data.mode;
                const user_f = generate_func([], "x", [values.user]);
                const initial = [values.start_value];
                let funcs = generate_func(['y'],"x",[`-(${values.m})/(${values.n})`])

                const [result, user_res, diff, time] = runge_kutt({
                    start_time: values.start,
                    end_time: values.start + length,
                    steps: n_steps,
                    funcs: funcs,
                    user_func: user_f,
                    n: 1,
                    initial: initial
                });
                postMessage({
                    ok: true,
                    cmd: command,
                    data: e.data,
                    result: result.map(v => v[0]),
                    user: user_res.map(v => v[0]),
                    diff: diff.map(v => v[0]),
                    time: time
                });
            })();
            break;
        case 3:
            (()=>{
                const v = e.data;
                const mode = e.data.mode;
                const user_f = generate_func([], "x", [v.user]);
                const initial = [v.start_value];
                let funcs;
                switch (mode) {
                    case 1:
                        funcs = generate_func(['y'],"x",[`(${v.b})-(${v.a})*y`]);
                        break;
                    case 2:
                        funcs = generate_func(['y'],"x",[`(${v.b})*y^(${v.n})-(${v.a})*y`]);
                        break;
                    case 3:
                        funcs = generate_func(['y'],"x",[`(${v.c})-(${v.a})*y - (${v.b})*y^2`]);
                        break;
                }
                const [result, user_res, diff, time] = runge_kutt({
                    start_time: v.start,
                    end_time: v.start + length,
                    steps: n_steps,
                    funcs: funcs,
                    user_func: user_f,
                    n: 1,
                    initial: initial
                });
                postMessage({
                    ok: true,
                    cmd: command,
                    data: e.data,
                    result: result.map(v => v[0]),
                    user: user_res.map(v => v[0]),
                    diff: diff.map(v => v[0]),
                    time: time
                });
            })();
            break;
        case 10:
            system_solver(e);
            break;
        case 11:
            system_solver(e);
            break;
        case 12:
            system_solver(e);
            break;
        case 13:
            system_solver(e);
            break;
        case 14:
            let values = e.data;
            let mode = e.data.mode;
            let functions;
            if (mode === 1){
                functions = transform_to_system(values.deg,values.coefs,values.f);
            }else if(mode === 2){
                functions = transform_to_system(values.deg,values.coefs,"0");
            }else if (mode === 3){
                functions = transform_to_system(values.deg,values.coefs.map((c,i) => `x^${i} *(${c})`),values.f);
            }
            console.log(functions);
            const funcs = generate_func(values.coefs.map((v,i)=> `y${i+1}`).slice(0,values.deg), "x", functions);
            const user = generate_func([], "x", [values.user]);


            const [result, user_res, diff, time] = adams({
                start_time: values.start,
                end_time: values.start + length,
                steps: n_steps,
                funcs: funcs,
                user_func: user,
                n: values.deg,
                initial: values.start_v,
                tepe:1
            });
            postMessage({
                ok: true,
                cmd: command,
                data: e.data,
                result: result.map(v => v[0]),
                user: user_res.map(v => v[0]),
                diff: diff.map(v => v[0]),
                time: time
            });
            break;
        case 15:
            (()=>{
                const values = e.data;
                const mode = e.data.mode;
                const user_f = generate_func([], "x", [values.user]);
                const initial = [values.start_value];
                let funcs = generate_func(['y'],"x",[`${values.f}`]);

                const [result, user_res, diff, time] = runge_kutt({
                    start_time: values.start,
                    end_time: values.start + length,
                    steps: n_steps,
                    funcs: funcs,
                    user_func: user_f,
                    n: 1,
                    initial: initial
                });
                postMessage({
                    ok: true,
                    cmd: command,
                    data: e.data,
                    result: result.map(v => v[0]),
                    user: user_res.map(v => v[0]),
                    diff: diff.map(v => v[0]),
                    time: time
                });
            })();
            break;
        case 16:
            (()=>{
                const values = e.data;
                const user_f = generate_func([], "x", [values.user_y,values.user_z]);
                const initial = [values.start_value_y,values.start_value_z];
                let funcs = generate_func(['y','z'],"x",[`${values.f}`,`${values.g}`]);

                const [result, user_res, diff, time] = runge_kutt({
                    start_time: values.start,
                    end_time: values.start + length,
                    steps: n_steps,
                    funcs: funcs,
                    user_func: user_f,
                    n: 2,
                    initial: initial
                });
                postMessage({
                    ok: true,
                    cmd: command,
                    data: e.data,
                    result: result,
                    user: user_res,
                    diff: diff,
                    time: time
                });
            })();
            break;
        default:
            postMessage({ok:false,msg:"unsupported command",cmd: command})
    }
});