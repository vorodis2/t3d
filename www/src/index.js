import { TCont } from './t3d/TCont.js';
import { TStyle,TArrow,TLabel} from './t3d/TStyle.js';
import { TVector} from './t3d/TVector.js';
import { TVectorDebag} from './t3d/TVectorDebag.js';

global.TStyle= TStyle;
global.TCont= TCont;
global.TArrow= TArrow;
global.TLabel= TLabel;
global.TVector= TVector;
global.TVectorDebag= TVectorDebag;

export { TCont,TStyle,TArrow,TLabel,TVector,TVectorDebag};
