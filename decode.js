if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
looping = (value, sz) => {
    let afterDecode = [];
    const deadChars = "bcdfghjklmnpqrstvwxyz";
    for(let i=0; i<value.length; i++){
        const char = value[i];
        const vocal = /[AIUEO]/.test(char);
        if(sz){
            if(vocal){
                const vocalLow = char.toLowerCase();
                afterDecode.push(vocalLow);
            }
            else if(char == "s"){
                afterDecode.push("s")
            }
            else if(char == "z"){
                afterDecode.push("z")
            }
            else{
                if(value[i] == '*'){
                    const deadChar = deadChars.charAt(Math.floor(Math.random() * deadChars.length));
                    afterDecode.push(deadChar)
                }
            }
        }else{
            if(vocal){
                const vocalLow = char.toLowerCase();
                afterDecode.push(vocalLow);
            }else{
                if(value[i] == '*'){            
                    const deadChar = deadChars.charAt(Math.floor(Math.random() * deadChars.length));
                    afterDecode.push(deadChar)
                }
            }
        }
    }
    const output = afterDecode.join("");
    return `invalid code, return ${output}`
}

checkSZ = (value) => {
    const sztrue = true;
    const sztfalse = false;
    const s = value.search("s");
    const z = value.search("z");
    const lastValue = value.substring((value.length-1), value.length)
    const SZchar = /[sz]/g.test(value);
    if(SZchar){
        if(lastValue == 's' || lastValue == 'z'){
            if(s >= 0 && z >= 0){
                const swap = value.replace(/s/g, "$");
                const swapS = swap.replace(/z/g, "s");
                const swapZ = swapS.replace(/[$]/g, "z");
                return looping(swapZ, sztrue)
            }else if(s >= 0 && z < 0){
                return "invalid code"
            }else if(s < 0 && z >= 0){
                return "invalid code"
            }else{
                return looping(value, sztfalse)
            }
        }
        else{
            return "invalid code"
        }
    }else{
        return looping(value, sztfalse)
    }
}

exports.decode = (value) => {
    const deadChar = /[bcdfghjklmnpqrtvwxyBCDFGHJKLMNPQRTVWXYaiueo]/g.test(value);
    if(deadChar){
        return "invalid code"
    }
    else if (typeof(localStorage) !== "undefined") {
        const dataEncode = JSON.parse(localStorage.getItem("dataEncode"));
        if (dataEncode.afterEncode == value) {
            return dataEncode.beforeEncode;
        }else{
            return checkSZ(value);
        }
    }
    else{
        return checkSZ(value);
    }
}