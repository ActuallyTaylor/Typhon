
export class Sprite {
    
    // Takes an array of animations
    constructor(assetURL, x, y, width, height, flipped) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = loadImage(assetURL);
        this.image.resize(this.width, this.height);
        this.flipped = flipped
    }

    draw() {
        this.image.resize(this.width, this.height);
        image(this.image, this.x, this.y);
    }
}

