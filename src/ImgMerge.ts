import {Point} from "coordinate";
import {loadImg} from "dom";

export class MergeImg {
    private ctx?: CanvasRenderingContext2D
    private canvas?: HTMLCanvasElement
    private readonly parent: Element

    constructor(readonly width: number, readonly height: number) {
        const parent = document.body
        const canvas = document.createElement('canvas')
        this.canvas = canvas
        this.parent = parent
        Object.assign(canvas.style, {
            height: height + 'px',
            width: width + 'px',
            position: 'fixed',
            left: '-10000px'
        })
        canvas.width = width
        canvas.height = height
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        parent.appendChild(canvas)
    }

    async addImg(url: string, location: Point, size?: Point) {
        if (!this.ctx) throw new Error()
        const img = await loadImg(url)
        const ctx = this.ctx
        const [x, y] = location
        let dw: number
        let dh: number
        if (size) {
            dw = size[0]
            dh = size[1]
        } else {
            dw = img.width
            dh = img.height
        }
        ctx.drawImage(img, x, y, dw, dh)
    }

    toDataURL(type = 'image/png'): string {
        if (!this.canvas) throw new Error()
        return this.canvas.toDataURL(type)
    }

    toBlob(): Blob {
        const dataURL = this.toDataURL()
        const arr: string[] = dataURL.split(',')
        const mime = arr[0].match(/:(.*?);/)?.[1]
        const atob1 = atob(arr[1])
        let n = atob1.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = atob1.charCodeAt(n)
        }
        return new Blob([u8arr], {type: mime})
    }

    destroy() {
        if (!this.canvas) throw new Error('destroyed')
        this.parent.removeChild(this.canvas)
        this.canvas = undefined
        this.ctx = undefined
    }
}