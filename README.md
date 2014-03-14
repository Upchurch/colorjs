colorjs
=======

A simple javascript library for comparing color brightness and adjusting the brightness of a color

The operations are based a representation of the color as a vector in a three-dimensional RGB space. The direction of the vector represents the color and the magnitude represents the brightness. When the brightness of two colors are compared, it is actually a comparison of the magnitudes of their color vectors. Adjustments to the magnitude of a color is done by converting the "Cartesian" RGB coordinates into spherical coordinates, changing the magnitude (or, now, radius) of the vector a given amount while holding theta and phi constant, and then converting the spherical coordinates back to Cartesian RGB coordinates.

Since there is a maximum (0xff) and minimum (0x00) brightness for color in this system, all percentage changes are calculated as percentage of the absolute brightness. So, a 10% lightening from black (#000000) is the same amount of change as a 10% darkening from white (#ffffff) or a 10% darkening from blue (#0000ff). Anything exceeding those limits is disregarded and reset to the limit.


Inputs
=======
In all cases, _color_ inputs are expected to be in some form of hex value, but is fairly tolerant of the format and is not case sensitive. The library will accept:
* "#ffffff"
* "ffffff"
* "#fff"
* "fff"
* 0xffffff
* 0xfff

_percent_ inputs are allowed in the following formats:
* "10%"
* "0.10"
* 0.10


Methods
========
* Color.lighten( color, percent ) - Returns a hex color code that is _percent_ brighter than _color_.
* Color.darken( color, percent ) - Returns a hex color code that is _percent_ darker than _color_.
* Color.isLighter( color1, color2 ) - Returns TRUE if _color1_ is lighter than _color2_ and FALSE if the _color2_ is of equal brightness or lighter than _color1_.
* Color.isDarker( color1, color2 ) - Returns TRUE if _color1_ is darker than _color2_ and FALSE if the _color2_ is of equal brightness or darker than _color1_.
* Color.parse( color ) - Takes any of the above color formats and returns _color_ in the "#ffffff" format.
* Color.diff( color1, color2 ) - Returns the raw difference in brightnesses between _color1_ and _color2_.
