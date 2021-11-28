#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//libpdi] ASSERT (PDI_productGetHwidInfoByChip|620)
int PDI_productGetHwidInfoByChip(unsigned int a1, int a2) {
    return 0;
}


//[libpdi] ASSERT (PDI_getChipInfo|936) 
int PDI_getChipInfo(char * a1) {
    return 0;
}

//[libpdi] ASSERT (PDI_productGetInfo|1057)
int PDI_productGetInfo(int * a1) {
    return 0;
}

//[libpdi] ASSERT (PDI_productGetName|1104)
int PDI_productGetName(char * a1) {
    strcpy(a1, "IPC-TD15");
    return 0;
}

int PDI_productTypeGet(int * a1) {
    return 0;
}

int PDI_getStartUpFlag() {
    return 0;
}
