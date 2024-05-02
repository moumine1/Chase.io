# Chase.io

Chase.io est un jeu 3d asymétrique multijoueur à la première personne, pastiche du survival horror, sur navigateur développé par le studio fictif Mogoma composé de Mohamed-Amine Ouenzerfi, Hugo Feirreira Miguel et Emma-Louise Meyer.

Dans chase.io, des survivants tentent d’échapper à un tueur se cachant dans leur hôtel. Pour cela ils devront se cacher, fuir et s’entraider avant la fin du temps imparti.

## Installation

Vous devez avoir une version récente de node (le projet a été build sur 18.18.2).
Cloner le repo ` git clone https://github.com/moumine1/Chase.io.git ` ou télécharger le .zip .
Vous placez dans le répertoire et taper ` node server.js ` dans votre shell.

## Les Règles

Une partie se compose de 3 à 12 joueurs, 1 tueurs et le reste sont des survivants. À la fin du temps imparti, s’il reste des survivants, ils gagnent sinon c’est le tueur.

Les survivants peuvent discuter via un chat textuel dans le jeu pour s’entraider et peuvent voir chacun leurs positions sur une minimap. Ils peuvent également se cacher dans des lieux prédéfinis (armoire, lit ...)

Le tueur lui se déplace de plus en plus vite au fur et à mesure de la partie et est notifié lorsqu’un survivant est dans la même pièce que lui afin qu’il cherche si des joueurs sont cachés.

## Technologies utilisées :

-Node.js
-Three.js
-Socket.io
-Express.js
-Canvas