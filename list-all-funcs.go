package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
)

func main() {
  if len(os.Args) < 2 {
    fmt.Println("Usage: go run main.go <root_path>")
    os.Exit(1)
  }

  root := os.Args[1]
  fileSet := token.NewFileSet()

  err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
    if err != nil || filepath.Ext(path) != ".go" {
      return nil
    }

    node, err := parser.ParseFile(fileSet, path, nil, parser.AllErrors)
    if err != nil {
      return nil
    }

    for _, decl := range node.Decls {
      if funcDecl, ok := decl.(*ast.FuncDecl); ok {
        var structName string

        if funcDecl.Recv != nil && len(funcDecl.Recv.List) > 0 {
          recvType := funcDecl.Recv.List[0].Type
          switch t := recvType.(type) {
          case *ast.StarExpr:
            if ident, ok := t.X.(*ast.Ident); ok {
              structName = ident.Name
            }
          case *ast.Ident:
            structName = t.Name
          }
        }

        if structName != "" {
          fmt.Printf("func (%s) %s(", structName, funcDecl.Name.Name)
        } else {
          fmt.Printf("func %s(", funcDecl.Name.Name)
        }

        for i, param := range funcDecl.Type.Params.List {
          if i > 0 {
            fmt.Print(", ")
          }
          paramNames := []string{}
          for _, name := range param.Names {
            paramNames = append(paramNames, name.Name)
          }
          fmt.Printf("%s %s", strings.Join(paramNames, ", "), exprToString(param.Type))
        }
        fmt.Println(")")
      }
    }
    return nil
  })

  if err != nil {
    fmt.Println("Error:", err)
  }
}

func exprToString(expr ast.Expr) string {
  switch t := expr.(type) {
  case *ast.Ident:
    return t.Name
  case *ast.StarExpr:
    return "*" + exprToString(t.X)
  case *ast.ArrayType:
    return "[]" + exprToString(t.Elt)
  case *ast.SelectorExpr:
    return exprToString(t.X) + "." + t.Sel.Name
  default:
    return fmt.Sprintf("%T", expr)
  }
}
