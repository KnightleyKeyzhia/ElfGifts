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
        this.load.image('background', 'imaged/bg_layer40.png')
    }
}