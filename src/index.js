window.lcjsSmallView = window.devicePixelRatio >= 2
if (!window.__lcjsDebugOverlay) {
    window.__lcjsDebugOverlay = document.createElement('div')
    window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
    const attach = () => { if (document.body && !window.__lcjsDebugOverlay.parentNode) document.body.appendChild(window.__lcjsDebugOverlay) }
    attach()
    setInterval(() => {
        attach()
        window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + window.lcjsSmallView
    }, 500)
}
const lcjs = require('@lightningchart/lcjs')
const { lightningChart, Themes, LUT, regularColorSteps } = lcjs

const lc = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
const chart = lc
    .ParallelCoordinateChart({
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    return t && window.lcjsSmallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.lcjsSmallView ? lcjs.htmlTextRenderer : undefined,
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
