#include <stdio.h>
#include <stdlib.h>
#include <math.h> // unused include

// This is a single-line comment

/*
 This is a
 multi-line comment
*/

int main() {
    int x = 10;
    int y = 20;
    int unusedVar = 50;

    if (x == true) {
        printf("x is true\n");
    }

    if (y == false) {
        printf("y is false\n");
    }

    while (x == true) {
        printf("Still true\n");
        break;
    }

    int result = x + y;
    printf("Result: %d\n", result);

    return 0;
}
