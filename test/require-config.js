define({
    baseUrl: './',
    nodeRequire: require,
    paths: {
        'scale.linear'         : '../Linear',
        'scale.ordinal'        : '../Ordinal',

        // dependencies
        accessmaker          : '../bower_components/access-maker/AccessMaker',
        bisect               : '../bower_components/d3-array/Bisect',
        map                  : '../bower_components/d3-array/Map',
        compare              : '../bower_components/d3-array/Compare',
        range                : '../bower_components/d3-array/Range',
        'color'              : '../bower_components/d3-color/Color',
        'color.rgb'          : '../bower_components/d3-color/rgb',
        'color.lab'          : '../bower_components/d3-color/lab',
        'color.hsl'          : '../bower_components/d3-color/hsl',
        'color.hcl'          : '../bower_components/d3-color/hcl',
        'color.xyz'          : '../bower_components/d3-color/xyz',
        'color.names'        : '../bower_components/d3-color/ColorNames',
        'extent'             : '../bower_components/d3-extent/Extent',
        interpolate          : '../bower_components/d3-interpolate/Interpolate',
        uninterpolate        : '../bower_components/d3-interpolate/Uninterpolate'
    }
});