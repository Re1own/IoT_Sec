## 大华固件Patch

函数PDI_productTypeGet有问题，提示在libpdi.so

![image-20211121162723360](https://i.loli.net/2021/11/21/rJdLCWc6o51SzPI.png)

通过在ida中patch的方式，最后得到下图，段错误

![image-20211121164353338](https://i.loli.net/2021/11/21/eoOuL72wYqyiPsJ.png)

在不断patch后成功到了启动整个固件的中间部分了

![image-20211121164955735](picture/11.19.assets/image-20211121164955735.png)

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
=======
=======
>>>>>>> 0505b64c38087f21190a92fc914cae0b88619cfc
## 大华固件Patch

函数PDI_productTypeGet有问题，提示在libpdi.so

![image-20211121162723360](https://i.loli.net/2021/11/21/rJdLCWc6o51SzPI.png)

通过在ida中patch的方式，最后得到下图，段错误

![image-20211121164353338](https://i.loli.net/2021/11/21/eoOuL72wYqyiPsJ.png)

在不断patch后成功到了启动整个固件的中间部分了

![image-20211121164955735](picture/11.19.assets/image-20211121164955735.png)

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
