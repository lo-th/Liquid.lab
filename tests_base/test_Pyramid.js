function TestPyramid() {
  camera.position.y = 20;
  camera.position.z = 30;
this.ground = world.add({ 
        shape: 'edge',
        p1: new b2Vec2(-40, 0), p2: new b2Vec2(40, 0),
        density: 0, friction: 1, restitution:1.2,
       // groupIndex : -2,
        type: 'static'
    });
  //var bodyDef = new b2BodyDef();
  //var ground = world.CreateBody(bodyDef);

  //var shape = new b2EdgeShape;
  //shape.Set(new b2Vec2(-40, 0), new b2Vec2(40, 0));
 // ground.CreateFixtureFromShape(shape, 0);
 // ground.CreateFixture_Shape_Density(shape, 0);
 var body = [];

  var x = new b2Vec2(-7, 0.75);
  var y = new b2Vec2();
  var dx = new b2Vec2(0.5625, 1.25);
  var dy = new b2Vec2(1.125, 0);

  for (var i = 0; i < 50; i++) {
    y = new b2Vec2(x.x, x.y);
    for (var j = i; j < 50; j++) {
      body.push( world.add({shape:'circle', radius:0.5, x:y.x, y:y.y, density:1, type: 'dynamic' }) );

     // var bodyDef = new b2BodyDef();
     // bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
    //  bodyDef.position = y;
    //  var box = new b2CircleShape;
    //  box.radius = 0.5;
      //var box = new b2PolygonShape();
      //box.SetAsBoxXY(0.5, 0.5);
     // bodyDef.shape = box;

     // var body = world.CreateBody(bodyDef);
     // body.CreateFixtureFromShape(box, 5);
     // body.CreateFixture_Shape_Density(box, 5);
      y.x +=dy.x;
      y.y +=dy.y;
      //b2Vec2.Add(y, y, dy);
    }
    //b2Vec2.Add(x, x, dx);
     x.x +=dx.x;
    x.y +=dx.y;
  }

  console.log(body.length)
}