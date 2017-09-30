class RealtimeNotificationComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        this.animator = new Animator(this)
        shadow.appendChild(this.img)
        ArrowDiv.create(shadow)
        this.notifContainer = new NotifBlockContainer()
        shadow.appendChild(this.notifContainer.div)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.image.width*2
        canvas.height = this.image.height*2
        const context = canvas.getContext('2d')
        if(!this.notifButton) {
            this.notifButton = new NotiticationButton(canvas.width,canvas.height)
        }
        this.notifButton.draw(context,this.image)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.image = new Image()
        this.image.src = 'imgs/notification.png'
        this.image.onload = ()=> {
            this.render()
        }
        this.img.onmousedown = (event) => {
            var repeat = true
            if(this.notifButton.n == 0) {
                repeat = false
            }
            this.notifButton.increment()
            this.animator.startAnimation(repeat)
        }
    }
}
class NotiticationButton {
    constructor(w,h) {
        this.w = w
        this.h = h
        this.state = new State()
        this.n = 0
    }
    draw(context,image) {
        const n = this.n-1 + (this.state.dir+1)/2
        context.save()
        context.translate(this.w/2,this.h/2)
        context.drawImage(image,-image.width/2,-image.height/2)
        if(this.n != 0) {
            context.save()
            context.scale(this.state.scale,this.state.scale)
            context.beginPath()
            context.arc(this.w*0.2,-this.h*0.2,(0.15*this.w),0,2*Math.PI)
            context.fillStyle = '#f44336'
            context.fill()
            context.font = context.font.replace(/\d{2}/,this.w/6)
            const text = `${n}`
            context.fillStyle = 'white'
            context.fillText(text,this.w*0.2-context.measureText(text).width/2,this.w/20-this.h*0.2)
            context.restore()
        }
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    increment() {
        this.n++
    }
    startUpdating() {
        this.state.startUpdating()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        console.log('init')
    }
    update() {
        this.scale += this.dir*0.1
        console.log(this.scale)
        if(this.scale > 1) {
            this.dir = 0
            this.scale = 1
        }
        if(this.scale < 0) {
            this.dir = 0
            this.scale = 0
        }
    }
    startUpdating() {
        this.dir = 1-2*this.scale
        console.log(this.dir)
    }
    stopped() {
        return this.dir == 0
    }
}
class Animator {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation(repeat) {
        if(!this.animated) {
            this.animated = true
            const notifButton = this.component.notifButton
            notifButton.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                notifButton.update()
                if(notifButton.stopped()) {
                    console.log('here')
                    this.animated = false
                    clearInterval(interval)
                    if(repeat) {
                        this.startAnimation(false)
                    }
                }
            },50)
        }
    }
}
class NotifBlock {
    constructor(message) {
        this.message = message
        this.div = document.createElement('div')
    }
    createStyle() {
        this.div.style.width = '100%'
        this.div.style.height = '25%'
        this.div.style.marginLeft = '15%'
        this.div.style.marginRight = '15%'
        this.div.style.background = 'white'
        this.div.innerHTML = this.message
    }
    static createBlock(message,parent) {
        const notifBlock = new NotifBlock(message)
        notifBlock.createStyle()
        parent.appendChild(notifBlock.div)
    }
}
class NotifBlockContainer {
    constructor() {
        this.blocks = []
        this.div = document.createElement('div')
    }
    createStyle() {
        this.div.style.width = `${window.innerWidth/4}px`
        this.div.style.height = `${window.innerHeight/2}px`
        this.div.style.overflow = 'scroll'
        this.div.style.background = 'gray'
        this.div.style.position = 'absolute'
        this.div.style.left = `${window.innerWidth*.75}px`
        this.div.style.top = '90%'
    }
    addBlock(message) {
        NotifBlock.createBlock(message,this.div)
    }
}
class ArrowDiv {
    constructor() {
        this.div = document.createElement('div')
    }
    createStyle() {
        this.div.style.position = 'absolute'
        this.div.style.left = '95%'
        this.div.style.top = '10%'
        this.div.style.width = 0
        this.div.style.height = 0
        this.div.style.borderBottom = `${window.innerWidth/40}px solid gray`
        this.div.style.borderLeft = `${window.innerWidth/40}px solid transparent`
        this.div.style.borderRight = `${window.innerWidth/40}px solid transparent`
    }
    static create(parent) {
        const arrowDiv = new ArrowDiv()
        arrowDiv.createStyle()
        parent.appendChild(arrowDiv.div)
    }
}
customElements.define('realtime-notification-bar',RealtimeNotificationComponent)
