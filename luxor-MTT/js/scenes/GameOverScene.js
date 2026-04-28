class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score || 0;
        this.win = data.win || false;
    }

    create() {
        console.log('GameOverScene: Iniciada');

        // Reproducir música principal (deteniendo cualquier otra)
        this.sound.stopAll();
        this.sound.play('music_main', { loop: true, volume: 0.6 });

        // Imagen de fondo
        let bg = this.add.image(640, 360, 'main_bg');
        bg.setDisplaySize(1280, 720);
        bg.setAlpha(0.6); // Un poco más oscura para que el texto resalte
        
        // Panel central (Asset Profesional - Centrado en Altura)
        let panel = this.add.image(640, 360, 'ui_panel');
        panel.setScale(0.55);
        panel.setAlpha(0.9);
        
        let titleMsg = this.win ? '¡VICTORIA!' : 'FIN DEL\nJUEGO';
        let titleColor = this.win ? '#00ff00' : '#ff0000';
        
        this.add.text(640, 300, titleMsg, {
            fontSize: '24px',
            fontFamily: 'Georgia',
            fill: titleColor,
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setShadow(2, 2, 'rgba(0,0,0,0.8)', 2);

        this.add.text(640, 370, 'SCORE: ' + this.score, {
            fontSize: '20px',
            fontFamily: 'Georgia',
            fill: '#ffd700',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        let restartBtn = this.add.text(640, 430, 'Volver al Menú', {
            fontSize: '16px',
            fill: '#00aaff',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        restartBtn.setInteractive({ useHandCursor: true });
        restartBtn.on('pointerover', () => restartBtn.setStyle({ fill: '#00ffff' }));
        restartBtn.on('pointerout', () => restartBtn.setStyle({ fill: '#00aaff' }));
        restartBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}
