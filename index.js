let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')


let tex0  = document.getElementById("present0")
let tex1  = document.getElementById("present1")
let tex2  = document.getElementById("present2")
let tex3  = document.getElementById("present3")
let tex4  = document.getElementById("present4")
let tex5  = document.getElementById("present5")
let tex13 = document.getElementById("present6")

let tex15 = document.getElementById("sign0")

let tex6  = document.getElementById("conveyor")
let tex7  = document.getElementById("cvEnding")

let tex8  = document.getElementById("loss")
let tex10 = document.getElementById("menu")

let tex9  = document.getElementById("floor")

let tex11 = document.getElementById("candycane")
let tex12 = document.getElementById("life")
let tex14 = document.getElementById("star")

let presents = []
let conveyors = []

let score = 0

let lives = 5

let bounceLife = 0
let bounceLifeFrames = 100

let lost = false
let looseCount = 10
let lossFrame = 0

let onMenu = false

canvas.width = window.innerWidth
canvas.height = window.innerHeight

WIDTH = canvas.width
HEIGHT = canvas.height

let challengeLevel = 6

class Box{
	constructor(x,y,h,w,tex){
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.tex = tex
	}
	draw(){
		c.drawImage(this.tex,this.x-this.w/2,this.y-this.h/2,this.w,this.h)
	}
	isHovered(x,y){
		return x>this.x-this.w/2&&y>this.y-this.h/2&&x<this.x+this.w/2&&y<this.y+this.h/2;
	}
}

class Conveyor{
	constructor(x,y,sortType){
		this.currentFrame = 0
		this.fts = 10 //frames until next frame switch
		this.speed = 10
		this.x = x
		this.y = y
		this.sortType = sortType
	}
	draw(){
		c.drawImage(tex6,this.currentFrame*320,0,320,320,this.x,this.y,160,160)
		c.drawImage(tex6,this.currentFrame*320,0,320,320,this.x,this.y+160,160,160)
		c.drawImage(tex7,this.currentFrame*320,0,320,320,this.x,this.y+320,160,160)
		if(!onMenu){
			this.fts--
			if(this.fts==0){
				this.currentFrame++
				this.fts = this.speed
				if(this.currentFrame>4){
					this.currentFrame = 0
				}
			}
		}
		
	}
	drawSign(){
		c.drawImage(tex15,this.x+7,this.y)
	}
	onConveyor(i){
		return (presents[i].box.x>this.x&&
				presents[i].box.y>this.y&&
				presents[i].box.x<this.x+160&&
				presents[i].box.y<this.y+160*2+20)
	}
}


class present{
	constructor(){
		this.type = Math.round(Math.random()*7) //types 0, 1, 6 are small, 2 and 3 are medium, and 4, 5 are large
		this.box = new Box(Math.random()*WIDTH,Math.random()*HEIGHT/4+HEIGHT/4*3,
			this.type==7?93:
			this.type==0?93:
			this.type==1?93:
			this.type==6?245:255,

			this.type==7?77:
			this.type==0?77:
			this.type==1?77:
			this.type==2?210:
			this.type==3?210:
			this.type==4?320:
			this.type==5?320:190,

			this.type==7?tex4:
			this.type==0?tex4:
			this.type==1?tex5:
			this.type==2?tex2:
			this.type==3?tex3:
			this.type==4?tex0:
			this.type==5?tex1:tex13)
		
		if((this.type==7)||(this.type==0)||(this.type==1))
			this.type = 0
		else if((this.type==2)||(this.type==3))
			this.type = 1
		else if((this.type==4)||(this.type==5))
			this.type = 2
		else if((this.type==6))
			this.type = 3

		this.onConveyor = false
		this.isHeld = false
		this.holdOffsetX = 0
		this.holdOffsetY = 0
		this.delivered = false
		this.failedDelivery = false
	}
}

window.addEventListener("mousedown" ,onClick   ,false)
window.addEventListener("mouseup"   ,onRelease ,false)
window.addEventListener("mousemove" ,moveHold  ,false)
window.addEventListener("keypress"  ,onPress   ,false)

function onPress(e){
	if(((e.key=="q")||(e.key=="m"))&&!lost){
		onMenu = !onMenu
	}
}

function onClick(e){
	if(!onMenu){
		for(let i=0;i<presents.length;i++){
			if(presents[i].box.isHovered(e.x,e.y)){
				presents[i].isHeld = true
				presents[i].holdOffsetX = e.x-presents[i].box.x
				presents[i].holdOffsetY = e.y-presents[i].box.y
				if(e.ctrlKey){
					break
				}
			}
		}
	}
}

function onRelease(e){
	if(!onMenu){
		for(let i=0;i<presents.length;i++){
			presents[i].isHeld = false
		}
	}
}

function moveHold(e){
	if(!onMenu){
		let held = 0
		for(let i=0;i<presents.length;i++){
			if(presents[i].isHeld){
				presents[i].box.x = e.clientX-presents[i].holdOffsetX
				presents[i].box.y = e.clientY-presents[i].holdOffsetY
	
				let temp = presents[held]
				presents[held] = presents[i]
				presents[i] = temp
				held++
				
				if(presents[i].box.y<220){
					presents[i].failedDelivery = presents[i].isHeld
				}
			}
		}
	}
}

presents.push(new present())
presents.push(new present())
presents.push(new present())

conveyors.push(new Conveyor(100,0,0))
conveyors.push(new Conveyor(250,0,1))
conveyors.push(new Conveyor(400,0,2))
conveyors.push(new Conveyor(550,0,3))


function animate(){
	requestAnimationFrame(animate)

	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	WIDTH = canvas.width
	HEIGHT = canvas.height

	c.drawImage(tex9,0,0,WIDTH,HEIGHT)

	for(let i=0;i<conveyors.length;i++){
		conveyors[i].draw()
	}

	presents.reverse()

	for(let i=0;i<presents.length;i++){
		presents[i].box.draw()

		if(!onMenu){
			//update
			for(let j=0;j<conveyors.length;j++){
				if(conveyors[j].onConveyor(i)){
					presents[i].box.y--
				}
				if(presents[i].box.x>conveyors[j].x&&
				presents[i].box.x<conveyors[j].x+160&&
				presents[i].box.y<conveyors[j].y+1){
					if(presents[i].type==conveyors[j].sortType){
						presents[i].delivered = true
					}
					else{
						presents[i].failedDelivery = true
					}
				}
			}

			if(presents[i].delivered){
				score++
				presents.splice(i,1)
			}
			else if(presents[i].failedDelivery){
				lives--
				presents.splice(i,1)
			}
		}
	} 

	presents.reverse()

	

	for(let i=0;i<conveyors.length;i++){
		conveyors[i].drawSign()
	}

	c.fillStyle = "rgba(0,0,30,0.5)"
	c.fillRect(0,0,WIDTH,220)

	for(let i=0;i<score;i++){
		let column = Math.floor(i/10)+1
		
		c.drawImage(tex11,WIDTH-20*column,100+40*(i-(column-1)*10))
	}
	for(let i=0;i<lives;i++){
		c.drawImage(tex12,300+40*i,challengeLevel==6?i==bounceLife?95:100:100)
	}
	for(let i=0;i<challengeLevel;i++){
		c.drawImage(tex14,252+50*i,20,45,45)
	}

	if(bounceLifeFrames==0){
		bounceLifeFrames = 5
		bounceLife++
		if(bounceLife>=lives){
			bounceLife = 0
		}
	}
	bounceLifeFrames--

	if((Math.random()<0.005*challengeLevel)&&!onMenu){
		presents.push(new present())
	}

	if(!onMenu&&challengeLevel<3){
		challengeLevel += 0.0005
	}
	if(challengeLevel<6){
		challengeLevel += 0.00005
	}

	if((lives<1)||presents.length>25){
		score = 0
		lives = 5
		challengeLevel = 1
		onMenu = true
		lost = true
		presents = []
	}
	if(lost){
		looseCount--
		if(looseCount==0){
			lossFrame++
			looseCount = 10
		}
		if(lossFrame==10){
			lossFrame = 0
			lost = false
			presents.push(new present())
			presents.push(new present())
			presents.push(new present())
		}
		
		c.drawImage(tex8,640*lossFrame,0,640,85,200,200,320,42)
	}
	if(!lost&&onMenu){
		c.drawImage(tex10,100,100)
	}
}

animate()