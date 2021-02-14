init:
	docker volume create ghpush
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

start:
	docker-compose start

stop:
	docker-compose stop

clean:
	make down
	docker volume rm ghpush
