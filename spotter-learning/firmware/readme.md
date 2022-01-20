从官网上获取固件：https://www.sofarocean.com/posts/spotter-firmware-updates

![image-20220119174402577](https://tva1.sinaimg.cn/large/008i3skNly1gyj4glv3gkj316s0o8q5g.jpg)

主要是4个文件，flash-upload、Spotter_v1_12_0.hex、Spotter_v1_12_0.eep、avrdude（未分析）

![image-20220119174506763](https://tva1.sinaimg.cn/large/008i3skNly1gyj4hpk2uyj314q0h2dif.jpg)

flash-upload顾名思义，就是用于往设备的flash中写东西，里面写了什么？可以先逆向分析下flash-upload，用010 Editor打开，是一个python脚本

```python
#!/usr/bin/env python
# Created By: Evan Shapiro 03/07/2017

import argparse
import glob
import subprocess
import os
from time import sleep
import platform
import sys

#TODO - add timeout to subprocess call

if __name__ == '__main__':
  '''Uploads hex and elf files to Spotter using avrdude bootloader utils'''
  parser = argparse.ArgumentParser(
    description='flash-upload arguments:'
  )
  parser.add_argument(
    '--device', '-d', dest='device',
    help='usb tty device'
  )
  args = parser.parse_args()
  use_shell = False

  script_dir = os.path.dirname(os.path.realpath(__file__))

  device = args.device
  system = platform.system()

  if not device:
    if system == 'Darwin': # OSX
      dev_list = glob.glob('/dev/tty.usbserial*')
      if len(dev_list):
        device = dev_list[0]
        if len(dev_list) > 1:
          print('\n\033[33mWarning more than 1 usb serial device found. uploading to:' + device + '\033[0m')
    elif system == 'Windows':
      import serial.tools.list_ports as ser_ports
      dev_list = ser_ports.comports()
      for dev in dev_list:
        if dev.vid == 1027 and dev.pid == 24577:
          device = dev.device
          break
      use_shell = True
    elif system == 'Linux':
      dev_list = glob.glob('/dev/ttyUSB*')
      if len(dev_list):
        device = dev_list[0]
        if len(dev_list) > 1:
          print('\n\033[33mWarning more than 1 usb serial device found. uploading to:' + device + '\033[0m')
    if getattr(sys, 'frozen', False): # This is triggered when using PyInstaller to create standalone apps (both Windows and OSX)
      script_dir = sys._MEIPASS

  if not device:
    print('\n\033[31mNo device specified or found!\033[0m')
    sleep(20)
    sys.exit(1)

  hex_file = os.path.realpath( glob.glob('{0}/dat/*.hex'.format(script_dir) )[0] )
  if not hex_file:
    print('\n\033[31mNo hex file found!\033[0m')
    sleep(20)
    sys.exit(1)

  eep_file = os.path.realpath( glob.glob('{0}/dat/*.eep'.format(script_dir) )[0] )
  if not eep_file:
    print('\n\033[31mNo eep file found!\033[0m')
    sleep(20)
    sys.exit(1)

  conf_file = os.path.realpath(glob.glob('{0}/dat/avrdude.conf'.format(script_dir) )[0])
  if not conf_file:
    print('\n\033[31mNo conf file found!\033[0m')
    sleep(20)
    sys.exit(1)

  args_file = os.path.realpath( glob.glob('{0}/dat/*avrdude_args'.format(script_dir) )[0] )
  with open(args_file) as f:
    args = f.readlines()
  args = [ arg.strip() for arg in args ]
  if not args:
    print('\n\033[31mNo args file found!\033[0m')
    sleep(20)
    sys.exit(1)

  print('\n\033[34mUploading to\033[1;36m ' + device + '\033[0m')
  print('\t\033[36m' + os.path.basename( hex_file ) + '\033[0m')
  print('\t\033[36m' + os.path.basename( eep_file ) + '\033[0m')

  arg_list = []
  arg_list.append( str('-P' + device) )

  for arg in args:
    if arg.startswith('-U'): continue
    if arg.startswith('-P'): continue
    if arg.startswith('-C'): continue
    if arg.startswith('-v'): continue
    if arg.startswith('AVRDUDE'): continue
    arg_list.append(arg)

  if system == 'Darwin' or system == 'Linux':
    arg_list.append( str('-U' + hex_file) )
    arg_list.append( str('-U' + eep_file) )
  elif system == 'Windows':
    arg_list.append( str('-Uflash:w:' + hex_file + ':i') )
    arg_list.append( str('-Uflash:w:' + eep_file + ':i') )
  arg_list.append( str('-C' + conf_file) )

  arg_list.insert( 0, '{0}/bin/avrdude'.format(script_dir) )

  p = subprocess.Popen(arg_list, bufsize=1, universal_newlines=True, stdout=subprocess.PIPE, shell=use_shell)
  try:
    p.wait()
    assert p.returncode == 0
    print('\033[32mUpload succeeded\033[0m')
    sleep(8)
    sys.exit(0)
  except Exception as err:
    print( '\033[31mUpload FAILED!\033[0m' )
    p.kill()
    print( '\033[31m', err, '\033[0m' )
    sleep(20)
    sys.exit(1)
```

大概意思就是先监测usb连接设备没有，然后判断操作系统类型，最后往里写入hex和eep文件

```python
  if system == 'Darwin' or system == 'Linux':
    arg_list.append( str('-U' + hex_file) )
    arg_list.append( str('-U' + eep_file) )
  elif system == 'Windows':
    arg_list.append( str('-Uflash:w:' + hex_file + ':i') )
    arg_list.append( str('-Uflash:w:' + eep_file + ':i') )
```

因此可以大概率推测hex就是设备的固件了，至于eep是什么，cat一下，就是一个地址0x1FF，这个地址是CRLF的结尾标志

```sh
🍎 ~/Re1own/spotter-learning/firmware/Spotter_v1.12.0/dat/ [master*] cat Spotter_v1_12_0.eep 
:00000001FF
```

另一个hex形式的，也是CRLF结尾，cat也会发现最后是0x1FF

```sh
🍎 ~/Re1own/spotter-learning/firmware/ [master*] file Spotter_v1_12_0.hex 
Spotter_v1_12_0.hex: ASCII text, with CRLF line terminators
```

接下来就是逆向hex了，根据grep搜集到的信息，从手册中可以指导spotter使用的是ARM® Cortex™-M3芯片，选择ARM小端逆向，但是目前未知固件的加载地址，导致IDA没法正常反汇编出函数等

![image-20220119175335721](https://tva1.sinaimg.cn/large/008i3skNly1gyj4qjpy0pj31fu0u0dlr.jpg)



