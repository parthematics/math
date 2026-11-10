# From curves to Riemannian geometry

**Destination:** smooth manifolds → differential forms → Riemannian geometry, with proofs and geometric examples throughout.

**Time:** about four hours per week. This is now a year-plus learning project, with a provisional budget of roughly 200–350 hours (50–90 study weeks), depending on placement and proof fluency. Reassess after the first few lessons. This is a planning range for a first substantial pass, not a mastery guarantee.

The earlier [24-week curves-and-surfaces plan](CURVES_AND_SURFACES.md) remains available as an expanded bridge and source of exercises. It is not a prerequisite checklist to finish before seeing manifolds. We will introduce the destination early and revisit foundations when an example exposes a gap.

**Available now:** [the first interactive lesson](index.html), [its notes](lessons/01-same-circle-different-clock.md), [placement](lessons/00-placement.md), and [a first look at manifolds through two oscillator phases](lessons/02-two-phases-a-torus.md). The later units below are a curriculum for guided lessons, not a completed lesson library.

## How we will learn

Keep the weekly rhythm: two 60-minute lessons, one 90-minute problem/experiment session, and 30 minutes of recall. Use predict → experiment → explain → prove → transfer.

Introduce an abstract object through a concrete example, define it precisely, calculate with it, then prove something that survives a change of coordinates. A selected answer can check a calculation; a proof needs an argument and feedback. Never count opening a solution as independent understanding.

We do not need an entire abstract algebra or point-set topology course first. We do need the specific algebra, analysis, and topology used by each definition, and we will check those as we encounter them.

## The route

| Unit | Focus | A question it lets us answer |
| --- | --- | --- |
| 1 | Curves and motion | What belongs to a shape, and what belongs to its clock? |
| 2 | Proofs and linear algebra | How do we turn a picture into a statement we can prove? |
| 3 | Analysis and multivariable calculus | What does smoothness mean, and when are local coordinates valid? |
| 4 | Geometry of curves | How can bending be independent of a parameterization? |
| 5 | Geometry of surfaces | How does a surface measure lengths without using an outside observer? |
| 6 | Smooth manifolds | What is a space that looks Euclidean only locally? |
| 7 | Differential forms | What is the natural object to integrate along a path or over a surface? |
| 8 | Integration, Stokes, and topology | How can a local derivative detect a global hole? |
| 9 | Riemannian metrics and connections | How do we measure lengths and differentiate tangent vectors on a manifold? |
| 10 | Curvature and geodesics | What does curvature measure beyond a picture of bending? |
| 11 | Global geometry and a capstone | How do local geometric measurements constrain an entire space? |

Units 2–5 supply the bridge; selected work can be shortened or interleaved after placement. The first manifold preview is available immediately. We will return to circles, spheres, cylinders, and tori as increasingly rich examples.

## Units 1–5 · The geometric bridge

Use the detailed [curves-and-surfaces plan](CURVES_AND_SURFACES.md) selectively.

- **Proofs:** quantified statements, definitions, direct proof, contrapositive, contradiction, induction, and counterexamples.
- **Linear algebra:** vector spaces, dual spaces, bases, linear maps, inner products, symmetric forms, and multilinear maps.
- **Analysis:** limits, continuity, derivatives as linear maps, the chain rule, integration, ODE basics, and the inverse/implicit function theorems.
- **Curves:** regularity, arc length, curvature, normals, space curves, and torsion where defined.
- **Surfaces:** regular patches, tangent planes, first and second fundamental forms, principal curvatures, and Gaussian curvature.

**Evidence to aim for:** prove a regular curve's curvature is unchanged by reparameterization; calculate a surface metric; distinguish a bad coordinate chart from a singular surface; explain why the cylinder has zero Gaussian curvature.

The inverse and implicit function theorems may initially be used with their hypotheses checked, before studying full proofs. The geometry gives these prerequisites a purpose.

## Unit 6 · Smooth manifolds

**Running examples:** the circle, sphere, torus, and configuration spaces of periodic signals.

1. Open sets and continuity; topological manifolds; why Hausdorff and second-countability assumptions appear.
2. Coordinate charts, atlases, smooth transition maps, and smooth maps between manifolds.
3. Tangent vectors as velocities of curves and as derivations; coordinate bases and chart independence.
4. Tangent and cotangent spaces and bundles; differentials/pushforwards and pullbacks of covectors.
5. Vector fields, Lie brackets, local flows, and regular level sets. Use the rank theorems with clear hypotheses.

**Experiments:** switch between overlapping sphere charts; follow a path through an edge identification of a square representing a torus; describe the same tangent vector in two coordinate systems.

**Proof targets:** verify chart compatibility in a concrete atlas; show a map's differential is independent of the chosen chart; derive the chain rule for pushforwards.

**Checkpoint:** explain what a tangent vector is without requiring a manifold to sit inside a larger Euclidean space. Compute the differential of a map between two explicit manifolds.

## Unit 7 · Differential forms

**Running example:** local measurements and integrals on the two-phase torus.

1. Covectors as linear measurements of tangent vectors; their transformation law.
2. Alternating multilinear maps, exterior powers, differential forms, and wedge products.
3. Pullbacks, the exterior derivative, and coordinate invariance.
4. Closed and exact forms; why a globally defined form need not be the derivative of a globally defined function.

**Engineering bridge:** circulation, flux, and the relationship between gradient/curl/divergence notation and exterior calculus. Explain which identifications use a metric or orientation.

**Proof targets:** derive the wedge-product sign rule; prove $d^2=0$ for smooth forms in coordinates; show that pullback commutes with the exterior derivative in representative cases before the general argument.

**Checkpoint:** pull back a form by a parameterization and integrate it along a path. Explain why an ordinary vector and a covector are different objects, even when a Euclidean inner product lets us identify them.

## Unit 8 · Integration, Stokes, and topology

1. Orientation, integration of forms, change of variables, and compact support.
2. Manifolds with boundary and the boundary orientation convention.
3. Stokes' theorem as a common structure behind the fundamental theorem of calculus, Green's theorem, and the divergence theorem.
4. Local exactness, periods around loops, and first examples of de Rham cohomology.
5. Why partitions of unity let local definitions become global. Study selected constructions and proof steps as needed.

**Key example:** on the punctured plane, the smooth 1-form
$$
\alpha=\frac{-y\,dx+x\,dy}{x^2+y^2}
$$
is closed but not exact. Its integral around the positively oriented unit circle is $2\pi$.

**Proof targets:** calculate that $d\alpha=0$ on its domain; use its nonzero loop integral to rule out a global potential; prove selected instances of Stokes and explain the structure of its general proof.

**Checkpoint:** state Stokes with its orientation and regularity assumptions; compute a nontrivial period and explain the obstruction it detects. The full de Rham theorem is a later extension, not an assumed result proved by one example.

## Unit 9 · Riemannian metrics and connections

1. A metric as a smoothly varying positive-definite inner product on tangent spaces.
2. Length, energy, angles, gradients, and the induced distance; coordinate changes of metric components.
3. Connections and covariant derivatives; why comparing tangent vectors at different points requires additional structure.
4. The Levi–Civita connection: metric compatibility and zero torsion. Derive the Koszul formula and connection coefficients in examples.
5. Parallel transport and the geodesic equation; relate geodesics to stationary energy.

**Experiments:** compare two metrics on the same torus; unroll a cylinder; compute in Cartesian and polar coordinates on the flat plane.

**Proof targets:** derive a metric's coordinate transformation rule; explain the uniqueness argument for the Levi–Civita connection; derive a simple geodesic equation from energy.

**Checkpoint:** compute a connection and geodesics for a simple metric. Explain why nonzero Christoffel symbols do not by themselves imply curvature.

## Unit 10 · Curvature and geodesics

1. Define the Riemann curvature tensor using covariant derivatives and Lie brackets; state a sign convention.
2. Verify tensoriality and study curvature symmetries.
3. Sectional, Ricci, and scalar curvature: different information obtained from the curvature tensor.
4. Compute flat, spherical, and a constant-negative-curvature example.
5. Exponential maps, normal coordinates, and the local minimizing property of geodesics.
6. Relate the intrinsic surface curvature to the Gaussian curvature computed earlier.

**Experiment:** a Euclidean plane has nonzero connection coefficients in polar coordinates, but zero curvature. On a sphere, coordinate changes cannot remove curvature.

**Proof targets:** show why the commutator definition produces a tensor; derive at least one curvature identity; justify a local minimizing statement with its hypotheses.

**Checkpoint:** distinguish a coordinate artifact from geometric curvature, compute sectional curvature in an example, and explain how Ricci/scalar curvature arise by contraction. Do not treat any one scalar as the whole curvature tensor.

## Unit 11 · Global geometry and a capstone

1. Geodesic versus globally shortest path; compactness and completeness.
2. The statement and consequences of Hopf–Rinow for connected finite-dimensional Riemannian manifolds.
3. A first look at Jacobi fields and how curvature affects nearby geodesics.
4. Holonomy, surface angle excess, Euler characteristic, and Gauss–Bonnet.
5. Synthesis: connect a coordinate calculation, an invariant statement, and a proof.

For a compact oriented surface without boundary:
$$
\int_M K\,dA=2\pi\chi(M).
$$
Boundary and corner versions require their additional terms. A first pass includes precise statements, selected proofs, and worked examples. A complete proof of every global theorem would extend the schedule.

**Choose a capstone:**

- **The geometry of two signals:** construct the phase torus, a metric, a non-exact closed form, and geodesics. Explain how topology and the chosen metric contribute different information.
- **Why maps distort the Earth:** derive the sphere's metric, curvature, and a geodesic example, then explain a projection's limitation.
- **Curvature without an embedding:** work with an abstract metric and calculate its connection and curvature.
- **Circulation and a hole:** connect a closed form, a loop integral, and the absence of a global potential.

## How deep is the goal?

Work directly with definitions, derive core formulas, write proofs of selected central claims, and solve problems that are not copies of examples. The target reaches smooth-manifold calculus and a first substantial course in Riemannian geometry. It is preparation for reading introductory graduate geometry texts, with selected introductory graduate topics included.

Lie groups, bundles and characteristic classes beyond the tangent/cotangent examples, Hodge theory, comparison geometry, and geometric analysis remain later branches. Choose one after the core route rather than silently expanding this into every part of geometry.

## References

No purchase is required to start. Use one reference at a time for a second explanation or additional problems.

- Richard Hammack, *Book of Proof*: selected proof practice.
- Theodore Shifrin, *Differential Geometry: A First Course in Curves and Surfaces*: the geometric bridge.
- Loring Tu, *An Introduction to Manifolds*: a route into manifolds and forms.
- John M. Lee, *Introduction to Smooth Manifolds*: a detailed reference for definitions and proofs.
- John M. Lee, *Introduction to Riemannian Manifolds*: a later destination text, after the manifold and forms foundations.

References are reading options, not claims of bundled access or a requirement to finish several books before proceeding.
