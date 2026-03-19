import { transpileJSXToBlocks } from '../transpiler/jsx-to-blocks';
import { generateSaasFrontPageJsx } from './saas-front-page-jsx';

const HEADER_PART = '<!-- wp:template-part {"slug":"header","tagName":"header"} /-->';
const FOOTER_PART = '<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->';

export const SAAS_FRONT_PAGE_HTML = `${HEADER_PART}\n${transpileJSXToBlocks(generateSaasFrontPageJsx())}\n${FOOTER_PART}`;
