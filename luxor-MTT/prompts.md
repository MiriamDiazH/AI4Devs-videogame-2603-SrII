# Registro de Prompts - Desarrollo de Luxor 3 Web

A continuación se documenta el historial de prompts (instrucciones) proporcionados al asistente durante el proceso de desarrollo del juego.

## 1. Ideación y Requisitos Iniciales
**Prompt del usuario:**
> Aplicando las técnicas de prompt engineering, quiero que generes un prompt que pueda utilizar para crear un videojuego en html, css, javascript y otros archivos de imagen y sonido para poder cargarlo en un navegador web.
> El juego elegido es Luxor 3. Quiero hacer una adaptación de este juego, generando 3 niveles, canción de fondo, sonidos especiales e imágenes en alta definición.
> Igual que en el juego original, ha de haber un sistema de puntuación, tiempo y poderes.

## 2. Definición de Arquitectura, Librerías y Estrategia por Fases
**Prompt del usuario:**
> La raíz del proyecto es `/luxor-MTT`. Ahí es donde se ha de crear el arbol de archivos.
> No hay restricciones en el uso de librerías como Phaser o la que se considere que puede ser útil para hacer el juego más ligero y óptimo.
> En cuanto a las imágenes, las que son de fondo de cada nivel, tendrán una parte decorativa y otra funcional, que ha de servir de path para que las bolas sigan el trazado. Quizás es mejor generar imágenes una a una con los paths. Y luego generar una imagen en HD con decoración manteniendo todo el path para las bolas. Estoy abierto a sugerencias para tratar esta parte.
> Como vemos que se alarga, sugiero hacer fases de desarrollo, comenzando con una estructura global y poco a poco ir iterando en cada parte.
> El formato de salida del prompt que me generes, mejor que sea en formato markdown para poder copiarlo y pegarlo y que mantenga una jerarquía a nivel de contenido.

## 3. Resolución y Responsividad
**Prompt del usuario:**
> Tengo una duda con el tema de colisión a nivel pixel. Podríamos definir un AR 16:9, y que el juego se reescale al máximo posible del viewport. Así las coordenadas serían proporcionales al viewport, más que píxeles exactos. Modifica lo necesario del prompt para hacer el juego responsive.

## 4. Ejecución del Prompt Maestro (Inicio de Fase 1)
**Prompt del usuario:**
> *(El usuario envía el prompt final estructurado generado por la IA, instruyendo el inicio de la Fase 1).*

## 5. Inclusión de Herramientas de Backend (Python)
**Prompt del usuario:**
> ¿Puede ayudarte el uso de Python? A nivel de stack tengo libertad para utilizar lo que quiera, siempre y cuando los entregables sean los especificados anteriormente.

## 6. Continuación del Desarrollo (Inicio de Fase 2)
**Prompt del usuario:**
> Seguimos.

## 7. Solicitud de Registro Documental
**Prompt del usuario:**
> Por favor, mantén un registro de los prompts que te voy dando para generar un archivo `prompts.md` al final.

---
*Este archivo se actualizará con los siguientes prompts que dirijan las fases 3, 4, 5 y 6 del desarrollo.*

## 8. Generación Visual de Paths
**Prompt del usuario:**
> Quiero que generes por mi los json de paths de los 3 niveles basándote en estas 3 imágenes (OIG1.jpg, OIG2.jpg, OIG3.jpg).

## 9. Generación de Base Estructural para IA
**Prompt del usuario:**
> Genera imágenes a partir de los json que me sirvan de base para generar imágenes con nano banana 2 o similar.

## 10. Debugging de Consola (Python)
**Prompt del usuario:**
> *El usuario reporta un error de terminal indicando `zsh: command not found: python` y error de rutas al intentar ejecutar el conversor SVG.*

## 11. Debugging de Pip
**Prompt del usuario:**
> *El usuario reporta que al intentar instalar `svgpathtools` obtiene el error `zsh: command not found: pip`.*

## 12. Herramientas para Trazado de Paths
**Prompt del usuario:**
> Busca una herramienta online gratuita que me permita crear los paths a partir de puntos de control, y que pueda definir el lienzo en AR 16:9.

## 13. Ajuste Geométrico de SVG
**Prompt del usuario:**
> Modificar level1.svg para que en el mismo tamaño, el path no llegue a los limites superior e inferior, dejando en ambos limites un 20%.

## 14. Uso de Method Draw y Ejecución de Script
**Prompt del usuario:**
> Al final he creado nuevos SVG mas controlados con https://editor.method.ac/ y empleado el script svg_to_json.py para generar los json.

## 15. Generación de Prompts para Gemini (Fondos de Nivel)
**Prompt del usuario:**
> Genera el prompt a pasarle a Gemini para que genere la imagen de fondo de cada nivel. Le pasare de referencia cada uno de los svg que hemos empleado para generar los json de los paths. Prepara tambien la descripcion de cada escena, siempre relacionado con tematica Egipcia.

## 16. Implementación de Fase 4 (Mecánicas Base)
**Prompt del usuario:**
> Siguiente fase.

## 17. UX: Visualización de Munición
**Prompt del usuario:**
> El problema es que no veo el color de la bola que voy a lanzar, con lo que no se a donde disparar para ir eliminando bolas.

## 18. Fix: Bug Asíncrono de Destrucción
**Prompt del usuario:**
> genial, pero cuando he ido eliminando otras bolas se ha quedado parado, generando un error de js: Uncaught TypeError: Cannot read properties of undefined (reading 'destroy').

## 19. Integración de Artes HD y Selector de Niveles
**Prompt del usuario:**
> tengo en /assets/images los 3 pngs con la imagen de fondo de cada nivel. Como los puedo ver en accion?

## 20. Implementación de Fase 5 (Puntuación y UI)
**Prompt del usuario:**
> Siguiente fase.

## 21. Pulido Visual: Ocultar Debug de Paths
**Prompt del usuario:**
> hemos de eliminar los paths y puntos de control.

## 22. Herramienta de Alineación de Paths
**Prompt del usuario:**
> hemos de ajustar los paths a la imagen de fondo

## 23. Transformación (Escalado) en Edición de Paths
**Prompt del usuario:**
> necesitaria que con las teclas a s w d pudiese jugar con la anchura y altura, ya que no solo es problema de posicion, sino de transformacion

## 24. Modo Edición Drag & Drop
**Prompt del usuario:**
> y si en vez de modificar posicion y transformacion, pudiese modificar los puntos de control?

## 25. Editor Híbrido (Transformación + Nodos)
**Prompt del usuario:**
> mejor recuperamos tambien la opcion de desplazar y transformar, porque hay muchos puntos que editar sino

## 26. Funcionalidad de Pausa
**Prompt del usuario:**
> añadir pausa con la tecla p (si se clica de nuevo se reanuda el juego)

## 27. Pausa Lógica (Permitir Edición)
**Prompt del usuario:**
> he de poder modificar los paths cuando esta en pausa

## 28. Generación de Assets Finales (Fase 6)
**Prompt del usuario:**
> genera el prompt para pasar a Gemini para que genere las imagenes que nos faltan: shooter, esferas, agujero y powerups

## 29. Herramienta: Eliminar Fondo Blanco de Assets
**Prompt del usuario:**
> puedes eliminar el fondo blanco de una imagen para que sea transparente, quizas creando un script en python?

## 30. Integración de Cañón Final (Lerp + Rotación)
**Prompt del usuario:**
> comenzamos con fase 6, pero por ahora solo trabajamos el shooter (imagen y rotacion)

## 31. Integración de Esferas Finales
**Prompt del usuario:**
> añadimos las bolas que tengo en /assets/images: sphere_blue.png, sphere_red.png, sphere_yellow.png y sphere_green.png

## 32. Pulido Visual: Tamaño, Rotación y Ocultar Editor
**Prompt del usuario:**
> hay que hacer las bolas un 25% mas pequeñas, y las bolas que van por el path han de ir girando. Comentar el path con puntos de control

## 33. Ajustes de Tamaño, Rotación y Sincronización de Munición
**Prompt del usuario:**
> varias cosas:
> las bolas rotan demasiado rapido y han de ser un 15% mas pequeñas.
> las bolas no pueden solaparse entre ellas
> no pueden salir bolas a disparar de colores que ya no hay en la cola de bolas

## 34. Mejora de Física: Movimiento Uniforme y Colisiones Reales
**Prompt del usuario:**
> ahora hay bolas que quedfan demasiado separadas y bolas que siguen solapandose. Deberia detectarse una colision real tengan el tamaño que tengan para que siempre vayan seguidas

## 35. Suavizado de Movimiento: Eliminación de Saltos en Inserción y Match
**Prompt del usuario:**
> cuando disparo, si se eliminan bolas, las bolas entre las que elimino y la primera hacen un salto, no se mueven con naturalidad

## 36. Integración de Imagen de Portada y Fondo
**Prompt del usuario:**
> pon como imagen de fondo al inicio del juego y al final el archivo /assets/images/main.png

## 37. Creación e Integración de Interfaz Estilo Luxor
**Prompt del usuario:**
> genera una interfaz para las areas donde ponemos texto estilo luxor para las pantallas de inicio, pausa y sin del juego, tambien para la puntuacion mientras estamos jugando

## 38. Refinamiento de Interfaz: Assets Limpios sin Sombras
**Prompt del usuario:**
> hay que generar de nuevo los assets. No han quedado bien recortados. Por un lado algunos estan cortados mal, y por otro el alpha de los bordes. Se esta recortando los assets dejando un borde blanco porque hay las sombras. Veo dos opciones, o se hace un recorte sin sombras y se añaden luego por css, o generamos una nueva imagen que no lleve sombras para que el corte sea limpio, y luego añadimos las sombras por css

## 39. Interfaz Profesional: Assets 3D con Recorte por Erosión
**Prompt del usuario:**
> siguen quedando mal recoertados, aunque el borde blanco sea menor sigue viendose parte. Y sinceramente, el estilo era mucho mas trabajado y profesional el de la primera version.

## 40. Pulido de UI Final: Logotipo Profesional y Ajustes de Layout
**Prompt del usuario:**
> - Pantalla inicial: La posicion del recuadro para elegir el nivel no queda ben centrado en altura, y quizas es demasiado grande. Ademas el asset nno esta bien cortado por el borde derecho e inferior. El texto de Luxor 3 web lo cambiaría por Luxor a secas, y lo haría como imagen, siguiendo el mismo estilo pero para las letras. Score y pausa: Hay que hacer mas pequeños los textos para que qeupan dentro de los assets. Pantalla final: Los textos son enormes, sobretodo el de FIN DE JUEGO. Y se salen del asset. El asset... sigue estando mal recortado por el lado derecho e inferior.

## 41. Refinamiento Final de Composición y Logo Aislado
**Prompt del usuario:**
> - El logo de LUXOR que sea sin ningun tipo de fondo, solo la tipografia.
> - La seleccion de nivel que tiene el asset de fondo tapa por completo el escarabajo del dibujo. Utilizaria algo mucho mas compacto

## 42. Miniaturización de UI y Reubicación Superior
**Prompt del usuario:**
> reduce el logo, el asset de los niveles y los textos en si de elegir nivel en un 50%. Haciendo que todo suba hacia arriba, ya que sigue tapando totalmente el escarabajo del centro

## 43. Ajustes de Posición: Composición Equilibrada
**Prompt del usuario:**
> baja 20px el logo y 100px los niveles

## 44. Ajuste de Legibilidad y Posición Final
**Prompt del usuario:**
> sube 50px los niveles y hazlo un 20% mas grande

## 45. Optimización de Escalas de Texto y Alineación
**Prompt del usuario:**
> - reduce en un 50% el texto de pausa y el mensaje de debajo, o lo suficiente para que quede dentro del asset. Reduce el texto de score para que quede dentro del marcador del asset. Alinear en altura el asset y textos del final de partida y reducir el tamaño del texto de Fin del juego y Volver al menú hasta que quepa bien dentro del asset

## 46. Ajustes de Precisión: Centrado y Multilínea
**Prompt del usuario:**
> - baja 20px los niveles (texto y asset) del inicio del juego. Baja 8px el texto de score de la partida. Partir el texto de Fin del juego en dos lineas. El asset de la pantalla final esta muy bajo, ha de estar centrado en altura (y los textos de dentro del asset tambien)
