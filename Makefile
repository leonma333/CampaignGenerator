CONTAINER = campaign_generator

# Check that given variables are set and all have non-empty values,
# die with an error otherwise.
#
# Params:
#   1. Variable name(s) to test.
#   2. (optional) Error message to print.
check_defined = \
    $(strip $(foreach 1,$1, \
        $(call __check_defined,$1,$(strip $(value 2)))))
__check_defined = \
    $(if $(value $1),, \
      $(error Undefined $1$(if $2, ($2))))

.PHONY: install

build:
	$(info Make: Building images.)
	@docker-compose build --no-cache
	@make -s clean

start:
	$(info Make: Starting containers.)
	@docker-compose up -d

stop:
	$(info Make: Stopping containers.)
	@docker-compose stop

restart:
	$(info Make: Restarting containers.)
	@make -s stop
	@make -s start

clean:
	@docker system prune --volumes --force

unittest:
	$(info Make: Running unit tests.)
	@docker-compose exec $(CONTAINER) ng test --watch=false

e2etest:
	$(info Make: Running E2E tests.)
	@docker-compose exec $(CONTAINER) ng e2e --port 4202

log:
	@docker-compose logs -f $(CONTAINER)

install:
	$(call check_defined, package, package name not specified)
	docker exec -it $(CONTAINER) npm install $(package) --save-dev
