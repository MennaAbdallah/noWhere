var CharactersScene = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:
        function CharactersScene() {
            Phaser.Scene.call(this, { key: 'charactersScene' });
        },
    preload: function () {

        var txt = this.add.text(850, 400, 'Loading ....', { fontSize: '43px', fill: '#00a308' });
        var progress = this.add.graphics();

        this.load.on('progress', function (value) {
            
            progress.clear();
            progress.fillStyle(0x00a308, 1);
            progress.fillRect(0, 270, 1200 * value, 60);

        });

        this.load.on('complete', function () {

            progress.destroy();
            txt.destroy();

        });

        
        this.load.spritesheet('character1', 'assets/character1.png', { frameWidth: 521, frameHeight: 628 });
        this.load.spritesheet('character2', 'assets/character2.png', { frameWidth: 521, frameHeight: 573 });
        this.load.image('back', 'assets/back.png');
        this.load.image('ground', 'assets/platform.png');
    },
    create: function () {
        background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'back');
        character1 = this.physics.add.sprite(1200, 650, 'character1');
        character2 = this.physics.add.sprite(700, 690, 'character2').setScale(2);
        character1.setInteractive();
        character1.name = "character1";
        character2.setInteractive();
        character2.name = "character2";
        character1.setScale(1);
        character2.setScale(1);
        createAnimation(this, 'walk', 'character1', 0, 10, 18);
        createAnimation(this, 'walk2', 'character2', 0, 10, 18);
        character1.anims.play('walk', true);
        character2.anims.play('walk2', true);
        platforms = this.physics.add.staticGroup();
        platforms.create(960, 980, 'ground');
        this.physics.add.collider(character1, platforms);
        this.physics.add.collider(character2, platforms);
        var txt = this.make.text({
            x: 1000,
            y: 300,
            text: 'Choose Your Character!',
            origin: { x: 0.5, y: 0.5 },
            style: {
                font: 'bold 80px Algerian',
                fill: '#FE3E9B',
                wrap: {
                    mode: 'word',
                    width: 300
                }
            }
        });

        character1.on('pointerdown', function () {
            charID = 1;
            
            game.sound.removeByKey("menuMusic");
            game.scene.stop('charactersScene');
            game.scene.start('gameScene');
        })
        character2.on('pointerdown', function () {
            charID = 2;

            game.sound.removeByKey("menuMusic");
            game.scene.stop('charactersScene');
            game.scene.start('gameScene');
        })
    },
    update: function () {
    }
});