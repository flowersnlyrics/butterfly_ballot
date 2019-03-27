# Team Butterfly Ballot Final Project
Jennifer de Souza and Elise Weir <br/>
EC544 Networking the Physical World  <br/>
Spring 2019 @ Boston University

# Getting Started 
Each team member should be able to reproduce each other's work. Please document carefully any necessary installation instructions so that everything is repeatable. 
## Hardware!
+ BeagleBone Black Rev C
+ Logictech C920 1080p USB Webcam 
+ Custom PCB for pushbuttons 
TODO: Add schematic here

## Prepare Video4Linux 
Video4Linux comes with the most recent Debian image for BeagleBoneBlack! <br/>
It's possible the Debian image is missing some components though (mine was) <br/>
Run these commands to be safe: 
```console
you@bbb:~$ sudo apt-get install v4l-utils
you@bbb:~$ sudo apt-get install libv4l-dev
```
## Download Repo for Capturing Images
AR Embedded makes an easy to use repo to capture several images at a time <br/>
```console
you@bbb:~$ git clone https://github.com/arembedded/usb_cam.git 
```
In order to use this we need to download the Python package Pillow (PIL) <br/>
```console
you@bbb:~$ sudo pip install Pillow 
```
__NOTE__: If this doesn't work there are a couple things to try:
1. Update pip
   ```console
   you@bbb:~$ sudo pip install -U pip
   ```
2. Upgrade distribute Python package (this fixed my problems)
   ```console
   you@bbb:~$ pip install --upgrade distribute
   ```
3. Upgrade core packages
   ```console
   you@bbb:~$ pip install --upgrade setuptools
   ```


### Installing Ethereum
Possible go [implementation](https://github.com/EthEmbedded/BBB-Eth-Install) for beaglebone black 
Put instructions for installing Ethereum on the BeagleBone here
### Installing Linux Kernel Module Software
Put instructions for running/installing the LKM
### Installing OpenCV and OpenFace 
Put instrutions for installing OpenCV and OpenFace on the BeagleBone 

# Taking a Picture 
1. Hook up camera to USB port. Check if you can see the Logitech device
   ```console
   [you@bbb:~]$ lsusb
   [you@bbb:~]$ ....
   [you@bbb:~]$ /dev
   should see /video0 in the file descriptor list 
   ```
2. Go to dir where usb_cam Github repo is installed
   ```console
   [you@bbb:~]$ cd usb_cam
   [you@bbb:~/usb_cam]$ ....
   [you@bbb:~/usb_cam]$ /dev
   should see /video0 in the file descriptor list 
   ```
3. Build an executable. The source code in grabber.c opens up the USB webcam as a file descriptor using the V4L2 interface to allocate memory for buffers used to capture image data and poll socket descriptors to see if data is available. 
   ```console
   [you@bbb:~/usb_cam]$ make clean
   [you@bbb:~/usb_cam]$ make
   ``` 
4. Take a picture! This will produce 19 images, the first will be out000.ppm and the last will be out019.ppm. 
   ```console
   [you@bbb:~/usb_cam]$ ./grabber.o
   ```
5. Convert the raw .ppm file to a JPEG so that you can actually see it. This example will produce out000.jpg.
   ```console
   [you@bbb:~/usb_cam]$ python img_ppm_2_jpg.py out000.ppm
   ```
6. TODO test xfering image thru SCP, haven't tried this 
   ```console
   [you@bbb:~/usb_cam]$ scp arembedded@192.168.1.222:/home/arembedded/usb_cam/out000.jpg
   ```
# Remoting into the BeagleBone Black
+ [Download](https://sourceforge.net/projects/vnc-tight/) TightVNC Server on your PC 
+ Download TightVNC Server on the BBB
  ```console
  you@bbb:~$ # Install TightVNC Server
  you@bbb:~$ sudo apt-get install tightvncserver
  you@bbb:~$ # Run the program. The first time you will have to set up your passwords
  you@bbb:~$ tightvncserver
  ```
+ Info you'll need to connect from your PC 
  - IP address
    > the default one for the BBB is __192.168.7.2__ 
  - Also __need__ to use port 5901
    > 192.168.7.2:__5901__
