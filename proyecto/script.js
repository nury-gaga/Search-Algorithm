//Dimensiones del tablero a explorar
var rows = 50;
var cols = 50;
//Tablero
var grid = new Array(cols);

//Contiene los valores que se van a explorar
var openSet = [];
//Contiene los valores que ya se exploraron
var closedSet = [];
//Contiene el inicio del laberinto
var start;
//Contiene el final del laberinto
var end;
//Dimensiones adaptadas de la pantalla
var w, h;
//Contiene el camino trazado por el algoritmo A*
var path = [];
//Indica si continua buscando o no
var ciclo = true;

//Remueve un valor de un arreglo
//Se utiliza para extraer valores del openSet
function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

//Calcula la distancia entre dos puntos (h)
function heuristica(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  //var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

//Objeto que contiene lo necesario para el algoritmo A*
function Punto(i, j) {
  //Coordenadas del punto en el arreglo
  this.i = i;
  this.j = j;
  //Valores necesarios para el algoritmo A*
  this.f = 0;
  this.g = 0;
  this.h = 0;
  //Almacena los vecinos del punto
  this.vecinos = [];
  //Guarda al anterior punto para poder trazar eventualmente un camino
  this.anterior = undefined;
  //Indica si es muro
  this.muro = false;


  //Funcion encargada de pintar el punto
  this.show = function (col) {
    fill(col);
    if (this.muro) {
      fill(0);
    }
    noStroke();
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  //Funcion que carga los vecinos de cada punto del arreglo
  //Verificando que no se salgan de los bordes
  this.addVecinos = function (grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.vecinos.push(grid[i + 1][j]);
    }

    if (i > 0) {
      this.vecinos.push(grid[i - 1][j]);
    }

    if (j < rows - 1) {
      this.vecinos.push(grid[i][j + 1]);
    }

    if (j > 0) {
      this.vecinos.push(grid[i][j - 1]);
    }
  }
}


//Funcion inicial
function setup() {
  noLoop();
  //Crea el canvas donde se dibujará todo
  createCanvas(600, 600);
  console.log('A*');

  //Adapta las dimensiones del canvas con las del arreglo
  w = width / cols;
  h = height / rows;

  //Crea el arreglo de 2 dimensiones
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  //Inicializa cada valor del arreglo como objeto Punto
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Punto(i, j);

    }
  }

  //Busca los vecinos de cada punto del arreglo
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addVecinos(grid);

    }
  }

  //Genera el laberintp
  generarLaberinto();


  //Revisa por alguna entrada
  revisarPorEntradas();
  //en caso de que no se haya generado alguna entrada, no se inicia la busqueda
  if (start == null || end == null) {
    ciclo = false;
  }

  //En caso de que se haya encontrado una entrada se incluye en el openSet y desde ese punto se empieza.
  openSet.push(start);
}


//Verifica cada pared del laberinto generado en busca de entradas
//la primera encontrada se coloca en "start" y la segunda en "end"
function revisarPorEntradas() {
  let muro = null;
  let startChecked = false;
  let endChecked = false;
  //Revisa la pared iziquierda por entradas
  for (let i = 0; i < rows; i++) {
    if (!grid[0][i].muro && !startChecked) {
      start = grid[0][i];
      grid[1][i].muro = false;
      startChecked = true;
      continue;
    }

    if (!grid[0][i].muro && startChecked) {
      end = grid[0][i];
      grid[1][i].muro = false;
      endChecked = true;
    }

    if (endChecked) {
      return;
    }
  }

  //Revisa la pared derecha por entradas
  for (let i = 0; i < rows; i++) {
    if (!grid[rows - 1][i].muro && !startChecked) {
      start = grid[rows - 1][i];
      grid[rows - 2][i].muro = false;
      startChecked = true;
      continue;
    }

    if (!grid[rows - 1][i].muro && startChecked) {
      end = grid[rows - 1][i];
      grid[rows - 2][i].muro = false;
      endChecked = true;
    }

    if (endChecked) {
      return;
    }
  }

  //Revisa la pared superior por entradas
  for (let i = 0; i < rows; i++) {
    if (!grid[i][0].muro && !startChecked) {
      start = grid[i][0];
      grid[i][1].muro = false;
      startChecked = true;
      continue;
    }

    if (!grid[i][0].muro && startChecked) {
      end = grid[i][0];
      grid[i][1].muro = false;
      endChecked = true;
    }

    if (endChecked) {
      return;
    }
  }


  //Revisa la pared superior por entradas
  for (let i = 0; i < rows; i++) {
    if (!grid[i][rows - 1].muro && !startChecked) {
      start = grid[i][rows - 1];
      grid[i][rows - 2].muro = false;
      startChecked = true;
      continue;
    }

    if (!grid[i][rows - 1].muro && startChecked) {
      end = grid[i][rows - 1];
      grid[i][rows - 2].muro = false;
      endChecked = true;
    }

    if (endChecked) {
      return;
    }
  }


  return muro;
}

function iniciar() {
  loop();
}

function reiniciar() {
  openSet = [];
  closedSet = [];
  path = [];
  ciclo = true;
  end = null;
  start = null;

  //Crea el arreglo de 2 dimensiones
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  //Inicializa cada valor del arreglo como objeto Punto
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Punto(i, j);

    }
  }

  //Busca los vecinos de cada punto del arreglo
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addVecinos(grid);

    }
  }

  //Genera el laberintp
  generarLaberinto();


  //Revisa por alguna entrada
  revisarPorEntradas();
  //en caso de que no se haya generado alguna entrada, no se inicia la busqueda
  if (start == null || end == null) {
    ciclo = false;
  }
//aqui
  //En caso de que se haya encontrado una entrada se incluye en el openSet y desde ese punto se empieza.
  openSet.push(start);

  loop();
}

//Funcion de dibujo de la liberia p5.js
function draw() {

  //En caso de que se haya encontrado una entrada y una salida se inicia el proceso
  if (openSet.length > 0 && ciclo) {

    //Se extrae al menor punto basandonse en su variable f
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }


    var current = openSet[winner];

    //Si ese punto es igual al del final, se da por concluida la busqueda
    if (current === end) {
      noLoop();
      $('#finish').modal('show')
      console.log('Listo!');
    }

    //Se remueve del openSet y se pasa al closedSet
    removeFromArray(openSet, current);
    closedSet.push(current);

    //Se extraen sus vecinos para analizarlos
    var vecinos = current.vecinos;
    for (var i = 0; i < vecinos.length; i++) {
      var vecino = vecinos[i];


      //Se verifica que no este en closedSet(Quiere decir que ya se verificó con anterioridad)
      //Tambien se verifica que no sea muro
      if (!closedSet.includes(vecino) && !vecino.muro) {
        var tempG = current.g + 1;

        //Se calcula su g sumando 1 al punto del cual se extrajeron los vecinos
        //En caso de estar en el openSet (Algun punto proximo a revisarse) se actualiza su g solo si es menor
        //Lo que supondria que ese camino es mas corto
        if (openSet.includes(vecino)) {
          if (tempG < vecino.g) {
            vecino.g = tempG;
          }
        } else {
          //En caso de que no este en openSet, se inicia la g y se agrega a openSet
          vecino.g = tempG;
          openSet.push(vecino);
        }

        //Se calcula su heuristica con la formula de distancia entre dos puntos
        vecino.h = heuristica(vecino, end);
        //Se calcula la f sumando la g mas la h
        vecino.f = vecino.g + vecino.h;

        //Se le agrega el punto que se esta revisando a su punto anterior para poder trazar eventualmente una ruta de regreso
        //OJO:  El punto inicial no tiene punto anterior
        vecino.anterior = current;
      }
    }

  } else {
    noLoop();
    $('#noSolution').modal('show')
    console.log('No solution');
    //No hay solucion
  }


  background(0);


  //Pinta el grid
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  //Pinta los puntos que ya se analizaron
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(0, 255, 255));
  }

  //Pinta los puntos que quedan de analizar
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(255, 0, 0));
  }


  if (ciclo) {
    //Pinta el camino mas corto
    path = [];
    var temp = current;
    path.push(temp);
    try{
      while (temp.anterior) {
        path.push(temp.anterior);
        temp = temp.anterior;
      }
  
  
      for (var i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
      }
    }catch(error){
      
    }
    
  }
  if(start){
    start.show(color(0,255,0));
  }

  if(end){
    end.show(color(0,255,0));
  }

}

//Laberinto
function generarLaberinto() {
  agregarParedesExternas();
  var ent = agregarEntrada();
  agregarParedesInternas(true, 1, grid.length - 2, 1, grid.length - 2, ent);
}

//Genera las paredes exteriores del laberinto
function agregarParedesExternas() {
  for (var i = 0; i < grid.length; i++) {
    if (i == 0 || i == (grid.length - 1)) {
      for (var j = 0; j < grid.length; j++) {
        grid[i][j].muro = true;
      }
    } else {
      grid[i][0].muro = true;
      grid[i][grid.length - 1].muro = true;
    }
  }
}

//Genera una entrada de manera aleatoria
function agregarEntrada() {
  var x = numeroAleatorio(1, grid.length - 1);
  grid[grid.length - 1][x].muro = false;
  return x;
}

//Aqui empieza lo recursivo, genera paredes 
function agregarParedesInternas(h, minX, maxX, minY, maxY, gate) {
  if (h) {

    if (maxX - minX < 2) {
      return;
    }

    var y = Math.floor(numeroAleatorio(minY, maxY) / 2) * 2;
    //Genera una pared horizonral
    agregarParedH(minX, maxX, y);

    agregarParedesInternas(!h, minX, maxX, minY, y - 1, gate);
    agregarParedesInternas(!h, minX, maxX, y + 1, maxY, gate);
  } else {
    if (maxY - minY < 2) {
      return;
    }

    var x = Math.floor(numeroAleatorio(minX, maxX) / 2) * 2;
    //Genera una pared vertical
    agregarParedV(minY, maxY, x);

    agregarParedesInternas(!h, minX, x - 1, minY, maxY, gate);
    agregarParedesInternas(!h, x + 1, maxX, minY, maxY, gate);
  }
}

//Genera una pared horizonral
function agregarParedH(minX, maxX, y) {
  var avertura = Math.floor(numeroAleatorio(minX, maxX) / 2) * 2 + 1;

  for (var i = minX; i <= maxX; i++) {
    if (i == avertura) {
      grid[y][i].muro = false;
    }
    else {
      grid[y][i].muro = true;
    }
  }
}

//Genera una pared vertical
function agregarParedV(minY, maxY, x) {
  var avertura = Math.floor(numeroAleatorio(minY, maxY) / 2) * 2 + 1;

  for (var i = minY; i <= maxY; i++) {
    if (i == avertura) {
      grid[i][x].muro = false;
    }
    else {
      grid[i][x].muro = true;
    }
  }
}

//Genrea un numero aleatorio
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


