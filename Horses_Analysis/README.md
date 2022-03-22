## 挂载感染硬盘

在linux系统中挂载img镜像文件，我们需要挂载这个img文件

![image-20211222150040845](https://s2.loli.net/2021/12/22/9ixoQdrknAD12Kb.png)

首先通过命令`fdisk 192.168.10.1-2021-11-29.img`然后`p`命令查看磁盘的分区情况，units为512bytes/sectors，然后根据下面device中start开始的2048，去计算offset，offset = 512 * 2048 = 1048576

![image-20211226174734936](https://s2.loli.net/2021/12/26/DZjbE9k7BsOV4YH.png)

然后挂载分区，命令` mount -o loop,offset=1048576 192.168.10.1-2021-11-29.img /mnt/`，然后进入/mnt目录下就可以看了。

![image-20211226174805477](https://s2.loli.net/2021/12/26/gd6ZXeKWUwEGYQp.png)

## linux敏感目录tmp分析

可疑文件夹分别是Oct 17之后的这8个

![image-20211226174909213](https://s2.loli.net/2021/12/26/tMDnHUdmsh6zqw7.png)

用clamscan分别对这8个文件夹进行扫描，并没有发现任何感染的文件

![image-20211226175209909](https://s2.loli.net/2021/12/26/qHO6teLE4BsUgW9.png)

开机自启动排查

查看开机自启动程序，发现selinux和DbSecuritySpt在开机自启动中

![image-20211226175327581](https://s2.loli.net/2021/12/26/Hwp6axEuvei97jU.png)

.ssh下的authoritized keys被攻击者访问或修改过

![image-20220106154530439](https://s2.loli.net/2022/01/06/5vx7y6gKJrbD43q.png)

## 分析DbSecuritySpt

发现木马的位置是在./etc/init.d/DbSecuritySpt，./etc/init.d/DbSecuritySpt是一个文本文件，文本里的861fa10b52文件已经有读写执行权限了

![image-20211226175550589](https://s2.loli.net/2021/12/26/ZhEv4LtTd1XUsSw.png)

放沙箱分析发现是一个后门程序，属于远控木马

![image-20211226165517183](https://s2.loli.net/2021/12/26/aN23C8GOwtD5rsA.png)



![image-20211226165758787](https://s2.loli.net/2021/12/26/5iBwsCZ4YmNqDM2.png)

继续分析selinux开机启动程序，发现也是一个后门程序

![image-20211226170013614](https://s2.loli.net/2021/12/26/1YZvHyuSinCXaAp.png)



![image-20211226170335758](https://s2.loli.net/2021/12/26/zYw2yGmJENI9x5j.png)

查看是否加壳，并没有

![image-20211226181158609](https://s2.loli.net/2021/12/26/c9EgXJiyn6bGK83.png)

直接放ida分析，字符串里面可以看到一些IP信息，加载内核命令，恶意攻击函数名，充满了恶意

![image-20211226181004757](https://s2.loli.net/2021/12/26/ZNtp9TCxErgd7sY.png)

随后还有331个ip在木马程序里，猜测是331个肉鸡

![image-20211226181427614](https://s2.loli.net/2021/12/26/W4TviQxPhDj1oEs.png)

分析main函数，程序逻辑很简单，CSysTool::CheckGatesType(v11);决定g_iGatesType类型，木马做什么，四个功能，分别是检查更新、MainBeikong，MainBackdoor（后门），MainSystool，MainMonitor

```c
int __cdecl main(int argc, const char **argv, const char **envp)
{
  void *v3; // esp
  CFileOp *v4; // eax
  int v5; // eax
    .....
    .....
    .....
    .....
  CSysTool::CheckGatesType(v11);
  CSysTool::Ikdfu94();
  if ( (unsigned __int8)CSysTool::IsUpdateTemporary(v12) )
  {
    CSysTool::DoUpdate((CSysTool *)argc, (int)argv);
  }
  else if ( g_iGatesType == 1 )
  {
    MainBeikong();
  }
  else if ( g_iGatesType > 1 )
  {
    if ( g_iGatesType == 2 )
    {
      MainBackdoor();
    }
    else if ( g_iGatesType == 3 )
    {
      MainSystool(argc, (char **)argv);
    }
  }
  else if ( !g_iGatesType )
  {
    MainMonitor();
  }
  std::string::~string((std::string *)v13);
  std::string::~string((std::string *)v14);
  return 0;
}
```

但是在四个分支执行之前，有一个Ikdfu94函数需要注意的，里面有一串很长的字符串

![image-20211226202528577](https://s2.loli.net/2021/12/26/RIsFWpr4GmtY6NV.png)

目前这段字符串是加密的，解密算法好像很复杂，还没研究明白

```
88FD2FE8EF8D51263B037677FD30F25CBFEB57F759F711FB41956288A85E9655F54FCCD1ABAAE55CF8BFB033B8F30342EC9930E4DA755715E37BFDF38ACFCC52569DA683A2B3B87A5C571840486689B97D8E7660C3F644B1F7F00778DBDEDE4CFD0CBBB222FC42C8F8ECE125D09D98EC50E5CF8093CF81D9E4F67FBA1E6A90O963846C17933E3C078E1EC409C799C84741C04892CC25E69FED40664BC85B955BEE188A63C9A3909D187ADE7DB69A66F83878E56E2FDD7CD5866DC4AC41EFC7EE9785806DAC64C1953F6A22F99317337B9F0DF3E26C365A8075076FA258CE2F0D6AC63BD6783E2A27CEB2A2410BC80232BABE5FB2C015263E64E1BAE2369822F
```

再来到MainBeikong，函数先会调用daemon创建一个后台进程。在daemon里，父进程会直接exit(0)退出，子进程会调用setsid()，setsid()调用成功后，返回新的会话的ID，调用setsid函数的进程成为新的会话的领头进程，并与其父进程的会话组和进程组脱离。此时子进程的父进程会变成1号进程。然后改变当前目录为“/"

```c
int MainBeikong(void)
{
  int result; // eax
  CSysTool *v1; // eax
  CUtility *v2; // eax
  const char *v3; // eax
  CSysTool *v4; // eax
  CSysTool *v5; // eax
......
......
  result = daemon(1, 0) >> 31;
  if ( !(_BYTE)result )
  {
    CSysTool::KillChaos(v19);
    v1 = (CSysTool *)std::string::c_str((std::string *)&g_strML);
    CSysTool::KillPid(v1, v10);
    CSysTool::KillPid((CSysTool *)"/tmp/bill.lock", v11);
    CFileOp::RemoveFile((CFileOp *)"/tmp/bill.lock", v12);
    if ( (unsigned __int8)CSysTool::KillGatesIfExist(v20) != 1 )
      MEMORY[0] = 0;
    if ( g_iIsService == 1 )
    {
      v2 = (CUtility *)std::string::c_str((std::string *)&g_strSN);
      CUtility::SetAutoStart(v2, (const char *)0x61, v18);
    }
    if ( g_iDoBackdoor == 1 && (unsigned __int8)CUtility::IsRoot(v21) == 1 )
    {
      v3 = (const char *)std::string::c_str((std::string *)&g_strBDG);
      CSysTool::GetBackDoorLockFile((CSysTool *)v25, v3);
      v4 = (CSysTool *)std::string::c_str((std::string *)v25);
      CSysTool::KillPid(v4, v14);
      CSysTool::GetBackDoorLockFile((CSysTool *)v26, "udevd");
      std::string::operator=(v25, v26);
      std::string::~string((std::string *)v26);
      v5 = (CSysTool *)std::string::c_str((std::string *)v25);
      CSysTool::KillPid(v5, v15);
      v6 = (CFileOp *)std::string::c_str((std::string *)v25);
      CFileOp::RemoveFile(v6, v16);
      v7 = (const char *)std::string::c_str((std::string *)&g_strBDG);
      CSysTool::GetBackDoorFile((CSysTool *)v24, v7);
      v8 = (CSysTool *)std::string::c_str((std::string *)v24);
      CSysTool::ReleaseAndStartGates(v8, v17);
      std::string::~string((std::string *)v24);
      std::string::~string((std::string *)v25);
    }
    if ( (unsigned __int8)CUtility::IsRoot(v21) )
    {
      CSysTool::SetBeikongPathfile(v22);
      v9 = (CSysTool *)std::string::c_str((std::string *)&g_strMonitorFile);
      CSysTool::ReleaseAndStartGates(v9, v13);
    }
    else
    {
      CFileOp::RemoveFile((CFileOp *)"/tmp/notify.file", v13);
    }
    MainProcess();
  }
  return result;
}

int __cdecl daemon(int a1, int a2)
{
  int v2; // eax
  int result; // eax
....
  v2 = fork();
  if ( v2 == -1 )
    return -1;
  if ( v2 )
    exit(0);
  if ( setsid() == -1 )
    return -1;
  if ( !a1 )
    chdir("/");
  if ( a2 )
    return 0;
  v4 = _open_nocancel("/dev/null", 2, 0);
  if ( v4 == -1 || _fxstat64(3, v4, &v7) )
  {
    v6 = sys_close(v4);
    result = -1;
  }
  else if ( (v7.st_mode & 0xF000) == 0x2000 && v7.st_rdev == 259 )
  {
    dup2(v4, 0);
    dup2(v4, 1);
    dup2(v4, 2);
    if ( v4 <= 2 )
      return 0;
    close(v4);
    result = 0;
  }
  else
  {
    v5 = sys_close(v4);
    __writegsdword(0xFFFFFFE8, 0x13u);
    result = -1;
  }
  return result;
}
```

MainBeikong还会通过KillChaos来判断pid文件中的pid是否和当前运行的pid一致，如果不一致就杀掉当前进程，接着会调用RemoveFIle将文件/tmp/bill.lock移除，随后的KillGatesIfExist检测pid，SetAutoStart自启

![image-20211226203145883](https://s2.loli.net/2021/12/26/eFQ5Sg6h1xrscOZ.png)

KillGatesIfExist也是进程检测，不同于之前的是这次会把pid写进去

![image-20211226203445072](https://s2.loli.net/2021/12/26/URtnKcGJCmXbEWY.png)

SetAutoStart将木马加入了自启

![image-20211226203642794](https://s2.loli.net/2021/12/26/8tbhmTH2Bx4AEcV.png)

分析MainBackdoor，先会去锁定后门木马程序，然后SetAutoStart函数将之加入开机启动

```c
void MainBackdoor(void)
{
  const char *v0; // eax
  CSysTool *v1; // eax
  CSysTool *v2; // eax
  CUtility *v3; // eax
  const char *v4; // [esp-Ch] [ebp-24h]
  const char *v5; // [esp-Ch] [ebp-24h]
  int *v6; // [esp-8h] [ebp-20h]
  char v7[4]; // [esp+10h] [ebp-8h] BYREF

  if ( daemon(1, 0) >= 0 )
  {
    v0 = (const char *)std::string::c_str((std::string *)&g_strBDG);
    CSysTool::GetBackDoorLockFile((CSysTool *)v7, v0);
    v1 = (CSysTool *)std::string::c_str((std::string *)v7);
    if ( !(unsigned __int8)CSysTool::IsPidExist(v1, v4) )
    {
      v2 = (CSysTool *)std::string::c_str((std::string *)v7);
      CSysTool::MarkPid(v2, g_iBackdoorLock, v6);
      v3 = (CUtility *)std::string::c_str((std::string *)&g_strBDSN);
      CUtility::SetAutoStart(v3, (const char *)0x63);
      CSysTool::HandleSystools((CSysTool *)&unk_8100D38, v5);
      MainProcess();
    }
    std::string::~string((std::string *)v7);
  }
}
```

再MainProcess里，有一个DNSCache的，此函数是用来更新DNS

![image-20211226204046300](https://s2.loli.net/2021/12/26/4UeMPaCADRl8YgV.png)

更新函数CSysTool::DoUpdate中有一个"google"字符串的

![image-20211226204248852](https://s2.loli.net/2021/12/26/X8N9DcGY1vK2g73.png)

再一个CStatBase::Initialize用来获取系统信息

```c
int __cdecl CStatBase::Initialize(CStatBase *this)
{
  CStatBase::GetOs(this);
  CStatBase::GetCpuSpd(this);
  CStatBase::InitCpuUse(this);
  CStatBase::InitNetUse(this);
  CStatBase::GetMemSize(this);
  return CStatBase::GetLocalDevicesInfo(this);
}
```

分析完这些还是没能找到攻击者的一些信息，推测就是前面那一串字符串加密了，攻击者的信息应该存放在那段很长的字符串中，现在试试网络抓包的方式看看能不能找到攻击者的信息，现在自己的虚拟机上运行木马程序，果不其然中招了

![image-20211226191350027](https://s2.loli.net/2021/12/26/W2TeE7HgFM3YNmC.png)

用wireshark抓包，出现了可疑的陌生域名gaopei.dnsm.xyz和601.dnsm.xyz，

![image-20211226191252186](https://s2.loli.net/2021/12/26/sEQ8Vuzw173MO9T.png)

在main函数的开头，Ower6msf内是第一组解密数据的函数

![image-20220103142824187](https://s2.loli.net/2022/01/03/ygUVxd8FbHoesnJ.png)

通过gdb可以直接调出来加密字符串解密后的内容

先对0x8077CF0（Ower6msf函数的地址）进行断点

![image-20220103143055378](https://s2.loli.net/2022/01/03/breoYO9aWCQyS2n.png)

紧接着把加密字符串传入了寄存器

![image-20220103143203323](https://s2.loli.net/2022/01/03/QjYB4afk1EPin5F.png)

接下来逐步对解密的地方逐一断点就行，字符串解密出来是"/usr/bin/.sshd:30000:1223123:772124:773152:4f58574098255d"

![image-20220103144223118](https://s2.loli.net/2022/01/03/QvBILJmgiojAw1r.png)

上面解密出来的字符串会依次赋值给g_strMonitorFile、g_uHiddenPt、g_iFIleSize、g_iHardStart、g_iSoftStart、g_strDoFun对应值如下

![image-20220103144136001](https://s2.loli.net/2022/01/03/DYsWNp65SQXgyUr.png)

接下来继续往下，发现有反gdb调试的

![image-20220103144500856](https://s2.loli.net/2022/01/03/h8936lKfv14yjtB.png)

虽然反gdb调试，但就是个笑话，我们直接控制EIP跳过反调试函数就行了（都没必要patch）

![image-20220103144834119](https://s2.loli.net/2022/01/03/se73qikh8VtRXlK.png)

先断点到0x8062716，然后set $eip=0x8062723，直接绕过反调试了

![image-20220103145001073](https://s2.loli.net/2022/01/06/Q5YuAFcLDB9j7ZS.png)

接下来进入第二次解密函数Ikdfu94，解密出来的信息“115.231.218.64:8226:1:1:ssh4ckss:1”

![image-20220103145810396](https://s2.loli.net/2022/01/03/zE5DnTJU3hckVyi.png)

域名也解密出来了

![image-20220103150830270](https://s2.loli.net/2022/01/03/amJzCEVBNe53RwZ.png)

断点到0x80625b2处后发现木马逃跑了![image-20220103152908875](https://s2.loli.net/2022/01/06/NDZg9YQLtnIXKPV.png)

在ida中分析逃跑的地址，发现刚开始运行的进程会在RunLinuxShell中创建一个子进程，然后子进程完成cp file /usr/bin/bsd-port/getty命令

![image-20220103212217538](https://s2.loli.net/2022/01/03/qXY3KAFNraVnHdT.png)



总结：

Gatestype == 0时，执行MainMonitor，创建子进程并向`/tmp/moni.lod`文件写入进程号，读取并删除`/tmp/notify.file`文件，线程循环挂起一分钟。

![image-20220106140542757](https://s2.loli.net/2022/01/06/qQPWlbsR3a2L8k9.png)

Gatestype == 1时，执行MainBeikong，

结束并删除`/tmp/moni.lod`进程。创建自启动项`/etc/init.d/DbSecuritySpt`，并写入`#!/bin/bash\n(filepath)\n`filepath为当前程序路径。创建自启动项`/etc/rc(1-5).d/S97DbSecuritySpt`，执行`ln -s /etc/init.d/DbSecuritySpt (filepath)`创建软链接。

判断当前`g_iDoBackdoor`的值以及当前进程是否为root用户创建，如果都为true，则结束`/usr/bin/bsd-port/getty.lock`进程和`/usr/bin/bsd-port/udevd.lock`进程，并删除第二个文件。并且命令执行拷贝进程文件于`/usr/bin/bsd-port/getty`。

如果是root执行的程序，则命令执行拷贝进程文件在`/usr/bin/.sshd`。

如果不是root执行的，则删除`/tmp/notify.file`。

最终执行`MainProcess`函数，删除进程路径下的update_temporary。在`/etc/resolv.conf`下添加DNS（8.8.8.8和8.8.4.4）。初始化conf.n和cmd.n文件，初始化计算机基本信息（cpu、os、net、内存和磁盘信息）。初始化330个DNS地址。读取/usr/lib/libamplify.so文件配置amp资源数据。

后面就是服务端根据受害者计算机返回的信息，初始化数据执行对应的DDOS攻击：

![image-20220103221915025](https://s2.loli.net/2022/01/03/uUyHf9S8c54hwCz.png)

GatesType == 2时

判断是否存在`/usr/bin/bsd-port/getty.lock`后门文件，存在则写入进程号并创建`etc/init.d/selinux`和`/etc/rc(1-5).d/S99selinux`启动项文件，之后和上面创建启动项相同，不过项目换了一个，就不多说了。然后判断如果存在`Systools`中的文件，则复制到`/usr/bin/dpkgd/md`文件下生成netstat，lsof等文件，并设置0755权限，最后又执行了同上面一样的`MainProcess`函数。

![image-20220103222025649](https://s2.loli.net/2022/01/03/Y6SL5k2wrDh4Kad.png)

GatesType == 3时

执行`MainSystool`函数。此函数主要调用上面所说的复制过去的netstat、lsof、ps等程序，而后过滤掉进程目录，服务端输出。

![image-20220106140704691](https://s2.loli.net/2022/01/06/vNBpu8A53sxItXJ.png)

分析attack发现存在udp，进一步判断木马的攻击行为很可能是DDos攻击

![image-20220106141826387](https://s2.loli.net/2022/01/06/t5fxviczpLlrako.png)



开机启动项木马攻击总结：此次攻击应该是先通过暴力破解huawei帐户密码，弱口令来植入木马，木马添加DbSecuritySpt服务到自启中，DbSecuritySpt是木马主程序，又有回传受控地址，但是木马程序中并没有直接的服务器域名或者是攻击者的ip，而是有一串非常长的字符串（加密了的），如果能破解出来应该就能知道攻击者的信息了，经过gdb逐步调试，到第二次解密函数前需要绕过反gdb调试，绕过后在gdb中可以看到攻击者的ip和域名（wireshark并没有抓到ip只有域名，域名已经过期无法解析，但是攻击者的域名解析ip隐藏在木马中被泄露）

![image-20211226180045128](https://s2.loli.net/2021/12/26/uIaq34TKV5F8pNo.png)

对其他文件（木马）的分析，按照可疑时间揪出来另外两个木马程序，分别是sphp和spts，查看管理员权限用户：

```sh
root@ubuntu:/mnt# awk -F: '$3==0{print $1}' etc/passwd
root
mysq1
f1
```

查看能远程登录的用户：

```sh
root@ubuntu:/mnt# awk '/\$1|\$6/{print $1}' etc/shadow
huawei:$6$JwPdv1QU$jaYTZgzRES8I6H02D03KgfC9NQW5FuL0K./q3.GPO6ebgpM/BmU/wWjl8ePdAlvXqrd03p6LcWbG9.S.PFJqv1:18957:0:99999:7:::
mysq1:$1$mysq1$dDX0.Cns4QkH589JvATFI.:18904:0:99999:7:::
f1:$6$.oQp1HQe$RFmUfOrQ449leF16Vu287OWYg2Jy0PR2uxNGuUXsVBVT3.mGK0oohPOxlgb.HAA9r/H0YDCM7E8ZRNeWaPw5t/:18957:0:99999:7:::
```

查看可以，sphp木马文件加了一层upx的壳

![image-20211224145615037](https://s2.loli.net/2021/12/24/qVxAwgDKnYa9kvr.png)

![image-20211224180045212](https://s2.loli.net/2021/12/24/dZQhMgSWz5kO1xB.png)

## 沙箱检测：

![image-20211226152330702](https://s2.loli.net/2021/12/26/RflJ8hWzHYIF7OU.png)





这个木马加上了upx的壳

![image-20211226152409199](https://s2.loli.net/2021/12/26/FjsNTIKYLe9Q83S.png)



45.77.67.13是一个德国的ip

![image-20211226152454729](https://s2.loli.net/2021/12/26/aPLjA62JxdXvK1Y.png)

分析sbin，在时间点Oct 17时间，https和httpss修改过

![image-20211226160702559](https://s2.loli.net/2022/03/22/oNIt8MlTUkvFm5u.png)

查看httpss

![image-20211226160757330](https://s2.loli.net/2022/03/22/XSwEFljCcgdpAHe.png)



把https放到沙箱分析

![image-20211226161202879](https://s2.loli.net/2022/03/22/s9TpeEY6vM4PFqL.png)

于此同时，还找到一个跟https连同工作的几个马，它们都是矿马，

![image-20220106152338317](https://s2.loli.net/2022/01/06/vmktDYdPTqwfiUB.png)

其中需要分析shh木马，是一个加了upx的壳，需要先脱壳处理

![image-20220106152228756](https://s2.loli.net/2022/01/06/TEnqRbJtdXi62Zy.png)

然后ida逆向出来发现有挖矿的账号登录操作

![image-20220106152440986](https://s2.loli.net/2022/01/06/I7O5ouyLHgnPVG1.png)





## 对可疑攻击者进行渗透

这里是对在DbSecuritySpt木马(用于DDos攻击的木马)中泄露的ip进行渗透，ip为115.231.218.64

端口扫描

```sh
PS D:\GitHub\dirsearch> nmap -PN 115.231.218.64
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times will be slower.
Starting Nmap 7.91 ( https://nmap.org ) at 2022-01-06 17:47 ?D1ú±ê×?ê±??
Nmap scan report for 115.231.218.64
Host is up (0.074s latency).
Not shown: 961 closed ports
PORT      STATE    SERVICE
23/tcp    filtered telnet
42/tcp    filtered nameserver
53/tcp    filtered domain
88/tcp    open     kerberos-sec
135/tcp   filtered msrpc
139/tcp   filtered netbios-ssn
389/tcp   filtered ldap
445/tcp   filtered microsoft-ds
464/tcp   filtered kpasswd5
593/tcp   filtered http-rpc-epmap
636/tcp   filtered ldapssl
1022/tcp  filtered exp2
1023/tcp  filtered netvenuechat
1025/tcp  filtered NFS-or-IIS
1720/tcp  filtered h323q931
1723/tcp  filtered pptp
3001/tcp  filtered nessus
3003/tcp  filtered cgms
3306/tcp  open     mysql
4444/tcp  filtered krb524
4899/tcp  filtered radmin
5000/tcp  open     upnp
5100/tcp  open     admd
5800/tcp  filtered vnc-http
5900/tcp  filtered vnc
6000/tcp  open     X11
6667/tcp  filtered irc
6669/tcp  filtered irc
7000/tcp  open     afs3-fileserver
7100/tcp  open     font-service
8088/tcp  open     radan-http
8899/tcp  open     ospf-lite
49152/tcp open     unknown
49153/tcp open     unknown
49154/tcp open     unknown
49155/tcp open     unknown
49156/tcp open     unknown
49157/tcp open     unknown
49163/tcp open     unknown
```

在88端口下http://115.231.218.64:88/assets/

![image-20220107161119533](https://s2.loli.net/2022/01/07/e9nTWdI4yiSxQpj.png)

从其他目录可以看出，这个攻击者的服务器还用于做游戏，其中一个目录下发现了qq群图片

![image-20220107160503857](https://s2.loli.net/2022/01/07/v9SkqupXLQ7VRyW.png)

发现的确是一个游戏相关的

![image-20220107162020365](https://s2.loli.net/2022/01/07/TgQUASW9ldR7Z2h.png)

mysql、phpstudy暂未发现可以利用的漏洞，但是Mongo存在未授权访问，可以直接连上数据库，不过数据库内容是一些玩家的账号和密码信息等，并没有攻击者或者管理员的一些可利用的信息

![image-20220107163253401](https://s2.loli.net/2022/01/07/856hQvflWi3GmMq.png)

如果需要进一步调查，最好的办法是直接进行社工





## 挖矿木马shh分析

运行shh矿马后，发现CPU已经开始超频

![image-20220107105626190](https://s2.loli.net/2022/01/07/Q5hegZMzn7xrIuc.png)

shh开了很多保护，比如ASLR、PIE、NX

![image-20220107165554042](https://s2.loli.net/2022/01/07/viDNdzqFHLAl8KB.png)

因为开启了PIE，每次启动程序基地址都会是一个随机的值，无法直接通过ida去定位，所以需要先计算出基地址，可以通过vmmap查看，试了第二个，然后加上ida上的偏移，成功断点定位到start的地址了

![image-20220107144045753](https://s2.loli.net/2022/01/07/5iIpe3jCbB4XL89.png)

不过通过gdb -p的方式去调试，已经错过了输入账号密码的时候了，尝试去寻找账号配置文件，config.json

![image-20220107143706426](https://s2.loli.net/2022/01/07/QntW3UhHjoklLw4.png)

用find去全盘搜

![image-20220107144620862](https://s2.loli.net/2022/01/07/5SzBk2ZnhVlUjoa.png)

有一个config.json值得怀疑，因为时间跟木马感染主机时间差不多，但cat后，发现是网关地址

![image-20220107144912463](https://s2.loli.net/2022/01/07/KjPcxeTiOm1z6WI.png)

ida继续往下翻字符串可以找到攻击者的比特币钱包地址为：8612WpYrCaST2SgtVHHvyL9SApwUKHbRV3VeYVRFG5J7SqskQJetpAYYXpoAchKsMdVN7t1au1Bo8PK7PiXp2Cdg7j3nxnE

![image-20220107152020418](https://s2.loli.net/2022/01/07/g5Qw1AtbaXmM4ye.png)

挖矿木马用的是xmrig，攻击者的钱包地址已经逆向分析出来，但是无法溯源，攻击者没有和木马有直接的联系，而是直接把自己钱包地址的挖矿木马感染到主机



