import * as math from 'mathjs'
import React from "react";



class Validator{
    validate_vars(var_arr){
        const accepted_fun = [
            'cos','sin','e','exp','log','pi','sqrt','tan','cot','sec','sinh','cosh','tanh'
        ];
        return (expr) => {
            let node;
            let error;
            expr = expr.trim();
            if(expr.length === 0 ){
                error = "null length";
                return error;
            }
            try {
                node = math.parse(expr);
            }catch (e) {
                error = "parsing error";
                return error
            }
            node.traverse( node => {
                switch (node.type) {
                    case 'SymbolNode':
                        if (!var_arr.includes(node.name) && !accepted_fun.includes(node.name)){
                            error = "no variable"
                        }
                        break;
                    default:
                        break;
                }
            });
            return error;
        }
    }
}

export default new Validator();