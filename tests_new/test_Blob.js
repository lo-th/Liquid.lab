function Test_Blob(){
    this.ground = world.add({ 
        shape: 'edge',
        p1: new b2Vec2(-100, 0), p2: new b2Vec2(100, 0),
        density: 1, friction: 1, restitution:1.2,
        groupIndex : -2,
        type: 'static'
    });


    var ajd = new b2AreaJointDef();
    ajd.world = world;

    var cx = 0.0;
    var cy = 10.0;
    var rx = 5.0;
    var ry = 5.0;
    var nBodies = 20;
    for (var i = 0; i < nBodies; ++i){

        var angle = (i * 2.0 * Math.PI) / nBodies;
        var x = cx + rx * Math.cos(angle);
        var y = cy + ry * Math.sin(angle);
        var body = world.add({shape:'circle', radius:0.5, x:x, y:y, angle:angle, density:1, fixedRotation:true, type: 'dynamic', allowSleep:false });

        ajd.AddBody(body);
    }
    ajd.frquencyHz = 10.0;
    ajd.dampingRatio = 1.0;
    world.CreateJoint(ajd);
    
}

Test_Blob.prototype.Step = function() {
  Step();
}