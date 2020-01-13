var newZombiePlace = 0;
var iter = 0;
var counter = 0;
var zombies;
var zombie;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var zombieCountText;
var enemyNeeded = 0;
var zombieCount=0;


var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, { key: 'gameScene' });
            
        },
    preload: function () {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('face', 'assets/face.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('zombie', 'assets/zombie.png', { frameWidth: 70, frameHeight: 84 });
        this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 70, frameHeight: 116 });
        this.load.spritesheet('woman', 'assets/woman.png', { frameWidth: 70, frameHeight: 106 });
        this.load.spritesheet('attacker', 'assets/attacker.png', { frameWidth: 70, frameHeight: 70 });
        this.load.spritesheet('sewer', 'assets/sewer.png', { frameWidth: 70, frameHeight: 70 });
    }
    ,

    create: function () {
        

        //  A simple background for our game
        background = this.add.tileSprite(this.cameras.main.centerX, this.cameras.main.centerY, 1920, 1080, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        platforms.create(960, 980, 'ground');

        this.add.image(960,50,'face');

        // The zombie and its settings

        zombies = this.physics.add.group();


        zombie = this.physics.add.sprite(400, 450, 'zombie');

        zombie.setScale(2);
        zombies.add(zombie);

        game.physics.add.overlap(zombie,attacker,attackerOverlap,null,game);

        //  Our zombie animations, turning, walking left and walking right.

        createAnimation(this, 'right', 'zombie', 0, 9, 20);

        createAnimation(this, 'up', 'zombie', 4, 4, 20);

        createAnimation(this, 'boy', 'boy', 0, 6, 10);

        createAnimation(this, 'woman', 'woman', 0, 18, 30);

        createAnimation(this, 'attacker', 'attacker', 0, 4, 5);

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        //  The score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '43px', fill: '#ffff' });
        zombieCountText = this.add.text(1020, 50, '1', { fontSize: '43px', fill: '#ffff' });

        //  Collide the zombie and the victims with the platforms
        this.physics.add.collider(zombie, platforms);

        //  Checks to see if the zombie overlaps with any of the victims, if he does call the collectStar function


    }
    ,
    update: function () {

        background.tilePositionX = iter * 300;
        iter += 0.03;

        counter++;

        // if (enemyNeeded == 5) {
        //     enemyNeeded = 0;
        //     addAttacker(this);
        // }

        if (counter == 80) {
            counter = 0;

            switch (getRandomInt(4)) {
                case 0://boy
                    addVictim(this, 'boy', 1.1);
                    break;

                case 1://woman
                    addVictim(this, 'woman', 1);
                    break;

                case 2:
                case 3:
                    addAttacker(this);
                    break;
            }

        }


       

        var speed = 650;
        zombies.children.iterate(function (child) {
            if ((cursors.up.isDown || cursors.space.isDown) && child.body.touching.down) {
                child.setVelocityY(-speed);
            }

            if (child.body.touching.down) {
                child.anims.play('right', true);
            } else {
                child.anims.play('up', true);

            }

            speed = speed - 5;


        }
        );




        function addAttacker(game) {
            var attacker = game.physics.add.sprite(2100, 850, 'attacker').setScale(2, 1.5);
            attacker.anims.play('attacker', true);
            game.physics.add.collider(attacker, platforms);
            attacker.setVelocityX(-700);
            zombies.children.iterate(function (childZombie) {
                game.physics.add.overlap(childZombie,attacker,attackerOverlap,null,game);
            });
        }

        function addVictim(game, type, scale) {
            var victim = game.physics.add.sprite(2100, 880, type).setScale(scale);
            victim.anims.play(type, true);
            victim.setVelocityX(-700);
            game.physics.add.collider(victim, platforms);
            var last = zombies.getLast(true);

            zombies.children.iterate(function (childZombie) {
                game.physics.add.overlap(childZombie, victim, function () {
                    collectVictims(childZombie, victim, game)
                }, null, this);
            });
           
            enemyNeeded++;
        }
    }



});

var GameOverScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameOverScene() {
            Phaser.Scene.call(this, { key: 'gameOverScene' });
        },
    preload: function () {
        this.load.image('gameOver', 'assets/game_over.png');
        this.load.spritesheet('tryBtn', 'assets/tryBtn.png', { frameWidth: 400, frameHeight: 92 });
        this.load.spritesheet('menuBtn', 'assets/menuBtn.png', { frameWidth: 400, frameHeight: 92 });
    },
    create: function () {
        var game = this;
        this.add.tileSprite(this.cameras.main.centerX, this.cameras.main.centerY, 1920, 1080, 'gameOver');
        createAnimation(this, "tryBtnOver", "tryBtn", 1, 0, 4);
        createAnimation(this, "menuBtnOver", "menuBtn", 1, 0, 4);

        var sp = this.add.sprite(1440, 850, 'tryBtn').setInteractive();
        sp.name = "tryBtn";

        sp = this.add.sprite(440, 850, 'menuBtn').setInteractive();
        sp.name = "menuBtn";

        //  Events

        this.input.on('pointerover', function (event, gameObjects) {
            if (gameObjects[0].name == "tryBtn") { gameObjects[0].anims.play('tryBtnOver', true); }
            if (gameObjects[0].name == "menuBtn") { gameObjects[0].anims.play('menuBtnOver', true); }
        });
       
        this.input.on('pointerdown', function (event, gameObjects) {
            if (gameObjects[0].name == "tryBtn") { 
                game.scene.start('gameScene');
                }
        });

        this.input.on('pointerout', function (event, gameObjects) {

            if (gameObjects[0].name == "tryBtn") { gameObjects[0].anims.stop('tryBtnOver', true); gameObjects[0].setFrame(0); }
            if (gameObjects[0].name == "menuBtn") { gameObjects[0].anims.stop('menuBtnOver', true); gameObjects[0].setFrame(0); }

        });

    },
    update: function () {

    }



});

function createAnimation(game, animKey, animFrameSource, startFrame, endFrame, frameRate) {
    game.anims.create({
        key: animKey,
        frames: game.anims.generateFrameNumbers(animFrameSource, { start: startFrame, end: endFrame }),
        frameRate: frameRate,
        repeat: -1
    });
}

function collectVictims(zombie, victim, game) {
    newZombiePlace = newZombiePlace + 40;

    victim.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    addZombie();

    function addZombie() {
        zombieCountText.setText(++zombieCount);
        var newzombie = game.physics.add.sprite(300 - newZombiePlace, 880, 'zombie').setScale(2);
        newzombie.anims.play('right', true);
        game.physics.add.collider(newzombie, platforms);
        zombies.add(newzombie);
    }
}

function attackerOverlap(childZombie,attacker) {
    zombieCountText.setText(--zombieCount);
    newZombiePlace = childZombie.x;
    attacker.disableBody(true, true);
    childZombie.disableBody(true, true);
    zombies.remove(childZombie);
    
    if (zombies.getLength() == 0) {
        this.scene.start('gameOverScene');

    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}




var config = {
    type: Phaser.AUTO,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
    },
    scene: [GameScene, GameOverScene],
};
var game = new Phaser.Game(config);
