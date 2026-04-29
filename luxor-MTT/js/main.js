const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,   // Resolución lógica interna (16:9)
    height: 720,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT, // Escala al máximo posible manteniendo la proporción
        autoCenter: Phaser.Scale.CENTER_BOTH // Centra vertical y horizontalmente
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false // Cambiaremos a true más adelante para depurar colisiones
        }
    },
    scene: [
        PreloadScene,
        MenuScene,
        PlayScene,
        PauseScene,
        GameOverScene
    ]
};

// Inicializamos el juego
const game = new Phaser.Game(config);
