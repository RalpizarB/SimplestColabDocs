# Maven en IntelliJ

Este tutorial muestra cómo usar Maven en IntelliJ IDEA.

## Crear Proyecto Maven

Para crear un nuevo proyecto Maven:
1. **File** > **New** > **Project**
2. Selecciona **Maven** en el panel izquierdo
3. Configura el **GroupId** y **ArtifactId**
4. Click en **Finish**

IMAGEN_PENDIENTE

## Estructura del Proyecto

Maven organiza el proyecto con esta estructura:
- `src/main/java`: Código fuente
- `src/main/resources`: Recursos
- `src/test/java`: Tests
- `pom.xml`: Archivo de configuración Maven

IMAGEN_PENDIENTE

## Archivo pom.xml

El `pom.xml` contiene:
- Información del proyecto (groupId, artifactId, version)
- Dependencias
- Plugins
- Configuración de build

IMAGEN_PENDIENTE

## Agregar Dependencias

Para agregar una dependencia:
1. Abre el archivo `pom.xml`
2. Dentro de `<dependencies>`, agrega:
```xml
<dependency>
    <groupId>grupo</groupId>
    <artifactId>artefacto</artifactId>
    <version>1.0.0</version>
</dependency>
```
3. Click en el ícono "Load Maven Changes" (M)

IMAGEN_PENDIENTE

## Panel Maven

El panel Maven (lado derecho) muestra:
- **Lifecycle**: Fases del ciclo de vida (clean, compile, test, package, install)
- **Plugins**: Plugins configurados
- **Dependencies**: Dependencias del proyecto

IMAGEN_PENDIENTE

## Ejecutar Goals Maven

Para ejecutar un goal:
1. Abre el panel Maven
2. Expande **Lifecycle**
3. Doble click en el goal deseado (ej: `clean`, `install`, `package`)

O usa la terminal:
```
mvn clean install
```

IMAGEN_PENDIENTE

## Actualizar Dependencias

Para actualizar dependencias:
1. Panel Maven > Click en el ícono "Reload All Maven Projects"
2. O click derecho en el proyecto > **Maven** > **Reload Project**

IMAGEN_PENDIENTE

## Configurar Perfiles Maven

Para usar perfiles diferentes:
1. Define perfiles en `pom.xml`:
```xml
<profiles>
    <profile>
        <id>dev</id>
        ...
    </profile>
</profiles>
```
2. Panel Maven > **Profiles** > Selecciona el perfil

IMAGEN_PENDIENTE

## Debugging con Maven

Para depurar tests Maven:
1. Panel Maven > **Lifecycle** > Click derecho en `test`
2. Selecciona **Debug 'proyecto [test]'**
3. Coloca breakpoints en tu código

IMAGEN_PENDIENTE
