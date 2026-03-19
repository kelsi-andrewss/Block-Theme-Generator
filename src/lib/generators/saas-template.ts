import { transpileJSXToBlocks } from '../transpiler/jsx-to-blocks';
import { SAAS_JSX_SOURCE } from '../../app/templates/saas/page';

const HEADER_PART = '<!-- wp:template-part {"slug":"header","tagName":"header"} /-->';
const FOOTER_PART = '<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->';

export const SAAS_FRONT_PAGE_HTML = `${HEADER_PART}\n${transpileJSXToBlocks(SAAS_JSX_SOURCE)}\n${FOOTER_PART}`;
