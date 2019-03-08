import * as math from 'mathjs'

const generate_func = (vars,xvar,funcs) => {
    let functions = [];
    for ( let n = 0 ; n < funcs.length ; n++){
        functions.push((t,args) =>{
            const scope = {};
            scope[xvar] = t;
            for (let i = 0 ; i < vars.length ; i++){
                scope[vars[i]] = args[i];
            }
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
    for (let t = start_time ; t <= end_time; t+=step){
        time.push(t)
    }


    let result = [];
    for(let i = 0 ; i < n ; i ++) {
        result.push(Number(initial[i]))
    }
    result = [result];
    for (let i = 0 ; i < steps ; i++){
        let next = runge_step(time[i],result[result.length-1],funcs,step);
        result.push(next)
    }

    const user_res = [];
    for(let i = 0 ; i < steps; i++){
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
            return `${coefs[ind]}y${ind+1}`
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
            fun.push(`${vals[i][j]}*${vars[j]}`)
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
        end_time: values.start + 1,
        steps: 100,
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


// комманды для систем
// 1 - с разделяющимися переменными
// 10 - пост одн
// 11 - пост неодн
// 12 - непост одн
// 13 - непост неодн
// 14 - уравнения deg-го порядка

// eslint-disable-next-line
self.addEventListener('message',(e) => {
    const command = e.data.cmd;
    switch (command) {
        case 1:
            (()=>{
                const values = e.data;

                const mode = e.data.mode;
                if (mode === 1){

                }else{

                }

                postMessage({ok:true,msg:"success",cmd : command});
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
            const functions = transform_to_system(values.deg,values.coefs,values.f);
            const funcs = generate_func(values.coefs.map((v,i)=> `y${i+1}`).slice(0,values.deg), "x", functions);
            const user = generate_func([], "x", [values.user]);


            const [result, user_res, diff, time] = runge_kutt({
                start_time: values.start,
                end_time: values.start + 1,
                steps: 100,
                funcs: funcs,
                user_func: user,
                n: values.deg,
                initial: values.start_v
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
        default:
            postMessage({ok:false,msg:"unsupported command",cmd: command})
    }
});