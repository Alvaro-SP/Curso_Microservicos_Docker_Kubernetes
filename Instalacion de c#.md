# Paso 1: Instalar el SDK de .NET
El SDK de .NET incluye todo lo que necesitas para compilar y ejecutar aplicaciones C#, incluyendo el compilador.

### Descargar el SDK:

Ve a la página oficial de descargas de .NET: Descargas de .NET

Busca la sección ".NET SDK" (Kit de desarrollo de software de .NET). Se recomienda descargar la versión LTS (Soporte a Largo Plazo), ya que es la más estable.
https://dotnet.microsoft.com/es-es/download

Haz clic en el enlace del instalador para Windows (normalmente x64).

### Ejecutar el Instalador:

Una vez descargado, haz doble clic en el archivo para ejecutar el instalador.

Sigue las instrucciones del asistente de instalación. Generalmente solo tienes que hacer clic en "Instalar" y esperar a que finalice. Necesitarás permisos de administrador para este paso.

Verificar la Instalación (Opcional pero recomendado):

Abre el Símbolo del sistema o PowerShell de Windows.

Escribe el siguiente comando y presiona Enter:

```Bash
dotnet --version
```


Si la instalación fue exitosa, verás el número de versión del SDK de .NET que acabas de instalar.

# Paso 2: Configurar Visual Studio Code (VS Code)

Para trabajar con C# en VS Code, necesitas instalar una extensión de Microsoft que te proporcionará soporte de lenguaje, depuración y administración de proyectos.

## Abrir la Vista de Extensiones:

Abre Visual Studio Code.

Haz clic en el ícono de Extensiones en la barra de actividad lateral (es el icono de los cuatro cuadrados, uno de ellos separado) o presiona Ctrl + Shift + X.

## Instalar la Extensión Clave:

En la barra de búsqueda de extensiones, escribe C# Dev Kit.

Busca la extensión oficial llamada "C# Dev Kit" de Microsoft.

Haz clic en el botón "Instalar". Esta extensión instalará automáticamente las herramientas necesarias (como la extensión base de C# y .NET Install Tool) para una experiencia de desarrollo completa.

# Paso 3: Crear y Ejecutar tu Primer Proyecto C#

Ahora que tienes el SDK de .NET y la extensión de VS Code, puedes crear tu primer programa

En la terminal ejecutar

    ```bash

    dotnet new console -n MiAppHolaMundo
    ```
Esto crea una nueva carpeta llamada `MiAppHolaMundo` con un proyecto de consola básico.

Ejecutar con 

```bash

cd MiAppHolaMundo
dotnet run
```

