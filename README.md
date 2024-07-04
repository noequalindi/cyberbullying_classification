# Aplicación Web de Clasificación de Ciberacoso

Este repositorio contiene una aplicación web para clasificar tweets según el tipo de ciberacoso que representan. La aplicación está construida con React para el frontend, Python para construir aplicaciones web analíticas.

## Instalación y Uso

Para ejecutar este proyecto localmente, necesitas tener las librerías correspondientes a python y Nodejs para el frontend. También es posible utilizar las imágenes con Docker y Docker Compose ya previamente instalados en tu sistema.

### Requisitos Previos
- Nodejs (Sólo para uso local del frontend)
- Python 3.8 y librerias que se encuentran en backend/requirements.txt (Sólo para uso local del backend)
- Docker: [Instalar Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Instalar Docker Compose](https://docs.docker.com/compose/install/)

### Clonar el Repositorio
```sh
git clone https://github.com/tuusuario/cyberbullying-classification.git
cd cyberbullying-classification
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
### Levantar localmente el backend y el frontend
```sh
 cd backend
 pip install -r requirements.txt (requisito python 3.8)
 uvicorn api:app --host 0.0.0.0 --port 8001

 cd frontend
 npm install
 npm start
```
### Otros ejemplos para clean_tweet
```
fuck black niggers (ethnicity)
black people like niggers are bullied (ethnicity)
fat bitch (gender)
rape gay joke (gender)
im pretty sure high school bullies tik tokers (age)
girls bullied in the middle school (age)
every islamic idiot (religion)
muslim people are useless  (religion)
all muslims are terrorists (religion)

```