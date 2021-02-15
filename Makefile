SHELL=bash

HAS_DOCKER := $(shell\
	if type "docker" > /dev/null 2>&1; then\
			echo true;\
		else\
			echo false;\
	fi\
)

ifeq ($(HAS_DOCKER),true)
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

export:
	docker-compose exec app yarn export
	docker cp `docker-compose ps -q app`:/repo/extensions .
endif
