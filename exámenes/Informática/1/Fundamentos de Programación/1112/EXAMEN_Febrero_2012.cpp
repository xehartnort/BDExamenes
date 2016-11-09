#include <iostream>
#include <string>
#include <vector>
#include <cctype>
using namespace std;

//////////////////////////////////////////////////////////////////////////////////////
   /* 
   Palíndromo:
     El algoritmo es muy parecido al visto en clase. 
     Únicamente hay que tener en cuenta los espacios en blanco y las mayúsculas      
   */

class MiVectorCaracteres{
private:
   vector<char> vector_privado;
public:
   bool EsPalindromo(int izda, int dcha){
		if (izda >= dcha)
			return true;
		else if (vector_privado[izda] == ' ')
         return EsPalindromo(izda+1, dcha);
      else if (vector_privado[dcha] == ' ')
         return EsPalindromo(izda, dcha-1);
      else if (toupper(vector_privado[izda]) == toupper(vector_privado[dcha]))
         return EsPalindromo(izda+1, dcha-1);
		else
			return false;
	}

   // Los siguientes métodos no había que implementarlos. Sólo se pedía el método EsPalindromo

   int TotalUtilizados(){
      return vector_privado.size();
   }
   void Aniade (string cadena){
      int util_cadena = cadena.size();

      for (int i=0; i < util_cadena; i++)
         vector_privado.push_back(cadena[i]);
   }
	char Elemento(int indice){  
		return vector_privado[indice];
   }
};
   

//////////////////////////////////////////////////////////////////////////////////////

   /*
   Unión e Intersección de conjuntos ordenados.
   */

   
   class Conjunto{
   /*
   Fallos habituales en cuanto al diseño de la clase Conjunto:

   - Almacenar como datos miembros, el conjunto original, el otro, la unión y la intersección.
     Sólo almacenamos un vector que representa un conjunto. En el main, tendremos
     varios OBJETOS de la clase Conjunto (los objetos uno, otro, union e interseccion)

   - Que el método Union/Interseccion se le pasen como parámetros dos conjuntos.
     Sólo hay que pasarle un único parámetro, que será el otro conjunto sobre
     el que se realizará la unión/intersección.

   - Que el método Union/Interseccion devuelva un vector <char>
     El método debe devolver otro Conjunto y no un vector de char
     que es el tipo del dato miembro privado.
     Los métodos de la clase deben ocultar la implementación interna,
     por lo que no pueden "desvelar" el tipo del dato miembro privado.
     Además, al devolver un Conjunto, podemos realizar con este nuevo
     conjunto todas las operaciones disponibles en la clase. 
   */
private:
   vector <int> conjunto;
public:
   Conjunto(){
   }

   void Aniade(int nuevo){
      conjunto.push_back(nuevo);
   }

   int TotalElementos(){
      return conjunto.size();
   }

   int Elemento(int indice){
      return conjunto.at(indice);
   }

    // Precondición: otro_conjunto debe estar ordenado
   Conjunto Union (Conjunto otro_conjunto){
      /*
         Llamaremos "uno" al vector de datos del objeto (conjunto)
         "otro" al vector pasado como parámetro y
         "union" al vector que guarda la unión.

         Algoritmo 1.
            Inicializar union con todos los datos de uno
            Por cada componente del vector union, ver si está en otro.
               En caso de que no esté, añadirla al final de union.

         Este algoritmo no es correcto ya que el resultado no estará ordenado.
         Si se ha implementado este algoritmo la puntuación de la pregunta es 0.

         Algoritmo 2.
            Inicializar union con todos los datos de uno
            Recorrer cada componente del vector otro e insertarla
               de forma ordenada en union.
         
         El algoritmo 2 es ineficiente ya que tiene que ir desplazando
         muchas componentes cada vez que añade un valor nuevo a la unión.
         Si se ha implementado este algoritmo la puntuación máxima de la pregunta es 6.

         Algoritmo 3.
            Mientras no se llegue al final de uno u otro
               Comparamos las componentes i, j de uno y otro, respectivamente
                  Añadimos a union la componente que sea menor y avanzamos
                  la componente (i/j) del otro vector (el que no se ha añadido)

                  Si las componentes son iguales, añadimos la componente
                  y avanzamos los dos vectores.
            Volcamos el resto del vector que no se ha terminado de recorrer.
      */

      int tope_propio, tope_otro;
      int i, j;
      Conjunto union_ambos;

      tope_propio = conjunto.size();
      tope_otro = otro_conjunto.TotalElementos();
      i = j = 0;

      while (i < tope_propio && j < tope_otro){
         if (conjunto.at(i) == otro_conjunto.Elemento(j)){
            union_ambos.Aniade(conjunto.at(i));
            i++;
            j++;
         }
         else if (conjunto.at(i) < otro_conjunto.Elemento(j)){
            union_ambos.Aniade(conjunto.at(i));
            i++;
         }
         else{
            union_ambos.Aniade(otro_conjunto.Elemento(j));
            j++;
         }
      }

      for (int restan=i; restan < tope_propio; restan++)
         union_ambos.Aniade(conjunto.at(restan));

      for (int restan=j; restan < tope_otro; restan++)
         union_ambos.Aniade(otro_conjunto.Elemento(restan));

      return union_ambos;
   }


   // Precondición: otro_conjunto debe estar ordenado
   Conjunto Interseccion(Conjunto otro_conjunto){
      /*
         Llamaremos "uno" al vector de datos del objeto (conjunto)
         "otro" al vector pasado como parámetro e
         "interseccion" al vector que guarda la intersección.

         Algoritmo 1.
            Recorrer todas las componentes de uno
               Ver si dicha componente está en otro.
               En caso afirmativo, añadirla a interseccion.

         El algoritmo 1 realiza una intersección entre dos vectores cualesquiera
         pero no aprovecha el hecho de que los vectores ya están ordenados,
         por lo que puede hacerse más eficiente.
         Si se ha implementado este algoritmo la puntuación máxima de la pregunta es 6.
         
         Algoritmo 2.
            Mientras no se llegue al final de uno u otro
               Comparamos las componentes i, j de uno y otro, respectivamente
                  Si las componentes son iguales, añadimos la componente
                     y avanzamos los dos vectores.
                  En otro caso, avanzamos la posición del vector
                     que contenga la componente menor. 
      */

      int tope_propio, tope_otro;
      int i, j;
      Conjunto interseccion;


      tope_propio = conjunto.size();
      tope_otro = otro_conjunto.TotalElementos();
      i = j = 0;

      while (i < tope_propio && j < tope_otro){
         if (conjunto.at(i) == otro_conjunto.Elemento(j)){
            interseccion.Aniade(conjunto.at(i));
            i++;
            j++;
         }
         else if (conjunto.at(i) < otro_conjunto.Elemento(j))       
            i++;
         else
            j++;
      }

      return interseccion;
   }

  

};

class LectorConjuntos{
public:
   Conjunto Lee(){
      int total, dato;
      Conjunto conjunto;

      cout << "\nIntroduzca el número de elementos del conjunto ";
      cin >> total;
      cout << "\nIntroduzca ahora los elementos del conjunto\n";

      for (int i=0; i<total; i++){
         cin >> dato;
         conjunto.Aniade(dato);
      }

      return conjunto;
   }
};


class ImpresorConjuntos{
public:
   void Imprime(Conjunto un_conjunto, string mensaje){
      int total = un_conjunto.TotalElementos();

      cout << mensaje;

      for (int i=0; i<total; i++){        
         cout << un_conjunto.Elemento(i);
      }      
   }
};


//////////////////////////////////////////////////////////////////////////////////////
/*
   Sopa:

   -  La traspuesta es un ejercicio muy sencillo.
      Lo único importante es darse cuenta que el método Traspuesta debe devolver una Sopa.
      La forma de construirla es ir construyendo un vector con los elementos de la cada columna
      de la sopa original y añadir dicho vector como una nueva fila de la traspuesta. 

   -  La búsqueda de la diagonal es, evidentemente, el ejercicio más difícil del examen.
         Mientras el resto de ejercicios están pensados para que el alumno pueda
         aprobar siempre y cuando se tenga una soltura "suficiente" en Programación, 
         este es el ejercicio que al menos hay que intentar hacer 
         para poder conseguir un Sobresaliente.
*/

//   Los siguientes tipos de dato (enum y struct) no son necesarios para la traspuesta


enum SentidoDiagonal {diag1_abajo, diag1_arriba, diag2_abajo, diag2_arriba};

struct Posicion{
   int fila;
   int columna;
   SentidoDiagonal direccion;
};

struct Diagonal{
   int incremento_fila;
   int incremento_columna;
   SentidoDiagonal sentido_diagonal;
};

class Sopa{
private: 
   vector < string > sopa;
   int num_columnas;
public:
   Sopa(int numero_columnas)
      :num_columnas(numero_columnas)
   {   }

   void Aniade(string cadena){
      if (cadena.size() == num_columnas)
         sopa.push_back(cadena);
   }
   
   Sopa Traspuesta(){
      int tope_filas = sopa.size();      
      Sopa traspuesta(tope_filas);   // Tope de columnas en la traspuesta = número de filas de la sopa original

      for (int col=0; col < num_columnas; col++){
         string nueva_fila;
         
         for (int fil=0; fil < tope_filas; fil++)
            nueva_fila.push_back(sopa.at(fil).at(col));
         
         traspuesta.Aniade(nueva_fila);
      }
   
      return traspuesta;
   }


   Posicion EncontrarDiagonal (string a_buscar){
      /*
         Para indicar la posición en la que se ha encontrado la cadena usamos el struct Posicion
         que contiene la fila y columna inicial (-1 si no se encuentra) y un enumerado indicando la diagonal correspondiente.
         También se podría haber usado un entero en vez de un enumerado, pero queda más "elegante" hacerlo así.
         
         Lo importante a darse cuenta en este ejercicio es que 
         lo que varía en las búsquedas en cada diagonal son los incrementos
         a realizar en los recorridos:
            - En la la diagonal 1, hacia abajo, los incrementos son: filas+1, columnas+1
            - En la la diagonal 1, hacia arriba, los incrementos son: filas-1, columnas-1
            - En la la diagonal 2, hacia abajo, los incrementos son: filas+1, columnas-1
            - En la la diagonal 2, hacia arriba, los incrementos son: filas-1, columnas+1
              
         Algoritmo 1.
            Recorrer todas las componentes i,j de la sopa
               Fijar la componente actual i,j como punto de partida para buscar la cadena
               Realizar las siguientes búsquedas, parando en cuanto se encuentre la cadena:
                  Buscar en la diagonal 1, hacia abajo
                  Buscar en la diagonal 1, hacia arriba
                  Buscar en la diagonal 2, hacia abajo
                  Buscar en la diagonal 2, hacia arriba

         Si implementamos el algoritmo 1 tal cual, repetiríamos bastante código ya que 
         los bucles de búsqueda en cada una de las 4 diagonales serían muy parecidos.
         
         En cualquier caso, el alumno que lo haya hecho correctamente
         (hay que tener cuidado con no pasarnos de las componentes utlizadas)
         aún repitiendo código, puede sacar la máxima nota (10)

         Una solución para no duplicar código sería definir un único bucle de búsqueda, e ir cambiando
         apropiadamente los incrementos a realizar en cada una de las diagonales. 
         Nos quedaría:

         Algoritmo 2.
            Recorrer todas las componentes i,j de la sopa
               Fijar la componente actual i,j como punto de partida para buscar la cadena                  
               
               Recorrer las cuatro diagonales posibles,
               estableciendo los incrementos a realizar en cada una de ellas
               y parando en cuanto se encuentre la cadena.
                   
                   Buscar en la diagonal correspondiente.

         Para fijar cada una de las cuatro diagonales, podemos definir un vector
         de 4 componentes de tipo struct, en la forma siguiente:

         {(diag1_abajo,-1,-1) , (diag1_arriba, -1, -1), (diag2_abajo, 1, -1), (diag2_arriba, -1, 1)}

      */      
      
      bool encontrado;
      bool hay_componentes;
      int primera_fila, primera_columna;
      int fila, columna;
      int tope_fila, tope_columna;
      int ultima_fila, ultima_columna;
      Diagonal diagonales[4];    
      Posicion posicion_encontrado;
      int num_letras_a_buscar;

      posicion_encontrado.columna = -1;
      posicion_encontrado.fila = -1;
      posicion_encontrado.direccion = diag1_abajo;

      diagonales[0].sentido_diagonal = diag1_abajo;
      diagonales[0].incremento_fila = 1;
      diagonales[0].incremento_columna = 1;

      diagonales[1].sentido_diagonal = diag1_arriba;
      diagonales[1].incremento_fila = -1;
      diagonales[1].incremento_columna = -1;

      diagonales[2].sentido_diagonal = diag2_abajo;
      diagonales[2].incremento_fila = 1;
      diagonales[2].incremento_columna = -1;

      diagonales[3].sentido_diagonal = diag2_arriba;
      diagonales[3].incremento_fila = -1;
      diagonales[3].incremento_columna = 1;

      num_letras_a_buscar = a_buscar.size();
      encontrado = false;
      hay_componentes = true;
      tope_fila = sopa.size();
      tope_columna = num_columnas;
    

      for (primera_fila = 0; !encontrado && primera_fila < tope_fila; primera_fila++){

         for (primera_columna = 0; !encontrado && primera_columna < tope_columna; primera_columna++){

            for (int diagonal = 0; diagonal < 4 && !encontrado; diagonal++){

               ultima_fila = primera_fila + (num_letras_a_buscar - 1) * diagonales[diagonal].incremento_fila;
               ultima_columna = primera_columna + (num_letras_a_buscar - 1) * diagonales[diagonal].incremento_columna;

               if (0 <= ultima_fila && 0 <= ultima_columna && ultima_fila < tope_fila && ultima_columna < tope_columna){
                  fila = primera_fila;
                  columna = primera_columna;
             
                  bool coincidencia_parcial = true;
                  int i;

                  for (i = 0; coincidencia_parcial && !encontrado && i < num_letras_a_buscar; i++){          
                     if (sopa.at(fila).at(columna) == a_buscar[i]){
                        fila = fila + diagonales[diagonal].incremento_fila;
                        columna = columna + diagonales[diagonal].incremento_columna;
                     }
                     else 
                        coincidencia_parcial = false;            
                  }

                  if (i == num_letras_a_buscar){
                        encontrado = true;
                        posicion_encontrado.fila = primera_fila;
                        posicion_encontrado.columna = primera_columna;
                        posicion_encontrado.direccion = diagonales[diagonal].sentido_diagonal;
                  }
               }
            }
         }
      }


      return posicion_encontrado;
   }
};

int main(){
   MiVectorCaracteres cadena;
   bool es_palindromo;

   cadena.Aniade("   H  o j   O hh");
   es_palindromo = cadena.EsPalindromo(0, cadena.TotalUtilizados()-1);

   if (es_palindromo)
      cout << "\nEs palíndromo";
   else
      cout << "\nNo es palíndromo";


   /*
   string cadena;
   Sopa sopa(3);   
   Posicion posicion_buscar;

   cadena = "abc";
   sopa.Aniade(cadena);
   cadena = "ghd";
   sopa.Aniade(cadena);

   posicion_buscar = sopa.EncontrarDiagonal("db");

   cout << posicion_buscar.fila << " " << posicion_buscar.columna << " " << posicion_buscar.direccion;
   */


   /*
   Conjunto uno, otro, union_ambos, interseccion;
   LectorConjuntos lector;
   ImpresorConjuntos impresor;

   uno = lector.Lee();
   otro = lector.Lee();

   union_ambos = uno.Union(otro);
   interseccion = uno.Interseccion(otro);

   impresor.Imprime(union_ambos, "\nElementos de la unión:\n");
   impresor.Imprime(interseccion, "\nElementos de la intersección:\n");
   */

   // uno.Aniade(1);
   // uno.Aniade(2);
   // uno.Aniade(5);
   // otro.Aniade(1);
   // otro.Aniade(3);
   // otro.Aniade(5);
}
