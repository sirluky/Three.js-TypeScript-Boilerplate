export function getRandomHexColor() {
    const hexValues = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += hexValues[Math.floor(Math.random() * 16)]
    }
    return color
}

export function resizeRendererToDisplaySize(renderer: any) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false)
    }
    return needResize
}
