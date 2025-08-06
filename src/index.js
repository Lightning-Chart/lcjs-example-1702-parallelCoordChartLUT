const lcjs = require('@lightningchart/lcjs')
const { lightningChart, Themes, LUT, regularColorSteps } = lcjs

const lc = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
const chart = lc
    .ParallelCoordinateChart({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Parallel Coordinate Chart with Value based coloring')

fetch(document.head.baseURI + 'examples/assets/1702/machine-learning-accuracy-data.json')
    .then((r) => r.json())
    .then((data) => {
        const theme = chart.getTheme()
        const Axes = {
            batch_size: 0,
            channels_one: 1,
            learning_rate: 2,
            accuracy: 3,
        }
        chart.setAxes(Axes)
        chart.getAxis(Axes.accuracy).setInterval({ start: 0, end: 1 })
        chart.setLUT({
            axis: chart.getAxis(Axes.accuracy),
            lut: new LUT({
                interpolate: true,
                steps: regularColorSteps(0, 1, theme.examples.badGoodColorPalette),
            }),
        })
        data.forEach((sample) => chart.addSeries().setData(sample))
    })
