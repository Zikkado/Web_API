const TokenGenerete = function generate_token(length){
    //edit the token allowed characters
    var caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var array = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (caracteres.length-1)).toFixed(0);
        array[i] = caracteres[j];
    }
    return array.join("");
}

module.exports = TokenGenerete;