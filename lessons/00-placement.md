# A small placement check

**Purpose:** find what needs attention, not assign a grade. Spend about 20–30 minutes, or answer a few questions in chat. “I remember the idea but not the calculation” is useful evidence. Start Lesson 1 first if you prefer.

Try the questions before expanding the notes. Tell the tutor which answers felt uncertain.

1. **Proof:** if $n^2$ is even for an integer $n$, prove that $n$ is even. What proof method did you use?
2. **Quantifiers:** negate “for every $\varepsilon>0$ there is a $\delta>0$ such that every $x$ with $0<|x-a|<\delta$ satisfies $|f(x)-L|<\varepsilon$.” Familiarity with the notation is part of the check.
3. **Vectors and maps:** let $A=\begin{pmatrix}2&0\\0&1\end{pmatrix}$. Find the length of $Av$ when $v=(1,1)$. Does $A$ preserve all angles? Give evidence.
4. **Curves:** for $\gamma(t)=(\cos(2t),\sin(2t))$, find position, velocity, and speed at $t=0$. Which part of the answer would change for $\eta(t)=(\cos t,\sin t)$?
5. **Local linearity:** for $f(x,y)=x^2+y^2$, find the derivative as a linear map at $(1,2)$, then use it to estimate the change from a displacement $(0.01,-0.02)$.
6. **Chain rule:** if $F(t)=f(\gamma(t))$, explain the types of the maps in $F'(t)=Df_{\gamma(t)}(\gamma'(t))$. Why does this expression produce a scalar when $f:\mathbb R^2\to\mathbb R$?
7. **Tangent plane:** give a normal vector and an equation for the tangent plane to $x^2+y^2+z^2=1$ at $(0,0,1)$. Why is the gradient useful here?
8. **Counterexample:** is a curve's acceleration always perpendicular to its velocity? Give a reason or counterexample.

<details>
<summary>Reasoning notes — open after trying</summary>

1. Contrapositive: if $n=2k+1$, then $n^2=2(2k^2+2k)+1$ is odd. Therefore an even square cannot have an odd integer root.
2. There exists $\varepsilon>0$ such that for every $\delta>0$ there exists $x$ with $0<|x-a|<\delta$ and $|f(x)-L|\ge\varepsilon$. Notice that changing quantifiers is not the same as merely changing the last inequality.
3. $Av=(2,1)$, length $\sqrt5$. The perpendicular vectors $(1,1)$ and $(1,-1)$ map to vectors with dot product 3, so not all angles are preserved.
4. Position $(1,0)$, velocity $(0,2)$, speed 2. The other parameterization has the same position at zero, velocity $(0,1)$, and speed 1. They have the same unit-circle image over a full turn.
5. $Df_{(1,2)}(h,k)=2h+4k$. The estimated change is −0.06; the exact change is −0.0595. The derivative is a linear map, represented here by a row matrix.
6. $\gamma'(t)$ is a vector in $\mathbb R^2$. $Df_{\gamma(t)}$ is a linear map from $\mathbb R^2$ to $\mathbb R$; applying it to that vector gives a real number. It is also the dot product with the gradient in Euclidean coordinates.
7. Normal $(0,0,1)$ or a nonzero multiple, plane $z=1$. The level-set gradient $(0,0,2)$ is nonzero and annihilates tangent directions under the dot product.
8. No: $\gamma(t)=(t^2,0)$ at $t=1$ has velocity $(2,0)$ and acceleration $(2,0)$. For constant speed, differentiating $\gamma'\cdot\gamma'$ instead shows perpendicularity.

</details>

## How to use the evidence

- If 1–2 are difficult, spend time on proof and quantified statements; keep doing geometry alongside them.
- If 3 is difficult, refresh maps, vectors, inner products, and coordinate changes.
- If 4–6 are difficult, refresh derivatives and the chain rule before formal curvature derivations.
- If 7 is difficult, revisit gradients and level sets before surfaces.
- If 8 is surprising, compare changing speed with changing direction in Lesson 1.

Confident answers do not require skipping entire subjects: use a new problem to confirm recall. There is no fixed score threshold or automatic placement.
