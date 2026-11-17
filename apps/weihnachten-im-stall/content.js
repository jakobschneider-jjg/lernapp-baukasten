/* rough.js 4.6.6 – MIT-Lizenz, © 2019 Preet Shihn (https://roughjs.com) */
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

/* ==========================================================================
   Kalender „Weihnachten im Stall“ – Bilder im Kreide-Stil
   pic(), scene(), homeScene() liefern HTML/SVG mit Platzhaltern; die Bilder werden erst gemalt,
   wenn sie im Dokument erscheinen (Beobachter unten), und dann zwischengespeichert.
   ========================================================================== */
const SW = 1600, SH = 1040;   /* Szenen-Format */

/* ---------- Bildwörter ---------- */
function flocke(z, x, y, k, c) { const s = 26 * k; [[0, -s, 0, s], [-s * .87, -s / 2, s * .87, s / 2], [-s * .87, s / 2, s * .87, -s / 2]].forEach(l => z.line(x + l[0], y + l[1], x + l[2], y + l[3], { strokeWidth: 6, stroke: c || "#4f8fd0" })); }
function thermo(z, x, y, farbe, stand) {
  z.rect(x - 20, y - 150, 40, 170, { fill: "#fff", fillStyle: "solid", strokeWidth: 4 });
  z.rect(x - 9, y + 10 - stand, 18, stand, { fill: farbe, fillStyle: "solid", stroke: "none" });
  z.circ(x, y + 40, 70, { fill: farbe, fillStyle: "solid", strokeWidth: 4 });
}
function grossGesicht(z, art) {
  z.circ(200, 210, 250, { fill: C.haut, fillStyle: "solid", strokeWidth: 4 }); z.mal("circle", [200, 210, 236], ["#e9a983"], { gap: 9, fw: 2 });
  z.circ(130, 236, 40, { fill: "#f08f86", fillStyle: "solid", stroke: "none" }); z.circ(270, 236, 40, { fill: "#f08f86", fillStyle: "solid", stroke: "none" });
  if (art === "still") {
    z.circ(155, 185, 18, { fill: C.ink, fillStyle: "solid" }); z.circ(245, 185, 18, { fill: C.ink, fillStyle: "solid" });
    z.line(170, 268, 230, 268, { strokeWidth: 6 }); z.rect(186, 210, 28, 130, { fill: C.haut, fillStyle: "solid", strokeWidth: 4 });
  } else {
    z.path("M125 190 q30 22 60 0", { strokeWidth: 6 }); z.path("M215 190 q30 22 60 0", { strokeWidth: 6 });
    if (art === "muede") z.ell(200, 275, 50, 64, { fill: C.ink, fillStyle: "solid" });
    else z.ell(200, 270, 34, 26, { fill: C.ink, fillStyle: "solid" });
    if (art === "schlafen") { z.path("M296 70 h44 l-44 50 h44", { strokeWidth: 9, stroke: "#2a5fc4" }); z.path("M350 22 h30 l-30 34 h30", { strokeWidth: 7, stroke: "#2a5fc4" }); }
  }
}
const W = {
  mutter: { w: "Mutter", sign: "MUTTER", d: z => FIG.mutter(z, 200, 380, 1.75) },
  kind: { w: "Kind", sign: "KIND", d: z => FIG.kind(z, 200, 380, 1.85) },
  mann: { w: "Mann", sign: "MANN", d: z => FIG.mann(z, 190, 380, 1.6) },
  frau: { w: "Frau", sign: "FRAU", d: z => FIG.frau(z, 200, 380, 1.75) },
  mutterbaby: { w: "Mutter", sign: "MUTTER", d: z => FIG.frauMit(z, 200, 380, 1.75, { baby: true }) },
  baby: { w: "Baby", sign: "BABY", d: z => FIG.baby(z, 200, 220, 2.4) },
  hirten: { w: "Hirten", sign: "HIRTE", d: z => { FIG.hirte(z, 90, 360, .95, { c: "#6f7f8f" }); FIG.hirte(z, 300, 362, .95, { c: "#a0563b" }); FIG.hirte(z, 196, 386, 1.05); } },
  pferd: { w: "Pferd", sign: "PFERD", d: z => FIG.pferd(z, 160, 360, 1.15) },
  kuh: { w: "Kuh", sign: "KUH", d: z => FIG.kuh(z, 160, 350, 1.15) },
  huhn: { w: "Huhn", sign: "HUHN", d: z => FIG.huhn(z, 180, 350, 2.6) },
  schaf: { w: "Schaf", sign: "SCHAF", d: z => FIG.schaf(z, 180, 330, 3) },
  schafe: { w: "Schafe", sign: "SCHAF", d: z => { FIG.schaf(z, 110, 210, 1.5); FIG.schaf(z, 290, 230, 1.5, false, true); FIG.schaf(z, 200, 360, 1.7); } },
  hund: { w: "Hund", sign: "HUND", d: z => FIG.hund(z, 160, 330, 2.2) },
  stall: { w: "Stall", sign: "STALL", d: z => FIG.stall(z, 200, 360, .68, { offen: true }) },
  laterne: { w: "Laterne", sign: "LATERNE", d: z => { glanz(z.ctx, 200, 230, 190, "255,214,120", .55); FIG.laterne(z, 200, 60, 3.6); } },
  tuer: { w: "Tür", sign: "TUER", d: z => FIG.tuer(z, 200, 380, 1.75) },
  stroh: { w: "Stroh", sign: "STROH", d: z => FIG.stroh(z, 200, 330, 1.4) },
  krippe: { w: "Krippe", sign: "KRIPPE", d: z => FIG.krippe(z, 200, 360, 1.6) },
  milch: { w: "Milch", sign: "MILCH", d: z => FIG.eimer(z, 200, 360, 3) },
  stern: { w: "Stern", sign: "STERN", d: z => FIG.stern(z, 200, 200, 2.3, true) },
  schnee: { w: "Schnee", sign: "SCHNEE", d: z => { flocke(z, 110, 110, 1.6); flocke(z, 290, 90, 1.1); flocke(z, 250, 230, 1.9); flocke(z, 100, 280, 1.2); z.path("M20 380 Q120 320 220 350 Q300 320 380 380 Z", { fill: C.schnee, fillStyle: "solid" }); } },
  kalt: { w: "kalt", sign: "KALT", d: z => { thermo(z, 130, 270, "#3f8fd4", 40); flocke(z, 270, 160, 2.2); } },
  warm: { w: "warm", sign: "WARM", d: z => { thermo(z, 130, 270, "#d8432f", 150); ["M250 340 q-30 -40 0 -80 q30 -40 0 -80", "M320 340 q-30 -40 0 -80 q30 -40 0 -80"].forEach(p => z.path(p, { strokeWidth: 10, stroke: C.orange })); } },
  hand: { w: "Hand", sign: "HAND", d: z => FIG.hand(z, 210, 250, 2.2) },
  nacht: { w: "Nacht", sign: "NACHT", d: z => { z.rect(30, 30, 340, 340, { fill: "#1c2b4a", fillStyle: "solid", strokeWidth: 4 }); z.mal("rectangle", [36, 36, 328, 328], ["#24386a"], { gap: 8 }); FIG.mond(z, 180, 200, 1.6); [[300, 90], [310, 290], [90, 90], [250, 330]].forEach(p => FIG.sternchen(z, p[0], p[1], 1.4)); } },
  still: { w: "still", sign: "STILL", d: z => grossGesicht(z, "still") },
  schlafen: { w: "schlafen", sign: "SCHLAFEN", d: z => grossGesicht(z, "schlafen") },
  muede: { w: "müde", sign: "MUEDE", d: z => grossGesicht(z, "muede") },
  hunger: { w: "Hunger", sign: "HUNGER", d: z => { z.path("M60 200 H340 Q330 330 200 330 Q70 330 60 200 Z", { fill: "#fff", fillStyle: "solid", strokeWidth: 4 }); z.ell(200, 200, 280, 50, { fill: "#eef1f6", fillStyle: "solid", strokeWidth: 4 }); z.line(260, 60, 320, 180, { strokeWidth: 12, stroke: "#9aa3b2" }); z.ell(252, 50, 40, 56, { fill: "#b9c2cf", fillStyle: "solid" }); } },
  weihnachten: { w: "Weihnachten", sign: "WEIHNACHTEN", d: z => { FIG.stall(z, 200, 380, .62, { offen: true }); FIG.stern(z, 200, 80, .85, true); } },
  /* nur für die Oberfläche */
  herz: { w: "", d: z => FIG.herz(z, 200, 210, 3.4) },
  sternIcon: { w: "", d: z => FIG.stern(z, 200, 200, 2.6) },
  tuerZu: { w: "", d: z => kalTuer(z, "zu") }, tuerOffen: { w: "", d: z => kalTuer(z, "offen") }, tuerFertig: { w: "", d: z => kalTuer(z, "fertig") },
  dgs: { w: "", d: z => { FIG.hand(z, 130, 250, 1.4); z.ctx.save(); z.ctx.translate(560, 0); z.ctx.scale(-1, 1); FIG.hand(z, 290, 220, 1.4); z.ctx.restore(); } }
};

/* Kalendertüren (Hintergrund der Kacheln, die Zahl kommt als Text darüber) */
function kalTuer(z, art) {
  const ctx = z.ctx;
  if (art === "fertig") {
    z.rect(30, 30, 340, 340, { fill: "#1c2b4a", fillStyle: "solid", strokeWidth: 5 }); z.mal("rectangle", [36, 36, 328, 328], ["#24386a"], { gap: 8 });
    glanz(ctx, 200, 200, 190, "255,226,140", .35); FIG.stern(z, 290, 110, .9);
    z.poly([[30, 30], [92, 50], [92, 390], [30, 370]], { fill: "#b8322c", fillStyle: "solid", strokeWidth: 4 });
    return;
  }
  const zu = art === "zu";
  z.rect(30, 30, 340, 340, { fill: zu ? "#7d8aa6" : "#b8322c", fillStyle: "solid", strokeWidth: 5 });
  z.mal("rectangle", [36, 36, 328, 328], zu ? ["#8e9ab3", "#6c7894"] : ["#cf4a3a", "#9e2a24"], { gap: 6, fw: 3.4 });
  z.rect(58, 58, 284, 284, { strokeWidth: 3, fill: undefined, stroke: zu ? "#56607a" : "#7a1d18" });
  z.circ(320, 210, 26, { fill: zu ? "#b9c2cf" : "#e3a920", fillStyle: "solid", strokeWidth: 3 });
  z.path("M24 44 Q120 10 200 30 Q290 8 376 44 Q380 66 356 58 Q280 40 200 56 Q120 40 44 62 Q20 66 24 44 Z", { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 });
}
/* ---------- Szenen ---------- */
const STERNE = [[90, 80], [240, 190], [380, 64], [520, 160], [660, 56], [820, 136], [950, 48], [1200, 176], [1380, 72], [1530, 160], [70, 300], [600, 280], [1490, 330], [1050, 240], [200, 400]];
const HG = {
  draussen(z, ctx, o) {
    o = o || {}; const h = o.h || 760;
    const g = ctx.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, "#0b1430"); g.addColorStop(1, "#22386a"); ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
    z.mal("rectangle", [0, 0, SW, h], [C.nacht2, C.nacht], { gap: 8, fw: 3.6 });
    [[260, 150, 420, 90], [900, 110, 520, 100], [1380, 220, 380, 80]].forEach(w => z.mal("ellipse", w, ["#33497d"], { gap: 7 }));
    if (o.sterne) STERNE.forEach(p => FIG.sternchen(z, p[0], p[1], 1.2));
    if (o.mond) FIG.mond(z, o.mond[0], o.mond[1], o.mondK || 1.1);
    const pts = [[-20, h]]; for (let x = 0; x <= SW + 100; x += 110) pts.push([x, h - 20 + Math.sin(x / 210) * 24]); pts.push([SW + 20, SH + 20], [-20, SH + 20]);
    z.poly(pts, { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [pts], ["#d6e1f2", "#c9d6ec"], { gap: 9 });
    if (o.gross) FIG.stern(z, o.gross[0], o.gross[1], o.gross[2] || 1, true);
  },
  innen(z, ctx) {
    ctx.fillStyle = "#6e4526"; ctx.fillRect(0, 0, SW, SH);
    z.mal("rectangle", [0, 0, SW, 780], ["#8a5a32", "#6e4526"], { gap: 6, fw: 3.6 });
    for (let x = 0; x < SW; x += 110) z.line(x + r(-4, 4), 0, x + r(-4, 4), 780, { strokeWidth: 3, stroke: C.holzD });
    const pts = [[-20, 780], [SW + 20, 760], [SW + 20, SH + 20], [-20, SH + 20]];
    z.poly(pts, { fill: "#d9a83a", fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [pts], [C.stroh, "#c9962e"], { gap: 5 });
    for (let i = 0; i < 50; i++) { const x = r(0, SW), y = r(800, SH); z.line(x, y, x + r(-26, 26), y + r(-12, 4), { strokeWidth: 2.4, stroke: "#a87a1c" }); }
    glanz(ctx, 800, 400, 900, "255,190,100", .18);
  },
  stube(z, ctx) {
    ctx.fillStyle = "#f3dcae"; ctx.fillRect(0, 0, SW, SH); z.mal("rectangle", [0, 0, SW, 800], ["#f6e2b8", "#e9cc96"], { gap: 7 });
    z.rect(-20, 800, SW + 40, 260, { fill: "#b9814e", fillStyle: "solid" }); z.mal("rectangle", [0, 804, SW, 240], ["#a46d3e"], { gap: 8 });
    z.rect(140, 130, 480, 440, { fill: "#1c2b4a", fillStyle: "solid", strokeWidth: 5 }); z.mal("rectangle", [146, 136, 468, 428], ["#24386a"], { gap: 7 });
    z.path("M146 470 q120 -56 240 -16 t228 -24 V564 H146 Z", { fill: C.schnee, fillStyle: "solid", stroke: "none" });
    [[250, 230], [480, 200], [550, 340], [330, 360]].forEach(p => FIG.sternchen(z, p[0], p[1], 1));
    z.line(380, 132, 380, 568, { strokeWidth: 14, stroke: "#fff" }); z.line(142, 350, 618, 350, { strokeWidth: 14, stroke: "#fff" });
    z.rect(110, 570, 540, 36, { fill: "#fff", fillStyle: "solid" });
    z.rect(258, 500, 24, 70, { fill: "#fff", fillStyle: "solid" }); z.ell(270, 486, 22, 34, { fill: C.orange, fillStyle: "solid", strokeWidth: 2 }); glanz(ctx, 270, 480, 160, "255,200,100", .5);
  },
  schnitt(z, ctx, o) {   /* Stall aufgeschnitten: man sieht hinein */
    o = o || {};
    HG.draussen(z, ctx, { sterne: o.sterne, h: 840, mond: o.mond });
    if (o.gross) FIG.stern(z, o.gross[0], o.gross[1], o.gross[2] || 1, true);
    z.rect(384, 420, 928, 512, { fill: o.hell ? "#e6bd7c" : "#4a3a2e", fillStyle: "solid", strokeWidth: 4 });
    if (o.hell) { z.mal("rectangle", [390, 426, 916, 500], ["#f0cc8a", "#e0b26a"], { gap: 7 }); for (let y = 500; y < 860; y += 80) z.line(392, y, 1304, y + r(-3, 3), { strokeWidth: 2, stroke: "#a8763e" }); z.rect(390, 856, 916, 72, { fill: C.stroh, fillStyle: "solid", strokeWidth: 2 }); }
    else z.mal("rectangle", [390, 426, 916, 500], ["#3a2c22"], { gap: 8 });
    z.poly([[312, 432], [848, 176], [1384, 432], [1312, 432], [848, 248], [384, 432]], { fill: C.schnee, fillStyle: "solid", strokeWidth: 3 });
    z.poly([[384, 430], [848, 248], [1312, 430]], { fill: C.dach, fillStyle: "solid", strokeWidth: 3 }); z.mal("polygon", [[[400, 426], [848, 256], [1296, 426]]], ["#6d3c1c"], { gap: 7 });
    z.rect(360, 416, 48, 516, { fill: C.holzD, fillStyle: "solid" }); z.rect(1288, 416, 48, 516, { fill: C.holzD, fillStyle: "solid" });
  }
};
/* Szene = Hintergrund + Figuren. Figur: [Schlüssel für Markierung, Zeichnung, x, y, k, Optionen] (x,y = Fußpunkt) */
const BOX = { frau: [0, -100, 110], frauMit: [0, -100, 110], frauLiegt: [0, -36, 120], mann: [0, -110, 120], mannMitLaterne: [20, -110, 130], mutter: [0, -100, 110], kind: [0, -90, 100], baby: [10, 0, 70],
  hirte: [0, -120, 120], pferd: [40, -110, 150], kuh: [40, -100, 150], huhn: [10, -50, 70], schaf: [8, -40, 64], hund: [24, -60, 84], krippe: [0, -90, 120], stroh: [0, -40, 130], eimer: [0, -50, 60],
  laterne: [0, 40, 60], stall: [0, -260, 300], stern: [0, 0, 90], haus: [0, -50, 72], herz: [0, 0, 60], mond: [20, 0, 70], tanne: [0, -90, 90], baum: [0, -120, 120], kueken: [10, -30, 40], spuren: [0, 0, 120] };
function zeichneFigur(z, it) {
  const [, f, x, y, k, o] = it, oo = o || {}, ctx = z.ctx;
  if (oo.nur) return;   /* nur Markierung, nichts malen */
  if (oo.flip) { ctx.save(); ctx.translate(2 * x, 0); ctx.scale(-1, 1); }
  if (f === "pferd" || f === "kuh" || f === "huhn") FIG[f](z, x, y, k, oo.zu);
  else if (f === "schaf") FIG.schaf(z, x, y, k, oo.zu, oo.sp);
  else if (f === "krippe") FIG.krippe(z, x, y, k, oo.baby);
  else if (f === "stern") FIG.stern(z, x, y, k, oo.glow !== false);
  else if (f === "tuer") FIG.tuer(z, x, y, k, oo.offen);
  else if (f === "spuren") { for (let i = 0; i < 9; i++) z.ell(x - 200 * k + i * 50 * k, y + (i % 2 ? 10 : -8) * k, 26 * k, 12 * k, { fill: "#a9bbd8", fillStyle: "solid", stroke: "none" }); }
  else if (f === "glanz") glanz(ctx, x, y, 200 * k, "255,214,120", oo.s || .55);
  else if (f === "flocken") { [[-140, -40, 1.2], [60, -120, .9], [160, 20, 1.4], [-40, 60, 1]].forEach(p => flocke(z, x + p[0] * k, y + p[1] * k, p[2] * k, "#ffffff")); }
  else if (f === "zzz") { z.path("M" + x + " " + y + " h" + 44 * k + " l" + (-44 * k) + " " + 50 * k + " h" + 44 * k, { strokeWidth: 8, stroke: "#cfe0ff" }); z.path("M" + (x + 60 * k) + " " + (y - 60 * k) + " h" + 30 * k + " l" + (-30 * k) + " " + 34 * k + " h" + 30 * k, { strokeWidth: 6, stroke: "#cfe0ff" }); }
  else if (f === "fensterHirten") {
    z.rect(x - 230 * k, y - 160 * k, 460 * k, 300 * k, { fill: "#1c2b4a", fillStyle: "solid", strokeWidth: 4 });
    [[-140, "#6f7f8f"], [0, "#8b6a45"], [140, "#a0563b"]].forEach(h => { z.path("M" + (x + (h[0] - 64) * k) + " " + (y + 140 * k) + " q" + 64 * k + " " + (-110 * k) + " " + 128 * k + " 0 Z", { fill: h[1], fillStyle: "solid" }); gesicht(z, x + h[0] * k, y + 10 * k, 64 * k); z.ell(x + h[0] * k, y - 22 * k, 100 * k, 20 * k, { fill: "#4a3b2c", fillStyle: "solid" }); z.path("M" + (x + (h[0] - 30) * k) + " " + (y - 24 * k) + " q" + 30 * k + " " + (-50 * k) + " " + 60 * k + " 0 Z", { fill: "#4a3b2c", fillStyle: "solid" }); });
    z.rect(x - 230 * k, y - 160 * k, 460 * k, 300 * k, { strokeWidth: 16, stroke: "#7a4f2a", fill: undefined }); z.line(x - 77 * k, y - 160 * k, x - 77 * k, y + 140 * k, { strokeWidth: 10, stroke: "#7a4f2a" }); z.line(x + 77 * k, y - 160 * k, x + 77 * k, y + 140 * k, { strokeWidth: 10, stroke: "#7a4f2a" });
    z.rect(x - 260 * k, y + 140 * k, 520 * k, 30 * k, { fill: "#7a4f2a", fillStyle: "solid" });
  }
  else FIG[f](z, x, y, k, oo);
  if (oo.flip) ctx.restore();
}
const SZENE = {
  1: { hg: "stube", items: [["mutter", "mutter", 1010, 970, 3.1], ["kind", "kind", 790, 985, 2.4]] },
  2: { hg: "draussen", o: { h: 780 }, items: [["haus", "haus", 200, 770, 2.1], ["haus", "haus", 1340, 760, 1.7], ["baum", "baum", 1500, 840, 1.7], ["schnee", "flocken", 300, 300, 1.4], ["schnee", "spuren", 400, 1005, 1.5],
    ["frau", "frau", 650, 985, 2.5], ["mann", "mannMitLaterne", 900, 990, 2.5], ["glanz", "glanz", 1066, 800, 2.1]] },
  3: { hg: "draussen", o: { h: 790 }, items: [["baum", "baum", 110, 870, 1.6], ["stall", "stall", 1110, 900, 1.3, { offen: true }], ["frau", "frau", 330, 995, 2.1], ["mann", "mannMitLaterne", 540, 1000, 2.1], ["glanz", "glanz", 680, 840, 1.8]] },
  5: { hg: "innen", items: [["pferd", "pferd", 330, 800, 1.9], ["kuh", "kuh", 900, 810, 1.8], ["huhn", "huhn", 1400, 830, 1.8],
    ["schafe", "schaf", 170, 1005, 1.25], ["schafe", "schaf", 420, 1025, 1.25], ["schafe", "schaf", 660, 1005, 1.25], ["schafe", "schaf", 920, 1030, 1.25, { sp: true }], ["schafe", "schaf", 1180, 1010, 1.25, { sp: true }]] },
  6: { hg: "innen", items: [["pferd", "pferd", 470, 950, 3.0], ["frau", "frauMit", 1320, 1000, 2.9, { arm: true, links: true }], ["warm", "herz", 1000, 230, 2.2]] },
  7: { hg: "innen", items: [["kuh", "kuh", 430, 950, 3.0], ["milch", "eimer", 1040, 1005, 2.4], ["frau", "frauMit", 1360, 1000, 2.9, { becher: true, links: true }]] },
  8: { hg: "innen", items: [["stroh", "stroh", 800, 1010, 5.2], ["frau", "frauLiegt", 780, 930, 3.1], ["schafe", "schaf", 230, 1000, 1.7, { zu: true }], ["schafe", "schaf", 1390, 990, 1.7, { zu: true, sp: true }], ["schafe", "schaf", 500, 1040, 1.35, { zu: true }], ["schafe", "schaf", 1100, 1040, 1.35, { zu: true, sp: true }]] },
  10: { hg: "draussen", o: { h: 790, mond: [1330, 190], mondK: 1.5 }, items: [["nacht", "mond", 1350, 190, 1.5, { nur: true }], ["baum", "baum", 190, 880, 1.8], ["tanne", "tanne", 1440, 880, 1.8], ["stall", "stall", 800, 910, 1.45], ["still", "zzz", 1060, 200, 2.4]] },
  11: { hg: "schnitt", o: { hell: true, sterne: true, gross: [848, 110, 1.15] }, items: [["stern", "stern", 848, 110, 1.15, { nur: true }], ["laterne", "laterne", 848, 440, 1.2], ["glanz", "glanz", 848, 540, 2, { s: .4 }], ["pferd", "pferd", 520, 900, 1.0, { zu: true }], ["kuh", "kuh", 800, 905, .9, { zu: true }],
    ["schafe", "schaf", 460, 928, .75, { zu: true }], ["schafe", "schaf", 640, 935, .75, { zu: true }], ["frau", "frauMit", 1080, 925, 1.5, { baby: true }], ["baby", "baby", 1083, 802, 1.1, { nur: true }], ["mann", "mann", 1220, 928, 1.5]] },
  12: { hg: "draussen", o: { sterne: true, h: 760, gross: [1290, 230, 1.45] }, items: [["stern", "stern", 1290, 230, 1.45, { nur: true }], ["stall", "stall", 1300, 790, .55, { offen: true }], ["hirten", "hirte", 210, 910, 1.9, { c: "#6f7f8f" }], ["hirten", "hirte", 440, 918, 1.9, { c: "#a0563b" }],
    ["hirten", "hirte", 690, 910, 1.9, { zeigt: true, flip: true }], ["hund", "hund", 900, 940, 1.6], ["schafe", "schaf", 230, 1020, 1.1], ["schafe", "schaf", 520, 1030, 1.1]] },
  13: { hg: "innen", items: [["hirten", "fensterHirten", 430, 330, 1.25], ["laterne", "laterne", 830, 600, 1.4], ["glanz", "glanz", 830, 720, 1.8], ["mann", "mann", 1060, 980, 2.6], ["frau", "frauMit", 1350, 990, 2.6, { baby: true }], ["baby", "baby", 1355, 777, 1.6, { nur: true }]] },
  15: { hg: "innen", items: [["laterne", "laterne", 600, 80, 1.3], ["glanz", "glanz", 600, 180, 1.8], ["pferd", "pferd", 1170, 830, 2.0, { flip: true }], ["frau", "frau", 250, 1010, 2.6], ["krippe", "krippe", 760, 1020, 2.9, { baby: true }], ["baby", "baby", 772, 585, 2, { nur: true }]] },
  16: null
};
function homeItems(has) {
  const it = [], lit = has(3), born = has(11);
  if (has(1)) it.push(["haus", "haus", 170, 880, 1.8]);
  if (has(4)) it.push(["tanne", "tanne", 1510, 870, 1.6]);
  if (has(2) && !lit) { it.push(["schnee", "spuren", 330, 1010, 1]); it.push(["frau", "frau", 150, 1000, 1.3]); it.push(["mann", "mannMitLaterne", 300, 1005, 1.3]); }
  if (lit) { it.push(["glanz", "glanz", 848, 560, 1.9, { s: .45 }]); it.push(["laterne", "laterne", 848, 440, 1.1]); }
  if (has(8)) it.push(["stroh", "stroh", 640, 935, 1.7]);
  if (has(5)) { it.push(["pferd", "pferd", 520, 900, 1.0, { zu: born }]); it.push(["kuh", "kuh", 800, 905, .9, { zu: born }]); it.push(["huhn", "huhn", 450, 925, .8]); it.push(["schafe", "schaf", 610, 932, .72]); it.push(["schafe", "schaf", 730, 940, .72]); }
  if (has(8)) { it.push(["schafe", "schaf", 850, 936, .72, { zu: true }]); it.push(["schafe", "schaf", 520, 950, .7, { zu: true, sp: true }]); it.push(["schafe", "schaf", 960, 946, .7, { zu: true }]); }
  if (has(9)) { it.push(["kueken", "kueken", 405, 935, 1]); it.push(["kueken", "kueken", 440, 945, .85]); }
  if (has(6)) it.push(["warm", "herz", 640, 580, .8]);
  if (has(7)) it.push(["milch", "eimer", 990, 925, .8]);
  if (has(15)) it.push(["krippe", "krippe", 1020, 925, 1.1, { baby: true }]);
  if (lit) { it.push(["frau", "frauMit", 1150, 928, 1.45, { baby: born && !has(15) }]); it.push(["mann", "mann", 1250, 930, 1.45]); }
  if (has(12) && !has(13)) { it.push(["hirten", "hirte", 1450, 910, .75, { c: "#6f7f8f" }]); it.push(["hirten", "hirte", 1530, 915, .75, { c: "#a0563b" }]); }
  if (has(13)) { it.push(["hirten", "hirte", 1420, 990, 1.25, { c: "#6f7f8f" }]); it.push(["hirten", "hirte", 1535, 995, 1.25, { c: "#a0563b" }]); }
  if (has(14)) it.push(["hund", "hund", 220, 1010, 1.0]);
  if (has(16)) it.push(["herz", "herz", 1020, 660, .8]);
  return { hg: "schnitt", o: { hell: lit, sterne: born, gross: born ? [848, 110, 1.1] : null, mond: has(10) ? [230, 200] : null }, items: it };
}
SZENE[16] = homeItems(() => true);
SZENE[16].items.push(["weihnachten", "stall", 848, 930, 1.1, { nur: true }], ["stern", "stern", 848, 110, 1.1, { nur: true }]);

/* ---------- Malen und Zwischenspeichern ---------- */
const BILDCACHE = {};
function maleSzene(sc, seed) {
  const c = document.createElement("canvas"), s = .75; c.width = SW * s; c.height = SH * s;
  const ctx = c.getContext("2d"); ctx.setTransform(s, 0, 0, s, 0, 0); ctx.lineCap = "round"; ctx.lineJoin = "round"; SEED = seed; const z = Z(ctx);
  HG[sc.hg](z, ctx, sc.o); sc.items.forEach(it => zeichneFigur(z, it)); korn(ctx, .22);
  return c.toDataURL("image/jpeg", .86);
}
function malePic(key) {
  const c = document.createElement("canvas"); c.width = c.height = 300; const ctx = c.getContext("2d"); ctx.setTransform(.75, 0, 0, .75, 0, 0); ctx.lineCap = "round"; ctx.lineJoin = "round";
  SEED = 300 + key.length * 13; W[key].d(Z(ctx)); korn(ctx, .16); return c.toDataURL("image/png");
}
function bildURL(id) {
  if (BILDCACHE[id]) return BILDCACHE[id];
  let u;
  if (id.startsWith("p:")) u = malePic(id.slice(2));
  else if (id.startsWith("h:")) { const m = +id.slice(2); u = maleSzene(homeItems(n => !!(m & (1 << n))), 4100); }
  else u = maleSzene(SZENE[+id.slice(2)], 2000 + +id.slice(2) * 31);
  return (BILDCACHE[id] = u);
}
/* Beobachter: setzt die Bilder ein, sobald Platzhalter im Dokument stehen */
function bilderEinsetzen(root) {
  (root || document).querySelectorAll("img[data-b]:not([src])").forEach(i => { i.src = bildURL(i.dataset.b); });
  (root || document).querySelectorAll("image[data-b]:not([href])").forEach(i => { i.setAttribute("href", bildURL(i.getAttribute("data-b"))); });
}
new MutationObserver(() => bilderEinsetzen()).observe(document.documentElement, { childList: true, subtree: true });

function pic(key, cls) { return '<img class="' + (cls || "vis") + ' pic" data-b="p:' + key + '" alt="' + (W[key] && W[key].w || "") + '">'; }
/* Gebärdenbild nur zeigen, wenn es eingebettet ist (sonst nichts – keine Platzhalter in der Kinderansicht) */
function gb(key, cls) { const s = W[key] && W[key].sign; return (s && typeof SIGNS !== "undefined" && SIGNS[s]) ? sign(s, cls) : ""; }
function wordHTML(key) { return gb(key) + '<span class="name">' + W[key].w + '</span>'; }
function picWord(key) { return pic(key) + wordHTML(key); }
function szenenSVG(id, sc, o) {
  o = o || {}; let ov = "";
  sc.items.forEach(it => {
    const b = BOX[it[1]] || [0, -50, 80], k = Math.max(it[4], .4), flip = it[5] && it[5].flip ? -1 : 1;
    const cx = it[2] + flip * b[0] * k, cy = it[3] + b[1] * k, rr = Math.max(70, b[2] * k);
    if (o.hl && it[0] === o.hl) ov += '<ellipse class="hlring" cx="' + cx + '" cy="' + cy + '" rx="' + (rr * 1.1) + '" ry="' + rr + '" fill="none" stroke="#ff3d7f" stroke-width="14" stroke-dasharray="34 22"/>';
    if (o.taps && it[0] === o.taps) ov += '<g class="tp" data-k="s"><circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="transparent"/><circle class="mk" cx="' + cx + '" cy="' + (cy - rr * .2) + '" r="30" fill="#fff" stroke="#c9245a" stroke-width="10" stroke-opacity=".7"/></g>';
  });
  return '<svg class="' + (o.cls || "szene") + '" viewBox="0 0 ' + SW + ' ' + SH + '"><image data-b="' + id + '" width="' + SW + '" height="' + SH + '"/>' + ov + '</svg>';
}
function scene(d, o) { return szenenSVG("s:" + d, SZENE[d], o); }
function homeScene(has, o) { let m = 0; for (let n = 1; n <= 16; n++) if (has(n)) m |= 1 << n; return szenenSVG("h:" + m, homeItems(has), o); }

/* ---------- 4. Türen, Texte und Aufgaben-Daten ----------
   Tage = Schultage im Dezember 2026 (ohne Wochenenden). rev = Wiederholungs-Tür ohne neuen Text.
   Texte je Stufe: 1 = Bildwörter, 2–4 = Sätze (einzeln, damit die Hilfe einen Satz markieren kann). */
const JAHR = 2026;
const TUEREN = [
  { n: 1, tag: 1, wt: "Di", titel: "Mutter und Kind" },
  { n: 2, tag: 2, wt: "Mi", titel: "Der Weg im Dunkeln" },
  { n: 3, tag: 3, wt: "Do", titel: "Der Stall und die Laterne" },
  { n: 4, tag: 4, wt: "Fr", titel: "Weißt du es noch?", rev: [1, 2, 3] },
  { n: 5, tag: 7, wt: "Mo", titel: "Die Tiere wachen auf" },
  { n: 6, tag: 8, wt: "Di", titel: "Das Pferd wärmt" },
  { n: 7, tag: 9, wt: "Mi", titel: "Die Kuh gibt Milch" },
  { n: 8, tag: 10, wt: "Do", titel: "Die Schafe wärmen" },
  { n: 9, tag: 11, wt: "Fr", titel: "Wer hilft der Frau?", rev: [6, 7, 8] },
  { n: 10, tag: 14, wt: "Mo", titel: "Die Nacht" },
  { n: 11, tag: 15, wt: "Di", titel: "Das Kind und der Stern" },
  { n: 12, tag: 16, wt: "Mi", titel: "Die Hirten sehen den Stern" },
  { n: 13, tag: 17, wt: "Do", titel: "Die Hirten finden das Kind" },
  { n: 14, tag: 18, wt: "Fr", titel: "Weißt du es noch?", rev: [10, 11, 12, 13] },
  { n: 15, tag: 21, wt: "Mo", titel: "Die Krippe" },
  { n: 16, tag: 22, wt: "Di", titel: "Das allererste Weihnachten" }
];
const TUER = n => TUEREN[n - 1];

const TEXT = {
  1: { 1: ["mutter", "kind"],
    2: ["Da ist eine Mutter.", "Da ist ein Kind.", "Die Mutter erzählt."],
    3: ["Ein Kind sitzt bei der Mutter auf dem Schoß.", "Das Kind sagt: „Erzähl von Weihnachten!“", "Die Mutter erzählt eine Geschichte.", "Die Geschichte ist sehr alt."],
    4: ["Ein Kind saß bei seiner Mutter auf dem Schoß.", "Es wollte etwas über Weihnachten hören.", "Also erzählte die Mutter eine Geschichte von früher.", "Das Kind konnte sich alles genau vorstellen."] },
  2: { 1: ["mann", "frau", "schnee", "kalt"],
    2: ["Es ist Winter.", "Es ist kalt.", "Ein Mann und eine Frau gehen.", "Sie sind müde."],
    3: ["Es ist Winter und schon dunkel.", "Ein Mann und eine Frau gehen durch den Schnee.", "Sie sind sehr müde.", "Sie möchten schlafen.", "Aber wo?", "Am Himmel ist kein Stern."],
    4: ["Es war ein kalter Winterabend vor langer Zeit.", "Ein Mann und eine Frau waren schon sehr weit gegangen.", "Nun suchten sie einen Platz zum Schlafen.", "In allen Häusern war das Licht schon aus, und niemand half ihnen.", "Am Himmel leuchtete kein einziger Stern."] },
  3: { 1: ["stall", "laterne", "tuer"],
    2: ["Da ist ein Stall.", "Der Mann hat eine Laterne.", "Er macht die Tür auf."],
    3: ["Am Weg steht ein Stall.", "Der Mann öffnet die Tür.", "Er leuchtet mit der Laterne hinein.", "Er denkt: Vielleicht sind hier Tiere.", "Bei Tieren ist es warm."],
    4: ["Da entdeckten die beiden einen Stall am Weg.", "Der Mann öffnete die Tür und hielt seine Laterne hinein.", "Ob dort Tiere schliefen?", "Wo Tiere sind, ist es warm – und die beiden froren sehr."] },
  5: { 1: ["pferd", "kuh", "huhn", "schaf"],
    2: ["Im Stall sind Tiere.", "1 Pferd, 1 Kuh, 1 Huhn und 5 Schafe.", "Die Tiere wachen auf."],
    3: ["Im Stall sind Tiere: ein Pferd, eine Kuh, ein Huhn und fünf Schafe.", "Die Tiere schlafen.", "Da knarrt die Tür.", "Jetzt sind die Tiere wach.", "Sie sehen den Mann und die Frau."],
    4: ["Ja, im Stall gab es Tiere: ein Pferd, eine Kuh, ein Huhn und fünf Schafe.", "Sie schliefen schon.", "Doch als die Tür knarrte, wurden sie wach.", "Im Licht der Laterne sahen sie die Frau.", "Die Tiere wunderten sich: Wer kommt mitten in der Nacht?"] },
  6: { 1: ["pferd", "hand", "warm"],
    2: ["Die Frau friert.", "Die Hände sind kalt.", "Das Pferd ist warm."],
    3: ["Die Frau friert.", "Ihre Hände sind ganz kalt.", "Sie geht zum Pferd.", "Sie legt die Hände unter die Mähne.", "Das Pferd bleibt ruhig stehen.", "Jetzt sind die Hände warm."],
    4: ["Die Frau fror.", "Sie war müde und hatte Hunger.", "Spürten die Tiere das?", "Das Pferd blieb jedenfalls ganz still stehen, als die Frau ihre eiskalten Finger in seiner dicken Mähne wärmte."] },
  7: { 1: ["kuh", "milch"],
    2: ["Die Frau hat Hunger.", "Die Kuh hat Milch.", "Die Frau trinkt Milch."],
    3: ["Die Frau hat Hunger.", "Sie geht zur Kuh und melkt sie.", "Die Kuh bleibt ruhig stehen.", "Die Frau trinkt die warme Milch."],
    4: ["Auch die Kuh schien zu verstehen, was die Frau brauchte.", "Sie hielt ganz still, während die Frau sie melkte.", "Die warme Milch tat der Frau gut."] },
  8: { 1: ["schafe", "stroh", "schlafen"],
    2: ["Die Frau ist müde.", "Sie schläft im Stroh.", "Die Schafe sind warm."],
    3: ["Die Frau ist sehr müde.", "Sie legt sich ins Stroh.", "Die Schafe kommen und legen sich zu ihr.", "So ist es warm.", "Die Frau schläft."],
    4: ["Und die Schafe?", "Als die Frau sich zum Schlafen ins Stroh legte, rückten sie ganz nah an sie heran.", "Mit ihrer dicken Wolle hielten sie die Frau warm."] },
  10: { 1: ["nacht", "still"],
    2: ["Es ist Nacht.", "Alle schlafen.", "Es ist still."],
    3: ["Jetzt ist es Nacht.", "Es ist dunkel und ganz still.", "Alle im Stall schlafen.", "Im Stall ist es warm."],
    4: ["Dann wurde es Nacht.", "Still und dunkel lag der Stall im Schnee.", "Alle, die darin waren, ruhten sich aus."] },
  11: { 1: ["baby", "stern"],
    2: ["In der Nacht kommt ein Baby.", "Alle Sterne leuchten.", "Ein Stern ist ganz hell."],
    3: ["Mitten in der Nacht bekommt die Frau ein Baby.", "Da leuchten alle Sterne am Himmel.", "Ein Stern ist besonders groß und hell.", "Er steht über dem Stall."],
    4: ["Mitten in der Nacht bekam die Frau ein Kind.", "Plötzlich leuchteten alle Sterne am Himmel.", "Am hellsten von allen strahlte ein großer Stern – genau über dem Stall."] },
  12: { 1: ["hirten", "hund", "stern"],
    2: ["Da sind Hirten.", "Sie sehen den Stern.", "Sie gehen zum Stall."],
    3: ["In der Nacht sind Hirten auf dem Feld.", "Sie holen ihre Schafe.", "Da sehen sie den hellen Stern.", "Er steht über ihrem Stall!", "Die Hirten fragen: „Warum leuchtet der Stern da?“", "Sie gehen zu ihrem Stall."],
    4: ["In dieser Nacht waren Hirten draußen auf den Feldern.", "Es war schon Winter, und sie wollten die letzten Schafe heimbringen.", "Da sahen sie den Stern über ihrem eigenen Stall, und der ganze Himmel war hell.", "„Was ist dort geschehen?“, fragten sie sich.", "Schnell liefen sie durch den Schnee zu ihrem Stall."] },
  13: { 1: ["hirten", "baby", "mutterbaby"],
    2: ["Die Hirten sind im Stall.", "Da ist ein Baby.", "Die Hirten staunen."],
    3: ["Die Hirten kommen in ihren Stall.", "Dort finden sie ein Baby.", "Es liegt bei der Mutter im Arm.", "Die Hirten sagen: „Der Stern leuchtet für das Baby.“"],
    4: ["Im Stall fanden die Hirten ein neugeborenes Kind in den Armen seiner Mutter.", "Da verstanden sie: Der Stern leuchtete wegen dieses Kindes.", "In ihrem Stall war noch nie ein Kind zur Welt gekommen."] },
  15: { 1: ["krippe", "baby", "pferd"],
    2: ["Das Baby ist müde.", "Da ist kein Bett.", "Das Baby schläft in der Krippe."],
    3: ["Das Baby muss schlafen.", "Aber im Stall gibt es kein Bett.", "Es gibt nur eine Krippe.", "Die Mutter legt das Baby hinein.", "Das Pferd steht daneben und schaut zu."],
    4: ["Nun sollte das Kind schlafen.", "Doch ein Bettchen gab es im Stall nicht, nur die Futterkrippe.", "Dort hinein legte die Mutter ihr Kind.", "Das Pferd stand still daneben, als ob es wüsste, dass das Kind seine Krippe jetzt brauchte."] },
  16: { 1: ["stern", "weihnachten"],
    2: ["Das Baby schläft.", "Alle sind still.", "Der Stern leuchtet.", "Das ist Weihnachten."],
    3: ["Das Baby schläft in der Krippe.", "Die Tiere und die Hirten sind ganz still.", "Über dem Stall leuchtet der Stern.", "Das ist Weihnachten – das allererste Weihnachten.", "Jetzt ist die Geschichte der Mutter zu Ende."],
    4: ["Die ganze Nacht schlief das Kind in der Krippe.", "Niemand sprach ein Wort, Tiere und Hirten schauten nur.", "Hell stand der Stern über dem Stall.", "So war es damals, beim allerersten Weihnachten.", "Und die Mutter? Sie war mit ihrer Geschichte fertig."] }
};

/* Aufgaben-Daten je Tür und Stufe (je 2 Aufgaben):
   Stufe 1: im = Bildwort, das im Szenenbild ist (hl = markierter Teil), nicht = Bildwort, das nicht im Bild ist; wort = Bildwort, x = falsches Bild
   Stufe 2: bild → drei Wörter (a = richtig); satz → drei Bilder; zahl = Zählaufgabe
   Stufe 3: st = Aussage (ok true/false), q = Frage mit a (richtig) und x (falsch); h = Nummer des Satzes, den die Hilfe markiert
   Stufe 4: q = Warum-Frage; teil = Satzanfang mit drei Enden */
const AUFG = {
  1: { 1: [{ im: "mutter", nicht: "pferd" }, { wort: "kind", x: "huhn" }],
    2: [{ bild: "kind", w: ["kind", "mutter", "baby"] }, { satz: "Die Mutter erzählt.", b: ["mutter", "pferd", "hirten"] }],
    3: [{ st: "Das Kind erzählt eine Geschichte.", ok: false, h: 2 }, { q: "Wer erzählt?", a: "die Mutter", x: ["das Kind", "der Mann"], h: 2 }],
    4: [{ q: "Warum erzählte die Mutter eine Geschichte?", a: "Das Kind wollte etwas über Weihnachten hören.", x: ["Das Kind konnte nicht schlafen.", "Die Mutter hatte ein neues Buch."], h: 1 },
      { teil: "Das Kind saß …", a: "bei seiner Mutter auf dem Schoß.", x: ["bei den Hirten auf dem Feld.", "bei den Schafen im Stroh."], h: 0 }] },
  2: { 1: [{ im: "frau", nicht: "kuh" }, { wort: "schnee", x: "stroh" }],
    2: [{ bild: "schnee", w: ["schnee", "stroh", "stern"] }, { satz: "Es ist kalt.", b: ["kalt", "warm", "milch"] }],
    3: [{ st: "Am Himmel sind viele Sterne.", ok: false, h: 5 }, { q: "Wie sind der Mann und die Frau?", a: "sehr müde", x: ["sehr froh", "sehr laut"], h: 2 }],
    4: [{ q: "Warum half niemand dem Mann und der Frau?", a: "Die Menschen in den Häusern schliefen schon.", x: ["Die Menschen feierten ein Fest.", "Die Menschen suchten ihre Schafe."], h: 3 },
      { teil: "Der Mann und die Frau suchten …", a: "einen Platz zum Schlafen.", x: ["ihre Schafe im Schnee.", "einen Stern am Himmel."], h: 2 }] },
  3: { 1: [{ im: "laterne", hl: "mann", nicht: "milch" }, { wort: "stall", x: "krippe" }],
    2: [{ bild: "laterne", w: ["laterne", "stern", "tuer"] }, { satz: "Da ist ein Stall.", b: ["stall", "krippe", "tuer"] }],
    3: [{ st: "Der Mann öffnet die Tür.", ok: true, h: 1 }, { q: "Womit leuchtet der Mann?", a: "mit der Laterne", x: ["mit dem Stern", "mit dem Feuer"], h: 2 }],
    4: [{ q: "Warum hoffte der Mann auf Tiere im Stall?", a: "Wo Tiere sind, ist es warm.", x: ["Er wollte ein Pferd kaufen.", "Er hatte Angst vor Tieren."], h: 3 },
      { teil: "Der Mann öffnete die Tür …", a: "und hielt seine Laterne hinein.", x: ["und legte sich ins Stroh.", "und melkte die Kuh."], h: 1 }] },
  5: { 1: [{ im: "huhn", nicht: "hund" }, { wort: "pferd", x: "kuh" }],
    2: [{ zahl: "schafe", n: 5, w: [4, 5, 6] }, { bild: "huhn", w: ["huhn", "hund", "kuh"] }],
    3: [{ zahl: "schafe", n: 5, w: [3, 4, 5, 6] }, { st: "Im Stall ist ein Hund.", ok: false, h: 0 }],
    4: [{ q: "Warum wurden die Tiere wach?", a: "Die Tür knarrte.", x: ["Das Baby weinte.", "Der Hund bellte."], h: 2 },
      { teil: "Im Licht der Laterne …", a: "sahen die Tiere die Frau.", x: ["melkte der Mann die Kuh.", "zählten die Hirten die Schafe."], h: 3 }] },
  6: { 1: [{ im: "pferd", nicht: "huhn" }, { wort: "warm", x: "kalt" }],
    2: [{ satz: "Das Pferd ist warm.", b: ["pferd", "kuh", "huhn"] }, { bild: "hand", w: ["hand", "hund", "huhn"] }],
    3: [{ st: "Die Frau legt die Hände unter die Mähne.", ok: true, h: 3 }, { q: "Wer wärmt die Hände der Frau?", a: "das Pferd", x: ["die Kuh", "der Mann"], h: 2 }],
    4: [{ q: "Warum schob die Frau ihre Finger in die Mähne?", a: "Ihre Finger waren eiskalt.", x: ["Sie wollte das Pferd kämmen.", "Sie wollte auf dem Pferd reiten."], h: 3 },
      { teil: "Das Pferd blieb ganz still stehen, …", a: "als die Frau ihre Finger in seiner Mähne wärmte.", x: ["als die Hirten den Stern sahen.", "als die Kuh Milch gab."], h: 3 }] },
  7: { 1: [{ im: "milch", nicht: "stern" }, { wort: "kuh", x: "pferd" }],
    2: [{ satz: "Die Frau trinkt Milch.", b: ["milch", "stroh", "laterne"] }, { bild: "kuh", w: ["kuh", "huhn", "pferd"] }],
    3: [{ st: "Die Milch ist kalt.", ok: false, h: 3 }, { q: "Was trinkt die Frau?", a: "Milch", x: ["Wasser", "Tee"], h: 3 }],
    4: [{ q: "Warum tat die Milch der Frau gut?", a: "Die Frau hatte Hunger und fror.", x: ["Die Frau mochte keine Milch.", "Die Frau wollte nach Hause."], h: 2 },
      { teil: "Die Kuh hielt ganz still, …", a: "während die Frau sie melkte.", x: ["während das Kind in der Krippe schlief.", "während die Hirten nach Hause liefen."], h: 1 }] },
  8: { 1: [{ im: "schaf", hl: "schafe", nicht: "kuh" }, { wort: "stroh", x: "schnee" }],
    2: [{ satz: "Sie schläft im Stroh.", b: ["stroh", "schnee", "krippe"] }, { bild: "schafe", w: ["schafe", "schnee", "stall"] }],
    3: [{ st: "Die Schafe legen sich zu der Frau.", ok: true, h: 2 }, { q: "Wo schläft die Frau?", a: "im Stroh", x: ["im Bett", "im Schnee"], h: 1 }],
    4: [{ q: "Warum war der Frau im Stroh warm?", a: "Die Schafe wärmten sie mit ihrer Wolle.", x: ["Im Stall brannte ein Feuer.", "Der Mann gab ihr eine Decke."], h: 2 },
      { teil: "Die Schafe rückten ganz nah an die Frau heran, …", a: "als sie sich ins Stroh legte.", x: ["als sie die Kuh melkte.", "als sie die Tür öffnete."], h: 1 }] },
  10: { 1: [{ im: "stall", nicht: "hirten" }, { wort: "nacht", x: "laterne" }],
    2: [{ satz: "Es ist Nacht.", b: ["nacht", "milch", "hand"] }, { bild: "still", w: ["still", "warm", "kalt"] }],
    3: [{ st: "Im Stall ist es kalt.", ok: false, h: 3 }, { q: "Was machen alle im Stall?", a: "Sie schlafen.", x: ["Sie essen.", "Sie singen."], h: 2 }],
    4: [{ q: "Warum war es im Stall so still?", a: "Alle ruhten sich aus.", x: ["Alle waren weggegangen.", "Alle warteten auf die Hirten."], h: 2 },
      { teil: "Still und dunkel …", a: "lag der Stall im Schnee.", x: ["leuchtete der Stern am Himmel.", "knarrte die Tür im Wind."], h: 1 }] },
  11: { 1: [{ im: "stern", nicht: "hund" }, { wort: "baby", x: "mann" }],
    2: [{ bild: "stern", w: ["stern", "stall", "stroh"] }, { satz: "In der Nacht kommt ein Baby.", b: ["baby", "kind", "hirten"] }],
    3: [{ st: "Der große Stern steht über dem Stall.", ok: true, h: 3 }, { q: "Wann kommt das Baby?", a: "mitten in der Nacht", x: ["am Morgen", "am Mittag"], h: 0 }],
    4: [{ q: "Warum leuchteten plötzlich alle Sterne?", a: "Das Kind war geboren.", x: ["Die Nacht war vorbei.", "Der Mann zündete die Laterne an."], h: 0 },
      { teil: "Am hellsten strahlte ein großer Stern …", a: "genau über dem Stall.", x: ["weit hinten über dem Wald.", "tief unten im Schnee."], h: 2 }] },
  12: { 1: [{ im: "hund", nicht: "kuh" }, { wort: "hirten", x: "frau" }],
    2: [{ bild: "hirten", w: ["hirten", "hund", "huhn"] }, { satz: "Sie sehen den Stern.", b: ["stern", "laterne", "stroh"] }],
    3: [{ st: "Die Hirten sehen den Stern.", ok: true, h: 2 }, { q: "Wohin gehen die Hirten?", a: "zu ihrem Stall", x: ["in den Wald", "in die Stadt"], h: 5 }],
    4: [{ q: "Warum waren die Hirten in der Nacht auf den Feldern?", a: "Sie wollten die letzten Schafe heimbringen.", x: ["Sie wollten den Stern suchen.", "Sie konnten nicht schlafen."], h: 1 },
      { teil: "Schnell liefen die Hirten …", a: "durch den Schnee zu ihrem Stall.", x: ["über die Felder in die Stadt.", "mit der Laterne in den Wald."], h: 4 }] },
  13: { 1: [{ im: "baby", hl: "frau", nicht: "milch" }, { wort: "hirten", x: "schafe" }],
    2: [{ satz: "Die Hirten sind im Stall.", b: ["hirten", "schafe", "kuh"] }, { bild: "baby", w: ["baby", "kind", "mann"] }],
    3: [{ st: "Das Baby liegt im Stroh.", ok: false, h: 2 }, { q: "Was finden die Hirten im Stall?", a: "ein Baby", x: ["ein Schaf", "einen Stern"], h: 1 }],
    4: [{ q: "Warum leuchtete der Stern über dem Stall?", a: "Im Stall war ein Kind geboren.", x: ["Im Stall brannte eine Laterne.", "Die Hirten hatten sich verlaufen."], h: 1 },
      { teil: "Die Hirten fanden ein neugeborenes Kind …", a: "in den Armen seiner Mutter.", x: ["auf dem Rücken des Pferdes.", "draußen im tiefen Schnee."], h: 0 }] },
  15: { 1: [{ im: "pferd", nicht: "kuh" }, { wort: "krippe", x: "stroh" }],
    2: [{ bild: "krippe", w: ["krippe", "stroh", "stall"] }, { satz: "Das Baby schläft in der Krippe.", b: ["krippe", "stroh", "tuer"] }],
    3: [{ st: "Im Stall gibt es ein Bett.", ok: false, h: 1 }, { q: "Wer schaut zu?", a: "das Pferd", x: ["die Kuh", "das Huhn"], h: 4 }],
    4: [{ q: "Warum legte die Mutter das Kind in die Krippe?", a: "Im Stall gab es kein Bettchen.", x: ["Das Pferd hatte keinen Hunger.", "Das Kind wollte beim Pferd sein."], h: 1 },
      { teil: "Das Pferd stand still daneben, …", a: "als ob es wüsste, dass das Kind die Krippe brauchte.", x: ["weil es Angst vor den Hirten hatte.", "bis die Kuh es weckte."], h: 3 }] },
  16: { 1: [{ im: "baby", hl: "krippe", nicht: "tuer" }, { wort: "weihnachten", x: "nacht" }],
    2: [{ satz: "Der Stern leuchtet.", b: ["stern", "schnee", "stroh"] }, { satz: "Alle sind still.", b: ["still", "hunger", "kalt"] }],
    3: [{ st: "Die Tiere und die Hirten sind ganz still.", ok: true, h: 1 }, { q: "Wo schläft das Baby?", a: "in der Krippe", x: ["im Stroh", "im Bett"], h: 0 }],
    4: [{ q: "Warum heißt die Geschichte „Weihnachten im Stall“?", a: "Das allererste Weihnachten war in einem Stall.", x: ["Die Mutter wohnt in einem Stall.", "Im Stall steht ein Weihnachtsbaum."], h: 3 },
      { teil: "Die ganze Nacht schlief das Kind …", a: "in der Krippe.", x: ["auf dem Feld.", "im Schnee."], h: 0 }] }
};
/* Tür 9 „Wer hilft der Frau?“: Was braucht die Frau → wer hilft */
const HILFE = [
  { not: "kalt", notW: "Die Hände sind kalt.", tier: "pferd", s3: "Die Hände der Frau sind kalt. Wer hilft?", a3: "das Pferd", s4: "Die Frau hatte eiskalte Finger. Wer half ihr – und wie?", a4: "Das Pferd: Sie wärmte die Finger in seiner Mähne.", tuer: 6 },
  { not: "hunger", notW: "Die Frau hat Hunger.", tier: "kuh", s3: "Die Frau hat Hunger. Wer hilft?", a3: "die Kuh", s4: "Die Frau hatte Hunger. Wer half ihr – und wie?", a4: "Die Kuh: Sie gab der Frau warme Milch.", tuer: 7 },
  { not: "muede", notW: "Die Frau ist müde.", tier: "schafe", s3: "Die Frau ist müde und will schlafen. Wer hilft?", a3: "die Schafe", s4: "Die Frau wollte im Stroh schlafen. Wer half ihr – und wie?", a4: "Die Schafe: Sie hielten die Frau mit ihrer Wolle warm.", tuer: 8 }
];
/* Reihenfolge-Aufgaben der Wiederholungs-Türen und der letzten Tür, je Stufe */
const FOLGE = {
  4: { 1: [1, 3], 2: [1, 2, 3], 3: [1, 2, 3], 4: [1, 2, 3] },
  14: { 1: [10, 13], 2: [10, 11, 13], 3: [10, 11, 12, 13], 4: [10, 11, 12, 13] },
  16: { 1: [3, 15], 2: [2, 5, 11], 3: [2, 6, 11, 13], 4: [3, 8, 12, 15] }
};

/* ---------- 5. Medien: gebärdete Fassung (YouTube) und Vorlese-Aufnahme ----------
   video: Adresse des YouTube-Videos (leer = „Video kommt bald“); vMarke: Tür → Startsekunde.
   audioUrl: Adresse der ganzen Aufnahme für die Weitergabe-Fassung (leer = Knopf fehlt); aMarke: Tür → Startsekunde.
   Eingebettete Aufnahmen je Tür (nur Klassen-Fassung): imgSrc-Tabelle TON (siehe build.py --images). */
const MEDIEN = { video: "", vMarke: {}, audioUrl: "", aMarke: {} };

/* ---------- 6. Aufgaben bauen ---------- */
const STUFEN = ["s1", "s2", "s3", "s4"];
const stufeNr = l => STUFEN.indexOf(l) + 1;
const P = t => '<span class="ptext">' + t + '</span>';
const satzBox = t => '<div class="satz">' + t + '</div>';
const EYE = ms => ({ icon: ICON.eye, text: "", ms: ms || 3000 });
/* Text einer Tür; hl = Nummer des Satzes, der gelb markiert wird */
function textHTML(d, lv, hl) {
  const t = TEXT[d][lv];
  if (lv === 1) return '<div class="wchips">' + t.map(k => '<span class="chip1">' + pic(k, "cpic") + gb(k, "mini") + '<b>' + W[k].w + '</b></span>').join("") + '</div>';
  return '<div class="lesetext st' + lv + '">' + t.map((s, i) => '<span class="' + (i === hl ? "mark" : "") + '">' + s + '</span>').join(" ") + '</div>';
}
function textAns(a, x, cls) {
  return shuffle([{ v: "a", html: '<span class="' + cls + '">' + a + '</span>' }].concat(x.map((t, i) => ({ v: "x" + i, html: '<span class="' + cls + '">' + t + '</span>' }))));
}
function zaehlen(d, t) {
  return { prompt: pic("schaf", "mini") + P("Wie viele Schafe?"), show: scene(d), layout: "nums",
    answers: t.w.map(v => ({ v: String(v), html: '<span class="num">' + v + '</span>' })), answer: String(t.n),
    hint: { tap: { show: scene(d, { taps: t.zahl }), target: t.n, sign: pic("schaf", "mini"), text: "Tippe jedes Schaf an." } },
    sol: { show: scene(d, { taps: t.zahl }), text: t.n + " Schafe" } };
}
function aufgabe(d, lv, i) {
  const t = AUFG[d][lv][i];
  if (t.zahl) return zaehlen(d, t);
  if (lv === 1 && t.im) {
    const hl = t.hl || t.im;
    return { prompt: '<span class="pico">' + ICON.eye + '</span>' + P("Was ist im Bild?"), show: scene(d), layout: "two",
      answers: shuffle([t.im, t.nicht]).map(v => ({ v, html: pic(v) })), answer: t.im,
      hint: { wait: Object.assign(EYE(2500), { show: scene(d, { hl }) }) }, sol: { show: scene(d, { hl }), text: picWord(t.im) } };
  }
  if (lv === 1) return { prompt: (gb(t.wort) || pic(t.wort, "mini")) + P(W[t.wort].w), show: "", layout: "two", /* mit Gebärde: Gebärde → Bild; ohne: Bild → gleiches Bild */
    answers: shuffle([t.wort, t.x]).map(v => ({ v, html: pic(v) })), answer: t.wort,
    hint: { wait: Object.assign(EYE(2500), { show: scene(d, { hl: t.wort }) }) }, sol: { text: picWord(t.wort) } };
  if (t.bild) {
    const opts = shuffle(t.w);
    return { prompt: P("Was ist das?"), show: pic(t.bild), layout: "names",
      answers: opts.map(v => ({ v, html: wordHTML(v) })), answer: t.bild,
      hint: { wait: Object.assign(EYE(3000), { answers: opts.map(v => ({ v, html: pic(v, "apic") + wordHTML(v) })) }) }, sol: { text: picWord(t.bild) } };
  }
  if (t.satz) {
    const opts = shuffle(t.b);
    return { prompt: P(t.satz), show: "", layout: "wide",
      answers: opts.map(v => ({ v, html: pic(v) })), answer: t.b[0],
      hint: { wait: Object.assign(EYE(3000), { show: scene(d), answers: opts.map(v => ({ v, html: pic(v) + wordHTML(v) })) }) }, sol: { show: scene(d), text: picWord(t.b[0]) } };
  }
  const hilfe = textHTML(d, lv, t.h);
  if (t.st) return { prompt: P("Stimmt das?"), show: satzBox(t.st), layout: "two",
    answers: [{ v: "ja", html: '<span class="jn ja">' + ICON.ok + '</span><span class="name">stimmt</span>' }, { v: "nein", html: '<span class="jn nein">' + KREUZ + '</span><span class="name">stimmt nicht</span>' }], answer: t.ok ? "ja" : "nein",
    hint: { wait: Object.assign(EYE(4500), { show: satzBox(t.st) + hilfe }) }, sol: { show: satzBox(t.st) + hilfe, text: t.ok ? "Das stimmt." : "Das stimmt nicht." } };
  if (t.teil) return { prompt: P("Wie geht der Satz weiter?"), show: satzBox(t.teil), layout: "col",
    answers: textAns(t.a, t.x, "lang"), answer: "a",
    hint: { wait: Object.assign(EYE(5000), { show: satzBox(t.teil) + hilfe }) }, sol: { show: hilfe, text: t.a } };
  return { prompt: P(t.q), show: "", layout: lv === 4 ? "col" : "wide", /* kein Szenenbild: es würde die Antwort verraten */
    answers: textAns(t.a, t.x, lv === 4 ? "lang" : "kurz"), answer: "a",
    hint: { wait: Object.assign(EYE(lv === 4 ? 5000 : 4500), { show: hilfe }) }, sol: { show: hilfe, text: t.a } };
}
const KREUZ = '<svg viewBox="0 0 40 40" fill="none" stroke="#9c2a1f" stroke-width="5" stroke-linecap="round"><path d="M10 10l20 20M30 10L10 30"/></svg>';
const thumb = d => scene(d, { cls: "thumb" });
/* Reihenfolge: Stufe 1 = „Was war zuerst?“ (zwei Bilder), ab Stufe 2 Bilder in Kästchen legen */
function folge(liste, lv) {
  if (lv === 1) return { prompt: '<span class="pico">' + ICON.eye + '</span>' + P("Was war zuerst?"), show: "", layout: "two",
    answers: shuffle(liste).map(v => ({ v: String(v), html: thumb(v) })), answer: String(liste[0]),
    hint: { wait: EYE(2500) }, sol: { text: "" } };
  return { prompt: P("Was passiert zuerst? Lege die Bilder der Reihe nach."), show: "", layout: "folge",
    build: { n: liste.length, answer: liste.map(String),
      view: arr => '<div class="fslots">' + arr.map((v, i) => '<button class="fslot" data-slot="' + i + '"><b>' + (i + 1) + '</b>' + (v ? thumb(+v) : "") + '</button>').join("") + '</div>',
      palette: shuffle(liste).map(v => ({ v: String(v), html: thumb(v) })) },
    hint: ctx => { ctx.setShow('<div class="erst"><b>1</b>' + scene(liste[0]) + '</div>'); ctx.waitHint(ICON.eye, "Das war zuerst.", 3000); },
    sol: { text: "" } };
}
function werHilft(h, lv) {
  const tiere = ["pferd", "kuh", "schafe"];
  if (lv === 1) { const x = tiere.filter(t => t !== h.tier)[Math.floor(Math.random() * 2)];
    return { prompt: '<span class="pico">' + ART_HERZ + '</span>' + P("Wer hilft?"), show: pic(h.not) + '<div class="unter">' + wordHTML(h.not) + '</div>', layout: "two",
      answers: shuffle([h.tier, x]).map(v => ({ v, html: pic(v) })), answer: h.tier,
      hint: { wait: Object.assign(EYE(3000), { show: scene(h.tuer) }) }, sol: { show: scene(h.tuer), text: picWord(h.tier) } }; }
  if (lv === 2) return { prompt: P(h.notW + " Wer hilft?"), show: pic(h.not), layout: "wide",
    answers: shuffle(tiere).map(v => ({ v, html: pic(v) })), answer: h.tier,
    hint: { wait: Object.assign(EYE(3000), { show: scene(h.tuer) }) }, sol: { show: scene(h.tuer), text: picWord(h.tier) } };
  const a = lv === 3 ? HILFE.map(x => [x.tier, x.a3]) : HILFE.map(x => [x.tier, x.a4]);
  return { prompt: P(lv === 3 ? h.s3 : h.s4), show: pic(h.not), layout: lv === 4 ? "col" : "wide",
    answers: shuffle(a).map(x => ({ v: x[0], html: '<span class="' + (lv === 4 ? "lang" : "kurz") + '">' + x[1] + '</span>' })), answer: h.tier,
    hint: { wait: Object.assign(EYE(4000), { show: scene(h.tuer) }) }, sol: { show: scene(h.tuer), text: lv === 3 ? h.a3 : h.a4 } };
}
const ART_HERZ = pic("herz", "mini");
function tuerAufgaben(n, lv) {
  if (n === 4) return [folge(FOLGE[4][lv], lv), aufgabe(1, lv, 1), aufgabe(3, lv, 0)];
  if (n === 9) return shuffle(HILFE).map(h => werHilft(h, lv));
  if (n === 14) return [folge(FOLGE[14][lv], lv), aufgabe(11, lv, 1), aufgabe(13, lv, 0)];
  if (n === 16) return [aufgabe(16, lv, 0), aufgabe(16, lv, 1), folge(FOLGE[16][lv], lv)];
  return [aufgabe(n, lv, 0), aufgabe(n, lv, 1)];
}

/* ---------- 7. Kalender, Tür-Seite, Lehrkraft ---------- */
let TUER_NR = 1, FRISCH = 0;
const lvl = () => STUFEN.includes(S.level) ? S.level : "s2";
function fertig(n, st) { st = st || S; return STUFEN.some(l => { const p = (st.prog || {})[l]; return !!(p && p["t" + n] && p["t" + n].done); }); }
function anzahlFertig(st) { return TUEREN.filter(t => fertig(t.n, st)).length; }
function tagOffen(t) { return !!S.unlockAll || Date.now() >= new Date(JAHR, 11, t.tag).getTime(); }
function istHeute(t) { const d = new Date(); return d.getFullYear() === JAHR && d.getMonth() === 11 && d.getDate() === t.tag; }
const SVG_TON = '<svg viewBox="0 0 40 40" fill="none" stroke="#1b2636" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M6 15h7l9-8v26l-9-8H6z" fill="#fff"/><path d="M27 14q5 6 0 12M31 9q9 11 0 22"/></svg>';
const SVG_DGS = pic("dgs", "mbico");
const SVG_STERN = pic("sternIcon", "sico");

function renderKalender(box) {
  const has = n => fertig(n), nf = anzahlFertig();
  let cells = '<span class="kwt">Mo</span><span class="kwt">Di</span><span class="kwt">Mi</span><span class="kwt">Do</span><span class="kwt">Fr</span><span class="kleer"></span>';
  TUEREN.forEach(t => {
    const off = tagOffen(t), f = has(t.n);
    cells += '<button class="ktuer' + (f ? " fertig" : off ? " offen" : " zu") + (istHeute(t) && !f ? " heute" : "") + '" data-n="' + t.n + '" aria-label="Tür ' + t.n + '">'
      + pic(f ? "tuerFertig" : off ? "tuerOffen" : "tuerZu", "kbild") + '<b>' + t.n + '</b>' + (off || f ? "" : '<span class="kdat">' + t.tag + '.12.</span>') + '</button>';
  });
  box.innerHTML = '<div class="wis"><div class="wisbild card' + (FRISCH ? " frisch" : "") + '">' + homeScene(has)
    + '<div class="wisz"><span class="kst">' + SVG_STERN + '</span><b>' + nf + '</b> / 16</div></div><div class="kal">' + cells + '</div></div>';
  box.querySelectorAll(".ktuer").forEach(b => b.onclick = () => {
    const t = TUER(+b.dataset.n);
    if (!tagOffen(t)) { note("Diese Tür öffnet sich am " + t.tag + ". Dezember."); return; }
    TUER_NR = t.n; go("door");
  });
  if (FRISCH) { if (FRISCH === 16) confetti(160); FRISCH = 0; }
}
function renderTuer() {
  const t = TUER(TUER_NR), lv = stufeNr(lvl()), f = fertig(t.n), p = (S.prog[lvl()] || {})["t" + t.n];
  $("tuerTitel").textContent = "Tür " + t.n + " · " + t.titel;
  const ton = (typeof TON !== "undefined" && TON[t.n]) || "";
  let links, rechts;
  if (t.rev) {
    links = '<div class="revbilder">' + t.rev.map(d => thumb(d)).join("") + '</div>';
    rechts = '<div class="wchips"><span class="chip1">' + pic("stern", "cpic") + '<b>' + t.titel + '</b></span></div>';
  } else { links = scene(t.n); rechts = textHTML(t.n, lv) + (lv > 1 && TEXT[t.n][1].some(k => gb(k)) ? '<div class="wchips klein">' + TEXT[t.n][1].map(k => '<span class="chip1">' + gb(k, "mini") + '<b>' + W[k].w + '</b></span>').join("") + '</div>' : ""); }
  $("tuerBody").innerHTML = '<div class="tuerbild card">' + links + '</div><div class="tuertext card">' + rechts + '</div>';
  $("tuerKnoepfe").innerHTML = (t.rev ? "" : (ton || MEDIEN.audioUrl ? '<button class="medbtn" id="btnTon">' + SVG_TON + '<span>Vorlesen</span></button>' : "")
    + '<button class="medbtn" id="btnDgs">' + SVG_DGS + '<span>Gebärden-Video</span></button>')
    + (p && p.done ? '<span class="tuerfertig"><span class="kst">' + SVG_STERN + '</span>' + p.stars + ' / ' + sizeOf(lvl(), "t" + t.n) + '</span>' : "")
    + '<button class="next" id="btnAufg">' + (f ? "Nochmal" : "Aufgaben") + ' ' + ICON.next + '</button>';
  $("btnAufg").onclick = () => { stopTon(); S.level = lvl(); startMission("t" + t.n); };
  const bd = $("btnDgs"); if (bd) bd.onclick = () => {
    if (!MEDIEN.video) { note("Das Gebärden-Video kommt bald."); return; }
    const sek = MEDIEN.vMarke[t.n] || 0, u = MEDIEN.video + (MEDIEN.video.includes("?") ? "&" : "?") + "t=" + sek + "s&z=" + Date.now();
    let w = null; try { w = window.open(u, "_blank"); } catch (e) { } if (!w) note("Das Video lässt sich hier nicht öffnen.");
  };
  const bt = $("btnTon"); if (bt) bt.onclick = () => {
    if (ton) { const a = $("tuerTon"); if (a.dataset.n !== String(t.n)) { a.src = ton; a.dataset.n = String(t.n); }
      if (a.paused) { a.play().catch(() => note("Der Ton lässt sich gerade nicht abspielen.")); bt.classList.add("an"); a.onended = () => bt.classList.remove("an"); } else { a.pause(); bt.classList.remove("an"); } return; }
    let w = null; try { w = window.open(MEDIEN.audioUrl + (MEDIEN.aMarke[t.n] ? "#t=" + MEDIEN.aMarke[t.n] : ""), "_blank"); } catch (e) { } if (!w) note("Die Aufnahme lässt sich hier nicht öffnen.");
  };
}
function stopTon() { const a = $("tuerTon"); if (a && !a.paused) a.pause(); }
/* eigener Bildschirm „Tür“ (der Baukasten kennt ihn über APP.route / APP.onScreen) */
(function () {
  const s = document.createElement("section"); s.id = "door"; s.className = "screen";
  s.innerHTML = '<div class="top"><button class="iconbtn" id="tuerZurueck" aria-label="Zurück"></button><div class="prompt card" style="margin:0;flex:1"><span class="ptext" id="tuerTitel"></span></div></div>'
    + '<div class="tuerbody" id="tuerBody"></div><div class="tuerknoepfe" id="tuerKnoepfe"></div><audio id="tuerTon" preload="none"></audio>';
  document.body.insertBefore(s, document.getElementById("info"));
  s.querySelector("#tuerZurueck").innerHTML = ICON.back;
  s.querySelector("#tuerZurueck").onclick = () => { stopTon(); go("start"); };
})();

/* Schneefall hinter Kalender und Tür-Seite */
let FL = null;
function flockenStart() {
  if (FL) return; const cv = document.createElement("canvas"); cv.id = "flocken"; document.body.insertBefore(cv, document.body.firstChild);
  const ctx = cv.getContext("2d"), f = []; FL = cv;
  const ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;
  (function lauf() {
    if (cv.width !== innerWidth) { cv.width = innerWidth; cv.height = innerHeight; f.length = 0; for (let i = 0; i < 70; i++) f.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 1.2 + Math.random() * 3, v: .25 + Math.random() * .6, p: Math.random() * 6 }); }
    if (cv.offsetParent !== null || getComputedStyle(cv).display !== "none") {
      ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = "rgba(255,255,255,.75)";
      f.forEach(s => { if (!ruhig) { s.y += s.v; s.p += .02; s.x += Math.sin(s.p) * .35; } if (s.y > cv.height + 4) { s.y = -4; s.x = Math.random() * cv.width; } ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.3); ctx.fill(); });
    }
    requestAnimationFrame(lauf);
  })();
}
/* ---------- 8. App-Beschreibung (Vertrag mit dem Baukasten) ---------- */
const zahlIcon = n => '<circle cx="100" cy="100" r="80" fill="#1c2b4a" stroke="#1b2636" stroke-width="8"/><text x="100" y="132" text-anchor="middle" font-size="92" font-weight="800" fill="#ffd94a" font-family="system-ui,sans-serif">' + n + '</text>';
const TMISS = TUEREN.map(t => "t" + t.n);
const APP = {
  id: "weihnachten-im-stall",
  title: "Weihnachten im Stall",
  subtitle: "Öffne jeden Tag eine Tür.",
  credit: "mit KI erstellt · geprüft: J. Schneider · nach Astrid Lindgren, „Weihnachten im Stall“ (Oetinger) · Schrift: Andika (SIL OFL)" + (hasSigns() ? " · Gebärdenbilder: © Verlag Karin Kestner, kestner.app" : ""),
  crownLabel: "Das allererste Weihnachten",
  hero: () => "",
  parallel: true,
  unlockAllLabel: "Alle Türen öffnen (ohne Datum)",
  keepOnReset: ["level"],
  levels: STUFEN.map((id, i) => ({ id, marks: "★".repeat(i + 1), label: "Stufe " + (i + 1), missions: TMISS })),
  missions: TUEREN.reduce((m, t) => { m["t" + t.n] = { name: "Tür " + t.n + " · " + t.titel, icon: () => zahlIcon(t.n) }; return m; }, {}),
  buildTasks(level, mid) { return tuerAufgaben(+mid.slice(1), stufeNr(level)); },
  renderStart: renderKalender,
  route(id) { if (id === "map") { if (FRISCH) return "start"; return "door"; } return id; },
  onScreen(id) { document.body.dataset.scr = id; if (id === "door") renderTuer(); flockenStart(); },
  onMissionDone(o) { FRISCH = +o.mid.slice(1); },
  score: st => anzahlFertig(st) / 16,
  reached: st => "Stufe " + (STUFEN.includes(st.level) ? stufeNr(st.level) : 2) + " · " + anzahlFertig(st) + "/16 Türen" + (st.unlockAll ? " (alle offen)" : ""),
  teacher: {
    html: () => '<p class="lchead">Lesestufe dieses Kindes</p><div class="stufenwahl">' + STUFEN.map((l, i) => '<button class="stufebtn" data-l="' + l + '"><b>' + (i + 1) + '</b><span>' + ["Bildwörter", "kurze Sätze", "Sätze", "Präteritum"][i] + '</span></button>').join("") + '</div>',
    wire(root) { root.querySelectorAll(".stufebtn").forEach(b => b.addEventListener("click", () => { S.level = b.dataset.l; save(); renderSwitches(); toast("Stufe " + stufeNr(S.level) + " eingestellt."); })); },
    render(root) { root.querySelectorAll(".stufebtn").forEach(b => b.classList.toggle("on", b.dataset.l === lvl())); }
  },
  board: {
    w1: { label: "Tür 1–3", cards: () => tafelKarten([1, 2, 3]) },
    w2: { label: "Tür 5–8", cards: () => tafelKarten([5, 6, 7, 8]) },
    w3: { label: "Tür 10–13", cards: () => tafelKarten([10, 11, 12, 13]) },
    w4: { label: "Tür 15–16", cards: () => tafelKarten([15, 16]) },
    hilft: { label: "Wer hilft?", cards: () => shuffle(HILFE).map(h => ({ html: pic(h.not, "big") + '<div class="satz">' + h.notW + '</div>', reveal: '<div class="rv">' + pic(h.tier) + wordHTML(h.tier) + '</div>' })) }
  },
  info: '<p><b>Adventskalender zur Geschichte:</b> 16 Türen für die Schultage vom 1. bis 22. Dezember ' + JAHR + '. Jede Tür öffnet sich an ihrem Tag und bleibt offen; verpasste Türen können jederzeit nachgeholt werden. Mit dem Schalter „Alle Türen öffnen“ ist die App frei nutzbar.</p>'
    + '<p><b>Eine Tür:</b> Bild und Text der Szene ansehen (dazu Gebärden-Video und Vorlesen, sobald hinterlegt), dann 2–3 Aufgaben. Für jede gelöste Tür kommt im Stall-Bild der Startseite etwas dazu. Türen 4, 9 und 14 wiederholen.</p>'
    + '<p><b>Vier Lesestufen</b> (oben einstellen, gilt für dieses Kind): 1 = Bildwörter, immer zwei Antworten · 2 = Zwei- bis Dreiwortsätze · 3 = kurze Sätze im Präsens · 4 = längere Sätze im Präteritum. Ohne Einstellung gilt Stufe 2. Die Stufe kann jederzeit gewechselt werden; eine Tür gilt als gelöst, wenn sie auf irgendeiner Stufe gelöst wurde.</p>'
    + '<p><b>Texte:</b> eigene, vereinfachte Nacherzählung nach dem Bilderbuch von Astrid Lindgren (Oetinger). Bilder: eigene Zeichnungen.</p>'
};
function tafelKarten(tueren) {
  const k = [];
  tueren.forEach(d => AUFG[d][3].filter(t => t.st).forEach(t => k.push({ html: scene(d, { cls: "szene tafel" }) + '<div class="satz">' + t.st + '</div>',
    reveal: '<div class="rv">' + (t.ok ? '<span class="jn ja">' + ICON.ok + '</span>Das stimmt.' : '<span class="jn nein">' + KREUZ + '</span>Das stimmt nicht.') + '</div>' })));
  return shuffle(k);
}
