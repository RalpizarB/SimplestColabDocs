# IntelliJ y Git

En este tutorial, mostraré como usar las funciones de GIT en IntelliJ IDEA.

## Menú Git

Para comenzar identificamos en la parte superior izquierda de la pantalla a un lado del nombre del proyecto, el menú Git, identificado por el ícono de rama, junto con el nombre.

IMAGEN_PENDIENTE

Dentro de este menú podemos hacer las Acciones más comunes de Git:
- **Update project**: Realiza un pull y Fetch
- **Commit**: Realiza commits en la rama local
- **Push**: Sube los cambios al repositorio remoto

IMAGEN_PENDIENTE

## Commits

Para hacer un commit:
1. Haz click en **Commit** en el menú Git
2. Selecciona los archivos que deseas incluir
3. Escribe un mensaje descriptivo
4. Click en **Commit** o **Commit and Push**

IMAGEN_PENDIENTE

## Branches

Para crear o cambiar de rama:
1. Click en el nombre de la rama actual (esquina inferior derecha)
2. Selecciona **New Branch** o elige una rama existente
3. IntelliJ cambiará automáticamente a la nueva rama

IMAGEN_PENDIENTE

## Pull Requests

Para ver o crear Pull Requests:
1. Click en **Git** > **GitHub** > **Create Pull Request**
2. Completa el título y descripción
3. Asigna revisores si es necesario
4. Click en **Create Pull Request**

IMAGEN_PENDIENTE

## Resolución de Conflictos

Cuando hay conflictos durante un merge:
1. IntelliJ mostrará los archivos en conflicto
2. Click derecho > **Git** > **Resolve Conflicts**
3. Usa el editor de 3 paneles para resolver
4. Acepta los cambios izquierdos, derechos, o edita manualmente

IMAGEN_PENDIENTE

## History y Blame

Para ver el historial:
- **Git** > **Show History**: Ve todos los commits
- Click derecho en un archivo > **Git** > **Annotate**: Ve quién modificó cada línea

IMAGEN_PENDIENTE
