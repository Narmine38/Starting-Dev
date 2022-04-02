let capture; // image issue du stream webcam
let img; // image de fond
let img_new; // image transformée


let diam = 50; // diametre de la bulle afichant la couleur
let w = 640; // largeur (width)
let h = 480; // hauteur (height)
let h2 = 100; // hauteur #2 (utilisé pour placer le cadre sous la webcam)
let gap = 5; // espace utilisé pour séparer deux objets sur le canevas


let color_curr; // couleur du pixel se trouvant sous la souris
let color_select = false; // couleur sélectionnée (avec un click de souris)


let d_calc; // distance calculée entre deux couleurs (entre color_select et un autre pixel de la capture)
let d_max = 50; // distance max entre deux couleurs
let slider_dmax; // slider permettant d'ajuster la valeur de d_max
let dmax_text; // texte affichant la valeur de slider_dmax

let vid;
let canvas;
let button;

const capturer = new CCapture({
  framerate: 24,
  format: "webm",
  name: "ma_video",
  quality: 100,
  verbose: true,

})


function preload() {

  img = loadImage('assets/time.jpg');

  capture = createCapture(VIDEO);
  capture.hide();
  
}

function setup() {

  vid = createVideo(
    ['assets/Support-situation-1.mp4'],
    vidLoad
  );

  vid.size(w, h);

    my_canvas = createCanvas(w, h);
    frameRate(24);

    createCanvas(w, h+h2+2*gap);
    pixelDensity(1);

    img_new = createImage(w, h);

    slider_dmax = createSlider(0, 442, d_max, 1);
    slider_dmax.position(w/2, h+gap+h2/2);
    slider_dmax.style("width", w/2);
    slider_dmax.hide(); // on cache le slider tant qu'on a pas encore sélectionné de couleur

    button = createButton('Start');
    button.position(500, 500);
    button.mousePressed(start);

    button = createButton('Stop');
    button.position(500, 530);
    button.mousePressed(stop_save);


 
  
}

function draw() {
  background(225);
  
  img.loadPixels();
  img_new.loadPixels();
  capture.loadPixels();
  vid.loadPixels();

  

  // Parcours du tableau de pixels
  for( let row = 0; row < h; row += 1){
      for( let col = 0; col < w; col += 1){

          // on recupère le pixel situé à l'intersection
          // de l'index 'row' et de l'index 'col'
          let i = (row*w + col) * 4;

          if (color_select) { // si on a choisit une couleur (avec un click de souris), alors...

              // composantes RGB du pixel de la webcam sur lequel on est en train de boucler
              let R1 = capture.pixels[i + 0];
              let G1 = capture.pixels[i + 1];
              let B1 = capture.pixels[i + 2];

              // composantes RGB du pixel sélectionné
              let R2 = color_select[0];
              let G2 = color_select[1];
              let B2 = color_select[2];

              // on calcule la distance entre le pixel en cours de couleur [R1, G1, B1] et le pixel sélectionné de couleur [R2, G2, B2]
              d_calc = calculateDistance(R1, G1, B1, R2, G2, B2);
              // d_calc = dist(R1, G1, B1, R2, G2, B2) // autre manière de faire en utilisant la fonction 'dist()'

              if (d_calc < d_max) { // si la distance calculée est inférieure à d_max...
                  img_new.pixels[i + 0] = vid.pixels[i + 0]; // composante rouge de l'image de fond
                  img_new.pixels[i + 1] = vid.pixels[i + 1]; // composante verte de l'image de fond
                  img_new.pixels[i + 2] = vid.pixels[i + 2]; // composante bleue de l'image de fond
                  img_new.pixels[i + 3] = vid.pixels[i + 3]; // composante alpha de l'image de fond
              } else { // sinon...
                  img_new.pixels[i + 0] = capture.pixels[i + 0]; // composante rouge de la webcam
                  img_new.pixels[i + 1] = capture.pixels[i + 1]; // composante verte de la webcam
                  img_new.pixels[i + 2] = capture.pixels[i + 2]; // composante bleue de la webcam
                  img_new.pixels[i + 3] = capture.pixels[i + 3]; // composante alpha de la webcam
              }

          } else { // sinon, si on a pas encore choisi de couleur (ie: color_select==false)...
              img_new.pixels[i + 0] = capture.pixels[i + 0]; // composante rouge de la webcam
              img_new.pixels[i + 1] = capture.pixels[i + 1]; // composante verte de la webcam
              img_new.pixels[i + 2] = capture.pixels[i + 2]; // composante bleue de la webcam
              img_new.pixels[i + 3] = capture.pixels[i + 3]; // composante alpha de la webcam
          }
      }
  }

  // on met à jour les pixels de l'image transformée
  img_new.updatePixels();
  
  // on affiche l'image transformée sur le canevas
  let img_new_posX = 0;
  let img_new_posY = 0;
  image(img_new, img_new_posX, img_new_posY);

  // affichage de la bulle servant de 'color picker'
  if (mouseIsInside(img_new_posX, img_new_posY, img_new.width, img_new.height)) { // si la souris se trouve à l'intérieur de img_new, alors...
      // utiliser la couleur sous la souris comme couleur de remplissage (fill)
      color_curr = get(mouseX, mouseY);
      fill(color_curr);
      // epaisseur et couleur du trait
      strokeWeight(3);
      stroke(invertColor(color_curr));
      // desiner une ellipse avec un diametre 'd'
      ellipse(mouseX + diam / 2, mouseY + diam / 2, diam);
  }

  // création et mise à jour du cadre nous informant sur la couleur sélectionnée
  if (color_select) { // si j'ai choisi une couleur (click de souris sur l'image), alors...

      // création du rectangle
      noStroke();
      fill(color_select);
      rect(0, h+gap, w, h2);

      // ajout de texte nous informant sur la valeur des composantes RGBA de la couleur sélectionnée
      fill(invertColor(color_select));
      textSize(18);
      textAlign(LEFT, CENTER);
      text(showColor(color_select), gap, h+gap+h2/2);

      // affichage du slider permettant de changer la valeur de d_max
      slider_dmax.show();
      d_max = slider_dmax.value();
      textSize(18);
      textAlign(LEFT, CENTER);
      d_txt = text("d(max) = " + d_max, 0.65 * w, h + gap + 0.75 * h2)

  }

  capturer.capture(my_canvas.canvas);

  
  //////////////////////
  // Boucle terminée! //
  //////////////////////
}


// fonction permettant de déterminer si la souris se trouve à l'intérieur d'une zone donnée
function mouseIsInside(x1, y1, x2, y2) {
  return (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2);
}


// fonction permettant de récupérer l'événement 'click de souris'
function mouseClicked() {
  if (mouseIsInside(0, 0, w, h)) {
      color_select = get(mouseX, mouseY);
      print("couleur choisie: ", color_select);
  }
}

// fonction permettant de récupérer le négatif d'une couleur
function invertColor(color) {
  return [255-color[0], 255-color[1], 255-color[2], 255];
}


// fonction permettant d'afficher les composantes RGBA de manière intelligible
function showColor(color) {
  let R = "R: " + str(color[0]) + "\n";
  let G = "G: " + str(color[1]) + "\n";
  let B = "B: " + str(color[2]) + "\n";
  let A = "A: " + str(color[3]);
  return R + G + B + A;
}


// fonction permettant de calculer une distance euclidienne en 3 dimensions
function calculateDistance(x1, y1, z1, x2, y2, z2) {
  return sqrt(sq(x1-x2) + sq(y1-y2) + sq(z1-z2));
}

function start(){

  capturer.start();

}

function stop_save(){

  capturer.stop();
  capturer.save();

}

function vidLoad(){

  vid.loop();
  vid.volume(0);


}


