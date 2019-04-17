import customColorTemplate from './custom-color';
import literalColorTemplate from './literal-color';
import colorTemplate from './default-color';


const colorString = (initializerStyle, color) => {
	switch(initializerStyle) {
	  case 'custom':
		return customColorTemplate(color);
	  case 'literal':
		return literalColorTemplate(color);
	  default:
		return colorTemplate(color);
	}
};

export default colorString;
