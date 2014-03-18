var Color = (function () {

	var _additive = function (colors, operation) {
		var sum = colors.shift();
		for (var i in colors) {
			var color = colors[i];
			if(color) {
				for(var j in color) {
					switch (operation) {
						case "subtract":
							sum[j] -= color[j];
							break;
						case "add":
						default:
							sum[j] += color[j];
							break;
					}
				}
			}
		}
		return sum;
	}

	var _diff = function (color1, color2) {
		var mag1 = _magnitude(color1);
		var mag2 = _magnitude(color2);
		return mag1 - mag2;
	}

	var _adjust = function (color, direction, amount) {
		// Can't do this math on the origin, use the darkest grey.
		color = (_magnitude(color) === 0)? _parseColor('#010101') : color;

		// convert to polar coordinates
		var magnitude = _magnitude(color);
		var theta = Math.acos(color.b/magnitude);
		var phi = Math.atan(color.g/color.r);

		// Calculate new color vector magnitude
		var dM = _delta_magnitude(amount);
		var new_magnitude = 0;
		if (direction === 'lighten') {
			new_magnitude = magnitude + dM;
		} else if (direction === 'darken') {
			new_magnitude = magnitude - dM;
		} else {
			return color;
		}

		// convert back to color coordinates
		var new_color = {
			r: Math.round(new_magnitude * Math.sin(theta) * Math.cos(phi)),	
			g: Math.round(new_magnitude * Math.sin(theta) * Math.sin(phi)),
			b: Math.round(new_magnitude * Math.cos(theta)),
		}

		return  _validateColor(new_color, new_magnitude);
	}

	var _magnitude = function (color) {
		var sum = 0;
		for (var i in color) {
			sum += Math.pow(color[i],2);
		}
		return Math.sqrt(sum);
	}

	var _delta_magnitude = function (percent) {
		return brightest * percent;
	}

	var _parseColor = function (color) {
		if(typeof color !== 'string') {
			color = color.toString();
		}
		color = color.replace(/(#|0x)/g,"");
		var color_array = {r:0,g:0,b:0};
		if (color.length === 6) {
			color_array = {
				r: parseInt('0x' + color.substr(0,2)),
				g: parseInt('0x' + color.substr(2,2)),
				b: parseInt('0x' + color.substr(4,2)),
			};
		} else if (color.length === 3) {
			color_array = {
				r: parseInt('0x' + color.substr(0,1) + color.substr(0,1)),
				g: parseInt('0x' + color.substr(1,1) + color.substr(1,1)),
				b: parseInt('0x' + color.substr(2,1) + color.substr(2,1)),
			}
		} else {
			color_array = false;
		}
		return color_array;
	}

	var _validateColor = function (color, target_magnitude) {
		// check for bad or too dark
		for(var i in color) {
			if(isNaN(color[i]) || color[i] < 0) {
				color[i] = 0;
			}
		}

		// check for too bright
		if(_magnitude(color) >= brightest) {
			return _parseColor('fff');
		}

		// check for human visible colors
		var valid_components = [];
		for(var i in color) {
			if(color[i] <= 255) {
				valid_components.push(i);
			} else {
				color[i] = 255;
			}
		}

		// Not bright enough for the target_magnitude, add white
		if(valid_components.length < 3) {
			var delta_vector = {r:0,g:0,b:0};
			target_magnitude = Math.round(target_magnitude);
			for(var i in valid_components) {
				delta_vector[valid_components[i]] = 1;
			}
			while(Math.round(_magnitude(color)) < target_magnitude) {
				color = _additive([color, delta_vector], "add");
				for(var i in color) {
					if(color[i] > 255) {
						color[i] = 255;
					}
				}
			}
		}
		return color;
	}

	var _formatColor = function (color) {
		var formatted = '#';
		for(var i in color) {
			var component = "0" + Math.round(color[i]).toString(16);
			formatted += component.substr(component.length - 2);
		}
		return formatted;
	}

	var _argsToArray = function (args) {
		var a = [];
		for (var i in args) {
			a.push(_parseColor(args[i]));
		}
		return a;
	}

	var _parsePercent = function (num) {
		if (typeof num !== 'string') {
			return num;
		}
		if (num.indexOf('%') === -1) {
			return parseFloat(num);
		}
		percent = parseFloat(num)/100;
		return percent;
	}

	var brightest = _magnitude(_parseColor('fff'));

	return {

		add: function() {
			return _formatColor(_additive(_argsToArray(arguments), "add"));
		},
		subtract: function () {
			return _formatColor(_additive(_argsToArray(arguments), "subtract"));
		},
		lighten: function (color, percent) {
			return _formatColor(_adjust(_parseColor(color), "lighten", _parsePercent(percent)));
		},
		darken: function (color, percent) {
			return _formatColor(_adjust(_parseColor(color), "darken", _parsePercent(percent)));
		},
		isLighter: function (color1, color2) {
			// Answering "is color1 lighter than color2?"
			return ((_magnitude(_parseColor(color1)) - _magnitude(_parseColor(color2))) > 0 );
		},
		isDarker: function (color1, color2) {
			// Answering "is color1 darker than color2?"
			return ((_magnitude(_parseColor(color1)) - _magnitude(_parseColor(color2))) < 0 );
		},
		parse: function(color) {
			return _formatColor(_parseColor(color));
		},
		diff: function(color1, color2) {
			return _diff(_parseColor(color1), _parseColor(color2));
		}
	};
})();
