# A first look: two phases, a torus

**Time:** 10–15 minutes. **Purpose:** see why manifolds, forms, and metrics are useful before learning all their formal machinery. This is a written preview, not a new interactive lab or an assessment.

## 1. Start with two oscillators

An oscillator has a phase angle $\theta$. Phases $0$ and $2\pi$ represent the same position in its cycle. Its possible phase states form a circle, $S^1$.

Now take **two independent oscillators**. A state is a pair of phases:
$$
(\theta_1,\theta_2).
$$

Draw a square with each coordinate ranging from $0$ to $2\pi$. The left and right edges describe matching states. So do the top and bottom edges. Identifying both pairs gives the **torus**:
$$
T^2=S^1\times S^1.
$$

The torus here is the space of possible phase configurations. We did not need to build a physical doughnut. The phases need two independent local coordinates, so this is a two-dimensional manifold.

**First question:** why should $(0,\theta_2)$ and $(2\pi,\theta_2)$ represent the same state? Stop here if learning with your tutor.

## 2. Tangent vectors describe possible changes

At a particular state, an infinitesimal change has two components. Along a motion through phase space:
$$
v=(\dot\theta_1,\dot\theta_2).
$$

A tangent vector records a possible local direction and rate of change. Later we define it without relying on a surrounding Euclidean space.

## 3. A differential form makes a measurement

In local angular coordinates, consider the 1-form
$$
\alpha=d\theta_1+2\,d\theta_2.
$$

It takes a tangent vector and returns a scalar:
$$
\alpha(v)=\dot\theta_1+2\dot\theta_2.
$$

For $v=(1,3)$ this measurement is $7$. A vector describes a change; a covector makes a linear measurement of that change. A differential 1-form supplies a covector smoothly at each point.

Integrating the form along a path adds up those local measurements.

<details>
<summary>A preview of the topology hiding here</summary>

The notation $d\theta_1$ denotes the standard angle 1-form. Although an angle is only locally a real-valued coordinate, overlapping angular coordinates differ by constant multiples of $2\pi$, so their differentials agree.

Around a loop that increases the first phase by one complete turn and leaves the second fixed:
$$
\int_C d\theta_1=2\pi.
$$

This form is closed, but it cannot be $df$ for a globally defined real-valued function $f$: a derivative of such a function integrates to zero around a closed loop. This distinction leads to closed versus exact forms and de Rham cohomology.

</details>

## 4. A metric decides what length means

The manifold tells us which phase states fit together. Choose additional geometric structure:
$$
g=4\,d\theta_1^2+d\theta_2^2.
$$

Here the squares abbreviate symmetric tensor products. This metric measures a velocity by
$$
g(v,v)=4\dot\theta_1^2+\dot\theta_2^2,\qquad
\|v\|_g=\sqrt{4\dot\theta_1^2+\dot\theta_2^2}.
$$

A velocity $(1,0)$ has metric speed $2$; $(0,1)$ has metric speed $1$. We chose to weight changes in the first phase more heavily.

These constant coefficients define a **flat product metric** on the torus. The metric induced on the familiar doughnut-shaped surface in three-dimensional Euclidean space is different. A single manifold can carry different metrics.

## 5. Where the course goes from here

- **Smooth manifolds:** make “local coordinates” and “tangent vector” precise and independent of coordinate choices.
- **Differential forms:** develop these measurements, their integrals, and the exterior derivative.
- **Riemannian geometry:** study metrics, how tangent vectors can be transported, geodesics, and curvature.

On this flat torus, straight lines in unwrapped angular coordinates project to geodesics. Some close up; some wind around without closing. That is a later problem we can calculate and prove.

You do not need to understand every formula here yet. The example gives the definitions a destination. Return to the first phase-identification question, then use the [curriculum](../CURRICULUM.md) and [circle lesson](01-same-circle-different-clock.md) to choose the next step.
