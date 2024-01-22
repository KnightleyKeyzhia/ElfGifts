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
            maxSize: 10,
            runChildUpdate: true
        })

        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 5000),
            callback: this.spawnBomb,
            callbackScope: this,
            loop: true
            })
            
            //display cursor
            this.cursor = this.input.keyboard.createCursorKeys()
    
    }

    update(time){
        if(this.cursor.left.isDown){
            this.player.setVelocityX(-200)
        }else if(this.cursor.right.isDown){
            this.player.setVelocityX(200)
        }else{this.player.setVelocityX(0)}
    }

    createPlayer(){
        const player = this.physics.add.sprite(200, 450, 'player')
        player.setCollideWorldBounds(true)
        return player
    }

    spawnBombs(){
        const config = {
            speed: 30,
            rotation: 0.1
        }
        //@ts-ignore
        const bomb = this.bombs.get(0, 0, 'bomb', config)
        const poisitionX = Phaser.Math.Between(50, 350)
        if(bomb){
            bomb.spawn(poisitionX)
        }
    }

}