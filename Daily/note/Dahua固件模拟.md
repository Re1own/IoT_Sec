<<<<<<< HEAD
<<<<<<< HEAD
# 大华固件模拟

用grep搜httpd的方式找到web服务启动脚本，为sonia，arm架构，小端可执行文件

![image-20211114170159417](https://i.loli.net/2021/11/14/tsbjLYCefXMHo3g.png)

qemu用户模式去启动，发现报错，卡在了PDI_productGetHwidInfoByChip函数

`qemu-arm -L . ./bin/sonia`

![image-20211114170325784](https://i.loli.net/2021/11/14/no6VRXcf58ES2Jh.png)

grep搜一下这个函数，发现此函数是在lib目录下名为libpdi.so的动态链接库文件中

![image-20211114170523467](https://i.loli.net/2021/11/14/9YcGfu4BVDiZXJw.png)

把这个动态链接库反汇编然后查看这个PDI_productGetHwidInfoByChip函数，发现是存在一个死循环，推测我们是进入了这个循环所导致的

![image-20211114170856013](https://i.loli.net/2021/11/14/mIBZ4aPpfeYMugo.png)

一开始我单独的去把while的死循环给patch掉了，可以管一时之用，但后面紧接着又报错很多其他类似上述死循环的函数，而且不太好改，推测它处于一个大范围的硬件函数中，因此我们这里可以查看谁调用了PDI_productGetHwidInfoByChip函数（但目前来说很多不太好确定是谁）或者把这个函数直接返回0（采用这种方式）

把PDI_productGetHwidInfoByChip函数patch为：

```asm
MOV.W R0, #0				
BX LR
```

上面的两段汇编相当于return 0，改完后PDI_productGetHwidInfoByChip函数是这样的，直接返回0了

![image-20211114171554787](https://i.loli.net/2021/11/14/zxZNJnMl9uhOavQ.png)

改完后输出了很多的信息，但是在PDI_getChipInfo处卡住了

![image-20211114171819893](https://i.loli.net/2021/11/14/uRz1AE7LjeZSmrW.png)

同样先grep，发现这个函数同样是在这个libpdi.so动态链接库中的，反汇编发现也是卡在了一个while(1)的死循环地方

![image-20211114171959990](https://i.loli.net/2021/11/14/48LklJQ7CEBr3Ds.png)

查看它的调用，还是太多了，因此继续改，不过跟上面有点区别

修改内容：

```asm
CBZ R0, loc_78C1C 修改为了B loc_78C1C
MOV.W R0, #0xFFFFFFFF 修改为了MOV.W R0, #0
```

![image-20211114172443175](https://i.loli.net/2021/11/14/nw9maAoh3G7OD5b.png)

改完后反汇编ok

![image-20211114172334752](https://i.loli.net/2021/11/14/W7BshL8mxprHGuS.png)

输出的信息又多了一倍，卡在了函数PDI_productGetInfo处

![image-20211114172553762](https://i.loli.net/2021/11/14/OnLqWuMbSdyhJow.png)

又是这种死循环，出错函数是PDI_productGetInfo

![image-20211114172911172](https://i.loli.net/2021/11/14/jZsDyaKhSNmeL3Q.png)

因为函数开头又很多寄存器，其实也可以直接覆盖用我们自己的return 0汇编指令，但最好还是间接，对arm不熟悉还是拿个中间跳板吧

![image-20211114173152700](https://i.loli.net/2021/11/14/nyht2CXPaBMpkd1.png)

修改如下

CBZ R0, loc_78F74 ——>B loc_78F74

MOV.W R0, #0xFFFFFFFF ---> MOV.W R0, #0

![image-20211114173952907](https://i.loli.net/2021/11/14/4wSZqKmuDGyTg2V.png)

![image-20211114173940671](https://i.loli.net/2021/11/14/jcZA3glotquMwWU.png)

又卡住了，并且输出了上一次改动的地方旁边的信息

![image-20211114174159009](https://i.loli.net/2021/11/14/vNg2I6KhPr7eyUm.png)

卡住的函数为PDI_productGetName，调用成功应该返回0

![image-20211114174319545](https://i.loli.net/2021/11/14/l6yJtKOfS1YZWbQ.png)

同理修改

![image-20211114174645437](https://i.loli.net/2021/11/14/2wMbjzGtiKnsH9C.png)

![image-20211114174657173](https://i.loli.net/2021/11/14/GwPOkrc13VMILzd.png)

提示段错误

![image-20211114174751221](https://i.loli.net/2021/11/14/cjio9SZI3lPmFvt.png)

查看有哪些调用了PDI_productGetName函数，发现挺多的，随便点进去几个看看

![image-20211114180035418](https://i.loli.net/2021/11/14/jtD2KSYd7ozgckT.png)

在PDI_getFaceboardCfg函数里发现原因就是调用PDI_productGetName函数时传进来的参数（作为PDI设备名字的）为空或者非法值导致的崩溃，返回值并没有错应该是0

这个函数可以发现，下面如"SD6C80FA-GNX"、"SD6C82FA-GNX"等为合法的设备名字，如果我们在调用设备的时候给参数赋值为前面合法的值就好啦

![image-20211114175833570](https://i.loli.net/2021/11/14/RFoCSmvx8rf7Wls.png)

同理其他调用者也可能会出现上述错误

![image-20211114180356461](https://i.loli.net/2021/11/14/WlkfCdpNzX1AZn7.png)

在上述libpdi.so几个函数中依然没有找到是谁调用PDI_productGetName函数时产生的错误，因为我搜索最近的输出的信息的字符串并没有，因此推测可能是其他二进制文件调用了此函数产生的报错！去看看，grep找一下是谁，

因此我们换一种角度，可能是别的二进制文件调用了此动态链接库的PDI_productGetName函数，因此去grep一下字符串”Video Server - (C) 2011-2013 ZheJiang Dahua Technology“果然有个sonia

![image-20211114181559702](https://i.loli.net/2021/11/14/s3QmNrznjyYKWxf.png)

找到这段字符串的地址，进去看看调用它的函数

![image-20211114181836068](https://i.loli.net/2021/11/14/draDWGunb9vHsiM.png)

函数sub_9BBA09就是输出蓝绿色字符串信息的函数了，但是它下面并没有调用出错的函数，查看调用它的函数只有sub_9BBAA2调用过它两次

![image-20211114181906342](https://i.loli.net/2021/11/14/XavHeb3l5STEVpw.png)



总启动函数：sub_3B2F8

![image-20211114191306016](https://i.loli.net/2021/11/14/wfmZYVa1bdXhuDO.png)

将出错的函数NOP掉直接乱了，似乎这样并不可取

![image-20211114191405670](https://i.loli.net/2021/11/14/xZq51YumJlKsDbU.png)

但是这样能运行，只不过好像又卡了一个死循环，但这个死循环还没找到是在动态链接库libpdi.so的哪个地方

![image-20211114191515211](https://i.loli.net/2021/11/14/v49hHzdKo3YnxjA.png)

函数PDI_productTypeGet有问题，提示在libpdi.so

![image-20211121162723360](https://i.loli.net/2021/11/21/rJdLCWc6o51SzPI.png)

通过在ida中patch的方式，最后得到下图，段错误

![image-20211121164353338](https://i.loli.net/2021/11/21/eoOuL72wYqyiPsJ.png)

在不断patch后成功到了启动整个固件的中间部分了

![image-20211121164955735](../11.19/picture/11.19.assets/image-20211121164955735.png)

但在ida中只通过patch已经很难到病因了，下面通过gdb的方式，比如对此处地址0x3B41E先断点：

![image-20211121165940798](https://i.loli.net/2021/11/21/MPXaoAUDeNFbdjR.png)

qemu开端口让gdb调试：

```sh
qemu-arm -g 1234 -L . ./bin/sonia
```

启动gdb-multiarch

```sh
gdb-multiarch
set arch arm
set endian little
target remote :1234
```

![image-20211121165440082](https://i.loli.net/2021/11/21/H5ZoCJED8tSgLny.png)

对0x3B41E处断点，断下来了，而且和ida中的一致，说明到这都是ok的

![image-20211121165849651](https://i.loli.net/2021/11/21/Dxc6wMIBC1y8nZE.png)

下一步断这来，也就是0x3B7CE：

![image-20211121170419843](https://i.loli.net/2021/11/21/5yud9jn3s2ICX7c.png)

能够成功断下来，这一块是加载sqlite的，说明也ok，直接c，程序自己断到了0x56aeb0这个地址处

![image-20211121170826730](https://i.loli.net/2021/11/21/zpGdi8YJNgK9Os5.png)

ida查看发现就是当前这个报错的函数

![image-20211121170938112](https://i.loli.net/2021/11/21/6tC3DsdHpxRZuGA.png)

继续往下n或c都百搭，而这个createSystemWrapper是由sub_56ACC0调用，它有一个字符串"watch dog"，怀疑是看门狗玩多了

![image-20211121171258674](https://i.loli.net/2021/11/21/jV2RSNk4miyA8wM.png)

全局看流程图，发现这又是一个非常大量的硬件检测模块函数集合了

![image-20211121171355446](https://i.loli.net/2021/11/21/mTxikM8JwLSjZVn.png)

接下里想如果能直接跳过这一大段检测就好了！







MOV.W R0, #0				
BX LR
=======
=======
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
# 大华固件模拟

用grep搜httpd的方式找到web服务启动脚本，为sonia，arm架构，小端可执行文件

![image-20211114170159417](https://i.loli.net/2021/11/14/tsbjLYCefXMHo3g.png)

qemu用户模式去启动，发现报错，卡在了PDI_productGetHwidInfoByChip函数

`qemu-arm -L . ./bin/sonia`

![image-20211114170325784](https://i.loli.net/2021/11/14/no6VRXcf58ES2Jh.png)

grep搜一下这个函数，发现此函数是在lib目录下名为libpdi.so的动态链接库文件中

![image-20211114170523467](https://i.loli.net/2021/11/14/9YcGfu4BVDiZXJw.png)

把这个动态链接库反汇编然后查看这个PDI_productGetHwidInfoByChip函数，发现是存在一个死循环，推测我们是进入了这个循环所导致的

![image-20211114170856013](https://i.loli.net/2021/11/14/mIBZ4aPpfeYMugo.png)

一开始我单独的去把while的死循环给patch掉了，可以管一时之用，但后面紧接着又报错很多其他类似上述死循环的函数，而且不太好改，推测它处于一个大范围的硬件函数中，因此我们这里可以查看谁调用了PDI_productGetHwidInfoByChip函数（但目前来说很多不太好确定是谁）或者把这个函数直接返回0（采用这种方式）

把PDI_productGetHwidInfoByChip函数patch为：

```asm
MOV.W R0, #0				
BX LR
```

上面的两段汇编相当于return 0，改完后PDI_productGetHwidInfoByChip函数是这样的，直接返回0了

![image-20211114171554787](https://i.loli.net/2021/11/14/zxZNJnMl9uhOavQ.png)

改完后输出了很多的信息，但是在PDI_getChipInfo处卡住了

![image-20211114171819893](https://i.loli.net/2021/11/14/uRz1AE7LjeZSmrW.png)

同样先grep，发现这个函数同样是在这个libpdi.so动态链接库中的，反汇编发现也是卡在了一个while(1)的死循环地方

![image-20211114171959990](https://i.loli.net/2021/11/14/48LklJQ7CEBr3Ds.png)

查看它的调用，还是太多了，因此继续改，不过跟上面有点区别

修改内容：

```asm
CBZ R0, loc_78C1C 修改为了B loc_78C1C
MOV.W R0, #0xFFFFFFFF 修改为了MOV.W R0, #0
```

![image-20211114172443175](https://i.loli.net/2021/11/14/nw9maAoh3G7OD5b.png)

改完后反汇编ok

![image-20211114172334752](https://i.loli.net/2021/11/14/W7BshL8mxprHGuS.png)

输出的信息又多了一倍，卡在了函数PDI_productGetInfo处

![image-20211114172553762](https://i.loli.net/2021/11/14/OnLqWuMbSdyhJow.png)

又是这种死循环，出错函数是PDI_productGetInfo

![image-20211114172911172](https://i.loli.net/2021/11/14/jZsDyaKhSNmeL3Q.png)

因为函数开头又很多寄存器，其实也可以直接覆盖用我们自己的return 0汇编指令，但最好还是间接，对arm不熟悉还是拿个中间跳板吧

![image-20211114173152700](https://i.loli.net/2021/11/14/nyht2CXPaBMpkd1.png)

修改如下

CBZ R0, loc_78F74 ——>B loc_78F74

MOV.W R0, #0xFFFFFFFF ---> MOV.W R0, #0

![image-20211114173952907](https://i.loli.net/2021/11/14/4wSZqKmuDGyTg2V.png)

![image-20211114173940671](https://i.loli.net/2021/11/14/jcZA3glotquMwWU.png)

又卡住了，并且输出了上一次改动的地方旁边的信息

![image-20211114174159009](https://i.loli.net/2021/11/14/vNg2I6KhPr7eyUm.png)

卡住的函数为PDI_productGetName，调用成功应该返回0

![image-20211114174319545](https://i.loli.net/2021/11/14/l6yJtKOfS1YZWbQ.png)

同理修改

![image-20211114174645437](https://i.loli.net/2021/11/14/2wMbjzGtiKnsH9C.png)

![image-20211114174657173](https://i.loli.net/2021/11/14/GwPOkrc13VMILzd.png)

提示段错误

![image-20211114174751221](https://i.loli.net/2021/11/14/cjio9SZI3lPmFvt.png)

查看有哪些调用了PDI_productGetName函数，发现挺多的，随便点进去几个看看

![image-20211114180035418](https://i.loli.net/2021/11/14/jtD2KSYd7ozgckT.png)

在PDI_getFaceboardCfg函数里发现原因就是调用PDI_productGetName函数时传进来的参数（作为PDI设备名字的）为空或者非法值导致的崩溃，返回值并没有错应该是0

这个函数可以发现，下面如"SD6C80FA-GNX"、"SD6C82FA-GNX"等为合法的设备名字，如果我们在调用设备的时候给参数赋值为前面合法的值就好啦

![image-20211114175833570](https://i.loli.net/2021/11/14/RFoCSmvx8rf7Wls.png)

同理其他调用者也可能会出现上述错误

![image-20211114180356461](https://i.loli.net/2021/11/14/WlkfCdpNzX1AZn7.png)

在上述libpdi.so几个函数中依然没有找到是谁调用PDI_productGetName函数时产生的错误，因为我搜索最近的输出的信息的字符串并没有，因此推测可能是其他二进制文件调用了此函数产生的报错！去看看，grep找一下是谁，

因此我们换一种角度，可能是别的二进制文件调用了此动态链接库的PDI_productGetName函数，因此去grep一下字符串”Video Server - (C) 2011-2013 ZheJiang Dahua Technology“果然有个sonia

![image-20211114181559702](https://i.loli.net/2021/11/14/s3QmNrznjyYKWxf.png)

找到这段字符串的地址，进去看看调用它的函数

![image-20211114181836068](https://i.loli.net/2021/11/14/draDWGunb9vHsiM.png)

函数sub_9BBA09就是输出蓝绿色字符串信息的函数了，但是它下面并没有调用出错的函数，查看调用它的函数只有sub_9BBAA2调用过它两次

![image-20211114181906342](https://i.loli.net/2021/11/14/XavHeb3l5STEVpw.png)



总启动函数：sub_3B2F8

![image-20211114191306016](https://i.loli.net/2021/11/14/wfmZYVa1bdXhuDO.png)

将出错的函数NOP掉直接乱了，似乎这样并不可取

![image-20211114191405670](https://i.loli.net/2021/11/14/xZq51YumJlKsDbU.png)

但是这样能运行，只不过好像又卡了一个死循环，但这个死循环还没找到是在动态链接库libpdi.so的哪个地方

![image-20211114191515211](https://i.loli.net/2021/11/14/v49hHzdKo3YnxjA.png)

函数PDI_productTypeGet有问题，提示在libpdi.so

![image-20211121162723360](https://i.loli.net/2021/11/21/rJdLCWc6o51SzPI.png)

通过在ida中patch的方式，最后得到下图，段错误

![image-20211121164353338](https://i.loli.net/2021/11/21/eoOuL72wYqyiPsJ.png)

在不断patch后成功到了启动整个固件的中间部分了

![image-20211121164955735](../11.19/picture/11.19.assets/image-20211121164955735.png)

但在ida中只通过patch已经很难到病因了，下面通过gdb的方式，比如对此处地址0x3B41E先断点：

![image-20211121165940798](https://i.loli.net/2021/11/21/MPXaoAUDeNFbdjR.png)

qemu开端口让gdb调试：

```sh
qemu-arm -g 1234 -L . ./bin/sonia
```

启动gdb-multiarch

```sh
gdb-multiarch
set arch arm
set endian little
target remote :1234
```

![image-20211121165440082](https://i.loli.net/2021/11/21/H5ZoCJED8tSgLny.png)

对0x3B41E处断点，断下来了，而且和ida中的一致，说明到这都是ok的

![image-20211121165849651](https://i.loli.net/2021/11/21/Dxc6wMIBC1y8nZE.png)

下一步断这来，也就是0x3B7CE：

![image-20211121170419843](https://i.loli.net/2021/11/21/5yud9jn3s2ICX7c.png)

能够成功断下来，这一块是加载sqlite的，说明也ok，直接c，程序自己断到了0x56aeb0这个地址处

![image-20211121170826730](https://i.loli.net/2021/11/21/zpGdi8YJNgK9Os5.png)

ida查看发现就是当前这个报错的函数

![image-20211121170938112](https://i.loli.net/2021/11/21/6tC3DsdHpxRZuGA.png)

继续往下n或c都百搭，而这个createSystemWrapper是由sub_56ACC0调用，它有一个字符串"watch dog"，怀疑是看门狗玩多了

![image-20211121171258674](https://i.loli.net/2021/11/21/jV2RSNk4miyA8wM.png)

全局看流程图，发现这又是一个非常大量的硬件检测模块函数集合了

![image-20211121171355446](https://i.loli.net/2021/11/21/mTxikM8JwLSjZVn.png)

接下里想如果能直接跳过这一大段检测就好了！







MOV.W R0, #0				
BX LR
<<<<<<< HEAD
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
=======
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
