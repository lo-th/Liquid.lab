function TestConfined() {
  var rowCount = 10;
  var columnCount = 10;

  // create box
  var bd = new b2BodyDef;
  var ground = world.CreateBody(bd);

  // Floor
  var shape = new b2EdgeShape;
  shape.Set(new b2Vec2(-10.0, 0.0), new b2Vec2(10.0, 0.0));
  ground.CreateFixtureFromShape(shape, 0.0);

  // Left wall
  shape = new b2EdgeShape;
  shape.Set(new b2Vec2(-10.0, 0.0), new b2Vec2(-10.0, 20.0));
  ground.CreateFixtureFromShape(shape, 0.0);

  // Right wall
  shape = new b2EdgeShape;
  shape.Set(new b2Vec2(10.0, 0.0), new b2Vec2(10.0, 20.0));
  ground.CreateFixtureFromShape(shape, 0.0);

  // Roof
  shape = new b2EdgeShape;
  shape.Set(new b2Vec2(-10.0, 20.0), new b2Vec2(10.0, 20.0));
  ground.CreateFixtureFromShape(shape, 0.0);

  world.SetGravity(new b2Vec2(0.0, 0.0));
}

function CreateCircle(x, y) {

  world.add({shape:'circle', radius:Math.rand(0.5, 2), x:x, y:y, density:1, friction:0 });

}

TestConfined.prototype.MouseDown = function(p) {
    CreateCircle(p.x,p.y);
};