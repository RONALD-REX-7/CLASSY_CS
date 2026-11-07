# Tamil Nadu Engineering Admissions (TNEA) Cutoff Normalization & Rank Engineering

**Specification Version:** 1.0.0  
**Target Platform:** CLASSY_CS Admissions Planning & Academic Evaluation Engine  
**Authority:** Anna University / Directorate of Technical Education (DoTE)

---

## 1. 200-Point Aggregate Normalization Equation

Under Tamil Nadu Engineering Admissions regulations, raw percentage marks scored in Higher Secondary Certificate (HSC) Class 12 board examinations are normalized to a uniform 200-point cutoff score:

$$\text{Cutoff} = M + \frac{P}{2} + \frac{C}{2} = M + 0.5 \cdot (P + C)$$

Where:
- $M \in [0.00, 100.00]$: Mathematics mark (weight: $50\%$, maximum $100$ points)
- $P \in [0.00, 100.00]$: Physics mark (weight: $25\%$, maximum $50$ points)
- $C \in [0.00, 100.00]$: Chemistry mark (weight: $25\%$, maximum $50$ points)
- Total $\text{Cutoff} \in [0.00, 200.00]$ with fixed 2-decimal precision rounding.

---

## 2. Multi-Tier Tie-Breaking Precedence Protocol

When multiple applicants achieve identical aggregate cutoff scores, CLASSY_CS applies Anna University's strict deterministic tie-breaking hierarchy:

1. **Rule 1 (Mathematics Precedence)**: Higher normalized marks in Mathematics ($M$).
2. **Rule 2 (Physics Precedence)**: Higher normalized marks in Physics ($P$).
3. **Rule 3 (Fourth Optional Subject)**: Higher marks in the optional fourth subject (Computer Science / Biology).
4. **Rule 4 (Chronological Seniority)**: Seniority in age (earlier Date of Birth).
5. **Rule 5 (Random TNEA Number)**: Higher randomly assigned 10-digit applicant tie-breaking integer.
