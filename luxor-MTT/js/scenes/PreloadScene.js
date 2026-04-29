class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        console.log('Cargando recursos...');

        // 1. Cargar las imágenes de fondo HD reales
        this.load.image('bg_level1', 'assets/images/level1.png');
        this.load.image('bg_level2', 'assets/images/level2.png');
        this.load.image('bg_level3', 'assets/images/level3.png');
        this.load.image('main_bg', 'assets/images/main.jpg');

        // Cargamos los JSON de los puntos de control para los 3 niveles
        this.load.json('path_level1', 'assets/paths/level1.json');
        this.load.json('path_level2', 'assets/paths/level2.json');
        this.load.json('path_level3', 'assets/paths/level3.json');

        // 2. Textura HD para el escarabajo
        this.load.image('shooter', 'assets/images/shooter.png');

        // 3. Texturas reales para las esferas de colores (HD)
        this.load.image('sphere_red', 'assets/images/sphere_red.png');
        this.load.image('sphere_blue', 'assets/images/sphere_blue.png');
        this.load.image('sphere_green', 'assets/images/sphere_green.png');
        this.load.image('sphere_yellow', 'assets/images/sphere_yellow.png');

        // 4. Elementos de Interfaz (UI)
        this.load.image('ui_bar', 'assets/images/ui_bar.png');
        this.load.image('ui_panel', 'assets/images/ui_panel.png');
        this.load.image('ui_frame', 'assets/images/ui_frame.png');
        this.load.image('luxor_logo', 'assets/images/luxor_logo.png');

        // 5. Audios
        this.load.audio('music_main', 'assets/audio/music/main.mp3');
        this.load.audio('music_level', 'assets/audio/music/level.mp3');
        this.load.audio('sfx_rolling', 'assets/audio/effects/rolling.mp3');
        this.load.audio('sfx_impact', 'assets/audio/effects/impact.mp3');
        this.load.audio('sfx_shoot', 'assets/audio/effects/shoot.mp3');
        this.load.audio('sfx_explosion', 'assets/audio/effects/explosion.mp3');
    }

    create() {
        // Para sortear las políticas de Autoplay de los navegadores (que bloquean el audio 
        // hasta que el usuario interactúa), pedimos un clic antes de ir al menú principal.

        let startText = this.add.text(640, 360, 'Haz clic en cualquier parte para empezar', {
            fontSize: '28px',
            fill: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Georgia',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Pequeña animación de parpadeo
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Esperar al primer clic en la pantalla
        this.input.once('pointerdown', () => {
            // Al hacer clic, el navegador desbloquea el contexto de audio
            this.scene.start('MenuScene');
        });
    }
}
