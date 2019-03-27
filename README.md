# Team Butterfly Ballot Final Project
Jennifer de Souza and Elise Weir <br/>
EC544 Networking the Physical World  <br/>
Spring 2019 @ Boston University

# Getting Started 
Each team member should be able to reproduce each other's work. Please document carefully any necessary installation instructions so that everything is repeatable. 
## Hardware Needed
+ BeagleBone Black Rev C
+ Logictech C920 1080p USB Webcam 
+ Custom PCB for pushbuttons 
TODO: Add schematic here
## Software Needed
The folling programs need to be installed on the BeagleBone
### Video4Linux 
Video4Linux comes with the most recent Debian image for BeagleBoneBlack! <br/>
You still need to install some tools though. Run these commands:


### Installing Ethereum
Possible go [implementation](https://github.com/EthEmbedded/BBB-Eth-Install) for beaglebone black 
Put instructions for installing Ethereum on the BeagleBone here
### Installing Linux Kernel Module Software
Put instructions for running/installing the LKM
### Installing OpenCV and OpenFace 
Put instrutions for installing OpenCV and OpenFace on the BeagleBone 

# Remoting into the BeagleBone Black
+ [Download](https://sourceforge.net/projects/vnc-tight/) TightVNC Server on your PC 
+ Download TightVNC Server on the BBB
  ```console
     sudo apt-get install tightvncserver
  ```
  - type tightvncserver in the terminal
  - make up passwords when prompted 
+ Info you'll need to connect from your PC 
  - IP address: the default one for the BBB is 192.168.7.2 and you __need__ to use port 5901
  - my password is temppwd (kept from BBB temporary password) 
