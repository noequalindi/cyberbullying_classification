# Aplicación Web de Clasificación de Ciberacoso

Este repositorio contiene una aplicación web para clasificar tweets según el tipo de ciberacoso que representan. La aplicación está construida con Dash, un framework de Python para construir aplicaciones web analíticas.

## Instalación y Uso

Para ejecutar este proyecto localmente, necesitas tener Docker y Docker Compose instalados en tu sistema.

### Requisitos Previos

- Docker: [Instalar Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Instalar Docker Compose](https://docs.docker.com/compose/install/)

### Clonar el Repositorio
```sh
git clone https://github.com/tuusuario/cyberbullying-classification-webapp.git
cd cyberbullying-classification-webapp
```

### Construir e Iniciar los Contenedores
```sh
docker-compose up --build
```

# Detener los Contenedores
```sh
docker-compose down
```

### Limpiar Recursos de Docker
```sh
docker system prune -a --volumes
```

### Uso de la API
```sh
curl -X POST "http://localhost:8001/predict" -H "Content-Type: application/json" -d '{
  "word_count": 8,
  "text_length": 45,
  "clean_tweet": "im pretty sure high school bullies tik tokers"
}'
```

```
muslim people are useless - religion
fat bitch - gender
im pretty sure high school bullies tik tokers - age

```