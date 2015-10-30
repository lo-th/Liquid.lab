function Test_Blob(){
    this.ground = world.add({  shape: 'edge', p1: new b2Vec2(-100, -1), p2: new b2Vec2(100, -1), density: 1, friction: 1, restitution:1.2, type: 'static' });


    this.b0 = world.add({shape:'circle', radius:1, density:1, y:4, type:'dynamic', allowSleep:false})
    
}

Test_Blob.prototype.Step = function() {
  world.Step(1/60, 8, 3);
  //console.log(this.b0.GetPosition().y)
}