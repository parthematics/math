# Curves and surfaces: the expanded bridge

**Time:** about four hours per week. **Planning estimate:** 24 weeks, adjusted after placement and checkpoints.

**Destination:** understand regular curves and surfaces, tangent spaces, metrics, curvature, geodesics, parallel transport, and the meaning of Gauss–Bonnet in selected examples. Be able to support geometric intuition with calculations and short proofs. This is a first course in the geometry of curves and surfaces; a general theory of smooth manifolds, connections, and Riemannian geometry comes afterward.

You do not need to complete a whole abstract algebra or topology course before starting. We will build the proof, analysis, linear algebra, and local topology that this route uses. We will also keep returning to the geometry so the prerequisites have a purpose.

## Weekly rhythm

| Session | Time | Work |
| --- | --- | --- |
| A | 60 min | Recall an earlier idea, make a prediction, explore one new concept |
| B | 60 min | Work from a precise definition to a calculation or short proof |
| C | 90 min | Solve a few substantial problems, including an unfamiliar example |
| D | 30 min | Recall without notes, explain aloud, save questions and evidence |

Prefer fewer well-understood problems to a large worksheet. At a checkpoint, explain the idea, calculate an example, and handle a changed problem without copying. Revisit a weak link before adding more terminology. Completion dates are not mastery evidence.

## 0 · A first taste and placement — week 1

**Question:** what belongs to a geometric shape, and what belongs to the way we describe or traverse it?

- Use [the circle lab](index.html) and [Lesson 1](lessons/01-same-circle-different-clock.md).
- Distinguish a curve's image from its parameterization; compare velocity, unit tangent, and curvature.
- Use [placement](lessons/00-placement.md) to check proof, vectors, derivatives, limits, and the chain rule.

**Checkpoint:** explain why changing the clock changes speed without changing a circle's curvature. No prior knowledge of the curvature formula is required before this lesson.

## 1 · Proofs and the linear algebra of geometry — weeks 2–5

**Question:** how do we turn a convincing picture into an argument?

| Week | Focus | Activity | Evidence to aim for |
| --- | --- | --- | --- |
| 2 | Statements, quantifiers, definitions, direct proof, counterexample | Repair a false claim about vectors; negate a quantified claim | A short proof with explicit assumptions and a counterexample to a nearby false statement |
| 3 | Contrapositive, contradiction, induction; sets and functions | Prove a familiar fact two ways; distinguish injective/surjective/invertible | Choose a suitable proof method and justify a function's invertibility |
| 4 | Vector spaces, bases, linear maps, coordinates | Describe the same vector in two bases; separate a map from its matrix | Compute a basis change and explain what stayed fixed |
| 5 | Inner products, norms, orthogonality, dual vectors, symmetric forms | Compare Euclidean and weighted notions of length; diagonalize a quadratic form | Explain positive definiteness and calculate a length from a nonidentity metric matrix |

**Engineering bridge:** coordinate systems and quadratic energy expressions. **Geometry payoff:** tangent vectors and metrics will have a precise language.

If placement shows strong proof fluency, use harder problems or shorten this block rather than repeating familiar procedures.

## 2 · Analysis that makes geometry precise — weeks 6–9

**Question:** what does it really mean to be smooth or locally linear?

| Week | Focus | Activity | Evidence to aim for |
| --- | --- | --- | --- |
| 6 | Sequences, limits, continuity; quantifiers in an ε–δ statement | Prove a simple limit from the definition; find a continuity counterexample | Explain the order of quantifiers and complete a short limit proof |
| 7 | Derivatives as linear maps, directional derivatives, Jacobians | Compare a function with its linear approximation in different directions | Distinguish partial derivatives from differentiability and use a Jacobian correctly |
| 8 | Chain rule, inverse/implicit function theorem statements and hypotheses | Recover the tangent plane of a sphere from a level set and a parameterization | Check full rank and explain what it guarantees locally |
| 9 | Riemann integrals, fundamental theorem, arc length, elementary open sets | Approximate a path by chords; find where a coordinate chart breaks | Derive the arc-length integral and distinguish local invertibility from global invertibility |

**Depth:** prove selected elementary claims; use the inverse and implicit function theorems with clear hypotheses before studying their full proofs. Introduce additional analysis when it becomes necessary.

**Checkpoint:** for a regular curve, justify the local use of arc length as a parameter using $ds/dt=\|\gamma'(t)\|>0$.

## 3 · Curves: turning made measurable — weeks 10–12

**Question:** can we measure bending independently of the clock?

| Week | Focus | Activity | Evidence to aim for |
| --- | --- | --- | --- |
| 10 | Regular curves, reparameterization, unit speed, curvature | Return to Lesson 1 and derive its formulas | Prove curvature is unchanged by a regular reparameterization |
| 11 | Signed plane curvature, normals, osculating circles | Compare a circle, a parabola, and an inflection point | Calculate curvature and interpret its sign or magnitude with an orientation convention |
| 12 | Space curves, Frenet frame and torsion where defined | Compare a circle and a helix | Explain why curvature and torsion measure different behavior; identify where a Frenet frame is undefined |

**Checkpoint:** calculate the curvature of a parabola and compare it with a circle having the same tangent and curvature at a point. Explain why a nonzero velocity is required and why the principal normal may fail at zero curvature.

## 4 · Surfaces: geometry in a small neighborhood — weeks 13–16

**Question:** what can a tiny inhabitant of a surface measure?

| Week | Focus | Activity | Evidence to aim for |
| --- | --- | --- | --- |
| 13 | Regular surface patches, chart overlap, tangent planes | Build sphere patches and locate the failure of spherical coordinates at a pole | Check rank two and distinguish a bad chart from a singular surface |
| 14 | First fundamental form, lengths, angles, area | Compare distances on a cylinder before and after unrolling it | Derive the metric of a parameterized surface and use it to calculate length |
| 15 | Normals, second fundamental form, shape operator | Compare normal sections of a sphere and saddle | Compute principal curvatures with an explicit sign convention |
| 16 | Gaussian and mean curvature; intrinsic/extrinsic distinction | Compare a plane, cylinder, sphere, and saddle | Explain how a cylinder can bend in space while having zero Gaussian curvature |

**Engineering bridge:** local quadratic forms and principal axes. **Checkpoint:** derive $K=0$ for a cylinder and $K=1/R^2$ for a sphere; explain why a local length-preserving flattening of a sphere cannot exist, using the intrinsic nature of Gaussian curvature introduced next.

## 5 · Intrinsic geometry — weeks 17–21

**Question:** how much geometry survives without an ambient space?

| Week | Focus | Activity | Evidence to aim for |
| --- | --- | --- | --- |
| 17 | Metrics, local isometries, the meaning of the Theorema Egregium | Unroll a cylinder; compare bending that preserves the metric | Separate the theorem's statement from its proof and explain an implication |
| 18 | Covariant differentiation on a surface, parallel transport | Project ambient derivatives to tangent planes | Explain why ordinary derivatives leave the tangent plane and compute one projected derivative |
| 19 | Geodesics, great circles, geodesic equations | Trace a helix on an unrolled cylinder; compare routes on a sphere | Derive a simple geodesic from the metric or tangent-acceleration condition |
| 20 | Local minimizing properties, geodesic vs globally shortest path | Extend a great-circle segment beyond half a circumference | Give a counterexample to “every geodesic is globally shortest” |
| 21 | Holonomy and curvature | Transport a tangent vector around a spherical triangle | Relate transport around a loop to enclosed curvature in a stated setting |

**Checkpoint:** calculate a metric in two coordinate systems and explain how they can describe the same geometry. Derive one geodesic example rather than memorizing an equation.

## 6 · Geometry meets topology — weeks 22–24

**Question:** why can local bending reveal the shape of an entire surface?

| Week | Focus | Activity | Evidence to aim for |
| --- | --- | --- | --- |
| 22 | Geodesic curvature, boundary orientation, triangle angle excess | Calculate a spherical triangle with three right angles | Explain why the Euclidean angle sum changes and calculate its area |
| 23 | Euler characteristic and Gauss–Bonnet | Compare triangulations of a sphere and torus | State the closed-surface theorem with its hypotheses and check explicit examples |
| 24 | Capstone and synthesis | Choose one project below and explain it to a curious peer | A worked example, a precise claim, supporting reasoning, and a limitation |

For an oriented compact surface with smooth boundary, the boundary version includes a geodesic-curvature term; corners add exterior-angle terms. Do not apply the boundary-free formula to a patch without accounting for its boundary.

**Choose a capstone:**

- Why a flat map cannot preserve every distance on Earth: derive the sphere's metric, compare a projection, and explain the curvature obstruction.
- The cylinder detective story: use the metric and unrolling to find geodesics; distinguish intrinsic from extrinsic curvature.
- A spherical triangle with three right angles: connect area, angle excess, parallel transport, and Gauss–Bonnet.

## Optional references

No book is required to start, and no paid material is assumed available. Use a reference for a second explanation or additional exercises rather than assigning several books at once.

- Richard Hammack, *Book of Proof*: proof practice, freely provided by the author.
- Sheldon Axler, *Linear Algebra Done Right*: conceptual linear algebra; selected sections, not a prerequisite to finish cover to cover.
- Theodore Shifrin, *Differential Geometry: A First Course in Curves and Surfaces*: a suitable destination text, with author-provided notes.
- Manfredo do Carmo, *Differential Geometry of Curves and Surfaces*: another reference once proof and multivariable foundations are comfortable.

The [main curriculum](CURRICULUM.md) now makes smooth manifolds, differential forms, and Riemannian geometry the core destination. Use this plan selectively as an expanded geometric bridge, with advanced previews introduced early.
