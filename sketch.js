var capture;
var img;
var img_new;

var rouge;
var vert;
var bleu;

let color_select = false;

let w = 640;
let h = 680;

let canvas;


let d_max = 40;

const capturer = new CCapture({
  framerate: 24,
  format: "webm",
  name: "ma_video",
  quality: 100,
  verbose: true,

})


function preload() {
  capture = createCapture(VIDEO);
  img = loadImage('assets/time.jpg');


}

function setup() {
  my_canvas = createCanvas(w, h);
  frameRate(24);
  capture.hide();
  pixelDensity(1);
  img_new = createImage(640, 480);
  start();
  stop_save();
  slid();
  


}

function draw() {
  if (frameCount === 1) capturer.start();

  img.loadPixels();
  capture.loadPixels(); // permet de chargé les donnée des pixels de la vidéo //
  img_new.loadPixels();

  for (var ligne = 0; ligne < h; ligne = ligne + 1) { // permet de parcourir tous les pixels de l’image comme une immense suite de pixels mis bout à bout sur une même ligne//
    for (var col = 0; col < w; col = col + 1) { // La première boucle for s’occupe de scanner ligne par ligne. La deuxième   boucle for va littéralement scanner chacune des colonnes au sein de chacune des lignes//

      var indexPixel = (w * ligne + col) * 4; // cette variable   //




      if (color_select) {

        let d_calc = dist(rouge, vert, bleu, capture.pixels[indexPixel], capture.pixels[indexPixel + 1], capture.pixels[indexPixel + 2]);

        if (d_calc < d_max) {
          img_new.pixels[indexPixel] = img.pixels[indexPixel];
          img_new.pixels[indexPixel + 1] = img.pixels[indexPixel + 1];
          img_new.pixels[indexPixel + 2] = img.pixels[indexPixel + 2];
          img_new.pixels[indexPixel + 3] = img.pixels[indexPixel + 3];

        } else {

          img_new.pixels[indexPixel] = capture.pixels[indexPixel];
          img_new.pixels[indexPixel + 1] = capture.pixels[indexPixel + 1];
          img_new.pixels[indexPixel + 2] = capture.pixels[indexPixel + 2];
          img_new.pixels[indexPixel + 3] = capture.pixels[indexPixel + 3];
        }






      } else {

        img_new.pixels[indexPixel] = capture.pixels[indexPixel];
        img_new.pixels[indexPixel + 1] = capture.pixels[indexPixel + 1];
        img_new.pixels[indexPixel + 2] = capture.pixels[indexPixel + 2];
        img_new.pixels[indexPixel + 3] = capture.pixels[indexPixel + 3];






      }

    }
  }


  img_new.updatePixels(); // permet d'actualiser les modification apporté au pixels  //
  capturer.capture(my_canvas.canvas);
  image(img_new, 0, 0);

  if (frameCount === 200) {

    noLoop();
    capturer.stop();
    capturer.save();
  }

  if (mouseY < 450) {
    c = get(mouseX, mouseY);
    fill(c);
    circle(mouseX + 15, mouseY + 15, 25);
  }
  

}



function mouseClicked() {
  color_select = get(mouseX, mouseY);
  rouge = red(color_select);
  vert = green(color_select);
  bleu = blue(color_select);




  background(get(mouseX, mouseY));
  textSize(32);
  fill(0);
  text("R:", 10, 525);
  text(rouge, 60, 525);

  text("G:", 10, 580);
  text(vert, 60, 580);
  text("B:", 10, 640);
  text(bleu, 60, 640);



}

function stop_save(){

  button = createButton('Stop');
  button.position(578, 600);
  button.mousePressed();
  
}

function start(){

  button = createButton('Start');
  button.position(570, 570);
  button.mousePressed();



}

function slid(){

  slider = createSlider(0, 255, 100);
  slider.position(500,510);
  slider.style('width', '80px');




}



