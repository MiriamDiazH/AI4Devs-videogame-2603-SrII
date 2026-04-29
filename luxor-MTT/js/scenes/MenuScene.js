class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        console.log('Menú principal iniciado');
        
        // Reproducir música principal (deteniendo cualquier otra)
        this.sound.stopAll();
        this.sound.play('music_main', { loop: true, volume: 0.6 });
        
        // Imagen de fondo
        let bg = this.add.image(640, 360, 'main_bg');
        bg.setDisplaySize(1280, 720);

        // Logotipo Luxor (Miniatura - Solo Letras)
        let logo = this.add.image(640, 100, 'luxor_logo');
        logo.setScale(0.35);

        // Panel para botones (Ajuste de tamaño y posición)
        let panel = this.add.image(640, 290, 'ui_panel');
        panel.setScale(0.27);

        let levels = [1, 2, 3];
        levels.forEach((lvl, index) => {
            let btn = this.add.text(640, 255 + (index * 35), `NIVEL ${lvl}`, { 
                fontSize: '18px', 
                fill: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Georgia',
                stroke: '#000',
                strokeThickness: 4
            }).setOrigin(0.5);
            
            btn.setShadow(3, 3, 'rgba(0,0,0,1)', 2);
            btn.setInteractive({ useHandCursor: true });
            
            // Efectos de hover
            btn.on('pointerover', () => btn.setStyle({ fill: '#ff0' }));
            btn.on('pointerout', () => btn.setStyle({ fill: '#0f0' }));
            
            // Lanzar PlayScene pasando la variable del nivel
            btn.on('pointerdown', () => {
                this.scene.start('PlayScene', { level: lvl });
            });
        });
    }
}
