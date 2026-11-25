/* AUTOMATISCH ERZEUGT aus frei/rough.js, frei/kreide.js, woerter.csv, src/bilder.js, src/app.js – nicht von Hand ändern (zusammensetzen.py) */
var rough=function(){"use strict";function t(t,e,s){if(t&&t.length){const[n,o]=e,a=Math.PI/180*s,h=Math.cos(a),r=Math.sin(a);for(const e of t){const[t,s]=e;e[0]=(t-n)*h-(s-o)*r+n,e[1]=(t-n)*r+(s-o)*h+o}}}function e(t,e){return t[0]===e[0]&&t[1]===e[1]}function s(s,n,o,a=1){const h=o,r=Math.max(n,.1),i=s[0]&&s[0][0]&&"number"==typeof s[0][0]?[s]:s,c=[0,0];if(h)for(const e of i)t(e,c,h);const l=function(t,s,n){const o=[];for(const s of t){const t=[...s];e(t[0],t[t.length-1])||t.push([t[0][0],t[0][1]]),t.length>2&&o.push(t)}const a=[];s=Math.max(s,.1);const h=[];for(const t of o)for(let e=0;e<t.length-1;e++){const s=t[e],n=t[e+1];if(s[1]!==n[1]){const t=Math.min(s[1],n[1]);h.push({ymin:t,ymax:Math.max(s[1],n[1]),x:t===s[1]?s[0]:n[0],islope:(n[0]-s[0])/(n[1]-s[1])})}}if(h.sort(((t,e)=>t.ymin<e.ymin?-1:t.ymin>e.ymin?1:t.x<e.x?-1:t.x>e.x?1:t.ymax===e.ymax?0:(t.ymax-e.ymax)/Math.abs(t.ymax-e.ymax))),!h.length)return a;let r=[],i=h[0].ymin,c=0;for(;r.length||h.length;){if(h.length){let t=-1;for(let e=0;e<h.length&&!(h[e].ymin>i);e++)t=e;h.splice(0,t+1).forEach((t=>{r.push({s:i,edge:t})}))}if(r=r.filter((t=>!(t.edge.ymax<=i))),r.sort(((t,e)=>t.edge.x===e.edge.x?0:(t.edge.x-e.edge.x)/Math.abs(t.edge.x-e.edge.x))),(1!==n||c%s==0)&&r.length>1)for(let t=0;t<r.length;t+=2){const e=t+1;if(e>=r.length)break;const s=r[t].edge,n=r[e].edge;a.push([[Math.round(s.x),i],[Math.round(n.x),i]])}i+=n,r.forEach((t=>{t.edge.x=t.edge.x+n*t.edge.islope})),c++}return a}(i,r,a);if(h){for(const e of i)t(e,c,-h);!function(e,s,n){const o=[];e.forEach((t=>o.push(...t))),t(o,s,n)}(l,c,-h)}return l}function n(t,e){var n;const o=e.hachureAngle+90;let a=e.hachureGap;a<0&&(a=4*e.strokeWidth),a=Math.round(Math.max(a,.1));let h=1;return e.roughness>=1&&((null===(n=e.randomizer)||void 0===n?void 0:n.next())||Math.random())>.7&&(h=a),s(t,a,o,h||1)}class o{constructor(t){this.helper=t}fillPolygons(t,e){return this._fillPolygons(t,e)}_fillPolygons(t,e){const s=n(t,e);return{type:"fillSketch",ops:this.renderLines(s,e)}}renderLines(t,e){const s=[];for(const n of t)s.push(...this.helper.doubleLineOps(n[0][0],n[0][1],n[1][0],n[1][1],e));return s}}function a(t){const e=t[0],s=t[1];return Math.sqrt(Math.pow(e[0]-s[0],2)+Math.pow(e[1]-s[1],2))}class h extends o{fillPolygons(t,e){let s=e.hachureGap;s<0&&(s=4*e.strokeWidth),s=Math.max(s,.1);const o=n(t,Object.assign({},e,{hachureGap:s})),h=Math.PI/180*e.hachureAngle,r=[],i=.5*s*Math.cos(h),c=.5*s*Math.sin(h);for(const[t,e]of o)a([t,e])&&r.push([[t[0]-i,t[1]+c],[...e]],[[t[0]+i,t[1]-c],[...e]]);return{type:"fillSketch",ops:this.renderLines(r,e)}}}class r extends o{fillPolygons(t,e){const s=this._fillPolygons(t,e),n=Object.assign({},e,{hachureAngle:e.hachureAngle+90}),o=this._fillPolygons(t,n);return s.ops=s.ops.concat(o.ops),s}}class i{constructor(t){this.helper=t}fillPolygons(t,e){const s=n(t,e=Object.assign({},e,{hachureAngle:0}));return this.dotsOnLines(s,e)}dotsOnLines(t,e){const s=[];let n=e.hachureGap;n<0&&(n=4*e.strokeWidth),n=Math.max(n,.1);let o=e.fillWeight;o<0&&(o=e.strokeWidth/2);const h=n/4;for(const r of t){const t=a(r),i=t/n,c=Math.ceil(i)-1,l=t-c*n,u=(r[0][0]+r[1][0])/2-n/4,p=Math.min(r[0][1],r[1][1]);for(let t=0;t<c;t++){const a=p+l+t*n,r=u-h+2*Math.random()*h,i=a-h+2*Math.random()*h,c=this.helper.ellipse(r,i,o,o,e);s.push(...c.ops)}}return{type:"fillSketch",ops:s}}}class c{constructor(t){this.helper=t}fillPolygons(t,e){const s=n(t,e);return{type:"fillSketch",ops:this.dashedLine(s,e)}}dashedLine(t,e){const s=e.dashOffset<0?e.hachureGap<0?4*e.strokeWidth:e.hachureGap:e.dashOffset,n=e.dashGap<0?e.hachureGap<0?4*e.strokeWidth:e.hachureGap:e.dashGap,o=[];return t.forEach((t=>{const h=a(t),r=Math.floor(h/(s+n)),i=(h+n-r*(s+n))/2;let c=t[0],l=t[1];c[0]>l[0]&&(c=t[1],l=t[0]);const u=Math.atan((l[1]-c[1])/(l[0]-c[0]));for(let t=0;t<r;t++){const a=t*(s+n),h=a+s,r=[c[0]+a*Math.cos(u)+i*Math.cos(u),c[1]+a*Math.sin(u)+i*Math.sin(u)],l=[c[0]+h*Math.cos(u)+i*Math.cos(u),c[1]+h*Math.sin(u)+i*Math.sin(u)];o.push(...this.helper.doubleLineOps(r[0],r[1],l[0],l[1],e))}})),o}}class l{constructor(t){this.helper=t}fillPolygons(t,e){const s=e.hachureGap<0?4*e.strokeWidth:e.hachureGap,o=e.zigzagOffset<0?s:e.zigzagOffset,a=n(t,e=Object.assign({},e,{hachureGap:s+o}));return{type:"fillSketch",ops:this.zigzagLines(a,o,e)}}zigzagLines(t,e,s){const n=[];return t.forEach((t=>{const o=a(t),h=Math.round(o/(2*e));let r=t[0],i=t[1];r[0]>i[0]&&(r=t[1],i=t[0]);const c=Math.atan((i[1]-r[1])/(i[0]-r[0]));for(let t=0;t<h;t++){const o=2*t*e,a=2*(t+1)*e,h=Math.sqrt(2*Math.pow(e,2)),i=[r[0]+o*Math.cos(c),r[1]+o*Math.sin(c)],l=[r[0]+a*Math.cos(c),r[1]+a*Math.sin(c)],u=[i[0]+h*Math.cos(c+Math.PI/4),i[1]+h*Math.sin(c+Math.PI/4)];n.push(...this.helper.doubleLineOps(i[0],i[1],u[0],u[1],s),...this.helper.doubleLineOps(u[0],u[1],l[0],l[1],s))}})),n}}const u={};class p{constructor(t){this.seed=t}next(){return this.seed?(2**31-1&(this.seed=Math.imul(48271,this.seed)))/2**31:Math.random()}}const f=0,d=1,g=2,M={A:7,a:7,C:6,c:6,H:1,h:1,L:2,l:2,M:2,m:2,Q:4,q:4,S:4,s:4,T:2,t:2,V:1,v:1,Z:0,z:0};function k(t,e){return t.type===e}function b(t){const e=[],s=function(t){const e=new Array;for(;""!==t;)if(t.match(/^([ \t\r\n,]+)/))t=t.substr(RegExp.$1.length);else if(t.match(/^([aAcChHlLmMqQsStTvVzZ])/))e[e.length]={type:f,text:RegExp.$1},t=t.substr(RegExp.$1.length);else{if(!t.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/))return[];e[e.length]={type:d,text:`${parseFloat(RegExp.$1)}`},t=t.substr(RegExp.$1.length)}return e[e.length]={type:g,text:""},e}(t);let n="BOD",o=0,a=s[o];for(;!k(a,g);){let h=0;const r=[];if("BOD"===n){if("M"!==a.text&&"m"!==a.text)return b("M0,0"+t);o++,h=M[a.text],n=a.text}else k(a,d)?h=M[n]:(o++,h=M[a.text],n=a.text);if(!(o+h<s.length))throw new Error("Path data ended short");for(let t=o;t<o+h;t++){const e=s[t];if(!k(e,d))throw new Error("Param not a number: "+n+","+e.text);r[r.length]=+e.text}if("number"!=typeof M[n])throw new Error("Bad segment: "+n);{const t={key:n,data:r};e.push(t),o+=h,a=s[o],"M"===n&&(n="L"),"m"===n&&(n="l")}}return e}function y(t){let e=0,s=0,n=0,o=0;const a=[];for(const{key:h,data:r}of t)switch(h){case"M":a.push({key:"M",data:[...r]}),[e,s]=r,[n,o]=r;break;case"m":e+=r[0],s+=r[1],a.push({key:"M",data:[e,s]}),n=e,o=s;break;case"L":a.push({key:"L",data:[...r]}),[e,s]=r;break;case"l":e+=r[0],s+=r[1],a.push({key:"L",data:[e,s]});break;case"C":a.push({key:"C",data:[...r]}),e=r[4],s=r[5];break;case"c":{const t=r.map(((t,n)=>n%2?t+s:t+e));a.push({key:"C",data:t}),e=t[4],s=t[5];break}case"Q":a.push({key:"Q",data:[...r]}),e=r[2],s=r[3];break;case"q":{const t=r.map(((t,n)=>n%2?t+s:t+e));a.push({key:"Q",data:t}),e=t[2],s=t[3];break}case"A":a.push({key:"A",data:[...r]}),e=r[5],s=r[6];break;case"a":e+=r[5],s+=r[6],a.push({key:"A",data:[r[0],r[1],r[2],r[3],r[4],e,s]});break;case"H":a.push({key:"H",data:[...r]}),e=r[0];break;case"h":e+=r[0],a.push({key:"H",data:[e]});break;case"V":a.push({key:"V",data:[...r]}),s=r[0];break;case"v":s+=r[0],a.push({key:"V",data:[s]});break;case"S":a.push({key:"S",data:[...r]}),e=r[2],s=r[3];break;case"s":{const t=r.map(((t,n)=>n%2?t+s:t+e));a.push({key:"S",data:t}),e=t[2],s=t[3];break}case"T":a.push({key:"T",data:[...r]}),e=r[0],s=r[1];break;case"t":e+=r[0],s+=r[1],a.push({key:"T",data:[e,s]});break;case"Z":case"z":a.push({key:"Z",data:[]}),e=n,s=o}return a}function m(t){const e=[];let s="",n=0,o=0,a=0,h=0,r=0,i=0;for(const{key:c,data:l}of t){switch(c){case"M":e.push({key:"M",data:[...l]}),[n,o]=l,[a,h]=l;break;case"C":e.push({key:"C",data:[...l]}),n=l[4],o=l[5],r=l[2],i=l[3];break;case"L":e.push({key:"L",data:[...l]}),[n,o]=l;break;case"H":n=l[0],e.push({key:"L",data:[n,o]});break;case"V":o=l[0],e.push({key:"L",data:[n,o]});break;case"S":{let t=0,a=0;"C"===s||"S"===s?(t=n+(n-r),a=o+(o-i)):(t=n,a=o),e.push({key:"C",data:[t,a,...l]}),r=l[0],i=l[1],n=l[2],o=l[3];break}case"T":{const[t,a]=l;let h=0,c=0;"Q"===s||"T"===s?(h=n+(n-r),c=o+(o-i)):(h=n,c=o);const u=n+2*(h-n)/3,p=o+2*(c-o)/3,f=t+2*(h-t)/3,d=a+2*(c-a)/3;e.push({key:"C",data:[u,p,f,d,t,a]}),r=h,i=c,n=t,o=a;break}case"Q":{const[t,s,a,h]=l,c=n+2*(t-n)/3,u=o+2*(s-o)/3,p=a+2*(t-a)/3,f=h+2*(s-h)/3;e.push({key:"C",data:[c,u,p,f,a,h]}),r=t,i=s,n=a,o=h;break}case"A":{const t=Math.abs(l[0]),s=Math.abs(l[1]),a=l[2],h=l[3],r=l[4],i=l[5],c=l[6];if(0===t||0===s)e.push({key:"C",data:[n,o,i,c,i,c]}),n=i,o=c;else if(n!==i||o!==c){x(n,o,i,c,t,s,a,h,r).forEach((function(t){e.push({key:"C",data:t})})),n=i,o=c}break}case"Z":e.push({key:"Z",data:[]}),n=a,o=h}s=c}return e}function w(t,e,s){return[t*Math.cos(s)-e*Math.sin(s),t*Math.sin(s)+e*Math.cos(s)]}function x(t,e,s,n,o,a,h,r,i,c){const l=(u=h,Math.PI*u/180);var u;let p=[],f=0,d=0,g=0,M=0;if(c)[f,d,g,M]=c;else{[t,e]=w(t,e,-l),[s,n]=w(s,n,-l);const h=(t-s)/2,c=(e-n)/2;let u=h*h/(o*o)+c*c/(a*a);u>1&&(u=Math.sqrt(u),o*=u,a*=u);const p=o*o,k=a*a,b=p*k-p*c*c-k*h*h,y=p*c*c+k*h*h,m=(r===i?-1:1)*Math.sqrt(Math.abs(b/y));g=m*o*c/a+(t+s)/2,M=m*-a*h/o+(e+n)/2,f=Math.asin(parseFloat(((e-M)/a).toFixed(9))),d=Math.asin(parseFloat(((n-M)/a).toFixed(9))),t<g&&(f=Math.PI-f),s<g&&(d=Math.PI-d),f<0&&(f=2*Math.PI+f),d<0&&(d=2*Math.PI+d),i&&f>d&&(f-=2*Math.PI),!i&&d>f&&(d-=2*Math.PI)}let k=d-f;if(Math.abs(k)>120*Math.PI/180){const t=d,e=s,r=n;d=i&&d>f?f+120*Math.PI/180*1:f+120*Math.PI/180*-1,p=x(s=g+o*Math.cos(d),n=M+a*Math.sin(d),e,r,o,a,h,0,i,[d,t,g,M])}k=d-f;const b=Math.cos(f),y=Math.sin(f),m=Math.cos(d),P=Math.sin(d),v=Math.tan(k/4),S=4/3*o*v,O=4/3*a*v,L=[t,e],T=[t+S*y,e-O*b],D=[s+S*P,n-O*m],A=[s,n];if(T[0]=2*L[0]-T[0],T[1]=2*L[1]-T[1],c)return[T,D,A].concat(p);{p=[T,D,A].concat(p);const t=[];for(let e=0;e<p.length;e+=3){const s=w(p[e][0],p[e][1],l),n=w(p[e+1][0],p[e+1][1],l),o=w(p[e+2][0],p[e+2][1],l);t.push([s[0],s[1],n[0],n[1],o[0],o[1]])}return t}}const P={randOffset:function(t,e){return G(t,e)},randOffsetWithRange:function(t,e,s){return E(t,e,s)},ellipse:function(t,e,s,n,o){const a=T(s,n,o);return D(t,e,o,a).opset},doubleLineOps:function(t,e,s,n,o){return $(t,e,s,n,o,!0)}};function v(t,e,s,n,o){return{type:"path",ops:$(t,e,s,n,o)}}function S(t,e,s){const n=(t||[]).length;if(n>2){const o=[];for(let e=0;e<n-1;e++)o.push(...$(t[e][0],t[e][1],t[e+1][0],t[e+1][1],s));return e&&o.push(...$(t[n-1][0],t[n-1][1],t[0][0],t[0][1],s)),{type:"path",ops:o}}return 2===n?v(t[0][0],t[0][1],t[1][0],t[1][1],s):{type:"path",ops:[]}}function O(t,e,s,n,o){return function(t,e){return S(t,!0,e)}([[t,e],[t+s,e],[t+s,e+n],[t,e+n]],o)}function L(t,e){if(t.length){const s="number"==typeof t[0][0]?[t]:t,n=j(s[0],1*(1+.2*e.roughness),e),o=e.disableMultiStroke?[]:j(s[0],1.5*(1+.22*e.roughness),z(e));for(let t=1;t<s.length;t++){const a=s[t];if(a.length){const t=j(a,1*(1+.2*e.roughness),e),s=e.disableMultiStroke?[]:j(a,1.5*(1+.22*e.roughness),z(e));for(const e of t)"move"!==e.op&&n.push(e);for(const t of s)"move"!==t.op&&o.push(t)}}return{type:"path",ops:n.concat(o)}}return{type:"path",ops:[]}}function T(t,e,s){const n=Math.sqrt(2*Math.PI*Math.sqrt((Math.pow(t/2,2)+Math.pow(e/2,2))/2)),o=Math.ceil(Math.max(s.curveStepCount,s.curveStepCount/Math.sqrt(200)*n)),a=2*Math.PI/o;let h=Math.abs(t/2),r=Math.abs(e/2);const i=1-s.curveFitting;return h+=G(h*i,s),r+=G(r*i,s),{increment:a,rx:h,ry:r}}function D(t,e,s,n){const[o,a]=F(n.increment,t,e,n.rx,n.ry,1,n.increment*E(.1,E(.4,1,s),s),s);let h=q(o,null,s);if(!s.disableMultiStroke&&0!==s.roughness){const[o]=F(n.increment,t,e,n.rx,n.ry,1.5,0,s),a=q(o,null,s);h=h.concat(a)}return{estimatedPoints:a,opset:{type:"path",ops:h}}}function A(t,e,s,n,o,a,h,r,i){const c=t,l=e;let u=Math.abs(s/2),p=Math.abs(n/2);u+=G(.01*u,i),p+=G(.01*p,i);let f=o,d=a;for(;f<0;)f+=2*Math.PI,d+=2*Math.PI;d-f>2*Math.PI&&(f=0,d=2*Math.PI);const g=2*Math.PI/i.curveStepCount,M=Math.min(g/2,(d-f)/2),k=V(M,c,l,u,p,f,d,1,i);if(!i.disableMultiStroke){const t=V(M,c,l,u,p,f,d,1.5,i);k.push(...t)}return h&&(r?k.push(...$(c,l,c+u*Math.cos(f),l+p*Math.sin(f),i),...$(c,l,c+u*Math.cos(d),l+p*Math.sin(d),i)):k.push({op:"lineTo",data:[c,l]},{op:"lineTo",data:[c+u*Math.cos(f),l+p*Math.sin(f)]})),{type:"path",ops:k}}function _(t,e){const s=m(y(b(t))),n=[];let o=[0,0],a=[0,0];for(const{key:t,data:h}of s)switch(t){case"M":a=[h[0],h[1]],o=[h[0],h[1]];break;case"L":n.push(...$(a[0],a[1],h[0],h[1],e)),a=[h[0],h[1]];break;case"C":{const[t,s,o,r,i,c]=h;n.push(...Z(t,s,o,r,i,c,a,e)),a=[i,c];break}case"Z":n.push(...$(a[0],a[1],o[0],o[1],e)),a=[o[0],o[1]]}return{type:"path",ops:n}}function I(t,e){const s=[];for(const n of t)if(n.length){const t=e.maxRandomnessOffset||0,o=n.length;if(o>2){s.push({op:"move",data:[n[0][0]+G(t,e),n[0][1]+G(t,e)]});for(let a=1;a<o;a++)s.push({op:"lineTo",data:[n[a][0]+G(t,e),n[a][1]+G(t,e)]})}}return{type:"fillPath",ops:s}}function C(t,e){return function(t,e){let s=t.fillStyle||"hachure";if(!u[s])switch(s){case"zigzag":u[s]||(u[s]=new h(e));break;case"cross-hatch":u[s]||(u[s]=new r(e));break;case"dots":u[s]||(u[s]=new i(e));break;case"dashed":u[s]||(u[s]=new c(e));break;case"zigzag-line":u[s]||(u[s]=new l(e));break;default:s="hachure",u[s]||(u[s]=new o(e))}return u[s]}(e,P).fillPolygons(t,e)}function z(t){const e=Object.assign({},t);return e.randomizer=void 0,t.seed&&(e.seed=t.seed+1),e}function W(t){return t.randomizer||(t.randomizer=new p(t.seed||0)),t.randomizer.next()}function E(t,e,s,n=1){return s.roughness*n*(W(s)*(e-t)+t)}function G(t,e,s=1){return E(-t,t,e,s)}function $(t,e,s,n,o,a=!1){const h=a?o.disableMultiStrokeFill:o.disableMultiStroke,r=R(t,e,s,n,o,!0,!1);if(h)return r;const i=R(t,e,s,n,o,!0,!0);return r.concat(i)}function R(t,e,s,n,o,a,h){const r=Math.pow(t-s,2)+Math.pow(e-n,2),i=Math.sqrt(r);let c=1;c=i<200?1:i>500?.4:-.0016668*i+1.233334;let l=o.maxRandomnessOffset||0;l*l*100>r&&(l=i/10);const u=l/2,p=.2+.2*W(o);let f=o.bowing*o.maxRandomnessOffset*(n-e)/200,d=o.bowing*o.maxRandomnessOffset*(t-s)/200;f=G(f,o,c),d=G(d,o,c);const g=[],M=()=>G(u,o,c),k=()=>G(l,o,c),b=o.preserveVertices;return a&&(h?g.push({op:"move",data:[t+(b?0:M()),e+(b?0:M())]}):g.push({op:"move",data:[t+(b?0:G(l,o,c)),e+(b?0:G(l,o,c))]})),h?g.push({op:"bcurveTo",data:[f+t+(s-t)*p+M(),d+e+(n-e)*p+M(),f+t+2*(s-t)*p+M(),d+e+2*(n-e)*p+M(),s+(b?0:M()),n+(b?0:M())]}):g.push({op:"bcurveTo",data:[f+t+(s-t)*p+k(),d+e+(n-e)*p+k(),f+t+2*(s-t)*p+k(),d+e+2*(n-e)*p+k(),s+(b?0:k()),n+(b?0:k())]}),g}function j(t,e,s){if(!t.length)return[];const n=[];n.push([t[0][0]+G(e,s),t[0][1]+G(e,s)]),n.push([t[0][0]+G(e,s),t[0][1]+G(e,s)]);for(let o=1;o<t.length;o++)n.push([t[o][0]+G(e,s),t[o][1]+G(e,s)]),o===t.length-1&&n.push([t[o][0]+G(e,s),t[o][1]+G(e,s)]);return q(n,null,s)}function q(t,e,s){const n=t.length,o=[];if(n>3){const a=[],h=1-s.curveTightness;o.push({op:"move",data:[t[1][0],t[1][1]]});for(let e=1;e+2<n;e++){const s=t[e];a[0]=[s[0],s[1]],a[1]=[s[0]+(h*t[e+1][0]-h*t[e-1][0])/6,s[1]+(h*t[e+1][1]-h*t[e-1][1])/6],a[2]=[t[e+1][0]+(h*t[e][0]-h*t[e+2][0])/6,t[e+1][1]+(h*t[e][1]-h*t[e+2][1])/6],a[3]=[t[e+1][0],t[e+1][1]],o.push({op:"bcurveTo",data:[a[1][0],a[1][1],a[2][0],a[2][1],a[3][0],a[3][1]]})}if(e&&2===e.length){const t=s.maxRandomnessOffset;o.push({op:"lineTo",data:[e[0]+G(t,s),e[1]+G(t,s)]})}}else 3===n?(o.push({op:"move",data:[t[1][0],t[1][1]]}),o.push({op:"bcurveTo",data:[t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1]]})):2===n&&o.push(...R(t[0][0],t[0][1],t[1][0],t[1][1],s,!0,!0));return o}function F(t,e,s,n,o,a,h,r){const i=[],c=[];if(0===r.roughness){t/=4,c.push([e+n*Math.cos(-t),s+o*Math.sin(-t)]);for(let a=0;a<=2*Math.PI;a+=t){const t=[e+n*Math.cos(a),s+o*Math.sin(a)];i.push(t),c.push(t)}c.push([e+n*Math.cos(0),s+o*Math.sin(0)]),c.push([e+n*Math.cos(t),s+o*Math.sin(t)])}else{const l=G(.5,r)-Math.PI/2;c.push([G(a,r)+e+.9*n*Math.cos(l-t),G(a,r)+s+.9*o*Math.sin(l-t)]);const u=2*Math.PI+l-.01;for(let h=l;h<u;h+=t){const t=[G(a,r)+e+n*Math.cos(h),G(a,r)+s+o*Math.sin(h)];i.push(t),c.push(t)}c.push([G(a,r)+e+n*Math.cos(l+2*Math.PI+.5*h),G(a,r)+s+o*Math.sin(l+2*Math.PI+.5*h)]),c.push([G(a,r)+e+.98*n*Math.cos(l+h),G(a,r)+s+.98*o*Math.sin(l+h)]),c.push([G(a,r)+e+.9*n*Math.cos(l+.5*h),G(a,r)+s+.9*o*Math.sin(l+.5*h)])}return[c,i]}function V(t,e,s,n,o,a,h,r,i){const c=a+G(.1,i),l=[];l.push([G(r,i)+e+.9*n*Math.cos(c-t),G(r,i)+s+.9*o*Math.sin(c-t)]);for(let a=c;a<=h;a+=t)l.push([G(r,i)+e+n*Math.cos(a),G(r,i)+s+o*Math.sin(a)]);return l.push([e+n*Math.cos(h),s+o*Math.sin(h)]),l.push([e+n*Math.cos(h),s+o*Math.sin(h)]),q(l,null,i)}function Z(t,e,s,n,o,a,h,r){const i=[],c=[r.maxRandomnessOffset||1,(r.maxRandomnessOffset||1)+.3];let l=[0,0];const u=r.disableMultiStroke?1:2,p=r.preserveVertices;for(let f=0;f<u;f++)0===f?i.push({op:"move",data:[h[0],h[1]]}):i.push({op:"move",data:[h[0]+(p?0:G(c[0],r)),h[1]+(p?0:G(c[0],r))]}),l=p?[o,a]:[o+G(c[f],r),a+G(c[f],r)],i.push({op:"bcurveTo",data:[t+G(c[f],r),e+G(c[f],r),s+G(c[f],r),n+G(c[f],r),l[0],l[1]]});return i}function Q(t){return[...t]}function H(t,e=0){const s=t.length;if(s<3)throw new Error("A curve must have at least three points.");const n=[];if(3===s)n.push(Q(t[0]),Q(t[1]),Q(t[2]),Q(t[2]));else{const s=[];s.push(t[0],t[0]);for(let e=1;e<t.length;e++)s.push(t[e]),e===t.length-1&&s.push(t[e]);const o=[],a=1-e;n.push(Q(s[0]));for(let t=1;t+2<s.length;t++){const e=s[t];o[0]=[e[0],e[1]],o[1]=[e[0]+(a*s[t+1][0]-a*s[t-1][0])/6,e[1]+(a*s[t+1][1]-a*s[t-1][1])/6],o[2]=[s[t+1][0]+(a*s[t][0]-a*s[t+2][0])/6,s[t+1][1]+(a*s[t][1]-a*s[t+2][1])/6],o[3]=[s[t+1][0],s[t+1][1]],n.push(o[1],o[2],o[3])}}return n}function N(t,e){return Math.pow(t[0]-e[0],2)+Math.pow(t[1]-e[1],2)}function B(t,e,s){const n=N(e,s);if(0===n)return N(t,e);let o=((t[0]-e[0])*(s[0]-e[0])+(t[1]-e[1])*(s[1]-e[1]))/n;return o=Math.max(0,Math.min(1,o)),N(t,J(e,s,o))}function J(t,e,s){return[t[0]+(e[0]-t[0])*s,t[1]+(e[1]-t[1])*s]}function K(t,e,s,n){const o=n||[];if(function(t,e){const s=t[e+0],n=t[e+1],o=t[e+2],a=t[e+3];let h=3*n[0]-2*s[0]-a[0];h*=h;let r=3*n[1]-2*s[1]-a[1];r*=r;let i=3*o[0]-2*a[0]-s[0];i*=i;let c=3*o[1]-2*a[1]-s[1];return c*=c,h<i&&(h=i),r<c&&(r=c),h+r}(t,e)<s){const s=t[e+0];if(o.length){(a=o[o.length-1],h=s,Math.sqrt(N(a,h)))>1&&o.push(s)}else o.push(s);o.push(t[e+3])}else{const n=.5,a=t[e+0],h=t[e+1],r=t[e+2],i=t[e+3],c=J(a,h,n),l=J(h,r,n),u=J(r,i,n),p=J(c,l,n),f=J(l,u,n),d=J(p,f,n);K([a,c,p,d],0,s,o),K([d,f,u,i],0,s,o)}var a,h;return o}function U(t,e){return X(t,0,t.length,e)}function X(t,e,s,n,o){const a=o||[],h=t[e],r=t[s-1];let i=0,c=1;for(let n=e+1;n<s-1;++n){const e=B(t[n],h,r);e>i&&(i=e,c=n)}return Math.sqrt(i)>n?(X(t,e,c+1,n,a),X(t,c,s,n,a)):(a.length||a.push(h),a.push(r)),a}function Y(t,e=.15,s){const n=[],o=(t.length-1)/3;for(let s=0;s<o;s++){K(t,3*s,e,n)}return s&&s>0?X(n,0,n.length,s):n}const tt="none";class et{constructor(t){this.defaultOptions={maxRandomnessOffset:2,roughness:1,bowing:1,stroke:"#000",strokeWidth:1,curveTightness:0,curveFitting:.95,curveStepCount:9,fillStyle:"hachure",fillWeight:-1,hachureAngle:-41,hachureGap:-1,dashOffset:-1,dashGap:-1,zigzagOffset:-1,seed:0,disableMultiStroke:!1,disableMultiStrokeFill:!1,preserveVertices:!1,fillShapeRoughnessGain:.8},this.config=t||{},this.config.options&&(this.defaultOptions=this._o(this.config.options))}static newSeed(){return Math.floor(Math.random()*2**31)}_o(t){return t?Object.assign({},this.defaultOptions,t):this.defaultOptions}_d(t,e,s){return{shape:t,sets:e||[],options:s||this.defaultOptions}}line(t,e,s,n,o){const a=this._o(o);return this._d("line",[v(t,e,s,n,a)],a)}rectangle(t,e,s,n,o){const a=this._o(o),h=[],r=O(t,e,s,n,a);if(a.fill){const o=[[t,e],[t+s,e],[t+s,e+n],[t,e+n]];"solid"===a.fillStyle?h.push(I([o],a)):h.push(C([o],a))}return a.stroke!==tt&&h.push(r),this._d("rectangle",h,a)}ellipse(t,e,s,n,o){const a=this._o(o),h=[],r=T(s,n,a),i=D(t,e,a,r);if(a.fill)if("solid"===a.fillStyle){const s=D(t,e,a,r).opset;s.type="fillPath",h.push(s)}else h.push(C([i.estimatedPoints],a));return a.stroke!==tt&&h.push(i.opset),this._d("ellipse",h,a)}circle(t,e,s,n){const o=this.ellipse(t,e,s,s,n);return o.shape="circle",o}linearPath(t,e){const s=this._o(e);return this._d("linearPath",[S(t,!1,s)],s)}arc(t,e,s,n,o,a,h=!1,r){const i=this._o(r),c=[],l=A(t,e,s,n,o,a,h,!0,i);if(h&&i.fill)if("solid"===i.fillStyle){const h=Object.assign({},i);h.disableMultiStroke=!0;const r=A(t,e,s,n,o,a,!0,!1,h);r.type="fillPath",c.push(r)}else c.push(function(t,e,s,n,o,a,h){const r=t,i=e;let c=Math.abs(s/2),l=Math.abs(n/2);c+=G(.01*c,h),l+=G(.01*l,h);let u=o,p=a;for(;u<0;)u+=2*Math.PI,p+=2*Math.PI;p-u>2*Math.PI&&(u=0,p=2*Math.PI);const f=(p-u)/h.curveStepCount,d=[];for(let t=u;t<=p;t+=f)d.push([r+c*Math.cos(t),i+l*Math.sin(t)]);return d.push([r+c*Math.cos(p),i+l*Math.sin(p)]),d.push([r,i]),C([d],h)}(t,e,s,n,o,a,i));return i.stroke!==tt&&c.push(l),this._d("arc",c,i)}curve(t,e){const s=this._o(e),n=[],o=L(t,s);if(s.fill&&s.fill!==tt)if("solid"===s.fillStyle){const e=L(t,Object.assign(Object.assign({},s),{disableMultiStroke:!0,roughness:s.roughness?s.roughness+s.fillShapeRoughnessGain:0}));n.push({type:"fillPath",ops:this._mergedShape(e.ops)})}else{const e=[],o=t;if(o.length){const t="number"==typeof o[0][0]?[o]:o;for(const n of t)n.length<3?e.push(...n):3===n.length?e.push(...Y(H([n[0],n[0],n[1],n[2]]),10,(1+s.roughness)/2)):e.push(...Y(H(n),10,(1+s.roughness)/2))}e.length&&n.push(C([e],s))}return s.stroke!==tt&&n.push(o),this._d("curve",n,s)}polygon(t,e){const s=this._o(e),n=[],o=S(t,!0,s);return s.fill&&("solid"===s.fillStyle?n.push(I([t],s)):n.push(C([t],s))),s.stroke!==tt&&n.push(o),this._d("polygon",n,s)}path(t,e){const s=this._o(e),n=[];if(!t)return this._d("path",n,s);t=(t||"").replace(/\n/g," ").replace(/(-\s)/g,"-").replace("/(ss)/g"," ");const o=s.fill&&"transparent"!==s.fill&&s.fill!==tt,a=s.stroke!==tt,h=!!(s.simplification&&s.simplification<1),r=function(t,e,s){const n=m(y(b(t))),o=[];let a=[],h=[0,0],r=[];const i=()=>{r.length>=4&&a.push(...Y(r,e)),r=[]},c=()=>{i(),a.length&&(o.push(a),a=[])};for(const{key:t,data:e}of n)switch(t){case"M":c(),h=[e[0],e[1]],a.push(h);break;case"L":i(),a.push([e[0],e[1]]);break;case"C":if(!r.length){const t=a.length?a[a.length-1]:h;r.push([t[0],t[1]])}r.push([e[0],e[1]]),r.push([e[2],e[3]]),r.push([e[4],e[5]]);break;case"Z":i(),a.push([h[0],h[1]])}if(c(),!s)return o;const l=[];for(const t of o){const e=U(t,s);e.length&&l.push(e)}return l}(t,1,h?4-4*(s.simplification||1):(1+s.roughness)/2),i=_(t,s);if(o)if("solid"===s.fillStyle)if(1===r.length){const e=_(t,Object.assign(Object.assign({},s),{disableMultiStroke:!0,roughness:s.roughness?s.roughness+s.fillShapeRoughnessGain:0}));n.push({type:"fillPath",ops:this._mergedShape(e.ops)})}else n.push(I(r,s));else n.push(C(r,s));return a&&(h?r.forEach((t=>{n.push(S(t,!1,s))})):n.push(i)),this._d("path",n,s)}opsToPath(t,e){let s="";for(const n of t.ops){const t="number"==typeof e&&e>=0?n.data.map((t=>+t.toFixed(e))):n.data;switch(n.op){case"move":s+=`M${t[0]} ${t[1]} `;break;case"bcurveTo":s+=`C${t[0]} ${t[1]}, ${t[2]} ${t[3]}, ${t[4]} ${t[5]} `;break;case"lineTo":s+=`L${t[0]} ${t[1]} `}}return s.trim()}toPaths(t){const e=t.sets||[],s=t.options||this.defaultOptions,n=[];for(const t of e){let e=null;switch(t.type){case"path":e={d:this.opsToPath(t),stroke:s.stroke,strokeWidth:s.strokeWidth,fill:tt};break;case"fillPath":e={d:this.opsToPath(t),stroke:tt,strokeWidth:0,fill:s.fill||tt};break;case"fillSketch":e=this.fillSketch(t,s)}e&&n.push(e)}return n}fillSketch(t,e){let s=e.fillWeight;return s<0&&(s=e.strokeWidth/2),{d:this.opsToPath(t),stroke:e.fill||tt,strokeWidth:s,fill:tt}}_mergedShape(t){return t.filter(((t,e)=>0===e||"move"!==t.op))}}class st{constructor(t,e){this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.gen=new et(e)}draw(t){const e=t.sets||[],s=t.options||this.getDefaultOptions(),n=this.ctx,o=t.options.fixedDecimalPlaceDigits;for(const a of e)switch(a.type){case"path":n.save(),n.strokeStyle="none"===s.stroke?"transparent":s.stroke,n.lineWidth=s.strokeWidth,s.strokeLineDash&&n.setLineDash(s.strokeLineDash),s.strokeLineDashOffset&&(n.lineDashOffset=s.strokeLineDashOffset),this._drawToContext(n,a,o),n.restore();break;case"fillPath":{n.save(),n.fillStyle=s.fill||"";const e="curve"===t.shape||"polygon"===t.shape||"path"===t.shape?"evenodd":"nonzero";this._drawToContext(n,a,o,e),n.restore();break}case"fillSketch":this.fillSketch(n,a,s)}}fillSketch(t,e,s){let n=s.fillWeight;n<0&&(n=s.strokeWidth/2),t.save(),s.fillLineDash&&t.setLineDash(s.fillLineDash),s.fillLineDashOffset&&(t.lineDashOffset=s.fillLineDashOffset),t.strokeStyle=s.fill||"",t.lineWidth=n,this._drawToContext(t,e,s.fixedDecimalPlaceDigits),t.restore()}_drawToContext(t,e,s,n="nonzero"){t.beginPath();for(const n of e.ops){const e="number"==typeof s&&s>=0?n.data.map((t=>+t.toFixed(s))):n.data;switch(n.op){case"move":t.moveTo(e[0],e[1]);break;case"bcurveTo":t.bezierCurveTo(e[0],e[1],e[2],e[3],e[4],e[5]);break;case"lineTo":t.lineTo(e[0],e[1])}}"fillPath"===e.type?t.fill(n):t.stroke()}get generator(){return this.gen}getDefaultOptions(){return this.gen.defaultOptions}line(t,e,s,n,o){const a=this.gen.line(t,e,s,n,o);return this.draw(a),a}rectangle(t,e,s,n,o){const a=this.gen.rectangle(t,e,s,n,o);return this.draw(a),a}ellipse(t,e,s,n,o){const a=this.gen.ellipse(t,e,s,n,o);return this.draw(a),a}circle(t,e,s,n){const o=this.gen.circle(t,e,s,n);return this.draw(o),o}linearPath(t,e){const s=this.gen.linearPath(t,e);return this.draw(s),s}polygon(t,e){const s=this.gen.polygon(t,e);return this.draw(s),s}arc(t,e,s,n,o,a,h=!1,r){const i=this.gen.arc(t,e,s,n,o,a,h,r);return this.draw(i),i}curve(t,e){const s=this.gen.curve(t,e);return this.draw(s),s}path(t,e){const s=this.gen.path(t,e);return this.draw(s),s}}const nt="http://www.w3.org/2000/svg";class ot{constructor(t,e){this.svg=t,this.gen=new et(e)}draw(t){const e=t.sets||[],s=t.options||this.getDefaultOptions(),n=this.svg.ownerDocument||window.document,o=n.createElementNS(nt,"g"),a=t.options.fixedDecimalPlaceDigits;for(const h of e){let e=null;switch(h.type){case"path":e=n.createElementNS(nt,"path"),e.setAttribute("d",this.opsToPath(h,a)),e.setAttribute("stroke",s.stroke),e.setAttribute("stroke-width",s.strokeWidth+""),e.setAttribute("fill","none"),s.strokeLineDash&&e.setAttribute("stroke-dasharray",s.strokeLineDash.join(" ").trim()),s.strokeLineDashOffset&&e.setAttribute("stroke-dashoffset",`${s.strokeLineDashOffset}`);break;case"fillPath":e=n.createElementNS(nt,"path"),e.setAttribute("d",this.opsToPath(h,a)),e.setAttribute("stroke","none"),e.setAttribute("stroke-width","0"),e.setAttribute("fill",s.fill||""),"curve"!==t.shape&&"polygon"!==t.shape||e.setAttribute("fill-rule","evenodd");break;case"fillSketch":e=this.fillSketch(n,h,s)}e&&o.appendChild(e)}return o}fillSketch(t,e,s){let n=s.fillWeight;n<0&&(n=s.strokeWidth/2);const o=t.createElementNS(nt,"path");return o.setAttribute("d",this.opsToPath(e,s.fixedDecimalPlaceDigits)),o.setAttribute("stroke",s.fill||""),o.setAttribute("stroke-width",n+""),o.setAttribute("fill","none"),s.fillLineDash&&o.setAttribute("stroke-dasharray",s.fillLineDash.join(" ").trim()),s.fillLineDashOffset&&o.setAttribute("stroke-dashoffset",`${s.fillLineDashOffset}`),o}get generator(){return this.gen}getDefaultOptions(){return this.gen.defaultOptions}opsToPath(t,e){return this.gen.opsToPath(t,e)}line(t,e,s,n,o){const a=this.gen.line(t,e,s,n,o);return this.draw(a)}rectangle(t,e,s,n,o){const a=this.gen.rectangle(t,e,s,n,o);return this.draw(a)}ellipse(t,e,s,n,o){const a=this.gen.ellipse(t,e,s,n,o);return this.draw(a)}circle(t,e,s,n){const o=this.gen.circle(t,e,s,n);return this.draw(o)}linearPath(t,e){const s=this.gen.linearPath(t,e);return this.draw(s)}polygon(t,e){const s=this.gen.polygon(t,e);return this.draw(s)}arc(t,e,s,n,o,a,h=!1,r){const i=this.gen.arc(t,e,s,n,o,a,h,r);return this.draw(i)}curve(t,e){const s=this.gen.curve(t,e);return this.draw(s)}path(t,e){const s=this.gen.path(t,e);return this.draw(s)}}return{canvas:(t,e)=>new st(t,e),svg:(t,e)=>new ot(t,e),generator:t=>new et(t),newSeed:()=>et.newSeed()}}();

/* ==========================================================================
   Kreide-Zeichnungen (gemeinsam für Kalender-App und Escape Room)
   Stil: Kinderzeichnung mit Wachsmalkreide. Gezeichnet mit rough.js (MIT, © Preet Shihn).
   Alle Figuren sind eigene Zeichnungen. Koordinaten: x,y = Fußpunkt (Mitte unten), k = Maßstab.
   ========================================================================== */
/* Wachsmalkreide-Farben */
const C = {
  nacht: "#13203f", nacht2: "#1d2f5a", nacht3: "#2a3f72", schnee: "#eef3fb", schnee2: "#c9d6ec", schneeS: "#9fb3d6",
  holz: "#7a4a26", holz2: "#a5682f", holzD: "#4b2b14", dach: "#5a3018", gelb: "#ffd257", orange: "#f39a2b", rot: "#d8432f",
  blau: "#3d6fb8", blauD: "#24477e", haut: "#f2c39b", braun: "#8a5530", tanne: "#2f6b45", tanne2: "#3f8a58", grau: "#6f7686",
  schaf: "#f6f1e6", schafS: "#2b2b33", kuh: "#b45f2e", kuhF: "#f5e9d4", pferd: "#9b5b2c", maehne: "#f0d39a", huhn: "#c8cfdb", stroh: "#e7bd45", ink: "#1b1b24"
};

/* gleichbleibende Zufallszahlen, damit jede Zeichnung bei jedem Laden gleich aussieht */
let SEED = 7;
function rnd() { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; }
function r(a, b) { return a + rnd() * (b - a); }

/* Papierkorn: Sprenkel, die aus den Kreidestrichen herausgenommen werden */
let GRAIN = null;
function grain() {
  if (GRAIN) return GRAIN;
  const c = document.createElement("canvas"); c.width = c.height = 220; const x = c.getContext("2d");
  for (let i = 0; i < 2600; i++) { x.fillStyle = "rgba(0,0,0," + r(.15, .9).toFixed(2) + ")"; const s = r(.6, 2.2); x.fillRect(r(0, 220), r(0, 220), s, s * r(.5, 1.6)); }
  GRAIN = c; return c;
}

/* Hilfsfunktionen für das Zeichnen mit rough.js */
function Z(ctx) {
  const rc = rough.canvas(ctx.canvas);
  const base = { roughness: 1.9, bowing: 1.6, strokeWidth: 3, stroke: C.ink, fillStyle: "hachure", hachureGap: 5, fillWeight: 2.6, hachureAngle: -41 };
  const o = (opt) => Object.assign({ seed: Math.floor(rnd() * 1e6) + 1 }, base, opt || {});
  return {
    ctx,
    rect: (x, y, w, h, opt) => rc.rectangle(x, y, w, h, o(opt)),
    ell: (x, y, w, h, opt) => rc.ellipse(x, y, w, h, o(opt)),
    circ: (x, y, d, opt) => rc.circle(x, y, d, o(opt)),
    poly: (pts, opt) => rc.polygon(pts, o(opt)),
    line: (x1, y1, x2, y2, opt) => rc.line(x1, y1, x2, y2, o(opt)),
    curve: (pts, opt) => rc.curve(pts, o(opt)),
    path: (d, opt) => rc.path(d, o(opt)),
    /* Fläche „ausmalen“: zwei Schraffur-Durchgänge in leicht verschiedenen Tönen = Wachsmalkreide */
    mal: (shape, args, farben, opt) => {
      farben.forEach((f, i) => rc[shape](...args, o(Object.assign({ stroke: "none", fill: f, hachureAngle: (i % 2 ? 48 : -38) + r(-8, 8), hachureGap: (opt && opt.gap || 5) + i * 1.5, fillWeight: (opt && opt.fw || 3) - i * .4, roughness: 2.4 }, opt))));
    }
  };
}
/* Wachskreide-Korn über eine fertige Ebene legen */
function korn(ctx, staerke) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "destination-out"; ctx.globalAlpha = staerke || .28;
  ctx.fillStyle = ctx.createPattern(grain(), "repeat"); ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
}
function gesicht(z, x, y, d, o) {
  o = o || {};
  z.circ(x, y, d, { fill: C.haut, fillStyle: "solid", strokeWidth: 2.6 });
  z.mal("circle", [x, y, d * .9], ["#e9a983"], { gap: 7, fw: 1.6 });
  const e = d * .17;
  if (o.zu) { z.path("M" + (x - e - 5) + " " + (y - 2) + " q5 5 10 0", { strokeWidth: 2.4 }); z.path("M" + (x + e - 5) + " " + (y - 2) + " q5 5 10 0", { strokeWidth: 2.4 }); }
  else { z.circ(x - e, y - 3, 5, { fill: C.ink, fillStyle: "solid", strokeWidth: 1 }); z.circ(x + e, y - 3, 5, { fill: C.ink, fillStyle: "solid", strokeWidth: 1 }); }
  z.path("M" + (x - d * .15) + " " + (y + d * .18) + " q" + d * .15 + " " + d * .1 + " " + d * .3 + " 0", { strokeWidth: 2.4 });
  z.circ(x - d * .28, y + d * .1, d * .14, { fill: "#f08f86", fillStyle: "solid", stroke: "none" });
  z.circ(x + d * .28, y + d * .1, d * .14, { fill: "#f08f86", fillStyle: "solid", stroke: "none" });
}

/* ---------- Figuren und Tiere (Kinderzeichnung) ---------- */
const FIG = {
  frau(z, x, y, s) {   /* x,y = Fußpunkt */
    const k = s || 1;
    z.poly([[x - 34 * k, y], [x + 34 * k, y], [x + 18 * k, y - 120 * k], [x - 18 * k, y - 120 * k]], { fill: "#5a4a7a" });
    z.mal("polygon", [[[x - 30 * k, y - 4], [x + 30 * k, y - 4], [x + 16 * k, y - 116 * k], [x - 16 * k, y - 116 * k]]], ["#6b5a92", "#4a3c68"]);
    z.poly([[x - 40 * k, y - 96 * k], [x + 40 * k, y - 96 * k], [x, y - 150 * k]], { fill: "#e6e1d2", fillStyle: "solid" });
    z.mal("polygon", [[[x - 36 * k, y - 98 * k], [x + 36 * k, y - 98 * k], [x, y - 146 * k]]], ["#d2ccb8"]);
    z.ell(x, y - 154 * k, 66 * k, 70 * k, { fill: "#e6e1d2", fillStyle: "solid", strokeWidth: 2.8 });   /* Kopftuch hinter dem Gesicht */
    z.mal("ellipse", [x, y - 154 * k, 60 * k, 64 * k], ["#d2ccb8"], { gap: 6 });
    gesicht(z, x, y - 148 * k, 44 * k);
  },
  mann(z, x, y, s) {
    const k = s || 1;
    z.line(x - 14 * k, y - 50 * k, x - 18 * k, y, { strokeWidth: 9, stroke: C.braun }); z.line(x + 14 * k, y - 50 * k, x + 18 * k, y, { strokeWidth: 9, stroke: C.braun });
    z.ell(x - 22 * k, y + 2, 26 * k, 12 * k, { fill: C.ink, fillStyle: "solid" }); z.ell(x + 22 * k, y + 2, 26 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
    z.poly([[x - 30 * k, y - 46 * k], [x + 30 * k, y - 46 * k], [x + 26 * k, y - 132 * k], [x - 26 * k, y - 132 * k]], { fill: C.blau });
    z.mal("polygon", [[[x - 26 * k, y - 50 * k], [x + 26 * k, y - 50 * k], [x + 22 * k, y - 128 * k], [x - 22 * k, y - 128 * k]]], [C.blau, C.blauD]);
    z.line(x + 24 * k, y - 120 * k, x + 62 * k, y - 96 * k, { strokeWidth: 10, stroke: C.blauD });   /* Arm zur Laterne */
    gesicht(z, x, y - 158 * k, 50 * k);
    z.path("M" + (x - 27 * k) + " " + (y - 164 * k) + " Q" + x + " " + (y - 206 * k) + " " + (x + 27 * k) + " " + (y - 164 * k) + " Z", { fill: C.blauD, fillStyle: "solid" });
    z.circ(x, y - 192 * k, 14 * k, { fill: C.rot, fillStyle: "solid" });
  },
  laterne(z, x, y, s) {   /* x,y = Griff oben */
    const k = s || 1;
    z.path("M" + (x - 12 * k) + " " + (y + 14 * k) + " Q" + x + " " + (y - 8 * k) + " " + (x + 12 * k) + " " + (y + 14 * k), { strokeWidth: 3 });
    z.poly([[x - 18 * k, y + 26 * k], [x + 18 * k, y + 26 * k], [x + 12 * k, y + 12 * k], [x - 12 * k, y + 12 * k]], { fill: C.holzD, fillStyle: "solid" });
    z.rect(x - 16 * k, y + 26 * k, 32 * k, 40 * k, { fill: "#ffe48a", fillStyle: "solid" });
    z.ell(x, y + 48 * k, 12 * k, 22 * k, { fill: C.orange, fillStyle: "solid", stroke: "#c4621a", strokeWidth: 1.5 });
    z.rect(x - 20 * k, y + 64 * k, 40 * k, 9 * k, { fill: C.holzD, fillStyle: "solid" });
  },
  pferd(z, x, y, s, zu) {   /* x,y = Mitte unten */
    const k = s || 1;
    [-60, -38, 34, 56].forEach(d => z.line(x + d * k, y - 60 * k, x + d * k + r(-4, 4), y, { strokeWidth: 11, stroke: "#7d4520" }));
    z.ell(x, y - 88 * k, 170 * k, 86 * k, { fill: C.pferd, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 88 * k, 160 * k, 76 * k], [C.pferd, "#7d4520"]);
    z.poly([[x + 52 * k, y - 112 * k], [x + 92 * k, y - 190 * k], [x + 118 * k, y - 172 * k], [x + 84 * k, y - 96 * k]], { fill: C.pferd, fillStyle: "solid" });
    z.ell(x + 120 * k, y - 182 * k, 74 * k, 40 * k, { fill: C.pferd, fillStyle: "solid" });
    z.poly([[x + 98 * k, y - 206 * k], [x + 104 * k, y - 230 * k], [x + 114 * k, y - 202 * k]], { fill: C.pferd, fillStyle: "solid" });
    z.path("M" + (x + 86 * k) + " " + (y - 196 * k) + " q-14 30 -6 50 q-12 26 -2 46", { stroke: C.maehne, strokeWidth: 12 });
    z.path("M" + (x - 82 * k) + " " + (y - 100 * k) + " q-30 20 -18 70", { stroke: C.maehne, strokeWidth: 11 });
    if (zu) z.path("M" + (x + 116 * k) + " " + (y - 190 * k) + " q6 6 12 0", { strokeWidth: 2.6 }); else z.circ(x + 122 * k, y - 190 * k, 7 * k, { fill: C.ink, fillStyle: "solid" });
  },
  kuh(z, x, y, s, zu) {
    const k = s || 1;
    [-58, -36, 32, 54].forEach(d => z.line(x + d * k, y - 56 * k, x + d * k + r(-4, 4), y, { strokeWidth: 11, stroke: "#8f4a22" }));
    z.ell(x, y - 84 * k, 176 * k, 92 * k, { fill: C.kuh, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 84 * k, 166 * k, 82 * k], [C.kuh, "#94481f"]);
    z.ell(x - 30 * k, y - 96 * k, 50 * k, 32 * k, { fill: C.kuhF, fillStyle: "solid", stroke: "none" }); z.ell(x + 28 * k, y - 70 * k, 36 * k, 24 * k, { fill: C.kuhF, fillStyle: "solid", stroke: "none" });
    z.ell(x + 104 * k, y - 112 * k, 66 * k, 74 * k, { fill: C.kuh, fillStyle: "solid" });
    z.ell(x + 108 * k, y - 86 * k, 50 * k, 30 * k, { fill: "#f1b1a2", fillStyle: "solid" });
    z.path("M" + (x + 80 * k) + " " + (y - 140 * k) + " q-14 -18 -4 -30", { strokeWidth: 5, stroke: C.kuhF });
    z.path("M" + (x + 128 * k) + " " + (y - 140 * k) + " q14 -18 4 -30", { strokeWidth: 5, stroke: C.kuhF });
    if (zu) { z.path("M" + (x + 88 * k) + " " + (y - 120 * k) + " q5 5 10 0", { strokeWidth: 2.6 }); z.path("M" + (x + 112 * k) + " " + (y - 120 * k) + " q5 5 10 0", { strokeWidth: 2.6 }); }
    else { z.circ(x + 92 * k, y - 120 * k, 7 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 118 * k, y - 120 * k, 7 * k, { fill: C.ink, fillStyle: "solid" }); }
  },
  huhn(z, x, y, s, zu) {
    const k = s || 1;
    z.line(x - 8 * k, y - 22 * k, x - 12 * k, y, { strokeWidth: 4, stroke: C.orange }); z.line(x + 8 * k, y - 22 * k, x + 12 * k, y, { strokeWidth: 4, stroke: C.orange });
    z.poly([[x - 40 * k, y - 52 * k], [x - 74 * k, y - 82 * k], [x - 66 * k, y - 34 * k]], { fill: "#9aa5bb", fillStyle: "solid" });
    z.ell(x, y - 46 * k, 90 * k, 64 * k, { fill: C.huhn, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 46 * k, 80 * k, 54 * k], ["#aeb7c9"]);
    z.circ(x + 38 * k, y - 82 * k, 40 * k, { fill: C.huhn, fillStyle: "solid" });
    z.path("M" + (x + 28 * k) + " " + (y - 100 * k) + " q4 -16 10 -2 q6 -16 10 0", { fill: C.rot, fillStyle: "solid", strokeWidth: 2 });
    z.poly([[x + 56 * k, y - 86 * k], [x + 74 * k, y - 80 * k], [x + 56 * k, y - 74 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 2 });
    if (zu) z.path("M" + (x + 38 * k) + " " + (y - 86 * k) + " q4 4 8 0", { strokeWidth: 2.4 }); else z.circ(x + 42 * k, y - 86 * k, 6 * k, { fill: C.ink, fillStyle: "solid" });
  },
  schaf(z, x, y, s, zu, spiegel) {
    const k = s || 1, m = spiegel ? -1 : 1;
    [-26, -10, 12, 28].forEach(d => z.line(x + d * k, y - 26 * k, x + d * k, y, { strokeWidth: 8, stroke: C.schafS }));
    [[-30, -44, 50], [-8, -60, 54], [18, -58, 52], [34, -40, 46], [-14, -32, 50], [12, -30, 50]].forEach(c => z.circ(x + c[0] * k, y + c[1] * k, c[2] * k, { fill: C.schaf, fillStyle: "solid", strokeWidth: 2.4 }));
    z.ell(x + m * 50 * k, y - 50 * k, 34 * k, 42 * k, { fill: C.schafS, fillStyle: "solid" });
    z.ell(x + m * 34 * k, y - 64 * k, 18 * k, 10 * k, { fill: C.schafS, fillStyle: "solid" });
    if (zu) z.path("M" + (x + m * 50 * k - 6) + " " + (y - 54 * k) + " q6 5 12 0", { stroke: "#fff", strokeWidth: 2.6 }); else z.circ(x + m * 54 * k, y - 54 * k, 6 * k, { fill: "#fff", fillStyle: "solid", stroke: "none" });
  },
  maus(z, x, y, s) {
    const k = s || 1;
    z.ell(x, y - 12 * k, 40 * k, 24 * k, { fill: C.grau, fillStyle: "solid" }); z.circ(x + 18 * k, y - 22 * k, 16 * k, { fill: C.grau, fillStyle: "solid" });
    z.path("M" + (x - 20 * k) + " " + (y - 10 * k) + " q-20 10 -30 -6", { strokeWidth: 2.4 }); z.circ(x + 22 * k, y - 18 * k, 4 * k, { fill: C.ink, fillStyle: "solid" });
  },
  tanne(z, x, y, s) {
    const k = s || 1;
    z.rect(x - 8 * k, y - 30 * k, 16 * k, 30 * k, { fill: C.holz, fillStyle: "solid" });
    for (let i = 0; i < 3; i++) { const b = y - (30 + i * 42) * k, w = (150 - i * 38) * k; z.poly([[x - w / 2, b], [x + w / 2, b], [x, b - 84 * k]], { fill: i % 2 ? C.tanne2 : C.tanne, fillStyle: "hachure", hachureGap: 4 }); }
    z.path("M" + (x - 40 * k) + " " + (y - 70 * k) + " q40 -12 80 0", { stroke: C.schnee, strokeWidth: 7 });
    z.path("M" + (x - 28 * k) + " " + (y - 110 * k) + " q28 -10 56 0", { stroke: C.schnee, strokeWidth: 6 });
  },
  baum(z, x, y, s) {
    const k = s || 1;
    z.line(x, y, x + r(-6, 6), y - 230 * k, { strokeWidth: 12, stroke: "#3b2a22" });
    for (let i = 0; i < 7; i++) {
      const yy = y - (80 + i * 22) * k, d = (i % 2 ? 1 : -1), l = (90 - i * 9) * k;
      z.line(x, yy, x + d * l, yy - l * .8, { strokeWidth: 6 - i * .5, stroke: "#3b2a22" });
      z.line(x + d * l * .6, yy - l * .48, x + d * l * .9, yy - l * .9, { strokeWidth: 3, stroke: "#3b2a22" });
      z.line(x + d * l * .3, yy - l * .3 - 6, x + d * l * .95, yy - l * .82 - 6, { strokeWidth: 3, stroke: C.schnee2 });
    }
  },
  haus(z, x, y, s) {
    const k = s || 1;
    z.rect(x - 50 * k, y - 60 * k, 100 * k, 60 * k, { fill: "#3d3550", fillStyle: "solid" });
    z.poly([[x - 64 * k, y - 58 * k], [x + 64 * k, y - 58 * k], [x, y - 110 * k]], { fill: C.schnee, fillStyle: "solid" });
    z.rect(x - 16 * k, y - 44 * k, 30 * k, 26 * k, { fill: "#1b1830", fillStyle: "solid" });
    z.line(x - 1, y - 44 * k, x - 1, y - 18 * k, { strokeWidth: 2 });
  }
};

/* ---------- weitere Figuren (Kalender und Escape Room) ---------- */
function sternPunkte(cx, cy, ra, ri, n) { const p = []; for (let i = 0; i < 2 * (n || 5); i++) { const a = i * Math.PI / (n || 5) - Math.PI / 2, q = i % 2 ? ri : ra; p.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]); } return p; }
function glanz(ctx, x, y, rad, farbe, staerke) {   /* weiches Licht (Laterne, Stern, Fenster) */
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad); const f = farbe || "255,214,120";
  g.addColorStop(0, "rgba(" + f + "," + (staerke || .55) + ")"); g.addColorStop(.45, "rgba(" + f + "," + ((staerke || .55) * .4) + ")"); g.addColorStop(1, "rgba(" + f + ",0)");
  ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.3); ctx.fill(); ctx.restore();
}
Object.assign(FIG, {
  frauMit(z, x, y, k, o) {   /* Frau mit Zusatz: arm (Hand nach rechts), becher, baby (im Arm) */
    o = o || {}; const m = o.links ? -1 : 1;
    if (o.arm) { z.line(x + m * 22 * k, y - 112 * k, x + m * 78 * k, y - 128 * k, { strokeWidth: 12 * k + 2, stroke: "#4a3c68" }); z.circ(x + m * 84 * k, y - 130 * k, 18 * k, { fill: C.haut, fillStyle: "solid" }); }
    FIG.frau(z, x, y, k);
    if (o.becher) { z.line(x + m * 16 * k, y - 104 * k, x + m * 34 * k, y - 140 * k, { strokeWidth: 12 * k + 2, stroke: "#4a3c68" }); z.poly([[x + m * 26 * k, y - 172 * k], [x + m * 58 * k, y - 172 * k], [x + m * 54 * k, y - 140 * k], [x + m * 30 * k, y - 140 * k]], { fill: "#fff", fillStyle: "solid" }); }
    if (o.baby) FIG.baby(z, x + 2 * k, y - 82 * k, k * .62);
  },
  frauLiegt(z, x, y, k) {   /* schlafend im Stroh, x,y = Mitte unten */
    z.poly([[x - 110 * k, y - 8 * k], [x + 60 * k, y - 4 * k], [x + 60 * k, y - 56 * k], [x - 100 * k, y - 60 * k]], { fill: "#5a4a7a" });
    z.mal("polygon", [[[x - 104 * k, y - 12 * k], [x + 56 * k, y - 8 * k], [x + 56 * k, y - 52 * k], [x - 96 * k, y - 56 * k]]], ["#6b5a92", "#4a3c68"]);
    z.ell(x + 92 * k, y - 34 * k, 70 * k, 64 * k, { fill: "#e6e1d2", fillStyle: "solid" });
    gesicht(z, x + 96 * k, y - 32 * k, 42 * k, { zu: true });
  },
  mannMitLaterne(z, x, y, k) { FIG.mann(z, x, y, k); FIG.laterne(z, x + 66 * k, y - 112 * k, k); },
  mutter(z, x, y, k) {
    z.poly([[x - 40 * k, y], [x + 40 * k, y], [x + 22 * k, y - 124 * k], [x - 22 * k, y - 124 * k]], { fill: "#c9463d", fillStyle: "solid" });
    z.mal("polygon", [[[x - 36 * k, y - 4], [x + 36 * k, y - 4], [x + 20 * k, y - 120 * k], [x - 20 * k, y - 120 * k]]], ["#d8564a", "#a8352e"]);
    z.circ(x, y - 182 * k, 30 * k, { fill: "#7a4a22", fillStyle: "solid" });
    z.ell(x, y - 150 * k, 58 * k, 62 * k, { fill: "#7a4a22", fillStyle: "solid" });
    gesicht(z, x, y - 146 * k, 46 * k);
  },
  kind(z, x, y, k) {
    z.line(x - 12 * k, y - 46 * k, x - 14 * k, y, { strokeWidth: 9 * k + 1, stroke: "#44506a" }); z.line(x + 12 * k, y - 46 * k, x + 14 * k, y, { strokeWidth: 9 * k + 1, stroke: "#44506a" });
    z.poly([[x - 26 * k, y - 44 * k], [x + 26 * k, y - 44 * k], [x + 24 * k, y - 108 * k], [x - 24 * k, y - 108 * k]], { fill: "#3f8fd4" });
    z.mal("polygon", [[[x - 22 * k, y - 48 * k], [x + 22 * k, y - 48 * k], [x + 20 * k, y - 104 * k], [x - 20 * k, y - 104 * k]]], ["#3f8fd4", "#2f6fae"]);
    gesicht(z, x, y - 138 * k, 54 * k);
    z.path("M" + (x - 28 * k) + " " + (y - 146 * k) + " Q" + (x - 20 * k) + " " + (y - 176 * k) + " " + x + " " + (y - 170 * k) + " Q" + (x + 24 * k) + " " + (y - 178 * k) + " " + (x + 28 * k) + " " + (y - 146 * k) + " Q" + x + " " + (y - 158 * k) + " " + (x - 28 * k) + " " + (y - 146 * k), { fill: "#f2c84b", fillStyle: "solid" });
  },
  baby(z, x, y, k) {   /* x,y = Mitte */
    z.ell(x + 14 * k, y, 120 * k, 66 * k, { fill: "#fbf7ee", fillStyle: "solid" });
    z.mal("ellipse", [x + 14 * k, y, 110 * k, 56 * k], ["#e4dccb"], { gap: 7 });
    z.path("M" + (x - 10 * k) + " " + (y - 26 * k) + " q30 24 70 -6", { strokeWidth: 2.4, stroke: "#c8bfa8" });
    gesicht(z, x - 40 * k, y - 4 * k, 46 * k, { zu: true });
  },
  hirte(z, x, y, k, o) {
    o = o || {}; const c = o.c || "#8b6a45";
    z.line(x + 34 * k, y, x + 36 * k, y - 210 * k, { strokeWidth: 8, stroke: "#6b4a2a" });
    z.path("M" + (x + 36 * k) + " " + (y - 210 * k) + " q14 -26 -6 -30", { strokeWidth: 8, stroke: "#6b4a2a" });
    z.line(x - 12 * k, y - 46 * k, x - 16 * k, y, { strokeWidth: 10 * k + 1, stroke: "#4a3b2c" }); z.line(x + 12 * k, y - 46 * k, x + 16 * k, y, { strokeWidth: 10 * k + 1, stroke: "#4a3b2c" });
    z.poly([[x - 32 * k, y - 40 * k], [x + 32 * k, y - 40 * k], [x + 24 * k, y - 132 * k], [x - 24 * k, y - 132 * k]], { fill: c });
    z.mal("polygon", [[[x - 28 * k, y - 44 * k], [x + 28 * k, y - 44 * k], [x + 20 * k, y - 128 * k], [x - 20 * k, y - 128 * k]]], [c, "#5a4632"]);
    z.line(x + 22 * k, y - 116 * k, x + 34 * k, y - 96 * k, { strokeWidth: 10 * k + 1, stroke: c });
    if (o.zeigt) z.line(x - 22 * k, y - 118 * k, x - 82 * k, y - 160 * k, { strokeWidth: 10 * k + 1, stroke: c });
    gesicht(z, x, y - 156 * k, 50 * k);
    z.ell(x, y - 176 * k, 84 * k, 18 * k, { fill: "#4a3b2c", fillStyle: "solid" }); z.path("M" + (x - 24 * k) + " " + (y - 178 * k) + " Q" + x + " " + (y - 226 * k) + " " + (x + 24 * k) + " " + (y - 178 * k) + " Z", { fill: "#4a3b2c", fillStyle: "solid" });
  },
  hund(z, x, y, k) {
    z.path("M" + (x - 50 * k) + " " + (y - 50 * k) + " q-26 -10 -24 -40", { strokeWidth: 8, stroke: C.ink });
    [-34, -18, 16, 32].forEach(d => z.line(x + d * k, y - 30 * k, x + d * k, y, { strokeWidth: 9 * k + 1, stroke: "#2b2b33" }));
    z.ell(x, y - 46 * k, 110 * k, 50 * k, { fill: "#2b2b33", fillStyle: "solid" }); z.ell(x + 22 * k, y - 38 * k, 34 * k, 24 * k, { fill: "#fff", fillStyle: "solid", stroke: "none" });
    z.circ(x + 56 * k, y - 82 * k, 50 * k, { fill: "#2b2b33", fillStyle: "solid" }); z.poly([[x + 40 * k, y - 100 * k], [x + 46 * k, y - 132 * k], [x + 62 * k, y - 104 * k]], { fill: "#2b2b33", fillStyle: "solid" });
    z.ell(x + 76 * k, y - 74 * k, 30 * k, 20 * k, { fill: "#fff", fillStyle: "solid" }); z.circ(x + 88 * k, y - 78 * k, 8 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 58 * k, y - 88 * k, 7 * k, { fill: "#fff", fillStyle: "solid", stroke: "none" });
  },
  krippe(z, x, y, k, baby) {
    z.line(x - 70 * k, y - 60 * k, x - 40 * k, y, { strokeWidth: 9, stroke: "#6b4a2a" }); z.line(x + 70 * k, y - 60 * k, x + 40 * k, y, { strokeWidth: 9, stroke: "#6b4a2a" });
    z.line(x - 54 * k, y - 4 * k, x + 54 * k, y - 60 * k, { strokeWidth: 8, stroke: "#6b4a2a" }); z.line(x + 54 * k, y - 4 * k, x - 54 * k, y - 60 * k, { strokeWidth: 8, stroke: "#6b4a2a" });
    z.poly([[x - 100 * k, y - 126 * k], [x + 100 * k, y - 126 * k], [x + 76 * k, y - 54 * k], [x - 76 * k, y - 54 * k]], { fill: C.holz2 });
    z.mal("polygon", [[[x - 94 * k, y - 122 * k], [x + 94 * k, y - 122 * k], [x + 72 * k, y - 58 * k], [x - 72 * k, y - 58 * k]]], [C.holz2, C.holz]);
    z.path("M" + (x - 100 * k) + " " + (y - 126 * k) + " q14 -26 32 -8 q14 -28 34 -6 q18 -26 34 -4 q18 -26 34 -2 q16 -22 30 8 Z", { fill: C.stroh, fillStyle: "solid" });
    if (baby) FIG.baby(z, x + 4 * k, y - 150 * k, k * .9);
  },
  stroh(z, x, y, k) {
    z.path("M" + (x - 130 * k) + " " + y + " Q" + (x - 90 * k) + " " + (y - 80 * k) + " " + (x - 10 * k) + " " + (y - 70 * k) + " Q" + (x + 60 * k) + " " + (y - 96 * k) + " " + (x + 130 * k) + " " + y + " Z", { fill: C.stroh, fillStyle: "solid" });
    z.mal("polygon", [[[x - 110 * k, y - 6], [x - 20 * k, y - 66 * k], [x + 110 * k, y - 6]]], ["#d9a83a", "#f0cd5e"], { gap: 5 });
    for (let i = 0; i < 9; i++) { const xx = x + r(-110, 110) * k, yy = y - r(8, 50) * k; z.line(xx, yy, xx + r(-24, 24) * k, yy - r(6, 18) * k, { strokeWidth: 2.4, stroke: "#a87a1c" }); }
  },
  eimer(z, x, y, k) {
    z.path("M" + (x - 36 * k) + " " + (y - 74 * k) + " Q" + x + " " + (y - 130 * k) + " " + (x + 36 * k) + " " + (y - 74 * k), { strokeWidth: 4 });
    z.poly([[x - 40 * k, y - 76 * k], [x + 40 * k, y - 76 * k], [x + 30 * k, y], [x - 30 * k, y]], { fill: "#b9c2cf", fillStyle: "solid" });
    z.mal("polygon", [[[x - 36 * k, y - 72 * k], [x + 36 * k, y - 72 * k], [x + 28 * k, y - 4], [x - 28 * k, y - 4]]], ["#9aa5b5"], { gap: 7 });
    z.ell(x, y - 76 * k, 80 * k, 22 * k, { fill: "#fffdf6", fillStyle: "solid" });
  },
  stern(z, x, y, k, glow) {   /* x,y = Mitte */
    if (glow) glanz(z.ctx, x, y, 170 * k, "255,236,160", .5);
    const p = sternPunkte(x, y, 70 * k, 30 * k, 5);
    z.poly(p, { fill: C.gelb, fillStyle: "solid", strokeWidth: 4 }); z.mal("polygon", [p], ["#f2b52c", "#ffe27a"], { gap: 6 });
  },
  sternchen(z, x, y, k) { z.poly(sternPunkte(x, y, 14 * k, 6 * k, 5), { fill: "#fff3b0", fillStyle: "solid", strokeWidth: 1.6, stroke: "#c9a83a" }); },
  mond(z, x, y, k) { const a = 60 * k, b = 48 * k; z.path("M" + (x + 10 * k) + " " + (y - 60 * k) + " A" + a + " " + a + " 0 1 0 " + (x + 60 * k) + " " + (y + 40 * k) + " A" + b + " " + b + " 0 1 1 " + (x + 10 * k) + " " + (y - 60 * k) + " Z", { fill: "#ffe58a", fillStyle: "solid", strokeWidth: 3 }); },
  hand(z, x, y, k) {
    [[-46, -70, 62], [-20, -98, 92], [6, -92, 86], [32, -66, 60]].forEach(f => z.rect(x + f[0] * k, y + f[1] * k, 22 * k, f[2] * k, { fill: C.haut, fillStyle: "solid" }));
    z.line(x - 54 * k, y + 14 * k, x - 88 * k, y - 22 * k, { strokeWidth: 22 * k, stroke: C.haut }); z.rect(x - 52 * k, y - 14 * k, 106 * k, 80 * k, { fill: C.haut, fillStyle: "solid" });
    z.mal("rectangle", [x - 48 * k, y - 10 * k, 98 * k, 72 * k], ["#e9a983"], { gap: 8 });
  },
  herz(z, x, y, k) { z.path("M" + x + " " + (y + 40 * k) + " C" + (x - 70 * k) + " " + (y - 10 * k) + " " + (x - 40 * k) + " " + (y - 70 * k) + " " + x + " " + (y - 30 * k) + " C" + (x + 40 * k) + " " + (y - 70 * k) + " " + (x + 70 * k) + " " + (y - 10 * k) + " " + x + " " + (y + 40 * k) + " Z", { fill: "#e2546b", fillStyle: "solid", strokeWidth: 3 }); },
  kueken(z, x, y, k) { z.circ(x, y - 22 * k, 44 * k, { fill: "#f7d54a", fillStyle: "solid" }); z.circ(x + 20 * k, y - 50 * k, 30 * k, { fill: "#f7d54a", fillStyle: "solid" }); z.poly([[x + 32 * k, y - 52 * k], [x + 46 * k, y - 48 * k], [x + 32 * k, y - 44 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 1.6 }); z.circ(x + 24 * k, y - 54 * k, 5 * k, { fill: C.ink, fillStyle: "solid" }); },
  tuer(z, x, y, k, offen) {
    z.rect(x - 66 * k, y - 196 * k, 132 * k, 196 * k, { fill: offen ? "#ffd57a" : C.holzD, fillStyle: "solid" });
    if (!offen) { z.mal("rectangle", [x - 62 * k, y - 192 * k, 124 * k, 188 * k], [C.holz2, "#8a5226"], { gap: 5 }); z.line(x - 22 * k, y - 192 * k, x - 22 * k, y - 4, { strokeWidth: 2.4, stroke: C.holzD }); z.line(x + 22 * k, y - 192 * k, x + 22 * k, y - 4, { strokeWidth: 2.4, stroke: C.holzD }); z.circ(x + 40 * k, y - 96 * k, 14 * k, { fill: "#e3a920", fillStyle: "solid" }); }
  },
  stall(z, x, y, k, o) {   /* Stall von außen; x,y = Mitte unten. o.offen: Tür offen + Licht; o.licht: Fenster hell */
    o = o || {}; const X = v => x + (v - 840) * k, Y = v => y + (v - 804) * k;
    if (o.offen) glanz(z.ctx, X(740), Y(700), 260 * k, "255,200,110", .6);
    z.rect(X(600), Y(520), 480 * k, 284 * k, { fill: C.holz, fillStyle: "solid" });
    z.mal("rectangle", [X(604), Y(524), 472 * k, 276 * k], [C.holz2, C.holz], { gap: 5, fw: 3.4 });
    for (let v = 560; v < 800; v += 40) z.line(X(604), Y(v) + r(-3, 3), X(1076), Y(v) + r(-3, 3), { strokeWidth: 2, stroke: C.holzD });
    z.poly([[X(566), Y(528)], [X(1114), Y(528)], [X(840), Y(330)]], { fill: C.dach, fillStyle: "solid" });
    z.mal("polygon", [[[X(580), Y(524)], [X(1100), Y(524)], [X(840), Y(340)]]], ["#6d3c1c", C.dach], { gap: 6 });
    z.path("M" + X(556) + " " + Y(534) + " Q" + X(700) + " " + Y(420) + " " + X(840) + " " + Y(318) + " Q" + X(980) + " " + Y(420) + " " + X(1124) + " " + Y(534) + " Q" + X(1110) + " " + Y(552) + " " + X(1090) + " " + Y(536) + " Q" + X(980) + " " + Y(450) + " " + X(840) + " " + Y(352) + " Q" + X(700) + " " + Y(450) + " " + X(590) + " " + Y(540) + " Q" + X(568) + " " + Y(552) + " " + X(556) + " " + Y(534) + " Z", { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 });
    FIG.tuer(z, X(740), Y(804), k * 1.06, o.offen);
    z.rect(X(900), Y(596), 112 * k, 90 * k, { fill: o.licht || o.offen ? "#ffd57a" : "#1e2340", fillStyle: "solid", strokeWidth: 4 });
    z.line(X(956), Y(598), X(956), Y(684), { strokeWidth: 4, stroke: C.holzD }); z.line(X(902), Y(641), X(1010), Y(641), { strokeWidth: 4, stroke: C.holzD });
    z.path("M" + X(890) + " " + Y(594) + " q" + 66 * k + " " + (-18 * k) + " " + 132 * k + " 0", { stroke: C.schnee, strokeWidth: 8 });
  }
});

/* Wortliste aus woerter.csv (automatisch) */
const WORTE = [
  { id: "schnee", w: "Schnee", art: "der", paket: "Winter", vid: "SCHNEE", vidFa: "FA_SCHNEE" },
  { id: "schneemann", w: "Schneemann", art: "der", paket: "Winter", vid: "SCHNEEMANN", vidFa: "FA_SCHNEEMANN" },
  { id: "muetze", w: "Mütze", art: "die", paket: "Winter", vid: "MUETZE", vidFa: "FA_MUETZE" },
  { id: "schal", w: "Schal", art: "der", paket: "Winter", vid: "SCHAL", vidFa: "FA_SCHAL" },
  { id: "handschuh", w: "Handschuh", art: "der", paket: "Winter", vid: "HANDSCHUH", vidFa: "FA_HANDSCHUH" },
  { id: "stiefel", w: "Stiefel", art: "der", paket: "Winter", vid: "STIEFEL", vidFa: "FA_STIEFEL" },
  { id: "schlitten", w: "Schlitten", art: "der", paket: "Winter", vid: "SCHLITTEN", vidFa: "FA_SCHLITTEN" },
  { id: "tanne", w: "Tanne", art: "die", paket: "Winter", vid: "TANNE", vidFa: "FA_TANNE" },
  { id: "stern", w: "Stern", art: "der", paket: "Weihnachten", vid: "STERN", vidFa: "FA_STERN" },
  { id: "kerze", w: "Kerze", art: "die", paket: "Weihnachten", vid: "KERZE", vidFa: "FA_KERZE" },
  { id: "geschenk", w: "Geschenk", art: "das", paket: "Weihnachten", vid: "GESCHENK", vidFa: "FA_GESCHENK" },
  { id: "keks", w: "Keks", art: "der", paket: "Weihnachten", vid: "KEKS", vidFa: "FA_KEKS" },
  { id: "weihnachtsmann", w: "Weihnachtsmann", art: "der", paket: "Weihnachten", vid: "WEIHNACHTSMANN", vidFa: "FA_WEIHNACHTSMANN" },
  { id: "krippe", w: "Krippe", art: "die", paket: "Weihnachten", vid: "KRIPPE", vidFa: "FA_KRIPPE" },
  { id: "stall", w: "Stall", art: "der", paket: "Weihnachten", vid: "STALL", vidFa: "FA_STALL" },
  { id: "baby", w: "Baby", art: "das", paket: "Weihnachten", vid: "BABY", vidFa: "FA_BABY" },
  { id: "esel", w: "Esel", art: "der", paket: "Weihnachten", vid: "ESEL", vidFa: "FA_ESEL" },
  { id: "hirte", w: "Hirte", art: "der", paket: "Weihnachten", vid: "HIRTE", vidFa: "FA_HIRTE" },
  { id: "hund", w: "Hund", art: "der", paket: "Tiere", vid: "HUND", vidFa: "FA_HUND" },
  { id: "katze", w: "Katze", art: "die", paket: "Tiere", vid: "KATZE", vidFa: "FA_KATZE" },
  { id: "maus", w: "Maus", art: "die", paket: "Tiere", vid: "MAUS", vidFa: "FA_MAUS" },
  { id: "kuh", w: "Kuh", art: "die", paket: "Tiere", vid: "KUH", vidFa: "FA_KUH" },
  { id: "pferd", w: "Pferd", art: "das", paket: "Tiere", vid: "PFERD", vidFa: "FA_PFERD" },
  { id: "schaf", w: "Schaf", art: "das", paket: "Tiere", vid: "SCHAF", vidFa: "FA_SCHAF" },
  { id: "huhn", w: "Huhn", art: "das", paket: "Tiere", vid: "HUHN", vidFa: "FA_HUHN" },
  { id: "schwein", w: "Schwein", art: "das", paket: "Tiere", vid: "SCHWEIN", vidFa: "FA_SCHWEIN" },
  { id: "ente", w: "Ente", art: "die", paket: "Tiere", vid: "ENTE", vidFa: "FA_ENTE" },
  { id: "fisch", w: "Fisch", art: "der", paket: "Tiere", vid: "FISCH", vidFa: "FA_FISCH" },
  { id: "vogel", w: "Vogel", art: "der", paket: "Tiere", vid: "VOGEL", vidFa: "FA_VOGEL" },
  { id: "hase", w: "Hase", art: "der", paket: "Tiere", vid: "HASE", vidFa: "FA_HASE" }
];

/* ==========================================================================
   Lesewerkstatt: Bilder im Kreidestil (eigene Zeichnungen, rough.js).
   Nutzt FIG und Z() aus frei/kreide.js. Raster 400 × 400, x,y = Fußpunkt.
   ========================================================================== */
const FIG_LW = {
  /* ---------- Winter ---------- */
  schneemann(z, x, y, k) {
    z.circ(x, y - 70 * k, 140 * k, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); z.mal("circle", [x, y - 70 * k, 130 * k], [C.schnee2], { gap: 9, fw: 1.6 });
    z.circ(x, y - 180 * k, 104 * k, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); z.mal("circle", [x, y - 180 * k, 96 * k], [C.schnee2], { gap: 9, fw: 1.6 });
    z.circ(x, y - 268 * k, 80 * k, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 });
    z.line(x - 50 * k, y - 190 * k, x - 120 * k, y - 240 * k, { strokeWidth: 6, stroke: "#6b4a2a" }); z.line(x + 50 * k, y - 190 * k, x + 120 * k, y - 240 * k, { strokeWidth: 6, stroke: "#6b4a2a" });
    [-160, -195, -225].forEach(d => z.circ(x, y + d * k, 11 * k, { fill: C.ink, fillStyle: "solid" }));
    z.circ(x - 16 * k, y - 280 * k, 10 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 16 * k, y - 280 * k, 10 * k, { fill: C.ink, fillStyle: "solid" });
    z.poly([[x - 4 * k, y - 266 * k], [x + 50 * k, y - 258 * k], [x - 4 * k, y - 252 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 2 });
    z.rect(x - 34 * k, y - 360 * k, 68 * k, 50 * k, { fill: C.ink, fillStyle: "solid" }); z.rect(x - 54 * k, y - 314 * k, 108 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
  },
  muetze(z, x, y, k) {
    const f = "#d8432f";
    z.path("M" + (x - 110 * k) + " " + (y - 40 * k) + " Q" + (x - 110 * k) + " " + (y - 230 * k) + " " + x + " " + (y - 230 * k) + " Q" + (x + 110 * k) + " " + (y - 230 * k) + " " + (x + 110 * k) + " " + (y - 40 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 130 * k, 190 * k, 170 * k], [f, "#a8352e"]);
    z.rect(x - 124 * k, y - 60 * k, 248 * k, 56 * k, { fill: C.schnee, fillStyle: "solid" });
    for (let i = -5; i <= 5; i++) z.line(x + i * 21 * k, y - 56 * k, x + i * 21 * k, y - 8 * k, { strokeWidth: 2.4, stroke: C.schnee2 });
    z.circ(x, y - 250 * k, 70 * k, { fill: C.schnee, fillStyle: "solid" }); z.mal("circle", [x, y - 250 * k, 60 * k], [C.schnee2], { gap: 6 });
  },
  schal(z, x, y, k) {
    const f = "#3d6fb8", g = "#ffd257";
    z.path("M" + (x - 150 * k) + " " + (y - 260 * k) + " Q" + x + " " + (y - 330 * k) + " " + (x + 150 * k) + " " + (y - 260 * k) + " L" + (x + 130 * k) + " " + (y - 210 * k)
      + " Q" + x + " " + (y - 270 * k) + " " + (x - 130 * k) + " " + (y - 210 * k) + " Z", { fill: f, fillStyle: "solid" });   /* um den Hals */
    z.poly([[x + 40 * k, y - 240 * k], [x + 100 * k, y - 250 * k], [x + 110 * k, y - 50 * k], [x + 50 * k, y - 40 * k]], { fill: f, fillStyle: "solid" });   /* hängendes Ende */
    [-200, -150, -100].forEach(d => z.line(x + 44 * k, y + (d + 2) * k, x + 106 * k, y + (d - 6) * k, { strokeWidth: 12, stroke: g }));
    for (let i = 0; i < 5; i++) z.line(x + (54 + i * 12) * k, y - 42 * k, x + (52 + i * 12) * k, y - 6 * k, { strokeWidth: 4, stroke: f });   /* Fransen */
  },
  handschuh(z, x, y, k) {   /* Fäustling */
    const f = "#3f8a58";
    z.path("M" + (x - 70 * k) + " " + (y - 70 * k) + " L" + (x - 80 * k) + " " + (y - 230 * k) + " Q" + (x - 70 * k) + " " + (y - 330 * k) + " " + (x + 10 * k) + " " + (y - 330 * k)
      + " Q" + (x + 80 * k) + " " + (y - 330 * k) + " " + (x + 80 * k) + " " + (y - 230 * k) + " L" + (x + 74 * k) + " " + (y - 70 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 200 * k, 140 * k, 220 * k], [f, "#2f6b45"]);
    z.path("M" + (x - 76 * k) + " " + (y - 190 * k) + " Q" + (x - 150 * k) + " " + (y - 210 * k) + " " + (x - 140 * k) + " " + (y - 260 * k) + " Q" + (x - 120 * k) + " " + (y - 290 * k) + " " + (x - 80 * k) + " " + (y - 250 * k), { fill: f, fillStyle: "solid" });   /* Daumen */
    z.rect(x - 84 * k, y - 80 * k, 166 * k, 70 * k, { fill: C.schnee, fillStyle: "solid" });
    for (let i = -3; i <= 3; i++) z.line(x + i * 22 * k, y - 76 * k, x + i * 22 * k, y - 14 * k, { strokeWidth: 2.4, stroke: C.schnee2 });
  },
  stiefel(z, x, y, k) {
    const f = "#6b4a2a";
    z.path("M" + (x - 90 * k) + " " + (y - 300 * k) + " L" + (x + 10 * k) + " " + (y - 300 * k) + " L" + (x + 20 * k) + " " + (y - 110 * k) + " Q" + (x + 140 * k) + " " + (y - 100 * k) + " " + (x + 150 * k) + " " + (y - 40 * k)
      + " L" + (x + 150 * k) + " " + (y - 10 * k) + " L" + (x - 100 * k) + " " + (y - 10 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("polygon", [[[x - 84 * k, y - 290 * k], [x + 4 * k, y - 290 * k], [x + 14 * k, y - 100 * k], [x + 140 * k, y - 40 * k], [x - 94 * k, y - 20 * k]]], [f, "#4b2b14"]);
    z.rect(x - 104 * k, y - 26 * k, 260 * k, 24 * k, { fill: C.ink, fillStyle: "solid" });   /* Sohle */
    z.ell(x - 40 * k, y - 300 * k, 130 * k, 44 * k, { fill: "#f0e6cf", fillStyle: "solid" }); z.mal("ellipse", [x - 40 * k, y - 300 * k, 120 * k, 36 * k], ["#d9cba8"], { gap: 5 });   /* Fell */
  },
  schlitten(z, x, y, k) {
    const h = "#a5682f";
    z.path("M" + (x - 160 * k) + " " + (y - 20 * k) + " L" + (x + 120 * k) + " " + (y - 20 * k) + " Q" + (x + 180 * k) + " " + (y - 20 * k) + " " + (x + 170 * k) + " " + (y - 80 * k), { strokeWidth: 9, stroke: C.ink });   /* Kufe */
    [-120, -40, 40, 110].forEach(d => z.line(x + d * k, y - 20 * k, x + d * k, y - 90 * k, { strokeWidth: 9, stroke: h }));
    z.rect(x - 150 * k, y - 120 * k, 290 * k, 34 * k, { fill: h, fillStyle: "solid" }); z.mal("rectangle", [x - 146 * k, y - 116 * k, 282 * k, 26 * k], [h, C.holz]);
    z.path("M" + (x + 140 * k) + " " + (y - 100 * k) + " q60 -20 40 -80", { strokeWidth: 4, stroke: C.rot });   /* Seil */
  },
  /* ---------- Weihnachten ---------- */
  kerze(z, x, y, k) {
    glanz(z.ctx, x, y - 300 * k, 120 * k, "255,214,120", .5);
    z.ell(x, y - 20 * k, 220 * k, 40 * k, { fill: C.gelb, fillStyle: "solid" });
    z.rect(x - 44 * k, y - 250 * k, 88 * k, 230 * k, { fill: "#fbf3d9", fillStyle: "solid" }); z.mal("rectangle", [x - 40 * k, y - 246 * k, 80 * k, 222 * k], ["#e9dcb8"], { gap: 7 });
    z.line(x, y - 250 * k, x, y - 270 * k, { strokeWidth: 3 });
    z.path("M" + x + " " + (y - 340 * k) + " Q" + (x + 30 * k) + " " + (y - 290 * k) + " " + x + " " + (y - 266 * k) + " Q" + (x - 30 * k) + " " + (y - 290 * k) + " " + x + " " + (y - 340 * k) + " Z", { fill: C.orange, fillStyle: "solid", stroke: "#c4621a", strokeWidth: 2 });
    z.ell(x, y - 290 * k, 14 * k, 30 * k, { fill: "#ffe48a", fillStyle: "solid", stroke: "none" });
  },
  geschenk(z, x, y, k) {
    const f = "#3d6fb8", b = "#d8432f";
    z.rect(x - 130 * k, y - 200 * k, 260 * k, 190 * k, { fill: f, fillStyle: "solid" }); z.mal("rectangle", [x - 126 * k, y - 196 * k, 252 * k, 182 * k], [f, C.blauD]);
    z.rect(x - 140 * k, y - 236 * k, 280 * k, 44 * k, { fill: f, fillStyle: "solid" });
    z.rect(x - 18 * k, y - 236 * k, 36 * k, 226 * k, { fill: b, fillStyle: "solid" });
    z.ell(x - 50 * k, y - 262 * k, 90 * k, 50 * k, { fill: b, fillStyle: "solid" }); z.ell(x + 50 * k, y - 262 * k, 90 * k, 50 * k, { fill: b, fillStyle: "solid" });
    z.circ(x, y - 252 * k, 30 * k, { fill: b, fillStyle: "solid" });
  },
  keks(z, x, y, k) {
    const f = "#d9a35a";
    z.circ(x, y - 150 * k, 280 * k, { fill: f, fillStyle: "solid", strokeWidth: 3 }); z.mal("circle", [x, y - 150 * k, 266 * k], [f, "#b9813e"], { gap: 7 });
    [[-60, -60], [40, -90], [70, 10], [-20, 40], [-80, 40], [10, -20], [80, -50]].forEach(([a, b]) => z.ell(x + a * k, y - 150 * k + b * k, 26 * k, 20 * k, { fill: "#4b2b14", fillStyle: "solid", strokeWidth: 1.6 }));
  },
  weihnachtsmann(z, x, y, k) {
    const r = "#d8432f";
    z.line(x - 26 * k, y - 60 * k, x - 30 * k, y, { strokeWidth: 16, stroke: C.ink }); z.line(x + 26 * k, y - 60 * k, x + 30 * k, y, { strokeWidth: 16, stroke: C.ink });
    z.poly([[x - 90 * k, y - 50 * k], [x + 90 * k, y - 50 * k], [x + 70 * k, y - 210 * k], [x - 70 * k, y - 210 * k]], { fill: r, fillStyle: "solid" });
    z.mal("polygon", [[[x - 84 * k, y - 54 * k], [x + 84 * k, y - 54 * k], [x + 66 * k, y - 206 * k], [x - 66 * k, y - 206 * k]]], [r, "#a8352e"]);
    z.rect(x - 86 * k, y - 120 * k, 172 * k, 24 * k, { fill: C.ink, fillStyle: "solid" }); z.rect(x - 16 * k, y - 124 * k, 32 * k, 32 * k, { fill: C.gelb, fillStyle: "solid", strokeWidth: 2 });
    z.rect(x - 92 * k, y - 60 * k, 184 * k, 18 * k, { fill: C.schnee, fillStyle: "solid" });
    gesicht(z, x, y - 260 * k, 84 * k);
    z.path("M" + (x - 46 * k) + " " + (y - 250 * k) + " Q" + (x - 50 * k) + " " + (y - 160 * k) + " " + x + " " + (y - 150 * k) + " Q" + (x + 50 * k) + " " + (y - 160 * k) + " " + (x + 46 * k) + " " + (y - 250 * k)
      + " Q" + x + " " + (y - 226 * k) + " " + (x - 46 * k) + " " + (y - 250 * k) + " Z", { fill: C.schnee, fillStyle: "solid", strokeWidth: 2.4 });   /* Bart */
    z.path("M" + (x - 50 * k) + " " + (y - 290 * k) + " Q" + (x + 10 * k) + " " + (y - 380 * k) + " " + (x + 90 * k) + " " + (y - 330 * k) + " L" + (x + 50 * k) + " " + (y - 290 * k) + " Z", { fill: r, fillStyle: "solid" });   /* Mütze */
    z.rect(x - 56 * k, y - 302 * k, 112 * k, 20 * k, { fill: C.schnee, fillStyle: "solid" }); z.circ(x + 92 * k, y - 330 * k, 30 * k, { fill: C.schnee, fillStyle: "solid" });
  },
  esel(z, x, y, k) {   /* grau, lange Ohren */
    const f = "#9a9aa4", d = "#6f6f7a";
    [-58, -36, 34, 56].forEach(e => z.line(x + e * k, y - 56 * k, x + e * k + r(-4, 4), y, { strokeWidth: 11, stroke: d }));
    z.ell(x, y - 84 * k, 166 * k, 82 * k, { fill: f, fillStyle: "solid" }); z.mal("ellipse", [x, y - 84 * k, 156 * k, 72 * k], [f, d]);
    z.path("M" + (x - 80 * k) + " " + (y - 96 * k) + " q-20 30 -10 60", { strokeWidth: 5, stroke: d });
    z.poly([[x + 50 * k, y - 104 * k], [x + 84 * k, y - 170 * k], [x + 110 * k, y - 156 * k], [x + 84 * k, y - 92 * k]], { fill: f, fillStyle: "solid" });
    z.ell(x + 116 * k, y - 160 * k, 70 * k, 42 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 140 * k, y - 152 * k, 28 * k, 26 * k, { fill: "#cfcfd6", fillStyle: "solid" });
    z.ell(x + 84 * k, y - 210 * k, 18 * k, 80 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 104 * k, y - 206 * k, 18 * k, 80 * k, { fill: f, fillStyle: "solid" });
    z.circ(x + 112 * k, y - 168 * k, 7 * k, { fill: C.ink, fillStyle: "solid" });
  },
  maus(z, x, y, k) {   /* Seitenansicht: große runde Ohren, spitze Nase, Schnurrhaare, langer Schwanz */
    const f = "#9aa1ad", d = "#7b8290";
    z.path("M" + (x - 80 * k) + " " + (y - 40 * k) + " q-60 10 -80 -30 q-14 -30 10 -50", { strokeWidth: 6, stroke: "#e8a0a8" });   /* Schwanz */
    [-40, -10, 30, 56].forEach(e => z.line(x + e * k, y - 20 * k, x + e * k + 4, y, { strokeWidth: 6, stroke: "#e8a0a8" }));
    z.path("M" + (x - 90 * k) + " " + (y - 30 * k) + " Q" + (x - 80 * k) + " " + (y - 130 * k) + " " + (x + 20 * k) + " " + (y - 120 * k)
      + " Q" + (x + 110 * k) + " " + (y - 110 * k) + " " + (x + 140 * k) + " " + (y - 50 * k) + " Q" + (x + 60 * k) + " " + (y - 14 * k) + " " + (x - 90 * k) + " " + (y - 30 * k) + " Z", { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x - 4 * k, y - 66 * k, 170 * k, 70 * k], [f, d]);
    z.circ(x + 46 * k, y - 132 * k, 74 * k, { fill: f, fillStyle: "solid" }); z.circ(x + 46 * k, y - 132 * k, 44 * k, { fill: "#f4b6c0", fillStyle: "solid", stroke: "none" });   /* Ohr */
    z.circ(x + 140 * k, y - 52 * k, 16 * k, { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2 });   /* Nase */
    z.circ(x + 92 * k, y - 82 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
    [[-10, -8], [0, 0], [10, 8]].forEach(([a, b]) => { z.line(x + 128 * k, y - 50 * k + a * k, x + 190 * k, y - 62 * k + b * 2 * k, { strokeWidth: 2 }); });
  },
  hund(z, x, y, k) {   /* hellbraun, Schlappohr, lange Schnauze, Zunge, Halsband, Schwanz hoch */
    const f = "#c98a4b", d = "#9a6230";
    z.path("M" + (x - 80 * k) + " " + (y - 80 * k) + " q-30 -40 -10 -90", { strokeWidth: 12, stroke: d });   /* Schwanz */
    [-60, -34, 30, 56].forEach(e => z.line(x + e * k, y - 50 * k, x + e * k, y, { strokeWidth: 14, stroke: d }));
    z.ell(x, y - 80 * k, 180 * k, 84 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 80 * k, 170 * k, 74 * k], [f, d]);
    z.ell(x + 96 * k, y - 140 * k, 92 * k, 84 * k, { fill: f, fillStyle: "solid" });   /* Kopf */
    z.ell(x + 150 * k, y - 124 * k, 74 * k, 44 * k, { fill: "#e0b483", fillStyle: "solid" });   /* Schnauze */
    z.circ(x + 184 * k, y - 132 * k, 20 * k, { fill: C.ink, fillStyle: "solid" });   /* Nase */
    z.path("M" + (x + 150 * k) + " " + (y - 104 * k) + " q8 30 22 0", { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2.4 });   /* Zunge */
    z.ell(x + 70 * k, y - 120 * k, 36 * k, 78 * k, { fill: "#6b3f1c", fillStyle: "solid" });   /* Schlappohr */
    z.circ(x + 108 * k, y - 156 * k, 12 * k, { fill: C.ink, fillStyle: "solid" });
    z.line(x + 56 * k, y - 96 * k, x + 104 * k, y - 92 * k, { strokeWidth: 9, stroke: "#d8432f" });   /* Halsband */
  },
  katze(z, x, y, k) {
    const f = "#e8913a", d = "#b9661f";
    z.path("M" + (x - 70 * k) + " " + (y - 40 * k) + " q-60 -10 -50 -90 q4 -24 18 -10", { strokeWidth: 12, stroke: d });   /* Schwanz */
    [-50, -26, 26, 50].forEach(e => z.line(x + e * k, y - 40 * k, x + e * k, y, { strokeWidth: 12, stroke: d }));
    z.ell(x, y - 62 * k, 160 * k, 80 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 62 * k, 150 * k, 70 * k], [f, d]);
    z.circ(x + 78 * k, y - 120 * k, 86 * k, { fill: f, fillStyle: "solid" });
    z.poly([[x + 44 * k, y - 140 * k], [x + 50 * k, y - 196 * k], [x + 80 * k, y - 158 * k]], { fill: f, fillStyle: "solid" });
    z.poly([[x + 112 * k, y - 140 * k], [x + 108 * k, y - 196 * k], [x + 80 * k, y - 158 * k]], { fill: f, fillStyle: "solid" });
    z.circ(x + 62 * k, y - 126 * k, 12 * k, { fill: "#3d7a3a", fillStyle: "solid" }); z.circ(x + 96 * k, y - 126 * k, 12 * k, { fill: "#3d7a3a", fillStyle: "solid" });
    z.poly([[x + 72 * k, y - 110 * k], [x + 86 * k, y - 110 * k], [x + 79 * k, y - 101 * k]], { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2 });
    [[-1, -6], [-1, 4], [1, -6], [1, 4]].forEach(([s, dy]) => z.line(x + 79 * k + s * 12 * k, y - 104 * k + dy * k, x + 79 * k + s * 64 * k, y - 112 * k + dy * 2 * k, { strokeWidth: 2.2 }));
  },
  schwein(z, x, y, k) {
    const f = "#f4a9b8", d = "#e0849a";
    [-56, -30, 28, 54].forEach(e => z.line(x + e * k, y - 40 * k, x + e * k, y, { strokeWidth: 14, stroke: d }));
    z.path("M" + (x - 92 * k) + " " + (y - 80 * k) + " q-26 -6 -18 -26 q14 -10 16 10", { strokeWidth: 5, stroke: d });   /* Ringelschwanz */
    z.ell(x, y - 74 * k, 190 * k, 100 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 74 * k, 180 * k, 90 * k], [f, d]);
    z.circ(x + 96 * k, y - 100 * k, 84 * k, { fill: f, fillStyle: "solid" });
    z.poly([[x + 70 * k, y - 134 * k], [x + 66 * k, y - 170 * k], [x + 92 * k, y - 140 * k]], { fill: d, fillStyle: "solid" });
    z.poly([[x + 104 * k, y - 140 * k], [x + 124 * k, y - 170 * k], [x + 122 * k, y - 132 * k]], { fill: d, fillStyle: "solid" });
    z.ell(x + 130 * k, y - 94 * k, 40 * k, 30 * k, { fill: "#f7c3cd", fillStyle: "solid" });
    z.circ(x + 124 * k, y - 94 * k, 6 * k, { fill: C.ink, fillStyle: "solid" }); z.circ(x + 138 * k, y - 94 * k, 6 * k, { fill: C.ink, fillStyle: "solid" });
    z.circ(x + 96 * k, y - 116 * k, 9 * k, { fill: C.ink, fillStyle: "solid" });
  },
  ente(z, x, y, k) {
    const f = "#f6f1e6", g = "#3f8a58";
    z.path("M" + (x - 150 * k) + " " + (y - 6 * k) + " q40 -18 80 0 q40 18 80 0 q40 -18 80 0 q40 18 80 0", { strokeWidth: 6, stroke: C.blau });   /* Wasser */
    z.ell(x - 10 * k, y - 58 * k, 180 * k, 90 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x - 10 * k, y - 58 * k, 170 * k, 80 * k], ["#ddd6c6"], { gap: 7 });
    z.ell(x - 20 * k, y - 66 * k, 90 * k, 44 * k, { fill: "#cfc5b0", fillStyle: "solid" });   /* Flügel */
    z.circ(x + 64 * k, y - 120 * k, 74 * k, { fill: g, fillStyle: "solid" });
    z.poly([[x + 94 * k, y - 126 * k], [x + 142 * k, y - 116 * k], [x + 94 * k, y - 104 * k]], { fill: C.orange, fillStyle: "solid", strokeWidth: 2.4 });
    z.circ(x + 72 * k, y - 130 * k, 9 * k, { fill: C.ink, fillStyle: "solid" });
    z.line(x + 40 * k, y - 86 * k, x + 84 * k, y - 86 * k, { strokeWidth: 5, stroke: "#fff" });
  },
  fisch(z, x, y, k) {
    const f = "#f39a2b", d = "#d8432f";
    z.poly([[x - 90 * k, y - 90 * k], [x - 150 * k, y - 140 * k], [x - 140 * k, y - 40 * k]], { fill: d, fillStyle: "solid" });
    z.ell(x, y - 90 * k, 200 * k, 110 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 90 * k, 190 * k, 100 * k], [f, "#e07f1c"]);
    z.poly([[x - 20 * k, y - 140 * k], [x + 10 * k, y - 176 * k], [x + 30 * k, y - 140 * k]], { fill: d, fillStyle: "solid" });
    z.path("M" + (x + 40 * k) + " " + (y - 130 * k) + " q-20 40 0 80", { strokeWidth: 3 });
    z.circ(x + 66 * k, y - 104 * k, 22 * k, { fill: "#fff", fillStyle: "solid" }); z.circ(x + 70 * k, y - 104 * k, 10 * k, { fill: C.ink, fillStyle: "solid" });
    [[150, -170], [176, -210], [140, -230]].forEach(([dx, dy], i) => z.circ(x + dx * k, y + dy * k, (14 - i * 3) * k, { stroke: C.blau, strokeWidth: 2.6 }));
  },
  vogel(z, x, y, k) {
    const f = "#3d6fb8", b = "#e2546b";
    z.line(x - 150 * k, y - 20 * k, x + 150 * k, y - 34 * k, { strokeWidth: 12, stroke: "#6b4a2a" });   /* Ast */
    z.line(x - 10 * k, y - 56 * k, x - 14 * k, y - 26 * k, { strokeWidth: 4, stroke: C.orange }); z.line(x + 14 * k, y - 56 * k, x + 12 * k, y - 28 * k, { strokeWidth: 4, stroke: C.orange });
    z.poly([[x - 60 * k, y - 100 * k], [x - 130 * k, y - 120 * k], [x - 120 * k, y - 80 * k]], { fill: f, fillStyle: "solid" });
    z.ell(x, y - 100 * k, 130 * k, 96 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 100 * k, 120 * k, 86 * k], [f, C.blauD]);
    z.ell(x + 10 * k, y - 86 * k, 70 * k, 50 * k, { fill: b, fillStyle: "solid" });   /* Brust */
    z.circ(x + 50 * k, y - 160 * k, 76 * k, { fill: f, fillStyle: "solid" });
    z.poly([[x + 82 * k, y - 166 * k], [x + 116 * k, y - 158 * k], [x + 82 * k, y - 148 * k]], { fill: C.gelb, fillStyle: "solid", strokeWidth: 2.4 });
    z.circ(x + 62 * k, y - 170 * k, 10 * k, { fill: C.ink, fillStyle: "solid" });
  },
  hase(z, x, y, k) {
    const f = "#b9a58c", d = "#8f7a60";
    z.ell(x - 40 * k, y - 34 * k, 90 * k, 50 * k, { fill: f, fillStyle: "solid" });   /* Hinterbein */
    z.ell(x, y - 70 * k, 150 * k, 110 * k, { fill: f, fillStyle: "solid" });
    z.mal("ellipse", [x, y - 70 * k, 140 * k, 100 * k], [f, d]);
    z.circ(x - 78 * k, y - 76 * k, 36 * k, { fill: "#fbf7ee", fillStyle: "solid" });   /* Puschelschwanz */
    z.ell(x + 46 * k, y - 236 * k, 34 * k, 120 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 46 * k, y - 236 * k, 14 * k, 90 * k, { fill: "#f1b1a2", fillStyle: "solid", stroke: "none" });
    z.ell(x + 84 * k, y - 230 * k, 34 * k, 120 * k, { fill: f, fillStyle: "solid" }); z.ell(x + 84 * k, y - 230 * k, 14 * k, 90 * k, { fill: "#f1b1a2", fillStyle: "solid", stroke: "none" });
    z.circ(x + 66 * k, y - 140 * k, 90 * k, { fill: f, fillStyle: "solid" });
    z.circ(x + 84 * k, y - 150 * k, 11 * k, { fill: C.ink, fillStyle: "solid" });
    z.circ(x + 108 * k, y - 128 * k, 12 * k, { fill: "#e2546b", fillStyle: "solid", strokeWidth: 2 });
    z.ell(x + 30 * k, y - 8 * k, 50 * k, 18 * k, { fill: f, fillStyle: "solid" });
  }
};

function flocke(z, x, y, k, c) { const s = 26 * k; [[0, -s, 0, s], [-s * .87, -s / 2, s * .87, s / 2], [-s * .87, s / 2, s * .87, -s / 2]].forEach(l => z.line(x + l[0], y + l[1], x + l[2], y + l[3], { strokeWidth: 6, stroke: c || "#4f8fd0" })); }

/* Zeichnung je Wort (Schlüssel = id in woerter.csv; Raster 400 × 400) */
const BILDER = {
  schnee: z => { flocke(z, 110, 110, 1.6); flocke(z, 290, 90, 1.1); flocke(z, 250, 220, 1.9); flocke(z, 90, 250, 1.2); flocke(z, 190, 170, .9); z.path("M20 380 Q120 300 220 340 Q300 300 380 380 Z", { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); },
  schneemann: z => FIG_LW.schneemann(z, 200, 392, 1.02),
  muetze: z => FIG_LW.muetze(z, 200, 340, 1.05),
  schal: z => FIG_LW.schal(z, 190, 360, 1.05),
  handschuh: z => FIG_LW.handschuh(z, 220, 375, 1.05),
  stiefel: z => FIG_LW.stiefel(z, 170, 370, 1.05),
  schlitten: z => FIG_LW.schlitten(z, 190, 300, 1.05),
  tanne: z => FIG.tanne(z, 200, 390, 1.65),
  stern: z => FIG.stern(z, 200, 200, 2.3, true),
  kerze: z => FIG_LW.kerze(z, 200, 380, 1),
  geschenk: z => FIG_LW.geschenk(z, 200, 360, 1.1),
  keks: z => FIG_LW.keks(z, 200, 350, 1.1),
  weihnachtsmann: z => FIG_LW.weihnachtsmann(z, 200, 395, 1),
  krippe: z => FIG.krippe(z, 200, 360, 1.6),
  stall: z => FIG.stall(z, 200, 372, .6, { offen: true }),
  baby: z => FIG.baby(z, 200, 220, 2.4),
  esel: z => FIG_LW.esel(z, 140, 350, 1.25),
  hirte: z => FIG.hirte(z, 175, 392, 1.65),
  hund: z => FIG_LW.hund(z, 150, 345, 1.05),
  katze: z => FIG_LW.katze(z, 150, 340, 1.15),
  maus: z => FIG_LW.maus(z, 175, 320, 1.1),
  kuh: z => FIG.kuh(z, 150, 350, 1.25),
  pferd: z => FIG.pferd(z, 150, 375, 1.2),
  schaf: z => FIG.schaf(z, 175, 330, 2.6),
  huhn: z => FIG.huhn(z, 200, 345, 2.5),
  schwein: z => FIG_LW.schwein(z, 140, 330, 1.15),
  ente: z => FIG_LW.ente(z, 170, 330, 1.2),
  fisch: z => FIG_LW.fisch(z, 180, 310, 1.1),
  vogel: z => FIG_LW.vogel(z, 190, 340, 1.25),
  hase: z => FIG_LW.hase(z, 150, 365, 1.15)
};
const BILD = {};
function bildURL(key) {
  if (BILD[key]) return BILD[key];
  const c = document.createElement("canvas"); c.width = c.height = 300; const ctx = c.getContext("2d");
  ctx.setTransform(.75, 0, 0, .75, 0, 0); ctx.lineCap = "round"; ctx.lineJoin = "round";
  SEED = 300 + key.length * 13 + key.charCodeAt(0); BILDER[key](Z(ctx)); korn(ctx, .16);
  return (BILD[key] = c.toDataURL("image/png"));
}

/* ==========================================================================
   Lesewerkstatt – Wort-Werkstatt (Strang „Wörter“), bilingual-bimodal
   Verkettung Gebärde ↔ Bild ↔ Schriftwort ↔ Fingeralphabet.
   Inhalt: Wortliste woerter.csv (WORTE, beim Zusammensetzen eingefügt), Zeichnungen src/bilder.js.
   Wortpakete = Stufen nebeneinander (APP.parallel); Lernstand je Wort mit Wiederholung; gestufter Fehlerablauf.
   Videos: Wörterbuchpaket von gebaerdenlernen.de, nur über build.py --videos (nie im Repository).
   ========================================================================== */
const W = {}; WORTE.forEach(x => { W[x.id] = x; });
const PAKETE = []; WORTE.forEach(x => { if (!PAKETE.includes(x.paket)) PAKETE.push(x.paket); });
const paketId = p => p.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
const woerterVon = lid => WORTE.filter(x => paketId(x.paket) === lid).map(x => x.id);
const paketVon = id => paketId(W[id].paket);
const wortVon = id => W[id].w;
const hatVideo = n => typeof VIDEOS !== "undefined" && !!VIDEOS[n] && vidOn();
const PRO_MISSION = 8;

/* ---------- Lernstand je Wort: 0 neu · 1 geübt · 2 sicher (3× richtig ohne Hilfe) · 3 gefestigt (≥ 7 Tage später wieder richtig) ---------- */
const HEUTE = () => Math.floor(Date.now() / 864e5);
function wsVon(st, id) { const m = (st && st.ws) || {}; return m[id] || { s: 0, c: 0, d: 0 }; }
function ws(id) { if (!S.ws || typeof S.ws !== "object") S.ws = {}; return (S.ws[id] = S.ws[id] || { s: 0, c: 0, d: 0 }); }
const faellig = w => w.s === 2 && HEUTE() - w.d >= 7;
function wortErgebnis(t, res) {
  if (!t.wid) return;
  const w = ws(t.wid);
  if (res === "s") {
    w.c++; if (w.s < 1) w.s = 1;
    if (w.s === 1 && w.c >= 3) { w.s = 2; w.d = HEUTE(); }
    else if (faellig(w)) { w.s = 3; w.d = HEUTE(); }
  } else if (res === "h" || res === "d") { w.c = 0; w.s = Math.max(1, w.s - 1); }
  else if (w.s < 1) w.s = 1;
}
/* Auswahl: zuerst neue und geübte Wörter, dann fällige sichere, dann der Rest (jeweils gemischt) */
function auswahl(ids, n) {
  const rang = id => { const w = ws(id); return w.s <= 1 ? 0 : faellig(w) ? 1 : 2; };
  return shuffle(ids).sort((a, b) => rang(a) - rang(b)).slice(0, n);
}
function wiederholListe(n) {
  const alle = WORTE.map(x => x.id), geuebt = alle.filter(id => ws(id).s >= 1);
  const rang = id => { const w = ws(id); return faellig(w) ? 0 : w.s === 1 ? 1 : 2; };
  let l = shuffle(geuebt).sort((a, b) => rang(a) - rang(b)).slice(0, n);
  if (l.length < n) l = l.concat(shuffle(alle.filter(id => !l.includes(id))).slice(0, n - l.length));
  return l;
}

/* ---------- Symbole für die Aufgabenart (keine Schrift nötig) ---------- */
const SYM = {
  hand: '<svg viewBox="0 0 48 48"><path d="M14 44c-4-5-8-12-8-17 0-3 4-4 6-1l4 6V9c0-3 5-3 5 0v13V6c0-3 5-3 5 0v16V8c0-3 5-3 5 0v15-10c0-3 5-3 5 0v18c0 7-3 11-6 13z" fill="#f2c39b" stroke="#1b1b24" stroke-width="2.6" stroke-linejoin="round"/></svg>',
  bild: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="5" fill="#fffdf6" stroke="#1b1b24" stroke-width="2.6"/><circle cx="34" cy="17" r="4" fill="#ffd257" stroke="#1b1b24" stroke-width="2"/><path d="M8 36l11-13 8 9 5-5 9 9z" fill="#3f8a58" stroke="#1b1b24" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  wort: '<svg viewBox="0 0 48 48"><rect x="2" y="10" width="44" height="28" rx="6" fill="#fffdf6" stroke="#1b1b24" stroke-width="2.6"/><text x="24" y="31" text-anchor="middle" font-size="17" font-family="Andika,sans-serif" fill="#1b1b24">Abc</text></svg>',
  pfeil: '<svg viewBox="0 0 30 48" style="width:26px"><path d="M4 24h20M16 15l9 9-9 9" fill="none" stroke="#1b1b24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fa: '<svg viewBox="0 0 48 48"><path d="M16 44c-4-4-6-9-6-14l2-14c1-3 5-2 5 1v9V7c0-3 5-3 5 0v17l3-15c1-3 5-2 4 1l-3 16 6-10c2-3 6-1 4 2l-7 14c-2 9-6 12-13 12z" fill="#f2c39b" stroke="#1b1b24" stroke-width="2.4" stroke-linejoin="round"/></svg>',
  kreis: '<svg viewBox="0 0 48 48"><path d="M38 24a14 14 0 1 1-5-10.7" fill="none" stroke="#1b1b24" stroke-width="4" stroke-linecap="round"/><path d="M36 6v9h-9" fill="none" stroke="#1b1b24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const innen = svg => svg.replace(/<\/?svg[^>]*>/g, "");
const symZeile = (...teile) => '<span class="pico">' + teile.map(t => SYM[t]).join("") + '</span>';
const bildImg = id => '<img class="tb" src="' + bildURL(id) + '" alt="">';
const bildKarte = id => '<div class="bildkarte">' + bildImg(id) + '</div>';
const lang = id => wortVon(id).length > 9 ? " lang" : "";
const wortGross = id => '<span class="wortgross' + lang(id) + '">' + wortVon(id) + '</span>';
const ikon = (a, b) => '<g transform="translate(10,40) scale(1.9)">' + innen(SYM[a]) + '</g><g transform="translate(100,40) scale(1.9)">' + innen(SYM[b]) + '</g>';

/* ---------- Ablenker: Wörter desselben Pakets; bei Wort-Antworten ähnlich geschriebene (Hund/Huhn/Hase) ---------- */
function aehnlich(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase(); let s = 0;
  if (a[0] === b[0]) s += 3; if (a.slice(0, 2) === b.slice(0, 2)) s += 2;
  s += 2 - Math.min(2, Math.abs(a.length - b.length));
  const m = new Set(a); new Set(b).forEach(c => { if (m.has(c)) s += 1; });
  return s + Math.random() * 1.5;
}
function ablenker(id, nachSchrift) {
  const rest = woerterVon(paketVon(id)).filter(x => x !== id);
  if (!nachSchrift) return shuffle(rest).slice(0, 3);
  return rest.map(x => [x, aehnlich(wortVon(id), wortVon(x))]).sort((p, q) => q[1] - p[1]).slice(0, 3).map(p => p[0]);
}

/* ---------- Hilfen (nach dem 2. Fehler Pflicht) ---------- */
function hilfeLangsam(ctx, id) {   /* Gebärde → Bild: Gebärde langsam und noch einmal */
  const v = W[id].vid;
  if (!hatVideo(v)) { ctx.waitHint(ICON.eye, "", 4000); return; }
  const vorher = VF.slow; VF.slow = true;
  ctx.setShow(signVid(v, ""));
  ctx.waitHint(SYM.hand, "Schau die Gebärde langsam an.", 6000);
  setTimeout(() => { VF.slow = vorher; if (VF.el) VF.el.playbackRate = vorher ? .5 : 1; }, 6000);
}
function hilfeFinger(ctx, id, oben) {   /* Wort-Aufgaben: das Wort im Fingeralphabet (Brücke Handform → Buchstabe) */
  const v = W[id].vidFa, n = wortVon(id).length;
  if (!hatVideo(v)) { ctx.setShow('<div class="zeile">' + oben + '<span class="anlaut">' + wortVon(id)[0] + '</span></div>'); ctx.waitHint(ICON.eye, "So fängt das Wort an.", 4000); return; }
  ctx.setShow('<div class="zeile">' + oben + signVid(v, "") + '</div>');
  ctx.waitHint(SYM.fa, "Schau das Fingeralphabet an.", Math.max(4000, n * 1100 + 800));
}

/* ---------- Aufgaben ---------- */
function aufgabe(id, art) {
  const loes = { show: '<div class="zeile">' + bildKarte(id) + wortGross(id) + '</div>', text: "" };
  if (art === "zeigen") return {   /* Gebärde → Bild */
    wid: id, prompt: symZeile("hand", "pfeil", "bild"), show: signVid(W[id].vid, wortGross(id)), layout: "grid",
    answers: shuffle([id].concat(ablenker(id, false))).map(x => ({ v: x, html: bildImg(x) })), answer: id,
    hint: ctx => hilfeLangsam(ctx, id), sol: loes
  };
  if (art === "finden") return {   /* Bild + Gebärde → Wort */
    wid: id, prompt: symZeile("bild", "hand", "pfeil", "wort"), show: '<div class="zeile">' + bildKarte(id) + signVid(W[id].vid, "") + '</div>', layout: "names",
    answers: (o => { const kl = o.some(x => lang(x)) ? " lang" : ""; return o.map(x => ({ v: x, html: '<span class="wort' + kl + '">' + wortVon(x) + '</span>' })); })(shuffle([id].concat(ablenker(id, true)))), answer: id,   /* alle Antworten gleich groß: die Schriftgröße verrät nichts */
    hint: ctx => hilfeFinger(ctx, id, bildKarte(id)), sol: loes
  };
  return {   /* Wort → Bild (lesen ohne Gebärde) */
    wid: id, prompt: symZeile("wort", "pfeil", "bild"), show: wortGross(id), layout: "grid",
    answers: shuffle([id].concat(ablenker(id, false))).map(x => ({ v: x, html: bildImg(x) })), answer: id,
    hint: ctx => hilfeFinger(ctx, id, wortGross(id)), sol: loes
  };
}
function tasksFor(level, mid) {
  if (level === "wdh") return wiederholListe(PRO_MISSION).map(id => aufgabe(id, ["zeigen", "finden", "lesen"][Math.floor(Math.random() * 3)]));
  const ids = woerterVon(level);
  return auswahl(ids, Math.min(PRO_MISSION, ids.length)).map(id => aufgabe(id, mid));
}

/* ---------- Extras: Wörter-Lexikon und „Meine Wörter“ ---------- */
function paketReiter(akt) {
  return '<div class="reiter">' + PAKETE.map(p => '<button data-p="' + paketId(p) + '" class="' + (paketId(p) === akt ? "on" : "") + '">' + p + '</button>').join("") + '</div>';
}
function lexikon(el) {
  let pk = paketId(PAKETE[0]), wahl = null, fa = false;
  const zeichne = () => {
    let d = "";
    if (wahl) {
      const v = fa ? W[wahl].vidFa : W[wahl].vid;
      d = '<div class="lexdetail">' + bildKarte(wahl) + wortGross(wahl)
        + (hatVideo(v) ? signVid(v, "") + '<button class="knopf" id="lexFa">' + (fa ? SYM.hand + " Gebärde" : SYM.fa + " Fingeralphabet") + '</button>' : "") + '</div>';
    }
    el.innerHTML = paketReiter(pk) + d + '<div class="lex">' + woerterVon(pk).map(id => '<button data-k="' + id + '" class="' + (id === wahl ? "on" : "") + '">' + bildImg(id) + wortVon(id) + '</button>').join("") + '</div>';
    el.querySelectorAll(".reiter button").forEach(b => b.onclick = () => { pk = b.dataset.p; wahl = null; fa = false; zeichne(); });
    el.querySelectorAll(".lex button").forEach(b => b.onclick = () => { wahl = b.dataset.k; fa = false; zeichne(); window.scrollTo(0, 0); });
    const f = el.querySelector("#lexFa"); if (f) f.onclick = () => { fa = !fa; zeichne(); };
    vidMountAll(el);
  };
  zeichne();
}
function punkte(s) { let h = ""; for (let i = 1; i <= 3; i++) h += '<i class="' + (i <= s ? "an s" + s : "") + '"></i>'; return '<span class="wsp">' + h + '</span>'; }
function meineWoerter(el) {
  el.innerHTML = PAKETE.map(p => '<h3 class="mwkopf">' + p + '</h3><div class="mw">' + woerterVon(paketId(p)).map(id => {
    const s = ws(id).s; return '<div class="mwk' + (s ? "" : " neu") + '" data-w="' + id + '" data-s="' + s + '">' + bildImg(id) + '<b>' + wortVon(id) + '</b>' + punkte(s) + '</div>';
  }).join("") + '</div>').join("") + '<p class="mwleg">' + punkte(1) + ' geübt ' + punkte(2) + ' sicher ' + punkte(3) + ' gefestigt</p>';
}
function zaehle(st) { const n = [0, 0, 0, 0]; WORTE.forEach(x => { const s = wsVon(st, x.id).s; n[s >= 0 && s <= 3 ? s : 0]++; }); return n; }

const APP = {
  id: "lesewerkstatt",
  title: "Lesewerkstatt",
  subtitle: "Gebärde · Bild · Wort",
  credit: "mit KI erstellt · geprüft: J. Schneider · Prototyp, Nov. 2026 · Zeichnungen: eigene (rough.js, MIT) · Schrift: Andika (SIL OFL)",
  videoCredit: "Gebärden- und Fingeralphabet-Videos: Henrike Maria Falke, gebaerdenlernen.de, CC BY-NC-SA 3.0 DE (geschnitten, verkleinert, ohne Ton)",
  crownLabel: "Lese-Profi",
  parallel: true,
  errorFlow: "stufen", errorWait: 5000, waitText: "Schau noch einmal genau.",
  hero: () => '<div class="herorow">' + ["schneemann", "stern", "katze"].map(bildImg).join("") + '</div>',
  levels: PAKETE.map(p => ({ id: paketId(p), marks: "", label: p, icons: () => '<span class="lvbild">' + bildImg(woerterVon(paketId(p))[0]) + '</span>', missions: ["zeigen", "finden", "lesen"] }))
    .concat([{ id: "wdh", marks: "", label: "Wiederholen", icons: () => '<span class="lvbild">' + SYM.kreis + '</span>', missions: ["mix"] }]),
  missions: {
    zeigen: { name: "Gebärde → Bild", icon: () => ikon("hand", "bild") },
    finden: { name: "Bild → Wort", icon: () => ikon("bild", "wort") },
    lesen: { name: "Wort → Bild", icon: () => ikon("wort", "bild") },
    mix: { name: "Gemischt", icon: () => '<g transform="translate(40,40) scale(2.5)">' + innen(SYM.kreis) + '</g>' }
  },
  buildTasks: tasksFor,
  onTaskResult: wortErgebnis,
  score: st => { const n = zaehle(st); return (n[1] + 2 * n[2] + 3 * n[3]) / (3 * WORTE.length); },
  reached: st => { const n = zaehle(st); return "sicher " + (n[2] + n[3]) + " · davon gefestigt " + n[3] + " · geübt " + n[1] + " (von " + WORTE.length + " Wörtern)"; },
  extras: [
    { id: "meine", label: "Meine Wörter", icon: () => '<image href="' + bildURL("stern") + '" x="10" y="10" width="180" height="180"/>', render: meineWoerter },
    { id: "lexikon", label: "Wörter-Lexikon", icon: () => '<image href="' + bildURL("hase") + '" x="10" y="10" width="180" height="180"/>', render: lexikon }
  ],
  board: Object.fromEntries(PAKETE.map(p => [paketId(p), { label: p + ": Wort lesen", cards: () => shuffle(woerterVon(paketId(p))).map(id => ({ html: '<span class="wortgross tafelwort' + lang(id) + '">' + wortVon(id) + '</span>', reveal: bildKarte(id) })) }])),
  info: '<p><b>Lesewerkstatt</b> (Wort-Werkstatt, Strang „Wörter“). Jedes Wort ist verkettet: Gebärde, Bild, Schriftwort und Fingeralphabet. '
    + 'Wortpakete: ' + PAKETE.map(p => p + " (" + woerterVon(paketId(p)).length + ")").join(", ") + '. Nur Einzahl, nur gut zeichenbare Nomen. '
    + 'Drei Aufgabenarten je Paket: Gebärde → Bild (DGS-Wortschatz), Bild + Gebärde → Wort (Ablenker sind ähnlich geschriebene Wörter), Wort → Bild (Lesen ohne Gebärde). '
    + '„Wiederholen“ mischt geübte und fällige Wörter aus allen Paketen.</p>'
    + '<p><b>Lernstand je Wort:</b> neu → geübt → sicher (dreimal hintereinander richtig ohne Hilfe) → gefestigt (frühestens 7 Tage später wieder richtig). '
    + 'Hilfe oder Lösung setzt ein Wort eine Stufe zurück. Die App wählt zuerst neue und geübte Wörter, dann fällige. Übersicht für das Kind: „Meine Wörter“; '
    + 'in der Klassenübersicht von LearningView steht je Kind, wie viele Wörter sicher sind.</p>'
    + '<p><b>Hilfen:</b> Gebärde → Bild: die Gebärde langsam. Wort-Aufgaben: das Wort im Fingeralphabet. Ohne Videos: der Anfangsbuchstabe.</p>'
    + '<p><b>Hinweis Videos:</b> „Handschuh“ und „Geschenk“ sind im Wörterbuch nur in der Mehrzahl aufgenommen (Mundbild „Handschuhe“, „Geschenke“).</p>'
};
