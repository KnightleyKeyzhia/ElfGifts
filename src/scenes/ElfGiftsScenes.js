import Phaser from 'phaser'
import FallingObject from '../ui/FallingObject';
export default class ElfGiftsScenes extends Phaser.Scene {
    constructor(){
        super('elfs-gifts-scene')
    }

    init(){
        //inisiasi player
        this.player = undefined;
        this.speed = 100

        //inisiasi bomb
        this.bombs = undefined;
        this.bombSpeed = 50;

        //inisiasi cursor
        this.cursor =undefined

        //inisiasi score
        this.scoreLabel = undefined
        this.score = 0

        //inisiasi life
        this.lifeLabel = undefined
        this.life = 3
    }

    preload(){
        this.load.image('background', 'images/bg_layer40.png')
        this.load.image('player', 'images/elf.png')
        
        //load bomb
        this.load.image('bomb', 'images/bombers.png');
    }

    create(){
        const gameWidth = this.scale.width*0.5;
        const gameHeight = this.scale.height*0.5;
        this.add.image(gameWidth, gameHeight, 'background').setScale(1.65)

        //display player
        this.player = this.createPlayer().setScale(1)

        //display bomb
        this.bombs  = this.physics.add.group({
            classType: FallingObject,
            maxSize: 3,
            runChildUpdate: true
        })

        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 5000),
            callback: this.spawnBombs,
            callbackScope: this,
            loop: true
            })
            
        //display cursor
        this.cursor = this.input.keyboard.createCursorKeys()

        //display label score
        this.scoreLabel = this.add.text(10, 10, 'Score', {
            fontSize: '16px',
            fill: 'green',
            backgroundColor: 'red'
        }).setDepth(1)

        //menampilkan label life
        this.lifeLabel = this.add.text(10, 50, 'life', {
            fontSize: '16px',
            fill: 'red',
            backgroundColor: 'green'
        }).setDepth(3)

        //overlap overlap player enemy
        this.physics.add.overlap(
            this.player,
            this.bombs,
            this.decreaseLife,
            null,
            this
        )
    
    }

    update(time){
        if(this.cursor.left.isDown){
            this.player.setVelocityX(-200)
        }else if(this.cursor.right.isDown){
            this.player.setVelocityX(200)
        }else{this.player.setVelocityX(0)}

        //Update nilai dari score
        this.scoreLabel.setText('Score :' + this.score);

        //update nilai dari life
        this.lifeLabel.setText('life : ' + this.life)
    }

    createPlayer(){
        const player = this.physics.add.sprite(200, 450, 'player')
        player.setCollideWorldBounds(true)
        return player
    }

    spawnBombs(){
        const config = {
            speed: 40,
            rotation: 0.1
        }
        //@ts-ignore
        const bombs = this.bombs.get(0, 0, 'bomb', config)
        const poisitionX = Phaser.Math.Between(50, 350)
        if(bombs){
            bombs.setScale(0.1)
            bombs.spawn(poisitionX)
        }
    }

    decreaseLife(player, bombs){
        bombs.die()
        this.life--
        if(this.life == 2){
            player.setTint(0xff0000)
        }else if(this.life == 1){
            player.setTint(0xff0000).setAlpha(0.2)
        }else if (this.life == 0){
            this.scene.start('over-scene', {score: this.score})
        }
    }
}