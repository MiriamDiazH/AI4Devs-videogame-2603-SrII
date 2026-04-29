class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Fondo negro semi-transparente sobre todo el juego
        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.7);
        graphics.fillRect(0, 0, 1280, 720);

        // Marco de pausa (Asset Profesional)
        this.add.image(640, 360, 'ui_frame').setScale(0.85);

        this.add.text(640, 320, 'PAUSA', {
            fontSize: '28px', 
            fontFamily: 'Georgia',
            fill: '#ffd700', 
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setShadow(4, 4, 'rgba(0,0,0,1)', 4);

        this.add.text(640, 400, 'Pulsa P para continuar', {
            fontSize: '16px', 
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // La tecla P es gestionada por PlayScene para mantener el editor de nodos activo
    }
}
