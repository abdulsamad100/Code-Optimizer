# Code Optimizer

**Code Optimizer** is a Node.js CLI tool that removes comments, trims whitespace, and formats source code for better readability. It supports C, C++, Java, and Python source files, mimicking the basic formatting you'd get by pressing `Alt + Shift + F` in VSCode.

## 🚀 Features

- Removes single-line (`//`, `#`) and multi-line (`/* */`, `''' '''`, ``) comments
- Trims unnecessary whitespaces and blank lines
- Splits multiple statements written on a single line
- Auto-formats code with consistent indentation (basic formatting)
- Supports `.c`, `.cpp`, `.java`, and `.py` files

## 📁 Folder Structure

```
Code-Optimizer/
├── input.c               # Input file (can be .cpp, .java, or .py)
├── optimized_output.c    # Output file (same extension as input)
├── optimizer.js          # Main script
├── package.json          # Project metadata
└── README.md             # Documentation
```

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdulsamad100/Code-Optimizer.git
   cd Code-Optimizer
   ```

2. Install dependencies (if any):
   ```bash
   npm install
   ```

## 🛠️ Usage

1. Edit or place your source file as `input.c` (or `.cpp`, `.java`, `.py`).
2. Run the script:
   ```bash
   node optimizer.js
   ```

3. Optimized code will be saved in `optimized_output.c` (or the respective file type).

4. Console output will include:
   - Original vs optimized line count
   - Number of single-line and multi-line comments removed
   - A preview of the formatted code

## ✅ Example

**input.c**
```c
#include <stdio.h> // Standard I/O

int main() {
    int a = 10; int b = 20; // declaring vars
    printf("Sum: %d", a + b); /* Print result */
    return 0;
}
```

**optimized_output.c**
```c
#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    printf("Sum: %d", a + b);
    return 0;
}
```

## 📌 Notes

- Ensure the input file extension is correct (`.c`, `.cpp`, `.java`, `.py`)
- Currently provides basic formatting, not full AST-based reformatting
- Designed for small educational or utility tasks

## 🤝 Contributing

Pull requests are welcome! Feel free to fork the repo and submit improvements.

## 📄 License

This project is licensed under the MIT License.