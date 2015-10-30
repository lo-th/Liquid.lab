var inv255 = .003921569;

function LiquidRender() {
    // init large buffer geometry
    this.maxVertices = 30000;//31000;
    var geometry = new THREE.BufferGeometry();
    //geometry.dynamic = true;
    geometry.addAttribute('position', new THREE.BufferAttribute( new Float32Array( this.maxVertices * 3 ), 3 ));
    geometry.addAttribute('color', new THREE.BufferAttribute( new Float32Array( this.maxVertices * 3 ), 3 ));
    this.positions = geometry.attributes.position.array;
    this.colors = geometry.attributes.color.array;
    this.currentVertex = 0;
    this.buffer = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ vertexColors: true }));


    this.circleVertices = [];
    this.circleResolution = 12;
    this.initCircleVertices(this.circleVertices, this.circleResolution);

    this.jointVertices = [];
    this.jointResolution = 4;
    this.initCircleVertices(this.jointVertices, this.jointResolution);


    this.particleVertices = [];
    this.particleResolution = 3;
    this.initCircleVertices(this.particleVertices, this.particleResolution);

    baseGroup.add(this.buffer);

    this.extra = new ExtraParticle();
}

LiquidRender.prototype = {
    constructor: LiquidRender,
    collapseBuffer : function() {
        var i = this.maxVertices;
        var min = this.currentVertex;
        var n = 0;
        while(i>=min){
            n = i * 3;
            this.positions[n] = 0;
            this.positions[n+1] = 0;
            this.positions[n+2] = 0;
            this.colors[n] = 0;
            this.colors[n+1] = 0;
            this.colors[n+2] = 0;
            i--;
        }
    },
    /*collapseBuffer : function() {
        var i = this.currentVertex * 3;
        for (; i < this.maxVertices * 3; i++) {
            this.positions[i] = 0;
            this.colors[i] = 0;
        }
    },*/
    draw : function() {
        var i, j, b;
        // draw rigidbody
        //var bodyCount = world.GetBodyCount();
        //var jointCount = world.GetJointCount();
        //while(world.m_bodyList.m_next!==null){
        i = world.bodies.length;
        while(i--){
            b = world.bodies[i];
            b.m_fixtureList.m_shape.draw(b.m_xf);
        }
        //for (var b = world.m_bodyList; b; b = b.m_next){
            //var transform = b.GetTransform();//m_out_xf;
           // console.log(transform.p)
            //console.log(b)
            //var b = world.m_bodyList.m_next
          //  b.m_fixtureList.m_shape.draw(b.m_xf);
            //for (var f = b.m_fixtureList; f; f = b.m_fixtureList.m_next){
               // console.log(f)
             //   f.m_shape.draw(b.m_xf);
            //}

            //if(b.m_fixtureList) b.m_fixtureList.m_shape.draw(transform);
            //j = b.fixtures.length;

            //while(j--) b.fixtures[j].shape.draw(transform)
        //}
       // console.log(world.m_island.m_bodyCount)

        //i = world.m_island.m_bodies.length;
       /* for (i = 0; i < world.m_island.m_bodyCount; ++i){
            var body = world.m_island.m_bodies[i];
            var transform = body.GetTransform();
            //j = body.fixtures.length;
            //while(j--) body.fixtures[j].shape.draw(transform);
            for (var f = body.m_fixtureList; f; f = body.m_fixtureList.m_next){
               // console.log(f)
                f.m_shape.draw(transform);
            }
        }*/

        

        // draw joints
       /* i = world.joints.length;
        while(i--) this.drawJoint(world.joints[i]);
*/
        this.collapseBuffer();
        this.buffer.geometry.attributes.position.needsUpdate = true;
        this.buffer.geometry.attributes.color.needsUpdate = true;


        // draw particle systems
      /*  i = world.particleSystems.length;
        while(i--) this.extra.draw(world.particleSystems[i]);
        //while(i--) drawParticleSystem(world.particleSystems[i]);

        this.extra.update();*/
    },
    /*draw : function() {
        for (var i = 0, max = world.bodies.length; i < max; i++) {
            var body = world.bodies[i];
            var maxFixtures = body.fixtures.length;
            var transform = body.GetTransform();
            for (var j = 0; j < maxFixtures; j++) {
                var fixture = body.fixtures[j];
                fixture.shape.draw(transform);
            }
        }
        // draw particle systems

        for (var i = 0, max = world.particleSystems.length; i < max; i++) {
            drawParticleSystem(world.particleSystems[i]);
        }
        this.collapseBuffer();
        this.buffer.geometry.attributes.position.needsUpdate = true;
        this.buffer.geometry.attributes.color.needsUpdate = true;
    },*/
    insertLine : function(x1, y1, x2, y2, r, g, b) {
        var i = this.currentVertex;
        var n = i * 3;
        this.positions[n] = x1;
        this.positions[n + 1] = y1;
        this.positions[n + 2] = 0;
        this.colors[n] = r;
        this.colors[n + 1] = g;
        this.colors[n + 2] = b;

        i++;
        n = i * 3;
        this.positions[n] = x2;
        this.positions[n + 1] = y2;
        this.positions[n + 2] = 0;
        this.colors[n] = r;
        this.colors[n + 1] = g;
        this.colors[n + 2] = b;
        this.currentVertex += 2;
    },
    insertCircleVertices : function(transform, radius, x, y, r, g, b, noaxe, isJoint) {
        // TODO remove one of the muls
        noaxe = noaxe || false;
        var v0 = new b2Vec2( x, y);
        var vertices = this.circleVertices;
        var res = this.circleResolution;
        if(isJoint){
            vertices = this.jointVertices;
            res = this.jointResolution;
        }
        for (var i = 0; i < res; i++) {
            var i4 = i * 4;
            var v1 = new b2Vec2(vertices[i4] * radius + x, vertices[i4 + 1] * radius + y);
            var v2 = new b2Vec2(vertices[i4 + 2] * radius + x, vertices[i4 + 3] * radius + y);

            if(transform){
                b2Vec2.Mul(v1, transform, v1);
                b2Vec2.Mul(v2, transform, v2);
            }
            

            this.insertLine(v1.x, v1.y, v2.x, v2.y, r, g, b);
        }
        if(noaxe) return;
        if(transform) b2Vec2.Mul(v0, transform, v0);
        this.insertLine(v0.x, v0.y, v2.x, v2.y, r, g, b);
    },
    insertParticleVertices : function(radius, x, y, r, g, b) {
        var vertices = this.particleVertices;
        for (var i = 0; i < this.particleResolution; i++) {
            var i4 = i * 4;
            var x1 = vertices[i4] * radius + x;
            var y1 = vertices[i4 + 1] * radius + y;
            var x2 = vertices[i4 + 2] * radius + x;
            var y2 = vertices[i4 + 3] * radius + y;

            this.insertLine(x1, y1, x2, y2, r, g, b);
        }
    },
    initCircleVertices : function(v, resolution) {
        var size = 360 / resolution;
        for (var i = 0; i < resolution; i++) {
            var s1 = (i * size) * Math.PI / 180;
            var s2 = ((i + 1) * size) * Math.PI / 180;
            v.push(Math.cos(s1));
            v.push(Math.sin(s1));
            v.push(Math.cos(s2));
            v.push(Math.sin(s2));
        }
    },
    transformAndInsert : function(v1, v2, transform, r, g, b) {
        var transformedV1 = new b2Vec2(), transformedV2 = new b2Vec2();

        //box2d.b2Mul(transform, v1, transformedV1);
        //box2d.b2Mul(transform, v2, transformedV2);

       b2Vec2.Mul(transformedV1, transform, v1);
        b2Vec2.Mul(transformedV2, transform, v2);

       // box2d.b2Mul(transform, v1, transformedV1);
       // box2d.b2Mul(transform, v2, transformedV2);
        this.insertLine(transformedV1.x, transformedV1.y, transformedV2.x, transformedV2.y, r, g, b);
    },
    transformVerticesAndInsert : function(vertices, transform, r, g, b) {
        var vertexCount = vertices.length;
        for (var i = 1; i < vertexCount; i++) {
            this.transformAndInsert(vertices[i - 1], vertices[i], transform, r, g, b);
        }
    },
    drawJoint : function (joint) {

        var type = joint.type || 'none';

        if(type === 'none') return;

       /*
        var pa = jd.bodyA.GetPosition();
        var pb = jd.bodyB.GetPosition();
        var la = jd.localAnchorA;
        var lb = jd.localAnchorB;
    */
        //var p1 = new b2Vec2(pa.x+la.x,pa.y+la.y);
        //var p2 = new b2Vec2(pb.x+lb.x,pb.y+lb.y);

        var p1 = new b2Vec2(0,0);
        var p2 = new b2Vec2(0,0);

        switch(type){
            case 'mouse':
            var trans = joint.bodyB.GetTransform();
            b2Vec2.Mul(p1, trans, joint.decal);
            this.insertCircleVertices(trans, 0.2, joint.decal.x, joint.decal.y, 0,1,0, true, true);
            p2 = joint.target;
            this.insertCircleVertices(null, 0.2, p2.x, p2.y, 0,1,0, true, true);
            break;
            case 'wheel':
            if(joint.def!==null){
                var a = joint.def.bodyA;
                var b = joint.def.bodyB;
                p1 = a.GetPosition();
                this.insertCircleVertices(a.GetTransform(), 0.2, 0, 0, 0,1,0, true, true);
                p2 = b.GetPosition();
                this.insertCircleVertices(b.GetTransform(), 0.4, 0, 0, 0,1,0, true, true);
            }
            break;
            case 'prismatic':
            if(joint.def!==null){
                
                var a = joint.def.bodyA;
                var b = joint.def.bodyB;
                var t  = joint.GetJointTranslation();
                //var trans = a.GetTransform();

                var aa = joint.angle;
                //b2Vec2.Normalize(aa, aa);

                //var angle = Math.angleBetween( joint.angle, joint.axis);
                //var angle = Math.angleBetween( aa, new b2Vec2(0, 0));
                var angle = Math.atan2(- aa.y, - aa.x);
                //var angle = Math.atan2( aa.y,  aa.x);
                angle+=a.GetAngle();

                var a1x = Math.cos(angle+Math.PI90) * 0.1;
                var a1y = Math.sin(angle+Math.PI90) * 0.1;

                var a2x = Math.cos(angle-Math.PI90) * 0.1;
                var a2y = Math.sin(angle-Math.PI90) * 0.1;

                //p1 = b.GetPosition()
                p1 = b.GetWorldCenter();
                //b2Vec2.Mul(p1, trans, joint.axis);
                //b2Vec2.Mul(p1, trans, p1);//joint.axis);

                this.insertLine( p1.x+a1x, p1.y+a1y, p1.x+a2x, p1.y+a2y, 0,1,0 );

                p2.x = (Math.cos(angle) * t) + p1.x;
                p2.y = (Math.sin(angle) * t) + p1.y;

                this.insertLine(p2.x+a1x, p2.y+a1y, p2.x+a2x, p2.y+a2y, 0,1,0);
            }
            break;

        }

       

        //if(!system) return;

     //  if(system.bodyA.GetPosition()!==undefined && system.bodyB.GetPosition()!==undefined){
       // var p1 = new b2Vec2(0,0);
       // var p2 = new b2Vec2(0,0);

        //if(typeof system.bodyA === b2Body ) p1 = system.GetBodyA().GetPosition();
        //if(typeof system.bodyB === b2Body ) p2 = system.GetBodyB().GetPosition();

        //var o1 = system.GetAnchorA();
        //var o2 = system.GetAnchorB();
        // var p2 = system.bodyB.GetPosition();

        this.insertLine(p1.x, p1.y, p2.x, p2.y, 0,1,0);

    }

}

b2CircleShape.prototype.draw = function(transform) {
    var circlePosition = this.m_p, center = new b2Vec2(circlePosition.x, circlePosition.y);
    // b2Vec2.Mul(center, transform, center);
    liquidRender.insertCircleVertices(transform, this.m_radius, center.x, center.y, 0, 1, 1);
};

b2ChainShape.prototype.draw = function(transform) {
    liquidRender.transformVerticesAndInsert(this.m_vertices, transform, 1, 0, 0);
};


b2EdgeShape.prototype.draw = function(transform) {
    liquidRender.transformAndInsert(this.m_vertex1, this.m_vertex2, transform, 0.5, 0.5, 0.5);
};

b2PolygonShape.prototype.draw = function(transform) {
    var zPosition = liquidRender.currentVertex * 3;

    liquidRender.transformVerticesAndInsert(this.m_vertices, transform, 1, 0.5, 0);

    // create a loop
    var positions = liquidRender.positions;
    var last = (liquidRender.currentVertex - 1) * 3;
    liquidRender.insertLine(positions[last], positions[last + 1], positions[zPosition], positions[zPosition + 1], 1, 0.5, 0);
};



/*function drawParticleSystem(system) {
    var particles = system.GetPositionBuffer();
    var color = system.GetColorBuffer();

    var maxParticles = particles.length, transform = new b2Transform();
    transform.SetIdentity();

    for (var i = 0, c = 0; i < maxParticles; i += 2, c += 4) {
        liquidRender.insertParticleVertices(system.radius, particles[i],
        particles[i + 1], (color[c] || 235) * inv255, (color[c + 1]|| 235) * inv255, (color[c + 2]|| 235) * inv255, 3);
    }
}*/

function ExtraParticle(){
    this.count = 0;
    var geometry = new THREE.BufferGeometry();
    this.max = 30000;
    var n = this.max;

    this.positions = new Float32Array( n * 3 );
    this.uvpos = new Float32Array( n * 2 );
    this.colors = new Float32Array( n * 4 );
    this.angles = new Float32Array( n );
    this.sizes = new Float32Array( n );

    //var v = this.max;

    //while(v--){ this.sizes[v] = 0.1; }

    geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
    geometry.addAttribute( 'colors', new THREE.BufferAttribute( this.colors, 4 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );

    this.geometry = geometry;

    var particleMaterial = new THREE.ShaderMaterial( CloudBasic );
    //var particleMaterial = new THREE.ShaderMaterial( CloudGausMIN );
    //var gauss = new GaussTexture(64,1,0.067);
    //var gauss = new GaussTexture(16,1,0.067);
    //particleMaterial.uniforms.map.value = THREE.ImageUtils.loadTexture( 'textures/point.png');
    //particleMaterial.uniforms.usemap.value = true;

    particlesCloud = new THREE.Points( this.geometry, particleMaterial );
    //particlesCloud.position.set(0,0,0.01);
    particlesCloud.frustumCulled = false;
    particlesCloud.sortParticles = false;
    extraGroup.add( particlesCloud );
}

ExtraParticle.prototype = {
    constructor: ExtraParticle,
    draw:function(system){
        var particles = system.GetPositionBuffer();
        var color = system.GetColorBuffer();
        var size = system.radius;
        var pp, pc, np, nc, ns;
        var m = this.count;
        var i = particles.length*0.5;

        this.count+=i;

        while(i--){

            pp = i*2;
            pc = i*4;
            np = m+(i*3);
            nc = m+(i*4);
            ns = m+i;

            this.positions[np] = particles[pp].toFixed(3);
            this.positions[np + 1] = particles[pp+1].toFixed(3);

            this.sizes[ns] = size*6;

            this.colors[nc] = color[pc];
            this.colors[nc + 1] = color[pc + 1];
            this.colors[nc + 2] = color[pc + 2];
            this.colors[nc + 3] = color[pc + 3];
        }
    },
    collapseBuffer : function() {
        var i = this.max;
        var min = this.count;
        var n = 0, n2 = 0;
        while(i>=min){
            n = i * 3;
            n2 = i * 4;
            this.sizes[i] = 0;
            this.positions[n] = 0;
            this.positions[n+1] = 0;
            this.positions[n+2] = 0;
            this.colors[n2] = 0;
            this.colors[n2+1] = 0;
            this.colors[n2+2] = 0;
            this.colors[n2+3] = 0;
            i--;
        }
    },
    update:function(){
        if(this.count==0){
            if(blobEffect.isActive){
                this.collapseBuffer();
                this.geometry.attributes.position.needsUpdate = true;
                this.geometry.attributes.colors.needsUpdate = true;
                this.geometry.attributes.size.needsUpdate = true;
                extraGroup.visible = false;
                blobEffect.isActive = false;
            }
         return;
        }
        if(!blobEffect.isActive){ 
            //extraGroup.visible = true;
            blobEffect.isActive = true;
        }
        //console.log('up')
        this.collapseBuffer();
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.colors.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        this.count = 0;
    }
}

/*
var tileUV = [
    'vec2 tileUV(vec2 uv, vec2 pos, float ntile){',
    '    pos.y = ntiles-pos.y-1.0;',
    '    vec2 sc = vec2(1.0/ntile, 1.0/ntile);',
    '    return vec2(uv*sc)+(pos*sc);',
    '}',
].join("\n");

// tile rotation 
// angle in radian

var rotUV = [
    'vec2 rotUV(vec2 uv, float angle){',
    '    float s = sin(angle);',
    '    float c = cos(angle);',
    '    mat2 r = mat2( c, -s, s, c);',
    '    r *= 0.5; r += 0.5; r = r * 2.0 - 1.0;',
    '    uv -= 0.5; uv = uv * r; uv += 0.5;',
    '    return uv;',
    '}',
].join("\n");
*/