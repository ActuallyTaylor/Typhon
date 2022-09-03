
export class Sprite {
    
    // Takes an array of animations
    constructor(assetURL, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = loadImage(assetURL);
        this.image.resize(this.width, this.height);
    }

    draw() {
        image(this.image, this.x, this.y);
    }
}

