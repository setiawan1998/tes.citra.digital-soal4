if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

loopingEncode = (value, sz) => {
    let afterEncode = [];
    for(let i=0; i<value.length; i++){
        const char = value[i];
        const vocal = /[aiueo]/.test(char);
        if(sz){
            if(vocal){
                const vocalUp = char.toUpperCase();
                afterEncode.push(vocalUp)
            }
            else if(char == "s"){
                afterEncode.push("s")
            }
            else if(char == "z"){
                afterEncode.push("z")
            }
            else{
                afterEncode.push(`${i}*`);
            }
        }else{
            if(vocal){
                const vocalUp = char.toUpperCase();
                afterEncode.push(vocalUp)
            }
            else{
                afterEncode.push(`${i}*`);
            }
        }
    };
    const output = afterEncode.join("");
    const data = {
        beforeEncode: value,
        afterEncode: output
    }
    localStorage.setItem("dataEncode", JSON.stringify(data));
    return output;
}


exports.encode = (value) => {
    const sztrue = true;
    const sztfalse = false;
    const lastValue = value.substring((value.length-1), value.length);
    const regexSymbol = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/#@]/g.test(value);
    if(regexSymbol){
        return "invalid character";
    }else{
        if(lastValue == 's' || lastValue == 'z'){
            const s = value.search("s");
            const z = value.search("z");
            if(s >= 0 && z >= 0){
                const swap = value.replace(/s/g, "$");
                const swapS = swap.replace(/z/g, "s");
                const swapZ = swapS.replace(/[$]/g, "z");
                return loopingEncode(swapZ, sztrue);
            }else{
                return loopingEncode(value, sztfalse);
            }
        }else{
            return loopingEncode(value, sztfalse);
        }s
    }
}