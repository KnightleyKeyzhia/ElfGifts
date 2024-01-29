import Phaser from "phaser";
export default class GameOverScene extends Phaser.Scene{
    constructor(){
        super('over-scene')
    }
    init(data){
        this.replayButton = undefined
        this.score = data.score
    }

    preload(){
        this.load.image('background', 'images/bg_layer40.png')
        this.load.image('replay-button', 'images/replay_btn01.png')
        this.load.image('gameover', 'images/gameover-.png')
    }

    create(){
        const gameWidth = this.scale.width*0.5;
        const gameHeight = this.scale.height*0.5;
        this.add.image(gameWidth, gameHeight, 'background').setScale(1.65)
        this.add.image(200, 200, 'gameover').setScale(0.50)
        this.add.text(100, 300, 'Score: ' + this.score,{
            fontSize: '32px', fill: 'red'
        })
        this.replayButton = this.add.image(200, 400, 'replay-button')
        .setInteractive().setScale(0.2)
        this.replayButton.once('pointerup', () => {
            this.scene.start('elf-gifts-scene')
        },  this)
    }
}