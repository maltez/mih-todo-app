#!/usr/bin/env bash

echo "Provision VM START"
echo "=========================================="

apt-get update
echo ""
echo "=========================================="
echo "NODEJS setup:"
echo "=========================================="
#install nodjs
apt-get install -y python-software-properties python g++ make
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get -y install nodejs


#install mongo db
echo ""
echo "=========================================="
echo "MONGODB setup:"
echo "=========================================="
apt-get -y install mongodb

#install ruby
echo ""
echo "=========================================="
echo "RUBY setup:"
echo "=========================================="
apt-get -y install ruby-full 

echo ""
echo "=========================================="
echo "GIT setup:"
echo "=========================================="
apt-get -y install git

echo ""
echo "=========================================="
echo "NPM setup:"
echo "=========================================="
sudo npm install -g npm
echo ""

echo "=========================================="
echo "bower setup:"
echo "=========================================="
sudo npm install bower -g 

echo ""
echo "=========================================="
echo "yo setup:"
echo "=========================================="
sudo npm install yo -g 

echo ""
echo "=========================================="
echo "grunt-cli setup:"
echo "=========================================="
sudo npm install -g grunt-cli

echo ""
echo "=========================================="
echo "express setup:"
echo "=========================================="
sudo npm install express  -g 

#echo ""
#echo "=========================================="
#echo "phantom setup:"
#echo "=========================================="
#sudo apt-get install libfreetype6 libfreetype6-dev
#sudo apt-get install libfontconfig1 libfontconfig1-dev
#cd ~
#export PHANTOM_JS="phantomjs-1.9.8-linux-x86_64"
#wget https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2
#sudo tar xvjf $PHANTOM_JS.tar.bz2
#sudo mv $PHANTOM_JS /usr/local/share
#sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin

echo ""
echo "=========================================="
echo "COMPASS setup:"
echo "=========================================="
gem install compass

echo ""
echo "=========================================="
echo "NMP MODULES INSTALL:"
echo "=========================================="

cd ../../app

#echo "=========================================="
#echo "grunt INSTALL:"
#echo "=========================================="

echo "=========================================="
echo "npm install setup:"
echo "=========================================="
sudo npm install

echo "=========================================="
echo "bower INSTALL:"
echo "=========================================="
bower install --allow-root

echo "=========================================="
echo "POSTINSTALL INSTALL:"
echo "=========================================="


sudo npm install grunt --save-dev

sudo npm install mocha -g

sudo apt-get install gcc make build-essential 

npm install -g node-gyp 

sudo npm rebuild

echo ""
echo "=========================================="
echo "Node setup:"
node -v
echo "Ruby setup:"
ruby -v
echo "Compass setup:"
compass version
echo "Provision VM finished"





#sudo npm install grunt --save-dev

#sudo npm install mocha -g

#sudo apt-get install gcc make build-essential 

#npm install -g node-gyp 

#sudo npm rebuild