// =============================================================================
// 精灵
// =============================================================================

//
// 英雄
//

function Hero(game, x, y) {
    // 调用Phaser.Sprite构造函数
    Phaser.Sprite.call(this, game, x, y, 'hero');

    // 锚
    this.anchor.set(0.5, 0.5);
    // 物理属性
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    // 动画
    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    this.animations.add('die', [5, 6, 5, 6, 5, 6, 5, 6], 12); // 12fps no loop
    // 开始动画
    this.animations.play('stop');
}

// 继承自Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    // 守卫
    if (this.isFrozen) { return; }

    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;

    // 更新图像翻转和动画
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 400;
    let canJump = this.body.touching.down && this.alive && !this.isFrozen;

    if (canJump || this.isBoosting) {
        this.body.velocity.y = -JUMP_SPEED;
        this.isBoosting = true;
    }

    return canJump;
};

Hero.prototype.stopJumpBoost = function () {
    this.isBoosting = false;
};

Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype.update = function () {
    // 更新精灵动画，如果它需要改变的话
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Hero.prototype.freeze = function () {
    this.body.enable = false;
    this.isFrozen = true;
};

Hero.prototype.die = function () {
    this.alive = false;
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// 返回应该播放的动画名称，这取决于当前情况
Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // 死亡
    if (!this.alive) {
        name = 'die';
    }
    // 冻结而非死
    else if (this.isFrozen) {
        name = 'stop';
    }
    // 跳
    else if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // 下落
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

//
// 蜘蛛（敌人）
//

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // 锚
    this.anchor.set(0.5);
    // 动画
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // 物理属性
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

// 继承自Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // 靠墙检查，如有必要，可调转方向
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// =============================================================================
// 加载状态
// =============================================================================

LoadingState = {};

LoadingState.init = function () {
    // 保持脆皮的像素
    this.game.renderer.renderSession.roundPixels = true;
};

LoadingState.preload = function () {
    this.game.load.json('level:0', 'data/level00.json');
    this.game.load.json('level:1', 'data/level01.json');

    this.game.load.image('font:numbers', 'images/numbers.png');

    this.game.load.image('icon:coin', 'images/coin_icon.png');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('key', 'images/key.png');

    this.game.load.spritesheet('decoration', 'images/decor.png', 42, 42);
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    this.game.load.audio('bgm', ['audio/bgm.mp3', 'audio/bgm.ogg']);
};

LoadingState.create = function () {
    this.game.state.start('play', true, false, {level: 0});
};

// =============================================================================
// 游戏状态
// =============================================================================

PlayState = {};

const LEVEL_COUNT = 2;

PlayState.init = function (data) {
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.coinPickupCount = 0;
    this.hasKey = false;
    this.level = (data.level || 0) % LEVEL_COUNT;
};

PlayState.create = function () {
    // 褪色（从黑色开始）
    this.camera.flash('#000000');

    // 创建声音实体
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        key: this.game.add.audio('sfx:key'),
        stomp: this.game.add.audio('sfx:stomp'),
        door: this.game.add.audio('sfx:door')
    };
    this.bgm = this.game.add.audio('bgm');
    this.bgm.loopFull();

    // 创建水平实体和装饰
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

    // 创建UI记分板
    this._createHud();
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();

    // 更新计分板
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
};

PlayState.shutdown = function () {
    this.bgm.stop();
};

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);

    // 英雄VS钱币(拾取)
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    // 英雄对钥匙(拾取)
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this);
    // 英雄对门（终级）
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // 如果没有钥匙或播放器正在播放，则忽略。
        function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        }, this);
    // 碰撞：英雄对敌人（杀或死）。
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, null, this);
};

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // 向左移动英雄
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // 向右移动英雄
        this.hero.move(1);
    }
    else { // 停止
        this.hero.move(0);
    }

    // 手柄跳跃
    const JUMP_HOLD = 200; // ms
    if (this.keys.up.downDuration(JUMP_HOLD)) {
        let didJump = this.hero.jump();
        if (didJump) { this.sfx.jump.play(); }
    }
    else {
        this.hero.stopJumpBoost();
    }
};

PlayState._onHeroVsKey = function (hero, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};

PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
    this.coinPickupCount++;
};

PlayState._onHeroVsEnemy = function (hero, enemy) {
    // 英雄在下落时可以杀死敌人（在跳跃或下落后）。
    if (hero.body.velocity.y > 0) {
        enemy.die();
        hero.bounce();
        this.sfx.stomp.play();
    }
    else { // 游戏结束-->播放死亡动画并重新开始游戏
        hero.die();
        this.sfx.stomp.play();
        hero.events.onKilled.addOnce(function () {
            this.game.state.restart(true, false, {level: this.level});
        }, this);

        // 注意：Phaser中的错误，它在检查重叠时修改了 "触摸"。这将撤消这一修改，这样蜘蛛就不会 在英雄身上 "弹跳"。
        enemy.body.touching = enemy.body.wasTouching;
    }
};

PlayState._onHeroVsDoor = function (hero, door) {
    // 通过改变门的图形和播放音效来 "打开 "门。
    door.frame = 1;
    this.sfx.door.play();

    // 播放 "进门 "动画，并在动画结束后转入下一关。
    hero.freeze();
    this.game.add.tween(hero)
        .to({x: this.door.x, alpha: 0}, 500, null, true)
        .onComplete.addOnce(this._goToNextLevel, this);
};

PlayState._goToNextLevel = function () {
    this.camera.fade('#000000');
    this.camera.onFadeComplete.addOnce(function () {
        // 改为下一级别
        this.game.state.restart(true, false, {
            level: this.level + 1
        });
    }, this);
};

PlayState._loadLevel = function (data) {
    // 创建我们需要的所有组/层
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;

    // 生成英雄和敌人
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});

    // 生成等级装饰
    data.decoration.forEach(function (deco) {
        this.bgDecoration.add(
            this.game.add.image(deco.x, deco.y, 'decoration', deco.frame));
    }, this);

    // 生成平台
    data.platforms.forEach(this._spawnPlatform, this);

    // 生成重要对象
    data.coins.forEach(this._spawnCoin, this);
    this._spawnKey(data.key.x, data.key.y);
    this._spawnDoor(data.door.x, data.door.y);

    // 启用重力
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnCharacters = function (data) {
    // 生成蜘蛛
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);

    // 生成英雄
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    // 平台精灵的物理
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    // 在两边产生看不见的墙，只被敌人发现
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // 锚和Y位移
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // 物理属性
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    // 物理学的（所以我们可以检测到与英雄的重叠）。
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    // 动画
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    // 启用物理来检测碰撞，这样英雄就可以捡到钥匙了。
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;

    // 通过Tween添加一个小的 "向上和向下 "动画
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};

PlayState._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);

    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
    this.hud.position.set(10, 10);
};

// =============================================================================
// 入口点
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.add('loading', LoadingState);
    game.state.start('loading');
};