FROM python:3.11.4-slim

WORKDIR /backend

COPY .env .env
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . . 

RUN mkdir -p /app/media/avatars

EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
