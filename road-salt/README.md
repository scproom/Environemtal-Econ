# Road Salt Damage Model

Public exhibit: https://scproom.github.io/Environemtal-Econ/road-salt/

One lane-mile, one winter of sodium chloride road salt. The website compares the extra safety benefit of adding one US short ton (2,000 lb) with extra environmental damage and, separately, all extra costs. It also shows season totals so readers can distinguish a marginal crossover from an overall negative result.

## Run and reproduce

No build, external script, account, or tracking service is required. Serve this directory with `python -m http.server 8000` and open http://localhost:8000. `index.html` provides content/style; `model.js` exports the equations; `app.js` updates the visualizations and downloads a CSV for selected assumptions. `scenarios.csv` contains default scenarios, with dollar figures rounded to two decimals. Calculations in the UI use unrounded values.

Inputs: salt x (0–20 short tons/one lane-mile/winter), safety-value multiplier s (0.5–2), water-vulnerability multiplier v (0.5–2). The interactive salt slider stops at 19 so the next ton remains within the 20-ton model range.

All money is illustrative US dollars. None of these coefficients or the salt range is estimated from the linked evidence. These are explicit teaching assumptions, not recommended application rates. Sources support the physical pathways; the model assumes diminishing safety gains and increasing water/vegetation damage to demonstrate the tradeoff. It does not estimate crashes or water chloride concentration.

```
B(x) = 12000*s*(1-exp(-x/5))
W(x) = 18*v*x*x
P(x) = 7*x*x
V(x) = 90*x
I(x) = 70*x
A(x) = 60*x
E(x) = W(x)+P(x)
C(x) = E(x)+V(x)+I(x)+A(x)
N(x) = B(x)-C(x)
Next-ton change = F(x+1)-F(x)
```

Plowing, storm severity, traffic exposure, and application practices are fixed. Multipliers independently change B and W only. The damage coefficients represent the present-value equivalent of damage attributed to this winter, including future repairs, without separately estimating a discount rate. Water/habitat, vegetation, vehicle repairs, structures, and application are conceptually separate categories; local valuation must avoid overlap. Season net benefit subtracts all costs once; E is included in C.

`summary()` searches integer totals 0–20 for the maximum N and integer steps for the first environmental/all-cost crossover. These discrete one-ton crossovers differ from continuous derivative intersections. The model can still have positive cumulative net benefit beyond a crossover.

## Extend

Replace coefficients with storm-matched local crash/travel data, measured salt use, stream/well chloride, plant monitoring, and repair records. Separate sodium chloride mass from total brine mass. Control for storm severity and plowing. Document dollar valuations, uncertainties, and a common damage horizon. Compare efficient application/plowing with a second benefit curve and its equipment cost. Add repeated-winter contamination stocks for a longer-run extension.

## Sources

1. MnDOT (2014), Newsline January 22, section “MnDOT works to lower environmental risks of salt with technology, research, collaboration”: https://www.newsline.dot.state.mn.us/archive/14/Jan/22.html
2. FHWA (2016), 2015 RWM Performance Measures Survey, Analysis, and Report, Chapter 5, PM #9: https://ops.fhwa.dot.gov/publications/fhwahop16001/ch5.htm
3. MPCA, Chloride reduction program: https://www.pca.state.mn.us/air-water-land-climate/chloride-reduction-program
4. New York State (2023), Adirondack Road Salt Reduction Task Force Assessment and Recommendations: https://dec.ny.gov/sites/default/files/2024-09/adirondackroadsaltreport.pdf
5. Winter road management effects on roadside soil and vegetation along a mountain pass in the Adirondack Park, New York, USA (2018), Journal of Environmental Management: https://pubmed.ncbi.nlm.nih.gov/30092548/

Checked October 4, 2026. No source supplies this model's illustrative dollar coefficients.

QR encodes https://scproom.github.io/Environemtal-Econ/road-salt/#sources. Cover image is `cover.png` (1200×630). Static assets and all computations are local to the webpage.
