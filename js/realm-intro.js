/* Procedural elemental study: shared space, continuous motion, no video assets. */
(function () {
  'use strict';
  var panel = document.querySelector('.realm-compass');
  if (!panel) return;
  var canvas = panel.querySelector('.element-canvas');
  var ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  var names = ['Water', 'Earth', 'Fire', 'Air'];
  var domains = ['The CDN edge', 'The application cache', 'The database depths', 'The browser realm'];
  var colors = ['#77c7db', '#b4b887', '#f4a065', '#ded9be'];
  var buttons = Array.from(panel.querySelectorAll('[data-element]'));
  var pause = panel.querySelector('.element-motion');
  var title = panel.querySelector('.element-name');
  var domain = panel.querySelector('.element-domain');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused = motion.matches;
  var visible = !('IntersectionObserver' in window);
  var elapsed = 1.6, last = 0, frame = 0, shown = -1;
  var width = 360, height = 380, ratio = 1;
  var TAU = Math.PI * 2;
  function fract(n) { return n - Math.floor(n); }
  function rnd(n) { return fract(Math.sin(n * 127.1 + 311.7) * 43758.5453); }
  function smooth(n) { n = Math.max(0, Math.min(1, n)); return n * n * (3 - 2 * n); }
  function path(points, fill) {
    ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(function (p) { ctx.lineTo(p[0], p[1]); });
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function glow(x, y, radius, color) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, color); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(x-radius, y-radius, radius*2, radius*2);
  }

  function water(t) {
    glow(211, 166, 180, '#29799744');
    // Overlapping bodies of water, each travelling at a different speed.
    for (var j=0; j<5; j++) {
      ctx.beginPath();
      for (var x=-20; x<=380; x+=4) {
        var y=259+j*13+Math.sin(x*.017-t*1.2+j*.6)*(14+j*2)+Math.sin(x*.038+t*.7)*5;
        if(x===-20) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.lineTo(380,380);ctx.lineTo(-20,380);ctx.closePath();
      var sea=ctx.createLinearGradient(0,230,0,380);
      sea.addColorStop(0,['#428caa77','#337c9888','#27688099','#20536bcc','#123449'][j]);
      sea.addColorStop(1,'#0a222c');ctx.fillStyle=sea;ctx.fill();
    }
    ctx.save();ctx.translate(Math.sin(t*.65)*7,Math.sin(t*.9)*5);
    // A broad curling crest with an illuminated lip and a shaded underside.
    ctx.beginPath();ctx.moveTo(-25,285);
    ctx.bezierCurveTo(79,301,80,183,134,116);
    ctx.bezierCurveTo(181,55,269,70,281,134);
    ctx.bezierCurveTo(237,103,203,125,207,162);
    ctx.bezierCurveTo(214,221,284,244,383,210);
    ctx.lineTo(383,337);ctx.bezierCurveTo(236,294,154,377,-25,335);ctx.closePath();
    var crest=ctx.createLinearGradient(154,88,184,320);
    crest.addColorStop(0,'#c0e9e5');crest.addColorStop(.18,'#6cbdcf');crest.addColorStop(.5,'#277591');crest.addColorStop(1,'#103440');
    ctx.fillStyle=crest;ctx.fill();
    for(var k=0;k<16;k++) {
      ctx.beginPath();ctx.moveTo(-15,288+k*3);
      ctx.bezierCurveTo(86,298+k*2,84+k,179+k*3,143+k*2,118+k*2);
      ctx.bezierCurveTo(181+k,78+k*3,245,93+k*2,276,133+k);
      ctx.strokeStyle='rgba(192,239,238,'+(0.05+(k%3)*.04)+')';ctx.lineWidth=1;ctx.stroke();
    }
    ctx.beginPath();ctx.moveTo(-18,284);ctx.bezierCurveTo(79,295,84,169,138,111);ctx.bezierCurveTo(184,59,263,76,280,133);
    ctx.strokeStyle='#d2f0e7';ctx.lineWidth=2.4;ctx.stroke();
    var sceneAlpha=ctx.globalAlpha;
    for(var p=0;p<48;p++) {
      var life=fract(t*.38+rnd(p)), sx=137+rnd(p+90)*141+life*32, sy=103+rnd(p+13)*20-Math.sin(life*Math.PI)*55;
      ctx.globalAlpha=sceneAlpha*(1-life)*.65;ctx.fillStyle='#d5f5ed';ctx.beginPath();ctx.ellipse(sx,sy,1+rnd(p+4)*1.6,1.5+rnd(p+7)*2.6,-.7,0,TAU);ctx.fill();
    }
    ctx.restore();
  }

  function rock(x,y,size,seed,lift) {
    ctx.save();ctx.translate(x,y-lift);ctx.rotate((rnd(seed)-.5)*.35);
    var s=size;
    path([[-s*.65,-s*.25],[-s*.27,-s*.7],[s*.37,-s*.63],[s*.66,-s*.08],[s*.4,s*.53],[-s*.4,s*.64],[-s*.7,s*.18]],'#4b584b');
    path([[-s*.65,-s*.25],[-s*.27,-s*.7],[s*.37,-s*.63],[s*.13,-s*.04],[-s*.36,s*.12]],'#a0a285');
    path([[s*.37,-s*.63],[s*.66,-s*.08],[s*.4,s*.53],[s*.13,-s*.04]],'#69765c');
    path([[-s*.36,s*.12],[s*.13,-s*.04],[s*.4,s*.53],[-s*.4,s*.64],[-s*.7,s*.18]],'#3c4b42');
    // Mineral flecks break up the faces without changing the rock's silhouette.
    for(var grain=0;grain<55;grain++) {
      var gx=(rnd(grain+seed*31)-.5)*s*.78,gy=(rnd(grain+seed*47)-.5)*s*.65;
      ctx.fillStyle=grain%3?'#c7c4a21a':'#172b2633';
      ctx.fillRect(gx,gy,.8+rnd(grain+7)*2,.6+rnd(grain+8)*1.5);
    }
    ctx.strokeStyle='#c4bd9266';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-s*.65,-s*.25);ctx.lineTo(-s*.27,-s*.7);ctx.lineTo(s*.37,-s*.63);ctx.stroke();
    ctx.strokeStyle='#182d2999';ctx.lineWidth=1.5;
    for(var v=0;v<4;v++){ctx.beginPath();ctx.moveTo(-s*.48+v*s*.23,-s*.1);ctx.lineTo(-s*.22+v*s*.12,s*.16);ctx.lineTo(-s*.32+v*s*.15,s*.36);ctx.stroke();}
    ctx.restore();
  }
  function earth(t,local) {
    glow(180,248,178,'#a9a56325');
    // Staggered lifts keep the mass grounded; the fragments follow the main rock.
    var rise=smooth(local/1.35), lift=rise*88;
    ctx.save();ctx.globalAlpha*=.5;
    for(var d=0;d<5;d++) {ctx.fillStyle=['#172f30','#1d3734','#294038','#354a3d','#40523f'][d];ctx.beginPath();ctx.moveTo(-20,380);for(var x=-20;x<=380;x+=10)ctx.lineTo(x,321+d*8+Math.sin(x*.025+d)*11);ctx.lineTo(380,380);ctx.fill();}
    ctx.restore();
    rock(180,267,99,2,lift+Math.sin(t*1.1)*2);
    rock(78,299,43,5,lift*.57+Math.sin(t*1.2+1)*3);
    rock(275,266,47,7,lift*.66+Math.sin(t+2)*3);
    rock(225,329,25,11,lift*.35);
    for(var n=0;n<44;n++) {
      var life=fract(t*.18+rnd(n));ctx.save();ctx.globalAlpha*=(1-life)*.4;
      var px=180+(rnd(n+8)-.5)*(80+life*260),py=328-life*96;
      ctx.fillStyle=n%3?'#899375':'#c5bc92';ctx.fillRect(px,py,1+rnd(n+12)*3,1+rnd(n+12)*3);ctx.restore();
    }
    for(var m=0;m<9;m++)rock(60+rnd(m+22)*255,307,5+rnd(m+14)*9,m+3,lift*rnd(m+55));
  }

  function fire(t) {
    glow(183,249,176,'#d958202d');glow(180,308,100,'#fb94343a');
    ctx.save();ctx.globalCompositeOperation='screen';
    // Layered, asymmetric tongues stretch and fold; no fixed flame outline.
    for(var layer=0;layer<3;layer++) {
      var tongues=layer===0?11:9;
      for(var i=0;i<tongues;i++) {
        var seed=i+layer*31, x=92+i*(176/tongues), base=325+rnd(seed)*10;
        var length=(95+Math.sin(i*1.8+t*2.5)*22+rnd(seed+5)*98)*(1-layer*.18);
        var sway=Math.sin(t*2.2+i*.7)*18+Math.sin(t*4.1+i)*8;
        var w=21-layer*4, tip=x+sway, top=base-length;
        ctx.shadowColor=layer===0?'#d46124':'#ffbd55';ctx.shadowBlur=layer===0?14:7;
        ctx.beginPath();ctx.moveTo(x-w,base);
        ctx.bezierCurveTo(x-w*1.6,base-length*.3,tip+26+Math.sin(t*3+i)*16,top+38,tip,top);
        ctx.bezierCurveTo(tip+13,top+length*.4,x+w*1.6,base-length*.35,x+w,base);
        ctx.closePath();
        var flame=ctx.createLinearGradient(0,top,0,base);
        flame.addColorStop(0,['#ec663500','#ffc15b22','#fff4b555'][layer]);
        flame.addColorStop(.25,['#e55b2788','#f99c38bb','#ffd574cc'][layer]);
        flame.addColorStop(1,['#9f382d66','#f37f2ccc','#fff2b0ee'][layer]);
        ctx.fillStyle=flame;ctx.fill();
      }
    }
    ctx.restore();
    for(var p=0;p<65;p++) {
      var life=fract(t*(.15+rnd(p)*.18)+rnd(p+80));
      var x=180+(rnd(p+4)-.5)*133+Math.sin(life*5+p)*life*30, y=332-life*270;
      ctx.save();ctx.globalAlpha*=Math.sin(life*Math.PI)*(.35+rnd(p)*.5);ctx.strokeStyle=p%4?'#eb9861':'#fff0bb';ctx.lineWidth=.6+rnd(p+2)*1.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(p)*2,y+3+rnd(p+4)*6);ctx.stroke();ctx.restore();
    }
  }

  function air(t) {
    glow(191,184,174,'#b9ceb51c');
    // Ribbons share a travelling field: wide translucent bodies and fine trails.
    for(var j=0;j<28;j++) {
      var phase=t*.68+j*.1, offset=j*3.4;
      ctx.beginPath();
      ctx.moveTo(-45,238+offset+Math.sin(phase)*13);
      ctx.bezierCurveTo(105,304+offset+Math.sin(phase)*18,315,76+offset,251+Math.sin(phase*.7)*18,100+offset);
      ctx.bezierCurveTo(206,64+offset+Math.cos(phase)*19,61,89+offset,89,159+offset+Math.sin(phase)*15);
      ctx.bezierCurveTo(121,228+offset,276,193+offset,408,91+offset+Math.sin(phase)*17);
      ctx.strokeStyle='rgba(209,225,210,'+((j%5===0?.055:.03)*(.7+.3*Math.sin(phase)))+')';ctx.lineWidth=j%5===0?15:1;ctx.stroke();
    }
    for(var p=0;p<100;p++) {
      var u=fract(t*.105+rnd(p)), x=-40+u*440;
      var y=220+Math.sin(u*TAU+t*.3)*57+(rnd(p+7)-.5)*88;
      ctx.save();ctx.globalAlpha*=Math.sin(u*Math.PI)*.5;ctx.strokeStyle=p%4?'#bfd2c4':'#e5d1a0';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5-rnd(p+4)*12,y-2);ctx.stroke();ctx.restore();
    }
  }

  var renderers=[water,earth,fire,air];
  function show(index) {
    if (shown===index) return;
    shown=index;title.textContent=names[index];domain.textContent=domains[index];
    panel.style.setProperty('--scene-color',colors[index]);
    buttons.forEach(function(button,i){button.setAttribute('aria-pressed',String(i===index));});
  }
  function draw() {
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
    var scale=Math.min(width/360,height/380);
    ctx.translate((width-360*scale)/2,(height-380*scale)/2);ctx.scale(scale,scale);
    var index=Math.floor(elapsed/6)%4,local=elapsed%6,blend=smooth((local-4.5)/1.5);
    show(blend>.5?(index+1)%4:index);
    ctx.save();ctx.globalAlpha=1-blend;renderers[index](elapsed,local+1.5);ctx.restore();
    if(blend>0){ctx.save();ctx.globalAlpha=blend;renderers[(index+1)%4](elapsed,local-4.5);ctx.restore();}
    var shade=ctx.createLinearGradient(0,290,0,380);shade.addColorStop(0,'#10252c00');shade.addColorStop(1,'#10252c');ctx.fillStyle=shade;ctx.fillRect(-60,290,480,90);
  }
  function resize() {
    var bounds=canvas.getBoundingClientRect();width=bounds.width;height=bounds.height;
    ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);draw();
  }
  function tick(now) {
    frame=0;
    if(paused||!visible||document.hidden){last=0;return;}
    if(!last)last=now;
    if(now-last>=1000/30){elapsed+=Math.min((now-last)/1000,.1);last=now;draw();}
    frame=window.requestAnimationFrame(tick);
  }
  function sync() {
    if(frame)window.cancelAnimationFrame(frame);frame=0;last=0;
    pause.textContent=paused?'Play motion':'Pause motion';
    pause.hidden=motion.matches;
    if(!paused&&visible&&!document.hidden)frame=window.requestAnimationFrame(tick);
  }
  buttons.forEach(function(button,index){button.addEventListener('click',function(){elapsed=index*6+1.6;draw();});});
  pause.addEventListener('click',function(){paused=!paused;sync();});
  motion.addEventListener('change',function(){paused=motion.matches;sync();draw();});
  document.addEventListener('visibilitychange',sync);
  panel.classList.add('elemental-ready');
  panel.querySelector('.element-controls').hidden=false;
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
  if('IntersectionObserver' in window)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(canvas);
  resize();sync();
})();
