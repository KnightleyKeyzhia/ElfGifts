import Phaser from 'phaser'
export default class MathFighterScenes extends
Phaser.Scene
{
    constructor(){
        super('math-fighter-scene')
    }
    init(){
        this.gameHalfWidth = this.scale.width * 0.5
        this.gameHalfHeight = this.scale.height * 0.5
        this.player = undefined
        this.enemy = undefined
        this.slash = undefined

        //inisialisasi startGame
        this.startGame = true
        this.questionText = undefined
        this.resultText= undefined

        //inisialisasi Button
        this.button1 = undefined
        this.button2 = undefined
        this.button3 = undefined
        this.button4 = undefined
        this.button5 = undefined
        this.button6 = undefined
        this.button7 = undefined
        this.button8 = undefined
        this.button9 = undefined
        this.button0 = undefined
        this.buttonDel = undefined
        this.buttonOk = undefined

        //inisialisasi array
        this.numberArray = []
        this.number = 0

        //text
        this.resultText = undefined

        //inisialisasi question
        this.question = []

        //inisialisasi question text
        this.questionText = undefined

        //inisiasi correct answer
        this.correctAnswer = undefined

        //inisiasi attack
        this.playerAttack = false
        this.enemyAttack = false
        
        //inisiasi score
        this.score = 0
        this.scoreLabel = undefined

        //inisiasi timer
        this.timer = 10
        this.timerLabel = undefined
        this.countdown = undefined

    }

    preload(){
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('fight-bg', 'images/fight-bg.png')
        this.load.image('tile', 'images/tile.png')
        this.load.image('start_btn', 'images/startbutton.png')

        //Upload PLAYER
        this.load.spritesheet('player', 'images/warrior1.png', {
            frameWidth: 80, 
            frameHeight: 80,
        })
        //Upload ENEMY
        this.load.spritesheet('enemy', 'images/warrior2.png', {
            frameWidth: 80, 
            frameHeight: 80,
        })
        //Upload NUMBERS
        this.load.spritesheet('numbers', 'images/numbers.png', {
            frameWidth: 131, 
            frameHeight: 71.25,
        })
        //Upload slash
        this.load.spritesheet('slash', 'images/slash.png', {
            frameWidth: 42, 
            frameHeight: 88,
        })
        //Upload start button
        this.load.image('start-btn', 'images/startbutton.png')
    }

    create(){
        this.add.image(240, 320, 'background')
        const fight_bg = this.add.image(240, 160, 'fight-bg')
        const tile = this.physics.add.staticImage(240, fight_bg.height- 40, 'tile')

        //PLAYER
        this.player = this.physics.add.sprite(
            this.gameHalfWidth - 150,
            this.gameHalfHeight - 200, 'player')
            .setBounce(0.2)
            .setOffset(-20,-10)
        this.physics.add.collider(this.player, tile)

        //ENEMY
        this.enemy = this.physics.add.sprite(
            this.gameHalfWidth + 150,
            this.gameHalfHeight - 200, 'enemy')
            .setBounce(0.2)
            .setOffset(20,-10)
            .setFlipX(true)
        this.physics.add.collider(this.enemy, tile)

        //SLASH
        this.slash = this.physics.add.sprite(240, 60, 'slash')
        .setActive(false)
        .setVisible(true)
        .setGravityY(-500)
        .setOffset(0, -10)
        .setDepth(1)
        .setCollideWorldBounds(true)

        this.createAnimation()

        //Button
        let start_button = this.add.image(this.gameHalfWidth,
        this.gameHalfHeight + 181, 'start-btn').setInteractive()

        start_button.on('pointerdown', () => {
            this.gameStart()
            start_button.destroy()
        }, this)

        //overlap player-slash
        this.physics.add.overlap(
            this.slash,
            this.player,
            this.spriteHit,
            null,
            this
        )

        //overlap enemy-slash
        this.physics.add.overlap(
            this.slash,
            this.enemy,
            this.spriteHit,
            null,
            this
        )
        
        //Score
        this.scoreLabel = this.add.text (10, 10, 'Score :', {
            fill: 'white',backgroundColor: 'black'
        }).setDepth(1)

        //Timer
        this.timerLabel = this.add.text(380, 10, 'Time :', {
            fill: 'white', backgroundColor: 'black'
        }).setDepth(1)

        
    }

    update(time){

        if(this.correctAnswer === true && !this.playerAttack){
            this.player.anims.play('player-attack', true)
            this.time.delayedCall(500, () => {
                this.createSlash(this.player.x+60, this.player.y,
                    4, 600)
            })
            this.playerAttack = true
            this.score+=10
        }
        if (this.correctAnswer === undefined){
            this.player.anims.play('player-standby', true)
            this.enemy.anims.play('enemy-standby', true)
        }
        if(this.correctAnswer === false && !this.enemyAttack){
            this.enemy.anims.play('enemy-attack', true)
            this.time.delayedCall(500, () => {
                this.createSlash(this.enemy.x- 60 ,
                    this.enemy.y,2, -600, true)
            })
            this.enemyAttack = true
        }

        this.scoreLabel.setText ('Score :' + this.score)
        
        if(this.startGame = true){
            this.timerLabel.setText('Timer :' + this.timer)
        }
    }

    //NO. 1 Method create animation
    createAnimation(){
        //PLAYER ANIMATIONS
        this.anims.create({
            key: 'player-standby',
            frames: this.anims.generateFrameNumbers('player',
            { start: 15, end: 19 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'player-attack',
            frames: this.anims.generateFrameNumbers('player',
            { start: 10, end: 14 }),
            frameRate: 10,
        })
        this.anims.create({
            key: 'player-hit',
            frames: this.anims.generateFrameNumbers('player',
            { start: 5, end: 9 }),
            frameRate: 10,
        })
        this.anims.create({
            key: 'player-die',
            frames: this.anims.generateFrameNumbers('player',
            { start: 0, end: 4 }),
            frameRate: 10,
        })

    //ENEMY ANIMATIONS
        this.anims.create({
            key: 'enemy-standby',
            frames: this.anims.generateFrameNumbers('enemy',
            { start: 15, end: 19 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'enemy-attack',
            frames: this.anims.generateFrameNumbers('enemy',
            { start: 10, end: 14 }),
            frameRate: 10,
        })
        this.anims.create({
            key: 'enemy-hit',
            frames: this.anims.generateFrameNumbers('enemy',
            { start: 5, end: 9 }),
            frameRate: 10,
        })
        this.anims.create({
            key: 'enemy-die',
            frames: this.anims.generateFrameNumbers('enemy',
            { start: 0, end: 4 }),
            frameRate: 10,
        })
    }

    //No. 2 Method start game
    gameStart(){
        this.startGame = true
        this.player.anims.play('player-standby', true)
        this.enemy.anims.play('enemy-standby', true)
        this.resultText = this.add.text(this.gameHalfWidth,200,
        '0', {fontSize: '32px', fill: '#000'})
        this.questionText = this.add.text(this.gameHalfWidth,100,
        '0', {fontSize: '32px', fill: '#000'})

        this.createButtons()

        //memunculkan text
        this.input.on('gameobjectdown', this.addNumber, this)

        this.generateQuestion()

        //timer
        this.countdown = this.time.addEvent({
            delay: 1000,
            callback: this.gameOver,
            callbackScope: this,
            loop: true
        })
    }

    //No. 3
    createButtons(){
        const startPosY = this.scale.height - 240
        const widthDiff = 131
        const heightDiff = 71.25

        //CENTER buttons
        this.button2 = this.add.image(
            this.gameHalfWidth, //X axis
            startPosY,  //Y axis
            'numbers',  //sprite
            1)  //index
            .setInteractive() //clickable
            .setData('value', 2) //set value 2

        this.button5 = this.add.image(
            this.gameHalfWidth, //X axis
            this.button2.y //Y axis
            + heightDiff, 
            'numbers', //sprite
            4) //index
            .setInteractive() //clickable
            .setData('value', 5) //set value 5

        this.button8 = this.add.image(
            this.gameHalfWidth, //X axis
            this.button5.y //Y axis
            + heightDiff, 
            'numbers', //sprite
            7) //index
            .setInteractive() //clickable
            .setData('value', 8) //set value 8

        this.button0 = this.add.image(
            this.gameHalfWidth, //X axis
            this.button8.y //Y axis
            + heightDiff, 
            'numbers', //sprite
            10) //index
            .setInteractive() //clickable
            .setData('value', 0) //set value 0
    
        //left side
        this.button1 = this.add.image(
            this.button2.x  - widthDiff, //X axis
            startPosY, //Y axis
            'numbers', //sprite
            0) //index
            .setInteractive() //clickable
            .setData('value', 1) //set value 1

        this.button4 = this.add.image(
            this.button5.x - widthDiff, //X axis
            this.button1.y + heightDiff, //Y axis
            'numbers', //sprite
            3) //index
            .setInteractive() //clickable
            .setData('value', 4) //set value 4

        this.button7 = this.add.image(
            this.button8.x - widthDiff, //X axis
            this.button4.y + heightDiff, //Y axis
            'numbers', //sprite
            6). //index
            setInteractive() //clickable
            .setData('value', 7) //set value 7

        this.buttonDel = this.add.image(
            this.button0.x - widthDiff,
            this.button7.y + heightDiff, 
            'numbers', //sprite
            9) //index
            .setInteractive() //clickable
            .setData('value', 'del') //set value del

        //right side
        this.button3 = this.add.image(
            this.button2.x + widthDiff, //X axis
            startPosY, //Y axis
            'numbers', //sprite
            2) //index
            .setInteractive() //clickable
            .setData('value', 3) //set value 3

        this.button6 = this.add.image(
            this.button5.x + widthDiff, //X axis
            this.button3.y + heightDiff, //Y axis
            'numbers', //sprite
            5) //index
            .setInteractive() //clickable
            .setData('value', 6) //set value 6

        this.button9 = this.add.image(
            this.button8.x + widthDiff, //X axis
            this.button6.y + heightDiff, //Y axis
            'numbers', //sprite
            8) //index
            .setInteractive() //clickable
            .setData('value', 9) //set value 9

        this.buttonOk = this.add.image(
            this.button0.x + widthDiff, //X axis
            this.button9.y + heightDiff, //Y axis
            'numbers', //sprite
            11) //index
            .setInteractive() //clickable
            .setData('value', 'ok') //set value ok
    }

    //No. 4 Method add number
    addNumber(pointer, object, event){
        let value = object.getData('value')
        if (isNaN(value)){
            if(value == 'del'){
                this.numberArray.pop()
                if(this.numberArray.length < 1){
                    this.numberArray[0] = 0
                }
            }
            if(value == 'ok'){
                this.checkAnswer()
                this.numberArray = []
                this.numberArray[0] = 0
            }
        }
        else{
            if(this.numberArray.length ==1 && this.numberArray[0] ==0){
                this.numberArray[0] = value
            }else {
                if (this.numberArray.length < 10){
                    this.numberArray.push(value)
                }
            }
        }
        this.number = parseInt(this.numberArray.join(''))
        
        this.resultText.setText(this.number)
        const textHalfWidth = this.resultText.width * 0.5
        this.resultText.setX(this.gameHalfWidth - textHalfWidth)
        event.stopPropagation()
    }

    //No. 5 Method operator
    getOperator(){
        const operator = ['+', '-', 'x', ':']
        return operator[Phaser.Math.Between(0,3)]
    }

    //No. 6 Method generate question
    generateQuestion(){
        let numberA = Phaser.Math.Between(0, 50)
        let numberB = Phaser.Math.Between(0, 50)
        let operator = this.getOperator()
        if (operator === '+'){
            this.question[0] = `${numberA} + ${numberB}` //operator +
            this.question[1] = numberA + numberB
        }
        if (operator === 'x'){
            this.question[0] = `${numberA} x ${numberB}` //operator x
            this.question[1] = numberA * numberB
        }
        if (operator === '-'){
            if(numberB > numberA){
                this.question[0] = `${numberB} - ${numberA}` //operator -
                this.question[1] = numberB - numberA
            }else {
                this.question[0] = `${numberA} - ${numberB}`
                this.question[1] = numberA - numberB
            }
        }
        if (operator === ':'){
            do{
                numberA = Phaser.Math.Between(0, 50)
                numberB = Phaser.Math.Between(0, 50)
            }while(!Number.isInteger(numberA/numberB))
            this.question[0] = `${numberA} : ${numberB}` //operator :
            this.question[1] = numberA / numberB
        }
        this.questionText.setText(this.question[0])
        const textHalfWidth = this.questionText.width * 0.5
        this.questionText.setX(this.gameHalfWidth - textHalfWidth)
    }

    //No. 7 Method check answer
    checkAnswer(){
        if (this.number == this.question[1]){
            this.correctAnswer = true
        }else {
            this.correctAnswer = false
        }
    }

    //No. 8 Method Slash
    createSlash(x, y, frame, velocity, flip = false){
        this.slash.setPosition(x, y)
            .setActive(true)
            .setVisible(true)
            .setFrame(frame)
            .setFlipX(flip)
            .setVelocityX(velocity)
    }

    //No. 9 Method sprite hit
    spriteHit(slash, sprite){
        slash.x = 0
        slash.y = 0
        slash.setActive(false)
        slash.setVisible(false)
        if (sprite.texture.key == 'player'){
            sprite.anims.play('player-hit', true)
        }else {
            sprite.anims.play('enemy-hit', true)
        }
        this.time.delayedCall(500, () => {
            this.playerAttack = false
            this.enemyAttack = false
            this.correctAnswer = undefined
            this.generateQuestion()
        })
    }

    //No. 10 Method Game Over
    gameOver(){
        this.timer--
        if(this.timer <0){
            this.scene.start('over-scene',
            {score: this.score})
        }
    }
}