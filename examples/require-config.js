// https://github.com/umdjs/umd/blob/master/nodeAdapter.js
if (typeof module === 'object' && typeof define !== 'function') { var define = function (factory) { module.exports = factory(require, exports, module); };}

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.

    baseUrl: './',
    urlArgs: "bust=v239", // use this to force a reload of all js files
    paths: {

        d3                    : '../bower_components/d3/d3',
        accessmaker           : '../bower_components/access-maker/AccessMaker',
        classsignature        : '../bower_components/class-signature/ClassSignature',

        // shared
        plot                  : '../lib/plot/Plot',
        geom                  : '../lib/plot/Geom',
        layer                 : '../lib/plot/Layer',

        geom_arcs              : '../lib/renderers/Arcs',
        geom_area              : '../lib/renderers/Area',
        geom_bars              : '../lib/renderers/Bars',
        geom_dots              : '../lib/renderers/Dots',
        geom_flower            : '../lib/renderers/Flower',
        geom_lines             : '../lib/renderers/Lines',
        geom_pie               : '../lib/renderers/Pie',

        // polar
        polarplot             : '../lib/plot-polar/PolarPlot',
        polar                 : '../lib/plot-polar/Polar',
        // -- guides
        radialaxis            : '../lib/plot-polar/guide/RadialAxis',
        angularaxis           : '../lib/plot-polar/guide/AngularAxis',
        // -- layouts
        polarbar              : '../lib/plot-polar/layout/Bar',
        polarpie              : '../lib/plot-polar/layout/Pie',
        polardot              : '../lib/plot-polar/layout/Dot',
        polarline             : '../lib/plot-polar/layout/Line',
        polararea             : '../lib/plot-polar/layout/Area',
        polarband             : '../lib/plot-polar/layout/Band',
        polarflower           : '../lib/plot-polar/layout/Flower',
        // interactives
        polarhover            : '../lib/plot-polar/interactive/PolarHover',

        // cartesian
        cartesianplot         : '../lib/plot-cartesian/CartesianPlot',
        // -- guides
        verticalaxis          : '../lib/plot-cartesian/guide/VerticalAxis',
        horizontalaxis        : '../lib/plot-cartesian/guide/HorizontalAxis',
        // -- geoms
        cartesianbar          : '../lib/plot-cartesian/geom/CartesianBar',

    }

});