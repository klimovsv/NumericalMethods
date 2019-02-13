import * as math from 'mathjs'

class Validator{
    vilidate_vars(expr,var_arr){
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
                   if (!var_arr.includes(node.name)){
                       error = "no variable"
                   }
                   break;
               default:
                   break;
           }
        });
        return error;
    }

    validate_number(expr){
        return this.vilidate_vars(expr,[])
    }
}

export default new Validator();