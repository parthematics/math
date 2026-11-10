'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { circle, curvature, magnitude } = require('../geometry.js');

function close(actual, expected, tolerance = 1e-11) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} should be close to ${expected}`);
}

test('circle curvature survives changes in angle, rate, and tangential acceleration', () => {
  for (const radius of [0.75, 1, 2, 2.5]) {
    for (const angle of [0, 0.3, Math.PI / 2, 4.7, 2 * Math.PI]) {
      for (const angularRate of [0.5, 1, 2]) {
        for (const angularAcceleration of [-3, 0, 4]) {
          const model = circle({ radius, angle, angularRate, angularAcceleration });
          close(model.curvature, 1 / radius);
          close(model.speed, radius * angularRate);
          close(magnitude(model.tangent), 1);
          close(model.tangent.x * model.position.x + model.tangent.y * model.position.y, 0);
        }
      }
    }
  }
});

test('curvature formula agrees with a parabola and a straight line', () => {
  for (const t of [-3, -1, 0, 1, 3]) {
    close(curvature({ x: 1, y: 2 * t }, { x: 0, y: 2 }), 2 / (1 + 4 * t * t) ** 1.5);
  }
  close(curvature({ x: 2, y: 3 }, { x: 4, y: 6 }), 0);
});

test('unsigned curvature is invariant under smooth forward and reverse changes of parameter', () => {
  // eta(u) = gamma(phi(u)): eta' = gamma' a, eta'' = gamma'' a² + gamma' b.
  const velocity = { x: 1, y: 1.4 };
  const acceleration = { x: 0, y: 2 };
  for (const a of [-2, -0.3, 0.5, 3]) {
    for (const b of [-4, 0, 5]) {
      const reparameterizedVelocity = { x: velocity.x * a, y: velocity.y * a };
      const reparameterizedAcceleration = {
        x: acceleration.x * a * a + velocity.x * b,
        y: acceleration.y * a * a + velocity.y * b,
      };
      close(curvature(reparameterizedVelocity, reparameterizedAcceleration), curvature(velocity, acceleration));
    }
  }
});

test('degenerate circles and nonregular curve points are rejected', () => {
  for (const radius of [0, -1, Infinity, NaN]) assert.throws(() => circle({ radius, angle: 0, angularRate: 1 }), RangeError);
  for (const angularRate of [0, -1, Infinity, NaN]) assert.throws(() => circle({ radius: 1, angle: 0, angularRate }), RangeError);
  assert.throws(() => curvature({ x: 0, y: 0 }, { x: 1, y: 1 }), RangeError);
});
