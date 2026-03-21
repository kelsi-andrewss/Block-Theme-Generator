import { transpileJSXToBlocks } from '../transpiler/jsx-to-blocks';
import { SAAS_JSX_SOURCE, SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE } from '../../app/templates/saas/jsx-sources';

const HEADER_PART = '<!-- wp:template-part {"slug":"header","tagName":"header"} /-->';
const FOOTER_PART = '<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->';

export const SAAS_HEADER_HTML = transpileJSXToBlocks(SAAS_HEADER_JSX_SOURCE);
export const SAAS_FOOTER_HTML = transpileJSXToBlocks(SAAS_FOOTER_JSX_SOURCE);

export const SAAS_FRONT_PAGE_HTML = `${HEADER_PART}\n${transpileJSXToBlocks(SAAS_JSX_SOURCE)}\n${FOOTER_PART}`;
