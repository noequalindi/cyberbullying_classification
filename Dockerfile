FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .
COPY app.py app.py
COPY api.py api.py
COPY model.pkl model.pkl
COPY supervisord.conf /etc/supervisord.conf

RUN apt-get update && apt-get install -y supervisor

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
