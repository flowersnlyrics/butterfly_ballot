# A Secure Approach to Electronic Voting Machines
This project analyzes the antiquated technology still present in today's current electronic voting machines.  The goal is to create a secure voting machine that preserves the integrity of the vote and is easily scalable.  The proposed machine would prevent altering of results and voter fraud through computer vision authentication and a cryptographic ledger copied through the blockchain.  Protecting the vote is a matter of national security as our elections are the backbone of the American democracy. 

# Getting Started 
Each team member should be able to reproduce each other's work. Please document carefully any necessary installation instructions so that everything is repeatable. 
## Hardware!
+ BeagleBone Black Rev C
+ At least 64 GB (128 GB for Murphy) SD Card
+ Logictech C920 1080p USB Webcam 
+ Custom PCB for pushbuttons 
TODO: Add schematic here

## Setting up the Linux Distro
__Distro name__: Debian 9.5 2018-10-07 4GB SD LXQT <br/>
1. BeagleBoard.org has a ["Lastest Firmware Images"](https://beagleboard.org/latest-images) page. For consistency all  team members should download the latest image with a graphical user interface. To download the [Debian 9.5 2018-10-07 4GB SD LXQT](http://debian.beagleboard.org/images/bone-debian-9.5-lxqt-armhf-2018-10-07-4gb.img.xz) image click that hyperlink and the image still start downloading. 
2. Use [Etcher](https://www.balena.io/etcher/) to put that image onto a __128 GB__ SD Card. 
3. To boot from that image hold down the USER/BOOT button while plugging in power (whether it be the 5V jack or the USB port). 
4. It is necessary for this project that the file system be expanded (and [recommended](https://elinux.org/Beagleboard:BeagleBoneBlack) in the Getting Started guide). Expand the file system on the BBB image to use all memory available on the SD Card. I recommend the [automated way](https://elinux.org/Beagleboard:Expanding_File_System_Partition_On_A_microSD) detailed in this document. 
5. For sanity's sake I also ran the below commands
   ```console
   you@bbb:~$ sudo apt-get update
   you@bbb:~$ sudo apt-get dist-upgrade
   ```

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
## Geth Installation and Running the Client for the First Time 
1. Before starting we need to check the status of the Go library. The recommended image for the Beaglebone Black does not have the most recent version of go, which is a requirement for installing geth. The recommended image is anything above Go 1.9, but we are running Go 1.7. You can check this with the `go version` command. 
2. To uninstall our current version of go we need to delete the `/usr/local/go` directory. I also ran an app to purge go remnants. 
 ```console
 [you@bbb:~]$ sudo rm -rf /usr/local/go
 [you@bbb:~]$ sudo apt-get purge go
 ```
3. Now download the most recent image of Go (1.12 in tar.gz format) to the `/usr/local` directory.
4. Untar the .tar.gz with the following command and confirm version by running the `go version` command
 ```console
 [you@bbb:~]$ sudo tar -C usr/local -xvf <name_of_your_go_tar_gz>.gz
 [you@bbb:~]$ go version
 ```
5. Since we purged go in Step 1, we need to re-init the Go Environment. Check out [Step 2](https://tecadmin.net/install-go-on-debian/) in this guide.  At the very minimum update the `PATH` and `GOROOT` environment variables. 
6. Follow Steps 1-7 for cloning the [BBB-Eth-Install github repository](https://github.com/EthEmbedded/BBB-Eth-Install) to install geth on the Beaglebone black. 
7. *Finally* we need to start the geth client. The first time the client runs it takes ~one day for the blockchain to synchronize. 
```@console
[you@bbb:~]$ cd ~/go-ethereum/build/bin
[you@bbb:~]$ cd geth --rinkeby --syncmode=light --cache=96 console
```
8. I would sit and wait until the geth client tells you the block synchronization has started. 
9. We can leave it to download and come back periodically to make sure its going okay since we enabled the console (`console`) when running the geth executable. Two of my fave commands are `eth.syncing` which should return `true` and `eth.blockNumber` which will return the current # of the block the client is downloading. 
10. The client will keep running even after synchronization is over (keeping blocks current is a full time job). Run the `eth.syncing` command if you think it's done (maybe after running it overnight or something). If that command returns `false` then you are done with synchronization and geth is all setup. 
 
 ## Running the Blockchain for the first time with Geth
 Stay tuned :) 

## Linux Kernel Module 
Put instructions for running/installing the LKM
## OpenCV and OpenFace 
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
   [you@bbb:~/usb_cam]$ 
   ```
3. Build an executable. The source code in grabber.c opens up the USB webcam as a file descriptor using the V4L2 interface to allocate memory for buffers used to capture image data and poll socket descriptors to see if data is available. 
   ```console
   [you@bbb:~/usb_cam]$ make clean
   [you@bbb:~/usb_cam]$ make
   ``` 
4. Take a picture! This will produce 20 images, the first will be out000.ppm and the last will be out019.ppm. 
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
 
# A Note on the File Structure
- __checkpoints__ dir: Store all images with significant work done here (actual image will be stored on external harddrive since it's so big). 

