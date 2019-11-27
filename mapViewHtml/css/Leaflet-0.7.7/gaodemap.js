﻿(function (config) {
    var e = navigator.userAgent.toLowerCase(), z = window, aa = document;
    function C(a) { return -1 !== e.indexOf(a) }
    var da = C("ucbrowser"),
        ea = C("micromessenger"),
        fa = C("mqqbrowser"),
        E = "ActiveXObject" in z,
        ga = E && !z.XMLHttpRequest,
        ha = E && !aa.querySelector, ia = E && !aa.addEventListener,
        ja = E && C("ie 9"), ka = E && C("rv:11"), 
        na = z.navigator && z.navigator.msPointerEnabled && !!z.navigator.msMaxTouchPoints,
        qa = na || C("touch") || "ontouchstart" in aa, ra = C("webkit"), chrome = C("chrome"), sa = C("firefox"),
        ta = C("android"), ua = -1 !== e.search(/android [123]/), va = ta && !ua, wa = C("windows phone"),
        xa = "devicePixelRatio" in z && 1 < z.devicePixelRatio || E && "matchMedia" in
z && z.matchMedia("(min-resolution:144dpi)") && z.matchMedia("(min-resolution:144dpi)").matches, ya = C("ipad;"),
Aa = ya && xa, Ba = C("ipod touch;"), Ca = C("iphone;"),
Da = Ca || ya || Ba, Ea = C("safari"), Fa = Da && -1 === e.search(/ os [456]_/),
Ga = ta || Da || wa || C("mobile") || "undefined" !== typeof orientation, Ha = aa.documentElement, Ia = E && "transition" in Ha.style,
Ja = !!aa.createElementNS && !!aa.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
Ka = !!aa.createElement("canvas").getContext,
La = "WebKitCSSMatrix" in z && "m11" in
new window.WebKitCSSMatrix, Ma = "MozPerspective" in Ha.style, Na = "OTransition" in Ha.style, Oa = Ia || La || Ma || Na, Pa = C("windows nt"),
Qa = !Ga && Pa && -1 !== e.search(/nt [1-5]\./), Ra = C("baidubrowser"), Sa;
    if (!(Sa = !Ka)) {
        var Va; if (!(Va = ja)) {
            var Wa; if (!(Wa = ta && !(va && (-1 !== e.search(/m351|firefox/) ? 0 : ea && fa ? -1 === e.search(/hm note|gt-|m1 note/) : C("gt-n710") && -1 !== e.search(/android( |\/)4\.1/) ? 0 : -1 !== e.search(/ucbrowser\/((9\.[0-5]\.)|(10\.))/) ? -1 === e.search(/huawei( p6|h30)/) : C("baidubrowser") ? -1 === e.search(/hm201|sm-g900/) : -1 !== e.search(/lbbrowser|360|liebao|oupeng|mqqbrowser|sogou|micromessenger|chrome/) || !C("ucbrowser") && -1 !== e.search(/sm-n900|(gt-(n710|i95|p[67]))|(mi( [1-4]|-one))|(huawei( p6|_c8813|h30| g750))|lenovo k900|coolpad_9150/))))) {
                var Xa;
                if (Xa = Ca) {
                    var Ya = screen.width; Xa = !(Fa && (da || ea ? !(375 < Ya) : Ea))
                } Wa = Xa || Ba || Aa || wa || Ga && sa || Pa && C("version")
            } Va = Wa
        } Sa = Va
    } var Za = Sa, $a = !1; try { $a = "undefined" !== typeof z.localStorage } catch (ab) { } var bb = void 0 !== config[8] ? config[8] : !0, cb = void 0 !== config[9] ? config[9] : !0;
    config.h = {
        size: 200, Ep: C("macintosh"), YR: Pa, ot: Ra, RU: fa, Sk: E, td: ga, Pm: ha, Pc: ia, pO: E && !ka, VR: ra, Dp: $a, Xd: ta, $S: ua, vq: da, chrome: chrome, HB: sa, iU: Ia, WR: La, FT: Ma, JU: Na, NL: Oa, X: Ga, GU: Ga && ra, bP: Ga && La, FU: Ga && z.opera, pC: Da, oc: qa, SC: na, jU: ja, ja: xa, jh: Ja, Tk: Ka, oU: !!z.zS, nD: Za, pg: bb && !Za && !Qa, yu: cb && !!z.WebSocket && !Ra, mD: !Ja && Ga && Ka
    };
    config.h.bv = config.h.Xd ? "android" : config.h.pC ? "ios" : config.h.YR ? "windows" : config.h.Ep ? "mac" : "other";
    var z = window, F = "http map anip layers overlay0 brender mrender".split(" "); config.vd = "main";
    config.h.oc && (F += ",touch", config.vd += "t"); config.h.X || (F += ",mouse", config.vd += "m");
    config.vd += "c"; config.h.pg && (config.vd += "v", F += ",vectorlayer,overlay", F += ",vp", config.vd += "p");
    config[7] && (F += "," + config[7], config.vd += config[7].replace(",", "").replace(eval("/AMap./gi"), ""));
    F += ",sync"; config.WE = F.split(","); window.AMap = window.AMap || {}; window.AMap.Gg = "1.3.13.3";
    var db = window.AMap.Xv = {}, eb = config[2].split(",")[0], fb = eb + "/theme/v" + config[4] + "/style1.3.13.3.css", gb = document.head || document.getElementsByTagName("head")[0];
    if (gb) {
        var hb = document.createElement("link");
        hb.setAttribute("rel", "stylesheet"); hb.setAttribute("type", "text/css");
        hb.setAttribute("href", fb); gb.insertBefore(hb, gb.firstChild)
    } else document.write("<link rel='stylesheet' href='" + fb + "'/>");
function ib(){
        var a = jb, b = document, c = b.createElement("script"); c.charset = "utf-8"; c.src = a; (a = b.body || gb) && a.appendChild(c)
}
var kb = (new Date).getTime();
db.__load__ = function (a) {
    a(config, kb);
    delete db.__load__
}; try {
    if (window.localStorage)
    { var lb = window.localStorage["_AMap_" + config.vd], mb = !1; lb ? (lb = JSON.parse(lb), lb.version === window.AMap.Gg ? (eval(lb.script), db.loaded = !0) : mb = !0) : mb = !0; if (mb) for (var J in window.localStorage) window.localStorage.hasOwnProperty(J) && 0 === J.indexOf("_AMap_") && window.localStorage.removeItem(J) }
} catch (nb) { }
if (!db.loaded) {
    for (var jb = eb + "/maps/main?v=" + config[4] + "&key=" + config[0] + "&m=" + config.WE.join(",") + "&vrs=1.3.13.3", ob = document.getElementsByTagName("script"), pb, qb = 0; qb < ob.length; qb += 1) if (0 === ob[qb].src.indexOf(eb.split(":")[1] + "/maps?"))
    { pb = ob[qb]; break }
    config[5] || pb && pb.async ? ib() : (document.write('<script id="amap_main_js" src=\'' + jb + "' type='text/javascript'>\x3c/script>"), document.getElementById("amap_main_js") || ib());
    delete config.WE
};
})(["bfe31f4e0fb231d29e1d3ce951e2c780",[113.702281,29.969077,115.082573,31.36126,114.298572,30.584355],"http://webapi.amap.com",1,"1.3","initTheMap","420100","",true,true])