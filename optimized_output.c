#include <stdio.h>
#include <stdlib.h>
#include <math.h>
int main() {
    int x = 10;
    int y = 20;
    int unusedVar = 50;
    if (x) {
        printf("x is true\n");
    }
    if (!y) {
        printf("y is false\n");
    }
    while (x) {
        printf("Still true\n");
        break;
    }
    int result = x + y;
    printf("Result: %d\n", result);
    return 0;
}