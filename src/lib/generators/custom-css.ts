import { SAAS_FEATURES } from "../data/saas-features";

function encodeSvgForDataUri(svgContent: string): string {
  return svgContent
    .replace(/"/g, "'")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E");
}

function buildSvgDataUri(pathMarkup: string): string {
  const raw = `<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>${pathMarkup}</svg>`;
  return `url("data:image/svg+xml,${encodeSvgForDataUri(raw)}")`;
}

export function generateSaasCustomCss(): string {
  const featureIconRules = SAAS_FEATURES.map((feature, i) => {
    const dataUri = buildSvgDataUri(feature.wpIconSvg);
    return `:root :where(.saas-feature-icon--${i})::after {
  -webkit-mask-image: ${dataUri};
  mask-image: ${dataUri};
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}`;
  }).join("\n\n");

  const quoteMarkSvg = encodeSvgForDataUri(
    `<svg fill='currentColor' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z'/></svg>`
  );
  const quoteMarkDataUri = `url("data:image/svg+xml,${quoteMarkSvg}")`;

  const checkMarkSvg = encodeSvgForDataUri(
    `<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/></svg>`
  );
  const checkMarkDataUri = `url("data:image/svg+xml,${checkMarkSvg}")`;

  return `/* SaaS Template — pseudo-elements, masks, grids only */

:root :where(.saas-badge)::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--wp--preset--color--primary);
}

:root :where(.saas-browser-toolbar)::before {
  content: '';
  display: flex;
  width: 52px;
  height: 12px;
  background: radial-gradient(circle 6px at 6px 6px, rgba(248,113,113,0.8) 5px, transparent 6px),
              radial-gradient(circle 6px at 26px 6px, rgba(251,191,36,0.8) 5px, transparent 6px),
              radial-gradient(circle 6px at 46px 6px, rgba(74,222,128,0.8) 5px, transparent 6px);
}

:root :where(.saas-pricing-card--popular)::before {
  content: 'Most Popular';
  position: absolute;
  top: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--wp--preset--color--primary);
  color: var(--wp--preset--color--base);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:root :where(.saas-gradient-span) {
  background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:root :where(.saas-feature-icon)::after {
  content: '';
  display: block;
  width: 24px;
  height: 24px;
}

${featureIconRules}

:root :where(.saas-quote-mark)::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  -webkit-mask-image: ${quoteMarkDataUri};
  mask-image: ${quoteMarkDataUri};
  -webkit-mask-size: contain;
  mask-size: contain;
}

:root :where(.saas-check-list li)::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  background-color: #22c55e;
  -webkit-mask-image: ${checkMarkDataUri};
  mask-image: ${checkMarkDataUri};
  -webkit-mask-size: contain;
  mask-size: contain;
}

:root :where(.saas-pricing-card--popular .saas-check-list li)::before {
  background-color: var(--wp--preset--color--primary);
}

:root :where(.saas-features-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

:root :where(.saas-stats-grid) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

:root :where(.saas-pricing-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* WordPress block margin/spacing resets inside SaaS sections */
:root :where(.saas-pricing-card) .wp-block-heading,
:root :where(.saas-pricing-card) p,
:root :where(.saas-feature-card) .wp-block-heading,
:root :where(.saas-feature-card) p,
:root :where(.saas-stat-card) .wp-block-heading,
:root :where(.saas-stat-card) p {
  margin-top: 0;
  margin-bottom: 0;
}

/* Full-width buttons inside pricing cards */
:root :where(.saas-pricing-card) .wp-block-buttons {
  width: 100%;
}
:root :where(.saas-pricing-card) .wp-block-button {
  width: 100%;
}
:root :where(.saas-pricing-card) .wp-block-button__link {
  width: 100%;
  display: block;
  text-align: center;
}

/* Prevent WP flow layout from adding unwanted vertical spacing between blocks */
:where(.wp-block-group.is-layout-flow) > * + * {
  margin-block-start: 0;
}

@media (max-width: 768px) {
  :root :where(.saas-features-grid),
  :root :where(.saas-pricing-grid),
  :root :where(.saas-stats-grid) {
    grid-template-columns: 1fr;
  }
}`;
}
