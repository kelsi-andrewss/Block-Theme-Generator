import { transpileJSXToBlocks } from '../transpiler/jsx-to-blocks';
import {
  SAAS_JSX_SOURCE,
  SAAS_HEADER_JSX_SOURCE,
  SAAS_FOOTER_JSX_SOURCE,
  SAAS_404_JSX_SOURCE,
  SAAS_SIGNUP_JSX_SOURCE,
  SAAS_PRICING_JSX_SOURCE,
  SAAS_DOCS_JSX_SOURCE,
  SAAS_CONTACT_JSX_SOURCE,
} from '../../app/templates/saas/jsx-sources';

const HEADER_PART = '<!-- wp:template-part {"slug":"header","tagName":"header"} /-->';
const FOOTER_PART = '<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->';

export const SAAS_HEADER_HTML = transpileJSXToBlocks(SAAS_HEADER_JSX_SOURCE);
export const SAAS_FOOTER_HTML = transpileJSXToBlocks(SAAS_FOOTER_JSX_SOURCE);

export const SAAS_FRONT_PAGE_HTML = `${HEADER_PART}\n${transpileJSXToBlocks(SAAS_JSX_SOURCE)}\n${FOOTER_PART}`;

export const SAAS_404_HTML = transpileJSXToBlocks(SAAS_404_JSX_SOURCE);
export const SAAS_SIGNUP_HTML = transpileJSXToBlocks(SAAS_SIGNUP_JSX_SOURCE);
export const SAAS_PRICING_HTML = transpileJSXToBlocks(SAAS_PRICING_JSX_SOURCE);
export const SAAS_DOCS_HTML = transpileJSXToBlocks(SAAS_DOCS_JSX_SOURCE);
export const SAAS_CONTACT_HTML = transpileJSXToBlocks(SAAS_CONTACT_JSX_SOURCE);
