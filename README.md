### The steps are meant to turn a generic Ubuntu server into an Django server hosting the LHASA-Mekong tool with PostgreSQL, Nginx, Gunicorn and Virtualenv

### About LHASA-Mekong Tool
The LHASA-Mekong is a web application for Predicting Hydrologic Impact and Operating Pattern of Existing and Planned Reservoirs of the Lower Mekong Region.

### Update Ubuntu Server
```
sudo apt update
sudo apt upgrade
sudo apt clean
```
### Install necessary packages
```
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx curl
```
### Git installation and configuration
```
sudo apt install git-core
sudo apt clean
git config --global user.name "< your_username >"
git config --global user.email "< your_email >"
```
### Create PostgreSQL database and user
```
// Log into an interactive Postgres session by typing:

sudo -u postgres psql

// Create database for the tool

postgres# CREATE DATABASE "< your_databasename >";

// Create a database user 

postgres# CREATE USER "< name_of_databaseuser >" WITH PASSWORD '< password_for_databseuser >';

// Settingup default encoding, transaction and timezone

postgres# ALTER ROLE "< name_of_databaseuser >" SET client_encoding TO 'utf8';
postgres# ALTER ROLE "< name_of_databaseuser >" SET default_transaction_isolation TO 'read committed';
postgres# ALTER ROLE "< name_of_databaseuser >" SET timezone TO 'UTC';

// Provide database user to administrative privilege

postgres# GRANT ALL PRIVILEGES ON DATABASE "< your_databasename >" TO "< name_of_databaseuser >";

// Exit out of the PostgreSQL prompt by typing:

postgres# \q

[Reference - Additional Informations](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-20-04)
```
### Install Python Virtual Environment
```
// First upgrade pip version
sudo -H pip3 install --upgrade pip

// Install virtual environment using pip
sudo -H pip3 install virtualenv
```
### Create an empty directory for rattool
```
mkdir /home/ubuntu/rattool
```
### Create a Python3 Virtual Environment
```
// Navigate to rattool directory
cd /home/ubuntu/rattool

// Create a virtual environment name rat_env
python3 -m venv rat_env

// Now activate the virtual environment
source rat_env/bin/activate
```
### Download and setup the rat_mekong from git
```
// git clone rat_mekong_github_address
git clone https://github.com/Servir-Mekong/rat_mekong.git

// Change directory
cd rat_mekong

// Install dependencies from the requirements.txt
pip install -r requirements.txt
```
### Install Gunicorn
```
pip install gunicorn
```
### Create and config local_settings.py file
```
// Navigate to rat directory
cd rat

// Open an empty python file
sudo nano local_settings.py

// Add Secret Key, Allowed Hosts, Debug and Database details
SECRET_KEY = "< your_sevcet_key >"

DEBUG = True

ALLOWED_HOSTS = ["Your_server_domain_or_IP_address"]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '< name_of_your_database >',
        'USER': '< your_database_user >',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```
### Migrate database and create superuser to access Django admin panel
```
// Back to rat_mekong directory
cd ..

// Now migrate by
python manage.py makemigrations
pythton mange.py migrate

// Create superuser
python manage.py createsuperuser

#You will have to select a username, provide an email address, and choose and confirm a password.
```
### Collect static files to static directory
```
python manage.py collectstatic

#It will collect all of the static files in a static directory defined in the settings.py
```

### Test Django server
```
// Allow 8000 port to UFW firewall
sudo UFW allow 8000

// Check server by 
python manage.py runserver 0.0.0.0:8000

// Now open a browser and check the development server by typing
http://server_domain_or_IP:8000
```
### Testing Gunicorn’s Ability to Serve the Project
```
gunicorn --bind 0.0.0.0:8000 rat.wsgi

// Now open a browser and check the development server with gunicorn by typing
http://server_domain_or_IP:8000

// Now deactivate the development server by typing
deactivate
```

### Creating systemd Socket File for Gunicorn
```
// Open gunicorn.socket file using sudo
sudo nano /etc/systemd/system/gunicorn.socket

// Edit the gunicorn.socket file
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target

//Now save and exit
```
### Creating systemd Service File for Gunicorn
```
// Open gunicorn.service file using sudo
sudo nano /etc/systemd/system/gunicorn.service

// Edit the gunicorn.service file
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
PIDFile=/run/gunicorn/pid
User=ubuntu
Group=ubuntu
RuntimeDirectory=gunicorn
WorkingDirectory=/home/ubuntu/rattool/rat_mekong
ExecStart=/home/ubuntu/rattool/rat_env/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
         rat.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s TERM $MAINPID
PrivateTmp=true

// Now save and exit
```
### Start, enable and check gunicorn
```
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
sudo systemctl status gunicorn.socket
```
### Configure Nginx to Proxy Pass to Gunicorn
```
// Start by creating and opening a new server block in Nginx’s sites-available directory:
sudo nano /etc/nginx/sites-available/rat_mekong

// Edit the file
server {
    listen 80;
    server_name "< your_server_domain_or_IP_address >";

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/ubuntu/rattool;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}

// Now save and exit

// Enable the file by linking it to the sites-enabled directory
sudo ln -s /etc/nginx/sites-available/rat_mekong /etc/nginx/sites-enabled
```
### Test and configure NGINX
```
// Test NGINX  Server
sudo nginx -t

// Restart NGINX Server
sudo systemctl restart nginx

// Delete 8000 port access
sudo ufw delete allow 8000

// Allow NGINX Full to access port 80
sudo ufw allow 'Nginx Full'

// Finally, restart everything
sudo systemctl daemon-reload
sudo systemctl restart gunicorn.socket gunicorn.service
sudo nginx -t && sudo systemctl restart nginx
```