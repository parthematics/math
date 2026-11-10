# Lesson 1 · Same circle, different clock

**Time:** 35–50 minutes. **Big idea:** a geometric path and a rule for moving along it are different objects.

**You need:** vectors, the length of a vector, and derivatives of sine and cosine. The initial experiment needs none of the formulas below.

## 1. Predict before calculating

Imagine a tiny car going around a circular track of radius 2. You double its speed without changing the track.

**What happens to the car's speed? What happens to the track's bending? Explain your guess.**

If working with a tutor, stop here and discuss your answer first.

## 2. Try the experiment

Open [the lab](../index.html). The two panels show the same point on the same circle: one draws velocity and the other draws a unit tangent. They show different vectors, not two different tracks.

1. Keep the radius fixed and change the **clock rate**. Watch the velocity arrow, unit tangent, and curvature readout.
2. Stop the motion. Change the point angle: where do the arrows point relative to the circle?
3. Keep the clock rate fixed and increase the radius. Predict which circle has greater curvature before reading the value.
4. Try the two prediction cards, then explain the observations in your own words.

The two panels use the same vector scale, so arrow-length changes are meaningful. The clock-rate slider is always positive; stopped playback freezes the visualization rather than defining a zero-velocity parameterization.

## 3. Give the objects names

The **image** of a curve is the set of points it visits. A **parameterization** tells you which point corresponds to each parameter value. It includes information that is not part of the image alone.

For $R>0$ and a constant clock rate $\omega>0$, write

$$
\gamma(t)=(R\cos(\omega t),R\sin(\omega t)).
$$

Over a complete turn, this visits the circle of radius $R$. At angle $\theta=\omega t$, its velocity is

$$
v=\gamma'(t)=R\omega(-\sin\theta,\cos\theta),\qquad
\|v\|=R\omega.
$$

The **unit tangent** keeps the direction and removes the speed:

$$
T=\frac{v}{\|v\|}=(-\sin\theta,\cos\theta).
$$

**Pause:** why does this vector have length 1? What assumption lets us divide by the speed?

<details>
<summary>Check the reasoning</summary>

Its squared length is $\sin^2\theta+\cos^2\theta=1$. We require a **regular curve**, meaning its velocity is nonzero at every parameter value under consideration. Our assumptions $R>0$ and $\omega>0$ guarantee that here.

</details>

## 4. Turning per distance, not turning per second

The unit tangent changes faster in time if the car goes faster. So $\|dT/dt\|$ still depends on the clock.

Instead, let $s$ measure distance traveled along the curve. Since $ds/dt=\|\gamma'(t)\|$, define curvature by

$$
\kappa=\left\|\frac{dT}{ds}\right\|
=\frac{\|dT/dt\|}{ds/dt}.
$$

Curvature measures **how fast the tangent direction changes per unit distance traveled**. Its units are inverse length.

**Your turn:** differentiate $T=(-\sin(\omega t),\cos(\omega t))$. Find the length of its derivative, then divide by $R\omega$. What cancels?

<details>
<summary>Derivation — open after trying</summary>

$$
\frac{dT}{dt}=\omega(-\cos\theta,-\sin\theta),\quad
\left\|\frac{dT}{dt}\right\|=\omega,\quad
\kappa=\frac{\omega}{R\omega}=\frac1R.
$$

The clock rate cancels. Doubling $\omega$ doubles the speed and the turning rate per second, so their ratio stays the same. Doubling $R$ halves curvature. At a fixed $\omega$, it also doubles speed, since a bigger circumference is covered in the same period.

This lesson derives the result for a constant positive rate. Later we prove invariance under any sufficiently smooth regular reparameterization. Reversing direction reverses the oriented unit tangent; unsigned curvature at the point is unchanged.

</details>

## 5. A short proof and a transfer question

**Proof:** show that velocity is perpendicular to the radius vector for this circle. Do not rely only on the picture.

**Transfer:** a particle follows $\eta(t)=(\cos(2t),\sin(2t))$. Another follows $\gamma(t)=(\cos t,\sin t)$. At the same geometric point, which of the following can differ: position, speed, oriented unit tangent, curvature? Both move counterclockwise.

<details>
<summary>Check after explaining</summary>

The dot product is

$$
(R\cos\theta,R\sin\theta)\cdot
R\omega(-\sin\theta,\cos\theta)=0.
$$

For the transfer question, corresponding points have the same position, oriented unit tangent, and curvature 1. Speeds differ: 2 versus 1. Compare corresponding points, not necessarily equal parameter values, which may indicate different positions.

</details>

## 6. Exit question

Close the formulas. Explain to an engineer why curvature should use distance rather than time, then say what happens to speed and curvature when you double both the radius and the clock rate.

<details>
<summary>Self-check</summary>

The track's bending should not depend on how quickly someone traverses it. Speed $R\omega$ becomes four times as large, while curvature $1/R$ is halved. If you can calculate that but cannot yet explain it, revisit the experiment and the ratio defining curvature.

</details>

**Next:** answer a few [placement questions](00-placement.md), or ask the tutor to help derive curvature for a parabola if the prerequisite work is already comfortable. Next session, recall the circle result without notes before moving on.
