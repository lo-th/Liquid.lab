function TestAntiPointy() {
  var bd = new b2BodyDef();
  var ground = world.CreateBody(bd);

  var step = 1.0;
  for (var i = -10; i < 10; i += step) {
    var shape = new b2PolygonShape();
    shape.vertices[0] = new b2Vec2(i, -10);
    shape.vertices[1] = new b2Vec2(i + step, -10),
    shape.vertices[2] = new b2Vec2(0, 15);

    ground.CreateFixtureFromShape(shape, 0);
  }
  for (var i = -10; i < 35; i += step) {
    var shape = new b2PolygonShape();
    shape.vertices[0] = new b2Vec2(-10, i);
    shape.vertices[1] = new b2Vec2(-10, i + step),
    shape.vertices[2] = new b2Vec2(0, 15);

    ground.CreateFixtureFromShape(shape, 0);

    shape = new b2PolygonShape();
    shape.vertices[0] = new b2Vec2(10, i);
    shape.vertices[1] = new b2Vec2(10, i + step),
    shape.vertices[2] = new b2Vec2(0, 15);

    ground.CreateFixtureFromShape(shape, 0);
  }

  //this.maxParticlesToCreate = 300;
  var psd = new b2ParticleSystemDef();
  //psd.color.Set(80, 140, 200, 130);
  psd.radius = 0.09;
  var particleSystem = world.CreateParticleSystem(psd);




  var shape = new b2CircleShape;
  shape.position.Set(0, 40);
  shape.radius = 2;
  

  var pd = new b2ParticleGroupDef();
  //pd.position.Set(Math.rand(-10, 10), 40);
  //pd.velocity.Set(0, -1);
  pd.color.Set(80, 140, 200, 130);
  pd.shape = shape;
  particleSystem.CreateParticleGroup(pd);

}

/*TestAntiPointy.prototype.Step = function() {
  Step();
  if (this.maxParticlesToCreate <= 0) {
    return;
  }
  --this.maxParticlesToCreate;

  var pd = new b2ParticleDef();
  pd.position.Set(Math.rand(-10, 10), 40);
  pd.velocity.Set(0, -1);
  pd.color.Set(80, 140, 200, 130);
  this.particleSystem.CreateParticle(pd);

}*/