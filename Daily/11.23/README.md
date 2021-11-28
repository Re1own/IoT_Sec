# TP-Link CVE-2020-8423

## httpd栈溢出漏洞成因分析以及复现

### 0x01漏洞成因分析











首先解包

`binwalk -Me wr841nv10_wr841ndv10_en_3_16_9_up_boot\(150310\).bin`

发现下面几个文件都存在httpd

```sh
┌──(root💀kali)-[/home/re1own/Desktop/_wr841nv10_wr841ndv10_en_3_16_9_up_boot(150310).bin.extracted]
└─# grep -r "httpd" .
./squashfs-root/etc/rc.d/rcS:/usr/bin/httpd &
grep: ./squashfs-root/usr/bin/httpd: binary file matches
grep: ./squashfs-root/usr/sbin/pppd: binary file matches
grep: ./squashfs-root/usr/sbin/bpalogin: binary file matches
grep: ./squashfs-root/usr/sbin/xl2tpd: binary file matches
```

启动后

![image-20211123132438084](https://tva1.sinaimg.cn/large/008i3skNly1gwp0n62jv4j31ds0s6dmd.jpg)

![image-20211123132452297](https://tva1.sinaimg.cn/large/008i3skNly1gwp0nd2i4jj317j0u0gx9.jpg)

打不开

![image-20211123132517021](https://tva1.sinaimg.cn/large/008i3skNly1gwp0nsn63ij30ko0sm0ts.jpg)

需要劫持fork和system函数

劫持函数hook.c

```c
#include <stdio.h>
#include <stdlib.h>

int system(const char *command){
    printf("HOOK:system(\"%s\")",command);
    return 1337;
}

int fork(void){
    return 1337;
}
```

mips大端交叉编译

`./cross-compiler-mips/bin/mips-gcc -shared -fPIC hook.c -o hook.so`

sudo qemu-system-arm -M vexpress-a9 -kernel vmlinuz-3.2.0-4-vexpress -initrd initrd.img-3.2.0-4-vexpress -drive if=sd,file=debian_wheezy_armhf_standard.qcow2 -append "root=/dev/mmcblk0p2" -net nic -net tap,id=hostnet0,ifname=tap0,script=no,downscript=no -nographic



```
qemu-system-mips -M malta -kernel vmlinux-2.6.32-5-4kc-malta -hda debian_squeeze_mips_standard.qcow2 -append "root=/dev/sda1 console=tty0" -net nic -net tap,id=hostnet0,ifname=tap0,script=no,downscript=no -nographic
```



运行

`qemu-mips -E LD_PRELOAD=./hook.so -L . ./usr/bin/httpd`

访问192.168.0.1，成功！







# Dahu



```sh
┌──(root💀kali)-[/home/re1own/Desktop]
└─# ./opt/FriendlyARM/toolschain/4.4.3/bin/arm-linux-gcc-4.4.3 -shared -fPIC hook.c -o hook.so 
/home/re1own/Desktop/opt/FriendlyARM/toolschain/4.4.3/bin/../lib/gcc/arm-none-linux-gnueabi/4.4.3/../../../../arm-none-linux-gnueabi/bin/as: error while loading shared libraries: libz.so.1: cannot open shared object file: No such file or directory
```

上面编译报错，这是因为系统是64位的，需要有32位的库，解决方式

`sudo apt-get install lib32z1`

成功编译后放进文件系统中

`cp hook.so squashfs-root `

