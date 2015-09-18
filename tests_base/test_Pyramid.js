function TestPyramid() {
  camera.position.y = 20;
  camera.position.z = 30;

  var bodyDef = new b2BodyDef();
  var ground = world.CreateBody(bodyDef);

  var shape = new b2EdgeShape;
  shape.Set(new b2Vec2(-40, 0), new b2Vec2(40, 0));
  ground.CreateFixtureFromShape(shape, 0);

  var x = new b2Vec2(-7, 0.75);
  var y = new b2Vec2();
  var dx = new b2Vec2(0.5625, 1.25);
  var dy = new b2Vec2(1.125, 0);

  for (var i = 0; i < 50; i++) {
    y = new b2Vec2(x.x, x.y);
    for (var j = i; j < 50; j++) {
      var bodyDef = new b2BodyDef();
      bodyDef.type = b2_dynamicBody;
      bodyDef.position = y;
      var box = new b2CircleShape;
      box.radius = 0.5;
      //var box = new b2PolygonShape();
      //box.SetAsBoxXY(0.5, 0.5);
      bodyDef.shape = box;

      var body = world.CreateBody(bodyDef);
      body.CreateFixtureFromShape(box, 5);
      b2Vec2.Add(y, y, dy);
    }
    b2Vec2.Add(x, x, dx);
  }
}