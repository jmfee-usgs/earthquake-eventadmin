earthquake-eventadmin
==============

Web application for administering earthquake event products.

Getting Started
---------------

[Use git to clone earthquake-eventadmin from git repository](readme_git_install.md)

[Install needed dependencies and run them](readme_dependency_install.md)


### Configure the Project ###
1. run ./src/lib/pre-install to setup config.ini
  Use the defaults provided.

### Example Usage ###
1. Run grunt from the install directory.

### Notes ###
1. This application uses the earthquake responsive template found at
   https://github.com/usgs/hazdev-template.git
   The responsive template dependency is not bundled during build, so sites
   can configure their theme, and must be installed before this application
   is deployed.


### Docker ###
You can use docker to run a local copy of this application.

1. Install `docker` and `docker-machine`.
2. Create a docker machine (assuming using VirtualBox):
    ```
    docker-machine create --driver virtualbox default
    ```
3. Make sure the docker machine is running
    ```
    docker-machine start default
    ```
4. Start the container:
    ```
    docker run -it -p 8112:8112 usgs/earthquake-eventadmin
    ```
5. In a separate window, run the following to open a browser
    ```
    docker-machine env default \
        | grep HOST \
        | sed s/.*tcp/http/g \
        | awk -F: '{print $1":"$2":8112"}' \
        | xargs open
    ```


#### Notes ####
- To build the docker container, run the following from the root of the project:
  `docker build .`
- The container is configured with a basic configuration which is enough to run the application, but is not configured to manage events.  You can update the configuration in the file
  ```
  /earthquake-eventadmin/dist/conf/config.ini
  ```
