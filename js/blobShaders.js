function BlobEffect(){
    this.isActive = false;
    this.first = true;

    this.rootTarget = null;
    this.glowTargetxy = null;
    this.glowTarget = null;
    
    this.blobxy = new THREE.ShaderMaterial( CloudGausXY );
    this.blobmin = new THREE.ShaderMaterial( CloudGausMIN );
    this.blobbase = new THREE.ShaderMaterial( CloudBasic );
    this.blobbase.uniforms.map.value = THREE.ImageUtils.loadTexture( 'textures/point.png');
    this.blobbase.uniforms.usemap.value = true;
    
    this.metaball = new THREE.ShaderMaterial( BlobShader );
    //this.metaball = new THREE.ShaderMaterial( MetaballShader );
    //this.metaball.uniforms.env.value = THREE.ImageUtils.loadTexture( 'textures/env0.jpg');

    //this.gauss = new GaussTexture(64,1,0.075125);//;0.067);
    this.gauss = new GaussTexture(32,1,0.067);

    //this.gauss = new GaussTexture(16,1,0.067);
    this.blobxy.uniforms.map.value = this.gauss;
    this.blobmin.uniforms.map.value = this.gauss;


    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    this.scene = new THREE.Scene();
    this.scene.add( new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.metaball ) );

}

BlobEffect.prototype = {
    render:function(){

        baseGroup.visible = false;
        extraGroup.visible = true;

        particlesCloud.material = this.blobxy;
        renderer.render( scene, camera, this.glowTargetxy, true );

        particlesCloud.material = this.blobmin;
        renderer.render( scene, camera, this.glowTargetmin, true );

        particlesCloud.material = this.blobbase;
        renderer.render( scene, camera, this.rootTarget, true );

        baseGroup.visible = true;
        extraGroup.visible = false;


        renderer.render( this.scene, this.camera );
        renderer.render( scene, camera );

    },
    initTarget:function(w,h){
        var w = vsize.w;
        var h = vsize.h;

        //this.glowParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat};//, stencilBufer: false };

        this.glowParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBufer: false };

        this.rootTarget = new THREE.WebGLRenderTarget(  w, h , this.glowParameters );
        this.glowTargetxy = new THREE.WebGLRenderTarget(  w, h, this.glowParameters );
        this.glowTargetmin = new THREE.WebGLRenderTarget(  w, h, this.glowParameters );

        this.metaball.uniforms.mapping.value = this.rootTarget;
        this.metaball.uniforms.mapXY.value = this.glowTargetxy;
        this.metaball.uniforms.mapMin.value = this.glowTargetmin;
        this.metaball.uniforms.vW.value = w;
        this.metaball.uniforms.vH.value = h;
    },
    resize:function(){
        if(!this.isActive && !this.first) return;
        this.first = false;
        this.dispose();
        this.initTarget();
    },
    dispose:function() {
        if ( this.glowTargetxy ) this.glowTargetxy.dispose();
        if ( this.glowTarget ) this.glowTarget.dispose();
        if ( this.rootTarget ) this.rootTarget.dispose();
    }
}

// GAUSS TEXTURE
function GaussTexture(e, t, n) {
    this.sets = { size: e || 64, height: t || 1, deviation: n || .067 };
    return this.createGaussTexture()
}

GaussTexture.prototype = {
    createGaussTexture: function () {
        var e = this.sets.size * this.sets.size * 3;
        var t = new Uint8Array(e);
        var n, r, i, u, o, c;
        var s = this.sets.size * 0.5;
        o = this.sets.size;
        while(o--){
            u = this.sets.size;
            while(u--){
                n = 2 * u / this.sets.size - 1;
                r = 2 * o / this.sets.size - 1;
                i = this.sets.height * Math.exp(-(n * n + r * r) / this.sets.deviation);
                i *= 255;
                c = 3 * (o * this.sets.size + u);
                t[c+0] = i;
                t[c+1] = i;
                t[c+2] = i;
            }
        }
        var l = new THREE.DataTexture(t, this.sets.size, this.sets.size, THREE.RGBFormat);
        //l.wrapS = l.wrapT = THREE.ClampToEdgeWrapping;
        l.needsUpdate = true;
        return l;
    }
}

var MetaballShader={
/*attributes:{
vx:{ type:'f', value: [] }, 
vy:{ type:'f', value: [] }
},*/
uniforms:{
mapColor :   { type:'t', value: null },
mapXY : { type:'t', value: null },
mapMin: { type:'t', value: null },
env:         { type:'t', value: null },
normalMap:   { type:'t', value: null },
mapping :    { type:'t', value: null },
useenv :   { type:'i', value: 0 },

vW : { type:'f', value: 0 },
vH : { type:'f', value: 0 },
//mappingCopy: { type:'t', value: null },
//seriousMap:  { type:'t', value: null },

//seriousType : { type:'i', value:0 },
//seriousSize : { type:'v2', value: new THREE.Vector2(1024,1024) },

useBlur :   { type:'i', value: 1 },

useLight :   { type:'i', value: 1 },
lightColor:  { type:'c', value: new THREE.Color(0x323436) },
lightOrbit:  { type:'v3', value: new THREE.Vector3(-45,45,60)},
lightAnim :  { type:'v2', value: new THREE.Vector2(0.0,0.0) },

rimPower:    { type:'f', value: 0.011 },
rimEdge:     { type:'f', value: 0.9 },
rimColor:    { type:'c', value: new THREE.Color(0x666666) },

useNormal:   { type:'i', value: 0 },
normalRepeat: { type:'f', value: 1.0 },
normalScale: { type:'v2', value: new THREE.Vector2(-1,-1) },

amplitude:   { type:'f', value: 0 },
opacity:     { type:'f', value: 1 },
reflection:  { type:'f', value: 1 },
//size:        { type:'v2', value: new THREE.Vector2(512,512) },
mapSize:     { type:'v2', value: new THREE.Vector2(1024,1024) },
mapType:     { type:'i', value: 3 },

reflectionFactor: { type:'f', value: 0.6 },
refractionRatio: { type:'f', value: 0.98 }
},
fragmentShader: [
'uniform sampler2D env;',
'uniform sampler2D normalMap;',
'uniform sampler2D mapMin;',
'uniform sampler2D mapXY;',
'uniform sampler2D mapColor;',
'uniform sampler2D mapping;',

'uniform float vW;',
'uniform float vH;',
//'uniform sampler2D mappingCopy;',
//'uniform sampler2D seriousMap;',

//'uniform int seriousType;',
//'uniform vec2 seriousSize;',

'uniform int mapType;',
'uniform int useBlur;',
'uniform int useenv;',

'uniform float reflectionFactor;',
'uniform float refractionRatio;',

'uniform int useLight;',
'uniform vec3 lightColor;',
'uniform vec3 lightOrbit;',
'uniform vec2 lightAnim;',

'uniform float rimPower;',
'uniform float rimEdge;',
'uniform vec3 rimColor;',

'uniform int useNormal;',
'uniform float normalRepeat;',
'uniform vec2 normalScale;',

//'uniform vec2 size;',
'uniform vec2 mapSize;',
'uniform float reflection;',
'uniform float opacity;',
'uniform float amplitude;',

'varying vec2 vUv;',

'const float Pi = 3.1415926;',

'float sm(float e1, float e2, float x){',
'    float r = clamp((x - e1)/(e2 - e1), 0.0, 1.0);',
'    return r*r*(3.0 - 2.0*r);',
'}',

'vec4 blurred(sampler2D map, vec2 UV, vec2 blur){',
'    vec4 sum = vec4(0.0);',
'    sum += texture2D(map, vec2(UV.x - 4.0 * blur.x, UV.y - 4.0 * blur.y)) * 0.05;',
'    sum += texture2D(map, vec2(UV.x - 3.0 * blur.x, UV.y - 3.0 * blur.y)) * 0.09;',
'    sum += texture2D(map, vec2(UV.x - 2.0 * blur.x, UV.y - 2.0 * blur.y)) * 0.12;',
'    sum += texture2D(map, vec2(UV.x - blur.x, UV.y - blur.y)) * 0.15;',
'    sum += texture2D(map, vec2(UV.x, UV.y)) * 0.16;',
'    sum += texture2D(map, vec2(UV.x + blur.x, UV.y + blur.y)) * 0.15;',
'    sum += texture2D(map, vec2(UV.x + 2.0 * blur.x, UV.y + 2.0 * blur.y)) * 0.12;',
'    sum += texture2D(map, vec2(UV.x + 3.0 * blur.x, UV.y + 3.0 * blur.y)) * 0.09;',
'    sum += texture2D(map, vec2(UV.x + 4.0 * blur.x, UV.y + 4.0 * blur.y)) * 0.05;',
'    return sum;',
'}',

'void main() {',
'    vec2 size = vec2(vW, vH);',
'    vec2 b;',
'    vec4 texel;',
'    vec4 texelMin;',
'    if(useBlur == 1){',
'        b = vec2(1.0/size.x, 1.0/size.y);',
'        texel = blurred(mapXY, vUv, b);',
'        texelMin = blurred(mapMin, vUv, b);',
'    } else {',
'        texel = texture2D(mapXY, vUv);',
'        texelMin = texture2D(mapMin, vUv);',
'    }',
'    float aspR = size.x/size.y;',
'    vec2 uvMap = (vUv);',
'    vec4 map;',
'    if(mapType!=3){',
'        vec2 resolution = vec2(1.0, 1.0)/size;',
'        vec2 mapResolution = mapSize*resolution;',
'        vec2 mid = ((size*0.5)/(mapSize*0.5));',
'        vec2 center = (vec2(0.5)*mid)-vec2(0.5);',
'        uvMap = ((gl_FragCoord.xy * resolution)/mapResolution)-center;',
'    } else {',
//'        uvMap = vec2(1.0 - vUv.x,vUv.y);',
//'        vec4 map = texture2D( mapping, vUv );',
'        vec4 map = blurred(mapping, vUv, b);',
'    }',

'    vec3 finNorm;',
'    finNorm.xy = texel.xy - texelMin.xy;',
'    finNorm.xy /= texel.z;',
'    finNorm.z = texelMin.w;',
'    finNorm.z -= 0.0731107;',
'    float a = float(finNorm.z>0.2040110252);',
'    finNorm *= a;',

'    finNorm = normalize(finNorm);',
'    float delta = 0.1;',
'    float dist = distance(texel.xy, vec2(-0.2110252 + texelMin.w, 0.2110252 - texelMin.w));',
'    float aa = sm(0.2110252-delta, 0.2110252, dist);',
'    a = 0.0;',
'    if(finNorm.z>0.2) a = aa;',

'    vec3 viewDirScreen = normalize( vec3( (vUv.x*2.0-1.0), (vUv.y*2.0-1.0)/aspR, -3.4) );',
'    vec3 viewDirScreen2 = (vec3(uvMap.x, uvMap.y, -1.0));',

'    vec3 reflectVec = reflect( viewDirScreen, finNorm );',
'    vec3 refractVec = refract( viewDirScreen2, finNorm , refractionRatio );',

'    float flipNormal = 1.0;',
'    vec3 k = vec3(0.0,0.0,1.0);',
'    vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + k);',
'    vec3 refractView = flipNormal * normalize((viewMatrix * vec4( refractVec, 0.0 )).xyz + k);',

'    vec2 project = vec2(reflectView.x, -reflectView.y) * 0.5 + 0.5;',
'    vec4 reflectMap = texture2D( env, project );',
'    vec4 refractMap = texture2D( mapping, refractVec.xy );',

'    if( useNormal == 1 ) {',
'        vec3 normalTex = texture2D( normalMap, uvMap * normalRepeat ).xyz * 2.0 - 1.0;',
'        normalTex.xy *= normalScale;',
'        normalTex.y *= -1.;',
'        vec3 r = reflect( reflectVec.xyz, normalize( normalTex ) );',
'        float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z + 1.0 ) );',
'        vec2 calculatedNormal = vec2( r.x / m + 0.5, - r.y / m + 0.5 );',
'        reflectMap = texture2D( env, calculatedNormal );',
'    }',

'    vec4 baseScene = texture2D( mapping, vUv );',
'    vec4 refractColor = vec4(refractMap.xyz*a, 1.0*a);',
'    vec4 reflectColor = vec4(reflectMap.xyz*a, 1.0*a);',

'    if(mapType == 3){',
'        gl_FragColor = vec4(map.xyz*(1.0-a), map.a*(1.0-a));',
'        gl_FragColor += mix( refractColor, reflectColor, clamp( reflectionFactor, 0.0, 1.0 ) );',
'    }else{',
'        gl_FragColor = baseScene;',
'        gl_FragColor += mix( refractColor, reflectColor, clamp( reflectionFactor, 0.0, 1.0 ) );',
'    }',

'    if( useLight == 1 ) {',
'        float anim = amplitude * 1.0;',
'        vec3 lightPos = vec3(0.0);',

'        float phi = lightOrbit.x * Pi / 180.0;',
'        float theta = lightOrbit.y * Pi / 180.0;',

'        if(lightAnim.x==1.0)phi += anim;',
'        if(lightAnim.y==1.0)theta += anim;',

'        lightPos.x = (lightOrbit.z * sin(theta) * cos(phi));',
'        lightPos.z = (lightOrbit.z * cos(theta) * cos(phi));',
'        lightPos.y = (lightOrbit.z * sin(phi));',

'        lightPos = normalize(lightPos);',

'        float NdotL = clamp( dot(finNorm, lightPos ), 0.0, 1.0);',

'        vec3 h = normalize(vec3(viewDirScreen.xy, -viewDirScreen.z)+lightPos);',
'        float NdotH = clamp( dot(finNorm,h), 0.0, 1.0);',
'        NdotH = pow(NdotH,11.0);',

'        vec3 light = lightColor * NdotL*.5 + NdotH*.5;',
'        gl_FragColor.xyz += light*a;',
'    }',

'    if( rimPower > 0.0 ) {',
'        float f = rimEdge * abs( dot( finNorm, -viewDirScreen ) );',
'        f = rimPower * ( 1. - sm( 0.0, 1., f ) );',
'        gl_FragColor.xyz += rimColor*f*a;',
'    }',

'    gl_FragColor.a = texel.a;',
//'    if(seriousType == 1){',
//'      vec2 sresolution = vec2(1.0, 1.0)/size;',
//'      vec2 smapResolution =  seriousSize*sresolution;',
//'      vec2 smid = ((size*0.5)/( seriousSize*0.5));',
//'      vec2 scenter = (vec2(0.5)*smid)-vec2(0.5);',

//'      vec2 suv = ((gl_FragCoord.xy * sresolution)/smapResolution)-scenter;',
//'      vec4 topmap = texture2D( seriousMap, suv );',
//'      vec4 old = gl_FragColor;',
//'      gl_FragColor = mix( old, topmap, topmap.a );', 
//'    }',
//'     gl_FragColor = texture2D( mapping, vUv );',
'}'
].join('\n'),
vertexShader: [
'varying vec2 vUv;',
'void main() {',
'    vUv = uv;',
'    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);',
'}'
].join('\n'),
transparent:true, depthTest:false, depthWrite:false
}

