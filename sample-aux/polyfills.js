/*
 *  Selected ES 6 polyfills for IE
*/

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(f) {
        for (var i=0; i<this.length; i++) {
            f(this[i]);
        }
    }
}
if (!Array.prototype.find) {
    Array.prototype.find = function(f) {
        for (var i=0; i<this.length; i++) {
            if (f(this[i])) return this[i];
        }
        return undefined;
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(str) {
        if (this.length < str.length) return false;
        return this.substr(0, str.length) === str;
    }
}