(function (root) {
  'use strict';

  function magnitude(vector) {
    return Math.hypot(vector.x, vector.y);
  }

  function curvature(velocity, acceleration) {
    const speed = magnitude(velocity);
    if (!(speed > 0) || !Number.isFinite(speed)) {
      throw new RangeError('Curvature requires a finite, nonzero velocity.');
    }
    return Math.abs(velocity.x * acceleration.y - velocity.y * acceleration.x) / speed ** 3;
  }

  function circle({ radius, angle, angularRate, angularAcceleration = 0 }) {
    if (![radius, angle, angularRate, angularAcceleration].every(Number.isFinite) || radius <= 0 || angularRate <= 0) {
      throw new RangeError('Use a positive radius, a positive clock rate, and finite inputs.');
    }
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const position = { x: radius * c, y: radius * s };
    const velocity = { x: -radius * angularRate * s, y: radius * angularRate * c };
    const acceleration = {
      x: -radius * angularRate ** 2 * c - radius * angularAcceleration * s,
      y: -radius * angularRate ** 2 * s + radius * angularAcceleration * c,
    };
    const speed = magnitude(velocity);
    return {
      position,
      velocity,
      acceleration,
      tangent: { x: velocity.x / speed, y: velocity.y / speed },
      speed,
      curvature: curvature(velocity, acceleration),
    };
  }

  const geometry = Object.freeze({ circle, curvature, magnitude });
  if (typeof module !== 'undefined' && module.exports) module.exports = geometry;
  else root.Geometry = geometry;
})(typeof globalThis !== 'undefined' ? globalThis : this);
