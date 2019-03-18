import * as math from "mathjs";

class Methods{
    create_helper(a, b, c, d, n) {
        let alpha = [];
        let beta = [];
        let l = n - 1;
        alpha.push(-c[0] / b[0]);
        beta.push(d[0] / b[0]);
        for (let i = 1; i<l-1; i++) {
            alpha.push(-c[i] / (a[i - 1] * alpha[i - 1] + b[i]));
            beta.push((d[i] - a[i - 1] * beta[i - 1]) / (a[i - 1] * alpha[i - 1] + b[i]));
        }
        return [alpha, beta];
    }

    create_x(a, b, c, d, n) {
        let l = n - 1;
        let [alpha, beta] = this.create_helper(a, b,  c, d, n);
        let x = [];
        x[l - 1] = (d[l - 1] - a[l - 2] * beta[l - 2]) / (a[l - 2] * alpha[l - 2] + b[l - 1]);
        for (let i =l - 2; i> -1; i --) {
            x[i] = alpha[i] * x[i + 1] + beta[i]
        }
        return x
    }

    solve_diff(start, end, y_start, y_end, n, p, q, f, f_user) {
        let abs_error = [];
        y_start = math.eval(y_start);
        y_end = math.eval(y_end);
        let user_ar = [];
        let p_ar = [];
        let q_ar = [];
        let f_ar = [];
        let x = [];
        let y = [];
        let d = [];
        let a = [];
        let b = [];
        let c = [];
        let h = (end - start) / n;
        for (let i = 0; i<n+1; i++) {
            x.push(start + h * i);
            p_ar.push(math.eval(p,{x: x[i]}));
            q_ar.push(math.eval(q,{x: x[i]}));
            f_ar.push(math.eval(f,{x: x[i]}));
            user_ar.push(math.eval(f_user,{x: x[i]}));
        }
        for (let i = 0; i<n-2; i++) {
            a.push(1 - (p_ar[i] * h) / 2);
            c.push(1 + (p_ar[i] * h) / 2);
        }
        for (let i = 0; i<n-1; i++) {
            b.push(q_ar[i] * h ** 2 - 2);
        }
        d.push(f_ar[1] * h ** 2 - y_start * (1 - (p_ar[1] * h) / 2));
        for (let i = 2; i< n-1; i++) {
            d.push(f_ar[i] * h ** 2);
        }
        d.push(f_ar[n - 1] * h ** 2 - y_end * (1 + (p_ar[n-1] * h) / 2));
        y.push(y_start);
        this.create_x(a,b,c,d,n).forEach(value => y.push(value));
        y.push(y_end);
        for (let i = 0; i<n+1; i++) {
            abs_error.push(Math.abs(user_ar[i] - y[i]));
        }
        // console.log(abs_error);
        // y.forEach((v, i) => {
        //    console.log("значениe x: " + x[i] + "| y точный " + math.eval(f_user, {x : x[i]}) + "| найденный y : " + y[i]
        //        + "| абсолютная погрешность " + abs_error[i]+"|");
        // });
        return [y,x,user_ar,abs_error]
    }
// console.log(solve_diff(0, 1, 10));


    Euler(f, f_user, n, x, y , start,end) {
        let x_ar = [x];
        let y_ar = [y];
        let h = (end-start)/n;
        for (let i = 0; i < n; i ++) {
            x_ar.push(x_ar[i] + h);
        }
        for (let i = 0; i < n; i++) {
            y_ar.push(y_ar[i] + h  * math.eval(f, {x: x_ar[i], y: y_ar[i]}));
        }

        let user =  [];
        let diff = [];
        x_ar.forEach((x,i) => {
            user.push(math.eval(f_user,{x:x}));
            diff.push(Math.abs(user[i] - y_ar[i]))
        });

        return [x_ar, y_ar , user, diff]
    }

    Euler_mod_two(f, f_user, n, x, y , start,end) {
        let x_ar = [x];
        let y_ar = [y];
        let h = (end-start)/n;
        for (let i = 0; i < n; i ++) {
            x_ar.push(x_ar[i] +h);
        }
        for (let i = 0; i < n; i++) {
            let y_pred = y_ar[i] + h  * math.eval(f, {x: x_ar[i], y: y_ar[i]});
            y_ar.push(y_ar[i] + h * (math.eval(f, {x: x_ar[i], y: y_ar[i]}) + math.eval(f, {x: x_ar[i+1], y: y_pred})) / 2);
            y_ar[i+1] = (y_ar[i] + h * (math.eval(f, {x: x_ar[i], y: y_ar[i]}) + math.eval(f, {x: x_ar[i+1], y: y_ar[i+1]})) / 2);
        }

        let user =  [];
        let diff = [];
        x_ar.forEach((x,i) => {
            user.push(math.eval(f_user,{x:x}))
            diff.push(Math.abs(user[i] - y_ar[i]))
        });

        return [x_ar, y_ar , user, diff]
    }

    Euler_mod_one(f, f_user, n, x, y , start,end) {
        let x_ar = [x];
        let y_ar = [y];
        let h = (end-start)/n;

        for (let i = 0; i < n; i ++) {
            x_ar.push(x_ar[i] +h);
        }
        for (let i = 0; i < n; i++) {
            let y_pred = y_ar[i] + h  * math.eval(f, {x: x_ar[i], y: y_ar[i]});
            y_ar.push(y_ar[i] + h * (math.eval(f, {x: x_ar[i], y: y_ar[i]}) + math.eval(f, {x: x_ar[i+1], y: y_pred})) / 2);
        }

        let user =  [];
        let diff = [];
        x_ar.forEach((x,i) => {
            user.push(math.eval(f_user,{x:x}))
            diff.push(Math.abs(user[i] - y_ar[i]))
        });

        return [x_ar, y_ar , user, diff]
    }
}

