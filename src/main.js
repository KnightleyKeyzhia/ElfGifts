import Phaser from 'phaser'

import ElfGiftsScenes from './scenes/ElfGiftsScenes'
import GameOverScene from './scenes/GameOverScenes'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 620,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [ElfGiftsScenes, GameOverScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
}

export default new Phaser.Game(config)
