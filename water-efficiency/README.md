# Can saving water use more water?

A short, interactive exhibit for the Water-Efficiency Paradox investigation in ECO 238. Research background is restricted to the seven sources linked on the page. All water-accounting numbers are illustrative, not measured.

## View

Open `index.html` in a browser. It is self-contained, with no build tools, external fonts, libraries or network requests required for the exhibit and calculator. Reference links require internet access. The story and chart remain readable without JavaScript.

## Publish on public GitHub Pages

1. Create a public GitHub repository, or select an existing public repository intended for this exhibit.
2. Upload `index.html`, `README.md`, and `scenarios.csv` to its root. Include `.nojekyll` if uploading through Git; the page also works without it.
3. In repository Settings → Pages, choose “Deploy from a branch”, the `main` branch, and `/ (root)`. Save.
4. Wait for the deployment to finish and open the public URL GitHub displays. Test all three presets and the CSV button.

If placing the exhibit in a larger course repository, use a subfolder and the corresponding URL path; preserve the repository's existing Pages configuration. Do not overwrite another `index.html`.

## Reproduce

Original withdrawal = 100, consumption = 60, returns = 40. New efficiency e; recoverable share r; fraction of saved capacity reused b. Inputs are fractions.

```
Wfixed = 60 / e
Wnew = Wfixed + b * (100 - Wfixed)
Cnew = e * Wnew
Rnew = Wnew - Cnew
withdrawalSaving = 100 - Wnew
basinSaving = (100 - Wnew) + r * (Rnew - 40)
```

`scenarios.csv` contains the three preset calculations. The on-page download captures the current slider settings and unrounded results. The page's method explains the boundary, assumptions, depletion identity and extensions.

The 0%-recovery preset implements the initial assumption that lower withdrawals become additional usable supply. The 100%-recovery preset accounts for fully recoverable return flows. A withdrawal reduction cannot guarantee depletion reduction. The behavior slider is a scenario assumption; it does not estimate farmer demand.

## Extend

Use local measurements, define spatial boundaries and recovery times, model water quality, distinguish beneficial/nonbeneficial evaporation, allow recovery fractions to change, or add crop prices and land constraints. If replacing illustrative data, label measurement units, dates, methods, uncertainty and new sources clearly.

## Provenance

The seven-source bibliography and claim-specific links are in `index.html`. Review statistics are 80.1% of 176 cases for withdrawal reductions and 83.2% of 161 cases for consumption increases, from Pérez-Blanco et al. (2020). These are different subsets of heterogeneous modeled and observed case studies; do not present them as paired farm observations or a probability of rebound.

The public design reference was https://rochesterrizzo.github.io/Rizzo-Hours/show-me/example-exhibit/. The exhibit was prepared October 2026. Repository destination: https://github.com/scproom/Environemtal-Econ/tree/main/water-efficiency/. The existing GitHub Pages workflow publishes the repository root, including this subfolder. The exhibit URL is https://scproom.github.io/Environemtal-Econ/water-efficiency/.
